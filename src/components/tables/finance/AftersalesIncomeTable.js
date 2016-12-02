import React from 'react'
import {Button, Table} from 'antd'
import api from '../../../middleware/api'
import TableWithPagination from '../../base/TableWithPagination'

export default class IncomeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changeAction: false,
      list: []
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    this.getList(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getList(nextProps);
  }

  handleSearchChange(data) {
    if (data.key) {
      this.setState({list: data.list});
    } else {
      this.getList(this.props);
    }
  }

  getList(props) {
    api.ajax({url: props.source}, function (data) {
      this.setState({list: data.res.list});
    }.bind(this))
  }

  render() {
    const columns = [
      {
        title: '交易时间',
        dataIndex: 'ctime',
        key: 'ctime'
      }, {
        title: '订单号',
        dataIndex: '_id',
        key: '_id'
      }, {
        title: '金额(元)',
        dataIndex: 'amount',
        key: 'amount',
        className: 'text-right'
      }, {
        title: '收款方式',
        dataIndex: 'account_type_name',
        key: 'account_type_name'
      }, {
        title: '付款方式',
        dataIndex: 'pay_type_name',
        key: 'pay_type_name'
      }, {
        title: '对账状态',
        dataIndex: 'status_name',
        key: 'status_name'
      }, {
        title: '门店间结算状态',
        dataIndex: 'transfer_status_name',
        key: 'transfer_status_name'
      }
    ];

    return (
      <div>
        <TableWithPagination
          columns={columns}
          dataSource={this.state.list}
          pathname={this.props.pathname}
          page={this.props.page}
        />
      </div>
    )
  }
}
