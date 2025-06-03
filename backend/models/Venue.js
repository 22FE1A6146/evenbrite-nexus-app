
const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Venue name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'USA'
    }
  },
  capacity: {
    type: Number,
    required: [true, 'Venue capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  layout: {
    type: String,
    enum: ['theater', 'classroom', 'banquet', 'conference', 'standing', 'custom'],
    default: 'theater'
  },
  amenities: [{
    type: String,
    enum: ['parking', 'wifi', 'catering', 'av_equipment', 'wheelchair_accessible', 'air_conditioning']
  }],
  contact: {
    phone: String,
    email: String,
    website: String
  },
  images: [{
    type: String
  }],
  pricePerHour: {
    type: Number,
    min: 0
  },
  availability: [{
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    isBooked: {
      type: Boolean,
      default: false
    }
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
venueSchema.index({ 'address.city': 1 });
venueSchema.index({ 'address.state': 1 });
venueSchema.index({ capacity: 1 });
venueSchema.index({ name: 'text', 'address.city': 'text' });

module.exports = mongoose.model('Venue', venueSchema);
