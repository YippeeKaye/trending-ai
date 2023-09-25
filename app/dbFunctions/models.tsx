import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./mydb.sqlite');

export async function initializeDb () {
  await db.run(
    'CREATE TABLE IF NOT EXISTS models (name TEXT UNIQUE, runs INTEGER, url TEXT, author TEXT, description TEXT, lastUpdatedDate TEXT, delta REAL)'
  );
}

export async function createTriggers () {
  db.run(`
    CREATE TRIGGER IF NOT EXISTS calculate_relative_delta
    AFTER INSERT ON models
    BEGIN
        -- Calculate the relative delta and update the new row
        UPDATE models
        SET delta = (1.0 - (
            SELECT runs
            FROM models
            WHERE ROWID = NEW.ROWID
        ) / NEW.runs) * 100.0
        WHERE ROWID = NEW.ROWID;
    END;
    `);
  db.run(`
    CREATE TRIGGER IF NOT EXISTS update_relative_delta
    AFTER UPDATE ON models
    BEGIN
        -- Calculate the relative delta and update the row being modified
        UPDATE models
        SET delta = (1.0 - (
            SELECT runs
            FROM models
            WHERE ROWID = NEW.ROWID
        ) / NEW.runs) * 100.0
        WHERE ROWID = NEW.ROWID;
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