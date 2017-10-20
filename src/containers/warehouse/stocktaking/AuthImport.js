import React from 'react';
import { message, Modal, Icon, Row, Col, Button } from 'antd';

import BaseModal from '../../../components/base/BaseModal';
import QRCode from 'qrcode.react';

import api from '../../../middleware/api';
import path from '../../../config/path';

export default class AuthImport extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      hasPermission: false,
      detail: {},
    };

    this.showAuthModal = this.showAuthModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleImport = this.handleImport.bind(this);
  }

  static defaultProps = {
    size: 'small',
  };

  componentDidMount() {
    this.checkPermission(path.warehouse.stocktaking.import);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  showAuthModal() {
    const { id } = this.props;
    this.interval = setInterval(this.getStocktakingDetail.bind(this, id), 2000);
    this.showModal();
  }

  async checkPermission(path) {
    const hasPermission = await api.checkPermission(path);
    this.setState({ hasPermission });
  }

  handleCancel() {
    clearInterval(this.interval);
    this.hideModal();
  }

  handleImport() {
    const { id, remark } = this.props;
    const { hasPermission, detail } = this.state;

    if (!hasPermission && String(detail.authorize_user_id) === '0') {
      message.warning('还未授权，请先授权');
      return;
    }

    api.ajax({
      url: api.warehouse.stocktaking.import(),
      type: 'post',
      data: {
        stocktaking_id: id,
        remark,
      },
    }, () => {
      // 入库后
      location.href = '/warehouse/stocktaking/index';
      this.hideModal();
    });
  }

  getStocktakingDetail(id) {
    api.ajax({ url: api.warehouse.stocktaking.detail(id) }, data => {
      const { detail } = data.res;

      this.setState({ detail });

      if (detail.authorize_user_id.toString() !== '0') {
        clearInterval(this.interval);
      }
    });
  }

  render() {
    const { visible, hasPermission, detail } = this.state;
    const { id, type } = this.props;
    const authUserId = detail.authorize_user_id;

    return (
      <span>
        <Button
          type="danger"
          onClick={this.showAuthModal}
        >
          审核入库
        </Button>

        <Modal
          title={<span><Icon type="eye"/> 审核入库</span>}
          visible={visible}
          maskClosable={false}
          onCancel={this.handleCancel}
          onOk={this.handleImport}
        >
          <Row type="flex" align="middle">
            <Col span={12}>
              <div className="mb10">
                <span>盘盈数：</span>
                <span>{detail.panying_amount}</span>
              </div>
              <div className="mb10">
                <span>盘盈金额：</span>
                <span>{detail.panying_worth}</span>
              </div>
              <div className="mb10">
                <span>盘亏数：</span>
                <span>{detail.pankui_amount}</span>
              </div>
              <div className="mb10">
                <span>盘亏金额：</span>
                <span>{detail.pankui_worth}</span>
              </div>
              <div className="mb10">
                <span>盘前总值：</span>
                <span>{detail.panqian_worth}</span>
              </div>
              <div className="mb10">
                <span>盘后总值：</span>
                <span>{detail.panhou_worth}</span>
              </div>
            </Col>
            <Col span={12} className={hasPermission ? 'hide' : null}>
              <div className="center">
                <QRCode
                  value={JSON.stringify({
                    authType: type,
                    requestParams: {
                      type: 'post',
                      url: api.warehouse.stocktaking.auth(),
                      data: { stocktaking_id: id },
                    },
                  })}
                  size={128}
                  ref="qrCode"
                />
                <p>请扫码确认该盘点单入库</p>
                <p>入库后库存将调整</p>
                <p>
                  <Icon
                    type="check-circle"
                    className={(authUserId && authUserId !== '0') ? 'confirm-check' : 'hide'}
                  />
                </p>
              </div>
            </Col>
          </Row>
        </Modal>
      </span>
    );
  }
}
