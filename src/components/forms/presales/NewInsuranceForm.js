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
      isNew: true,
      customerName: '',
      companyRebate: '',
      insuranceCompanies: [],
      startDate: '',
      endDate: '',
      insurance: {},
      depositDisabled: false,
      ciContent: '',
    };
    [
      'handlePrevStep',
      'handleNextStep',
      'handleSubmit',
      'saveInsurance',
      'handleInsuranceDate',
      'handleCompanyChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getInsuranceDetail(this.props.customer_id, this.props.auto_id);
    this.getCustomerDetail(this.props.customer_id);
    this.getInsuranceCompanies();
    this.handleInsuranceDate();
  }

  componentWillReceiveProps(nextProps) {
    let deliverDate = nextProps.deliverDate;
    if (deliverDate) {
      this.handleInsuranceDate(new Date(deliverDate));
      this.setState({depositDisabled: parseInt(nextProps.payType) === 0});
    }
  }

  handlePrevStep() {
    let {payType, prevStep} = this.props;
    if (payType === '1') {
      this.props.onSuccess({
        currentStep: prevStep - 1,
        purchaseForm: '',
        insuranceForm: 'hide',
      });
    } else {
      this.props.onSuccess({
        currentStep: prevStep,
        loanForm: '',
        insuranceForm: 'hide',
      });
    }
  }

  handleNextStep(e) {
    e.preventDefault();
    let formData = this.props.form.getFieldsValue();
    if (!formData.insurance_company && !formData.insurance_num) {
      this.props.onSuccess({
        currentStep: this.props.nextStep,
        insuranceForm: 'hide',
        decorationForm: '',
      });
    } else {
      this.handleSubmit(e, 'NEXT');
    }
  }

  handleSubmit(e, action) {
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
        url: this.state.isNew ? api.presales.deal.addInsurance() : api.presales.deal.editInsurance(),
        type: 'POST',
        data: values,
      }, function (data) {
        message.success(this.state.isNew ? '保险信息添加成功' : '保险信息修改成功');
        this.setState({
          isNew: false,
          insurance_log_id: data.res.insurance_log_id,
        });
        if (action === 'NEXT') {
          this.props.onSuccess({
            currentStep: this.props.nextStep,
            insuranceForm: 'hide',
            decorationForm: '',
            insuranceStepStatus: 'finish',
          });
        } else {
          this.props.cancelModal();
          location.reload();
        }
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
      if (detail) {
        this.setState({
          insurance: detail,
          companyRebate: detail.rebate_coefficient,
          isNew: false,
        });
      }
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
    let {
      startDate,
      endDate,
      depositDisabled,
      ciContent,
    } = this.state;

    return (
      <Form horizontal>
        {getFieldDecorator('_id', {initialValue: this.state.insurance_log_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('customer_id', {initialValue: this.props.customer_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('seller_user_id', {initialValue: this.props.seller_user_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('auto_id', {initialValue: this.props.auto_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('auto_deal_id', {initialValue: this.props.auto_deal_id})(
          <Input type="hidden"/>
        )}

        <FormItem label="被保人" {...formItemLayout}>
          {getFieldDecorator('insured_person', {initialValue: this.state.customerName})(
            <Input placeholder="请输入被保人"/>
          )}
        </FormItem>

        <FormItem label="保险公司" {...formItemLayout} required>
          {getFieldDecorator('insurance_company', {rules: FormValidator.getRuleNotNull()})(
            <Select
              onSelect={this.handleCompanyChange}
              {...selectStyle}
              placeholder="请选择保险公司"
            >
              {this.state.insuranceCompanies.map(company =>
                <Option key={company.name}>{company.name}</Option>
              )}
            </Select>
          )}
        </FormItem>

        <FormItem label="交强险单号" {...formItemLayout} required>
          {getFieldDecorator('insurance_num', {
            rules: FormValidator.getRuleNotNull(),
            validateTrigger: 'onBlur',
          })(
            <Input placeholder="请输入交强险单号"/>
          )}
        </FormItem>

        <Row>
          <Col span={13}>
            <FormItem label="车船税" labelCol={{span: 11}} wrapperCol={{span: 11}} required>
              {getFieldDecorator('usage_tax', {
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input type="number" placeholder="请输入车船税"/>
              )}
            </FormItem>
          </Col>
          <Col span={11}>
            <FormItem label="交强险" labelCol={{span: 6}} wrapperCol={{span: 9}} required>
              {getFieldDecorator('traffic_insurance', {rules: FormValidator.getRuleNotNull()})(
                <Input type="number" placeholder="请输入交强险"/>
              )}
            </FormItem>
          </Col>
        </Row>

        <FormItem label="商业保险公司" {...formItemLayout}>
          {getFieldDecorator('ci_insurance_company')(
            <Select{...selectStyle} placeholder="请选择保险公司">
              {this.state.insuranceCompanies.map((company) =>
                <Option key={company.name}>{company.name}</Option>
              )}
            </Select>
          )}
        </FormItem>

        <FormItem label="商业险单号" {...formItemLayout}>
          {getFieldDecorator('ci_insurance_num')(
            <Input placeholder="请输入商业险单号"/>
          )}
        </FormItem>

        <FormItem label="商业险总额" {...formItemLayout}>
          {getFieldDecorator('ci_total')(
            <Input placeholder="请输入商业险总额"/>
          )}
        </FormItem>

        <FormItem label="商业险让利" {...formItemLayout}>
          {getFieldDecorator('ci_discount')(
            <Input placeholder="请输入商业险让利"/>
          )}
        </FormItem>

        <Row className="mb15">
          <Col span={14} offset={6}>
            <InsuranceSelector save={this.saveInsurance}/>
          </Col>
        </Row>

        <FormItem label="商业险类型" {...formItemLayout}>
          {getFieldDecorator('ci_content', {initialValue: ciContent})(
            <Input rows="4" type="textarea" disabled placeholder="请输选择商业险类型"/>
          )}
        </FormItem>

        <Row>
          <Col span={13}>
            <FormItem label="保险押金" labelCol={{span: 11}} wrapperCol={{span: 11}}>
              {getFieldDecorator('deposit')(
                <Input
                  type="number"
                  min="0"
                  disabled={depositDisabled}
                  placeholder="请输入保险押金"
                />
              )}
            </FormItem>
          </Col>
          <Col span={11}>
            <FormItem label="将押金交给保险公司" labelCol={{span: 10}} wrapperCol={{span: 10}}>
              {getFieldDecorator('is_deposit_ic', {initialValue: '0'})(
                <RadioGroup disabled={depositDisabled}>
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
              {getFieldDecorator('start_date', {initialValue: formatter.getMomentDate(startDate)})(
                <DatePicker onChange={this.handleInsuranceDate} placeholder="起始日期"/>
              )}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem
              labelCol={{span: 14}}
              wrapperCol={{span: 10}}
            >
              {getFieldDecorator('end_date', {initialValue: formatter.getMomentDate(endDate)})(
                <DatePicker placeholder="终止日期"/>
              )}
            </FormItem>
          </Col>
        </Row>

        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('remark')(
            <Input type="textarea" placeholder="请填写备注"/>
          )}
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button type="ghost" className={this.props.isSingle ? 'hide' : 'mr15'}
                  onClick={this.handlePrevStep}>上一步</Button>
          <Button type="primary" className={this.props.isSingle ? 'hide' : 'mr15'}
                  onClick={this.handleNextStep}>下一步</Button>
          <Button type={this.props.isSingle ? 'primary' : 'ghost'} onClick={this.handleSubmit}>保存并退出</Button>
        </FormItem>
      </Form>
    );
  }
}

NewInsuranceForm = Form.create()(NewInsuranceForm);
export default NewInsuranceForm;
