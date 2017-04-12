import React from 'react';
import {Row, Col} from 'antd';

import api from '../../../middleware/api';
import BaseList from '../../../components/base/BaseList';

import SearchBox from '../../../components/search/SearchBox';
import SalaryGroupFilter from '../SalaryGroupFilter';
import DepartmentFilter from '../DepartmentFilter';

import New from './New';
import Table from './Table';

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      key: '',
      department: '0',
      salaryGroup: '0',
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSearchChange(key) {
    this.setState({key});
  }

  render() {
    return (
      <div>
        <SalaryGroupFilter filterAction={this.handleRadioChange}/>
        <DepartmentFilter filterAction={this.handleRadioChange}/>

        <Row className="mb10">
          <Col span={12}>
            <SearchBox
              change={this.handleSearchChange}
              placeholder="请输入姓名搜索"
              style={{width: 250}}
            />
          </Col>
          <Col span={12}>
            <New onSuccess={this.handleSuccess}/>
          </Col>
        </Row>

        <Table
          source={api.user.getList(this.state)}
          page={this.state.page}
          reload={this.state.reload}
          updateState={this.updateState}
          onSuccess={this.handleSuccess}
        />
      </div>
    );
  }
}
