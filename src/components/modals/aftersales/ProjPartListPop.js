import React, {Component} from 'react'
import {Popover, Button, Col, Row} from 'antd'
import api from '../../../middleware/api'

export default class ProjPartListPop extends Component {

  constructor(props) {
    super(props);
    this.state = {
      part_list: [],
    };
  }

  componentDidMount() {
    this.getPartList(this.props.projectId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.projectId) {
      this.getPartList(nextProps.projectId);
    }
  }

  getPartList(id) {
    api.ajax({url: api.getPartListOfMaintProj(id)},
      function (data) {
        this.setState({part_list: data.res.list})
      }.bind(this))
  }

  render() {
    const list = [], {part_list}=this.state;

    if (part_list.length != 0) {
      part_list.map(function (item) {
        list.push(<Row type="flex" key={item._id}>
          <Col span={4}>{item.part_id}</Col>
          <Col span={6}>{item.part_name}</Col>
          <Col span={3}>{item.count}</Col>
          <Col span={4}>{item.sell_price}</Col>
          <Col span={3}>{Number(item.material_fee) / Number(item.count)}</Col>
          <Col span={4}>{item.material_fee}</Col>
        </Row>)
      }.bind(this));
    } else {
      list.push(<p className="text-center c-grey" key="proj-part-list-000">暂无信息</p>);
    }

    const content = (
      <div>
        <Row type="flex">
          <Col span={4}>配件号</Col>
          <Col span={6}>配件名</Col>
          <Col span={3}>数量(个)</Col>
          <Col span={4}>参考零售价(元)</Col>
          <Col span={3}>零售价(元)</Col>
          <Col span={4}>金额小计(元)</Col>
        </Row>
        {list}
      </div>
    );

    return (
      <Popover content={content} title="维修配件" overlayStyle={{width:'700px'}}>
        <Button type="ghost" size="small">详情</Button>
      </Popover>
    )
  }
}

