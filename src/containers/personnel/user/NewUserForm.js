import React from 'react';
import {message, Form, Row, Col, Input, Select, Radio, Button, Collapse} from 'antd';
import UploadComponent from '../../../components/base/BaseUpload';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import Qiniu from '../../../components/UploadQiniu';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';

let certificateIndex = 0;

class NewUserForm extends UploadComponent {
  constructor(props) {
    super(props);
    this.state = {
      isNew: true,
      userId: '',
      user_ca_id_0: '',
      id_card_front_pic_key: '',
      id_card_back_pic_key: '',
      registry_form_pic_key: '',
      health_form_pic_key: '',
      leaving_certificate_pic_key: '',
      id_photo_pic_key: '',
      labor_contract_pic_key: '',
      pay_card_pic_key: '',
      user_certificate_pic_0_key: '',
      id_card_front_pic_files: [],
      id_card_back_pic_files: [],
      registry_form_pic_files: [],
      health_form_pic_files: [],
      leaving_certificate_pic_files: [],
      id_photo_pic_files: [],
      labor_contract_pic_files: [],
      pay_card_pic_files: [],
      user_certificate_pic_0_files: [],
      id_card_front_pic_progress: {},
      id_card_back_pic_progress: {},
      registry_form_pic_progress: {},
      health_form_pic_progress: {},
      leaving_certificate_pic_progress: {},
      id_photo_pic_progress: {},
      labor_contract_pic_progress: {},
      pay_card_pic_progress: {},
      user_certificate_pic_0_progress: {},
    };

    [
      'handleNextStep',
      'handleSubmit',
      'renderImage',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getNewUserId();
    this.getNewCaId(0);
  }

  handleNextStep(e) {
    e.preventDefault();
    this.handleSubmit(e, 'NEXT');
  }

  handleSubmit(e, action) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.hasError);
        return;
      }
      values.user_ca_info = JSON.stringify(this.assembleCertificates(values));

      api.ajax({
        url: this.state.isNew ? api.user.add() : api.user.edit(),
        type: 'POST',
        data: values,
      }, function () {
        message.success(this.state.isNew ? '员工信息添加成功!' : '员工信息修改成功!');
        if (action === 'NEXT') {
          this.setState({isNew: false});
          this.props.onSuccess({
            currentStep: this.props.nextStep,
            basicInfoForm: 'hide',
            positionAndSalaryForm: '',
          });
        } else {
          this.props.cancelModal();
          location.reload();
        }
      }.bind(this));
    });
  }

  assembleCertificates(formData) {
    let certificates = [];
    let keys = formData.keys;
    for (let i = 0; i < keys.length; i++) {
      let
        caDeleteProp = `user_ca_hide_${i}`,
        caIdProp = `user_ca_id_${i}`,
        caNameProp = `user_ca_name_${i}`,
        caPicKeyProp = `user_certificate_pic_${i}_key`;

      if (this.state[caDeleteProp]) {
        delete formData[caNameProp];
        continue;
      }

      let caObj = {
        _id: this.state[caIdProp],
        name: formData[caNameProp],
        user_certificate_pic: this.state[caPicKeyProp],
      };
      certificates.push(caObj);
      delete formData[caNameProp];
    }
    delete formData.keys;

    return certificates;
  }

  addCertificate() {
    certificateIndex++;
    this.getNewCaId(certificateIndex);

    const {form} = this.props;

    let keys = form.getFieldValue('keys');
    keys = keys.concat(certificateIndex);
    form.setFieldsValue({keys});

    let keyProps = `user_certificate_pic_${certificateIndex}_key`,
      filesProps = `user_certificate_pic_${certificateIndex}_files`,
      progressProps = `user_certificate_pic_${certificateIndex}_progress`;
    this.setState({
      [keyProps]: '',
      [filesProps]: [],
      [progressProps]: {},
    });
  }

  removeFirstCertificate(k) {
    this.setState({
      [`user_ca_id_${k}`]: '',
      [`user_ca_name_${k}`]: '',
      [`user_certificate_pic_${k}_key`]: '',
    });
  }

  removeCertificate(k) {
    let hideProp = `user_ca_hide_${k}`,
      caIdProp = `user_ca_id_${k}`;

    this.setState({[hideProp]: true});
    if (!this.state.isNew) {
      this.deleteUserCa(this.state.userId, this.state[caIdProp]);
    }
  }

  deleteUserCa(userId, userCaId) {
    api.ajax({
      url: api.user.deleteUserCertificate(userId, userCaId),
    }, function () {
      message.success('资格证书删除成功');
    });
  }

  getNewUserId() {
    api.ajax({url: api.user.genNewId()}, function (data) {
      let userId = data.res.user_id;
      this.setState({userId: userId});
      this.props.onSuccess({userId: userId});
    }.bind(this));
  }

  getNewCaId(index) {
    api.ajax({url: api.user.genCaNewId()}, function (data) {
      let caIdProp = `user_ca_id_${index}`;
      this.setState({[caIdProp]: data.res.user_ca_id});
    }.bind(this));
  }

  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const RadioGroup = Radio.Group;
    const Panel = Collapse.Panel;
    const {formItem12, formItemFour, selectStyle} = Layout;

    const {getFieldDecorator, getFieldValue} = this.props.form;
    getFieldDecorator('keys', {
      initialValue: [0],
    });

    let {
      userId,
    } = this.state;

    const certificateItems = getFieldValue('keys').map((k) => {
      let userCaIdProp = `user_ca_id_${k}`,
        hideProp = `user_ca_hide_${k}`;
      return (
        <Row className={this.state[hideProp] ? 'hide' : ''} key={k}>
          <Col span={8}>
            <FormItem {...formItemFour} label="证书名称">
              {getFieldDecorator(`user_ca_name_${k}`)(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="证件照" {...formItemFour}>
              <Qiniu prefix={`user_certificate_pic_${k}`}
                     saveKey={this.handleKey.bind(this)}
                     source={api.user.getCaUploadToken(this.state[userCaIdProp], 'user_certificate_pic')}
                     onDrop={this.onDrop.bind(this, `user_certificate_pic_${k}`)}
                     onUpload={this.onUpload.bind(this, `user_certificate_pic_${k}`)}>
                {this.renderImage(`user_certificate_pic_${k}`)}
              </Qiniu>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemFour}>
              {k === 0 ?
                <div>
                  {/*<Button size="small" type="ghost" icon="minus" className="mr15" onClick={() => this.removeFirstCertificate(k)}>删除</Button>*/}
                  <Button size="small" type="primary" icon="plus" onClick={() => this.addCertificate(k)}>添加</Button>
                </div>
                :
                <Button size="small" type="ghost" icon="minus" onClick={() => this.removeCertificate(k)}>删除</Button>
              }
            </FormItem>
          </Col>
        </Row>
      );
    });

    const emergencyPhone = getFieldDecorator('emergency_phone', {
      validate: [{
        rules: [{validator: FormValidator.validatePhone}],
        trigger: ['onBlur'],
      }, {
        rules: [{required: false, message: validator.required.phone}],
        trigger: 'onBlur',
      }],
    });

    const emailProps = getFieldDecorator('email', {
      validate: [{
        rules: [{type: 'email', message: validator.text.email}],
        trigger: ['onBlur', 'onChange'],
      }],
    });

    return (
      <Form horizontal>
        {getFieldDecorator('_id', {initialValue: userId})(
          <Input type="hidden"/>
        )}

        <Collapse defaultActiveKey={['1']}>
          <Panel header="员工信息" key="1">
            <Row type="flex">
              <Col span={6}>
                <FormItem label="姓名" {...formItemFour} required>
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
              <Col span={6}>
                <FormItem label="性别" {...formItemFour} required>
                  {getFieldDecorator('gender', {initialValue: '1'})(
                    <RadioGroup>
                      <Radio key="1" value="1">男士</Radio>
                      <Radio key="0" value="0">女士</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="手机" {...formItemFour} required>
                  {getFieldDecorator('phone', {
                    rules: [{
                      required: true,
                      message: validator.required.phone,
                    }, {validator: FormValidator.validatePhone}],
                    validateTrigger: 'onBlur',
                  })(
                    <Input type="number" placeholder="请输入手机号"/>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="身份证号" {...formItemFour} required>
                  {getFieldDecorator('id_card', {
                    rules: [{
                      required: true,
                      message: validator.required.idCard,
                    }, {validator: FormValidator.validateIdCard}],
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入身份证号"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row type="flex">
              <Col span={6}>
                <FormItem label="民族" {...formItemFour}>
                  {getFieldDecorator('nation')(
                    <Input placeholder="请输入民族"/>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="籍贯" {...formItemFour}>
                  {getFieldDecorator('native_place')(
                    <Input placeholder="请输入籍贯"/>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="通讯地址" {...formItem12}>
                  {getFieldDecorator('address')(
                    <Input placeholder="请输入其他介绍人"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row type="flex">
              <Col span={6}>
                <FormItem label="学历" {...formItemFour}>
                  {getFieldDecorator('degree', {initialValue: '本科'})(
                    <Select
                      {...selectStyle}>
                      {['小学', '初中', '高中', '专科', '本科', '硕士', '硕士', '博士']
                        .map((item) => <Option key={item}>{item}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="学校" {...formItemFour}>
                  {getFieldDecorator('school')(
                    <Input placeholder="请输入学校"/>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="专业" {...formItemFour}>
                  {getFieldDecorator('major')(
                    <Input placeholder="请输入专业"/>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="邮箱" {...formItemFour}>
                  <Input {...emailProps} placeholder="请输入邮箱"/>
                </FormItem>
              </Col>
            </Row>

            <Row type="flex">
              <Col span={6}>
                <FormItem label="紧急联系人" {...formItemFour}>
                  {getFieldDecorator('emergency_contact')(
                    <Input placeholder="请输入紧急联系人"/>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="联系人电话" {...formItemFour}>
                  <Input {...emergencyPhone} placeholder="请输入联系人电话"/>
                </FormItem>
              </Col>
            </Row>
          </Panel>

          <Panel header="资格证书" key="2">
            {certificateItems}
          </Panel>

          <Panel header="上传登记信息" key="3">
            <Row>
              <Col span={8}>
                <FormItem label="身份证正面" {...formItemFour}>
                  {getFieldDecorator('id_card_front_pic')(
                    <Input type="hidden"/>
                  )}
                  <Qiniu prefix="id_card_front_pic"
                         saveKey={this.handleKey.bind(this)}
                         source={api.user.getUploadToken(userId, 'id_card_front_pic')}
                         onDrop={this.onDrop.bind(this, 'id_card_front_pic')}
                         onUpload={this.onUpload.bind(this, 'id_card_front_pic')}>
                    {this.renderImage('id_card_front_pic')}
                  </Qiniu>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="身份证背面" {...formItemFour}>
                  {getFieldDecorator('id_card_back_pic')(
                    <Input type="hidden"/>
                  )}
                  <Qiniu prefix="id_card_back_pic"
                         saveKey={this.handleKey.bind(this)}
                         source={api.user.getUploadToken(userId, 'id_card_back_pic')}
                         onDrop={this.onDrop.bind(this, 'id_card_back_pic')}
                         onUpload={this.onUpload.bind(this, 'id_card_back_pic')}>
                    {this.renderImage('id_card_back_pic')}
                  </Qiniu>
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={8}>
                <FormItem label="个人信息登记表" {...formItemFour}>
                  {getFieldDecorator('registry_form_pic')(
                    <Input type="hidden"/>
                  )}
                  <Qiniu prefix="registry_form_pic"
                         saveKey={this.handleKey.bind(this)}
                         source={api.user.getUploadToken(userId, 'registry_form_pic')}
                         onDrop={this.onDrop.bind(this, 'registry_form_pic')}
                         onUpload={this.onUpload.bind(this, 'registry_form_pic')}>
                    {this.renderImage('registry_form_pic')}
                  </Qiniu>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="一寸证件照" {...formItemFour}>
                  {getFieldDecorator('id_photo_pic')(
                    <Input type="hidden"/>
                  )}
                  <Qiniu prefix="id_photo_pic"
                         saveKey={this.handleKey.bind(this)}
                         source={api.user.getUploadToken(userId, 'id_photo_pic')}
                         onDrop={this.onDrop.bind(this, 'id_photo_pic')}
                         onUpload={this.onUpload.bind(this, 'id_photo_pic')}>
                    {this.renderImage('id_photo_pic')}
                  </Qiniu>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="体检表" {...formItemFour}>
                  {getFieldDecorator('health_form_pic')(
                    <Input type="hidden"/>
                  )}
                  <Qiniu prefix="health_form_pic"
                         saveKey={this.handleKey.bind(this)}
                         source={api.user.getUploadToken(userId, 'health_form_pic')}
                         onDrop={this.onDrop.bind(this, 'health_form_pic')}
                         onUpload={this.onUpload.bind(this, 'health_form_pic')}>
                    {this.renderImage('health_form_pic')}
                  </Qiniu>
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={8}>
                <FormItem label="劳动合同" {...formItemFour}>
                  {getFieldDecorator('labor_contract_pic')(
                    <Input type="hidden"/>
                  )}
                  <Qiniu prefix="labor_contract_pic"
                         saveKey={this.handleKey.bind(this)}
                         source={api.user.getUploadToken(userId, 'labor_contract_pic')}
                         onDrop={this.onDrop.bind(this, 'labor_contract_pic')}
                         onUpload={this.onUpload.bind(this, 'labor_contract_pic')}>
                    {this.renderImage('labor_contract_pic')}
                  </Qiniu>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="原单位离职证明" {...formItemFour}>
                  {getFieldDecorator('leaving_certificate_pic')(
                    <Input type="hidden"/>
                  )}
                  <Qiniu prefix="leaving_certificate_pic"
                         saveKey={this.handleKey.bind(this)}
                         source={api.user.getUploadToken(userId, 'leaving_certificate_pic')}
                         onDrop={this.onDrop.bind(this, 'leaving_certificate_pic')}
                         onUpload={this.onUpload.bind(this, 'leaving_certificate_pic')}>
                    {this.renderImage('leaving_certificate_pic')}
                  </Qiniu>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="工资卡" {...formItemFour}>
                  {getFieldDecorator('pay_card_pic')(
                    <Input type="hidden"/>
                  )}
                  <Qiniu prefix="pay_card_pic"
                         saveKey={this.handleKey.bind(this)}
                         source={api.user.getUploadToken(userId, 'pay_card_pic')}
                         onDrop={this.onDrop.bind(this, 'pay_card_pic')}
                         onUpload={this.onUpload.bind(this, 'pay_card_pic')}>
                    {this.renderImage('pay_card_pic')}
                  </Qiniu>
                </FormItem>
              </Col>
            </Row>
          </Panel>
        </Collapse>

        <FormItem className="center mt30 mb14">
          <Button type="primary" className="mr15" onClick={this.handleNextStep}>下一步</Button>
          <Button type="ghost" onClick={this.handleSubmit}>保存退出</Button>
        </FormItem>
      </Form>
    );
  }
}

NewUserForm = Form.create()(NewUserForm);
export default NewUserForm;