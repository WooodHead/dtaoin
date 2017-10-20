import React from 'react';
import { message, Modal, Icon, Button, Form, Input, Radio, Select } from 'antd';

import BaseModal from '../../../components/base/BaseModal';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class New extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      chains: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserTypeChange = this.handleUserTypeChange.bind(this);
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }

      api.ajax({
        url: api.admin.account.add(),
        type: 'POST',
        data: values,
      }, () => {
        this.hideModal();
        this.props.onSuccess();
      });
    });
  }

  handleUserTypeChange(userType) {
    const { chains } = this.state;
    if (chains.length === 0 && userType === '1') {
      this.getChains();
    }
  }

  getChains() {
    api.ajax({ url: api.overview.getAllChains() }, data => {
      this.setState({ chains: data.res.list });
    });
  }

  render() {
    const { formItemLayout, selectStyle } = Layout;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { visible, chains } = this.state;

    return (
      <span>
        <Button type="primary" onClick={this.showModal}>创建账号</Button>

        <Modal
          title={<span><Icon type="plus"/> 管理账号</span>}
          visible={visible}
          width={720}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
        >
          <Form>
            <FormItem label="姓名" {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: FormValidator.getRuleNotNull(),
                validatorTrigger: 'onBlur',
              })(
                <Input placeholder="请输入姓名"/>
              )}
            </FormItem>

            <FormItem label="性别" {...formItemLayout}>
              {getFieldDecorator('gender', {
                initialValue: '1',
              })(
                <RadioGroup>
                  <Radio value="1">男</Radio>
                  <Radio value="0">女</Radio>
                </RadioGroup>
              )}
            </FormItem>

            <FormItem label="手机号" {...formItemLayout}>
              {getFieldDecorator('phone', {
                rules: FormValidator.getRulePhoneNumber(),
                validatorTrigger: 'onBlur',
              })(
                <Input placeholder="请输入手机号"/>
              )}
            </FormItem>

            <FormItem label="账号类型" {...formItemLayout}>
              {getFieldDecorator('user_type', {
                initialValue: '3',
                rules: FormValidator.getRuleNotNull(),
                validatorTrigger: 'onBlur',
                onChange: this.handleUserTypeChange,
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
                {getFieldDecorator('chain_id')(
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

New = Form.create()(New);
export default New;
