import React from 'react';
import ReactHighcharts from 'react-highcharts';

const PieChart = React.createClass({
  render() {
    let {title, name, unit, data, subtitle, angle, innerSize, element} = this.props;
    let colors = ['#7ab4ee', '#7dc756', '#f9a455', '#7f82ec', '#ff6599', '#434348', '#c1c1c1', '#5cd1b7', '#ff5c50', '#ffd500'];
    let dataBool = true;

    //判断无数据
    if (data.length == 0) {
      data.push({name: '无数据', y: 1});
      colors = ['#ccc'];
      dataBool = false;
    }

    let elementUnit = element || '个';

    let chart = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        type: 'pie',
        height: 260,
      },
      colors: colors,
      title: {
        text: String(title) || '',
        align: 'center',
        verticalAlign: 'middle',
        style: {
          fontSize: '20px',
        },
        x: -115,
        y: -10,
      },
      subtitle: {
        text: subtitle || '',
        align: 'center',
        verticalAlign: 'middle',
        x: -115,
        y: 20,
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0,
        symbolRadius: '50%',
        symbolHeight: 12,
        symbolWidth: 12,
        itemMarginTop: 4,
        useHTML: true,
        x: 18,
        labelFormatter: function () {
          if (!dataBool) {
            return (
              `<table width=200px">
                <tr>
                  <td width="200px">${this.name}</td>
                </tr>
              </table>`
            );
          } else {
            return this.z
              ?
              `<table width=200px">
                <tr>
                  <td width="50px">${this.options.name}</td>
                  <td width="50px">${Number(this.percentage).toFixed(2) + '%'}</td>
                  <td width="50px">${this.options.y + elementUnit}</td>
                  <td width="50px">${this.options.z + '单'}</td>
                </tr>
              </table>`
              :
              `<table width=200px">
                <tr>
                  <td width="66.7px">${this.options.name}</td>
                  <td width="66.7px">${Number(this.percentage).toFixed(2) + '%'}</td>
                  <td width="66.7px">${this.options.y + elementUnit}</td>
                </tr>
              </table>`;
          }
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
            format: `{point.name}({point.y}${unit || ''})`,
            style: {
              fontWeight: 'bold',
              color: 'black',
            },
          },
          startAngle: -angle || -180,
          endAngle: angle || 180,
          center: ['50%', '50%'],
          showInLegend: true,
        },

      },

      series: [{
        name: name || '占比',
        colorByPoint: true,
        innerSize: innerSize || '80%',
        data: data,
      }],
    };

    return React.createElement(ReactHighcharts, {config: chart});
  },
});

export default PieChart;
