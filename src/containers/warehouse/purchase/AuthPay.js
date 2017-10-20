import React from 'react';
import { message, Modal, Icon, Row, Col, Form, Button, Select, Input } from 'antd';
import QRCode from 'qrcode.react';

import BaseModal from '../../../components/base/BaseModal';

import api from '../../../middleware/api';
import path from '../../../config/path';
import FormLayout from '../../../utils/FormLayout';

const FormItem = Form.Item;
const Option = Select.Option;

class AuthPay extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      hasPermission: false,
      detail: props.detail || {},
      unPayWorth: parseFloat(props.detail.unpay_worth),
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
    this.setState({
      detail,
      unPayWorth: parseFloat(detail.unpay_worth),
    });

    this.checkPermission(path.warehouse.purchase.pay);
    // this.interval = setInterval(this.getPurchaseDetail.bind(this, id), 2000);
    this.showModal();
  }

  handleCancel() {
    clearInterval(this.interval);
    this.hideModal();
  }

  handlePay(e) {
    e.preventDefault();
    const values = this.props.form.getFieldsValue();

    if (values.pay_worth > this.state.detail.unpay_worth) {
      message.warn('请检查输入金额');
      return false;
    }

    values.purchase_id = this.props.id;

    api.ajax({
      url: api.warehouse.purchase.pay(),
      type: 'post',
      data: values,
    }, () => {
      message.success('支付成功');
      setTimeout(() => {
        location.href = '/warehouse/purchase/index';
      }, 500);
    }, error => {
      message.error(error);
    });
  }

  async checkPermission(path) {
    const hasPermission = await api.checkPermission(path);
    if (hasPermission) {
      this.getPurchaseDetail(this.props.id);
    } else {
      this.interval = setInterval(this.getPurchaseDetail.bind(this, this.props.id), 2000);
    }
    this.setState({ hasPermission });
  }

  getPurchaseDetail(id) {
    api.ajax({ url: api.warehouse.purchase.detail(id) }, data => {
      const { detail } = data.res;

      this.setState({ detail });

      const payStatus = String(detail.pay_status);
      if (payStatus === '2' || (payStatus === '1' && parseFloat(detail.unpay_worth) !== this.state.unPayWorth)) {
        message.success('支付成功');
        clearInterval(this.interval);
        location.href = '/warehouse/purchase/index';
      }
    });
  }

  render() {
    const { formItemTwo, selectStyle } = FormLayout;
    const { visible, hasPermission, detail, unPayWorth } = this.state;
    const { id, disabled, form, size } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    const payStatus = String(detail.pay_status);

    return (
      <span>
        {size === 'small' ?
          <a href="javascript:;" onClick={this.handleShow}>结算</a> :
          <Button type="primary" onClick={this.handleShow} disabled={disabled}>结算</Button>
        }

        <Modal
          title={<span><Icon type="eye"/> 采购单结算</span>}
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
                <FormItem label="应付金额" {...formItemTwo}>
                  <p>{detail.unpay_worth}元</p>
                </FormItem>
                <FormItem label="实付金额" {...formItemTwo}>
                  {getFieldDecorator('pay_worth')(
                    <Input
                      type="number"
                      addonAfter="元"
                      placeholder="填写实付金额"
                    />
                  )}
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
              <div className={getFieldValue('pay_worth') ? 'center' : 'hide'}>
                <QRCode
                  value={JSON.stringify({
                    authType: 'purchase_pay',
                    requestParams: {
                      type: 'post',
                      url: api.warehouse.purchase.pay(),
                      data: {
                        purchase_id: id,
                        pay_worth: getFieldValue('pay_worth'),
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
                    className={payStatus === '2' || (payStatus === '1' && parseFloat(detail.unpay_worth) !== unPayWorth) ? 'confirm-check' : 'hide'}
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
