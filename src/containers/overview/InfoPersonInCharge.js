import React, {Component} from 'react';
import {Row, Col, Form, Input, Button, message} from 'antd';

import className from 'classnames';
import api from '../../middleware/api';

import Layout from '../../utils/FormLayout';
import validator from '../../utils/validator';
import FormValidator from '../../utils/FormValidator';

const FormItem = Form.Item;

class InfoPersonInCharge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: true,
    };

    [
      'handleIsEdit',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleIsEdit() {
    let {isEdit} = this.state;
    this.setState({
      isEdit: !isEdit,
    });
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return false;
      }
      api.ajax({
        url: api.overview.editContact(),
        type: 'POST',
        data: values,
      }, data => {
        message.success('编辑成功');
        this.handleIsEdit();
        this.props.onSuccess(data.res.company._id);
      });
    });
  }


  render() {
    let {getFieldDecorator} = this.props.form;
    const {formItemThree} = Layout;
    let companyInfo = this.props.companyInfo || {};
    let {isEdit} = this.state;

    const show = className({
      '': !isEdit,
      'hide': isEdit,
    });

    const inputShow = className({
      'hide': !isEdit,
      '': isEdit,
    });

    return (
      <div>
        <Form className={inputShow}>
          {getFieldDecorator('company_id', {initialValue: companyInfo._id})(
            <Input type="hidden"/>
          )}

          <Row>
            <Col span={8}>
              <FormItem label="运营负责人" {...formItemThree}>
                {getFieldDecorator('operation_name', {
                  initialValue: companyInfo.operation_name,
                  rules: [{
                    required: true,
                    message: validator.required.notNull,
                  }, {validator: FormValidator.notNull}],
                  validateTrigger: 'onBlur',
                })(
                  <Input placeholder="请输入"/>
                )}
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem label="手机" {...formItemThree}>
                {getFieldDecorator('operation_phone', {
                  initialValue: companyInfo.operation_phone,
                  rules: FormValidator.getRulePhoneNumber(),
                  validateTrigger: 'onBlur',
                })(
                  <Input placeholder="请输入"/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <FormItem label="商务联系人" {...formItemThree}>
                {getFieldDecorator('business_name', {
                  initialValue: companyInfo.business_name,
                })(
                  <Input placeholder="请输入"/>
                )}
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem label="手机" {...formItemThree}>
                {getFieldDecorator('business_phone', {
                  initialValue: companyInfo.business_phone,
                })(
                  <Input placeholder="请输入"/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={16}>
              <Col span={24} offset={4}>
                <div className="pull-left">
                  <Button type="primary" onClick={this.handleSubmit}>提交</Button>
                  <span className="ml10">
                  <Button type="dash" onClick={this.handleIsEdit}>取消编辑</Button>
                </span>
                </div>
              </Col>
            </Col>
          </Row>

        </Form>

        <Form className={show}>
          <Row>
            <Col span={8}>
              <FormItem label="运营负责人" {...formItemThree}>
                <span>{companyInfo.operation_name}</span>
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem label="手机" {...formItemThree}>
                <span>{companyInfo.operation_phone}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <FormItem label="商务联系人" {...formItemThree}>
                <span>{companyInfo.business_name}</span>
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem label="手机" {...formItemThree}>
                <span>{companyInfo.business_phone}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={16}>
              <Col span={24} offset={4}>
                <div className="pull-left">
                  <Button type="primary" onClick={this.handleIsEdit}>编辑</Button>
                </div>
              </Col>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

InfoPersonInCharge = Form.create()(InfoPersonInCharge);
export default InfoPersonInCharge;
