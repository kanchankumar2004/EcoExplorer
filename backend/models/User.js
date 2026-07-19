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
    },
    githubId: {
      type: String,
      default: null,
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
    avatar: {
      type: String,
      default: '',
    },
    settings: {
      notifications: {
        emailAlerts: { type: Boolean, default: true },
        weeklyNewsletter: { type: Boolean, default: false },
        bookingUpdates: { type: Boolean, default: true },
      },
      privacy: {
        profilePublic: { type: Boolean, default: true },
        showActivity: { type: Boolean, default: true },
      },
      paymentMethods: [
        {
          id: { type: String, required: true },
          cardholderName: { type: String, required: true },
          cardType: { type: String, required: true },
          last4: { type: String, required: true },
          expiry: { type: String, required: true },
        }
      ],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
