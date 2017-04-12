import React from 'react';
import {Row, Col, Table} from 'antd';

import api from '../../../middleware/api';

import AddItem from './AddItem';
import EditItem from './EditItem';
import Dispatch from './Dispatch';

export default class TableItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItemIds: [],
      maintain_items: props.itemMap || new Map(),
      deleted_maintain_items: new Set(),
    };

    [
      'handleDispatch',
      'handleRowSelect',
      'handleItemEdit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getMaintainItems(this.props.intention_id, this.props.customer_id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      maintain_items: nextProps.itemMap,
      deleted_maintain_items: nextProps.deleted_maintain_items,
    });
  }

  handleDispatch(itemIds, fitterUserIds, fitterUserNames) {
    let {maintain_items, deleted_maintain_items} = this.state;

    itemIds.forEach(itemId => {
      let item = maintain_items.get(itemId);
      item.fitter_user_ids = fitterUserIds;
      item.fitter_user_names = fitterUserNames;
      maintain_items.set(itemId, item);
    });

    this.setState({maintain_items});
    this.props.onSuccess(maintain_items, deleted_maintain_items);
  }

  handleRowSelect(selectedRowKeys, selectedRows) {
    let ids = [];
    selectedRows.forEach(row => ids.push(row._id));
    this.setState({selectedItemIds: ids});
  }

  handleItemEdit(maintain_item) {
    let {maintain_items, deleted_maintain_items} = this.state;
    maintain_items.set(maintain_item.item_id, maintain_item);
    this.setState({maintain_items: maintain_items});
    this.props.onSuccess(maintain_items, deleted_maintain_items);
  }

  getCouponAmount(item) {
    if (!item) {
      return;
    }

    let {
      type,
      time_count,
      coupon_time_count,
      time_fee_base,
      discount_rate,
      discount_amount,
    } = item;

    switch (Number(type)) {
      case 1:
        if (Number(time_count) >= Number(coupon_time_count)) {
          return Number(coupon_time_count) * Number(time_fee_base);
        } else {
          return Number(time_count) * Number(time_fee_base);
        }
      case 2:
        if (Number(time_count) >= Number(coupon_time_count)) {
          return Number(time_fee_base * (1 - discount_rate) * coupon_time_count).toFixed(2);
        } else {
          return Number(time_fee_base * (1 - discount_rate) * time_count).toFixed(2);
        }
      case 3:
        return Number(discount_amount);
      default:
        return 0;
    }
  }

  getMaintainItems(intention_id = '', customer_id = '') {
    api.ajax({url: api.aftersales.getItemListOfMaintProj(intention_id, customer_id)}, data => {
      let {list} = data.res;

      let itemMap = new Map();
      list.map(item => itemMap.set(item._id, item));

      let isDispatched = list.every(item => item.fitter_user_ids.length > 0);

      this.setState({maintain_items: itemMap});
      // TODO 添加第三个临时参数，保存初始化时，工单的状态：如是否已派工或已领料
      this.props.onSuccess(itemMap, this.state.deleted_maintain_items, isDispatched);
    });
  }

  renderFooter(items) {
    let timeFee = 0;
    items.forEach(item => {
      let itemTimeFee = Number(item.time_fee);
      if (!isNaN(itemTimeFee)) {
        timeFee += itemTimeFee;
      }
    });

    return <Row><Col span={6}>工时费合计(元)：{Number(timeFee).toFixed(2)}</Col></Row>;
  }

  render() {
    let {itemMap} = this.props;
    let {selectedItemIds} = this.state;

    let items = Array.from(itemMap.values());

    let self = this;
    const columns = [
      {
        title: '产值类型',
        dataIndex: 'maintain_type_name',
        key: 'maintain_type_name',
        className: 'center',
      }, {
        title: '维修项目',
        dataIndex: 'item_name',
        key: 'item_name',
        render: (value, record) => {
          return (
            <div>
              {value}
              {record.customer_coupon_item_id > 0 ?
                <span className="tag ml5">会员</span> : null}
            </div>
          );
        },
      }, {
        title: '维修人员',
        dataIndex: 'fitter_user_names',
        key: 'fitter_user_names',
      }, {
        title: '质检人',
        dataIndex: 'quality_check_user_names',
        key: 'quality_check_user_names',
      }, {
        title: '工时单价',
        dataIndex: 'time_fee_base',
        key: 'time_fee_base',
        className: 'text-right',
        render: (time_fee_base) => Number(time_fee_base).toFixed(2),
      }, {
        title: '工时数量',
        dataIndex: 'time_count',
        key: 'time_count',
      }, {
        title: '工时费(元)',
        dataIndex: 'time_fee',
        key: 'time_fee',
        className: 'text-right',
        render: (value, record) => (record.time_fee_base * record.time_count).toFixed(2),
      }, {
        title: '优惠数量',
        dataIndex: 'coupon_time_count',
        key: 'coupon_time_count',
      }, {
        title: '优惠金额(元)',
        dataIndex: 'coupon_discount',
        key: 'coupon_discount',
        className: 'text-right',
        render: (value, record) => {
          if (record.hasOwnProperty('coupon_item_info')) {
            Number(self.getCouponAmount(record.coupon_item_info)).toFixed(2);
          } else {
            return Number(record.coupon_discount).toFixed(2);
          }
        },
      }, {
        title: '实收金额(元)',
        dataIndex: 'paid_amount',
        key: 'paid_amount',
        className: 'text-right',
        render: (value, record) => {
          if (record.hasOwnProperty('type')) {
            return (Number(record.time_fee) - self.getCouponAmount(record)).toFixed(2);
          } else {
            return (Number(record.time_fee) - record.coupon_discount).toFixed(2);
          }
        },
      }, {
        title: '操作',
        dataIndex: 'intention_info',
        key: 'operation',
        className: 'center width-120',
        render: (value, record) => (
          <div>
            <EditItem
              maintain_item={record}
              onSuccess={self.handleItemEdit}
              memberDetailList={self.props.memberDetailList}
            />

            {record.customer_coupon_item_id > 0 ?
              null :
              <span>
                <span className="ant-divider"/>
                <a
                  href="javascript:;"
                  onClick={self.props.removeMaintainItem.bind(self, record.item_id, record._id)}
                  className="action-delete"
                >
                删除
              </a>
              </span>
            }
          </div>
        ),
      },
    ];

    const rowSelection = {
      onChange: this.handleRowSelect,
    };
    const hasSelected = selectedItemIds.length > 0;

    return (
      <div className="with-bottom-divider">
        <Row className="module-head">
          <Col span={12}>
            <h3>维修项目</h3>
          </Col>
          <Col span={12}>
            <div className="pull-right">
              <Dispatch
                itemIds={selectedItemIds}
                onSuccess={this.handleDispatch}
                disabled={!hasSelected}
              />

              <span className="ml10 mr10">
                {hasSelected ? `选择了 ${selectedItemIds.length} 个项目` : ''}
              </span>

              <AddItem
                itemMap={itemMap}
                onSuccess={this.props.addMaintainItem.bind(this)}
              />
            </div>
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
          rowKey={(record) => record.item_id}
        />
      </div>
    );
  }
}
