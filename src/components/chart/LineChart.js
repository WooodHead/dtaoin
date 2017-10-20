import React from 'react';
import ReactHighcharts from 'react-highcharts';
import createReactClass from 'create-react-class';

const LineChart = createReactClass({
  render() {
    const { title, unit, categories, series, allowDecimals, subtitle, lineHeight } = this.props;
    const chart = {
      chart: {
        type: 'spline',
        height: lineHeight || '400',
      },
      title: {
        text: `${title  }<br/>` || '',
        useHTML: true,
        align: 'left',
      },
      subtitle: {
        text: subtitle ? `${subtitle  }<br/>` : '',
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
          style: {
            fontSize: '14px',
            color: '#333',
          },
        },
        allowDecimals: allowDecimals || true,
      },
      xAxis: {
        categories,
        tickInterval: categories.length > 7 ? 2 : 1,
      },
      series,
    };

    return React.createElement(ReactHighcharts, { config: chart });
  },
});

export default LineChart;
