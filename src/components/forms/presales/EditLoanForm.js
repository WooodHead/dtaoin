import React, {Component} from 'react'
import {message, Form, Input, Button, Select, Radio, DatePicker} from 'antd'
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
      loan: {}
    }
  }

  componentDidMount() {
    this.getPurchaseLoanDetail(this.props.customer_id, this.props.user_auto_id);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }
      values.sign_date = formatter.date(values.sign_date);

      api.ajax({
        url: api.editPurchaseLoan(),
        type: 'POST',
        data: values
      }, function (data) {
        message.success('修改按揭交易成功');
        this.props.cancelModal();
        location.reload();
      }.bind(this))
    });
  }

  getPurchaseLoanDetail(customerId, userAutoId) {
    api.ajax({url: api.getPurchaseLoanDetail(customerId, userAutoId)}, function (data) {
      let detail = data.res.detail;
      this.setState({loan: detail});
      this.props.form.setFieldsValue({guarantee_phone: detail.guarantee_phone})
    }.bind(this))
  }

  render() {
    const {formItemLayout, buttonLayout} = Layout;
    const {getFieldProps} = this.props.form;
    const {loan} = this.state;

    const guaranteeCompanyProps = getFieldProps('guarantee_company', {
      initialValue: loan.guarantee_company || '华峰申银资产管理有限公司',
      validate: [{
        rules: [{validator: FormValidator.notNull}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.notNull}],
        trigger: 'onBlur'
      }]
    });

    const guaranteePhoneProps = getFieldProps('guarantee_phone', {
      initialValue: loan.guarantee_phone,
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
        <Input type="hidden" {...getFieldProps('_id', {initialValue: loan._id})}/>
        <Input type="hidden" {...getFieldProps('customer_id', {initialValue: loan.customer_id})}/>
        <Input type="hidden" {...getFieldProps('seller_user_id', {initialValue: loan.seller_user_id})}/>
        <Input type="hidden" {...getFieldProps('user_auto_id', {initialValue: loan.user_auto_id})}/>

        <FormItem label="按揭年限" {...formItemLayout}>
          <RadioGroup {...getFieldProps('loan_years', {initialValue: loan.loan_years})}>
            <Radio key="1" value="1">一年</Radio>
            <Radio key="2" value="2">两年</Radio>
            <Radio key="3" value="3">三年</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="按揭银行" {...formItemLayout}>
          <Input {...getFieldProps('bank', {initialValue: loan.bank})} placeholder="请输入按揭银行"/>
        </FormItem>

        <FormItem label="担保公司" {...formItemLayout}>
          <Input {...guaranteeCompanyProps} placeholder="请输入担保公司"/>
        </FormItem>

        <FormItem label="担保人" {...formItemLayout}>
          <Input {...getFieldProps('guarantee_user', {initialValue: loan.guarantee_user})} placeholder="请输入担保人"/>
        </FormItem>

        <FormItem label="担保人联系方式" {...formItemLayout}>
          <Input {...guaranteePhoneProps} placeholder="担保人联系方式"/>
        </FormItem>

        <FormItem label="签单日期" {...formItemLayout}>
          <DatePicker {...getFieldProps('sign_date', {initialValue: loan.sign_date})} placeholder="请选择签单日期"/>
        </FormItem>

        <FormItem label="首付款" {...formItemLayout}>
          <Input {...getFieldProps('pre_payment', {initialValue: loan.pre_payment})} placeholder="请输入首付款"/>
        </FormItem>

        <FormItem label="贷款金额" {...formItemLayout}>
          <Input {...getFieldProps('bank_loan', {initialValue: loan.bank_loan})} placeholder="请输入贷款金额"/>
        </FormItem>

        <FormItem label="每月还款" {...formItemLayout}>
          <Input {...getFieldProps('month_pay', {initialValue: loan.month_pay})} placeholder="请输入每月还款"/>
        </FormItem>

        <FormItem label="资料费" {...formItemLayout}>
          <Input {...getFieldProps('material_fee', {initialValue: loan.material_fee})} placeholder="请输入资料费"/>
        </FormItem>

        <FormItem label="公证费" {...formItemLayout}>
          <Input type="number" {...getFieldProps('notary_fee_in', {initialValue: loan.notary_fee_in})}
                 placeholder="请输入公证费"/>
        </FormItem>

        <FormItem label="担保费" {...formItemLayout}>
          <Input type="number" {...getFieldProps('guarantee_fee_in', {initialValue: loan.guarantee_fee_in})}
                 placeholder="请输入担保费"/>
        </FormItem>

        <FormItem label="银行保证金" {...formItemLayout}>
          <Input type="number" {...getFieldProps('bank_deposit_in', {initialValue: loan.bank_deposit_in})}
                 placeholder="请输入银行保证金"/>
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          <Input {...getFieldProps('remark', {initialValue: loan.remark})} type="textarea" placeholder="请输入备注"/>
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button onClick={this.props.cancelModal} className="mr15">取消</Button>
          <Button type="primary" onClick={this.handleSubmit.bind(this)}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}

NewLoanForm = Form.create()(NewLoanForm);
export default NewLoanForm
