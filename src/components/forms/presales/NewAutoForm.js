import React from 'react'
import {message, Icon, Form, Input, Button, Select, DatePicker, Row, Col} from 'antd'
import BaseAutoComponent from '../../base/BaseAuto'
import Layout from '../Layout'
import api from '../../../middleware/api'
import formatter from '../../../middleware/formatter'
import Qiniu from '../../../middleware/UploadQiniu'
import validator from '../../../middleware/validator'
import FormValidator from '../FormValidator'

const FormItem = Form.Item;
const Option = Select.Option;

class NewAutoForm extends BaseAutoComponent {
  constructor(props) {
    super(props);
    this.state = {
      isNew: true,
      auto: [],
      brands: [],
      series: [],
      types: [],
      outColor: [],
      auto_factory_id: '',
      vehicle_license_pic_front_files: [],
      vehicle_license_pic_back_files: [],
      vehicle_license_pic_front_progress: [],
      vehicle_license_pic_back_progress: []
    };
    [
      'handleNextStep',
      'handleSubmit'
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getIntentionAutoDetail();
    this.getAutoBrands();
  }

  handleNextStep(e) {
    e.preventDefault();
    this.handleSubmit(e, 'NEXT');
  }

  handleSubmit(e, action) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('填写的表单内容有误,请检查必填信息或数据格式');
        return;
      }
      values.register_date = formatter.date(values.register_date);

