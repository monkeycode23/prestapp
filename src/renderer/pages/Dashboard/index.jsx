import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CardDataStats from '../../components/CardDataStats';
import { Payment10, WalletIcon } from '../../components/Icons';
import { MoneyBag,PeopleMoney20Regular } from '../../components/Icons';
import { DollarSign,MoneyWavy } from '../../components/Icons';
import ChartThree from '../../components/Charts/ChartThree';
import { formatAmount} from '../../common/funcs';
import ChartTwo from '../../components/Charts/ChartTwo';
import ChartOne from '../../components/Charts/ChartOne';
import { getTotalLoans,getLoansTotalAmounts,getTotalPaidPaymentsMoney,checkAndUpdateActiveLoans,getLoansByStatus } from './funcs';
import { useDispatch } from 'react-redux';
import { setTotalLoans,setTotalClients,setTotalPayments,
  setTotalLoansMoney,setTotalPaidPaymentsMoney,
  setTotalLoansGains,setTotalPaidPaymentsGains,
  setTotalPaidPaymentsNetGains,setTotalLoansCompleted,setTotalUnpaidPayments } from '../../redux/reducers/dashboard';
import { toLocaleDate } from '../Payments/funcs';
import ReactApexChart from "react-apexcharts";

import { getUnpaidPayments } from './funcs';

const Dashboard = () => {

    const dispatch = useDispatch()
    const loans = useSelector(state => state.loans.loans)
    const [loansByStatus, setLoansByStatus] = useState({ active: 0, completed: 0, cancelled: 0 });

  
   const {totalLoans,totalLoansCompleted,
    totalLoansMoney,totalPaidPaymentsMoney,
    totalPaidPaymentsGains,totalPaidPaymentsNetGains,
    totalUnpaidPayments} = useSelector(state => state.dashboard)
   
    useEffect(() => {
      const init = async () => {
        try {
          // Verificar y actualizar préstamos completados
          await checkAndUpdateActiveLoans();

          const today = toLocaleDate(new Date())
          //console.log("today:----------------------------->",today)
          
          await window.database.models.Payments.updateFilter({
            where: `status = 'pending' AND payment_date < '${today}'`,
            data: {
              status: 'expired'
            }
          })

          // Obtener datos de préstamos por estado
          const statusData = await getLoansByStatus();
          setLoansByStatus(statusData);

          ///////////////////////////////////////////////////

          const fetchTotalLoans = await getTotalLoans()
          //console.log("totalLoans:----------------------------->",fetchTotalLoans)
          dispatch(setTotalLoans(fetchTotalLoans.active))
          dispatch(setTotalLoansCompleted(fetchTotalLoans.completed))

          const fetchLoansTotalAmounts = await getLoansTotalAmounts()
         // console.log("loansTotalAmounts:----------------------------->",fetchLoansTotalAmounts)
          


          dispatch(setTotalLoansMoney(fetchLoansTotalAmounts.loans))

          const fetchTotalPaidPaymentsMoney = await getTotalPaidPaymentsMoney()
          //console.log("totalPaidPaymentsMoney:----------------------------->",fetchTotalPaidPaymentsMoney)
          dispatch(setTotalPaidPaymentsMoney(fetchTotalPaidPaymentsMoney))
          
          const fetchTotalUnpaidPayments = await getUnpaidPayments()
          //console.log("totalUnpaidPayments:----------------------------->",fetchTotalUnpaidPayments)
          dispatch(setTotalUnpaidPayments(fetchTotalUnpaidPayments))

          dispatch(setTotalLoansGains(fetchLoansTotalAmounts.gains))
          
          dispatch(setTotalPaidPaymentsGains(fetchTotalPaidPaymentsMoney.gains))
          
          dispatch(setTotalPaidPaymentsNetGains(fetchTotalPaidPaymentsMoney.net_gains))
          /*  const fetchTotalClients = await getTotalClients()
          console.log("totalClients:----------------------------->",fetchTotalClients)
          dispatch(setTotalClients(fetchTotalClients))
           */
          
        } catch (error) {
          console.error("Error al inicializar el dashboard:", error);
        }
      }
      init()
    },[])

    const loansStatusOptions = {
      chart: {
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '70%',
          distributed: true,
          borderRadius: 4,
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + " préstamos"
        },
        style: {
          fontSize: '12px',
          colors: ["#fff"]
        }
      },
      colors: ['#3B82F6', '#10B981', '#EF4444'],
      xaxis: {
        categories: ['Activos', 'Completados', 'Cancelados'],
        labels: {
          formatter: function(val) {
            return val
          }
        },
        tickAmount: 5,
        forceNiceScale: true,
        labels: {
          formatter: function(val) {
            return Math.round(val)
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '14px',
            fontWeight: 600
          }
        }
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return Math.round(val) + " préstamos"
          }
        }
      }
    };

    const loansStatusSeries = [{
      name: 'Préstamos',
      data: [
        loansByStatus.active || 0,
        loansByStatus.completed || 0,
        loansByStatus.cancelled || 0
      ]
    }];

    return (
      <>
     
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          <CardDataStats title="Total de Prestamos Activos" total={totalLoans} rate="0.0" levelUp>
            <MoneyBag  className="fill-primary dark:fill-white"
              width="22"
              height="22"></MoneyBag>
          </CardDataStats>
          {/* <CardDataStats title="Prestamos completados" total={totalLoansCompleted}  levelUp>
           <MoneyBag  className="fill-success dark:fill-white"
           color="success"
              width="22"
              height="22"></MoneyBag>
          </CardDataStats> */}
          <CardDataStats title="Ganancia Total" total={"$"+formatAmount(totalPaidPaymentsGains) }  levelUp>
            <MoneyWavy  className="fill-primary dark:fill-white"
              width="22"
              height="22"></MoneyWavy>
          </CardDataStats>
          <CardDataStats title="Total Dinero cirulando" total={"$"+formatAmount(totalUnpaidPayments) }  levelUp>
           <PeopleMoney20Regular width={"22"} height={"22"}/>
          </CardDataStats>
  
          
          
        </div>
        {/* end   */}
  
      
        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          <div className="col-span-12 xl:col-span-6">
            <ChartThree />
          </div>
          
          <div className="col-span-12 xl:col-span-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Estado de Préstamos</h2>
              <ReactApexChart
                options={loansStatusOptions}
                series={loansStatusSeries}
                type="bar"
                height={350}
              />
            </div>
          </div>

          <div className="col-span-12 xl:col-span-7">
            <ChartTwo></ChartTwo>
          </div>
          
          <div className="col-span-12 xl:col-span-12">
            <ChartOne></ChartOne>
          </div>

         {/*  <div className="col-span-12 xl:col-span-6">
            <div className="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
              <div>
                <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                  Préstamos por Estado
                </h3>
              </div>

              <div className="mb-2">
                <div id="loansByStatus">
                  <ReactApexChart
                    options={chartOptions}
                    series={chartSeries}
                    type="bar"
                    height={350}
                  />
                </div>
              </div>
            </div>
          </div> */}

          
        </div>
       
      </>
    );
  };
   

export default Dashboard;   
