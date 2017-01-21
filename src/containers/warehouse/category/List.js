import React from 'react';
import api from '../../../middleware/api';
import BaseList from '../../../components/base/BaseList';
import Table from './Table';

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: props.location.query.page || 1,
      name: '',
    };
  }

  render() {
    return (
      <Table
        updateState={this.updateState}
        currentPage={this.state.page}
        source={api.warehouse.category.list(this.state)}
      />
    );
  }
}
