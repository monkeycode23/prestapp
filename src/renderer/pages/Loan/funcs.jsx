export const getLoan = async (loanId) => {
  try {
    const loan = await window.database.models.Loans.getLoan({
      select: "loans.*, clients.nickname as nickname",
      joins: "LEFT JOIN clients ON clients.id = loans.client_id",
      where: `loans.id = ${loanId}`,
    });

    return loan[0];
  } catch (error) {}

  // return loan
};

import { uint8ArrayToHexString } from "../../common/funcs";

export const deleteLoanMongo=async(loan)=>{
  //console.log(client.id)
             
  try {
     
     if(!navigator.isOnline){ 

        const loanMongo = await window.mongo.findOne("Prestamo",{sqlite_id:loan.id.toString()},{path:"payments",model:"Pago"})

             console.log("client--->mongo ",loanMongo)
             if(loanMongo) await window.mongo.delete("Cliente",loanMongo._id)
             
             //const prestamos = await window.mongo.find("Cliente",{nickname:client.nickname})
           if(loanMongo && loanMongo.payments.length)
           {
             console.log("---->loasn pmongoasd",loanMongo.payments)
             await Promise.all(loanMongo.payments.map(async(payment)=>{
               
               return window.mongo.delete("Prestamo",uint8ArrayToHexString(payment._id.buffer))
               
             }))
           }
        }

     await window.database.models.ActivityLog.createActivity({
        action_type: "DELETE",
        entity: "Prestamo",
        entity_id: loan.id,
        payload: JSON.stringify(loan),
        synced: navigator.onLine ? 1 : 0,
      });
  } catch (error) {
     console.log(error)
  }
  
          
}

export const deleteLoanDb = async (loanId) => {
  try {
    await window.database.models.Loans.deleteLoan(loanId);
    await window.database.models.Payments.deleteMany({
      where: `loan_id = ${loanId.id}`,
    });
    /*  await window.database.models.Notes.deleteMany({
            where: `loan_id = ${loanId}`
        }) */

    return true;
  } catch (error) {
    return false;
  }
};

export const getPayments = async (loanId, filtro) => {

  console.log(filtro)
  function setDatesQuery(filter) {
    let query =
      filter.dates?.from || filter.dates?.to
        ? "AND payments.payment_date "
        : "";

    if (filter.dates?.from && filter.dates?.to) {
      query += `BETWEEN '${filter.dates.from}' AND '${filter.dates.to}'`;
    } else {
      if (filter.dates?.from && !filter.dates?.to) {
        query += `>= '${filter.dates.from}'`;
      }

      if (!filter.dates?.from && filter.dates?.to) {
        query += `<= '${filter.dates.to}'`;
      }
    }
    return query;
  }

  function statusFilter(filter) {
    let statusKeys = Object.keys(filter.status);
    let statusValues = Object.values(filter.status);
    let statusQuery = "";

    const keys = statusKeys
      .filter((status, index) => statusValues[index])
      .map((status) => `'${status}'`)
      .join(",");
    statusQuery = keys.length > 0 ? `AND payments.status IN (${keys})` : "";

    return statusQuery;
  }

  const statusQuery = statusFilter(filtro);
  const datesQuery = setDatesQuery(filtro);
  try {
    const payments = await window.database.models.Payments.getPayments({
      where: `loan_id = ${loanId} ${statusQuery}`,
      orderBy:"id "+filtro.order,
      limit: filtro.limit,
      offset: filtro.offset,
    });

    const total = await window.database.models.Payments.getPayments({
      select: "COUNT(*) as total",
      where: `loan_id = ${loanId} ${statusQuery}`,
    });

    return { payments, total: total[0].total };
  } catch (error) {
    return { payments: [], total: 0 };
  }
};

export const getTotalPayments = async (loanId) => {
  try {
    const total = await window.database.models.Payments.getPayments({
      select: "COUNT(*) as total",
      where: `loan_id = ${loanId} `,
    });
    return total[0].total;
  } catch (error) {
    return 0;
  }
};

