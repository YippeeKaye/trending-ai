import {
  initializeDb,
  listModelsSortedByRuns,
  verifyModelsTable
} from '@/app/dbFunctions/models';
import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./mydb.sqlite');

import Replicate from 'replicate';

export const dynamic = 'force-dynamic';

export async function GET () {
  console.log('hello1');
  const tableExists = await verifyModelsTable();
  if (!tableExists) {
    console.log('hello2');
    await initializeDb();
    const replicate = new Replicate();
    // paginate and get all models
    const allModels = [];
    for await (const batch of replicate.paginate(replicate.models.list)) {
      console.log('fetching batch');
      allModels.push(...batch);
    }
    console.log(`inserting allModels ${allModels.length}`);
    for (const element of allModels) {
      await db.run(
        'INSERT OR REPLACE INTO models(name, runs, url, author, description, lastUpdatedDate, delta) VALUES(?, ?, ?, ?, ?, ?, ?)',
        [
          element.name,
          element.run_count,
          element.url,
          element.owner,
          element.description,
          null,
          null
        ]
      );
    }
  }
  const allModels = await listModelsSortedByRuns();
  return NextResponse.json(allModels);
}
