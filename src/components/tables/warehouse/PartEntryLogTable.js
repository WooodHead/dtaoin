import React from 'react'
import {Button, Table} from 'antd'
import api from '../../../middleware/api'
import text from '../../../middleware/text'
import TableWithPagination from '../../base/TableWithPagination'

export default class PartEntryLogTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  componentWillMount() {
    this.getList(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getList(nextProps);
  }

  getList(props) {
    api.ajax({url: props.source}, function (data) {
      this.setState({list: data.res.list});
    }.bind(this))
  }

  render() {
    const columns = [
      {
        title: '进货编号',
        dataIndex: '_id',
        key: '_id',
      }, {
        title: '配件名称',
        dataIndex: 'part_name',
        key: 'part_name',
      }, {
        title: '供货商名称',
        dataIndex: 'supplier_company',
        key: 'supplier_company',
      }, {
        title: '进货数量',
        dataIndex: 'amount',
        key: 'amount',
        className: 'column-money',
      }, {
        title: '进货价（元）',
        dataIndex: 'in_price',
        key: 'in_price',
        className: 'column-money',
        render: (value) => (
          Number(value).toFixed(2)
        )
      }, {
        title: '结算方式',
        dataIndex: 'pay_type',
        key: 'pay_type',
        render: (value) => (
          text.partPayType[Number(value)]
        )
      }, {
        title: '是否结算',
        dataIndex: 'is_pay',
        key: 'is_pay',
        render: (value) => (
          value == 1 ? '已支付' : '未支付'
        )
      }, {
        title: '账单金额',
        dataIndex: 'pay',
        key: 'pay',
        className: 'column-money',
        render: (value, item) => (
          Number(item.in_price * item.amount).toFixed(2)
        )
      }, {
        title: '进货时间',
        dataIndex: 'ctime',
        key: 'ctime'
      }, {
        title: '结账时间',
        dataIndex: 'ptime',
        key: 'ptime'
      }
    ];

    return (
      <TableWithPagination
        columns={columns}
        dataSource={this.state.list}
        pathname={this.props.pathname}
        page={this.props.page}
      />
    )
  }
}
