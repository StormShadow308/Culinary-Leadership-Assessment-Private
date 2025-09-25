import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { db } from '~/db';
import { user as userSchema } from '~/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { password, email } = await request.json();

    if (!password || !email) {
      return NextResponse.json({ error: 'Password and email are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    // Create Supabase admin client
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

    // Get user from local database
    const localUser = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.email, email))
      .limit(1);

    if (localUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update password in Supabase using admin API
    const { data, error } = await supabase.auth.admin.updateUserById(localUser[0].id, {
      password: password
    });

    if (error) {
      console.error('Password update error:', error);
      return NextResponse.json({ error: 'Failed to update password' }, { status: 400 });
    }

    console.log('✅ Password updated successfully for user:', email);

    return NextResponse.json({ 
      success: true,
      message: 'Password has been updated successfully. You can now sign in with your new password.'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
