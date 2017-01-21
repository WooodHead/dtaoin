import React from 'react';
import {message, Row, Col, Form, Input, Radio, Button, Collapse} from 'antd';
import UploadComponent from '../../base/BaseUpload';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import Qiniu from '../../UploadQiniu';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;

class NewCustomerForm extends UploadComponent {
  constructor(props) {
    super(props);
    this.state = {
      invite_id: '',
      is_old_invite: false,
      is_other_invite: false,
      customer: {},
      source: {},
      memberLevels: [],
      memberPrice: 0,
      sourceType: [],
      id_card_pic_front_files: [],
      id_card_pic_back_files: [],
      driver_license_front_files: [],
      driver_license_back_files: [],
      id_card_pic_front_progress: {},
      id_card_pic_back_progress: {},
      driver_license_front_progress: {},
      driver_license_back_progress: {},
      id_card_pic_front_url: '',
      id_card_pic_back_url: '',
      driver_license_front_url: '',
      driver_license_back_url: '',
    };
  }

  componentDidMount() {
    this.getCustomerDetail(this.props.customer_id);
    this.getMemberLevels();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('表单内容错误,请检查');
        return;
      }
      values.invite_id = this.state.invite_id;

      api.ajax({
          url: api.customer.edit(),
          type: 'POST',
          data: values,
        }, () => {
          message.success('修改客户成功!');
          this.props.onSuccess();
          location.reload();
        });
    });
  }

  handleLevelChange(levelId) {
    this.state.memberLevels.forEach((item) => {
      if (levelId.toString() === item._id.toString()) {
        this.setState({memberPrice: item.price});
      }
    });
  }

  handleSourceDeal(type) {
    this.getSourceTypes(type);
  }

  handleSourceChange(currentSource) {
    this.state.sourceType.map(source => {
      if (currentSource === source.id.toString()) {
        this.setState({
          is_old_invite: source.is_old_invite,
          is_other_invite: source.is_other_invite,
        });
      }
    });
  }

  handleSearchChange(selected) {
    let customer = selected.list[0];
    this.setState({invite_id: customer._id});
    this.props.form.setFieldsValue({'invite_user_name': customer.name});
  }

  getMemberLevels() {
    api.ajax({url: api.customer.getMemberConfig()}, function (data) {
      this.setState({memberLevels: data.res.member_levels});
    }.bind(this));
  }

  getSourceTypes(sourceDeal) {
    api.ajax({url: api.customer.getSourceTypes(sourceDeal)}, function (data) {
      let sources = data.res.source_types;
      this.setState({sourceType: sources});
    }.bind(this));
  }

  getCustomerDetail(customerId) {
    api.ajax({url: api.customer.detail(customerId)}, (data) => {
      let customer = data.res.customer_info,
        // customerId = customer._id,
        form = this.props.form;

      if (customer.invite_id && Number(customer.invite_id) !== 0) {
        this.setState({
          invite_id: customer.invite_id,
          is_old_invite: true,
        });
      }
      this.setState({
        customer: customer,
        source: customer.source,
        memberPrice: customer.member_price,
      });
      this.getSourceTypes(customer.source_deal);

      form.setFieldsValue({
        'name': customer.name,
        'phone': customer.phone,
        // 'source': this.state.source,
        'source': customer.source,
        'mail': customer.mail,
        'id_card_num': customer.id_card_num,
        'id_card_pic_front': customer.id_card_pic_front ? customer.id_card_pic_front : '',
        'id_card_pic_back': customer.id_card_pic_back ? customer.id_card_pic_back : '',
        'driver_license_front': customer.driver_license_front ? customer.driver_license_front : '',
        'driver_license_back': customer.driver_license_back ? customer.driver_license_back : '',
      });
      this.getUploadedImages(customer);
    });
  }

  getUploadedImages(customer) {
    let customerId = customer._id;
    if (customer.id_card_pic_front) {
      this.getUploadedImageUrl(customerId, 'id_card_pic_front');
    }
    if (customer.id_card_pic_back) {
      this.getUploadedImageUrl(customerId, 'id_card_pic_back');
    }
    if (customer.driver_license_front) {
      this.getUploadedImageUrl(customerId, 'driver_license_front');
    }
    if (customer.driver_license_back) {
      this.getUploadedImageUrl(customerId, 'driver_license_back');
    }
  }

  getUploadedImageUrl(customerId, fileType) {
    this.getImageUrl(api.customer.getFileUrl(customerId, fileType), fileType);
  }

  render() {
    const {formItemLayout, buttonLayout} = Layout;
    const {getFieldDecorator} = this.props.form;
    const {customer_id} = this.props;
    const {customer} = this.state;

    return (
      <Form horizontal>
        {getFieldDecorator('customer_id', {initialValue: customer._id})(
          <Input type="hidden"/>
        )}

        <Collapse defaultActiveKey={['1']}>
          <Panel header="基本信息" key="1">
            <Row>
              <Col span={13}>
                <FormItem label="姓名"
                          labelCol={{span: 11}}
                          wrapperCol={{span: 11}}
                          required>
                  {getFieldDecorator('name', {
                    initialValue: customer.name,
                    rules: [{
                      required: true,
                      message: validator.required.name,
                    }, {
                      validator: FormValidator.validateName,
                    }],
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入姓名"/>
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem
                  wrapperCol={{span: 22}}
                  required>
                  {getFieldDecorator('gender', {initialValue: Number(customer.gender)})(
                    <RadioGroup>
                      <Radio value={1}>先生</Radio>
                      <Radio value={0}>女士</Radio>
                      <Radio value={-1}>未知</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormItem label="手机号" {...formItemLayout} hasFeedback required>
                  {getFieldDecorator('phone', {
                    initialValue: customer.phone,
                    rules: [{
                      required: true, message: validator.required.phone,
                    }, {
                      validator: FormValidator.validatePhone,
                    }],
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入手机号"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormItem label="会员信息" {...formItemLayout}>
                  {customer.member_card_name || '无'}
                </FormItem>
              </Col>
            </Row>

          </Panel>

          <Panel header="其他信息" key="2">
            <FormItem label="微信号" {...formItemLayout}>
              {getFieldDecorator('weixin', {initialValue: customer.weixin})(
                <Input placeholder="请输入微信号"/>
              )}
            </FormItem>

            <FormItem label="QQ" {...formItemLayout}>
              {getFieldDecorator('qq', {initialValue: customer.qq})(
                <Input placeholder="请输入QQ"/>
              )}
            </FormItem>

            <FormItem label="邮箱" {...formItemLayout} hasFeedback>
              {getFieldDecorator('mail', {
                initialValue: customer.mail,
                rules: [{type: 'email', message: validator.text.email}],
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入邮箱"/>
              )}
            </FormItem>

            <FormItem label="身份证地址" {...formItemLayout}>
              {getFieldDecorator('id_card_address', {initialValue: customer.id_card_address})(
                <Input placeholder="请输入身份证地址"/>
              )}
            </FormItem>

            <FormItem label="常住地址" {...formItemLayout}>
              {getFieldDecorator('address', {initialValue: customer.address})(
                <Input placeholder="请输入常住地址"/>
              )}
            </FormItem>

            <FormItem label="身份证号" {...formItemLayout} hasFeedback>
              {getFieldDecorator('id_card_num', {
                initialValue: customer.id_card_num,
                rules: [{
                  required: false,
                  message: validator.required.idCard,
                }, {
                  validator: FormValidator.validateIdCard,
                }],
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入身份证号"/>
              )}
            </FormItem>

            <FormItem label="身份证照片" {...formItemLayout}>
              <Row>
                <Col span={10}>
                  {getFieldDecorator('id_card_pic_front')(
                    <Input type="hidden"/>
                  )}
                  <Qiniu
                    prefix="id_card_pic_front"
                    saveKey={this.handleKey.bind(this)}
                    source={api.customer.getUploadToken(customer_id, 'id_card_pic_front')}
                    onDrop={this.onDrop.bind(this, 'id_card_pic_front')}
                    onUpload={this.onUpload.bind(this, 'id_card_pic_front')}>
                    {this.renderImage('id_card_pic_front')}
                  </Qiniu>
                </Col>
                <Col span={10}>
                  {getFieldDecorator('id_card_pic_back')(
                    <Input type="hidden"/>
                  )}
                  <Qiniu
                    prefix="id_card_pic_back"
                    saveKey={this.handleKey.bind(this)}
                    source={api.customer.getUploadToken(customer_id, 'id_card_pic_back')}
                    onDrop={this.onDrop.bind(this, 'id_card_pic_back')}
                    onUpload={this.onUpload.bind(this, 'id_card_pic_back')}>
                    {this.renderImage('id_card_pic_back')}
                  </Qiniu>
                </Col>
              </Row>
            </FormItem>

            <FormItem label="驾驶证号" {...formItemLayout}>
              {getFieldDecorator('driver_license_num', {initialValue: customer.driver_license_num})(
                <Input placeholder="请输入驾驶证号"/>
              )}
            </FormItem>

            <FormItem label="驾驶证号照片" {...formItemLayout}>
              <Row>
                <Col span={10}>
                  {getFieldDecorator('driver_license_front')(
                    <Input type="hidden"/>
                  )}
                  <Qiniu
                    prefix="driver_license_front"
                    saveKey={this.handleKey.bind(this)}
                    source={api.customer.getUploadToken(customer_id, 'driver_license_front')}
                    onDrop={this.onDrop.bind(this, 'driver_license_front')}
                    onUpload={this.onUpload.bind(this, 'driver_license_front')}>
                    {this.renderImage('driver_license_front')}
                  </Qiniu>
                </Col>
                <Col span={10}>
                  {getFieldDecorator('driver_license_back')(
                    <Input type="hidden"/>
                  )}
                  <Qiniu
                    prefix="driver_license_back"
                    saveKey={this.handleKey.bind(this)}
                    source={api.customer.getUploadToken(customer_id, 'driver_license_back')}
                    onDrop={this.onDrop.bind(this, 'driver_license_back')}
                    onUpload={this.onUpload.bind(this, 'driver_license_back')}>
                    {this.renderImage('driver_license_back')}
                  </Qiniu>
                </Col>
              </Row>
            </FormItem>

            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {initialValue: customer.remark})(
                <Input type="textarea"/>
              )}
            </FormItem>
          </Panel>
        </Collapse>

        <FormItem {...buttonLayout} className="mt15">
          <Button type="primary" onClick={this.handleSubmit.bind(this)}>保存</Button>
        </FormItem>
      </Form>
    );
  }
}

NewCustomerForm = Form.create()(NewCustomerForm);
export default NewCustomerForm;
