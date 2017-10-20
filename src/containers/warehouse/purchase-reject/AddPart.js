import React from 'react';
import { message, Modal, Row, Col, Button, Input } from 'antd';

import api from '../../../middleware/api';
import NumberInput from '../../../components/widget/NumberInput';

import BaseModal from '../../../components/base/BaseModal';
import TableWithPagination from '../../../components/widget/TableWithPagination';
import SearchDropDown from '../../../components/widget/SearchDropDown';

const Search = Input.Search;

export default class AddPart extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      supplierId: props.supplierId,
      page: 1,
      list: [],
      total: 0,
      itemMap: new Map(),
      partsInfo: '',
      key: '',
    };

    [
      'showPartModal',
      'handlePageChange',
      'handleComplete',
      'handleContinueAdd',
      'handleInPriceChange',
      'handleCountChange',
      'handlePartsSearch',
      'handTableRowClick',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    const { supplierId } = nextProps;
    if (this.props.supplierId !== supplierId) {
      this.setState({ supplierId });
    }
  }

  showPartModal() {
    const { supplierId } = this.props;
    const { itemMap } = this.state;
    if (!supplierId) {
      message.warning('请选择供应商');
      return;
    }
    itemMap.clear();
    const list = [];
    const key = '';
    this.setState({ itemMap, list, key });
    this.showModal();
  }

  handlePageChange(page) {
    this.setState({ page });
  }

  handlePartsSearch(e) {
    const coordinate = api.getPosition(e);
    const key = e.target.value;
    this.setState({ key });
    if (key.length >= 1) {
      api.ajax({ url: api.warehouse.part.searchBySupplierId(key, this.state.supplierId) }, data => {
        const list = data.res.list;
        const partsInfo = {};
        partsInfo.info = list;
        partsInfo.coordinate = coordinate;
        partsInfo.visible = true;
        partsInfo.keyword = key;
        this.setState({ partsInfo });
      });
    }
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

    const { itemMap } = this.state;

    if (parseInt(changeValue) >
      parseFloat(item[propName === 'reject_count' ? 'remain_amount' : 'in_price'])) {
      if (itemMap.has(item.purchase_item_id)) {
        const currentItem = itemMap.get(item.purchase_item_id);
        currentItem[propName] = '';
      }
      message.warning(propName === 'reject_count' ? '退货数量不能大于进货数量' : '退货单价不能大于进货价', 3);
      return false;
    }

    if (itemMap.has(item.purchase_item_id)) {
      const currentItem = itemMap.get(item.purchase_item_id);
      currentItem[propName] = changeValue;
    }

    this.setState({ itemMap });
    return true;
  }

  handleComplete() {
    if (this.saveItems()) {
      this.setState({
        visible: false,
        list: [],
      });
    }
  }

  handleContinueAdd() {
    if (this.saveItems()) {
      const { itemMap } = this.state;
      itemMap.clear();
      const list = [];
      const key = '';
      this.setState({ itemMap, list, key, total: 0 });
    }
  }

  handleInPriceChange(e) {
    const price = e.target.value;
    this.setState({ price: price ? price : '' });
  }

  handleCountChange(e) {
    const count = e.target.value;
    this.setState({ count: count ? count : '' });
  }

  handTableRowClick(value) {
    this.getPurchaseItemsBySupplierAndPart(value);
  }

  saveItems() {
    const { itemMap } = this.state;

    const willRejectItems = [];
    itemMap.forEach(item => {
      if (item.reject_count && item.reject_price) {
        if (parseInt(item.reject_count) <= parseInt(item.amount) ||
          parseFloat(item.reject_price) <= parseFloat(item.in_price)) {
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
    const { supplierId, page } = this.state;
    api.ajax({ url: api.warehouse.purchase.itemsBySupplierAndPart(part._id, supplierId, page) }, data => {
      const { list, total } = data.res;
      if (list.length === 0) {
        message.warning('暂无该供应商的进货信息', 3);
        return;
      }

      const itemMap = new Map();
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
    const {
      visible,
      list,
      total,
      page,
      itemMap,
      partsInfo,
      key,
    } = this.state;

    const self = this;
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
        width: '100px',
        render: (id, record) => (
            <NumberInput
              style={{ margin: '-6px' }}
              id="reject_count"
              unitVisible={false}
              isInt={true}
              onChange={self.handleItemChange.bind(self, record, 'reject_count')}
            />
          ),
      }, {
        title: '退货单价',
        dataIndex: 'purchase_item_id',
        key: 'reject_price',
        className: 'center',
        width: '100px',
        render: (id, record) => (
            <NumberInput
              style={{ margin: '-6px' }}
              id="reject_count"
              unitVisible={false}
              onChange={self.handleItemChange.bind(self, record, 'reject_price')}
            />
          ),
      },
    ];

    const modelFooter = (
      <span>
        <Button
          type="ghost"
          size="large"
          onClick={this.handleComplete}
          disabled={itemMap.size === 0}
        >
          完成
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={this.handleContinueAdd}
          disabled={itemMap.size === 0}
        >
          继续添加
        </Button>
      </span>
    );

    return (
      <div>
        <SearchDropDown
          partsInfo={partsInfo}
          onTableRowClick={this.handTableRowClick}
          isInsertPart="false"
        />

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
              <label className="label">搜索配件</label>
              <Search
                placeholder="用关键字或编号搜索配件"
                style={{ width: 210 }}
                onChange={this.handlePartsSearch}
                size="large"
                value={key}
              />
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
      </div>
    );
  }
}
