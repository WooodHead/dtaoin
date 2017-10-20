import React from 'react';
import { Tabs } from 'antd';
import api from '../../../middleware/api';
import UserInfo from './UserInfo';

export default class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.match.params.userId,
      user: {},
      userCertificates: [],
      userSalaryItems: [],
      salaryHistory: [],
    };
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  componentDidMount() {
    const { userId } = this.state;
    this.getUserDetail(userId);
    this.getUserCertificates(userId);
  }

  handleTabClick(key) {
    const { userId, salaryHistory } = this.state;
    if (key === 'salary' && salaryHistory.length === 0) {
      this.getSalaryHistory(userId);
    }
  }

  getUserDetail(userId) {
    api.ajax({ url: api.user.getDetail(userId) }, data => {
      this.setState({ user: data.res.user_info });
    });
  }

  getUserCertificates(userId) {
    api.ajax({ url: api.user.getCaList(userId) }, data => {
      this.setState({ userCertificates: data.res.user_ca_list });
    });
  }

  getSalaryHistory(userId) {
    api.ajax({ url: api.user.getSalaryHistory(userId) }, data => {
      this.setState({ salaryHistory: data.res.list });
    });
  }

  render() {
    const TabPane = Tabs.TabPane;
    const {
      user,
      userCertificates,
      userSalaryItems,
    } = this.state;

    return (
      <div>
        <Tabs defaultActiveKey="user" onTabClick={this.handleTabClick}>
          <TabPane tab="员工信息" key="user">
            <UserInfo
              user={user}
              certificates={userCertificates}
              salaryItems={userSalaryItems}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
