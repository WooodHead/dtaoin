import React, {Component} from 'react'
import {message, Form, Input, Button} from 'antd'
import api from '../../middleware/api'
import BrandInfo from '../../middleware/brand';

const FormItem = Form.Item;

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code_id: '',
      btn_value: '获取验证码',
      is_disabled: false,
      opacity: 1,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getVerifyCode = this.getVerifyCode.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    let phone = this.props.form.getFieldValue('phone'),
      code = this.props.form.getFieldValue('code');
    if (!phone) {
      message.error('请输入电话号码');
      return false;
    }
    if (!code) {
      message.error('请输入验证码');
      return false;
    }
    api.ajax({
      url: api.login(),
      type: 'POST',
      data: this.props.form.getFieldsValue(),
      permission: 'no-login'
    }, function (data) {
      const user = data.res.user;
      let userSession = Object.assign(user, {
        brand_name: BrandInfo.brand_name,
        brand_logo: BrandInfo.brand_logo,
        uid: user._id,
      });
      sessionStorage.setItem('USER_SESSION', JSON.stringify(userSession));
      location.href = location.origin + location.pathname;
      message.success('登录成功');
    }.bind(this));
  }

  getVerifyCode() {

    let phone = this.props.form.getFieldValue('phone');
    if (!phone) {
      message.error('请输入电话号码');
      return false;
    }

    let num = 10;
    this.setState({is_disabled: 'disable', opacity: 0.5});

    let btn_value = '请' + num + 's后再次获取验证码';
    this.setState({btn_value: btn_value});

    let _this = this;
    let time = setInterval(() => {
      num--;
      btn_value = '请' + num + 's后再次获取验证码';
      this.setState({btn_value: btn_value});

      if (num == 0) {
        this.setState({is_disabled: false, opacity: 1});
        this.setState({btn_value: "获取验证码"});
        clearInterval(time);
        time = undefined;
      }
    }, 1000);

    // message.info('验证码已发送', 3);
    api.ajax({
      url: api.getVerifyCode(),
      type: 'POST',
      data: {phone: phone},
      permission: 'no-login'
    }, function (data) {
      message.info('验证码已发送', 3);
      this.setState({code_id: data.res.sms._id})
    }.bind(this));
  }

  render() {
    let {
      btn_value,
      is_disabled,
      opacity,
    } = this.state;
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 19}
    };
    const buttonLayout = {
      wrapperCol: {span: 19, offset: 5}
    };
    const {getFieldProps} = this.props.form;

    return (
      <Form horizontal>
        <Input type="hidden" {...getFieldProps('code_id', {initialValue: this.state.code_id})}/>

        <FormItem label="电话" {...formItemLayout}>
          <Input
            {...getFieldProps('phone')}
            placeholder="请输入电话号码"
          />
          <button
            disabled={is_disabled}
            className="btn-code-clock"
            onClick={this.getVerifyCode.bind(this)}
            style={{border: "none", outline: "none", opacity: opacity}}>
            {btn_value}
          </button>
        </FormItem>

        <FormItem label="验证码" {...formItemLayout}>
          <Input
            onPressEnter={this.handleSubmit}
            {...getFieldProps('code')}
            placeholder="请输入验证码"
          />
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button type="primary" onClick={this.handleSubmit}>登录</Button>
        </FormItem>
      </Form>
    )
  }
}

LoginForm = Form.create()(LoginForm);
export default LoginForm
