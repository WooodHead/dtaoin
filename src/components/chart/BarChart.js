import React from 'react'
import ReactHighcharts from 'react-highcharts'

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
          fontFamily: 'Verdana, sans-serif'
        }
      }
    });

    let chart = {
      chart: {
        type: 'column'
      },
      title: {
        text: title || ''
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: series.length > 1
      },
      xAxis: {
        categories: categories
      },
      yAxis: {
        min: 0,
        title: {
          text: unit || ''
        }
      },
      series: series
    };

    return React.createElement(ReactHighcharts, {config: chart});
  }
});

export default BarChart;