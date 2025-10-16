import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(express.json());

const dbPath = path.join(__dirname, '..', 'mocks', 'db.json');

app.get(/\/api\/(.*)/, async (req, res) => {
  try {
    const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
    const path = req.params[0];
    const data = path.split('/').filter(p => p).reduce((obj, key) => obj?.[key], db);
    
    if (data === undefined) {
      res.status(404).json({ error: 'Not found' });
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
