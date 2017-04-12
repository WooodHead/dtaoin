import React from 'react';
import {message, Row, Col, Form, Input, Button, Select, Switch} from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';

import BaseAutoComponent from '../../../components/base/BaseAuto';

class NewForm extends BaseAutoComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      searchValue: '',
      focus: false,
      brands: [],
      series: [],
      types: [],
      outColor: [],
      auto_factory_id: '',
      disabled: false,
      budgetLevels: [],
    };

    [
      'handlePreviousStep',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getAutoBrands();
    this.getBudgetLevels();
  }

  handlePreviousStep() {
    this.props.updateState({
      currentStep: this.props.prevStep,
      customerForm: '',
      intentionForm: 'hide',
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let values = this.props.form.getFieldsValue();
    values.is_mortgage = values.is_mortgage ? '1' : '0';

    this.setState({isFetching: true});
    api.ajax({
      url: api.presales.intention.add(),
      type: 'POST',
      data: values,
    }, () => {
      message.success('添加成功!');
      this.setState({isFetching: false});
      this.props.onSuccess();
      this.props.form.resetFields();
      this.props.cancelModal();
      this.props.updateState({
        currentStep: this.props.prevStep,
        customerForm: '',
        intentionForm: 'hide',
      });
    }, (err) => {
      message.error(`添加失败[${err}]`);
      this.setState({isFetching: false});
    });
  }

  getBudgetLevels() {
    api.ajax({url: api.presales.intention.getBudgetLevels()}, data => {
      this.setState({budgetLevels: data.res.budget_levels});
    });
  }

  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const {formItemLayout, selectStyle} = Layout;
    const {getFieldDecorator} = this.props.form;

    let {customerId, isSingle, cancelModal} = this.props;
    let {isFetching, budgetLevels} = this.state;

    return (
      <Form>
        {getFieldDecorator('customer_id', {initialValue: customerId})(<Input type="hidden"/>)}
        {getFieldDecorator('auto_factory_id', {initialValue: this.state.auto_factory_id})(<Input type="hidden"/>)}
        {getFieldDecorator('auto_series_id', {initialValue: this.state.auto_series_id})(<Input type="hidden"/>)}

        <Row>
          <Col span={12}>
            <FormItem label="意向类型" labelCol={{span: 12}} wrapperCol={{span: 6}}>
              {getFieldDecorator('type', {initialValue: '1'})(
                <p className="ant-form-text">新车交易</p>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="意向级别" labelCol={{span: 6}} wrapperCol={{span: 10}}>
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
        <Row>
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
        </Row>

        <Row>
          <FormItem label="车系" {...formItemLayout}>
            {getFieldDecorator('auto_series_id')(
              <Select onSelect={this.handleSeriesSelect}{...selectStyle}>
                {this.state.series.map(series => <Option key={series._id}>{series.name}</Option>)}
              </Select>
            )}
          </FormItem>
        </Row>
        <Row>
          <FormItem label="车型" {...formItemLayout}>
            {getFieldDecorator('auto_type_id')(
              <Select {...selectStyle}>
                {this.state.types.map(type =>
                  <Option key={type._id}>{type.year} {type.version} {type.guide_price}</Option>)}
              </Select>
            )}
          </FormItem>
        </Row>

        <Row>
          <FormItem label="外观/内饰" {...formItemLayout}>
            <Col span={8}>
              {getFieldDecorator('out_color', {initialValue: '0'})(
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
              {getFieldDecorator('in_color', {initialValue: '-1'})(
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
            </Col>
          </FormItem>
        </Row>

        <Row>
          <FormItem label="购买预算" {...formItemLayout}>
            {getFieldDecorator('budget_level', {initialValue: '1'})(
              <Select {...selectStyle}>
                {budgetLevels.map(level => <Option key={level.id}>{level.name}</Option>)}
              </Select>
            )}
          </FormItem>
        </Row>
        <Row>
          <FormItem label="是否按揭" {...formItemLayout}>
            {getFieldDecorator('is_mortgage', {
              valuePropName: 'checked',
              initialValue: false,
            })(
              <Switch checkedChildren={'是'} unCheckedChildren={'否'}/>
            )}
          </FormItem>
        </Row>
        <Row>
          <FormItem label="4S给客户报价" {...formItemLayout}>
            {getFieldDecorator('other_quotation')(
              <Input type="textarea" autosize placeholder="请输入4S给客户报价"/>
            )}
          </FormItem>
        </Row>
        <Row>
          <FormItem label="买车关注点" {...formItemLayout}>
            {getFieldDecorator('focus')(
              <Input type="textarea" autosize placeholder="请输入买车关注点"/>
            )}
          </FormItem>
        </Row>
        <Row>
          <FormItem label="加装需求" {...formItemLayout}>
            {getFieldDecorator('decoration')(
              <Input type="textarea" autosize placeholder="请输入加装需求"/>
            )}
          </FormItem>
        </Row>
        <Row>
          <FormItem label="备注" {...formItemLayout}>
            {getFieldDecorator('remark')(
              <Input type="textarea" autosize placeholder="请输入备注"/>
            )}
          </FormItem>
        </Row>
        <div className="form-action-container">
          {isSingle ?
            <Button onClick={cancelModal} size="large">取消</Button> :
            <Button type="ghost" onClick={this.handlePreviousStep} size="large">上一步</Button>
          }

          <Button
            type="primary"
            size="large"
            className="ml10"
            onClick={this.handleSubmit}
            loading={isFetching}
            disabled={isFetching}
          >
            完成
          </Button>
        </div>
      </Form>
    );
  }
}

NewForm = Form.create()(NewForm);
export default NewForm;
