//import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getYearPaymentsTotalAmountDate } from '../../pages/Payments/funcs';
import { formatAmount } from '../../common/funcs';

const ChartOne = () => {

  const [show, setShow] = useState(true)
  const [visibleSeries, setVisibleSeries] = useState({
    net: true,
    brute: true,
    expected: true
  });

  const options = {
    legend: {
      show: false,
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#3C50E0', '#A5D6A7', '#FFB74D'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 335,
      type: 'area',
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      y: {
        formatter: function(value) {
          return '$' + formatAmount(value);
        }
      }
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [3, 3, 3],
      curve: 'smooth',
    },
    fill: {
      opacity: 1,
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '15px',
        colors: ['#3C50E0', '#A5D6A7', '#FFB74D']
      },
      formatter: function (val) {
        const formattedValue = val.toLocaleString('es-ES');
        return '$'+(formattedValue >= 1000000 ? (formattedValue / 1000000).toFixed(1) + 'M' : formattedValue);
      },
    },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: ['#3C50E0', '#A5D6A7', '#FFB74D'],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: 'category',
      categories: [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec',
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: function (value=0) {
          if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
          }
          const formattedValue = value.toLocaleString('es-ES');
          return '$'+(formattedValue >= 1000000 ? (formattedValue / 1000000).toFixed(1) + 'M' : formattedValue);
        },
      },
    },
  };

  const [state, setState] = useState({
    series: [
      {
        name: 'Ganancia Neta',
        data: [],
      },
      {
        name: 'Ganancia Bruta',
        data: [],
      },
      {
        name: 'Ganancia Esperada',
        data: [],
      },
    ],
  });

  function setMonthValues(r) {
    const netMonths =Array(12).fill(0);
    //
    const bruteMonths = Array(12).fill(0);

    for (const month of r) {
      netMonths[month.month-1] = month.total_net;
      bruteMonths[month.month-1] = month.total_gains;
    }

    return {
      netMonths,
      bruteMonths
    }
  }

  useEffect(() => {
    const init = async () => {
      const {data, expected} = await getYearPaymentsTotalAmountDate();
      const gains = setMonthValues(data);
      const expectedGains = setMonthValues(expected);
      
      setState({
        series: [
          {
            name: 'Ganancia Neta',
            data: gains.netMonths,
          },
          {
            name: 'Ganancia Bruta',
            data: gains.bruteMonths,
          },
          {
            name: 'Ganancia Esperada',
            data: expectedGains.bruteMonths,
          },
        ],
      });
    }
    
    init();
  }, []);

  const toggleSeries = (series) => {
    setVisibleSeries(prev => ({
      ...prev,
      [series]: !prev[series]
    }));
  };

  const filteredSeries = state.series.filter((series, index) => {
    if (index === 0) return visibleSeries.net;
    if (index === 1) return visibleSeries.brute;
    if (index === 2) return visibleSeries.expected;
    return true;
  });

  return (
    <div className="col-span-12 xl:col-span-12">

    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-12">
      <div className="flex items-start justify-between gap-3">
        <div className="flex w-full flex-wrap gap-2 sm:gap-5">
          <div className="flex cursor-pointer" onClick={() => toggleSeries('net')}>
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className={`block h-2.5 w-full max-w-2.5 rounded-full ${visibleSeries.net ? 'bg-primary' : 'bg-transparent'}`}></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Ganancia Neta</p>
            </div>
          </div>
          <div className="flex min-w-47.5 cursor-pointer" onClick={() => toggleSeries('brute')}>
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-success">
              <span className={`block h-2.5 w-full max-w-2.5 rounded-full ${visibleSeries.brute ? 'bg-success' : 'bg-transparent'}`}></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-success">Ganancia Bruta</p>
            </div>
          </div>
          <div className="flex min-w-47.5 cursor-pointer" onClick={() => toggleSeries('expected')}>
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-warning">
              <span className={`block h-2.5 w-full max-w-2.5 rounded-full ${visibleSeries.expected ? 'bg-warning' : 'bg-transparent'}`}></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-warning">Ganancia Esperada</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Anual
            </button>
          </div>
        </div>
      </div>

      <div id="chartOne" className="-ml-5">
        <ReactApexChart
          options={options}
          series={filteredSeries}
          type="area"
          height={350}
        />
      </div>
    </div>
    </div>
  );
};

export default ChartOne;
