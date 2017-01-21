import React from 'react';
import ReactHighcharts from 'react-highcharts';

const LineChart = React.createClass({
  render() {
    let {title, unit, categories, series, allowDecimals, subtitle, lineHeight} = this.props;
    let chart = {
      chart: {
        type: 'spline',
        height: lineHeight || '400',
      },
      title: {
        text: title + '<br/>' || '',
        useHTML: true,
        align: 'left',
      },
      subtitle: {
        text: subtitle ? subtitle + '<br/>' : '',
        useHTML: true,
        align: 'left',
        style: {
          color: '#ccc',
        },
      },
      legend: {
        enabled: series.length > 1,
        align: 'center',
        verticalAlign: 'top',
      },
      credits: {
        enabled: false,
      },
      yAxis: {
        title: {
          text: unit || '',
        },
        allowDecimals: allowDecimals || true,
      },
      xAxis: {
        categories: categories,
        tickInterval: categories.length > 7 ? 2 : 1,
      },
      series: series,
    };

    return React.createElement(ReactHighcharts, {config: chart});
  },
});

export default LineChart;
