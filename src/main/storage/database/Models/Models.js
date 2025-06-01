const logger = require("../../../logger");
const db = require("../database");
/* const ClienteMongo = require("../../mongo_models/cliente.js");
const PagoMongo = require("../../mongo_models/pago.js");
const PrestamoMongo = require("../../mongo_models/prestamo.js");

// Helper to map table names to Mongoose models
const mongoModelMap = {
  clients: ClienteMongo,
  payments: PagoMongo,
  loans: PrestamoMongo,
  // Add other mappings if needed:
  // users: UserMongo, // Assuming you have a UserMongo model
};
 */
class Models {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = db;
   // this.MongoModel = mongoModelMap[tableName]; // Get the corresponding Mongoose model
  }

  addColumn(column,query) {
    try {
      
      const columns = db.query(`PRAGMA table_info(${this.tableName})`, [], {
        type: "all",
      });
      //const columns = pragmaStmt.all();
      console.log(columns);
      const existe = columns.some((col) => col.name === column.trim());
      console.log(existe)
      if (!existe) {
        db.exec(`ALTER TABLE ${this.tableName} ADD COLUMN ${column.trim()} ${query};`);
        console.log(
          `Columna "${column}" agregada a la tabla "${this.tableName}".`
        );
      } else {
        console.log(
          `La columna "${column}" ya existe en la tabla "${this.tableName}".`
        );
      }
     
    } catch (error) {
      console.log(error)
    }
  }

  async insert(data) {
    ////console.log("data:----------------------------->",data);
    try {
      const query = `INSERT INTO ${this.tableName} (${Object.keys(data).join(
        ","
      )}) VALUES (${Object.values(data)
        .map(() => "?")
        .join(",")})`;
      const params = Object.values(data);

      ////console.log("query:----------------------------->",query);
      this.db.runQuery(query, params);
      logger.info(`Datos insertados en la tabla ${this.tableName}`);

      const lastIdResult = this.db.query(
        `SELECT id FROM ${this.tableName} ORDER BY id DESC LIMIT 1`
      );
      if (!lastIdResult || lastIdResult.length === 0) {
        throw new Error("Could not retrieve last inserted ID from SQLite.");
      }
      const sqliteId = lastIdResult[0].id;

      const resultForCaller = {
        id: sqliteId,
        ...data,
      };

      /* if (this.MongoModel) {
              try {
                  // Prepare data for MongoDB, ensuring sqlite_id is included
                  const mongoData = { ...data, sqlite_id: sqliteId };
                  // Remove the primary 'id' if it's the same as sqlite_id and your mongo schema uses a different _id
                  // Or adjust based on how your mongo schemas are structured, especially if 'id' from SQLite is not what you want as a direct field.
                  // For now, we assume 'data' contains fields that align well with Mongo schema, plus our new 'sqlite_id'.
                  
                  // If your SQLite 'id' might conflict with MongoDB's '_id' or other fields,
                  // you might want to explicitly map fields here.
                  // Example: const mappedData = { nickname: data.nickname, sqlite_id: sqliteId, ... };
                  
                  
                  const generarCodigoAcceso = () => {
                    return Math.floor(10000 + Math.random() * 90000).toString();
                  };
                  delete mongoData.user_id
                  const codigoAcceso = generarCodigoAcceso();
                  const createdDocument = await this.MongoModel.create({...mongoData, codigoAcceso});
                  logger.info(`Document created in MongoDB for ${this.tableName} with sqlite_id: ${sqliteId}, mongo_id: ${createdDocument._id}`);
                  ////console.log("MongoDB document created:", createdDocument);
              } catch (mongoError) {
                  logger.error(`Error creating document in MongoDB for ${this.tableName} (sqlite_id: ${sqliteId}):`, mongoError);
                  // Decide on error handling: throw, log, or specific recovery
              }
          }  */
      return resultForCaller;
    } catch (error) {
      logger.error(
        `Error al insertar datos en la tabla ${this.tableName}:`,
        error
      );
      throw error;
    }
  }

  getById(id) {
    return this.db.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
  }
  getOne(filter) {
    // console.log("filter:----------------------------->",filter)
    const query = `SELECT ${filter.select ? filter.select : "*"}
             FROM ${this.tableName}
              ${filter.joins ? filter.joins : ""}
            ${filter.where ? `WHERE ${filter.where}` : ""}
            
            LIMIT 1
            `;
    //console.log("query1:----------------------------->",query)
    return this.db.query(query, filter.params);
  }

  getAll(filter) {
    //console.log("filter:----------------------------->",filter)
    const query = `SELECT ${filter.select ? filter.select : "*"} FROM ${
      this.tableName
    } ${filter.joins ? filter.joins : ""} 
            ${filter.where ? `WHERE ${filter.where}` : ""} 
            ${filter.groupBy ? `GROUP BY ${filter.groupBy} ` : ""} 
            ${filter.orderBy ? `ORDER BY ${filter.orderBy} ` : ""} 

            ${filter.limit ? `LIMIT ${filter.limit}` : ""}
            ${filter.offset ? `OFFSET ${filter.offset} ` : ""}
            `;
    console.log("query:----------------------------->", query);

    const result = this.db.query(query, filter.params);
    // //console.log("result:----------------------------->",result)
    return result;
  }

  /**
   * Actualiza un registro en la tabla SQLite y en MongoDB
   * @param {Object} data - Los datos a actualizar
   * @returns {Promise<Object>} - El resultado de la actualización en SQLite
   */
  async update(data) {
    logger.info(`Updating SQLite ${this.tableName} with data:`, data);
    const sqliteResult = this.db.query(
      `UPDATE ${this.tableName} SET
             ${Object.keys(data)
               .filter((key) => key !== "id")
               .map(
                 (key) =>
                   `${key} = ${
                     data[key] === "NULL" || data[key] === null
                       ? "NULL"
                       : `'${data[key]}'`
                   }`
               )
               .join(",")}
        WHERE id = '${data.id}'`,
      [],
      { type: "run" }
    ); // Ensure data.id is the SQLite ID

    /* if (this.MongoModel && data.id) { // data.id is the sqlite_id for matching
            try {
                // Prepare data for MongoDB update, excluding sqlite_id from $set if it's immutable or handled differently
                const updateData = { ...data };
                delete updateData.id; // Remove SQLite ID from the fields to be set

                const mongoUpdateResult = await this.MongoModel.findOneAndUpdate(
                    { sqlite_id: data.id }, // Match document by sqlite_id
                    { $set: updateData },
                    { new: true, upsert: false } // new: true to return the updated doc, upsert: false to not create if not found
                );
                if (mongoUpdateResult) {
                    logger.info(`Document updated in MongoDB for ${this.tableName} with sqlite_id: ${data.id}`);
                    //.log("MongoDB document updated:", mongoUpdateResult);
                } else {
                    logger.warn(`No document found in MongoDB for ${this.tableName} with sqlite_id: ${data.id} to update.`);
                    // Potentially create it if an update implies it should exist (upsert: true would handle this)
                }
            } catch (mongoError) {
                logger.error(`Error updating document in MongoDB for ${this.tableName} (sqlite_id: ${data.id}):`, mongoError);
            }
        } */
    return sqliteResult; // Or whatever the original update returned
  }

  /*
     
     */
  updateMany(data) {
    return this.db.query(
      `UPDATE ${this.tableName} SET
             ${Object.keys(data)
               .map(
                 (key) =>
                   `${key} = ${data[key] == "NULL" ? null : `'${data[key]}'`}`
               )
               .join(",")}
        WHERE id IN (${data.ids.map((id) => `'${id}'`).join(",")})`,

      [],
      { type: "run" }
    );
  }

  updateFilter(filter) {
    const query = `UPDATE ${this.tableName} SET ${Object.keys(filter.data)
      .map(
        (key) =>
          `${key} = ${
            filter.data[key] == "NULL" ? null : `'${filter.data[key]}'`
          }`
      )
      .join(",")}
        ${filter.where ? ` WHERE ${filter.where}` : ""}`;

    ////console.log("query:----------------------------->",query)
    return this.db.query(query, [], { type: "run" });
  }

  async delete(id) {
    logger.info(`Deleting from SQLite ${this.tableName} with id: ${id}`);
    const sqliteResult = this.db.query(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id],
      { type: "run" }
    );

    /*   if (this.MongoModel && id) {
            try {
                const mongoDeleteResult = await this.MongoModel.findOneAndDelete({ sqlite_id: id });
                if (mongoDeleteResult) {
                    logger.info(`Document deleted from MongoDB for ${this.tableName} with sqlite_id: ${id}`);
                    ////console.log("MongoDB document deleted:", mongoDeleteResult);
                } else {
                    logger.warn(`No document found in MongoDB for ${this.tableName} with sqlite_id: ${id} to delete.`);
                }
            } catch (mongoError) {
                logger.error(`Error deleting document in MongoDB for ${this.tableName} (sqlite_id: ${id}):`, mongoError);
            }
        } */
    return sqliteResult; // Or whatever the original delete returned
  }

  deleteQuery(data) {
    const query = `DELETE FROM ${this.tableName} WHERE ${
      data.where ? data.where : `id=${data.id}`
    }`;
    ////console.log("query:----------------------------->",query)
    return this.db.query(query, [], { type: "run" });
  }

  createTable(schema) {
    return this.db.createTable(this.tableName, schema);
  }
  getLastId() {
    return this.db.query(`SELECT MAX(id) FROM ${this.tableName}`);
  }
  getTotal() {
    return this.db.query(`SELECT COUNT(*) as total FROM ${this.tableName}`);
  }

  getLastId() {
    return this.db.query(
      `SELECT id as id FROM ${this.tableName} ORDER BY id DESC LIMIT 1`
    );
  }
}

module.exports = Models;
