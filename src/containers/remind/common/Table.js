import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Tooltip } from 'antd';

import text from '../../../config/text';
import BaseTable from '../../../components/base/BaseTable';

import Recorder from '../Recorder';

export default class TableCommon extends BaseTable {
  render() {
    const self = this;

    const columns = [
      {
        title: '姓名',
        dataIndex: 'customer_name',
        key: 'customer_name',
        width: '110px',
        render: (value, record) => (
          <Link to={{ pathname: `/customer/detail/${record.customer_id}` }} target="_blank">
            {value}
          </Link>
        ),
      }, {
        title: '性别',
        dataIndex: 'customer_gender',
        key: 'customer_gender',
        width: '50px',
        render: value => text.gender[value],
      }, {
        title: '手机号',
        dataIndex: 'customer_phone',
        key: 'customer_phone',
        width: '110px',
      }, {
        title: '提醒日期',
        key: 'remind_date',
        dataIndex: 'remind_date',
        width: '102px',
      }, {
        title: '任务描述',
        key: 'remark',
        dataIndex: 'remark',
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
        title: '任务状态',
        dataIndex: 'status_desc',
        key: 'status_desc',
        className: 'center',
        width: '85px',
        render: (value, record) => {
          let statusLabel = 'default';
          switch (Number(record.status)) {
          case 0:
            break;
          case 1:
            statusLabel = 'processing';
            break;
          case 2:
            statusLabel = 'success';
            break;
          }
          return <Badge status={statusLabel} text={value} />;
        },
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        className: 'center',
        width: '48px',
        render: (value, record) => (
          <Recorder
            record={record}
            task_type="7"
            onSuccess={self.props.onSuccess}
          />
        ),
      }];

    return this.renderTable(columns);
  }
}
