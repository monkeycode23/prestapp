import React,{useState,useEffect} from "react";
import { Link } from "react-router-dom";
import EditIcon, { WalletIcon } from "../../components/Icons";
import { useDispatch, useSelector } from 'react-redux';
import { setLoans, deleteLoan } from '../../redux/reducers/loans'
import DropdownDefault from "../../components/Dropdowns/DropdownDefault";
import { useNotification } from "../../components/Notifications";
import { formatAmount, formatDateDifference } from "../../common/funcs";
import Tag from "../../components/Tag";
import { setClient } from "../../redux/reducers/clients";
import { deleteLoanDb } from "../Loan/funcs";

export default function LoansList () {

    const loans = useSelector((state) =>state.loans.loans);
    const dispatch = useDispatch()
    
    console.log(loans)
    useEffect(() => {
      
      
    
      return () => {
        
      }
    }, [])
    
   //console.log(loans)
    //console.log(clients)
    return (
      <>
      
     
        {loans.length>0 ? 
        
        (<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-1 ">
          {loans.map((loan) =>{
        
        return  (
          <LoanCard
            key={loan.id}
           loan={loan}
            //profileImage={user.profileImage}
          />
        )
      })}
          
          </div>)
        
         : <div className="flex justify-center items-center h-full   text-2xl text-gray-500">No hay prestamos</div>}
      
      </>
    );
  };
  



