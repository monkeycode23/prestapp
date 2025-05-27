import React, { useState,useEffect } from 'react';
import { Moon, Sun, Upload, LayoutGrid, List, RefreshCw } from 'lucide-react'; // Ejemplo con íconos opcionales
import CommentThread from './Comments';

const Settings = () => {
  const [file, setFile] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [layout, setLayout] = useState('grid');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    // lógica para subir
  };

  const lokForUpdates = async () => {
    await window.updater.checkForUpdates();
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLayout = () => setLayout(layout === 'grid' ? 'list' : 'grid');


  useEffect(() => {
    
    console.log(window.mongo.models.Client.getModel())
  
    return () => {
      
    }
  }, [])
  

  return (
    <div className={`max-w-3xl mx-auto mt-10 p-6 rounded-xl shadow-md border ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <h1 className="text-3xl font-bold mb-6">⚙️ Configuración</h1>

      {/* Modo Oscuro */}
      <div className="flex items-center justify-between py-4 border-b">
        <div className="flex items-center gap-3">
          {darkMode ? <Moon /> : <Sun />}
          <span className="font-medium">Modo Oscuro</span>
        </div>
        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={darkMode}
          onChange={toggleDarkMode}
        />
      </div>

      {/* Layout */}
      <div className="flex items-center justify-between py-4 border-b">
        <div className="flex items-center gap-3">
          {layout === 'grid' ? <LayoutGrid /> : <List />}
          <span className="font-medium">Tipo de Layout</span>
        </div>
        <button
          onClick={toggleLayout}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Cambiar a {layout === 'grid' ? 'Lista' : 'Cuadrícula'}
        </button>
      </div>

      {/* Importar DB */}
      <div className="py-4 border-b">
        <div className="flex items-center gap-3 mb-2">
          <Upload />
          <h3 className="text-lg font-semibold">Importar Base de Datos</h3>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            className="bg-gray-100 text-sm rounded-md px-3 py-2 w-full sm:w-auto"
            type="file"
            onChange={handleFileChange}
          />
          <button
            onClick={handleUpload}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Subir Archivo
          </button>
        </div>
      </div>

      {/* Buscar Actualizaciones */}
      <div className="py-4">
        <div className="flex items-center gap-3 mb-2">
          <RefreshCw />
          <h3 className="text-lg font-semibold">Buscar Actualizaciones</h3>
        </div>
        <button
          onClick={lokForUpdates}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Buscar
        </button>
      </div>


      <CommentThread></CommentThread>

    </div>
  );
};

export default Settings;
