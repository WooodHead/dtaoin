import React from 'react';
import { Row, Col, Input, Select } from 'antd';

import api from '../../middleware/api';

import BaseList from '../../components/base/BaseList';

import Edit from './EditNew';
import Table from './Table';

const Search = Input.Search;
const Option = Select.Option;

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      key: '',
      types: [],
      maintainType: '',
    };

    [
      'handleSearchChange',
      'handleTypeSelect',
      'getMaintainItemTypes',
    ].map(item => this[item] = this[item].bind(this));
  }

  componentDidMount() {
    this.getMaintainItemTypes();
  }

  handleSearchChange(e) {
    this.setState({ key: e.target.value, page: 1 });
  }

  handleTypeSelect(value) {
    this.setState({ maintainType: value, page: 1 });
  }

  getMaintainItemTypes() {
    api.ajax({ url: api.aftersales.getMaintainItemTypes() }, data => {
      this.setState({ types: data.res.type_list });
    });
  }

  render() {
    const { types } = this.state;

    return (
      <div>
        <Row className="head-action-bar-line mb20">
          <Col span={16}>
            <label className="label">搜索项目</label>
            <Search
              onChange={this.handleSearchChange}
              style={{ width: 220 }}
              size="large"
              placeholder="请输入名称搜索"
            />

            <label className="label ml20">产值类型</label>
            <Select
              placeholder="请选择产值类型"
              onSelect={this.handleTypeSelect}
              style={{ width: '200px' }}
              size="large"
              defaultValue="-1"
            >
              <Option key="-1">全部</Option>
              {types.map(type => <Option key={type._id}>{type.name}</Option>)}
            </Select>
          </Col>
          <Col span={8}>
            <span className="pull-right">
              <Edit onSuccess={this.handleSuccess} />
            </span>
          </Col>
        </Row>

        <span className="maintain-item-index">
          <Table
            source={api.maintainItem.list(this.state)}
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
