
const express = require('express');
const Venue = require('../models/Venue');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/venues
// @desc    Get all venues
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { city, capacity, amenities } = req.query;
    
    const query = {};
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (capacity) query.capacity = { $gte: parseInt(capacity) };
    if (amenities) {
      const amenityList = amenities.split(',');
      query.amenities = { $in: amenityList };
    }

    const venues = await Venue.find(query)
      .populate('owner', 'name email')
      .sort({ name: 1 });

    res.json({ venues });
  } catch (error) {
    console.error('Get venues error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/venues/:id
// @desc    Get single venue
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id)
      .populate('owner', 'name email');

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    res.json({ venue });
  } catch (error) {
    console.error('Get venue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/venues
// @desc    Create new venue
// @access  Private (Organizers only)
router.post('/', auth, authorize('organizer'), async (req, res) => {
  try {
    const venueData = {
      ...req.body,
      owner: req.user._id
    };

    const venue = await Venue.create(venueData);
    await venue.populate('owner', 'name email');

    res.status(201).json({
      message: 'Venue created successfully',
      venue
    });
  } catch (error) {
    console.error('Create venue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
