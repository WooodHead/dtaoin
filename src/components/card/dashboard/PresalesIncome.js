import React from 'react'
import {Card, Icon} from 'antd'
import BarChart from '../../chart/BarChart'

export default class PresalesIncomeStatistics extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {info: {}}
  }

  // componentWillReceiveProps(nextProps) {
  //   if(nextProps.source){
  //     this.setState({info: nextProps.source})
  //   }
  // }

  render() {
    let {source} = this.props;
    let categories = ['裸车', '保险', '按揭', '上牌', '加装'];
    let series = [{
      name: '收入',
      data: [Number(source.bare_auto), Number(source.insurance), Number(source.loan), Number(source.license_tax), Number(source.decoration)]
    }];

    return (
      <Card title={<span><Icon type="bar-chart"/> 收入统计(赢单)</span>} className="mb15">
        <BarChart
          unit="收入(元)"
          categories={categories}
          series={series}
        />
      </Card>
    )
  }
}