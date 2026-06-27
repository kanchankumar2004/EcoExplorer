import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a homestay or destination name'],
    },
    type: {
      type: String,
      required: true,
      enum: ['Homestay', 'Destination'],
      default: 'Homestay',
    },
    checkIn: {
      type: Date,
      required: [true, 'Please add a check-in date'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Please add a check-out date'],
    },
    guests: {
      type: Number,
      required: [true, 'Please specify the number of guests'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Please specify the total price'],
    },
    status: {
      type: String,
      required: true,
      enum: ['Confirmed', 'Pending', 'Cancelled'],
      default: 'Pending',
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
