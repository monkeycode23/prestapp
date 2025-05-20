  const Database = require('../database');
  const Models = require('./Models');


class Loans extends Models {
  constructor() {
    super("loans");
     
    this.createTable(`id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT,
     client_id INTEGER,
     amount REAL,
     gain REAL,
     installment_number INTEGER,
     total_amount REAL,
     loan_date DATE,
     generate_payments_date DATE,
    interest_rate REAL,
    term INTEGER,
    status TEXT,
    payment_interval TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        `);
  }


  
  
}   

module.exports = Loans;
