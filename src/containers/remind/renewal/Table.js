import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, Badge } from 'antd';

import text from '../../../config/text';
import DateFormatter from '../../../utils/DateFormatter';

import BaseTable from '../../../components/base/BaseTable';

import InsuranceDetail from '../../customer/InsuranceDetail';
import Recorder from '../Recorder';

export default class TableRenewal extends BaseTable {
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
        width: '48px',
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
        width: '103px',
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
        title: '距离到期',
        key: 'dueExpire',
        className: 'center',
        width: '75px',
        render: (value, record) => `${DateFormatter.calculateDays(record.force_expire_date)  }日`,
      }, {
        title: '交强险到期',
        dataIndex: 'force_expire_date',
        key: 'force_expire_date',
        className: 'center',
        width: '100px',
      }, {
        title: '商业险到期',
        dataIndex: 'business_expire_date',
        key: 'business_expire_date',
        className: 'center',
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
        width: '130px',
        render: (value, record) => (
          <div>
            <span>
              <Recorder
                record={record}
                task_type="1"
                onSuccess={self.props.onSuccess}
              />
            </span>

            <span className="ant-divider" />

            <span>
              <InsuranceDetail
                type="text"
                customerId={record.customer_id}
                autoId={record.auto_id}
              />
            </span>
          </div>
        ),
      }];

    return this.renderTable(columns);
  }
}
