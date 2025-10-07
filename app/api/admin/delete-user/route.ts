import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { 
  user, 
  member, 
  session, 
  account, 
  invitation, 
  participants, 
  attempts, 
  responses,
  passcodes
} from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';
import { SyncService } from '~/lib/sync-service';

export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ Starting comprehensive user deletion process...');
    
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      console.log('❌ Unauthorized: User is not admin');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId } = await request.json();

    if (!userId) {
      console.log('❌ Missing user ID');
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    console.log('🔍 Fetching user details for deletion:', userId);

    // Get user details before deletion
    const userToDelete = await db.select().from(user).where(eq(user.id, userId)).limit(1);
    if (userToDelete.length === 0) {
      console.log('❌ User not found in local database');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userEmail = userToDelete[0].email;
    const userRole = userToDelete[0].role;

    if (userRole === 'admin') {
      console.log('❌ Cannot delete admin users');
      return NextResponse.json({ error: 'Cannot delete admin users' }, { status: 400 });
    }

    console.log('👤 User to delete:', { id: userId, email: userEmail, role: userRole });

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

    // Comprehensive deletion process
    try {
      console.log('🔐 Step 1: Deleting user from Supabase auth...');
      
      // First delete from Supabase auth
      const { error: supabaseError } = await supabase.auth.admin.deleteUser(userId);
      if (supabaseError) {
        console.error('❌ Error deleting user from Supabase:', supabaseError);
        // Continue with local deletion even if Supabase deletion fails
        console.log('⚠️ Continuing with local database cleanup despite Supabase error...');
      } else {
        console.log('✅ User successfully deleted from Supabase auth');
      }

      console.log('🗄️ Step 2: Starting comprehensive local database cleanup...');

      // Comprehensive local database cleanup in a transaction
      await db.transaction(async (tx) => {
        console.log('📊 Step 2a: Finding all participants for this user...');
        
        // Find all participants associated with this user's email
        const userParticipants = await tx.select({ id: participants.id })
          .from(participants)
          .where(eq(participants.email, userEmail));

        console.log(`📊 Found ${userParticipants.length} participants for user email: ${userEmail}`);

        if (userParticipants.length > 0) {
          console.log('🗑️ Step 2b: Deleting all responses for user participants...');
          
          // Delete all responses for attempts by this user's participants
          for (const participant of userParticipants) {
            const participantAttempts = await tx.select({ id: attempts.id })
              .from(attempts)
              .where(eq(attempts.participantId, participant.id));
            
            console.log(`📊 Found ${participantAttempts.length} attempts for participant ${participant.id}`);
            
            for (const attempt of participantAttempts) {
              const deletedResponses = await tx.delete(responses)
                .where(eq(responses.attemptId, attempt.id))
                .returning({ id: responses.id });
              console.log(`🗑️ Deleted ${deletedResponses.length} responses for attempt ${attempt.id}`);
            }
          }

          console.log('🗑️ Step 2c: Deleting all attempts for user participants...');
          
          // Delete all attempts for this user's participants
          for (const participant of userParticipants) {
            const deletedAttempts = await tx.delete(attempts)
              .where(eq(attempts.participantId, participant.id))
              .returning({ id: attempts.id });
            console.log(`🗑️ Deleted ${deletedAttempts.length} attempts for participant ${participant.id}`);
          }

          console.log('🗑️ Step 2d: Deleting all participants for this user...');
          
          // Delete all participants for this user
          const deletedParticipants = await tx.delete(participants)
            .where(eq(participants.email, userEmail))
            .returning({ id: participants.id });
          console.log(`🗑️ Deleted ${deletedParticipants.length} participants for user email: ${userEmail}`);
        }

        console.log('🗑️ Step 2e: Deleting all invitations sent by this user...');
        
        // Delete invitations sent by this user
        const deletedInvitations = await tx.delete(invitation)
          .where(eq(invitation.inviterId, userId))
          .returning({ id: invitation.id });
        console.log(`🗑️ Deleted ${deletedInvitations.length} invitations sent by user`);

        console.log('🗑️ Step 2f: Deleting all user sessions...');
        
        // Delete user sessions
        const deletedSessions = await tx.delete(session)
          .where(eq(session.userId, userId))
          .returning({ id: session.id });
        console.log(`🗑️ Deleted ${deletedSessions.length} user sessions`);

        console.log('🗑️ Step 2g: Deleting all user accounts...');
        
        // Delete user accounts
        const deletedAccounts = await tx.delete(account)
          .where(eq(account.userId, userId))
          .returning({ id: account.id });
        console.log(`🗑️ Deleted ${deletedAccounts.length} user accounts`);

        console.log('🗑️ Step 2h: Deleting all passcodes for this user...');
        
        // Delete passcodes for this user
        const deletedPasscodes = await tx.delete(passcodes)
          .where(eq(passcodes.email, userEmail))
          .returning({ id: passcodes.id });
        console.log(`🗑️ Deleted ${deletedPasscodes.length} passcodes for user email: ${userEmail}`);

        console.log('🗑️ Step 2i: Deleting all organization memberships...');
        
        // Delete memberships
        const deletedMemberships = await tx.delete(member)
          .where(eq(member.userId, userId))
          .returning({ id: member.id });
        console.log(`🗑️ Deleted ${deletedMemberships.length} organization memberships`);
        
        console.log('🗑️ Step 2j: Finally deleting the user record...');
        
        // Finally, delete the user
        const deletedUsers = await tx.delete(user)
          .where(eq(user.id, userId))
          .returning({ id: user.id, email: user.email });
        console.log(`🗑️ Deleted user: ${deletedUsers[0]?.email || 'unknown'}`);
      });

      console.log('✅ Comprehensive user deletion completed successfully!');
      console.log('📊 Summary of deleted data:');
      console.log(`   - User: ${userEmail}`);
      console.log(`   - All related participants, attempts, responses`);
      console.log(`   - All sessions, accounts, memberships`);
      console.log(`   - All invitations sent by user`);
      console.log(`   - All passcodes for user email`);

      // Validate sync after user deletion
      console.log('🔍 Validating sync after user deletion...');
      try {
        const syncValidation = await SyncService.validateDataIntegrity();
        if (!syncValidation.isValid) {
          console.warn('⚠️ Data integrity issues detected after user deletion:', syncValidation.issues);
          // Don't fail deletion, but log the issues
        } else {
          console.log('✅ Data integrity validated - systems are in sync');
        }
      } catch (syncError) {
        console.warn('⚠️ Sync validation failed after user deletion:', syncError);
        // Don't fail deletion, but log the sync error
      }

      return NextResponse.json({ 
        success: true,
        message: 'User and all related data deleted successfully',
        deletedUser: {
          id: userId,
          email: userEmail,
          role: userRole
        }
      });

    } catch (deleteError) {
      console.error('❌ Error during comprehensive user deletion:', deleteError);
      console.error('❌ Error details:', {
        message: deleteError instanceof Error ? deleteError.message : 'Unknown error',
        stack: deleteError instanceof Error ? deleteError.stack : undefined,
        name: deleteError instanceof Error ? deleteError.name : undefined
      });
      
      return NextResponse.json({ 
        error: 'Failed to delete user completely',
        details: deleteError instanceof Error ? deleteError.message : 'Unknown error',
        userEmail: userEmail
      }, { status: 500 });
    }
  } catch (error) {
    console.error('❌ Fatal error in user deletion process:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
