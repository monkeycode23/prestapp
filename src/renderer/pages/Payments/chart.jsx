//import './chart.css'
import React,{useState,useEffect} from "react"

import ReactApexChart from 'react-apexcharts';

import { useSelector } from "react-redux";

import { calculatePercentages } from "../../common/funcs.jsx";

const ApexChart = () => {
  ////console.log("paymentsCount:----------------------------->",paymentsCount)


  const paymentsCount = useSelector((state) => state.payments.paymentsCount);
  //console.log("paymentsCount:----------------------------->",paymentsCount)
  const pending = paymentsCount.pending;
  const expired = paymentsCount.expired;
  const paid = paymentsCount.paid;
  const incomplete = paymentsCount.incomplete;
  

  //console.log("pending:----------------------------->",pending)
  //console.log("expired:----------------------------->",expired)
  //console.log("paid:----------------------------->",paid)
  //console.log("incomplete:----------------------------->",incomplete)
 
  const total = pending + expired + paid + incomplete

 


  

  

  ////console.log("percentages:----------------------------->",percentages)
  const [state, setState] = React.useState({
    series: [0,0,0,0],  // Datos: Pendientes, Vencidos, Pagados
    labels: ['Pendientes', 'Pagados', 'Incompletos', 'Vencidos'],  // Etiquetas personalizadas

    options: {
      chart: {
        type: 'donut',  // Tipo de gráfico: dona (donut)
        height: '100%',  // El gráfico tomará el 100% de la altura del contenedor
        width: '100%',   // El gráfico tomará el 100% del ancho del contenedor
      },
      dataLabels: {
        enabled: false,  // Deshabilitar etiquetas de datos dentro de la dona
      },
      legend: {
        position: 'bottom',  // La leyenda estará en la parte inferior
        offsetY: 0,
        height: "auto",
        markers: {
          show: false,  // Ocultar los puntos de colores (círculos) de la leyenda
        },
        useSeriesColors: false,  // Deshabilitar el uso de colores de la serie en la leyenda

      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',  // Reducimos el tamaño del donut (agujero en el centro)
            stroke: {
              width: 5,  // Grosor del borde
              colors: ['#ffffff'], // Color del borde
            }
          }
        }
      },
      labels: ['Pendientes %'+calculatePercentages(pending,total),  'Pagados %'+calculatePercentages(paid,total),'Incompletos %'+calculatePercentages(incomplete,total),'Vencidos %'+calculatePercentages(expired,total)],  // Aquí aseguramos que los labels se configuren correctamente
      colors: ['rgba(0,143,251,1)', '#4CAF50','#FFA500','#FF5733'],  // Primer, segundo y tercer color (Pendientes, Vencidos, Pagados)
      responsive: [
        {
          breakpoint: 480,  // Ajuste para pantallas más pequeñas
          options: {
            chart: {
              width: '100%',
            },
            legend: {
              position: 'bottom',
              markers: {
                show: false,  // Ocultar los puntos de colores (círculos) de la leyenda
              },
              useSeriesColors: false,  // Deshabilitar el uso de colores de la serie en la leyenda
            }
          }
        }
      ]
    },
  });

  useEffect(() => {

    const total = paymentsCount.pending + paymentsCount.expired + paymentsCount.paid + paymentsCount.incomplete

    setState({
      ...state,
      options: {
        ...state.options,
        labels: ['Pendientes %'+calculatePercentages(paymentsCount.pending,total),  'Pagados %'+calculatePercentages(paymentsCount.paid,total),'Incompletos %'+calculatePercentages(paymentsCount.incomplete,total),'Vencidos %'+calculatePercentages(paymentsCount.expired,total)],  // Aquí aseguramos que los labels se configuren correctamente
      },
      series: [pending,paid,incomplete,expired],
    })
  }, [pending, expired, paid,paymentsCount])
  return (
    <div className="chart-card mt-10" >  {/* Contenedor pequeño */}
      <ReactApexChart 

        options={state.options} 
        series={state.series} 
        type="donut" 
        width="270"  // El gráfico ocupa todo el ancho del contenedor
        height="270" // El gráfico ocupa toda la altura del contenedor
      />
    </div>
  );
}


export default  ApexChart