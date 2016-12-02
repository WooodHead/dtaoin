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
        title: '交易时间',
        dataIndex: 'deal_date',
        key: 'deal_date'
      }, {
        title: '车牌号',
        dataIndex: 'plate_num',
        key: 'plate_num'
      }, {
        title: '裸车收入',
        dataIndex: 'bare_auto',
        key: 'bare_auto',
        className: 'text-right'
      }, {
        title: '上牌收入',
        dataIndex: 'license_tax',
        key: 'license_tax',
        className: 'text-right'
      }, {
        title: '按揭收入',
        dataIndex: 'loan',
        key: 'loan',
        className: 'text-right'
      }, {
        title: '保险收入',
        dataIndex: 'insurance',
        key: 'insurance',
        className: 'text-right'
      }, {
        title: '加装收入',
        dataIndex: 'decoration',
        key: 'decoration',
        className: 'text-right'
      }, {
        title: '总收入',
        dataIndex: 'total',
        key: 'total',
        className: 'text-right'
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
