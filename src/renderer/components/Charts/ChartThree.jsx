import React, {useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getMonthStartEnd ,formatAmount} from '../../common/funcs';
import { getPaymentsStatusDate } from '../../pages/Payments/funcs';
import { getMonday,getSunday,getYearStartEnd,getWeekStartEnd } from '../../common/funcs';

const options = {
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'donut',
  },
  colors: ['#7BD77E', '#6577F3', '#FF6666', '#FFCC66'],
  labels: ['Pagados', 'Pendientes', 'Vencidos', 'Incompletos'],
  legend: {
    show: false,
    position: 'bottom',
  },

  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        background: 'transparent',
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};


const ChartThree= ({payments}) => {

   const [stateWeekPayments,setStateWeekPayments] = useState({
      payed:5,
      expired:5,
      pending:10,
      incomplete:1,
     })

     const [show, setShow] = useState(true)
  
    const [state, setState] = useState({
    series: [],
  });

  async function  getPaymentsData(period){

    //console.log(period)
    const d = new Date()
    const week = getWeekStartEnd(d)
    const year = getYearStartEnd(d.getFullYear(d.getFullYear()))
    const month =getMonthStartEnd(d.getMonth()+1)
    //console.log("month:----------------------------->",month)
    let payments 
    if(period =="weekly")payments = await getPaymentsStatusDate({start:week.start,end:week.end})
    if(period == "monthly")payments = await getPaymentsStatusDate({start:month.start,end:month.end})
    if(period == "year")payments = await getPaymentsStatusDate({start:year.start,end:year.end})
      return parseData(payments)
    
  } 

  const parseData = (data) => {
    
     const p={
      paid:0,
      pending:0,
      expired:0,
      incomplete:0,
     }
     //console.log("data:----------------------------->",data)
    for (const row of data) {
      //console.log("row:----------------------------->",row)
      p[row.status] = row.total_payments
    }

    //console.log("p:----------------------------->",p)
    return  p.paid ==0 && p.pending==0 && p.expired == 0 && p.incomplete ==0 ? 
    
    []
    :
    [ 
        p.paid,
        p.pending,
        p.expired,
        p.incomplete
      ]
  }
  useEffect(() => {


      const init = async () => {

        const start = getMonday(new Date())
        const end = getSunday(new Date())
        const data = await getPaymentsStatusDate({start,end})

        //console.log("data:----------------------------->",data)


        const series = parseData(data)
        setShow(series.length ? true :false )
        setState((prevState) => {
          return {
            ...prevState,
            series: series
          }
        })

      }

      init()
  /*  const init = async (params) => {

    const sPayments = await paymentsModel.getPaymentsWeekState()
      


    setState((prevState) => {

      const p={
        payed:0,
        expired:0,
        pending:0,
        incomplete:0,
       }
      for (const row of sPayments) {
        p[row.state] = row.total_payments
      }

     
      return  {
        ...prevState,
        series: [ 
          p.payed,
         
          p.pending,
          p.expired,
          p.incomplete
        ]
      }
      
      
      

    })

   }

    
    init() */
    

   
  }, []);  // El efecto se ejecuta cuando payments cambia


  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
      series: [ 1,2,3,4]
    }));
  };
 


   const onChange=async (e)=>{

    
  let r,series

    switch (e.target.value) {
      case "monthly":
        
        series = await getPaymentsData("monthly")
       //console.log("r:----------------------------->",r)
      
      //console.log("series:----------------------------->",series)
        setState((prevState)=>{
          return {
            ...prevState,
            series: series
          }
        })

        break;
        case "weekly":
        
       series = await getPaymentsData("weekly")
       //console.log("r:----------------------------->",r)
      
        //console.log("series:----------------------------->",series)
          setState((prevState)=>{
            return {
              ...prevState,
              series: series
            }
          })
  
          break;

          case "year":
        
          series = await getPaymentsData("year")
          //console.log("r:----------------------------->",r)
         
           //console.log("series:----------------------------->",series)
             setState((prevState)=>{
               return {
                 ...prevState,
                 series: series
               }
             })
     
             break;
    
      default:
        break;
    }
      
  }

 
 

return (<>
  {
    show ? (        <div className="col-span-12 xl:col-span-6">

    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Estado de los pagos semanales
          </h5>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <select
             onChange={onChange} 
              
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
            >
              <option value="weekly"  className="dark:bg-boxdark">
                Semanal
              </option>
              <option value="monthly" className="dark:bg-boxdark">
               Mensual
              </option>
              <option value="year" className="dark:bg-boxdark">
                Anual
              </option>
            </select>
            <span className="absolute right-3 top-1/2 z-10 -translate-y-1/2">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                  fill="#637381"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
                  fill="#637381"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={state.series}
            type="donut"
          />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#7BD77E]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Pagados {formatAmount(state.series[0])} </span>
            {/*   <span>{percentages.payed} %</span> */}
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#6577F3]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Pendientes {formatAmount(state.series[1])} </span>
            {/*   <span>{percentages.pending} %</span> */}
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#FF6666]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Vencidos {formatAmount(state.series[2])} </span>
              {/* <span> {percentages.expired} %</span> */}
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#FFCC66]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span> Incompletos {formatAmount(state.series[3])} </span>
             {/*  <span> {percentages.incomplete} %</span> */}
            </p>
          </div>
        </div>
      </div>
    </div></div>): (<></>)
  }
</>);
};

export default ChartThree;
