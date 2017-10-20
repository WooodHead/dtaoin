import React from 'react';
import QRCode from 'qrcode.react';
import { message, Modal, Icon, Row, Col, Form, Button, Select } from 'antd';

import api from '../../../middleware/api';
import path from '../../../config/path';
import FormLayout from '../../../utils/FormLayout';

import BaseModal from '../../../components/base/BaseModal';

const FormItem = Form.Item;
const Option = Select.Option;

class AuthPay extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      detail: props.detail || {},
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handlePay = this.handlePay.bind(this);
  }

  static defaultProps = {
    size: 'default',
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleShow() {
    const { detail } = this.props;
    if (String(detail.status) !== '1') {
      message.error('请先入库采购单，再结算');
      return;
    }
    this.checkPermission(path.warehouse.purchaseReject.pay);
    // this.interval = setInterval(this.getRejectDetail.bind(this, id), 2000);
    this.showModal();
  }

  handleCancel() {
    clearInterval(this.interval);
    this.hideModal();
  }

  handlePay(e) {
    e.preventDefault();

    const values = this.props.form.getFieldsValue();
    values.reject_id = this.props.id;

    api.ajax({
      url: api.warehouse.reject.pay(),
      type: 'post',
      data: values,
    }, data => {
      const { detail } = data.res;

      const payStatus = String(detail.pay_status);
      if (payStatus === '2') {
        message.success('支付成功');
        setTimeout(() => {
          location.href = '/warehouse/purchase-reject/index';
        }, 500);
      }
    }, error => {
      message.error(error);
    });
  }

  async checkPermission(path) {
    const { id } = this.props;
    const hasPermission = await api.checkPermission(path);
    if (hasPermission) {
      this.getRejectDetail(id);
    } else {
      this.interval = setInterval(this.getRejectDetail.bind(this, id), 2000);
    }

    this.setState({ hasPermission });
  }

  getRejectDetail(id) {
    api.ajax({ url: api.warehouse.reject.detail(id) }, data => {
      const { detail } = data.res;

      this.setState({ detail });

      const payStatus = String(detail.pay_status);
      if (payStatus === '2') {
        message.success('支付成功');
        clearInterval(this.interval);
        location.href = '/warehouse/purchase-reject/index';
      }
    });
  }

  render() {
    const { formItemTwo, selectStyle } = FormLayout;
    const { id, disabled, form, size } = this.props;
    const { visible, hasPermission, detail } = this.state;
    const { getFieldDecorator, getFieldValue } = form;

    const payStatus = String(detail.pay_status);

    return (
      <span>
        {size === 'small' ?
          <a href="javascript:;" onClick={this.handleShow}>结算</a> :
          <Button type="primary" onClick={this.handleShow} disabled={disabled}>结算</Button>
        }

        <Modal
          title={<span><Icon type="eye"/> 退货单结算</span>}
          visible={visible}
          maskClosable={false}
          onCancel={this.handleCancel}
          footer={hasPermission ?
            <span>
              <Button size="large" className="mr5" onClick={this.handleCancel}>取消</Button>
              <Button size="large" type="primary" onClick={this.handlePay}>结算</Button>
            </span> :
            null}
        >
          <Row type="flex" align="middle">
            <Col span={12}>
              <Form>
                <FormItem label="供应商" {...formItemTwo}>
                  <p>{detail.supplier_company}</p>
                </FormItem>
                <FormItem label="退货金额" {...formItemTwo}>
                  <p>{detail.old_worth}元</p>
                </FormItem>
                <FormItem label="退款金额" {...formItemTwo}>
                  <p>{detail.new_worth}元</p>
                </FormItem>
                <FormItem label="退款差价" {...formItemTwo}>
                  <p>{detail.diff_worth}元</p>
                </FormItem>
                <FormItem label="支付方式" {...formItemTwo}>
                  {getFieldDecorator('pay_type', { initialValue: '2' })(
                    <Select {...selectStyle}>
                      <Option key="1">银行转账</Option>
                      <Option key="2">现金支付</Option>
                    </Select>
                  )}
                </FormItem>
              </Form>
            </Col>

            <Col span={12} className={hasPermission ? 'hide' : null}>
              <div className="center">
                <QRCode
                  value={JSON.stringify({
                    authType: 'reject_pay',
                    requestParams: {
                      type: 'post',
                      url: api.warehouse.reject.pay(),
                      data: {
                        reject_id: id,
                        pay_type: getFieldValue('pay_type'),
                      },
                    },
                  })}
                  size={128}
                  ref="qrCode"
                />
                <p>请扫码确认支付</p>
                <p>
                  <Icon
                    type="check-circle"
                    className={payStatus === '2' ? 'confirm-check' : 'hide'}
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

AuthPay = Form.create()(AuthPay);
export default AuthPay;
