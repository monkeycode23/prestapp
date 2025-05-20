export const getLoan = async (loanId) => {
  try {
    const loan = await window.database.models.Loans.getLoan({
      select: "loans.*, clients.nickname as nickname",
      joins: "LEFT JOIN clients ON clients.id = loans.client_id",
      where: `loans.id = ${loanId}`,
    });

    console.log("loan---a>>", loan);
    return loan[0];
  } catch (error) {}

  // return loan
};


export const deleteLoanDb = async (loanId) => {
    console.log("loanId---a>>", loanId);
    try {
        await window.database.models.Loans.deleteLoan(loanId)
        await window.database.models.Payments.deleteMany({
            where: `loan_id = ${loanId.id}`
        })
       /*  await window.database.models.Notes.deleteMany({
            where: `loan_id = ${loanId}`
        }) */
       
        return true

    } catch (error) {
        console.log("error---a>>", error);
        return false
    }
    
    
    }   


export const getPayments = async (loanId, filtro) => {

   
    function setDatesQuery(filter){

      console.log("filter2:----------------------------->",filter)

      let  query =filter.dates?.from || filter.dates?.to ? 'AND payments.payment_date ' : ''

      if(filter.dates?.from && filter.dates?.to){
         query += `BETWEEN '${filter.dates.from}' AND '${filter.dates.to}'`
      }else{
         if(filter.dates?.from && !filter.dates?.to){
            query += `>= '${filter.dates.from}'`
         }
   
         if(!filter.dates?.from && filter.dates?.to){
            query += `<= '${filter.dates.to}'`
         }
      }
      console.log("query23123:----------------------------->",query)
      return query
   }

  function statusFilter(filter) {
    let statusKeys = Object.keys(filter.status);
    let statusValues = Object.values(filter.status);
    let statusQuery = '';

    const keys = statusKeys.filter((status, index) => statusValues[index]).map(status => `'${status}'`).join(',');
    statusQuery = keys.length > 0 ? `AND payments.status IN (${keys})` : "";

    console.log("statusQuery:----------------------------->", statusQuery);
    return statusQuery;
  } 

  console.log("filtrooooooooooooo>>>>>>",filtro)

  const statusQuery = statusFilter(filtro)
  const datesQuery = setDatesQuery(filtro)
  console.log(statusQuery)
  try {
    const payments = await window.database.models.Payments.getPayments({
      where: `loan_id = ${loanId} ${statusQuery}`,
      limit: filtro.limit ,
      offset: filtro.offset,
    });

    const total = await window.database.models.Payments.getPayments({
    select:"COUNT(*) as total",
      where: `loan_id = ${loanId} ${statusQuery}`     
        })    

    //console.log("payments---a>>", payments);

    return {payments,total:total[0].total};

  } catch (error) {
    //console.log("error---a>>", error);

    return {payments:[],total:0};
  }
}


export const getTotalPayments = async (loanId) => {
  
  try {
    const total = await window.database.models.Payments.getPayments({
      select:"COUNT(*) as total",
      where: `loan_id = ${loanId} `
    });
    return total[0].total;
  } catch (error) {
    console.log("error---a>>", error);
    return 0;
  }
}

export const getPaymentsGains = async (loanId) => {

  //console.log(loanId)
  try {
    const payments = await window.database.models.Payments.getPayments({
      where: `loan_id = ${loanId} AND status = 'paid' `,
      select: "sum(amount) as net_gains,sum(gain) as brute_gains",
    });

    console.log("payments---a>>", payments);

    /* const gains = payments.reduce((acc, payment) => {
            acc.net_gains += payment.net_gains
            acc.brute_gains += payment.brute_gains
            return acc
        }, { net_gains: 0, brute_gains: 0 }) */
    return payments[0];
  } catch (error) {}
};

export const isLoanCompletedPaid = async (id) => {
  try {
    const payments = await window.database.models.Payments.getPayments({
      where: `loan_id = ${id} AND status != 'paid'`,
    });

    return payments.length === 0;
  } catch (error) {
    console.error("Error checking loan completion:", error);
    return false;
  }
};

export const payPayment = async (paymentId, loan) => {
  try {

    const now = new  Date()

    const year =now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');  // Añade un 0 al mes si es menor que 10
    const day = now.getDate().toString().padStart(2, '0');  // Añade un 0 al día si es menor que 10
    
    console.log("paymentId---a>>", paymentId);

    await window.database.models.Payments.updatePayment({
      id: paymentId,
      status: "paid",
      paid_date: `${year}-${month}-${day}`,
    });

   const payment = await window.database.models.Payments.getPaymentById(paymentId)

   console.log(payment)

    const isCompleted = await isLoanCompletedPaid(loan.id);

    if (isCompleted) {
      await window.database.models.Loans.updateLoan({
        id: loan.id,
        status: "completed",
      });
    }

    return isCompleted;
  } catch (error) {
    console.log("error---a>>", error);
    return false;
  }
};

export const getNotes = async (id, type) => {
  try {
    const notes = await window.database.models.Notes.getNote({
      where: `${type}_id = ${id} `,
    });
    console.log("notes---a>>", notes);
    return notes;
  } catch (error) {
    console.log("error---a>>", error);
    return [];
  }
};

export const checkAndUpdateActiveLoans = async () => {
  try {
    // Obtener todos los préstamos activos
    const activeLoans = await window.database.models.Loans.getLoans({
      where: "status = 'active'"
    });

    for (const loan of activeLoans) {
      const isCompleted = await isLoanCompletedPaid(loan.id);
      
      if (isCompleted) {
        await window.database.models.Loans.updateLoan({
          id: loan.id,
          status: "completed"
        });
        console.log(`Loan ${loan.id} updated to completed status`);
      }
    }

    return true;
  } catch (error) {
    console.error("Error checking active loans:", error);
    return false;
  }
};
