import React from 'react';
import api from '../../../middleware/api';
import BaseList from '../../../components/base/BaseList';
import Table from './Table';

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      key: '',
    };
  }

  render() {
    return (
      <Table
        source={api.warehouse.part.list(this.state)}
        currentPage={this.state.page}
        updateState={this.updateState}
      />
    );
  }
}
