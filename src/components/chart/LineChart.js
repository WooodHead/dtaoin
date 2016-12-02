import React from 'react'
import ReactHighcharts from 'react-highcharts'

const LineChart = React.createClass({
  render() {
    let {title, unit, categories, series, allowDecimals} = this.props;
    let chart = {
      chart: {
        type: 'spline'
      },
      title: {
        text: title || ''
      },
      legend: {
        enabled: series.length > 1
      },
      credits: {
        enabled: false
      },
      yAxis: {
        title: {
          text: unit || ''
        },
        allowDecimals: allowDecimals || true
      },
      xAxis: {
        categories: categories,
        tickInterval: categories.length > 7 ? 2 : 1
      },
      series: series
    };

    return React.createElement(ReactHighcharts, {config: chart});
  }
});

export default LineChart;