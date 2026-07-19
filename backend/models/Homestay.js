import mongoose from 'mongoose';

const homestaySchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    reviews: {
      type: Number,
      required: true,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      required: true,
      default: 0,
    },
    pricePerNight: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    tags: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    longDescription: {
      type: String,
      required: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    experiences: [
      {
        id: { type: String },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String },
      }
    ],
    reviewsList: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Homestay = mongoose.model('Homestay', homestaySchema);

export default Homestay;
