import { deleteClient } from "../../redux/reducers/clients"



export const getClient = async (clientId) => {
   // console.log("clientId:----------------------------->",clientId)
   try {
    const data = await window.database.models.Clients.getClientById(clientId)
    return data[0]
   } catch (error) {
    console.log("error:----------------------------->",error)
    return []
   }
    




   // console.log("client data:----------------------------->",data)
   
}


export const deleteClientDb = async (clientId) => {
   try {
      await window.database.models.Clients.deleteClient(clientId)


      
      await window.database.models.Loans.deleteMany({
         where: `client_id = ${clientId}`
      })

      await window.database.models.Payments.deleteMany({
         where: `loan_id IN (SELECT id FROM loans WHERE client_id = '${clientId}');`
      })
      
   } catch (error) {
      console.log("error:----------------------------->",error)
   }
}



export const getClientPaymentsCount = async (clientId) => {   
   try {

   

      const data = await window.database.models.Payments.getPayments({
         select: `COUNT(CASE 
             WHEN payments.status = 'pending' THEN 1
             ELSE NULL
           END) AS pending,
           
           COUNT(CASE 
             WHEN payments.status = 'paid' THEN 1
             ELSE NULL
           END) AS paid,
           
           COUNT(CASE 
             WHEN payments.status = 'expired' THEN 1
             ELSE NULL
           END) AS expired,
           
           COUNT(CASE 
             WHEN payments.status = 'incomplete' THEN 1
             ELSE NULL
           END) AS incomplete`,
           
       
         where: `clients.id = ${clientId}`, // Asegúrate de que clientId sea un valor numérico o escapado adecuadamente
       
         joins: `
           JOIN loans ON payments.loan_id = loans.id 
           JOIN clients ON loans.client_id = clients.id`,
       })

    //nsole.log("asdadasddata:----------------------------->",data)
    return data[0]
   } catch (error) {
   console.log("error:----------------------------->",error)
    return []
   }
}

export const getClientGains = async (clientId) => {
   try {
    const data = await window.database.models.Payments.getPayments({
      select: `SUM(payments.amount) as net_amount, SUM(payments.gain) as brute_gain`,
      joins:`JOIN loans l ON payments.loan_id = l.id JOIN clients c ON l.client_id = c.id`,
      where: `c.id = ${clientId} AND payments.status = 'paid' `
    })
   //onsole.log("ganaciassssssss data:----------------------------->",data)
    return {
      net_amount:data[0].net_amount,
      brute_gain:data[0].brute_gain
    }
   } catch (error) {
    //nsole.log("error:----------------------------->",error)
    return []
   }

}

