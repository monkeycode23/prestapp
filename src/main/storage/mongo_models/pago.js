const mongoose = require('mongoose');
const Prestamo = require('./prestamo');

const pagoSchema = new mongoose.Schema({
  label: {
    type: String,
    trim: true
  },
  loan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prestamo',
    required: true
  },
  sqlite_id: {
    type: Number,
    required: true
  },
  gain: {
    type: Number,
    required: true,
    min: 0
  },
  total_amount: {
    type: Number,
    //required: true,
    min: 0
  },
  payment_date: {
    type: Date,
    default: Date.now
  },
  net_amount: {
    type: Number,
    required: true,
    min: 0
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pendiente',
      'pending','expired','paid','incomplete','Procesando', 'Completado','Incompleto', 'Fallido', 'Reembolsado', 'Cancelado'],
    default: 'Pendiente'
  },
  paid_date: {
    type: Date 
  },
  incomplete_amount: {
    type: Number,
    min: 0  
  },
  payment_method: {
    type: String,
    enum: ['Efectivo', 'Transferencia', 'Tarjeta', 'Cheque', 'Mercado Pago', 'Otro','cash','credit_card','transfer'],
    default: 'Efectivo'
  },
  // Campos adicionales
 
  due_date: {
    type: Date,
    
  },
  late_fee: {
    type: Number,
    default: 0,
    min: 0
  },
  late_days: {
    type: Number,
    default: 0,
    min: 0
  },
  receipt_number: {
    type: String,
    trim: true
  },
  transaction_id: {
    type: String,
    trim: true
  },
  payment_proof: {
    url: String,
    type: String,
    upload_date: Date
  },
  notes: {
    type: String,
    trim: true
  },
  processed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});


pagoSchema.pre('save',async  function(next) {
 /*  if (this.isModified('status') && this.status === 'Completado') {
    this.paid_date = new Date();
  } */
    const ultimoDoc = await Prestamo.findOne().sort({ _id: -1 });
    console.log(ultimoDoc);

    this.loan_id = ultimoDoc._id;
    console.log(this.loan_id);

    this.status = this.status == "pending" ? "Pendiente" : this.status
    
    this.total_amount = this.amount+this.gain
  next();
});

// Hook para actualizar el préstamo cuando se realiza un pago
pagoSchema.post('save', async function() {
  const Prestamo = mongoose.model('Prestamo');
  
  try {
    const prestamo = await Prestamo.findById(this.loan_id);
    
    if (prestamo ) {
      // Agregar el pago al arreglo de pagos del préstamo
      if (!prestamo.payments.includes(this._id)) {
        prestamo.payments.push(this._id);
        prestamo.total_paid += this.amount;
       // prestamo.last_payment_date = this.payment_date;
      }
      
      // Actualizar el estado del préstamo si está completamente pagado
      if (prestamo.total_amount <= prestamo.total_paid) {
        prestamo.status = 'Pagado';
      }
      
      await prestamo.save();
    }
  } catch (error) {
    console.error('Error al actualizar el préstamo después del pago:', error);
  }
});

const Pago = mongoose.model('Pago', pagoSchema);

module.exports = Pago; 