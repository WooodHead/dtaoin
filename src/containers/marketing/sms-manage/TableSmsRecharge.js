import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Popconfirm, message, Tooltip } from 'antd';

import api from '../../../middleware/api';

import BaseTable from '../../../components/base/BaseTable';

export default class TableSmsRecharge extends BaseTable {
  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'phone',
        key: 'phone',
        render: (value, record, index) => index + 1,
      }, {
        title: '充值时间',
        dataIndex: 'ctime',
        key: 'ctime',
      }, {
        title: '充值金额',
        dataIndex: 'total_price',
        key: 'total_price',
        className: 'text-right',
        render: value => Number(value).toFixed(2),

      }, {
        title: '充值条数',
        dataIndex: 'total_count',
        key: 'total_count',
      }, {
        title: '充值单价',
        dataIndex: 'unit_price',
        key: 'unit_price',
        className: 'text-right',
        render: value => Number(value).toFixed(2),
      }, {
        title: '充值类型',
        dataIndex: 'type_desc',
        key: 'type_desc',
      }, {
        title: '有效期',
        dataIndex: 'expire_time',
        key: 'expire_time',
      }];

    return this.renderTable(columns);
  }
}
