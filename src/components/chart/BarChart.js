import React from 'react';
import ReactHighcharts from 'react-highcharts';

const BarChart = React.createClass({
  render() {
    let {title, unit, categories, series} = this.props;
    series.map(item => {
      item.dataLabels = {
        enabled: true,
        rotation: -90,
        color: '#FFFFFF',
        align: 'right',
        format: '{point.y}',
        y: 10, // 10 pixels down from the top
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif',
        },
      };
    });

    let chart = {
      chart: {
        type: 'column',
      },
      colors: ['#7ab4ee', '#7dc756', '#f9a455', '#7f82ec',
        '#ff6599', '#434348', '#c1c1c1', '#5cd1b7', '#ff5c50', '#ffd500'],
      title: {
        text: title || '',
        verticalAlign: 'middle',
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: series.length > 1,
      },
      xAxis: {
        categories: categories,
      },
      yAxis: {
        min: 0,
        minRange: 10,
        title: {
          text: unit || '',
          style: {
            fontSize: '14px',
            color: '#333',
          },
        },
      },
      plotOptions: {
        column: {
          colorByPoint:true,
        },
      },
      series: series,
    };

    return React.createElement(ReactHighcharts, {config: chart});
  },
});

export default BarChart;
