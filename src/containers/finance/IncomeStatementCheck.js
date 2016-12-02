import React from "react";
import api from "../../middleware/api";
import text from "../../middleware/text";
import {Icon, Button, Form, Input, Row, Col, message} from "antd";
import BaseComponent from "../../components/base/BaseList";
import Layout from "../../components/forms/Layout";

const FormItem = Form.Item;

export default class IncomeStatementCheck extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: props.location.query.type,
      id: props.location.query.id,
      statement: ''
    };
  }

  componentDidMount() {
    api.ajax({url: api.scanQRCodeToVerify(this.state.id, this.state.type)}, function (data) {
      if (data.code === 0) {
        message.info('对账单已确认');
        this.getLatestStatementInfo();
      }
    }.bind(this));
  }

  getLatestStatementInfo() {
    api.ajax({url: api.getIncomeStatementDetail(this.state.id)}, function (data) {
      if (data.code === 0) {
        const statement = data.res.check_sheet;
        this.setState({statement});
      }
    }.bind(this));
  }

  render() {
    const {visible, statement}=this.state;
    const {formItemLayout_1014} = Layout;

    return (
      <div className="margin-top-40">
        <div className="center">
          <h4>您好，{text.e2cPosition[this.state.type]}:</h4>
          <p>账单id:{this.state.id}</p>
          <p>请知悉，您已确认此对账单！</p>
        </div>

        <Form horizontal form={this.props.form} className="hide">

          <Row>
            <Col span="10" offset="2">
              <FormItem label='本次结算单id：' {...formItemLayout_1014}>
                <span>{statement._id}</span>
              </FormItem>
            </Col>
            <Col span="10" offset="2">
              <FormItem label='本次结算单数(个)：' {...formItemLayout_1014}>
                <span>{statement.bill_acount}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span="10" offset="2">
              <FormItem label='现金应收款(元)：' {...formItemLayout_1014}>
                <span>{statement.cash_due}</span>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label='现金实收款(元)：' {...formItemLayout_1014}>
                <span>{statement.cash_received}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span="10" offset="2">
              <FormItem label='POS机应收款(元)：' {...formItemLayout_1014}>
                {statement.pos_due}
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label='POS机实收款(元)：' {...formItemLayout_1014}>
                <span>{statement.pos_received}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span="10" offset="2">
              <FormItem label='线上收款(元)：' {...formItemLayout_1014}>
                {statement.online_due}
              </FormItem>
            </Col>
          </Row>

          <Row >
            <Col span="10" offset="2">
              <FormItem label='应收款小计(元)：' {...formItemLayout_1014}>
                <span>{statement.total_due}</span>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label='实收款小计(元)：' {...formItemLayout_1014}>
                {statement.total_received}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
