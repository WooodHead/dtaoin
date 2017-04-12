import React from 'react';
import {message, Form, Button, DatePicker, Input, Row, Col, Modal, Icon, Select} from 'antd';

import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';
import FormValidator from '../../../utils/FormValidator';

import BaseModal from '../../../components/base/BaseModal';
import PrintArrears from './PrintArrears';

const FormItem = Form.Item;
const Option = Select.Option;

class FormBill extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      project: {},
      btnLoading: false,
      maintain_items: new Map(),
      maintain_parts: new Map(),
      auto: {},
    };
    [
      'getMaintainItemList',
      'getMaintainPartList',
      'getUserAuto',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    let {projectId} = this.props;
    this.getProjectDetail(projectId);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.settlementLossesVisible) {
      this.props.form.resetFields();
      this.setState({
        btnLoading: false,
      });
    }
  }

  getMaintainItemList(intention_id = '') {
    api.ajax({url: api.aftersales.getItemListOfMaintProj(intention_id)}, (data) => {

      let maintain_items = new Map();
      for (let i = 0; i < data.res.list.length; i++) {
        maintain_items.set(data.res.list[i].item_id, data.res.list[i]);
      }
      this.setState({maintain_items: maintain_items});
    });
  }

  getMaintainPartList(intention_id = '') {
    api.ajax({url: api.aftersales.getPartListOfMaintProj(intention_id)}, (data) => {
      let maintain_parts = new Map();
      for (let i = 0; i < data.res.list.length; i++) {
        maintain_parts.set(data.res.list[i].part_type_id, data.res.list[i]);
      }
      this.setState({maintain_parts: maintain_parts});
    });
  }

  getUserAuto(customer_id, auto_id) {
    api.ajax({url: api.auto.detail(customer_id, auto_id)}, (data) => {
      this.setState({auto: data.res.detail});
    });
  }

  onAccountPrint(e) {
    e.preventDefault();
    let {customerId, projectId} = this.props;
    const isPosDevice = api.getLoginUser().isPosDevice;
    let timer = isPosDevice == 0 ? 200 : 2000;

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('表单内容错误,请检查');
        return;
      }
      let payAmount = values.actualPaymentAmount;
      let idCardNum = values.idNumber;
      let nextPayDate = DateFormatter.day(values.repaymentTime);
      let arrears = values.arrears;

      let formData = Number(Number(isPosDevice) === 1) ?
        {
          _id: projectId,
          customer_id: customerId,
          next_pay_date: nextPayDate,
          pay_amount: payAmount,
          id_card_num: idCardNum,
        } :
        {
          _id: projectId,
          customer_id: customerId,
          next_pay_date: nextPayDate,
          pay_amount: payAmount,
          id_card_num: idCardNum,
          pay_type: values.pay_type,
        };

      this.setState({
        btnLoading: true,
      });

      this.getMaintainItemList(this.state.project._id);
      this.getMaintainPartList(this.state.project._id);
      this.getUserAuto(this.state.project.customer_id, this.state.project.auto_id);

      api.ajax({
        url: api.aftersales.payProjectOnAccount(),
        type: 'POST',
        data: formData,
      }, function () {
        let time = setInterval(() => {
          api.ajax({url: api.aftersales.maintProjectByProjectId(projectId)}, function (data) {
            if (Number(data.res.intention_info.unpay_amount) === Number(arrears)) {
              window.clearInterval(time);
              this.setState({
                btnLoading: false,
                project: data.res.intention_info,
              });
              message.success('结算成功!');
              this.props.cancelModal();
              this.showModal();
            }
          }.bind(this));
        }, Number(timer));
      }.bind(this));
    });
  }

  onAccount(e) {
    e.preventDefault();
    let {customerId, projectId} = this.props;
    const isPosDevice = api.getLoginUser().isPosDevice;
    let timer = isPosDevice == 0 ? 200 : 2000;

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('表单内容错误,请检查');
        return;
      }

      let payAmount = values.actualPaymentAmount;
      let idCardNum = values.idNumber;
      let nextPayDate = DateFormatter.day(values.repaymentTime);
      let arrears = values.arrears;

      let formData = Number(Number(isPosDevice) === 1) ?
        {
          _id: projectId,
          customer_id: customerId,
          next_pay_date: nextPayDate,
          pay_amount: payAmount,
          id_card_num: idCardNum,
        } :
        {
          _id: projectId,
          customer_id: customerId,
          next_pay_date: nextPayDate,
          pay_amount: payAmount,
          id_card_num: idCardNum,
          pay_type: values.pay_type,
        };

      this.setState({
        btnLoading: true,
      });

      api.ajax({
        url: api.aftersales.payProjectOnAccount(),
        type: 'POST',
        data: formData,
      }, function () {
        window.time = setInterval(() => {
          api.ajax({url: api.aftersales.maintProjectByProjectId(projectId)}, function (data) {
              if (Number(data.res.intention_info.unpay_amount) === Number(arrears)) {
                window.clearInterval(window.time);
                this.setState({
                  btnLoading: false,
                });
                message.success('结算成功!');
                this.props.cancelModal();
                location.reload();
              }
            }.bind(this)
          );
        }, Number(timer));
      }.bind(this), (err) => {
        message.error(err);
        this.props.cancelModal();
      });
    });


  }

  handleCancel() {
    this.props.cancelModal();
  }

  hideModal() {
    this.setState({visible: false});
    location.reload();
  }

  getProjectDetail(projectId) {
    api.ajax({url: api.aftersales.maintProjectByProjectId(projectId)}, function (data) {
      this.setState({project: data.res.intention_info});
    }.bind(this));
  }

  render() {
    const {formItem8_15} = Layout;
    const {project} = this.state;
    const {getFieldDecorator} = this.props.form;
    const isPosDevice = api.getLoginUser().isPosDevice;

    return (
      <Form>
        <Row>
          <Col span={12}>
            <FormItem label="工单编号" {...formItem8_15}>
              <p className="ant-form-text">{project._id}</p>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="应付金额" {...formItem8_15}>
              <p className="ant-form-text">¥<strong>{project.total_fee}</strong>元</p>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="实付金额" {...formItem8_15}>
              {getFieldDecorator('actualPaymentAmount', {
                initialValue: 0,
                rules: [{required: true, message: '请输入实付金额'}],
              })(
                <Input addonAfter="元"/>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="身份证号" {...formItem8_15}>
              {getFieldDecorator('idNumber', {
                initialValue: '',
              })(
                <Input />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="挂账金额" {...formItem8_15}>
              {getFieldDecorator('arrears', {initialValue: project.total_fee - this.props.form.getFieldValue('actualPaymentAmount')})(
                <p
                  className="ant-form-text">{Number(project.total_fee - this.props.form.getFieldValue('actualPaymentAmount')).toFixed(2)}元</p>
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="还款时间" {...formItem8_15}>
              {getFieldDecorator('repaymentTime', {
                initialValue: DateFormatter.getMomentDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())),
                rules: [{required: true, message: '请输入还款时间'}],
              })(
                <DatePicker format={DateFormatter.pattern.day} placeholder="请选择还款时间" allowClear={false}/>
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
                </Select>
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
          >
            结算并打印挂账单
          </Button>

          <Modal
            title={<span><Icon type="plus"/>挂账单预览</span>}
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
              parts={this.state.maintain_parts}
              realTotalFee={this.props.realTotalFee}
            />
          </Modal>
        </div>
      </Form>
    );
  }
}

FormBill = Form.create()(FormBill);
export default FormBill;
