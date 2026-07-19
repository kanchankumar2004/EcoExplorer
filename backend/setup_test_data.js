import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import Homestay from './models/Homestay.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  userType: String,
  name: String
}, { strict: false });
const User = mongoose.model('User', UserSchema);

const DestSchema = new mongoose.Schema({
  name: String,
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { strict: false });
const Destination = mongoose.model('Destination', DestSchema);

async function setup() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  const hostEmail = 'kanchankanak2002@gmail.com';
  const legacyHostEmail = 'host1@gmail.com';

  // 1. Get a destination
  const dest = await Destination.findOne({});
  if (!dest) {
    console.log('No destinations found');
    process.exit(1);
  }
  console.log('Found Destination:', dest.name, 'ID:', dest._id);

  // 2. Get or create the requested host account
  let host = await User.findOne({ email: hostEmail });
  if (!host) {
    host = await User.findOne({ email: legacyHostEmail });
    if (host) {
      host.email = hostEmail;
    } else {
      host = new User({
        name: 'Host 1',
        email: hostEmail,
        userType: 'host'
      });
    }
  }

  // 3. Reset host password to 'Password123'
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash('Password123', salt);
  
  host.password = hashedPassword;
  host.userType = 'host';
  await host.save();
  await User.deleteOne({ email: legacyHostEmail, _id: { $ne: host._id } });
  console.log(`Host updated: ${hostEmail} / Password123`);

  // Reassign all listings to the requested host so the dashboard shows the bookings
  await Destination.updateMany({}, { $set: { host: host._id } });
  await Homestay.updateMany({}, { $set: { host: host._id } });

  const destinations = await Destination.find({ host: host._id }).select('name location price');
  const homestays = await Homestay.find({ host: host._id }).select('name location pricePerNight');

  console.log('\nBookable destinations:');
  destinations.forEach(item => {
    console.log(`- ${item.name} | ${item.location} | ${item.price}`);
  });

  console.log('\nBookable homestays:');
  homestays.forEach(item => {
    console.log(`- ${item.name} | ${item.location} | ${item.pricePerNight}`);
  });

  console.log(`\nReady for Browser Test:`);
  console.log(`Destination URL: http://localhost:3000/destinations/${dest._id}`);
  
  process.exit(0);
}

setup().catch(console.error);
