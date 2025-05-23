import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts'; 

import { useSelector,useDispatch } from 'react-redux';
 
 const Chart = () => {


  const paymentData = [
    { name: "Pagados", value: 0,color: "#10B981" },
    { name: "Pendientes", value:0,color: "#3B82F6" },
    { name: "Vencidos", value:0, color: "#EF4444" },
    { name: "Incompletos", value: 0,color: "#F59E0B" }
  ]
        const [state, setState] = React.useState({
          
            series: [],
            options: {
              chart: {
                type: "pie",
              },
              labels: paymentData.map(item => item.name),
              colors: paymentData.map(item => item.color),
              legend: {
                position: "bottom",
              },
              tooltip: {
                y: {
                  formatter: (value) => `${value} pagos`,
                },
              },
            }
        });

        
        //const [payments,setPayments ] = useState([])
        const loan = useSelector((state) => state.loans.loan)
                const payments = useSelector((state) => state.payments)

      /*   ;
      
        const chartOptions = {
          chart: {
            type: "pie",
          },
          labels: paymentData.map(item => item.name),
          colors: paymentData.map(item => item.color),
          legend: {
            position: "bottom",
          },
          tooltip: {
            y: {
              formatter: (value) => `${value} pagos`,
            },
          },
        }; */
      
/*         const chartSeries = paymentData.map(item => item.value);
 */       
        useEffect(() => {
          
          async function init(){

            const payments  = await window.database.models.Payments.getPayments({
            select: `COUNT(*) AS total_payments ,
              COUNT(CASE status WHEN 'paid' THEN 1 ELSE NULL END) as total_paid,
              COUNT(CASE status WHEN 'pending' THEN 1 ELSE NULL END) as total_pending,
              COUNT(CASE status WHEN 'expired' THEN 1 ELSE NULL END) as total_expired,
              COUNT(CASE status WHEN 'incomplete' THEN 1 ELSE NULL END) as total_incomlete
            `,
            where: `loan_id ='${loan?.id}' `,
           // groupBy: 'status',
          //  orderBy: `CASE status WHEN 'paid' THEN 1 WHEN 'expired' THEN 2 WHEN 'incomplete' THEN 3 WHEN 'pending'   THEN 4 ELSE 5 END`
        })
          console.log(payments)

          //const paymentState = payments.map((val)=>val.total_payments)
         // const total = paymentState.reduce((a, b) => a + b, 0);

        setState({
          ...state,
          series:[
            payments[0].total_paid,
            payments[0].total_pending,
            payments[0].total_expired,
            payments[0].total_incomlete
          ]
        })
       /*  setPayments(payments)

          console.log(payments)

           */
        }
           
        
          init()
          return () => {
            
          }
        }, [loan?.id,payments.paidPayments]);
        
      
        

        return (
          <div>
            <div>
                <div class="chart-wrap">
                  <div id="chart">
                <ReactApexChart options={state.options} series={state.series} type="pie" width={380} />
              </div>
                </div>
              
               
              </div>
            <div id="html-dist"></div>
          </div>
        );
      }


      export default Chart