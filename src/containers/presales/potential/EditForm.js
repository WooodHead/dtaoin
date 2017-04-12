import React from 'react';
import {message, Row, Col, Form, Input, Button, Select, Switch} from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';

import BaseAutoComponent from '../../../components/base/BaseAuto';

const FormItem = Form.Item;
const Option = Select.Option;

class NewForm extends BaseAutoComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      intention: {},
      searchValue: '',
      focus: false,
      brands: [],
      series: [],
      types: [],
      outColor: [],
      autoFactoryId: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getAutoBrands();
    this.getIntentionDetail(this.props.customerId, this.props.intentionId);
  }

  handleSubmit(e) {
    e.preventDefault();
    let values = this.props.form.getFieldsValue();
    values.is_mortgage = values.is_mortgage ? '1' : '0';

    this.setState({isFetching: true});
    api.ajax({
      url: api.presales.intention.edit(),
      type: 'POST',
      data: values,
    }, () => {
      message.success('修改成功!');
      this.setState({isFetching: false});
      this.props.form.resetFields();
      this.props.cancelModal();
      this.props.onSuccess();
      this.getIntentionDetail(this.props.customerId, this.props.intentionId);
    }, (err) => {
      message.error(`修改失败[${err}]`);
      this.setState({isFetching: false});
    });
  }

  getIntentionDetail(customerId, intentionId) {
    api.ajax({url: api.presales.intention.detail(customerId, intentionId)}, data => {
      let intention = data.res.intention_info,
        brandId = intention.auto_brand_id,
        seriesId = intention.auto_series_id;
      this.setState({
        intention: intention,
        autoFactoryId: intention.auto_factory_id,
      });
      this.getAutoSeries(brandId);
      this.getAutoTypes(seriesId);
    });
  }

  render() {
    const {formItemLayout, formItemLg, selectStyle} = Layout;
    const {getFieldDecorator} = this.props.form;
    const {isFetching, intention} = this.state;

    return (
      <Form>
        {getFieldDecorator('_id', {initialValue: intention._id})(<Input type="hidden"/>)}
        {getFieldDecorator('customer_id', {initialValue: intention.customer_id})(<Input type="hidden"/>)}
        {getFieldDecorator('auto_factory_id', {initialValue: this.state.autoFactoryId})(<Input type="hidden"/>)}

        <Row>
          <Col span={12}>
            <FormItem label="意向类型" labelCol={{span: 12}} wrapperCol={{span: 6}}>
              {getFieldDecorator('type', {initialValue: intention.type})(
                <p className="ant-form-text">新车交易</p>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="意向级别" labelCol={{span: 6}} wrapperCol={{span: 10}}>
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
          {getFieldDecorator('auto_series_id', {
            initialValue: intention.auto_series_id && String(intention.auto_series_id) === '0' ? '不限' : intention.auto_series_id,
          })(
            <Select onSelect={this.handleSeriesSelect} {...selectStyle}>
              {this.state.series.map(series => <Option key={series._id}>{series.name}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem label="车型" {...formItemLayout}>
          {getFieldDecorator('auto_type_id', {
            initialValue: intention.auto_type_id && String(intention.auto_type_id) === '0' ? '不限' : intention.auto_type_id,
          })(
            <Select {...selectStyle}>
              {this.state.types.map(type => <Option
                key={type._id} value={type._id}>{type.year} {type.version} {type.guide_price}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem label="外观/内饰" {...formItemLayout}>
          <Row>
            <Col span={8}>
              {getFieldDecorator('out_color', {initialValue: intention.out_color})(
                <Select {...selectStyle} size="large">
                  <Option key="0">不限</Option>
                  {this.state.outColor.map(color => <Option key={color._id}>{color.name}</Option>)}
                </Select>
              )}
            </Col>
            <Col span={2}>
              <p className="ant-form-split">/</p>
            </Col>
            <Col span={9}>
              <FormItem {...formItemLg}>
                {getFieldDecorator('in_color', {initialValue: intention.in_color})(
                  <Select {...selectStyle} size="large">
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
            </Col>
          </Row>
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

        <FormItem label="是否按揭" {...formItemLayout}>
          {getFieldDecorator('is_mortgage', {
            valuePropName: 'checked',
            initialValue: intention.is_mortgage === '1',
          })(
            <Switch checkedChildren={'是'} unCheckedChildren={'否'}/>
          )}
        </FormItem>

        <FormItem label="4S给客户报价" {...formItemLayout}>
          {getFieldDecorator('other_quotation', {initialValue: intention.other_quotation})(
            <Input type="textarea" autosize placeholder="请输入4S给客户报价"/>
          )}
        </FormItem>

        <FormItem label="买车关注点" {...formItemLayout}>
          {getFieldDecorator('focus', {initialValue: intention.focus})(
            <Input type="textarea" autosize placeholder="请输入买车关注点"/>
          )}
        </FormItem>

        <FormItem label="加装需求" {...formItemLayout}>
          {getFieldDecorator('decoration', {initialValue: intention.decoration})(
            <Input type="textarea" autosize placeholder="请输入加装需求"/>
          )}
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('remark', {initialValue: intention.remark})(
            <Input type="textarea" autosize placeholder="请输入备注"/>
          )}
        </FormItem>

        <div className="form-action-container">
          <Button
            onClick={this.props.cancelModal}
            className="mr10"
            size="large"
          >
            取消
          </Button>

          <Button
            type="primary"
            onClick={this.handleSubmit}
            size="large"
            loading={isFetching}
            disabled={isFetching}
          >
            保存
          </Button>
        </div>
      </Form>
    );
  }
}

NewForm = Form.create()(NewForm);
export default NewForm;
