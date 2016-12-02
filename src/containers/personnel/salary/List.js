import React from "react";
import {Row, Col, Button} from "antd";
import api from "../../../middleware/api";
import formatter from "../../../middleware/formatter";
import BaseList from "../../../components/base/BaseList";

import SalaryTable from "../../../components/tables/personnel/SalaryTable";
import SalaryGroupFilter from '../../../components/filters/SalaryGroupFilter';
import DepartmentFilter from '../../../components/filters/DepartmentFilter';
import MonthRangeFilter from '../../../components/filters/MonthRangeFilter';

let now = new Date();

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      department: '0',
      salaryGroup: '',
      key: '',
      startMonth: formatter.month(new Date(now.getFullYear(), now.getMonth() -1)),
      endMonth: formatter.month(new Date()),
      page: props.location.query.page || 1
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({page: nextProps.location.query.page});
  }

  render() {
    let {
      startMonth,
      endMonth
    } = this.state;
    return (
      <div>
        <h3 className="page-title">人事-薪资管理</h3>

        <Row>
          <Col span="24">
            <SalaryGroupFilter filterAction={this.handleRadioChange} />
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <DepartmentFilter filterAction={this.handleRadioChange} />  
          </Col>
          <Col span="16">
            <MonthRangeFilter 
              startMonth={startMonth}
              endMonth={endMonth}
              filterAction={this.handleDateChange}
            />
          </Col>
        </Row>

        <SalaryTable
          updateCondition={this.updateState}
          source={api.user.getSalaryList(this.state)}
          page={this.state.page}
          pathname="/personnel/salary/list"
        />
      </div>
    )
  }
}
