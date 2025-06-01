import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getLoansByStatus } from "./funcs";

const LoansChart = ({ data }) => {
  const [loansByStatus, setLoansByStatus] = useState({
    active: 0,
    completed: 0,
    cancelled: 0,
  });

  const loansStatusOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "70%",
        distributed: true,
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + " préstamos";
      },
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },
    colors: ["#3B82F6", "#10B981", "#EF4444"],
    xaxis: {
      categories: ["Activos", "Completados", "Cancelados"],
      labels: {
        formatter: function (val) {
          return val;
        },
      },
      tickAmount: 5,
      forceNiceScale: true,
      labels: {
        formatter: function (val) {
          return Math.round(val);
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "14px",
          fontWeight: 600,
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return Math.round(val) + " préstamos";
        },
      },
    },
  };

  const [show, setShow] = useState(true);

  const loansStatusSeries = [
    {
      name: "Préstamos",
      data: [
        loansByStatus.active || 0,
        loansByStatus.completed || 0,
        loansByStatus.cancelled || 0,
      ],
    },
  ];

  useEffect(() => {
    const init = async (params) => {
      // atos de préstamos por estado
      const statusData = await getLoansByStatus();

      setShow(
        statusData.active == 0 &&
          statusData.completed == 0 &&
          statusData.cancelled == 0
          ? false
          : true
      );
      setLoansByStatus(statusData);
    };
    // Obtener d
    init();
    return () => {};
  }, []);

  return (
    <>
      {show ? (
        <div className="col-span-12 xl:col-span-6">
          <div className="bg-white px-7.5 py-7.5 rounded-lg shadow-sm p- border border-stroke rounded-lg ">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Estado de Préstamos
            </h2>
            <ReactApexChart
              options={loansStatusOptions}
              series={loansStatusSeries}
              type="bar"
              height={350}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default LoansChart;
