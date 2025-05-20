const ApexChart = () => {
    const [state, setState] = React.useState({
      
        series: [70],
        options: {
          chart: {
            height: 350,
            type: 'radialBar',
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: '70%',
              }
            },
          },
          labels: ['Cricket'],
        },
      
      
    });

    

    return (
      <div>
        <div id="chart">
            <ReactApexChart options={state.options} series={state.series} type="radialBar" height={350} />
          </div>
        <div id="html-dist"></div>
      </div>
    );
  }

 