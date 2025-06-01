const  mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  user: { // The user who should receive the notification
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  from: { // The user who triggered the notification (optional, e.g., sender of a message)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['new_message', 'loan_approved', 'payment_due', 'system_alert', 'other'], // Extend as needed
    required: true
  },
  message: {
    type: String,
    required: true
  },
  link: { // Optional link, e.g., to a chat conversation or a specific loan
    type: String,
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'created_at'
  }
});

notificationSchema.index({ user: 1, read: 1 }); // For fetching unread notifications for a user

const Notification = mongoose.model('Notification', notificationSchema);

module.exports= Notification; 