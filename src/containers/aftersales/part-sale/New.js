import React, { Component } from 'react';
import { Row, Col, Button, Input, message, Table, Menu, Dropdown, Icon } from 'antd';

import text from '../../../config/text';
import className from 'classnames';
import api from '../../../middleware/api';

import NumberInput from '../../../components/widget/NumberInput';
import SearchDropDown from '../../../components/widget/SearchDropDown';

import Pay from './Pay';
import PrintArrearsModal from './PrintArrearsModal';
import PrintPaymentModal from './PrintPaymentModal';
import TablePaymentHistory from './TablePaymentHistory';
import CustomerSearchDrop from './CustomerSearchDrop';

const DropdownButton = Dropdown.Button;
const Search = Input.Search;

export default class New extends Component {
  constructor(props) {
    super(props);

    const { id } = props.match.params;
    this.state = {
      id: id || '',
      key: '',
      customerInfo: {}, // 当搜索客户时候存储所有搜索到的客户[]，当选中客户时候存储选中的客户{}, 编辑的时候存储当前销售单的信息(包含顾客信息){}
      historicalDebts: '',
      discount: '0.00',
      partsDetail: new Map(),
      partDeleteIds: '',
    };

    [
      'handleNewCustomer',
      'handleCustomerSearch',
      'handleCustomerSelectItem',
      'handlePartsSearch',
      'handlePartsSelectItem',
      'handlePriceChange',
      'handlePartsDelete',
      'handleDiscountChange',
      'handleSubmit',
      'getPartsDetailArray',
      'handlePartsKeyClear',
      'handleSearchClear',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { id } = this.state;

    if (id) {
      this.getPartSellDetail(id);
      this.getPartSellPartList(id);
    }
    this.setInputContentPadding();
  }

  componentDidUpdate() {
    this.setInputContentPadding();
  }

  setInputContentPadding() {
    let inputContent = document.getElementsByClassName('input-content');
    inputContent = Array.from(inputContent);
    if (inputContent) {
      for (const i in inputContent) {
        if (inputContent.hasOwnProperty(i)) {
          inputContent[i].parentNode.parentNode.style.padding = '2px 2px';
        }
      }
    }
  }

  handleNewCustomer(data) {
    this.setState({ customerInfo: data });
    this.getCustomerUnpayAmount(data.customer_id);
  }

  handleCustomerSearch(e) {
    const key = e.target.value;
    this.setState({ key });
    const coordinate = api.getPosition(e);

    const url = api.customer.searchCustomer(key);
    api.ajax({ url }, data => {
      const list = data.res.list;
      const info = {};
      info.info = list.filter(item => item._id !== null);
      info.coordinate = coordinate;
      info.visible = true;
      info.keyword = key;
      this.setState({ customerData: info, customerInfo: data.res.list });
    }, () => {
    });
  }

  handlePartsSearch(e) {
    const coordinate = api.getPosition(e);
    const key = e.target.value;
    this.setState({ partKey: key });
    if (key.length >= 1) {
      api.ajax({ url: api.warehouse.part.list({ key }) }, data => {
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

  handleCustomerSelectItem(selectItem) {
    const customerId = selectItem.customer_id || selectItem._id;
    this.setState({ customerInfo: selectItem });
    this.getCustomerUnpayAmount(customerId);
  }

  handleSearchClear() {
    this.setState({ key: '' });
  }

  handlePartsSelectItem(selectInfo) {
    const realAmount = Number(selectInfo.amount) - Number(selectInfo.freeze);
    if (realAmount <= 0) {
      message.error('该配件剩余库存不足');
      return false;
    }

    const { partsDetail } = this.state;
    if (partsDetail.has(selectInfo._id)) {
      message.error('该配件已经添加');
      return false;
    }

    partsDetail.set(selectInfo._id, selectInfo);
    this.setState({ partsDetail });
  }

  handlePartsKeyClear() {
    this.setState({ partKey: '' });
  }

  handleCountChange(value, record) {
    const realAmount = Number(record.amount || record.part_amount) -
      Number(record.freeze || record.part_freeze);
    const { partsDetail, discount } = this.state;

    if (Number(value) > realAmount) {
      record.count = '';
      partsDetail.set(record.part_id || record._id, record);
      this.setState({ partsDetail });
      message.error('输入数量有误，请重新输入');

      if (this.getTotalSettlement() < Number(discount)) {
        this.setState({ discount: '0.00' });
      }
      return false;
    }

    record.count = value;
    partsDetail.set(record.part_id || record._id, record);
    this.setState({ partsDetail });

    if (this.getTotalSettlement() < Number(discount)) {
      this.setState({ discount: '0.00' });
    }
    return true;
  }

  handlePriceChange(value, record) {
    const { partsDetail, discount } = this.state;

    record.price = value;

    partsDetail.set(record.part_id || record._id, record);
    this.setState({ partsDetail });

    if (this.getTotalSettlement() < Number(discount)) {
      this.setState({ discount: '0.00' });
    }
  }

  handleDiscountChange(e) {
    if (Number(e.target.value) < 0) {
      this.setState({ discount: '0.00' });
      message.error('优惠金额不能为负数, 请重新输入');
      return false;
    } else if (Number(e.target.value) > this.getTotalSettlement()) {
      this.setState({ discount: '0.00' });
      message.error('优惠金额不能超过结算金额, 请重新输入');
      return false;
    }

    this.setState({ discount: e.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') });
  }

  handlePartsDelete(partId, id) {
    let { partsDetail, discount, partDeleteIds } = this.state;

    if (String(partId) !== String(id)) {
      partDeleteIds = partDeleteIds ? `${partDeleteIds},${id}` : `${id}`;
    }

    partsDetail.delete(partId);

    this.setState({ partsDetail, partDeleteIds });

    // 价格改变，如果优惠金额大于结算金额 优惠金额置为0
    if (this.getTotalSettlement() < Number(discount)) {
      this.setState({ discount: '0.00' });
    }
  }

  handleSubmit() {
    const { customerInfo, partsDetail, discount, partDeleteIds } = this.state;

    if (JSON.stringify(customerInfo) == '{}' || customerInfo instanceof Array) {
      message.error('请输入手机号搜索客户');
      return false;
    }

    if (partsDetail.size <= 0) {
      message.error('请选择配件');
      return false;
    }

    const customerId = customerInfo.customer_id || customerInfo._id;
    const partList = [];
    for (const values of partsDetail.values()) {
      if (!values.price) {
        message.error('有配件未输入单价');
        return false;
      }
      if (!values.count) {
        message.error('有配件未输入数量');
        return false;
      }

      const part = {};
      part._id = values.part_id ? values._id : 0;
      part.price = values.price || 0;
      part.part_id = values.part_id ? values.part_id : values._id;
      part.count = values.count || 0;
      partList.push(part);
    }

    // 两种情况，一种是创建保存，一种是编辑保存
    !!(customerInfo.status)
      ? api.ajax({
        url: api.aftersales.partSellEdit(),
        type: 'POST',
        data: {
          _id: customerInfo._id,
          part_list: JSON.stringify(partList),
          discount,
          part_delete_ids: partDeleteIds,
        },
      }, data => {
        message.success('保存数据成功');
        window.location.href = `/aftersales/part-sale/edit/${data.res.detail._id}`;
      })
      : api.ajax({
        url: api.aftersales.createPartSell(),
        type: 'POST',
        data: {
          customer_id: customerId,
          part_list: JSON.stringify(partList),
          discount,
        },
      }, data => {
        message.success('保存数据成功');
        window.location.href = `/aftersales/part-sale/edit/${data.res.detail._id}`;
      });
  }

  getTotalSettlement() {
    const { partsDetail } = this.state;
    let total = 0;

    if (partsDetail.size > 0) {
      for (const value of partsDetail.values()) {
        total += Number(value.count || 0) * Number(value.price || 0);
      }
    }
    return total;
  }

  getCustomerUnpayAmount(customerId) {
    api.ajax({ url: api.customer.getCustomerUnpayAmount(customerId) }, data => {
      const { unpay_amount } = data.res;
      this.setState({ historicalDebts: unpay_amount ? Number(unpay_amount).toFixed(2) : '0.00' });
    });
  }

  getPartSellDetail(id) {
    api.ajax({ url: api.aftersales.getPartSellDetail(id) }, data => {
      const detail = data.res.detail;

      this.getCustomerUnpayAmount(detail.customer_id);
      this.setState({ customerInfo: detail, discount: detail.discount });
    });
  }

  getPartSellPartList(id) {
    api.ajax({ url: api.aftersales.getPartSellPartList(id) }, data => {
      const list = data.res.list;
      const mapList = list.map(item => [item.part_id, item]);
      this.setState({ partsDetail: new Map(mapList) });
    });
  }

  getPartsDetailArray() {
    const { partsDetail } = this.state;
    const partsDetailArray = [];
    for (const value of partsDetail.values()) {
      partsDetailArray.push(value);
    }
    return partsDetailArray;
  }

  displayPatternCustomer(item) {
    return (
      <div>
        <span className="width-100 inline-block">
          {item.name}
        </span>
        <span className="inline-block">
          {item.phone}
        </span>
      </div>
    );
  }

  displayPatternParts(item) {
    return `${item.name} ${item.part_no} ${item.brand} ${item.scope} 库存${Number(item.amount) -
    Number(item.freeze)}`;
  }

  render() {
    const {
      key,
      partKey,
      customerInfo,
      historicalDebts,
      partsDetail,
      discount,
      customerData,
    } = this.state;

    const self = this;

    const printMenu = (
      <Menu>
        <Menu.Item key="1">
          <PrintPaymentModal customerInfo={customerInfo} partsDetail={this.getPartsDetailArray()} />
        </Menu.Item>
        <Menu.Item key="2" className={Number(customerInfo.status) === 1 ? '' : 'hide'}>
          <PrintArrearsModal customerInfo={customerInfo} partsDetail={this.getPartsDetailArray()} />
        </Menu.Item>
      </Menu>
    );

    const customerNameIcon = className({
      'icon-first-name-none': !(customerInfo._id || customerInfo.customer_id),
      'icon-first-name': true,
    });

    const customerInfoContainer = className({
      'customer-info': !!(customerInfo._id || customerInfo.customer_id),
      hide: !(customerInfo._id || customerInfo.customer_id),
    });

    const columns = [
      {
        title: '序号',
        dataIndex: '',
        key: '',
        width: '48px',
        render: (value, record, index) => index + 1,
      }, {
        title: '配件名',
        render: (value, record) => record.name || record.part_name,
      }, {
        title: '配件号',
        dataIndex: 'part_no',
        key: 'part_no',
      }, {
        title: '规格',
        className: 'text-right',
        width: '75px',
        render: (value, record) => (record.spec || record.part_spec || '') +
          (record.unit || record.part_unit || ''),
      }, {
        title: '品牌',
        render: (value, record) => record.brand || record.part_brand,
      }, {
        title: '适用车型',
        render: (value, record) => record.scope || record.part_scope,
      }, {
        title: '剩余库存',
        dataIndex: '',
        key: '',
        width: '75px',
        render: (value, record) => {
          const stock = (record.amount - record.freeze) ||
            (record.part_amount - record.part_freeze) || 0;
          return stock -
            parseInt(self.state.partsDetail.get(record.part_id || record._id).count || 0);
        },
      }, {
        title: '数量',
        dataIndex: 'take_amount',
        key: 'take_amount',
        width: '74px',
        render: (value, record) => (
            <div>
              <div className="input-content" />
              <NumberInput
                value={record.count}
                id={`amount${record._id}`}
                onChange={value => self.handleCountChange(value, record)}
                unitVisible={false}
                isInt={true}
              />
            </div>
          ),
      }, {
        title: '销售单价',
        dataIndex: 'sales_price',
        key: 'sales_price',
        width: '74px',
        render: (value, record) => (
            <div>
              <div className="input-content" />
              <NumberInput
                value={record.price}
                id={`price${record._id}`}
                onChange={value => self.handlePriceChange(value, record)}
                unitVisible={false}
              />
            </div>
          ),
      }, {
        title: '金额',
        className: 'text-right',
        width: '95px',
        render: (value, record) => {
          const { partsDetail } = self.state;
          const item = record.part_id ? partsDetail.get(record.part_id) : partsDetail.get(record._id);
          return (Number(item.count || 0) * Number(item.price || 0)).toFixed(2);
        },
      }, {
        title: '操作',
        className: 'center',
        width: '70px',
        render: (value, record) => (
          <a
            href="javascript:;"
            onClick={() => self.handlePartsDelete(record.part_id || record._id, record._id)}
          >
            删除
          </a>
        ),
      }];

    return (
      <div>
        <SearchDropDown
          partsInfo={this.state.partsInfo}
          onTableRowClick={this.handlePartsSelectItem}
          isInsertPart="false"
          onCancel={this.handlePartsKeyClear}
        />

        <CustomerSearchDrop
          info={customerData}
          onItemSelect={this.handleCustomerSelectItem}
          onCancel={this.handleSearchClear}
        />

        <Row className="mb10">
          <Col span={10}>
            <Input.Group style={{ width: '50px' }}>
              <Search
                placeholder="请输入手机号搜索"
                onChange={e => this.handleCustomerSearch(e)}
                size="large"
                style={{ width: '300px' }}
                value={key}
              />
            </Input.Group>
          </Col>
          <Col span={14}>
            <div className="pull-right">
              <DropdownButton overlay={printMenu} disabled={!customerInfo.status}>
                打印
              </DropdownButton>

              <span className="ml10">
               <Pay
                 status={customerInfo.status}
                 orderId={customerInfo._id}
               />
              </span>

              <Button
                className="ml10"
                size="default"
                type="primary"
                onClick={this.handleSubmit}
                disabled={Number(customerInfo.status) === 1 || Number(customerInfo.status) === 2}
              >
                保存
              </Button>
            </div>
          </Col>
        </Row>

        <div className="base-info with-bottom-divider mb20">
          <div className="customer-container">
            <div className={customerNameIcon}>
              {(customerInfo.customer_name || customerInfo.name) ? (customerInfo.customer_name ||
                customerInfo.name).substr(0, 1) : <Icon type="user" style={{ color: '#fff' }} />}
            </div>
            <div className={customerInfoContainer}>
              <div>
                <span className="customer-name">{customerInfo.customer_name ||
                customerInfo.name}</span>
                <span className="ml6">{text.gender[String(customerInfo.customer_gender ||
                  customerInfo.gender)]}</span>
              </div>
              <div>
                <span>{customerInfo.customer_phone || customerInfo.phone}</span>
                <span className="ml10">历史欠款 {historicalDebts}元</span>
              </div>
            </div>
          </div>
        </div>

        <Row className="mb20">
          <h3>配件明细</h3>
        </Row>

        <Row className="mt20 mb10">
          <Col span={24}>
            <label className="label">搜索配件</label>
            <Search
              placeholder="请输入配件名、配件名首字母或配件号搜索"
              style={{ width: 305 }}
              onChange={this.handlePartsSearch}
              size="large"
              value={partKey}
            />
          </Col>
        </Row>

        <div className="with-bottom-divider part-sale-mingxi">
          <Table
            columns={columns}
            dataSource={[...partsDetail.values()]}
            pagination={false}
            bordered
            rowKey={record => record.part_id || record._id}
          />
        </div>

        <Row className="mb20 mt20">
          <h3>结算信息</h3>
        </Row>

        <div className="ml-80">
          <div className="info-line">
            <label className="label">结算金额</label>
            <span className="ant-form-text">{`${this.getTotalSettlement().toFixed(2)}元`}</span>
          </div>

          <div className="info-line">
            <label className="label">优惠金额</label>
            <div className="width-150">
              <Input
                type="number"
                addonAfter="元"
                onChange={this.handleDiscountChange}
                value={discount}
              />
            </div>
          </div>

          <div className="info-line">
            <label className="label">应付金额</label>
            <p className="ant-form-text order-money">
              {`${(this.getTotalSettlement() - Number(discount)).toFixed(2)}元`}
            </p>

            <div className={Number(customerInfo.status) === 1 ? 'ml40' : 'hide'}>
              <label className="label">实付金额</label>
              <p className="ant-form-text order-money">
                {Number((customerInfo.real_amount || 0) - (customerInfo.unpay_amount || 0)).
                  toFixed(2)}元
              </p>
            </div>

            <div className={Number(customerInfo.status) === 1 ? 'ml40' : 'hide'}>
              <label className="label">还款记录</label>
              <TablePaymentHistory customerInfo={customerInfo} size="small" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

