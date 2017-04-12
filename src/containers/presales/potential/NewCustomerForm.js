import React from 'react';
import {message, Row, Col, Form, Input, Button, Select} from 'antd';

import api from '../../../middleware/api';
import validator from '../../../utils/validator';
import Layout from '../../../utils/FormLayout';
import FormValidator from '../../../utils/FormValidator';

import UploadComponent from '../../../components/base/BaseUpload';

import CustomerSearchBox from '../../../components/search/CustomerSearchBox';

const FormItem = Form.Item;
const Option = Select.Option;

class NewCustomerForm extends UploadComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      isNew: false,
      customerId: '',
      customer: {},
      searchPhone: '',
    };

    [
      'handleNextStep',
      'handleSubmit',
      'handleSearchChange',
      'handleSearchSelect',
      'handleAdd',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSearchChange(key) {
    this.setState({searchPhone: key});
  }

  handleSearchSelect(customerId) {
    if (customerId) {
      api.ajax({url: api.customer.detail(customerId)}, data => {
        let {customer_info} = data.res;
        this.setState({
          isNew: false,
          customerId: customer_info._id,
          customer: customer_info,
        });
      });
    } else {
      this.setState({customer: {}});
    }
  }

  handleAdd() {
    this.setState({
      isNew: true,
      customerId: '',
      customer: {},
    });
  }

  handleNextStep(e) {
    e.preventDefault();
    this.handleSubmit(e, 'NEXT');
  }

  handleSubmit(e, action) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }

      this.setState({isFetching: true});
      api.ajax({
        url: this.state.isNew ? api.customer.add() : api.customer.edit(),
        type: 'POST',
        data: values,
      }, (data) => {
        message.success(this.state.isNew ? '添加成功!' : '修改成功!');
        this.setState({isNew: false, isFetching: false});
        if (action === 'NEXT') {
          this.props.updateState({
            customerId: data.res.customer_id,
            currentStep: this.props.nextStep,
            customerForm: 'hide',
            intentionForm: '',
          });
        } else {
          this.props.cancelModal();
          this.props.onSuccess();
        }
        this.props.form.resetFields();
      }, (err) => {
        message.error(`${this.state.isNew ? '添加!' : '修改!'}失败[${err}]`);
        this.setState({isFetching: false});
      });
    });
  }

  render() {
    const {formItem8_15} = Layout;
    const {getFieldDecorator} = this.props.form;

    let {isSingle} = this.props;
    let {isFetching, isNew, customerId, customer, searchPhone} = this.state;

    return (
      <Form>
        {getFieldDecorator('customer_id', {initialValue: customerId})(<Input type="hidden"/>)}
        {getFieldDecorator('phone', {initialValue: customer.phone || searchPhone})(<Input type="hidden"/>)}
        {getFieldDecorator('is_purchase', {initialValue: 1})(<Input type="hidden"/>)}

        <Row>
          <Col span={12}>
            <FormItem label="手机号" {...formItem8_15} required>
              <CustomerSearchBox
                value={customer.phone}
                onChange={this.handleSearchChange}
                onSelect={this.handleSearchSelect}
                onAdd={this.handleAdd}
                placeholder="请输入手机号"
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="姓名" {...formItem8_15}>
              {getFieldDecorator('name', {
                initialValue: customer.name,
                rules: FormValidator.getRuleNotNull(),
                validatorTrigger: 'onBlur',
              })(
                <Input addonAfter={
                  getFieldDecorator('gender', {initialValue: customer.gender || '-1'})(
                    <Select style={{width: 60}} disabled={!isNew}>
                      <Option value={'1'}>先生</Option>
                      <Option value={'0'}>女士</Option>
                      <Option value={'-1'}>未知</Option>
                    </Select>
                  )
                } placeholder="请输入姓名" disabled={!isNew}/>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="微信号" {...formItem8_15}>
              {getFieldDecorator('weixin', {initialValue: customer.weixin})(
                <Input placeholder="请输入微信号" disabled={!isNew}/>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="QQ" {...formItem8_15}>
              {getFieldDecorator('qq', {initialValue: customer.qq})(
                <Input type="number" placeholder="请输入QQ" disabled={!isNew}/>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="邮箱" {...formItem8_15}>
              {getFieldDecorator('mail', {
                rules: [{type: 'email', required: false, message: validator.text.email}],
                validateTrigger: 'onBlur',
              })(
                <Input type="email" placeholder="请输入邮箱" disabled={!isNew}/>
              )}
            </FormItem>
          </Col>
        </Row>

        <div className="form-line-divider"/>

        <Row>
          <Col span={12}>
            <FormItem label="身份证号" {...formItem8_15}>
              {getFieldDecorator('id_card_num', {
                initialValue: customer.id_card_num,
                rules: FormValidator.getRuleIDCard(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入身份证号"/>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="身份证地址" {...formItem8_15}>
              {getFieldDecorator('id_card_address', {initialValue: customer.id_card_address})(
                <Input placeholder="请输入身份证地址"/>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="驾驶证号" {...formItem8_15}>
              {getFieldDecorator('driver_license_num', {initialValue: customer.driver_license_num})(
                <Input placeholder="请输入驾驶证号"/>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="常住地址" {...formItem8_15}>
              {getFieldDecorator('address', {initialValue: customer.address})(
                <Input placeholder="请输入常住地址"/>
              )}
            </FormItem>
          </Col>
        </Row>

        <div className="form-action-container">
          <Button
            type="primary"
            size="large"
            className={isSingle ? 'hide' : 'mr10'}
            onClick={this.handleNextStep}
            loading={isFetching}
            disabled={isFetching}
          >
            下一步
          </Button>

          <Button
            type={isSingle ? 'primary' : 'ghost'}
            size="large"
            onClick={this.handleSubmit}
            loading={isFetching}
            disabled={isFetching}
          >
            保存并退出
          </Button>
        </div>
      </Form>
    );
  }
}

NewCustomerForm = Form.create()(NewCustomerForm);
export default NewCustomerForm;
