import React, { useState } from "react";
import Modal from "../../components/Modal";
import Example from "../../components/GuidedForm/GuidedForm";

const Card = ({ icon, title, description, buttonLabel, onClick }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white border border-gray-200">
      <div className="flex justify-content-center">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-16 h-16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6.75a3 3 0 11-6 0 3 3 0 016 0zM6.75 17.25a4.5 4.5 0 019 0M18.75 7.5h2.25M18.75 12h2.25M18.75 16.5h2.25"
            />
          </svg>
        </span>
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-gray-800">{name}</div>
        <p className="text-gray-700 text-base">{email}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
          Ver Perfil
        </button>

        <Modal title="Otorgar un prestamo" buttonLabel={"otorgar prestamo"}>
          <Example clientId={id}></Example>
        </Modal>
      </div>
    </div>
  );
};

const GuidedModal = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    monto: 0.0,
    interes: 30,
    cuotas: 1,
    fecha: "",
    pagos: "semanal",
  });

  const addLoan = async (data) => {
    const values = Object.values(formData)
      .map((i) => {
        return i.length == 0 ? "''" : "'" + i + "'";
      })
      .join(",");

    console.log();
    await window.sqlite
      .query(`INSERT INTO loans (amount,interes_percentage,installments,aproved_date,lender_id,client_id) 
        VALUES
        (${values})
        `);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setStep(1); // Reinicia al primer paso si se vuelve a abrir
  };

  const handleChange = (e) => {
    console.log(typeof e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className={isOpen ? "flex justify-center items-center h-screen" : ""}>
      {/* Botón para abrir el modal */}
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={toggleModal}
      >
        Abrir Formulario Guiado
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            {/* Cabecera */}
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-semibold">Formulario Paso {step}</h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={toggleModal}
              >
                ✕
              </button>
            </div>

            {/* Contenido del Formulario */}
            <div className="mt-4">
              {step === 1 && (
                <>
                  <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Monto del prestamo
                    </label>
                    <div className="relative">
                      <input
                        value={formData.monto}
                        onChange={handleChange}
                        //onChange={(e)=>setField({type:"set",field:"password",value:e.target.value})}
                        name="monto"
                        type="number"
                        placeholder="ingrese el monto del prestamo"
                        // defaultValue={fields.password.value}
                        // value={fields.password.value}
                        className={`w-full rounded-lg border border-stroke  focus:text-black bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                      />

                      <span className="absolute right-4 top-4">
                        <svg
                          className="fill-current"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.5">
                            <path
                              d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                              fill=""
                            />
                            <path
                              d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                    </div>
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Cantidad de cuotas
                    </label>
                    <div className="relative">
                      <input
                        value={formData.cuotas}
                        onChange={handleChange}
                        //onChange={(e)=>setField({type:"set",field:"password",value:e.target.value})}
                        name="cuotas"
                        type="number"
                        placeholder="cantidad de cuotas"
                        // defaultValue={fields.password.value}
                        // value={fields.password.value}
                        className={`w-full rounded-lg border border-stroke  focus:text-black bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                      />

                      <span className="absolute right-4 top-4">
                        <svg
                          className="fill-current"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.5">
                            <path
                              d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                              fill=""
                            />
                            <path
                              d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                    </div>
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Fecha del prestamo
                    </label>
                    <div className="relative">
                      <input
                        value={formData.fecha}
                        onChange={handleChange}
                        //onChange={(e)=>setField({type:"set",field:"password",value:e.target.value})}
                        name="fecha"
                        type="date"
                        placeholder="ingrese el monto del prestamo"
                        // defaultValue={fields.password.value}
                        // value={fields.password.value}
                        className={`w-full rounded-lg border border-stroke  focus:text-black bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                      />

                      <span className="absolute right-4 top-4">
                        <svg
                          className="fill-current"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.5">
                            <path
                              d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                              fill=""
                            />
                            <path
                              d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                    </div>
                  </div>
                </>
              )}
              {step === 4 && (
                <>
                  <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Modalidad de pago
                    </label>
                    <div className="relative">
                      <input
                        value={formData.pagos}
                        onChange={handleChange}
                        //onChange={(e)=>setField({type:"set",field:"password",value:e.target.value})}
                        name="pagos"
                        type="text"
                        placeholder="ingrese el monto del prestamo"
                        // defaultValue={fields.password.value}
                        // value={fields.password.value}
                        className={`w-full rounded-lg border border-stroke  focus:text-black bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                      />

                      <span className="absolute right-4 top-4">
                        <svg
                          className="fill-current"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.5">
                            <path
                              d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                              fill=""
                            />
                            <path
                              d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Navegación */}
            <div className="mt-6 flex justify-between">
              <button
                className={`px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 ${
                  step === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={prevStep}
                disabled={step === 1}
              >
                Atrás
              </button>
              {step < 4 ? (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={nextStep}
                >
                  Siguiente
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => {
                    console.log("Datos del formulario:", formData);
                    toggleModal();
                  }}
                >
                  Finalizar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StarIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 ${filled ? "text-yellow-400" : "text-gray-300"}`}
    fill={filled ? "currentColor" : "none"}
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.26a1 1 0 00.95.69h6.592c.969 0 1.371 1.24.588 1.81l-5.347 3.887a1 1 0 00-.364 1.118l2.036 6.26c.3.921-.755 1.688-1.54 1.118L12 18.897l-5.345 3.888c-.784.57-1.84-.197-1.54-1.118l2.036-6.26a1 1 0 00-.364-1.118L2.44 11.687c-.783-.57-.381-1.81.588-1.81h6.592a1 1 0 00.95-.69l2.036-6.26z"
    />
  </svg>
);

export const ClientCard2 = ({ name, loans, rating }) => {
  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center">
        {/* Client Icon */}
        <div className="bg-blue-500 text-white w-12 h-12 flex justify-center items-center rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A4 4 0 015 16V8a4 4 0 014-4h6a4 4 0 014 4v8a4 4 0 01-.121.804M7 20h10m-5-5v5"
            />
          </svg>
        </div>
        {/* Client Info */}
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gray-200"></div>

      {/* Rating Section */}
      <div className="flex items-center justify-between">
      </div>

   
    </div>
  );
};

export default Card;
