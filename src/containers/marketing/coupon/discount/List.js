import React from 'react';
import {Row, Col, Button, Select} from 'antd';
import {Link} from 'react-router';

import api from '../../../../middleware/api';

import SearchSelectBox from '../../../../components/widget/SearchSelectBox';
import BaseList from '../../../../components/base/BaseList';
import Table from './Table';

const Option = Select.Option;

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
      selectedItem: '',
      page: 1,
      type: 2,
      status: 0,
    };

    [
      'handleSearch',
      'handleSelectChange',
      'handleSelectItem',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSelectChange(value) {
    this.setState({status: value, page: 1});
  }

  handleSearch(key, successHandle, failHandle) {
    let {type, status} = this.state;
    let condition = {key, type, status};
    let url = api.coupon.getCouponList(condition);
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        this.setState({key: key});
        successHandle(data.res.list);
      } else {
        failHandle(data.msg);
      }
    }, (error) => {
      failHandle(error);
    });
  }

  handleSelectItem(selectedItem) {
    this.setState({selectedItem});
  }

  render() {
    let {page, selectedItem} = this.state;
    return (
      <div>
        <Row className="head-action-bar-line mb20">
          <Col span={19}>
            <SearchSelectBox
              style={{width: 250, float: 'left'}}
              placeholder={'请输入搜索名称'}
              onSearch={this.handleSearch}
              onSelectItem={this.handleSelectItem}
              displayPattern={item => item.name + '  ' + item.remark}
            />
            <label className="ml20">状态：</label>
            <Select size="large" defaultValue="0" onSelect={this.handleSelectChange} style={{width: 200}}>
              <Option value="-1">全部</Option>
              <Option value="1">停用</Option>
              <Option value="0">启用</Option>
            </Select>
          </Col>

          <Col span={5} className={api.getLoginUser().cooperationTypeName == 'TP顶级合伙店' ? 'hide' : ''}>
            <div className="pull-right">
              <Link to="/marketing/discount/new"><Button type="primary">创建折扣</Button></Link>
            </div>
          </Col>
        </Row>

        <Table
          page={page}
          source={api.coupon.getCouponList(this.state)}
          updateState={this.updateState}
          selectedItem={selectedItem}
        />
      </div>
    );
  }
}
