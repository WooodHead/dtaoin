import React, {Component} from "react";
import {Button, Message, Tabs, Row, Col, Icon, Breadcrumb} from "antd";
import api from "../../../middleware/api";
import CustomerInfo from "../../../components/boards/aftersales/CustomerInfo";
import BaseAutoInfo from "../../../components/boards/BaseAutoInfo";
import ProjectsInfoOfAuto from "../../../components/boards/aftersales/ProjectsInfoOfAuto";
import NewAutoModal from "../../../components/modals/aftersales/NewAutoModal";

export default class Detail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.location.query.customer_id,
      customer_detail: {},
      autos: []
    };
  }

  componentDidMount() {
    api.ajax({url: api.getCustomerDetail(this.state.id)}, function (data) {
      this.setState({customer_detail: data.res.customer_info});
    }.bind(this));

    api.ajax({url: api.purchasedAutoList(this.state.id)}, function (data) {
      this.setState({autos: data.res.user_auto_list});
    }.bind(this));
  }

  render() {
    const TabPane = Tabs.TabPane;
    let detail = this.state.customer_detail,
      autos = this.state.autos,
      tabPanes = [],
      content = [],
      operations = <NewAutoModal customer_id={this.state.id}/>;

    if (autos == undefined || !autos.length) {
      content = (
        <div>
          <Row span="6" offset="18"><Col span="24">{operations}</Col></Row>
          <Row className="info-row"><Col span="24">暂无车辆信息,请完善</Col></Row>
        </div>)
    } else {
      autos.map(function (item, index) {
        let tabInfo = `车辆${index + 1}信息`;
        tabPanes.push(
          <TabPane tab={tabInfo} key={index + 1}>
            <BaseAutoInfo auto={item} auto_id={item._id} customer_id={this.state.id}/>
            <ProjectsInfoOfAuto auto_id={item._id} customer_id={this.state.id}/>
          </TabPane>);
      }.bind(this));
      content = (
        <Tabs type="card" tabBarExtraContent={operations}>
          {tabPanes}
        </Tabs>
      )
    }
    return (
      <div>
        <div className="mb10">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="javascript:history.back();"><Icon type="left"/>维保客户</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item><Icon type="user"/> {detail.name}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="margin-bottom-20">
          <CustomerInfo detail={detail}/>
        </div>
        <div className="margin-top-40">
          {content}
        </div>
      </div>
    )
  }
};

