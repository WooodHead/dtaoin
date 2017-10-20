import React from 'react';
import { Row, Col, Select, Popconfirm, Button, message } from 'antd';

import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';

import Table from './Table';

const Option = Select.Option;

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      brand: '',
      brands: [],
      status: '-2',
      payInfos: [],
    };

    [
      'handleStatusChange',
      'handleBrandChange',
      'handleSettlement',
      'handleRowSelect',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getBrands();
  }

  handleRowSelect(selectedRowKeys, selectedRows) {
    const payInfos = [];
    selectedRows.map(item => payInfos.push({ _id: item._id, pay_amount: item.unpay_amount }));
    this.setState({ payInfos });
  }

  handleStatusChange(status) {
    this.setState({ status });
  }

  handleBrandChange(brand) {
    this.setState({ brand });
  }

  handleSettlement() {
    const payInfo = { pay_infos: JSON.stringify(this.state.payInfos) };

    api.ajax({
      url: api.technician.settlement(),
      data: payInfo,
      type: 'POST',
    }, () => {
      message.success('结算成功');
      this.setState({ reload: true });
      location.reload();
    });
  }

  getBrands() {
    api.ajax({ url: api.auto.getBrands() }, data => {
      const { auto_brand_list } = data.res;
      this.setState({ brands: auto_brand_list });
    });
  }

  render() {
    const { brands, page, payInfos } = this.state;
    const rowSelection = {
      onChange: this.handleRowSelect,
      getCheckboxProps: record => ({ disabled: Number(record.unpay_amount) === 0 }),
    };

    return (
      <div>
        <Row className="head-action-bar">
          <Col span={24}>
            <label>品牌：</label>
            <Select
              defaultValue=""
              optionFilterProp="children"
              onSelect={this.handleBrandChange}
              style={{ width: 200 }}
              size="large"
              dropdownStyle={{ maxHeight: '200px' }}
            >
              <Option value="">全部</Option>
              {brands.map(brands => <Option key={brands._id}>{brands.name}</Option>)}
            </Select>

            <label className="ml20">状态：</label>
            <Select
              size="large"
              style={{ width: 150 }}
              onSelect={this.handleStatusChange}
              defaultValue="-2"
            >
              <Option value="-2">全部</Option>
              <Option value="0">待认证</Option>
              <Option value="1">已认证</Option>
              <Option value="2">已驳回</Option>
              <Option value="3">审核中</Option>
            </Select>

            <div className="pull-right">
              <Popconfirm
                placement="topRight"
                title="批量结算所选技师？"
                onConfirm={this.handleSettlement}
              >
                <Button type="primary" disabled={Number(payInfos.length) === 0}>批量结算</Button>
              </Popconfirm>

            </div>
          </Col>
        </Row>

        <Table
          page={page}
          source={api.technician.list(this.state)}
          updateState={this.updateState}
          rowSelection={rowSelection}
        />
      </div>
    );
  }
}
