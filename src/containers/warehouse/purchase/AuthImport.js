import React from 'react';
import {message, Popover, Button, Icon, Popconfirm} from 'antd';
import QRCode from 'qrcode.react';

import api from '../../../middleware/api';
import path from '../../../config/path';

export default class AuthImport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      hasPermission: false,
      detail: {},
    };

    this.handleAuthPrepare = this.handleAuthPrepare.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.checkPermission(path.warehouse.purchase.import);
  }

  handleAuthPrepare(visible) {
    let {id, type} = this.props;
    if (type === '1') {
      this.saveInWarehouse(id);
      return;
    }

    if (visible) {
      this.interval = setInterval(this.getPurchaseDetail.bind(this, id), 2000);
    } else {
      clearInterval(this.interval);
    }
    this.setState({visible});
  }

  handleSubmit(e) {
    e.preventDefault();

    api.ajax({
      url: api.warehouse.purchase.import(),
      type: 'post',
      data: {purchase_id: this.props.id},
    }, (data) => {
      let {detail} = data.res;
      if (String(detail.import_user_id) !== '0') {
        message.success('入库成功');
        setTimeout(() => {
          location.href = '/warehouse/purchase/index';
        }, 500);
      }
    }, (error) => {
      message.error(`入库失败[${error}]`);
    });
  }

  async checkPermission(path) {
    let hasPermission = await api.checkPermission(path);
    this.setState({hasPermission});
  }

  saveInWarehouse(id) {
    api.ajax({
      type: 'post',
      url: api.warehouse.purchase.import(),
      data: {purchase_id: id},
    }, data => {
      let {detail} = data.res;
      if (detail.import_user_id !== '0') {
        message.success('入库成功');
        location.href = '/warehouse/purchase/index';
      }
    });
  }

  getPurchaseDetail(id) {
    api.ajax({
      url: api.warehouse.purchase.detail(id),
    }, (data) => {
      let {detail} = data.res;

      this.setState({detail});

      if (String(detail.import_user_id) !== '0') {
        message.success('入库成功');
        clearInterval(this.interval);
        location.href = '/warehouse/purchase/index';
      }
    }, (err) => {
      message.error(`入库失败[${err}]`);
      clearInterval(this.interval);
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let {id, disabled} = this.props;
    let {detail, hasPermission} = this.state;
    let importUserId = detail.import_user_id;

    const content = (
      <div className="center">
        <QRCode
          value={JSON.stringify({
            authType: 'purchase_import',
            requestParams: {
              type: 'post',
              url: api.warehouse.purchase.import(),
              data: {purchase_id: id},
            },
          })}
          size={128}
          ref="qrCode"
        />
        <p>请扫码确认</p>
        <p>该采购单配件入库</p>
        <p>
          <Icon
            type="check-circle"
            className={(importUserId && importUserId !== '0') ? 'confirm-check' : 'hide'}
          />
        </p>
      </div>
    );

    return (
      hasPermission ?
        <Popconfirm
          placement="topRight"
          title="确定要入库吗"
          onConfirm={this.handleSubmit}
        >
          <Button type="primary" disabled={disabled}>入库</Button>
        </Popconfirm> :
        <Popover
          content={content}
          title=""
          trigger="click"
          visible={this.state.visible}
          onVisibleChange={this.handleAuthPrepare}
        >
          <Button type="primary" disabled={disabled}>入库</Button>
        </Popover>
    );
  }
}
