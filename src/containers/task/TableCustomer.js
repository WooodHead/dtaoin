import React from 'react';
import {Link} from 'react-router';

import text from '../../config/text';
import BaseTable from '../../components/base/BaseTable';

import CustomerTaskModal from './StarterCustomerMaintenance';

export default class TableCustomer extends BaseTable {

  render() {
    let self = this;

    const columns = [
      {
        title: '序号',
        dataIndex: 'order',
        key: 'order',
        render: (value, record, index) => index + 1,
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
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        render: (value, record) => text.taskState[record.status],
      }, {
        title: '任务类型',
        dataIndex: '',
        key: '',
        className: 'center',
        render: (value, record) => record.type_name,
      }, {
        title: '任务描述',
        dataIndex: 'remark',
        key: 'remark',
        className: 'center',
      }, {
        title: '下次提醒',
        dataIndex: 'remind_date',
        key: 'remind_date',
        className: 'center',
        render: value => Number(value.split('-')[0]) > 0 ? value : '',
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        className: 'center',
        width: '5%',
        render: (value, record) => (
          <CustomerTaskModal
            record={record}
            task_type="common"
            handleChangeData={self.props.onSuccess}
          />
        ),
      }];

    return this.renderTable(columns);
  }
}
