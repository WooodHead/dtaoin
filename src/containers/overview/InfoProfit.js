import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, message } from 'antd';
import className from 'classnames';

import api from '../../middleware/api';

import Layout from '../../utils/FormLayout';

const FormItem = Form.Item;

class InfoProfit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: true,
    };

    [
      'handleIsEdit',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleIsEdit() {
    const { isEdit } = this.state;
    this.setState({
      isEdit: !isEdit,
    });
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return false;
      }

      if (Number(values.gross_profit_min_rate) > 100) {
        message.error('最低毛利率不能大于100%，请重新设置');
        return false;
      }

      values.gross_profit_min_rate = Number(values.gross_profit_min_rate) / 100;

      api.ajax({
        url: api.overview.editProfit(),
        type: 'POST',
        data: values,
      }, data => {
        message.success('编辑成功');
        this.handleIsEdit();
        this.props.onSuccess(data.res.company._id);
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { formItemThree } = Layout;
    const companyInfo = this.props.companyInfo || {};
    const { isEdit } = this.state;

    const show = className({
      '': !isEdit,
      hide: isEdit,
    });

    const inputShow = className({
      hide: !isEdit,
      '': isEdit,
    });

    return (
      <div>
        <Form className={inputShow}>
          {getFieldDecorator('company_id', { initialValue: companyInfo._id })(
            <Input type="hidden" />,
          )}
          <Row>
            <Col span={8}>
              <FormItem label="最低毛利率" {...formItemThree}>
                {getFieldDecorator('gross_profit_min_rate', {
                  initialValue: (Number(companyInfo.gross_profit_min_rate) === 0)
                    ? ''
                    : (Number(companyInfo.gross_profit_min_rate) * 100).toFixed(2),
                })(
                  <Input addonAfter="%" placeholder="请填写最低毛利率" />,
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={16}>
              <Col span={24} offset={4}>
                <div className="pull-left">
                  <Button type="primary" onClick={this.handleSubmit}>提交</Button>
                  <span className="ml10">
                  <Button type="dash" onClick={this.handleIsEdit}>取消编辑</Button>
                </span>
                </div>
              </Col>
            </Col>
          </Row>
        </Form>

        <Form className={show}>
          <Row>
            <Col span={8}>
              <FormItem label="最低毛利率" {...formItemThree}>
                <span>{`${(Number(companyInfo.gross_profit_min_rate) * 100).toFixed(2)}%`}</span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <Col span={24} offset={4}>
                <div className="pull-left">
                  <Button type="primary" onClick={this.handleIsEdit}>编辑</Button>
                </div>
              </Col>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

InfoProfit = Form.create()(InfoProfit);
export default InfoProfit;
