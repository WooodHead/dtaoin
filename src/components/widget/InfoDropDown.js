import React, { Component } from 'react';
import { Row, Col, Form } from 'antd';

const FormItem = Form.Item;
import Layout from '../../utils/FormLayout';

export default class Help extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    [].map(method => this[method] = this[method].bind(this));
  }

  render() {
    const { partInfo } = this.props;

    let part = {};
    if (partInfo) {
      part = partInfo.info;
    }

    let style = { display: 'none' };
    if (!!partInfo) {
      style = {
        position: 'absolute',
        width: '850px',
        border: '1px solid rgba(16, 142, 233, 1)',
        paddingTop: '10px',
        left: `${partInfo.coordinate.left}px` || '',
        top: `${partInfo.coordinate.top + 10}px` || '',
        display: partInfo.visible ? '' : 'none',
        backgroundColor: 'white',
        zIndex: 100,
        borderRadius: '6px',
      };
    }
    const { formItemLayout_1014 } = Layout;
    return (
      <div style={style}>
        <Row>
          <Col span={6} offset={1}>
            <FormItem label="配件名" {...formItemLayout_1014}>
              {part.part_name || part.name}
            </FormItem>
          </Col>

          <Col span={6}>
            <FormItem label="配件号" {...formItemLayout_1014}>
              {part.part_no}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="规格" {...formItemLayout_1014}>
              {part.spec || part.part_spec}{part.unit || part.part_unit}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={6} offset={1}>
            <FormItem label="品牌" {...formItemLayout_1014}>
              {part.brand}
            </FormItem>
          </Col>

          <Col span={6}>
            <FormItem label="适用车型" {...formItemLayout_1014}>
              {part.scope}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="配件分类" {...formItemLayout_1014}>
              {part.part_type_name}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={6} offset={1}>
            <FormItem label="库存数" {...formItemLayout_1014}>
              {part.remain_amount || part.part_amount || part.amount}
            </FormItem>
          </Col>

          <Col span={6}>
            <FormItem label="冻结数" {...formItemLayout_1014}>
              {part.freeze || part.part_freeze}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="安全库存" {...formItemLayout_1014}>
              {part.min_amount}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem label="加价率" {...formItemLayout_1014}>
              {!!part.markup_rate ? `${Number(part.markup_rate) * 100}%` : '0%'}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={6} offset={1}>
            <FormItem label="当前进价" {...formItemLayout_1014}>
              {Number(part.in_price).toFixed(2)}
            </FormItem>
          </Col>

          <Col span={6}>
            <FormItem label="最低进价" {...formItemLayout_1014}>
              {Number(part.min_in_price).toFixed(2)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="当前售价" {...formItemLayout_1014}>
              {Number(part.sell_price || part.material_fee_base).toFixed(2)}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem label="最低售价" {...formItemLayout_1014}>
              {(!!part.in_price) ? (part.in_price *
              (1 + (Number(part.markup_rate) || 0))).toFixed(2) : ''}
            </FormItem>
          </Col>
        </Row>
      </div>
    );
  }
}
