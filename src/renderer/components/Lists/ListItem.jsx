import React from 'react'

function ListItem() {
  return (
    <div
        
    className="flex items-center justify-between px-6 py-4 border-b last:border-b-0 hover:bg-gray-50"
  >
    {/* Información del cliente */}
    <div className="flex items-center">
      {/* Icono de cliente */}
      <ClientIcon></ClientIcon>
      <div>
        <h3 className="text-gray-700">
         <Link to={"/clients/"+payment.client_id}>{payment.nickname}</Link> 
        </h3>
      </div>
    </div>

    {/* Monto y estado */}
    <div className="flex items-center space-x-4">
      {/* Icono de monto */}
      <div className="flex items-center text-gray-500">
        
        <span className="text-lg font-semibold  font-medium">${formatAmount(payment.amount)}</span>
      </div>

      {/* Estado */}
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
          payment.state === "Pendiente"
            ? "bg-red-100 text-red-600"
            : "bg-green-100 text-green-600"
        }`}
      >
       <Link className="text-sky-600" to={"/prestamos/"+payment.loanId}>ver prestamo</Link>
      </span>
    </div>

    {/* Botón de acción */}
  
  </div>
  )
}

export default ListItem