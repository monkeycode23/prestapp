const logger = require('../../../logger');
const Database = require('../database');
const Models = require('./Models');

class Users extends Models {
  constructor() {

    super('users');

    
    this.createTable();

    this.addColumn('mongo_id',"TEXT")
    //this.db.exec("ALTER TABLE users ADD COLUMN mongo_id TEXT")
  } 
  createTable(){
    const query = `id INTEGER PRIMARY KEY AUTOINCREMENT,
     username TEXT, email TEXT, password TEXT,
     rol TEXT DEFAULT 'user',
     status TEXT DEFAULT 'activo',
     mongo_id TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `;
    return this.db.createTable("users",query);
  }
  

  
}   

module.exports = Users;
