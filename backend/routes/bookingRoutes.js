import express from 'express';
import { 
  createBooking, 
  getBookings, 
  cancelBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
  filterBookings,
  getHostBookings,
  confirmBooking,
  declineBooking,
  contactHost
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, getBookings);
router.get('/host-bookings', protect, getHostBookings); // Must be before /:id
router.get('/filter/status', protect, filterBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/confirm', protect, confirmBooking);
router.put('/:id/decline', protect, declineBooking);
router.post('/contact-host', protect, contactHost);

export default router;
