import React from 'react';
import {Link} from 'react-router';
import {Button} from 'antd';
import TableWithPagination from '../../../components/widget/TableWithPagination';

import api from '../../../middleware/api';

export default class IncomeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changeAction: false,
      list: [],
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
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
        title: '交易时间',
        dataIndex: 'ctime',
        key: 'ctime',
      }, {
        title: '交易类型',
        dataIndex: 'from_type_name',
        key: 'from_type_name',
      }, {
        title: '金额(元)',
        dataIndex: 'amount',
        key: 'amount',
        className: 'text-right',
      }, {
        title: '收款方式',
        dataIndex: 'account_type_name',
        key: 'account_type_name',
      }, {
        title: '付款方式',
        dataIndex: 'pay_type_name',
        key: 'pay_type_name',
      }, {
        title: '对账状态',
        dataIndex: 'status_name',
        key: 'status_name',
      }, {
        title: '门店间结算状态',
        dataIndex: 'transfer_status_name',
        key: 'transfer_status_name',
      }, {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        render(value, record) {
          if (record.from_type == 1) {
            return (
              <Link
                to={{
                  pathname: '/aftersales/project/new',
                  query: {
                    id: record.from_id,
                    customer_id: record.customer_id,
                    auto_id: record.auto_id,
                  },
                }} target="_blank">
                <Button type="primary" size="small">查看工单</Button>
              </Link>
            );
          } else {
            return (
              <Link
                to={{
                  pathname: '/customer/detail',
                  query: {
                    customerId: record.customer_id,
                  },
                }} target="_blank">
                <Button type="primary" size="small">查看详情</Button>
              </Link>
            );
          }
        },
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
