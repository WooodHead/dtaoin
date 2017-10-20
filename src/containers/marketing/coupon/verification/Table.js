import React from 'react';
import { message, Popconfirm } from 'antd';

import api from '../../../../middleware/api';

import BaseTable from '../../../../components/base/BaseTable';

export default class Table extends BaseTable {
  handleVerification = record => {
    api.ajax({
      url: api.coupon.useCustomerCouponItem(),
      type: 'POST',
      data: {
        customer_coupon_item_id: record._id,
      },
    }, () => {
      message.success('核销成功');
      this.props.onSuccess && this.props.onSuccess();
    });
  };

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

  getList(props) {
    this.setState({ isFetching: true });
    api.ajax({
      url: props.source,
    }, data => {
      const { list, total } = data.res;
      this.setState({
        isFetching: false,
        list,
        total: parseInt(total),
      });

      this.props.onGetList(list);
    }, () => {
      this.setState({ isFetching: false });
      this.props.onGetList([]);
    });
  }

  render() {
    const self = this;
    const columns = [
      {
        title: '微信昵称',
        dataIndex: 'nick_name',
        key: 'nick_name',
      }, {
        title: '姓名',
        dataIndex: 'customer_name',
        key: 'customer_name',
      }, {
        title: '手机号',
        dataIndex: 'customer_phone',
        key: 'customer_phone',
      }, {
        title: '优惠券名称',
        dataIndex: 'coupon_item_name',
        key: 'coupon_item_name',
      }, {
        title: '面值/折扣',
        dataIndex: 'coupon_item_type',
        key: 'coupon_item_type',
        className: 'text-right',
        render: (value, record) => {
          if (String(value) === '1') {
            return record.coupon_item_price;
          } else if (String(value) === '2') {
            return self.getCouponRate(record.coupon_item_discount);
          }
        },
      }, {
        title: '描述',
        dataIndex: 'coupon_item_remark',
        key: 'coupon_item_remark',
      }, {
        title: '可用数',
        dataIndex: 'amount',
        key: 'amount',
        className: 'text-right',
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        className: 'center',
        width: '10%',
        render: (value, record) => {
          let title = '你确定要核销这张优惠券吗？';
          if (Number(record.amount) <= Number(record.freeze)) {
            title = '工单中已使用该优惠券，确定要核销这张优惠券吗？';
          }

          return (
            <span>
              {
                Number(record.status) === 0
                  ? <span>
                    <Popconfirm
                      title={title}
                      onConfirm={e => self.handleVerification(record, e)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a href="javascript:;">核销</a>
                    </Popconfirm>
                  </span>
                  : null
              }
            </span>
          );
        },
      }];

    return this.renderTable(columns);
  }
}
