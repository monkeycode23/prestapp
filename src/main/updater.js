const {autoUpdater} = require('electron-updater');
const { app } = require('electron');
const logger = require('./logger');

function checkForUpdates() {
    // Solo ejecutar el actualizador si la app está empaquetada
   /*  if (!app.isPackaged) {
      logger.info('Saltando verificación de actualizaciones en modo desarrollo');
      return;
    } */ 
  
    try { 
      autoUpdater.logger = logger;
      autoUpdater.checkForUpdatesAndNotify();
  
      autoUpdater.on('error', (err) => {
        logger.error('Error en actualización:', err);
        // Enviar un mensaje al proceso de renderizado
        mainWindow.webContents.send('update-error', err.message);
    });
    
      autoUpdater.on('update-available', (info) => {
        logger.info('Actualización disponible:', info);
        // Enviar un mensaje al proceso de renderizado
        mainWindow.webContents.send('update-available', info);
    });
    
    autoUpdater.on('update-downloaded', (info) => {
        logger.info('Actualización descargada:', info);
        // Enviar un mensaje al proceso de renderizado
        mainWindow.webContents.send('update-downloaded', info);
    });
    
    autoUpdater.on('download-progress', (progressObj) => {
        let log_message = `Descargando actualización: ${progressObj.percent}%`;
        log_message += ` (${progressObj.transferred} de ${progressObj.total})`;
        logger.info(log_message);
        // Enviar el progreso al proceso de renderizado
        mainWindow.webContents.send('download-progress', progressObj);
    });
    
    } catch (error) {
      logger.error('Error al inicializar el actualizador:', error);
    }
  }

  
  module.exports = { checkForUpdates };