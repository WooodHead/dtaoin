import React, { Component } from 'react';
import { Table } from 'antd';

import NewCustomerAutoModal from '../../containers/auto/NewCustomerAutoModal';

const noResult = require('../../images/noresult.png');
const toastClose = require('../../images/btn_toast_close.png');

export default class CustomerSearchDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: '',
    };

    [
      'handleTableRowClick',
      'handleSuccess',
      'handleCancel',
      'eventListenerFun',
    ].map(method => this[method] = this[method].bind(this));
  }

  eventListenerFun() {
    let { info } = this.state;
    if (!info) {
      info = {};
    }
    info.visible = false;
    this.setState({ info });
    this.props.onCancel();
  }

  componentDidMount() {
    document.addEventListener('click', this.eventListenerFun, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.eventListenerFun, false);
  }

  /*  componentDidMount() {
      document.addEventListener('click', () => {
        let { info } = this.state;
        if (!info) {
          info = {};
        }
        info.visible = false;
        this.setState({ info });
        this.props.onCancel();
      }, false);
    }*/

  componentWillReceiveProps(nextProps) {
    if (nextProps.info) {
      this.setState({ info: nextProps.info });
    }
  }

  handleTableRowClick(value) {
    this.handleCancel();
    this.props.onItemSelect(value);
  }

  handleCancel() {
    const { info } = this.state;
    info.visible = false;
    this.setState({ info });
    this.props.onCancel();
  }

  handleSuccess(data) {
    this.props.onItemSelect(data);
  }

  handleClick(e) {
    e.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const { info } = this.state;
    const dataSource = info.info ? info.info : [];

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
      }, {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
        width: '40%',
      }, {
        title: '车牌号',
        dataIndex: 'plate_num',
        key: 'plate_num',
        width: '30%',
      }];

    let style = { display: 'none' };

    if (info.coordinate) {
      style = {
        position: 'absolute',
        width: '500px',
        left: `${info.coordinate && (info.coordinate.left)}px` || '',
        top: `${info.coordinate && (info.coordinate.top + 10)}px` || '',
        display: info.visible ? '' : 'none',
        zIndex: 100,
        backgroundColor: 'white',
      };
    }

    return (
      <div style={style} onClick={this.handleClick}>
        <img src={toastClose} className="close" onClick={this.handleCancel} />
        {
          dataSource && dataSource.length === 0 ? (
            <div className="padding-20 center" style={{ boxShadow: '0 0 4px #cccccc' }}>
              <img src={noResult} style={{ width: '40px', height: '40px' }} />
              <p>暂时没有找到该客户，请重新搜索客户或创建新客户</p>
              <div className="mt10">
                <span style={{ position: 'relative', left: '-90px' }}>
                  <NewCustomerAutoModal
                    inputValue={info.keyword}
                    onSuccess={this.handleSuccess}
                    size="default"
                    required={true}
                  />
                </span>
              </div>
            </div>
          ) : (
            <Table
              dataSource={dataSource}
              columns={columns}
              size="small"
              bordered={false}
              pagination={false}
              onRowClick={this.handleTableRowClick}
              rowKey={record => record._id}
              scroll={{ y: 180 }}
            />
          )
        }
      </div>
    );
  }
}
