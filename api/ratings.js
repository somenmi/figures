import { json } from 'micro';
import { Low, JSONFile } from 'lowdb';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Используем файл для хранения данных (Vercel предоставляет временную файловую систему)
const file = path.join(process.cwd(), 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Инициализация базы данных
async function initialize() {
  await db.read();
  db.data ||= { ratings: [] };
  await db.write();
}

export default async function handler(req, res) {
  await initialize();

  if (req.method === 'POST') {
    // Сохранение рейтинга
    const body = await json(req);
    const { userId, name, photo, score, gridSize } = body;

    const existing = db.data.ratings.find(
      r => r.userId === userId && r.gridSize === gridSize
    );

    if (existing) {
      if (existing.score < score) {
        existing.score = score;
        existing.name = name;
        existing.photo = photo;
        existing.date = new Date().toISOString();
      }
    } else {
      db.data.ratings.push({
        id: uuidv4(),
        userId,
        name,
        photo,
        score,
        gridSize,
        date: new Date().toISOString()
      });
    }

    await db.write();
    return res.status(200).json({ success: true });
  } else {
    // Получение рейтингов
    const { size } = req.query;
    const filtered = db.data.ratings
      .filter(r => r.gridSize === parseInt(size))
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);

    return res.status(200).json(filtered);
  }
}