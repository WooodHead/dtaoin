import React, {Component} from 'react'
import {message, Form, Input, Button, Checkbox, Select, Radio, DatePicker, Row, Col} from 'antd'
import Layout from '../Layout'
import api from '../../../middleware/api'
import formatter from '../../../middleware/formatter'
import validator from '../../../middleware/validator'
import FormValidator from '../FormValidator'
import InsuranceSelector from '../../popover/InsuranceSelector'

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
      ciContent: ''
    };
    [
      'handlePrevStep',
      'handleNextStep',
      'handleSubmit',
      'saveInsurance',
      'handleInsuranceDate',
      'handleCompanyChange'
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getInsuranceDetail(this.props.customer_id, this.props.user_auto_id);
    this.getCustomerDetail(this.props.customer_id);
    this.getInsuranceCompanies();
    this.handleInsuranceDate();
  }

  componentWillReceiveProps(nextProps) {
    let deliverDate = nextProps.deliverDate;
    if (deliverDate) {
      this.handleInsuranceDate(new Date(deliverDate));
      this.setState({depositDisabled: parseInt(nextProps.payType) === 0})
    }
  }

  handlePrevStep(e) {
    let {payType, prevStep} = this.props;
    if (payType === '1') {
      this.props.onSuccess({
        currentStep: prevStep - 1,
        purchaseForm: '',
        insuranceForm: 'hide'
      });
    } else {
      this.props.onSuccess({
        currentStep: prevStep,
        loanForm: '',
        insuranceForm: 'hide'
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
        decorationForm: ''
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
        url: this.state.isNew ? api.addPurchaseInsurance() : api.editPurchaseInsurance(),
        type: 'POST',
        data: values
      }, function (data) {
        message.success(this.state.isNew ? '保险信息添加成功' : '保险信息修改成功');
        this.setState({
          isNew: false,
          insurance_log_id: data.res.insurance_log_id
        });
        if (action === 'NEXT') {
          this.props.onSuccess({
            currentStep: this.props.nextStep,
            insuranceForm: 'hide',
            decorationForm: '',
            insuranceStepStatus: 'finish'
          });
        } else {
          this.props.cancelModal();
          this.props.isSingle ? location.reload() : location.hash = api.getHash();
        }
      }.bind(this));
    });
  }

  handleInsuranceDate(start) {
    start = start || new Date();
    let end = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate() - 1);
    this.setState({
      startDate: start,
      endDate: end
    });
  }

  handleCompanyChange(name) {
    this.props.form.setFieldsValue({ci_insurance_company: name});
  }

  saveInsurance(insurances) {
    this.setState({ciContent: insurances});
  }

  getInsuranceDetail(customerId, userAutoId) {
    api.ajax({url: api.getPurchaseInsuranceDetail(customerId, userAutoId)}, function (data) {
      let detail = data.res.detail;
      if (detail) {
        this.setState({
          insurance: detail,
          companyRebate: detail.rebate_coefficient,
          isNew: false
        })
      }
    }.bind(this))
  }

  getCustomerDetail(customerId) {
    api.ajax({url: api.getCustomerDetail(customerId)}, function (data) {
      this.setState({customerName: data.res.customer_info.name});
    }.bind(this))
  }

  getInsuranceCompanies() {
    api.ajax({url: api.getInsuranceCompanies()}, function (data) {
      this.setState({insuranceCompanies: data.res.company_list});
    }.bind(this))
  }

  render() {
    const {formItemLayout, selectStyle, buttonLayout} = Layout;
    const {getFieldProps} = this.props.form;
    let {
      startDate,
      endDate,
      depositDisabled,
      ciContent
    } = this.state;

    const insuranceCompanyProps = getFieldProps('insurance_company', {
      validate: [{
        rules: [{validator: FormValidator.notNull}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.notNull}],
        trigger: 'onBlur'
      }]
    });

    const insuranceNumProps = getFieldProps('insurance_num', {
      validate: [{
        rules: [{validator: FormValidator.notNull}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.notNull}],
        trigger: 'onBlur'
      }]
    });

    const usageTaxProps = getFieldProps('usage_tax', {
      validate: [{
        rules: [{validator: FormValidator.notNull}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.notNull}],
        trigger: 'onBlur'
      }]
    });

    const trafficInsuranceProps = getFieldProps('traffic_insurance', {
      validate: [{
        rules: [{validator: FormValidator.notNull}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.notNull}],
        trigger: 'onBlur'
      }]
    });

    return (
      <Form horizontal >
        <Input type="hidden" {...getFieldProps('_id', {initialValue: this.state.insurance_log_id})}/>
        <Input type="hidden" {...getFieldProps('customer_id', {initialValue: this.props.customer_id})}/>
        <Input type="hidden" {...getFieldProps('seller_user_id', {initialValue: this.props.seller_user_id})}/>
        <Input type="hidden" {...getFieldProps('user_auto_id', {initialValue: this.props.user_auto_id})}/>
        <Input type="hidden" {...getFieldProps('auto_deal_id', {initialValue: this.props.auto_deal_id})}/>

        <FormItem label="被保人" {...formItemLayout}>
          <Input {...getFieldProps('insured_person', {initialValue: this.state.customerName})} placeholder="请输入被保人"/>
        </FormItem>

        <FormItem label="保险公司" {...formItemLayout} required>
          <Select
            onSelect={this.handleCompanyChange}
            {...insuranceCompanyProps}
            size="large"
            {...selectStyle}
            placeholder="请选择保险公司">
            {this.state.insuranceCompanies.map(company =>
              <Option key={company.name}>{company.name}</Option>)}
          </Select>
        </FormItem>

        <FormItem label="交强险单号" {...formItemLayout} required>
          <Input {...insuranceNumProps} placeholder="请输入交强险单号"/>
        </FormItem>

        <Row>
          <Col span="13">
            <FormItem label="车船税" labelCol={{span: 11}} wrapperCol={{span: 11}} required>
              <Input type="number" {...usageTaxProps} placeholder="请输入车船税"/>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="交强险" labelCol={{span: 6}} wrapperCol={{span: 9}} required>
              <Input type="number" {...trafficInsuranceProps} placeholder="请输入交强险"/>
            </FormItem>
          </Col>
        </Row>

        <FormItem label="商业保险公司" {...formItemLayout}>
          <Select
            {...getFieldProps('ci_insurance_company')}
            size="large" {...selectStyle}
            placeholder="请选择保险公司">
            {this.state.insuranceCompanies.map((company) =>
              <Option key={company.name}>{company.name}</Option>)}
          </Select>
        </FormItem>

        <FormItem label="商业险单号" {...formItemLayout}>
          <Input {...getFieldProps('ci_insurance_num')} placeholder="请输入商业险单号"/>
        </FormItem>

        <FormItem label="商业险总额" {...formItemLayout}>
          <Input {...getFieldProps('ci_total')} placeholder="请输入商业险总额"/>
        </FormItem>

        <FormItem label="商业险让利" {...formItemLayout}>
          <Input {...getFieldProps('ci_discount')} placeholder="请输入商业险让利"/>
        </FormItem>

        <Row className="mb15">
          <Col span="14" offset="6">
            <InsuranceSelector save={this.saveInsurance}/>
          </Col>
        </Row>

        <FormItem label="商业险类型" {...formItemLayout}>
          <Input
            {...getFieldProps('ci_content', {initialValue: ciContent})}
            rows="4"
            type="textarea"
            disabled
            placeholder="请输选择商业险类型"/>
        </FormItem>

        <Row>
          <Col span="13">
            <FormItem label="保险押金" labelCol={{span: 11}} wrapperCol={{span: 11}}>
              <Input
                type="number"
                min="0"
                {...getFieldProps('deposit')}
                disabled={depositDisabled}
                placeholder="请输入保险押金"
              />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="将押金交给保险公司" labelCol={{span: 10}} wrapperCol={{span: 10}}>
              <RadioGroup {...getFieldProps('is_deposit_ic', {initialValue: '0'})} disabled={depositDisabled}>
                <Radio key="1" value="1">是</Radio>
                <Radio key="0" value="0">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <FormItem label="保险期限" {...formItemLayout}>
          <Row>
            <Col span="10" className="mr15">
              <DatePicker
                {...getFieldProps('start_date', {initialValue: startDate})}
                onChange={this.handleInsuranceDate}
                placeholder="起始日期"/>
            </Col>
            <Col span="10">
              <DatePicker
                {...getFieldProps('end_date', {initialValue: endDate})}
                placeholder="终止日期"/>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          <Input {...getFieldProps('remark')} type="textarea" placeholder="请填写备注"/>
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button type="ghost" className={this.props.isSingle ? 'hide' : 'mr15'}
                  onClick={this.handlePrevStep}>上一步</Button>
          <Button type="primary" className={this.props.isSingle ? 'hide' : 'mr15'}
                  onClick={this.handleNextStep}>下一步</Button>
          <Button type={this.props.isSingle ? 'primary' : 'ghost'} onClick={this.handleSubmit}>保存并退出</Button>
        </FormItem>
      </Form>
    )
  }
}

NewInsuranceForm = Form.create()(NewInsuranceForm);
export default NewInsuranceForm
