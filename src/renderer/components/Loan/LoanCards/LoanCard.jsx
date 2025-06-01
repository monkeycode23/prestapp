import React from "react";

//components
import {
  SackDollar,
  CalendarDateIcon,
  BaselineFactCheck,
  BaselineAssignment,
  DeleteIcon,
} from "../../Icons";

import DropdownDefault from "../../Dropdowns/DropdownDefault";

import { Link } from "react-router-dom";
import Tooltip from "../../Tooltip";
//utils
import { formatAmount } from "../../../common/funcs";
import { deleteLoan, setStatics } from "../../../redux/reducers/loans";
import { setDebt, setTotalLendMoney } from "../../../redux/reducers/clients";
import { useDispatch, useSelector } from "react-redux";
import { useNotification } from "../../Notifications";
import {
  deleteLoanDb,
  getLoanCurrentGains,
  getLoanLeftToPay,
} from "../../../pages/Loan/funcs";
import  loansService  from "../../../services/loansService";


const LoanCard = ({ loan }) => {

  const clients = useSelector((state) => state.clients);
  const dispatch = useDispatch();
  const { setNotification, showNotification } = useNotification();

  async function deleteLoanDb() {
    try {
      //await deleteLoanDb(loan.id);
      //handleBack();
      await deleteLoanDb(loan.id);
      //await window.database.models.Loans.deleteLoan(loan.id)
      
      //dispatch(setDebt(clients.debt-(loan.amount+loan.gain)))
      const leftToPaid = await getLoanLeftToPay(loan.id);
      const loanGains = await getLoanCurrentGains(loan.id);
      
      
      dispatch(deleteLoan({ id: loan.id }));
      dispatch(
        setStatics({
          totalLoans:
            clients.totalLoans > 1 ? clients.totalLoans - 1 : 0,
          debt: clients.debt - leftToPaid,
          totalLendMoney: clients.totalLendMoney - loan.amount,
          bruteGains: clients.bruteGains - loanGains.brute,
          netGains: clients.netGains - loanGains.net,
        })
      );

      await window.database.models.ActivityLog.createActivity({
        action_type: "DELETE",
        entity: "loans",
        entity_id: loan.id,
        payload: JSON.stringify(loan),
        synced: navigator.onLine ? 1 : 0,
      });

      setNotification({
        type: "success",
        message: "Prestamo eliminado con exito",
      });
      showNotification();
    } catch (error) {
      setNotification({
        type: "danger",
        message: "Error al borrar el prestamo " + error,
      });
      showNotification();
    }
  }

  async function deleteLoanApi() {
    try {
     // const aqui = await loansService.deletePrestamo(loan.id);
      //console.log(aqui,"aqui")
    } catch (error) {
      setNotification({
        type: "danger",
        message: "Error al borrar el prestamo " + error,
      });
      showNotification();
  }

  }

  return (
    <div
      className={`w-full flex  gap-4 xsm:col-span-12
     sm:col-span-12 md:col-span-12 
     lg:col-span-6
     xl:col-span-6
${
  loan.status === "active"
    ? "bg-primary"
    : loan.status === "completed"
    ? "bg-success"
    : "bg-danger"
} 
shadow-2xl
    text-white p-4 rounded-xl
    relative
    `}
    >
      <div className="flex flex-row gap-2 justify-center items-center ">
        <SackDollar width={45} height={45} />
      </div>

      {/* Icono de fondo grande en el medio */}
      <div className="absolute top-0 left-20 w-full h-full flex justify-center items-center opacity-20 z-0">
        {loan.status === "active" ? (
          <BaselineAssignment width={200} height={200} />
        ) : loan.status === "completed" ? (
          <BaselineFactCheck width={200} height={200} />
        ) : (
          <BaselineAssignment width={200} height={200} />
        )}
      </div>
      <div className="w-full flex flex-col gap-2 z-10">
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
      </div>

      {/*  <span
        className="font-bold text-xl absolute top-0 right-4 
        hover:cursor-pointer text-primary
        "
      >
        ...
      </span> */}
      <DropdownDefault
        className={`font-bold text-xl absolute top-0 left-10 p-2 
        hover:cursor-pointer text-white`}
      >
        {/* <EditLoanModal
                loan={loan}
                label={"Editar prestamo"}
                button={
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <EditIcon className="w-4 h-4" />
                    Editar Prestamo
                  </button>
                }
              /> */}
        <button
          onClick={async () => {
           
            deleteLoanDb()

            deleteLoanApi()
          }}
          className="flex items-center gap-2  text-sm font-medium text-black bg-white border  hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <DeleteIcon className="w-4 h-4" />
          Borrar Prestamo
        </button>
      </DropdownDefault>

      <div className="flex flex-col justify-center  items-center mt-6">
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
      </div>
    </div>
  );
};

export default LoanCard;
