import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { getCurrentUser } from '~/lib/user-sync';
import { sql } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';

export async function PUT(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id, name, email, role } = await request.json();

    if (!id || !name || !email || !role) {
      return NextResponse.json({ error: 'ID, name, email, and role are required' }, { status: 400 });
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

    // Update user in both Supabase and local database
    try {
      // First update in Supabase auth
      const { error: supabaseError } = await supabase.auth.admin.updateUserById(id, {
        email: email,
        user_metadata: {
          name: name,
          role: role
        }
      });

      if (supabaseError) {
        console.error('Error updating user in Supabase:', supabaseError);
        // Continue with local update even if Supabase update fails
      } else {
        console.log('✅ User updated in Supabase auth:', id);
      }

      // Then update in local database
      const result = await db.execute(sql`
        UPDATE "user" 
        SET name = ${name}, email = ${email}, role = ${role}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `);

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      console.log('✅ User updated in local database:', id);
      return NextResponse.json({ user: result.rows[0] });

    } catch (updateError) {
      console.error('Error during user update:', updateError);
      return NextResponse.json({ 
        error: 'Failed to update user completely',
        details: updateError instanceof Error ? updateError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
