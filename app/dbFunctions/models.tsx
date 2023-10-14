import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./mydb.sqlite');
sqlite3.verbose();

export async function initializeDb () {
  await db.run(
    'CREATE TABLE IF NOT EXISTS models (name TEXT, runs INTEGER, url TEXT UNIQUE, author TEXT, description TEXT, lastUpdatedDate TEXT, delta REAL)'
  );
  await createTriggers();
}

export async function verifyModelsTable (): Promise<boolean> {
  try {
    const result = await new Promise<boolean>((resolve, reject) => {
      db.get(
        'SELECT EXISTS(SELECT 1 FROM sqlite_master WHERE type = "table" AND name = "models") as "exists"',
        (err: Error, row: { exists: number }) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(row.exists === 1);
          }
        }
      );
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createTriggers () {
  db.run(`
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
    const rows = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM models ORDER BY runs DESC', (err, rows) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
