// src/components/UpdateChecker.js
import React, { useEffect, useState } from 'react';

const UpdateChecker = () => {
    const [updateInfo, setUpdateInfo] = useState(null);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null); // Estado para manejar errores
    const [isOnline, setIsOnline] = useState(navigator.onLine); // Estado para manejar la conectividad

    useEffect(() => {
        // Función para verificar la conectividad
        const updateOnlineStatus = () => {
            setIsOnline(navigator.onLine);
        };

        // Escuchar eventos de conexión
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        // Verificar la conectividad al cargar el componente
        if (isOnline) {
            window.electron.checkForUpdates();
        } else {
            setErrorMessage('No hay conexión a Internet. Por favor, conéctese para buscar actualizaciones.');
        }

        window.electron.onUpdateAvailable((event, info) => {
            const userResponse = window.confirm('Hay una nueva actualización disponible. ¿Desea instalarla?');
            if (userResponse) {
                window.electron.downloadUpdate(); // Iniciar la descarga
            }
            setUpdateInfo(info);
        });

        window.electron.onUpdateDownloaded((event, info) => {
            const userResponse = window.confirm('La actualización se ha descargado. ¿Desea reiniciar la aplicación para instalarla?');
            if (userResponse) {
                window.electron.quitAndInstall(); // Reiniciar e instalar
            }
        });

        window.electron.onDownloadProgress((event, progressObj) => {
            setDownloadProgress(progressObj.percent);
        });

        window.electron.onUpdateError((event, error) => {
            setErrorMessage(error); // Establecer el mensaje de error
        });

        return () => {
            // Limpiar los listeners
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, [isOnline]); // Dependencia de isOnline

    return (
        <div>
            {errorMessage && <div style={{ color: 'red' }}>Error: {errorMessage}</div>} {/* Mostrar mensaje de error */}
            {!isOnline && <div style={{ color: 'orange' }}>Estado: Sin conexión a Internet</div>} {/* Mensaje de desconexión */}
            {updateInfo && <div>Actualización disponible: {JSON.stringify(updateInfo)}</div>}
            {downloadProgress > 0 && <div>Descargando: {downloadProgress}%</div>}
        </div>
    );
};

export default UpdateChecker;