import React from 'react';
import { Row, Col, Input } from 'antd';

import api from '../../../middleware/api';
import BaseList from '../../../components/base/BaseList';

import SearchBox from '../../../components/search/SearchBox';
import SalaryGroupFilter from '../SalaryGroupFilter';
import DepartmentFilter from '../DepartmentFilter';

import New from './New';
import Table from './Table';

const Search = Input.Search;

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

  handleSearchChange(e) {
    const key = e.target.value;
    this.setState({ key });
  }

  render() {
    return (
      <div>
        <Row className="mb10">
          <Col span={21}>
            <Search
              onChange={this.handleSearchChange}
              size="large"
              style={{ width: '250px' }}
              placeholder="请输入姓名搜索"
            />
            <span className="ml20 mr20">
              <SalaryGroupFilter filterAction={this.handleRadioChange} />
            </span>
          </Col>

        </Row>

        <Row className="head-action-bar-line mb10">
          <Col span={21}>
            <DepartmentFilter filterAction={this.handleRadioChange} />
          </Col>
          <Col>
            <Col span={3}>
              <New onSuccess={this.handleSuccess} />
            </Col>
          </Col>
        </Row>

        <span className="user-list">
          <Table
            source={api.user.getList(this.state)}
            page={this.state.page}
            reload={this.state.reload}
            updateState={this.updateState}
            onSuccess={this.handleSuccess}
          />
        </span>
      </div>
    );
  }
}
