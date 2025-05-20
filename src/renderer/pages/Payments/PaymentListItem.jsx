import React from "react";

import { formatAmount } from "../../common/funcs";

import DropdownDefault from "../../components/Dropdowns/DropdownDefault";
import { Link } from "react-router-dom";
import IncompleteModal from "./IncompleteModal";
import { MoneyBillAlt, PaymentIcon,OutlinePending } from "../../components/Icons";
import { payPayment } from "../Loan/funcs";
import PayModal from "./PayModal";
import { useDispatch, useSelector } from "react-redux";
import { updatePayment } from "../../redux/reducers/payments";
import { setBruteGains, setNetGains } from "../../redux/reducers/gains";
import { toLocaleDate } from "./funcs";
import { setPaymentsCount } from "../../redux/reducers/payments";

const PaymentListItem = ({ payment }) => {
  // //console.log(payment)
  // const {setCount,setPayments,setTOdayGains,todayGains,setTodayAmount} = useTodayPayments()
  //console.log(payment)
  const dispatch = useDispatch();
  const gains = useSelector((state) => state.gains);
  const paymentsCount = useSelector((state) => state.payments.paymentsCount);
  //console.log(paymentData)
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b last:border-b-0 hover:bg-gray-50">
      {/* Información del cliente */}
      <div className="flex items-center w-1/4">
        {/* Icono de cliente */}
        <div className="bg-lime-500 text-white w-8 h-8 flex flex-row justify-center items-center rounded-full">
          <PaymentIcon />
        </div>
        <div>
          <Link to={`/clients/${payment.client_id}`}>
            <h3
              title={`/clients/${payment.client_id}`}
              className="text-gray-700  text-md ml-1"
            >
              {" "}
              {payment.nickname}
            </h3>
          </Link>
        </div>
      </div>

      <div className="flex items-center text-gray-500 w-1/4">
        <Link to={`/loans/${payment.loan_id}`}>
          <span
            title={`/loans/${payment.loan_id}`}
            className="text-sm font-semibold  font-medium"
          >
            {payment.label}
          </span>
        </Link>
      </div>
      {/* Monto y estado */}
      <div className="flex items-center space-x-4 w-1/4">
        {/* Icono de monto */}
        <div className="flex items-center text-gray-500">
          <span className="text-lg font-semibold  font-medium">
            ${formatAmount(payment.amount)}
          </span>
        </div>

        {/* Estado */}
        <div className="flex flex-end w-1/4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              payment.status === "pending"
                ? "bg-primary text-white"
                : payment.status == "incomplete"
                ? "bg-warning text-white"
                : payment.status == "expired"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {payment.status == "paid"
              ? "pagado"
              : payment.status == "incomplete"
              ? "incompleta"
              : payment.status == "pending"
              ? "pendiente"
              : payment.status == "expired"
              ? "vencido"
              : "pendiente"}
          </span>
        </div>
      </div>

      {/* Botón de acción */}

      <DropdownDefault right={true}>
        {payment.status == "pending" ? (
          <>
            <PayModal payment={payment} />
          </>
        ) : payment.status == "incomplete" ? (
          <>
            <PayModal payment={payment} />
          </>
        ) : payment.status == "expired" ? (
          <>
            <PayModal payment={payment} />
          </>
        ) : (
          <>
            <button
              className={`flex items-center px-4 py-2  gap-2 font-medium  `}
              onClick={async() => {

                await window.database.models.Payments.updatePayment({
                  id: payment.id,
                  status: "pending",
                  paid_date: "NULL",
                  payment_method: "cash",
                });

                await window.database.models.Loans.updateLoan({
                  id:payment.loan_id,
                  status:"active"
                 
              })

                dispatch(
                  updatePayment({
                    id: payment.id,
                    payment: {
                      ...payment,
                      status: "pending",
                      payment_date: null,
                    },
                  })
                );

                dispatch(setBruteGains(gains.bruteGains-payment.gain))
                 dispatch(setNetGains(gains.netGains-payment.amount))
              
                }}
            >
              <OutlinePending />
              pendiente
            </button>
          </>
        )}

        <IncompleteModal
          payment={payment}
          button={
            <button
              disabled={payment.status == "paid" || payment.status == "incomplete"}
              className={`flex items-center px-4 py-2  font-medium ${
                payment.status == "paid" || payment.status == "incomplete" ? "opacity-25" : ""
              }  `}
            >
              {/* Icono de pagar */}
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
                  d="M15 12H9m3 9a9 9 0 100-18 9 9 0 000 18zm0-18v18"
                />
              </svg>
              incompleto
            </button>
          }
        ></IncompleteModal>
      </DropdownDefault>
    </div>
  );
};

export default PaymentListItem;
