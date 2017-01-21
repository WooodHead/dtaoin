import React, {Component} from 'react';
import {message, Form, Input, Button, Radio, DatePicker} from 'antd';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class NewLoanForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loan: {},
    };
  }

  componentDidMount() {
    this.getPurchaseLoanDetail(this.props.customer_id, this.props.auto_id);
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
        url: api.presales.deal.editLoan(),
        type: 'POST',
        data: values,
      }, function () {
        message.success('修改按揭交易成功');
        this.props.cancelModal();
        location.reload();
      }.bind(this));
    });
  }

  getPurchaseLoanDetail(customerId, autoId) {
    api.ajax({url: api.presales.deal.getLoanDetail(customerId, autoId)}, function (data) {
      let detail = data.res.detail;
      this.setState({loan: detail});
      this.props.form.setFieldsValue({guarantee_phone: detail.guarantee_phone});
    }.bind(this));
  }

  render() {
    const {formItemLayout, buttonLayout} = Layout;
    const {getFieldDecorator} = this.props.form;
    const {loan} = this.state;

    return (
      <Form horizontal>
        {getFieldDecorator('_id', {initialValue: loan._id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('customer_id', {initialValue: loan.customer_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('seller_user_id', {initialValue: loan.seller_user_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('auto_id', {initialValue: loan.auto_id})(
          <Input type="hidden"/>
        )}

        <FormItem label="按揭年限" {...formItemLayout}>
          {getFieldDecorator('loan_years', {initialValue: loan.loan_years})(
            <RadioGroup>
              <Radio key="1" value="1">一年</Radio>
              <Radio key="2" value="2">两年</Radio>
              <Radio key="3" value="3">三年</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem label="按揭银行" {...formItemLayout}>
          {getFieldDecorator('bank', {initialValue: loan.bank})(
            <Input placeholder="请输入按揭银行"/>
          )}
        </FormItem>

        <FormItem label="担保公司" {...formItemLayout}>
          {getFieldDecorator('guarantee_company', {
            initialValue: loan.guarantee_company || '华峰申银资产管理有限公司',
            rules: FormValidator.getRuleNotNull(),
            validateTrigger: 'onBlur',
          })(
            <Input placeholder="请输入担保公司"/>
          )}
        </FormItem>

        <FormItem label="担保人" {...formItemLayout}>
          {getFieldDecorator('guarantee_user', {initialValue: loan.guarantee_user})(
            <Input placeholder="请输入担保人"/>
          )}
        </FormItem>

        <FormItem label="担保人联系方式" {...formItemLayout}>
          {getFieldDecorator('guarantee_phone', {
            initialValue: loan.guarantee_phone,
            rules: [{required: false, message: validator.required.phone}, {validator: FormValidator.validatePhone}],
            validateTrigger: 'onBlur',
          })(
            <Input placeholder="担保人联系方式"/>
          )}
        </FormItem>

        <FormItem label="签单日期" {...formItemLayout}>
          {getFieldDecorator('sign_date', {initialValue: formatter.getMomentDate(loan.sign_date)})(
            <DatePicker placeholder="请选择签单日期"/>
          )}
        </FormItem>

        <FormItem label="首付款" {...formItemLayout}>
          {getFieldDecorator('pre_payment', {initialValue: loan.pre_payment})(
            <Input placeholder="请输入首付款"/>
          )}
        </FormItem>

        <FormItem label="贷款金额" {...formItemLayout}>
          {getFieldDecorator('bank_loan', {initialValue: loan.bank_loan})(
            <Input placeholder="请输入贷款金额"/>
          )}
        </FormItem>

        <FormItem label="每月还款" {...formItemLayout}>
          {getFieldDecorator('month_pay', {initialValue: loan.month_pay})(
            <Input placeholder="请输入每月还款"/>
          )}
        </FormItem>

        <FormItem label="资料费" {...formItemLayout}>
          {getFieldDecorator('material_fee', {initialValue: loan.material_fee})(
            <Input placeholder="请输入资料费"/>
          )}
        </FormItem>

        <FormItem label="公证费" {...formItemLayout}>
          {getFieldDecorator('notary_fee_in', {initialValue: loan.notary_fee_in})(
            <Input type="number" placeholder="请输入公证费"/>
          )}
        </FormItem>

        <FormItem label="担保费" {...formItemLayout}>
          {getFieldDecorator('guarantee_fee_in', {initialValue: loan.guarantee_fee_in})(
            <Input type="number" placeholder="请输入担保费"/>
          )}
        </FormItem>

        <FormItem label="银行保证金" {...formItemLayout}>
          {getFieldDecorator('bank_deposit_in', {initialValue: loan.bank_deposit_in})(
            <Input type="number" placeholder="请输入银行保证金"/>
          )}
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('remark', {initialValue: loan.remark})(
            <Input type="textarea" placeholder="请输入备注"/>
          )}
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button onClick={this.props.cancelModal} className="mr15">取消</Button>
          <Button type="primary" onClick={this.handleSubmit.bind(this)}>保存</Button>
        </FormItem>
      </Form>
    );
  }
}

NewLoanForm = Form.create()(NewLoanForm);
export default NewLoanForm;
