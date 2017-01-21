import React from 'react';
import {Row, Col} from 'antd';
import formatter from '../../utils/DateFormatter';
import api from '../../middleware/api';
import CurrentDateRangeSelector from '../../components/CurrentDateRangeSelector';
import text from '../../config/text';
import PresalesSummary from './PresalesSummary';
import PresalesIntention from './PresalesIntention';
import PresalesIncome from './PresalesIncome';
import PresalesIntentionLost from './PresalesIntentionLost';

class PresalesStatistics extends React.Component {
  constructor(props) {
    super(props);
    //昨天日期
    let lastDate = new Date(new Date().setDate(new Date().getDate() - 1));
    this.state = {
      startTime: formatter.day(new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + 1 - (lastDate.getDay() || 7))),
      endTime: formatter.day(lastDate),
      dealAutos: 0,
      purchaseIncomeTotal: 0,
      intentionCustomerCount: 0,
      intentionIntentionCount: 0,
      failCustomerCount: 0,
      failIntentionCount: 0,
      chartTitle: '',
      intentionLostInfo: [],
      intentionLostSubInfo: [],
      levelList: [],
      budgetList: [],
      mortgageList: [],
      incomeInfo: {},
      customerSource: [],
      categories: [],
      series: [],
    };
    [
      'handleDateChange',
      'handleChartData',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    let {startTime, endTime} = this.state;

    this.getPurchaseSummary(startTime, endTime);
    this.getNewPotentialAndIntentionDaysData(startTime, endTime);
    this.getIntentionLost(startTime, endTime);
    this.getIntentionInfo(startTime, endTime);
    this.getPurchaseFailDays(startTime, endTime);
    this.getIncomeInfo(startTime, endTime);
    this.getIncomesDaysData(startTime, endTime);
  }

  handleDateChange(startTime, endTime) {
    this.setState({
      startTime: startTime,
      endTime: endTime,
    });
    this.refreshData(startTime, endTime);
  }

  handleChartData(method) {
    let {startTime, endTime} = this.state;
    this[method](startTime, endTime);
  }

  refreshData(startTime, endTime) {
    this.getPurchaseSummary(startTime, endTime);
    this.getNewPotentialAndIntentionDaysData(startTime, endTime);
    this.getIntentionLost(startTime, endTime);
    this.getIntentionInfo(startTime, endTime);
    this.getPurchaseFailDays(startTime, endTime);
    this.getIncomeInfo(startTime, endTime);
    this.getNewDealDaysData(startTime, endTime);
    this.getIncomesDaysData(startTime, endTime);
  }

  getPurchaseSummary(startTime, endTime) {
    api.ajax({url: api.statistics.getPurchaseSummary(startTime, endTime)}, function (data) {
      let res = data.res;
      this.setState({
        dealAutos: res.deal_summary.count || 0,
        purchaseIncomeTotal: res.deal_summary.total || 0,
        intentionCustomerCount: res.intention_summary.customer_count || 0,
        intentionIntentionCount: res.intention_summary.intention_count || 0,
        failCustomerCount: res.fail_summary.customer_count || 0,
        failIntentionCount: res.fail_summary.intention_count || 0,
      });
    }.bind(this));
  }

  getNewPotentialAndIntentionDaysData(startTime, endTime) {
    api.ajax({url: api.statistics.getNewPotentialAndIntentionDaysData(startTime, endTime)}, function (data) {
      let categories = [];
      let chatDataCustomer = [];
      let chatDataIntention = [];
      data.res.list.map(item => {
        categories.push(item.date + text.week[new Date(item.date).getDay()]);
        chatDataCustomer.push(Number(item.content.customer_count));
        chatDataIntention.push(Number(item.content.intention_count));
      });
      let series = [{
        name: '新增客户',
        data: chatDataCustomer,
      }, {
        name: '新增意向',
        data: chatDataIntention,
      }];

      this.setState({
        chartTitle: '新增客户/意向',
        chartUnit: '用户(位)',
        categories: categories,
        series: series,
      });
    }.bind(this));
  }


