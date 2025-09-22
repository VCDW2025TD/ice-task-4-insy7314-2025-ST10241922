// backend/src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'https://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/authMiddleware');

app.use('/api/auth', authRoutes);

app.get('/api/protected', protect, (req, res) => {
  res.json({
    message: Welcome, user ${req.user.id}!,
    timestamp: new Date(),
  });
});

// Health endpoint
app.get('/api/health', (req, res) => res.json({ ok: true }));

module.exports = app;