import React from 'react';
import { Row, Col, Table, Select, Input, Icon, Popconfirm, message } from 'antd';

import api from '../../../middleware/api';

import Dispatch from './Dispatch';
import ItemSearchDrop from '../../../components/widget/ItemSearchDrop';

const Option = Select.Option;
const Search = Input.Search;

export default class TableItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fitterUsers: [],
      selectedItemIds: [],
      data: [],
      key: '',
    };

    [
      'handleDispatch',
      'handleRowSelect',
      'handleItemEdit',
      'handleFixerChange',
      'handleTimeFeeBaseChange',
      'handleAddItem',
      'renderFooter',
      'handleItemSearch',
      'handleItemSelect',
      'handleLevelsChange',
      'handleRemoveItem',
      'handleSearchClear',
      'handleTimeFeeBaseBlur',
      'handleSellerChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getFitterUsers();
    this.setInputContentPadding();
    this.setcouponIconPositon();
  }

  componentDidUpdate() {
    this.setInputContentPadding();
    this.setcouponIconPositon();
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

  setcouponIconPositon() {
    let couponIcon = document.getElementsByClassName('couponIcon');
    couponIcon = Array.from(couponIcon);

    if (couponIcon) {
      for (const i in couponIcon) {
        if (couponIcon.hasOwnProperty(i)) {
          couponIcon[i].parentNode.style.position = 'relative';
        }
      }
    }
  }

  handleDispatch(itemIds, fitterUserIds, fitterUserNames) {
    const { itemMap } = this.props;
    itemIds.forEach(itemId => {
      const item = itemMap.get(itemId);
      item.fitter_user_ids = fitterUserIds;
      item.fitter_user_names = fitterUserNames;
      itemMap.set(itemId, item);
    });

    this.props.onSuccess(itemMap);
  }

  handleRowSelect(selectedRowKeys, selectedRows) {
    const ids = [];
    selectedRows.forEach(row => ids.push(row.item_id));
    this.setState({ selectedItemIds: ids });
  }

  handleItemEdit(maintain_item) {
    const { itemMap } = this.props;
    itemMap.set(maintain_item.item_id, maintain_item);
    this.props.onSuccess(itemMap);
  }

  handleFixerChange(value, record) {
    const userIds = value ? value.toString() : '';
    const { itemMap } = this.props;

    const userIdArray = userIds.split(',');
    const userNameArray = [];
    for (let i = 0; i < this.state.fitterUsers.length; i++) {
      if (userIdArray.indexOf(this.state.fitterUsers[i]._id) > -1) {
        userNameArray.push(this.state.fitterUsers[i].name);
      }
    }

    record.fitter_user_ids = userIds;
    record.fitter_user_names = userNameArray.join(',');
    itemMap.set(record.item_id, record);

    this.props.onSuccess(itemMap);
  }

  handleSellerChange(value, record) {
    const userIds = value ? value.toString() : '';
    const { itemMap } = this.props;

    const userIdArray = userIds.split(',');
    const userNameArray = [];
    for (let i = 0; i < this.state.fitterUsers.length; i++) {
      if (userIdArray.indexOf(this.state.fitterUsers[i]._id) > -1) {
        userNameArray.push(this.state.fitterUsers[i].name);
      }
    }

    record.seller_user_ids = userIds;
    record.seller_user_names = userNameArray.join(',');
    itemMap.set(record.item_id, record);

    this.props.onSuccess(itemMap);
  }

  handleLevelsChange(value, record) {
    const { itemMap } = this.props;
    const timeFeeBase = value.split(',')[0];
    const levelName = value.split(',')[1];

    record.time_fee_base = timeFeeBase;
    record.time_fee = (record.time_count || 1) * timeFeeBase;
    this.setformDataTypeRate(record, this.props.memberDetailList);
    record.coupon_discount = this.getPreferentialAmount(record);
    record.paid_amount = this.getPaidAmount(record);
    record.level_name = levelName;

    itemMap.set(record.item_id, record);

    this.props.onSuccess(itemMap);
  }

  setformDataTypeRate(formData, memberDetailList) {
    if (memberDetailList) {
      memberDetailList.map(item => {
        if (Number(item._id) === Number(formData.customer_coupon_item_id)) {
          formData.type = item.coupon_item_info.type;
          formData.discount_rate = item.coupon_item_info.discount_rate;
          if (formData.item_id) {
            item.coupon_item_info.items instanceof Array &&
            item.coupon_item_info.items.map(value => {
              if (String(value._id) === String(formData.item_id)) {
                formData.coupon_price = value.price || 0;
              }
            });
          } else if (formData.part_type_id) {
            item.coupon_item_info.part_types instanceof Array &&
            item.coupon_item_info.part_types.map(value => {
              if (String(value._id) === String(formData.part_type_id)) {
                formData.coupon_price = value.price || 0;
              }
            });
          }
        }
      });
    }
  }

  getPaidAmount(record) {
    return Number(record.time_fee) - this.getPreferentialAmount(record);
  }

  getPreferentialAmount(record) {
    switch (Number(record.type)) {
    case 1:
      if (Number(record.time_count) >= Number(record.coupon_time_count)) {
        return Number(record.coupon_time_count) *
            (Number(record.time_fee_base) - Number(record.coupon_price || '0'));
      } else {
        return Number(record.time_count) *
            (Number(record.time_fee_base) - Number(record.coupon_price || '0'));
      }
    case 2:
      if (Number(record.time_count) >= Number(record.coupon_time_count)) {
        return Number(record.time_fee_base * (1 - record.discount_rate) *
            record.coupon_time_count).toFixed(2);
      } else {
        return Number(record.time_fee_base * (1 - record.discount_rate) * record.time_count).
            toFixed(2);
      }
    case 3:
      return Number(record.discount_amount);
    default:
      return 0;
    }
  }

  handleTimeFeeBaseChange(e, record) {
    const { itemMap } = this.props;
    let timeFeeBase = e.target.value;

    if (Number(timeFeeBase) < 0) {
      message.error('工时单价需要大于0, 请重新填写');
      timeFeeBase = '';
    }

    record.time_fee_base = timeFeeBase;
    record.time_fee = (record.time_count || 1) * timeFeeBase;
    this.setformDataTypeRate(record, this.props.memberDetailList);
    record.coupon_discount = this.getPreferentialAmount(record);
    record.paid_amount = this.getPaidAmount(record);

    itemMap.set(record.item_id, record);

    this.props.onSuccess(itemMap);
  }

  handleTimeFeeBaseBlur(e, record) {
    const timeFeeBase = e.target.value;
    if (Number(record.coupon_price) > 0 && (Number(timeFeeBase) < Number(record.coupon_price))) {
      message.error(`最低售价为${record.coupon_price}`);
      this.timeFee.refs.input.value = '';
    }
  }

  handleTimeCountChange(e, record) {
    const timeCount = e.target.value;

    const { itemMap } = this.props;

    record.time_count = timeCount;
    record.time_fee = record.time_fee_base * timeCount;

    this.setformDataTypeRate(record, this.props.memberDetailList);
    record.coupon_discount = this.getPreferentialAmount(record);
    record.paid_amount = this.getPaidAmount(record);

    itemMap.set(record.item_id, record);

    this.props.onSuccess(itemMap);
  }

  handleAddItem() {
    const { itemMap } = this.props;
    if (itemMap.has('add')) {
      message.warn('请先选择维修项目');
      return false;
    }

    const record = {
      item_id: 'add',
    };
    itemMap.set('add', record);
    this.props.onSuccess(itemMap);
  }

  handleItemSearch(e) {
    const key = e.target.value;
    const coordinate = api.getPosition(e);

    this.setState({ key });
    if (!!key && key.length >= 2) {
      api.ajax({ url: api.maintainItem.list({ key }) }, data => {
        const list = data.res.list;
        const info = {};
        info.info = list;
        info.coordinate = coordinate;
        info.visible = true;
        info.keyword = key;
        this.setState({ data: info });
      });
    }
  }

  handleSearchClear() {
    this.setState({ key: '' });
  }

  handleItemSelect(value) {
    const { itemMap } = this.props;

    value.item_id = value._id;
    value.item_name = value.name;
    value.levels = value.levels ? JSON.parse(value.levels) : [];
    value.time_count = value.time_count ? value.time_count : 1;
    value._id = 0;
    value.time_fee_base = '';
    this.setformDataTypeRate(value, this.props.memberDetailList);
    value.coupon_discount = this.getPreferentialAmount(value);
    value.paid_amount = this.getPaidAmount(value);
    value.time_fee = value.time_count * value.time_fee_base;

    value.level_name = value.levels.length > 0 ? '' : '现场报价';

    itemMap.delete('add');
    itemMap.set(value.item_id, value);
    this.props.onSuccess(itemMap);

    const record = {
      item_id: 'add',
    };
    itemMap.set('add', record);
  }

  handleRemoveItem(record) {
    const { itemMap, partMap } = this.props;

    if (Number(record.customer_coupon_item_id) > 0) {
      Array.from(itemMap.values()).map(item => {
        if (Number(item.customer_coupon_item_id) === Number(record.customer_coupon_item_id)) {
          this.props.removeMaintainItem(item.item_id, item._id);
        }
      });

      for (const [key, value] of partMap.entries()) {
        if (Number(value.customer_coupon_item_id) === Number(record.customer_coupon_item_id)) {
          this.props.removeMaintainPart(key, value._id);
        }
      }

      this.props.onEditCouponUseState(record.customer_coupon_item_id, 'delete');
    } else {
      this.props.removeMaintainItem(record.item_id, record._id);
    }
  }

  getFitterUsers() {
    api.ajax({ url: api.user.getMaintainUsers(0) }, data => {
      this.setState({ fitterUsers: data.res.user_list });
      this.getMaintainItems(this.props.intention_id, this.props.customer_id);
    });
  }

  getCouponAmount(item) {
    if (!item) {
      return;
    }

    const {
      type,
      time_count,
      coupon_time_count,
      time_fee_base,
      discount_rate,
      discount_amount,
      coupon_price,
    } = item;

    switch (Number(type)) {
    case 1:
      if (Number(time_count) >= Number(coupon_time_count)) {
        return Number(coupon_time_count) * (Number(time_fee_base) - Number(coupon_price));
      } else {
        return Number(time_count) * (Number(time_fee_base) - Number(coupon_price));
      }
    case 2:
      if (Number(time_count) >= Number(coupon_time_count)) {
        return Number(time_fee_base * (1 - discount_rate) * coupon_time_count);
      } else {
        return Number(time_fee_base * (1 - discount_rate) * time_count);
      }
    case 3:
      return Number(discount_amount);
    default:
      return 0;
    }
  }

  getMaintainItems(intention_id = '', customer_id = '') {
    if (!!intention_id) {
      api.ajax({ url: api.aftersales.getItemListOfMaintProj(intention_id, customer_id) }, data => {
        const { list } = data.res;
        const itemMap = new Map();
        list.map(item => itemMap.set(item.item_id, item));
        this.props.onSuccess(itemMap);
      });
    }
  }

  renderFooter(items) {
    let timeFee = 0;
    items.forEach(item => {
      const itemTimeFee = Number(item.time_fee) - Number(item.coupon_discount);
      if (!isNaN(itemTimeFee)) {
        timeFee += itemTimeFee;
      }
    });

    return (
      <Row>
        <Col span={12}><p className="ml55 pointer" style={{ color: '#108ee9' }}
                          onClick={this.handleAddItem}><Icon
          type="plus" />添加维修项目</p></Col>
        <Col span={12}><span className="pull-right mr120">工时费合计(元)：{Number(timeFee).
          toFixed(2)}</span></Col>
      </Row>
    );
  }

  render() {
    const { itemMap, payStatus, status } = this.props;
    const { selectedItemIds, data, key } = this.state;

    if (Number(payStatus) === 2) {
      itemMap.delete('add');
    }
    const items = Array.from(itemMap.values());

    const self = this;
    const columns = [
      {
        title: '维修项目',
        dataIndex: 'item_name',
        key: 'item_name',
        render: (value, record) => (
            <div className="couponIcon">
              {
                record.customer_coupon_item_id > 0
                  ? <div className="coupon-icon">
                    <div style={{ zIndex: '100' }} className="triangle-border" />
                    <div className="coupon-word-icon">优惠</div>
                  </div>
                  : null
              }
              {
                !!value ? value : <div className="input-content">
                  <Search
                    defaultValue={value}
                    placeholder="搜索项目名称"
                    onChange={e => this.handleItemSearch(e, record)}
                    value={key}
                    size="large"
                  />
                </div>
              }
            </div>
          ),
      }, {
        title: '维修人员',
        dataIndex: 'fitter_user_names',
        key: 'fitter_user_names',
        width: '110px',
        render: (item, record) => (
            <div>
              {/* 为了获取父级的父级元素 设置padding*/}
              <div className="input-content" />
              <Select
                mode="multiple"
                onChange={value => self.handleFixerChange(value, record)}
                className="no-margin-bottom"
                placeholder="请选择"
                value={record.fitter_user_ids ? record.fitter_user_ids.split(',') : []}
                size="large"
              >
                {this.state.fitterUsers.map(user => <Option value={user._id}
                                                            key={user._id}>{user.name}</Option>)}
              </Select>
            </div>

          ),
      }, {
        title: '销售人员',
        dataIndex: 'seller_user_names',
        key: 'seller_user_names',
        width: '128px',
        render: (item, record) => (
            <div>
              <div className="input-content" />
              <Select
                mode="multiple"
                onChange={value => self.handleSellerChange(value, record)}
                className="no-margin-bottom"
                placeholder="请选择"
                value={record.seller_user_ids ? record.seller_user_ids.split(',') : []}
                size="large"
              >
                {this.state.fitterUsers.map(user => (
                  <Option value={user._id} key={user._id}>{user.name}</Option>),
                )}
              </Select>
            </div>

          ),
      }, {
        title: '工时单价',
        dataIndex: 'time_fee_base',
        key: 'time_fee_base',
        className: 'text-right',
        width: '74px',
        render: (value, record) => {
          if (record.levels && typeof record.levels === 'string') {
            record.levels = JSON.parse(record.levels);
          }

          let levelPrice = '';
          let defaultValue = '';

          record.levels && record.levels.map(item => {
            if (item.name === record.level_name) {
              levelPrice = item.price;
            }
          });

          if (levelPrice) {
            defaultValue = `${levelPrice},${record.level_name}`;
          }

          return (
            <div>
              <div className="input-content" />
              {
                record.levels && record.levels.length > 0
                  ? <Select
                    onSelect={e => this.handleLevelsChange(e, record)}
                    placeholder="请选择档次"
                    defaultValue={defaultValue}
                    size="large"
                  >
                    {record.levels.map(item =>
                      <Option key={`${item.price},${item.name}`}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          minWidth: '120px',
                        }}>
                          <span>{item.name}</span>
                          <span>{Number(item.price).toFixed(2)}</span>
                        </div>
                      </Option>)}
                  </Select>
                  : <Input
                    value={value ? Number(value) : ''}
                    onChange={e => self.handleTimeFeeBaseChange(e, record)}
                    style={{ textAlign: 'right' }}
                    onBlur={e => self.handleTimeFeeBaseBlur(e, record)}
                    ref={timeFee => this.timeFee = timeFee}
                    type="number"
                    min="0"
                    size="large"
                  />
              }
            </div>
          );
        },
      }, {
        title: '工时数量',
        dataIndex: 'time_count',
        key: 'time_count',
        width: '74px',
        render: (value, record) => (
            <div>
              <div className="input-content" />
              <Input
                type="number"
                defaultValue={value ? value : '0'}
                onChange={e => self.handleTimeCountChange(e, record)}
                size="large"
              />
            </div>

          ),
      }, {
        title: '工时费',
        dataIndex: 'time_fee',
        key: 'time_fee',
        className: 'text-right',
        width: '75px',
        render: (value, record) => record.time_fee_base && record.time_count ? (record.time_fee_base *
            record.time_count).toFixed(2) : '--',
      }, {
        title: '优惠数量',
        dataIndex: 'coupon_time_count',
        key: 'coupon_time_count',
        width: '75px',
        render: value => value || '--',
      }, {
        title: '优惠金额',
        dataIndex: 'coupon_discount',
        key: 'coupon_discount',
        className: 'text-right',
        width: '95px',
        render: (value, record) => {
          if (record.hasOwnProperty('coupon_item_info')) {
            Number(self.getCouponAmount(record.coupon_item_info)).toFixed(2);
          } else {
            return Number(record.coupon_discount) > 0
              ? Number(record.coupon_discount).toFixed(2)
              : '--';
          }
        },
      }, {
        title: '实收金额',
        dataIndex: 'paid_amount',
        key: 'paid_amount',
        width: '95px',
        className: 'text-right',
        render: (value, record) => {
          if (record.hasOwnProperty('type')) {
            if (String(record.time_fee) && self.getCouponAmount(record)) {
              return ((Number(record.time_fee) - self.getCouponAmount(record)).toFixed(2));
            }
            return '0.00';
          } else {
            return record.time_fee
              ? (Number(record.time_fee) - record.coupon_discount).toFixed(2)
              : '--';
          }
        },
      }, {
        title: '提成',
        dataIndex: 'sell_bonus_amount',
        key: 'sell_bonus_amount',
        width: '70px',
        className: (payStatus === '1' || payStatus === '2') ? 'text-right' : 'hide',
        render: (value, record) => {
          const sellBonusAmount = !!value ? Number(value) : 0;
          const workBonusAmount = !!record.work_bonus_amount ? Number(record.work_bonus_amount) : 0;

          const bonus = sellBonusAmount + workBonusAmount;

          return Number(bonus) === 0 ? '--' : Number(bonus).toFixed(2);
        },
      }, {
        title: '操作',
        dataIndex: 'intention_info',
        key: 'operation',
        className: String(status) === '1' ? 'hide' : 'center',
        width: '70px',
        fixed: String(status) === '1' ? null : 'right',
        render: (value, record) => {
          const text = Number(Number(record.customer_coupon_item_id)) ? (
            <div>
              <p>该配件是套餐卡优惠项,</p>
              <p>删除该项会同时移除相关项目、配件，</p>
              <p>是否确认？</p>
            </div>
          ) : '确定删除该项?';
          const width = Number(Number(record.customer_coupon_item_id))
            ? { width: '272px' }
            : { width: '170px' };
          return (
            <div>
              <Popconfirm
                title={text}
                onConfirm={() => self.handleRemoveItem(record)}
                okText="确定"
                cancelText="取消"
                overlayStyle={width}
                placement="topRight"
              >
                <a href="javascript:;" className="action-delete" disabled={Number(payStatus) === 2}>删除</a>
              </Popconfirm>
            </div>
          );
        },
      }];

    const rowSelection = {
      onChange: this.handleRowSelect,
    };

    const hasSelected = selectedItemIds.length > 0;

    return (
      <div className="with-bottom-divider">
        <ItemSearchDrop
          info={data}
          onItemSelect={this.handleItemSelect}
          onCancel={this.handleSearchClear}
        />
        <Row className="module-head">
          <Col span={12}>
            <h3>维修项目</h3>
          </Col>
          <Col span={12}>
            <Dispatch
              itemIds={selectedItemIds}
              onSuccess={this.handleDispatch}
              disabled={!hasSelected}
            />
            <span className="padding-top-5 mr10 pull-right">
              {hasSelected ? `选择了 ${selectedItemIds.length} 个项目` : ''}
            </span>
          </Col>
        </Row>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={items}
          size="middle"
          bordered
          pagination={false}
          footer={this.renderFooter}
          rowKey={record => record.item_id}
          scroll={{ x: 1080 }}
        />
      </div>
    );
  }
}
