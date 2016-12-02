import React, {Component} from 'react'
import {Modal, Button, Row, Col, Table} from 'antd';
import text from '../../../middleware/text'
import {Link} from 'react-router'
import api from '../../../middleware/api'
import baseModal from '../../../components/base/BaseModal'

export default class MaintenanceDetailModalAndEdit extends baseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      partsList: [],
      projectList: []
    };
    [
      'checkDetails',
      'getPartList',
    ].map(method => this[method] = this[method].bind(this));
  };

  componentDidMount() {
    this.getPartList(this.props.detail._id);

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.projectId) {
      this.getPartList(nextProps.projectId);
    }
  }

  checkDetails() {
    this.setState({visible: true});
  }

  //获取维保信息中查看详情中维修项目和维修配件数据 projectList: 维修项目 partsList: 维修配件
  getPartList(id) {
    api.ajax({url: api.getPartListOfMaintProj(id)}, function (data) {
      this.setState({partsList: data.res.list})
    }.bind(this));
    api.ajax({url: api.getItemListOfMaintProj(id)}, function (data) {
      this.setState({projectList: data.res.list})
    }.bind(this))
  }

  render() {
    let {detail} = this.props;
    const listParts = [];
    const listProject = [];
    const {partsList} = this.state;
    const {projectList} = this.state;
    let ifDisabled = Number(detail.status) === 3;

    console.log('-------------------partsList', partsList);

    if (partsList.length != 0) {
      partsList.map(function (item) {
        listParts.push(<Row type="flex" key={item._id}>
          <Col span="4">{item.part_type_name}</Col>
          <Col span="6">{item.part_name}</Col>
          <Col span="3">{item.count}</Col>
          <Col span="4">{item.sell_price}</Col>
          <Col span="3">{Number(item.material_fee) / Number(item.count)}</Col>
          <Col span="4">{item.material_fee}</Col>
        </Row>)
      }.bind(this));
    } else {
      listParts.push(<p className="text-center c-grey" key="proj-part-list-000">暂无信息</p>);
    }

    const contentRepairParts = (
      <div>
        <Row type="flex">
          <Col span="4">配件分类</Col>
          <Col span="6">配件名</Col>
          <Col span="3">数量(个)</Col>
          <Col span="4">参考零售价(元)</Col>
          <Col span="3">零售价(元)</Col>
          <Col span="4">金额小计(元)</Col>
        </Row>
        {listParts}
      </div>
    );

    if (projectList.length != 0) {
      projectList.map(function (item) {
        listProject.push(
          <Row type="flex" key={item._id}>
            <Col span="8">{item.item_name}</Col>
            <Col span="8">{item.time_fee}</Col>
            <Col span="8">{item.fitter_user_names}</Col>
          </Row>)
      }.bind(this));
    } else {
      listProject.push(<p className="text-center c-grey" key="proj-item-list-000">暂无信息</p>);
    }

    const contentRepairProject = (
      <div>
        <Row type="flex">
          <Col span="8">维修项目</Col>
          <Col span="8">工时费(元)</Col>
          <Col span="8">维修人员</Col>
        </Row>
        {listProject}
      </div>
    );

    let content = (
      <div className="ant-table ant-table-bordered">
        <div className="ant-table-body">
          <table>
            <tbody className="ant-table-tbody">
            <tr className="ant-table-row  ant-table-row-level-0">
              <td>订单号：{detail._id}</td>
              <td>创建时间：{detail.ctime}</td>
              <td>更新时间：{detail.mtime}</td>
              <td>{''}</td>
            </tr>
            <tr className="ant-table-row  ant-table-row-level-0">
              <td>是否事故车：{text.isOrNot[detail.is_accident]}</td>
              <td>维修人员：{detail.fitter_user_names}</td>
              <td>进厂时间：{detail.start_time}</td>
              <td>出厂时间：{detail.end_time}</td>
            </tr>
            <tr className="ant-table-row  ant-table-row-level-0">
              <td>维修项目：</td>
              <td colSpan="3">
                {contentRepairProject}
              </td>
            </tr>
            <tr className="ant-table-row  ant-table-row-level-0">
              <td>维修配件：</td>
              <td colSpan="3">
                {contentRepairParts}
              </td>
            </tr>
            <tr className="ant-table-row  ant-table-row-level-0">
              <td>公里数(Km)：{detail.mileage}</td>
              <td>材料费(元)：{detail.material_fee_in}</td>
              <td>工时费(元)：{detail.time_fee}</td>
              <td>材料成本(元)：{detail.material_fee_out}</td>
            </tr>
            <tr>
              <td>优惠券抵扣(元)：{detail.coupon}</td>
              <td>团购抵扣(元)：{detail.group_purchase}</td>
              <td>抹零优惠(元)：{detail.discount}</td>
              <td>结算金额(元)：{detail.total_fee}</td>
            </tr>
            <tr className="ant-table-row  ant-table-row-level-0">
              <td colSpan="4">总利润(元)：{Number(detail.total_fee - detail.material_fee_out).toFixed(2)}</td>
            </tr>
            <tr className="ant-table-row  ant-table-row-level-0">
              <td colSpan="4">故障描述：{detail.failure_desc}</td>
            </tr>
            <tr>
              <td colSpan="4">维修建议：{detail.maintain_advice}</td>
            </tr>
            <tr className="ant-table-row  ant-table-row-level-0">
              <td colSpan="4">备注：{detail.remark}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    );

    return (
      <div className="margin-left-20" style={{display: 'inline-block'}}>
        <Button type="dashed" size="small" onClick={this.checkDetails}>查看详情</Button>
        <Link
          to={{pathname: "/aftersales/project/create/",
            query: {
              customer_id: detail.customer_id,
              user_auto_id: detail.user_auto_id,
              maintain_intention_id: detail._id
            }
          }}
          target="_blank"
        >
          <Button className="margin-left-20" type="dashed" size="small" disabled={ifDisabled}>编辑</Button>
        </Link>

        <Modal
          width="960px"
          title="详情信息"
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
        >
          {content}
        </Modal>
      </div>
    );
  };
}
