const { app, BrowserWindow,ipcMain } = require('electron');
const path = require('path');
const logger = require('./logger.js');
const {checkForUpdates} = require('./updater');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
    
   
dotenv.config();

// MongoDB Connection
const MONGO_URI =/*  process.env.MONGODB_URI || */ 'mongodb://localhost:27017/prestaweb'; // Use environment variable or placeholder

mongoose.connect(MONGO_URI)
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
 
  const models = require("./storage/mongo_models");


 // / 🔁 Función auxiliar para obtener el modelo dinámicamente
function getModel(name) {
  const model = models[name];
  if (!model) throw new Error(`Modelo "${name}" no encontrado.`);
  return model;
}
 
function recursiveIdSanitization(data, populate) {
  if (!populate || !data) return;

  const populateArray = Array.isArray(populate) ? populate : [populate];

  for (const pop of populateArray) {
    const path = pop.path;
    const nestedPopulate = pop.populate;

    const value = data[path];

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item && item._id && typeof item._id !== 'string') {
          item._id = item._id.toString();
        }
        if (nestedPopulate) {
          recursiveIdSanitization(item, nestedPopulate);
        }
      });
    } else if (value && typeof value === 'object') {
      if (value._id && typeof value._id !== 'string') {
        value._id = value._id.toString();
      }
      if (nestedPopulate) {
        recursiveIdSanitization(value, nestedPopulate);
      }
    }
  }
}

/* function sanitizeMongoDoc(doc) {
  if (Array.isArray(doc)) {
    return doc.map(sanitizeMongoDoc);
  }

  if (doc && typeof doc === "object") {
    const sanitized = {};

    for (const key in doc) {
      if (key === "__v") continue; // opcional: eliminar __v
      const value = doc[key];

      // Convertir _id a string
      if (key === "_id" && value && typeof value === "object" && typeof value.toString === "function") {
        sanitized[key] = value.toString();
      } else {
        sanitized[key] = sanitizeMongoDoc(value);
      }
    }

    return sanitized;
  }

  return doc;
}
 */
ipcMain.handle("model-findOne", async (_, { modelName, query,populate }) => {

  try {
   
  const Model = getModel(modelName);
  console.log(Model)
  const q =Model.findOne(query)
  if(populate) q.populate(populate)
  

  
  let res = await q.lean();

  console.log(res)
  console.log(query)

  if(res){
    res._id = res._id.toString()
   /*  function recursiveIdSanitization(path,populate){
      if(!path.length) return path
      
      else [
        path.map((path)=>{
          return {
            ...path,
            _id:path._id.toString(),
            [populate.path]:recursiveIdSanitization(path[populate.path],populate.populate)
          }
        })
      ]
      
    }

    if(Array.isArray(res[populate.path]) && res[populate.path].length){

      recursiveIdSanitization(res[populate.path],populate)
    } */

    //recursiveIdSanitization(res, populate);

    return res ;
  }
  return null
   
  } catch (error) {
    console.log(error)
    return null
  }
});
// 🧩 Handlers genéricos
ipcMain.handle("model-findAll", async (_, {modelName,query}) => {
  const Model = getModel(modelName);
  return await Model.find(query).lean();
});

ipcMain.handle("model-create", async (_, { modelName, data }) => {
  try {
    const Model = getModel(modelName);
  const doc = new Model(data);
  await doc.save();
 
  const plain = doc.toObject();
    plain._id = plain._id.toString(); // Forzar a string

    return plain;
  } catch (error) {
    console.log(error)

    return error.code
  }
}); 

ipcMain.handle("model-update", async (_, { modelName, id, data }) => {
  const Model = getModel(modelName);
  const updated = await Model.findByIdAndUpdate(id, data, { new: true }).lean();
  return updated;
});

ipcMain.handle("model-delete", async (_, { modelName, id }) => {

  try {
    const Model = getModel(modelName);
  const res = await Model.deleteOne({_id:id});
 

  return { success: true };
  } catch (error) {
    console.log(error)
    return {success:false}
  }
  
});
/* 
 ipcMain.on('check-for-updates', () => {
    checkForUpdates();
});   
 
 */
const SECRET_KEY = "tu_clave_secreta_super_segura"; // ¡NO compartas esto con el frontend!

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
      const decoded = jwt.decode(data)
      return  decoded  
    } 

  } catch (error) {
    console.log(error)
  }
});
 
const DatabaseIpcMain = require('./ipcs/database/ipcmain');
ipcMain.handle('database', DatabaseIpcMain);

const MongoIpcMain = require('./ipcs/mongo/ipcmain');
ipcMain.handle('mongo', MongoIpcMain);

/*
const {generateCSV} = require('./helpers/index');
  
 ipcMain.handle('download-csv', async (event) => {
  const csvData = await generateCSV(); // Implementa esta función para generar tu CSV
  const downloadsPath = app.getPath('downloads');
  const filePath = path.join(downloadsPath, 'datos.csv');

  fs.writeFileSync(filePath, csvData);
  return filePath; // Devuelve la ruta del archivo
}); */


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

  const baseUrl = "http://localhost:3000";

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
      mainWindow.loadURL('http://localhost:3000');
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