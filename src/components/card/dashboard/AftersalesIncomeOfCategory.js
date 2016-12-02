import React from 'react'
import {Card, Table} from 'antd'

export default class AftersalesIncomeOfCategory extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const columns = [
      {
        title: '材料收入',
        dataIndex: 'material_fee',
        key: 'material_fee',
        className: 'text-right'
      }, {
        title: '工时收入',
        dataIndex: 'time_fee',
        key: 'time_fee',
        className: 'text-right'
      }, {
        title: '辅料收入',
        dataIndex: 'auxiliary_material_fee',
        key: 'auxiliary_material_fee',
        className: 'text-right'
      }, {
        title: '会员收入',
        dataIndex: 'member_fee',
        key: 'member_fee',
        className: 'text-right'
      }, {
        title: '优惠券',
        dataIndex: 'coupon',
        key: 'coupon',
        className: 'text-right'
      }, {
        title: '抹零',
        dataIndex: 'discount',
        key: 'discount',
        className: 'text-right'
      }, {
        title: '总产值',
        dataIndex: 'amount',
        key: 'amount',
        className: 'text-right'
      }
    ];

    return (
      <Card title="业务收入统计" className="mb15">
        <Table
          columns={columns}
          dataSource={this.props.source}
          pagination={false}
          size="small"
          bordered
        />
      </Card>
    )
  }
}