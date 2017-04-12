import React from 'react';
import {Row, Col} from 'antd';

import BaseList from '../../../components/base/BaseList';
import SearchBox from '../../../components/search/SearchBox';

import api from '../../../middleware/api';

import New from './New';
import Table from './Table';

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      company: '',
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSearchChange(company) {
    this.setState({company, page: 1});
  }

  render() {
    return (
      <div>
        <Row className="head-action-bar">
          <Col span={12}>
            <SearchBox
              change={this.handleSearchChange}
              placeholder="请输入供应商名称搜索"
              style={{width: 250}}
            />
          </Col>
          <Col span={12}>
            <div className="pull-right">
              <New onSuccess={this.handleSuccess}/>
            </div>
          </Col>
        </Row>

        <Table
          source={api.warehouse.supplier.list(this.state)}
          page={this.state.page}
          reload={this.state.reload}
          updateState={this.updateState}
          onSuccess={this.handleSuccess}
        />
      </div>
    );
  }
}
