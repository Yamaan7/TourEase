import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paid: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
});

export default mongoose.model('Booking', bookingSchema);