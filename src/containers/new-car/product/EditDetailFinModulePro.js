import React from 'react';
import {
  message, Modal, Icon, Row, Col, Select, Button, Form, Input, InputNumber, Switch, Radio,
  Slider, Alert,
} from 'antd';
import api from '../../../middleware/api';
import validator from '../../../utils/validator';
import BaseModal from '../../../components/base/BaseModal';
import FormValidator from '../../../utils/FormValidator';
import Layout from '../../../utils/FormLayout';
import HQInformationAdd from './HQAddResource';

const FormItem = Form.Item;

class FinModulePro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      can_buy_salvage_value: '',
    };
  }
  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  finance_length_types_change = value => {
  };
  can_buy_salvage_value_change = value => {
    if (value) {
      this.setState({
        can_buy_salvage_value: '1',
      });
    }
    if (!value) {
      this.setState({
        can_buy_salvage_value: '0',
      });
    }
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = {
          product_id: this.props.product_id,
          rent_length_type: values.rent_length_type,
          finance_length_types: values.finance_length_types.join(','),
          can_buy_salvage_value: this.state.can_buy_salvage_value,
        };
        this.props.post_markertDitAmountFixFinance(data);
      }
    });
  };

  render() {
    const getProductDetailRes = this.props.getProductDetailRes;
    const { visible } = this.state;
    const { formItemLayout } = Layout;
    const { getFieldDecorator } = this.props.form;
    console.log(getProductDetailRes);
    return (
      <div>
        <Alert
          message="固定首尾付类型中，首付，尾付，保证金及服务费金额固定，在车型方案中设置。"
          type="info"
          showIcon
          closable
          style={{ marginBottom: 20 }}
        />
        <Row>
          <Col span={20}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="租期"

              >
                {getFieldDecorator('rent_length_type', {
                  rules: FormValidator.getRuleNotNull(),
                  validateTrigger: 'onBlur',
                  initialValue: getProductDetailRes.rent_length_type,
                })(
                  <Select placeholder="请选择" disabled={this.props.hqOrOperate}>
                    <Select.Option value="12">12期</Select.Option>
                    <Select.Option value="24">24期</Select.Option>
                    <Select.Option value="36">36期</Select.Option>
                  </Select>,
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="融资期限"

              >
                {getFieldDecorator('finance_length_types', {
                  rules: FormValidator.getRuleNotNull(),
                  validateTrigger: 'onBlur',
                  initialValue: (getProductDetailRes.finance_length_types &&
                    getProductDetailRes.finance_length_types.split(',')) || [],

                })(
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="请选择"
                    onChange={this.finance_length_types_change}
                    disabled={this.props.hqOrOperate}
                  >
                    <Select.Option value="12">12期</Select.Option>
                    <Select.Option value="24">24期</Select.Option>
                    <Select.Option value="36">36期</Select.Option>
                    <Select.Option value="48">48期</Select.Option>
                  </Select>,
                )}
              </FormItem>
              <FormItem
                label="是否可以残值买断"
                {...formItemLayout}
              >
                {getFieldDecorator('can_buy_salvage_value', {})(
                  <Switch disabled={this.props.hqOrOperate}
                          defaultChecked={getProductDetailRes.can_buy_salvage_value != '0'} checkedChildren="是" unCheckedChildren="否"
                          onChange={this.can_buy_salvage_value_change} />)}
              </FormItem>
              <Row type="flex" justify="center" style={{ marginTop: 40 }}>
                <Col span={2}>
                  <FormItem {...formItemLayout}>
                  </FormItem>
                </Col>
                <Col span={4}>
                  <FormItem {...formItemLayout}>
                    <Button type="primary" htmlType="submit" disabled={this.props.hqOrOperate}>保存</Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

FinModulePro = Form.create()(FinModulePro);
export default FinModulePro;
