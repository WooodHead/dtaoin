import React from 'react';
import {Row, Col, DatePicker, Button, Radio, Card} from 'antd';
import formatter from '../../middleware/formatter';
import api from "../../middleware/api";
import DateRangeSelector from '../../components/widget/DateRangeSelector'
import PresalesSummary from "../../components/card/dashboard/PresalesSummary";
import PresalesIntention from "../../components/card/dashboard/PresalesIntention";
import PresalesIncome from "../../components/card/dashboard/PresalesIncome";
import PresalesIntentionLost from "../../components/card/dashboard/PresalesIntentionLost";

class PresalesStatistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: formatter.date(new Date(new Date().setMonth(new Date().getMonth() - 1))),
      endTime: formatter.date(new Date()),
      potentialCustomers: 0,
      dealAutos: 0,
      purchaseIncomeTotal: 0,
      chartTitle: '',
      chartData: [],
      intentionLostInfo: [],
      levelList: [],
      budgetList: [],
      mortgageList: [],
      incomeInfo: {},
      customerSource: []
    };
    [
      'handleDateChange',
      'handleChartData'
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    let {
      startTime,
      endTime
    } = this.state;

    this.getPurchaseSummary(startTime, endTime);
    this.getNewPotentialDaysData(startTime, endTime);
    this.getIncomeInfo(startTime, endTime);
    this.getIntentionLost(startTime, endTime);
    this.getIntentionInfo(startTime, endTime);
    this.getCustomerSource(startTime, endTime);
  }

  handleDateChange(startTime, endTime) {
    this.setState({
      startTime: startTime,
      endTime: endTime
    });
    this.refreshData(startTime, endTime);
  }

  handleChartData(method) {
    let {
      startTime,
      endTime
    } = this.state;
    this[method](startTime, endTime);
  }

  refreshData(startTime, endTime){
    this.getPurchaseSummary(startTime, endTime);
    this.getNewPotentialDaysData(startTime, endTime);
    this.getIntentionLost(startTime, endTime);
    this.getIntentionInfo(startTime, endTime);
    this.getCustomerSource(startTime, endTime);
  }

  getPurchaseSummary(startTime, endTime) {
    api.ajax({url: api.statistics.getPurchaseSummary(startTime, endTime)}, function (data) {
      let res = data.res;
      this.setState({
        potentialCustomers: res.potential_customers,
        dealAutos: res.deal_autos,
        purchaseIncomeTotal: res.purchase_income_total
      })
    }.bind(this))
  }

  getNewPotentialDaysData(startTime, endTime) {
    api.ajax({url: api.statistics.getNewPotentialDaysData(startTime, endTime)}, function (data) {
      this.setState({
        chartTitle: '新增潜在客户',
        chartUnit: '用户(位)',
        chartData: data.res.list
      })
    }.bind(this))
  }

  getNewDealDaysData(startTime, endTime) {
    api.ajax({url: api.statistics.getNewDealDaysData(startTime, endTime)}, function (data) {
      this.setState({
        chartTitle: '成交台次',
        chartUnit: '台次(台)',
        chartData: data.res.list
      })
    }.bind(this))
  }

  getIncomesDaysData(startTime, endTime) {
    api.ajax({url: api.statistics.getIncomesDaysData(startTime, endTime)}, function (data) {
      let list = data.res.list;
      this.setState({
        chartTitle: '总收入',
        chartUnit: '收入(元)',
        chartData: list
      })
    }.bind(this))
  }

  getIncomeInfo(startTime, endTime) {
    api.ajax({url: api.statistics.getPurchaseIncomeInfo(startTime, endTime)}, function (data) {
      this.setState({incomeInfo: data.res.income})
    }.bind(this))
  }

  getIntentionLost(startTime, endTime) {
    api.ajax({url: api.statistics.getIntentionLostInfo(startTime, endTime)}, function (data) {
      this.setState({intentionLostInfo: data.res.list})
    }.bind(this))
  }

  getIntentionInfo(startTime, endTime) {
    api.ajax({url: api.statistics.getIntentionInfo(startTime, endTime)}, function (data) {
      let res = data.res;
      this.setState({
        levelList: res.level_list,
        budgetList: res.budget_list,
        mortgageList: res.mortgage_list
      })
    }.bind(this))
  }

  getCustomerSource(startTime, endTime) {
    api.ajax({url: api.statistics.getCustomerSource(startTime, endTime)}, function (data) {
      this.setState({customerSource: data.res.source_list})
    }.bind(this))
  }

  render() {
    let {
      potentialCustomers,
      dealAutos,
      purchaseIncomeTotal,
      chartTitle,
      chartUnit,
      chartData,
      intentionLostInfo,
      levelList,
      budgetList,
      mortgageList,
      incomeInfo,
      customerSource
    } = this.state;

    return (
      <div>
        <h3 className="page-title">报表-销售业务</h3>

        <DateRangeSelector onDateChange={this.handleDateChange}/>

        <PresalesSummary
          loadChart={this.handleChartData}
          potentialCustomers={potentialCustomers}
          dealAutos={dealAutos}
          purchaseIncomeTotal={purchaseIncomeTotal}
          chartTitle={chartTitle}
          chartUnit={chartUnit}
          chartData={chartData}
        />

        <PresalesIntention
          levelList={levelList}
          budgetList={budgetList}
          mortgageList={mortgageList}
          customerSource={customerSource}
        />

        <Row gutter={16}>
          <Col span="12">
            <PresalesIncome source={incomeInfo}/>
          </Col>
          <Col span="12">
            <PresalesIntentionLost source={intentionLostInfo}/>
          </Col>
        </Row>
      </div>
    )
  }
}

export default PresalesStatistics;
