import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';
import Destination from './models/Destination.js';
import Homestay from './models/Homestay.js';

import { destinations, homestays } from '../src/utils/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Clear existing mocked data
    await Destination.deleteMany({});
    await Homestay.deleteMany({});

    // Find the permanent host account, or create one if not exists
    const PERMANENT_HOST_EMAIL = 'kanchankanak2002@gmail.com';
    let permanentHost = await User.findOne({ email: PERMANENT_HOST_EMAIL });

    if (!permanentHost) {
      console.log(`Permanent host not found. Creating host account for ${PERMANENT_HOST_EMAIL}...`);
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('Host@1234', salt);
      permanentHost = await User.create({
        name: 'Kanchan Kumar',
        email: PERMANENT_HOST_EMAIL,
        password: hashedPassword,
        userType: 'host'
      });
    }

    console.log(`Using permanent host: ${permanentHost.email} (${permanentHost._id})`);

    // Assign ALL destinations to the permanent host
    const destinationsToInsert = destinations.map((dest) => {
      return {
        ...dest,
        host: permanentHost._id,
        reviewsCount: dest.reviews,
      };
    });

    // Assign ALL homestays to the permanent host
    const homestaysToInsert = homestays.map((home) => {
      return {
        ...home,
        host: permanentHost._id,
        reviewsCount: home.reviews,
      };
    });

    await Destination.insertMany(destinationsToInsert);
    await Homestay.insertMany(homestaysToInsert);

    console.log(`Successfully seeded ${destinationsToInsert.length} Destinations and ${homestaysToInsert.length} Homestays!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
