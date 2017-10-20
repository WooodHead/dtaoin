import React from 'react';
import { message, Form, Button, Row, Col, Select } from 'antd';

import FormValidator from '../../../utils/FormValidator';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';

const FormItem = Form.Item;
const Option = Select.Option;

class FormPay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      btnLoading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.payBillVisible) {
      this.setState({ btnLoading: false });
    }
  }

  onAccount(e) {
    e.preventDefault();
    this.props.payVisible();
  }

  onPay(e) {
    e.preventDefault();
    const { customerInfo } = this.props;
    const isPosDevice = api.getLoginUser().isPosDevice;

    const timer = isPosDevice == 0 ? 200 : 2000;


    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      this.setState({ btnLoading: true });

      const pay_type = values.pay_type;
      const formData = Number(isPosDevice) === 0 ? {
        order_id: customerInfo._id,
        customer_id: customerInfo.customer_id,
        pay_type,
      } :
      {
        order_id: customerInfo._id,
        customer_id: customerInfo.customer_id,
      };

      api.ajax({
        url: api.aftersales.partSellPayByPos(),
        type: 'POST',
        data: formData,
      }, () => {
        window.time = setInterval(() => {
          api.ajax({ url: api.aftersales.getPartSellDetail(customerInfo._id) }, data => {
            if (Number(data.res.detail.unpay_amount) === 0) {
              window.clearInterval(window.time);

              this.setState({ btnLoading: false });
              this.props.cancelModal();
              message.success('结算成功!');
              location.reload();
            }
          });
        }, Number(timer));
      }, err => {
        message.error(err);
        this.props.cancelModal();
      }
      )
      ;
    });
  }

  render() {
    const { formItemFour, buttonLayout } = Layout;
    const { customerInfo } = this.props;
    const { getFieldDecorator } = this.props.form;
    const isPosDevice = api.getLoginUser().isPosDevice;

    return (
      <Form>
        <div >
          <Row>
            <Col span={14}>
              <FormItem label="销售单号" {...formItemFour}>
                <p className="ant-form-text">{customerInfo._id}</p>
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem label="结算金额" {...formItemFour}>
                <p className="ant-form-text">
                  ¥<strong>{Number(customerInfo.total_amount).toFixed(2)}</strong>元</p>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={14}>
              <FormItem label="优惠金额" {...formItemFour}>
                <p className="ant-form-text">{Number(customerInfo.discount).toFixed(2)}</p>
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem label="应付金额" {...formItemFour}>
                <p className="ant-form-text">¥<strong>{Number(customerInfo.real_amount).toFixed(2)}</strong>元</p>
              </FormItem>
            </Col>
          </Row>

          <Row className={Number(isPosDevice) === 0 ? '' : 'hide'}>
            <Col span={14}>
              <FormItem label="支付方式" {...formItemFour}>
                {getFieldDecorator('pay_type', {
                  initialValue: '2',
                  rules: FormValidator.getRuleNotNull(),
                  validateTrigger: 'onBlur',
                })(
                  <Select>
                    <Option key="1">银行转账</Option>
                    <Option key="2">现金支付</Option>
                    <Option key="3">微信支付</Option>
                    <Option key="4">支付宝支付</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </div>

        <FormItem {...buttonLayout} className="mt15">
          <Button
            className="mr15"
            type="primary"
            onClick={this.onPay.bind(this)}
            loading={this.state.btnLoading}
          >
            结算
          </Button>
          <Button onClick={this.onAccount.bind(this)}>挂账</Button>
        </FormItem>
      </Form>
    );
  }
}

FormPay = Form.create()(FormPay);
export default FormPay;
