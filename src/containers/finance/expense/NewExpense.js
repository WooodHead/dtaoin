import React from 'react';
import { Row, Col, Modal, Icon, Button, Form, Input, DatePicker, Select } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import formatter from '../../../utils/DateFormatter';

import BaseModal from '../../../components/base/BaseModal';

import NewExpenseType from './NewExpenseType';
import FormValidator from '../../../utils/FormValidator';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

class NewExpenceModal extends BaseModal {
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
    this.getUsersByDeptAndRole();
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      values.ptime = formatter.day(values.ptime);
      values.type = '1';
      api.ajax({
        url: api.finance.newDailyExpense(),
        type: 'POST',
        data: values,
      }, () => {
        this.hideModal();
        // location.reload();
        window.location.href = '/finance/expense/list';
      });
    });
  }

  saveNewType(newItem) {
    api.ajax({
      url: api.finance.newExpenseType(),
      type: 'POST',
      data: { name: newItem, type: 1 },
    }, data => {
      this.getExpensiveTypes(data.res.sub_type._id);
    });
  }

  getExpensiveTypes(newTypeId) {
    api.ajax({ url: api.finance.getProjectTypeList(1) }, data => {
      this.setState({ expenseTypes: data.res.list });
      if (newTypeId) {
        this.props.form.setFieldsValue({ sub_type: newTypeId });
      }
    });
  }

  getUsersByDeptAndRole() {
    api.ajax({ url: api.user.getUsersByDeptAndRole() }, data => {
      const user = data.res.user_list;
      this.setState({
        user,
      });
    });
  }

  render() {
    const { selectStyle, formItemThree, formItemTwo } = Layout;
    const { getFieldDecorator } = this.props.form;
    const { visible, expenseTypes } = this.state;

    return (
      <span>
        <Button
          type="primary"
          className="ml20"
          onClick={this.showModal}
        >
          新增支出
        </Button>
        <Modal
          title={<span><Icon type="plus" className="mr10" />新增支出</span>}
          visible={visible}
          width="720px"
          onOk={this.handleSubmit.bind(this)}
          onCancel={this.hideModal}
        >
          <Form>
            <Row>
              <Col span={10}>
                <FormItem label="付款日期" {...formItemThree}>
                  {getFieldDecorator('ptime', {
                    initialValue: formatter.getMomentDate(),
                  })(
                    <DatePicker allowClear={false} />,
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
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={4} offset={1}>
                    <FormItem label="">
                      <p className="ant-form-text">
                      <NewExpenseType save={this.saveNewType.bind(this)} />
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
                    <Input type="number" addonBefore="￥" style={{ width: 165 }} />,
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
                    <Select style={{ width: 172 }}>
                      <Option key="1">银行转账</Option>
                      <Option key="2">现金支付</Option>
                      <Option key="3">微信支付</Option>
                      <Option key="4">支付宝支付</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={10}>
                <FormItem label="收款方" {...formItemTwo}>
                {getFieldDecorator('payer', {
                  rules: FormValidator.getRuleNotNull(),
                  validateTrigger: 'onBlur',
                })(
                  <Input placeholder="收款方" style={{ width: 165 }} />,
                )}
                </FormItem>
              </Col>

              <Col span={9}>
                <FormItem label="经办人" {...formItemTwo}>
                  {getFieldDecorator('user_id', { initialValue: api.getLoginUser().uid })(
                    <Select style={{ width: 172 }}>
                      {this.state.user.map(item => <Option key={item._id}>{item.name}</Option>)}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={20}>
              <FormItem label="描述" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('remark')(
                  <TextArea style={{ width: '448px' }} />,
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

NewExpenceModal = Form.create()(NewExpenceModal);
export default NewExpenceModal;
