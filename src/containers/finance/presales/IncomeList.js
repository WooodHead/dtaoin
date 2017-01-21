import React from 'react';
import {Row, Col, DatePicker} from 'antd';

import BaseList from '../../../components/base/BaseList';
import SearchBox from '../../../components/search/SearchBox';
import IncomeTable from './IncomeTable';

import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';

const RangePicker = DatePicker.RangePicker;

export default class PresalesIncomeList extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: props.location.query.page || 1,
      start_date: formatter.date(new Date(new Date().setMonth(new Date().getMonth() - 1))),
      end_date: formatter.date(new Date()),
      start_time: formatter.date(new Date(new Date().setMonth(new Date().getMonth() - 1))),
      end_time: formatter.date(new Date()),
      pay_type: '',
      plate_num: '',
      from_type: '0',
      status: '0',
    };
    [
      'handleSearchChange',
      'handleDateRange',
      'onChangeTime',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSearchChange(key) {
    if (key) {
      this.setState({plate_num: key});
    }
  }

  handleDateRange(value, dateString) {
    this.setState({
      start_date: dateString[0],
      end_date: dateString[1],
    });
  }

  onChangeTime(value, dateString) {
    this.setState({
      start_time: dateString[0],
      end_time: dateString[1],
    });
  }

  render() {
    let {
      start_date,
      end_date,
    } = this.state;

    return (
      <div>
        <Row className="mb10">
          <Col span={5}>
            <SearchBox
              change={this.handleSearchChange}
              style={{width: 220}}
            />
          </Col>
          <Col span={18}>
            <label className="mr5">交易时间:</label>
            <RangePicker
              showTime
              format={formatter.pattern.date}
              defaultValue={[formatter.getMomentDate(start_date), formatter.getMomentDate(end_date)]}
              onChange={this.handleDateRange}
            />
          </Col>
        </Row>

        <IncomeTable
          updateState={this.updateState}
          currentPage={this.state.page}
          source={api.getPresalesIncomeList(this.state)}
        />
      </div>
    );
  }
}
