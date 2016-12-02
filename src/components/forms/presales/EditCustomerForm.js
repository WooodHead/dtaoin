import React from 'react'
import {message, Icon, Row, Col, Form, Input, Select, Radio, Button} from 'antd'
import UploadComponent from '../../base/BaseUpload'
import Layout from '../Layout'
import api from '../../../middleware/api'
import Qiniu from '../../../middleware/UploadQiniu'
import validator from '../../../middleware/validator'
import FormValidator from '../FormValidator'
import SearchBox from '../../search/CustomerSearchBox'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class NewCustomerForm extends UploadComponent {
  constructor(props) {
    super(props);
    this.state = {
      invite_id: '',
      is_old_invite: false,
      is_other_invite: false,
      customer: {},
      sourceType: [],
      id_card_pic_front_files: [],
      id_card_pic_back_files: [],
      driver_license_front_files: [],
      driver_license_back_files: [],
      id_card_pic_front_progress: {},
      id_card_pic_back_progress: {},
      driver_license_front_progress: {},
      driver_license_back_progress: {}
    };
  }

  componentDidMount() {
    this.getCustomerDetail(this.props.customer_id);
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
        url: api.editCustomer(),
        type: 'POST',
        data: values
      }, function (data) {
        message.success('修改客户成功!');
        this.props.cancelModal();
        location.reload();
      }.bind(this));
    });
  }

  handleSourceDeal(type) {
    this.getSourceTypes(type);
  }

  handleSourceChange(currentSource) {
    this.state.sourceType.map(source => {
      if (currentSource === source.id.toString()) {
        if(!source.is_old_invite){
          this.setState({invite_id: ''});
          this.props.form.setFieldsValue({'invite_user_name': ''});
        }

        this.setState({
          is_old_invite: source.is_old_invite,
          is_other_invite: source.is_other_invite
        })
      }
    })
  }

  handleSearchChange(selected) {
    let customer = selected.list[0];
    this.setState({invite_id: customer._id});
    this.props.form.setFieldsValue({'invite_user_name': customer.name});
  }

  getSourceTypes(sourceDeal) {
    api.ajax({url: api.getSourceTypes(sourceDeal)}, function (data) {
      let sources = data.res.source_types;
      this.setState({sourceType: sources});
    }.bind(this));
  }

  getCustomerDetail(customerId) {
    api.ajax({url: api.getCustomerDetail(customerId)}, function (data) {
      let customer = data.res.customer_info,
        customerId = customer._id,
        form = this.props.form;

      if (customer.invite_id && Number(customer.invite_id) !== 0) {
        this.setState({
          invite_id: customer.invite_id,
          is_old_invite: true
        });
      }
      this.setState({
        customer: customer,
        source: customer.source
      });
      this.getSourceTypes(customer.source_deal);

      form.setFieldsValue({
        'name': customer.name,
        'phone': customer.phone,
        'source': this.state.source.toString(),
        'mail': customer.mail,
        'id_card_num': customer.id_card_num,
        'id_card_pic_front': customer.id_card_pic_front ? customer.id_card_pic_front : '',
        'id_card_pic_back': customer.id_card_pic_back ? customer.id_card_pic_back : '',
        'driver_license_front': customer.driver_license_front ? customer.driver_license_front : '',
        'driver_license_back': customer.driver_license_back ? customer.driver_license_back : ''
      });

      this.getUploadedImages(customer);
    }.bind(this));
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
    this.getImageUrl(api.getCustomerFileUrl(customerId, fileType), fileType);
  }

  render() {
    const {formItemLayout, buttonLayout, selectStyle} = Layout;
    const {getFieldProps} = this.props.form;
    const {customer_id} = this.props;
    const {customer} = this.state;

    const nameProps = getFieldProps('name', {
      validate: [{
        rules: [{validator: FormValidator.validateName}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.name}],
        trigger: 'onBlur'
      }]
    });

    const phoneProps = getFieldProps('phone', {
      validate: [{
        rules: [{validator: FormValidator.validatePhone}],
        trigger: ['onBlur', 'onChange']
      }, {
        rules: [{required: true, message: validator.required.phone}],
        trigger: 'onBlur'
      }]
    });

    const emailProps = getFieldProps('mail', {
      validate: [{
        rules: [{type: 'email', message: validator.text.email}],
        trigger: ['onBlur', 'onChange']
      }]
    });

    const idCardProps = getFieldProps('id_card_num', {
      validate: [{
        rules: [{validator: FormValidator.validateIdCard}],
        trigger: ['onBlur', 'onChange']
      }, {
        rules: [{required: false, message: validator.required.idCard}],
        trigger: 'onBlur'
      }]
    });

    return (
      <Form horizontal >
        <Input type="hidden" {...getFieldProps('customer_id', {initialValue: customer._id})}/>

        <Row>
          <Col span="13">
            <FormItem label="姓名"
                      labelCol={{span: 11}}
                      wrapperCol={{span: 11}}
                      required>
              <Input {...nameProps} placeholder="请输入姓名"/>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem
              wrapperCol={{span: 22}}
              required>
              <RadioGroup {...getFieldProps('gender', {initialValue: customer.gender})}>
                <Radio value="1">男士</Radio>
                <Radio value="0">女士</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <FormItem label="手机号" {...formItemLayout} hasFeedback required>
          <Input {...phoneProps} placeholder="请输入手机号"/>
        </FormItem>

        <FormItem label="客户来源" {...formItemLayout} required>
          <Row>
            <Col span="10">
              <Select
                onSelect={this.handleSourceDeal.bind(this)} {...getFieldProps('source_deal', {initialValue: customer.source_deal})}
                size="large" {...selectStyle}>
                <Option key="1">新车交易</Option>
                <Option key="2">二手车交易</Option>
                <Option key="3">保险交易</Option>
                <Option key="4">装潢交易</Option>
                <Option key="5">维保交易</Option>
              </Select>
            </Col>
            <Col span="2">
              <p className="ant-form-split">-</p>
            </Col>
            <Col span="10">
              <Select
                onSelect={this.handleSourceChange.bind(this)} {...getFieldProps('source', {initialValue: Number(this.state.source)})}
                size="large" {...selectStyle}>
                <Option key="0">未知</Option>
                {this.state.sourceType.map((source, index) => <Option key={source.id}>{source.desc}</Option>)}
              </Select>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="老客户介绍人" {...formItemLayout} className={this.state.is_old_invite ? '' : 'hide'}>
          <Row>
            <Col span="16">
              <SearchBox
                api={api.searchAutoCustomers()}
                change={this.handleSearchChange.bind(this)}
                style={{width: 200}}
              />
            </Col>
            <Col span="8">
              <Input {...getFieldProps('invite_user_name', {initialValue: customer.invite_user_name})}
                     placeholder="老客户介绍人"/>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="其他介绍人" {...formItemLayout} className={this.state.is_other_invite ? '' : 'hide'}>
          <Input {...getFieldProps('other_invite', {initialValue: customer.other_invite})} placeholder="请输入其他介绍人"/>
        </FormItem>

        <FormItem label="微信号" {...formItemLayout}>
          <Input {...getFieldProps('weixin', {initialValue: customer.weixin})} placeholder="请输入微信号"/>
        </FormItem>

        <FormItem label="QQ" {...formItemLayout}>
          <Input {...getFieldProps('qq', {initialValue: customer.qq})} placeholder="请输入QQ"/>
        </FormItem>

        <FormItem label="邮箱" {...formItemLayout} hasFeedback>
          <Input {...emailProps} placeholder="请输入邮箱"/>
        </FormItem>

        <FormItem label="身份证地址" {...formItemLayout}>
          <Input {...getFieldProps('id_card_address', {initialValue: customer.id_card_address})}
                 placeholder="请输入身份证地址"/>
        </FormItem>

        <FormItem label="常住地址" {...formItemLayout}>
          <Input {...getFieldProps('address', {initialValue: customer.address})} placeholder="请输入常住地址"/>
        </FormItem>

        <FormItem label="身份证号" {...formItemLayout} hasFeedback>
          <Input {...idCardProps} placeholder="请输入身份证号"/>
        </FormItem>

        <FormItem label="身份证照片" {...formItemLayout}>
          <Row>
            <Col span="10">
              <Input type="hidden" {...getFieldProps('id_card_pic_front')} />
              <Qiniu
                prefix="id_card_pic_front"
                saveKey={this.handleKey.bind(this)}
                source={api.getCustomerUploadToken(customer_id, 'id_card_pic_front')}
                onDrop={this.onDrop.bind(this, 'id_card_pic_front')}
                onUpload={this.onUpload.bind(this, 'id_card_pic_front')}>
                {this.renderImage('id_card_pic_front')}
              </Qiniu>
            </Col>
            <Col span="10">
              <Input type="hidden" {...getFieldProps('id_card_pic_back')} />
              <Qiniu
                prefix="id_card_pic_back"
                saveKey={this.handleKey.bind(this)}
                source={api.getCustomerUploadToken(customer_id, 'id_card_pic_back')}
                onDrop={this.onDrop.bind(this, 'id_card_pic_back')}
                onUpload={this.onUpload.bind(this, 'id_card_pic_back')}>
                {this.renderImage('id_card_pic_back')}
              </Qiniu>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="驾驶证号" {...formItemLayout}>
          <Input {...getFieldProps('driver_license_num', {initialValue: customer.driver_license_num})}
                 placeholder="请输入驾驶证号"/>
        </FormItem>

        <FormItem label="驾驶证号照片" {...formItemLayout}>
          <Row>
            <Col span="10">
              <Input type="hidden" {...getFieldProps('driver_license_front')} />
              <Qiniu
                prefix="driver_license_front"
                saveKey={this.handleKey.bind(this)}
                source={api.getCustomerUploadToken(customer_id, 'driver_license_front')}
                onDrop={this.onDrop.bind(this, 'driver_license_front')}
                onUpload={this.onUpload.bind(this, 'driver_license_front')}>
                {this.renderImage('driver_license_front')}
              </Qiniu>
            </Col>
            <Col span="10">
              <Input type="hidden" {...getFieldProps('driver_license_back')} />
              <Qiniu
                prefix="driver_license_back"
                saveKey={this.handleKey.bind(this)}
                source={api.getCustomerUploadToken(customer_id, 'driver_license_back')}
                onDrop={this.onDrop.bind(this, 'driver_license_back')}
                onUpload={this.onUpload.bind(this, 'driver_license_back')}>
                {this.renderImage('driver_license_back')}
              </Qiniu>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          <Input type="textarea" {...getFieldProps('remark', {initialValue: customer.remark})}/>
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button onClick={this.props.cancelModal} className="mr15">取消</Button>
          <Button type="primary" onClick={this.handleSubmit.bind(this)}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}

NewCustomerForm = Form.create()(NewCustomerForm);
export default NewCustomerForm
