import React from 'react';
import {message, Form, Input, Button, Select, DatePicker, Row, Col, Collapse} from 'antd';
import BaseAutoComponent from '../../base/BaseAuto';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';
import Qiniu from '../../UploadQiniu';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;

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
      vehicle_license_pic_front_files: [],
      vehicle_license_pic_back_files: [],
      vehicle_license_pic_front_progress: [],
      vehicle_license_pic_back_progress: [],
      autoTypeNameDisable: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    let {customer_id, auto_id} = this.props;
    this.getAutoBrands();
    this.getPurchaseAutoDetail(customer_id, auto_id);
  }

  // componentWillReceiveProps(nextProps) {
  //   let {customer_id, auto_id} = nextProps;
  //   this.getAutoBrands();
  //   this.getPurchaseAutoDetail(customer_id, auto_id);
  // }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }

      /*if(values.auto_type_id > 0) {
        values.auto_type_name = '';
      }*/

      values.register_date = formatter.date(values.register_date);

      api.ajax({
          url: (!!values._id ? api.auto.add() : api.auto.edit()),
          type: 'POST',
          data: values,
        },
        () => {
          // (data) => {
          message.success('修改车辆成功');
          this.props.cancelModal();

          location.reload();
        });
    });
  }

  getPurchaseAutoDetail(customerId, autoId) {
    api.ajax({url: api.auto.detail(customerId, autoId)}, function (data) {
      let detail = data.res.detail,
        brandId = detail.auto_brand_id,
        seriesId = detail.auto_series_id;
      this.setState({
        auto: detail,
        auto_factory_id: detail.auto_factory_id,
        brands_name: detail.auto_brand_name,
        series_name: detail.auto_series_name,
        types_name: detail.auto_type_name,
        autoTypeNameDisable: detail.auto_type_id > 0,
      });
      if (detail.vehicle_license_pic_front) {
        this.props.form.setFieldsValue({vehicle_license_pic_front: detail.vehicle_license_pic_front});
      }
      if (detail.vehicle_license_pic_back) {
        this.props.form.setFieldsValue({vehicle_license_pic_back: detail.vehicle_license_pic_back});
      }
      this.getAutoSeries(brandId);
      this.getAutoTypes(seriesId);
      this.getAutoImages(customerId, detail);
    }.bind(this));
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
    this.getImageUrl(api.auto.getFileUrl(customerId, userAutoId, fileType), fileType);
  }

  render() {
    const {formItemLayout, buttonLayout, selectStyle} = Layout;
    const {getFieldDecorator} = this.props.form;
    const {customer_id, auto_id} = this.props;
    const {
      auto_factory_id,
      auto,
      brands,
      series,
      types,
      outColor,
      // brands_name,
      // series_name,
      // types_name,
    } = this.state;

    // const plateNumProps = getFieldProps('plate_num', {
    //   initialValue: auto.plate_num,
    //   validate: [{
    //     rules: [{validator: FormValidator.validatePlateNumber}],
    //     trigger: ['onBlur'],
    //   }, {
    //     rules: [{required: true, message: validator.required.plateNumber}],
    //     trigger: 'onBlur',
    //   }],
    // });

    // let autoTypeName = (Number(getFieldProps('auto_type_id').value) > 0) ? (brands_name + ' ' + series_name + ' ' + types_name) : (auto.auto_brand_name + ' ' + auto.auto_series_name + ' ' + auto.auto_type_name);
    // let autoTypeName = (brands_name + ' ' + series_name + ' ' + types_name);

    return (
      <Form horizontal>
        {getFieldDecorator('_id', {initialValue: auto._id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('customer_id', {initialValue: customer_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('intention_id', {initialValue: auto.intention_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('auto_factory_id', {initialValue: auto_factory_id})(
          <Input type="hidden"/>
        )}

        <Collapse defaultActiveKey={['1']}>
          <Panel header="基本信息" key="1">
            <FormItem label="车牌号" {...formItemLayout}>
              {getFieldDecorator('plate_num', {
                initialValue: auto.plate_num,
                validate: [{
                  rules: [{validator: FormValidator.validatePlateNumber}],
                  trigger: ['onBlur'],
                }, {
                  rules: [{required: true, message: validator.required.plateNumber}],
                  trigger: 'onBlur',
                }],
              })(
                <Input />
              )}
            </FormItem>

            <FormItem label="品牌" {...formItemLayout}>
              {getFieldDecorator('auto_brand_id', {initialValue: auto.auto_brand_id})(
                <Select
                  showSearch
                  onSelect={this.handleBrandSelect}
                  optionFilterProp="children"
                  placeholder="请选择品牌"
                  notFoundContent="无法找到"
                  searchPlaceholder="输入品牌"
                  {...selectStyle}
                >
                  {brands.map(brand => <Option key={brand._id}>{brand.name}</Option>)}
                </Select>
              )}
            </FormItem>

            <FormItem label="车系" {...formItemLayout}>
              {getFieldDecorator('auto_series_id', {initialValue: auto.auto_series_id})(
                <Select onSelect={this.handleSeriesSelect} {...selectStyle}>
                  <Option key="0">不限</Option>
                  {series.map(series => <Option key={series._id}>{series.name}</Option>)}
                </Select>
              )}
            </FormItem>

            <FormItem label="车型" {...formItemLayout}>
              {getFieldDecorator('auto_type_id', {initialValue: auto.auto_type_id})(
                <Select onSelect={this.handleTypeSelect} {...selectStyle}>
                  <Option key="0">不限</Option>
                  {types.map(type => <Option key={type._id}>{type.year} {type.version}</Option>)}
                </Select>
              )}
            </FormItem>

            <FormItem label="车型名称" {...formItemLayout}>
              {/*<Input {...getFieldProps('auto_type_name', {initialValue: autoTypeName})} placeholder="请输入车型描述"/>*/}
              {/*<Input {...getFieldProps('auto_type_name', {initialValue: types_name})} placeholder="请输入车型描述" disabled={this.state.autoTypeNameDisable}/>*/}
              {getFieldDecorator('auto_type_name', {initialValue: ''})(
                <Input placeholder="请输入车型描述" disabled={this.state.autoTypeNameDisable}/>
              )}
            </FormItem>

            <FormItem label="外观" {...formItemLayout}>
              {getFieldDecorator('out_color', {initialValue: auto.out_color})(
                <Select {...selectStyle}>
                  <Option key="0">不限</Option>
                  {outColor.map(color => <Option key={color._id}>{color.name}</Option>)}
                </Select>
              )}
            </FormItem>

            <FormItem label="车架号" {...formItemLayout}>
              {getFieldDecorator('vin_num', {initialValue: auto.vin_num})(
                <Input/>
              )}
            </FormItem>

            <FormItem label="发动机号" {...formItemLayout}>
              {getFieldDecorator('engine_num', {initialValue: auto.engine_num})(
                <Input/>
              )}
            </FormItem>


            <FormItem label="燃油" {...formItemLayout}>
              {getFieldDecorator('energy_type', {initialValue: auto.energy_type ? auto.energy_type.toString() : '-1'})(
                <Select {...selectStyle}>
                  <Option key="-1">未知</Option>
                  <Option key="0">汽油</Option>
                  <Option key="1">柴油</Option>
                  <Option key="2">新能源</Option>
                </Select>
              )}
            </FormItem>
          </Panel>

          <Panel header="其它信息" key="2">
            <FormItem label="初登日期" {...formItemLayout}>
              {getFieldDecorator('register_date', {initialValue: auto.register_date ? formatter.getMomentDate(auto.register_date) : formatter.getMomentDate()})(
                <DatePicker />
              )}
            </FormItem>

            <FormItem label="内饰" {...formItemLayout}>
              {getFieldDecorator('in_color', {initialValue: auto.in_color})(
                <Select {...selectStyle}>
                  <Option key="-1">不限</Option>
                  <Option key="0">米</Option>
                  <Option key="1">棕</Option>
                  <Option key="2">黑</Option>
                  <Option key="3">灰</Option>
                  <Option key="4">红</Option>
                  <Option key="5">蓝</Option>
                  <Option key="6">白</Option>
                </Select>
              )}
            </FormItem>

            <FormItem label="来源4S" {...formItemLayout}>
              {getFieldDecorator('source_4s', {initialValue: auto.source_4s})(
                <Input />
              )}
            </FormItem>

            <FormItem label="车辆型号" {...formItemLayout}>
              {getFieldDecorator('auto_type_num', {initialValue: auto.auto_type_num})(
                <Input placeholder="如:SVW71617BM"/>
              )}
            </FormItem>

            <FormItem label="行驶证照片" {...formItemLayout}>
              <Row>
                <Col span={10}>
                  {getFieldDecorator('vehicle_license_pic_front')(
                    <Input type="hidden"/>
                  )}
                  <Qiniu
                    prefix="vehicle_license_pic_front"
                    saveKey={this.handleKey.bind(this)}
                    source={api.auto.getUploadToken(customer_id, auto_id, 'vehicle_license_pic_front')}
                    onDrop={this.onDrop.bind(this, 'vehicle_license_pic_front')}
                    onUpload={this.onUpload.bind(this, 'vehicle_license_pic_front')}>
                    {this.renderImage('vehicle_license_pic_front')}
                  </Qiniu>
                </Col>
                <Col span={10}>
                  {getFieldDecorator('vehicle_license_pic_back')(
                    <Input type="hidden"/>
                  )}
                  <Qiniu
                    prefix="vehicle_license_pic_back"
                    saveKey={this.handleKey.bind(this)}
                    source={api.auto.getUploadToken(customer_id, auto_id, 'vehicle_license_pic_back')}
                    onDrop={this.onDrop.bind(this, 'vehicle_license_pic_back')}
                    onUpload={this.onUpload.bind(this, 'vehicle_license_pic_back')}>
                    {this.renderImage('vehicle_license_pic_back')}
                  </Qiniu>
                </Col>
              </Row>
            </FormItem>

            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {initialValue: auto.remark})(
                <Input type="textarea"/>
              )}
            </FormItem>
          </Panel>
        </Collapse>

        <FormItem {...buttonLayout}>
          <Button onClick={this.props.cancelModal} className="mr15">取消</Button>
          <Button type="primary" onClick={this.handleSubmit}>保存</Button>
        </FormItem>
      </Form>
    );
  }
}

NewAutoForm = Form.create()(NewAutoForm);
export default NewAutoForm;
