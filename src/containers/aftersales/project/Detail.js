import React from "react";
import {Button, Breadcrumb, Icon} from "antd";
import api from "../../../middleware/api";
import CustomerInfo from "../../../components/boards/aftersales/CustomerInfo";
import ProjectInfo from "../../../components/boards/aftersales/ProjectInfo";
import BaseAutoInfo from "../../../components/boards/BaseAutoInfo";

export default class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customer_id: this.props.location.query.customer_id,
      project_id: this.props.location.query.project_id,
      auto_id: this.props.location.query.auto_id,
      customer_detail: [],
      project_detail: [],
      autos: []
    };
  }

  componentDidMount() {
    api.ajax({url: api.getCustomerDetail(this.state.customer_id)}, function (data) {
      this.setState({customer_detail: data.res.customer_info});
    }.bind(this));

    api.ajax({url: api.getAutoDetail(this.state.customer_id, this.state.auto_id)}, function (data) {
      this.setState({autos: data.res.detail});
    }.bind(this));

    api.ajax({url: api.maintProjectByProjectId(this.state.customer_id, this.state.project_id)}, function (data) {
      this.setState({project_detail: data.res.intention_info});
    }.bind(this))
  }

  render() {
    let detail = this.state.customer_detail;
    return (
      <div>
        <div className="mb10">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="javascript:history.back();"><Icon type="left"/> 维修保养单</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {detail.name}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="margin-bottom-20">
          <CustomerInfo detail={detail}/>
        </div>

        <div className="margin-top-40">
          <h3 className="font-size-24 margin-bottom-10">维保信息</h3>
          <BaseAutoInfo auto={this.state.autos} customer_id={this.state.customer_id} auto_id={this.state.auto_id}/>
          <ProjectInfo detail={this.state.project_detail}/>
        </div>
      </div>
    )
  }
}
