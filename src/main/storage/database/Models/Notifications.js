const Database = require('../database');
const Models = require('./Models');

class Notifications extends Models {

    constructor() {
        super("notifications");
        
        this.createTable(`id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL, 
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER,
            link TEXT,
            read BOOLEAN DEFAULT FALSE,
            client_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE`);
            
            /* this.addColumn("access_code","TEXT")

            this.addColumn("reputation","INTEGER default 100") */
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
  

module.exports = Notifications;
