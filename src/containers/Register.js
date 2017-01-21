import React, {Component} from 'react';
import {message, Form, Input, Button} from 'antd';
import api from '../middleware/api';

const FormItem = Form.Item;

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code_id: '',
    };
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
      url: api.system.register(),
      type: 'POST',
      data: this.props.form.getFieldsValue(),
      permission: 'no-login',
    }, function (data) {
      if (data.code === 0) {
        message.success('注册成功');
        location.href = '/login';
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
      permission: 'no-login',
    }, function (data) {
      this.setState({code_id: data.res.sms._id});
    }.bind(this));
  }

  render() {
    let USER_SESSION = sessionStorage.getItem('USER_SESSION');
    USER_SESSION = USER_SESSION ? JSON.parse(USER_SESSION) : {};
    let logoImage = USER_SESSION.brand_logo ? require('../images/' + USER_SESSION.brand_logo) : '';

    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 12},
    };
    const buttonLayout = {
      wrapperCol: {span: 8, offset: 8},
    };
    const {getFieldDecorator} = this.props.form;

    return (
      <div>
        <header className="clearfix">
          <a href="#" className="logo">
            <img src={logoImage} alt={USER_SESSION.brand_name}/>
          </a>
          <em className="bar"/>
          <a href="#" className="store">{USER_SESSION.company_name}</a>

          <nav className="nav">
            <ul>
              <li><a href="#/login">登录</a></li>
            </ul>
          </nav>
        </header>

        <div className="card-box center-box">
          <h3 className="card-title">注册</h3>

          <Form horizontal>
            {getFieldDecorator('code_id', {initialValue: this.state.code_id})(
              <Input type="hidden"/>
            )}

            <FormItem label="电话" {...formItemLayout}>
              {getFieldDecorator('phone')(
                <Input placeholder="请输入电话号码"/>
              )}
              <a href="javascript:;" className="btn-code" onClick={this.getVerifyCode.bind(this)}>获取验证码</a>
            </FormItem>

            <FormItem label="验证码" {...formItemLayout}>
              {getFieldDecorator('code')(
                <Input placeholder="请输入验证码"/>
              )}
            </FormItem>

            <FormItem label="姓名" {...formItemLayout}>
              {getFieldDecorator('name')(
                <Input placeholder="请输入姓名"/>
              )}
            </FormItem>

            <FormItem {...buttonLayout}>
              <Button type="primary" onClick={this.handleSubmit.bind(this)}>提交</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

Register = Form.create()(Register);
export default Register;
