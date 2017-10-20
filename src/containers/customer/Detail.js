import React, { Component } from 'react';
import classNames from 'classnames';

import api from '../../middleware/api';
import path from '../../config/path';

import BaseInfo from './BaseInfo';
import PotentialAutoTabs from './PotentialAutoTabs';
import AutoTabs from './DealAutoTabs';
import ReminderInfo from './ReminderInfo';

/**
 * 客户详情页
 */
export default class Detail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.customerId || '',
      customerDetail: {},
      autos: [],
      intentions: [],
      isAuthorization: {},
      infoPermission: false,
      autoPermission: false,
      intentionsPermission: false,
      reminderCount: 0, // control remind module hide if no data
    };

    [
      'handleIntentionChange',
      'onRequestDataSuccess',
      'handleEditAutoSuccess',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getCustomerDetail(this.state.id);
    this.getCustomerAutos(this.state.id);
    this.getCustomerIntentions(this.state.id);
    this.getIsAuthorization();
  }

  getIsAuthorization() {
    this.checkInfoPermission(path.customer.information);
    this.checkAutoPermission(path.customer.auto);
    this.checkIntentionsPermission(path.customer.intention);
  }

  async checkInfoPermission(path) {
    const hasInfoPermission = await api.checkPermission(path);
    this.setState({
      infoPermission: hasInfoPermission,
    });
  }

  async checkAutoPermission(path) {
    const hasAutoPermission = await api.checkPermission(path);
    this.setState({
      autoPermission: hasAutoPermission,
    });
  }

  async checkIntentionsPermission(path) {
    const hasIntentionsPermission = await api.checkPermission(path);
    this.setState({
      intentionsPermission: hasIntentionsPermission,
    });
  }

  handleIntentionChange() {
    this.getCustomerIntentions(this.state.id);
  }

  onRequestDataSuccess(value) {
    this.setState({ reminderCount: value });
  }

  getCustomerDetail(customerId) {
    api.ajax({ url: api.customer.detail(customerId) }, data => {
      this.setState({ customerDetail: data.res.customer_info });
    });
  }

  getCustomerAutos(customerId) {
    api.ajax({ url: api.presales.userAutoList(customerId) }, data => {
      this.setState({ autos: data.res.auto_list });
    });
  }

  getCustomerIntentions(customerId) {
    api.ajax({ url: api.presales.intention.getListByCustomerId(customerId) }, data => {
      this.setState({ intentions: data.res.intention_list });
    });
  }

  handleEditAutoSuccess() {
    this.getCustomerAutos(this.state.id);
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
      reminderCount,
    } = this.state;

    const remindContainer = classNames({
      mb20: autoPermission && !!Number(reminderCount),
      hide: !autoPermission || !Number(reminderCount),
    });

    return (
      <div className="render-content">
        <div className={infoPermission ? 'mb20' : 'hide'}>
          <BaseInfo detail={customerDetail} />
        </div>

        <div className={remindContainer}>
          <ReminderInfo customerId={id} onSuccess={this.onRequestDataSuccess} />
        </div>

        <div className={autoPermission ? 'mb20' : 'hide'}>
          <AutoTabs
            autos={autos}
            customerId={id}
            editSuccess={this.handleEditAutoSuccess}
          />
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

