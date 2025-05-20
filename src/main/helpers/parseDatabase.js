
const { ipcMain } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const os = require('os');
const db = require("../storage/database/database")
const app = require('electron').app;


async function parseDatabase(event,dbfile){



    try {

        db.runQuery(`UPDATE loans SET interest_rate ='30'  WHERE 1=1`, [ ])


        //db.runQuery(`UPDATE payments SET status ='paid'  WHERE status = 'payed'`, [ ])

   /*      console.log("dbfile------------>",dbfile);
        const filePath = path.join(app.getPath('userData'),"database.db"); // Mueve el archivo al directorio de usuario de Electron
        
        console.log("filePath------------>",filePath);
        fs.writeFileSync(filePath, dbfile.data); // Guarda el archivo en el directorio adecuado
        

        const newDb = new sqlite3.Database(filePath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
              console.error('Error al abrir la base de datos recibida:', err);
              return;
            }
            console.log('Base de datos recibida abierta');
          });
 */

          /* newDb.all('SELECT * FROM clients', (err, rows) => {
            if (err) {
              console.error('Error al leer la tabla de la base de datos recibida:', err);
              return;
            }
    
            rows.forEach((row) => {
                console.log(row);
                db.runQuery("INSERT INTO clients (id, nickname) VALUES (?, ?)", [row.id,row.nickname],{type:"run"});
                console.log('Datos leídos correctamente');
            });
          });
 */


      /*      newDb.all('SELECT * FROM loans', (err, rows) => {
            if (err) {
              console.error('Error al leer la tabla de la base de datos recibida:', err);
              return;
            }


            db.runQuery(`DELETE FROM loans`, [ ])
            for (let index = 0; index < rows.length; index++) {
                const row = rows[index];
                db.runQuery(`INSERT INTO loans (id,
                    label,
                    amount,
                    total_amount,
                    interest_rate,
                    installment_number,
                    client_id,
                    status,
                    gain,
                    loan_date,
                    generate_payments_date,
                    payment_interval
                    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, [
                        row.id,
                        row.label,
                        row.amount,
                        row.amount+row.gains,
                        row.interest_percentage,
                        row.installments,
                        row.client_id,
                        row.state,
                        row.gains,
                        row.aproved_date,
                        row.aproved_date,
                        row.payment_interval,
                        ],{type:"run"});
                
            }
            
            console.log("rows------------>",rows.length);
            })
             */

        //console.log("rows------------>",rows.length);
          /*   rows.forEach((row) => {
                console.log(row);
                db.runQuery(`INSERT INTO loans (id,
                    label,
                    amount,
                    total_amount,
                    interest_rate,
                    installment_number,
                    client_id,
                    status,
                    gain,
                    loan_date,
                    generate_payments_date,
                    payment_interval
                    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, [
                        row.id,
                        row.label,
                        row.amount,
                        row.amount+row.gains,
                        row.interest_percentage,
                        row.installment_number,
                        row.client_id,
                        row.state,
                        row.gains,
                        row.aproved_date,
                        row.aproved_date,
                        row.payment_interval,
                        ],{type:"run"});
                console.log('Datos leídos correctamente');
            });
    
  */
        
     
     /*      newDb.all('SELECT * FROM payments', (err, rows) => {
            if (err) {
              console.error('Error al leer la tabla de la base de datos recibida:', err);
              return;
            }

            db.runQuery(`DELETE FROM payments`, [ ])
    
   
                        
            for (let index = 0; index < rows.length; index++) {
                const row = rows[index];
                
                let payment_date = new Date(row.payment_date)

                payment_date.setFullYear(2025)

                let year = payment_date.getFullYear();
                let month = String(payment_date.getMonth() + 1).padStart(2, '0');  // Mes con 2 dígitos
                let day = String(payment_date.getDate()).padStart(2, '0');  // Día con 2 dígitos

                payment_date = `${year}-${month}-${day}`

                db.runQuery(`INSERT INTO payments (id,
                    label,
                    loan_id,
                    amount,
                    payment_date,
                    status,
                    net_amount,
                    paid_date,
                    incomplete_amount,
                    status, 
                    gain) VALUES (?,?,?,?,?,?,?,?,?,?,?)`, [
                        row.id,
                        row.label,
                        row.loan_id,
                        row.amount,
                        payment_date,
                        row.state,
                        row.net_amount,
                        row.payed_date,
                        row.incomplete_amount,
                        row.state,
                        row.gains],{type:"run"});
                    }
           

               
            
              

        })

 */

    } catch (error) {
        console.error('Error al guardar el archivo:', error);
        return { success: false, error };
      }

      
   // const data = fs.readFileSync(filePath, 'utf8');
 
  // Mover el archivo a la carpeta temporal
  /* fs.rename(filePath, destination, (err) => {
    if (err) {
      console.error('Error al mover el archivo:', err);
      event.reply('file-received', 'Error al mover el archivo');
      return;
    } */

    //console.log(`Archivo movido a: ${destination}`);
    //event.reply('file-received', `Archivo recibido y movido a ${destination}`);

    // Ahora que el archivo ha sido movido, podemos comenzar a leer la base de datos
    
   

/* 
    newDb.all('SELECT * FROM clients', (err, rows) => {
        if (err) {
          console.error('Error al leer la tabla de la base de datos recibida:', err);
          return;
        }

        rows.forEach((row) => {
            console.log(row);
            db.query("INSERT INTO clients (id, nickname) VALUES (?, ?)", [row.id,row.nickname]);
            console.log('Datos leídos correctamente');
        });
      }); */
    //return data;
}





// Recibir el archivo y moverlo (de forma opcional, si es necesario)


// Función para leer la base de datos y agregarla a la actual
function mergeDatabases(newDbPath) {
//  const mainDbPath = path.join(__dirname, 'main.db'); // Ruta de la base de datos principal

  // Abrir la base de datos principal
  /* const mainDb = new sqlite3.Database(mainDbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error('Error al abrir la base de datos principal:', err);
      return;
    }
    console.log('Base de datos principal abierta');
  });
 */
  // Abrir la base de datos recibida (archivo .db)
  

  // Aquí es donde realizarías la fusión de las bases de datos
  // Ejemplo: Copiar tablas de la base de datos recibida a la principal

  // Usar transacciones para garantizar que la fusión se haga correctamente
  mainDb.serialize(() => {
    // Abro una transacción para la base de datos principal
    mainDb.run('BEGIN TRANSACTION');

    // Seleccionar todas las filas de una tabla de la base de datos recibida
    newDb.all('SELECT * FROM some_table', (err, rows) => {
      if (err) {
        console.error('Error al leer la tabla de la base de datos recibida:', err);
        mainDb.run('ROLLBACK');
        return;
      }

      // Insertar las filas en la base de datos principal
      const stmt = mainDb.prepare('INSERT INTO some_table (column1, column2) VALUES (?, ?)');

      rows.forEach((row) => {
        stmt.run(row.column1, row.column2); // Insertar los valores en la tabla
      });

      stmt.finalize(); // Finalizar la declaración preparada

      // Completamos la transacción
      mainDb.run('COMMIT', (err) => {
        if (err) {
          console.error('Error al confirmar la transacción:', err);
        } else {
          console.log('Datos insertados correctamente');
        }
      });
    });
  });

  // Cerrar las bases de datos después de realizar la operación
  newDb.close();
  mainDb.close();
}



module.exports = {
    parseDatabase
}
