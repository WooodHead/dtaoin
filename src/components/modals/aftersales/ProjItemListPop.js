import React, {Component} from 'react'
import {Popover, Button, Col, Row} from 'antd'
import api from '../../../middleware/api'

export default class ProgramListPop extends Component {

  constructor(props) {
    super(props);
    this.state = {
      program_list: []
    };
  }

  componentDidMount() {
    this.getItemList(this.props.projectId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.projectId) {
      this.getItemList(nextProps.projectId);
    }
  }

  getItemList(id) {
    api.ajax({url: api.getItemListOfMaintProj(id)}, function (data) {
      this.setState({program_list: data.res.list})
    }.bind(this))
  }

  render() {
    const list = [], {program_list}=this.state;
    if (program_list.length != 0) {
      program_list.map(function (item) {
        list.push(
          <Row type="flex" key={item._id}>
            <Col span="10">{item.item_name}</Col>
            <Col span="6">{item.time_fee}</Col>
            <Col span="8">{item.fitter_user_names}</Col>
          </Row>)
      }.bind(this));
    } else {
      list.push(<p className="text-center c-grey" key="proj-item-list-000">暂无信息</p>);
    }

    const content = (
      <div>
        <Row type="flex">
          <Col span="10">维修项目</Col>
          <Col span="6">工时费(元)</Col>
          <Col span="8">维修人员</Col>
        </Row>
        {list}
      </div>
    );

    return (
      <Popover content={content} title="维修项目" overlayStyle={{width:"400px"}}>
        <Button type="ghost" size="small">详情</Button>
      </Popover>
    )
  }
}

