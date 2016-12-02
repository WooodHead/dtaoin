import React from 'react'
import {Row, Col, Modal, Icon, Button, Form, Input, DatePicker, Select} from 'antd'
import api from '../../../middleware/api'
import Layout from '../../forms/Layout'
import BaseModal from '../../base/BaseModal'
import NewExpenseType from '../../popover/NewExpenseType'
import formatter from '../../../middleware/formatter'

const FormItem = Form.Item;

class FNewExpenceModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      expenseTypes: [],
      formData: {}
    };
  }

  componentDidMount() {
    this.getExpensiveTypes();
  }

  handleSubmit() {
    let formData = this.props.form.getFieldsValue();
    formData.ptime = formatter.day(formData.ptime);

    api.ajax({
      url: api.newDailyExpense(),
      type: 'POST',
      data: formData
    }, function (data) {
      this.hideModal();
      location.hash = api.getHash();
    }.bind(this))
  }

  saveNewType(newItem) {
    api.ajax({
      url: api.newExpenseType(),
      type: 'POST',
      data: {name: newItem}
    }, function (data) {
      this.getExpensiveTypes(data.res.expenditure_type._id);
    }.bind(this));
  }

  getExpensiveTypes(newTypeId) {
    api.ajax({url: api.getExpenseTypeList()}, function (data) {
      this.setState({expenseTypes: data.res.list});
      if (newTypeId) {
        this.props.form.setFieldsValue({expenditure_type: newTypeId});
      }
    }.bind(this));
  }

  render() {
    const {formItemLayout, formItemLg, buttonLayout, selectStyle} = Layout;
    const {getFieldProps} = this.props.form;
    const {visible, expenseTypes} = this.state;

    return (
      <span>
        <Button type="primary"
                className="margin-left-20"
                onClick={this.showModal}>
          新增支出
        </Button>
        <Modal title={<span><Icon type="plus" className="margin-right-10"/>新增支出</span>}
               visible={visible}
               width="680px"
               onOk={this.handleSubmit.bind(this)}
               onCancel={this.hideModal}>

          <Form horizontal form={this.props.form}>
            <FormItem label="付款日期" {...formItemLayout}>
              <DatePicker {...getFieldProps('ptime', {initialValue: new Date()})}/>
            </FormItem>

            <Row>
              <Col span="13">
                <FormItem label="支付类型"
                          labelCol={{span: 11}}
                          wrapperCol={{span: 11}}>
                  <Select
                    {...getFieldProps('expenditure_type')}
                    size="large"
                    {...selectStyle}>
                    {expenseTypes.map(type => <Option key={type._id}>{type.name}</Option>)}
                  </Select>
                </FormItem>
              </Col>
              <Col span="11">
                  <FormItem label="">
                    <p className="ant-form-text">
                    <NewExpenseType save={this.saveNewType.bind(this)}/>
                  </p>
                  </FormItem>
              </Col>
            </Row>


            <FormItem label="付款金额" {...formItemLayout}>
              <Input type="number" {...getFieldProps('amount')} addonAfter="元"/>
            </FormItem>

            <FormItem label="收款方" {...formItemLayout}>
              <Input {...getFieldProps('receive_company')} placeholder="收款方"/>
            </FormItem>

            <FormItem label="付款方式" {...formItemLayout}>
              <Select
                {...getFieldProps('pay_type', {initialValue: '2'})}
                size="large"
                style={{width: 230}}>
                  <Option key="2">现金支付</Option>
                  <Option key="5">银行转账</Option>
              </Select>
            </FormItem>

            <FormItem label="备注" {...formItemLayout}>
              <Input type="textarea"{...getFieldProps('remark')}/>
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

FNewExpenceModal = Form.create()(FNewExpenceModal);
export default FNewExpenceModal
