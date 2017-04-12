import React from 'react';
import {DatePicker, Select, Row, Col, message} from 'antd';

import formatter from '../../../utils/DateFormatter';
import api from '../../../middleware/api';

import SearchBox from '../../../components/widget/SearchBox';
import BaseList from '../../../components/base/BaseList';

import Table from './TableSaleLogs';

const Option = Select.Option;
let lastDate = new Date(new Date().setDate(new Date().getDate() - 1));

export default class SaleLogs extends BaseList {
  constructor(props) {
    super(props);
    let now = new Date();
    this.state = {
      page: 1,
      key: '',                                    //搜索关键词
      memberCardStatus: '0',                      //会员卡状态
      memberCardTypeList: [],                     //会员卡类型列表
      currentCardTypeID: '',                      //选中的卡类型
      startDate: formatter.day(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)),                    //开始时间
      endDate: formatter.day(now),     //结束时间
      endOpen: false,
    };

    [
      'handleSearch',
      'handleCardTypeChange',
      'handlePaginationChange',
      'disabledEndDate',
      'handleStartOpenChange',
      'handleEndOpenChange',
    ].map((method) => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getMemberCardTypes();
  }

  handlePaginationChange(page) {
    this.setState({
      page: page,
    }, () => {
      this.search('', this.state.currentCardTypeID, [this.state.startDate, this.state.endDate], this.state.page);
    });
  }

  search(key, cardTypeId, dates, page, successHandle, failHandle) {
    successHandle || (successHandle = () => {
    });
    failHandle || (failHandle = (error) => {
      message.error(error);
    });
    page = page || this.props.location.query.page || 1;
    let url = api.coupon.getMemberOrderList(key, cardTypeId, dates[0], dates[1], {page});
    api.ajax({url}, (data) => {
      this.setState({isFetching: true});
      if (data.code === 0) {
        successHandle();
      } else {
        failHandle(data.msg);
      }
    }, (error) => {
      failHandle(error);
    });
  }

  handleSearch(keyword, successHandle, failHandle) {
    const {currentCardTypeID, startDate, endDate} = this.state;
    this.search(keyword, currentCardTypeID, [startDate, endDate], 1, successHandle, failHandle);
    this.setState({key: keyword});
  }

  handleCardTypeChange(value) {
    this.setState({currentCardTypeID: value, page: 1});
  }

  handleStartTimeChange(value) {
    this.setState({startDate: formatter.day(value)});
  }

  handleEndTimeChange(value) {
    this.setState({endDate: formatter.day(value)});
  }

  handleStartOpenChange(open) {
    if (!open) {
      this.setState({endOpen: true});
    }
  }

  handleEndOpenChange(open) {
    this.setState({endOpen: open});
  }

  getMemberCardTypes() {
    let url = api.coupon.getMemberCardTypeList(this.state.key, this.state.memberCardStatus, {
      page: 1,
      pageSize: 100,
    });
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        this.setState({
          memberCardTypeList: data.res.list,
          totalPagination: Number(data.res.total) || 1,
        });
      } else {
        message.error(data.msg);
      }
    }, (error) => {
      message.error(error);
    });
  }

  disabledStartDate(current) {
    return current && current.valueOf() >= lastDate;
  }

  disabledEndDate(current) {
    let {startDate} = this.state;
    return current && (current.valueOf() >= lastDate || current.valueOf() <= new Date(startDate));
  }

  render() {
    const memberCardTypeList = this.state.memberCardTypeList || [];
    let {key, currentCardTypeID, startDate, endDate, page, endOpen} = this.state;
    return (
      <div>
        <Row className="head-action-bar-line mb20">
          <Col span={24}>
            <SearchBox
              style={{width: 300, float: 'left'}}
              placeholder={'请输入手机号、卡号搜索'}
              onSearch={this.handleSearch}
              autoSearchLength={3}
            />

            <span className="ml20">会员卡名称：</span>
            <Select
              style={{width: 150}}
              size="large"
              defaultValue={currentCardTypeID}
              onChange={this.handleCardTypeChange}
            >
              <Option value="">全部</Option>
              {
                memberCardTypeList.map((memberCardType) => {
                  return <Option key={memberCardType._id} value={memberCardType._id}>{memberCardType.name}</Option>;
                })
              }
            </Select>

            <span className="ml20">开卡日期：</span>

            <DatePicker
              disabledDate={this.disabledStartDate}
              format={formatter.pattern.day}
              defaultValue={formatter.getMomentDate(startDate)}
              onChange={this.handleStartTimeChange.bind(this)}
              onOpenChange={this.handleStartOpenChange.bind(this)}
              allowClear={false}
            />
            -
            <DatePicker
              disabledDate={this.disabledEndDate}
              format={formatter.pattern.day}
              defaultValue={formatter.getMomentDate(endDate)}
              onChange={this.handleEndTimeChange.bind(this)}
              open={endOpen}
              onOpenChange={this.handleEndOpenChange.bind(this)}
              allowClear={false}
            />
          </Col>

        </Row>

        <Table
          page={page}
          source={api.coupon.getMemberOrderList({key, currentCardTypeID, startDate, endDate, page})}
          updateState={this.updateState}
        />
      </div>
    );
  }
}
