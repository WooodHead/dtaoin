import React from 'react';
import { Table, Modal } from 'antd';

import api from '../../../middleware/api';
import text from '../../../config/text';
import BaseModal from '../../../components/base/BaseModal';

require('../../marketing/componentsTableNest.css');

export default class TableMemberCard extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      customer: null,
      memberDetailList: [],
    };

    [
      'handleRemoveCoupon',
      'handleAddCoupon',
      'judgeCouponIsUse',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    const { customer } = nextProps;

    this.setState({ customer });

    if (customer._id && customer._id !== this.props.customer._id) {
      this.getMemberDetail(customer._id);
    }
  }

  handleRemoveCoupon(record) {
    const { itemMap, partMap } = this.props;
    this.props.onEditCouponUseState(record._id, 'delete');

    Array.from(itemMap.values()).map(item => {
      if (Number(item.customer_coupon_item_id) === Number(record._id)) {
        this.props.removeMaintainItem(item.item_id, item._id);
      }
    });

    for (const [key, value] of partMap.entries()) {
      if (Number(value.customer_coupon_item_id) === Number(record._id)) {
        this.props.removeMaintainPart(key, value._id);
      }
    }
  }

  judgeCouponIsUse(maintain_partsArr, maintain_itemsArr, recordId) {
    let CouponIsUse = false;
    maintain_partsArr.map(item => {
      if (Number(item.customer_coupon_item_id) === Number(recordId)) {
        CouponIsUse = true;
      }
    });

    maintain_itemsArr.map(item => {
      if (Number(item.customer_coupon_item_id) === Number(recordId)) {
        CouponIsUse = true;
      }
    });
    return CouponIsUse;
  }

  handleAddCoupon(record) {
    this.props.onEditCouponUseState(record._id, 'add');

    const { itemMap, partMap } = this.props;

    if (record.coupon_item_info.part_types && record.coupon_item_info.part_types.length > 0) {
      partMap.delete('add');
      record.coupon_item_info.part_types.map(item => {
        const itemKeyChanged = {
          _id: 0,
          coupon_id: record.coupon_item_info._id,
          customer_coupon_item_id: Number(record._id),
          coupon_part_count: item.amount || 0,
          coupon_discount: record.coupon_discount || 0,
          coupon_item_name: record.coupon_item_name || '',
          coupon_money: item.coupon_money || 0,
          count: 0,
          level_name: '现场报价',
          levels: item.levels,
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
          couponId: record._id,
          coupon_price: item.price,
        };
        partMap.set(partMap.size, itemKeyChanged);
      });

      this.props.onPartsUpdateSuccess(partMap);
    }

    if (record.coupon_item_info.items && record.coupon_item_info.items.length > 0) {
      itemMap.delete('add');
      record.coupon_item_info.items.map(item => {
        const itemKeyChanged = {
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
          levels: item.levels,
          maintain_type: item.maintain_type || '0',
          maintain_type_name: item.maintain_type_name || '',
          time_count: item.time_count || 1,
          time_fee: item.time_fee || 0,
          time_fee_base: item.time_fee_base || 0,
          discount_rate: record.coupon_item_info.discount_rate,
          discount_amount: record.coupon_item_info.discount_amount,
          type: record.coupon_item_info.type,
          couponId: record._id,
          coupon_price: item.price,
        };
        itemMap.set(itemKeyChanged.item_id, itemKeyChanged);
      });

      this.props.onItemsUpdateSuccess(itemMap);
    }
  }

  getMemberDetail(customerId) {
    api.ajax({
      url: api.statistics.getCustomerCouponCards(customerId, 1, 1),
    }, data => {
      this.setState({ memberDetailList: data.res.list });
      this.props.setMemberDetailList(data.res.list);
    });
  }

  getCouponRate(value) {
    let rate = String(Number(Number(value).toFixed(2)) * 100);
    if (rate.length === 1) {
      return `${(rate / 10) || '0'  }折`;
    }

    if (Number(rate.charAt(rate.length - 1)) === 0) {
      rate = rate.slice(0, rate.length - 1);
    }
    return `${rate || '0'  }折`;
  }

  render() {
    const { itemMap, partMap, couponUseStatus } = this.props;
    const { visible, memberDetailList } = this.state;

    if (memberDetailList) {
      memberDetailList.map(item => {
        item.name = item.coupon_item_info.name;
        item.remark = item.coupon_item_info.remark;
      });
    }

    const self = this;
    const expandedRowRender = record => {
      const columns = [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        }, {
          title: '类型',
          dataIndex: '_id',
          key: 'type',
          render: value => value.length > 4 ? '配件' : '项目',
        }, {
          title: '数量',
          dataIndex: 'amount',
          key: 'amount',
        }, {
          title: '售价(元)',
          dataIndex: 'price',
          key: 'price',
          className: String(record.coupon_item_info.type) === '1' ? '' : 'hide',
          render: value => Number(value || '0').toFixed(2),
        }, {
          title: '折扣',
          key: 'discount_rate',
          className: String(record.coupon_item_info.type) === '2' ? '' : 'hide',
          render: () => self.getCouponRate(record.coupon_item_info.discount_rate),
        }];

      const items = record.coupon_item_info.items || [];
      const partTypes = record.coupon_item_info.part_types || [];
      const data = items.concat(partTypes);

      return (
        <Table
          className="components-table-demo-nested"
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      );
    };

    const columns = [
      {
        title: '优惠券名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '优惠信息',
        dataIndex: 'coupon_item_info',
        key: 'coupon_item_info1',
        width: '77px',
        render: value => {
          if (String(value.type) === '1') {
            return `${value.price  }元`;
          } else {
            return self.getCouponRate(value.discount_rate);
          }
        },
      }, {
        title: '描述',
        dataIndex: 'remark',
        key: 'remark',
        maxWidth: '120px',
      }, {
        title: '有效期',
        dataIndex: 'coupon_item_info',
        key: 'coupon_item_info',
        render: value => {
          if (String(value.valid_type) === '0') {
            // 时间段
            return `${value.valid_start_date}至${value.valid_expire_date}`;
          } else if (String(value.valid_type) === '1') {
            // 具体天数
            return `领取后当天生效${value.valid_day}天有效`;
          }
        },
      }, {
        title: '优惠券类型',
        dataIndex: 'coupon_item_info.type',
        key: 'type',
        width: '92px',
        render: value => text.couponType[value],
      }, {
        title: '总数',
        dataIndex: 'total',
        key: 'total',
        width: '60px',
        render: total => {
          if (Number(total) > 0) {
            return total;
          } else if (Number(total) === 0) {
            return '不限';
          } else {
            return '';
          }
        },
      }, {
        title: '剩余数量',
        dataIndex: 'amount',
        key: 'amount',
        width: '80px',
        render: (amount, record) => {
          if (Number(record.total) > 0) {
            return Number(amount - (couponUseStatus[record._id] ? 1 : 0)).toFixed(0);
          } else if (Number(record.total) === 0) {
            return '不限';
          } else {
            return '异常情况';
          }
        },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        width: '70px',
        render: (id, record) => {
          const partArr = Array.from(partMap.values());
          const itemArr = Array.from(itemMap.values());

          const isCouponUse = self.judgeCouponIsUse(partArr, itemArr, id);

          if (couponUseStatus[id] || isCouponUse) {
            return (
              <a
                href="javascript:;"
                onClick={self.handleRemoveCoupon.bind(self, record)}
                className="action-delete"
              >
                移除
              </a>
            );
          } else {
            if (Number(record.total) === 0 || Number(record.amount) > 0) {
              return <a href="javascript:;"
                        onClick={self.handleAddCoupon.bind(self, record)}>添加</a>;
            } else if (Number(record.amount) === 0) {
              return '添加';
            } else {
              return '';
            }
          }
        },
      }];

    return (
      <div>
        <div style={{ position: 'relative', left: '100px', top: '40px', zIndex: 99, width: '300px' }}>
          <span style={{ color: '#ff8400' }} className="mr10">
            {`${memberDetailList.length  }种优惠券可使用`}
          </span>
          <a href="javascript:;" onClick={this.showModal}>去使用 ></a>
        </div>
        <Modal
          title="添加优惠券"
          visible={visible}
          width={960}
          onCancel={this.hideModal}
          footer={null}
        >
          <Table
            className="components-table-demo-nested"
            columns={columns}
            dataSource={memberDetailList}
            expandedRowRender={expandedRowRender}
            pagination={false}
            rowKey={record => record._id}
          />
        </Modal>
      </div>
    );
  }
}

