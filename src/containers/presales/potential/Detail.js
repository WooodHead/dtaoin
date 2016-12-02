import React from "react";
import {Icon, Breadcrumb} from "antd";
import api from "../../../middleware/api";
import PotentialCustomerInfo from "../../../components/boards/presales/PotentialCustomerInfo";
import AutoTabs from "../../../components/boards/presales/PotentialAutoTabs";

export default class PotentialDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerId: this.props.location.query.customer_id,
      detail: {},
      intentions: []
    }
  }

  componentDidMount() {
    let {customerId} = this.state;
    this.getCustomerDetail(customerId);
    this.getCustomerIntentions(customerId);
  }

  getCustomerDetail(customerId) {
    api.ajax({url: api.getCustomerDetail(customerId)}, function (data) {
      this.setState({detail: data.res.customer_info});
    }.bind(this))
  }

  getCustomerIntentions(customerId) {
    api.ajax({url: api.getCustomerIntentions(customerId)}, function (data) {
      this.setState({intentions: data.res.intention_list});
    }.bind(this))
  }

  render() {
    let {
      detail,
      intentions
    }= this.state;

    return (
      <div>
        <div className="mb10">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="javascript:history.back();">
                <Icon type="left"/> 潜在客户
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Icon type="user"/> {detail.name}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <PotentialCustomerInfo detail={detail}/>
        <AutoTabs intentions={intentions}/>
      </div>
    );
  }
}
