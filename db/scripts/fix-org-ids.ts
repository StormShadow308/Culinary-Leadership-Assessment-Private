'use strict';

import 'dotenv/config';

import { db } from '~/db';
import { cohorts, organization, participants } from '~/db/schema';

import { and, eq, inArray, notInArray, or, sql } from 'drizzle-orm';

async function main() {
  // 1) Load organizations from DB
  const orgs = await db.select().from(organization).execute();
  if (!orgs.length) {
    console.error('No organizations found. Aborting.');
    process.exit(1);
  }

  // 2) Determine target organization id
  const envTarget = process.env.TARGET_ORG_ID?.trim();
  const targetOrgId = envTarget && orgs.find(o => o.id === envTarget) ? envTarget : orgs[0].id;
  const sourceOrgId = process.env.SOURCE_ORG_ID?.trim();

  const existingOrgIds = orgs.map(o => o.id);

  console.log('Existing organization IDs:', existingOrgIds);
  console.log('Target organization ID:', targetOrgId);
  if (sourceOrgId) console.log('Source organization ID:', sourceOrgId);

  // 3) Fix participants: set organizationId to target if null or orphaned (not in organization table)
  const participantsNeedingUpdate = await db
    .select({ id: participants.id, organizationId: participants.organizationId })
    .from(participants)
    .where(
      or(
        sql`organization_id IS NULL`,
        notInArray(participants.organizationId, existingOrgIds),
        sourceOrgId ? eq(participants.organizationId, sourceOrgId) : sql`false`
      )
    )
    .execute();

  console.log('Participants needing update:', participantsNeedingUpdate.length);

  if (participantsNeedingUpdate.length > 0) {
    await db
      .update(participants)
      .set({ organizationId: targetOrgId })
      .where(
        or(
          sql`organization_id IS NULL`,
          notInArray(participants.organizationId, existingOrgIds),
          sourceOrgId ? eq(participants.organizationId, sourceOrgId) : sql`false`
        )
      )
      .execute();
  }

  // 4) Fix cohorts similarly (optional but recommended)
  const cohortsNeedingUpdate = await db
    .select({ id: cohorts.id, organizationId: cohorts.organizationId })
    .from(cohorts)
    .where(
      or(
        sql`organization_id IS NULL`,
        notInArray(cohorts.organizationId, existingOrgIds),
        sourceOrgId ? eq(cohorts.organizationId, sourceOrgId) : sql`false`
      )
    )
    .execute();

  console.log('Cohorts needing update:', cohortsNeedingUpdate.length);

  if (cohortsNeedingUpdate.length > 0) {
    await db
      .update(cohorts)
      .set({ organizationId: targetOrgId })
      .where(
        or(
          sql`organization_id IS NULL`,
          notInArray(cohorts.organizationId, existingOrgIds),
          sourceOrgId ? eq(cohorts.organizationId, sourceOrgId) : sql`false`
        )
      )
      .execute();
  }

  console.log('Organization ID fix completed.');
}

main().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});


