import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';

import api from '../../../middleware/api';
import BaseTable from '../../../components/base/BaseTable';

export default class Table extends BaseTable {
  render() {
    const columns = [
      {
        title: '门店',
        dataIndex: 'company_name',
        key: 'company_name',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 8) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '姓名',
        dataIndex: 'customer_name',
        key: 'customer_name',
        width: '75px',
      }, {
        title: '电话',
        dataIndex: 'customer_phone',
        key: 'customer_phone',
        width: '110px',
      }, {
        title: '车牌号',
        dataIndex: 'plate_num',
        key: 'plate_num',
        width: '90px',
      }, {
        title: '车型',
        dataIndex: 'auto_type_name',
        key: 'auto_type_name',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 8) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '服务',
        dataIndex: 'attitude',
        key: 'attitude',
        width: '48px',
        render: value => <span>{value}星</span>,
      }, {
        title: '施工',
        dataIndex: 'quality',
        key: 'quality',
        width: '48px',
        render: value => <span>{value}星</span>,
      }, {
        title: '环境',
        dataIndex: 'environment',
        key: 'environment',
        width: '48px',
        render: value => <span>{value}星</span>,
      }, {
        title: '评价内容',
        dataIndex: 'remark',
        key: 'remark',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 8) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '评价时间',
        dataIndex: 'ctime',
        key: 'ctime',
        width: '150px',
      },/* , {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        width: '94px',
        className: 'center',
        render: (value, record) => {
          return (
            <Link
              to={{ pathname: `/aftersales/project/detail/${record.intention_id}/${record.auto_id}/${record.customer_id}` }}
              target="_blank">
              查看工单
            </Link>
          );
        },
    }*/];

    return this.renderTable(columns);
  }
}
