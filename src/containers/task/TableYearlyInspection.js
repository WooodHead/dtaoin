import React from 'react';
import {Link} from 'react-router';
import {message} from 'antd';

import text from '../../config/text';
import api from '../../middleware/api';

import TableWithPagination from '../../components/widget/TableWithPagination';

import TaskModal from './StarterRenewalYearly';

export default class TableYearlyInspection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      total: 0,
      isFetching: false,
    };

    [
      'handleChangeData',
      'getList',
      'handlePageChange',
      'handleChangeData',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getList(this.props.source);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.source != nextProps.source) {
      this.getList(nextProps.source);
    }
  }

  handlePageChange(page) {
    this.props.updateState({page});
  }

  handleChangeData() {
    this.getList(this.props.source);
  }

  //计算指定日期距离今天的天数 date格式为'yyyy-mm-rr'
  dueExpire(date) {
    let forceExpireTimeStamp = Date.parse(new Date(date));
    let todayTimeStamp = new Date().getTime();
    let dueDateStamp = forceExpireTimeStamp - todayTimeStamp;
    return parseInt(dueDateStamp / 1000 / 60 / 60 / 24);
  }

  getList(source) {
    this.setState({isFetching: true});
    api.ajax({
      url: source,
    }, (data) => {
      if (data.code !== 0) {
        message.error(data.msg);
      } else {
        let list = data.res.list ? data.res.list : [];
        let total = Number(data.res.total) || 0;
        this.setState({list: list, total: total, isFetching: false});
      }
    });
  }

  render() {
    let {list, total, isFetching} = this.state;
    let self = this;
    const columns = [
      {
        title: '序号',
        dataIndex: 'order',
        key: 'order',
        render: (value, record, index) => index + 1,
      }, {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        render: (value, record) => text.taskState[record.status],
      }, {
        title: '车牌号',
        dataIndex: 'plate_num',
        key: 'plate_num',
      }, {
        title: '品牌型号',
        dataIndex: 'auto_type_name',
        key: 'auto_type_name',
      }, {
        title: '客户姓名 性别',
        dataIndex: 'customer_name',
        key: 'customer_name',
        render: (value, record) => {
          let customerName = record.customer_name || '';
          let customerGender = record.customer_gender || '-1';
          return (
            <Link to={{pathname: '/customer/detail', query: {customerId: record.customer_id}}}>
              {customerName + ' ' + text.gender[customerGender]}
            </Link>
          );
        },
      }, {
        title: '手机号',
        dataIndex: 'customer_phone',
        key: 'customer_phone',

      }, {
        title: '距离到期',
        key: 'dueExpire',
        className: 'center',
        render: (value, record) => self.dueExpire(record.inspection_expire_date) + '日',
      }, {
        title: '年检到期',
        dataIndex: 'inspection_expire_date',
        key: 'inspection_expire_date',
        className: 'center',
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        className: 'center',
        render: (value, record) => (
          <TaskModal record={record} task_type="inspection" handleChangeData={self.handleChangeData}/>
        ),
      }];

    return (
      <TableWithPagination
        isLoading={isFetching}
        columns={columns}
        dataSource={list}
        total={Number(total)}
        currentPage={this.props.page}
        onPageChange={this.handlePageChange}
      />
    );
  }
}
