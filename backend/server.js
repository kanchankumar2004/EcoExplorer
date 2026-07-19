import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';
import { fileURLToPath } from 'url';
import { errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import configurePassport from './config/passport.js';
import passport from 'passport';
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import homestayRoutes from './routes/homestayRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure DNS to use Google servers to resolve MongoDB Atlas DNS queryTxt / querySrv issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environmental variables relative to this file
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure Passport
configurePassport();

// Setup Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Setup Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/homestays', homestayRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/messages', messageRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('EcoExplorer Auth Backend is running...');
});

// Error handling middleware
app.use(errorHandler);

// Start listening
app.listen(PORT, () => {
  console.log(`🌿 EcoExplorer Server running on port ${PORT}`);
});
