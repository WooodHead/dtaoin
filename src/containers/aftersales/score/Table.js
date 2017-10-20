import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';

import BaseTable from '../../../components/base/BaseTable';
import DateFormatter from '../../../utils/DateFormatter';

export default class Table extends BaseTable {
  render() {
    const columns = [
      {
        title: '客户姓名',
        dataIndex: 'customer_name',
        key: 'customer_name',
        width: '110px',
        render: (value, record) => <Link to={{ pathname: `/customer/detail/${record.customer_id}` }} target="_blank">{value}</Link>,
      }, {
        title: '服务',
        dataIndex: 'attitude',
        key: 'attitude',
        width: '48px',
      }, {
        title: '施工',
        dataIndex: 'quality',
        key: 'quality',
        width: '48px',
      }, {
        title: '环境',
        dataIndex: 'environment',
        key: 'environment',
        width: '48px',
      }, {
        title: '评价内容',
        dataIndex: 'remark',
        key: 'remark',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 15) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '消费金额',
        dataIndex: 'total_fee',
        key: 'total_fee',
        className: 'text-right',
        width: '110px',
        render: value => Number(value).toFixed(2),
      }, {
        title: '结算时间',
        dataIndex: 'pay_time',
        key: 'pay_time',
        width: '130px',
        render: value => DateFormatter.getFormatTime(value),
      }, {
        title: '评价时间',
        dataIndex: 'ctime',
        key: 'ctime',
        width: '130px',
        render: value => DateFormatter.getFormatTime(value),
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        className: 'center',
        width: '94px',
        render: (value, record) => (
            <Link
              to={{ pathname: `/aftersales/project/detail/${record.intention_id}/${record.auto_id}/${record.customer_id}` }}
              target="_blank">
              查看工单
            </Link>
          ),
      }];
    return this.renderTable(columns);
  }
}
