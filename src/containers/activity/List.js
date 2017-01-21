import React from 'react';
import api from '../../middleware/api';
import BaseList from '../../components/base/BaseList';

import Table from './Table';

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: props.location.query.page || 1,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.query.page !== nextProps.location.query.page) {
      this.setState({
        page: nextProps.location.query.page,
      });
    }
  }

  render() {
    return (
      <Table
        updateState={this.updateState}
        currentPage={this.state.page}
        source={api.activity.list(this.state)}
      />
    );
  }
}
