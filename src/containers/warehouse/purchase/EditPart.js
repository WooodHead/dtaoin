import React from 'react';
import {Modal, Form, Row, Col, Input} from 'antd';

import BaseModal from '../../../components/base/BaseModal';
import Layout from '../../../utils/FormLayout';

const FormItem = Form.Item;

export default class AddPart extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      part: props.part,
      price: props.part.in_price || 0,
      count: props.part.amount || 0,
    };

    [
      'handleInPriceChange',
      'handleCountChange',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleInPriceChange(e) {
    let price = e.target.value;
    this.setState({price: price ? price : 0});
  }

  handleCountChange(e) {
    let count = e.target.value;
    this.setState({count: count ? count : 0});
  }

  handleSubmit() {
    let {part, price, count} = this.state;

    if (Object.keys(part).length > 0) {
      part.amount = count;
      part.in_price = price;
      // 新添加的配件，添加part_id属性
      if (!part.hasOwnProperty('part_id')) {
        part.part_id = part._id;
      }

      if (!part.hasOwnProperty('part_name')) {
        part.part_name = part.name;
      }

      this.props.onAdd(part);

      this.setState({
        part: {},
        price: 0,
        count: 0,
      });
    }
    this.hideModal();
  }

  render() {
    const {formItemThree} = Layout;

    let {visible, price, count}=this.state;
    let {part} = this.props;
    console.log('part', part);

    return (
      <span>
        <a href="javascript:;" className="mr5" onClick={this.showModal}>编辑</a>

        <Modal
          title="编辑配件进货信息"
          visible={visible}
          width={960}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
        >
        <Row className="mb10">
          <Col span={8}>
            <FormItem label="配件名" {...formItemThree}>
              <p>{part.name}</p>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="配件号" {...formItemThree}>
              <p>{part.part_no}</p>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="适用车型" {...formItemThree}>
              <p>{part.scope}</p>
            </FormItem>
          </Col>
        </Row>

        <Row className="mb10">
          <Col span={8}>
            <FormItem label="品牌" {...formItemThree}>
              <p>{part.brand}</p>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="配件分类" {...formItemThree}>
              <p>{part.part_type_name}</p>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="规格" {...formItemThree}>
              <p>{!!part.spec ? part.spec + part.unit : ''}</p>
            </FormItem>
          </Col>
        </Row>

        <Row className="mb10">
          <Col span={8}>
            <FormItem label="历史最低进价" {...formItemThree}>
              <p>{part.min_in_price}</p>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="库存数量" {...formItemThree}>
              <p>{part.amount}</p>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="冻结数量" {...formItemThree}>
              <p>{part.freeze}</p>
            </FormItem>
          </Col>
        </Row>

        <Row className="mb10">
          <Col span={8}>
            <FormItem label="采购单价" {...formItemThree}>
              <Input
                defaultValue={price}
                addonAfter="元"
                onChange={this.handleInPriceChange}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="采购数量" {...formItemThree}>
              <Input defaultValue={count} onChange={this.handleCountChange}/>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="金额" {...formItemThree}>
              <p>{price * count} 元</p>
            </FormItem>
          </Col>
        </Row>
      </Modal>
      </span>
    );
  }
}
