import React from 'react';
import { message, Form, Button, DatePicker, Input, Row, Col, Modal, Icon, Select } from 'antd';

import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import FormValidator from '../../../utils/FormValidator';

import BaseModal from '../../../components/base/BaseModal';
import DateFormatter from '../../../utils/DateFormatter';
import PrintArrears from './PrintArrears';

const FormItem = Form.Item;
const Option = Select.Option;

class FormRepayment extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      project: {},
      btnLoading: false,
      disabled: false,
      maintain_items: new Map(),
      maintain_parts: new Map(),
      auto: {},
    };

    [
      'paymentAmountChange',
      'getMaintainItemList',
      'getMaintainPartList',
      'getUserAuto',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { projectId } = this.props;
    this.getProjectDetail(projectId);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.repaymentVisible) {
      this.props.form.resetFields();
      this.setState({
        btnLoading: false,
      });
    }
  }

  getMaintainItemList(intention_id = '') {
    api.ajax({ url: api.aftersales.getItemListOfMaintProj(intention_id) }, data => {
      const maintain_items = new Map();
      for (let i = 0; i < data.res.list.length; i++) {
        maintain_items.set(data.res.list[i].item_id, data.res.list[i]);
      }
      this.setState({ maintain_items });
    });
  }

  getMaintainPartList(intention_id = '') {
    api.ajax({ url: api.aftersales.getPartListOfMaintProj(intention_id) }, data => {
      const maintain_parts = new Map();
      for (let i = 0; i < data.res.list.length; i++) {
        maintain_parts.set(data.res.list[i].part_type_id, data.res.list[i]);
      }
      this.setState({ maintain_parts });
    });
  }

  getUserAuto(customer_id, auto_id) {
    api.ajax({ url: api.auto.detail(customer_id, auto_id) }, data => {
      this.setState({ auto: data.res.detail });
    });
  }

  onAccountPrint(e) {
    e.preventDefault();
    const { customerId, projectId } = this.props;
    const isPosDevice = api.getLoginUser().isPosDevice;
    const timer = isPosDevice == 0 ? 200 : 2000;

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('表单内容错误,请检查');
        return;
      }

      const payAmount = values.paymentAmount;
      const nextPayDate = DateFormatter.day(values.repaymentTime);
      const arrears = values.arrears;

      if (Number(payAmount) > Number(this.state.project.unpay_amount)) {
        message.warning('还款金额不能大于挂账金额');
        return;
      }
      if (Number(payAmount) === 0) {
        message.error('还款金额不能为0');
        return;
      }

      const formData = Number(Number(isPosDevice) === 1) ? {
        _id: projectId,
        customer_id: customerId,
        next_pay_date: nextPayDate,
        pay_amount: payAmount,
      } : {
        _id: projectId,
        customer_id: customerId,
        next_pay_date: nextPayDate,
        pay_amount: payAmount,
        pay_type: values.pay_type,
      };

      this.setState({
        btnLoading: true,
      });

      this.getMaintainItemList(this.state.project._id);
      this.getMaintainPartList(this.state.project._id);
      this.getUserAuto(this.state.project.customer_id, this.state.project.auto_id);

      api.ajax({
        url: api.aftersales.payProjectOnRepayment(),
        type: 'POST',
        data: formData,
      }, () => {
        window.time = setInterval(() => {
          api.ajax({ url: api.aftersales.maintProjectByProjectId(projectId) }, data => {
            if (Number(data.res.intention_info.unpay_amount) === Number(arrears)) {
              window.clearInterval(window.time);
              this.setState({
                btnLoading: false,
                project: data.res.intention_info,
              });
              message.success('结算成功!');
              this.props.cancelModal();
              this.showModal();
              // location.reload();
            }
          });
        }, Number(timer));
      });
    });
  }

  onAccount(e) {
    e.preventDefault();
    const { customerId, projectId } = this.props;
    const isPosDevice = api.getLoginUser().isPosDevice;
    const timer = isPosDevice == 0 ? 200 : 2000;

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('表单内容错误,请检查');
        return;
      }

      const payAmount = values.paymentAmount;
      const nextPayDate = DateFormatter.day(values.repaymentTime);
      const arrears = values.arrears;

      if (Number(payAmount) > Number(this.state.project.unpay_amount)) {
        message.warning('还款金额不能大于挂账金额');
        return;
      }
      if (Number(payAmount) === 0) {
        message.error('还款金额不能为0');
        return;
      }

      const formData = Number(Number(isPosDevice) === 1) ? {
        _id: projectId,
        customer_id: customerId,
        next_pay_date: nextPayDate,
        pay_amount: payAmount,
      } : {
        _id: projectId,
        customer_id: customerId,
        next_pay_date: nextPayDate,
        pay_amount: payAmount,
        pay_type: values.pay_type,
      };

      this.setState({
        btnLoading: true,
      });

      api.ajax({
        url: api.aftersales.payProjectOnRepayment(),
        type: 'POST',
        data: formData,
      }, () => {
        window.time = setInterval(() => {
          api.ajax({ url: api.aftersales.maintProjectByProjectId(projectId) }, data => {
            if (Number(data.res.intention_info.unpay_amount) === Number(arrears)) {
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

  paymentAmountChange(e) {
    const paymentAmount = Number(e.target.value);
    if (paymentAmount > Number(this.state.project.unpay_amount)) {
      message.warning('还款金额不可大于挂账金额');
    }
    if (paymentAmount >= Number(this.state.project.unpay_amount)) {
      this.setState({
        disabled: true,
      });
    } else {
      this.setState({
        disabled: false,
      });
    }
  }

  hideModal() {
    this.setState({ visible: false });
    location.reload();
  }

  handleCancel() {
    this.props.cancelModal();
  }

  getProjectDetail(projectId) {
    api.ajax({ url: api.aftersales.maintProjectByProjectId(projectId) }, data => {
      this.setState({ project: data.res.intention_info });
    });
  }

  disabledStartDate(current) {
    return current && current.valueOf() < new Date(new Date().setDate(new Date().getDate() - 1));
  }

  render() {
    const { formItem8_15 } = Layout;
    const { project } = this.state;
    const { getFieldDecorator } = this.props.form;
    const isPosDevice = api.getLoginUser().isPosDevice;

    return (
      <Form>
        {getFieldDecorator('arrears', {
          initialValue: project.unpay_amount - this.props.form.getFieldValue('paymentAmount'),
        })(
          <Input type="hidden" />,
        )}

        <Row>
          <Col span={12}>
            <FormItem label="工单编号" {...formItem8_15}>
              <p className="ant-form-text">{project._id}</p>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="挂账金额" {...formItem8_15}>
              <p className="ant-form-text">¥<strong>{project.unpay_amount}</strong>元</p>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="还款金额" {...formItem8_15}>
              {getFieldDecorator('paymentAmount', {
                initialValue: 0,
                rules: [{ required: true, message: '请输入实付金额' }],
              })(
                <Input addonAfter="元" onChange={this.paymentAmountChange} />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="还款时间" {...formItem8_15}>
              {getFieldDecorator('repaymentTime', {
                initialValue: DateFormatter.getMomentDate(new Date(new Date().getFullYear(), new Date().getMonth() +
                  1, new Date().getDate())),
                rules: [{ required: true, message: '请输入还款时间' }],
              })(
                <DatePicker
                  disabled={this.state.disabled}
                  format={DateFormatter.pattern.day}
                  placeholder="请选择还款时间" allowClear={false}
                  disabledDate={this.disabledStartDate}
                />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row className={Number(isPosDevice) === 0 ? '' : 'hide'}>
          <Col span={12}>
            <FormItem label="支付方式" {...formItem8_15}>
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

        <div className="form-action-container">
          <Button
            type="primary"
            className="mr10"
            size="large"
            onClick={this.onAccount.bind(this)}
            loading={this.state.btnLoading}
          >
            结算
          </Button>

          <Button
            className="mr10"
            size="large"
            onClick={this.onAccountPrint.bind(this)}
            loading={this.state.btnLoading}
            disabled={this.state.disabled}
          >
            结算并打印挂账单
          </Button>

          <Modal
            title={<span><Icon type="eye-o" /> 挂账单预览</span>}
            visible={this.state.visible}
            width="980px"
            onCancel={this.hideModal}
            footer={null}
          >
            <PrintArrears
              project={this.state.project}
              customer={this.props.customer}
              materialFee={this.props.materialFee}
              timeFee={this.props.timeFee}
              auto={this.state.auto}
              items={this.state.maintain_items}
              parts={this.state.maintain_items}
              realTotalFee={this.props.realTotalFee}
            />
          </Modal>
        </div>
      </Form>
    );
  }
}

FormRepayment = Form.create()(FormRepayment);
export default FormRepayment;
