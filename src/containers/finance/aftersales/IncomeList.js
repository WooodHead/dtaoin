import React from 'react';
import { Radio, Row, Col, DatePicker } from 'antd';
import api from '../../../middleware/api';
import text from '../../../config/text';
import formatter from '../../../utils/DateFormatter';
import BaseList from '../../../components/base/BaseList';
import NewIncomeStatementModal from './NewIncome';
import IncomeTable from './IncomeTable';

const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

export default class MaintIncomeList extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      start_date: formatter.date(new Date(new Date().setMonth(new Date().getMonth() - 1))),
      end_date: formatter.date(new Date()),
      start_time: formatter.date(new Date(new Date().setMonth(new Date().getMonth() - 1))),
      end_time: formatter.date(new Date()),
      pay_type: '',
      account_type: '-1',
      status: '0',
      transfer_status: '0',
    };
    [
      'handleDateRange',
      'handleTimeChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleDateRange(value, dateString) {
    this.setState({
      start_date: dateString[0],
      end_date: dateString[1],
    });
  }

  handleTimeChange(value, dateString) {
    this.setState({
      start_time: dateString[0],
      end_time: dateString[1],
      page: 1,
    });
  }

  render() {
    const {
      start_time,
      end_time,
    } = this.state;

    return (
      <div>
        <Row className="mb15">
          <Col span={9}>
            <label className="mr20">交易时间:</label>
            <RangePicker
              showTime
              format={formatter.pattern.date}
              defaultValue={[formatter.getMomentDate(start_time), formatter.getMomentDate(end_time)]}
              onChange={this.handleTimeChange}
              allowClear={false}
            />
          </Col>
          <Col span={9}>
            <label className="mr20">收款类型:</label>
            <RadioGroup
              defaultValue={-1}
              size="large"
              onChange={this.handleConditionChange.bind(this, '', 'account_type')}
            >
              <RadioButton value={-1} key="-1">全部</RadioButton>
              {text.IncomeAccountType.map(item =>
                <RadioButton value={item.id} key={item.id}>{item.name}</RadioButton>)
              }
            </RadioGroup>
          </Col>
        </Row>

        <Row className="mb15">
          <Col span={9}>
            <label className="mr20">对账状态:</label>
            <RadioGroup
              defaultValue={0}
              size="large"
              onChange={this.handleConditionChange.bind(this, '', 'status')}
            >
              <RadioButton value={0} key="0">全部</RadioButton>
              {text.IncomeStatus.map(item =>
                <RadioButton value={item.id} key={item.id}>{item.name}</RadioButton>)
              }
            </RadioGroup>
          </Col>
          <Col span={9}>
            <label className="mr20">门店间结算状态:</label>
            <RadioGroup
              defaultValue={0} size="large"
              onChange={this.handleConditionChange.bind(this, '', 'transfer_status')}
            >
              <RadioButton value={0} key="0">全部</RadioButton>
              {text.IncomeStatus.map(item =>
                <RadioButton value={item.id} key={item.id}>{item.name}</RadioButton>)
              }
            </RadioGroup>
          </Col>
          <Col span={6}>
            <div className="pull-right">
              <NewIncomeStatementModal />
            </div>
          </Col>
        </Row>

        <IncomeTable
          updateState={this.updateState}
          currentPage={this.state.page}
          source={api.finance.getIncomeList(this.state)}
        />
      </div>
    );
  }
}
