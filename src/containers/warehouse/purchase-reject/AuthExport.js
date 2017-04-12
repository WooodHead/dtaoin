import React from 'react';
import {message, Popover, Button, Icon, Popconfirm} from 'antd';
import QRCode from 'qrcode.react';

import api from '../../../middleware/api';
import path from '../../../config/path';

export default class AuthExport extends React.Component {
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
    this.checkPermission(path.warehouse.purchaseReject.export);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleAuthPrepare(visible) {
    let {id} = this.props;
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
      url: api.warehouse.reject.export(),
      type: 'post',
      data: {reject_id: this.props.id},
    }, (data) => {
      let {detail} = data.res;
      if (String(detail.export_user_id) !== '0') {
        message.success('出库成功');
        setTimeout(() => {
          location.href = '/warehouse/purchase-reject/index';
        }, 500);
      }
    }, (error) => {
      message.error(`出库失败[${error}]`);
    });
  }

  async checkPermission(path) {
    let hasPermission = await api.checkPermission(path);
    this.setState({hasPermission});
  }

  getPurchaseDetail(id) {
    api.ajax({
      url: api.warehouse.reject.detail(id),
    }, (data) => {
      let {detail} = data.res;

      this.setState({detail});

      if (String(detail.export_user_id) !== '0') {
        message.success('出库成功');
        clearInterval(this.interval);
        location.href = '/warehouse/purchase-reject/index';
      }
    }, (err) => {
      message.error(`出库失败[${err}]`);
      clearInterval(this.interval);
    });
  }

  render() {
    let {id, disabled} = this.props;
    let {hasPermission, detail} = this.state;
    let exportUserId = detail.export_user_id;

    const content = (
      <div className="center">
        <QRCode
          value={JSON.stringify({
            authType: 'reject_export',
            requestParams: {
              type: 'post',
              url: api.warehouse.reject.export(),
              data: {reject_id: id},
            },
          })}
          size={128}
          ref="qrCode"
        />
        <p>请扫码确认</p>
        <p>该采购单配件出库</p>
        <p>
          <Icon
            type="check-circle"
            className={(exportUserId && exportUserId !== '0') ? 'confirm-check' : 'hide'}
          />
        </p>
      </div>
    );

    return (
      hasPermission ?
        <Popconfirm
          placement="topRight"
          title="确定要出库吗"
          onConfirm={this.handleSubmit}
        >
          <Button type="primary" disabled={disabled}>出库</Button>
        </Popconfirm> :
        <Popover
          content={content}
          title=""
          trigger="click"
          visible={this.state.visible}
          onVisibleChange={this.handleAuthPrepare}
        >
          <Button type="primary" disabled={disabled}>审核出库</Button>
        </Popover>
    );
  }
}
