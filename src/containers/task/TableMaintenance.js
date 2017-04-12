import React from 'react';
import {Link} from 'react-router';

import text from '../../config/text';
import BaseTable from '../../components/base/BaseTable';

import TaskModal from './StarterCustomerMaintenance';

export default class TableMaintenance extends BaseTable {
  render() {
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
        render(value, record) {
          return text.taskState[record.status];
        },
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
        title: '提醒日期',
        key: 'remind_date',
        dataIndex: 'remind_date',
      }, {
        title: '任务描述',
        key: 'remark',
        dataIndex: 'remark',
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        className: 'center',
        render: (value, record) => (
          <TaskModal record={record} task_type="maintain" handleChangeData={self.props.onSuccess}/>
        ),
      }];

    return this.renderTable(columns);
  }
}
