import React from "react";
import ReactApexChart from "react-apexcharts";

import { useSelector, useDispatch } from  "react-redux"

import { setStatics } from "../../../redux/reducers/loans";
import { useState,useEffect } from "react";

const Chart = ({}) => {
  const loans = useSelector((state) => state.loans);
  const client = useSelector((state) => state.clients.client);
  const progress = useSelector((state) => state.loans.progress);
  const paidPayments = useSelector((state) => state.loans.paidPayments);
  const dispatch = useDispatch();

  const chartOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Activos", "Completados", "Cancelados"],
    colors: ["#3B82F6", "#10B981", "#EF4444"],
    legend: {
      position: "bottom",
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} préstamos`,
      },
    },
    
  };

  const [state, setState] = useState({
    options: chartOptions,
    series: [],
  });

  useEffect(() => {
    const init = async () => {
      const loansQuery = await window.database.models.Loans.getLoans({
        select: `*`,
        where: `client_id = ${client.id}`,
      });

      if (loansQuery) {
        const active = loansQuery.filter((loan) => loan.status == "active").length;
        const completed = loansQuery.filter((loan) => loan.status == "completed").length;
        const canceled = loansQuery.filter((loan) => loan.status == "canceled").length;

        dispatch(
          setStatics({
            active,
            completed,
            canceled,
          })
        );

        setState({
          options:{
            ...state.options,
            plotOptions: {
                pie: {
                  donut: {
                    size: "70%",
                    labels: {
                      show: true,
                      total: {
                        show: true,
                        label: "Total",
                        formatter: () => loansQuery.length,
                      },
                    },
                  },
                },
              },
          },

          series: [active, completed, canceled],
        });
      }
    };

    init();
  }, [client.id, dispatch, loans.totalLoans, state.options]);

  return (
    <div className="w-full h-[300px]">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="donut"
        height="100%"
      />
    </div>
  );
};

export default Chart