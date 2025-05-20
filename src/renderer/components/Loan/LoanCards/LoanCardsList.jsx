import React from 'react'
import LoanCard from './LoanCard'
import { useSelector } from 'react-redux'
function LoanCardsList() {
 
  const loans = useSelector((state) => state.loans.loans)


  return (
    <div className='w-full grid grid-cols-12 gap-5'>
        {
          loans.length > 0 ?
          loans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))
          :
          <div className='col-span-12 flex justify-center mt-10 h-screen'>
            <p className='text-2xl font-bold text-gray-400  '>No hay préstamos</p>
          </div>
        }
    </div>
  )
}

export default LoanCardsList