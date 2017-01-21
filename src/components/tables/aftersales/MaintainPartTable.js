import React from 'react';
import {Row, Col, Table, Button} from 'antd';
import api from '../../../middleware/api';
import AddMaintainPartModal from '../../modals/aftersales/AddMaintainPartModal';
import EditMaintainPartModal from '../../modals/aftersales/EditMaintainPartModal';

export default class PotentialTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maintain_parts: new Map(),
      deleted_maintain_parts: new Set(),
    };
  }

  componentDidMount() {
    this.getMaintainPartList(this.props.intention_id, this.props.customer_id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      maintain_parts: nextProps.maintain_parts,
      deleted_maintain_parts: nextProps.deleted_maintain_parts,
    });
  }

  getMaintainPartList(intention_id = '', customer_id = '') {
    api.ajax({url: api.getPartListOfMaintProj(intention_id, customer_id)}, (data) => {

      let maintain_parts = new Map();
      for (let i = 0; i < data.res.list.length; i++) {
        maintain_parts.set(data.res.list[i].part_type_id, data.res.list[i]);
      }
      this.setState({maintain_parts: maintain_parts});
      this.props.onSuccess(maintain_parts, this.state.deleted_maintain_parts);
    });
  }


  getPreferentialAmount(record) {
    if (!record) {
      return;
    }
    switch (Number(record.type)) {
      case 1:
        if (Number(record.count) >= Number(record.coupon_part_count)) {
          return Number(record.coupon_part_count) * Number(record.material_fee_base);
        } else {
          return Number(record.count) * Number(record.material_fee_base);
        }
      case 2:
        if (Number(record.count) >= Number(record.coupon_part_count)) {
          return Number(record.coupon_part_count * (1 - record.discount_rate) * record.material_fee_base).toFixed(2);
        } else {
          return Number(record.count * (1 - record.discount_rate) * record.material_fee_base).toFixed(2);
        }
      case 3:
        return Number(record.discount_amount);
      default:
        return 0;
    }
  }

  editMaintainPart(maintain_part) {
    let {maintain_parts, deleted_maintain_parts} = this.state;

    maintain_parts.set(maintain_part.part_type_id, maintain_part);

    this.setState({maintain_parts: maintain_parts});
    this.props.onSuccess(maintain_parts, deleted_maintain_parts);
  }

  footerCalculate(pageData) {
    let material_fee = 0;
    for (let i = 0; i < pageData.length; i++) {
      let mf = Number(pageData[i].material_fee);
      if (!isNaN(mf)) {
        material_fee += mf;
      }
    }
    return (<Row><Col span={6}>材料费合计(元):{Number(material_fee).toFixed(2)}</Col></Row>);
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
        title: '配件分类',
        dataIndex: 'part_type_name',
        className: 'center',
        key: 'part_type_name',
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
        title: '配件名称',
        dataIndex: 'part_name',
        className: 'center',
        key: 'part_name',
      }, {
        title: '规格/单位',
        dataIndex: 'part_spec_unit',
        className: 'center',
        key: 'part_spec_unit',
      }, {
        title: '材料单价',
        dataIndex: 'material_fee_base',
        className: 'column-money',
        key: 'material_fee_base',
      }, {
        title: '计费数量',
        dataIndex: 'count',
        className: 'center',
        key: 'count',
      }, {
        title: '领料数量',
        dataIndex: 'real_count',
        className: 'center',
        key: 'real_count',
      }, {
        title: '材料费(元)',
        dataIndex: 'material_fee',
        className: 'column-money',
        render(value, record) {
          // console.log('材料费', record.material_fee_base);
          return (record.material_fee_base * record.count).toFixed(2);
        },
      }, {
        title: '优惠数量',
        dataIndex: 'coupon_part_count',
        className: 'center',
        key: 'coupon_part_count',
      }, {
        title: '优惠金额(元)',
        key: 'coupon_money',
        dataIndex: 'coupon_discount',
        className: 'column-money',
        render(value, record) {
          if (record.hasOwnProperty('coupon_item_info')) {
            getPreferentialAmount(record.coupon_item_info).toFixed(2);
          } else {
            return Number(record.coupon_discount).toFixed(2);
          }
        },
      }, {
        title: '实收金额(元)',
        key: 'paid_amount',
        dataIndex: 'paid_amount',
        className: 'column-money',
        render(value, record) {
          if (record.hasOwnProperty('type')) {
            return (Number(record.material_fee) - getPreferentialAmount(record)).toFixed(2);
          } else {
            return (Number(record.material_fee) - record.coupon_discount).toFixed(2);
          }
        },
      }, {
        title: '操作',
        dataIndex: 'intention_info',
        key: 'operation',
        className: 'center',
        render: (value, record) => (
          <span>
            <EditMaintainPartModal
              maintain_part={record}
              onSuccess={this.editMaintainPart.bind(this)}
              memberDetailList={this.props.memberDetailList}
            />
            <Button
              type="primary"
              size="small"
              onClick={this.props.removeMaintainPart.bind(this, record.part_type_id, record._id)}
              style={{marginLeft: '20px'}}
              disabled={record.customer_coupon_item_id > 0}
            >
              删除
            </Button>
          </span>
        ),
      },
    ];


    let maintain_parts = [];
    for (let value of this.props.maintain_parts.values()) {
      maintain_parts.push(value);
    }

    return (
      <div>
        <Row className="mb10 margin-top-20">
          <Col span={12}>
            <span className="pull-left">
            -维修配件
            </span>
          </Col>
          <Col span={12}>
            <span className="pull-right">
               <AddMaintainPartModal
                 onSuccess={this.props.addMaintainPart.bind(this)}
                 maintain_parts={this.props.maintain_parts}
               />
            </span>
          </Col>
        </Row>

        <Table
          bordered
          columns={columns}
          dataSource={maintain_parts}
          pagination={false}
          footer={this.footerCalculate}
        />
      </div>
    );
  }
}
