import React, {Component} from 'react'
import {message, Form, Input, InputNumber, Button, Radio, Select, DatePicker} from 'antd'
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
      isNew: true,
      purchase: {},
      users: []
    }
  }

  componentDidMount() {
    this.getAutoPurchase(this.props.customer_id, this.props.user_auto_id);
    this.getPurchaseUsers(0);
  }

  handlePrevStep(e) {
    this.props.onSuccess({
      currentStep: 0,
      autoForm: '',
      purchaseForm: 'hide'
    });
  }

  handleNextStep(e) {
    e.preventDefault();
    this.handleSubmit(e, 'NEXT');
  }

  handleSubmit(e, action) {
    e.preventDefault();
    let formData = this.props.form.getFieldsValue();
    formData.order_date = formatter.day(formData.order_date);
    formData.deliver_date = formatter.day(formData.deliver_date);

    api.ajax({
      url: this.state.isNew ? api.addPurchaseDeal() : api.editPurchaseAutoDeal(),
      type: 'POST',
      data: formData
    }, function (data) {
      message.success(this.state.isNew ? '交易信息添加成功' : '交易信息修改成功');
      this.setState({isNew: false});

      if (action === 'NEXT') {
        if (formData.pay_type === '0') {
          this.props.onSuccess({
            auto_deal_id: data.res.auto_deal_id,
            currentStep: this.props.nextStep + 1,
            purchaseForm: 'hide',
            insuranceForm: '',
            payType: formData.pay_type,
            deliverDate: formData.deliver_date
          });
        } else {
          this.props.onSuccess({
            auto_deal_id: data.res.auto_deal_id,
            currentStep: this.props.nextStep,
            purchaseForm: 'hide',
            loanForm: '',
            payType: formData.pay_type
          });
        }
      } else {
        this.props.cancelModal();
        this.props.isSingle ? location.reload() : location.hash = api.getHash();
      }
    }.bind(this));
  }

  getAutoPurchase(customerId, autoDealId) {
    api.ajax({url: api.autoDealInfo(customerId, autoDealId)}, function (data) {
      let detail = data.res.detail;
      if (detail) {
        this.setState({purchase: detail, isNew: false})
      }
    }.bind(this))
  }

  getPurchaseUsers(isLeader) {
    api.ajax({url: api.user.getPurchaseUsers(isLeader)}, function (data) {
      this.setState({users: data.res.user_list});
    }.bind(this))
  }

  render() {
    const {formItemLayout, buttonLayout, selectStyle} = Layout;
    const {getFieldProps} = this.props.form;

    return (
      <Form horizontal >
        <Input type="hidden" {...getFieldProps('_id', {initialValue: this.props.auto_deal_id})}/>
        <Input type="hidden" {...getFieldProps('customer_id', {initialValue: this.props.customer_id})}/>
        <Input type="hidden" {...getFieldProps('user_auto_id', {initialValue: this.props.user_auto_id})}/>

        <FormItem label="销售负责人" {...formItemLayout}>
          <Select {...getFieldProps('seller_user_id')} size="large" {...selectStyle} placeholder="请选择销售负责人">
            {this.state.users.map(user => <Option key={user._id}>{user.name}</Option>)}
          </Select>
        </FormItem>

        <FormItem label="交易类型" {...formItemLayout}>
          <RadioGroup {...getFieldProps('car_type', {initialValue: '1'})}>
            <Radio value="1">现车</Radio>
            <Radio value="0">定车</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="付款方式" {...formItemLayout}>
          <RadioGroup {...getFieldProps('pay_type', {initialValue: '1'})}>
            <Radio value="0">全款</Radio>
            <Radio value="1">按揭</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="成交时间" {...formItemLayout}>
          <DatePicker {...getFieldProps('order_date', {initialValue: new Date()})} placeholder="请选择成交时间"/>
        </FormItem>

        <FormItem label="交车时间" {...formItemLayout}>
          <DatePicker {...getFieldProps('deliver_date', {initialValue: new Date()})} placeholder="请选择交车时间"/>
        </FormItem>

        <FormItem label="车辆售价" {...formItemLayout}>
          <Input {...getFieldProps('sell_price')} placeholder="请输入车辆售价"/>
        </FormItem>

        <FormItem label="置换旧车价" {...formItemLayout}>
          <Input {...getFieldProps('trade_in_price', {initialValue: '0'})} placeholder="请输入置换旧车价"/>
        </FormItem>

        <FormItem label="订金" {...formItemLayout}>
          <Input {...getFieldProps('deposit')} placeholder="请输入订金"/>
        </FormItem>

        <FormItem label="上牌费" {...formItemLayout}>
          <Input {...getFieldProps('license_tax_in')} placeholder="请输入上牌费"/>
        </FormItem>

        <FormItem label="购置税" {...formItemLayout}>
          <Input {...getFieldProps('purchase_tax')} placeholder="请输入购置税"/>
        </FormItem>

        <FormItem label="赠品内容" {...formItemLayout}>
          <Input {...getFieldProps('gift')} type="textarea" placeholder="请输入赠品内容"/>
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          <Input {...getFieldProps('remark')} type="textarea" placeholder="请输入备注"/>
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button type="ghost" className={this.props.isSingle ? 'hide' : 'mr15'}
                  onClick={this.handlePrevStep.bind(this)}>上一步</Button>
          <Button type="primary" className={this.props.isSingle ? 'hide' : 'mr15'}
                  onClick={this.handleNextStep.bind(this)}>下一步</Button>
          <Button type={this.props.isSingle ? 'primary' : 'ghost'} onClick={this.handleSubmit.bind(this)}>保存并退出</Button>
        </FormItem>
      </Form>
    )
  }
}

NewPurchaseForm = Form.create()(NewPurchaseForm);
export default NewPurchaseForm
