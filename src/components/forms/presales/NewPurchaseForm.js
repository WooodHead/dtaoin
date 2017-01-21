import React, {Component} from 'react';
import {message, Form, Input, Button, Radio, Select, DatePicker} from 'antd';
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
      isNew: true,
      purchase: {},
      users: [],
    };
  }

  componentDidMount() {
    this.getAutoPurchase(this.props.customer_id, this.props.auto_id);
    this.getPurchaseUsers(0);
  }

  handlePrevStep() {
    this.props.onSuccess({
      currentStep: 0,
      autoForm: '',
      purchaseForm: 'hide',
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
      url: this.state.isNew ? api.presales.deal.addAuto() : api.presales.deal.editAuto(),
      type: 'POST',
      data: formData,
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
            deliverDate: formData.deliver_date,
          });
        } else {
          this.props.onSuccess({
            auto_deal_id: data.res.auto_deal_id,
            currentStep: this.props.nextStep,
            purchaseForm: 'hide',
            loanForm: '',
            payType: formData.pay_type,
          });
        }
      } else {
        this.props.cancelModal();
        location.reload();
      }
    }.bind(this));
  }

  getAutoPurchase(customerId, autoDealId) {
    api.ajax({url: api.autoDealInfo(customerId, autoDealId)}, function (data) {
      let detail = data.res.detail;
      if (detail) {
        this.setState({purchase: detail, isNew: false});
      }
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

    return (
      <Form horizontal>
        {getFieldDecorator('_id', {initialValue: this.props.auto_deal_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('customer_id', {initialValue: this.props.customer_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('auto_id', {initialValue: this.props.auto_id})(
          <Input type="hidden"/>
        )}

        <FormItem label="销售负责人" {...formItemLayout}>
          {getFieldDecorator('seller_user_id')(
            <Select {...selectStyle} placeholder="请选择销售负责人">
              {this.state.users.map(user => <Option key={user._id}>{user.name}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem label="交易类型" {...formItemLayout}>
          {getFieldDecorator('car_type', {initialValue: '1'})(
            <RadioGroup>
              <Radio value="1">现车</Radio>
              <Radio value="0">定车</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem label="付款方式" {...formItemLayout}>
          {getFieldDecorator('pay_type', {initialValue: '1'})(
            <RadioGroup>
              <Radio value="0">全款</Radio>
              <Radio value="1">按揭</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem label="成交时间" {...formItemLayout}>
          {getFieldDecorator('order_date', {initialValue: formatter.getMomentDate()})(
            <DatePicker placeholder="请选择成交时间"/>
          )}
        </FormItem>

        <FormItem label="交车时间" {...formItemLayout}>
          {getFieldDecorator('deliver_date', {initialValue: formatter.getMomentDate()})(
            <DatePicker placeholder="请选择交车时间"/>
          )}
        </FormItem>

        <FormItem label="车辆售价" {...formItemLayout}>
          {getFieldDecorator('sell_price')(
            <Input placeholder="请输入车辆售价"/>
          )}
        </FormItem>

        <FormItem label="置换旧车价" {...formItemLayout}>
          {getFieldDecorator('trade_in_price', {initialValue: '0'})(
            <Input placeholder="请输入置换旧车价"/>
          )}
        </FormItem>

        <FormItem label="订金" {...formItemLayout}>
          {getFieldDecorator('deposit')(
            <Input placeholder="请输入订金"/>
          )}
        </FormItem>

        <FormItem label="上牌费" {...formItemLayout}>
          {getFieldDecorator('license_tax_in')(
            <Input placeholder="请输入上牌费"/>
          )}
        </FormItem>

        <FormItem label="购置税" {...formItemLayout}>
          {getFieldDecorator('purchase_tax')(
            <Input placeholder="请输入购置税"/>
          )}
        </FormItem>

        <FormItem label="赠品内容" {...formItemLayout}>
          {getFieldDecorator('gift')(
            <Input type="textarea" placeholder="请输入赠品内容"/>
          )}
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('remark')(
            <Input type="textarea" placeholder="请输入备注"/>
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

NewPurchaseForm = Form.create()(NewPurchaseForm);
export default NewPurchaseForm;
