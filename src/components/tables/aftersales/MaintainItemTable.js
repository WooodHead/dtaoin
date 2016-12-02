import React from 'react'
import {Link} from 'react-router'
import {Button, Row, Col, Table} from 'antd'
import api from '../../../middleware/api'
import AddMaintainItemModal from '../../modals/aftersales/AddMaintainItemModal'
import ProjectDispatchModal from '../../modals/aftersales/ProjectDispatchModal'
import EditMaintainItemModal from '../../modals/aftersales/EditMaintainItemModal'

export default class PotentialTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedItemIds: [],
      maintain_items: new Map(),
      deleted_maintain_items: new Set(),
    };
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

  getMaintainItemList(intention_id, customer_id) {
    api.ajax({url: api.getItemListOfMaintProj(intention_id, customer_id)}, (data) => {

      let maintain_items = new Map();
      for(let i = 0; i < data.res.list.length; i++){
          maintain_items.set(data.res.list[i].item_id, data.res.list[i]);
      }
      this.setState({maintain_items: maintain_items});
      this.props.onSuccess(maintain_items, this.state.deleted_maintain_items);
    })
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

    for(let i=0; i < keys.length; i++) {
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
    for(let i=0; i < selectedRows.length; i++) {
        item_ids.push(selectedRows[i].item_id);
    }
    this.setState({ selectedItemIds: item_ids , selectedRowKeys: selectedRowKeys});
  }

  footerCalculate(pageData) {
      let timeFee = 0;
      for (let i = 0; i < pageData.length; i++) {
        let tf = Number(pageData[i].time_fee);
        if (!isNaN(tf)) {
          timeFee += tf;
        }
      }
      return (<div><Row><Col span="6">工时费合计(元):{Number(timeFee).toFixed(2)}</Col></Row></div>)
  }


  render() {
    const columns = [
      {
        title: '产值类型',
        dataIndex: 'maintain_type_name',
        className: 'center',
        key: 'maintain_type_name'
      }, {
        title: '维修项目',
        dataIndex: 'item_name',
        className: 'center',
        key: 'item_name'
      }, {
        title: '维修人员',
        dataIndex: 'fitter_user_names',
        className: 'center',
        key: 'fitter_user_names'
      }, {
        title: '工时单价',
        key: 'time_fee_base',
        dataIndex: 'time_fee_base',
        className: 'column-money',
        render: (time_fee_base) => (
          Number(time_fee_base).toFixed(2)
        )
      }, {
        title: '工时数量',
        key: 'time_count',
        dataIndex: 'time_count',
        className: 'column-money',
      }, {
        title: '工时费(元)',
        key: 'time_fee',
        dataIndex: 'time_fee',
        className: 'column-money',
        render: (time_fee) => (
          Number(time_fee).toFixed(2)
        )
      }, {
        title: '操作',
        dataIndex: 'intention_info',
        key: 'operation',
        className: 'center',
        render: (value, record) =>(
          <span>
            <EditMaintainItemModal maintain_item={record} onSuccess={this.editMaintainItem.bind(this)} />
            <a href="javascript:;" onClick={this.removeMaintainItem.bind(this, record.item_id, record._id)} >删除</a>
          </span>
        )
      }
    ];

    const {selectedRowKeys, selectedItemIds} = this.state;
    const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange.bind(this),
    };
    const hasSelected = selectedRowKeys.length > 0;

    let maintain_items = [];
    for ( let value of this.state.maintain_items.values() ) {
        maintain_items.push(value);
    }

    return (
      <div>
        <Row className="mb10 margin-top-20">
          <Col span="12">
            <span className="pull-left">
            -维修项目
            </span>
          </Col>
          <Col span="12">
            <span className="pull-right">
              <ProjectDispatchModal onSuccess={this.handleDispatch.bind(this)} disabled={!hasSelected} itemIds={selectedItemIds}/>
              <span style={{ marginLeft: 8 }}>{hasSelected ? `选择了 ${selectedRowKeys.length} 个项目` : ''}</span>
              <AddMaintainItemModal onSuccess={this.addMaintainItem.bind(this)}/>
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
    )
  }
}
