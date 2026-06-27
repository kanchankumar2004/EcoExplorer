import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    userType: {
      type: String,
      required: true,
      enum: ['traveler', 'host', 'both', 'admin'],
      default: 'traveler',
    },
    phone: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
