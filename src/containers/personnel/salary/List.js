import React from 'react';
import { Row, Col } from 'antd';
import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';
import BaseList from '../../../components/base/BaseList';

import SalaryTable from './Table';
import SalaryGroupFilter from '../SalaryGroupFilter';
import DepartmentFilter from '../DepartmentFilter';
import MonthRangeFilter from './MonthRangeFilter';

const now = new Date();

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      department: '0',
      salaryGroup: '',
      name: '',
      startMonth: formatter.month(new Date(now.getFullYear(), now.getMonth() - 1)),
      endMonth: formatter.month(new Date()),
      page: 1,
    };
  }

  render() {
    const {
      startMonth,
      endMonth,
    } = this.state;

    return (
      <div>
        <Row>
          <Col span={24}>
            <SalaryGroupFilter filterAction={this.handleRadioChange}/>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <DepartmentFilter filterAction={this.handleRadioChange}/>
          </Col>
          <Col span={16}>
            <MonthRangeFilter
              startMonth={startMonth}
              endMonth={endMonth}
              filterAction={this.handleDateChange}
            />
          </Col>
        </Row>

        <SalaryTable
          updateState={this.updateState}
          currentPage={this.state.page}
          source={api.user.getSalaryList(this.state)}
        />
      </div>
    );
  }
}
