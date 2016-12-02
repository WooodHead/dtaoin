import React, {Component} from 'react'
import {message, Form, Input, InputNumber, Button, Select, Radio, DatePicker} from 'antd'
import Layout from '../Layout'
import api from '../../../middleware/api'
import formatter from '../../../middleware/formatter'
import validator from '../../../middleware/validator'
import FormValidator from '../FormValidator'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class NewLoanForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: true
    }
  }

  handlePrevStep(e) {
    this.props.onSuccess({
      currentStep: this.props.prevStep,
      purchaseForm: '',
      loanForm: 'hide'
    });
  }

  handleNextStep(e) {
    e.preventDefault();
    let formData = this.props.form.getFieldsValue();
    if (!formData.bank && !formData.guarantee_user) {
      this.props.onSuccess({
        currentStep: this.props.nexStep,
        loanForm: 'hide',
        insuranceForm: ''
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
      values.sign_date = formatter.date(values.sign_date);

      api.ajax({
        url: this.state.isNew ? api.addPurchaseLoan() : api.editPurchaseLoan(),
        type: 'POST',
        data: values
      }, function (data) {
        message.success(this.state.isNew ? '按揭信息添加成功' : '按揭信息修改成功');
        this.setState({
          isNew: false,
          loan_log_id: data.res.loan_log_id
        });
        if (action === 'NEXT') {
          this.props.onSuccess({
            currentStep: 3,
            loanForm: 'hide',
            insuranceForm: ''
          });
        } else {
          this.props.cancelModal();
          this.props.isSingle ? location.reload() : location.hash = api.getHash();
        }
      }.bind(this))
    });
  }

  render() {
    const {formItemLayout, buttonLayout} = Layout;
    const {getFieldProps} = this.props.form;

    const guaranteeCompanyProps = getFieldProps('guarantee_company', {
      initialValue: '华峰申银资产管理有限公司',
      validate: [{
        rules: [{validator: FormValidator.notNull}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.notNull}],
        trigger: 'onBlur'
      }]
    });

    const guaranteePhoneProps = getFieldProps('guarantee_phone', {
      validate: [{
        rules: [{validator: FormValidator.validatePhone}],
        trigger: ['onBlur']
      }, {
        rules: [{required: false, message: validator.required.phone}],
        trigger: 'onBlur'
      }]
    });

    return (
      <Form horizontal >
        <Input type="hidden" {...getFieldProps('_id', {initialValue: this.state.loan_log_id})}/>
        <Input type="hidden" {...getFieldProps('customer_id', {initialValue: this.props.customer_id})}/>
        <Input type="hidden" {...getFieldProps('seller_user_id', {initialValue: this.props.seller_user_id})}/>
        <Input type="hidden" {...getFieldProps('user_auto_id', {initialValue: this.props.user_auto_id})}/>

        <FormItem label="按揭年限" {...formItemLayout}>
          <RadioGroup {...getFieldProps('loan_years', {initialValue: '1'})}>
            <Radio key="1" value="1">一年</Radio>
            <Radio key="2" value="2">两年</Radio>
            <Radio key="3" value="3">三年</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="按揭银行" {...formItemLayout}>
          <Input {...getFieldProps('bank')} placeholder="请输入按揭银行"/>
        </FormItem>

        <FormItem label="担保公司" {...formItemLayout}>
          <Input {...guaranteeCompanyProps} placeholder="请输入担保公司"/>
        </FormItem>

        <FormItem label="担保人" {...formItemLayout}>
          <Input {...getFieldProps('guarantee_user')} placeholder="请输入担保人"/>
        </FormItem>

        <FormItem label="担保人联系方式" {...formItemLayout}>
          <Input type="number" {...guaranteePhoneProps} placeholder="担保人联系方式"/>
        </FormItem>

        <FormItem label="签单日期" {...formItemLayout}>
          <DatePicker {...getFieldProps('sign_date', {initialValue: new Date()})} placeholder="请选择签单日期"/>
        </FormItem>

        <FormItem label="首付款" {...formItemLayout}>
          <Input type="number" {...getFieldProps('pre_payment')} placeholder="首付款"/>
        </FormItem>

        <FormItem label="贷款金额" {...formItemLayout}>
          <Input type="number" {...getFieldProps('bank_loan')} placeholder="贷款金额"/>
        </FormItem>

        <FormItem label="每月还款" {...formItemLayout}>
          <Input type="number" {...getFieldProps('month_pay')} placeholder="每月还款"/>
        </FormItem>

        <FormItem label="资料费" {...formItemLayout}>
          <Input type="number" {...getFieldProps('material_fee')} placeholder="资料费"/>
        </FormItem>

        <FormItem label="公证费" {...formItemLayout}>
          <Input type="number" {...getFieldProps('notary_fee_in')} placeholder="请输入公证费"/>
        </FormItem>

        <FormItem label="担保费" {...formItemLayout}>
          <Input type="number" {...getFieldProps('guarantee_fee_in')} placeholder="请输入担保费"/>
        </FormItem>

        <FormItem label="银行保证金" {...formItemLayout}>
          <Input type="number" {...getFieldProps('bank_deposit_in')} placeholder="请输入银行保证金"/>
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          <Input {...getFieldProps('remark')} type="textarea" placeholder="备注"/>
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button type="ghost" className={this.props.isSingle ? 'hide' : 'mr15'}
                  onClick={this.handlePrevStep.bind(this)}>上一步</Button>
          <Button type="primary" className={this.props.isSingle ? 'hide' : 'mr15'}
                  onClick={this.handleNextStep.bind(this)}>下一步</Button>
          <Button type={this.props.isSingle ? 'primary' : 'ghost'} onClick={this.handleSubmit.bind(this)}>保存并退出</Button>
        </FormItem>
      </Form>
    )
  }
}

NewLoanForm = Form.create()(NewLoanForm);
export default NewLoanForm
