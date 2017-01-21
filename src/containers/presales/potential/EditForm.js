import React from 'react';
import {message, Form, Input, Button, Radio, Select, Row, Col} from 'antd';
import BaseAutoComponent from '../../../components/base/BaseAuto';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class NewForm extends BaseAutoComponent {
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
      auto_factory_id: '',
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
        url: api.presales.intention.edit(),
        type: 'POST',
        data: this.props.form.getFieldsValue(),
      },
      () => {
        // (data) => {
        message.success('修改意向成功!');
        this.props.cancelModal();
        location.reload();
      });
  }

  getIntentionDetail(customerId, intentionId) {
    api.ajax({url: api.presales.intention.detail(customerId, intentionId)}, function (data) {
      let intention = data.res.intention_info,
        brandId = intention.auto_brand_id,
        seriesId = intention.auto_series_id;
      this.setState({
        intention: intention,
        auto_factory_id: intention.auto_factory_id,
      });
      this.getAutoSeries(brandId);
      this.getAutoTypes(seriesId);
    }.bind(this));
  }

  render() {
    const {formItemLayout, buttonLayout, selectStyle} = Layout;
    const {getFieldDecorator} = this.props.form;
    const {intention} = this.state;

    return (
      <Form horizontal>
        {getFieldDecorator('_id', {initialValue: intention._id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('customer_id', {initialValue: intention.customer_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('auto_factory_id', {initialValue: this.state.auto_factory_id})(
          <Input type="hidden"/>
        )}

        <Row>
          <Col span={12}>
            <FormItem label="意向类型"
                      labelCol={{span: 12}}
                      wrapperCol={{span: 6}}>
              {getFieldDecorator('type', {initialValue: intention.type})(
                <p className="ant-form-text">新车交易</p>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="意向级别"
                      labelCol={{span: 6}}
                      wrapperCol={{span: 10}}>

              {getFieldDecorator('level', {initialValue: intention.level})(
                <Select {...selectStyle}>
                  <Option key="H">H</Option>
                  <Option key="A">A</Option>
                  <Option key="B">B</Option>
                  <Option key="C">C</Option>
                  <Option key="D">D</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <FormItem label="品牌" {...formItemLayout}>
          {getFieldDecorator('auto_brand_id', {initialValue: intention.auto_brand_id})(
            <Select
              showSearch
              onSelect={this.handleBrandSelect}
              optionFilterProp="children"
              placeholder="或通过品牌车系筛选车型"
              notFoundContent="无法找到"
              searchPlaceholder="输入品牌"
              {...selectStyle}
            >
              {this.state.brands.map(brand => <Option key={brand._id}>{brand.name}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem label="车系" {...formItemLayout}>
          {getFieldDecorator('auto_series_id', {initialValue: intention.auto_series_id})(
            <Select onSelect={this.handleSeriesSelect} {...selectStyle}>
              {this.state.series.map(series => <Option key={series._id}>{series.name}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem label="车型" {...formItemLayout}>
          {getFieldDecorator('auto_type_id', {initialValue: intention.auto_type_id})(
            <Select {...selectStyle}>
              {this.state.types.map(type => <Option
                key={type._id} value={type._id}>{type.year} {type.version} {type.guide_price}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem label="外观" {...formItemLayout}>
          {getFieldDecorator('out_color', {initialValue: intention.out_color})(
            <Select {...selectStyle}>
              <Option key="0">不限</Option>
              {this.state.outColor.map(color => <Option key={color._id}>{color.name}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem label="内饰" {...formItemLayout}>
          {getFieldDecorator('in_color', {initialValue: intention.in_color})(
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

        <FormItem label="购买预算" {...formItemLayout}>
          {getFieldDecorator('budget_level', {initialValue: intention.budget_level || '0'})(
            <Select
              {...selectStyle}>
              <Option key="0">10万以下</Option>
              <Option key="1">10-15万</Option>
              <Option key="2">15-20万</Option>
              <Option key="3">20-25万</Option>
              <Option key="4">25-30万</Option>
              <Option key="5">30万以上</Option>
            </Select>
          )}
        </FormItem>

        <FormItem label="按揭意愿" {...formItemLayout}>
          {getFieldDecorator('is_mortgage', {initialValue: '1'})(
            <RadioGroup>
              <Radio value="1">按揭</Radio>
              <Radio value="0">全款</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem label="4S给客户报价" {...formItemLayout}>
          {getFieldDecorator('other_quotation', {initialValue: intention.other_quotation})(
            <Input type="textarea" placeholder="请输入4S给客户报价"/>
          )}
        </FormItem>

        <FormItem label="买车关注点" {...formItemLayout}>
          {getFieldDecorator('focus', {initialValue: intention.focus})(
            <Input type="textarea" placeholder="请输入买车关注点"/>
          )}
        </FormItem>

        <FormItem label="加装需求" {...formItemLayout}>
          {getFieldDecorator('decoration', {initialValue: intention.decoration})(
            <Input type="textarea" placeholder="请输入加装需求"/>
          )}
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('remark', {initialValue: intention.remark})(
            <Input type="textarea" placeholder="请输入备注"/>
          )}
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button onClick={this.props.cancelModal} className="mr15">取消</Button>
          <Button type="primary" onClick={this.handleSubmit}>保存</Button>
        </FormItem>
      </Form>
    );
  }
}

NewForm = Form.create()(NewForm);
export default NewForm;
