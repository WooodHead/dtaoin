import React from 'react';
import { Input, Steps } from 'antd';

import api from '../../../../middleware/api';
import BaseList from '../../../../components/base/BaseList';

import Table from './Table';

const Search = Input.Search;
const Step = Steps.Step;

const sample = require('../../../../images/coupon/coupon_verification_sample.png');
const notFind = require('../../../../images/coupon/coupon_list_default_icon.png');

export default class Verificate extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      phone: '',
      isNew: true,
      list: [],
    };
    [
      'handleSearch',
      'handleGetList',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSearch(e) {
    const value = e.target.value;
    if (!!value) {
      this.setState({ isNew: false });
    } else {
      this.setState({ isNew: true });
    }

    this.setState({ phone: value });
  }

  handleGetList(list) {
    this.setState({ list, reload: false });
  }

  render() {
    const { page, isNew, list } = this.state;

    return (
      <div>
        <div className="coupon-verification">
          <div className="search">
            <label>用户：</label>
            <Search
              placeholder="请输入手机号搜索"
              className="search-input"
              onChange={this.handleSearch}
            />
          </div>

          <div className={isNew ? 'sample' : 'hide'}>
            <img src={sample} />
            <Steps direction="vertical" current={-1}>
              <Step title="搜索优惠券" description="请顾客出示短信，输入客户手机号搜索" />
              <Step title="核对信息" description="自行核对优惠券名称，面值等相关信息" />
              <Step title="核销优惠券"
                    description={
                      <div>
                        <p>在列表手动核销优惠券，顾客将在核销成功后收到短信提醒。</p>
                        <p>核销记录可在营销--优惠券核销页面查看</p>
                      </div>
                    }
              />
            </Steps>
          </div>

          <div className={(list.length > 0 || isNew) ? 'hide' : 'not-find'}>
            <img src={notFind} />
            <p>该用户暂无优惠券</p>
          </div>
        </div>

        <div className={(list.length > 0 && !isNew) ? '' : 'hide'} style={{ marginTop: '50px' }}>
          <Table
            page={page}
            source={api.coupon.searchCouponItemList(this.state)}
            updateState={this.updateState}
            onSuccess={this.handleSuccess}
            reload={this.state.reload}
            onGetList={this.handleGetList}
          />
        </div>
      </div>
    );
  }
}
