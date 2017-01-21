import React from 'react';
import {message, Modal, Icon, Row, Col, Form, Button, Select, Input} from 'antd';
import classNames from 'classnames';

import BaseModal from '../../../components/base/BaseModal';
import QRCode from 'qrcode.react';

import api from '../../../middleware/api';
import FormLayout from '../../../utils/FormLayout';

const FormItem = Form.Item;
const Option = Select.Option;

class AuthPay extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      detail: props.detail || {},
      unPayWorth: parseFloat(props.detail.unpay_worth),
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static defaultProps = {
    size: 'default',
  };

  handleShow() {
    let {id, detail} = this.props;
    if (String(detail.status) !== '1') {
      message.error('请先入库采购单，再结算');
      return;
    }
    this.interval = setInterval(this.getPurchaseDetail.bind(this, id), 2000);
    this.showModal();
  }

  handleCancel() {
    clearInterval(this.interval);
    this.hideModal();
  }

  getPurchaseDetail(id) {
    api.ajax({url: api.warehouse.purchase.detail(id)}, (data) => {
      let {detail} = data.res;

      this.setState({detail});

      let payStatus = String(detail.pay_status);
      if (payStatus === '2' || (payStatus === '1' && parseFloat(detail.unpay_worth) !== this.state.unPayWorth)) {
        message.success('结算成功');
        clearInterval(this.interval);
        location.href = '/warehouse/purchase/index';
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let {visible, detail, unPayWorth}=this.state;
    let {id, disabled, form, size}=this.props;
    let {getFieldDecorator, getFieldValue} = form;
    let {formItemTwo, selectStyle} = FormLayout;

    let payStatus = String(detail.pay_status);

    const codeClass = classNames({
      'code-cover': !getFieldValue('pay_worth'),
    });

    return (
      <span>
        {size === 'small' ?
          <a href="javascript:;" onClick={this.handleShow}>结算</a> :
          <Button type="primary" onClick={this.handleShow} disabled={disabled}>结算</Button>
        }

        <Modal
          title={<span><Icon type="eye"/> 进货单结算</span>}
          visible={visible}
          maskClosable={false}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Row type="flex" align="middle">
            <Col span={12}>
              <Form horizontal>
                <FormItem label="供应商" {...formItemTwo}>
                  <p>{detail.supplier_name}</p>
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
                  {getFieldDecorator('pay_type', {initialValue: '2'})(
                    <Select {...selectStyle}>
                      <Option key="2">现金支付</Option>
                      <Option key="5">银行转账</Option>
                    </Select>
                  )}
                </FormItem>
              </Form>
            </Col>

            <Col span={12}>
              <div className="center">
                <div className={codeClass}></div>
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
