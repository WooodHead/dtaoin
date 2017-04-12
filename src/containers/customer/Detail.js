import React, {Component} from 'react';
import classNames from 'classnames';

import api from '../../middleware/api';
import path from '../../config/path';

import CustomerInfo from './BaseInfo';
import PotentialAutoTabs from './PotentialAutoTabs';
import AutoTabs from './DealAutoTabs';
import MaintenanceReminderInfo from './MaintenanceReminderInfo';

export default class Detail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.location.query.customerId,
      customerDetail: {},
      autos: [],
      intentions: [],
      isAuthorization: {},
      infoPermission: false,
      autoPermission: false,
      intentionsPermission: false,
      MaintenanceReminderTotal: 0,
    };
    [
      'handleIntentionChange',
      'handleMaintenanceReminderInfo',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getCustomerDetail(this.state.id);
    this.getCustomerAutos(this.state.id);
    this.getCustomerIntentions(this.state.id);
    this.getIsAuthorization();
  }

  async getIsAuthorization() {
    let hasInfoPermission = await api.checkPermission(path.customer.information);
    let hasAutoPermission = await api.checkPermission(path.customer.auto);
    let hasIntentionsPermission = await api.checkPermission(path.customer.intention);
    this.setState({
      infoPermission: hasInfoPermission,
      autoPermission: hasAutoPermission,
      intentionsPermission: hasIntentionsPermission,
    });
  }

  handleIntentionChange() {
    this.getCustomerIntentions(this.state.id);
  }

  handleMaintenanceReminderInfo(value) {
    this.setState({MaintenanceReminderTotal: value});
  }

  getCustomerDetail(customerId) {
    api.ajax({url: api.customer.detail(customerId)}, (data) => {
      this.setState({customerDetail: data.res.customer_info});
    });
  }

  getCustomerAutos(customerId) {
    api.ajax({url: api.presales.userAutoList(customerId)}, (data) => {
      this.setState({autos: data.res.auto_list});
    });
  }

  getCustomerIntentions(customerId) {
    api.ajax({url: api.presales.intention.getListByCustomerId(customerId)}, (data) => {
      this.setState({intentions: data.res.intention_list});
    });
  }

  render() {
    const {
      id,
      customerDetail,
      autos,
      intentions,
      infoPermission,
      autoPermission,
      intentionsPermission,
      MaintenanceReminderTotal,
    } = this.state;

    const MaintenanceReminderVisible = classNames({
      'mt40': autoPermission && !!Number(MaintenanceReminderTotal),
      'hide': !autoPermission || !Number(MaintenanceReminderTotal),
    });

    return (
      <div className="render-content">
        <div className={infoPermission ? 'mb10' : 'hide'}>
          <CustomerInfo detail={customerDetail}/>
        </div>

        <div className={MaintenanceReminderVisible}>
          <MaintenanceReminderInfo customerId={id} onSuccess={this.handleMaintenanceReminderInfo}/>
        </div>

        <div className={autoPermission ? 'mt40' : 'hide'}>
          <AutoTabs autos={autos} customerId={id}/>
        </div>

        <div className={intentionsPermission ? '' : 'hide'}>
          <PotentialAutoTabs
            intentions={intentions}
            customerId={customerDetail._id}
            onSuccess={this.handleIntentionChange}
          />
        </div>
      </div>
    );
  }
}

