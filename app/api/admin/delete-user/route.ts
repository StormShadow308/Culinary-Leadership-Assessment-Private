import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { user, member } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';

export async function DELETE(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Prevent deletion of admin users
    const userToDelete = await db.select().from(user).where(eq(user.id, userId)).limit(1);
    if (userToDelete.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (userToDelete[0].role === 'admin') {
      return NextResponse.json({ error: 'Cannot delete admin users' }, { status: 400 });
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

    // Delete user from both Supabase and local database
    try {
      // First delete from Supabase auth
      const { error: supabaseError } = await supabase.auth.admin.deleteUser(userId);
      if (supabaseError) {
        console.error('Error deleting user from Supabase:', supabaseError);
        // Continue with local deletion even if Supabase deletion fails
      } else {
        console.log('✅ User deleted from Supabase auth:', userId);
      }

      // Then delete from local database and all related data in a transaction
      await db.transaction(async (tx) => {
        // Delete memberships
        await tx.delete(member).where(eq(member.userId, userId));
        
        // Delete user
        await tx.delete(user).where(eq(user.id, userId));
      });

      console.log('✅ User deleted from local database:', userId);
      return NextResponse.json({ success: true });

    } catch (deleteError) {
      console.error('Error during user deletion:', deleteError);
      return NextResponse.json({ 
        error: 'Failed to delete user completely',
        details: deleteError instanceof Error ? deleteError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
