import React, {Component} from 'react';
import {message, Form, Input, Button, Select, Radio, DatePicker, Row, Col} from 'antd';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';
import InsuranceSelector from '../../popover/InsuranceSelector';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class NewInsuranceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerName: '',
      companyRebate: '',
      startDate: formatter.getMomentDate(),
      endDate: formatter.getMomentDate(),
      ciContent: '',
      insuranceCompanies: [],
      insurance: {},
    };
    [
      'handleSubmit',
      'saveInsurance',
      'handleInsuranceDate',
      'handleCompanyChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getInsuranceCompanies();
    this.getCustomerDetail(this.props.customer_id);
    this.getInsuranceDetail(this.props.customer_id, this.props.auto_id);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }
      let {usage_tax, traffic_insurance, ci_total} = values;
      values.start_date = formatter.date(values.start_date);
      values.end_date = formatter.date(values.end_date);
      values.sign_date = formatter.date(values.sign_date);
      values.total = parseFloat(usage_tax) + parseFloat(traffic_insurance) + parseFloat(ci_total);

      api.ajax({
        url: api.presales.deal.editInsurance(),
        type: 'POST',
        data: values,
      }, function () {
        message.success('修改保险成功');
        this.props.cancelModal();
        location.reload();
      }.bind(this));
    });
  }

  handleInsuranceDate(start) {
    start = formatter.getMomentDate(start);
    let end = formatter.getMomentDate(new Date(start.year() + 1, start.month(), start.date() - 1));
    this.setState({
      startDate: start,
      endDate: end,
    });
  }

  handleCompanyChange(name) {
    this.props.form.setFieldsValue({ci_insurance_company: name});
  }

  saveInsurance(insurances) {
    this.setState({ciContent: insurances});
  }

  getInsuranceDetail(customerId, userAutoId) {
    api.ajax({url: api.presales.deal.getLoanDetail(customerId, userAutoId)}, function (data) {
      let detail = data.res.detail;
      this.setState({
        insurance: detail,
        companyRebate: detail.rebate_coefficient,
        startDate: formatter.getMomentDate(detail.start_date),
        endDate: formatter.getMomentDate(detail.end_date),
        ciContent: detail.ci_content,
      });
    }.bind(this));
  }

  getCustomerDetail(customerId) {
    api.ajax({url: api.customer.detail(customerId)}, function (data) {
      this.setState({customerName: data.res.customer_info.name});
    }.bind(this));
  }

  getInsuranceCompanies() {
    api.ajax({url: api.presales.deal.getInsuranceCompanies()}, function (data) {
      this.setState({insuranceCompanies: data.res.company_list});
    }.bind(this));
  }

  render() {
    const {formItemLayout, selectStyle, buttonLayout} = Layout;
    const {getFieldDecorator} = this.props.form;
    const {
      insurance,
      startDate,
      endDate,
      ciContent,
    } = this.state;

    return (
      <Form horizontal>
        {getFieldDecorator('_id', {initialValue: insurance._id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('customer_id', {initialValue: insurance.customer_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('seller_user_id', {initialValue: insurance.seller_user_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('auto_id', {initialValue: insurance.auto_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('auto_deal_id', {initialValue: insurance.auto_deal_id})(
          <Input type="hidden"/>
        )}

        <FormItem label="被保人" {...formItemLayout}>
          {getFieldDecorator('insured_person', {initialValue: insurance.insured_person ? insurance.insured_person : this.state.customerName})(
            <Input placeholder="请输入被保人"/>
          )}
        </FormItem>

        <FormItem label="保险公司" {...formItemLayout} required>
          {getFieldDecorator('insurance_company', {
            initialValue: insurance.insurance_company,
            rules: [{required: true, message: validator.required.notNull}, {validator: FormValidator.notNull}],
            validateTrigger: 'onBlur',
          })(
            <Select
              onSelect={this.handleCompanyChange}
              {...selectStyle}
              placeholder="请选择保险公司"
            >
              {this.state.insuranceCompanies.map(company =>
                <Option key={company.name}>{company.name}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem label="交强险单号" {...formItemLayout} required>
          {getFieldDecorator('insurance_num', {
            initialValue: insurance.insurance_num,
            rules: [{required: true, message: validator.required.notNull}, {validator: FormValidator.notNull}],
            validateTrigger: 'onBlur',
          })(
            <Input placeholder="请输入交强险单号"/>
          )}
        </FormItem>

        <Row>
          <Col span={13}>
            <FormItem label="车船税" labelCol={{span: 11}} wrapperCol={{span: 11}} required>
              {getFieldDecorator('usage_tax', {
                initialValue: insurance.usage_tax,
                rules: [{required: true, message: validator.required.notNull}, {validator: FormValidator.notNull}],
                validateTrigger: 'onBlur',
              })(
                <Input type="number" placeholder="请输入车船税"/>
              )}
            </FormItem>
          </Col>
          <Col span={11}>
            <FormItem label="交强险" labelCol={{span: 6}} wrapperCol={{span: 9}} required>
              {getFieldDecorator('traffic_insurance', {
                initialValue: insurance.traffic_insurance,
                rules: [{required: true, message: validator.required.notNull}, {validator: FormValidator.notNull}],
                validateTrigger: 'onBlur',
              })(
                <Input type="number" placeholder="交强险"/>
              )}
            </FormItem>
          </Col>
        </Row>

        <FormItem label="商业保险公司" {...formItemLayout}>
          {getFieldDecorator('ci_insurance_company', {
            initialValue: insurance.ci_insurance_company,
          })(
            <Select
              {...selectStyle}
              placeholder="请选择保险公司">
              {this.state.insuranceCompanies.map(company =>
                <Option key={company.name}>{company.name}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem label="商业险单号" {...formItemLayout}>
          {getFieldDecorator('ci_insurance_num', {initialValue: insurance.ci_insurance_num})(
            <Input/>
          )}
        </FormItem>

        <FormItem label="商业险总额" {...formItemLayout}>
          {getFieldDecorator('ci_total', {initialValue: insurance.ci_total})(
            <Input/>
          )}
        </FormItem>

        <FormItem label="商业险让利" {...formItemLayout}>
          {getFieldDecorator('ci_discount', {initialValue: insurance.ci_discount})(
            <Input placeholder="请输入商业险让利"/>
          )}
        </FormItem>

        <Row className="mb15">
          <Col span={14} offset={6}>
            <InsuranceSelector value={ciContent} save={this.saveInsurance}/>
          </Col>
        </Row>

        <FormItem label="商业险类型" {...formItemLayout}>
          {getFieldDecorator('ci_content', {initialValue: ciContent})(
            <Input rows="4" type="textarea" disabled/>
          )}
        </FormItem>

        <Row>
          <Col span={13}>
            <FormItem
              label="保险押金"
              labelCol={{span: 11}}
              wrapperCol={{span: 11}}>
              {getFieldDecorator('deposit', {initialValue: insurance.deposit})(
                <Input type="number" min="0"/>
              )}
            </FormItem>
          </Col>
          <Col span={11}>
            <FormItem
              label="将押金交给保险公司"
              labelCol={{span: 14}}
              wrapperCol={{span: 10}}
            >
              {getFieldDecorator('is_deposit_ic', {initialValue: insurance.is_deposit_ic || '0'})(
                <RadioGroup>
                  <Radio key="1" value="1">是</Radio>
                  <Radio key="0" value="0">否</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={10} className="mr15">
            <FormItem
              label="保险期限"
              labelCol={{span: 14}}
              wrapperCol={{span: 10}}
            >
              {getFieldDecorator('start_date', {initialValue: startDate})(
                <DatePicker onChange={this.handleInsuranceDate} placeholder="起始日期"/>
              )}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem
              labelCol={{span: 14}}
              wrapperCol={{span: 10}}
            >
              {getFieldDecorator('end_date', {initialValue: endDate})(
                <DatePicker placeholder="终止日期"/>
              )}
            </FormItem>
          </Col>
        </Row>

        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('remark', {initialValue: insurance.remark})(
            <Input type="textarea"/>
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

NewInsuranceForm = Form.create()(NewInsuranceForm);
export default NewInsuranceForm;
