import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { user as userSchema } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { generateAndSendPasscode } from '~/lib/passcode-service';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role = 'student' } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

    // Check if user already exists in local database
    const existingUser = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create user in Supabase using admin API to avoid email confirmation
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
      console.error('Supabase user creation error:', supabaseError);
      return NextResponse.json({ error: supabaseError.message }, { status: 400 });
    }

    if (!supabaseData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });
    }

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

      // Passcode already sent above, no need for additional email sending

      console.log('✅ User created successfully in both Supabase and database');
      console.log('👤 User:', email, 'Role:', role);

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
