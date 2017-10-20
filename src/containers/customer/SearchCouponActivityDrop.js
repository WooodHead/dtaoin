import React, { Component } from 'react';
import { Table } from 'antd';

const toastClose = require('../../images/btn_toast_close.png');

export default class SearchCouponActivityDrop extends Component {
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

  /* componentDidMount() {
    document.addEventListener('click', () => {
      let {partsInfo} = this.state;
      if (!partsInfo) {
        partsInfo = {};
      }
      partsInfo.visible = false;
      this.setState({partsInfo});
    }, false);
  }*/

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

    const columns = [{
      title: '活动名称',
      dataIndex: 'title',
      key: 'title',
      width: '15%',
    }, {
      title: '优惠券',
      key: 'coupon_info',
      width: '15%',
      render: (value, record) => record.coupon_item_info && record.coupon_item_info.name,
    }, {
      title: '有效期',
      dataIndex: 'start_time',
      key: 'start_time',
      width: '25%',
      render: (value, record) => `${value} 至 ${record.expire_time}`,
    }];

    let style = { display: 'none' };

    if (partsInfo.coordinate) {
      style = {
        position: 'absolute',
        width: '800px',
        left: `${partsInfo.coordinate.left}px` || '',
        top: `${partsInfo.coordinate.top + 10}px` || '',
        display: partsInfo.visible ? '' : 'none',
        zIndex: 9998,
        backgroundColor: 'white',
      };
    }

    return (
      <div style={style} onClick={this.handleClick}>
        <img src={toastClose} className="close" onClick={this.handleCancel}/>
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
