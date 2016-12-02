import React from 'react'
import {message, Form, Icon, Row, Col, Input, Select, Button, Checkbox, Radio, TimePicker} from 'antd'
import UploadComponent from '../../base/BaseUpload'
import Layout from '../Layout'
import api from '../../../middleware/api'
import Qiniu from '../../../middleware/UploadQiniu'
import validator from '../../../middleware/validator'
import formatter from '../../../middleware/formatter'
import FormValidator from '../FormValidator'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const {formItemTwo, formItem12, formItemThree, formItemFour, selectStyle} = Layout;

let introducePicIndex = 0;

class EditCompanyForm extends UploadComponent {
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
    let {company} = this.props;
    this.setState({checkedMaintainTypeValues: company.maintain_types.split(',')});
    this.getProvinces();
    this.getCities(company.province);
    this.getCountries(company.province, company.city);
  }

  componentDidMount() {
    let {company} = this.props;
    this.setState({icon_pic_key: company.icon_pic, checkedMaintainTypeValues: company.maintain_types.split(',')});
    this.props.form.setFieldsValue({icon_pic: company.icon_pic});
    this.getImageUrl(api.system.getPublicPicUrl(company.icon_pic), 'icon_pic');
    this.getIntroducePics(company.introduce_pics);
  }

  onMaintainTypesChange(checkedValues) {
    this.setState({checkedMaintainTypeValues: checkedValues});
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
        message.error(validator.hasError);
        return;
      }

      values.introduce_pics = this.assembleIntroducePics(values);
      values.maintain_types = this.state.checkedMaintainTypeValues.join(',');
      values.service_start_time = (values.service_start_time instanceof Date) ? formatter.time(values.service_start_time, 'HH:mm') : values.service_start_time;
      values.service_end_time = (values.service_end_time instanceof Date) ? formatter.time(values.service_end_time, 'HH:mm') : values.service_end_time;

      api.ajax({
        url: api.company.edit(),
        type: 'POST',
        data: values
      }, function (data) {
        message.success('门店添加成功');
        this.props.cancelModal();
        location.hash = api.getHash();
      }.bind(this));
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

  handleProvinceChange(value) {
    this.getCities(value);
  }

  handleCityChange(value) {
    this.getCountries(this.state.province, value);
  }

  getProvinces() {
    api.ajax({url: api.system.getProvinces()}, (data) => {
      this.setState({provinces: data.res.province_list})
    });
  }

  getCities(province) {
    api.ajax({url: api.system.getCities(province)}, (data) => {
      this.setState({
        province: province,
        cities: data.res.city_list
      })
    });
  }

  getCountries(province, city) {
    api.ajax({url: api.system.getCountries(province, city)}, (data) => {
      this.setState({countries: data.res.country_list})
    });
  }

  getIntroducePics(introducePicIds) {
    let keys = [], stateObj = {};

    let ids = introducePicIds.split(',');
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
      [progressProps]: {}
    });
  }

  removeIntroducePics(k) {
    let hideProp = `introduce_pics_hide_${k}`;
    this.setState({[hideProp]: true});
  }

  render() {
    const {getFieldProps, getFieldValue} = this.props.form;
    const {company} = this.props;

    let {
      provinces,
      cities,
      countries,
      keys,
    } = this.state;

    getFieldProps('keys', {initialValue: keys});
    const introducePics = getFieldValue('keys').map((k) => {
      let hideProp = `introduce_pics_hide_${k}`;

      return (
        <Row className={this.state[hideProp] ? 'hide' : ''} key={k}>
          <Col span="12">
            <FormItem label="门店介绍" {...formItemFour} help="尺寸: 1080*1800px" labelCol={{span: 4}} wrapperCol={{span: 19}}>
              <Qiniu prefix={`introduce_pics_${k}`}
                     saveKey={this.handleKey.bind(this)}
                     source={api.system.getPublicPicUploadToken('introduce_pics')}
                     onDrop={this.onDrop.bind(this, `introduce_pics_${k}`)}
                     onUpload={this.onUpload.bind(this, `introduce_pics_${k}`)}>
                {this.renderImage(`introduce_pics_${k}`)}
              </Qiniu>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem {...formItemFour}>
              {k === 0 ?
                <div>
                  <Button size="small" type="primary" icon="plus" onClick={() => this.addIntroducePics(k)}>添加</Button>
                </div>
                :
                <Button size="small" type="ghost" icon="minus" onClick={() => this.removeIntroducePics(k)}>删除</Button>
              }
            </FormItem>
          </Col>
        </Row>
      );
    });

    const nameProps = getFieldProps('company_name', {
      initialValue: company.name,
      validate: [{
        rules: [{validator: FormValidator.notNull}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.notNull}],
        trigger: 'onBlur'
      }]
    });

    const servicePhone = getFieldProps('service_phone', {
      initialValue: company.service_phone,
      validate: [{
        rules: [{validator: FormValidator.validatePhoneOrTel}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.phone}],
        trigger: 'onBlur'
      }]
    });

    const adminPhone = getFieldProps('admin_phone', {
      initialValue: company.admin_phone,
      validate: [{
        rules: [{validator: FormValidator.validatePhone}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.phone}],
        trigger: 'onBlur'
      }]
    });

    const otherPhone = getFieldProps('other_phone', {
      initialValue: company.other_phone,
      validate: [{
        rules: [{validator: FormValidator.validatePhone}],
        trigger: ['onBlur']
      }, {
        rules: [{required: false, message: validator.required.phone}],
        trigger: 'onBlur'
      }]
    });
    const CheckboxGroup = Checkbox.Group;
    const MaintainTypesOptions = [
      {
        label: '新车销售',
        value: '6'
      }, {
        label: '保养',
        value: '2'
      }, {
        label: '机修',
        value: '3'
      }, {
        label: '钣金',
        value: '4'
      }, {
        label: '喷漆',
        value: '5'
      }, {
        label: '洗车',
        value: '7'
      }, {
        label: '美容',
        value: '1'
      }
    ];

    return (
      <Form horizontal>
        <Input type="hidden" {...getFieldProps('company_id', {initialValue: company._id})} />

        <Row type="flex">
          <Col span="24">
            <FormItem label="门店名称" {...formItem12} labelCol={{span: 2}} wrapperCol={{span: 21}} required>
              <Input {...nameProps} placeholder="请输入门店名称"/>
            </FormItem>
          </Col>
        </Row>

        <Row type="flex">
          <Col span="8">
            <FormItem label="省份" {...formItemThree} labelCol={{span: 6}} wrapperCol={{span: 17}} required>
              <Select
                {...getFieldProps('province', {initialValue: company.province})}
                onSelect={this.handleProvinceChange}
                placeholder="请选择省份"
                {...selectStyle}
                size="large">
                {provinces.map(province => <Option key={province.name}>{province.name}</Option>)}
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="城市" {...formItemThree} labelCol={{span: 4}} wrapperCol={{span: 18}} required>
              <Select
                {...getFieldProps('city', {initialValue: company.city})}
                onSelect={this.handleCityChange}
                placeholder="请选择城市"
                {...selectStyle}
                size="large">
                {cities.map(city => <Option key={city.name}>{city.name}</Option>)}
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="区县" {...formItemThree} labelCol={{span: 5}} wrapperCol={{span: 16}} required>
              <Select
                {...getFieldProps('country', {initialValue: company.country})}
                {...selectStyle}
                size="large"
                placeholder="请选择区县">
                {countries.map(country => <Option key={country.name}>{country.name}</Option>)}
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Row type="flex">
          <Col span="24">
            <FormItem label="门店地址" {...formItem12} labelCol={{span: 2}} wrapperCol={{span: 21}} required>
              <Input {...getFieldProps('address', {initialValue: company.address})} placeholder="请输入门店地址"/>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex">
          <Col span="24">
            <FormItem label="产值类型" {...formItem12} labelCol={{span: 2}} wrapperCol={{span: 21}} required>
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
          <Col span="12">
            <FormItem label="店总负责人" {...formItemTwo} labelCol={{span: 4}} wrapperCol={{span: 19}} required>
              <Input {...getFieldProps('admin_name', {initialValue: company.admin_name})} placeholder="请输入店总负责人"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="负责人电话" {...formItemTwo} labelCol={{span: 4}} wrapperCol={{span: 18}}>
              <Input {...adminPhone} placeholder="请输入负责人电话"/>
            </FormItem>
          </Col>
        </Row>

        <Row type="flex">
          <Col span="12">
            <FormItem label="其他联系人" {...formItemTwo} labelCol={{span: 4}} wrapperCol={{span: 19}}>
              <Input {...getFieldProps('other_name', {initialValue: company.other_name})} placeholder="请输入其他联系人"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="联系人电话" {...formItemTwo} labelCol={{span: 4}} wrapperCol={{span: 18}}>
              <Input {...otherPhone} placeholder="请输入联系人电话"/>
            </FormItem>
          </Col>
        </Row>

        <Row type="flex">
          <Col span="8">
            <FormItem label="服务电话" {...formItemTwo} labelCol={{span: 6}} wrapperCol={{span: 17}}>
              <Input {...servicePhone} placeholder="请输入服务电话"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="营业时间" {...formItemTwo} labelCol={{span: 6}} wrapperCol={{span: 18}}>
              <TimePicker {...getFieldProps('service_start_time', {initialValue: company.service_start_time ? company.service_start_time : '07:30'})} disabledMinutes={this.disabledMinutes.bind(this)} hideDisabledOptions format="HH:mm"/>
              -
              <TimePicker {...getFieldProps('service_end_time', {initialValue: company.service_end_time ? company.service_end_time : '17:30'})} disabledMinutes={this.disabledMinutes.bind(this)} hideDisabledOptions format="HH:mm"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="在App展示" labelCol={{span: 6}} wrapperCol={{span: 16}}>
              <RadioGroup {...getFieldProps('is_show_on_app', {initialValue: Number(company.is_show_on_app)})}>
                <Radio value={0}>否</Radio>
                <Radio value={1}>是</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <Row type="flex">
          <Col span="12">
            <FormItem label="门店照片" {...formItemFour} help="尺寸: 330*240px" labelCol={{span: 4}} wrapperCol={{span: 19}}>
              <Input type="hidden" {...getFieldProps('icon_pic')} />
              <Qiniu prefix="icon_pic"
                     saveKey={this.handleKey.bind(this)}
                     source={api.system.getPublicPicUploadToken('icon_pic')}
                     onDrop={this.onDrop.bind(this, 'icon_pic')}
                     onUpload={this.onUpload.bind(this, 'icon_pic')}>
                {this.renderImage('icon_pic')}
              </Qiniu>
            </FormItem>
          </Col>
        </Row>

        <Row type="flex">
          <Col span="24">
            <FormItem label="开户银行" {...formItem12} labelCol={{span: 2}} wrapperCol={{span: 21}}>
              <Input {...getFieldProps('bank_name', {initialValue: company.bank_name})} placeholder="请输入门店开户银行及支行信息"/>
            </FormItem>
          </Col>
        </Row>

        <Row type="flex">
          <Col span="12">
            <FormItem label="银行卡户主" {...formItemTwo} labelCol={{span: 4}} wrapperCol={{span: 19}}>
              <Input {...getFieldProps('bank_account_name', {initialValue: company.bank_account_name})} placeholder="请输入银行卡户主"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="银行卡卡号" {...formItemTwo} labelCol={{span: 4}} wrapperCol={{span: 18}}>
              <Input {...getFieldProps('bank_account_number', {initialValue: company.bank_account_number})} placeholder="请输入银行卡卡号"/>
            </FormItem>
          </Col>
        </Row>

        <Row type="flex">
          <Col span="24">
            <FormItem label="备注" {...formItemFour} labelCol={{span: 2}} wrapperCol={{span: 21}}>
              <Input {...getFieldProps('remark', {initialValue: company.remark})} type="textarea" placeholder="备注"/>
            </FormItem>
          </Col>
        </Row>

        {introducePics}

        <FormItem className="center mt30 mb14">
          <Button type="ghost" className="mr15" onClick={this.props.cancelModal}>取消</Button>
          <Button type="primary" onClick={this.handleSubmit}>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

EditCompanyForm = Form.create()(EditCompanyForm);
export default EditCompanyForm
