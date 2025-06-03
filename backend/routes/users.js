
const express = require('express');
const User = require('../models/User');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    let dashboardData = {};

    if (req.user.role === 'organizer') {
      // Organizer dashboard
      const events = await Event.find({ organizer: req.user._id });
      const totalEvents = events.length;
      const publishedEvents = events.filter(e => e.status === 'published').length;
      const totalTicketsSold = events.reduce((sum, event) => sum + event.ticketsSold, 0);
      const totalRevenue = await Ticket.aggregate([
        {
          $lookup: {
            from: 'events',
            localField: 'event',
            foreignField: '_id',
            as: 'eventData'
          }
        },
        {
          $match: {
            'eventData.organizer': req.user._id,
            status: { $in: ['valid', 'used'] }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$price' }
          }
        }
      ]);

      const checkInRate = totalTicketsSold > 0 ? 
        await Ticket.countDocuments({
          event: { $in: events.map(e => e._id) },
          status: 'used'
        }) / totalTicketsSold * 100 : 0;

      dashboardData = {
        totalEvents,
        publishedEvents,
        totalTicketsSold,
        totalRevenue: totalRevenue[0]?.total || 0,
        checkInRate: Math.round(checkInRate),
        recentEvents: events.slice(0, 5)
      };
    } else {
      // Attendee dashboard
      const tickets = await Ticket.find({ user: req.user._id })
        .populate('event', 'title date time venue image');
      
      const upcomingEvents = tickets.filter(ticket => 
        new Date(ticket.event.date) > new Date() && ticket.status === 'valid'
      );
      
      const pastEvents = tickets.filter(ticket => 
        new Date(ticket.event.date) <= new Date()
      );

      dashboardData = {
        totalTickets: tickets.length,
        upcomingEvents: upcomingEvents.length,
        pastEvents: pastEvents.length,
        recentTickets: tickets.slice(0, 5)
      };
    }

    res.json({ dashboardData });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
