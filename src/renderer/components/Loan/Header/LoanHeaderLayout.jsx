import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

//components
import EditLoanModal from "../../Loans/EditLoanModal";
import DeleteLoanModal from "./DeleteLoanModal";
import Tag from "../../Tag";
import {
  UserIcon,
  RoundPhoneAndroid,
  EmailIcon,
  LocationIcon,
  Wallet03,
  Tags,
  ArrowsSpinCircle,
  CalendarDays,
  EditIcon,
  SackDollar,
  PaymentIcon,
  PercentageCircleIcon,
  CalendarDateIcon
} from "../../../components/Icons";

import FixUnbalanceModal from './FixUnbalanceModal'
import Chart from "./chart";

//redux
import { useSelector,useDispatch } from "react-redux";
import { setProgressPercentage, setPaidPayments, setTotalPayments } from "../../../redux/reducers/payments";
//import AddLoanModal from '../../../pages/Client/AddLoanModal'
//funcs 
import { formatAmount,formatDateCriollo } from "../../../common/funcs";
import ProgressBar from "./ProgressBar";
import { setUnbalancePayments } from "../../../redux/reducers/loans";



const LoanHeaderLayout = () => {
  
  
    const loan = useSelector((state) => state.loans.loan);
    const payments = useSelector((state) => state.payments.payments);
    const unbalancePayments = useSelector((state) => state.loans.unbalancePayments);
    const dispatch= useDispatch()
    


  async function detectUnbancePayments(id){

      if(id){
        const fetchPayments = await window.database.models.Payments.getPayments({
          where:`loan_id = ${id}`,
         })
    
         console.log(fetchPayments)
         const total  = fetchPayments.reduce((ac,current,)=>ac+current.amount,0)
         
         console.log(total, loan.amount+loan.gain)
    
         return total > loan.amount+loan.gain-100 &&total < loan.amount+loan.gain+100
     
      }

        return false
    }

  useEffect(() => {

    const init = async ()=>{

      const fetchUnbalance = await detectUnbancePayments(loan?.id)

      dispatch(setUnbalancePayments(fetchUnbalance))     

    }

    init()
 /*  console.log("paymentsData",paymentsData)
    dispatch(setProgressPercentage(progressPercentage));
    dispatch(setPaidPayments(paidPayments));
    dispatch(setTotalPayments(totalPayments)); */
  }, []);

  return (<>
    <div className="client-header grid grid-cols-12 grid-rows-1 grid-rows-auto gap-5 bg-white p-4 rounded-lg border border-gray-200 rounded-md mt-5">
      <div className="h-200 xl:col-span-3  xsm:col-span-12 sm:col-span-12 md:col-span-3 row-span-2  flex flex-col gap-2 justify-center items-center relative">
        <div className="absolute top-0 left-0">
          <DeleteLoanModal loan={loan} />
        </div>
        <h1 className="text-2xl rounded-full bg-success text-white p-2 border border-gray-300 p-5">
          <SackDollar className="w-10 h-10" />
        </h1>
        <h1 className="text-xl font-bold text-gray-600">{loan ? loan.label : "Prestamo"}</h1>
        <h1 className='text-4xl font-bold  mt-6'>${formatAmount(loan?.amount)}</h1>
        <h1 className='text-3xl p-0 m-0 text-success font-bold'>(${formatAmount(loan?.gain)})</h1>
        
        {
          unbalancePayments ? (<>
          
          <FixUnbalanceModal>

          </FixUnbalanceModal>
          
          
          </>) :(<></>)
        }
        {/*  <AddLoanModal loan={loan}
          button={
            <button className='mt-4 bg-primary text-white p-2 rounded-xl border border-gray-300 font-bold'>
                Dar Prestamo
                <span className='text-xl font-bold ml-2'>
                    +
                </span>
            </button>
          }
          ></AddLoanModal> */}
      </div>
      <div className="xl:col-span-5 xsm:col-span-12 sm:col-span-12 md:col-span-6 flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between gap-2 text-md text-gray-500">
          <h1 className="flex flex-row items-center justify-between gap-2 text-md text-gray-500">
            Información del prestamo  
          </h1>
          <EditLoanModal
              loan={loan}
              label={"Editar prestamo"}
              button={
              <button className="flex items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4">
                <EditIcon className={`w-8 h-8 p-1 rounded-full bg-warning hover:bg-warning hover:text-white cursor-pointer`}></EditIcon>
                </button>
              }
            ></EditLoanModal>
        </div>
        <InformationLoanHeader /> 

        {/* Progress Bar */}
        <ProgressBar></ProgressBar>
      
      </div>

      <div className="xl:col-span-4 xl:block xsm:col-span-12 sm:col-span-12 md:col-span-12 row-span-2">
        {/* <div style={{ width: "100%", height: 300 }}>
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="pie"
            height={300}
          />
        </div> */}
        <Chart></Chart>
      </div>

      <div className="col-span-12 flex justify-end mt-4">
        {/* <button
          onClick={() => handlePayInterest(payments[0])}
          className="bg-primary text-white p-2 rounded-lg"
        >
          Pagar Recargo
        </button> */}
      </div>
    </div>
  </>);
};

