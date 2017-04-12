import React from 'react';
import {Row, Col, Input} from 'antd';

import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';

import New from './New';
import Table from './Table';

const Search = Input.Search;

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      name: '',
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSearchChange(e) {
    this.setState({name: e.target.value, page: 1});
  }

  render() {
    return (
      <div>
        <Row className="head-action-bar">
          <Col span={12}>
            <Search
              onChange={this.handleSearchChange}
              onSearch={this.handleSearchChange}
              style={{width: 220}}
              size="large"
              placeholder="请输入资产名称搜索"
            />
          </Col>
          <Col span={12}>
            <div className="pull-right">
              <New onSuccess={this.handleSuccess}/>
            </div>
          </Col>
        </Row>

        <Table
          source={api.finance.fixedAssets.list(this.state)}
          page={this.state.page}
          reload={this.state.reload}
          updateState={this.updateState}
          onSuccess={this.handleSuccess}
        />
      </div>
    );
  }
}

