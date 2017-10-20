import React from 'react';
import { Badge, Tooltip } from 'antd';
import { Link } from 'react-router-dom';

import BaseTable from '../../../components/base/BaseTable';
import text from '../../../config/text';
import DateFormatter from '../../../utils/DateFormatter';

import Delivery from './Delivery';

export default class Table extends BaseTable {
  render() {
    const columns = [
      {
        title: '活动名称',
        dataIndex: 'title',
        key: 'title',
        width: '260px',
        render: value => {
          if (!value) {
            return '--';
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
        title: '活动类型',
        dataIndex: 'type_name',
        key: 'type_name',
        width: '77px',
      }, {
        title: '活动时间',
        dataIndex: 'start_date',
        key: 'start_date',
        width: '175px',
        render: (value, record) => {
          if (value.indexOf('0000') > -1) {
            return '--';
          }
          return `${value}-${record.expire_date}`;
        },
      }, {
        title: '优惠券',
        dataIndex: 'coupon_item_names',
        key: 'coupon_item_names',
        render: value => {
          if (!value) {
            return '--';
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
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '89px',
        className: 'center',
        render: (value, record) => {
          if (String(value) === '-1') {
            return <Badge status="processing" text="创建中" />;
          }

          const startTime = DateFormatter.getDate(record.start_date);
          const endTime = DateFormatter.getDate(`${record.expire_date  } 23:59:59`);

          const now = new Date();
          let status = '0';
          let badge = 'default';
          if (now < startTime) {
            status = '0';
            badge = 'default';
          } else if (now >= startTime && now <= endTime) {
            status = '1';
            badge = 'success';
          } else if (now > endTime) {
            status = '2';
            badge = 'error';
          }
          return <Badge status={badge} text={text.couponActivityStatus[status]} />;
        },
      }, {
        title: '操作',
        key: 'active',
        width: '155px',
        className: 'center',
        render: (value, record) => {
          if (String(record.status) === '-1') {
            return (
              <Link to={{ pathname: `/marketing/coupon-activity/edit/${record._id}` }}>编辑</Link>
            );
          }

          const endTime = new Date(`${record.expire_date  } 23:59:59`);
          const now = new Date();
          return (
            <div>
              <span className={(now > endTime || String(record.type) === '1') ? 'hide' : ''}>
                <Delivery detail={record} size="small" />
                <span className="ant-divider" />
              </span>
              <Link to={{ pathname: `/marketing/coupon-activity/edit/${record._id}` }}>详情</Link>
              <span className={now > endTime ? 'hide' : ''}>
                <span className="ant-divider" />
                <Link to={{ pathname: `/marketing/coupon-activity/list/${record._id}` }}>参与记录</Link>
              </span>
            </div>
          );
        },
      },
    ];
    return this.renderTable(columns);
  }
}
