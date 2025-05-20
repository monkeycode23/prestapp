import React from 'react'

//components
import { SackDollar, CalendarDateIcon, BaselineFactCheck, BaselineAssignment } from '../../Icons'
import { Link } from 'react-router-dom'
import Tooltip from '../../Tooltip'
//utils
import { formatAmount } from '../../../common/funcs'

const LoanCard = ({loan}) => {
  return (
    <div className={ `w-full flex  gap-4 xsm:col-span-12
     sm:col-span-12 md:col-span-12 
     lg:col-span-6
     xl:col-span-6
${loan.status === 'active' ? 'bg-primary' : loan.status === 'completed' ? 'bg-success' : 'bg-danger'} 
shadow-2xl
    text-white p-4 rounded-xl
    relative
    `}>
        <div className='flex flex-row gap-2 justify-center items-center '>

        <SackDollar width={45} height={45} />
        </div>
        
         {/* Icono de fondo grande en el medio */}
      <div className="absolute top-0 left-20 w-full h-full flex justify-center items-center opacity-20 z-0">
        
        {loan.status === 'active' ? <BaselineAssignment width={200} height={200} /> : loan.status === 'completed' ? 
        <BaselineFactCheck width={200} height={200} /> : 
        <BaselineAssignment width={200} height={200} />}
      </div>
        <div className='w-full flex flex-col gap-2 z-10'>
            <Link to={`/loans/${loan.id}`}><p className='text-lg font-bold text-gray-200 z-2'>{loan.label}</p></Link>
            <h1 className='text-4xl font-bold pb-3'>${formatAmount(loan.amount)}</h1>
            <div className='flex flex-row gap-2 justify-between'>
            <div className=' flex flex-row gap-2 items-center'>
                <CalendarDateIcon width={20} height={20} />
                 <p className='text-sm'>{loan?.loan_date}</p>
            </div>
            <span className='text-sm flex flex-row gap-2 items-center'>
                {loan.status === 'active' ? <span className='text-md font-bold bg-sky-800 text-white rounded-md p-1 z-1'>activo</span> : 
                
                loan.status === 'completed' ? <span className='text-md font-bold bg-green-700 text-white rounded-md p-1 z-1'>completado</span> :
                 <span className='text-md font-bold bg-danger text-white rounded-md p-1 z-1'>cancelado</span>}
            </span>
            </div>
        </div> 
        <span className='font-bold text-xl absolute top-0 right-4 
        hover:cursor-pointer
        '>...</span>

        <div className='flex flex-col justify-center  items-center mt-6'>
            
            
            <span className='text-lg font-bold rounded-full  bg-white text-black p-3'>
                <span className='text-sm font-bold text-success'>{loan?.paid ? loan?.paid : 0}</span>/{loan?.installment_number}
            </span>  
        <br></br>
            <div className='flex flex-row gap-2'>
            {loan.expired > 0 &&
            <Tooltip text={` pagos vencidos: ${loan.expired}`} position='bottom'>
            <span className='rounded-full bg-danger p-2 text-xs px-2 py-1'>{loan.expired}</span>
            </Tooltip>
            }
            {loan.incomplete > 0 &&
            <Tooltip text={` pagos incompletos: ${loan.incomplete}`} position='bottom'>
            <span className='rounded-full bg-warning p-2 text-xs px-2 py-1'>{loan.incomplete}</span>
            </Tooltip>
            }
            
            </div> 

        </div> 
    </div>
  )
}

export default LoanCard