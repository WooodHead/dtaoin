import React, {Component} from 'react';
import {Row, Col, Form, Input, Button, message} from 'antd';

import api from '../../middleware/api';
import className from 'classnames';

import Layout from '../../utils/FormLayout';
import validator from '../../utils/validator';
import FormValidator from '../../utils/FormValidator';

const FormItem = Form.Item;

class InfoBank extends Component {
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
        url: api.overview.editBank(),
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
              <FormItem label="开户银行" {...formItemThree}>
                {getFieldDecorator('bank_name', {
                  initialValue: companyInfo.bank_name,
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
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="收款人户名" {...formItemThree}>
                {getFieldDecorator('bank_account_name', {
                  initialValue: companyInfo.bank_account_name,
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
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="银行账号" {...formItemThree}>
                {getFieldDecorator('bank_account_number', {
                  initialValue: companyInfo.bank_account_number,
                  rules: [{
                    required: true,
                    message: validator.required.notNull,
                  }, {validator: FormValidator.notNull}],
                  validateTrigger: 'onBlur',
                })(
                  <Input placeholder="请输入门店名称"/>
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
              <FormItem label="开户银行" {...formItemThree}>
                <span>{companyInfo.bank_name}</span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="收款人户名" {...formItemThree}>
                <span>{companyInfo.bank_account_name}</span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="银行账号" {...formItemThree}>
                <span>{companyInfo.bank_account_number}</span>
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

InfoBank = Form.create()(InfoBank);
export default InfoBank;
