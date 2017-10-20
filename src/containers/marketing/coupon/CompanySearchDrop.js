import React, { Component } from 'react';
import { Table } from 'antd';

const noResult = require('../../../images/noresult.png');
const toastClose = require('../../../images/btn_toast_close.png');

export default class ItemSearchDrop extends Component {
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
    if (info.visible === true) {
      if (!info) {
        info = {};
      }
      info.visible = false;
      this.setState({ info });
      this.props.onCancel();
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.eventListenerFun, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.eventListenerFun, false);
  }

  /* componentDidMount() {
    document.addEventListener('click', () => {
      let { info } = this.state;
      if (info.visible === true) {
        if (!info) {
          info = {};
        }
        info.visible = false;
        this.setState({ info });
        this.props.onCancel();
      }
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
  }

  handleSuccess(data) {
    this.props.onItemSelect(data);
  }

  handleClick(e) {
    e.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const { info } = this.state;
    const { isInsertPart } = this.props;
    const dataSource = info.info ? info.info : [];

    const columns = [
      {
        title: '门店名称',
        dataIndex: 'name',
        key: 'name',
      }];

    let style = { display: 'none' };

    if (info.coordinate) {
      style = {
        position: 'absolute',
        width: '330px',
        left: `${info.coordinate && (info.coordinate.left)}px` || '',
        top: `${info.coordinate && (info.coordinate.top + 10)}px` || '',
        display: info.visible ? '' : 'none',
        zIndex: 1000,
        backgroundColor: 'white',
      };
    }

    return (
      <div style={style} onClick={this.handleClick}>
        <img src={toastClose} className="close" onClick={this.handleCancel} />
        {
          isInsertPart !== 'false' && dataSource && dataSource.length === 0 ?
            <div className="padding-20 center" style={{ boxShadow: '0 0 4px #cccccc' }}>
              <img src={noResult} style={{ width: '40px', height: '40px' }} />
              <p>暂时没有该门店，请更换关键字查询</p>
            </div> : <Table
              dataSource={dataSource}
              columns={columns}
              size="small"
              bordered={false}
              pagination={false}
              onRowClick={this.handleTableRowClick}
              rowKey={record => record._id}
              scroll={{ y: 180 }}
            />
        }
      </div>
    );
  }
}
