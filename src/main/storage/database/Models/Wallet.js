const Database = require('../database');
const Models = require('./Models');

class Wallet extends Models {

    constructor() {
        super("wallets");
        
        this.createTable(`id INTEGER PRIMARY KEY AUTOINCREMENT,
            label TEXT, 
            amount REAL, 
            cbu TEXT,   
            alias TEXT,
            created_at TIMESTAMP,
            updated_at TIMESTAMP,
            user_id INTEGER,
            client_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE`);
      }

    
      



}


module.exports = Wallet;
