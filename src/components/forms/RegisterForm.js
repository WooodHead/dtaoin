import React, {Component} from 'react'
import {message, Form, Input, Button} from 'antd'
import api from '../../middleware/api'

const FormItem = Form.Item;

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code_id: ''
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    let phone = this.props.form.getFieldValue('phone'),
      code = this.props.form.getFieldValue('code'),
      name = this.props.form.getFieldValue('name');
    if (!phone) {
      message.error('请输入电话号码');
      return false;
    }
    if (!code) {
      message.error('请输入验证码');
      return false;
    }
    if (!name) {
      message.error('请输入姓名');
      return false;
    }

    api.ajax({
      url: api.register(),
      type: 'POST',
      data: this.props.form.getFieldsValue(),
      permission: 'no-login'
    }, function (data) {
      if (data.code === 0) {
        message.success('注册成功');
        location.href = '#/login';
      }
    }.bind(this));
  }

  getVerifyCode() {
    let phone = this.props.form.getFieldValue('phone');
    if (!phone) {
      message.error('请输入电话号码');
      return false;
    }

    message.info('验证码已发送', 3);
    api.ajax({
      url: api.getVerifyCode(),
      type: 'POST',
      data: {phone: phone},
      permission: 'no-login'
    }, function (data) {
      this.setState({code_id: data.res.sms._id})
    }.bind(this));
  }

  render() {
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 12}
    };
    const buttonLayout = {
      wrapperCol: {span: 8, offset: 8}
    };
    const {getFieldProps} = this.props.form;

    return (
      <Form horizontal >
        <Input type="hidden" {...getFieldProps('code_id', {initialValue: this.state.code_id})}/>

        <FormItem label="电话" {...formItemLayout}>
          <Input {...getFieldProps('phone')} placeholder="请输入电话号码"/>
          <a href="javascript:;" className="btn-code" onClick={this.getVerifyCode.bind(this)}>获取验证码</a>
        </FormItem>

        <FormItem label="验证码" {...formItemLayout}>
          <Input {...getFieldProps('code')} placeholder="请输入验证码"/>
        </FormItem>

        <FormItem label="姓名" {...formItemLayout}>
          <Input {...getFieldProps('name')} placeholder="请输入姓名"/>
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button type="primary" onClick={this.handleSubmit.bind(this)}>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

RegisterForm = Form.create()(RegisterForm);
export default RegisterForm
