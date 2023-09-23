import axios from 'axios';
import cheerio from 'cheerio';
import sqlite3 from 'sqlite3';

let db: sqlite3.Database;

export async function initializeDb() {
  db = new sqlite3.Database('./mydb.sqlite');
  await db.run('CREATE TABLE IF NOT EXISTS models (name TEXT UNIQUE, runs INTEGER, url TEXT, author TEXT, description TEXT, lastUpdatedDate TEXT)');
}

export async function scrapeAndStore(page: number) {
    const { data } = await axios.get(`https://replicate.com/explore?latest_models_page=${page}`);
    const $ = cheerio.load(data);
    
    const elements = $('#latest-models div.grid div.flex').map((i, el) => {
      // Edit starts here
      const name = $(el).find('h4 a').text().trim().replace(/\s/g, '');
      const description = $(el).find('p.mb-1').text().trim()
      // Edit ends here
      const runsTextArray = $(el).find('.text-shade.text-sm').text()
      const runs = runsTextArray.trim().split('\n')
      .filter(it => /*it.includes("Updated") || */it.includes("runs"))
      .map(it => {
        const trimmed = it.split("r")[0].trim();
        const suffix = trimmed.slice(-1);
        let multiplier = 1;
        if (suffix === "K") {
          multiplier = 1000;
        } else if (suffix === "M") {
          multiplier = 1000000;
        }
        const number = parseFloat(trimmed.slice(0, -1)) * multiplier;
        return number.toFixed(0).toString();
      })[0]
      const author = $(el).find('.author-selector').text();
      const lastUpdatedDate = $(el).find('.date-selector').text();
      const url = `https://replicate.com/${name}`
      return { name, runs, url, author, description, lastUpdatedDate };
    }).get().filter(it => it.name && it.runs && it.runs != 'NaN'); //TODO NaN fix
    for (const element of elements) {
      await db.run('INSERT INTO models(name, runs, url, author, description, lastUpdatedDate) VALUES(?, ?, ?, ?, ?, ?)', Object.values(element));
    }
  }

  export async function scrapeAll() {
    initializeDb()
    for (let page = 1; page <= 50; page++) {
        scrapeAndStore(page);
    }
  }


