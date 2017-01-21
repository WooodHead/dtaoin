import React from 'react';
import api from '../../../middleware/api';
import TransferDetailModal from '../../../components/modals/finance/TransferDetailModal';
import TransferIncomeListModal from '../../../components/modals/finance/TransferIncomeListModal';
import TableWithPagination from '../../../components/base/TableWithPagination';

export default class IncomeTransferTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changeAction: false,
      list: [],
    };

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    this.getList(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getList(nextProps);
  }

  handlePageChange(page) {
    this.props.updateState({page});
  }

  getList(props) {
    api.ajax({url: props.source}, function (data) {
      let {list, total} = data.res;
      this.setState({list, total: parseInt(total)});
    }.bind(this));
  }

  render() {
    let {list, total} = this.state;

    const columns = [
      {
        title: '结算时间',
        dataIndex: 'end_date',
        key: 'end_date',
      }, {
        title: '付款时间',
        dataIndex: 'pay_time',
        key: 'pay_time',
      }, {
        title: '门店',
        dataIndex: 'company_name',
        key: 'company_name',
      }, {
        title: '开户银行',
        dataIndex: 'bank_name',
        key: 'bank_name',
      }, {
        title: '收款账号',
        dataIndex: 'bank_account_number',
        key: 'bank_account_number',
      }, {
        title: '账户名',
        dataIndex: 'bank_account_name',
        key: 'bank_account_name',
      }, {
        title: '金额',
        dataIndex: 'amount',
        className: 'column-money',
        key: 'amount',
      }, {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (value, record) => (
          <span>
            <TransferDetailModal pay_pic={record.pay_pic} transfer_id={record._id}/>
            <TransferIncomeListModal transfer_id={record._id}/>
          </span>
        ),
      },
    ];

    return (
      <TableWithPagination
        columns={columns}
        dataSource={list}
        total={total}
        currentPage={this.props.currentPage}
        onPageChange={this.handlePageChange}
      />
    );
  }
}
