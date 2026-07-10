import express from 'express';
import {
  getDestinations,
  getDestinationById,
  getMyDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destinationController.js';

import { protect, isHost } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/my-listings').get(protect, isHost, getMyDestinations);

router.route('/')
  .get(getDestinations)
  .post(protect, isHost, createDestination);

router
  .route('/:id')
  .get(getDestinationById)
  .put(protect, isHost, updateDestination)
  .delete(protect, isHost, deleteDestination);

export default router;
