import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Tooltip } from 'antd';

import text from '../../../../config/text';
import api from '../../../../middleware/api';

import BaseTable from '../../../../components/base/BaseTable';

import Delivery from '../Delivery';
import AdminDelivery from '../AdminDelivery';

export default class Table extends BaseTable {
  componentWillReceiveProps(nextProps) {
    if (this.props.source != nextProps.source) {
      this.getList(nextProps);
    }
    if (JSON.stringify(this.props.selectedItem) != JSON.stringify(nextProps.selectedItem)) {
      this.setState({ list: [nextProps.selectedItem], total: 1 });
    }
  }

  handleUseStatusChange(index, record) {
    const coupon_item_id = record._id;
    const status = Number(record.status) === 0 ? 1 : 0;
    api.ajax({
      url: api.coupon.updataCouponStatus(),
      type: 'POST',
      data: { coupon_item_id, status },
    }, () => {
      this.getList(this.props);
    });
  }

  render() {
    const self = this;

    const columns = [
      {
        title: '序号',
        key: 'index',
        width: '48px',
        render: (value, record, index) => index + 1,
      }, {
        title: '优惠券名称',
        dataIndex: 'name',
        key: 'name',
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
        title: '面值(元)',
        dataIndex: 'price',
        key: 'price',
        className: 'text-right',
        width: '80px',
        render: value => Number(value).toFixed(2),
      }, {
        title: '描述',
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
        title: '有效期',
        dataIndex: 'valid_type',
        key: 'valid_type',
        width: '220px',
        render: (value, record) => {
          if (String(value) === '0') {
            // 时间段
            return `${record.valid_start_date}至${record.valid_expire_date}`;
          } else if (String(value) === '1') {
            // 具体天数
            return `领取后当天生效${record.valid_day}天有效`;
          }
        },
      }, {
        title: '领取限制',
        dataIndex: 'limit_count',
        key: 'limit_count',
        width: '75px',
        render: value => Number(value) > 0 ? value : '无限制',
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        className: 'center',
        width: '75px',
        render: (value, record) => {
          const status = (Number(value) === 0) ? 'success' : 'default';
          return <Badge status={status} text={text.useStatus[record.status]} />;
        },
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        width: '150px',
        className: 'center',
        render: (value, record, index) => {
          const userStatus = text.useStatus[-(record.status) + 1];
          return (
            <div>
            <span className={(Number(record.status) === 0) ? '' : 'hide'}>
              {
                api.isHeadquarters()
                  ? <AdminDelivery detail={record} size="small" />
                  : <Delivery detail={record} size="small" />
              }
              <span className="ant-divider" />
                </span>
              <a
                href="javascript:;"
                size="small"
                onClick={() => self.handleUseStatusChange(index, record)}
              >
                {userStatus}
              </a>
              <span className="ant-divider" />
              <Link to={{ pathname: `/marketing/times/detail/${record._id}` }}>
                详情
              </Link>
            </div>
          );
        },
      }];

    return this.renderTable(columns);
  }
}
