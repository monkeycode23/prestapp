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
                size: '30%',
                labels: {
                  show: true,
                  name: {
                    show: true,
                    fontSize: '22px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 600,
                    color: '#373d3f',
                    offsetY: -10,
                  },
                  value: {
                    show: true,
                    fontSize: '16px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 400,
                    color: '#373d3f',
                    offsetY: 16,
                  },
                  total: {
                    show: true,
                    label: 'Total',
                    fontSize: '16px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 600,
                    color: '#373d3f',
                  }
                }
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
          const total = paymentState.reduce((a, b) => a + b, 0);

          setState({
              options:{
                ...state.options,
                plotOptions: {
                  pie: {
                    donut: {
                      ...state.options.plotOptions.pie.donut,
                      labels: {
                        ...state.options.plotOptions.pie.donut.labels,
                        total: {
                          ...state.options.plotOptions.pie.donut.labels.total,
                          formatter: function (w) {
                            return total;
                          }
                        }
                      }
                    }
                  }
                }
              },
              series:paymentState
          })
       /*  setPayments(payments)

          console.log(payments)

           */
        }
           
        
          init()
          return () => {
            
          }
        }, [loan?.id, payments, state.options]);
        
      
        

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