const Database = require('../database');
const Models = require('./Models');

class Clients extends Models {

    constructor() {
        super("clients");
        
        this.createTable(`id INTEGER PRIMARY KEY AUTOINCREMENT,
            nickname TEXT NOT NULL, 
            status TEXT  DEFAULT "activo",
            notes TEXT,
            reputation INTEGER DEFAULT 100,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`);
            
            this.addColumn("access_code","TEXT")

            this.addColumn("reputation","INTEGER default 100")
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
  

module.exports = Clients;
