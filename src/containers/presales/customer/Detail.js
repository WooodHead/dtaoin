import React from "react";
import {Icon, Breadcrumb} from "antd";
import api from "../../../middleware/api";
import CustomerInfo from "../../../components/boards/presales/CustomerInfo";
import AutoTabs from "../../../components/boards/presales/CustomerAutoTabs";

export default class CustomerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.location.query.customer_id,
      detail: {},
      autos: [],
      intentions: []
    }
  }

  componentDidMount() {
    api.ajax({url: api.getCustomerDetail(this.state.id)}, function (data) {
      this.setState({detail: data.res.customer_info});
    }.bind(this));

    api.ajax({url: api.purchasedAutoList(this.state.id)}, function (data) {
      this.setState({autos: data.res.user_auto_list});
    }.bind(this));

    /* api.ajax({url: api.getCustomerIntentions(this.state.id)}, function (data) {
     this.setState({intentions: data.res.intention_list});
     }.bind(this));*/
  }

  render() {
    let detail = this.state.detail,
      autos = this.state.autos,
      intentions = this.state.intentions;

    return (
      <div>
        <div className="mb10">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="javascript:history.back();"><Icon type="left"/> 成交客户</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Icon type="user"/> {detail.name}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <CustomerInfo detail={detail}/>
        <AutoTabs autos={autos} id={this.state.id}/>
      </div>
    )
  }
}
