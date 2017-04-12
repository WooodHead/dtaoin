import React from 'react';
import {Tabs} from 'antd';
import api from '../../../middleware/api';
import UserInfo from './UserInfo';
// import SalaryTable from './SalaryTable';

export default class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.location.query.user_id,
      user: {},
      userCertificates: [],
      userSalaryItems: [],
      salaryHistory: [],
    };
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  componentDidMount() {
    let {userId} = this.state;
    this.getUserDetail(userId);
    this.getUserCertificates(userId);
    this.getUserSalaryItems(userId);
  }

  handleTabClick(key) {
    let {userId, salaryHistory} = this.state;
    if (key === 'salary' && salaryHistory.length === 0) {
      this.getSalaryHistory(userId);
    }
  }

  getUserDetail(userId) {
    api.ajax({url: api.user.getDetail(userId)}, function (data) {
      this.setState({user: data.res.user_info});
    }.bind(this));
  }

  getUserCertificates(userId){
    api.ajax({url: api.user.getCaList(userId)}, function(data){
      this.setState({userCertificates: data.res.user_ca_list});
    }.bind(this));
  }

  getUserSalaryItems(userId) {
    api.ajax({url: api.user.getSalaryItems(userId)}, function (data) {
      this.setState({userSalaryItems: data.res.user_salary_item_list});
    }.bind(this));
  }

  getSalaryHistory(userId) {
    api.ajax({url: api.user.getSalaryHistory(userId)}, function (data) {
      this.setState({salaryHistory: data.res.list});
    }.bind(this));
  }

  render() {
    const TabPane = Tabs.TabPane;
    let {
      user,
      userCertificates,
      userSalaryItems,
      // salaryHistory,
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
          {/*<TabPane tab="工资发放历史" key="salary">
            <SalaryTable salaryHistory={salaryHistory}/>
          </TabPane>*/}
        </Tabs>
      </div>
    );
  }
}
