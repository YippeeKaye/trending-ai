
import sqlite3 from 'sqlite3';


const db = new sqlite3.Database('./mydb.sqlite');


export async function listModelsSortedByRuns() {
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