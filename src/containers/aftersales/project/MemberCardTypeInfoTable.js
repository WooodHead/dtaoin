import React, {Component} from 'react';
import {Table, Collapse} from 'antd';
import api from '../../../middleware/api';
import {Link} from 'react-router';
import text from '../../../config/text';

const Panel = Collapse.Panel;

export default class MemberCardTypeInfoTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseActive: '0',
      customer: null,
      memberDetailList: null,
      couponUseStatus: {},
      couponItem: [],
      couponPartType: [],
    };
    [
      'handleRemoveCoupon',
      'handleAddCoupon',
      'judgeCouponIsUse',
      'handleChangePanel',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.maintain_items) {
      let maintain_itemsArr = [];
      for (let value of nextProps.maintain_items.values()) {
        maintain_itemsArr.push(value);
      }
      this.setState({
        couponItem: maintain_itemsArr,
      });
    }

    if (nextProps.maintain_parts) {
      let maintain_partsArr = [];
      for (let value of nextProps.maintain_parts.values()) {
        maintain_partsArr.push(value);
      }
      this.setState({
        couponPartType: maintain_partsArr,
      });
    }

    if (nextProps.customer._id) {
      if (nextProps.customer._id !== this.props.customer._id) {
        api.ajax({
          url: api.statistics.getMemberDetail(nextProps.customer._id, 1, 0),
        }, (data) => {
          // console.log('---------优惠信息', data.res.list);
          this.setState({
            memberDetailList: data.res.list || {},
          }, () => {
            this.props.setMemberDetailList(this.state.memberDetailList);
            if (this.state.memberDetailList.length > 0) {
              this.setState({
                collapseActive: '1',
              });
            }
          });
        });
      }
    }
    this.setState({
      customer: nextProps.customer,
    });
  }

  handleChangePanel(value) {
    this.setState({
      collapseActive: value,
    });
  }


  handleRemoveCoupon(record) {
    // handleRemoveCoupon(record, index) {
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
      this.props.getcouponItemRemoved(couponItemFilteredRemoved);
      this.props.getcouponPartsRemoved(couponPartsFilteredRemoved);
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

    // console.log('record', record);
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
          // level_name: JSON.parse(item.levels).name || '现场报价',
          level_name: '现场报价',
          maintain_type: item.maintain_type || '',
          mainitain_type_name: '',
          material_fee: item.material_fee || 0,
          // material_fee_base: JSON.parse(item.levels).prize || 0.00,
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
        this.props.getcouponPartType(this.state.couponPartType);
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
          // level_name: JSON.parse(item.levels).name || '现场报价',
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

        this.props.getcouponItem(this.state.couponItem);
      });
    }
  }

  render() {
    let memberDetailList = this.state.memberDetailList;
    let judgeCouponIsUse = this.judgeCouponIsUse;
    let {maintain_items, maintain_parts} = this.props;
    if (memberDetailList) {
      memberDetailList.map((item) => {
        item.name = item.coupon_item_info.name;
        item.remark = item.coupon_item_info.remark;
      });
    }
    let couponUseStatus = this.state.couponUseStatus;
    let handleRemoveCoupon = this.handleRemoveCoupon;
    let handleAddCoupon = this.handleAddCoupon;

    const columns = [{
      title: '序号',
      width: '10%',
      key: 'index',
      render(value, record, index){
        return index + 1;
      },
    }, {
      title: '优惠名称',
      width: '20%',
      dataIndex: 'name',
      key: 'name',
      render(value) {
        return (
          <div>
            {value}
          </div>
        );
      },
    }, {
      title: '优惠类型',
      width: '10%',
      render(value, record) {
        return text.couponType[record.coupon_item_info.type];
      },
    }, {
      title: '描述',
      width: '30%',
      dataIndex: 'remark',
      key: 'remark',
    }, {
      title: '剩余数量',
      dataIndex: 'amount',
      width: '8%',
      key: 'amount',
      render(value, record) {
        if (Number(record.total) > 0) {
          return record.amount - (couponUseStatus[record._id] ? 1 : 0);
        } else if (Number(record.total) === 0) {
          return '不限次数';
        } else {
          return '异常情况';
        }
      },
    }, {
      title: '总数',
      dataIndex: 'total',
      width: '7%',
      key: 'total',
      render(value, record) {
        if (Number(record.total) > 0) {
          return record.total;
        } else if (Number(record.total) === 0) {
          return '不限次数';
        } else {
          return '';
        }
      },
    }, {
      title: '操作',
      width: '15%',
      key: 'handle',
      render(value, record) {
        let maintain_partsArr = [];
        for (let value of maintain_parts.values()) {
          maintain_partsArr.push(value);
        }
        let maintain_itemsArr = [];
        for (let value of maintain_items.values()) {
          maintain_itemsArr.push(value);
        }
        let CouponIsuse = judgeCouponIsUse(maintain_partsArr, maintain_itemsArr, record._id);
        if (couponUseStatus[record._id] || CouponIsuse) {
          return <Link onClick={() => handleRemoveCoupon(record)}>移除本次</Link>;
        } else {
          if (Number(record.total) === 0 || Number(record.amount) > 0) {
            return <Link onClick={() => handleAddCoupon(record)}>添加</Link>;
          } else if (Number(record.amount) === 0) {
            return '添加';
          } else {
            return '';
          }
        }
      },
    }];
    return (
      <Collapse className="margin-top-20" activeKey={this.state.collapseActive} onChange={this.handleChangePanel}>
        <Panel header="优惠信息" key="1">
          <Table
            bordered
            columns={columns}
            dataSource={memberDetailList}
            pagination={false}
            scroll={{y: 300}}/>
        </Panel>
      </Collapse>

    );
  }
}

