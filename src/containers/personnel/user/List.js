import React from "react";
import {Button} from "antd";
import api from "../../../middleware/api";
import BaseList from "../../../components/base/BaseList";
import UserTable from "../../../components/tables/personnel/UserTable";
import SalaryGroupFilter from '../../../components/filters/SalaryGroupFilter';
import DepartmentFilter from '../../../components/filters/DepartmentFilter';

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      department: '0',
      salaryGroup: '0',
      key: '',
      page: props.location.query.page || 1
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({page: nextProps.location.query.page});
  }

  render() {
    return (
      <div>
        <h3 className="page-title">人事-员工管理</h3>

        <div>
          <SalaryGroupFilter filterAction={this.handleRadioChange} />
          <DepartmentFilter filterAction={this.handleRadioChange} />
        </div>
        
        <UserTable
          updateCondition={this.updateState}
          source={api.user.getList(this.state)}
          page={this.state.page}
          pathname="/personnel/user/list"
        />
      </div>
    )
  }
}
