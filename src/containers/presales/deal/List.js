import React from 'react';
import {Row, Col, Input, Radio, Select} from 'antd';

import api from '../../../middleware/api';
import validator from '../../../utils/validator';

import BaseList from '../../../components/base/BaseList';

import Table from './Table';

const Search = Input.Search;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Option = Select.Option;

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      key: '',
      lastDealDays: '0',
      payStatus: '-1',
    };

    [
      'handleSearchChange',
      'handleTimeChange',
      'handleStatusChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSearchChange(e) {
    let value = e.target.value;

    if (!value) {
      this.setState({key: '', page: 1});
    } else if (validator.number(value) && value.length > 3) {
      this.setState({key: value, page: 1});
    }
  }

  handleTimeChange(e) {
    this.setState({lastDealDays: e.target.value, page: 1});
  }

  handleStatusChange(value) {
    this.setState({payStatus: value, page: 1});
  }

  render() {
    return (
      <div>
        <Row className="head-action-bar">
          <Col span={24}>
            <Search
              size="large"
              style={{width: 200}}
              onChange={this.handleSearchChange}
              onSearch={this.handleSearchChange}
              placeholder="输入手机号搜索"
            />

            <label className="label ml20">成交时间</label>
            <RadioGroup
              size="large"
              defaultValue="0"
              onChange={this.handleTimeChange}
            >
              <RadioButton value="0">全部</RadioButton>
              <RadioButton value="3">3天</RadioButton>
              <RadioButton value="7">7天</RadioButton>
              <RadioButton value="15">15天</RadioButton>
              <RadioButton value="30">30天</RadioButton>
              <RadioButton value="60">2个月</RadioButton>
            </RadioGroup>

            <label className="label ml20">结算状态</label>
            <Select
              size="large"
              style={{width: 200}}
              defaultValue={'-1'}
              onSelect={this.handleStatusChange}
            >
              <Option value="-1">全部</Option>
              <Option value="0">未结算</Option>
              <Option value="1">已结算</Option>
            </Select>
          </Col>
        </Row>

        <Table
          source={api.presales.deal.list(this.state)}
          page={this.state.page}
          updateState={this.updateState}
          onSuccess={this.handleSuccess}
        />
      </div>
    );
  }
}
