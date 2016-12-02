import React from 'react'
import {Link} from 'react-router'
import {Button, Row, Col, Table} from 'antd'
import api from '../../../middleware/api'
import AddMaintainPartModal from '../../modals/aftersales/AddMaintainPartModal'
import EditMaintainPartModal from '../../modals/aftersales/EditMaintainPartModal'

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

  //shouldComponentUpdate(nextProps, nextState) {
  //    console.log('shouldComponentUpdate');
  //  return false;
  //}

  getMaintainPartList(intention_id, customer_id) {
    api.ajax({url: api.getPartListOfMaintProj(intention_id, customer_id)}, (data) => {

      let maintain_parts = new Map();
      for(let i =0; i < data.res.list.length; i++){
          maintain_parts.set(data.res.list[i].part_type_id, data.res.list[i]);
      }
      this.setState({maintain_parts: maintain_parts});
      this.props.onSuccess(maintain_parts, this.state.deleted_maintain_parts);
    })
  }

  editMaintainPart(maintain_part) {
    let {maintain_parts, deleted_maintain_parts} = this.state;

    maintain_parts.set(maintain_part.part_type_id, maintain_part);

    this.setState({maintain_parts: maintain_parts});
    this.props.onSuccess(maintain_parts, deleted_maintain_parts);
  }

  addMaintainPart(maintain_part) {
    let {maintain_parts, deleted_maintain_parts} = this.state;

    maintain_parts.set(maintain_part.part_type_id, maintain_part);

    this.setState({maintain_parts: maintain_parts});
    this.props.onSuccess(maintain_parts, deleted_maintain_parts);
  }

  removeMaintainPart(part_type_id, _id) {
    let {maintain_parts, deleted_maintain_parts} = this.state;

    maintain_parts.delete(part_type_id);
    if (_id) {
        deleted_maintain_parts.add(_id);
    }

    this.setState({maintain_parts: maintain_parts, deleted_maintain_parts: deleted_maintain_parts});
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
      return (<div><Row><Col span="6">材料费合计(元):{Number(material_fee).toFixed(2)}</Col></Row></div>)
  }


  render() {
    const columns = [
      {
        title: '产值类型',
        dataIndex: 'maintain_type_name',
        className: 'center',
        key: 'maintain_type_name'
      }, {
        title: '配件分类',
        dataIndex: 'part_type_name',
        className: 'center',
        key: 'part_type_name'
      }, {
        title: '配件名称',
        dataIndex: 'part_name',
        className: 'center',
        key: 'part_name'
      }, {
        title: '规格/单位',
        dataIndex: 'part_spec_unit',
        className: 'center',
        key: 'part_spec_unit',
        render: (value, record) => (
          record.part_spec + '' + record.part_unit
        )
      }, {
        title: '使用数量',
        dataIndex: 'count',
        className: 'center',
        key: 'name'
      }, {
        title: '领料数量',
        dataIndex: 'real_count',
        className: 'center',
        key: 'real_count'
      }, {
        title: '材料费(元)',
        dataIndex: 'material_fee',
        className: 'column-money',
        key: 'material_fee',
        render: (material_fee, record) => (
          Number(record.material_fee_base * record.count).toFixed(2)
        )
      }, {
        title: '操作',
        dataIndex: 'intention_info',
        key: 'operation',
        className: 'center',
        render: (value, record) =>(
          <span>
            <EditMaintainPartModal maintain_part={record} onSuccess={this.editMaintainPart.bind(this)} />
            <a href="javascript:;" onClick={this.removeMaintainPart.bind(this, record.part_type_id, record._id)} >删除</a>
          </span>
        )
      }
    ];

    const rowSelection = {
        getCheckboxProps: record => ({
            //disabled: record.name === '',    // 配置无法勾选的列
        }),
    };

    let maintain_parts = [];
    for ( let value of this.state.maintain_parts.values() ) {
        maintain_parts.push(value);
    }

    return (
      <div>
        <Row className="mb10 margin-top-20">
          <Col span="12">
            <span className="pull-left">
            -维修配件
            </span>
          </Col>
          <Col span="12">
            <span className="pull-right">
               <AddMaintainPartModal onSuccess={this.addMaintainPart.bind(this)}/>
            </span>
          </Col>
        </Row>

        <Table
          rowSelection={rowSelection}
          bordered
          columns={columns}
          dataSource={maintain_parts}
          pagination={false}
          footer={this.footerCalculate}
        />
      </div>
    )
  }
}
