const Database = require('better-sqlite3');
const path = require('path');
//... existing code ...

function generateCSV(dbname) {

 
    const Dbpath =path.join(process.env.NODE_ENV === "development"
        ? './': process.resourcesPath,dbname) 
   

  const db = new Database(Dbpath, { readonly: true });
  const query = 'SELECT * FROM tu_tabla'; // Cambia 'tu_tabla' por el nombre de tu tabla
  let csvContent = '';

  try {
    const rows = db.prepare(query).all();

    // Generar encabezados
    const headers = Object.keys(rows[0]).join(',') + '\n';
    csvContent += headers;

    // Generar filas
    rows.forEach(row => {
      const values = Object.values(row).join(',');
      csvContent += values + '\n';
    });
    // Crear el archivo CSV en la carpeta de descargas
    const downloadsPath = app.getPath('downloads');
    const filePath = path.join(downloadsPath, dbname+'.csv');
    fs.writeFileSync(filePath, csvContent);

    return filePath; // Devuelve la ruta del archivo
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error.message);
    return null; // O maneja el error de otra manera
  } finally {
    db.close();
  }

 
}



module.exports = {
    generateCSV
}
