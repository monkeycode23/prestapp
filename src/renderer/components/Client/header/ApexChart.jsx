import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactApexChart from 'react-apexcharts'

//css
import './chart.css'

const ApexChart = () => {

    const paymentsCount = useSelector((state) => state.payments.paymentsCount)
    const {pending,expired,paid,incomplete} = paymentsCount
  /*   console.log("pending:----------------------------->",pending)
    console.log("expired:----------------------------->",expired)
    console.log("paid:----------------------------->",paid)
    console.log("incomplete:----------------------------->",incomplete)
   */
    const [state, setState] = React.useState({
      series: [0,0,0,0],  // Datos: Pendientes, Vencidos, Pagados
      labels: [],  // Etiquetas personalizadas
  
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
              size: '80%',  // Reducimos el tamaño del donut (agujero en el centro)
              stroke: {
                width: 5,  // Grosor del borde
                colors: ['#ffffff'], // Color del borde
              }
            }
          }
        },
        // Primer, segundo y tercer color (Pendientes, Vencidos, Pagados)
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
  
      const {pending,expired,paid,incomplete} = paymentsCount
      if(pending>0 || expired>0 || paid>0 || incomplete>0){
      setState({
        ...state,
        options:{
          ...state.options,
          labels: ['Pendientes '+pending,  'Pagados '+paid,'Vencidos '+expired,'Incompletos '+incomplete  ],  // Aquí aseguramos que los labels se configuren correctamente
        colors: ['rgba(0,143,251,1)', '#4CAF50','#FF5733', '#FFC107'],
        },
        series: [pending,paid, expired, incomplete],
      })
    }else{
      setState({
        ...state,
        options:{
          ...state.options,
          labels: ['No hay pagos'],
          colors: ['#000000'],
        },
        series: [1],
      })
  
    }
    }, [pending, expired, paid])
    return (
      <div className="chart-card" style={{ width: '100%', height: '200px' }}>  {/* Contenedor pequeño */}
        <ReactApexChart 
          options={state.options} 
          series={state.series} 
          type="donut" 
          width="100%"  // El gráfico ocupa todo el ancho del contenedor
          height="100%" // El gráfico ocupa toda la altura del contenedor
        />
      </div>
    );
  }
  

  export default ApexChart;