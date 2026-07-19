import Homestay from '../models/Homestay.js';

// @desc    Fetch all homestays
// @route   GET /api/homestays
// @access  Public
export const getHomestays = async (req, res, next) => {
  try {
    const homestays = await Homestay.find({});
    res.status(200).json(homestays);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch logged in host's homestays
// @route   GET /api/homestays/my-listings
// @access  Private/Host
export const getMyHomestays = async (req, res, next) => {
  try {
    const homestays = await Homestay.find({ host: req.user._id });
    res.status(200).json(homestays);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single homestay
// @route   GET /api/homestays/:id
// @access  Public
export const getHomestayById = async (req, res, next) => {
  try {
    const homestay = await Homestay.findById(req.params.id);

    if (homestay) {
      res.status(200).json(homestay);
    } else {
      res.status(404);
      throw new Error('Homestay not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a homestay
// @route   POST /api/homestays
// @access  Private/Host
export const createHomestay = async (req, res, next) => {
  try {
    const homestay = new Homestay({
      ...req.body,
      host: req.user._id
    });
    const createdHomestay = await homestay.save();
    res.status(201).json(createdHomestay);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a homestay
// @route   PUT /api/homestays/:id
// @access  Private/Host
export const updateHomestay = async (req, res, next) => {
  try {
    const homestay = await Homestay.findById(req.params.id);

    if (homestay) {
      if (homestay.host.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to update this homestay');
      }

      Object.assign(homestay, req.body);
      const updatedHomestay = await homestay.save();
      res.status(200).json(updatedHomestay);
    } else {
      res.status(404);
      throw new Error('Homestay not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a homestay
// @route   DELETE /api/homestays/:id
// @access  Private/Host
export const deleteHomestay = async (req, res, next) => {
  try {
    const homestay = await Homestay.findById(req.params.id);

    if (homestay) {
      if (homestay.host.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to delete this homestay');
      }

      await homestay.deleteOne();
      res.status(200).json({ message: 'Homestay removed' });
    } else {
      res.status(404);
      throw new Error('Homestay not found');
    }
  } catch (error) {
    next(error);
  }
};
