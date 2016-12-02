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
        <h3 className="page-title">财务-收入管理</h3>

        <Tabs defaultActiveKey="1">
          <TabPane tab="售前收入明细" key="1">
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
              pathname="/finance/income/list"
            />
          </TabPane>

          <TabPane tab="售后收入明细" key="2">
            <Row className="mb15">
              <Col span="24">
                <label className="margin-right-20">交易时间:</label>
                <RangePicker
                  showTime
                  format="yyyy-MM-dd HH:mm:ss"
                  defaultValue={[start_time, end_time]}
                  onChange={this.onChangeTime}
                />
              </Col>
            </Row>

            <Row className="mb15">
              <Col span="9">
                <label className="margin-right-20">支付类型:</label>
                <RadioGroup
                  defaultValue={0}
                  size="large"
                  onChange={this.handleConditionChange.bind(this,'','from_type')}>
                  <RadioButton value={0} key="0">全部</RadioButton>
                  {text.IncomeFromType.map((item) =>
                    <RadioButton
                      value={item.id}
                      key={item.id}>
                      {item.name}
                    </RadioButton>)
                  }
                </RadioGroup>
              </Col>
              <Col span="9">
                <label className="margin-right-20">结算状态:</label>
                <RadioGroup defaultValue={0} size="large" onChange={this.handleConditionChange.bind(this,'','status')}>
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
              pathname="/finance/income/list"
            />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
