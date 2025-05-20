import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts'; 

import { useSelector,useDispatch } from 'react-redux';
 
 const Chart = () => {
        const [state, setState] = React.useState({
          
            series: [],
            options: {
              chart: {
                width: 80,
                type: 'donut',
              },
              plotOptions: {
            pie: {
              donut: {
                size: '30%' // más delgado (puedes usar 60% o 50% si quieres aún más fino)
              }
            }
          },
                colors: ['#7BD77E', '#6577F3', '#FF6666', '#FFCC66'],

              labels: ['Pagados', 'Pendientes', 'Vencidos', 'Incompletos'],
              legend: {
                  show: false,
                  position: 'bottom',
                },
              dataLabels: {
                enabled: false,
              },
              responsive: [{
                breakpoint: 280,
                options: {
                  chart: {
                    width: 50
                  },
                  legend: {
                    show: false
                  }
                }
              }],
              
            },
          
          
        });

        
        const [payments,setPayments ] = useState([])
        const loan = useSelector((state) => state.loans.loan)
        
       
       
        useEffect(() => {
          
          async function init(){

            const payments  = await window.database.models.Payments.getPayments({
            select: `status,COUNT(*) AS total_payments`,
            where: `loan_id ='${loan?.id}' `,
            groupBy: 'status',
            orderBy: `CASE status WHEN 'paid' THEN 1 WHEN 'expired' THEN 2 WHEN 'incomplete' THEN 3 WHEN 'pending'   THEN 4 ELSE 5 END`
        })
          console.log(payments)

          const paymentState = payments.map((val)=>val.total_payments)

          console.log(paymentState)

          setState({
              ...state,
              series:paymentState
          })
       /*  setPayments(payments)

          console.log(payments)

           */
        }
           
        
          init()
          return () => {
            
          }
        }, [])
        
      
        

        return (
          <div>
            <div>
                <div class="chart-wrap">
                  <div id="chart">
                <ReactApexChart options={state.options} series={state.series} type="donut" width={380} />
              </div>
                </div>
              
               
              </div>
            <div id="html-dist"></div>
          </div>
        );
      }


      export default Chart