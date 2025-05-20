import React from "react";

//import     IncompleteModal from "../pages/Payments/IncompleteModal";

const PaymentCard = ({ payments, handleCancel }) => (
    <div className="max-w-4xl mx-auto mt-8 space-y-4">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="flex flex-col md:flex-row items-center justify-between bg-white shadow-lg rounded-lg p-4 border hover:bg-gray-50 transition"
        >
          {/* Información del cliente */}
          <div className="flex items-center w-full md:w-1/3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A3.375 3.375 0 008.25 15h7.5a3.375 3.375 0 013.129 2.804M15.75 9A3.75 3.75 0 1112 5.25 3.75 3.75 0 0115.75 9z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700">
              {payment.clientName}
            </h3>
          </div>
  
          {/* Información del monto */}
          <div className="flex items-center w-full md:w-1/4 mt-3 md:mt-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2z"
              />
            </svg>
            <span className="text-lg font-medium text-gray-800">
              ${payment.amount}
            </span>
          </div>
  
          {/* Estado */}
          <div className="flex items-center w-full md:w-1/4 mt-3 md:mt-0">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                payment.status === "Pendiente"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {payment.status}
            </span>
          </div>
  
          {/* Botón de acción */}
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => handleCancel(payment.id)}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Anular Pago
            </button>
          </div>
        </div>
      ))}
    </div>
  );
  

  
/* 

const PaymentCard = ({id, name, amount,state, profileImage,onPay }) => {

    const [payment,setPayment] = useState({
        id:id,
        amount:amount,
        client:name,
        state:state
    })
    return (
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white border border-gray-200">
       <div className='flex justify-content-center'>
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
          <div className="font-bold text-xl mb-2 text-gray-800">{payment.client}</div>
          <p className="text-gray-700 text-base">{payment.amount} $</p>
          <p className={
            payment.state == "pending" ? "text-gray-700 text-base bg-amber-300": "text-gray-700 text-base bg-lime-500"
          }>{payment.state} </p>
        </div>
        <div className="px-6 pt-4 pb-2">
          <button onClick={async (id)=>{

            const p = payment.state=="pending" ? "payed": "pending"
            console.log("UPDATE payments SET state='"+p+"' WHERE id='"+payment.id+"'")

            const query = `UPDATE payments SET state='${
                payment.state == "pending" ? "payed":"pending"
            }' WHERE id='${payment.id}'
            `
           
            console.log(query)
            await window.sqlite.query(query)
            setPayment({
                ...payment,
                state: payment.state == "pending" ? "payed":"pending"
            })
            
          }} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            Pagar
          </button>
  
         

          
        </div>
      </div>
      </TodayPaymentsContext.Provider>
    );
  };
   */
  export default PaymentCard;