import React from 'react';
import {Row, Col, Form, Input, Modal, Select, message, Button} from 'antd';

import api from '../../middleware/api';

import validator from '../../utils/validator';
import FormValidator from '../../utils/FormValidator';
import Layout from '../../utils/FormLayout';
import BaseModal from '../../components/base/BaseModal';

const FormItem = Form.Item;
const Option = Select.Option;

class InfoBasic extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    [
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return false;
      }
      api.ajax({
        url: values.chain_id ? api.overview.editChain() : api.overview.createChain(),
        type: 'POST',
        data: values,
      }, () => {
        values.chain_id ? message.success('编辑连锁成功') : message.success('创建连锁成功');
        this.props.onSuccess();
        this.hideModal();
      });
    });
  }

  render() {
    let {getFieldDecorator} = this.props.form;
    const {formItemLayout} = Layout;
    let {size} = this.props;
    let chainInfo = this.props.chainInfo || {};

    let footer = [
      <div>
        <Button key="btn2" type="primary" onClick={this.handleSubmit}>提交</Button>
        <Button key="btn3" type="ghost" onClick={this.hideModal}>取消</Button>
      </div>,
    ];

    return (
      <span>
          {
            size == 'small' ?
              <a href="javascript:;" onClick={this.showModal}>编辑</a> :
              <Button onClick={this.showModal}>创建连锁</Button>
          }
        <Modal
          title="详情信息"
          visible={this.state.visible}
          width="720px"
          onOk={this.showModal}
          onCancel={this.hideModal}
          footer={footer}
        >
          <Form>
             {getFieldDecorator('chain_id', {initialValue: chainInfo._id})(
               <Input type="hidden"/>
             )}
            <Row>
              <Col span={24}>
                <FormItem label="连锁名称" labelCol={{span: 3}} wrapperCol={{span: 17}}>
                  {getFieldDecorator('chain_name', {
                    initialValue: chainInfo.chain_name,
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
              <Col span={12}>
                <FormItem label="合作类型" {...formItemLayout}>
                  {getFieldDecorator('cooperation_type', {
                    initialValue: Number(chainInfo.cooperation_type) == 0 ? '未知' : chainInfo.cooperation_type,
                    rules: [{
                      required: true,
                      message: validator.required.notNull,
                    }, {validator: FormValidator.notNull}],
                    validateTrigger: 'onBlur',
                  })(
                    <Select onSelect={this.handleCityChange} placeholder="请选择">
                      <Option value="1">FC友情合作店</Option>
                      <Option value="2">MC重要合作店</Option>
                      <Option value="3">AP高级合伙店</Option>
                      <Option value="4">TP顶级合伙店</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="连锁负责人" {...formItemLayout}>
                  {getFieldDecorator('admin_name', {
                    initialValue: chainInfo.admin_name,
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

              <Col span={12}>
                <FormItem label="手机" {...formItemLayout}>
                  {getFieldDecorator('admin_phone', {
                    initialValue: chainInfo.admin_phone,
                    rules: FormValidator.getRulePhoneNumber(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="公司名称" {...formItemLayout}>
                  {getFieldDecorator('business_license_name', {
                    initialValue: chainInfo.business_license_name,
                  })(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label="工商注册号" {...formItemLayout}>
                  {getFieldDecorator('business_license', {
                    initialValue: chainInfo.business_license,
                  })(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
          </Modal>
        </span>
    );
  }
}

InfoBasic = Form.create()(InfoBasic);
export default InfoBasic;