  getPurchaseFailDays(startTime, endTime) {
    api.ajax({url: api.statistics.getPurchaseFailDays(startTime, endTime)}, function (data) {
      let categories = [];
      let chatDataCustomer = [];
      let chatDataIntention = [];
      data.res.list.map(item => {
        categories.push(item.date + text.week[new Date(item.date).getDay()]);
        chatDataCustomer.push(Number(item.content.customer_count));
        chatDataIntention.push(Number(item.content.intention_count));
      });
      let series = [{
        name: '流失客户',
        data: chatDataCustomer,
      }, {
        name: '流失意向',
        data: chatDataIntention,
      }];

      this.setState({
        chartTitle: '流失客户/意向',
        chartUnit: '用户(位)',
        categories: categories,
        series: series,
      });
    }.bind(this));
  }


  getNewDealDaysData(startTime, endTime) {
    api.ajax({url: api.statistics.getNewDealDaysData(startTime, endTime)}, function (data) {

      let categories = [];
      let chatData = [];
      data.res.list.map(item => {
        categories.push(item.date + text.week[new Date(item.date).getDay()]);
        chatData.push(Number(item.content.count));
      });

      let series = [{
        name: '成交台次',
        data: chatData,
      }];
      this.setState({
        chartTitle: '成交台次',
        chartUnit: '台次(台)',
        categories: categories,
        series: series,
      });
    }.bind(this));
  }

  getIncomesDaysData(startTime, endTime) {
    api.ajax({url: api.statistics.getNewDealDaysData(startTime, endTime)}, function (data) {

      let categories = [];
      let chatData = [];
      data.res.list.map(item => {
        categories.push(item.date + text.week[new Date(item.date).getDay()]);
        chatData.push(Number(item.content.total));
      });

      let series = [{
        name: '今日收入',
        data: chatData,
      }];

      this.setState({
        chartTitle: '总收入',
        chartUnit: '收入(元)',
        categories: categories,
        series: series,
      });
    }.bind(this));
  }

  getIncomeInfo(startTime, endTime) {
    api.ajax({url: api.statistics.getPurchaseIncomeInfo(startTime, endTime)}, function (data) {
      this.setState({incomeInfo: data.res.income});
    }.bind(this));
  }

  getIntentionLost(startTime, endTime) {
    api.ajax({url: api.statistics.getIntentionLostInfo(startTime, endTime)}, function (data) {
      this.setState({
        intentionLostInfo: data.res.fail_types,
        intentionLostSubInfo: data.res.fail_sub_types,
      });
    }.bind(this));
  }

  getIntentionInfo(startTime, endTime) {
    api.ajax({url: api.statistics.getIntentionInfo(startTime, endTime)}, function (data) {
      let res = data.res;
      this.setState({
        levelList: res.level_list,
        budgetList: res.budget_list,
        mortgageList: res.mortgage_list,
      });
    }.bind(this));
  }

  render() {
    let {
      dealAutos,
      purchaseIncomeTotal,
      chartTitle,
      chartUnit,
      intentionLostInfo,
      levelList,
      budgetList,
      mortgageList,
      incomeInfo,
      customerSource,
      intentionCustomerCount,
      intentionIntentionCount,
      failCustomerCount,
      failIntentionCount,
      startTime,
      endTime,
      intentionLostSubInfo,
    } = this.state;

    return (
      <div>
        <CurrentDateRangeSelector
          onDateChange={this.handleDateChange}
          startTime={startTime}
          endTime={endTime}
        />

        <PresalesSummary
          loadChart={this.handleChartData}
          dealAutos={dealAutos}
          purchaseIncomeTotal={purchaseIncomeTotal}
          intentionCustomerCount={intentionCustomerCount}
          intentionIntentionCount={intentionIntentionCount}
          failCustomerCount={failCustomerCount}
          failIntentionCount={failIntentionCount}
          chartTitle={chartTitle}
          chartUnit={chartUnit}
          categories={this.state.categories}
          series={this.state.series}
        />

        <PresalesIntention
          levelList={levelList}
          budgetList={budgetList}
          mortgageList={mortgageList}
          customerSource={customerSource}
        />

        <Row gutter={16}>
          <Col span={12}>
            <PresalesIncome source={incomeInfo}/>
          </Col>
          <Col span={12}>
            <PresalesIntentionLost intentionLostInfo={intentionLostInfo} intentionLostSubInfo={intentionLostSubInfo}/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default PresalesStatistics;
