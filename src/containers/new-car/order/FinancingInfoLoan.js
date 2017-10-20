import React from 'react';
import { Row, Col, Form, Input, Table, Button, message, Tooltip, Icon } from 'antd';

import Layout from '../../../utils/FormLayout';
import FormValidator from '../../../utils/FormValidator';

const FormItem = Form.Item;

class FinancingInfoLoan extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleAmountChange(name, e) {
    let additionalFinance = [];
    try {
      additionalFinance = JSON.parse(this.props.form.getFieldValue('additional_finance'));
    } catch (e) {
    }

    for (const i in additionalFinance) {
      if (additionalFinance.hasOwnProperty(i)) {
        if (additionalFinance[i].name === name) {
          additionalFinance[i].amount = e.target.value;
          break;
        }
      }
    }

    this.props.form.setFieldsValue({ additional_finance: JSON.stringify(additionalFinance) });
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('表单内容错误,请检查');
        return;
      }
      values.rent_down_rate = (Number(values.rent_down_rate) / 100).toFixed(4);
      values.salvage_rate = (Number(values.salvage_rate) / 100).toFixed(4);

      this.props.submitFinancingInfo(values);
    });
  }

  getAddFinancingTotal(data) {
    let total = 0;
    if (!data || data.length <= 0) {
      return total;
    }

    data.map(item => {
      total += Number(item.amount);
    });

    return total;
  }

  render() {
    const { formItemLayout } = Layout;
    const { getFieldDecorator } = this.props.form;
    const { detail } = this.props;

    let data = [];
    try {
      data = JSON.parse(this.props.form.getFieldValue('additional_finance'));
    } catch (e) {
      data = JSON.parse(detail.additional_finance);
    }

    const addFinancingTotal = this.getAddFinancingTotal(data);

    const self = this;
    const columns = [
      {
        title: '加融项',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '金额(元)',
        dataIndex: 'amount',
        key: 'amount',
        render: (value, record) => (
            <Input
              type="number"
              placeholder="请输入"
              value={Number(value) > 0 ? value : ''}
              onChange={e => self.handleAmountChange(record.name, e)}
            />
          ),
      }];

    return (
      <div className="order-financing-loan">
        <Row>
          {getFieldDecorator('order_id', { initialValue: detail._id })(
            <Input className="hide" />,
          )}
          {getFieldDecorator('additional_finance', { initialValue: detail.additional_finance })(
            <Input className="hide" />,
          )}

          <Col span={12}>
            <FormItem label="首付比例" {...formItemLayout}>
              {getFieldDecorator('rent_down_rate', {
                initialValue: Number(detail.rent_down_rate) > 0
                  ? (Number(detail.rent_down_rate) * 100).toFixed(2)
                  : '',
              })(
                <Input type="number" addonAfter="%" />,
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="首付金额" {...formItemLayout}>
              {getFieldDecorator('rent_down_payment', {
                initialValue: Number(detail.rent_down_payment) > 0
                  ? Number(detail.rent_down_payment).toFixed(2)
                  : '',
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input type="number" addonAfter="元" size="large" />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="残值比例" {...formItemLayout}>
              {getFieldDecorator('salvage_rate', {
                initialValue: Number(detail.salvage_rate) > 0
                  ? (Number(detail.salvage_rate) * 100).toFixed(2)
                  : '',
              })(
                <Input type="number" addonAfter="%" />,
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="残值金额" {...formItemLayout}>
              {getFieldDecorator('salvage_value', {
                initialValue: Number(detail.salvage_value) > 0
                  ? Number(detail.salvage_value).toFixed(2)
                  : '',
              })(
                <Input type="number" addonAfter="元" />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="服务费" {...formItemLayout}>
              {getFieldDecorator('service_fee', {
                initialValue: Number(detail.service_fee) > 0
                  ? Number(detail.service_fee).toFixed(2)
                  : '',
              })(
                <Input type="number" addonAfter="元" />,
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="提车费" {...formItemLayout}>
              {getFieldDecorator('pickup_fee', {
                initialValue: Number(detail.pickup_fee) > 0
                  ? Number(detail.pickup_fee).toFixed(2)
                  : '',
              })(
                <Input type="number" addonAfter="元" />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="保证金" {...formItemLayout}>
              {getFieldDecorator('cash_deposit', {
                initialValue: Number(detail.cash_deposit) > 0
                  ? Number(detail.cash_deposit).toFixed(2)
                  : '',
              })(
                <Input type="number" addonAfter="元" />,
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="首次支出" {...formItemLayout}>
              {getFieldDecorator('first_pay_amount', {
                initialValue: Number(detail.first_pay_amount) > 0
                  ? Number(detail.first_pay_amount).toFixed(2)
                  : '',
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input type="number" addonAfter="元" />,
              )}
              <div style={{ position: 'absolute', right: '-23px', top: '0' }}>
                <Tooltip placement="topLeft" title="易鑫的自采车方案首次支出包含首月月租">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </div>

            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="贷款额" {...formItemLayout}>
              {getFieldDecorator('finance_amount', {
                initialValue: Number(detail.finance_amount) > 0
                  ? Number(detail.finance_amount).toFixed(2)
                  : '',
              })(
                <Input type="number" addonAfter="元" />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="融资期限" {...formItemLayout}>
              <p>{`${detail.finance_length_type  }期`}</p>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="月供金额" {...formItemLayout}>
              {getFieldDecorator('monthly_finance', {
                initialValue: Number(detail.monthly_finance) > 0
                  ? Number(detail.monthly_finance).toFixed(2)
                  : '',
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input type="number" addonAfter="元" />,
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="月供利息" {...formItemLayout}>
              {getFieldDecorator('monthly_interest', {
                initialValue: Number(detail.monthly_interest) > 0
                  ? Number(detail.monthly_interest).toFixed(2)
                  : '',
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input type="number" addonAfter="元" />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="加融项" {...formItemLayout}>
              <Table
                bordered={true}
                columns={columns}
                dataSource={data}
                pagination={false}
                rowKey={record => record.name}
                size="middle"
                footer={() => (
                    <div>
                      <span>合计</span>
                      <span className="pull-right">{`${addFinancingTotal} 元`}</span>
                    </div>
                  )}
              />
            </FormItem>
          </Col>
        </Row>

        <div className="line" />
        <Row>
          <Col span={8}>
            <Button
              type="primary"
              onClick={this.handleSubmit}
              style={{ marginLeft: '37%' }}
              disabled={Number(detail.status) === 7}
            >
              保存
            </Button>
          </Col>
        </Row>
      </div>

    );
  }
}

FinancingInfoLoan = Form.create()(FinancingInfoLoan);
export default FinancingInfoLoan;
