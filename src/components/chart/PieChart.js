import React from 'react'
import ReactHighcharts from 'react-highcharts'

const PieChart = React.createClass({
  render() {
    let {title, name, unit, data} = this.props;
    let chart = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: 260
      },
      title: {
        text: title || ''
      },
      credits: {
        enabled: false
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: `{point.name}({point.y}${unit || ''})`
          }
        }
      },
      series: [{
        name: name || '占比',
        colorByPoint: true,
        data: data
      }]
    };

    return React.createElement(ReactHighcharts, {config: chart});
  }
});

export default PieChart;