import React from 'react';
import { message, Form, Button, DatePicker, Input, Row, Col, Modal, Icon, Select } from 'antd';
import Layout from '../../../utils/FormLayout';

import FormValidator from '../../../utils/FormValidator';
import api from '../../../middleware/api';

import BaseModal from '../../../components/base/BaseModal';
import DateFormatter from '../../../utils/DateFormatter';

import PrintArrears from './PrintArrears';
import NumberInput from '../../../components/widget/NumberInput';

const FormItem = Form.Item;
const Option = Select.Option;

class FormRepayment extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      customerInfo: props.customerInfo,
      btnLoading: false,
      disable: false,
    };

    [
      'paymentAmountChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.repaymentVisible) {
      this.props.form.resetFields();
      this.setState({ btnLoading: false });
    }

    this.setState({ customerInfo: nextProps.customerInfo });
  }

  onAccountPrint(e) {
    e.preventDefault();
    const { customerInfo } = this.state;
    const isPosDevice = api.getLoginUser().isPosDevice;
    const timer = isPosDevice == 0 ? 200 : 2000;

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('表单内容错误,请检查');
        return;
      }

      const arrears = values.arrears;

      values.order_id = customerInfo._id;
      values.customer_id = customerInfo.customer_id;
      values.next_pay_date = DateFormatter.day(values.next_pay_date);

      if (Number(values.pay_amount) > Number(customerInfo.unpay_amount)) {
        message.warning('还款金额不能大于挂账金额');
        return false;
      }
      if (Number(values.pay_amount) === 0) {
        message.error('还款金额不能为0');
        return false;
      }

      if (Number(isPosDevice) === 1) {
        delete values.pay_type;
      }

      this.setState({
        btnLoading: true,
      });

      api.ajax({
        url: api.aftersales.partSellPayBack(),
        type: 'POST',
        data: values,
      }, () => {
        window.time = setInterval(() => {
          api.ajax({ url: api.aftersales.getPartSellDetail(customerInfo._id) }, data => {
            if (Number(data.res.detail.unpay_amount) === Number(arrears)) {
              window.clearInterval(window.time);
              this.setState({
                btnLoading: false,
              });
              message.success('结算成功!');
              this.props.getPartSellDetail(customerInfo._id);
              this.showModal();
            }
          });
        }, Number(timer));
      });
    });
  }

  onAccount(e) {
    e.preventDefault();
    const { customerInfo } = this.state;
    const isPosDevice = api.getLoginUser().isPosDevice;
    const timer = isPosDevice == 0 ? 200 : 2000;

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('表单内容错误,请检查');
        return;
      }

      const arrears = values.arrears;

      values.order_id = customerInfo._id;
      values.customer_id = customerInfo.customer_id;
      values.next_pay_date = DateFormatter.day(values.next_pay_date);

      if (Number(values.pay_amount) > Number(customerInfo.unpay_amount)) {
        message.warning('还款金额不能大于挂账金额');
        return;
      }
      if (Number(values.pay_amount) === 0) {
        message.error('还款金额不能为0');
        return;
      }

      if (Number(isPosDevice) === 1) {
        delete values.pay_type;
      }

      this.setState({
        btnLoading: true,
      });

      api.ajax({
        url: api.aftersales.partSellPayBack(),
        type: 'POST',
        data: values,
      }, () => {
        window.time = setInterval(() => {
          api.ajax({ url: api.aftersales.getPartSellDetail(customerInfo._id) }, data => {
            if (Number(data.res.detail.unpay_amount) === Number(arrears)) {
              window.clearInterval(window.time);
              this.setState({
                btnLoading: false,
              });
              message.success('结算成功!');
              this.props.cancelModal();
              location.reload();
            }
          });
        }, Number(timer));
      });
    });
  }

  paymentAmountChange(value) {
    const { customerInfo } = this.state;
    const paymentAmount = Number(value);

    if (paymentAmount > Number(customerInfo.unpay_amount)) {
      message.error('还款金额不可大于挂账金额');
      return false;
    }

    this.setState({
      disabled: paymentAmount >= Number(customerInfo.unpay_amount),
    });
    return true;
  }

  hideModal() {
    this.setState({ visible: false });
    location.reload();
  }

  handleCancel() {
    this.props.cancelModal();
  }

  disabledStartDate(current) {
    return current && current.valueOf() < new Date(new Date().setDate(new Date().getDate() - 1));
  }

  render() {
    const { formItemFour, buttonLayout } = Layout;
    const { partsDetail } = this.props;
    const { customerInfo } = this.state;
    const { getFieldDecorator } = this.props.form;
    const isPosDevice = api.getLoginUser().isPosDevice;

    return (
      <Form>
        {getFieldDecorator('arrears', {
          initialValue: Number(customerInfo.unpay_amount -
            this.props.form.getFieldValue('pay_amount')),
        })(
          <Input type="hidden" />,
        )}

        <Row>
          <Col span={10}>
            <FormItem label="销售单号" {...formItemFour}>
              <p className="ant-form-text">{customerInfo._id}</p>
            </FormItem>
          </Col>
          <Col span={14}>
            <FormItem label="挂账金额" {...formItemFour}>
              <p className="ant-form-text">¥<strong>{customerInfo.unpay_amount}</strong>元</p>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={10}>
            <NumberInput
              defaultValue="0"
              id="pay_amount"
              rules={[{ required: true, message: '请输入实付金额' }]}
              onChange={this.paymentAmountChange}
              self={this}
              layout={formItemFour}
              label="还款金额"
            />
          </Col>
          <Col span={14}>
            <FormItem label="还款时间" {...formItemFour}>
              {getFieldDecorator('next_pay_date', {
                initialValue: DateFormatter.getMomentDate(new Date(new Date().getFullYear(), new Date().getMonth() +
                  1, new Date().getDate())),
                rules: [{ required: true, message: '请输入还款时间' }],
              })(
                <DatePicker
                  disabled={this.state.disabled}
                  format={DateFormatter.pattern.day} placeholder="请选择还款时间"
                  allowClear={false}
                  disabledDate={this.disabledStartDate}
                />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row className={Number(isPosDevice) === 0 ? '' : 'hide'}>
          <Col span={10}>
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
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>

        <FormItem {...buttonLayout} className="mt15">
          <Button
            type="primary"
            className="mr15"
            onClick={this.onAccount.bind(this)}
            loading={this.state.btnLoading}>结算
          </Button>

          <Button
            className="mr15"
            onClick={this.onAccountPrint.bind(this)}
            loading={this.state.btnLoading}
            disabled={this.state.disabled}
          >
            结算并打印挂账单
          </Button>

          <Modal
            title={<span><Icon type="plus" />挂账单预览</span>}
            visible={this.state.visible}
            width="960px"
            onCancel={this.hideModal}
            footer={null}
          >
            <PrintArrears
              customerInfo={customerInfo}
              partsDetail={partsDetail}
            />
          </Modal>
        </FormItem>
      </Form>
    );
  }
}

FormRepayment = Form.create()(FormRepayment);
export default FormRepayment;
