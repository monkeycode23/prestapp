import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Payment10,
  PaymentIcon,
  PaymentIcon2,
  SackDollar,
  UserIcon,
} from "../../Icons";

import { Link } from "react-router-dom";


const ClientCard = ({ client }) => {
  useEffect(() => {
    console.log(client);

    return () => {};
  }, []);

  return (
    <div
      className={` flex justify-between items-center 
shadow-2xl
   p-4 rounded-xl
  relative
  bg-primary
  `}
    >
      <div className="flex">
        <div className="w-17 flex flex-row gap-2 justify-center items-center ">
          <div className="bg-blue-500 text-white w-15 h-15 flex flex-row justify-center items-center rounded-full">
            <UserIcon></UserIcon>
          </div>
        </div>
        <div className="flex flex-col ">
          <span className="text-white text-xl font-bold ">
          <Link to={`/clients/${client.id}`}>
       
            {client.nickname}
          
        </Link>
          </span>
          <div className="mt-3 flex justify-between items-center  f-full">
            <div className="flex">
              <span className="flex flex-col justify-center items-center mr-2">
                <PaymentIcon
                  className="bg-danger text-white rounded-full p-2"
                  width={30}
                  height={30}
                >
                  {" "}
                </PaymentIcon>
                <span className="font-bold text-white text-md">
                  {client.total_expired_payments}
                </span>
              </span>
              <span className="flex flex-col justify-center items-center mr-2">
                <PaymentIcon
                  className="bg-success text-white rounded-full p-2"
                  width={30}
                  height={30}
                >
                  {" "}
                </PaymentIcon>
                <span className="font-bold text-white text-md">
                  {client.total_paid_payments}
                </span>
              </span>
              <span className="flex flex-col justify-center items-center mr-2">
                <PaymentIcon
                  className="bg-primary text-white rounded-full p-2 border border-stroke"
                  width={30}
                  height={30}
                >
                  {" "}
                </PaymentIcon>
                <span className="font-bold text-white text-lg">
                  {client.total_pending_payments}
                </span>
              </span>
              <span className="flex flex-col justify-center items-center mr-2">
                <PaymentIcon
                  className="bg-warning text-white rounded-full p-2 "
                  width={30}
                  height={30}
                >
                  {" "}
                </PaymentIcon>
                <span className=" text-white text-md">
                  {client.total_incomplete_payments}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <span className="flex  justify-center items-center mr-3 p-2 rounded-full bg-white">
          <SackDollar
            className="text-black"
            width={16}
            height={16}
          ></SackDollar>{" "}
          <span className="font-bold text-black text-xl ml-1">
            {client.total_loans}
          </span>
        </span>
      </div>
      {/* <div className="absolute top-0 left-20 w-full h-full flex justify-center items-center opacity-20 z-0">
      {loan.status === "active" ? (
        <BaselineAssignment width={200} height={200} />
      ) : loan.status === "completed" ? (
        <BaselineFactCheck width={200} height={200} />
      ) : (
        <BaselineAssignment width={200} height={200} />
      )}
    </div> */}
      {/* <div className="w-full flex flex-col gap-2 z-10">
      <Link to={`/loans/${loan.id}`}>
        <p className="text-lg font-bold text-gray-200 z-2">{loan.label}</p>
      </Link>
      <h1 className="text-4xl font-bold pb-3">
        ${formatAmount(loan.amount)}
      </h1>
      <div className="flex flex-row gap-2 justify-between">
        <div className=" flex flex-row gap-2 items-center">
          <CalendarDateIcon width={20} height={20} />
          <p className="text-sm">{loan?.loan_date}</p>
        </div>
        <span className="text-sm flex flex-row gap-2 items-center">
          {loan.status === "active" ? (
            <span className="text-md font-bold bg-sky-800 text-white rounded-md p-1 z-1">
              activo
            </span>
          ) : loan.status === "completed" ? (
            <span className="text-md font-bold bg-green-700 text-white rounded-md p-1 z-1">
              completado
            </span>
          ) : (
            <span className="text-md font-bold bg-danger text-white rounded-md p-1 z-1">
              cancelado
            </span>
          )}
        </span>
      </div>
    </div> */}

      {/*  <span
      className="font-bold text-xl absolute top-0 right-4 
      hover:cursor-pointer text-primary
      "
    >
      ...
    </span> */}

      {/* <div className="flex flex-col justify-center  items-center mt-6">
      <span className="text-lg font-bold rounded-full  bg-white text-black p-3">
        <span className="text-sm font-bold text-success">
          {loan?.paid ? loan?.paid : 0}
        </span>
        /{loan?.installment_number}
      </span>
      <br></br>
      <div className="flex flex-row gap-2">
        {loan.expired > 0 && (
          <Tooltip
            text={` pagos vencidos: ${loan.expired}`}
            position="bottom"
          >
            <span className="rounded-full bg-danger p-2 text-xs px-2 py-1">
              {loan.expired}
            </span>
          </Tooltip>
        )}
        {loan.incomplete > 0 && (
          <Tooltip
            text={` pagos incompletos: ${loan.incomplete}`}
            position="bottom"
          >
            <span className="rounded-full bg-warning p-2 text-xs px-2 py-1">
              {loan.incomplete}
            </span>
          </Tooltip>
        )}
      </div>
    </div> */}
    </div>
  );
};

export default ClientCard;
