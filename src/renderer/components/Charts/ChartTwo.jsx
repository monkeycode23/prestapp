import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

import { getWeekPaymentsTotalAmountDate } from '../../pages/Payments/funcs';
import { getWeekStartEnd, getLastWeeksStartEnd } from '../../common/funcs';
const options = {
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },

  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%',
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  dataLabels: {
    enabled: false,
  },

  yaxis: {
    labels: {
      formatter: function (value) {
        // Verifica el valor y convierte a formato más legible si es mayor a un millón
        if (value >= 1000000) {
          return (value / 1000000).toFixed(1) + 'M'; // Muestra en millones
        }
        return value; // De lo contrario, muestra el valor original
      },
    },
  },
  xaxis: {
    categories: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',

    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
};


const ChartTwo = ({payments}) => {

  const [show,setShow] = useState(true)
  const [state, setState] = useState({
    series: [
      {
        name: 'monto total',
        data: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'ganancia',
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  });
  
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    const init =async ()=>{
     
    
      const data = await getData("current");

      console.log("asdasdasddata:----------------------------->",data)
    const r = parseData(data)
      console.log("asdasdasdadr:----------------------------->",r)

    const gains  = Object.values(r.monto)
    setShow(
      gains.every((a)=>a>0 ? false:true)
    )
      setState({
      series: [
        r.monto,
        r.ganancia
      ],
    }) 
  

  }


    init()
  
    return () => {}
  }, [])   
  

 async function getData(period){


    let payweeks 

    if(period=="current"){

      const {start,end} = getWeekStartEnd(new Date())

    payweeks = await getWeekPaymentsTotalAmountDate({start,end})
    console.log("payweeks:----------------------------->",payweeks)
  }

  if(period=="last"){
   // console.log("asasdasdasdasd")
    const {start,end} = getLastWeeksStartEnd()
    console.log("start:----------------------------->",start)
    console.log("end:----------------------------->",end)
   payweeks = await getWeekPaymentsTotalAmountDate({start,end})

    console.log("payweeks:----------------------------->",payweeks)
    console.log("payweeks:----------------------------->",payweeks)
  }
    
  return payweeks
    
  }


  function parseData(data){

    const weekDays = {
      mon:{
        totalAmount: 0,
        totalGains: 0
      },
      tues:{
        totalAmount: 0,
        totalGains: 0
      },
      wens:{
        totalAmount: 0,
        totalGains: 0
      },
      thrus:{
        totalAmount: 0,
        totalGains: 0
      },
      fri:{
        totalAmount: 0,
        totalGains: 0
      },
      sat:{
        totalAmount: 0,
        totalGains: 0
      },
      sun:{
        totalAmount: 0,
        totalGains: 0
      }
      
    }

    

    console.log("data:----------------------------->",data)
    let totalAmountGainsWeek=0;
    let bruteGains =0
    for (const r of data ) {
     // console.log(r)
      switch (Number(r.weekday)) {
        case 0:
          weekDays.sun = {
            totalAmount: r.total_amount,
            totalGains: r.total_gains
          }
          break;
        case 1:
          weekDays.mon = {
            totalAmount: r.total_amount,
            totalGains: r.total_gains
          }
          break;

        case 2:
          weekDays.tues ={
            totalAmount: r.total_amount,
            totalGains: r.total_gains
          }
          break;
        case 3:
          weekDays.wens ={
            totalAmount: r.total_amount,
            totalGains: r.total_gains
          }
          break;

        case 4:
          weekDays.thrus = {
            totalAmount: r.total_amount,
            totalGains: r.total_gains
          }
          break;
        case 5:
          weekDays.fri ={
            totalAmount: r.total_amount,
            totalGains: r.total_gains
          }
          break;
        case 6:
          weekDays.sat ={
            totalAmount: r.total_amount,
            totalGains: r.total_gains
          }
          break;
                   
        default:
          break;
      }

      totalAmountGainsWeek+=r.total_amount_gains
      bruteGains+=r.total_gains
    }

    setTotalAmount({
      netGains:totalAmountGainsWeek
      ,bruteGains
    })
    //console.log(weekDays)

    return {
      "monto":{
        name: 'monto',
        data: [
          weekDays.mon.totalAmount,
          weekDays.tues.totalAmount,
          weekDays.wens.totalAmount,
          weekDays.thrus.totalAmount,
          weekDays.fri.totalAmount,
          weekDays.sat.totalAmount,
          weekDays.sun.totalAmount
        ],
      },
      ganancia:{
        name: 'ganancia',
        data: [weekDays.mon.totalGains,
          weekDays.tues.totalGains,
          weekDays.wens.totalGains,
          weekDays.thrus.totalGains,
          weekDays.fri.totalGains,
          weekDays.sat.totalGains,
          weekDays.sun.totalGains],
      }
    }
   
  }

  async function onChange(e){

    const data = await getData(e.target.value);
    const r = parseData(data)
     setState({
        series: [
          r.monto,
          r.ganancia
        ]}) 
    }

    
  

  return (
      <>
      {
        show ? (
          <div className="col-span-12 xl:col-span-7">

        <div className="col-span-7 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
          <div className="mb-4 justify-between gap-4 sm:flex">
            <div>
              <h4 className="text-md font-semibold text-black dark:text-white">
                Ganancias netas ${formatAmount(totalAmount.netGains)} bruta  ${formatAmount(totalAmount.bruteGains)} de la semana
              </h4>
            </div>
            <div>
              <div className="relative z-20 inline-block">
                <select
                  name="#"
                  id="#"
                  className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
                
                  onChange={onChange}
                >
                  <option value="current" className='dark:bg-boxdark'>Esta semana</option>
                  <option value="last" className='dark:bg-boxdark'>Semana pasada</option>
                </select>
                <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
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
    
          <div>
            <div id="chartTwo" className="-ml-5 -mb-9">
              <ReactApexChart
                options={options}
                series={state.series}
                type="bar"
                height={350}
              />
            </div>
       
          </div>
          
        </div></div>): (<></>)
      }
      </>
   
  );
}

import { formatAmount } from '../../common/funcs';

export default ChartTwo;
