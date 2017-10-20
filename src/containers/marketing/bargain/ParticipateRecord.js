import React from 'react';
import { Row, Input, Select } from 'antd';

import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';
import Table from './TablePrize';

const Search = Input.Search;
const Option = Select.Option;

export default class ParticipateRecord extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
      inviterId: '',
      page: 1,
      activityId: props.activityId || '',
      status: '',
      activityList: [],
      users: [],
    };

    [
      'getBargainActivityList',
      'handleStatusChange',
      'handleSearch',
      'handleActivitySelect',
      'handleInviterSelect',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getBargainActivityList();
    this.getUsers();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ activityId: nextProps.activityId });
  }

  handleStatusChange(value) {
    this.setState({ status: value });
  }

  handleSearch(e) {
    const key = e.target.value;
    this.setState({ key });
  }

  handleActivitySelect(id) {
    this.setState({ activityId: id });
  }

  handleInviterSelect(id) {
    this.setState({ inviterId: id });
  }

  getBargainActivityList() {
    api.ajax({
      url: api.coupon.bargainActivityList(this.state, true),
      type: 'get',
    }, data => {
      this.setState({ activityList: data.res.list });
      !this.props.activityId &&
      this.setState({ activityId: data.res.list[0] ? data.res.list[0]._id : '' });
    });
  }

  getUsers() {
    api.ajax({ url: api.user.getUsers() }, data => {
      this.setState({ users: data.res.user_list });
    });
  }

  render() {
    const { page, selectedItem, activityList, activityId, users } = this.state;
    return (
      <div>
        <Row className="head-action-bar-line mb20">
          <label className="label">活动名称</label>
          <Select
            placeholder="请选择活动"
            style={{ width: 170 }}
            onSelect={this.handleActivitySelect}
            size="large"
            value={activityId || (activityList[0] && activityList[0]._id)}
            disabled={!!this.props.activityId}
          >
            {activityList.map(item => <Option key={`${item._id}`}>{item.title}</Option>)}
          </Select>

          <label className="label ml20">搜索用户</label>
          <Search
            placeholder="请输入手机号或微信昵称搜索"
            onChange={this.handleSearch}
            size="large"
            style={{ width: 220 }}
          />

          <label className="label ml20">邀请人</label>
          <Select
            placeholder="请选择邀请人"
            style={{ width: 160 }}
            onSelect={this.handleInviterSelect}
            size="large"
          >
            {/* <Option key="-1">全部</Option>*/}
            {users.map(item => <Option key={`${item._id}`}>{item.name}</Option>)}
          </Select>

          <label className="label ml20">状态</label>
          <Select
            placeholder="请选择活动"
            showSearch
            style={{ width: 160 }}
            onSelect={this.handleStatusChange}
            size="large"
            defaultValue="-1"
          >
            <Option key="-1">全部</Option>
            <Option key="0">未兑奖</Option>
            <Option key="1">已兑奖</Option>
          </Select>
        </Row>

        <Table
          page={page}
          source={api.coupon.bargainActivityAttendList(this.state)}
          updateState={this.updateState}
          selectedItem={selectedItem}
          onSuccess={this.handleSuccess}
          reload={this.state.reload}
        />
      </div>
    );
  }
}
