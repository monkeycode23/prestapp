import React, { useEffect, useState, createContext, useContext } from "react";
import CardDataStats from "../../components/CardDataStats.jsx";

import { MoneyBag, PaymentIcon } from "../../components/Icons.jsx";

import { formatAmount, getWeekDays,getWeekStartEnd } from "../../common/funcs.jsx";

import { useSelector, useDispatch } from "react-redux";

import { setPayments,setPaymentsCount } from "../../redux/reducers/payments.jsx";


import {
  setPage,
  setLimit,
  setTotalPages,
  setSearch,
  setCount,
  setFilter,
  setTotalResults,
} from "../../redux/reducers/_pagination"

import { getTodayPaymentsDate, getPaymentsGainsDate, 
  getClientPaymentsCountDate,toLocaleDate } from "./funcs.jsx";
import PaymentList from "./PaymentsList.jsx";
import CalendarApp from "../../components/Calendar.jsx";

import { setNetGains, setBruteGains } from "../../redux/reducers/gains.jsx";

import  ApexChart from "./chart"

import { calculatePercentages } from "../../common/funcs.jsx";
const Payments = () => {
  const dispatch = useDispatch();

  const pagination = useSelector((state) => state.pagination);

  const totalResults = useSelector((state) => state.pagination.totalResults);

  const paymentsCount = useSelector((state) => state.payments.paymentsCount);

  const payments = useSelector((state) => state.payments.payments);

 

  //console.log(pagination);
  const { page, limit, totalPages, search, filter } = pagination;

 

  const gains = useSelector((state) => state.gains);

  
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    
    
    const init = async () => {


 
      const data = await getTodayPaymentsDate(undefined,{
        search,
        page,
        limit:limit.payments.limit,
      });

      dispatch(setPayments(data.payments));

      dispatch(setTotalResults(data.total));

      //const {start,end} = getWeekStartEnd(date)

      const _paymentsCount = await getClientPaymentsCountDate(toLocaleDate(new Date()));

      //console.log("paymentsCount",paymentsCount);

      dispatch(setPaymentsCount(_paymentsCount));

    
     

      //console.log("data.total",data.total,limit);
      //console.log("data.total pages",data.total > limit ? Math.ceil(data.total / limit) : 1);
      dispatch(
        setTotalPages(data.total > limit ? Math.ceil(data.total / limit) : 1)
      );

      //console.log("limit",limit);
      //console.log("page",page);
      const gains = await getPaymentsGainsDate({
        date:new Date(),
      });

      dispatch(setNetGains(gains.netGains));
      dispatch(setBruteGains(gains.gains));
      /*  setTodayGains(gains.gains)
        setTodayAmount(gains.netGains) */
      /*   const totalResults = data[0].totalResults
        setTotalPages(limit< totalResults ? 
          Math.ceilt(totalResults/limit)
        : 1
        )
 */
      /*   const amount =await  paymentsModel.getAmountSumFromTodaysPaymentsPayed()

        setTodayAmount(amount)
      const gainsPayed =await  paymentsModel.getGainsFromTodaysPaymentsPayed()
 */
      // setTOdayGains(gainsPayed)
    };

    // const r = getGainsFromTodaysPaymentsPayed()

    //  const gainsAll = getGainsFromTodaysPaymentsAll()
    // console.log(gainsPayed)
    //setTOdayGains(0.00)

    // console.log(todayAmount)
    init();

    return () => {};
  }, [page,search,limit]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <CardDataStats
          title="Total de pagos de hoy"
          total={totalResults}
          rate="0.43%"
          levelUp
        >
         <PaymentIcon width={22} height={22} />
        </CardDataStats>

        <CardDataStats
          title="Ganancia hoy"
          total={`$${gains.bruteGains ? formatAmount(gains.bruteGains) : 0}`}
          rate="2.59%"
          levelUp
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            <path d="M12 6v2M12 16v2" />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Total de dinero Recaudado"
          total={`$${gains.netGains ? formatAmount(gains.netGains) : 0}`}
          rate="0.95%"
          levelDown
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            <path d="M12 6v2M12 16v2" />
            <path d="M12 10v2" />
          </svg>
        </CardDataStats>
      </div>

      <div className={`mt-4 grid grid-cols-1 
        md:grid-cols-3 
        lg:grid-cols-3 
        xl:grid-cols-3 
        md:gap-2 
        xl:gap-2`}>
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Lista de Pagos</h2>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span>Resultados: </span>
                  <span className="font-semibold">{totalResults}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span>Res/pag: </span>
                  <span className="font-semibold">{limit.payments.limit}</span>
                </div>
              </div>
            </div>
            <PaymentList date={date} payments={payments}></PaymentList>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-primary rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Calendario</h2>
            <CalendarApp
              onClick={async (date) => {
                const data = await getTodayPaymentsDate(date,{
                  filter: {
                    search: search,
                    page,
                    limit,
                  },
                });
                
                const paymentsCount = await getClientPaymentsCountDate(date.toISOString().split('T')[0]);

                dispatch(setPaymentsCount(paymentsCount));
                dispatch(setPayments(data.payments));
                dispatch(setTotalResults(data.total));
                dispatch(
                  setTotalPages(
                    data.total > limit ? Math.ceil(data.total / limit) : 1
                  )
                );

                setDate(date);

                const gains = await getPaymentsGainsDate({
                  date,
                });
        
                dispatch(setNetGains(gains.netGains));
                dispatch(setBruteGains(gains.gains));
              }}
            />
          </div>
          <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas</h2>
            <ApexChart />
          </div>
        </div>
      </div>
    </>
  );
};

export default Payments;
