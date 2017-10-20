import React from 'react';
import { Row, Col, Input, Select, Form } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';

import BaseList from '../../../components/base/BaseList';
import InfoDropDown from '../../../components/widget/InfoDropDown';

import Type from './Type';
import New from './New';
import Table from './Table';

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      key: '',
      partType: '',
      brand: '',
      scope: '',
      status: '0',
      enterPartInfo: '',
    };

    [
      'handleSearchChange',
      'handleBrandChange',
      'handleStatusChange',
      'handleScopeChange',
      'handleTypeChange',
      'handleCheckPart',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSearchChange(e) {
    const key = e.target.value;
    this.setState({ key, page: 1 });
  }

  handleBrandChange(e) {
    const brand = e.target.value;
    this.setState({ brand, page: 1 });
  }

  handleScopeChange(e) {
    const scope = e.target.value;
    this.setState({ scope, page: 1 });
  }

  handleStatusChange(status) {
    this.setState({ status, page: 1 });
  }

  handleTypeChange(pid) {
    this.setState({ partType: pid, page: 1 });
  }

  handleCheckPart(enterPartInfo) {
    this.setState({ enterPartInfo, reload: false });
  }

  render() {
    const { enterPartInfo } = this.state;

    const { formItemThree } = Layout;
    return (
      <div>
        <InfoDropDown partInfo={enterPartInfo} />

        <div className="with-bottom-border-nopadding padding-bottom-10 mb10">
          <Row>
            <Col span={9}>
              <label className="label">搜索配件</label>
              <Search
                onChange={this.handleSearchChange}
                size="large"
                style={{ width: '280px' }}
                placeholder="请输入配件名、配件号、首字母搜索"
              />
            </Col>
            <Col span={8}>
              <FormItem label="配件分类" {...formItemThree}>
                <Type onSuccess={this.handleTypeChange} style={{ width: '280px' }} />
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={9}>
              <label className="label ml28">品牌</label>
              <Search
                onChange={this.handleBrandChange}
                size="large"
                style={{ width: '280px' }}
                placeholder="全部"
              />
            </Col>
            <Col span={8}>
              <FormItem label="适用车型" {...formItemThree}>
                <Search
                  onChange={this.handleScopeChange}
                  size="large"
                  placeholder="全部"
                  style={{ width: '280px' }}
                />
              </FormItem>
            </Col>

          </Row>

          <Row>
            <Col span={9}>
              <label className="label ml28">状态</label>
              <Select
                size="large"
                onSelect={this.handleStatusChange}
                defaultValue="0"
                style={{ width: '280px' }}
              >
                <Option value="-2">全部</Option>
                <Option value="-1">停用</Option>
                <Option value="0">启用</Option>
              </Select>
            </Col>
            <Col span={15}>
              <div className="pull-right">
                <New onSuccess={this.handleSuccess} />
              </div>
            </Col>
          </Row>
        </div>

        <span className="part-list">
          <Table
            source={api.warehouse.part.list(this.state)}
            page={this.state.page}
            reload={this.state.reload}
            updateState={this.updateState}
            onSuccess={this.handleSuccess}
            onCheckPart={this.handleCheckPart}
          />
        </span>
      </div>
    );
  }
}
