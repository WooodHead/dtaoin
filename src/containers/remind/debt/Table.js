import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, Badge } from 'antd';

import api from '../../../middleware/api';
import text from '../../../config/text';
import BaseTable from '../../../components/base/BaseTable';
import DateFormatter from '../../../utils/DateFormatter';

import Recorder from '../Recorder';

export default class TableDebt extends BaseTable {
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
        title: '结算时间',
        key: 'ptime',
        dataIndex: 'ptime',
        width: '130px',
        render: value => DateFormatter.getFormatTime(value),
      }, {
        title: '挂账金额',
        key: 'amount',
        dataIndex: 'amount',
        width: '85px',
      }, {
        title: '还款时间',
        key: 'remind_date',
        dataIndex: 'remind_date',
        width: '100px',
      }, {
        title: '状态',
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
        dataIndex: 'action',
        key: 'action',
        className: 'center',
        width: '118px',
        render: (value, record) => (
          <div>
            <Recorder
              record={record}
              task_type="4"
              onSuccess={self.props.onSuccess}
            />

            <span className="ant-divider" />

            <Link
              to={{ pathname: `/aftersales/project/detail/${record.from_maintain_id}/${record.auto_id}` }}>
              查看工单
            </Link>
          </div>
        ),
      }];

    return this.renderTable(columns);
  }
}
