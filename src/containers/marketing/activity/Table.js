import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'antd';

import BaseTable from '../../../components/base/BaseTable';
import text from '../../../config/text';
import DateFormatter from '../../../utils/DateFormatter';

import Delivery from './Delivery';

export default class Table extends BaseTable {

  render() {
    const columns = [
      {
        title: '序号',
        key: 'order',
        render: (value, record, index) => index + 1,
      }, {
        title: '活动标题',
        dataIndex: 'title',
        key: 'title',
      }, {
        title: '优惠券',
        key: 'coupon_item',
        render: (value, record) => record.coupon_item_info && record.coupon_item_info.name,
      }, {
        title: '开始时间',
        dataIndex: 'start_time',
        key: 'start_time',
      }, {
        title: '结束时间',
        dataIndex: 'expire_time',
        key: 'expire_time',
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        className: 'center',
        render: (value, record) => {
          const startTime = DateFormatter.getDate(record.start_time);
          const endTime = DateFormatter.getDate(record.expire_time);

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
        key: 'action',
        className: 'center',
        width: '15%',
        render(value, record) {
          // let startTime = new Date(record.start_time);
          const endTime = new Date(record.expire_time);
          const now = new Date();

          return (
            <div>
              <span className={now > endTime ? 'hide' : ''}>
                <Delivery detail={record} size="small" />
                <span className="ant-divider" />
              </span>
              <Link to={{ pathname: `/marketing/activity/detail/${record._id}` }}>详情</Link>
              <span className={now > endTime ? 'hide' : ''}>
                <span className="ant-divider" />
                <Link to={{ pathname: `/marketing/activity/edit/${record._id}` }}>编辑</Link>
              </span>
            </div>
          );
        },
      }];

    return this.renderTable(columns);
  }
}
