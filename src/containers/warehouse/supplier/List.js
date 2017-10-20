import React from 'react';
import { Row, Col, Input } from 'antd';

import BaseList from '../../../components/base/BaseList';

import api from '../../../middleware/api';

import New from './New';
import Table from './Table';

const Search = Input.Search;

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      company: '',
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSearchChange(e) {
    const company = e.target.value;
    this.setState({ company, page: 1 });
  }

  render() {
    return (
      <div>
        <Row className="head-action-bar-line mb10">
          <Col span={12}>
            <Search
              onChange={this.handleSearchChange}
              size="large"
              style={{ width: '250px' }}
              placeholder="请输入供应商名称搜索"
            />
          </Col>
          <Col span={12}>
            <div className="pull-right">
              <New onSuccess={this.handleSuccess} />
            </div>
          </Col>
        </Row>

        <span className="supplier-index">
          <Table
            source={api.warehouse.supplier.list(this.state)}
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
