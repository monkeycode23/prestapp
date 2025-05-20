const Database = require('../database');
const Models = require('./Models');
class Payments extends Models{
  constructor() {
    super('payments');
     
    this.createTable(`id INTEGER PRIMARY KEY AUTOINCREMENT,
     label TEXT,
     loan_id INTEGER,
     gain REAL,
     total_amount REAL,
     payment_date DATE,
     net_amount REAL,
     amount REAL,
    status TEXT,
    paid_date DATE,
    incomplete_amount REAL,
    payment_method TEXT DEFAULT 'cash',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER,
    FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        `); 
 

         
    //this.db.runQuery(`ALTER TABLE payments ADD COLUMN payment_method TEXT`)

  }

 
  
  
}   

module.exports = Payments;
