import { Model } from '@/components/models/columns';
import { client } from '../db/connect';

export async function initializeDb () {
  await client.execute(
    'CREATE TABLE IF NOT EXISTS models (name TEXT, runs INTEGER, url TEXT UNIQUE, author TEXT, description TEXT, lastUpdatedDate TEXT, delta REAL)'
  );
  await createTriggers();
}

export async function verifyModelsTable (): Promise<boolean> {
  try {
    const rs = await client.execute(
      'SELECT EXISTS(SELECT 1 FROM sqlite_master WHERE type = "table" AND name = "models") as "exists"'
    );
    return Promise.resolve(rs.rows[0]['exists'] == 1);
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}

export async function createTriggers () {
  await client.execute(`
      CREATE TRIGGER IF NOT EXISTS update_lastUpdatedDate
      AFTER UPDATE ON models
      BEGIN
          -- Update the lastUpdatedDate column with the current UTC time
          UPDATE models
          SET lastUpdatedDate = datetime('now', 'utc')
          WHERE rowid = NEW.rowid;
      END;
    `);
}

export async function listModelsSortedByRuns () {
  try {
    const rs = await client.execute('SELECT * FROM models ORDER BY runs DESC');
    let models = [];
    for (const row of rs.rows) {
      const model: Model = {
        id: row.id as string,
        name: row.name as string,
        description: row.description as string,
        runs: row.runs as number,
        url: row.url as string
      };
      models.push(model);
    }
    return Promise.resolve(models);
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}

export async function listModelsSortedByDelta () {
  try {
    const rs = await client.execute('SELECT * FROM models ORDER BY delta DESC');
    let models = [];
    for (const row of rs.rows) {
      const model: Model = {
        id: row.id as string,
        name: row.name as string,
        description: row.description as string,
        runs: row.runs as number,
        url: row.url as string
      };
      models.push(model);
    }
    return Promise.resolve(models);
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}
