import React from 'react';
import { message, Modal, Icon, Form, Input, Radio, Select } from 'antd';

import BaseModal from '../../../components/base/BaseModal';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class Edit extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      detail: {},
      chains: [],
    };

    [
      'handleEdit',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleEdit() {
    this.getDetail(this.props.id);
    this.showModal();
    this.getChains();
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }

      api.ajax({
        url: api.admin.account.edit(),
        type: 'POST',
        data: values,
      }, () => {
        message.success('编辑成功');
        this.hideModal();
        this.props.onSuccess();
      }, error => {
        message.error(`编辑失败[${error}]`);
      });
    });
  }

  getChains() {
    api.ajax({ url: api.overview.getAllChains() }, data => {
      this.setState({ chains: data.res.list });
    });
  }

  getDetail(id) {
    api.ajax({ url: api.admin.account.detail(id) }, data => {
      this.setState({ detail: data.res.user_info });
    });
  }

  render() {
    const { formItemLayout, selectStyle } = Layout;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const { visible, detail, chains } = this.state;

    return (
      <span>
        <a href="javascript:" onClick={this.handleEdit}>编辑</a>

        <Modal
          title={<span><Icon type="plus"/> 编辑账号</span>}
          visible={visible}
          width={720}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
        >
          <Form>
            {getFieldDecorator('_id', { initialValue: detail._id })(<Input type="hidden"/>)}
            <FormItem label="姓名" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: detail.name,
                rules: FormValidator.getRuleNotNull(),
                validatorTrigger: 'onBlur',
              })(
                <Input placeholder="请输入姓名"/>
              )}
            </FormItem>

            <FormItem label="性别" {...formItemLayout}>
              {getFieldDecorator('gender', {
                initialValue: detail.gender || '1',
              })(
                <RadioGroup>
                  <Radio value="1">男</Radio>
                  <Radio value="0">女</Radio>
                </RadioGroup>
              )}
            </FormItem>

            <FormItem label="手机号" {...formItemLayout}>
              {getFieldDecorator('phone', {
                initialValue: detail.phone,
                rules: FormValidator.getRulePhoneNumber(),
                validatorTrigger: 'onBlur',
              })(
                <Input placeholder="请输入手机号"/>
              )}
            </FormItem>

            <FormItem label="账号类型" {...formItemLayout}>
              {getFieldDecorator('user_type', {
                initialValue: detail.user_type,
                rules: FormValidator.getRuleNotNull(),
                validatorTrigger: 'onBlur',
              })(
                <Select {...selectStyle} placeholder="请选择账号类型">
                  <Option value="1">连锁店管理员</Option>
                  <Option value="2">区域管理员</Option>
                  <Option value="3">总公司管理员</Option>
                </Select>
              )}
            </FormItem>

            {getFieldValue('user_type') === '1' && (
              <FormItem label="选择连锁" {...formItemLayout}>
                {getFieldDecorator('chain_id', {
                  initialValue: detail.chain_id,
                })(
                  <Select {...selectStyle} placeholder="请选择连锁店">
                    {chains.map(chain => <Option key={chain._id}>{chain.chain_name}</Option>)}
                  </Select>
                )}
              </FormItem>
            )}
          </Form>
        </Modal>
      </span>
    );
  }
}

Edit = Form.create()(Edit);
export default Edit;
