import React, {Component} from 'react'
import {message, Form, Input, Button, Radio, Select, DatePicker} from 'antd'
import Layout from '../Layout'
import api from '../../../middleware/api'
import formatter from '../../../middleware/formatter'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class NewPurchaseForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      purchase: {},
      users: []
    }
  }

  componentDidMount() {
    this.getDepartmentUsers(1, 300);
    this.getPurchaseDealDetail(this.props.customer_id, this.props.user_auto_id);
  }

  handleSubmit(e) {
    e.preventDefault();
    let formData = this.props.form.getFieldsValue();
    formData.order_date = formatter.day(formData.order_date);
    formData.deliver_date = formatter.day(formData.deliver_date);

    api.ajax({
      url: api.editPurchaseAutoDeal(),
      type: 'POST',
      data: formData
    }, function (data) {
      message.success('修改交易成功');
      this.props.cancelModal();
      location.reload();
    }.bind(this))
  }

  getPurchaseDealDetail(customerId, userAutoId) {
    api.ajax({url: api.getPurchaseDealDetail(customerId, userAutoId)}, function (data) {
      this.setState({purchase: data.res.detail})
    }.bind(this))
  }

  getDepartmentUsers(departmentId, role) {
    api.ajax({url: api.getDepartmentUsers(departmentId, role)}, function (data) {
      this.setState({users: data.res.user_list});
    }.bind(this))
  }

  render() {
    const {formItemLayout, buttonLayout, selectStyle} = Layout;
    const {getFieldProps} = this.props.form;
    const {purchase} = this.state;

    return (
      <Form horizontal >
        <Input type="hidden" {...getFieldProps('_id', {initialValue: purchase._id})}/>
        <Input type="hidden" {...getFieldProps('customer_id', {initialValue: purchase.customer_id})}/>
        <Input type="hidden" {...getFieldProps('user_auto_id', {initialValue: purchase.user_auto_id})}/>

        <FormItem label="销售负责人" {...formItemLayout}>
          <Select
            {...getFieldProps('seller_user_id', {initialValue: purchase.seller_user_id})}
            size="large"
            {...selectStyle}
            placeholder="请选择销售负责人">
            {this.state.users.map(user => <Option key={user._id}>{user.name}</Option>)}
          </Select>
        </FormItem>

        <FormItem label="交易类型" {...formItemLayout}>
          <RadioGroup {...getFieldProps('car_type', {initialValue: purchase.car_type})}>
            <Radio key="1" value="1">现车</Radio>
            <Radio key="0" value="0">定车</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="付款方式" {...formItemLayout}>
          <RadioGroup {...getFieldProps('pay_type', {initialValue: purchase.pay_type})}>
            <Radio key="1" value="1">按揭</Radio>
            <Radio key="0" value="0">全款</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="成交时间" {...formItemLayout}>
          <DatePicker {...getFieldProps('order_date', {initialValue: purchase.order_date})} placeholder="请选择成交时间"/>
        </FormItem>

        <FormItem label="交车时间" {...formItemLayout}>
          <DatePicker {...getFieldProps('deliver_date', {initialValue: purchase.deliver_date})} placeholder="请选择交车时间"/>
        </FormItem>

        <FormItem label="车辆售价" {...formItemLayout}>
          <Input {...getFieldProps('sell_price', {initialValue: purchase.sell_price})} placeholder="请输入车辆售价"/>
        </FormItem>

        <FormItem label="置换旧车价" {...formItemLayout}>
          <Input {...getFieldProps('trade_in_price', {initialValue: purchase.trade_in_price})} placeholder="请输入置换旧车价"/>
        </FormItem>

        <FormItem label="订金" {...formItemLayout}>
          <Input {...getFieldProps('deposit', {initialValue: purchase.deposit})} placeholder="请输入订金"/>
        </FormItem>

        <FormItem label="上牌费" {...formItemLayout}>
          <Input {...getFieldProps('license_tax_in', {initialValue: purchase.license_tax_in})} placeholder="请输入上牌费"/>
        </FormItem>

        <FormItem label="购置税" {...formItemLayout}>
          <Input {...getFieldProps('purchase_tax', {initialValue: purchase.purchase_tax})} placeholder="请输入购置税"/>
        </FormItem>

        <FormItem label="赠品内容" {...formItemLayout}>
          <Input {...getFieldProps('gift', {initialValue: purchase.gift})} type="textarea" placeholder="请输入赠品内容"/>
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          <Input {...getFieldProps('remark', {initialValue: purchase.remark})} type="textarea" placeholder="请输入备注"/>
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button onClick={this.props.cancelModal} className="mr15">取消</Button>
          <Button type="primary" onClick={this.handleSubmit.bind(this)}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}

NewPurchaseForm = Form.create()(NewPurchaseForm);
export default NewPurchaseForm
