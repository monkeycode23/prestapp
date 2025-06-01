const { ipcMain, BrowserWindow } = require('electron');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');

ipcMain.handle('iniciar-exportacion', async () => {
  const DB_PATH = path.join(__dirname, 'mi_base.sqlite3');
  const OUTPUT_DIR = path.join(__dirname, 'exported');

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  const db = new sqlite3.Database(DB_PATH);

  const obtenerTablas = () =>
    new Promise((resolve, reject) => {
      db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`, (err, tables) => {
        if (err) reject(err);
        else resolve(tables.map(t => t.name));
      });
    });

  const exportarTabla = (tableName) =>
    new Promise((resolve, reject) => {
      db.all(`SELECT * FROM ${tableName}`, async (err, rows) => {
        if (err) return reject(err);

        // Exportar JSON
        fs.writeFileSync(path.join(OUTPUT_DIR, `${tableName}.json`), JSON.stringify(rows, null, 2), 'utf-8');

        // Exportar CSV
        if (rows.length > 0) {
          const headers = Object.keys(rows[0]).map(key => ({ id: key, title: key }));
          const csvWriter = createObjectCsvWriter({
            path: path.join(OUTPUT_DIR, `${tableName}.csv`),
            header: headers
          });
          await csvWriter.writeRecords(rows);
        }

        // Emitir mensaje de progreso al render
        const ventana = BrowserWindow.getAllWindows()[0];
        ventana.webContents.send('progreso-exportacion', `✅ ${tableName} exportado`);
        resolve();
      });
    });

  try {
    const tablas = await obtenerTablas();
    for (const tabla of tablas) {
      const ventana = BrowserWindow.getAllWindows()[0];
      ventana.webContents.send('progreso-exportacion', `Exportando ${tabla}...`);
      await exportarTabla(tabla);
    }

    db.close();
    const ventana = BrowserWindow.getAllWindows()[0];
    ventana.webContents.send('progreso-exportacion', `🎉 ¡Exportación completada!`);
    return { success: true };
  } catch (error) {
    const ventana = BrowserWindow.getAllWindows()[0];
    ventana.webContents.send('progreso-exportacion', `❌ Error: ${error.message}`);
    return { success: false };
  }
});
