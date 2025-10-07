import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { user } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    console.log('🔍 Debug: Checking user existence for email:', email);

    // Check local database
    const localUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    // Check Supabase
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

    // Use listUsers and filter by email since getUserByEmail doesn't exist
    const { data: supabaseUsers, error: supabaseError } = await supabase.auth.admin.listUsers();
    const supabaseUser = supabaseUsers?.users.find(user => user.email === email);

    const result = {
      email,
      localDatabase: {
        exists: localUser.length > 0,
        user: localUser[0] || null
      },
      supabase: {
        exists: !supabaseError && supabaseUser ? true : false,
        user: supabaseUser || null,
        error: supabaseError?.message || null
      },
      status: {
        orphaned: localUser.length === 0 && !supabaseError && supabaseUser,
        clean: localUser.length === 0 && (supabaseError?.message === 'User not found' || !supabaseUser),
        synced: localUser.length > 0 && !supabaseError && supabaseUser,
        localOnly: localUser.length > 0 && (supabaseError?.message === 'User not found' || !supabaseUser)
      }
    };

    console.log('🔍 Debug result:', result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Debug error:', error);
    return NextResponse.json({ 
      error: 'Debug check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
