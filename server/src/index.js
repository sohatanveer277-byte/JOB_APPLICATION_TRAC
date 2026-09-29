import express from 'express';
import cors from 'cors';
import { initDB } from './db.js';
import routes from './routes.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize SQLite Database schema & seeds
initDB();

// API Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Job Application Tracker API running on http://localhost:${PORT}`);
});
