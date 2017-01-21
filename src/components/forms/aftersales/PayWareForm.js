import React from 'react';
import {message, Input, Form, Select, DatePicker, Button} from 'antd';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';

const FormItem = Form.Item;
const Option = Select.Option;

class PayWareForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      supplyCompanies: [],
      supplierId: this.props.supplierId,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getPartSupplyCompanies();
  }

  handleSubmit(e) {
    e.preventDefault();
    let formData = this.props.form.getFieldsValue(),
      supplyCompanies = this.state.supplyCompanies;
    formData.start_time = formatter.date(formData.start_time);
    formData.end_time = formatter.date(formData.end_time);

    supplyCompanies.map(function (item) {
      if (item._id === formData.supplier_id) {
        formData.supplier_company = item.supplier_company;
        return false;
      }
    });

    api.ajax({
      url: api.generatorExpenditureSheet(),
      type: 'POST',
      data: formData,
    }, function (data) {
      message.success('生成对账单成功!');
      this.props.onSuccess({
        currentStep: this.props.nextStep,
        payWareForm: 'hide',
        payWareConfirmForm: '',
        data: data.res.total,
        payObj: formData,
      });
    }.bind(this));
  }

  getPartSupplyCompanies() {
    api.ajax({url: api.getPartsSupplierList()}, function (data) {
      this.setState({supplyCompanies: data.res.list});
    }.bind(this));
  }

  render() {
    const {formItemLayout, buttonLayout, selectStyle} = Layout;
    const {getFieldDecorator} = this.props.form;
    const {supplyCompanies, supplierId} = this.state;

    return (
      <Form horizontal>
        {getFieldDecorator('_id')(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('customer_id')(
          <Input type="hidden"/>
        )}

        <FormItem label="收款方" {...formItemLayout}>
          {getFieldDecorator('supplier_id', {initialValue: supplierId})(
            <Select disabled={!!this.props.supplierId} {...selectStyle}>
              {supplyCompanies.map(item => <Option key={item._id}>{item.supplier_company}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem label="起始时间" {...formItemLayout}>
          {getFieldDecorator('start_time', {initialValue: formatter.getMomentDate(new Date(new Date().setDate(1)))})(
            <DatePicker
              showTime
              format={formatter.pattern.minute}
            />
          )}
        </FormItem>

        <FormItem label="截止时间" {...formItemLayout}>
          {getFieldDecorator('end_time', {initialValue: formatter.getMomentDate()})(
            <DatePicker
              showTime
              format={formatter.pattern.minute}
            />
          )}
        </FormItem>

        <FormItem {...buttonLayout} className="mt15">
          <Button className="mr15" onClick={this.props.cancelModal}>取消</Button>
          <Button type="primary" onClick={this.handleSubmit}>生成结算单</Button>
        </FormItem>
      </Form>
    );
  }
}

PayWareForm = Form.create()(PayWareForm);
export default PayWareForm;
