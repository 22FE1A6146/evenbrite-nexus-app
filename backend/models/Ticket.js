
const mongoose = require('mongoose');
const QRCode = require('qrcode');

const ticketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  qrCode: {
    type: String,
    required: true,
    unique: true
  },
  qrCodeImage: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['valid', 'used', 'cancelled', 'refunded'],
    default: 'valid'
  },
  seatNumber: {
    type: String,
    default: null
  },
  checkInTime: {
    type: Date,
    default: null
  },
  purchaseReference: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Indexes
ticketSchema.index({ event: 1, user: 1 });
ticketSchema.index({ qrCode: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ user: 1 });

// Generate unique QR code before saving
ticketSchema.pre('save', async function(next) {
  if (!this.qrCode) {
    this.qrCode = `${this._id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Generate QR code image
  if (!this.qrCodeImage) {
    try {
      const qrData = JSON.stringify({
        ticketId: this._id,
        eventId: this.event,
        userId: this.user,
        code: this.qrCode
      });
      this.qrCodeImage = await QRCode.toDataURL(qrData);
    } catch (error) {
      console.error('QR Code generation error:', error);
    }
  }
  
  next();
});

// Method to check in ticket
ticketSchema.methods.checkIn = function() {
  if (this.status !== 'valid') {
    throw new Error('Ticket is not valid for check-in');
  }
  
  this.status = 'used';
  this.checkInTime = new Date();
  return this.save();
};

// Method to cancel ticket
ticketSchema.methods.cancel = function() {
  if (this.status === 'used') {
    throw new Error('Cannot cancel a used ticket');
  }
  
  this.status = 'cancelled';
  return this.save();
};

module.exports = mongoose.model('Ticket', ticketSchema);