export const getPaymentsGains = async (loanId) => {
  try {
    const payments = await window.database.models.Payments.getPayments({
      where: `loan_id = ${loanId} AND status = 'paid' `,
      select: "sum(amount) as net_gains,sum(gain) as brute_gains",
    });

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
    return false;
  }
};

export const payPayment = async (paymentId, loan) => {
  try {
    const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Añade un 0 al mes si es menor que 10
    const day = now.getDate().toString().padStart(2, "0"); // Añade un 0 al día si es menor que 10

    await window.database.models.Payments.updatePayment({
      id: paymentId,
      status: "paid",
      paid_date: `${year}-${month}-${day}`,
    });

    const payment = await window.database.models.Payments.getPaymentById(
      paymentId
    );

    const isCompleted = await isLoanCompletedPaid(loan.id);

    if (isCompleted) {
      await window.database.models.Loans.updateLoan({
        id: loan.id,
        status: "completed",
      });
    }

    return isCompleted;
  } catch (error) {
    return false;
  }
};

export const getNotes = async (id, type) => {
  try {
    const notes = await window.database.models.Notes.getNote({
      where: `${type}_id = ${id} `,
    });
    return notes;
  } catch (error) {
    return [];
  }
};



export const getLoanCurrentGains = async (id) => {
  try {
    const payments = await window.database.models.Payments.getPayments({
      select: `SUM(CASE WHEN status='paid' THEN gain ELSE 0 END) as total_brute_gains,
      SUM(CASE WHEN status='paid' THEN amount ELSE 0 END) as total_net_gains
      `,
      where: `loan_id = ${id}`,
    });

    console.log(payments);

    return {
      brute:payments.length ? payments[0].total_brute_gains : 0,
      net:payments.length ? payments[0].total_net_gains : 0
    }
  } catch (error) {
    console.log(error);
  }
};


export const checkCompletedLoan=async(id,installments)=>{
  try {
    const payments = await window.database.models.Payments.getPayments({
      select: `COUNT(CASE WHEN status='paid' THEN amount ELSE 0 END) as total_paid`,
      where: `loan_id = ${id}`,
    });

    console.log(payments);
    if(payments.length && payments[0].total_paid < installments  ){
      const payments = await window.database.models.Loans.updateLoan({
        id,
        status:"active"
      });
    }
    
  } catch (error) {
    console.log(error);
  }
  
}

export const getLoanTotalPaid = async (id) => {
  try {
    const payments = await window.database.models.Payments.getPayments({
      select: `SUM(CASE WHEN status='paid' THEN amount ELSE 0 END) as total_paid`,
      where: `loan_id = ${id}`,
    });

    console.log(payments);

    return payments.length ? payments[0].total_paid : 0;
  } catch (error) {
    console.log(error);
  }
};

export const getLoanLeftToPay = async (id) => {
  try {
    const payments = await window.database.models.Payments.getPayments({
      select: `SUM(CASE WHEN status in ('pending','expired','incomplete') THEN amount ELSE 0 END) as total_left_to_pay`,
      where: `loan_id = ${id}`,
    });


    console.log(payments);

    return payments.length ? payments[0].total_left_to_pay : 0;
  } catch (error) {
    console.log(error);
  }
};


export const getLeftMoney = async (id) => {
  try {
    const leftmoney = await window.database.models.Payments.getPayments({
      select: `sum(payments.amount) as total_left`,
      where: `loan_id=${id} AND payments.status in ('paid')`,
    });

    console.log(leftmoney);

    return leftmoney.length ? leftmoney[0].total_left : 0;
  } catch (error) {
    return 0;
  }
};
export const checkAndUpdateActiveLoans = async () => {
  try {
    // Obtener todos los préstamos activos
    const activeLoans = await window.database.models.Loans.getLoans({
      where: "status = 'active'",
    });

    for (const loan of activeLoans) {
      const isCompleted = await isLoanCompletedPaid(loan.id);

      if (isCompleted) {
        await window.database.models.Loans.updateLoan({
          id: loan.id,
          status: "completed",
        });
      }
    }

    return true;
  } catch (error) {
    return false;
  }
};
