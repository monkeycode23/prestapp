import React from 'react'
import PaymentCard from './PaymentCard'
import { useSelector } from 'react-redux'
function PaymentsCardsList() {
 
  const payments = useSelector((state) => state.payments.payments)


  return (
    <div className='w-full grid grid-cols-12 gap-5'>
        {payments.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} />
        ))}
    </div>
  )
}

export default PaymentsCardsList