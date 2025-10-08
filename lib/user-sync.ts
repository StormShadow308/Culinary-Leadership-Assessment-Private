import { createClient } from './supabase-server';
import { db } from '../db';
import { user as userSchema } from '~/db/schema';
import { eq } from 'drizzle-orm';

export async function syncUserFromSupabase(supabaseUser: unknown) {
  try {
    if (!supabaseUser || typeof supabaseUser !== 'object') {
      return;
    }

    const userData = supabaseUser as {
      id: string;
      email: string;
      user_metadata?: { name?: string };
      email_confirmed_at?: string;
      created_at: string;
    };

    // Check if user already exists in local database
    const existingUser = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.email, userData.email))
      .limit(1);

    if (existingUser.length === 0) {
      // Create new user in local database
      await db.insert(userSchema).values({
        id: userData.id,
        email: userData.email,
        name: userData.user_metadata?.name || userData.email,
        emailVerified: userData.email_confirmed_at ? true : false,
        createdAt: new Date(userData.created_at),
        updatedAt: new Date(),
      });
      
      // Set default role for new users using raw SQL
      try {
        await db.execute(`UPDATE "user" SET role = 'student' WHERE email = '${userData.email}'`);
      } catch (roleError) {
        console.error('Failed to set default role:', roleError);
        // Continue even if role setting fails
      }
    } else {
      // Update existing user
      await db
        .update(userSchema)
        .set({
          emailVerified: userData.email_confirmed_at ? true : false,
          updatedAt: new Date(),
        })
        .where(eq(userSchema.email, userData.email));
    }
  } catch (error) {
    console.error('Error syncing user from Supabase:', error);
  }
}


export async function getCurrentUser() {
  try {
    console.log('🔍 getCurrentUser: Creating Supabase client...');
    const supabase = await createClient();
    console.log('🔍 getCurrentUser: Getting user from Supabase...');
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
    
    console.log('🔍 getCurrentUser: Supabase response:', { 
      hasUser: !!supabaseUser, 
      error: error?.message,
      userEmail: supabaseUser?.email 
    });
    
    if (error) {
      console.log('❌ getCurrentUser: Supabase error:', error);
      return null;
    }
    
    if (!supabaseUser) {
      console.log('❌ getCurrentUser: No Supabase user found');
      return null;
    }

    console.log('✅ getCurrentUser: Supabase user found, syncing to local database...');
    // Sync user to local database
    await syncUserFromSupabase(supabaseUser);

    console.log('🔍 getCurrentUser: Getting user from local database...');
    // Get user from local database
    const localUser = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.email, supabaseUser.email))
      .limit(1);

    console.log('🔍 getCurrentUser: Local user result:', localUser[0] ? {
      id: localUser[0].id,
      email: localUser[0].email,
      role: localUser[0].role
    } : 'null');

    return localUser[0] || null;
  } catch (error) {
    console.error('❌ getCurrentUser: Error:', error);
    return null;
  }
}
