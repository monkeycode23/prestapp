import React, { useState, useEffect } from "react";

//components
import CardDataStats from "../../components/CardDataStats";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import {  MoneyBag, PaymentIcon2,DollarSign, SackDollar, MoneyBillAlt } from "../../components/Icons";
import Pagination from "../../components/Pagination";
import LoanHeaderLayout from "../../components/Loan/Header/LoanHeaderLayout";
import PaymentsCardsList from "../../components/Payments/Cards/PaymentsCardsList";
import PaginationModal from "../../components/PaginationModal";
import PaymentsFilter from "../../components/Payments/Filter";


//hooks
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//redux
import { setLoan,setLeftToPaid } from "../../redux/reducers/loans";
import {
  setPayments,
  setBruteGains,
  setExpiredPayments,
  setNetGains,
  setTotalPayments,
} from "../../redux/reducers/payments";
import {
  setTotalResults,
  setTotalPages,
  setLabel,
  setPage,
  setFilter
} from "../../redux/reducers/_pagination";


//funcs
import {
  getLoan,
  getPayments,
  getPaymentsGains,
  getTotalPayments,
  checkAndUpdateActiveLoans,
  isLoanCompletedPaid,
  getLeftMoney,
  getLoanTotalPaid
} from "./funcs";



const Loan = () => {
  //redux
  const payments = useSelector((state) => state.payments.payments);
  const loan = useSelector((state) => state.loans.loan);
  const leftToPaid = useSelector((state) => state.loans.leftToPaid);
  const bruteGains = useSelector((state) => state.payments.bruteGains);
  const netGains = useSelector((state) => state.payments.netGains);
  const totalPayments = useSelector((state) => state.payments.totalPayments);
  const dispatch = useDispatch();
  const pagination = useSelector((state) => state.pagination);

  const { id } = useParams();

  const [expired, setExpired] = useState([]);


  
  useEffect(() => {
    async function init() {
      try {

        if(pagination.label!="payments") dispatch(setPage(1));

        dispatch(setLabel("payments"));

        //get loann info
        const fetchLoan = await getLoan(id);
        console.log(fetchLoan)
        dispatch(setLoan(fetchLoan));

        // Verificar si el préstamo actual está completado
        const isCompleted = await isLoanCompletedPaid(id);
        
        if (isCompleted && fetchLoan.status === 'active') {
          await window.database.models.Loans.updateLoan({
            id: id,
            status: "completed"
          });
          dispatch(setLoan({
            ...fetchLoan,
            status: "completed"
          }));
        }

        const limit = pagination.limit.payments.limit;
        
        //get payments all
        const payments = await getPayments(id, {
          limit: limit,
          offset: (pagination.page - 1) * limit,
          ...pagination.filter
        });

        dispatch(setPayments(payments.payments));



        const total = await getTotalPayments(id, {
          status: false
        });
        dispatch(setTotalPayments(total));

        dispatch(setTotalResults(payments.total));
        dispatch(setTotalPages(Math.ceil(payments.total / limit)));

        //gains
        const fetchGains = await getPaymentsGains(id);
        dispatch(setBruteGains(fetchGains.brute_gains));
        dispatch(setNetGains(fetchGains.net_gains));

        const fetchLeftMoney  = await getLeftMoney(id)
        
        console.log(fetchLeftMoney)
        console.log(loan)
        const loanPaid = await getLoanTotalPaid(id)
        
        dispatch(setLeftToPaid((fetchLoan.amount+fetchLoan.gain)-fetchLeftMoney))
      } catch (error) {
        console.log("error---a>>", error);
      }
    }
    init();
    return () => {};
  }, [pagination.filter, pagination.limit, pagination.page, dispatch, id]);

  

  // console.log('Loan state in render:', loan); // Aquí se imprimirá el valor más actualizado

  function setState(state) {
    setLoan((prev) => {
      return {
        ...prev,
        state: state,
      };
    });
  }

  function changePage(page) {
    dispatch(setPage(page));
  }

  return (
    <div>
      <Breadcrumb pageName="Prestamo" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          <CardDataStats
            title="Pagos Totales "
            total={totalPayments}
            rate="0.0%"
            levelUp
          >
            <PaymentIcon2 className="fill-primary dark:fill-white" width="22" height="22" />
          </CardDataStats>

          
          <CardDataStats
            title="Dinero Recaudado"
            total={"$" + Intl.NumberFormat("de-DE").format(netGains)}
            rate="0.0%"
            levelUp
          >
            <SackDollar className="fill-primary dark:fill-white" width="22" height="22" />
          </CardDataStats>
         

          
          <CardDataStats
            title="Dinero Restante por pagar"
            total={"$" + Intl.NumberFormat("de-DE").format(leftToPaid)}
            rate="0.0%"
            levelUp
          >
            <MoneyBillAlt className="fill-primary dark:fill-white" width="22" height="22"></MoneyBillAlt>
          </CardDataStats>

          <CardDataStats
            title="Ganancia Obtenida del Prestamo"
            total={"$" + Intl.NumberFormat("de-DE").format(bruteGains)}
            rate="0.0%"
            levelUp
          >
            <MoneyBag className="fill-primary dark:fill-white" width="22" height="22" />
          </CardDataStats>
      </div>

      <LoanHeaderLayout />

      {/*  <div className=' bg-white my-6 flex justify-between items-center'>
          <div>

            {/* <button className='bg-primary text-sm text-white p-2 rounded-sm'>
            agregar pago
          </button> */}
      {/*    </div>
          <Select
            onChange={(e) =>{ setFilter(e.target.value); setPage(1)}}
            options={[{
              label: "todos",
              value: "",
              selected: true
            },
            {

              label: "Pagados",
              value: "paid",
              selected: false
            },
            {

              label: "Vencidas",
              value: "expired",
              selected: false
            }, {
              label: "Pendientes",
              value: "pending",
              selected: false
            },
            {
              label: "Incompletos",
              value: "incommpleted",
              selected: false
            }
            ]}>

          </Select>

        </div> */}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <PaymentsFilter></PaymentsFilter>
        </div>

        <div className="col-span-12 md:col-span-6 xl:col-span-9">

          <div className="flex flex-col justify-end mb-4">
            <div className="flex flex-row justify-between mb-2">
              <h1 className="text-2xl font-bold">Pagos  </h1>
              <div className="flex flex-row gap-2 items-center">
                <span className="text-sm text-gray-500 ml-2">
                  Resultados:
                  <span className="text-md font-bold">
                    {pagination.totalResults}
                  </span>
                </span>
                <span className="text-sm text-gray-500">
                  Res/pag:
                  <span className="text-md font-bold">{pagination.limit.payments.limit}</span>
                </span>
                <PaginationModal />
              </div>
            </div>
            <div className="flex flex-row  justify-end mb-2">
              {payments.length > 0 ? (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  changePage={changePage}
                ></Pagination>
              ) : (
                ""
              )}
            </div>
          </div>

          <PaymentsCardsList />
        </div>
        {/* <ChatCard /> */}
      </div>
    </div>
  );
};

export default Loan;
