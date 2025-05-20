import { getMonday, getSunday} from  "../../common/funcs"



export const  getWeekPayments = async (filter)=>{

   /*  const start = getMonday(new Date())
    const end = getSunday(new Date())
 */
    console.log("filter:----------------------------->",filter)

    try {
        const fetch = await window.database.models.Payments.getPayments({
            select:`payments.id as payment_id,
                payments.label as label,
                payments.amount as monto,
                payments.status,
                payments.loan_id,
                strftime('%Y-%m-%d', payments.payment_date) AS payment_day,  
                c.nickname AS client_name,
                l.label as loan_label, l.total_amount as loan_total_amount`,
                    
            where:`(payments.payment_date >= '${filter.start}' 
            AND payments.payment_date <= '${filter.end}')
            AND (payments.paid_date IS NULL OR payments.paid_date = 'null') 
            AND (payments.status = 'pending' OR payments.status = 'expired')`,
                    
            joins:`JOIN loans l ON payments.loan_id = l.id   
                JOIN clients c ON l.client_id = c.id `,
        })

        console.log("fetch:----------------------------->",fetch)
        return fetch
    } catch (error) {
        console.log(error)
        return []
    }
}


/* const start = getMonday(new Date())
    const end = getSunday(new Date())
 */
    //console.log(start,end)
   /*  console.log(
      await window.sqlite.query("SELECT  strftime('%Y-%m-%d', 'now', 'weekday 6') as date FROM payments"))
 */
/* 
      const query=`SELECT
  p.id as payment_id,
   p.label as label,
   p.amount as monto,
   p.state,
    strftime('%Y-%m-%d', p.payment_date) AS payment_day,  -- Formato de la fecha (año-mes-día)
    c.nickname AS client_name,  -- Concatenar nombre y apellido del cliente
    COUNT(*) AS total_expired,  -- Cuenta cuántas cuotas vencidas hay en ese día
    SUM(p.amount) AS total_amount  -- Suma el monto total de las cuotas vencidas en ese día
    
    FROM payments p
    
    JOIN loans l ON p.loan_id = l.id  -- Unir con la tabla de préstamos
    JOIN clients c ON l.client_id = c.id  -- Unir con la tabla de clientes
    
    WHERE (p.state = 'pending' OR p.state = 'expired') AND payed_date IS NULL   -- Filtra solo las cuotas vencidas
      AND p.payment_date BETWEEN '${start}' AND
    '${end}'

GROUP BY payment_day, client_name  -- Agrupa por día y nombre del cliente
ORDER BY payment_day, client_name;  -- Ordena por fecha y nombre del cliente`

    const query = `SELECT
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
     END;'
 `

const query=`SELECT
p.id as payment_id,
 p.label as label,
 p.amount as monto,
 p.state,
  strftime('%Y-%m-%d', p.payment_date) AS payment_day,  -- Formato de la fecha (año-mes-día)
  c.nickname AS client_name,  -- Concatenar nombre y apellido del cliente
  COUNT(*) AS total_expired,  -- Cuenta cuántas cuotas vencidas hay en ese día
  SUM(p.amount) AS total_amount  -- Suma el monto total de las cuotas vencidas en ese día
  FROM payments p
  JOIN loans l ON p.loan_id = l.id  -- Unir con la tabla de préstamos
  JOIN clients c ON l.client_id = c.id  -- Unir con la tabla de clientes
  WHERE (p.state = 'pending' OR p.state = 'expired') AND payed_date IS NULL   -- Filtra solo las cuotas vencidas
    AND p.payment_date BETWEEN '${dates[0]}' AND
  '${dates[1]}'
GROUP BY payment_day, client_name  -- Agrupa por día y nombre del cliente
ORDER BY payment_day, client_name;  -- Ordena por fecha y nombre del cliente`
 */