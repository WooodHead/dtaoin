import React from 'react';
import {message, Row, Col, Form, Input, Select, Radio, Button, Collapse} from 'antd';
import UploadComponent from '../../base/BaseUpload';
import Qiniu from '../../UploadQiniu';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';
import CustomerAutoSearchBox from '../../search/CustomerAutoSearchBox';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;

class NewCustomerForm extends UploadComponent {
  constructor(props) {
    super(props);
    this.state = {
      isNew: true,
      customer_id: '',
      customer: {},
      memberLevels: [],
      memberPrice: 0,
      sourceType: [],
      is_old_invite: false,
      is_other_invite: true,
      id_card_pic_front_files: [],
      id_card_pic_back_files: [],
      driver_license_front_files: [],
      driver_license_back_files: [],
      id_card_pic_front_progress: {},
      id_card_pic_back_progress: {},
      driver_license_front_progress: {},
      driver_license_back_progress: {},
    };
  }

  componentDidMount() {
    this.getSourceTypes(1);
    this.getNewCustomerId();
    this.getMemberLevels();
  }

  handleNextStep(e) {
    e.preventDefault();
    this.handleSubmit(e, 'NEXT');
  }

  handleSubmit(e, action) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('表单内容错误,请检查');
        return;
      }

      values.customer_id = this.state.customer_id;

      api.ajax({
        url: this.state.isNew ? api.customer.add() : api.customer.edit(),
        type: 'POST',
        data: values,
      }, (data) => {
        message.success(this.state.isNew ? '新增客户成功!' : '修改客户成功!');
        this.setState({isNew: false});
        if (action === 'NEXT') {
          this.props.onSuccess({
            customer_id: data.res.customer_id,
            currentStep: this.props.nextStep,
            customerForm: 'hide',
            autoForm: '',
            reload: true,
          });
        } else {
          this.props.cancelModal();
          location.reload();
        }
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

  handleSearchSelect(customer) {
    let form = this.props.form;
    if (customer._id) {
      api.ajax({url: api.customer.detail(customer._id)}, (data) => {

        //this.props.onSuccess({customer_id: customer._id});
        this.setState({
          isNew: false,
          customer_id: customer._id,
          customer: data.res.customer_info,
        });

        form.setFieldsValue({name: customer.name});
        form.setFieldsValue({gender: this.state.customer.gender});
        form.setFieldsValue({phone: customer.phone});
        form.setFieldsValue({weixin: this.state.customer.weixin});
        form.setFieldsValue({qq: this.state.customer.qq});
        form.setFieldsValue({mail: this.state.customer.mail});
        form.setFieldsValue({id_card_address: this.state.customer.id_card_address});
        form.setFieldsValue({address: this.state.customer.address});
        form.setFieldsValue({id_card_num: this.state.customer.id_card_num});
        form.setFieldsValue({driver_license_num: this.state.customer.driver_license_num});
        form.setFieldsValue({remark: this.state.customer.remark});
      });
    } else {
      this.setState({customer: {}});
      this.getNewCustomerId();
    }
  }

  getNewCustomerId() {
    api.ajax({url: api.customer.genNewId()}, (data) => {
      let customerId = data.res.customer_id;
      this.setState({customer_id: customerId});
    });
  }

  getMemberLevels() {
    api.ajax({url: api.customer.getMemberConfig()}, (data) => {
      this.setState({memberLevels: data.res.member_levels});
    });
  }

  getSourceTypes(sourceDeal) {
    api.ajax({url: api.customer.getSourceTypes(sourceDeal)}, (data) => {
      this.setState({sourceType: data.res.source_types});
    });
  }

  render() {
    const {formItemLayout, buttonLayout, selectStyle} = Layout;
    const {getFieldDecorator} = this.props.form;
    const {customer_id} = this.props;
    const {
      customer,
      memberLevels,
      memberPrice,
    } = this.state;

    return (
      <Form horizontal>
        {getFieldDecorator('customer_id', {initialValue: customer_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('is_maintain', {initialValue: 1})(
          <Input type="hidden"/>
        )}

        <Collapse defaultActiveKey={['1']}>
          <Panel header="基本信息" key="1">
            <FormItem label="搜索客户" {...formItemLayout}>
              <CustomerAutoSearchBox
                api={api.searchAutoCustomers()}
                select={this.handleSearchSelect.bind(this)}
                style={{width: 220}}
                visible={this.props.visible}
              />
            </FormItem>

            <Row>
              <Col span={13}>
                <FormItem label="姓名"
                          labelCol={{span: 11}}
                          wrapperCol={{span: 11}}>

                  {getFieldDecorator('name', {
                    rules: [{
                      required: true,
                      message: validator.required.name,
                    }, {validator: FormValidator.validateName}],
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入姓名"/>
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem
                  wrapperCol={{span: 22}}>
                  {getFieldDecorator('gender', {initialValue: customer.gender ? customer.gender : 1})(
                    <RadioGroup>
                      <Radio value={1}>先生</Radio>
                      <Radio value={0}>女士</Radio>
                      <Radio value={-1}>未知</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>

            <FormItem label="手机号" {...formItemLayout}>
              {getFieldDecorator('phone', {
                rules: [{required: true, message: validator.required.phone}, {validator: FormValidator.validatePhone}],
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入手机号"/>
              )}
            </FormItem>
          </Panel>

          <Panel header="会员信息" key="2">
            <FormItem label="会员信息" {...formItemLayout}>
              <Row>
                <Col span={14}>
                  {getFieldDecorator('member_level', {initialValue: customer.member_level || '0'})(
                    <Select onSelect={this.handleLevelChange.bind(this)} {...selectStyle}>
                      {memberLevels.map(level => <Option key={level._id}>{level.desc}</Option>)}
                    </Select>
                  )}
                </Col>
                <Col span={1}>
                  <p className="ant-form-split">--</p>
                </Col>
                <Col span={4}>
                  <p className="ant-form-text">{memberPrice}元</p>
                </Col>
              </Row>
            </FormItem>
          </Panel>

          <Panel header="其他信息" key="3">
            <FormItem label="微信号" {...formItemLayout}>
              {getFieldDecorator('weixin', {initialValue: customer.weixin})(
                <Input placeholder="请输入微信号"/>
              )}
            </FormItem>

            <FormItem label="QQ" {...formItemLayout}>
              {getFieldDecorator('qq', {initialValue: customer.qq})(
                <Input type="number" placeholder="请输入QQ"/>
              )}
            </FormItem>

            <FormItem label="邮箱" {...formItemLayout}>
              {getFieldDecorator('mail', {
                validate: [{
                  rules: [{type: 'email', required: false, message: validator.text.email}],
                  trigger: ['onBlur'],
                }],
              })(
                <Input type="email" placeholder="请输入邮箱"/>
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
                rules: [{
                  required: false,
                  message: validator.required.idCard,
                }, {validator: FormValidator.validateIdCard}],
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

        <FormItem {...buttonLayout} className="margin-top-40">
          <Button type="primary" className="mr15" onClick={this.handleNextStep.bind(this)}>下一步</Button>
          <Button type="ghost" onClick={this.handleSubmit.bind(this)}>保存并退出</Button>
        </FormItem>
      </Form>
    );
  }
}

NewCustomerForm = Form.create()(NewCustomerForm);
export default NewCustomerForm;
