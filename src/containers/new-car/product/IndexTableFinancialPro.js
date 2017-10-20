import React from 'react';
import { Input, Cascader, Row, Select, Col, Button } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import BaseList from '../../../components/base/BaseList_';
import Table from './TableIntention';

class OperateLoanLong extends BaseList {
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
  }
  updatePage(page) {
    this.props.setPage(page);
  }
  render() {
    const { isFetching, getMarketListData, getMarketProAllListData, page } = this.props;
    const getMarketListDataList = getMarketListData.list;
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
          <Row >
            <Col style={{ width:240,float:'left',marginRight:20 }}>
              <label className="label">资源方</label>
              <Select
                defaultValue="全部"
                size="large"
                onChange={e => {
                  this.props.changeRocues(e);
                }}
                style={{ width: 180 }}
                tabBarStyle={{ color: 'red' }}
              >
            	<Select.Option key="0" defaultValue="0" title="全部"> 全部</Select.Option>
                {rouceList}
              </Select>
            </Col>
            <Col style={{ width:240,float:'left' }}>
              <label className="label">状态</label>
              <Select
                defaultValue="0"
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
          list={getMarketProAllListData.list}
          total={parseInt(this.props.getMarketProAllListData.total)}
          hqOrOperate={this.props.hqOrOperate}
          typeValue={this.props.typeValue}
          get_productDetail={this.props.get_productDetail}
          post_marketProductOffline={this.props.post_marketProductOffline}
          post_marketProductOnline={this.props.post_marketProductOnline}
        />
      </div>
    );
  }
}
export default OperateLoanLong;
