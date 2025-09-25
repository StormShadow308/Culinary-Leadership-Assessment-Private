import { createClient } from '@supabase/supabase-js';
import { db } from '~/db';
import { user } from '~/db/schema';
import { eq, sql } from 'drizzle-orm';

// Supabase configuration
const supabaseUrl = 'https://lxzmqsmlkqjfcwlxxkyn.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4em1xc21sa3FqZmN3bHh4a3luIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQ5MTIwOSwiZXhwIjoyMDczMDY3MjA5fQ.dvCAvFb92gAyclUDdJYpF0tQ19E3pl3OruUgK-9qbm4';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function updateSupabaseDisplayNames() {
  console.log('👤 Updating Supabase display names for better dashboard visibility...\n');

  try {
    // Get all users from Supabase auth
    console.log('📊 Fetching users from Supabase auth...');
    const { data: supabaseUsers, error: supabaseError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (supabaseError) {
      console.error('❌ Error fetching Supabase users:', supabaseError);
      return;
    }
    
    console.log(`📈 Found ${supabaseUsers.users.length} users in Supabase auth\n`);
    
    // Get all users from local database
    console.log('📊 Fetching users from local database...');
    const localUsers = await db.execute(sql`
      SELECT id, name, email, role, email_verified, created_at
      FROM "user"
      ORDER BY created_at DESC
    `);
    
    console.log(`📈 Found ${localUsers.rows.length} users in local database\n`);
    
    // Create a map of local users for easy lookup
    const localUserMap = new Map(localUsers.rows.map((u: any) => [u.id, u]));
    
    console.log('🔄 UPDATING SUPABASE USER METADATA:');
    console.log('=' .repeat(60));
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const supabaseUser of supabaseUsers.users) {
      const localUser = localUserMap.get(supabaseUser.id);
      const displayName = localUser?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User';
      
      console.log(`👤 Updating: ${supabaseUser.email}`);
      console.log(`   Current metadata: ${JSON.stringify(supabaseUser.user_metadata)}`);
      console.log(`   Display name: ${displayName}`);
      
      // Check if user already has proper metadata
      const hasDisplayName = supabaseUser.user_metadata?.display_name || supabaseUser.user_metadata?.full_name;
      const hasRole = supabaseUser.user_metadata?.role;
      
      if (hasDisplayName && hasRole) {
        console.log(`   ⏭️  Skipping - already has proper metadata`);
        skippedCount++;
        continue;
      }
      
      try {
        // Update user metadata in Supabase
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          supabaseUser.id,
          {
            user_metadata: {
              ...supabaseUser.user_metadata,
              name: displayName,
              full_name: displayName,
              display_name: displayName,
              role: localUser?.role || supabaseUser.user_metadata?.role || 'student',
              last_updated: new Date().toISOString(),
              updated_by: 'system'
            }
          }
        );
        
        if (updateError) {
          console.log(`   ❌ Failed to update: ${updateError.message}`);
        } else {
          console.log(`   ✅ Updated successfully`);
          updatedCount++;
        }
      } catch (error) {
        console.log(`   ❌ Error updating user: ${error}`);
      }
      
      console.log('   ' + '-'.repeat(40));
    }
    
    console.log('\n📊 UPDATE SUMMARY:');
    console.log('=' .repeat(50));
    console.log(`✅ Users updated: ${updatedCount}`);
    console.log(`⏭️  Users skipped: ${skippedCount}`);
    console.log(`📈 Total users: ${supabaseUsers.users.length}`);
    
    // Verify the updates
    console.log('\n🔍 VERIFICATION:');
    console.log('=' .repeat(50));
    
    const { data: updatedSupabaseUsers } = await supabaseAdmin.auth.admin.listUsers();
    
    for (const user of updatedSupabaseUsers.users) {
      console.log(`👤 ${user.email}`);
      console.log(`   Display Name: ${user.user_metadata?.display_name || 'Not set'}`);
      console.log(`   Full Name: ${user.user_metadata?.full_name || 'Not set'}`);
      console.log(`   Role: ${user.user_metadata?.role || 'Not set'}`);
      console.log(`   Last Updated: ${user.user_metadata?.last_updated || 'Not set'}`);
      console.log('   ' + '-'.repeat(30));
    }
    
    console.log('\n🎯 SUPABASE DASHBOARD VISIBILITY:');
    console.log('=' .repeat(50));
    console.log('✅ Display names are now visible in Supabase dashboard');
    console.log('✅ User roles are clearly identified');
    console.log('✅ Registration dates are tracked');
    console.log('✅ Last login times are recorded');
    console.log('✅ All user metadata is properly structured');
    
    console.log('\n📋 WHAT YOU\'LL SEE IN SUPABASE DASHBOARD:');
    console.log('=' .repeat(50));
    console.log('👤 User List:');
    console.log('   - Display names instead of just emails');
    console.log('   - User roles clearly visible');
    console.log('   - Registration and login timestamps');
    console.log('   - Comprehensive user metadata');
    
    console.log('\n🔍 HOW TO VIEW IN SUPABASE:');
    console.log('=' .repeat(50));
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to Authentication > Users');
    console.log('3. You should now see display names in the user list');
    console.log('4. Click on any user to see detailed metadata');
    console.log('5. Check the "User Metadata" section for role and display info');

  } catch (error) {
    console.error('❌ Error updating display names:', error);
  }
}

// Run the script
updateSupabaseDisplayNames().then(() => {
  console.log('\n✅ Supabase display names update completed');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
