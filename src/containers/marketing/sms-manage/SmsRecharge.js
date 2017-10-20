import React from 'react';

import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';

import Table from './TableSmsRecharge';
import Recharge from './Recharge';

export default class SmsRecharge extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
    };

    [
      'handleDateChange',
      'handleTypeSelect',
      'handleStatusSelect',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleDateChange(startDate, endDate) {
    this.setState({ startDate, endDate });
  }

  handleTypeSelect(type) {
    this.setState({ type });
  }

  handleStatusSelect(status) {
    this.setState({ status });
  }

  render() {
    const { page } = this.state;

    return (
      <div>
        <Recharge type="3" />
        <h3 className="mb20 mt20">充值记录：</h3>
        <Table
          page={page}
          source={api.coupon.smsChargeList(this.state)}
          updateState={this.updateState}
        />
      </div>
    );
  }
}
