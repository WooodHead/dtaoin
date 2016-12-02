import React from 'react'
import {Card, Icon} from 'antd'
import PieChart from '../../chart/PieChart'

export default class AftersalesWarehouseOfStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {source} = this.props;
    let data = [{
      name: '实付款',
      y: Number(source.payed)
    }, {
      name: '挂账金额',
      y: Number(source.unpay)
    }, {
      name: '总出货额',
      y: Number(source.sold)
    }, {
      name: '总进货额',
      y: Number(source.total)
    }];

    return (
      <Card title={<span><Icon type="pie-chart"/> 仓库情况统计</span>} className="mb15">
        <PieChart
          name="占比"
          unit="元"
          data={data}
        />
      </Card>
    )
  }
}