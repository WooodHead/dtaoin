import React, {Component} from 'react';
import {message, Form, Input, Button} from 'antd';
import api from '../middleware/api';
import BrandInfo from '../config/brand';

const FormItem = Form.Item;

class Login extends Component {
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

  componentDidMount() {
    let USER_SESSION = sessionStorage.getItem('USER_SESSION');
    USER_SESSION = USER_SESSION ? JSON.parse(USER_SESSION) : {};
    const uid = USER_SESSION.uid;
    if (!!uid) {
      location.href = '';
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    // TODO move to actions
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
      url: api.system.login(),
      type: 'POST',
      data: this.props.form.getFieldsValue(),
      permission: 'no-login',
    }, (data) => {
      const user = data.res.user;
      let userSession = {
        brand_name: BrandInfo.brand_name,
        brand_logo: BrandInfo.brand_logo,
        uid: user._id,
        name: user.name,
        company_id: user.company_id,
        company_name: user.company_name,
        company_num: user.company_num,
        has_purchase: user.has_purchase,
        department: Number(user.department),
        department_name: user.department_name,
        role: Number(user.role),
      };

      sessionStorage.setItem('USER_SESSION', JSON.stringify(userSession));
      message.success('登录成功');
      location.href = '/';
    });
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

    let time = setInterval(() => {
      num--;
      btn_value = '请' + num + 's后再次获取验证码';
      this.setState({btn_value: btn_value});

      if (num == 0) {
        this.setState({is_disabled: false, opacity: 1});
        this.setState({btn_value: '获取验证码'});
        clearInterval(time);
        time = undefined;
      }
    }, 1000);

    api.ajax({
      url: api.system.getVerifyCode(),
      type: 'POST',
      data: {phone: phone},
      permission: 'no-login',
    }, (data) => {
      message.info('验证码已发送', 3);
      this.setState({code_id: data.res.sms._id});
    });
  }

  render() {
    let {
      btn_value,
      is_disabled,
      opacity,
    } = this.state;
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 19},
    };
    const buttonLayout = {
      wrapperCol: {span: 19, offset: 5},
    };
    const {getFieldDecorator} = this.props.form;

    return (
      <div>
        <div className="form-container">
          <div className="card-box center-box">
            <h3 className="card-title">登录</h3>

            <Form horizontal onSubmit={this.handleSubmit}>
              {getFieldDecorator('code_id', {initialValue: this.state.code_id})(
                <Input type="hidden"/>
              )}

              <FormItem label="电话" {...formItemLayout}>
                {getFieldDecorator('phone')(
                  <Input placeholder="请输入电话号码"/>
                )}
                <button
                  disabled={is_disabled}
                  className="btn-code-clock"
                  onClick={this.getVerifyCode.bind(this)}
                  style={{border: 'none', outline: 'none', opacity: opacity}}>
                  {btn_value}
                </button>
              </FormItem>

              <FormItem label="验证码" {...formItemLayout}>
                {getFieldDecorator('code')(
                  <Input onPressEnter={this.handleSubmit} placeholder="请输入验证码"/>
                )}
              </FormItem>

              <FormItem {...buttonLayout}>
                <Button type="primary" htmlType="submit">登录</Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

Login = Form.create()(Login);
export default Login;
