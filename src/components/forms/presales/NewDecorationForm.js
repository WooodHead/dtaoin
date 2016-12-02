import React from 'react'
import {message, Form, Input, Button, DatePicker} from 'antd'
import Layout from '../Layout'
import api from '../../../middleware/api'
import formatter from '../../../middleware/formatter'

class NewDecorationForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handlePrevStep(e) {
    this.props.onSuccess({
      currentStep: this.props.prevStep,
      insuranceForm: '',
      decorationForm: 'hide'
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let formData = this.props.form.getFieldsValue();
    formData.deal_date = formatter.date(formData.deal_date);

    if (formData.content) {
      api.ajax({
        url: api.addPurchaseDecoration(),
        type: 'POST',
        data: formData
      }, function (data) {
        message.success('新增装潢交易成功');
        this.exit();
      }.bind(this))
    } else {
      this.exit();
    }
  }

  exit() {
    this.props.cancelModal();
    this.props.isSingle ? location.reload() : location.hash = api.getHash();
  }

  render() {
    const FormItem = Form.Item;
    const {formItemLayout, innerItemLayout, buttonLayout} = Layout;
    let {getFieldProps} = this.props.form;

    return (
      <Form horizontal >
        <Input type="hidden" {...getFieldProps('customer_id', {initialValue: this.props.customer_id})}/>
        <Input type="hidden" {...getFieldProps('user_auto_id', {initialValue: this.props.user_auto_id})}/>

        <FormItem label="装潢时间" {...formItemLayout}>
          <DatePicker {...getFieldProps('deal_date', {initialValue: new Date()})} placeholder="装潢时间"/>
        </FormItem>

        <FormItem label="装潢内容" {...formItemLayout}>
          <Input {...getFieldProps('content')} type="textarea"/>
        </FormItem>

        <FormItem label="装潢金额" {...formItemLayout}>
          <Input {...getFieldProps('price')} placeholder="装潢金额"/>
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          <Input {...getFieldProps('remark')} type="textarea"/>
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button type="ghost" onClick={this.handlePrevStep.bind(this)}
                  className={this.props.isSingle ? 'hide' : 'mr15'}>上一步</Button>
          <Button type="primary" onClick={this.handleSubmit.bind(this)}>完成</Button>
        </FormItem>
      </Form>
    )
  }
}

NewDecorationForm = Form.create()(NewDecorationForm);
export default NewDecorationForm
