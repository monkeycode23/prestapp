const { app, BrowserWindow,ipcMain } = require('electron');
const path = require('path');
const logger = require('./logger.js');
const {checkForUpdates} = require('./updater');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
    
    
dotenv.config();

// MongoDB Connection
 const MONGO_URI =process.env.MONGODB_URI || 'mongodb://localhost:27017/prestaweb'; // Use environment variable or placeholder

/* mongoose.connect(MONGO_URI)
  .then(() => {
    logger.info('MongoDB connected successfully');
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    logger.error('MongoDB connection error:', err);
    console.error('MongoDB connection error:', err);
    // Optionally, you might want to quit the app or show an error to the user
    // if MongoDB connection is critical
  });
 */
/*   const models = require("./storage/mongo_models");


 // / 🔁 Función auxiliar para obtener el modelo dinámicamente
function getModel(name) {
  const model = models[name];
  if (!model) throw new Error(`Modelo "${name}" no encontrado.`);
  return model;
}
  */


const syncDB = require("./ipcs/api/sync_db");
ipcMain.handle("sync-db", syncDB);

/* 

 ipcMain.on('check-for-updates', () => {
    checkForUpdates();
});   
 
 */
const SECRET_KEY = process.env.JWT_SECRET || "prestaweb-secret-key"; // ¡NO compartas esto con el frontend!

ipcMain.handle("tokens", async (_, {func,data }) => {
  // Simulación de login real
  try {
  if(func=="generate"){
    const token = jwt.sign(
      data,
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    return token;

  }
  if (func=="decode") {
      const decoded = jwt.decode(data,SECRET_KEY)
      return  decoded  
    } 

  } catch (error) {
    console.log(error)
  }
});
 
const bcrypt = require('bcrypt');

ipcMain.handle('hash-password', async (event, password) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
});

ipcMain.handle('compare-password', async (event, password,hash) => {
  const result = await bcrypt.compare(password, hash);
  return result;
});

const DatabaseIpcMain = require('./ipcs/database/ipcmain');
ipcMain.handle('database', DatabaseIpcMain);

/* const MongoIpcMain = require('./ipcs/mongo/ipcmain');
ipcMain.handle('mongo', MongoIpcMain);
 */
/*
*/
const {generateCSV} = require('./helpers/index');
  
 ipcMain.handle('download-csv', async (event) => {
  const csvData = await generateCSV(); // Implementa esta función para generar tu CSV
  const downloadsPath = app.getPath('downloads');
  const filePath = path.join(downloadsPath, 'datos.csv');

  fs.writeFileSync(filePath, csvData);
  return filePath; // Devuelve la ruta del archivo
}); 


/* const {parseDatabase} = require('./helpers/parseDatabase');

// Manejar un evento IPC desde el renderer
ipcMain.handle('upload-file', async(event, filePath) => {
  console.log(`Archivo recibido desde el renderer: ${filePath}`);
  // Aquí puedes procesar el archivo, guardarlo, etc.
 
  async function name(event,filePath) {
    const r = await parseDatabase(event,filePath);
    console.log("r------------>",r);
  }
  await name(event,filePath);

  //const filePath = path.join(downloadsPath, 'datos.csv');

  //event.reply('file-received', `Archivo ${filePath} recibido correctamente`);
});
 */
 
  let mainWindow;

  const baseUrl = "http://localhost:3005";

  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      webPreferences: {
        preload: path.join(__dirname, 'preload/index.js'), // Cargar el archivo de preload
        nodeIntegration: true,
        contextIsolation: true, // Esto debería ser true en producción
        webSecurity: true, // Activar en producción por seguridad
        nodeIntegrationInWorker: true,
        enableRemoteModule: true // Deprecado en versiones nuevas de Electron
      }
    }); 
 
    // Determina qué cargar basado en el ambiente
    if (!app.isPackaged) {
      // Ambiente de desarrollo - Carga desde webpack dev server
      mainWindow.loadURL('http://localhost:3005');
      // Abre las herramientas de desarrollo
     // mainWindow.webContents.openDevTools();
      logger.info('Cargando desde servidor de desarrollo');
    } else {
      // Ambiente de producción - Carga el archivo compilado
      mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
      logger.info('Cargando desde archivo local');
    }
  
    // Test de base de datos
  

    // Emitido cuando la ventana es cerrada
    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }

  
  app.whenReady().then(createWindow)
  /* .then(checkForUpdates); */
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });