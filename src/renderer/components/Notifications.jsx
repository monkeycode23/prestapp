import React, { useState, useEffect,createContext,useContext } from "react";


const NotficationContext = createContext()


export const useNotification  = ()=> useContext(NotficationContext)


const Notification = ({ children }) => {

  const [notification, setNotification] = useState({
    message:"test notification",
    type:"success",
    title:"",
    position:"bottom-right"
  });

  const [popNoty, setPopNoty] = useState(false)

  const showNotification = ()=>setPopNoty(true)

  const hideNotification = ()=>setPopNoty(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
     // onClose();
     hideNotification()
    }, 3000); // La notificación desaparecerá después de 3 segundos

    return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
  }, [popNoty]);

  return (
    <NotficationContext.Provider value={{
      notification,
      showNotification,
      hideNotification,
      setNotification, 
    }}>
      {children}
     {
      popNoty ? (<div 
        className={`fixed ${notification.position ?
          notification.position === "bottom-right" ? "bottom-5 right-5" :
          notification.position === "bottom-center" ? "bottom-5 left-1/2 -translate-x-1/2" :
          
          notification.position === "bottom-left" ? "bottom-5 left-5" :
          notification.position === "top-center" ? "top-20 left-1/2 -translate-x-1/2" :
          notification.position === "top-right" ? "top-20 right-20" :
          notification.position === "top-left" ? "top-20 left-20" :
          "top-5 left-5"
          : "bottom-5 right-5"
        } px-6 py-4 rounded-lg shadow-lg z-50 text-white transition-all duration-500 transform ${
          notification.type === "success" ? "bg-green-500" : notification.type === "error" ? "bg-danger" : notification.type === "warning" ? "bg-warning" : "bg-primary"
        }`}
      >
        <p>{notification.message}</p>
      </div>) : (<></>)
     }
    </NotficationContext.Provider>
  );
};




export const NotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);
  const {position} = useNotification()
  const addNotification = (message, type) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { id: Date.now(), message, type }
    ]);
  };

  const removeNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div>
      {/* Botón para agregar notificación */}
      <button
        onClick={() => addNotification("¡Operación exitosa!", "success")}
        className="px-4 py-2 bg-blue-500 text-white rounded-md m-2"
      >
        Mostrar notificación de éxito
      </button>
      <button
        onClick={() => addNotification("¡Algo salió mal!", "error")}
        className="px-4 py-2 bg-blue-500 text-white rounded-md m-2"
      >
        Mostrar notificación de error
      </button>

      {/* Mostrar las notificaciones */}
      <div className={`absolute ${position === "bottom-right" ? "bottom-5 right-5" :
         position === "bottom-left" ? "bottom-5 left-5" :
          position === "top-right" ? "top-5 right-5" :
           "top-5 left-5"} space-y-3`}>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Notification;