export const getClientLoans = async (clientId,filter,page,limit) => {
   

    function setAmountQuery(filter){

      console.log("filter2:----------------------------->",filter)

      let  query =filter.amount?.from || filter.amount?.to ? 'AND loans.amount ' : ''

      if(filter.amount?.from && filter.amount?.to){
         query += `BETWEEN ${filter.amount.from} AND ${filter.amount.to}`
      }else{
         if(filter.amount?.from && !filter.amount?.to){
            query += `>= ${filter.amount.from}`
         }
   
         if(!filter.amount?.from && filter.amount?.to){
            query += `<= ${filter.amount.to}`
         }
      }

   
      console.log("query23123:----------------------------->",query)
      return query
   }


   function setInstallmentsQuery(filter){

      console.log("filter2:----------------------------->",filter)

      let  query =filter.installments?.from || filter.installments?.to ? 'AND loans.installment_number ' : ''

      if(filter.installments?.from && filter.installments?.to){
         query += `BETWEEN ${filter.installments.from} AND ${filter.installments.to}`
      }else{
         if(filter.installments?.from && !filter.installments?.to){
            query += `>= ${filter.installments.from}`
         }
   
         if(!filter.installments?.from && filter.installments?.to){
            query += `<= ${filter.installments.to}`
         }
      }

   
      console.log("query23123:----------------------------->",query)
      return query
   }


   function setDatesQuery(filter){

      console.log("filter2:----------------------------->",filter)

      let  query =filter.dates?.from || filter.dates?.to ? 'AND loans.loan_date ' : ''

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


   function setInterestRateQuery(filter){

      console.log("filter2:----------------------------->",filter)

      let  query =filter.interestRate ? 'AND loans.interest_rate ' : ''

      if(filter.interestRate){
         query += `= '${filter.interestRate}'`
      }

   
      console.log("query23123:----------------------------->",query)
      return query
   }

 

   console.log("filter:----------------------------->",filter)
   try {

       let statusKeys = []
       let statusValues =[] 
       let statusQuery='' 
       const amountQuery=setAmountQuery(filter)
       const installmentsQuery=setInstallmentsQuery(filter)
       const datesQuery=setDatesQuery(filter)
       const interestRateQuery=setInterestRateQuery(filter)
       console.log("datesQuery:----------------------------->",datesQuery)
      if(filter?.status){
         statusKeys = Object.keys(filter.status)
         statusValues = Object.values(filter.status)

         // Solo incluir estados que estén activos (true)
         const activeStatuses = statusKeys.filter((status, index) => statusValues[index])
         
         if(activeStatuses.length > 0) {
            const keys = activeStatuses.map(status => `'${status}'`).join(',')
            statusQuery = `AND loans.status IN (${keys})`
         }
      
         console.log("statusQuery:----------------------------->",statusQuery)
      } 
    const query = {
        select: `loans.label,loans.id,loans.client_id,loans.amount,loans.gain,
        loans.loan_date,loans.generate_payments_date,loans.installment_number,
        loans.interest_rate,loans.status,
        COUNT(CASE WHEN p.status = 'pending' THEN 1 ELSE NULL END) AS pending,
      COUNT(CASE WHEN p.status = 'paid' THEN 1 ELSE NULL END) AS paid,
      COUNT(CASE WHEN p.status = 'expired' THEN 1 ELSE NULL END) AS expired,
      COUNT(CASE WHEN p.status = 'incomplete' THEN 1 ELSE NULL END) AS incomplete`,

        where: `loans.client_id = ${clientId} ${statusQuery} ${amountQuery} ${installmentsQuery} ${datesQuery} ${interestRateQuery}`,        
        joins: `LEFT JOIN payments p ON loans.id = p.loan_id`,
        orderBy: "loans.id DESC",
        limit: limit,
        offset: (page-1)*limit,
        groupBy: "loans.id"
    }

    console.log("query:----------------------------->",query)
    const data = await window.database.models.Loans.getLoans(query)

    const total = await window.database.models.Loans.getLoans(
      {
            select: `COUNT(*) as total`,

        where: `client_id = ${clientId} ${statusQuery} ${amountQuery} ${installmentsQuery} ${datesQuery} ${interestRateQuery}`,
      
      }
    )
    //nsole.log("loans data:----------------------------->",data)
    return {loans:data,total:total[0].total}
   } catch (error) {
    console.log("error:----------------------------->",error)
    return []
   }
}

export const getClientNotes = async (clientId) => {
   try {
      console.log("clientId:----------------------------->",clientId)
      const data = await window.database.models.Notes.getNotes({
         select: `*`,
         where: `client_id = ${clientId}`,
         
      })
      console.log("data:----------------------------->",data)
      return data.length>0 ? data[0].notes : []
   } catch (error) {
      console.log("error23234234:----------------------------->",error)
      return []
   }
}

export const getClientInformation = async (clientId) => {
   try {
      const data = await window.database.models.Information.getInformation({
         select: `*`,
         where: `client_id = ${clientId}`,
         limit: 1
      })
      return data[0]
   } catch (error) {
      console.log("error:----------------------------->",error)
      return []
   }
}  


export const insertLoan = async (loan) => {
   try {
    const data = await window.database.models.Loans.createLoan(loan)

    //create payments
   // const payments = await window.database.models.Payments.createPayments(loan)

    return data
   } catch (error) {
    console.log("error:----------------------------->",error)
    return []
   }
}




export const createPayments = async (loan,sunday) => {

   //nsole.log("loan:----------------------------->",loan)
   const {installment_number,
      total_amount,
      gain,
      amount,
      generate_payments_date,id,
      payment_interval,interest_rate} = loan


   try {
      const payments=[]
      //nsole.log("generate_payments_date:----------------------------->",generate_payments_date)

      const payDate = new Date(generate_payments_date+ "T00:00:00")
      //nsole.log("payDate:----------------------------->",payDate)

      for (let i = 0; i < installment_number; i++) {
         
         let ndate 

         if(payment_interval === "custom"){
            ndate = loan.dates[i]
         }else{
            
            ndate = i==0 ? generate_payments_date : calculatePaymentsDate(payDate,payment_interval,sunday)
         }
      
     
      const payment = await window.database.models.Payments.createPayment({
         label: `Pago ${i+1}`,
         loan_id:id,
         amount:Math.floor(total_amount/installment_number),
         gain:Math.floor(gain/installment_number),
         payment_date:ndate,
         status:"pending",
         net_amount:Math.floor(amount/installment_number),
         
   
   
       }) 

       payments.push(payment)
   }

  //onsole.log("payments:----------------------------->",payments)
    return payments
    //return data
   } catch (error) {
    console.log("error:----------------------------->",error)
    return []
   } 
}


const calculatePaymentsDate = (payDate,payment_interval,sunday) => { 
   //nsole.log("payDate:----------------------------->",payDate)
   if(payment_interval === "daily"){
      
      if(sunday){
         if(payDate.getDay()==6){
                  payDate.setDate(payDate.getDate()+1)
         }
      }
      payDate.setDate(payDate.getDate()+1)
   
   }else if(payment_interval === "weekly"){
      
      payDate.setDate(payDate.getDate()+7)
   }else if(payment_interval === "monthly"){
   
      payDate.setDate(payDate.getDate()+30)
   }
   else if(payment_interval === "fortnightly"){
      
      payDate.setDate(payDate.getDate()+15)
   }

   const anio1 = payDate.getFullYear();
   const mes1 = String(payDate.getMonth() + 1).padStart(2, "0"); // Mes (base 0) + 1, con cero inicial
   const dia1 = String(payDate.getDate()).padStart(2, "0"); // Día con cero inicial
      
   const ndate= `${anio1}-${mes1}-${dia1}`;
   //nsole.log("ndate:----------------------------->",ndate)
   return ndate
}


