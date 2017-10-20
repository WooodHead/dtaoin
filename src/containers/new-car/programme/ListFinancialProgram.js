import React from 'react';
import { Input, Cascader, Row, Select, Col, Button } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import BaseList from '../../../components/base/BaseList_';
import Table from './FinancialProgramTable';

class ListFinancialProgram extends BaseList {
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
  }
  updatePage(page) {
    this.props.setPage(page);
  }
  render() {
    const { isFetching, getMarketListData, getMarketPlanAllListData, page ,getProductListAllData } = this.props;
    const getMarketListDataList = getProductListAllData.list;
    const rouceList = [];
    if (getMarketListDataList) {
      for (let i = 0; i < getMarketListDataList.length; i++) {
        rouceList.push(<Select.Option key={getMarketListDataList[i]._id}
                                      value={getMarketListDataList[i]._id}>{getMarketListDataList[i].name}</Select.Option>);
      }
    }
    return (
      <div>
        <nav style={{ marginBottom: 20 }}>
          <Row>
            <Col style={{ width:260,float:'left',marginRight:20 }}>
              <label className="label">产品名称</label>
              <Select
                defaultValue="0"
                size="large"
                onChange={e => {
                  this.props.changeRocues(e);
                }}
                style={{ width: 180 }}
                tabBarStyle={{ color: 'red' }}
              >
                <Select.Option value="0">全部</Select.Option>
                {rouceList}
              </Select>
            </Col>
            <Col style={{ width:260,float:'left' }}>
              <label className="label">状态</label>
              <Select
                defaultValue="-2"
                style={{ width: 180 }}
                size="large"
                onChange={e => {
                  this.props.changeStatus(e);
                }}
              >
                <Select.Option value="-2">全部</Select.Option>
                <Select.Option value="0">使用中</Select.Option>
                <Select.Option value="-1">已下架</Select.Option>
              </Select>
            </Col>
          </Row>
        </nav>
        <Table
          updatePage={this.updatePage}
          onSuccess={this.handleSuccess}
          isFetching={isFetching}
          page={page}
          list={getMarketPlanAllListData.list}
          total={parseInt(getMarketPlanAllListData.total)}
          hqOrOperate={this.props.hqOrOperate}
          product_type={this.props.typeValue}
          post_marketPlanOffline={this.props.post_marketPlanOffline}
          post_marketPlanOnline={this.props.post_marketPlanOnline}
        />
      </div>
    );
  }
}

export default ListFinancialProgram;
