import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import authRouter from './routes/auth.js';
import betsRouter from './routes/bets.js';
import groupsRouter from './routes/groups.js';
import { config } from 'dotenv';
config(); // Load environment variables from .env file

const app = express();


app.use(express.json());
app.use(cors());

connectDB();

app.get('/', (req, res) => res.send('API running'));
app.use('/auth', authRouter);
app.use('/bets', betsRouter);
app.use('/groups', groupsRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});