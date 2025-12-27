import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://portal.sw.nat.gov.tw/APGQ/GC331!downLoad?formBean.downLoadFile=CURRENT_JSON';
const CURRENT_FILE = path.join(__dirname, 'gc331_current.json');
const HISTORIES_DIR = path.join(__dirname, 'histories');

async function ensureHistoriesDir() {
  try {
    await fs.access(HISTORIES_DIR);
  } catch {
    await fs.mkdir(HISTORIES_DIR, { recursive: true });
  }
}

async function fetchGC331Data() {
  try {
    console.log('Fetching GC331 data from API...');
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.start) {
      throw new Error('Invalid data format: missing start field');
    }

    console.log(`Fetched data for period: ${data.start} to ${data.end}`);

    // Save to current file
    await fs.writeFile(CURRENT_FILE, JSON.stringify(data, null, '\t'), 'utf8');
    console.log(`Saved current data to ${CURRENT_FILE}`);

    // Save to histories folder
    await ensureHistoriesDir();
    const historyFile = path.join(HISTORIES_DIR, `${data.start}.json`);

    // Check if file already exists to avoid overwriting
    try {
      await fs.access(historyFile);
      console.log(`History file ${historyFile} already exists, skipping...`);
    } catch {
      await fs.writeFile(historyFile, JSON.stringify(data, null, '\t'), 'utf8');
      console.log(`Saved history data to ${historyFile}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching GC331 data:', error.message);
    throw error;
  }
}

// Main execution
fetchGC331Data()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to fetch GC331 data:', error);
    process.exit(1);
  });

