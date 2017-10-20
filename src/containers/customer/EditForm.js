import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Col, DatePicker, Form, Icon, Input, message, Row, Select, Tooltip } from 'antd';

import api from '../../middleware/api';
import Layout from '../../utils/FormLayout';
import validator from '../../utils/validator';
import formatter from '../../utils/DateFormatter';
import FormValidator from '../../utils/FormValidator';

import Qiniu from '../../components/widget/UploadQiniu';
import UploadComponent from '../../components/base/BaseUpload';

const FormItem = Form.Item;
const Option = Select.Option;

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

    const birthdayElement = this.birthdayInput;
    if (birthdayElement) {
      const birthdayRect = ReactDOM.findDOMNode(birthdayElement).getBoundingClientRect();
      this.props.syncElementRect(birthdayRect);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('表单内容错误,请检查');
        return;
      }
      values.invite_id = this.state.invite_id;
      values.birth_date = formatter.date(values.birth_date);

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
    this.state.memberLevels.forEach(item => {
      if (levelId.toString() === item._id.toString()) {
        this.setState({ memberPrice: item.price });
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
    const customer = selected.list[0];
    this.setState({ invite_id: customer._id });
    this.props.form.setFieldsValue({ invite_user_name: customer.name });
  }

  getSourceTypes(sourceDeal) {
    api.ajax({ url: api.customer.getSourceTypes(sourceDeal) }, data => {
      const sources = data.res.source_types;
      this.setState({ sourceType: sources });
    });
  }

  getCustomerDetail(customerId) {
    api.ajax({ url: api.customer.detail(customerId) }, data => {
      let customer = data.res.customer_info,
        form = this.props.form;

      if (customer.invite_id && Number(customer.invite_id) !== 0) {
        this.setState({
          invite_id: customer.invite_id,
          is_old_invite: true,
        });
      }
      this.setState({
        customer,
        source: customer.source,
        memberPrice: customer.member_price,
      });
      this.getSourceTypes(customer.source_deal);

      form.setFieldsValue({
        name: customer.name,
        phone: customer.phone,
        source: customer.source,
        mail: customer.mail,
        id_card_num: customer.id_card_num,
        id_card_pic_front: customer.id_card_pic_front ? customer.id_card_pic_front : '',
        id_card_pic_back: customer.id_card_pic_back ? customer.id_card_pic_back : '',
        driver_license_front: customer.driver_license_front ? customer.driver_license_front : '',
        driver_license_back: customer.driver_license_back ? customer.driver_license_back : '',
      });

      this.getUploadedImages(customer);
    });
  }

  getUploadedImages(customer) {
    [
      'id_card_pic_front',
      'id_card_pic_back',
      'driver_license_front',
      'driver_license_back',
    ].map(fileType => {
      if (customer[fileType]) {
        this.getPrivateImageUrl(fileType, customer[fileType]);
      }
    });
  }

  getUploadedImageUrl(customerId, fileType) {
    this.getImageUrl(api.customer.getFileUrl(customerId, fileType), fileType);
  }

  render() {
    const { formItem8_15 } = Layout;
    const { getFieldDecorator } = this.props.form;
    const { customer } = this.state;

    const uploadImageSize = { height: 38, width: 38 };

    const selectGenderAfter = (
      getFieldDecorator('gender', { initialValue: String(customer.gender) || '1' })(
        <Select style={{ width: 70 }}>
          <Option value={'1'}>先生</Option>
          <Option value={'0'}>女士</Option>
          <Option value={'-1'}>未知</Option>
        </Select>,
      )
    );

    return (
      <Form>
        <Input
          type="hidden" {...getFieldDecorator('customer_id', { initialValue: customer._id })} />
        <Row>
          <Col span={12}>
            <FormItem label="姓名" {...formItem8_15}>
              {getFieldDecorator('name', {
                initialValue: customer.name,
                rules: FormValidator.getRuleNotNull(),
                validatorTrigger: 'onBlur',
              })(
                <Input placeholder="请输入姓名" addonAfter={selectGenderAfter} />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="手机号" {...formItem8_15}>
              {getFieldDecorator('phone', {
                initialValue: customer.phone,
                rules: FormValidator.getRulePhoneNumber(),
                validatorTrigger: 'onBlur',
              })(
                <Input placeholder="请输入手机号" />,
              )}
            </FormItem>
          </Col>
        </Row>

        {/* <Row>
          <Col span={12}>
            <FormItem label="会员信息" {...formItem8_15}>
              <p>{customer.member_card_name || '无'}</p>
            </FormItem>
          </Col>
        </Row>*/}

        <div className="form-line-divider" />

        <Row>
          <Col span={12}>
            <FormItem label="微信号" {...formItem8_15}>
              {getFieldDecorator('weixin', { initialValue: customer.weixin })(
                <Input placeholder="请输入微信号" />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="QQ" {...formItem8_15}>
              {getFieldDecorator('qq', { initialValue: customer.qq })(
                <Input placeholder="请输入QQ" />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="邮箱" {...formItem8_15}>
              {getFieldDecorator('mail', {
                initialValue: customer.mail,
                validate: [
                  {
                    rules: [{ type: 'email', message: validator.text.email }],
                    trigger: ['onBlur', 'onChange'],
                  }],
              })(
                <Input placeholder="请输入邮箱" />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="生日" {...formItem8_15}>
              <div>
                {getFieldDecorator('birth_date', {
                  initialValue: customer.birth_date && customer.birth_date.indexOf('0000') < 0
                    ? formatter.getMomentDate(customer.birth_date)
                    : formatter.getMomentDate(),
                })(
                  <DatePicker
                    size="large"
                    format={formatter.pattern.day}
                    allowClear={false}
                    placeholder="请输入生日"
                    ref={birthday => this.birthdayInput = birthday}
                  />,
                )}
                <Tooltip title="系统根据生日信息，自动发送生日关怀短信" arrowPointAtCenter>
                  <Icon type="question-circle-o" className="help-icon-font" />
                </Tooltip>
              </div>
            </FormItem>
          </Col>
        </Row>

        <div className="form-line-divider" />

        <Row>
          <Col span={12}>
            <FormItem label="身份证号" {...formItem8_15}>
              {getFieldDecorator('id_card_num', {
                initialValue: customer.id_card_num,
                rules: FormValidator.getRuleIDCard(),
                validatorTrigger: 'onBlur',
              })(
                <Input placeholder="请输入身份证号" />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="身份证照片" {...formItem8_15}>
              <Row>
                <Col span={10} style={{ overflow: 'hidden' }}>
                  {getFieldDecorator('id_card_pic_front')(
                    <Input type="hidden" />,
                  )}
                  <Qiniu
                    style={{ ...uploadImageSize }}
                    prefix="id_card_pic_front"
                    saveKey={this.handleKey.bind(this)}
                    source={api.system.getPrivatePicUploadToken('id_card_pic_front')}
                    onDrop={this.onDrop.bind(this, 'id_card_pic_front')}
                    onUpload={this.onUpload.bind(this, 'id_card_pic_front')}>
                    {this.renderImage('id_card_pic_front', uploadImageSize)}
                  </Qiniu>
                </Col>
                <Col span={10} style={{ overflow: 'hidden' }}>
                  {getFieldDecorator('id_card_pic_back')(
                    <Input type="hidden" />,
                  )}
                  <Qiniu
                    style={{ ...uploadImageSize }}
                    prefix="id_card_pic_back"
                    saveKey={this.handleKey.bind(this)}
                    source={api.system.getPrivatePicUploadToken('id_card_pic_back')}
                    onDrop={this.onDrop.bind(this, 'id_card_pic_back')}
                    onUpload={this.onUpload.bind(this, 'id_card_pic_back')}>
                    {this.renderImage('id_card_pic_back', uploadImageSize)}
                  </Qiniu>
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="身份证地址" {...formItem8_15}>
              {getFieldDecorator('id_card_address', { initialValue: customer.id_card_address })(
                <Input placeholder="请输入身份证地址" />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="常住地址" {...formItem8_15}>
              {getFieldDecorator('address', { initialValue: customer.address })(
                <Input placeholder="请输入常住地址" />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="驾驶证号" {...formItem8_15}>
              {getFieldDecorator('driver_license_num', { initialValue: customer.driver_license_num })(
                <Input placeholder="请输入驾驶证号" />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="驾驶证照片" {...formItem8_15}>
              <Row>
                <Col span={10} style={{ overflow: 'hidden' }}>
                  {getFieldDecorator('driver_license_front')(
                    <Input type="hidden" />,
                  )}
                  <Qiniu
                    style={{ ...uploadImageSize }}
                    prefix="driver_license_front"
                    saveKey={this.handleKey.bind(this)}
                    source={api.system.getPrivatePicUploadToken('driver_license_front')}
                    onDrop={this.onDrop.bind(this, 'driver_license_front')}
                    onUpload={this.onUpload.bind(this, 'driver_license_front')}>
                    {this.renderImage('driver_license_front', uploadImageSize)}
                  </Qiniu>
                </Col>
                <Col span={10} style={{ overflow: 'hidden' }}>
                  {getFieldDecorator('driver_license_back')(
                    <Input type="hidden" />,
                  )}
                  <Qiniu
                    style={{ ...uploadImageSize }}
                    prefix="driver_license_back"
                    saveKey={this.handleKey.bind(this)}
                    source={api.system.getPrivatePicUploadToken('driver_license_back')}
                    onDrop={this.onDrop.bind(this, 'driver_license_back')}
                    onUpload={this.onUpload.bind(this, 'driver_license_back')}>
                    {this.renderImage('driver_license_back', uploadImageSize)}
                  </Qiniu>
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="备注" {...formItem8_15}>
              {getFieldDecorator('remark', { initialValue: customer.remark })(
                <Input type="textarea" />,
              )}
            </FormItem>
          </Col>
        </Row>

        <div className="form-action-container">
          <Button onClick={this.props.onSuccess} className="mr10" size="large">取消</Button>
          <Button type="primary" onClick={this.handleSubmit.bind(this)} size="large">保存</Button>
        </div>
      </Form>
    );
  }
}

NewCustomerForm = Form.create()(NewCustomerForm);
export default NewCustomerForm;
