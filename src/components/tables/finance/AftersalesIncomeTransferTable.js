import React from 'react'
import {Button, Table} from 'antd'
import api from '../../../middleware/api'
import TransferDetailModal from '../../modals/finance/TransferDetailModal'
import TransferIncomeListModal from '../../modals/finance/TransferIncomeListModal'
import TableWithPagination from '../../base/TableWithPagination'

export default class IncomeTransferTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changeAction: false,
      list: []
    };
  }

  componentDidMount() {
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
        title: '结算时间',
        dataIndex: 'end_date',
        key: 'end_date'
      }, {
        title: '付款时间',
        dataIndex: 'pay_time',
        key: 'pay_time'
      }, {
        title: '门店',
        dataIndex: 'company_name',
        key: 'company_name'
      }, {
        title: '开户银行',
        dataIndex: 'bank_name',
        key: 'bank_name'
      }, {
        title: '收款账号',
        dataIndex: 'bank_account_number',
        key: 'bank_account_number'
      }, {
        title: '账户名',
        dataIndex: 'bank_account_name',
        key: 'bank_account_name'
      }, {
        title: '金额',
        dataIndex: 'amount',
        className: 'column-money',
        key: 'amount'
      }, {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (value, record) => (
          <span>
            <TransferDetailModal pay_pic={record.pay_pic} transfer_id={record._id}/>
            <TransferIncomeListModal transfer_id={record._id}/>
          </span>
        )
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
