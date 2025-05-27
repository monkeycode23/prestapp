
const { contextBridge, ipcRenderer } = require('electron');
const database = require('../ipcs/database');

const mongoObjects = require('../ipcs/mongo')

/* 
    Expose the database to the preload set invoke methods for database
*/

contextBridge.exposeInMainWorld('database', {
    models: {
        ...database
    }
  });


  
  contextBridge.exposeInMainWorld('mongo', {
    findOne: (modelName,query) => ipcRenderer.invoke("model-findOne", {modelName,query}),

    findAll: (modelName,query) => ipcRenderer.invoke("model-findAll", {modelName,query}),
    create: (modelName, data) => ipcRenderer.invoke("model-create", { modelName, data }),
    update: (modelName, id, data) => ipcRenderer.invoke("model-update", { modelName, id, data }),
    delete: (modelName, id) => ipcRenderer.invoke("model-delete", { modelName, id }),
  });

  contextBridge.exposeInMainWorld('jwt', {
    generate: (data) => ipcRenderer.invoke("tokens", {func:"generate",data}),
    decode: (token) => ipcRenderer.invoke("tokens", { func:"decode", token }),
    
  });

  contextBridge.exposeInMainWorld('electron', {
    exportDatabaseToCSV: (dbname) => ipcRenderer.send('export-csv', dbname),
     
    uploadFile: (file) => {
      const reader = new FileReader();
  
      reader.onload = async () => {
        // Convertir el archivo a un formato que podamos enviar a Electron (Buffer)
        const fileData = reader.result;
  
        // Enviar el archivo al proceso principal de Electron
        try {
          const result =await ipcRenderer.invoke('upload-file', {
            name: file.name,
            data: Buffer.from(fileData), // Enviamos el archivo como un Buffer
          });
  
          if (result.success) {
            alert(`Archivo guardado en: ${result.path}`);
          } else {
            alert('Error al guardar el archivo');
          }
        } catch (error) {
          console.error('Error al enviar el archivo:', error);
        }
      };
  
      reader.readAsArrayBuffer(file); // Leemos el archivo como ArrayBuffer para enviarlo
    },
    onFileReceived: (callback) => ipcRenderer.on('file-received', callback)
  });

  contextBridge.exposeInMainWorld('updater', {
    checkForUpdates: () => ipcRenderer.send('check-for-updates'),
    onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
    onDownloadProgress: (callback) => ipcRenderer.on('download-progress', callback),
    onUpdateError: (callback) => ipcRenderer.on('update-error', callback), // Agregado para manejar errores
    downloadUpdate: () => ipcRenderer.send('download-update'),
    quitAndInstall: () => ipcRenderer.send('quit-and-install'),
});






