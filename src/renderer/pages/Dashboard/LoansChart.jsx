import React from 'react';
import ReactApexChart from 'react-apexcharts';

const LoansChart = ({ data }) => {
  const chartOptions = {
    chart: {
      type: 'bar',
      horizontal: true,
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
    labels: ['Activos', 'Completados', 'Cancelados'],
    legend: {
      show: false
    },
    xaxis: {
      categories: ['Activos', 'Completados', 'Cancelados'],
      labels: {
        formatter: function(val) {
          return val
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
          return val + " préstamos"
        }
      }
    }
  };

  const chartSeries = [{
    name: 'Préstamos',
    data: [
      data?.active || 0,
      data?.completed || 0,
      data?.cancelled || 0
    ]
  }];

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={300}
      />
    </div>
  );
};

export default LoansChart; 