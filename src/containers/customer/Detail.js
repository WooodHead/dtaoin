import React, {Component} from 'react';

import CustomerInfo from '../../components/boards/aftersales/CustomerInfo';
import PotentialAutoTabs from '../../components/boards/customer/PotentialAutoTabs';
import AutoTabs from '../../components/boards/customer/CustomerAutoTabs';

import api from '../../middleware/api';

export default class Detail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.location.query.customer_id,
      customerDetail: {},
      autos: [],
      intentions: [],
    };
  }

  componentDidMount() {
    this.getCustomerDetail(this.state.id);
    this.getCustomerAutos(this.state.id);
    this.getCustomerIntentions(this.state.id);
  }

  getCustomerDetail(customerId) {
    api.ajax({url: api.customer.detail(customerId)}, (data) => {
      this.setState({customerDetail: data.res.customer_info});
    });
  }

  getCustomerAutos(customerId) {
    api.ajax({url: api.userAutoList(customerId)}, (data) => {
      this.setState({autos: data.res.auto_list});
    });
  }

  getCustomerIntentions(customerId) {
    api.ajax({url: api.presales.intention.getListByCustomerId(customerId)}, (data) => {
      this.setState({intentions: data.res.intention_list});
    });
  }

  render() {
    const {customerDetail, autos, intentions} = this.state;

    return (
      <div>
        <div className="margin-bottom-20">
          <CustomerInfo detail={customerDetail}/>
        </div>
        <div className="margin-top-40">
          <AutoTabs autos={autos} customerId={customerDetail._id}/>
        </div>
        <div>
          <PotentialAutoTabs intentions={intentions}/>
        </div>
      </div>
    );
  }
}

