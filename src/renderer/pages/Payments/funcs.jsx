

export const getClientPaymentsCountDate = async (date) => {   
    try {
 

        //console.log("date:----------------------------->",date)

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
              WHEN payments.status = 'incomplete' THEN 1
              ELSE NULL
            END) AS incomplete, 
            COUNT(CASE 
              WHEN payments.status = 'expired' THEN 1
              ELSE NULL
            END) AS expired`,
        
          where: `payment_date ='${date}' `, // Asegúrate de que clientId sea un valor numérico o escapado adecuadamente
        
          joins: `
            JOIN loans ON payments.loan_id = loans.id 
            JOIN clients ON loans.client_id = clients.id`,
        })
 
     //console.log("asdadasddata:----------------------------->",data)
     return data[0]
    } catch (error) {
     //console.log("error:----------------------------->",error)
     return []
    }
 }
 

/* const query = `SELECT 
  
  FROM payments
  
  WHERE 
    state = 'payed'
GROUP BY 
    strftime('%m', payment_date);` */
    
export const getYearPaymentsTotalAmountDate = async () => {
  try {
    const data = await window.database.models.Payments.getPayments({
      select: `DISTINCT CAST(strftime('%m', payment_date) AS INTEGER) AS month ,
        SUM(gain) AS total_gains,
        SUM(net_amount) AS total_net`,
      where: `status = 'paid' `,
      groupBy: `strftime('%m', payment_date);`,
      //orderBy: `month`
    });

    const expected = await window.database.models.Payments.getPayments({
        select: `DISTINCT CAST(strftime('%m', payment_date) AS INTEGER) AS month ,
          SUM(gain) AS total_gains
          `,
        
        groupBy: `strftime('%m', payment_date);`,
        //orderBy: `month`
      });

    //console.log("year data:----------------------------->", data);
    return {data,expected};
  } catch (error) {
    //console.log("error:----------------------------->", error);
  }
};




    export const getWeekPaymentsTotalAmountDate = async ({start,end}) => {
    try {
        const data = await window.database.models.Payments.getPayments({
            select: `CASE strftime('%w', payment_date)
                WHEN '0' THEN 'Domingo'
                WHEN '1' THEN 'Lunes'
                WHEN '2' THEN 'Martes'
                WHEN '3' THEN 'Miércoles'
                WHEN '4' THEN 'Jueves'
                WHEN '5' THEN 'Viernes'
                WHEN '6' THEN 'Sábado'
            END AS weekday_name,
            payment_date,
            strftime('%w', payment_date) AS weekday,
            SUM(net_amount) AS total_amount,
            SUM(gain) AS total_gains,
            SUM(amount) AS total_amount_gains,
            COUNT(*) AS total_payments`,
            where: `status = 'paid' AND payment_date BETWEEN '${start}' AND '${end}'`,
            groupBy: 'weekday',
            orderBy: 'weekday'
        })

        //console.log("bar grapgiasd:----------------------------->",data)
        return data
    } catch (error) {
        //console.log("error:----------------------------->",error)
    }
}




export const getPaymentsStatusDate = async ({start,end}) => {
    try {


        
 /*    const query = `SELECT
       state,
       COUNT(*) AS total_payments
     FROM payments
     WHERE payment_date BETWEEN 
         '${start}' AND
'${end}'
     GROUP BY state
     ORDER BY CASE state
       WHEN 'payed' THEN 1
       WHEN 'expired' THEN 2
       WHEN 'incomplete' THEN 3
       WHEN 'pending' THEN 4
       ELSE 5
     END;'` */
        const data = await window.database.models.Payments.getPayments({
            select: `status,COUNT(*) AS total_payments`,
            where: `payment_date BETWEEN '${start}' AND'${end}'`,
            groupBy: 'status',
            orderBy: `CASE status WHEN 'paid' THEN 1 WHEN 'expired' THEN 2 WHEN 'incomplete' THEN 3 WHEN 'pending'   THEN 4 ELSE 5 END`
        })

        //console.log("data:----------------------------->",data)

       /*  const total = await window.database.models.Payments.getPayments({
            select: "COUNT(id) as total",
            where: `status = 'paid'`,
        }) */

        return data
    } catch (error) {
        //console.log("error:----------------------------->",error)
    }
}


export const getTodayPaymentsDate = async (date,filter)  => {
    try {


        const curentDate =date != undefined  ? new Date(date) : new Date()
        console.log("now:----------------------------->",curentDate)
        //const date =filter.date ? new Date(filter.date) : now

        const dateLocal = new Date(curentDate.getTime() - (curentDate.getTimezoneOffset() * 60000));  // Ajusta la fecha a la zona horaria local
        const dateString = dateLocal.toISOString().split('T')[0]; // Ahora la fecha será correcta en tu zona horaria
        //console.log(dateString);
        console.log("dateString:----------------------------->",dateString)
        console.log("search:----------------------------->",filter.search)

        const query={
            select: `payments.*, loans.client_id, clients.nickname	,clients.id as client_id`,     
            where: `payments.payment_date = '${dateString}' ${filter.search ? `AND clients.nickname LIKE '%${filter.search}%'` : ''}`,
            joins : `INNER JOIN loans ON loans.id = payments.loan_id INNER JOIN clients ON clients.id = loans.client_id`,
            limit:filter.limit,
            offset: (filter.page - 1) * filter.limit,
            orderBy: `payments.id DESC`
        }

       // console.log("query:----------------------------->",query)

        const data = await window.database.models.Payments.getPayments(query)

     

        const total = await window.database.models.Payments.getPayments({
            select: "COUNT(id) as total",
            where: `payment_date = '${dateString}'`,
        })
      //  console.log("----------------->total",total)
        return {payments:data,total:total[0].total}

    } catch (error) {
        console.log("error:----------------------------->",error)

        return {payments:[],total:0}
    }
}

export const toLocaleDate = (date) => {
    const dateLocal = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));  // Ajusta la fecha a la zona horaria local
    const dateString = dateLocal.toISOString().split('T')[0]; // Ahora la fecha será correcta en tu zona horaria
    return dateString
}


export const getPaymentsGainsDate = async ({
    date
}) => {

    try {

        const dateString =date ?  toLocaleDate(date) : toLocaleDate(new Date())
        console.log("dateString:----------------------------->",dateString)
        const gains = await window.database.models.Payments.getPayments({
            select: "SUM(amount) as netGains, SUM(gain) as gains",
            where: `payment_date = '${dateString}' AND status='paid'`,
        })

       // console.log("gains:----------------------------->",gains)

        return {
            netGains:gains[0].netGains ? gains[0].netGains : 0,
            gains:gains[0].gains ? gains[0].gains : 0}
        
    } catch (error) {
        //console.log("error:----------------------------->",error)
    }

}
