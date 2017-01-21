import React from 'react';
import api from '../../../middleware/api';
import BaseList from '../../../components/base/BaseList';
import Filters from './Filters';
import Table from './Table';

export default class PotentialCustomerList extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      source: '0',
      intention_level: '',
      intention_brand: '',
      budget_level: '-1',
      create_day: '0',
      is_mortgage: '-1',
      page: props.location.query.page || 1,
    };
  }

  render() {
    return (
      <div>
        <Filters
          filterAction={this.handleConditionChange}
          budgetLevel={this.state.budget_level}
        />
        <Table
          updateState={this.updateState}
          currentPage={this.state.page}
          source={api.autoSellPotentialList}
          filter={this.state}
        />
      </div>
    );
  }
}
