import React from 'react';
import { Row, Col, Form, Select } from 'antd';

import api from '../../middleware/api';
import BaseList from '../../components/base/BaseList';
import SearchSelectBox from '../../components/widget/SearchSelectBox';
import Layout from '../../utils/FormLayout';

import Table from './TableAdmin';

const FormItem = Form.Item;
const Option = Select.Option;

export default class ListAdmin extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      companyId: '-1',
      isLogin: '',
      couponCardType: '',
    };
    [
      'handleStatusSelect',
      'handleSelectItem',
      'handleCompanySearch',
      'handleSelectCouponCard',
      'handleCouponCardTypeSearch',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleStatusSelect(value) {
    this.setState({ isLogin: value });
  }

  handleCompanySearch(key, successHandle) {
    const url = api.overview.companyList({ key });
    api.ajax({ url }, data => {
      data.res.list.length > 0 && this.setState({ companyId: data.res.list[0]._id });
      successHandle(data.res.list);
    }, () => {
    });
  }

  handleCouponCardTypeSearch(key, successHandle) {
    const url = api.coupon.getCouponCardTypeList(key, '0');

    if (!key) {
      this.setState({ couponCardType: '' });
    }

    api.ajax({ url }, data => {
      const { list } = data.res;
      list.unshift({ _id: '', name: '全部' });
      successHandle(data.res.list);
    }, () => {
    });
  }

  handleSelectItem(selectedItem) {
    this.setState({ companyId: selectedItem._id });
  }

  handleSelectCouponCard(selectedItem) {
    this.setState({ couponCardType: selectedItem._id });
  }

  render() {
    const { formItemFour } = Layout;
    return (
      <div>
        <Row>
          <Col span={6}>
            <label className="label pull-left mt4">门店</label>
            <SearchSelectBox
              style={{ width: 250, float: 'left' }}
              placeholder={'请输入门店名称'}
              onSearch={this.handleCompanySearch}
              displayPattern={item => item.name}
              onSelectItem={this.handleSelectItem}
              defaultIndex="0"
            />
          </Col>

          <Col span={7}>
            <FormItem label="套餐卡名称" {...formItemFour}>
              <SearchSelectBox
                style={{ width: 250, float: 'left' }}
                placeholder={'请输入套餐卡名称'}
                onSearch={this.handleCouponCardTypeSearch}
                displayPattern={item => item.name}
                onSelectItem={this.handleSelectCouponCard}
              />
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="注册状态" {...formItemFour}>
              <Select
                style={{ width: '200px' }}
                defaultValue="-2"
                onSelect={this.handleStatusSelect}
              >
                <Option value="-2">全部</Option>
                <Option value="1">已注册</Option>
                <Option value="0">未注册</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Table
          source={api.aftersales.maintainCustomerList(this.state)}
          page={this.state.page}
          updateState={this.updateState}
          state={this.state}
        />
      </div>
    );
  }
}
