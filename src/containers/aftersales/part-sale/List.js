import React from 'react';
import {Row, Col, Button, Select} from 'antd';
import {Link} from 'react-router';

import api from '../../../middleware/api';

import SearchSelectBox from '../../../components/widget/SearchSelectBox';
import BaseList from '../../../components/base/BaseList';

import Table from './Table';

const Option = Select.Option;

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
      selectedItem: '',
      page: 1,
      status: -1,
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
    let {status} = this.state;
    let condition = {key, status, page: 1};
    let url = api.aftersales.getPartSellList(condition);
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
        <Row className="mb15">
          <Col span={19}>
            <SearchSelectBox
              style={{width: 250, float: 'left'}}
              placeholder={'请输入手机号、单号搜索'}
              onSearch={this.handleSearch}
              onSelectItem={this.handleSelectItem}
              displayPattern={item => item.customer_name + '  ' + item.customer_phone}
            />

            <label className="ml20">结算状态： </label>
            <Select size="large" defaultValue="-1" onSelect={this.handleSelectChange} style={{width: 200}}>
              <Option value="-1">全部</Option>
              <Option value="0">未支付</Option>
              <Option value="1">挂账</Option>
              <Option value="2">已支付</Option>
            </Select>
          </Col>

          <Col span={5}>
            <div className="pull-right">
              <Link to="/aftersales/part-sale/new" target="_black"><Button type="primary">配件销售</Button></Link>
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
