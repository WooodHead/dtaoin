import React, { Component } from 'react';
import { Modal, Table } from 'antd';

import text from '../../config/text';

/**
 * 客户的优惠券详情
 */
export default class CouponDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    [
      'checkDetails',
      'showModal',
      'handleOk',
      'handleCancel',
    ].map(method => this[method] = this[method].bind(this));
  }

  checkDetails() {
    this.setState({ visible: true });
  }

  showModal() {
    this.setState({ visible: true });
  }

  handleOk() {
    this.setState({ visible: false });
  }

  handleCancel() {
    this.setState({ visible: false });
  }

  render() {
    const { couponDetail, detail } = this.props;

    if (couponDetail) {
      couponDetail.map(item => {
        item.name = item.coupon_item_info.name;
        item.remark = item.coupon_item_info.remark;
      });
    }

    const expandedRowRender = record => {
      const columns = [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name1',
        }, {
          title: '类型',
          dataIndex: '_id',
          key: 'type',
          render: value => value.length > 4 ? '配件' : '项目',
        }, {
          title: '数量',
          dataIndex: 'amount',
          key: 'amount',
        }, {
          title: '售价(元)',
          dataIndex: 'price',
          key: 'price',
          className: String(record.coupon_item_info.type) === '1' ? '' : 'hide',
          render: value => Number(value).toFixed(2),
        }, {
          title: '折扣',
          key: 'discount_rate',
          className: String(record.coupon_item_info.type) === '2' ? '' : 'hide',
          render: () => {
            let rate = String(Number(Number(record.coupon_item_info.discount_rate).toFixed(2)) *
              100);
            if (rate.length === 1) {
              return `${(rate / 10) || '0'  }折`;
            }

            if (Number(rate.charAt(rate.length - 1)) === 0) {
              rate = rate.slice(0, rate.length - 1);
            }
            return `${rate || '0'  }折`;
          },
        }];

      const items = record.coupon_item_info.items || [];
      const partTypes = record.coupon_item_info.part_types || [];
      const data = items.concat(partTypes);

      return (
        <Table
          className="components-table-demo-nested"
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      );
    };

    const columns = [
      {
        title: '序号',
        key: 'index',
        render: (value, record, index) => index + 1,
      }, {
        title: '优惠券名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '优惠类型',
        dataIndex: 'coupon_item_info.type',
        key: 'type',
        render: value => text.couponType[value],
      }, {
        title: '描述',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '有效期',
        dataIndex: 'coupon_item_info',
        key: 'coupon_item_info',
        render: value => {
          if (String(value.valid_type) === '0') {
            // 时间段
            return `${value.valid_start_date}至${value.valid_expire_date}`;
          } else if (String(value.valid_type) === '1') {
            // 具体天数
            return `领取后当天生效${value.valid_day}天有效`;
          }
        },
      }, {
        title: '剩余数量',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount, record) => {
          if (Number(record.total) > 0) {
            return Number(amount).toFixed(0);
          } else if (Number(record.total) === 0) {
            return '不限次数';
          } else {
            return '异常情况';
          }
        },
      }, {
        title: '总数',
        dataIndex: 'total',
        key: 'total',
        render: total => {
          if (Number(total) > 0) {
            return total;
          } else if (Number(total) === 0) {
            return '不限次数';
          } else {
            return '';
          }
        },
      }];

    return (
      <div className="ml20" style={{ display: 'inline-block' }}>
        <a href="javascript:;" onClick={this.checkDetails}>{`查看${detail.name}的优惠券`}</a>
        <Modal
          title="优惠券详情"
          visible={this.state.visible}
          width={1000}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Table
            className="components-table-demo-nested"
            columns={columns}
            dataSource={couponDetail}
            expandedRowRender={expandedRowRender}
            pagination={false}
            rowKey={record => record._id}
          />
        </Modal>
      </div>
    );
  }
}
