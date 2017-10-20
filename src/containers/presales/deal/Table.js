import React from 'react';
import { Tooltip, Badge } from 'antd';
import { Link } from 'react-router-dom';

import BaseTable from '../../../components/base/BaseTable';
import api from '../../../middleware/api';

import AuthPopover from './AuthPopover';
import CreateRemind from '../../../components/widget/CreateRemind';

export default class Table extends BaseTable {
  componentDidMount() {
    this.getList(this.props);
  }

  render() {
    const columns = [
      {
        title: '姓名',
        dataIndex: 'customer_name',
        key: 'customer_name',
        width: '110px',
        render: (value, record) => <Link to={{ pathname: `/customer/detail/${record.customer_id}` }} target="_blank">{value}</Link>,
      }, {
        title: '手机号',
        dataIndex: 'customer_phone',
        key: 'customer_phone',
        width: '115px',
      }, {
        title: '车牌号',
        dataIndex: 'auto_plate_num',
        key: 'auto_plate_num',
        width: '118px',
      }, {
        title: '购买车型',
        dataIndex: 'auto_type_name',
        key: 'auto_type_name',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 10) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '成交时间',
        dataIndex: 'deal_date',
        key: 'deal_date',
        width: '110px',
      }, {
        title: '销售姓名',
        dataIndex: 'seller_user_name',
        key: 'seller_user_name',
        width: '75px',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 4) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '结算状态',
        dataIndex: 'pay_status_name',
        key: 'pay_status_name',
        className: 'center',
        width: '80px',
        render: (value, record) => {
          if (String(record.pay_status) === '0') {
            return <Badge status="error" text={value} />;
          } else {
            return <Badge status="success" text={value} />;
          }
        },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center action-three',
        width: '180px',
        render: (id, record) => (
            <span key={id}>
              <Link to={{
                pathname: `/presales/deal/detail/${id}/${record.customer_id}/${record.auto_id}/${record.intention_id}`,
              }}>
                详情
              </Link>
              <span className="ant-divider" />
              <AuthPopover detail={record} size="small" />

              <span className="ant-divider" />
              <CreateRemind customer_id={record.customer_id} size="small" />
            </span>
          ),
      },
    ];

    return this.renderTable(columns);
  }
}
