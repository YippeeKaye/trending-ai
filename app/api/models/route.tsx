import {
  initializeDb,
  listModelsSortedByRuns,
  verifyModelsTable
} from '@/app/dbFunctions/models';
import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import Replicate, { Model as ReplicateModel } from 'replicate';
import { Model } from '@/components/models/columns';

const db = new sqlite3.Database('./mydb.sqlite');

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
      await db.run(
        'INSERT INTO models(name, runs, url, author, description) VALUES(?, ?, ?, ?, ?)',
        [
          element.name,
          element.run_count,
          element.url,
          element.owner,
          element.description
        ]
      );
    }
  }
}

async function findModelByUrl (url: string): Promise<Model | null> {
  return new Promise<Model | null>((resolve, reject) => {
    db.get('SELECT * FROM models WHERE url = ?', [url], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as Model | null);
      }
    });
  });
}

async function updateModel (
  url: string,
  newRuns: number,
  delta: number
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    db.run(
      'UPDATE models SET runs = ?, delta = ? WHERE url = ?',
      [newRuns, delta, url],
      err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
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

export async function GET () {
  const tableExists = await verifyModelsTable();
  if (!tableExists) {
    await initializeDb();
    const allModels = await getAllModels();
    await saveNewModels(allModels);
  }
  const allModels = await listModelsSortedByRuns();
  return NextResponse.json(allModels);
}
