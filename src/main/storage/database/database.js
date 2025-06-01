const Database = require('better-sqlite3');
const path = require('path');
const logger = require('../../logger');
const fs = require('fs');
const app = require('electron').app;

class DatabaseManager {
 
  constructor() {
    this.db = null;
    this.dbName = "test.db" ;
 
    this.dbPath = process.env.NODE_ENV === "development"
    ? './'
    : process.resourcesPath;

    console.log("ENV :----------------------------->",process.env.NODE_ENV);
    console.log("DB PATH  :----------------------------->",process.resourcesPath);

    this.connect()
  }
 

  createDatabaseFile(){
    const fullPath = path.join(this.dbPath, this.dbName);
      //throw new Error("Archivo de base de datos no encontrado");
      fs.writeFileSync(fullPath, '', { flag: 'wx' }); // Crea el archivo vacío
      logger.info("Archivo de base de datos creado en:", fullPath);
      
  }
   

  

  connect() {
    try {
      
      const fullPath = path.join(this.dbPath, this.dbName);

      logger.info("Intentando acceder a la base de datos en:", fullPath);

      // Verificar si el archivo existe
      if (!fs.existsSync(fullPath)) {
        logger.error("No se encuentra el archivo de base de datos en:", fullPath);
        
        this.createDatabaseFile()
        //throw new Error("Archivo de base de datos no encontrado");
      }
      this.db = new Database(fullPath);
      logger.info("Database connected");
    } catch (error) {
      logger.error("Error al conectar a la base de datos:", error);
      throw error;
    }
  }


  createTable(tableName, schema) {
    try {
      const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${schema})`;
      this.db.exec(query);
      logger.info(`Tabla ${tableName} creada correctamente`);
    } catch (error) {
      logger.error("Error al crear la tabla:", error);
      throw error;
    }
  }


  exec(sql, params = []) {
    try {
      return this.db.exec(sql);
      
    } catch (error) {
      logger.error("Error al ejecutar la consulta:", error);
      throw error;
    }
  }
  

  runQuery(sql, params = []) {
    try {
      return this.db.prepare(sql).run(params);
      
    } catch (error) {
      logger.error("Error al ejecutar la consulta:", error);
      throw error;
    }
  }

  asyncQuery(sql, params = []) {
    try {

      return new Promise((resolve, reject) => {
        try {
          const stmt = this.db.prepare(sql);
          const result = stmt.all(params); // Ejecutar la consulta de forma sincrónica
          resolve(result); // Resolver la promesa con el resultado
        } catch (error) {
          logger.error("Error al ejecutar la consulta:", error);
          reject(error); // Rechazar la promesa en caso de error
        }
      });
    } catch (error) {
      logger.error("Error al ejecutar la consulta:", error);
      throw error;
    }
  }

  transaction(operations) {
    return new Promise((resolve, reject) => {
      this.db.transaction(operations, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  query(sql, params = [],options={type:"all"}) {
    try {
      console.log(sql)
      const stmt = this.db.prepare(sql);

      if(options.type == "all"){
        return stmt.all(params);
      }
      else if(options.type == "one"){
        return stmt.get(params);
      }
      else{
        return stmt.run(params);
      }
    } catch (error) {
      logger.error("Error al ejecutar la consulta:", error);
      throw error;
    }
  }

  close() {
    this.db.close();
    logger.info("Base de datos cerrada");
  }


}


const db = new DatabaseManager();
  module.exports =db
