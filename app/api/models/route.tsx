import {
  initializeDb,
  listModelsSortedByDelta,
  listModelsSortedByRuns,
  verifyModelsTable
} from '@/app/dbFunctions/models';
import { NextRequest, NextResponse } from 'next/server';
import Replicate, { Model as ReplicateModel } from 'replicate';
import { Model } from '@/components/models/columns';
import { client } from '@/app/db/connect';

export const dynamic = 'force-dynamic';

export async function saveNewModels (allModels: ReplicateModel[]) {
  console.log(`Inserting allModels ${allModels.length}`);

  for (const element of allModels) {
    // Check if a model with the same URL exists
    const existingModel = await findModelByUrl(element.url);

    if (existingModel) {
      // Model with the same URL exists, compute delta and update the row
      const delta =
        (element.run_count - existingModel.runs) / existingModel.runs;
      console.log(`setting delta ${delta} for model url ${existingModel.url}`);
      await updateModel(existingModel.url, element.run_count, delta);
    } else {
      // Model with the URL does not exist, insert a new row
      await client.execute({
        sql: 'INSERT INTO models(name, runs, url, author, description) VALUES(?, ?, ?, ?, ?)',
        args: [
          element.name,
          element.run_count,
          element.url,
          element.owner,
          element?.description ?? null
        ]
      });
    }
  }
}

async function findModelByUrl (url: string): Promise<Model | null> {
  try {
    const rs = await client.execute({
      sql: 'SELECT * FROM models WHERE url = ? LIMIT 1',
      args: [url]
    });
    let model = null;
    for (const row of rs.rows) {
      model = {
        id: row.id as string,
        name: row.name as string,
        description: row.description as string,
        runs: row.runs as number,
        url: row.url as string
      };
    }
    return Promise.resolve(model);
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}

async function updateModel (
  url: string,
  newRuns: number,
  delta: number
): Promise<void> {
  try {
    const rs = await client.execute({
      sql: 'UPDATE models SET runs = ?, delta = ? WHERE url = ?',
      args: [newRuns, delta, url]
    });
    return Promise.resolve();
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}

export async function getAllModels (): Promise<ReplicateModel[]> {
  const replicate = new Replicate();
  // paginate and get all models
  const allModels = [];
  for await (const batch of replicate.paginate(replicate.models.list)) {
    console.log('fetching batch');
    allModels.push(...batch);
  }
  return Promise.resolve(allModels);
}

export async function GET (request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const tableExists = await verifyModelsTable();
  if (!tableExists) {
    await initializeDb();
    const allModels = await getAllModels();
    await saveNewModels(allModels);
  }
  let models;
  if (status === 'trending') {
    models = await listModelsSortedByDelta();
  } else {
    models = await listModelsSortedByRuns();
  }
  return NextResponse.json(models);
}
