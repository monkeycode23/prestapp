const Database = require("../database");
const Models = require("./Models");

class ActivityLog extends Models {
  constructor() {
    super("activity_log");

    this.createTable(`id INTEGER PRIMARY KEY AUTOINCREMENT,
    action_type TEXT NOT NULL,
    entity TEXT NOT NULL,             
    entity_id TEXT, 
    payload TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    synced INTEGER DEFAULT 0`);
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

module.exports = ActivityLog;
