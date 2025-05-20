const Database = require('../database');
const Models = require('./Models');

class Notes extends Models {

    constructor() {
        super("notes");
        
        this.createTable(`id INTEGER PRIMARY KEY AUTOINCREMENT,
            notes TEXT NOT NULL, 
            payment_id INTEGER,
            loan_id INTEGER,
            client_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER,
            FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
            FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`);
      }

    
      

      /* async createClient(client){
        return this.db.insert(this.tableName,client);
      }


      async getClients(){
        return this.db.query(`SELECT * FROM ${this.tableName}`);
      }


      async getClientById(id){
        return this.db.query(`SELECT * FROM ${this.tableName} WHERE id = ?`,[id]);
      }


      async updateClient(client){
        return this.db.update(this.tableName,client);
      }  

      async deleteClient(id){
        return this.db.delete(this.tableName,id);
      }

      getClient(filter){
        return this.db.query(`SELECT ${filter.select} FROM ${this.tableName} ${filter.join} WHERE ${filter.where}`);
      }

      async getTotalClients(){
        return this.db.query(`SELECT COUNT(*) FROM ${this.tableName}`);
      } */

}


module.exports = Notes;
