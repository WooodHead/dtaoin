import React, {Component} from 'react';
import {Row, Col, Form, Switch, Input, Button, message} from 'antd';
import className from 'classnames';

import api from '../../middleware/api';

import Layout from '../../utils/FormLayout';
import validator from '../../utils/validator';
import FormValidator from '../../utils/FormValidator';


const FormItem = Form.Item;

class InfoPos extends Component {
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

      values.is_pos_device = values.is_pos_device ? 1 : 0;

      api.ajax({
        url: api.overview.editPos(),
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
    let form = this.props.form;
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
              <FormItem label="启用POS机" {...formItemThree}>
                {getFieldDecorator('is_pos_device', {
                  valuePropName: 'checked',
                  initialValue: Number(companyInfo.is_pos_device) === 1,
                })(
                  <Switch checkedChildren={'启用'} unCheckedChildren={'停用'}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row className={!!form.getFieldValue('is_pos_device') ? '' : 'hide'}>
            <Col span={8}>
              <FormItem label="POS机ID" {...formItemThree}>
                {getFieldDecorator('pos_device_en', {
                  initialValue: companyInfo.pos_device_en,
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
              <FormItem label="启用POS机" {...formItemThree}>
                <span>{companyInfo.is_pos_device == 1 ? '启用' : '停用'}</span>
              </FormItem>
            </Col>
          </Row>

          <Row className={companyInfo.is_pos_device == 1 ? '' : 'hide'}>
            <Col span={8}>
              <FormItem label="POS机ID" {...formItemThree}>
                <span>{companyInfo.pos_device_en}</span>
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

InfoPos = Form.create()(InfoPos);
export default InfoPos;
