import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import Destination from './models/Destination.js';
import User from './models/User.js';
import { destinations } from '../src/utils/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

connectDB();

const importData = async () => {
  try {
    // Clear existing destinations
    await Destination.deleteMany();

    // Get a user to act as host, or create one if none exist
    let hostUser = await User.findOne({});
    if (!hostUser) {
      hostUser = await User.create({
        name: 'Admin User',
        email: 'admin@ecoexplorer.com',
        password: 'password123',
        userType: 'admin'
      });
    }

    const sampleDestinations = destinations.map((dest) => {
      const { id, ...rest } = dest;
      return { ...rest, host: hostUser._id };
    });

    await Destination.insertMany(sampleDestinations);

    console.log('Destinations Seeded Successfully! 🌱');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Destination.deleteMany();

    console.log('Destinations Destroyed! 💥');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
