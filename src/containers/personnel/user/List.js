import React from 'react';
import api from '../../../middleware/api';
import BaseList from '../../../components/base/BaseList';

import Table from './Table';
import SalaryGroupFilter from '../../../components/filters/SalaryGroupFilter';
import DepartmentFilter from '../../../components/filters/DepartmentFilter';

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      department: '0',
      salaryGroup: '0',
      key: '',
      page: props.location.query.page || 1,
    };
  }

  render() {
    return (
      <div>
        <SalaryGroupFilter filterAction={this.handleRadioChange}/>
        <DepartmentFilter filterAction={this.handleRadioChange}/>

        <Table
          updateState={this.updateState}
          currentPage={this.state.page}
          source={api.user.getList(this.state)}
        />
      </div>
    );
  }
}
