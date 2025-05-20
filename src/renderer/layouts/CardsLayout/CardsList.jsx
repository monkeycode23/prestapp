import React, { useState, useEffect } from "react";


export const CardsList = ({items  }) => {




  return (
    <>
      {
        payments.length > 0 ? (
          
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ">
      {items.map((item) => {

        //  console.log(payment)
        return (
          <ItemCard
            key={payment.id}

            payment={payment}
          //profileImage={user.profileImage}
          />
        )
      })}
    </div>
        ) : 
        (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-2xl font-bold">No hay pagos</p>
          </div>
        )
      }
    </>
  );
};






export const ItemCard = ({ item,information}) => {


  const { amount, payment_date: date, id, label, state,payed_date } = payment



  return (
    <div className="col-span-1 max-w-sm  bg-white shadow-lg rounded-lg p-6 border border-gray-200">
      {/* Header */}

      <DropdownDefault >
        {/* agregar nota button */}
       
      </DropdownDefault>

      <div className="flex justify-center flex-col  items-center">
        {/* Client Icon */}
        <div className="bg-lime-500 text-white w-15 h-15 flex flex-row justify-center items-center rounded-full">
            {icon}
        </div>
        {/* Client Info */}
        <h3 className="text-lg border-l text-black-300">{title}</h3>
      </div>
        
      {/* Divider */}
      <div className="my-4 border-t border-gray-200"></div>

      
  
    </div>
  );
};


import Tag from "../../components/Tag";
import AddNoteModalPayment from "./AddNoteModal";

export function StateTag({ state }) {

  let type
  if (state == "pending") type = "primary"
  if (state == "incomplete") type = "warning"
  if (state == "expired") type = "danger"
  if (state == "payed") type = "success"

  let label
  if (state == "pending") label = "pendiente"
  if (state == "incomplete") label = "incompleto"
  if (state == "expired") label = "vencido"
  if (state == "payed") label = "pagado"

  return (

    <Tag label={label}

      type={type}> </Tag>
  )
}


