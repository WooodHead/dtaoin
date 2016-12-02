import React from 'react'
import {Button, Table} from 'antd'
import api from '../../../middleware/api'
import TableWithPagination from '../../base/TableWithPagination'

export default class ExpenseTable extends React.Component {
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
        title: '付款时间',
        dataIndex: 'ptime',
        key: 'ptime'
      }, {
        title: '支出类型',
        dataIndex: 'expenditure_type_name',
        key: 'expenditure_type_name'
      }, {
        title: '金额(元)',
        dataIndex: 'amount',
        key: 'amount',
        className: 'text-right'
      }, {
        title: '收款方',
        dataIndex: 'receive_company',
        key: 'receive_company'
      }, {
        title: '付款方式',
        dataIndex: 'pay_type_name',
        key: 'pay_type_name'
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark'
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
