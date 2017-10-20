import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Tooltip } from 'antd';

import text from '../../../config/text';
import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';

import BaseTable from '../../../components/base/BaseTable';

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
        title: '活动标题',
        dataIndex: 'title',
        key: 'title',
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
        title: '活动时间',
        dataIndex: 'start_date',
        key: 'start_date',
        width: '180px',
        render: (value, record) => `${value}至${record.expire_date}`,
      }, {
        title: '优惠总数',
        dataIndex: 'total_coupon_count',
        key: 'total_coupon_count',
        width: '75px',
      }, {
        title: '门市价',
        dataIndex: 'sell_price',
        key: 'sell_price',
        className: 'text-right',
        width: '95px',
        render: value => Number(value).toFixed(2),
      }, {
        title: '起始价',
        dataIndex: 'start_price',
        key: 'start_price',
        className: 'text-right',
        width: '95px',
        render: value => Number(value).toFixed(2),
      }, {
        title: '底价',
        dataIndex: 'min_price',
        key: 'min_price',
        className: 'text-right',
        width: '95px',
        render: value => Number(value).toFixed(2),
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        className: 'center',
        width: '80px',
        render: (value, record) => {
          const startTime = DateFormatter.getDate(`${record.start_date  } 00:00:00`);
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
        key: 'handle',
        className: 'center',
        width: '140px',
        render: (value, record) => (
            <div>
              <Link to={{ pathname: `/marketing/bargain/edit/${record._id}` }}>详情</Link>
              <span className="ant-divider" />
              <Link to={{ pathname: `/marketing/bargain/index/${record._id}` }}>参与者列表</Link>
            </div>
          ),
      }];

    return this.renderTable(columns);
  }
}
