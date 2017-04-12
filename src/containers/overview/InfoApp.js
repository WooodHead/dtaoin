import React from 'react';
import {Row, Col, Form, Button, Input, TimePicker, Switch, message} from 'antd';

import api from '../../middleware/api';
import formatter from '../../utils/DateFormatter';
import FormValidator from '../../utils/FormValidator';
import validator from '../../utils/validator';
import Layout from '../../utils/FormLayout';
import className from 'classnames';

import UploadComponent from '../../components/base/BaseUpload';
import Qiniu from '../../components/widget/UploadQiniu';

const FormItem = Form.Item;

let introducePicIndex = 0;

class InfoApp extends UploadComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: true,
      keys: [0],
      icon_pic_key: '',
      icon_pic_files: [],
      icon_pic_progress: {},
      introduce_pics_0_key: '',
      introduce_pics_0_files: [],
      introduce_pics_0_progress: {},
      checkedMaintainTypeValues: [],
    };

    [
      'disabledMinutes',
      'addIntroducePics',
      'removeIntroducePics',
      'handleIsEdit',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getPic();
  }

  getPic(Info) {
    let companyInfo = Info || this.props.companyInfo;

    if (!!companyInfo) {
      this.setState({
        icon_pic_key: companyInfo.icon_pic,
        checkedMaintainTypeValues: companyInfo.maintain_types.split(','),
      });
      this.props.form.setFieldsValue({icon_pic: companyInfo.icon_pic});

      if (!!companyInfo.icon_pic) {
        this.getImageUrl(api.system.getPublicPicUrl(companyInfo.icon_pic), 'icon_pic');
      }

      if (!!companyInfo.introduce_pics) {
        this.getIntroducePics(companyInfo.introduce_pics);
      }
    }
  }

  handleIsEdit() {
    this.getCompanyDetail(this.props.companyInfo._id);
    let {isEdit} = this.state;
    this.setState({
      isEdit: !isEdit,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }

      values.introduce_pics = this.assembleIntroducePics(values);
      values.maintain_types = this.state.checkedMaintainTypeValues.join(',');
      values.service_start_time = formatter.time(values.service_start_time, 'HH:mm') || values.service_start_time;
      values.service_end_time = formatter.time(values.service_end_time, 'HH:mm') || values.service_end_time;
      values.is_show_on_app = values.is_show_on_app ? 1 : 0;

      api.ajax({
        url: api.overview.editApp(),
        type: 'POST',
        data: values,
      }, data => {
        message.success('编辑成功');
        this.handleIsEdit();
        this.props.onSuccess(data.res.company._id);
      });
    });
  }

  getCompanyDetail(companyId) {
    api.ajax({url: api.overview.getCompanyDetail(companyId)}, data => {
      this.getPic(data.res.company);
    });
  }

  disabledMinutes() {
    const result = [];
    for (let i = 0; i < 60; i++) {
      result.push(i);
    }
    return result.filter(value => value % 5 !== 0);
  }

  addIntroducePics() {
    introducePicIndex++;

    const {form} = this.props;

    let keys = form.getFieldValue('keys');
    keys = keys.concat(introducePicIndex);
    form.setFieldsValue({keys});

    let keyProps = `introduce_pics_${introducePicIndex}_key`,
      filesProps = `introduce_pics_${introducePicIndex}_files`,
      progressProps = `introduce_pics_${introducePicIndex}_progress`;
    this.setState({
      [keyProps]: '',
      [filesProps]: [],
      [progressProps]: {},
    });
  }

  assembleIntroducePics(formData) {
    let pictures = [];
    let keys = formData.keys;
    for (let i = 0; i < keys.length; i++) {
      let
        deleteProp = `introduce_pics_hide_${i}`,
        picKeyProp = `introduce_pics_${i}_key`;

      if (this.state[deleteProp]) {
        continue;
      }

      pictures.push(this.state[picKeyProp]);
    }
    delete formData.keys;

    return pictures.join(',');
  }

  removeIntroducePics(k) {
    let hideProp = `introduce_pics_hide_${k}`;
    this.setState({[hideProp]: true});
  }

  getIntroducePics(introducePicIds) {
    let keys = [], stateObj = {};

    let ids = introducePicIds.split(',');

    //删除ids中''元素 否则会报错
    while ((ids.indexOf('') >= 0)) {
      ids.splice(ids.indexOf(''), 1);
    }

    if (ids.length > 0) {
      introducePicIndex = ids.length - 1;
      ids.map((id, index) => {
        keys.push(index);

        let picUrlProp = `introduce_pics_${index}`,
          picKeyProp = `introduce_pics_${index}_key`,
          picFilesProp = `introduce_pics_${index}_files`,
          picProgressProp = `introduce_pics_${index}_progress`;

        stateObj[picKeyProp] = id;
        stateObj[picFilesProp] = [];
        stateObj[picProgressProp] = {};
        this.setState(stateObj);

        this.getImageUrl(api.system.getPublicPicUrl(id), picUrlProp);
      });
    }

    this.setState({keys});
  }

  render() {
    let {getFieldDecorator, getFieldValue} = this.props.form;
    const {formItemThree, formItem12} = Layout;
    let {keys, isEdit} = this.state;
    let companyInfo = this.props.companyInfo || {};

    getFieldDecorator('keys', {initialValue: keys});

    const introducePics = getFieldValue('keys').map((k) => {
      let hideProp = `introduce_pics_hide_${k}`;
      return (
        <Row className={this.state[hideProp] ? 'hide' : ''} key={k}>
          <Col span={10}>
            <FormItem label="门店介绍" {...formItemThree} help="尺寸: 1080*1800px">
              <Qiniu
                prefix={`introduce_pics_${k}`}
                saveKey={this.handleKey.bind(this)}
                source={api.system.getPublicPicUploadToken('introduce_pics')}
                onDrop={this.onDrop.bind(this, `introduce_pics_${k}`)}
                onUpload={this.onUpload.bind(this, `introduce_pics_${k}`)}
              >
                {this.renderImage(`introduce_pics_${k}`)}
              </Qiniu>
            </FormItem>
          </Col>
          <Col span={10} className={isEdit ? '' : 'hide'}>
            {k === 0 ?
              <div>
                <Button size="small" type="primary" icon="plus" onClick={() => this.addIntroducePics(k)}>添加</Button>
              </div>
              :
              <Button size="small" type="ghost" icon="minus" onClick={() => this.removeIntroducePics(k)}>删除</Button>
            }
          </Col>
        </Row>
      );
    });

    const show = className({
      '': !isEdit,
      'hide': isEdit,
    });

    const inputShow = className({
      'hide': !isEdit,
      '': isEdit,
    });

    return (
      <div>
        <Form className={inputShow}>
          {getFieldDecorator('company_id', {initialValue: companyInfo._id})(
            <Input type="hidden"/>
          )}
          <Row>
            <Col span={10}>
              <FormItem label="客户端展示" {...formItemThree}>
                {getFieldDecorator('is_show_on_app', {
                  valuePropName: 'checked',
                  initialValue: Number(companyInfo.is_show_on_app) === 1,
                })(
                  <Switch checkedChildren={'启用'} unCheckedChildren={'停用'}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={10}>
              <FormItem label="服务电话" {...formItemThree}>
                {getFieldDecorator('service_phone', {
                  initialValue: companyInfo.service_phone,
                  rules: FormValidator.getRulePhoneOrTelNumber(),
                  validateTrigger: 'onBlur',
                })(
                  <Input placeholder="请输入服务电话"/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={10}>
              <FormItem label="营业时间" {...formItemThree}>
                <Col span={24}>
                  {getFieldDecorator('service_start_time', {initialValue: formatter.getMomentHHmm(companyInfo.service_start_time || '07:30')})(
                    <TimePicker disabledMinutes={this.disabledMinutes.bind(this)} hideDisabledOptions format="HH:mm"/>
                  )}
                  -
                  {getFieldDecorator('service_end_time', {initialValue: formatter.getMomentHHmm(companyInfo.service_end_time || '17:30')})(
                    <TimePicker disabledMinutes={this.disabledMinutes.bind(this)} hideDisabledOptions format="HH:mm"/>
                  )}
                </Col>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={20}>
              <FormItem label="门店照片" {...formItem12} help="尺寸: 330*240px">
                {getFieldDecorator('icon_pic')(
                  <Input type="hidden"/>
                )}
                <Qiniu
                  prefix="icon_pic"
                  saveKey={this.handleKey.bind(this)}
                  source={api.system.getPublicPicUploadToken('icon_pic')}
                  onDrop={this.onDrop.bind(this, 'icon_pic')}
                  onUpload={this.onUpload.bind(this, 'icon_pic')}
                >
                  {this.renderImage('icon_pic')}
                </Qiniu>
              </FormItem>
            </Col>
          </Row>
          {introducePics}

          <Row>
            <Col span={16}>
              <Col span={24} offset={4}>
                <div className="pull-left">
                  <Button type="primary" onClick={this.handleSubmit}>提交</Button>
                  <span className="ml10">
                  <Button type="dash" onClick={this.handleIsEdit}>取消编辑</Button>
                </span>
                </div>
              </Col>
            </Col>
          </Row>
        </Form>

        <Form className={show}>
          <Row>
            <Col span={10}>
              <FormItem label="客户端展示" {...formItemThree}>
                <span>{companyInfo.is_show_on_app == 1 ? '启用' : '停用'}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={10}>
              <FormItem label="服务电话" {...formItemThree}>
                <span>{companyInfo.service_phone}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={10}>
              <FormItem label="营业时间" {...formItemThree}>
                <span>{companyInfo.service_start_time || '07:30'}</span>
                -
                <span>{companyInfo.service_end_time || '17:30'}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={20}>
              <FormItem label="门店照片" {...formItem12} help="尺寸: 330*240px">
                {getFieldDecorator('icon_pic')(
                  <Input type="hidden"/>
                )}
                <Qiniu
                  prefix="icon_pic"
                  saveKey={this.handleKey.bind(this)}
                  source={api.system.getPublicPicUploadToken('icon_pic')}
                  onDrop={this.onDrop.bind(this, 'icon_pic')}
                  onUpload={this.onUpload.bind(this, 'icon_pic')}
                >
                  {this.renderImage('icon_pic')}
                </Qiniu>
              </FormItem>
            </Col>
          </Row>
          {introducePics}
          <Row>
            <Col span={16}>
              <Col span={24} offset={4}>
                <div className="pull-left">
                  <Button type="primary" onClick={this.handleIsEdit}>编辑</Button>
                </div>
              </Col>
            </Col>
          </Row>
        </Form>

      </div>
    );
  }
}

InfoApp = Form.create()(InfoApp);
export default InfoApp;
