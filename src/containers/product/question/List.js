import React from 'react';
import { Tabs, Row, Col, Select, Popconfirm, Button, message } from 'antd';

import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';

import Table from './Table';
import TableUnbalance from './TableUnbalance';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      type: '-1',
      companyId: '-1',
      status: '0',
      companies: [],
      selectedRowKeyString: '',
    };

    [
      'handleTabChange',
      'handleTypeChange',
      'handleCompanyChange',
      'handleStatusChange',
      'handleSelectRowChange',
      'handleAdoptAnswer',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleTabChange(tab) {
    if (tab === '2' && this.state.companies.length === 0) {
      this.getAllCompanies();
    }
  }

  handleTypeChange(type) {
    this.setState({ type, page: 1 });
  }

  handleCompanyChange(companyId) {
    this.setState({ companyId, page: 1 });
  }

  handleStatusChange(status) {
    this.setState({ status, page: 1 });
  }

  handleAdoptAnswer() {
    const { selectedRowKeyString } = this.state;
    api.ajax({
      url: api.question.adoptAllAnswer(),
      type: 'POST',
      data: {
        question_ids: selectedRowKeyString,
      },
    }, () => {
      message.success('批量平分成功');
      this.updateState({ reload: true });
    }, err => {
      message.error(`批量平分失败[${err}]`);
    });
  }

  handleSelectRowChange(selectedRowKeys) {
    const selectedRowKeyString = selectedRowKeys.join(',');
    this.setState({ selectedRowKeyString });
  }

  getAllCompanies() {
    api.ajax({ url: api.company.getAll() }, data => {
      this.setState({ companies: data.res.list });
    });
  }

  render() {
    const { page, reload, companies, selectedRowKeyString } = this.state;

    const rowSelection = { onChange: this.handleSelectRowChange };

    return (
      <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
        <TabPane tab="待结算问答" key="1">
          <Row className="mb10">
            <Col span={24}>
              <span className="pull-right">
                <Popconfirm
                  placement="topRight"
                  title="你确定要批量平分收益吗？"
                  onConfirm={this.handleAdoptAnswer}
                >
                  <Button type="primary" disabled={!selectedRowKeyString}>批量平分收益</Button>
                </Popconfirm>
              </span>
            </Col>
          </Row>
          <TableUnbalance
            source={api.question.listOfUnbalance(this.state)}
            page={page}
            reload={reload}
            updateState={this.updateState}
            onSuccess={this.handleSuccess}
            rowSelection={rowSelection}
          />
        </TabPane>

        <TabPane tab="全部问答" key="2">
          <Row className="head-action-bar">
            <Col span={24}>
              <label className="label">问题类型</label>
              <Select
                size="large"
                style={{ width: 220 }}
                defaultValue="-1"
                onChange={this.handleTypeChange}
              >
                <Option key="-1">全部</Option>
                <Option key="1">底盘</Option>
                <Option key="2">发动机</Option>
                <Option key="3">车身</Option>
                <Option key="4">电气设备</Option>
              </Select>

              <label className="label ml20">门店</label>
              <Select
                size="large"
                style={{ width: 220 }}
                defaultValue="-1"
                onChange={this.handleCompanyChange}
                showSearch
                optionFilterProp="children"
              >
                <Option key="-1">全部</Option>
                {companies.map(company => <Option key={company._id}>{company.name}</Option>)}
              </Select>

              <label className="label ml20">状态</label>
              <Select
                size="large"
                style={{ width: 220 }}
                defaultValue="0"
                onChange={this.handleStatusChange}
              >
                <Option key="-2">全部</Option>
                <Option key="0">正常</Option>
                <Option key="-1">已屏蔽</Option>
              </Select>
            </Col>
          </Row>

          <Table
            source={api.question.list(this.state)}
            page={page}
            reload={reload}
            updateState={this.updateState}
            onSuccess={this.handleSuccess}
          />
        </TabPane>
      </Tabs>
    );
  }
}
