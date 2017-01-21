import React from 'react';
import api from '../../../middleware/api';
import BaseList from '../../../components/base/BaseList';
import Filters from './Filters';
import Table from './Table';

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      source: '0',
      create_day: '0',
      customer_type: '0',
      page: props.location.query.page || 1,
    };
  }

  render() {
    return (
      <div>
        <Filters
          filterAction={this.handleConditionChange}
          budgetMin={this.state.budget_min}
        />
        <Table
          updateState={this.updateState}
          currentPage={this.state.page}
          source={api.autoSellCustomerList(this.state)}
        />
      </div>
    );
  }
}
