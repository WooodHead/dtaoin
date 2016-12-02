import React from "react";
import {Tabs, Button, Radio, Row, Col, DatePicker} from "antd";
import api from "../../middleware/api";
import text from "../../middleware/text";
import formatter from "../../middleware/formatter";
import SearchBox from "../../components/search/SearchBox";
import BaseList from "../../components/base/BaseList";
import NewIncomeStatementModal from "../../components/modals/finance/NewIncomeStatementModal";
import PresalesIncomeTable from "../../components/tables/finance/PresalesIncomeTable";
import AftersalesIncomeTable from "../../components/tables/finance/AftersalesIncomeTable";

const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const TabPane = Tabs.TabPane;

export default class MaintIncomeList extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: props.location.query.page || 1,
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
      'onChangeTime'
    ].map(method => this[method] = this[method].bind(this))
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      page: nextProps.location.query.page
    });
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
        <h3 className="page-title">财务-收入管理</h3>


        <div>
            <Row className="mb15">
              <Col span="9">
                <label className="margin-right-20">交易时间:</label>
                <RangePicker
                  showTime
                  format="yyyy-MM-dd HH:mm:ss"
                  defaultValue={[start_time, end_time]}
                  onChange={this.onChangeTime}
                />
              </Col>
              <Col span="9">
                <label className="margin-right-20">收款类型:</label>
                <RadioGroup
                  defaultValue={-1}
                  size="large"
                  onChange={this.handleConditionChange.bind(this,'','account_type')}>
                  <RadioButton value={-1} key="-1">全部</RadioButton>
                  {text.IncomeAccountType.map((item) =>
                    <RadioButton
                      value={item.id}
                      key={item.id}>
                      {item.name}
                    </RadioButton>)
                  }
                </RadioGroup>
              </Col>
            </Row>

            <Row className="mb15">
              <Col span="9">
                <label className="margin-right-20">对账状态:</label>
                <RadioGroup
                  defaultValue={0}
                  size="large"
                  onChange={this.handleConditionChange.bind(this,'','status')}>
                  <RadioButton value={0} key="0">全部</RadioButton>
                  {text.IncomeStatus.map((item) =>
                    <RadioButton
                      value={item.id}
                      key={item.id}>
                      {item.name}
                    </RadioButton>)
                  }
                </RadioGroup>
              </Col>
              <Col span="9">
                <label className="margin-right-20">门店间结算状态:</label>
                <RadioGroup defaultValue={0} size="large" onChange={this.handleConditionChange.bind(this,'','transfer_status')}>
                  <RadioButton value={0} key="0">全部</RadioButton>
                  {text.IncomeStatus.map((item) =>
                    <RadioButton
                      value={item.id}
                      key={item.id}>
                      {item.name}
                    </RadioButton>)}
                </RadioGroup>
              </Col>
              <Col span="6">
                <span className="pull-right">
                  <NewIncomeStatementModal />
                </span>
              </Col>
            </Row>

            <AftersalesIncomeTable
              source={api.getIncomeList(this.state)}
              page={this.state.page}
              pathname="/finance/aftersales-income/list"
            />
         </div>
      </div>
    )
  }
}
