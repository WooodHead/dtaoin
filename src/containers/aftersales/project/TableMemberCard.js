import React, {Component} from 'react';
import className from 'classnames';
import {Table, Icon} from 'antd';

import api from '../../../middleware/api';
import text from '../../../config/text';

export default class TableMemberCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      customer: null,
      memberDetailList: null,
      couponUseStatus: {},
      couponItem: [],
      couponPartType: [],
    };

    [
      'handleShowTable',
      'handleRemoveCoupon',
      'handleAddCoupon',
      'judgeCouponIsUse',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    let {customer, itemMap, partMap} = nextProps;

    this.setState({
      customer,
      couponItem: Array.from(itemMap.values()),
      couponPartType: Array.from(partMap.values()),
    });

    if (customer._id && customer._id !== this.props.customer._id) {
      this.getMemberDetail(customer._id);
    }
  }

  handleShowTable() {
    this.setState({visible: !this.state.visible});
  }

  handleRemoveCoupon(record) {
    let couponUseStatus = this.state.couponUseStatus;

    delete couponUseStatus[record._id];
    let couponItem = this.state.couponItem;
    let couponPartType = this.state.couponPartType;
    let couponItemFilteredRemoved = couponItem.filter((item) => {
      return item.customer_coupon_item_id == record._id;
    });
    let couponItemFiltered = couponItem.filter((item) => {
      return item.customer_coupon_item_id !== record._id;
    });


    let couponPartsFilteredRemoved = couponPartType.filter((item) => {
      return item.customer_coupon_item_id == record._id;
    });
    let couponPartsFiltered = couponPartType.filter((item) => {
      return item.customer_coupon_item_id !== record._id;
    });

    this.setState({
      couponUseStatus,
      couponItem: couponItemFiltered,
      couponPartType: couponPartsFiltered,
    }, () => {
      this.props.getCouponItemRemoved(couponItemFilteredRemoved);
      this.props.getCouponPartsRemoved(couponPartsFilteredRemoved);
    });
  }

  judgeCouponIsUse(maintain_partsArr, maintain_itemsArr, recordId) {

    let CouponIsUse = false;
    maintain_partsArr.map((item) => {
      if (item.customer_coupon_item_id == recordId) {
        CouponIsUse = true;
      }
    });

    maintain_itemsArr.map((item) => {
      if (item.customer_coupon_item_id == recordId) {
        CouponIsUse = true;
      }
    });
    return CouponIsUse;
  }

  handleAddCoupon(record) {
    let couponUseStatus = this.state.couponUseStatus;
    couponUseStatus[record._id] = true;
    this.setState({
      couponUseStatus,
    });

    let couponPartType = this.state.couponPartType;
    if (record.coupon_item_info.part_types) {
      record.coupon_item_info.part_types.map((item) => {
        let itemKeyChanged = {
          _id: 0,
          coupon_id: record.coupon_item_info._id,
          customer_coupon_item_id: Number(record._id),
          coupon_part_count: item.amount || 0,
          coupon_discount: record.coupon_discount || 0,
          coupon_item_name: record.coupon_item_name || '',
          coupon_money: item.coupon_money || 0,
          count: 0,
          level_name: '现场报价',
          maintain_type: item.maintain_type || '',
          mainitain_type_name: '',
          material_fee: item.material_fee || 0,
          material_fee_base: 0.00,
          part_id: '',
          part_name: '',
          part_spec: item.part_spec || '',
          part_type_id: item._id || '',
          part_type_name: item.name || '',
          part_unit: item.part_unit || 0.00,
          real_count: item.real_count || 0.00,
          discount_rate: record.coupon_item_info.discount_rate,
          remain_count: item.amount,
          scope: record.scope,
          type: record.coupon_item_info.type,
        };
        couponPartType.push(itemKeyChanged);
      });

      this.setState({
        couponPartType,
      }, () => {
        this.props.getCouponPartType(this.state.couponPartType);
      });
    }

    let couponItem = this.state.couponItem;
    if (record.coupon_item_info.items) {
      record.coupon_item_info.items.map((item) => {
        let itemKeyChanged = {
          _id: 0,
          coupon_id: record.coupon_item_info._id,
          customer_coupon_item_id: Number(record._id),
          coupon_discount: record.coupon_discount || 0,
          coupon_item_name: record.coupon_item_name || '',
          coupon_time_count: item.amount || 0,
          fitter_user_ids: item.customer_id || '',
          fitter_user_names: item.customer_name || '',
          item_id: item._id,
          item_name: item.name || '',
          level_name: '现场报价',
          maintain_type: item.maintain_type || '0',
          maintain_type_name: item.maintain_type_name || '',
          time_count: item.time_count || 1,
          time_fee: item.time_fee || 0,
          time_fee_base: item.time_fee_base || 0,
          discount_rate: record.coupon_item_info.discount_rate,
          discount_amount: record.coupon_item_info.discount_amount,
          type: record.coupon_item_info.type,
        };
        couponItem.push(itemKeyChanged);
      });
      this.setState({
        couponItem,
      }, () => {
        this.props.getCouponItem(this.state.couponItem);
      });
    }
  }

  getMemberDetail(customerId) {
    api.ajax({
      url: api.statistics.getMemberDetail(customerId, 1, 0),
    }, data => {
      this.setState({
        memberDetailList: data.res.list || {},
      }, () => {
        let {memberDetailList} = this.state;
        this.props.setMemberDetailList(memberDetailList);
        if (memberDetailList.length > 0) {
          this.setState({visible: true});
        }
      });
    });
  }

  render() {
    let {itemMap, partMap} = this.props;
    let {visible, couponUseStatus, memberDetailList} = this.state;

    if (memberDetailList) {
      memberDetailList.map((item) => {
        item.name = item.coupon_item_info.name;
        item.remark = item.coupon_item_info.remark;
      });
    }

    const tableContainer = className({
      hide: !visible,
    });

    let self = this;
    const columns = [
      {
        title: '序号',
        key: 'index',
        render: (value, record, index) => index + 1,
      }, {
        title: '优惠名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '优惠类型',
        dataIndex: 'coupon_item_info.type',
        key: 'type',
        render: (value) => text.couponType[value],
      }, {
        title: '描述',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '剩余数量',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount, record) => {
          if (Number(record.total) > 0) {
            return Number(amount - (couponUseStatus[record._id] ? 1 : 0)).toFixed(2);
          } else if (Number(record.total) === 0) {
            return '不限次数';
          } else {
            return '异常情况';
          }
        },
      }, {
        title: '总数',
        dataIndex: 'total',
        key: 'total',
        render: (total) => {
          if (Number(total) > 0) {
            return total;
          } else if (Number(total) === 0) {
            return '不限次数';
          } else {
            return '';
          }
        },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center width-120',
        render: (id, record) => {
          let partArr = Array.from(partMap.values());
          let itemArr = Array.from(itemMap.values());

          let isCouponUse = self.judgeCouponIsUse(partArr, itemArr, id);
          if (couponUseStatus[id] || isCouponUse) {
            return (
              <a
                href="javascript:;"
                onClick={self.handleRemoveCoupon.bind(self, record)}
                className="action-delete"
              >
                移除项目
              </a>
            );
          } else {
            if (Number(record.total) === 0 || Number(record.amount) > 0) {
              return <a href="javascript:;" onClick={self.handleAddCoupon.bind(self, record)}>添加</a>;
            } else if (Number(record.amount) === 0) {
              return '添加';
            } else {
              return '';
            }
          }
        },
      }];

    return (
      <div className="with-bottom-divider">
        <div className="module-head">
          <h3>
            <span>优惠信息</span>
            <Icon
              type={visible ? 'down-circle-o' : 'right-circle-o'}
              className="ml10 btn-arrow"
              onClick={this.handleShowTable}
            />
          </h3>
        </div>

        <div className={tableContainer}>
          <Table
            columns={columns}
            dataSource={memberDetailList}
            size="middle"
            bordered
            pagination={false}
            rowKey={record => record._id}
          />
        </div>
      </div>
    );
  }
}
