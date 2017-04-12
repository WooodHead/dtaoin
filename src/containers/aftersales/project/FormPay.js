import React from 'react';
import {message, Form, Button, Row, Col, Select} from 'antd';

import FormValidator from '../../../utils/FormValidator';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';

const FormItem = Form.Item;
const Option = Select.Option;

class FormPay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {project: {}, btnLoading: false};
  }

  componentDidMount() {
    let {projectId} = this.props;
    // TODO 已经通过props传过来了，为何还要取一次数据？
    this.getProjectDetail(projectId);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.settlementLossesVisible) {
      this.setState({
        btnLoading: false,
      });
    }
  }

  onAccount(e) {
    e.preventDefault();
    this.props.payVisible();
  }

  onPay(e) {
    e.preventDefault();
    let {customerId, projectId} = this.props;
    const isPosDevice = api.getLoginUser().isPosDevice;

    let timer = isPosDevice == 0 ? 200 : 2000;

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      this.setState({
        btnLoading: true,
      });

      let pay_type = values.pay_type;
      let formData = Number(isPosDevice) === 0 ? {
          _id: projectId,
          customer_id: customerId,
          pay_type: pay_type,
        } :
        {
          _id: projectId,
          customer_id: customerId,
        };

      api.ajax({
          url: api.aftersales.payProjectByPOS(),
          type: 'POST',
          data: formData,
        }, () => {
          window.time = setInterval(() => {
            api.ajax({url: api.aftersales.maintProjectByProjectId(projectId)}, function (data) {
              if (Number(data.res.intention_info.unpay_amount) === 0) {
                window.clearInterval(window.time);
                this.setState({
                  btnLoading: false,
                });
                message.success('结算成功!');
                this.props.cancelModal();
                location.reload();
              }
            }.bind(this));
          }, Number(timer));
        }, (err) => {
          message.error(err);
          this.props.cancelModal();
        }
      );
    });
  }

  handleCancel() {
    this.props.cancelModal();
  }

  getProjectDetail(projectId) {
    api.ajax({url: api.aftersales.maintProjectByProjectId(projectId)}, function (data) {
      this.setState({project: data.res.intention_info});
    }.bind(this));
  }

  render() {
    const {formItem8_15} = Layout;
    const {project} = this.state;
    const isPosDevice = api.getLoginUser().isPosDevice;
    const {getFieldDecorator} = this.props.form;

    return (
      <Form>
        <Row>
          <Col span={12}>
            <FormItem label="工单编号" {...formItem8_15}>
              <p className="ant-form-text">{project._id}</p>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="结算金额" {...formItem8_15}>
              <p className="ant-form-text">
                ¥<strong>{(Number(project.time_fee) + Number(project.material_fee_in)).toFixed(2)}</strong>元</p>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="优惠金额" {...formItem8_15}>
              <p className="ant-form-text">{Number(project.discount).toFixed(2)}</p>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="应付金额" {...formItem8_15}>
              <p className="ant-form-text">¥<strong>{Number(project.total_fee).toFixed(2)}</strong>元</p>
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
          <Button type="primary" size="large" onClick={this.onPay.bind(this)} loading={this.state.btnLoading}>结算</Button>
          <Button onClick={this.onAccount.bind(this)} className="ml10" size="large">挂账</Button>
        </div>
      </Form>
    );
  }
}

FormPay = Form.create()(FormPay);
export default FormPay;
