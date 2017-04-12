import React from 'react';
import {message, Modal, Form, Row, Col, Button, Input} from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';

import BaseModal from '../../../components/base/BaseModal';
import PartSearchBox from '../../../components/search/PartSearchBox';

import NewPartModal from '../part/NewModal';

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
      key: '',
    };

    [
      'handleSearchSelect',
      'handleComplete',
      'handleContinueAdd',
      'handleInPriceChange',
      'handleCountChange',
      'handlePartNew',
      'handleSuccessAddPart',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSearchSelect(select) {
    console.log('select', select);
    if (select.data && String(select.data._id) !== '-1') {
      this.setState({part: select.data, visibleNewPart: false});
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
    this.setState({price: price ? price : '', visibleNewPart: false});
  }

  handleCountChange(e) {
    let count = e.target.value;
    this.setState({count: count ? count : '', visibleNewPart: false});
  }

  handlePartNew(key) {
    this.setState({visibleNewPart: true, key});
  }

  handleSuccessAddPart(data) {
    this.setState({part: data});
  }

  showModal() {
    this.setState({visible: true, visibleNewPart: false});
  }

  savePart() {
    let {part, price, count} = this.state;
    if (!price && !count) {
      message.warning('请输入进货单价和数量');
      return false;
    }

    if (Object.keys(part).length > 0) {
      part.remain_amount = part.amount;
      part.amount = count;
      part.in_price = price;

      if (!part.hasOwnProperty('part_id')) {
        part.part_id = part._id;
      }

      if (!part.hasOwnProperty('part_name')) {
        part.part_name = part.name;
      }

      this.setState({
        part: {},
        price: '',
        count: '',
        visibleNewPart: false,
      });
      this.props.onAdd(part);
    }
    return true;
  }

  render() {
    const {formItemThree} = Layout;
    let {
      visible,
      part,
      price,
      count,
      visibleNewPart,
      key,
    } = this.state;

    return (
      <span>
        <Button onClick={this.showModal}>添加配件</Button>

        <Modal
          title="添加配件"
          visible={visible}
          width={960}
          onCancel={this.hideModal}
          footer={
            <span>
              <Button className="mr5" size="large" onClick={this.handleComplete}>完成</Button>
              <Button type="primary" size="large" onClick={this.handleContinueAdd}>继续添加</Button>
            </span>
          }
        >
          <Row className="mb10">
            <Col span={8}>
              <FormItem label="搜索配件" {...formItemThree}>
                <PartSearchBox
                  api={api.warehouse.part.searchByTypeId}
                  select={this.handleSearchSelect}
                  style={{width: 210}}
                  onAdd={this.handlePartNew}
                  showNewAction={true}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <NewPartModal
                visible={visibleNewPart}
                inputValue={key}
                onSuccessAddParts={this.handleSuccessAddPart}
              />
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
              <FormItem label="规格" {...formItemThree}>
                <p>{!!part.spec ? part.spec + part.unit : ''}</p>
              </FormItem>
            </Col>
          </Row>

          <Row className="mb10">
            <Col span={8}>
              <FormItem label="历史最低进价" {...formItemThree}>
                <p>{part.min_in_price || 0}</p>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="库存数量" {...formItemThree}>
                <p>{part.amount || 0}</p>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="冻结数量" {...formItemThree}>
                <p>{part.freeze || 0}</p>
              </FormItem>
            </Col>
          </Row>

          <Row className="mb10">
            <Col span={8}>
              <FormItem label="采购单价" {...formItemThree} required>
                <Input value={price} addonAfter="元" onChange={this.handleInPriceChange}/>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="采购数量" {...formItemThree} required>
                <Input value={count} onChange={this.handleCountChange}/>
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
