import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Tag from "../../components/Tag";
import {
  WalletIcon,
  EditIcon,
  DeleteIcon,
  PaymentIcon,
  CalendarDateIcon,
  UserIcon,
  PercentageCircleIcon,
} from "../../components/Icons";
import DropdownDefault from "../../components/Dropdowns/DropdownDefault";
import EditLoanModal from "../../components/Loans/EditLoanModal";
import { deleteLoanDb } from "./funcs";

import { setNotes } from "../../redux/reducers/notes";

export const LoanCard = () => {
  const loan = useSelector((state) => state.loans.loan);
  const notes = useSelector((state) => state.notes);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBack = () => {
    // Primero navegamos al cliente
    navigate(`/clients/${loan.client_id}`);
  };




  return (
    <>
      {loan ? (
        <div className="max-w-sm bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          {/* Header */}
          <div className="flex justify-start mb-4">
            <DropdownDefault>
              <EditLoanModal
                loan={loan}
                label={"Editar prestamo"}
                button={
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <EditIcon className="w-4 h-4" />
                    Editar Prestamo
                  </button>
                }
              />
              <button
                onClick={async () => {
                  try {
                    await deleteLoanDb(loan.id);
                    handleBack();
                  } catch (error) {
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <DeleteIcon className="w-4 h-4" />
                Borrar Prestamo
              </button>
            </DropdownDefault>
          </div>

          <div className="flex justify-center items-center">
            {/* Client Icon */}
            <div className="bg-blue-500 text-white w-15 h-15 flex flex-row justify-center items-center rounded-full">
              <WalletIcon />
            </div>
          </div>

          <div className="my-4 border-t border-gray-200 text-center">
            {loan.label ? loan.label : "Prestamo"}
          </div>

          <p className="text-center text-success font-bold text-3xl">
            $ {Intl.NumberFormat("es-ES").format(loan.amount)}
          </p>

          <div className="space-y-3 mt-4">
            <p className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="flex items-center gap-2">
                <span className="flex justify-center items-center rounded-full bg-blue-500 text-white w-8 h-8">
                  <PaymentIcon className="w-4 h-4" />
                </span>
                <span className="font-medium">Cuotas</span>
              </span>
              <span className="font-semibold">{loan.installment_number}</span>
            </p>

            <p className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="flex items-center gap-2">
                <span className="flex justify-center items-center rounded-full bg-blue-500 text-white w-8 h-8">
                  <CalendarDateIcon className="w-4 h-4" />
                </span>
                <span className="font-medium">Fecha entrega</span>
              </span>
              <span className="font-semibold">{loan.loan_date}</span>
            </p>

            <p className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="flex items-center gap-2">
                <span className="flex justify-center items-center rounded-full bg-blue-500 text-white w-8 h-8">
                  <UserIcon className="w-4 h-4" />
                </span>
                <span className="font-medium">Cliente</span>
              </span>
              <Link 
                to={`/clients/${loan.client_id}`} 
                onClick={(e) => {
                  e.preventDefault();
                  handleBack();
                }}
                className="font-semibold text-blue-600 hover:text-blue-800"
              >
                {loan.nickname}
              </Link>
            </p>

            <p className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="flex items-center gap-2">
                <span className="flex justify-center items-center rounded-full bg-blue-500 text-white w-8 h-8">
                  <PercentageCircleIcon className="w-4 h-4" />
                </span>
                <span className="font-medium">Interes</span>
              </span>
              <span className="font-semibold">{loan.interest_rate}%</span>
            </p>
          </div>

          <div className="my-4 border-t border-gray-200"></div>

          {/* Status Tag */}
          <div className="flex justify-start">
            {loan.status === "active" ? (
              <Tag type="primary" label="activo" />
            ) : loan.status === "completed" ? (
              <Tag type="success" label="completado" />
            ) : (
              <Tag type="danger" label="cancelado" />
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-red-500">Error al cargar los datos</div>
      )}
    </>
  );
};
