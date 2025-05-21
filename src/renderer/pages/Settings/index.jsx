import React, { useEffect,useState,createContext,useContext } from 'react';



const Settings= () => {

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const lokForUpdates = async () => {
    const res = await window.updater.checkForUpdates();
  };

  const handleUpload = async () => {
  };

 

  return (
    <>
    
        <div className='bg-white p-4 rounded-lg'>
            <h1 className='text-2xl font-bold'>Configuración</h1>


            <div className='flex flex-row justify-between p-4 border-t border-gray-200'
            >
              <h3 className='text-lg font-bold'>Importar Base de datos</h3>
              <div className='flex flex-row justify-between'>
                <input className='bg-gray-100 p-2 rounded-md' type="file" name="" id="" onChange={handleFileChange} />
                <button className='bg-primary text-white p-2 rounded-md' onClick={handleUpload}>Subir</button>
              </div>
            </div>

            <div className='flex flex-row justify-between p-4 border-t border-gray-200'
            >
              <h3 className='text-lg font-bold'>Buscar Actualizaciones</h3>
              <div className='flex flex-row justify-between'>
                <button className='bg-primary text-white p-2 rounded-md' onClick={lokForUpdates}>Buscar</button>
              </div>
            </div>
        </div>
   
    </>
  );
};



export default Settings