import React from 'react';
import { message, Form, Button, DatePicker, Input, Row, Col, Modal, Icon, Select } from 'antd';

import Layout from '../../../utils/FormLayout';
import DateFormatter from '../../../utils/DateFormatter';
import FormValidator from '../../../utils/FormValidator';
import validator from '../../../utils/validator';
import api from '../../../middleware/api';

import BaseModal from '../../../components/base/BaseModal';
import NumberInput from '../../../components/widget/NumberInput';

import PrintArrears from './PrintArrears';

const FormItem = Form.Item;
const Option = Select.Option;

class FormBill extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      btnLoading: false,
      customerInfo: props.customerInfo,
    };
    [
      'handleRealAmountChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.payBillVisible) {
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

      if (Number(values.pay_amount) > this.state.customerInfo.real_amount) {
        message.error('实付金额不能大于应付金额');
        return false;
      }

      if (Number(values.pay_amount) < 0) {
        message.error('实付金额不能为负数');
        return false;
      }

      if (Number(isPosDevice) === 1) {
        delete values.pay_type;
      }

      this.setState({
        btnLoading: true,
      });

      const arrears = values.arrears;

      values.order_id = customerInfo._id;
      values.customer_id = customerInfo.customer_id;
      values.next_pay_date = DateFormatter.day(values.next_pay_date);

      api.ajax({
        url: api.aftersales.partSellPayOnAccount(),
        type: 'POST',
        data: values,
      }, () => {
        window.time = setInterval(() => {
          api.ajax({ url: api.aftersales.getPartSellDetail(customerInfo._id) }, data => {
            if (Number(data.res.detail.unpay_amount) === Number(arrears)) {
              window.clearInterval(window.time);
              this.setState({
                btnLoading: false,
                customerInfo: data.res.detail,
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
        return false;
      }

      if (Number(values.pay_amount) > this.state.customerInfo.real_amount) {
        message.error('实付金额不能大于应付金额');
        return false;
      }

      if (Number(values.pay_amount) < 0) {
        message.error('实付金额不能为负数');
        return false;
      }

      if (Number(isPosDevice) === 1) {
        delete values.pay_type;
      }

      this.setState({
        btnLoading: true,
      });

      const arrears = values.arrears;

      values.order_id = customerInfo._id;
      values.customer_id = customerInfo.customer_id;
      values.next_pay_date = DateFormatter.day(values.next_pay_date);

      api.ajax({
        url: api.aftersales.partSellPayOnAccount(),
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
      }, err => {
        message.error(err);
        this.props.cancelModal();
      });
    });
  }

  handleRealAmountChange(value) {
    if (Number(value) > Number(this.state.customerInfo.real_amount)) {
      message.error('实付金额不能大于应付金额');
      return false;
    }
    return true;
  }

  handleCancel() {
    this.props.cancelModal();
  }

  hideModal() {
    this.setState({ visible: false });
    location.reload();
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
        <Row>
          <Col span={10}>
            <FormItem label="销售单号" {...formItemFour}>
              <p className="ant-form-text">{customerInfo._id}</p>
            </FormItem>
          </Col>
          <Col span={14}>
            <FormItem label="应付金额" {...formItemFour}>
              <p className="ant-form-text">¥<strong>{Number(customerInfo.real_amount).
                toFixed(2)}</strong>元</p>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={10}>
            <NumberInput
              defaultValue="0"
              id="pay_amount"
              rules={[{ required: true, message: '请输入实付金额' }]}
              onChange={this.handleRealAmountChange}
              self={this}
              layout={formItemFour}
              label="实付金额"
            />
          </Col>
          <Col span={14}>
            <FormItem label="身份证号" {...formItemFour}>
              {getFieldDecorator('id_card_num', {
                rules: [
                  {
                    required: false,
                    message: validator.required.idCard,
                  }, { validator: FormValidator.validateIdCard }],
                validateTrigger: 'onBlur',
              })(
                <Input />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <FormItem label="挂账金额" {...formItemFour}>
              {getFieldDecorator('arrears', {
                initialValue: Number(customerInfo.real_amount -
                  (this.props.form.getFieldValue('pay_amount') || 0)).toFixed(2),
              })(
                <p
                  className="ant-form-text">{Number(customerInfo.real_amount -
                  (this.props.form.getFieldValue('pay_amount') || 0)).toFixed(2)}
                </p>,
              )}
            </FormItem>
          </Col>

          <Col span={14}>
            <FormItem label="还款时间" {...formItemFour}>
              {getFieldDecorator('next_pay_date', {
                initialValue: DateFormatter.getMomentDate(new Date(new Date().getFullYear(), new Date().getMonth() +
                  1, new Date().getDate())),
                rules: [{ required: true, message: '请输入还款时间' }],
              })(
                <DatePicker
                  format={DateFormatter.pattern.day}
                  placeholder="请选择还款时间"
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
            type="primary" className="mr15"
            onClick={this.onAccount.bind(this)}
            loading={this.state.btnLoading}
          >
            结算
          </Button>

          <Button
            className="mr15" onClick={this.onAccountPrint.bind(this)}
            loading={this.state.btnLoading}
          >
            结算并打印挂账单
          </Button>

          <Modal
            title={<span><Icon type="plus" />挂账单预览</span>}
            visible={this.state.visible}
            width="960px"
            onCancel={this.hideModal}
            footer={null}>
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

FormBill = Form.create()(FormBill);
export default FormBill;
