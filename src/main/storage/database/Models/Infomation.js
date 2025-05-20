const Database = require('../database');
const Models = require('./Models');


class Infomation extends Models{

    constructor() {
        super();
            this.tableName = "infomation";
        this.createTable();
      }

      createTable(){

        this.db.createTable(this.tableName,`
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT ,
            lastname TEXT ,
            email TEXT ,
            phone TEXT ,
            address TEXT,
            status TEXT ,
            gender TEXT ,
            birthdate TEXT ,
            document_id INTEGER,
            cbu TEXT,
            alias TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER,
            client_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, 
            
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE`);
      } 
    

    


}


module.exports = Infomation;
