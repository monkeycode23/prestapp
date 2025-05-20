const log = require('electron-log');
const { app } = require('electron');
const path = require('path');
const fs = require('fs');
// Configurar el logger
log.transports.file.resolvePathFn = () => path.join(app.getPath('userData'), 'logs/main.log');
log.transports.file.level = 'info';
log.transports.file.maxSize = 1024 * 1024 * 10; // 10MB
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}';



// Capturar errores no manejados
process.on('uncaughtException', (error) => {
   
    log.error('Error no manejado:', error);
});

process.on('unhandledRejection', (error) => {
   
    log.error('Promesa rechazada no manejada:', error);
});

// Exportar funciones de logging
module.exports = {
    info: (...params) => {
        log.info(...params);
        if (!app.isPackaged) console.log(...params);
    },
    error: (...params) => {
        log.error(...params);
        if (!app.isPackaged) console.error(...params);
    },
    warn: (...params) => {
        log.warn(...params);
        if (!app.isPackaged) console.warn(...params);
    },
    debug: (...params) => {
        log.debug(...params);
        if (!app.isPackaged) console.debug(...params);
    }
};