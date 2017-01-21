import React from 'react';
import {Row, Col, Table, Button} from 'antd';
import api from '../../../middleware/api';
import AddMaintainItemModal from '../../modals/aftersales/AddMaintainItemModal';
import ProjectDispatchModal from '../../modals/aftersales/ProjectDispatchModal';
import EditMaintainItemModal from '../../modals/aftersales/EditMaintainItemModal';

export default class PotentialTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedItemIds: [],
      maintain_items: new Map(),
      deleted_maintain_items: new Set(),
    };
    [
      'getMaintainItemList',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getMaintainItemList(this.props.intention_id, this.props.customer_id);
  }

  //shouldComponentUpdate(nextProps, nextState) {
  //    console.log('shouldComponentUpdate');
  //    console.log(nextState.maintain_items.size);
  //    console.log(this.state.maintain_items.size);
  //  return nextState.maintain_items.size != this.state.maintain_items.size;
  //}

  componentWillReceiveProps(nextProps) {
    this.setState({
      maintain_items: nextProps.maintain_items,
      deleted_maintain_items: nextProps.deleted_maintain_items,
    });

  }

  getMaintainItemList(intention_id = '', customer_id = '') {
    api.ajax({url: api.getItemListOfMaintProj(intention_id, customer_id)}, (data) => {

      let maintain_items = new Map();
      for (let i = 0; i < data.res.list.length; i++) {
        maintain_items.set(data.res.list[i].item_id, data.res.list[i]);
      }
      this.setState({maintain_items: maintain_items});
      this.props.onSuccess(maintain_items, this.state.deleted_maintain_items);
    });
  }

  getPreferentialAmount(record) {
    if (!record) {
      return;
    }
    switch (Number(record.type)) {
      case 1:
        if (Number(record.time_count) >= Number(record.coupon_time_count)) {
          return Number(record.coupon_time_count) * Number(record.time_fee_base);
        } else {
          return Number(record.time_count) * Number(record.time_fee_base);
        }
      case 2:
        if (Number(record.time_count) >= Number(record.coupon_time_count)) {
          return Number(record.time_fee_base * (1 - record.discount_rate) * record.coupon_time_count).toFixed(2);
        } else {
          return Number(record.time_fee_base * (1 - record.discount_rate) * record.time_count).toFixed(2);
        }
      case 3:
        return Number(record.discount_amount);
      default:
        return 0;
    }
  }

  editMaintainItem(maintain_item) {
    let {maintain_items, deleted_maintain_items} = this.state;
    maintain_items.set(maintain_item.item_id, maintain_item);
    this.setState({maintain_items: maintain_items});
    this.props.onSuccess(maintain_items, deleted_maintain_items);
  }

  addMaintainItem(maintain_item) {
    let {maintain_items, deleted_maintain_items} = this.state;
    maintain_items.set(maintain_item.item_id, maintain_item);
    this.setState({maintain_items: maintain_items});
    this.props.onSuccess(maintain_items, deleted_maintain_items);
  }

  removeMaintainItem(item_id, _id) {
    let {maintain_items, deleted_maintain_items} = this.state;

    maintain_items.delete(item_id);
    if (_id) {
      deleted_maintain_items.add(_id);
    }

    this.setState({maintain_items: maintain_items, deleted_maintain_items: deleted_maintain_items});
    this.props.onSuccess(maintain_items, deleted_maintain_items);
  }

  handleDispatch(keys, fitter_user_ids, fitter_user_names) {
    let {maintain_items, deleted_maintain_items} = this.state;
    for (let i = 0; i < keys.length; i++) {
      let maintain_item = maintain_items.get(keys[i]);
      maintain_item.fitter_user_ids = fitter_user_ids;
      maintain_item.fitter_user_names = fitter_user_names;
      maintain_items.set(keys[i], maintain_item);
    }

    this.setState({maintain_items: maintain_items});
    this.props.onSuccess(maintain_items, deleted_maintain_items);
  }

  onSelectChange(selectedRowKeys, selectedRows) {
    let item_ids = [];
    for (let i = 0; i < selectedRows.length; i++) {
      item_ids.push(selectedRows[i].item_id);
    }
    this.setState({selectedItemIds: item_ids, selectedRowKeys: selectedRowKeys});
  }

  footerCalculate(pageData) {
    let timeFee = 0;
    for (let i = 0; i < pageData.length; i++) {
      let tf = Number(pageData[i].time_fee);
      if (!isNaN(tf)) {
        timeFee += tf;
      }
    }
    return (<div><Row><Col span={6}>工时费合计(元):{Number(timeFee).toFixed(2)}</Col></Row></div>);
  }


  render() {
    let getPreferentialAmount = this.getPreferentialAmount;
    const columns = [
      {
        title: '产值类型',
        dataIndex: 'maintain_type_name',
        className: 'center',
        key: 'maintain_type_name',
      }, {
        title: '维修项目',
        dataIndex: 'item_name',
        className: 'center',
        key: 'item_name',
        render(value, record) {
          return (
            <div>
              {value}
              <Button
                type="primary"
                size="small"
                style={{display: record.customer_coupon_item_id > 0 ? '' : 'none', marginLeft: '10px'}}
              >
                会员
              </Button>
            </div>
          );
        },
      }, {
        title: '维修人员',
        dataIndex: 'fitter_user_names',
        className: 'center',
        key: 'fitter_user_names',

      }, {
        title: '工时单价',
        key: 'time_fee_base',
        dataIndex: 'time_fee_base',
        className: 'column-money',
        render: (time_fee_base) => (
          Number(time_fee_base).toFixed(2)
        ),
      }, {
        title: '工时数量',
        key: 'time_count',
        dataIndex: 'time_count',
        className: 'center',
      }, {
        title: '工时费(元)',
        key: 'time_fee',
        dataIndex: 'time_fee',
        className: 'column-money',
        render(value, record) {
          return (record.time_fee_base * record.time_count).toFixed(2);
        },
      }, {
        title: '优惠数量',
        key: 'coupon_time_count',
        dataIndex: 'coupon_time_count',
        className: 'center',
      }, {
        title: '优惠金额(元)',
        key: 'coupon_discount',
        dataIndex: 'coupon_discount',
        className: 'column-money',
        render(value, record) {
          if (record.hasOwnProperty('coupon_item_info')) {
            Number(getPreferentialAmount(record.coupon_item_info)).toFixed(2);
          } else {
            return Number(record.coupon_discount).toFixed(2);
          }
        },
      }, {
        title: '实收金额(元)',
        className: 'column-money',
        dataIndex: 'paid_amount',
        key: 'paid_amount',
        render(value, record) {

          // console.log('record', record);
          if (record.hasOwnProperty('type')) {
            return (Number(record.time_fee) - getPreferentialAmount(record)).toFixed(2);
          } else {
            return (Number(record.time_fee) - record.coupon_discount).toFixed(2);
          }
          // return (record.time_fee_base * record.time_count - ).toFixed(2);
        },
      }, {
        title: '操作',
        dataIndex: 'intention_info',
        key: 'operation',
        className: 'center',
        render: (value, record) => (
          <span>
            <EditMaintainItemModal
              maintain_item={record}
              onSuccess={this.editMaintainItem.bind(this)}
              memberDetailList={this.props.memberDetailList}
            />
            <Button
              type="primary"
              size="small"
              onClick={this.props.removeMaintainItem.bind(this, record.item_id, record._id)}
              style={{marginLeft: '20px'}}
              disabled={record.customer_coupon_item_id > 0}
            >
              删除
            </Button>
          </span>
        ),
      },
    ];

    const {selectedRowKeys, selectedItemIds} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
    };
    const hasSelected = selectedRowKeys.length > 0;

    let maintain_items = [];
    for (let value of this.props.maintain_items.values()) {
      maintain_items.push(value);
    }


    return (
      <div>
        <Row className="mb10 margin-top-20">
          <Col span={12}>
            <span className="pull-left">
            -维修项目
            </span>
          </Col>
          <Col span={12}>
            <span className="pull-right">
              <ProjectDispatchModal onSuccess={this.handleDispatch.bind(this)} disabled={!hasSelected}
                                    itemIds={selectedItemIds}/>
              <span style={{marginLeft: 8}}>{hasSelected ? `选择了 ${selectedRowKeys.length} 个项目` : ''}</span>
              <AddMaintainItemModal
                onSuccess={this.props.addMaintainItem.bind(this)}
                maintain_items={this.props.maintain_items}
              />
            </span>
          </Col>
        </Row>

        <Table
          rowSelection={rowSelection}
          bordered
          columns={columns}
          dataSource={maintain_items}
          pagination={false}
          footer={this.footerCalculate}
        />
      </div>
    );
  }
}
