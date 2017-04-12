import React, {Component} from 'react';
import {message, Form, Input, Button, Row, Col} from 'antd';
import api from '../middleware/api';
import BrandInfo from '../config/brand';

require('../styles/login.less');

import validator from '../utils/validator';

let logo = require('../images/login/daotian_logo.png');
let topLogo = require('../images/login/top_logo.png');

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
    if (api.isLogin()) {
      location.href = '/';
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    // TODO move to actions
    let phone = this.props.form.getFieldValue('phone'),
      code = this.props.form.getFieldValue('code');
    if (!phone || !validator.phone(phone)) {
      message.error('请输入正确的电话号码');
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
    }, data => {
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
        department: user.department,
        department_name: user.department_name,
        role: user.role,
        user_type: user.user_type,
        is_pos_device: user.is_pos_device,
        cooperation_type_name: user.cooperation_type_name.full_name,
        cooperation_type_short: user.cooperation_type_name.short,
        cooperation_type: user.cooperation_type,
        operation_name: user.operation_name,
        operation_phone: user.operation_phone,
      };

      localStorage.setItem('USER_SESSION', window.btoa(window.encodeURIComponent(JSON.stringify(userSession))));
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

    let btn_value = num + 's';
    this.setState({btn_value: btn_value});

    let time = setInterval(() => {
      num--;
      btn_value = num + 's';
      this.setState({btn_value: btn_value});

      if (num == 0) {
        this.setState({
          is_disabled: false,
          opacity: 1,
          btn_value: '获取验证码',
        });
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
    } = this.state;
    // const formItemLayout = {
    //   labelCol: {span: 5},
    //   wrapperCol: {span: 19},
    // };
    // const buttonLayout = {
    //   wrapperCol: {span: 19, offset: 5},
    // };
    const {getFieldDecorator} = this.props.form;

    return (
      <div>
        <div className="content">
          <header>
            <div className="logo">
              <img src={logo} alt=""/>
            </div>
            <div className="phone">
              <span>寻求帮助: </span>
              <span>4000-918-118</span>
            </div>
            <div className="top-logo">
              <span>系统支持: </span>
              <img src={topLogo} alt=""/>
            </div>
          </header>

          <section style={{height: document.body.clientHeight - 165}}>
            <div className="section-content">
              <div className="word">
                <div className="name">稻田汽车服务管理系统</div>
                <div className="line"></div>
                <div className="slogan-one">创造行业机遇 加速梦想脚步</div>
                <div className="slogan-two">坚持耕耘持续进化的门店服务系统</div>
              </div>

              <div className="sign-in">
                <div className="accountLogin">
                  <p>账号登录</p>
                </div>
                <Form onSubmit={this.handleSubmit}>
                  {getFieldDecorator('code_id', {initialValue: this.state.code_id})(
                    <Input type="hidden"/>
                  )}

                  <Row>
                    <Col span={15}>
                      {getFieldDecorator('phone')(
                        <Input className="input-phone input" size="large" placeholder="请输入手机号"/>
                      )}
                    </Col>
                    <Col span={8}>
                      <Button
                        disabled={is_disabled}
                        className="code-button"
                        onClick={this.getVerifyCode.bind(this)}
                      >
                        {btn_value}
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      {getFieldDecorator('code')(
                        <Input className="input-password input" onPressEnter={this.handleSubmit} placeholder="请输入验证码"/>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Button className="submit-button" type="primary" htmlType="submit">登录</Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </section>

          <footer>
            <p>您正在使用稻田汽车服务管理系统 关于稻田 | 联系我们 | Copyright © 2012-2016 北京稻成科技有限公司. All Rights Reserved</p>
          </footer>
        </div>
      </div>
    );
  }
}

Login = Form.create()(Login);
export default Login;
