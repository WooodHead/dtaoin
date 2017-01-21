import React from 'react';
import {Icon, Breadcrumb} from 'antd';
import api from '../../../middleware/api';
import CustomerInfo from '../../../components/boards/presales/CustomerInfo';
import AutoTabs from '../../../components/boards/customer/CustomerAutoTabs';

export default class CustomerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.location.query.customer_id,
      detail: {},
      autos: [],
      intentions: [],
    };
  }

  componentDidMount() {
    api.ajax({url: api.customer.detail(this.state.id)}, function (data) {
      this.setState({detail: data.res.customer_info});
    }.bind(this));

    api.ajax({url: api.userAutoList(this.state.id)}, function (data) {
      this.setState({autos: data.res.auto_list});
    }.bind(this));

    /* api.ajax({url: api.getCustomerIntentions(this.state.id)}, function (data) {
     this.setState({intentions: data.res.intention_list});
     }.bind(this));*/
  }

  render() {
    let detail = this.state.detail;
    let autos = this.state.autos;

    return (
      <div>
        <CustomerInfo detail={detail}/>
        <AutoTabs autos={autos} customerId={this.state.id}/>
      </div>
    );
  }
}
