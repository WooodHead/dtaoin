import React, {Component} from 'react'
import {message, Form, Checkbox, Input, Button} from 'antd'
import api from '../../../middleware/api'
import Layout from '../Layout'

class LostCustomerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      failTypes: [],
      checkedTypes: new Set()
    }
  }

  componentDidMount() {
    this.getFailTypes();
  }

  handleSubmit(e) {
    e.preventDefault();
    let formData = this.props.form.getFieldsValue();
    formData.fail_types = Array.from(this.state.checkedTypes).toString();

    api.ajax({
      url: api.lostCustomerIntention(),
      type: 'POST',
      data: formData
    }, function (data) {
      message.success('保存成功');
      this.props.cancelModal();
      this.props.size ? location.reload() : location.hash = api.getHash();
    }.bind(this))
  }

  handleChange(e) {
    let checkedTypeSet = this.state.checkedTypes;
    if (e.target.checked) {
      checkedTypeSet.add(e.target.value);
    } else {
      checkedTypeSet.delete(e.target.value);
    }
    this.setState({checkedTypes: checkedTypeSet})
  }

  getFailTypes() {
    api.ajax({url: api.getIntentionFailTypes()}, function (data) {
      this.setState({failTypes: data.res.types});
    }.bind(this))
  }

  render() {
    const FormItem = Form.Item;
    const {formItemLayout, buttonLayout} = Layout;
    const {getFieldProps} = this.props.form;

    return (
      <Form horizontal >
        <Input type="hidden" {...getFieldProps('_id', {initialValue: this.props.intention_id})}/>
        <Input type="hidden" {...getFieldProps('customer_id', {initialValue: this.props.customer_id})}/>

        {this.state.failTypes.map((failType, index) =>
          <FormItem label={`${failType.name}：`} {...formItemLayout}>
            {failType.sub_types.map((type, index) =>
              <label className="ant-checkbox-inline">
                <Checkbox key={index} value={type.id} onChange={this.handleChange.bind(this)}/> {type.name}
              </label>
            )}
          </FormItem>
        )}

        <FormItem label="流失原因" {...formItemLayout}>
          <Input {...getFieldProps('fail_reason')} type="textarea" placeholder="流失原因"/>
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button onClick={this.props.cancelModal} className="mr15">取消</Button>
          <Button type="primary" onClick={this.handleSubmit.bind(this)}>确定</Button>
        </FormItem>
      </Form>
    );
  }
}

LostCustomerForm = Form.create()(LostCustomerForm);
export default LostCustomerForm
