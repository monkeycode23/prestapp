import React from 'react';
import ReactApexChart from 'react-apexcharts';

const LoansFrequencyChart = ({ data }) => {
  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '55%',
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
    colors: ['#6366F1'],
    xaxis: {
      categories: data.map(item => `$${item.amount.toLocaleString()}`),
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500
        }
      }
    },
    yaxis: {
      title: {
        text: 'Cantidad de Préstamos'
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + " préstamos"
        }
      }
    },
    title: {
      text: 'Frecuencia de Montos de Préstamos',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 600
      }
    }
  };

  const chartSeries = [{
    name: 'Cantidad',
    data: data.map(item => item.count)
  }];

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default LoansFrequencyChart; 