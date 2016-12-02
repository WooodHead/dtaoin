import React from "react";
import {Tabs, Button, Radio, Row, Col, DatePicker} from "antd";
import api from "../../middleware/api";
import text from "../../middleware/text";
import formatter from "../../middleware/formatter";
import SearchBox from "../../components/search/SearchBox";
import BaseList from "../../components/base/BaseList";
import NewIncomeStatementModal from "../../components/modals/finance/NewIncomeStatementModal";
import PresalesIncomeTable from "../../components/tables/finance/PresalesIncomeTable";

const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const TabPane = Tabs.TabPane;

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
      status: '0'
    };
    [
      'handleSearchChange',
      'handleDateRange',
      'onChangeTime'
    ].map(method => this[method] = this[method].bind(this))
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      page: nextProps.location.query.page
    });
  }

  handleSearchChange(key) {
    if (key) {
      this.setState({plate_num: key});
    }
  }

  handleDateRange(value, dateString) {
    this.setState({
      start_date: dateString[0],
      end_date: dateString[1]
    });
  }

  onChangeTime(value, dateString) {
    this.setState({
      start_time: dateString[0],
      end_time: dateString[1]
    });
  }

  render() {
    let {
      start_date,
      end_date,
      start_time,
      end_time
    } = this.state;

    return (
      <div>
        <h3 className="page-title">财务-售前收入管理</h3>

        <div>
            <Row className="mb15">
              <Col span="24">
                <label className="margin-right-20">交易时间:</label>
                <RangePicker
                  showTime
                  format="yyyy-MM-dd HH:mm:ss"
                  defaultValue={[start_date, end_date]}
                  onChange={this.handleDateRange}
                />
              </Col>
            </Row>

            <SearchBox
              change={this.handleSearchChange}
              style={{width: 220}}
            />

            <PresalesIncomeTable
              source={api.getPresalesIncomeList(this.state)}
              page={this.state.page}
              pathname="/finance/presales-income/list"
            />
          </div>
      </div>
    )
  }
}
