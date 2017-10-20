import React, { Component } from 'react';
import { Table } from 'antd';

import text from '../../../config/text';

const toastClose = require('../../../images/btn_toast_close.png');

export default class SearchCouponDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partsInfo: '',
    };
    [
      'handleTableRowClick',
      'handleCancel',
      'handleSuccess',
      'eventListenerFun',
    ].map(method => this[method] = this[method].bind(this));
  }

  eventListenerFun() {
    let { partsInfo } = this.state;
    if (!partsInfo) {
      partsInfo = {};
    }
    partsInfo.visible = false;
    this.setState({ partsInfo });
  }

  componentDidMount() {
    document.addEventListener('click', this.eventListenerFun, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.eventListenerFun, false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.partsInfo) {
      this.setState({ partsInfo: nextProps.partsInfo }, () => {
        if (!nextProps.partsInfo.keyword) {
          this.handleCancel();
        }
      });
    }
  }

  handleTableRowClick(value) {
    this.handleCancel();
    this.props.onTableRowClick(value);
    this.props.onCancel && this.props.onCancel();
  }

  handleCancel() {
    const { partsInfo } = this.state;
    partsInfo.visible = false;
    this.setState({ partsInfo });
  }

  handleSuccess(data) {
    this.props.onTableRowClick(data);
  }

  handleClick(e) {
    e.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const { partsInfo } = this.state;
    const dataSource = partsInfo.info ? partsInfo.info : [];

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: '100px',
      }, {
        title: '优惠信息',
        key: 'coupon_info',
        width: '75px',
        render: (value, record) => {
          if (String(record.type) === '1') {
            return `${Number(record.price).toFixed(2)}元`;
          } else if (String(record.type) === '2') {
            let rate = String(Number(Number(record.discount_rate).toFixed(2)) * 100);
            if (Number(rate.charAt(rate.length - 1)) === 0) {
              rate = rate.slice(0, rate.length - 1);
            }
            return `${rate || '0'  }折`;
          }
        },
      }, {
        title: '优惠券类型',
        dataIndex: 'type',
        key: 'type',
        width: '100px',
        render: value => text.couponType[value],
      }, {
        title: '描述',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '有效期',
        dataIndex: 'valid_type',
        key: 'valid_type',
        width: '190px',
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
        title: '领用限制',
        dataIndex: 'limit_count',
        key: 'limit_count',
        width: '75px',
      }];

    let style = { display: 'none' };

    if (partsInfo.coordinate) {
      style = {
        position: 'absolute',
        width: '690px',
        left: `${partsInfo.coordinate.left}px` || '',
        top: `${partsInfo.coordinate.top + 10}px` || '',
        display: partsInfo.visible ? '' : 'none',
        zIndex: 9998,
        backgroundColor: 'white',
      };
    }

    return (
      <div style={style} onClick={this.handleClick}>
        <img src={toastClose} className="close" onClick={this.handleCancel} />
        <Table
          dataSource={dataSource}
          columns={columns}
          size="small"
          bordered={false}
          pagination={false}
          onRowClick={this.handleTableRowClick}
          rowKey={record => record._id}
          scroll={{ y: 200 }}
        />
      </div>
    );
  }
}
