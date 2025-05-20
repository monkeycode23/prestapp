const mongoose = require('mongoose');
const Cliente = require('./cliente');
const prestamoSchema = new mongoose.Schema({
  label: {
    type: String,
    trim: true,
    required: true
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  gain: {
    type: Number,
    required: true,
    min: 0
  },
  installment_number: {
    type: Number,
    required: true,
    min: 1
  },
  total_amount: {
    type: Number,
    required: true,
    min: 0
  },
  loan_date: {
    type: Date,
    default: Date.now
  },
  generate_payments_date: {
    type: Date
  },
  interest_rate: {
    type: Number,
    required: true,
    min: 0
  },
  term: {
    type: Number,
    //required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'incomplete','refunded'],
    default: 'active'
  },
  payment_interval: {
    type: String,
    enum: ['daily', 'weekly', 'biweekly', 'monthly','custom'],
    default: 'weekly'
  },
  // Campos adicionales
  description: {
    type: String,
    trim: true
  },
  purpose: {
    type: String,
    trim: true
  },
  collateral: {
    type: String,
    trim: true
  },
  next_payment_date: {
    type: Date
  },
  last_payment_date: {
    type: Date
  },
  total_paid: {
    type: Number,
    default: 0,
    min: 0
  },
  remaining_amount: {
    type: Number,
    min: 0
  },
  payment_due_day: {
    type: Number,
    min: 1,
    max: 31
  },
  late_fee_rate: {
    type: Number,
    default: 0,
    min: 0
  },
  late_fee_amount: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  },
  documents: [{
    name: String,
    url: String,
    type: String,
    upload_date: Date
  }],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  payments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pago'
  }],
  sqlite_id: {
    type: Number,
    //required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Middleware para calcular el monto restante
prestamoSchema.pre('save', async function(next) {
  

  console.log("data....-------..-.-->>",this)
  const ultimoDoc = await Cliente.findOne().sort({ _id: -1 });

  this.client_id = ultimoDoc._id;

  

  next();
});

const Prestamo = mongoose.model('Prestamo', prestamoSchema);

module.exports = Prestamo; 