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
      isNew: true,
    };
  }

  handlePrevStep() {
    this.props.onSuccess({
      currentStep: this.props.prevStep,
      purchaseForm: '',
      loanForm: 'hide',
    });
  }

  handleNextStep(e) {
    e.preventDefault();
    let formData = this.props.form.getFieldsValue();
    if (!formData.bank && !formData.guarantee_user) {
      this.props.onSuccess({
        currentStep: this.props.nexStep,
        loanForm: 'hide',
        insuranceForm: '',
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
        url: this.state.isNew ? api.presales.deal.addLoan() : api.presales.deal.editLoan(),
        type: 'POST',
        data: values,
      }, function (data) {
        message.success(this.state.isNew ? '按揭信息添加成功' : '按揭信息修改成功');
        this.setState({
          isNew: false,
          loan_log_id: data.res.loan_log_id,
        });
        if (action === 'NEXT') {
          this.props.onSuccess({
            currentStep: 3,
            loanForm: 'hide',
            insuranceForm: '',
          });
        } else {
          this.props.cancelModal();
          location.reload();
        }
      }.bind(this));
    });
  }

  render() {
    const {formItemLayout, buttonLayout} = Layout;
    const {getFieldDecorator} = this.props.form;

    return (
      <Form horizontal>
        {getFieldDecorator('_id', {initialValue: this.state.loan_log_id})(
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

        <FormItem label="按揭年限" {...formItemLayout}>
          {getFieldDecorator('loan_years', {initialValue: '1'})(
            <RadioGroup>
              <Radio key="1" value="1">一年</Radio>
              <Radio key="2" value="2">两年</Radio>
              <Radio key="3" value="3">三年</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem label="按揭银行" {...formItemLayout}>
          {getFieldDecorator('bank')(
            <Input placeholder="请输入按揭银行"/>
          )}
        </FormItem>

        <FormItem label="担保公司" {...formItemLayout}>
          {getFieldDecorator('guarantee_company', {
            initialValue: '华峰申银资产管理有限公司',
            rules: FormValidator.getRuleNotNull(),
            validateTrigger: 'onBlur',
          })(
            <Input placeholder="请输入担保公司"/>
          )}
        </FormItem>

        <FormItem label="担保人" {...formItemLayout}>
          {getFieldDecorator('guarantee_user')(
            <Input placeholder="请输入担保人"/>
          )}
        </FormItem>

        <FormItem label="担保人联系方式" {...formItemLayout}>
          {getFieldDecorator('guarantee_phone', {
            rules: FormValidator.getRulePhoneOrTelNumber(),
            validateTrigger: 'onBlur',
          })(
            <Input placeholder="担保人联系方式"/>
          )}
        </FormItem>

        <FormItem label="签单日期" {...formItemLayout}>
          {getFieldDecorator('sign_date', {initialValue: formatter.getMomentDate()})(
            <DatePicker placeholder="请选择签单日期"/>
          )}
        </FormItem>

        <FormItem label="首付款" {...formItemLayout}>
          {getFieldDecorator('pre_payment')(
            <Input type="number" placeholder="首付款"/>
          )}
        </FormItem>

        <FormItem label="贷款金额" {...formItemLayout}>
          {getFieldDecorator('bank_loan')(
            <Input type="number" placeholder="贷款金额"/>
          )}
        </FormItem>

        <FormItem label="每月还款" {...formItemLayout}>
          {getFieldDecorator('month_pay')(
            <Input type="number" placeholder="每月还款"/>
          )}
        </FormItem>

        <FormItem label="资料费" {...formItemLayout}>
          {getFieldDecorator('material_fee')(
            <Input type="number" placeholder="资料费"/>
          )}
        </FormItem>

        <FormItem label="公证费" {...formItemLayout}>
          {getFieldDecorator('notary_fee_in')(
            <Input type="number" placeholder="请输入公证费"/>
          )}
        </FormItem>

        <FormItem label="担保费" {...formItemLayout}>
          {getFieldDecorator('guarantee_fee_in')(
            <Input type="number" placeholder="请输入担保费"/>
          )}
        </FormItem>

        <FormItem label="银行保证金" {...formItemLayout}>
          {getFieldDecorator('bank_deposit_in')(
            <Input type="number" placeholder="请输入银行保证金"/>
          )}
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('remark')(
            <Input type="textarea" placeholder="备注"/>
          )}
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button type="ghost" className={this.props.isSingle ? 'hide' : 'mr15'}
                  onClick={this.handlePrevStep.bind(this)}>上一步</Button>
          <Button type="primary" className={this.props.isSingle ? 'hide' : 'mr15'}
                  onClick={this.handleNextStep.bind(this)}>下一步</Button>
          <Button type={this.props.isSingle ? 'primary' : 'ghost'} onClick={this.handleSubmit.bind(this)}>保存并退出</Button>
        </FormItem>
      </Form>
    );
  }
}

NewLoanForm = Form.create()(NewLoanForm);
export default NewLoanForm;
