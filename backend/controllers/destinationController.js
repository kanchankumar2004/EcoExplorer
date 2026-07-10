import Destination from '../models/Destination.js';

// @desc    Fetch all destinations
// @route   GET /api/destinations
// @access  Public
export const getDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.find({});
    res.status(200).json(destinations);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch logged in host's destinations
// @route   GET /api/destinations/my-listings
// @access  Private/Host
export const getMyDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.find({ host: req.user._id });
    res.status(200).json(destinations);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single destination
// @route   GET /api/destinations/:id
// @access  Public
export const getDestinationById = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (destination) {
      res.status(200).json(destination);
    } else {
      res.status(404);
      throw new Error('Destination not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a destination
// @route   POST /api/destinations
// @access  Private/Host
export const createDestination = async (req, res, next) => {
  try {
    const destination = new Destination({
      ...req.body,
      host: req.user._id
    });
    const createdDestination = await destination.save();
    res.status(201).json(createdDestination);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a destination
// @route   PUT /api/destinations/:id
// @access  Private/Host
export const updateDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (destination) {
      // Check if user is the host or an admin
      if (destination.host.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to update this destination');
      }

      Object.assign(destination, req.body);
      const updatedDestination = await destination.save();
      res.status(200).json(updatedDestination);
    } else {
      res.status(404);
      throw new Error('Destination not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a destination
// @route   DELETE /api/destinations/:id
// @access  Private/Host
export const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (destination) {
      // Check if user is the host or an admin
      if (destination.host.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to delete this destination');
      }

      await destination.deleteOne();
      res.status(200).json({ message: 'Destination removed' });
    } else {
      res.status(404);
      throw new Error('Destination not found');
    }
  } catch (error) {
    next(error);
  }
};
