import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import naissanceRoutes from './modules/naissance/routes/naissanceRoutes.js';
import authRoutes from './modules/auth/routes/authRoutes.js';

const app = express();

// Permissive CORS for Hackathon
app.use(cors());

// Explicit OPTIONS handling for preflight requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Bypass-Tunnel-Reminder');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Routes
app.use('/api/naissances', naissanceRoutes);
app.use('/api/auth', authRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'NaissanceChain API is running' });
});

// Catch-all 404 Handler (JSON)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route non trouvée : ${req.originalUrl}`
  });
});

// Final Error Handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;
