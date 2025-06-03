
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  time: {
    type: String,
    required: [true, 'Event time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time format (HH:MM)']
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Event capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [50000, 'Capacity cannot exceed 50,000']
  },
  price: {
    type: Number,
    required: [true, 'Event price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: ['conference', 'workshop', 'concert', 'sports', 'networking', 'other']
  },
  image: {
    type: String,
    default: null
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizerName: {
    type: String,
    required: true
  },
  ticketsSold: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled'],
    default: 'draft'
  },
  tags: [{
    type: String,
    trim: true
  }],
  settings: {
    allowRefunds: {
      type: Boolean,
      default: false
    },
    requireApproval: {
      type: Boolean,
      default: false
    },
    isPublic: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ title: 'text', description: 'text' });

// Virtual for available tickets
eventSchema.virtual('availableTickets').get(function() {
  return this.capacity - this.ticketsSold;
});

// Middleware to update ticketsSold count
eventSchema.methods.updateTicketCount = async function() {
  const Ticket = mongoose.model('Ticket');
  const count = await Ticket.countDocuments({ 
    event: this._id, 
    status: { $in: ['valid', 'used'] } 
  });
  this.ticketsSold = count;
  return this.save();
};

module.exports = mongoose.model('Event', eventSchema);
