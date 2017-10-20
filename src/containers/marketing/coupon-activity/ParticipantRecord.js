import React from 'react';
import { Row, Input, Select } from 'antd';

import api from '../../../middleware/api';

import Table from './TableParticipant';
import BaseList from '../../../components/base/BaseList';

const Search = Input.Search;
const Option = Select.Option;

export default class ParticipantRecord extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
      page: 1,
      activityId: props.activityId,
      inviterId: '',
      activityList: [],
      users: [],
    };
    [
      'getBargainActivityList',
      'handleSearch',
      'handleActivitySelect',
      'handleInviterSelect',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getUsers();
    this.getBargainActivityList();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ activityId: nextProps.activityId });
  }

  handleActivitySelect(id) {
    this.setState({ activityId: id });
  }

  handleInviterSelect(id) {
    this.setState({ inviterId: id });
  }

  handleSearch(e) {
    const key = e.target.value;
    this.setState({ key });
  }

  getUsers() {
    api.ajax({ url: api.user.getUsers() }, data => {
      this.setState({ users: data.res.user_list });
    });
  }

  getBargainActivityList() {
    api.ajax({
      url: api.coupon.couponActivityListAll(),
    }, data => {
      this.setState({ activityList: data.res.list });
      !this.props.activityId &&
      this.setState({ activityId: data.res.list[0] ? data.res.list[0]._id : '' });
    });
  }

  render() {
    const { page, activityList, activityId, users, reload } = this.state;

    return (
      <div>
        <Row className="head-action-bar-line mb20">
          <label className="label">活动名称</label>
          <Select
            placeholder="请选择活动"
            style={{ width: 200 }}
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
            style={{ width: '220px' }}
          />

          <label className="label ml20">邀请人</label>
          <Select
            placeholder="请选择邀请人"
            style={{ width: 200 }}
            onSelect={this.handleInviterSelect}
            size="large"
          >
            {/* <Option key="-1">全部</Option>*/}
            {users.map(item => <Option key={`${item._id}`}>{item.name}</Option>)}
          </Select>
        </Row>

        <Table
          page={page}
          source={api.coupon.couponActivityAttendList(this.state)}
          updateState={this.updateState}
          onSuccess={this.handleSuccess}
          reload={reload}
        />
      </div>
    );
  }
}
