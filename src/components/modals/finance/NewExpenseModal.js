import React from 'react';
import {Row, Col, Modal, Icon, Button, Form, Input, DatePicker, Select} from 'antd';
import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import BaseModal from '../../base/BaseModal';
import NewExpenseType from '../../popover/NewExpenseType';
import formatter from '../../../utils/DateFormatter';
import FormValidator from '../../../utils/FormValidator';

const FormItem = Form.Item;
const Option = Select.Option;
class FNewExpenceModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.expenseShow == '1',
      expenseTypes: [],
      formData: {},
      user: [],
    };
  }

  componentDidMount() {
    this.getExpensiveTypes();
  }

  showModal() {
    this.setState({visible: true});
    api.ajax({url: api.user.getUsersByDeptAndRole()}, function (data) {
      let user = data.res.user_list;
      this.setState({
        user,
      });
    }.bind(this));
  }

  handleSubmit() {
    let formData = this.props.form.getFieldsValue();
    formData.ptime = formatter.day(formData.ptime);
    formData.type = '1';

    api.ajax({
      url: api.newDailyExpense(),
      type: 'POST',
      data: formData,
    }, function () {
      this.hideModal();
      location.reload();
    }.bind(this));
  }

  saveNewType(newItem) {
    api.ajax({
      url: api.newExpenseType(),
      type: 'POST',
      data: {name: newItem, type: 1},
    }, function (data) {
      this.getExpensiveTypes(data.res.sub_type._id);
    }.bind(this));
  }

  getExpensiveTypes(newTypeId) {
    api.ajax({url: api.getProjectTypeList(1)}, function (data) {
      this.setState({expenseTypes: data.res.list});
      if (newTypeId) {
        this.props.form.setFieldsValue({expenditure_type: newTypeId});
      }
    }.bind(this));
  }

  render() {
    const {selectStyle, formItemThree, formItemTwo} = Layout;
    const {getFieldDecorator} = this.props.form;
    const {visible, expenseTypes} = this.state;

    return (
      <span>
        <Button
          type="primary"
          className="margin-left-20"
          onClick={this.showModal}
        >
          新增支出
        </Button>
        <Modal
          title={<span><Icon type="plus" className="margin-right-10"/>新增支出</span>}
          visible={visible}
          width="680px"
          onOk={this.handleSubmit.bind(this)}
          onCancel={this.hideModal}
        >
          <Form horizontal>
            <Row>
              <Col span={10}>
                <FormItem label="付款日期" {...formItemThree}>
                  {getFieldDecorator('ptime', {
                    initialValue: formatter.getMomentDate(),
                    rules: FormValidator.getRuleNotNull(),
                    validateTrigger: 'onBlur',
                  })(
                    <DatePicker/>
                  )}
                </FormItem>
              </Col>
                <Col span={9}>
                  <FormItem label="支出项目"  {...formItemThree}>
                    {getFieldDecorator('sub_type', {
                      rules: FormValidator.getRuleNotNull(),
                      validateTrigger: 'onBlur',
                    })(
                      <Select{...selectStyle}>
                        {expenseTypes.map(type => <Option key={type._id}>{type.name}</Option>)}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={3} offset={1}>
                    <FormItem label="">
                      <p className="ant-form-text">
                      <NewExpenseType save={this.saveNewType.bind(this)}/>
                    </p>
                    </FormItem>
                </Col>
              </Row>

            <Row>
              <Col span={10}>
                <FormItem label="付款金额" {...formItemTwo}>
                  {getFieldDecorator('amount', {
                    rules: FormValidator.getRuleNotNull(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input type="number" addonBefore="￥" style={{width: 136}}/>
                  )}
                </FormItem>
              </Col>

              <Col span={9}>
                <FormItem label="付款方式" {...formItemTwo}>
                  {getFieldDecorator('pay_type', {
                    initialValue: '2',
                    rules: FormValidator.getRuleNotNull(),
                    validateTrigger: 'onBlur',
                  })(
                    <Select style={{width: 162}}>
                      <Option key="1">银行转账</Option>
                      <Option key="2">现金支付</Option>
                      <Option key="3">微信支付</Option>
                      <Option key="4">支付宝支付</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={10}>
                <FormItem label="收款方" {...formItemTwo}>
                {getFieldDecorator('payer')(
                  <Input placeholder="收款方" style={{width: 165}}/>
                )}
                </FormItem>
              </Col>

              <Col span={9}>
                <FormItem label="经办人" {...formItemTwo}>
                  {getFieldDecorator('payee')(
                    <Select style={{width: 162}}>
                      {this.state.user.map(item => <Option key={item._id}>{item.name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
              <FormItem label="描述" labelCol={{span: 3}} wrapperCol={{span: 16}}>
                {getFieldDecorator('remark')(
                  <Input type="textarea"/>
                )}
              </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </span>
    );
  }
}

FNewExpenceModal = Form.create()(FNewExpenceModal);
export default FNewExpenceModal;
