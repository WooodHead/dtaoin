import React from 'react';
import { Row, Col, Input, Select } from 'antd';

import api from '../../middleware/api';
import BaseList from '../../components/base/BaseList';

import Table from './Table';

const Search = Input.Search;
const Option = Select.Option;

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      key: '',
      autoBrandId: '',
      brands: [],
    };
    [
      'handleSearch',
      'handleBrandChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getBrands();
  }

  handleSearch(e) {
    const key = e.target.value;
    const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
    if (reg.test(key)) {
      if (key.length > 1) {
        this.setState({ key });
        return false;
      }
    }
    if (key.length > 3) {
      this.setState({ key });
    }
    if (!key) {
      this.setState({ key });
    }
  }

  handleBrandChange(value) {
    this.setState({ autoBrandId: value });
  }

  getBrands() {
    api.ajax({ url: api.auto.getBrands() }, data => {
      this.setState({ brands: data.res.auto_brand_list });
    },
    );
  }

  render() {
    const { brands } = this.state;

    return (
      <div className="customer-index">
        <Row className="mb10">
          <Col span={20}>

            <label className="label">搜索客户</label>
            <Search
              placeholder="请输入车牌号、电话搜索"
              style={{ width: '300px' }}
              onChange={this.handleSearch}
              size="large"
            />

            <label className="label ml20">车辆品牌</label>
            <Select
              size="large"
              style={{ width: 200 }}
              defaultValue="0"
              onChange={this.handleBrandChange}
            >
              <Option key="0">全部</Option>
              {brands.map(item => <Option key={item._id}>{item.name}</Option>)}
            </Select>
          </Col>
        </Row>

        <Table
          source={api.aftersales.searchMaintainCustomerList(this.state)}
          page={this.state.page}
          updateState={this.updateState}
        />
      </div>
    );
  }
}
