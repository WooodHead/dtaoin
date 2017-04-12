import React from 'react';
import {Row, Col, Input, Select} from 'antd';

import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';

import New from './New';
import Table from './Table';

const Search = Input.Search;
const Option = Select.Option;

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      key: '',
      type: '-1',
      types: [],
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
  }

  componentDidMount() {
    this.getMaintainItemTypes();
  }

  handleSearchChange(e) {
    let key = e.target.value;
    this.setState({key, page: 1});
  }

  handleTypeChange(type) {
    this.setState({type});
  }

  getMaintainItemTypes() {
    api.ajax({url: api.aftersales.getMaintainItemTypes()}, data => {
      this.setState({types: data.res.type_list});
    });
  }

  render() {
    return (
      <div>
        <Row className="head-action-bar">
          <Col span={12}>
            <Search
              onChange={this.handleSearchChange}
              size="large"
              style={{width: 220}}
              placeholder="请输入配件分类"
            />

            <label className="label ml20">产值类型</label>
            <Select onChange={this.handleTypeChange} size="large" defaultValue="-1" style={{width: 220}}>
              <Option key="-1">全部</Option>
              {this.state.types.map(type => <Option key={type._id}>{type.name}</Option>)}
            </Select>
          </Col>
          <Col span={12}>
            <span className="pull-right">
              <New onSuccess={this.handleSuccess}/>
            </span>
          </Col>
        </Row>

        <Table
          source={api.warehouse.category.list(this.state)}
          page={this.state.page}
          reload={this.state.reload}
          updateState={this.updateState}
          onSuccess={this.handleSuccess}
        />
      </div>
    );
  }
}
