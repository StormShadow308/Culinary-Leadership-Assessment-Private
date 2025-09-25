import { db } from '~/db';
import { attempts, cohorts, participants, organization, member } from '~/db/schema';
import { and, avg, count, desc, eq, inArray, sql } from 'drizzle-orm';
import { cache, CACHE_KEYS } from './cache';

// Optimized query for user membership with caching
export async function getUserMembership(userId: string) {
  const cacheKey = CACHE_KEYS.USER_MEMBERSHIP(userId);
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  const membership = await db
    .select({
      organizationId: member.organizationId,
      role: member.role,
      organizationName: organization.name,
      organizationSlug: organization.slug,
      organizationMetadata: organization.metadata,
    })
    .from(member)
    .innerJoin(organization, eq(member.organizationId, organization.id))
    .where(eq(member.userId, userId))
    .limit(1);

  const result = membership[0] || null;
  
  // Cache for 5 minutes
  cache.set(cacheKey, result, 5 * 60 * 1000);
  
  return result;
}

// Optimized query for organization participants with caching
export async function getOrganizationParticipants(orgId: string, cohortId?: string) {
  const cacheKey = `participants_${orgId}_${cohortId || 'all'}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  const participants = await db
    .select({
      id: participants.id,
      email: participants.email,
      fullName: participants.fullName,
      createdAt: participants.createdAt,
      lastActiveAt: participants.lastActiveAt,
      cohortId: participants.cohortId,
      cohortName: cohorts.name,
      stayOut: participants.stayOut,
    })
    .from(participants)
    .leftJoin(cohorts, eq(participants.cohortId, cohorts.id))
    .where(
      and(
        eq(participants.organizationId, orgId),
        cohortId ? eq(participants.cohortId, cohortId) : undefined
      )
    );

  // Cache for 2 minutes
  cache.set(cacheKey, participants, 2 * 60 * 1000);
  
  return participants;
}

// Optimized query for organization statistics
export async function getOrganizationStats(orgId: string, participantIds: string[]) {
  const cacheKey = `org_stats_${orgId}_${participantIds.length}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  // Get all stats in parallel
  const [
    totalRespondents,
    avgScoreResult,
    totalAttemptsResult,
    completedAttemptsResult
  ] = await Promise.all([
    // Total respondents
    db.select({ count: count() })
      .from(participants)
      .where(eq(participants.organizationId, orgId)),
    
    // Average score
    db.select({
      avgScore: avg(sql<number>`(attempts.report_data->>'overallPercentage')::float`),
    })
    .from(attempts)
    .where(
      and(
        eq(attempts.status, 'completed'),
        eq(attempts.type, 'pre_assessment'),
        inArray(attempts.participantId, participantIds)
      )
    ),
    
    // Total attempts
    db.select({ count: count() })
      .from(attempts)
      .where(
        and(
          eq(attempts.type, 'pre_assessment'),
          inArray(attempts.participantId, participantIds)
        )
      ),
    
    // Completed attempts
    db.select({ count: count() })
      .from(attempts)
      .where(
        and(
          eq(attempts.status, 'completed'),
          eq(attempts.type, 'pre_assessment'),
          inArray(attempts.participantId, participantIds)
        )
      )
  ]);

  const stats = {
    totalRespondents: totalRespondents[0]?.count || 0,
    averageScore: avgScoreResult[0]?.avgScore || 0,
    totalAttempts: totalAttemptsResult[0]?.count || 0,
    completedAttempts: completedAttemptsResult[0]?.count || 0,
    completionRate: totalAttemptsResult[0]?.count > 0 
      ? (completedAttemptsResult[0]?.count / totalAttemptsResult[0]?.count) * 100 
      : 0
  };

  // Cache for 1 minute
  cache.set(cacheKey, stats, 60 * 1000);
  
  return stats;
}

// Optimized query for attempt data with batching
export async function getAttemptData(participantIds: string[], type: 'pre_assessment' | 'post_assessment' = 'pre_assessment') {
  if (participantIds.length === 0) return [];

  // Batch queries to avoid large IN clauses
  const batchSize = 100;
  const batches = [];
  
  for (let i = 0; i < participantIds.length; i += batchSize) {
    const batch = participantIds.slice(i, i + batchSize);
    batches.push(batch);
  }

  const allAttempts = [];
  
  for (const batch of batches) {
    const attempts = await db
      .select({
        participantId: attempts.participantId,
        status: attempts.status,
        reportData: attempts.reportData,
      })
      .from(attempts)
      .where(
        and(
          eq(attempts.type, type),
          inArray(attempts.participantId, batch)
        )
      );
    
    allAttempts.push(...attempts);
  }

  return allAttempts;
}

// Optimized query for top performers
export async function getTopPerformers(orgId: string, cohortId?: string, limit: number = 5) {
  const cacheKey = `top_performers_${orgId}_${cohortId || 'all'}_${limit}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  const topRespondents = await db
    .select({
      id: participants.id,
      name: participants.fullName,
      cohortId: participants.cohortId,
      attemptId: attempts.id,
      reportData: sql<any>`attempts.report_data`,
    })
    .from(attempts)
    .innerJoin(participants, eq(attempts.participantId, participants.id))
    .where(
      and(
        eq(participants.organizationId, orgId),
        cohortId ? eq(participants.cohortId, cohortId) : undefined,
        eq(attempts.status, 'completed'),
        eq(attempts.type, 'pre_assessment')
      )
    )
    .orderBy(desc(sql`(attempts.report_data->>'totalScore')::int`))
    .limit(limit);

  // Cache for 2 minutes
  cache.set(cacheKey, topRespondents, 2 * 60 * 1000);
  
  return topRespondents;
}

// Clear cache for specific organization
export function clearOrganizationCache(orgId: string) {
  cache.delete(CACHE_KEYS.ORGANIZATION_DATA(orgId));
  cache.delete(CACHE_KEYS.PARTICIPANTS_COUNT(orgId));
  cache.delete(CACHE_KEYS.COHORTS_DATA(orgId));
  
  // Clear all participant-related cache
  const keys = Array.from((cache as any).cache.keys());
  keys.forEach(key => {
    if (key.includes(orgId)) {
      cache.delete(key);
    }
  });
}
