import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { user as userSchema } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { checkRateLimit } from '~/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = checkRateLimit(request, 'AUTH');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimit.resetTime ? Math.ceil((rateLimit.resetTime - Date.now()) / 1000) : 900
        }, 
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimit.resetTime ? Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString() : '900',
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime?.toString() || ''
          }
        }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      }
    );

    // First authenticate with Supabase
    const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (supabaseError) {
      console.error('Supabase login error:', supabaseError);
      return NextResponse.json({ error: 'Invalid login credentials' }, { status: 401 });
    }

    if (!supabaseData.user) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    // Now check if user exists in local database, if not create them
    let localUser = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.email, email))
      .limit(1);

    if (localUser.length === 0) {
      // Update Supabase user metadata with display name if not set
      const displayName = supabaseData.user.user_metadata?.name || supabaseData.user.email?.split('@')[0] || 'User';
      
      // Update user metadata in Supabase to ensure display name is visible in dashboard
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        supabaseData.user.id,
        {
          user_metadata: {
            ...supabaseData.user.user_metadata,
            name: displayName,
            full_name: displayName,
            display_name: displayName,
            last_login: new Date().toISOString()
          }
        }
      );

      if (updateError) {
        console.error('Failed to update user metadata in Supabase:', updateError);
      } else {
        console.log('✅ Updated user metadata in Supabase:', displayName);
      }

      // Create user in local database from Supabase data
      const { data: newUser, error: createError } = await db
        .insert(userSchema)
        .values({
          id: supabaseData.user.id,
          name: displayName,
          email: supabaseData.user.email!,
          role: supabaseData.user.user_metadata?.role || 'student',
          emailVerified: !!supabaseData.user.email_confirmed_at,
          organizationId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      if (createError) {
        console.error('Failed to create user in local database:', createError);
        return NextResponse.json({ error: 'Failed to create user record' }, { status: 500 });
      }

      localUser = newUser;
      console.log('✅ Created new user in local database:', email);
    }

    console.log('✅ Login successful for:', email);
    console.log('👤 User role:', localUser[0]?.role || 'unknown');

    return NextResponse.json({ 
      success: true, 
      user: {
        id: supabaseData.user.id,
        email: supabaseData.user.email,
        name: localUser[0].name,
        role: localUser[0].role || 'student',
        emailConfirmed: !!supabaseData.user.email_confirmed_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
