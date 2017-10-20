import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, message } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';

const FormItem = Form.Item;

class Basic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      summary: {},
    };

    [
      'getIntentionSummary',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { startTime } = this.props;
    this.getIntentionSummary(startTime);
  }

  componentWillReceiveProps(nextProps) {
    if (String(nextProps.startTime) !== String(this.props.startTime)) {
      this.getIntentionSummary(nextProps.startTime);
    }
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('输入信息有误，请核实后提交');
        return false;
      }
      api.ajax({
        url: api.aftersales.weekly.saveIntentionSummary(),
        type: 'POST',
        data: values,
      }, () => {
        message.success('开单基本情况保存成功');
      });
    });
  }

  getIntentionSummary(startTime) {
    api.ajax({ url: api.aftersales.weekly.getIntentionSummary(startTime) }, data => {
      const { summary } = data.res;
      this.setState({ summary });
    });
  }

  render() {
    const { summary } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { formItemThree } = Layout;

    return (
      <Form>
        {getFieldDecorator('start_date', { initialValue: this.props.startTime })(
          <Input className="hide" />,
        )}
        <Row className="mt20">
          <Col span={9}>
            <FormItem label="未录入工单" {...formItemThree}>
              {getFieldDecorator('unsave_intention_count', {
                initialValue: summary.unsave_intention_count,
              })(
                <Input
                  addonAfter="单"
                  style={{ minWidth: '200px' }}
                  type="number"
                  placeholder="请输入"
                />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={9}>
            <FormItem label="姓名不全" {...formItemThree}>
              {getFieldDecorator('name_invalid_count', {
                initialValue: summary.name_invalid_count,
              })(
                <Input
                  addonAfter="单"
                  style={{ minWidth: '200px' }}
                  type="number"
                  placeholder="请输入"
                />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={9}>
            <FormItem label="手机号不全" {...formItemThree}>
              {getFieldDecorator('phone_invalid_count', {
                initialValue: summary.phone_invalid_count,
              })(
                <Input
                  addonAfter="单"
                  style={{ minWidth: '200px' }}
                  type="number"
                  placeholder="请输入"
                />,
              )}
            </FormItem>
          </Col>
        </Row>

        <div className="with-bottom-border mlr-20" />

        <Row className="mt20">
          <Col span={8} offset={3}>
            <Button type="primary" onClick={this.handleSubmit}>提交</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

Basic = Form.create()(Basic);
export default Basic;
