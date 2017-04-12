import React from 'react';
import ReactHighcharts from 'react-highcharts';

const SparkingChart = React.createClass({
  render() {
    let {data, title, subtitle} = this.props;
    let chart = {
      chart: {
        backgroundColor: null,
        borderWidth: 0,
        type: 'area',
        height: 90,
        style: {
          overflow: 'visible',
        },
        skipClone: true,
      },
      title: {
        text: String(title) || '',
        align: 'left',
        verticalAlign: 'middle',
        style: {
          fontSize: '20px',
        },
        y: -55,
      },
      subtitle: {
        text: String(subtitle) || '',
        align: 'left',
        verticalAlign: 'middle',
        y: -80,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        labels: {
          enabled: false,
        },
        title: {
          text: null,
        },
        startOnTick: false,
        endOnTick: false,
        tickPositions: [],
      },
      yAxis: {
        endOnTick: false,
        startOnTick: false,
        labels: {
          enabled: false,
        },
        title: {
          text: null,
        },
        tickPositions: [0],
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        backgroundColor: null,
        borderWidth: 0,
        shadow: false,
        useHTML: true,
        hideDelay: 0,
        shared: true,
        padding: 0,
        positioner: function (w, h, point) {
          return {x: point.plotX - w / 2, y: point.plotY - h};
        },
        headerFormat: '',
        pointFormat: '<b>{point.y}</b>',
      },
      plotOptions: {
        series: {
          animation: false,
          lineWidth: 1,
          shadow: false,
          states: {
            hover: {
              lineWidth: 1,
            },
          },
          marker: {
            radius: 1,
            states: {
              hover: {
                radius: 2,
              },
            },
          },
          fillOpacity: 0.25,
        },
        column: {
          negativeColor: '#910000',
          borderColor: 'silver',
        },
      },
      series: [{
        data: data,
        pointStart: 1,
      }],
    };
    return React.createElement(ReactHighcharts, {config: chart});
  },
});

export default SparkingChart;
