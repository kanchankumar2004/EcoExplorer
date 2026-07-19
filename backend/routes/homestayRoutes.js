import express from 'express';
import {
  getHomestays,
  getHomestayById,
  getMyHomestays,
  createHomestay,
  updateHomestay,
  deleteHomestay,
} from '../controllers/homestayController.js';

import { protect, isHost } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/my-listings').get(protect, isHost, getMyHomestays);

router.route('/')
  .get(getHomestays)
  .post(protect, isHost, createHomestay);

router
  .route('/:id')
  .get(getHomestayById)
  .put(protect, isHost, updateHomestay)
  .delete(protect, isHost, deleteHomestay);

export default router;
