import React from 'react';
import {message, Modal, Form, Row, Col, Button, InputNumber} from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import NumberInput from '../../../components/widget/NumberInput';

import BaseModal from '../../../components/base/BaseModal';
import PartSearchBox from '../../../components/search/PartSearchBox';
import TableWithPagination from '../../../components/widget/TableWithPagination';

const FormItem = Form.Item;

export default class AddPart extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      supplierId: props.supplierId,
      part: {},
      page: 1,
      list: [],
      total: 0,
      itemMap: new Map(),
    };

    [
      'showPartModal',
      'handleSearchSelect',
      'handlePageChange',
      'handleComplete',
      'handleContinueAdd',
      'handleInPriceChange',
      'handleCountChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    let {supplierId} = nextProps;
    if (this.props.supplierId !== supplierId) {
      this.setState({supplierId});
    }
  }

  showPartModal() {
    let {supplierId} = this.props;
    if (!supplierId) {
      message.warning('请选择供应商');
      return;
    }
    this.showModal();
  }

  handleSearchSelect(select) {
    if (select.data && String(select.data._id) !== '-1') {
      let part = select.data;

      this.getPurchaseItemsBySupplierAndPart(part);
      this.setState({part});
    }
  }

  handlePageChange(page) {
    this.setState({page});
  }

  /**
   * 进货单配件项数量和价格修改
   * @param item 进货单单个配件项目
   * @param propName reject_count || reject_price
   * @param e
   */
  handleItemChange(item, propName, changeValue) {

    if (String(changeValue).length === 0) {
      return false;
    }

    let {itemMap} = this.state;

    if (parseInt(changeValue) > parseFloat(item[propName === 'reject_count' ? 'remain_amount' : 'in_price'])) {
      if (itemMap.has(item.purchase_item_id)) {
        let currentItem = itemMap.get(item.purchase_item_id);
        currentItem[propName] = '';
      }
      message.warning(propName === 'reject_count' ? '退货数量不能大于进货数量' : '退货单价不能大于进货价', 3);
      return false;
    }

    if (itemMap.has(item.purchase_item_id)) {
      let currentItem = itemMap.get(item.purchase_item_id);
      currentItem[propName] = changeValue;
    }

    this.setState({itemMap});
    return true;
  }

  handleComplete() {
    if (this.saveItems()) {
      this.setState({
        visible: false,
        part: {},
        list: [],
      });
    }
  }

  handleContinueAdd() {
    if (this.saveItems()) {
      this.setState({
        part: {},
        list: [],
      });
    }
  }

  handleInPriceChange(e) {
    let price = e.target.value;
    this.setState({price: price ? price : ''});
  }

  handleCountChange(e) {
    let count = e.target.value;
    this.setState({count: count ? count : ''});
  }

  saveItems() {
    let {itemMap} = this.state;

    let willRejectItems = [];
    itemMap.forEach(item => {
      if (item.reject_count && item.reject_price) {
        if (parseInt(item.reject_count) <= parseInt(item.amount) || parseFloat(item.reject_price) <= parseFloat(item.in_price)) {
          willRejectItems.push(item);
        }
      }
    });

    if (willRejectItems.length === 0) {
      message.warning('请完善配件信息');
      return false;
    }

    this.props.onAdd(willRejectItems);
    return true;
  }

  getPurchaseItemsBySupplierAndPart(part) {
    let {supplierId, page} = this.state;
    api.ajax({url: api.warehouse.purchase.itemsBySupplierAndPart(part._id, supplierId, page)}, data => {
      let {list, total} = data.res;
      if (list.length === 0) {
        message.warning('暂无该供应商的进货信息', 3);
        return;
      }

      let itemMap = new Map();
      list.map(item => {
        item.purchase_item_id = item._id;
        item.purchase_price = item.in_price;
        item.part_type_name = part.part_type_name;
        item.part_name = part.name;
        item.part_no = part.part_no;
        item.scope = part.scope;
        item.brand = part.brand;
        item._id = '0';
        item.spec = part.spec;
        item.unit = part.unit;

        itemMap.set(item.purchase_item_id, item);
      });

      this.setState({
        list,
        total: parseInt(total),
        itemMap,
      });
    });
  }

  render() {
    const {formItemThree} = Layout;
    let {
      visible,
      supplierId,
      part,
      list,
      total,
      page,
      itemMap,
    } = this.state;

    let self = this;
    const columns = [
      {
        title: '采购单号',
        dataIndex: 'purchase_item_id',
        key: 'purchase_item_id',
      }, {
        title: '入库时间',
        dataIndex: 'arrival_time',
        key: 'arrival_time',
      }, {
        title: '库存数量',
        dataIndex: 'remain_amount',
        key: 'remain_amount',
      }, {
        title: '单价',
        dataIndex: 'in_price',
        key: 'in_price',
      }, {
        title: '退货数量',
        dataIndex: 'purchase_item_id',
        key: 'reject_count',
        className: 'center',
        render: (id, record) => {
          return (
            <NumberInput
              style={{width: '120px'}}
              id="reject_count"
              unitVisible={false}
              isInt={true}
              onChange={self.handleItemChange.bind(self, record, 'reject_count')}
            />

          );
        },
      }, {
        title: '退货单价',
        dataIndex: 'purchase_item_id',
        key: 'reject_price',
        className: 'center',
        render: (id, record) => {
          return (
            <NumberInput
              style={{width: '120px'}}
              id="reject_count"
              unitVisible={false}
              onChange={self.handleItemChange.bind(self, record, 'reject_price')}
            />
          );
        },
      },
    ];

    let modelFooter = (
      <span>
        <Button type="ghost" size="large" onClick={this.handleComplete} disabled={itemMap.size === 0}>完成</Button>
        <Button type="primary" size="large" onClick={this.handleContinueAdd} disabled={itemMap.size === 0}>继续添加</Button>
      </span>
    );

    return (
      <span>
        <Button onClick={this.showPartModal}>添加配件</Button>

        <Modal
          title="添加配件"
          visible={visible}
          width={960}
          maskCloseable
          onCancel={this.hideModal}
          footer={modelFooter}
        >
          <Row className="mb10">
            <Col span={8}>
              <FormItem label="搜索配件" {...formItemThree}>
                <PartSearchBox
                  api={api.warehouse.part.searchByTypeId}
                  select={this.handleSearchSelect}
                  style={{width: 210}}
                  supplier_id={supplierId}
                />
              </FormItem>
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
              <FormItem label="规格" {...formItemThree}>
                <p>{!!part.spec ? part.spec + part.unit : ''}</p>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="配件分类" {...formItemThree}>
                <p>{part.part_type_name}</p>
              </FormItem>
            </Col>

          </Row>
          <Row className="mb10">
            <Col span={8}>
              <FormItem label="库存/冻结数" {...formItemThree}>
                <p>{part.amount}/{part.freeze} {part.unit}</p>
              </FormItem>
            </Col>
          </Row>

          <TableWithPagination
            columns={columns}
            dataSource={list}
            total={total}
            currentPage={page}
            onPageChange={this.handlePageChange}
            rowKey={record => record.purchase_item_id}
          />
        </Modal>
      </span>
    );
  }
}
