import React from 'react';
import { message, Form, Input, Button, Select, DatePicker, Row, Col } from 'antd';
import className from 'classnames';

import Qiniu from '../../../components/widget/UploadQiniu';
import ImagePreview from '../../../components/widget/ImagePreview';
import BaseAutoComponent from '../../../components/base/BaseAuto';

import api from '../../../middleware/api';
import text from '../../../config/text';
import formatter from '../../../utils/DateFormatter';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';
import Layout from '../../../utils/FormLayout';

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
      isEdit: true,
      outColor: [],
      auto_factory_id: '',
      vehicle_license_pic_front_files: [],
      vehicle_license_pic_back_files: [],
      vehicle_license_pic_front_progress: [],
      vehicle_license_pic_back_progress: [],
    };
    [
      'handleSubmit',
      'handleIsEdit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { customerId, autoDealId, autoId } = this.props;
    this.getIntentionDetail(customerId, autoDealId);
    this.getAutoBrands();
    if (!!autoId || !!autoDealId) {
      this.setState({ isEdit: false });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const { autoDealId, customerId } = this.props;
    const { isNew } = this.state;

    if (!autoDealId) {
      message.error('请先填写交易信息并保存');
      return false;
    }

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('填写的表单内容有误,请检查必填信息或数据格式');
        return false;
      }
      values.register_date = formatter.date(values.register_date);

      api.ajax({
        url: isNew ? api.auto.add() : api.auto.edit(),
        type: 'POST',
        data: values,
      }, data => {
        message.success(this.state.isNew ? '车辆信息添加成功' : '车辆信息修改成功');
        this.setState({ isNew: false });
        this.props.onSuccess(data.res.auto_id);
        this.getIntentionDetail(customerId, autoDealId);
        this.handleIsEdit();
      });
    });
  }

  handleIsEdit() {
    const { isEdit } = this.state;
    this.setState({
      isEdit: !isEdit,
    });
  }

  getIntentionDetail(customerId, autoDealId) {
    api.ajax({
      url: api.presales.autoIntentionDetail(customerId, autoDealId),
    }, data => {
      const autoInfo = data.res.detail;
      if (!!autoInfo) {
        this.setState({
          auto: autoInfo || {},
          auto_factory_id: autoInfo && autoInfo.auto_factory_id,
          isNew: !autoInfo,
          isEdit: !autoInfo,
        });

        this.props.form.setFieldsValue({
          vehicle_license_pic_front: autoInfo.vehicle_license_pic_front,
          vehicle_license_pic_back: autoInfo.vehicle_license_pic_back,
        });

        this.getAutoSeries(autoInfo.auto_brand_id);
        this.getAutoTypes(autoInfo.auto_series_id);
        this.getAutoImages(autoInfo);
      } else {
        this.setState({
          isEdit: !autoInfo,
        });
      }
    }, () => {
      this.setState({
        isNew: true,
        isEdit: true,
      });
    });
  }

  getAutoImages(auto) {
    if (auto.vehicle_license_pic_front) {
      this.getPrivateImageUrl('vehicle_license_pic_front', auto.vehicle_license_pic_front);
    }
    if (auto.vehicle_license_pic_back) {
      this.getPrivateImageUrl('vehicle_license_pic_back', auto.vehicle_license_pic_back);
    }
  }

  render() {
    const { selectStyle, formItem9_15 } = Layout;
    const { getFieldDecorator } = this.props.form;
    const { customerId, autoId, intentionId, autoDealId } = this.props;
    const { auto, isEdit, brands, series, types } = this.state;

    const show = className({
      '': !isEdit,
      hide: isEdit,
    });

    const inputShow = className({
      hide: !isEdit,
      '': isEdit,
    });

    const licenceImages = [];
    if (auto.vehicle_license_pic_front) {
      licenceImages.push({
        title: '行驶证正面',
        url: api.system.getPrivatePicUrl(auto.vehicle_license_pic_front),
      });
    }
    if (auto.vehicle_license_pic_back) {
      licenceImages.push({
        title: '行驶证正面',
        url: api.system.getPrivatePicUrl(auto.vehicle_license_pic_back),
      });
    }

    return (
      <div>
        <Form className={inputShow}>
          {getFieldDecorator('_id', { initialValue: autoId })(
            <Input type="hidden" />,
          )}
          {getFieldDecorator('auto_deal_id', { initialValue: autoDealId })(
            <Input type="hidden" />,
          )}
          {getFieldDecorator('customer_id', { initialValue: customerId })(
            <Input type="hidden" />,
          )}
          {getFieldDecorator('intention_id', { initialValue: intentionId })(
            <Input type="hidden" />,
          )}
          {getFieldDecorator('auto_factory_id', { initialValue: this.state.auto_factory_id })(
            <Input type="hidden" />,
          )}
          <Row>
            <Col span={6}>
              <FormItem label="车牌号" {...formItem9_15}>
                {getFieldDecorator('plate_num', {
                  initialValue: auto.plate_num,
                  rules: [
                    {
                      required: true,
                      message: validator.required.plateNumber,
                    }, { validator: FormValidator.validatePlateNumber }],
                  validateTrigger: 'onBlur',
                })(
                  <Input placeholder="请输入车牌号" />,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="品牌" {...formItem9_15}>
                {getFieldDecorator('auto_brand_id', {
                  initialValue: auto.auto_brand_id,
                  rules: [
                    {
                      required: true,
                      message: validator.required.notNull,
                    }],
                })(
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
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="车系" {...formItem9_15}>
                {getFieldDecorator('auto_series_id', {
                  initialValue: auto.auto_series_id,
                  rules: [
                    {
                      required: true,
                      message: validator.required.notNull,
                    }],
                })(
                  <Select
                    onSelect={this.handleSeriesSelect}
                    {...selectStyle}
                  >
                    {series.map(series => <Option key={series._id}>{series.name}</Option>)}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="车型" {...formItem9_15}>
                {getFieldDecorator('auto_type_id', {
                  initialValue: auto.auto_type_id,
                  rules: [
                    {
                      required: true,
                      message: validator.required.notNull,
                    }],
                })(
                  <Select
                    {...selectStyle}
                  >
                    {types.map(type => <Option key={type._id}>{type.year} {type.version}</Option>)}
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <FormItem label="外观颜色" {...formItem9_15}>
                {getFieldDecorator('out_color', {
                  initialValue: !!auto.out_color
                    ? auto.out_color
                    : '-1',
                })(
                  <Select{...selectStyle}>
                    <Option key="-1">不限</Option>
                    {this.state.outColor.map(color => <Option
                      key={color._id}>{color.name}</Option>)}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="内饰颜色" {...formItem9_15}>
                {getFieldDecorator('in_color', {
                  initialValue: !!auto.in_color
                    ? auto.in_color
                    : '-1',
                })(
                  <Select{...selectStyle}>
                    <Option key="-1">不限</Option>
                    <Option key="0">米</Option>
                    <Option key="1">棕</Option>
                    <Option key="2">黑</Option>
                    <Option key="3">灰</Option>
                    <Option key="4">红</Option>
                    <Option key="5">蓝</Option>
                    <Option key="6">白</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="车架号" {...formItem9_15}>
                {getFieldDecorator('vin_num', { initialValue: auto.vin_num })(
                  <Input placeholder="请输入车架号" />,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="发动机号" {...formItem9_15}>
                {getFieldDecorator('engine_num', { initialValue: auto.engine_num })(
                  <Input placeholder="请输入发动机号" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="车辆型号" {...formItem9_15}>
                {getFieldDecorator('auto_type_num', { initialValue: auto.auto_type_num })(
                  <Input placeholder="如:SVW71617BM" />,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="来源4S店" {...formItem9_15}>
                {getFieldDecorator('source_4s', { initialValue: auto.source_4s })(
                  <Input placeholder="请输入来源4S店" />,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="初登日期" {...formItem9_15}>
                {getFieldDecorator('register_date', {
                  initialValue: auto.register_date
                    ? formatter.getMomentDate(auto.register_date)
                    : null,
                })(
                  <DatePicker placeholder="请选择初登日期" allowClear={false} />,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="行驶证照片" {...formItem9_15}>
                <Row>
                  <Col span={12}>
                    {getFieldDecorator('vehicle_license_pic_front')(
                      <Input type="hidden" />,
                    )}
                    <Qiniu
                      prefix="vehicle_license_pic_front"
                      saveKey={this.handleKey.bind(this)}
                      source={api.system.getPrivatePicUploadToken('vehicle_license_pic_front')}
                      onDrop={this.onDrop.bind(this, 'vehicle_license_pic_front')}
                      onUpload={this.onUpload.bind(this, 'vehicle_license_pic_front')}>
                      {this.renderImage('vehicle_license_pic_front')}
                    </Qiniu>
                  </Col>
                  <Col span={12}>
                    {getFieldDecorator('vehicle_license_pic_back')(
                      <Input type="hidden" />,
                    )}
                    <Qiniu
                      prefix="vehicle_license_pic_back"
                      saveKey={this.handleKey.bind(this)}
                      source={api.system.getPrivatePicUploadToken('vehicle_license_pic_back')}
                      onDrop={this.onDrop.bind(this, 'vehicle_license_pic_back')}
                      onUpload={this.onUpload.bind(this, 'vehicle_license_pic_back')}>
                      {this.renderImage('vehicle_license_pic_back')}
                    </Qiniu>
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <Col span={24} offset={2}>
                <div className="pull-left" style={{ position: 'relative', top: '-45px' }}>
                  <Button type="dash" onClick={this.handleIsEdit}>取消</Button>
                  <span className="ml10">
                  <Button type="primary" onClick={this.handleSubmit.bind(this)}>保存</Button>
                  </span>
                </div>
              </Col>
            </Col>
          </Row>
        </Form>

        <Form className={show}>
          <Row>
            <Col span={6}>
              <FormItem label="车牌号" {...formItem9_15}>
                <span>{auto.plate_num}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="品牌" {...formItem9_15}>
                <span>{
                  brands.filter(item => item._id == auto.auto_brand_id).length > 0 &&
                  brands.filter(item => item._id == auto.auto_brand_id)[0].name
                }</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="车系" {...formItem9_15}>
                <span>{
                  series.filter(item => item._id == auto.auto_series_id).length > 0 &&
                  series.filter(item => item._id == auto.auto_series_id)[0].name
                }</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="车型" {...formItem9_15}>
                <span>{
                  types.filter(item => item._id == auto.auto_type_id).length > 0 &&
                  types.filter(item => item._id == auto.auto_type_id)[0].year +
                  types.filter(item => item._id == auto.auto_type_id)[0].version
                }</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <FormItem label="外观颜色" {...formItem9_15}>
                <span>{!!(auto.out_color_name) ? auto.out_color_name : ''}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="内饰颜色" {...formItem9_15}>
                <span>{text.inColorName[auto.in_color] || ''}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="车架号" {...formItem9_15}>
                <span>{auto.vin_num}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="发动机号" {...formItem9_15}>
                <span>{auto.engine_num}</span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="车辆型号" {...formItem9_15}>
                <span>{auto.auto_type_num}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="来源4S店" {...formItem9_15}>
                <span>{auto.source_4s}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="初登日期" {...formItem9_15}>
                <span>{auto.register_date}</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="行驶证照片" {...formItem9_15}>
                <ImagePreview
                  title="行驶证照片"
                  images={licenceImages}
                  disabled={!auto.vehicle_license_pic_front}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <Col span={24} offset={2}>
                <div className="pull-left">
                  <Button type="dash" onClick={this.handleIsEdit}>编辑</Button>
                </div>
              </Col>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

NewAutoForm = Form.create()(NewAutoForm);
export default NewAutoForm;
