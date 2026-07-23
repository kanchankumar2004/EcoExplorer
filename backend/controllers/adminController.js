import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Homestay from '../models/Homestay.js';
import Booking from '../models/Booking.js';

// @desc    Get administrative dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, destCount, homestayCount, totalBookings, confirmedBookings, recentUsers, pendingBookingsCount, canceledBookingsCount] = await Promise.all([
      User.countDocuments(),
      Destination.countDocuments(),
      Homestay.countDocuments(),
      Booking.countDocuments(),
      Booking.find({ status: 'Confirmed' }),
      User.find().select('-password').sort({ createdAt: -1 }).limit(10),
      Booking.countDocuments({ status: 'Pending' }),
      Booking.countDocuments({ status: 'Cancelled' })
    ]);

    const totalListings = destCount + homestayCount;
    const revenueAmount = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const reports = {
      pendingBookings: pendingBookingsCount,
      canceledBookings: canceledBookingsCount,
      totalDestinations: destCount,
      totalHomestays: homestayCount
    };

    res.json({
      totalUsers,
      totalListings,
      totalBookings,
      revenue: `$${revenueAmount.toLocaleString()}`,
      revenueAmount,
      recentUsers,
      reports
    });
  } catch (error) {
    console.error('Error in getAdminStats:', error);
    res.status(500).json({ message: 'Server error retrieving admin statistics' });
  }
};
