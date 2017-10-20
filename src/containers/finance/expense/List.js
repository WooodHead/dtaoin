import React from 'react';
import { Row, Col, Select } from 'antd';

import formatter from '../../../utils/DateFormatter';
import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';
import DateRangeSelector from '../../../components/widget/DateRangeSelector';

import NewExpenseModal from './NewExpense';
import NewIncomeModal from './NewIncome';
import Table from './Table';

const Option = Select.Option;

export default class List extends BaseList {
  constructor(props) {
    super(props);
    const now = new Date();
    this.state = {
      incomeShow: this.props.match.params.incomeShow || false,
      expenseShow: this.props.match.params.expenseShow || false,
      startTime: formatter.day(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)),
      endTime: formatter.day(now),
      balancePaymentsType: '-1',
      page: 1,
      projectTypes: [],
      projectType: '0',
      endOpen: false,
    };

    [
      'getProjectTypes',
      'handleProjectSelectChange',
      'handleBalancePaymentsSelectChange',
      'handleDateChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getProjectTypes();
  }

  handleProjectSelectChange(value) {
    this.setState({ projectType: value, page: 1 });
  }

  handleBalancePaymentsSelectChange(value) {
    this.setState({ balancePaymentsType: value, page: 1 });
  }

  getProjectTypes() {
    let projectTypes = [];
    api.ajax({ url: api.finance.getProjectTypeList('-1', 1) }, data => {
      projectTypes = data.res.list;
      projectTypes.unshift({ _id: '0', name: '全部' });
      this.setState({ projectTypes });
    }, () => {
    });
  }

  handleDateChange(startTime, endTime) {
    this.setState({ startTime, endTime });
  }

  render() {
    const {
      projectTypes,
      startTime,
      endTime,
      page,
      expenseShow,
      incomeShow,
      projectType,
      balancePaymentsType,
    } = this.state;

    return (
      <div>
        <Row className="mb10">
          <Col span={24}>
            <label className="">收支款日期：</label>
            <DateRangeSelector
              onDateChange={this.handleDateChange}
              startTime={startTime}
              endTime={endTime}
            />

            <label className="ml20">收支：</label>
            <Select
              size="large"
              defaultValue="-1"
              onSelect={this.handleBalancePaymentsSelectChange}
              style={{ width: 200 }}
            >
              <Option value="-1">全部</Option>
              <Option value="0">收入</Option>
              <Option value="1">支出</Option>
            </Select>

            <span className="pull-right">
              <NewExpenseModal expenseShow={expenseShow} />
            </span>
            <span className="pull-right">
              <NewIncomeModal incomeShow={incomeShow} />
            </span>
          </Col>
        </Row>

        <Row className="mb10">
          <label style={{ marginLeft: '41px' }}>项目：</label>
          <Select
            size="large"
            value={projectType}
            onSelect={this.handleProjectSelectChange}
            style={{ width: 164 }}
          >
            {projectTypes.map(type => <Option key={type._id}>{type.name}</Option>)}
          </Select>
        </Row>

        <span className="expense-list">
          <Table
            page={page}
            source={api.finance.getExpenseList(page, startTime, endTime, balancePaymentsType, projectType)}
            updateState={this.updateState}
          />
        </span>
      </div>
    );
  }
}
