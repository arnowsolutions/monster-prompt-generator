// Monster Prompt Generator - API Server
// Main server file for the RESTful API

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const promptRoutes = require('./routes/prompts');
const templateRoutes = require('./routes/templates');
const userRoutes = require('./routes/users');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Monster Prompt Generator API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// API Documentation route
app.get('/api/docs', (req, res) => {
  res.json({
    message: 'API Documentation',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        refreshToken: 'POST /api/auth/refresh-token'
      },
      prompts: {
        generate: 'POST /api/prompts/generate',
        getAll: 'GET /api/prompts',
        getById: 'GET /api/prompts/:id',
        save: 'POST /api/prompts',
        update: 'PUT /api/prompts/:id',
        delete: 'DELETE /api/prompts/:id'
      },
      templates: {
        getAll: 'GET /api/templates',
        getById: 'GET /api/templates/:id',
        create: 'POST /api/templates',
        update: 'PUT /api/templates/:id',
        delete: 'DELETE /api/templates/:id'
      },
      users: {
        getProfile: 'GET /api/users/profile',
        updateProfile: 'PUT /api/users/profile',
        generateApiKey: 'POST /api/users/api-key',
        revokeApiKey: 'DELETE /api/users/api-key/:id'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested resource does not exist'
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/monster-prompt-generator');
    console.log('Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app; // Export for testing