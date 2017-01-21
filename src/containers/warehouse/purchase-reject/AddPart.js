import React from 'react';
import {message, Modal, Form, Row, Col, Button, Input} from 'antd';

import BaseModal from '../../../components/base/BaseModal';
import PartSearchBox from '../../../components/search/PartSearchBox';

import NewPartModal from '../part/NewModal';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';

const FormItem = Form.Item;

export default class AddPart extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visibleNewPart: false,
      part: {},
      price: '',
      count: '',
    };

    [
      'handleSearchSelect',
      'handleComplete',
      'handleContinueAdd',
      'handleInPriceChange',
      'handleCountChange',
      'handlePartNew',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSearchSelect(select) {
    if (select.data && String(select.data._id) !== '-1') {
      this.setState({part: select.data});
    }
  }

  handleComplete() {
    if (Object.keys(this.state.part).length === 0) {
      this.hideModal();
      return;
    }

    if (this.savePart()) {
      this.hideModal();
    }
  }

  handleContinueAdd() {
    this.savePart();
  }

  handleInPriceChange(e) {
    let price = e.target.value;
    this.setState({price: price ? price : ''});
  }

  handleCountChange(e) {
    let count = e.target.value;
    this.setState({count: count ? count : ''});
  }

  handlePartNew() {
    this.setState({visibleNewPart: true});
  }

  savePart() {
    let {part, price, count} = this.state;
    if (!price && !count) {
      message.warning('请输入进货单价和数量');
      return false;
    }

    if (Object.keys(part).length > 0) {
      part.amount = count;
      part.in_price = price;
      part.worth = Number(price * count).toFixed(2);
      this.props.onAdd(part);
      this.setState({
        part: {},
        price: '',
        count: '',
      });
    }
    return true;
  }

  render() {
    let {visible, part, price, count, visibleNewPart}=this.state;

    const {formItemThree} = Layout;

    return (
      <span>
        <Button onClick={this.showModal}>添加配件</Button>

        <Modal
          title="添加配件"
          visible={visible}
          width={960}
          onOk={this.handleContinueAdd}
          onCancel={this.handleComplete}
          okText="继续添加"
          cancelText="完成"
        >
          <Row className="mb10">
            <Col span={8}>
              <FormItem label="搜索配件" {...formItemThree}>
                <PartSearchBox
                  api={api.searchParts}
                  select={this.handleSearchSelect}
                  style={{width: 200}}
                  onAdd={this.handlePartNew}
                  showNewAction={true}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <NewPartModal visible={visibleNewPart}/>
            </Col>
          </Row>

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
              <FormItem label="产值类型" {...formItemThree}>
                <p>{part.maintain_type_name}</p>
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
              <FormItem label="采购单价" {...formItemThree} required>
                <Input defaultValue={price} addonAfter="元" onChange={this.handleInPriceChange}/>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="采购数量" {...formItemThree} required>
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
