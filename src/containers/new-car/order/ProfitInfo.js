import React from 'react';
import { Row, Col, Form, Input, Button } from 'antd';

import Layout from '../../../utils/FormLayout';

const FormItem = Form.Item;

require('./basic-info.less');

class ProfitInfo extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.props.submitProfitInfo(this.props.form.getFieldsValue());
  }

  getTotal() {
    const formDate = this.props.form.getFieldsValue().auto_sell_price
      ? this.props.form.getFieldsValue()
      : this.props.profitDetail;

    const autoSellPrice = Number(formDate.auto_sell_price) || 0; // 裸车售价
    const autoBuyPrice = Number(formDate.auto_buy_price) || 0; // 裸车进价
    const insuranceIn = Number(formDate.insurance_in) || 0; // 保险返点
    const serviceFee = Number(formDate.service_fee) || 0; // 服务费
    const decorationIn = Number(formDate.decoration_in) || 0;// 加装收入
    const freight = Number(formDate.freight) || 0;// 运费
    const otherIn = Number(formDate.other_in) || 0;// 其他收入
    const otherOut = Number(formDate.other_out) || 0;// 其他支出
    const additionalFinance_in = Number(formDate.additional_finance_in) || 0;// 加融收入
    const resourceCommission = Number(formDate.resource_commission) || 0;// 资源方返佣
    const dealerCommission = Number(formDate.dealer_commission) || 0;// 经销商返佣

    const income = autoSellPrice + insuranceIn + additionalFinance_in + serviceFee +
      resourceCommission + decorationIn + otherIn;
    const expend = autoBuyPrice + freight + otherOut + dealerCommission;

    return (income - expend);
  }

  render() {
    const { detail, profitDetail } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { formItemLayout } = Layout;

    const totalProfit = this.getTotal();

    return (
      <div className="new-car-order-profit">
        <Row>
          {getFieldDecorator('order_id', { initialValue: detail._id })(
            <Input className="hide" />,
          )}
          <Col span={8}>
            <FormItem label="裸车售价" {...formItemLayout}>
              {getFieldDecorator('auto_sell_price', {
                initialValue: Number(profitDetail.auto_sell_price) > 0
                  ? Number(profitDetail.auto_sell_price).toFixed(2)
                  : '',
              })(
                <Input type="number" addonAfter="元" size="large" />,
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="保险返点" {...formItemLayout}>
              {getFieldDecorator('insurance_in', {
                initialValue: Number(profitDetail.insurance_in) > 0
                  ? Number(profitDetail.insurance_in).toFixed(2)
                  : '',
              })(
                <Input type="number" addonAfter="元" size="large" />,
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="加融收入" {...formItemLayout}>
              {getFieldDecorator('additional_finance_in', {
                initialValue: Number(profitDetail.additional_finance_in) > 0
                  ? Number(profitDetail.additional_finance_in).toFixed(2)
                  : '',
              })(
                <Input type="number" addonAfter="元" size="large" />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={8}>
            <FormItem label="服务费" {...formItemLayout}>
              {getFieldDecorator('service_fee', {
                initialValue: Number(profitDetail.service_fee) > 0
                  ? Number(profitDetail.service_fee).toFixed(2)
                  : '',
              })(
                <Input type="number" addonAfter="元" size="large" />,
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="资源方返佣" {...formItemLayout}>
              {getFieldDecorator('resource_commission', {
                initialValue: Number(profitDetail.resource_commission) > 0
                  ? Number(profitDetail.resource_commission).toFixed(2)
                  : '',
              })(
                <Input type="number" addonAfter="元" size="large" />,
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="加装收入" {...formItemLayout}>
              {getFieldDecorator('decoration_in', {
                initialValue: Number(profitDetail.decoration_in) > 0
                  ? Number(profitDetail.decoration_in).toFixed(2)
                  : '',
              })(
                <Input type="number" addonAfter="元" size="large" />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={8}>
            <FormItem label="其它收入" {...formItemLayout}>
              {getFieldDecorator('other_in', {
                initialValue: Number(profitDetail.other_in) > 0
                  ? Number(profitDetail.other_in).toFixed(2)
                  : '',
              })(
                <Input type="number" addonAfter="元" size="large" />,
              )}
            </FormItem>
          </Col>
        </Row>


        <Row className="mt30">
          <Col span={8}>
            <FormItem label="裸车进价" {...formItemLayout}>
              {getFieldDecorator('auto_buy_price', {
                initialValue: Number(profitDetail.auto_buy_price) > 0
                  ? Number(profitDetail.auto_buy_price).toFixed(2)
                  : '',
              })(
                <Input type="number" addonAfter="元" size="large" />,
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="运费支出" {...formItemLayout}>
              {getFieldDecorator('freight', {
                initialValue: Number(profitDetail.freight) > 0
                  ? Number(profitDetail.freight).toFixed(2)
                  : '',
              })(
                <Input type="number" addonAfter="元" size="large" />,
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="其它支出" {...formItemLayout}>
              {getFieldDecorator('other_out', {
                initialValue: Number(profitDetail.other_out) > 0
                  ? Number(profitDetail.other_out).toFixed(2)
                  : '',
              })(
                <Input type="number" addonAfter="元" size="large" />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={8}>
            <FormItem label="经销商返佣" {...formItemLayout}>
              {getFieldDecorator('dealer_commission', {
                initialValue: Number(profitDetail.dealer_commission) > 0
                  ? Number(profitDetail.dealer_commission).toFixed(2)
                  : '',
              })(
                <Input type="number" addonAfter="元" size="large" />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row className="mt20">
          <Col span={8}>
            <FormItem label="总收益" {...formItemLayout}>
              <p className="total-profit">{`${totalProfit  } 元`}</p>
            </FormItem>
          </Col>
        </Row>

        <div className="line" />
        <Button
          style={{ marginLeft: '8%' }}
          type="primary"
          onClick={this.handleSubmit}
          disabled={Number(detail.status) === 7}
        >
          保存
        </Button>
      </div>

    );
  }
}

ProfitInfo = Form.create()(ProfitInfo);
export default ProfitInfo;
