import React from 'react';
import {message, Form, Input, Button, DatePicker} from 'antd';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';


class NewDecorationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      decoration: {},
    };
  }

  componentDidMount() {
    this.getPurchaseDecorationDetail(this.props.customer_id, this.props.auto_id);
  }

  handleSubmit(e) {
    e.preventDefault();
    let formData = this.props.form.getFieldsValue();
    formData.deal_date = formatter.date(formData.deal_date);

    api.ajax({
      url: api.presales.deal.editDecoration(),
      type: 'POST',
      data: formData,
    }, function () {
      message.success('修改装潢交易成功');
      this.props.cancelModal();
      location.reload();
    }.bind(this));
  }

  getPurchaseDecorationDetail(customerId, userAutoId) {
    api.ajax({url: api.presales.deal.getDecorationLogDetail(customerId, userAutoId)}, function (data) {
      this.setState({decoration: data.res.detail});
    }.bind(this));
  }

  render() {
    const FormItem = Form.Item;
    const {formItemLayout, buttonLayout} = Layout;
    const {getFieldDecorator} = this.props.form;
    let {decoration} = this.state;

    return (
      <Form horizontal>
        {getFieldDecorator('_id', {initialValue: decoration._id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('customer_id', {initialValue: decoration.customer_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('auto_id', {initialValue: decoration.auto_id})(
          <Input type="hidden"/>
        )}

        <FormItem label="装潢时间" {...formItemLayout}>
          {getFieldDecorator('deal_date', {initialValue: decoration.deal_date ? formatter.getMomentDate(decoration.deal_date) : formatter.getMomentDate()})(
            <DatePicker placeholder="装潢时间"/>
          )}
        </FormItem>

        <FormItem label="装潢内容" {...formItemLayout}>
          {getFieldDecorator('content', {initialValue: decoration.content})(
            <Input type="textarea"/>
          )}
        </FormItem>

        <FormItem label="装潢金额" className="form-item-container" {...formItemLayout}>
          {getFieldDecorator('price', {initialValue: decoration.price})(
            <Input />
          )}
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('remark', {initialValue: decoration.remark})(
            <Input type="textarea"/>
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

NewDecorationForm = Form.create()(NewDecorationForm);
export default NewDecorationForm;
