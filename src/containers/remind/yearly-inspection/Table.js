import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, Badge } from 'antd';

import text from '../../../config/text';

import BaseTable from '../../../components/base/BaseTable';

import Recorder from '../Recorder';

export default class TableYearlyInspection extends BaseTable {

  // 计算指定日期距离今天的天数 date格式为'yyyy-mm-rr'
  dueExpire(date) {
    const forceExpireTimeStamp = Date.parse(new Date(date));
    const todayTimeStamp = new Date().getTime();
    const dueDateStamp = forceExpireTimeStamp - todayTimeStamp;
    return parseInt(dueDateStamp / 1000 / 60 / 60 / 24);
  }

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
        render: value => text.gender[value],
        width: '48px',
      }, {
        title: '手机号',
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
          if (value.length <= 7) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '距离到期',
        key: 'dueExpire',
        className: 'center',
        width: '75px',
        render: (value, record) => `${self.dueExpire(record.inspection_expire_date)  }日`,
      }, {
        title: '年检到期',
        dataIndex: 'inspection_expire_date',
        key: 'inspection_expire_date',
        className: 'center',
        width: '100px',
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
            task_type="2"
            onSuccess={self.props.onSuccess}
          />
        ),
      }];

    return this.renderTable(columns);
  }
}
