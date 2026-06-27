import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import Destination from './models/Destination.js';
import { destinations } from '../src/utils/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

connectDB();

const importData = async () => {
  try {
    // Clear existing destinations
    await Destination.deleteMany();

    // The mock data has an 'id' field, but MongoDB creates '_id' automatically.
    // We can map out the 'id' field to let Mongo handle IDs, or keep it.
    // It's safer to remove the hardcoded 'id' and let Mongo generate '_id'.
    const sampleDestinations = destinations.map((dest) => {
      const { id, ...rest } = dest;
      return rest;
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
