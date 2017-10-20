import React from 'react';
import { Input, Cascader, Row, Select, Col, Button } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import BaseList from '../../../components/base/BaseList_';
import Table from './VehicleSchemeTable';

class ListVehicleScheme extends BaseList {
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
  }
  updatePage(page) {
    this.props.setPage(page);
  }
  render() {
    const { isFetching, getMarketListData, getMarketPlanAllListData, page,getProductListAllData } = this.props;
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
          <Row type="flex" justify="start">
            <Col span={7}>
              <label className="label">产品名称</label>
              <Select
                defaultValue="全部"
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
            <Col span={6}>
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
          product_type={this.props.product_type}
          post_marketPlanOnline={this.props.post_marketPlanOnline}
          post_marketPlanOffline={this.props.post_marketPlanOffline}
          post_marketPlanEditHot={this.props.post_marketPlanEditHot}
          get_planDetail={this.props.get_planDetail}
          getPlanDetailData={this.props.getPlanDetailData}
        />
      </div>
    );
  }
}

export default ListVehicleScheme;
