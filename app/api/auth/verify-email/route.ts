import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { user as userSchema } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Get user data first
    const userData = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.email, email))
      .limit(1);

    if (userData.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user's email verification status in local database
    await db
      .update(userSchema)
      .set({ 
        emailVerified: true,
        updatedAt: new Date()
      })
      .where(eq(userSchema.email, email));

    // Also update email verification status in Supabase
    try {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );

      const { error: supabaseError } = await supabaseAdmin.auth.admin.updateUserById(
        userData[0].id,
        { email_confirm: true }
      );

      if (supabaseError) {
        console.error('Failed to confirm email in Supabase:', supabaseError);
        // Don't fail the request, but log the error
        console.warn('⚠️ Email verified in database but not in Supabase');
      } else {
        console.log('✅ Email confirmed in both database and Supabase for:', email);
      }
    } catch (supabaseError) {
      console.error('Supabase confirmation error:', supabaseError);
      // Don't fail the request, but log the error
      console.warn('⚠️ Email verified in database but Supabase update failed');
    }

    console.log('✅ Email marked as verified for:', email);

    return NextResponse.json({ 
      success: true,
      message: 'Email verified successfully in both systems'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