export const LoanCard = ({ loan }) => {

    const {setNotification,showNotification} = useNotification()
    const {amount,loan_date:date,installment_number,label,status,id} = loan
    const dispatch = useDispatch()
/*   useEffect(() => {

    const init = async () => {
     /*  const payments = await getPayments(id)
      console.log("payments---a>>", payments) */
  /*}
    init()
  
    return () => {
      
    }
  }, []) */
  
    
  
    return (
      <div className="max-w-sm  bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        {/* Header */}
        <div className="flex items-start">
        <DropdownDefault>
        
     {/*    <EditLoanModal   button={(
          <button 
         className="flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4"
         onClick={(e)=>dispatch(setLoan(loan))}
         
         >
        
         <EditIcon></EditIcon>
          Editar
        </button>)}>

          
        </EditLoanModal> */}
        <button 
        onClick={async()=>{

          await deleteLoanDb(id)

          console.log("id:----------------------------->",id)
         dispatch(deleteLoan({id:id}))

          setNotification({
            type:"success",
            message:"Prestamo eliminado con exito"
          })
          showNotification()
          setLoans((prev)=>prev.filter((e)=>{
            if(e.id!=id) return e 
          } ))
        }}
        className="flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4">
          <svg
            className="fill-current"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.225 2.20005H10.3V1.77505C10.3 1.02505 9.70005 0.425049 8.95005 0.425049H7.02505C6.27505 0.425049 5.67505 1.02505 5.67505 1.77505V2.20005H3.75005C3.02505 2.20005 2.42505 2.80005 2.42505 3.52505V4.27505C2.42505 4.82505 2.75005 5.27505 3.22505 5.47505L3.62505 13.75C3.67505 14.775 4.52505 15.575 5.55005 15.575H10.4C11.425 15.575 12.275 14.775 12.325 13.75L12.75 5.45005C13.225 5.25005 13.55 4.77505 13.55 4.25005V3.50005C13.55 2.80005 12.95 2.20005 12.225 2.20005ZM6.82505 1.77505C6.82505 1.65005 6.92505 1.55005 7.05005 1.55005H8.97505C9.10005 1.55005 9.20005 1.65005 9.20005 1.77505V2.20005H6.85005V1.77505H6.82505ZM3.57505 3.52505C3.57505 3.42505 3.65005 3.32505 3.77505 3.32505H12.225C12.325 3.32505 12.425 3.40005 12.425 3.52505V4.27505C12.425 4.37505 12.35 4.47505 12.225 4.47505H3.77505C3.67505 4.47505 3.57505 4.40005 3.57505 4.27505V3.52505V3.52505ZM10.425 14.45H5.57505C5.15005 14.45 4.80005 14.125 4.77505 13.675L4.40005 5.57505H11.625L11.25 13.675C11.2 14.1 10.85 14.45 10.425 14.45Z"
              fill=""
            />
            <path
              d="M8.00005 8.1001C7.70005 8.1001 7.42505 8.3501 7.42505 8.6751V11.8501C7.42505 12.1501 7.67505 12.4251 8.00005 12.4251C8.30005 12.4251 8.57505 12.1751 8.57505 11.8501V8.6751C8.57505 8.3501 8.30005 8.1001 8.00005 8.1001Z"
              fill=""
            />
            <path
              d="M9.99994 8.60004C9.67494 8.57504 9.42494 8.80004 9.39994 9.12504L9.24994 11.325C9.22494 11.625 9.44994 11.9 9.77494 11.925C9.79994 11.925 9.79994 11.925 9.82494 11.925C10.1249 11.925 10.3749 11.7 10.3749 11.4L10.5249 9.20004C10.5249 8.87504 10.2999 8.62504 9.99994 8.60004Z"
              fill=""
            />
            <path
              d="M5.97497 8.60004C5.67497 8.62504 5.42497 8.90004 5.44997 9.20004L5.62497 11.4C5.64997 11.7 5.89997 11.925 6.17497 11.925C6.19997 11.925 6.19997 11.925 6.22497 11.925C6.52497 11.9 6.77497 11.625 6.74997 11.325L6.57497 9.12504C6.57497 8.80004 6.29997 8.57504 5.97497 8.60004Z"
              fill=""
            />
          </svg>
          Borrar
        </button>
        </DropdownDefault>
        <div className="w-full text-center">
        
        </div>
        </div>
        <div className="flex justify-center flex-col  items-center">
        
          {/* Client Icon */}
          <div className="bg-cyan-800 text-white w-15 h-15 flex flex-row justify-center items-center rounded-full">
           <WalletIcon></WalletIcon>
          </div>
          {/* Client Info */}
          <div className="ml-4">
            <h3 className="text-lg text-center font-semibold text-gray-800">{label}</h3>
           
          </div>
          <h3 className="text-2xl text-success">$ {formatAmount(amount)}</h3>
          <p> {new Date(date).toLocaleDateString('es-ES',{ year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>{installment_number} Cuotas</p>
        </div>
       

          
       {
        status== "active" ? ( <Tag type={"primary"} label={"activo"}></Tag>) :
        
        status== "completed" ?
        ( <Tag type={"success"} label={"completado"}></Tag>) : ( <Tag type={"danger"} label={"cancelado"}></Tag>)
       }
{/* 
      {
        total_expired>0 ? ( <Tag type={"danger"} label={"c.vendcidas"}></Tag>) : (<></>)
       }
       {
        total_inomplete>0 ? ( <Tag type={"warning"} label={"c.incompletas"}></Tag>) : (<></>)
       } */}
     {/*   <Tag
      type="danger"

      label={"pagos vencidos"}

      ></Tag> */}
        {/* Divider */}
        <div className="my-4 border-t border-gray-200"></div>
  
        {/* Rating Section 
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">Rating:</p>
          <div className="flex">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <StarIcon key={i} filled={i < rating} />
              ))}
          </div>
        </div>*/}
  
        {/* Action Button */}

        <div className="text-center">
         
         
          <Link to={"/loans/"+id}>ver prestamo</Link>
        </div>
      </div>
    );
  };
  


/* 
export const WalletIcon = ({ width = 30, height = 30, color = "currentColor" }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={width}
        height={height}
        fill={color}
      >
        <path d="M21 7h-7V5c0-1.1-.9-2-2-2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-9-2v2H5V5h7zm9 14H5V9h16v10zm-5-5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" />
      </svg>
    );
  }; */


    
 /*  
  export const UserIcon = ({ className = 'h-6 w-6', fill = 'currentColor' }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill={fill}
    >
      <path
        d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.86 0-7 3.14-7 7 0 .552.448 1 1 1h12c.552 0 1-.448 1-1 0-3.86-3.14-7-7-7z"
      />
    </svg>
  );
  
  
  export const StarIcon = ({ filled }) => (
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
   */