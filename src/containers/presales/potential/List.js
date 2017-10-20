import React from 'react';
import { Row, Col, Select, Radio, Input } from 'antd';

import api from '../../../middleware/api';
import validator from '../../../utils/validator';

import BaseList from '../../../components/base/BaseList';

import NewCustomerAndIntention from './NewCustomerAndIntention';
import Table from './Table';

const Search = Input.Search;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

export default class PotentialCustomerList extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      intention_level: '',
      create_day: '0',
      is_mortgage: '-1',
      key: '',
      intention_brand: '',
      budget_level: '-1',
      brands: [],
      budgetLevels: [],
      source: '0',
    };

    [
      'handleLevelChange',
      'handleDaysChange',
      'handleMortgageChange',
      'handleSearchChange',
      'handleBrandChange',
      'handleBudgetLevelChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getBrands();
    this.getBudgetLevels();
  }

  handleLevelChange(e) {
    const level = e.target.value;
    this.setState({ intention_level: level === '-1' ? '' : level, page: 1 });
  }

  handleDaysChange(e) {
    this.setState({ create_day: e.target.value, page: 1 });
  }

  handleMortgageChange(e) {
    this.setState({ is_mortgage: e.target.value, page: 1 });
  }

  handleSearchChange(e) {
    const key = e.target.value;
    if (!key) {
      this.setState({ key: '', page: 1 });
    } else if (validator.number(key) && key.length > 3) {
      this.setState({ key, page: 1 });
    } else if (validator.cnString(key) && key.length >= 2) {
      this.setState({ key, page: 1 });
    }
  }

  handleBrandChange(value) {
    this.setState({ intention_brand: value, page: 1 });
  }

  handleBudgetLevelChange(value) {
    this.setState({ budget_level: value, page: 1 });
  }

  getBrands() {
    api.ajax({ url: api.auto.getBrands() }, data => {
      this.setState({ brands: data.res.auto_brand_list });
    },
    );
  }

  getBudgetLevels() {
    api.ajax({ url: api.presales.intention.getBudgetLevels() }, data => {
      this.setState({ budgetLevels: data.res.budget_levels });
    });
  }

  render() {
    const { page, reload, brands, budgetLevels } = this.state;
    const padding = { padding: '0 12px' };

    return (
      <div>
        <div className="head-action-bar">
          <Row className="mb10">
            <Col span={24}>
              <label className="label">意向级别</label>
              <RadioGroup defaultValue="-1" size="large" onChange={this.handleLevelChange}>
                <RadioButton value="-1" style={padding}>全部</RadioButton>
                <RadioButton value="H" style={padding}>H</RadioButton>
                <RadioButton value="A" style={padding}>A</RadioButton>
                <RadioButton value="B" style={padding}>B</RadioButton>
                <RadioButton value="C" style={padding}>C</RadioButton>
                <RadioButton value="D" style={padding}>D</RadioButton>
                <RadioButton value="E" style={padding}>E</RadioButton>
              </RadioGroup>

              <label className="label ml20">创建时间</label>
              <RadioGroup defaultValue="0" size="large" onChange={this.handleDaysChange}>
                <RadioButton value="0" style={padding}>全部</RadioButton>
                <RadioButton value="3" style={padding}>3天</RadioButton>
                <RadioButton value="7" style={padding}>7天</RadioButton>
                <RadioButton value="15" style={padding}>15天</RadioButton>
                <RadioButton value="30" style={padding}>30天</RadioButton>
                <RadioButton value="60" style={padding}>2个月</RadioButton>
              </RadioGroup>

              <label className="label ml20">按揭意愿</label>
              <RadioGroup defaultValue="-1" size="large" onChange={this.handleMortgageChange}>
                <RadioButton value="-1" style={{ padding: '0 10px' }}>全部</RadioButton>
                <RadioButton value="1" style={{ padding: '0 10px' }}>按揭</RadioButton>
                <RadioButton value="0" style={{ padding: '0 10px' }}>全款</RadioButton>
              </RadioGroup>
            </Col>
          </Row>

          <Row>
            <Col span={20}>
              <Search
                size="large"
                style={{ width: 220 }}
                onChange={this.handleSearchChange}
                placeholder="请输入手机号、姓名搜索"
              />

              <label className="label ml20">意向品牌</label>
              <Select
                size="large"
                style={{ width: 200 }}
                defaultValue="0"
                onChange={this.handleBrandChange}
              >
                <Option key="0">全部</Option>
                {brands.map(item => <Option key={item._id}>{item.name}</Option>)}
              </Select>

              <label className="label ml20">购买预算</label>
              <Select
                defaultValue={this.budgetLevel || '-1'}
                size="large"
                style={{ width: 200 }}
                onChange={this.handleBudgetLevelChange}
              >
                <Option key="-1">全部</Option>
                {budgetLevels.map(level => <Option key={level.id}>{level.name}</Option>)}
              </Select>
            </Col>
            <Col span={4}>
              <div className="pull-right">
                <NewCustomerAndIntention onSuccess={this.handleSuccess} />
              </div>
            </Col>
          </Row>
        </div>

        <span className="potential-index">
          <Table
            source={api.presales.intention.list(this.state)}
            page={page}
            reload={reload}
            updateState={this.updateState}
            onSuccess={this.handleSuccess}
          />
        </span>
      </div>
    );
  }
}
