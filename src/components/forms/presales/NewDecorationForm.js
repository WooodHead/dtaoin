import React from 'react';
import {message, Form, Input, Button, DatePicker} from 'antd';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';

class NewDecorationForm extends React.Component {
  constructor(props) {
    super(props);
    [
      'exit',
    ].map(method=>this[method]=this[method].bind(this));
  }

  handlePrevStep() {
    this.props.onSuccess({
      currentStep: this.props.prevStep,
      insuranceForm: '',
      decorationForm: 'hide',
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let formData = this.props.form.getFieldsValue();
    formData.deal_date = formatter.date(formData.deal_date);
    if (formData.content) {
      api.ajax({
          url: api.presales.deal.addDecoration(),
          type: 'POST',
          data: formData,
        },
        () => {
          message.success('新增装潢交易成功');
          this.exit();
        });
    } else {
      this.exit();
    }
  }

  exit() {
    this.props.cancelModal();
    location.reload();
  }

  render() {
    const FormItem = Form.Item;
    const {formItemLayout, buttonLayout} = Layout;
    let {getFieldDecorator} = this.props.form;

    return (
      <Form horizontal>
        {getFieldDecorator('customer_id', {initialValue: this.props.customer_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('auto_id', {initialValue: this.props.auto_id})(
          <Input type="hidden"/>
        )}

        <FormItem label="装潢时间" {...formItemLayout}>
          {getFieldDecorator('deal_date', {initialValue: formatter.getMomentDate()})(
            <DatePicker placeholder="装潢时间"/>
          )}
        </FormItem>

        <FormItem label="装潢内容" {...formItemLayout}>
          {getFieldDecorator('content')(
            <Input type="textarea"/>
          )}
        </FormItem>

        <FormItem label="装潢金额" {...formItemLayout}>
          {getFieldDecorator('price')(
            <Input placeholder="装潢金额"/>
          )}
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('remark')(
            <Input type="textarea"/>
          )}
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button type="ghost" onClick={this.handlePrevStep.bind(this)}
                  className={this.props.isSingle ? 'hide' : 'mr15'}>上一步</Button>
          <Button type="primary" onClick={this.handleSubmit.bind(this)}>完成</Button>
        </FormItem>
      </Form>
    );
  }
}

NewDecorationForm = Form.create()(NewDecorationForm);
export default NewDecorationForm;
