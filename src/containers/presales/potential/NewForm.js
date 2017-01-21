import React from 'react';
import BaseAutoComponent from '../../../components/base/BaseAuto';
import api from '../../../middleware/api';
import {message, Form, Input, Button, Radio, Select, Row, Col} from 'antd';
import Layout from '../../../utils/FormLayout';

class NewForm extends BaseAutoComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      focus: false,
      brands: [],
      series: [],
      types: [],
      outColor: [],
      auto_factory_id: '',
      disabled: false,
    };
    [
      'handlePreviousStep',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getAutoBrands();
  }

  handlePreviousStep() {
    this.props.onSuccess({
      currentStep: this.props.prevStep,
      customerForm: '',
      intentionForm: 'hide',
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({disabled: true});
    api.ajax({
      url: api.presales.intention.add(),
      type: 'POST',
      data: this.props.form.getFieldsValue(),
    }, () => {
      message.success('客户意向添加成功!');
      this.props.cancelModal();
      this.props.form.resetFields();
      location.reload();
    });
  }

  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const RadioGroup = Radio.Group;
    const {formItemLayout, buttonLayout, selectStyle} = Layout;
    const {getFieldDecorator} = this.props.form;

    return (
      <Form horizontal>
        {getFieldDecorator('customer_id', {initialValue: this.props.customer_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('auto_factory_id', {initialValue: this.state.auto_factory_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('auto_series_id', {initialValue: this.state.auto_series_id})(
          <Input type="hidden"/>
        )}

        <Row>
          <Col span={12}>
            <FormItem label="意向类型"
                      labelCol={{span: 12}}
                      wrapperCol={{span: 6}}>
              {getFieldDecorator('type', {initialValue: '1'})(
                <p className="ant-form-text">新车交易</p>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="意向级别"
                      labelCol={{span: 6}}
                      wrapperCol={{span: 10}}>
              {getFieldDecorator('level', {initialValue: 'A'})(
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
          {getFieldDecorator('auto_brand_id')(
            <Select
              showSearch
              onSelect={this.handleBrandSelect}
              optionFilterProp="children"
              placeholder="通过品牌车系筛选车型"
              notFoundContent="无法找到"
              searchPlaceholder="输入品牌"
              {...selectStyle}
            >
              {this.state.brands.map(brand => <Option key={brand._id}>{brand.name}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem label="车系" {...formItemLayout}>
          {getFieldDecorator('auto_series_id')(
            <Select onSelect={this.handleSeriesSelect}{...selectStyle}>
              {this.state.series.map(series => <Option key={series._id}>{series.name}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem label="车型" {...formItemLayout}>
          {getFieldDecorator('auto_type_id')(
            <Select {...selectStyle}>
              {this.state.types.map(type =>
                <Option key={type._id}>{type.year} {type.version} {type.guide_price}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem label="外观" {...formItemLayout}>
          {getFieldDecorator('out_color', {initialValue: '0'})(
            <Select {...selectStyle}>
              <Option key="0">不限</Option>
              {this.state.outColor.map(color => <Option key={color._id}>{color.name}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem label="内饰" {...formItemLayout}>
          {getFieldDecorator('in_color', {initialValue: '-1'})(
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
          {getFieldDecorator('budget_level', {initialValue: '1'})(
            <Select {...selectStyle}>
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
              <Radio key="1" value="1">按揭</Radio>
              <Radio key="0" value="0">全款</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem label="4S给客户报价" {...formItemLayout}>
          {getFieldDecorator('other_quotation')(
            <Input type="textarea" placeholder="请输入4S给客户报价"/>
          )}
        </FormItem>

        <FormItem label="买车关注点" {...formItemLayout}>
          {getFieldDecorator('focus')(
            <Input type="textarea" placeholder="请输入买车关注点"/>
          )}
        </FormItem>

        <FormItem label="加装需求" {...formItemLayout}>
          {getFieldDecorator('decoration')(
            <Input type="textarea" placeholder="请输入加装需求"/>
          )}
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('remark')(
            <Input type="textarea" placeholder="请输入备注"/>
          )}
        </FormItem>

        <FormItem {...buttonLayout}>
          {
            this.props.isSingle ? <Button onClick={this.props.cancelModal} className="mr15">取消</Button>
              :
              <Button type="ghost" onClick={this.handlePreviousStep} className="mr15">上一步</Button>
          }
          <Button type="primary" disabled={this.state.disabled} onClick={this.handleSubmit}>完成</Button>
        </FormItem>
      </Form>
    );
  }
}

NewForm = Form.create()(NewForm);
export default NewForm;