
const express = require('express');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const { auth, authorize } = require('../middleware/auth');
const { validateEvent } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all published events with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      minPrice,
      maxPrice,
      startDate,
      endDate,
      sortBy = 'date'
    } = req.query;

    // Build query
    const query = { status: 'published' };

    if (category) query.category = category;
    if (search) {
      query.$text = { $search: search };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Sort options
    const sortOptions = {
      date: { date: 1 },
      price: { price: 1 },
      title: { title: 1 },
      created: { createdAt: -1 }
    };

    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort(sortOptions[sortBy] || sortOptions.date)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Event.countDocuments(query);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email avatar');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Don't show draft events to non-organizers
    if (event.status === 'draft' && (!req.user || req.user._id.toString() !== event.organizer._id.toString())) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (Organizers only)
router.post('/', auth, authorize('organizer'), validateEvent, async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizer: req.user._id,
      organizerName: req.user.name
    };

    const event = await Event.create(eventData);
    await event.populate('organizer', 'name email');

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Event organizer only)
router.put('/:id', auth, authorize('organizer'), validateEvent, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    // Prevent updating certain fields if tickets are sold
    if (event.ticketsSold > 0) {
      const restrictedFields = ['date', 'time', 'venue', 'capacity'];
      const updates = Object.keys(req.body);
      const hasRestrictedUpdates = updates.some(field => restrictedFields.includes(field));
      
      if (hasRestrictedUpdates) {
        return res.status(400).json({
          message: 'Cannot update date, time, venue, or capacity after tickets are sold'
        });
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('organizer', 'name email');

    res.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Event organizer only)
router.delete('/:id', auth, authorize('organizer'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    // Check if tickets are sold
    if (event.ticketsSold > 0) {
      return res.status(400).json({
        message: 'Cannot delete event with sold tickets. Cancel the event instead.'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/organizer/my-events
// @desc    Get organizer's events
// @access  Private (Organizers only)
router.get('/organizer/my-events', auth, authorize('organizer'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { organizer: req.user._id };
    if (status) query.status = status;

    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Event.countDocuments(query);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get organizer events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/events/:id/publish
// @desc    Publish event
// @access  Private (Event organizer only)
router.post('/:id/publish', auth, authorize('organizer'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    event.status = 'published';
    await event.save();

    res.json({ message: 'Event published successfully', event });
  } catch (error) {
    console.error('Publish event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
