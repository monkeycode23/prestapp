import React, { useState, createContext, useContext } from "react";

const ModalContext = createContext();

export const useModal = () => {
  return useContext(ModalContext);
};

const Modal = ({ buttonLabel, children, title,button=false,level=1 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);
  


  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen, toggleModal }}>
        

        <ModalButton buttonLabel={buttonLabel} button={button}></ModalButton>
      
        {isOpen && ( <div className={`flex justify-center items-center h-screen absolute top-0 left-0 w-full`}>
       
          
          <div className="fixed inset-0 z-999999 bg-black bg-opacity-50 flex items-center justify-center ">
            <div className="bg-white rounded-lg shadow-lg max-h-screen overflow-auto max-w-lg w-full p-6">
              {/* Cabecera */}
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-xl font-semibold">{title}</h2>
                <button
                  className="text-gray-500 hover:text-gray-800"
                  onClick={toggleModal}
                >
                  ✕
                </button>
              </div>

              {/* Contenido */}
              <div className="mt-4 ">{children}</div>

              {/* Pie */}
              <div className="mt-6 flex justify-end space-x-3">
                {/* Puedes agregar botones de confirmación o cancelar aquí */}
              </div>
            </div>
          </div>
       
      </div> )}
    </ModalContext.Provider>
  );
};





export const ModalButton = ({button,buttonLabel}) => {

  const {toggleModal} = useModal()
    if(React.isValidElement(button)){

    if (button.props.onClick) {
      button.props.onClick(event);
    }
      // Clonar el botón para agregarle el nuevo manejador de evento
      var buttonWithEvent = React.cloneElement(button, { onClick: toggleModal });
  } 

  return (
    <>
      {button ? button==true ? 
      (<button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={toggleModal}
        >
          {buttonLabel ? buttonLabel : "test"}
        </button>)
        : buttonWithEvent 
        : <></>}
    </>
  )
}

export default Modal