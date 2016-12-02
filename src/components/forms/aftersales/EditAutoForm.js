import React from 'react'
import {message, Form, Input, Button, Select, DatePicker, Row, Col} from 'antd'
import BaseAutoComponent from '../../base/BaseAuto'
import Layout from './Layout'
import api from '../../../middleware/api'
import formatter from '../../../middleware/formatter'
import Qiniu from '../../../middleware/UploadQiniu'
import validator from '../../../middleware/validator'
import FormValidator from '../FormValidator'

const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 售前售后车辆信息需要分开
 */
class NewAutoForm extends BaseAutoComponent {
  constructor(props) {
    super(props);
    this.state = {
      auto: [],
      brands: [],
      series: [],
      types: [],
      brands_name: '',
      series_name: '',
      types_name: '',
      outColor: [],
      auto_factory_id: '',
      vehicle_license_pic_front_token: '',
      vehicle_license_pic_back_token: '',
      vehicle_license_pic_front_files: [],
      vehicle_license_pic_back_files: [],
      vehicle_license_pic_front_progress: [],
      vehicle_license_pic_back_progress: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getAutoBrands();
    this.getPurchaseAutoDetail(this.props.customer_id, this.props.auto_id);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if(!!errors){
        message.error(validator.text.hasError);
        return;
      }
      values.register_date = formatter.date(values.register_date);

      api.ajax({
        url: api.editAuto(),
        type: 'POST',
        data: values
      }, function (data) {
        message.success('修改车辆成功');
        this.props.onSuccess();
        location.reload();
      }.bind(this));
    });
  }

  getPurchaseAutoDetail(customerId, autoId) {
    api.ajax({url: api.getAutoDetail(customerId, autoId)}, function (data) {
      let detail = data.res.detail,
        brandId = detail.auto_brand_id,
        seriesId = detail.auto_series_id;
      this.setState({
        auto: detail,
        auto_factory_id: detail.auto_factory_id,
        brands_name: detail.auto_brand_name,
        series_name: detail.auto_series_name,
        types_name: detail.auto_type_name
      });
      this.getAutoSeries(brandId);
      this.getAutoTypes(seriesId);
      this.getAutoImages(customerId, detail);
    }.bind(this))
  }

  getAutoImages(customerId, auto) {
    let autoId = auto._id;
    if (auto.vehicle_license_pic_front) {
      this.getUploadedImageUrl(customerId, autoId, 'vehicle_license_pic_front');
    }
    if (auto.vehicle_license_pic_back) {
      this.getUploadedImageUrl(customerId, autoId, 'vehicle_license_pic_back');
    }
  }

  getUploadedImageUrl(customerId, userAutoId, fileType) {
    this.getImageUrl(api.getAutoFileUrl(customerId, userAutoId, fileType), fileType);
  }

  render() {
    const {formItemLayout, buttonLayout, selectStyle} = Layout;
    const {getFieldProps} = this.props.form;
    const {
      customer_id,
      user_auto_id
    } = this.props;
    const {
      auto,
      auto_factory_id,
      brands_name,
      series_name,
      types_name,
      brands,
      series,
      types,
      outColor
    } = this.state;

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

    let autoTypeName = (Number(getFieldProps('auto_type_id').value) > 0) ? (brands_name + ' ' + series_name + ' ' + types_name) : (auto.auto_brand_name + ' ' + auto.auto_series_name + ' ' + auto.auto_type_name);

    return (
      <Form horizontal>
        <Input type="hidden" {...getFieldProps('_id', {initialValue: auto._id})}/>
        <Input type="hidden" {...getFieldProps('customer_id', {initialValue: auto.customer_id})}/>
        <Input type="hidden" {...getFieldProps('intention_id', {initialValue: auto.intention_id})}/>
        <Input type="hidden" {...getFieldProps('auto_factory_id', {initialValue: auto_factory_id})}/>

        <FormItem label="品牌" {...formItemLayout}>
          <Select showSearch
                  onSelect={this.handleBrandSelect}
                  optionFilterProp="children"
                  placeholder="请选择品牌"
                  notFoundContent="无法找到"
                  searchPlaceholder="输入品牌"
                  size="large" {...selectStyle}
            {...getFieldProps('auto_brand_id', {initialValue: auto.auto_brand_id})}>
            {brands.map(brand => <Option key={brand._id}>{brand.name}</Option>)}
          </Select>
        </FormItem>

        <FormItem label="车系" {...formItemLayout}>
          <Select onSelect={this.handleSeriesSelect}
                  size="large" {...selectStyle} {...getFieldProps('auto_series_id', {initialValue: auto.auto_series_id})}>
            <Option key="0">未知</Option>
            {series.map(series => <Option key={series._id}>{series.name}</Option>)}
          </Select>
        </FormItem>

        <FormItem label="车型" {...formItemLayout}>
          <Select
            onSelect={this.handleTypeSelect}
            {...getFieldProps('auto_type_id', {initialValue: auto.auto_type_id})}
            size="large" {...selectStyle}>
            <Option key="0">未知</Option>
            {types.map(type => <Option key={type._id}>{type.year} {type.version}</Option>)}
          </Select>
        </FormItem>

        <FormItem label="外观" {...formItemLayout}>
          <Select {...getFieldProps('out_color', {initialValue: auto.out_color})}
            size="large" {...selectStyle}>
            <Option key="0">未知</Option>
            {outColor.map(color => <Option key={color._id}>{color.name}</Option>)}
          </Select>
        </FormItem>

        <FormItem label="内饰" {...formItemLayout}>
          <Select {...getFieldProps('in_color', {initialValue: auto.in_color})}
            size="large" {...selectStyle}>
            <Option key="-1">未知</Option>
            <Option key="0">米</Option>
            <Option key="1">棕</Option>
            <Option key="2">黑</Option>
            <Option key="3">灰</Option>
            <Option key="4">红</Option>
            <Option key="5">蓝</Option>
            <Option key="6">白</Option>
          </Select>
        </FormItem>

        <FormItem label="车型名称" {...formItemLayout}>
          <Input {...getFieldProps('auto_type_name', {initialValue: autoTypeName})} placeholder="请输入车型描述"/>
        </FormItem>

        <FormItem label="车牌号" {...formItemLayout}>
          <Input {...plateNumProps} placeholder="请输入车牌号"/>
        </FormItem>

        <FormItem label="车辆型号" {...formItemLayout}>
          <Input {...getFieldProps('auto_type_num', {initialValue: auto.auto_type_num})} placeholder="如:SVW71617BM"/>
        </FormItem>

        <FormItem label="车架号" {...formItemLayout}>
          <Input {...getFieldProps('vin_num', {initialValue: auto.vin_num})}/>
        </FormItem>

        <FormItem label="发动机号" {...formItemLayout}>
          <Input {...getFieldProps('engine_num', {initialValue: auto.engine_num})} placeholder="请输入发动机号"/>
        </FormItem>

        <FormItem label="燃油" {...formItemLayout}>
          <Select
            {...getFieldProps('energy_type', {initialValue: auto.energy_type ? auto.energy_type.toString() : '-1'})}
            {...selectStyle}
            size="large"
            placeholder="请选择燃油类型">
            <Option key="-1">未知</Option>
            <Option key="0">汽油</Option>
            <Option key="1">柴油</Option>
            <Option key="2">新能源</Option>
          </Select>
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
            <Col span="10">
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
          <Input {...getFieldProps('remark', {initialValue: auto.remark})} type="textarea"/>
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button type="primary" onClick={this.handleSubmit}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}

NewAutoForm = Form.create()(NewAutoForm);
export default NewAutoForm
