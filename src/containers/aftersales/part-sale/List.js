import React from 'react';
import { Row, Col, Button, Select, Input } from 'antd';
import { Link } from 'react-router-dom';

import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';

import Table from './Table';

const Option = Select.Option;
const Search = Input.Search;

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
      page: 1,
      status: -1,
    };

    [
      'handleSelectChange',
      'handleSearchChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSelectChange(value) {
    this.setState({ status: value, page: 1 });
  }

  handleSearchChange(e) {
    const key = e.target.value;
    this.setState({ key, page: 1 });
  }

  handleSelectItem(selectedItem) {
    this.setState({ selectedItem });
  }

  render() {
    const { page, selectedItem } = this.state;
    return (
      <div className="part-sale-index">
        <Row className="mb15">
          <Col span={19}>
            <Search
              onChange={this.handleSearchChange}
              size="large"
              style={{ width: '250px' }}
              placeholder="请输入手机号、单号搜索"
            />

            <label className="ml20">结算状态： </label>
            <Select
              size="large"
              defaultValue="-1"
              onSelect={this.handleSelectChange}
              style={{ width: 200 }}
            >
              <Option value="-1">全部</Option>
              <Option value="0">待付款</Option>
              <Option value="1">挂账</Option>
              <Option value="2">已结算</Option>
            </Select>
          </Col>

          <Col span={5}>
            <div className="pull-right">
              <Link to="/aftersales/part-sale/new" target="_black"><Button
                type="primary">配件销售</Button></Link>
            </div>
          </Col>
        </Row>

        <Table
          page={page}
          source={api.aftersales.getPartSellList(this.state)}
          updateState={this.updateState}
          selectedItem={selectedItem}
        />
      </div>
    );
  }
}
