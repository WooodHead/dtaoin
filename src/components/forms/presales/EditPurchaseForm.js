import React, {Component} from 'react';
import {Alert, message, Form, Input, Button, Radio, Select, DatePicker} from 'antd';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class NewPurchaseForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      purchase: {},
      users: [],
    };
  }

  componentDidMount() {
    this.getPurchaseUsers(0);
    this.getPurchaseDealDetail(this.props.customer_id, this.props.auto_id);
  }

  handleSubmit(e) {
    e.preventDefault();
    let formData = this.props.form.getFieldsValue();
    formData.order_date = formatter.day(formData.order_date);
    formData.deliver_date = formatter.day(formData.deliver_date);

    api.ajax({
      url: api.presales.deal.editAuto(),
      type: 'POST',
      data: formData,
    }, function () {
      message.success('修改交易成功');
      this.props.cancelModal();
      location.reload();
    }.bind(this));
  }

  getPurchaseDealDetail(customerId, autoId) {
    api.ajax({url: api.presales.deal.detail(customerId, autoId)}, function (data) {
      let {detail} = data.res;
      this.setState({purchase: detail});
      this.props.form.setFieldsValue({'seller_user_id': detail.seller_user_id});
    }.bind(this));
  }

  getPurchaseUsers(isLeader) {
    api.ajax({url: api.user.getPurchaseUsers(isLeader)}, function (data) {
      this.setState({users: data.res.user_list});
    }.bind(this));
  }

  render() {
    const {formItemLayout, buttonLayout, selectStyle} = Layout;
    const {getFieldDecorator} = this.props.form;
    const {purchase, users} = this.state;

    let selectSellerUser = users.filter(user => user._id === purchase.seller_user_id);

    return (
      <Form horizontal>
        {getFieldDecorator('_id', {initialValue: purchase._id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('customer_id', {initialValue: purchase.customer_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('auto_id', {initialValue: purchase.auto_id})(
          <Input type="hidden"/>
        )}

        {!selectSellerUser ? null : <FormItem><Alert message="销售负责人不存在，请重新选择！" banner closable/></FormItem>}

        <FormItem label="销售负责人" {...formItemLayout}>
          {getFieldDecorator('seller_user_id', {initialValue: purchase.seller_user_id})(
            <Select{...selectStyle} onSelect={this.handleSellerChange} placeholder="请选择销售负责人">
              {users.map(user => <Option key={user._id}>{user.name}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem label="交易类型" {...formItemLayout}>
          {getFieldDecorator('car_type', {initialValue: purchase.car_type})(
            <RadioGroup>
              <Radio key="1" value="1">现车</Radio>
              <Radio key="0" value="0">定车</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem label="付款方式" {...formItemLayout}>
          {getFieldDecorator('pay_type', {initialValue: purchase.pay_type})(
            <RadioGroup>
              <Radio key="1" value="1">按揭</Radio>
              <Radio key="0" value="0">全款</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem label="成交时间" {...formItemLayout}>
          {getFieldDecorator('order_date', {initialValue: formatter.getMomentDate(purchase.order_date)})(
            <DatePicker placeholder="请选择成交时间"/>
          )}
        </FormItem>

        <FormItem label="交车时间" {...formItemLayout}>
          {getFieldDecorator('deliver_date', {initialValue: formatter.getMomentDate(purchase.deliver_date)})(
            <DatePicker placeholder="请选择交车时间"/>
          )}
        </FormItem>

        <FormItem label="车辆售价" {...formItemLayout}>
          {getFieldDecorator('sell_price', {initialValue: purchase.sell_price})(
            <Input placeholder="请输入车辆售价"/>
          )}
        </FormItem>

        <FormItem label="置换旧车价" {...formItemLayout}>
          {getFieldDecorator('trade_in_price', {initialValue: purchase.trade_in_price})(
            <Input placeholder="请输入置换旧车价"/>
          )}
        </FormItem>

        <FormItem label="订金" {...formItemLayout}>
          {getFieldDecorator('deposit', {initialValue: purchase.deposit})(
            <Input placeholder="请输入订金"/>
          )}
        </FormItem>

        <FormItem label="上牌费" {...formItemLayout}>
          {getFieldDecorator('license_tax_in', {initialValue: purchase.license_tax_in})(
            <Input placeholder="请输入上牌费"/>
          )}
        </FormItem>

        <FormItem label="购置税" {...formItemLayout}>
          {getFieldDecorator('purchase_tax', {initialValue: purchase.purchase_tax})(
            <Input placeholder="请输入购置税"/>
          )}
        </FormItem>

        <FormItem label="赠品内容" {...formItemLayout}>
          {getFieldDecorator('gift', {initialValue: purchase.gift})(
            <Input type="textarea" placeholder="请输入赠品内容"/>
          )}
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('remark', {initialValue: purchase.remark})(
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

NewPurchaseForm = Form.create()(NewPurchaseForm);
export default NewPurchaseForm;
