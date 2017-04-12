import React from 'react';
import {Row, Col, DatePicker, Select} from 'antd';

import formatter from '../../../utils/DateFormatter';
import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';

import NewExpenseModal from './NewExpense';
import NewIncomeModal from './NewIncome';
import Table from './Table';

const Option = Select.Option;
let lastDate = new Date(new Date().setDate(new Date().getDate() - 1));

export default class List extends BaseList {
  constructor(props) {
    super(props);
    let now = new Date();
    this.state = {
      incomeShow: this.props.location.query.incomeShow || false,
      expenseShow: this.props.location.query.expenseShow || false,
      startTime: formatter.day(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)),
      endTime: formatter.day(now),
      balancePaymentsType: '-1',
      page: props.location.query.page || 1,
      projectTypes: [],
      projectType: '0',
      endOpen: false,
    };

    [
      'getProjectTypes',
      'handleDateRangeChange',
      'handleProjectSelectChange',
      'handleBalancePaymentsSelectChange',
      'handleStartOpenChange',
      'handleEndOpenChange',
      'handleStartTimeChange',
      'handleEndTimeChange',
      'disabledEndDate',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getProjectTypes();
  }

  handleDateRangeChange(momentTime, stringTime) {
    let startTime = stringTime[0];
    let endTime = stringTime[1];
    this.setState({
      startTime,
      endTime,
      page: 1,
    });
  }

  handleProjectSelectChange(value) {
    this.setState({projectType: value, page: 1});
  }

  handleBalancePaymentsSelectChange(value) {
    this.setState({balancePaymentsType: value, page: 1});
  }

  getProjectTypes() {
    let projectTypes = [];
    api.ajax({url: api.finance.getProjectTypeList('-1', 1)}, data => {
      projectTypes = data.res.list;
      projectTypes.unshift({_id: '0', name: '全部'});
      this.setState({projectTypes});
    }, () => {
    });
  }

  handleStartOpenChange(open) {
    if (!open) {
      this.setState({endOpen: true});
    }
  }

  handleEndOpenChange(open) {
    this.setState({endOpen: open});
  }

  handleStartTimeChange(value) {
    this.setState({startTime: formatter.day(value)});
  }

  handleEndTimeChange(value) {
    this.setState({endTime: formatter.day(value)});
  }

  disabledStartDate(current) {
    return current && current.valueOf() >= lastDate;
  }

  disabledEndDate(current) {
    let {startTime} = this.state;
    return current && (current.valueOf() >= lastDate || current.valueOf() <= new Date(startTime));
  }

  render() {
    let {
      projectTypes,
      startTime,
      endTime,
      page,
      expenseShow,
      incomeShow,
      projectType,
      balancePaymentsType,
      endOpen,
    } = this.state;

    return (
      <div>
        <Row className="mb15">
          <Col span={24}>
            <label className="">收支款日期：</label>

            <DatePicker
              disabledDate={this.disabledStartDate}
              format={formatter.pattern.day}
              defaultValue={formatter.getMomentDate(startTime)}
              onChange={this.handleStartTimeChange.bind(this)}
              onOpenChange={this.handleStartOpenChange.bind(this)}
              allowClear={false}
            />
            -
            <DatePicker
              disabledDate={this.disabledEndDate}
              format={formatter.pattern.day}
              defaultValue={formatter.getMomentDate(endTime)}
              onChange={this.handleEndTimeChange.bind(this)}
              open={endOpen}
              onOpenChange={this.handleEndOpenChange.bind(this)}
              allowClear={false}
            />

            <label className="ml20">收支：</label>
            <Select
              size="large"
              defaultValue="-1"
              onSelect={this.handleBalancePaymentsSelectChange}
              style={{width: 200}}
            >
              <Option value="-1">全部</Option>
              <Option value="0">收入</Option>
              <Option value="1">支出</Option>
            </Select>

            <label className="ml20">项目：</label>
            <Select
              size="large"
              value={projectType}
              onSelect={this.handleProjectSelectChange}
              style={{width: 200}}>
              {projectTypes.map(type => <Option key={type._id}>{type.name}</Option>)}
            </Select>

            <span className="pull-right">
              <NewExpenseModal expenseShow={expenseShow}/>
            </span>
            <span className="pull-right">
              <NewIncomeModal incomeShow={incomeShow}/>
            </span>
          </Col>
        </Row>

        <Table
          page={page}
          source={api.finance.getExpenseList(page, startTime, endTime, balancePaymentsType, projectType)}
          updateState={this.updateState}
        />
      </div>
    );
  }
}
