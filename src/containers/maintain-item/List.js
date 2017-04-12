import React from 'react';
import {Row, Col, Input} from 'antd';

import api from '../../middleware/api';

import BaseList from '../../components/base/BaseList';

import Edit from './EditNew';
import Table from './Table';

const Search = Input.Search;

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      key: '',
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSearchChange(e) {
    this.setState({key: e.target.value, page: 1});
  }

  render() {
    return (
      <div>
        <Row className="head-action-bar-line mb20">
          <Col span={12}>
            <Search
              onChange={this.handleSearchChange}
              style={{width: 220}}
              size="large"
              placeholder="请输入名称搜索"
            />
          </Col>
          <Col span={12}>
            <span className="pull-right" style={{position: 'relative', left: '-85px'}}>
              <Edit onSuccess={this.handleSuccess}/>
            </span>
          </Col>
        </Row>

        <Table
          source={api.maintainItem.list(this.state)}
          page={this.state.page}
          reload={this.state.reload}
          updateState={this.updateState}
          onSuccess={this.handleSuccess}
        />
      </div>
    );
  }
}
