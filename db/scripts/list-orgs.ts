'use strict';
import 'dotenv/config';
import { db } from '~/db';
import { organization } from '~/db/schema';

async function main() {
  const orgs = await db.select().from(organization).execute();
  console.log('Organizations in DB:', orgs.map(o => ({ id: o.id, name: o.name, slug: (o as any).slug })));
}

main().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });


