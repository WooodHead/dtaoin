import React from 'react';
import { message, Form, Row, Col, Input, Select, Button, Checkbox, Radio, TimePicker } from 'antd';

import UploadComponent from '../../components/base/BaseUpload';
import Qiniu from '../../components/widget/UploadQiniu';

import api from '../../middleware/api';
import Layout from '../../utils/FormLayout';
import validator from '../../utils/validator';
import formatter from '../../utils/DateFormatter';
import FormValidator from '../../utils/FormValidator';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
const { formItem12, formItemThree, selectStyle } = Layout;

let introducePicIndex = 0;

class EditForm extends UploadComponent {
  constructor(props) {
    super(props);
    this.state = {
      provinces: [],
      cities: [],
      countries: [],
      keys: [0],
      checkedMaintainTypeValues: [],
      icon_pic_key: '',
      icon_pic_files: [],
      icon_pic_progress: {},
      introduce_pics_0_key: '',
      introduce_pics_0_files: [],
      introduce_pics_0_progress: {},
    };

    [
      'handleSubmit',
      'handleProvinceChange',
      'handleCityChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    const { company } = this.props;
    this.setState({ checkedMaintainTypeValues: company.maintain_types.split(',') });
    this.getProvinces();
    this.getCities(company.province);
    this.getCountries(company.province, company.city);
  }

  componentDidMount() {
    const { company } = this.props;
    this.setState({ icon_pic_key: company.icon_pic, checkedMaintainTypeValues: company.maintain_types.split(',') });
    this.props.form.setFieldsValue({ icon_pic: company.icon_pic });

    if (!!company.icon_pic) {
      this.getImageUrl(api.system.getPublicPicUrl(company.icon_pic), 'icon_pic');
    }

    if (!!company.introduce_pics) {
      this.getIntroducePics(company.introduce_pics);
    }
  }

  onMaintainTypesChange(checkedValues) {
    this.setState({ checkedMaintainTypeValues: checkedValues });
  }

  disabledMinutes() {
    const result = [];
    for (let i = 0; i < 60; i++) {
      result.push(i);
    }
    return result.filter(value => value % 5 !== 0);
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
      // values.service_start_time = (values.service_start_time instanceof Date) ? formatter.time(values.service_start_time, 'HH:mm') : values.service_start_time;
      // values.service_end_time = (values.service_end_time instanceof Date) ? formatter.time(values.service_end_time, 'HH:mm') : values.service_end_time;

      values.service_start_time = formatter.time(values.service_start_time, 'HH:mm') || values.service_start_time;
      values.service_end_time = formatter.time(values.service_end_time, 'HH:mm') || values.service_end_time;


      api.ajax({
        url: api.company.edit(),
        type: 'POST',
        data: values,
      }, () => {
        message.success('编辑成功');
        this.props.onSuccess();
        this.props.cancelModal();
      });
    });
  }

  assembleIntroducePics(formData) {
    const pictures = [];
    const keys = formData.keys;
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

  handleProvinceChange(value) {
    this.getCities(value);
  }

  handleCityChange(value) {
    this.getCountries(this.state.province, value);
  }

  getProvinces() {
    api.ajax({ url: api.system.getProvinces() }, data => {
      this.setState({ provinces: data.res.province_list });
    });
  }

  getCities(province) {
    api.ajax({ url: api.system.getCities(province) }, data => {
      this.setState({
        province,
        cities: data.res.city_list,
      });
    });
  }

  getCountries(province, city) {
    api.ajax({ url: api.system.getCountries(province, city) }, data => {
      this.setState({ countries: data.res.country_list });
    });
  }

  getIntroducePics(introducePicIds) {
    let keys = [], stateObj = {};

    const ids = introducePicIds.split(',');

    // 删除ids中''元素 否则会报错
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

    this.setState({ keys });
  }

  addIntroducePics() {
    introducePicIndex++;

    const { form } = this.props;

    let keys = form.getFieldValue('keys');
    keys = keys.concat(introducePicIndex);
    form.setFieldsValue({ keys });

    let keyProps = `introduce_pics_${introducePicIndex}_key`,
      filesProps = `introduce_pics_${introducePicIndex}_files`,
      progressProps = `introduce_pics_${introducePicIndex}_progress`;
    this.setState({
      [keyProps]: '',
      [filesProps]: [],
      [progressProps]: {},
    });
  }

  removeIntroducePics(k) {
    const hideProp = `introduce_pics_hide_${k}`;
    this.setState({ [hideProp]: true });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { company } = this.props;

    const {
      provinces,
      cities,
      countries,
      keys,
    } = this.state;

    const notNullValidator = {
      rules: [{
        required: true,
        message: validator.required.notNull,
      }, { validator: FormValidator.notNull }],
      validateTrigger: 'onBlur',
    };

    getFieldDecorator('keys', { initialValue: keys });

    const introducePics = getFieldValue('keys').map(k => {
      const hideProp = `introduce_pics_hide_${k}`;

      return (
        <Row className={this.state[hideProp] ? 'hide' : ''} key={k}>
          <Col span={8}>
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
          <Col span={8}>
            {k === 0 ?
              <div>
                <Button size="small" type="primary" icon="plus"
                        onClick={() => this.addIntroducePics(k)}>添加</Button>
              </div>
              :
              <Button size="small" type="ghost" icon="minus"
                      onClick={() => this.removeIntroducePics(k)}>删除</Button>
            }
          </Col>
        </Row>
      );
    });

    const CheckboxGroup = Checkbox.Group;
    const MaintainTypesOptions = [
      {
        label: '新车销售',
        value: '6',
      }, {
        label: '保养',
        value: '2',
      }, {
        label: '维修',
        value: '3',
      }, {
        label: '钣金',
        value: '4',
      }, {
        label: '喷漆',
        value: '5',
      }, {
        label: '洗车',
        value: '7',
      }, {
        label: '美容',
        value: '1',
      },
    ];

    return (
      <Form>
        {getFieldDecorator('company_id', { initialValue: company._id })(
          <Input type="hidden"/>
        )}

        <Row type="flex">
          <Col span={16}>
            <FormItem label="门店名称" {...formItem12}>
              {getFieldDecorator('company_name', {
                initialValue: company.name,
                ...notNullValidator,
              })(
                <Input placeholder="请输入门店名称"/>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row type="flex">
          <Col span={8}>
            <FormItem label="省份" {...formItemThree}>
              {getFieldDecorator('province', {
                initialValue: company.province,
                ...notNullValidator,
              })(
                <Select
                  onSelect={this.handleProvinceChange}
                  placeholder="请选择省份"
                  {...selectStyle}
                  disabled
                >
                  {provinces.map(province => <Option key={province.name}>{province.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="城市" {...formItemThree}>
              {getFieldDecorator('city', {
                initialValue: company.city,
                ...notNullValidator,
              })(
                <Select
                  onSelect={this.handleCityChange}
                  placeholder="请选择城市"
                  {...selectStyle}
                  disabled
                >
                  {cities.map(city => <Option key={city.name}>{city.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="区县" {...formItemThree}>
              {getFieldDecorator('country', {
                initialValue: company.country,
                ...notNullValidator,
              })(
                <Select
                  {...selectStyle}
                  placeholder="请选择区县"
                  disabled
                >
                  {countries.map(country => <Option key={country.name}>{country.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row type="flex">
          <Col span={16}>
            <FormItem label="门店地址" {...formItem12}>
              {getFieldDecorator('address', {
                initialValue: company.address,
                ...notNullValidator,
              })(
                <Input placeholder="请输入门店地址"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={16}>
            <FormItem label="产值类型" {...formItem12} required>
              <CheckboxGroup
                className="mb10"
                options={MaintainTypesOptions}
                defaultValue={this.state.checkedMaintainTypeValues}
                onChange={this.onMaintainTypesChange.bind(this)}
              />
            </FormItem>
          </Col>
        </Row>

        <Row type="flex">
          <Col span={8}>
            <FormItem label="店总负责人" {...formItemThree}>
              {getFieldDecorator('admin_name', {
                initialValue: company.admin_name,
                ...notNullValidator,
              })(
                <Input placeholder="请输入店总负责人"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="负责人电话" {...formItemThree}>
              {getFieldDecorator('admin_phone', {
                initialValue: company.admin_phone,
                rules: FormValidator.getRulePhoneNumber(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入负责人电话"/>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row type="flex">
          <Col span={8}>
            <FormItem label="其他联系人" {...formItemThree}>
              {getFieldDecorator('other_name', { initialValue: company.other_name })(
                <Input placeholder="请输入其他联系人"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="联系人电话" {...formItemThree}>
              {getFieldDecorator('other_phone', {
                initialValue: company.other_phone,
                rules: FormValidator.getRulePhoneNumber(false),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入联系人电话"/>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row type="flex">
          <Col span={8}>
            <FormItem label="服务电话" {...formItemThree}>
              {getFieldDecorator('service_phone', {
                initialValue: company.service_phone,
                rules: FormValidator.getRulePhoneOrTelNumber(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入服务电话"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="营业时间" {...formItemThree}>
              {getFieldDecorator('service_start_time', { initialValue: company.service_start_time ? formatter.getMomentHHmm(company.service_start_time) : formatter.getMomentHHmm('07:30') })(
                <TimePicker
                  disabledMinutes={this.disabledMinutes.bind(this)}
                  hideDisabledOptions
                  format={formatter.pattern.HHmm}
                />
              )}
              -
              {getFieldDecorator('service_end_time', { initialValue: company.service_end_time ? formatter.getMomentHHmm(company.service_end_time) : formatter.getMomentHHmm('17:30') })(
                <TimePicker
                  disabledMinutes={this.disabledMinutes.bind(this)}
                  hideDisabledOptions
                  format={formatter.pattern.HHmm}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="在App展示" {...formItemThree}>
              {getFieldDecorator('is_show_on_app', { initialValue: Number(company.is_show_on_app) })(
                <RadioGroup>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row type="flex">
          <Col span={16}>
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

        <Row type="flex">
          <Col span={16}>
            <FormItem label="开户银行" {...formItem12}>
              {getFieldDecorator('bank_name', { initialValue: company.bank_name })(
                <Input placeholder="请输入门店开户银行及支行信息"/>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row type="flex">
          <Col span={8}>
            <FormItem label="银行卡户主" {...formItemThree}>
              {getFieldDecorator('bank_account_name', { initialValue: company.bank_account_name })(
                <Input placeholder="请输入银行卡户主"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="银行卡卡号" {...formItemThree}>
              {getFieldDecorator('bank_account_number', { initialValue: company.bank_account_number })(
                <Input placeholder="请输入银行卡卡号"/>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row type="flex">
          <Col span={16}>
            <FormItem label="备注" {...formItem12}>
              {getFieldDecorator('remark', { initialValue: company.remark })(
                <TextArea placeholder="备注"/>
              )}
            </FormItem>
          </Col>
        </Row>

        {introducePics}

        <FormItem className="center mt30 mb15">
          <Button type="ghost" className="mr15" onClick={this.props.cancelModal}>取消</Button>
          <Button type="primary" onClick={this.handleSubmit}>提交</Button>
        </FormItem>
      </Form>
    );
  }
}

EditForm = Form.create()(EditForm);
export default EditForm;
