import React from 'react'
import {message, Form, Input, Button, DatePicker} from 'antd'
import Layout from '../Layout'
import api from '../../../middleware/api'
import formatter from '../../../middleware/formatter'


class NewDecorationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      decoration: {}
    }
  }

  componentDidMount() {
    this.getPurchaseDecorationDetail(this.props.customer_id, this.props.user_auto_id);
  }

  handleSubmit(e) {
    e.preventDefault();
    let formData = this.props.form.getFieldsValue();
    formData.deal_date = formatter.date(formData.deal_date);

    api.ajax({
      url: api.editPurchaseDecoration(),
      type: 'POST',
      data: formData
    }, function (data) {
      message.success('修改装潢交易成功');
      this.props.cancelModal();
      location.reload();
    }.bind(this))
  }

  getPurchaseDecorationDetail(customerId, userAutoId) {
    api.ajax({url: api.getPurchaseDecorationDetail(customerId, userAutoId)}, function (data) {
      this.setState({decoration: data.res.detail})
    }.bind(this))
  }

  render() {
    const FormItem = Form.Item;
    const {formItemLayout, buttonLayout} = Layout;
    const {getFieldProps} = this.props.form;
    let {decoration} = this.state;

    return (
      <Form horizontal >
        <Input type="hidden" {...getFieldProps('_id', {initialValue: decoration._id})}/>
        <Input type="hidden" {...getFieldProps('customer_id', {initialValue: decoration.customer_id})}/>
        <Input type="hidden" {...getFieldProps('user_auto_id', {initialValue: decoration.user_auto_id})}/>

        <FormItem label="装潢时间" {...formItemLayout}>
          <DatePicker {...getFieldProps('deal_date', {initialValue: decoration.deal_date ? decoration.deal_date : new Date()})}
                      placeholder="装潢时间"/>
        </FormItem>

        <FormItem label="装潢内容" {...formItemLayout}>
          <Input {...getFieldProps('content', {initialValue: decoration.content})} type="textarea"/>
        </FormItem>

        <FormItem label="装潢金额" className="form-item-container" {...formItemLayout}>
          <Input {...getFieldProps('price', {initialValue: decoration.price})}/>
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          <Input {...getFieldProps('remark', {initialValue: decoration.remark})} type="textarea"/>
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button onClick={this.props.cancelModal} className="mr15">取消</Button>
          <Button type="primary" onClick={this.handleSubmit.bind(this)}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}

NewDecorationForm = Form.create()(NewDecorationForm);
export default NewDecorationForm