      api.ajax({
        url: this.state.isNew ? api.addAuto() : api.editAuto(),
        type: 'POST',
        data: values
      }, function (data) {
        message.success(this.state.isNew ? '车辆信息添加成功' : '车辆信息修改成功');
        this.setState({isNew: false});
        this.props.onSuccess(data.res);
        if (action === 'NEXT') {
          this.props.onSuccess({
            currentStep: this.props.nextStep,
            autoForm: 'hide',
            purchaseForm: ''
          });
        } else {
          this.props.cancelModal();
          this.props.isSingle ? location.reload() : location.hash = api.getHash();
        }
      }.bind(this));
    });
  }

  getIntentionAutoDetail() {
    api.ajax({url: api.getIntentionAutoInfo(this.props.customer_id, this.props.intention_id)}, function (data) {
      let intention = data.res.detail;
      if (intention) {
        this.setState({
          isNew: false,
          auto: intention,
          auto_factory_id: intention.auto_factory_id
        });
        this.props.onSuccess({user_auto_id: intention._id});

        this.getAutoSeries(intention.auto_brand_id);
        this.getAutoTypes(intention.auto_series_id);
      } else {
        this.getNewAutoId();
        this.getIntentionDetail(this.props.customer_id, this.props.intention_id)
      }
    }.bind(this));
  }

  getIntentionDetail(customerId, intentionId) {
    api.ajax({url: api.autoIntentionDetail(customerId, intentionId)}, function (data) {
      let intentionInfo = data.res.intention_info;
      this.setState({
        auto: intentionInfo,
        auto_factory_id: intentionInfo.auto_factory_id
      });
      this.getAutoSeries(intentionInfo.auto_brand_id);
      this.getAutoTypes(intentionInfo.auto_series_id);
    }.bind(this))
  }

  getNewAutoId() {
    api.ajax({url: api.generateNewAutoId()}, function (data) {
      this.props.onSuccess(data.res);
    }.bind(this))
  }

  render() {
    const {formItemLayout, buttonLayout, selectStyle} = Layout;
    const {getFieldProps} = this.props.form;
    const {customer_id, user_auto_id} = this.props;
    const {auto} = this.state;

    const plateNumProps = getFieldProps('plate_num', {
      initialValue: auto.plate_num,
      validate: [{
        rules: [{validator: FormValidator.validatePlateNumber}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.plateNumber}],
        trigger: 'onBlur'
      }]
    });

    return (
      <Form horizontal >
        <Input type="hidden" {...getFieldProps('_id', {initialValue: this.props.user_auto_id})}/>
        <Input type="hidden" {...getFieldProps('customer_id', {initialValue: this.props.customer_id})}/>
        <Input type="hidden" {...getFieldProps('intention_id', {initialValue: this.props.intention_id})}/>
        <Input type="hidden" {...getFieldProps('auto_factory_id', {initialValue: this.state.auto_factory_id})}/>

        <FormItem label="品牌" {...formItemLayout}>
          <Select showSearch
                  onSelect={this.handleBrandSelect}
                  optionFilterProp="children"
                  placeholder="请选择品牌"
                  notFoundContent="无法找到"
                  searchPlaceholder="输入品牌"
                  size="large" {...selectStyle}
                  {...getFieldProps('auto_brand_id', {initialValue: auto.auto_brand_id})} disabled>
            {this.state.brands.map(brand => <Option key={brand._id}>{brand.name}</Option>)}
          </Select>
        </FormItem>

        <FormItem label="车系" {...formItemLayout}>
          <Select onSelect={this.handleSeriesSelect}
                  size="large" {...selectStyle}
                  {...getFieldProps('auto_series_id', {initialValue: auto.auto_series_id})} disabled>
            {this.state.series.map(series => <Option key={series._id}>{series.name}</Option>)}
          </Select>
        </FormItem>

        <FormItem label="车型" {...formItemLayout}>
          <Select
            {...getFieldProps('auto_type_id', {initialValue: auto.auto_type_id})}
            {...selectStyle}
            size="large" disabled>
            {this.state.types.map(type => <Option key={type._id}>{type.year} {type.version}</Option>)}
          </Select>
        </FormItem>

        <FormItem label="外观" {...formItemLayout}>
          <Select {...getFieldProps('out_color', {initialValue: auto.out_color})}
                  size="large" {...selectStyle}>
            <Option key="0">不限</Option>
            {this.state.outColor.map(color => <Option key={color._id}>{color.name}</Option>)}
          </Select>
        </FormItem>

        <FormItem label="内饰" {...formItemLayout}>
          <Select {...getFieldProps('in_color', {initialValue: auto.in_color || '-1'})}
                  size="large" {...selectStyle}>
            <Option key="-1">不限</Option>
            <Option key="0">米</Option>
            <Option key="1">棕</Option>
            <Option key="2">黑</Option>
            <Option key="3">灰</Option>
            <Option key="4">红</Option>
            <Option key="5">蓝</Option>
            <Option key="6">白</Option>
          </Select>
        </FormItem>

        <FormItem label="车辆型号" {...formItemLayout}>
          <Input {...getFieldProps('auto_type_num', {initialValue: auto.auto_type_num})} placeholder="如:SVW71617BM"/>
        </FormItem>

        <FormItem label="来源4S店" {...formItemLayout}>
          <Input {...getFieldProps('source_4s', {initialValue: auto.source_4s})} placeholder="请输入来源4S店"/>
        </FormItem>

        <FormItem label="车架号" {...formItemLayout}>
          <Input {...getFieldProps('vin_num', {initialValue: auto.vin_num})} placeholder="请输入车架号"/>
        </FormItem>

        <FormItem label="发动机号" {...formItemLayout}>
          <Input {...getFieldProps('engine_num', {initialValue: auto.engine_num})} placeholder="请输入发动机号"/>
        </FormItem>

        <FormItem label="车牌号" {...formItemLayout}>
          <Input {...plateNumProps} placeholder="请输入车牌号"/>
        </FormItem>

        <FormItem label="初登日期" {...formItemLayout}>
          <DatePicker {...getFieldProps('register_date', {initialValue: auto.register_date ? auto.register_date : new Date()})}
                      placeholder="请选择初登日期"/>
        </FormItem>

        <FormItem label="行驶证照片" {...formItemLayout}>
          <Row>
            <Col span="10">
              <Input type="hidden" {...getFieldProps('vehicle_license_pic_front')} />
              <Qiniu
                prefix="vehicle_license_pic_front"
                saveKey={this.handleKey.bind(this)}
                source={api.getAutoUploadToken(customer_id, user_auto_id, 'vehicle_license_pic_front')}
                onDrop={this.onDrop.bind(this, 'vehicle_license_pic_front')}
                onUpload={this.onUpload.bind(this, 'vehicle_license_pic_front')}>
                {this.renderImage('vehicle_license_pic_front')}
              </Qiniu>
            </Col>
            <Col span="10" className="hide">
              <Input type="hidden" {...getFieldProps('vehicle_license_pic_back')} />
              <Qiniu
                prefix="vehicle_license_pic_back"
                saveKey={this.handleKey.bind(this)}
                source={api.getAutoUploadToken(customer_id, user_auto_id, 'vehicle_license_pic_back')}
                onDrop={this.onDrop.bind(this, 'vehicle_license_pic_back')}
                onUpload={this.onUpload.bind(this, 'vehicle_license_pic_back')}>
                {this.renderImage('vehicle_license_pic_back')}
              </Qiniu>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          <Input {...getFieldProps('remark', {initialValue: auto.remark})} type="textarea" placeholder="备注"/>
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button type="primary" className={this.props.isSingle ? 'hide' : 'mr15'}
                  onClick={this.handleNextStep}>下一步</Button>
          <Button type={this.props.isSingle ? 'primary' : 'ghost'} onClick={this.handleSubmit}>保存并退出</Button>
        </FormItem>
      </Form>
    )
  }
}

NewAutoForm = Form.create()(NewAutoForm);
export default NewAutoForm
