import Booking from '../models/Booking.js';

import Destination from '../models/Destination.js';
import Homestay from '../models/Homestay.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

const getListingModel = (type) => {
  if (type === 'Destination') {
    return Destination;
  }

  return Homestay;
};

const resolveBookingHostId = async ({ type, itemId, host, userId }) => {
  if (itemId && type) {
    const ListingModel = getListingModel(type);
    const listing = await ListingModel.findById(itemId).select('host');

    if (listing?.host) {
      return listing.host;
    }
  }

  if (host) {
    return host;
  }

  return userId;
};

const bookingBelongsToHost = async (booking, hostId) => {
  if (booking.host && booking.host.toString() === hostId.toString()) {
    return true;
  }

  if (!booking.itemId || !booking.type) {
    return false;
  }

  const ListingModel = getListingModel(booking.type);
  const listing = await ListingModel.findById(booking.itemId).select('host');

  return Boolean(listing?.host && listing.host.toString() === hostId.toString());
};

const getListingAndHost = async ({ type, itemId }) => {
  const ListingModel = getListingModel(type);
  const listing = await ListingModel.findById(itemId).populate('host', 'name email');

  if (!listing) {
    return null;
  }

  return listing;
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  let { name, type, checkIn, checkOut, guests, totalPrice, image, host, itemId, guestName } = req.body;

  if (!name || !checkIn || !checkOut || !guests || !totalPrice || !guestName) {
    return res.status(400).json({ message: 'Please include all required booking fields' });
  }

  if (req.user?.userType === 'host') {
    return res.status(403).json({ message: 'Host-only accounts cannot create bookings' });
  }

  try {
    host = await resolveBookingHostId({ type, itemId, host, userId: req.user.id });

    const booking = await Booking.create({
      user: req.user.id,
      guestName,
      host,
      itemId,
      name,
      type: type || 'Homestay',
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests: Number(guests),
      totalPrice: Number(totalPrice),
      status: 'Pending', // Bookings now require host approval
      image: image || '',
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error during booking creation' });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error retrieving bookings' });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.id;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the current user
    if (booking.user.toString() !== userId) {
      return res.status(401).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error during booking cancellation' });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to view this booking' });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error('Get single booking error:', error);
    res.status(500).json({ message: 'Server error retrieving booking' });
  }
};

// @desc    Update a booking (e.g., change dates)
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this booking' });
    }
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error updating booking' });
  }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const isTravelerOwner = booking.user.toString() === req.user.id;
    const isHostOwner = await bookingBelongsToHost(booking, req.user.id);

    if (!isTravelerOwner && !isHostOwner) {
      return res.status(401).json({ message: 'Not authorized to delete this booking' });
    }
    await booking.deleteOne();
    res.status(200).json({ message: 'Booking removed successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ message: 'Server error deleting booking' });
  }
};

// @desc    Filter user bookings by status
// @route   GET /api/bookings/filter/status
// @access  Private
export const filterBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user.id };
    if (status) {
      filter.status = status;
    }
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Filter bookings error:', error);
    res.status(500).json({ message: 'Server error filtering bookings' });
  }
};

// @desc    Get host bookings
// @route   GET /api/bookings/host-bookings
// @access  Private
export const getHostBookings = async (req, res) => {
  try {
    const hostId = req.user.id;
    const hostDestinations = await Destination.find({ host: hostId }).select('_id');
    const hostHomestays = await Homestay.find({ host: hostId }).select('_id');
    const listingIds = [
      ...hostDestinations.map(destination => destination._id),
      ...hostHomestays.map(homestay => homestay._id),
    ];

    const bookings = await Booking.find({
      $or: [
        { host: hostId },
        ...(listingIds.length > 0 ? [{ itemId: { $in: listingIds } }] : []),
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Get host bookings error:', error);
    res.status(500).json({ message: 'Server error retrieving host bookings' });
  }
};

// @desc    Confirm booking
// @route   PUT /api/bookings/:id/confirm
// @access  Private
export const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!(await bookingBelongsToHost(booking, req.user.id))) {
      return res.status(401).json({ message: 'Not authorized to confirm this booking' });
    }

    booking.status = 'Confirmed';
    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({ message: 'Server error confirming booking' });
  }
};

// @desc    Decline booking
// @route   PUT /api/bookings/:id/decline
// @access  Private
export const declineBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!(await bookingBelongsToHost(booking, req.user.id))) {
      return res.status(401).json({ message: 'Not authorized to decline this booking' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    console.error('Decline booking error:', error);
    res.status(500).json({ message: 'Server error declining booking' });
  }
};

// @desc    Contact host about a destination/homestay
// @route   POST /api/bookings/contact-host
// @access  Private
export const contactHost = async (req, res) => {
  try {
    const { type, itemId, message } = req.body;

    if (!type || !itemId || !message) {
      return res.status(400).json({ message: 'Please include type, itemId, and message' });
    }

    const listing = await getListingAndHost({ type, itemId });
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const hostUser = listing.host;
    if (!hostUser?.email) {
      return res.status(404).json({ message: 'Host email not found for this listing' });
    }

    const sender = await User.findById(req.user.id).select('name email');
    const senderName = sender?.name || 'EcoExplorer user';
    const senderEmail = sender?.email || 'unknown email';

    // Save message to in-app messaging system
    const Message = (await import('../models/Message.js')).default;
    const conversationId = Message.getConversationId(req.user.id, hostUser._id);
    await Message.create({
      sender: req.user.id,
      receiver: hostUser._id,
      conversationId,
      text: message.trim(),
      listingName: listing.name || '',
      listingType: type || '',
    });

    // Also send email notification
    const subject = `New inquiry about ${listing.name} from ${senderName}`;
    const emailMessage = [
      `Hello ${hostUser.name || 'Host'},`,
      '',
      `You received a new message about ${listing.name}.`,
      '',
      `From: ${senderName} <${senderEmail}>`,
      `Property: ${listing.name}`,
      `Location: ${listing.location}`,
      '',
      'Message:',
      message,
      '',
      'Log in to EcoExplorer to reply to this message.'
    ].join('\n');

    try {
      await sendEmail({
        email: hostUser.email,
        subject,
        message: emailMessage,
      });
    } catch (emailErr) {
      // Email failure is non-critical — message is already saved in-app
      console.error('Email notification failed (message still saved):', emailErr.message);
    }

    res.status(200).json({ message: 'Message sent to host successfully' });
  } catch (error) {
    console.error('Contact host error:', error);
    res.status(500).json({ message: 'Server error sending host message' });
  }
};

