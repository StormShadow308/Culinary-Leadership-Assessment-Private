import { NextResponse } from 'next/server';
import { db } from '~/db';
import { organization, participants, attempts, cohorts } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq, and, sql } from 'drizzle-orm';

export async function GET() {
  try {
    console.log('🔍 Fetching all clients data...');
    
    // Check if user is admin
    const currentUser = await getCurrentUser();
    console.log('👤 Current user:', currentUser ? { id: currentUser.id, email: currentUser.email, role: currentUser.role } : 'null');
    
    if (!currentUser) {
      console.log('❌ No user found - authentication failed');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    if (currentUser.role !== 'admin') {
      console.log('❌ User is not admin:', currentUser.role);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    console.log('✅ User authorized, fetching organizations...');

    // First, let's try a simple query to get organizations
    const organizations = await db.select().from(organization);
    console.log(`📊 Found ${organizations.length} organizations`);

    // Get all organizations with their participants and attempts
    console.log('🔍 Fetching client data with joins...');
    
    let clientsData;
    try {
      clientsData = await db
        .select({
          organizationId: organization.id,
          organizationName: organization.name,
          organizationSlug: organization.slug,
          cohortId: cohorts.id,
          cohortName: cohorts.name,
          participantId: participants.id,
          participantName: participants.fullName,
          participantEmail: participants.email,
          attemptId: attempts.id,
          attemptType: attempts.type,
          attemptStatus: attempts.status,
          startedAt: attempts.startedAt,
          completedAt: attempts.completedAt,
          reportData: attempts.reportData,
        })
        .from(organization)
        .leftJoin(cohorts, eq(organization.id, cohorts.organizationId))
        .leftJoin(participants, eq(cohorts.id, participants.cohortId))
        .leftJoin(attempts, eq(participants.id, attempts.participantId))
        .orderBy(organization.name, cohorts.name, participants.fullName);
      
      console.log(`📊 Found ${clientsData.length} client data records`);
    } catch (joinError) {
      console.error('❌ Error with complex join query:', joinError);
      // Fallback to simpler approach
      console.log('🔄 Falling back to simpler query approach...');
      
      // Get organizations and cohorts separately
      const orgsWithCohorts = await db
        .select({
          organizationId: organization.id,
          organizationName: organization.name,
          organizationSlug: organization.slug,
          cohortId: cohorts.id,
          cohortName: cohorts.name,
        })
        .from(organization)
        .leftJoin(cohorts, eq(organization.id, cohorts.organizationId));
      
      console.log(`📊 Found ${orgsWithCohorts.length} organization-cohort combinations`);
      
      // For now, return a simplified structure
      const simplifiedData = orgsWithCohorts.map((row, index) => ({
        organizationId: row.organizationId,
        organizationName: row.organizationName,
        organizationSlug: row.organizationSlug,
        cohortId: row.cohortId,
        cohortName: row.cohortName,
        participantId: null,
        participantName: null,
        participantEmail: null,
        attemptId: null,
        attemptType: null,
        attemptStatus: null,
        startedAt: null,
        completedAt: null,
        reportData: null,
      }));
      
      clientsData = simplifiedData;
    }

    // Process the data to create the client data structure
    console.log('🔍 Processing client data...');
    
    // First, let's ensure we have all organization-cohort combinations
    const organizationCohortMap = new Map();
    
    // Process all rows to build the map
    clientsData.forEach(row => {
      const orgId = row.organizationId;
      const cohortId = row.cohortId || 'no-cohort';
      const key = `${orgId}-${cohortId}`;
      
      if (!organizationCohortMap.has(key)) {
        organizationCohortMap.set(key, {
          organizationId: orgId,
          organizationName: row.organizationName,
          cohortId: cohortId,
          cohortName: row.cohortName || 'No Cohort',
          participants: [],
          attempts: []
        });
      }
      
      // Add participant if exists
      if (row.participantId) {
        const orgCohort = organizationCohortMap.get(key);
        const existingParticipant = orgCohort.participants.find(p => p.id === row.participantId);
        if (!existingParticipant) {
          orgCohort.participants.push({
            id: row.participantId,
            name: row.participantName,
            email: row.participantEmail
          });
        }
      }
      
      // Add attempt if exists
      if (row.attemptId) {
        const orgCohort = organizationCohortMap.get(key);
        const existingAttempt = orgCohort.attempts.find(a => a.id === row.attemptId);
        if (!existingAttempt) {
          orgCohort.attempts.push({
            id: row.attemptId,
            type: row.attemptType,
            status: row.attemptStatus,
            startedAt: row.startedAt,
            completedAt: row.completedAt,
            reportData: row.reportData
          });
        }
      }
    });
    
    console.log(`📊 Found ${organizationCohortMap.size} organization-cohort combinations`);
    
    // Ensure all organizations are represented, even if they have no cohorts
    const allOrganizations = await db.select().from(organization);
    allOrganizations.forEach(org => {
      const hasCohorts = Array.from(organizationCohortMap.values()).some(oc => oc.organizationId === org.id);
      if (!hasCohorts) {
        const key = `${org.id}-no-cohort`;
        organizationCohortMap.set(key, {
          organizationId: org.id,
          organizationName: org.name,
          cohortId: 'no-cohort',
          cohortName: 'No Cohort',
          participants: [],
          attempts: []
        });
        console.log(`📊 Added fallback for organization without cohorts: ${org.name}`);
      }
    });
    
    console.log(`📊 Total organization-cohort combinations after fallback: ${organizationCohortMap.size}`);
    
    // Now convert to the final data structure
    const processedData = Array.from(organizationCohortMap.values()).reduce((acc, orgCohort) => {
      const key = `${orgCohort.organizationId}-${orgCohort.cohortId}`;
      
      acc[key] = {
        id: key,
        client: orgCohort.organizationName || 'Unknown Organization',
        cohort: orgCohort.cohortName,
        keyAnswer: 'Culinary A', // Default key answer
        datePreProgram: null,
        datePostProgram: null,
        retainRate: 0,
        preResilience: 0,
        preTeamDynamics: 0,
        preDecisionMaking: 0,
        preSelfAwareness: 0,
        preCommunication: 0,
        preOverallScore: 0,
        postResilience: 0,
        postTeamDynamics: 0,
        postDecisionMaking: 0,
        postSelfAwareness: 0,
        postCommunication: 0,
        postOverallScore: 0,
        participants: orgCohort.participants,
        attempts: orgCohort.attempts
      };

      return acc;
    }, {} as Record<string, any>);

    console.log(`📊 Processed ${Object.keys(processedData).length} unique client combinations`);
    console.log(`📊 Client combinations:`, Object.keys(processedData));

    // Calculate metrics for each client
    const finalData = Object.values(processedData).map((client: any) => {
      console.log(`📊 Processing client: ${client.client} - ${client.cohort}`);
      const preAttempts = client.attempts.filter((attempt: any) => 
        attempt.type === 'pre_assessment' && attempt.status === 'completed'
      );
      
      const postAttempts = client.attempts.filter((attempt: any) => 
        attempt.type === 'post_assessment' && attempt.status === 'completed'
      );

      // Calculate retain rate (participants who completed pre-assessment)
      const totalParticipants = client.participants.length;
      const completedPreParticipants = preAttempts.length;
      const retainRate = totalParticipants > 0 ? Math.round((completedPreParticipants / totalParticipants) * 100) : 0;

      // Calculate pre-program metrics (Average Grade per category)
      let preMetrics = {
        resilience: 0,
        teamDynamics: 0,
        decisionMaking: 0,
        selfAwareness: 0,
        communication: 0,
        overallScore: 0
      };

      if (preAttempts.length > 0) {
        const totalPreScores = preAttempts.reduce((acc: any, attempt: any) => {
          if (attempt.reportData && attempt.reportData.categoryResults) {
            attempt.reportData.categoryResults.forEach((cat: any) => {
              switch (cat.category) {
                case 'Resilience and Adaptability':
                  acc.resilience += cat.score;
                  break;
                case 'Team Dynamics & Collaboration':
                  acc.teamDynamics += cat.score;
                  break;
                case 'Decision-Making & Problem-Solving':
                  acc.decisionMaking += cat.score;
                  break;
                case 'Self-Awareness & Emotional Intelligence':
                  acc.selfAwareness += cat.score;
                  break;
                case 'Communication & Active Listening':
                  acc.communication += cat.score;
                  break;
              }
            });
          }
          return acc;
        }, { resilience: 0, teamDynamics: 0, decisionMaking: 0, selfAwareness: 0, communication: 0 });

        // Calculate average grade for each category
        const avgResilience = totalPreScores.resilience / preAttempts.length;
        const avgTeamDynamics = totalPreScores.teamDynamics / preAttempts.length;
        const avgDecisionMaking = totalPreScores.decisionMaking / preAttempts.length;
        const avgSelfAwareness = totalPreScores.selfAwareness / preAttempts.length;
        const avgCommunication = totalPreScores.communication / preAttempts.length;

        preMetrics = {
          resilience: avgResilience,
          teamDynamics: avgTeamDynamics,
          decisionMaking: avgDecisionMaking,
          selfAwareness: avgSelfAwareness,
          communication: avgCommunication,
          // Overall Score = Sum of all 5 category averages (as shown in spreadsheet)
          overallScore: avgResilience + avgTeamDynamics + avgDecisionMaking + avgSelfAwareness + avgCommunication
        };
      }

      // Calculate post-program metrics (Average Grade per category)
      let postMetrics = {
        resilience: 0,
        teamDynamics: 0,
        decisionMaking: 0,
        selfAwareness: 0,
        communication: 0,
        overallScore: 0
      };

      if (postAttempts.length > 0) {
        const totalPostScores = postAttempts.reduce((acc: any, attempt: any) => {
          if (attempt.reportData && attempt.reportData.categoryResults) {
            attempt.reportData.categoryResults.forEach((cat: any) => {
              switch (cat.category) {
                case 'Resilience and Adaptability':
                  acc.resilience += cat.score;
                  break;
                case 'Team Dynamics & Collaboration':
                  acc.teamDynamics += cat.score;
                  break;
                case 'Decision-Making & Problem-Solving':
                  acc.decisionMaking += cat.score;
                  break;
                case 'Self-Awareness & Emotional Intelligence':
                  acc.selfAwareness += cat.score;
                  break;
                case 'Communication & Active Listening':
                  acc.communication += cat.score;
                  break;
              }
            });
          }
          return acc;
        }, { resilience: 0, teamDynamics: 0, decisionMaking: 0, selfAwareness: 0, communication: 0 });

        // Calculate average grade for each category
        const avgResilience = totalPostScores.resilience / postAttempts.length;
        const avgTeamDynamics = totalPostScores.teamDynamics / postAttempts.length;
        const avgDecisionMaking = totalPostScores.decisionMaking / postAttempts.length;
        const avgSelfAwareness = totalPostScores.selfAwareness / postAttempts.length;
        const avgCommunication = totalPostScores.communication / postAttempts.length;

        postMetrics = {
          resilience: avgResilience,
          teamDynamics: avgTeamDynamics,
          decisionMaking: avgDecisionMaking,
          selfAwareness: avgSelfAwareness,
          communication: avgCommunication,
          // Overall Score = Sum of all 5 category averages (as shown in spreadsheet)
          overallScore: avgResilience + avgTeamDynamics + avgDecisionMaking + avgSelfAwareness + avgCommunication
        };
      }

      // Set dates in DD-MMM-YY format (matching spreadsheet)
      const formatDate = (dateString: string | null) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const year = date.getFullYear().toString().slice(-2);
        return `${day}-${month}-${year}`;
      };

      const preDate = preAttempts.length > 0 ? formatDate(preAttempts[0].startedAt) : null;
      const postDate = postAttempts.length > 0 ? formatDate(postAttempts[0].startedAt) : null;

      return {
        id: client.id,
        client: client.client,
        cohort: client.cohort,
        keyAnswer: client.keyAnswer,
        datePreProgram: preDate,
        datePostProgram: postDate,
        retainRate,
        preResilience: Number(preMetrics.resilience.toFixed(2)),
        preTeamDynamics: Number(preMetrics.teamDynamics.toFixed(2)),
        preDecisionMaking: Number(preMetrics.decisionMaking.toFixed(2)),
        preSelfAwareness: Number(preMetrics.selfAwareness.toFixed(2)),
        preCommunication: Number(preMetrics.communication.toFixed(2)),
        preOverallScore: Number(preMetrics.overallScore.toFixed(2)),
        postResilience: Number(postMetrics.resilience.toFixed(2)),
        postTeamDynamics: Number(postMetrics.teamDynamics.toFixed(2)),
        postDecisionMaking: Number(postMetrics.decisionMaking.toFixed(2)),
        postSelfAwareness: Number(postMetrics.selfAwareness.toFixed(2)),
        postCommunication: Number(postMetrics.communication.toFixed(2)),
        postOverallScore: Number(postMetrics.overallScore.toFixed(2)),
      };
    });

    console.log(`✅ Processed ${finalData.length} client records`);
    console.log(`📊 Final data summary:`);
    finalData.forEach((client, index) => {
      console.log(`  ${index + 1}. ${client.client} - ${client.cohort}`);
    });
    
    return NextResponse.json({ clients: finalData });
  } catch (error) {
    console.error('❌ Error fetching all clients data:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
