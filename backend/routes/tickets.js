
const express = require('express');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const { auth, authorize } = require('../middleware/auth');
const { validateTicketPurchase } = require('../middleware/validation');
const { sendTicketConfirmation } = require('../utils/emailService');

const router = express.Router();

// @route   POST /api/tickets/purchase
// @desc    Purchase tickets for an event
// @access  Private (Attendees only)
router.post('/purchase', auth, authorize('attendee'), validateTicketPurchase, async (req, res) => {
  try {
    const { eventId, quantity = 1 } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status !== 'published') {
      return res.status(400).json({ message: 'Event is not available for booking' });
    }

    // Check availability
    const availableTickets = event.capacity - event.ticketsSold;
    if (availableTickets < quantity) {
      return res.status(400).json({
        message: `Only ${availableTickets} tickets available`
      });
    }

    // Check if user already has tickets for this event
    const existingTicket = await Ticket.findOne({
      event: eventId,
      user: req.user._id,
      status: { $in: ['valid', 'used'] }
    });

    if (existingTicket) {
      return res.status(400).json({
        message: 'You already have a ticket for this event'
      });
    }

    // Create tickets
    const tickets = [];
    const purchaseReference = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    for (let i = 0; i < quantity; i++) {
      const ticket = new Ticket({
        event: eventId,
        user: req.user._id,
        userEmail: req.user.email,
        userName: req.user.name,
        price: event.price,
        purchaseReference,
        qrCode: `${eventId}-${req.user._id}-${Date.now()}-${i}`
      });

      await ticket.save();
      tickets.push(ticket);
    }

    // Update event ticket count
    await event.updateTicketCount();

    // Send confirmation email
    try {
      await sendTicketConfirmation(req.user.email, {
        userName: req.user.name,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        venue: event.venue,
        tickets: tickets
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the purchase if email fails
    }

    res.status(201).json({
      message: 'Tickets purchased successfully',
      tickets,
      purchaseReference
    });
  } catch (error) {
    console.error('Purchase tickets error:', error);
    res.status(500).json({ message: 'Server error during ticket purchase' });
  }
});

// @route   GET /api/tickets/my-tickets
// @desc    Get user's tickets
// @access  Private (Attendees only)
router.get('/my-tickets', auth, authorize('attendee'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { user: req.user._id };
    if (status) query.status = status;

    const tickets = await Ticket.find(query)
      .populate('event', 'title date time venue image category')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Ticket.countDocuments(query);

    res.json({
      tickets,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user tickets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tickets/:id
// @desc    Get single ticket
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('event', 'title date time venue image organizer')
      .populate('user', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user owns the ticket or is the event organizer
    const isOwner = ticket.user._id.toString() === req.user._id.toString();
    const isOrganizer = ticket.event.organizer.toString() === req.user._id.toString();

    if (!isOwner && !isOrganizer) {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }

    res.json({ ticket });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tickets/:id/check-in
// @desc    Check in a ticket
// @access  Private (Event organizers only)
router.post('/:id/check-in', auth, authorize('organizer'), async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('event', 'organizer title date');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user is the event organizer
    if (ticket.event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to check in this ticket' });
    }

    // Check if event date is today or in the past
    const eventDate = new Date(ticket.event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate > today) {
      return res.status(400).json({ message: 'Cannot check in before event date' });
    }

    // Check in the ticket
    await ticket.checkIn();

    res.json({
      message: 'Ticket checked in successfully',
      ticket
    });
  } catch (error) {
    if (error.message === 'Ticket is not valid for check-in') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Check in ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tickets/validate-qr
// @desc    Validate QR code for check-in
// @access  Private (Event organizers only)
router.post('/validate-qr', auth, authorize('organizer'), async (req, res) => {
  try {
    const { qrCode } = req.body;

    if (!qrCode) {
      return res.status(400).json({ message: 'QR code is required' });
    }

    const ticket = await Ticket.findOne({ qrCode })
      .populate('event', 'organizer title date time venue')
      .populate('user', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Invalid QR code' });
    }

    // Check if user is the event organizer
    if (ticket.event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this event' });
    }

    res.json({
      message: 'QR code validated successfully',
      ticket: {
        id: ticket._id,
        status: ticket.status,
        checkInTime: ticket.checkInTime,
        user: ticket.user,
        event: ticket.event
      }
    });
  } catch (error) {
    console.error('Validate QR error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tickets/event/:eventId
// @desc    Get all tickets for an event (organizer only)
// @access  Private (Event organizers only)
router.get('/event/:eventId', auth, authorize('organizer'), async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 20, status } = req.query;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const query = { event: eventId };
    if (status) query.status = status;

    const tickets = await Ticket.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Ticket.countDocuments(query);

    // Get statistics
    const stats = await Ticket.aggregate([
      { $match: { event: event._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const ticketStats = {
      total: total,
      valid: 0,
      used: 0,
      cancelled: 0
    };

    stats.forEach(stat => {
      ticketStats[stat._id] = stat.count;
    });

    res.json({
      tickets,
      stats: ticketStats,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get event tickets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
