import React from 'react';
import {Row, Col, Table} from 'antd';

import api from '../../../middleware/api';

import AddPart from './AddPart';
import EditPart from './EditPart';

export default class TablePart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maintain_parts: new Map(),
      deleted_maintain_parts: new Set(),
    };

    this.handlePartEdit = this.handlePartEdit.bind(this);
  }

  componentDidMount() {
    this.getMaintainParts(this.props.intention_id, this.props.customer_id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      maintain_parts: nextProps.partMap,
      deleted_maintain_parts: nextProps.deleted_maintain_parts,
    });
  }

  // handlePartEdit(maintain_part)
  handlePartEdit() {
    let {maintain_parts, deleted_maintain_parts} = this.state;
    this.setState({maintain_parts: maintain_parts});
    this.props.onSuccess(maintain_parts, deleted_maintain_parts);
  }

  getCouponAmount(record) {
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

  getMaintainParts(intentionId = '', customerId = '') {
    api.ajax({url: api.aftersales.getPartListOfMaintProj(intentionId, customerId)}, data => {
      let {list} = data.res;

      let partMap = new Map();
      list.map(part => partMap.set(`${part.part_type_id}-${part.part_id}`, part));

      let isTakeParts = list.every(part => parseInt(part.real_count) > 0);

      this.setState({maintain_parts: partMap});
      // TODO 初始化数据时，完工按钮是否禁用，优化后，获取数据放在父容器中
      this.props.onSuccess(partMap, this.state.deleted_maintain_parts, isTakeParts);
    });
  }

  renderFooter(parts) {
    let materialFee = 0;
    parts.map(part => {
      let partMaterialFee = Number(part.material_fee);
      if (!isNaN(partMaterialFee)) {
        materialFee = +partMaterialFee;
      }
    });
    return <Row><Col span={6}>材料费合计(元)：{Number(materialFee).toFixed(2)}</Col></Row>;
  }

  render() {
    let {partMap} = this.props;

    let parts = Array.from(partMap.values());

    let self = this;
    const columns = [
      {
        title: '产值类型',
        dataIndex: 'maintain_type_name',
        key: 'maintain_type_name',
        className: 'center',
      }, {
        title: '配件分类',
        dataIndex: 'part_type_name',
        key: 'part_type_name',
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
        title: '配件名称',
        dataIndex: 'part_name',
        key: 'part_name',
      }, {
        title: '规格/单位',
        dataIndex: 'part_spec_unit',
        key: 'part_spec_unit',
      }, {
        title: '配件单价',
        dataIndex: 'material_fee_base',
        key: 'material_fee_base',
        className: 'text-right',
      }, {
        title: '计费数量',
        dataIndex: 'count',
        key: 'count',
      }, {
        title: '领料数量',
        dataIndex: 'real_count',
        key: 'real_count',
      }, {
        title: '材料费(元)',
        dataIndex: 'material_fee',
        key: 'material_fee',
        className: 'text-right',
        render(value, record) {
          return (record.material_fee_base * record.count).toFixed(2);
        },
      }, {
        title: '优惠数量',
        dataIndex: 'coupon_part_count',
        key: 'coupon_part_count',
      }, {
        title: '优惠金额(元)',
        key: 'coupon_money',
        dataIndex: 'coupon_discount',
        className: 'text-right',
        render: (value, record) => {
          if (record.hasOwnProperty('coupon_item_info')) {
            self.getCouponAmount(record.coupon_item_info).toFixed(2);
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
            return (Number(record.material_fee) - self.getCouponAmount(record)).toFixed(2);
          } else {
            return (Number(record.material_fee) - record.coupon_discount).toFixed(2);
          }
        },
      }, {
        title: '操作',
        dataIndex: 'intention_info',
        key: 'operation',
        className: 'center width-120',
        render: (value, record) => (
          <span>
            <EditPart
              maintain_part={record}
              onSuccess={self.handlePartEdit}
              memberDetailList={self.props.memberDetailList}
            />

            {record.customer_coupon_item_id > 0 ?
              null :
              <span>
                <span className="ant-divider"/>
                <a
                  href="javascript:;"
                  onClick={self.props.removeMaintainPart.bind(self, record.part_type_id, record.part_id, record._id)}
                  disabled={record.customer_coupon_item_id > 0}
                  className="action-delete"
                >
                删除
              </a>
              </span>
            }
          </span>
        ),
      },
    ];

    return (
      <div className="with-bottom-divider">
        <Row className="module-head">
          <Col span={12}>
            <h3>维修配件</h3>
          </Col>
          <Col span={12}>
            <div className="pull-right">
              <AddPart
                size="default"
                onSuccess={this.props.addMaintainPart.bind(this)}
                maintain_parts={partMap}
              />
            </div>
          </Col>
        </Row>

        <Table
          bordered
          columns={columns}
          dataSource={parts}
          size="middle"
          pagination={false}
          footer={this.renderFooter}
          rowKey={(record, index) => record.part_id + index}
        />
      </div>
    );
  }
}