export const InformationLoanHeader = () => {

  const loan = useSelector((state) => state.loans.loan);

  function parseInterval(interval){
    
    switch (interval) {
      case "daily":
        return "diario"
        break;
     case "weekly":
        return "semanal"
        break;
     case "monthly":
        return "mensual"
        break;
     case "fortnightly":
        return "quincenal"
        break;
     case "custom":
        return "irregular"
        break;
      default:
        break;
    }

    
  }

  function parseStatus(state){
 switch (state) {
      case "active":
        return "activo"
        break;
     case "completed":
        return "completado"
        break;
     case "canceled":
        return "cancelado"
        break;
    
      default:
        break;
    }
      
    }
    //console.log("loan",loan)
  return (
    <>
      <div className="w-full flex flex-col justify-between items-center gap-2">
        <div
          id="information-client"
          className="w-full flex justify-between   gap-2"
        >
          <div>
            <div className="w-full flex flex-col gap-2">
              <InformationItem
                icon={
                <PaymentIcon className="w-6 h-6 p-1 rounded-full bg-success text-white" ></PaymentIcon>
                }
                label="N Cuotas"
                value={loan?.installment_number}
              />
            </div>

            <div className="w-full flex flex-col gap-2">
                <InformationItem
                icon={
                <CalendarDateIcon className="w-6 h-6 p-1 rounded-full bg-success text-white" ></CalendarDateIcon>
                }
                label="Fecha Entrega"
                value={formatDateCriollo(loan?.loan_date)}
              />
            </div>

            <div className="w-full flex flex-col gap-2">
                <InformationItem
                icon={
                <UserIcon className="w-6 h-6 p-1 rounded-full bg-success text-white" ></UserIcon>
                }
                label="Cliente"
                value={loan?.nickname}
              />
            </div>

            <div className="w-full flex flex-col gap-2">
                <InformationItem
                icon={
                <PercentageCircleIcon className="w-6 h-6 p-1 rounded-full bg-success text-white" ></PercentageCircleIcon>
                }
                label="Interes"
                value={loan?.interest_rate}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
                <InformationItem
                icon={
                <CalendarDays className="w-6 h-6 p-1 rounded-full bg-success text-white" ></CalendarDays>
                }
                label="Intervalo"
                value={parseInterval(loan?.payment_interval)}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
                <InformationItem
                icon={
                <ArrowsSpinCircle className="w-6 h-6 p-1 rounded-full bg-success text-white" ></ArrowsSpinCircle>
                }
                label="estado"
                value={<><span
                className={`${loan?.status=='active' ? 'bg-primary' : 
                  loan?.status=='completed' ? 'bg-success' : 'bg-danger'
                } text-white px-1  rounded-lg`}
                >{parseStatus(loan?.status)}</span></>}
              />
            </div>
          </div>
         

         
        </div>

       
      </div>
    </>
  );
};


const ReputationBar = ({ reputation }) => {
  if (reputation == null) return null;

  const percentage = Math.max(0, Math.min(100, reputation));
  let color = "bg-success";
  if (percentage < 40) color = "bg-danger";
  else if (percentage < 70) color = "bg-warning";

  return (
    <div className="mt-4 w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Reputación</span>
        <span className="font-semibold">{percentage}%</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};



export const InformationItem = ({ icon, label, value }) => {
  return (
    <div className="flex gap-1 p-1">
      <span className="flex flex-row items-center gap-2">{icon}</span>
      <div className="flex gap-1">
        <span className="flex flex-row items-center text-sm opacity-90">
          {label}:{" "}
        </span>
        {value ? (
          <span className="flex flex-row items-center text-md font-bold opacity-70">
            {value}
          </span>
        ) : (
          <span className="flex flex-row items-center text-sm opacity-80">
            No tiene {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default LoanHeaderLayout;
