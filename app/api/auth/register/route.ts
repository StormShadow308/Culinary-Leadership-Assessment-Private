import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { user as userSchema, participants, cohorts } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { generateAndSendPasscode } from '~/lib/passcode-service';
import { SyncService } from '~/lib/sync-service';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Registration request received');

    const { email, password, name, role = 'student' } = await request.json();
    console.log('📝 Registration data:', { email, name, role });

    if (!email || !password || !name) {
      console.log('❌ Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate role
    if (!['student', 'organization', 'admin'].includes(role)) {
      console.log('❌ Invalid role:', role);
      return NextResponse.json({ error: 'Invalid role specified' }, { status: 400 });
    }

    // Create Supabase admin client for user creation
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('🔍 Checking for existing user with email:', email);

    // Check if user already exists in local database
    const existingUser = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      console.log('❌ User already exists in local database:', email);
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Also check if user exists in Supabase (in case of incomplete deletion)
    console.log('🔍 Checking Supabase for orphaned user...');
    try {
      // Use listUsers and filter by email since getUserByEmail doesn't exist
      const { data: supabaseUsers, error: supabaseCheckError } = await supabase.auth.admin.listUsers();
      
      if (supabaseCheckError) {
        console.error('❌ Error checking Supabase users:', supabaseCheckError);
        return NextResponse.json({ 
          error: 'Unable to verify user status. Please try again later.',
          details: supabaseCheckError.message 
        }, { status: 500 });
      } 
      
      // Find user by email in the list
      const supabaseUser = supabaseUsers.users.find(user => user.email === email);
      
      if (supabaseUser) {
        console.log('⚠️ User exists in Supabase but not in local database - cleaning up orphaned user...');
        
        // User exists in Supabase but not locally, delete from Supabase first
        const { error: cleanupError } = await supabase.auth.admin.deleteUser(supabaseUser.id);
        if (cleanupError) {
          console.error('❌ Error cleaning up orphaned Supabase user:', cleanupError);
          return NextResponse.json({ 
            error: 'User exists in system but cannot be cleaned up. Please contact support.',
            details: cleanupError.message 
          }, { status: 400 });
        } else {
          console.log('✅ Successfully cleaned up orphaned Supabase user');
        }
      } else {
        console.log('✅ No existing user found in Supabase');
      }
    } catch (supabaseCheckError) {
      console.error('❌ Supabase check failed:', supabaseCheckError);
      return NextResponse.json({ 
        error: 'Unable to verify user status. Please try again later.',
        details: supabaseCheckError instanceof Error ? supabaseCheckError.message : 'Unknown error'
      }, { status: 500 });
    }

    // Create user in Supabase using admin API to avoid email confirmation
    console.log('🔐 Creating user in Supabase...');
    const { data: supabaseData, error: supabaseError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Don't send Supabase confirmation email
      user_metadata: {
        name: name,
        full_name: name,
        display_name: name,
        role: role,
        registration_date: new Date().toISOString(),
        registration_source: 'web_app'
      }
    });

    if (supabaseError) {
      console.error('❌ Supabase user creation error:', supabaseError);
      
      // Handle specific Supabase errors
      if (supabaseError.message.includes('already registered') || 
          supabaseError.message.includes('User already registered')) {
        console.log('⚠️ User already exists in Supabase - this should have been caught earlier');
        return NextResponse.json({ 
          error: 'User already exists. Please try signing in instead.',
          code: 'USER_ALREADY_EXISTS'
        }, { status: 400 });
      }
      
      return NextResponse.json({ 
        error: 'Failed to create user account',
        details: supabaseError.message 
      }, { status: 400 });
    }

    if (!supabaseData.user) {
      console.log('❌ Supabase user creation returned no user data');
      return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });
    }

    console.log('✅ User successfully created in Supabase:', supabaseData.user.id);

    // Generate passcode for email verification
    const passcodeResult = await generateAndSendPasscode({
      email: email,
      type: 'registration'
    });

    if (!passcodeResult.success) {
      console.error('Passcode generation error:', passcodeResult.error);
      return NextResponse.json({ 
        error: 'Failed to send verification code. Please try again.',
        details: passcodeResult.error 
      }, { status: 500 });
    }

    // Create user in local database
    try {
      await db.insert(userSchema).values({
        id: supabaseData.user.id,
        email: supabaseData.user.email!,
        name: name,
        emailVerified: supabaseData.user.email_confirmed_at ? true : false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Set role using raw SQL
      await db.execute(`UPDATE "user" SET role = '${role}' WHERE email = '${email}'`);

      // If user is a student, create a participant record and assign to default organization
      if (role === 'student') {
        console.log('🎓 Creating participant record for student...');
        
        // Get the default cohort for the default organization
        const defaultCohort = await db
          .select()
          .from(cohorts)
          .where(eq(cohorts.organizationId, 'org_default_students'))
          .limit(1);

        if (defaultCohort.length > 0) {
          // Create participant record
          await db.insert(participants).values({
            email: email,
            fullName: name,
            organizationId: 'org_default_students',
            cohortId: defaultCohort[0].id,
            stayOut: 'Stay',
            createdAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString()
          });
          
          console.log('✅ Participant record created for student:', email);
        } else {
          console.warn('⚠️ Default cohort not found, participant record not created');
        }
      }

      // Passcode already sent above, no need for additional email sending

      console.log('✅ User created successfully in both Supabase and database');
      console.log('👤 User:', email, 'Role:', role);

      // Validate sync after user creation
      console.log('🔍 Validating sync after user creation...');
      try {
        const syncValidation = await SyncService.validateDataIntegrity();
        if (!syncValidation.isValid) {
          console.warn('⚠️ Data integrity issues detected after user creation:', syncValidation.issues);
          // Don't fail registration, but log the issues
        } else {
          console.log('✅ Data integrity validated - systems are in sync');
        }
      } catch (syncError) {
        console.warn('⚠️ Sync validation failed after user creation:', syncError);
        // Don't fail registration, but log the sync error
      }

      return NextResponse.json({ 
        success: true, 
        user: {
          id: supabaseData.user.id,
          email: supabaseData.user.email,
          name: name,
          role: role,
          emailConfirmed: false // Will be confirmed after passcode verification
        },
        message: 'User created successfully. Please check your email for the verification code.',
        requiresVerification: true
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // If database insert fails, we should clean up the Supabase user
      // Note: In production, you might want to implement a cleanup mechanism
      console.error('⚠️ User created in Supabase but failed to sync to database');
      
      return NextResponse.json({ 
        error: 'User created but database sync failed',
        partialSuccess: true 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
