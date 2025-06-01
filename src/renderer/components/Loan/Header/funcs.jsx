

export  const adjustLoanAmount = async(loan)=>{

  try {
    const fetchAmount= await window.database.models.Payments.getPayments({
        select:`SUM(amount) as total_amount`,
        where:`loan_id=${loan.id}`
    })

    await window.database.models.Loans.updateLoan({
        id:loan.id,
        amount:fetchAmount.length ? fetchAmount[0].tota_amount : loan.amount
    })

    return true
  } catch (error) {
    
    console.log(error)
  
    
}

return false
}

export  const completeRemainingInstallments =async(loan)=>{

    
}


export  const adjustUnpaidInstallments =async(loan)=>{

    
}

export  const autoGenerateInstallments =async(loan)=>{

    
}