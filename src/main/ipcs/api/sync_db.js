const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Cliente = require("./models/cliente.js");
const Prestamo = require("./models/prestamo.js");
const Pago = require("./models/pago.js");
const User = require('./models/user.js');
const { BrowserWindow } = require('electron');

//import { generateAccessCode } from './generate_access_codes.cjs';
const bcrypt = require('bcrypt')
const path = require('path');


const syncDB = async function(event) {
 
 
    const win = BrowserWindow.fromWebContents(event.sender);


dotenv.config();

const MONGODB_URI =  process.env.MONGODB_URI ||  "mongodb://localhost:27017/prestaweb";
/* 
const statusMap = {
  active: "En curso",
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
  paid: "Pagado",
  expired: "Vencido",
  cancelled: "Cancelado",
  "": "Pendiente",
  null: "Pendiente",
  undefined: "Pendiente",
};
const paymentIntervalMap = {
  monthly: "Mensual",
  weekly: "Semanal",
  biweekly: "Quincenal",
  daily: "Diario",
  "": "Mensual",
  null: "Mensual",
  undefined: "Mensual",
};

const pagoStatusMap = {
  pending: "Pendiente",
  processing: "Procesando",
  completed: "Completado",
  paid: "Completado",
  reimbursed: "Reembolsado",
  refunded: "Reembolsado",
  failed: "Fallido",
  cancelled: "Cancelado",
  Pagado: "Completado",
  Pendiente: "Pendiente",
  "": "Pendiente",
  null: "Pendiente",
  undefined: "Pendiente",
};

const paymentMethodMap = {
  cash: "Efectivo",
  transfer: "Transferencia",
  card: " Tarjeta",
  check: "Cheque",
  mercadopago: "Mercado Pago",
  other: "Otro",
  "": "Efectivo",
  null: "Efectivo",
  undefined: "Efectivo",
}; */

function safe(val, def) {
  return val === null  || val === undefined || !val ? def : val;
}

async function migrateData(win) {
  try {
    win.webContents.send('sync-db-status', 'Iniciando migración...');
    console.log("Iniciando migración...");
    // Conectar a MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Conectado a MongoDB");
    win.webContents.send('sync-db-status', 'Conectado a MongoDB');
    console.log("cliente",Cliente)
    console.log("prestamo",Prestamo)
    console.log("pago",Pago)
    console.log("user",User)
    //process.exit()
    // Limpiar colecciones existentes
    await Cliente.deleteMany({});
    await Prestamo.deleteMany({});
    await Pago.deleteMany({});
    await User.deleteMany({});
    console.log("Colecciones limpiadas");
    win.webContents.send('sync-db-status', 'Colecciones limpiadas');
    // Conectar a SQLite


    const dbPath = process.env.NODE_ENV === "development"

    ? './'
    : process.resourcesPath;

    win.webContents.send('sync-db-status', 'Conectando a SQLite '+dbPath);
    console.log("DB PATH :----------------------------->",dbPath)
    const fullPath = path.join(dbPath, "test.db");
    console.log("FULL PATH :----------------------------->",fullPath)
    const db = await open({
      filename: fullPath,
      driver: sqlite3.Database,
    });
    console.log("Conectado a SQLite");
    win.webContents.send('sync-db-status', 'Conectado a SQLite');

    // Mapa para almacenar las referencias de IDs
    const idMap = {
      clients: new Map(),
      loans: new Map(),
    };
 /*    const q = await db.exec(`DELETE FROM payments
WHERE loan_id IN (
  SELECT id FROM loans WHERE client_id = 211
);`) */

/* const q = await db.exec(`DELETE FROM payments
WHERE loan_id IN (
  SELECT id FROM loans
  WHERE client_id NOT IN (SELECT id FROM clients)
);`)

const q2 = await db.exec(`DELETE FROM loans
WHERE client_id NOT IN (SELECT id FROM clients);
`)
console.log(q)
process.exit() */

async function  addColumn(tableName,column,query) {
  try {
    
    const columns = await db.all(`PRAGMA table_info(${tableName})`);
    //const columns = pragmaStmt.all();
    console.log(columns);
    const existe = columns.some((col) => col.name === column.trim());
    console.log(existe)
    if (!existe) {
      db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${column.trim()} ${query};`);
      console.log(
        `Columna "${column}" agregada a la tabla "${tableName}".`
      );
    } else {
      console.log(
        `La columna "${column}" ya existe en la tabla "${tableName}".`
      );
    }
   
  } catch (error) {
    console.log(error)
  }
}

try {


addColumn("clients","access_code","TEXT")
  
  const users = await db.all("SELECT * FROM users ")
  win.webContents.send('sync-db-status', 'Usuarios encontrados '+users.length)
console.log(`Usuarios encontrados ${users.length} \n`)

if(users.length){

    win.webContents.send('sync-db-status', 'Migrando usuarios')
  for (const [i, user] of users.entries()) {
      console.log(`Migrando usuario ${user.username}}`)
      const mUser = new User({
        username:user.username,
        password:await bcrypt.hash(user.username,10),
        email:user.email,
        sqlite_id:user.id.toString(),
        role:user.rol,
        status:user.status
      })

      
      mUser.save()

      console.log("Usuario "+user.username+" migrado")
      win.webContents.send('sync-db-status', 'Usuario '+user.username+" migrado")
  }

}
} catch (error) {
  win.webContents.send('sync-db-status', 'Error durante la migración: '+error)
  console.error("Error durante la migración:", error);
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  process.exit(1);
}




/* const q = await db.exec(`UPDATE loans SET status='active' WHERE status not in ('active','completed','canceled')`)
console.log("pagos de leo eliminados") */

const q = await db.exec(`UPDATE payments SET paid_date=NULL WHERE paid_date = 'null' `)

console.log("pagos de leo eliminados")
    // Migrar Clientes
    win.webContents.send('sync-db-status', 'Migrando clientes')
    const clients = await db.all("SELECT * FROM clients");
    console.log(`Encontrados ${clients.length} clientes para migrar`);
    win.webContents.send('sync-db-status', 'Encontrados '+clients.length+" clientes para migrar")
    for (const [i, client] of clients.entries()) {
        win.webContents.send('sync-db-status', 'Migrando cliente '+client.nickname)
      let codigoAcceso;
      let isUnique = false;
      while (!isUnique) {
        codigoAcceso = String(Math.floor(10000 + Math.random() * 90000));
        const existingClient = await Cliente.findOne({ codigoAcceso });
        if (!existingClient) {
          isUnique = true;
        }
      }

      if(!client.access_code){
        await db.exec(`UPDATE clients SET access_code='${codigoAcceso}',user_id=${1} WHERE id=${client.id} `)
      }


      const cliente = new Cliente({
        sqlite_id: String(client.id),
        nickname: safe(client.nickname, "random"+client.id),
        name: safe(client.name, ""),
        lastname: safe(client.lastname, ""),
        email: safe(client.email, ""),
        phone: safe(client.phone, ""),
        address: safe(client.address, ""),
        status:
          client.status && String(client.status).trim() !== ""
            ? String(client.status).trim()
            : "activo",
        gender: safe(client.gender, ""),
        birthdate: safe(client.birthdate, ""),
        document_id: safe(client.document_id, 0),
        cbu: safe(client.cbu, "" + i),
        alias: safe(client.alias, ""),
        codigoAcceso:client.access_code ? client.access_code : codigoAcceso,
        loans: [],
        created_at: client.created_at,
        updated_at: client.updated_at,
      });

      const savedCliente = await cliente.save();

      console.log("cliente "+savedCliente.nickname + " creado")
      //idMap.clients.set(client.id, savedCliente._id);

      /* if ((i + 1) % 50 === 0 || i === clients.length - 1) {
        console.log(`Migrados ${i + 1} / ${clients.length} clientes`);
      } */
      // Migrar Préstamos
      win.webContents.send('sync-db-status', 'Migrando préstamos')
      const loans = await db.all(
        "SELECT * FROM loans WHERE client_id=" + client.id
      );
      console.log(`Encontrados ${loans.length} préstamos para migrar`);
      win.webContents.send('sync-db-status', 'Encontrados '+loans.length+" préstamos para migrar de "+client.nickname)
     
      const prestamos_ids =[]

      for (const [i, loan] of loans.entries()) {
        const installmentNumber = safe(loan.installment_number, 1);
        const prestamo = new Prestamo({
          sqlite_id: String(loan.id),
          label: safe(loan.label, ""),
          client_id: savedCliente._id,
          amount: safe(loan.amount, 0),
          gain: safe(loan.gain, 0),
          installment_number: installmentNumber < 1 ? 1 : installmentNumber,
          total_amount: safe(loan.total_amount, 0),
          loan_date: safe(loan.loan_date, new Date()),
          generate_payments_date: safe(loan.generate_payments_date, new Date()),
          interest_rate: safe(loan.interest_rate, 0),
          term: safe(loan.term, 1),
          status:loan.status,
          payment_interval: loan.payment_interval,
          total_paid: safe(loan.total_paid, 0),
          remaining_amount: safe(loan.remaining_amount, loan.amount || 0),
          next_payment_date: safe(loan.next_payment_date, null),
          last_payment_date: safe(loan.last_payment_date, null),
          payment_due_day: safe(loan.payment_due_day, null),
          late_fee_rate: safe(loan.late_fee_rate, 0),
          late_fee_amount: safe(loan.late_fee_amount, 0),
          notes: safe(loan.notes, ""),
          payments: [],
          created_at: loan.created_at,
          updated_at: loan.updated_at,
        });

        const savedPrestamo = await prestamo.save();
        //idMap.loans.set(loan.id, savedPrestamo._id);
        console.log("Prestamo "+savedPrestamo.label+" creado ")

        // Actualizar el cliente con la referencia al préstamo
        prestamos_ids.push(savedPrestamo._id.toString())

       /*  if ((i + 1) % 50 === 0 || i === loans.length - 1) {
          console.log(`Migrados ${i + 1} / ${loans.length} préstamos`);
        } */
        // Migrar Pagos
        win.webContents.send('sync-db-status', 'Migrando pagos')
        const payments = await db.all("SELECT * FROM payments where loan_id="+loan.id);
        console.log(`Encontrados ${payments.length} pagos para migrar`);
        win.webContents.send('sync-db-status', 'Encontrados '+payments.length+" pagos para migrar de "+savedPrestamo.label)
        const payments_ids =[] 

        for (const [i, payment] of payments.entries()) {
          const installmentNumber = safe(payment.installment_number, 1);
          const pago = new Pago({
            sqlite_id: String(payment.id),
            label: safe(payment.label, ""),
            loan_id: savedPrestamo._id,
            gain: safe(payment.gain, 0),
            total_amount: safe(payment.total_amount, 0),
            payment_date: safe(payment.payment_date, new Date()),
            net_amount: safe(payment.net_amount, 0),
            amount: safe(payment.amount, 0),
            status:payment.status,
            paid_date: safe(payment.paid_date, null),
            incomplete_amount: safe(payment.incomplete_amount, 0),
            payment_method:payment.payment_method ? payment.payment_method : "cash",
            due_date: safe(
              payment.due_date,
              payment.payment_date || new Date()
            ),
            installment_number: installmentNumber < 1 ? 1 : installmentNumber,
            late_fee: safe(payment.late_fee, 0),
            late_days: safe(payment.late_days, 0),
            receipt_number: safe(payment.receipt_number, ""),
            transaction_id: safe(payment.transaction_id, ""),
            notes: safe(payment.notes, ""),
            created_at: payment.created_at,
            updated_at: payment.updated_at,
          });
          const savedPago = await pago.save();

          payments_ids.push(savedPago._id.toString())

          console.log("Pago "+savedPago.label+" creado  prestamo"+savedPrestamo.label+" cliente "+savedCliente.nickname)

        }
        win.webContents.send('sync-db-status', 'Pagos creados '+payments_ids.length)
        
        if(payments_ids.length){
            win.webContents.send('sync-db-status', 'Pusheando pagos al prestamo '+savedPrestamo.label)
            const objectIds = payments_ids.map(id => new mongoose.Types.ObjectId(id));

            await Prestamo.findByIdAndUpdate(savedPrestamo._id ,{
                $push: { payments: {$each:objectIds} },
              });
              console.log("Pagos pusheados al restamo "+savedPrestamo.label+" del cliente "+savedCliente.nickname)
        }
        win.webContents.send('sync-db-status', 'Pagos pusheados al prestamo '+savedPrestamo.label)
        //win.webContents.send('sync-db-status', 'Pagos pusheados al prestamo '+savedPrestamo.label)
        
      }
      if(prestamos_ids.length){
        win.webContents.send('sync-db-status', 'Pusheando prestamos al cliente '+savedCliente.nickname)
        const objectIds = prestamos_ids.map(id => new mongoose.Types.ObjectId(id));

          await Cliente.findByIdAndUpdate(savedCliente._id, {
            $push: { loans: {$each:objectIds} },
          });
          console.log("Prestamos pusheados al cliente "+savedCliente.nickname)
          win.webContents.send('sync-db-status', 'Prestamos pusheados al cliente '+savedCliente.nickname)
      }

      //console.log("Préstamos migrados exitosamente");
    }
    //console.log("Clientes migrados exitosamente");

    //console.log("Pagos migrados exitosamente");

    // Cerrar conexiones
    await db.close();
    await mongoose.connection.close();
    return {type:"success",message:"Migración completada exitosamente"}
    console.log("Migración completada exitosamente");
  } catch (error) {
    console.error("Error durante la migración:", error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    return {type:"error",message:"Error durante la migración:"+error}
    //process.exit(1);
  }
}

return await migrateData(win);


}




module.exports = syncDB;
