const logger = require('../../../logger');
const Database = require('../database');

class Users {
  constructor() {
    this.db = Database;
    this.tableName = "users";
    this.createTable();
  } 
  createTable(){
    const query = `id INTEGER PRIMARY KEY AUTOINCREMENT,
     username TEXT, email TEXT, password TEXT,
     rol TEXT DEFAULT 'user',
     status TEXT DEFAULT 'activo',
     
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `;
    return this.db.createTable("users",query);
  }
  
  async insert( data) {  
    

    console.log("data:----------------------------->",data);
    try {
      const query = `INSERT INTO ${this.tableName} (${Object.keys(data).join(',')}) VALUES (${Object.values(data).map(value => '?').join(',')})`;
      const params = Object.values(data);

      console.log("query:----------------------------->",query);
      const result =this.db.runQuery(query,params)
      logger.info(`Datos insertados en la tabla ${this.tableName}`);

 
      return {
       
        ...data
      }
    } catch (error) {
      logger.error(`Error al insertar datos en la tabla ${this.tableName}:`, error);
      throw error;
    }
}
  
  async getUser(filter) {
    const query = `SELECT * FROM ${this.tableName} WHERE ${Object.keys(filter)[0]} = ?`;
    const params = [Object.values(filter)[0]];
    console.log("query  parmas",query,params)
    console.log(filter)
    return await this.db.asyncQuery(query, params);
  }

  async getUserByEmail(email) {
    const query = `SELECT * FROM users WHERE email = ?`;
    const params = [email];
    return this.db.asyncQuery(query, params);
  }

  async getUserById(id) {
    const query = `SELECT * FROM users WHERE id = ?`;
    const params = [id];
    return this.db.asyncQuery(query, params);
  }  

  async updateUser(user) {
    const { id, username, email, password } = user;
    const query = `UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?`;
    const params = [username, email, password, id];
    return this.db.asyncQuery(query, params);
  }

  async deleteUser(id) {
    const query = `DELETE FROM users WHERE id = ?`;
    const params = [id];
    return this.db.asyncQuery(query, params);
  }
  
  
}   

module.exports = Users;
