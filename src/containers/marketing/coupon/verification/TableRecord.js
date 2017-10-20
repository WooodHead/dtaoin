import React from 'react';
import { Tooltip } from 'antd';

import BaseTable from '../../../../components/base/BaseTable';
import DateFormatter from '../../../../utils/DateFormatter';

export default class Table extends BaseTable {
  getCouponRate = value => {
    let rate = String(Number(Number(value).toFixed(2)) * 100);
    if (rate.length === 1) {
      return `${(rate / 10) || '0'  }折`;
    }

    if (Number(rate.charAt(rate.length - 1)) === 0) {
      rate = rate.slice(0, rate.length - 1);
    }
    return `${rate || '0'  }折`;
  };

  render() {
    const columns = [
      {
        title: '微信昵称',
        dataIndex: 'nick_name',
        key: 'nick_name',
        width: '89px',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 5) {
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
        width: '110px',
      }, {
        title: '手机号',
        dataIndex: 'customer_phone',
        key: 'customer_phone',
        width: '110px',
      }, {
        title: '优惠券名称',
        dataIndex: 'coupon_item_name',
        key: 'coupon_item_name',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 6) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '面值/折扣',
        dataIndex: 'coupon_item_show',
        key: 'coupon_item_show',
        width: '85px',
        className: 'text-right',
      }, {
        title: '描述',
        dataIndex: 'coupon_item_remark',
        key: 'coupon_item_remark',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 6) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '来源',
        dataIndex: 'from_type_show',
        key: 'from_type_show',
        width: '103px',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 6) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '领取时间',
        dataIndex: 'coupon_item_gain_time',
        key: 'coupon_item_gain_time',
        width: '130px',
        render: value => value && value.indexOf('0000') > -1 ? '--' : DateFormatter.getFormatTime(value),
      }, {
        title: '核销时间',
        dataIndex: 'use_time',
        key: 'use_time',
        width: '130px',
        render: value => value && value.indexOf('0000') > -1 ? '--' : DateFormatter.getFormatTime(value),
      }];

    return this.renderTable(columns);
  }
}
