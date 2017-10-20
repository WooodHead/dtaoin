import React from 'react';
import { Row, Col, Form, Select, Input, Button, message } from 'antd';

import Layout from '../../../utils/FormLayout';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';

const FormItem = Form.Item;
const Option = Select.Option;

class CarInfo extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }
      this.props.submitCarInfo(values);
    });
  }

  render() {
    const { detail, outColor } = this.props;

    const { formItemLayout } = Layout;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="order-car-info">
        <Row>
          {getFieldDecorator('order_id', { initialValue: detail._id })(
            <Input className="hide" />,
          )}
          <Col span={8}>
            <FormItem label="车型信息" {...formItemLayout}>
              <p>{detail.auto_type_name}</p>
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="排量" {...formItemLayout}>
              <p>{detail.displacement ? (`${detail.displacement  }L`) : '--'}</p>
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="外观/内饰" {...formItemLayout}>
              {getFieldDecorator('out_color', {
                initialValue: Number(detail.out_color) === 0 ? '' : detail.out_color,
              })(
                <Select onSelect={this.handleSeriesSelect} style={{ width: '50px' }}>
                  {outColor.map(color => <Option key={color._id}>{color.name}</Option>)}
                </Select>,
              )} / {getFieldDecorator('in_color', {
                initialValue: String(detail.in_color) === '-1' ? '' : detail.in_color,
              })(
              <Select size="large" style={{ width: '50px' }}>
                <Option key="0">米</Option>
                <Option key="1">棕</Option>
                <Option key="2">黑</Option>
                <Option key="3">灰</Option>
                <Option key="4">红</Option>
                <Option key="5">蓝</Option>
                <Option key="6">白</Option>
              </Select>,
            )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={8}>
            <FormItem label="指导价" {...formItemLayout}>
              <p className="ant-form-text">
                {!!detail.guide_price ? `${detail.guide_price  }元` : '--'}
              </p>
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="开票价" {...formItemLayout}>
              {getFieldDecorator('sell_price', {
                initialValue: Number(detail.sell_price) > 0
                  ? Number(detail.sell_price).toFixed(2)
                  : '',
              })(
                <Input type="number" addonAfter="元" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="牌照所属" {...formItemLayout}>
              {getFieldDecorator('plate_type', { initialValue: detail.plate_type })(
                <Select
                  onSelect={this.handleSeriesSelect}
                  style={{ width: '200px' }}
                  placeholder="请选择"
                >
                  <Option key="1">公司户</Option>
                  <Option key="2">个人户</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={8}>
            <FormItem label="车牌号" {...formItemLayout}>
              {getFieldDecorator('plate_num', {
                initialValue: detail.plate_num,
                rules: FormValidator.getRulePlateNumber(),
              })(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="车架号" {...formItemLayout}>
              {getFieldDecorator('vin_num', { initialValue: detail.vin_num })(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="发动机号" {...formItemLayout}>
              {getFieldDecorator('engine_num', { initialValue: detail.engine_num })(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <FormItem label="可选套餐" labelCol={{ span: 2 }} wrapperCol={{ span: 13 }}>
              {getFieldDecorator('remark', { initialValue: detail.remark })(
                <Input disabled type="textarea" placeholder="可描述套餐的优惠项，金额等内容" />,
              )}
            </FormItem>
          </Col>
        </Row>

        <div className="line" />
        <Row>
          <Col span={8}>
            <Button
              type="primary"
              onClick={this.handleSubmit}
              style={{ marginLeft: '25%' }}
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

CarInfo = Form.create()(CarInfo);
export default CarInfo;

