import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

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

// Setup Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Setup Routes
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('EcoExplorer Auth Backend is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong on the server' });
});

// Start listening
app.listen(PORT, () => {
  console.log(`🌿 EcoExplorer Server running on port ${PORT}`);
});
