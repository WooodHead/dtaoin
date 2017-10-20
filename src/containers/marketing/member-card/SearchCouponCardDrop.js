import React, { Component } from 'react';
import { Table } from 'antd';

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

    const columns = [{
      title: '套餐卡名称',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    }, {
      title: '售价',
      dataIndex: 'price',
      key: 'price',
      width: '25%',
    }, {
      title: '描述',
      dataIndex: 'remark',
      key: 'remark',
      width: '25%',
    }, {
      title: '有效期',
      dataIndex: 'valid_day',
      key: 'valid_day',
      width: '25%',
    }];

    let style = { display: 'none' };

    if (partsInfo.coordinate) {
      style = {
        position: 'absolute',
        width: '600px',
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
