import React from 'react';
import {Button, Select, Row, Col, message} from 'antd';

import Table from './Table';

import SearchBox from '../../../components/widget/SearchBox';
import BaseList from '../../../components/base/BaseList';

import api from '../../../middleware/api';

const Option = Select.Option;

export default class List extends BaseList {

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      key: '',
      status: -1,
    };

    [
      'handleSearch',
      'handleStatusChange',
      'search',
    ].forEach((method) => this[method] = this[method].bind(this));
  }

  handleSearch(key, successHandle, failHandle) {
    this.search(key, this.state.status, 1, successHandle, failHandle);
    this.setState({key: key});
  }

  handleStatusChange(value) {
    this.setState({status: value, page: 1});
  }

  search(key, status, page, successHandle, failHandle) {
    successHandle || (successHandle = () => {
    });
    failHandle || (failHandle = (error) => {
      message.error(error);
    });
    page = page || 1;
    let url = api.coupon.getMemberCardTypeList(key, status, {page});
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        successHandle();
      } else {
        failHandle(data.msg);
      }
    }, (error) => {
      failHandle(error);
    });
  }

  render() {
    let {key, status, page} = this.state;
    return (
      <div>
        <Row className="head-action-bar-line mb20">
          <Col span={24}>
            <SearchBox
              style={{width: 300, float: 'left'}}
              placeholder={'请输入会员卡名字'}
              onSearch={this.handleSearch}
            />

            <span className="ml20">状态：</span>
            <Select
              style={{width: 120}}
              size="large"
              defaultValue="-1"
              onChange={this.handleStatusChange}
            >
              <Option key="-1" value="-1">全部</Option>
              <Option key="0" value="0">正常</Option>
              <Option key="1" value="1">未启用</Option>
            </Select>

            <Button
              type="primary"
              className={api.getLoginUser().cooperationTypeName == 'TP顶级合伙店' ? 'hide' : 'pull-right'}
              onClick={() => {
                location.href = '/marketing/membercard/new';
              }}
            >
              创建会员卡
            </Button>
          </Col>
        </Row>
        <Table
          page={page}
          source={api.coupon.getMemberCardTypeList(key, status, {page})}
          updateState={this.updateState}
        />
      </div>
    );
  }
}
