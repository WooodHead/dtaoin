import React from 'react'
import {message, Form, Input, Button, Radio, Select, Row, Col} from 'antd'
import BaseAutoComponent from '../../base/BaseAuto'
import Layout from '../Layout'
import api from '../../../middleware/api'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class NewIntentionForm extends BaseAutoComponent {
  constructor(props) {
    super(props);
    this.state = {
      intention: {},
      searchValue: '',
      focus: false,
      brands: [],
      series: [],
      types: [],
      outColor: [],
      auto_factory_id: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getAutoBrands();
    this.getIntentionDetail(this.props.customer_id, this.props.intention_id);
  }

  handleSubmit(e) {
    e.preventDefault();
    api.ajax({
      url: api.editIntention(),
      type: 'POST',
      data: this.props.form.getFieldsValue()
    }, function (data) {
      message.success('修改意向成功!');
      this.props.cancelModal();
      location.reload();
    }.bind(this));
  }

  getIntentionDetail(customerId, intentionId) {
    api.ajax({url: api.getIntentionDetail(customerId, intentionId)}, function (data) {
      let intention = data.res.intention_info,
        brandId = intention.auto_brand_id,
        seriesId = intention.auto_series_id;
      this.setState({
        intention: intention,
        auto_factory_id: intention.auto_factory_id
      });
      this.getAutoSeries(brandId);
      this.getAutoTypes(seriesId);
    }.bind(this))
  }

  render() {
    const {formItemLayout, buttonLayout, selectStyle} = Layout;
    const {getFieldProps} = this.props.form;
    const {intention} = this.state;

    return (
      <Form horizontal >
        <Input type="hidden" {...getFieldProps('_id', {initialValue: intention._id})}/>
        <Input type="hidden" {...getFieldProps('customer_id', {initialValue: intention.customer_id})}/>
        <Input type="hidden" {...getFieldProps('auto_factory_id', {initialValue: this.state.auto_factory_id})}/>

        <Row>
          <Col span="12">
            <FormItem label="意向类型"
                      labelCol={{span: 12}}
                      wrapperCol={{span: 6}}>
              <p {...getFieldProps('type', {initialValue: intention.type})} className="ant-form-text">新车交易</p>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="意向级别"
                      labelCol={{span: 6}}
                      wrapperCol={{span: 10}}>
              <Select {...getFieldProps('level', {initialValue: intention.level})} size="large" {...selectStyle}>
                <Option key="H">H</Option>
                <Option key="A">A</Option>
                <Option key="B">B</Option>
                <Option key="C">C</Option>
                <Option key="D">D</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <FormItem label="品牌" {...formItemLayout}>
          <Select showSearch
                  onSelect={this.handleBrandSelect}
                  optionFilterProp="children"
                  placeholder="或通过品牌车系筛选车型"
                  notFoundContent="无法找到"
                  searchPlaceholder="输入品牌"
                  size="large" {...selectStyle}
                  {...getFieldProps('auto_brand_id', {initialValue: intention.auto_brand_id})}>
            {this.state.brands.map(brand => <Option key={brand._id}>{brand.name}</Option>)}
          </Select>
        </FormItem>

        <FormItem label="车系" {...formItemLayout}>
          <Select onSelect={this.handleSeriesSelect}
                  size="large" {...selectStyle} {...getFieldProps('auto_series_id', {initialValue: intention.auto_series_id})}>
            {this.state.series.map(series => <Option key={series._id}>{series.name}</Option>)}
          </Select>
        </FormItem>

        <FormItem label="车型" {...formItemLayout}>
          <Select
            size="large" {...getFieldProps('auto_type_id', {initialValue: intention.auto_type_id})} {...selectStyle}>
            {this.state.types.map(type => <Option
              value={type._id}>{type.year} {type.version} {type.guide_price}</Option>)}
          </Select>
        </FormItem>

        <FormItem label="外观" {...formItemLayout}>
          <Select {...getFieldProps('out_color', {initialValue: intention.out_color})} size="large" {...selectStyle}>
            <Option key="0">不限</Option>
            {this.state.outColor.map(color => <Option key={color._id}>{color.name}</Option>)}
          </Select>
        </FormItem>

        <FormItem label="内饰" {...formItemLayout}>
          <Select {...getFieldProps('in_color', {initialValue: intention.in_color})} size="large" {...selectStyle}>
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

        <FormItem label="购买预算" {...formItemLayout}>
          <Select
            {...getFieldProps('budget_level', {initialValue: intention.budget_level || '0'})}
            {...selectStyle}>
            <Option key="0">10万以下</Option>
            <Option key="1">10-15万</Option>
            <Option key="2">15-20万</Option>
            <Option key="3">20-25万</Option>
            <Option key="4">25-30万</Option>
            <Option key="5">30万以上</Option>
          </Select>
        </FormItem>

        <FormItem label="按揭意愿" {...formItemLayout}>
          <RadioGroup {...getFieldProps('is_mortgage', {initialValue: '1'})}>
            <Radio value="1">按揭</Radio>
            <Radio value="0">全款</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="4S给客户报价" {...formItemLayout}>
          <Input type="textarea" {...getFieldProps('other_quotation', {initialValue: intention.other_quotation})}
                 placeholder="请输入4S给客户报价"/>
        </FormItem>

        <FormItem label="买车关注点" {...formItemLayout}>
          <Input type="textarea" {...getFieldProps('focus', {initialValue: intention.focus})} placeholder="请输入买车关注点"/>
        </FormItem>

        <FormItem label="加装需求" {...formItemLayout}>
          <Input type="textarea" {...getFieldProps('decoration', {initialValue: intention.decoration})}
                 placeholder="请输入加装需求"/>
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          <Input type="textarea" {...getFieldProps('remark', {initialValue: intention.remark})} placeholder="请输入备注"/>
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button onClick={this.props.cancelModal} className="mr15">取消</Button>
          <Button type="primary" onClick={this.handleSubmit}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}

NewIntentionForm = Form.create()(NewIntentionForm);
export default NewIntentionForm
