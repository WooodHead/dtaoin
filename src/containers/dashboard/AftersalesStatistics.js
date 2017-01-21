import React from 'react';
import {Row, Col} from 'antd';
import formatter from '../../utils/DateFormatter';
import api from '../../middleware/api';
import CurrentDateRangeSelector from '../../components/CurrentDateRangeSelector';
import text from '../../config/text';
import AftersalesSummary from './AftersalesSummary';
import AftersalesIncomeOfProject from './AftersalesIncomeOfProject';
import AftersalesIncomeOfAnalysis from './AftersalesIncomeOfAnalysis';
import AftersalesPaymentMethod from './AftersalesPaymentMethod';
import AftersalesBill from './AftersalesBill';
import AftersalesWarehouse from './AftersalesWarehouse';
import AftersalesMembers from './AftersalesMembers';

export default class AftersalesStatistics extends React.Component {
  constructor(props) {
    super(props);
    //昨天日期
    let lastDate = new Date(new Date().setDate(new Date().getDate() - 1));
    this.state = {
      startTime: formatter.day(new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + 1 - (lastDate.getDay() || 7))),
      endTime: formatter.day(lastDate),
      maintainSummary: '',
      maintainCount: 0,
      washAndDecorationCount: 0,
      maintainIncome: 0,
      salePerIntention: 0,
      maintainProfit: 0,
      chartTitle: '',
      chartSubtitle: '',
      chartUnit: '',
      chartData: [],
      incomeOfCategory: [],
      incomeOfProject: [],
      incomeOfPayType: [],
      incomeOfStatus: [],
      incomeOfAccident: {},
      membersOfLevel: [],
      warehouseOfStatus: {},
      categories: [],
      series: [],
      typeCount: [],
      typeIncomesAmount: [],
      typeIncomesProfit: [],
      payTypes: [],
      godownEntrySummary: '',
      accidentSummary: '',
      couponFee: 0,
    };
    [
      'handleDateChange',
      'handleChartData',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    let {
      startTime,
      endTime,
    } = this.state;

    this.getMaintainSummary(startTime, endTime);
    this.getMaintainTypeCount(startTime, endTime);
    this.getMaintainTypeIncomes(startTime, endTime);
    this.getMaintainPayTypes(startTime, endTime);
    this.getMaintainIncomeUnpay(startTime, endTime);
    this.getMaintainParts(startTime, endTime);
    this.getMaintainAccident(startTime, endTime);
    this.getMaintainMembersByLevel(startTime, endTime);
    this.getMaintainIncomeDaysData(startTime, endTime);
  }

  handleDateChange(startTime, endTime) {
    this.setState({startTime, endTime});
    this.refreshData(startTime, endTime);
  }

  handleChartData(method) {
    let {startTime, endTime} = this.state;
    this[method](startTime, endTime);
  }

  refreshData(startTime, endTime) {
    this.getMaintainSummary(startTime, endTime);
    this.getMaintainTypeCount(startTime, endTime);
    this.getMaintainTypeIncomes(startTime, endTime);
    this.getMaintainPayTypes(startTime, endTime);
    this.getMaintainIncomeUnpay(startTime, endTime);
    this.getMaintainParts(startTime, endTime);
    this.getMaintainAccident(startTime, endTime);
    this.getMaintainMembersByLevel(startTime, endTime);
    this.getMaintainIncomeDaysData(startTime, endTime);
  }

  getMaintainSummary(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainSummary(startTime, endTime)}, function (data) {
      let res = data.res;
      this.setState({
        maintainSummary: res,
        maintainCount: res.maintain_count.count || 0,
        washAndDecorationCount: res.maintain_count.beauty_count || 0,
        maintainIncome: res.maintain_incomes.total_fee || 0,
        maintainProfit: res.maintain_incomes.total_profit || 0,
        salePerIntention: res.maintain_incomes.sale_per_intention || 0,
        couponFee: res.maintain_incomes.coupon_fee || 0,
      });
    }.bind(this));
  }

  getMaintainCountDaysData(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainCountDaysData(startTime, endTime)}, function (data) {

      let categories = [];
      let chatDataCount = [];
      let chatDataBeautyCount = [];
      data.res.list.map(item => {
        categories.push(item.date + text.week[new Date(item.date).getDay()]);
        chatDataCount.push(Number(item.content.count || 0));
        chatDataBeautyCount.push(Number(item.content.beauty_count || 0));
      });
      let series = [{
        name: '工单数',
        data: chatDataCount,
      }, {
        name: '洗车项目',
        data: chatDataBeautyCount,
      }];

      this.setState({
        chartTitle: '工单数/洗车项目',
        chartSubtitle: '',
        chartUnit: '数量(台)',
        categories: categories,
        series: series,
        allowDecimals: false,
      });

    }.bind(this));
  }

  getPerTicketSalesDate(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainIncomeDaysData(startTime, endTime)}, function (data) {
      let categories = [];
      let chatData = [];
      data.res.list.map(item => {
        categories.push(item.date + text.week[new Date(item.date).getDay()]);
        chatData.push(Number(item.content.sale_per_intention) || 0);
      });

      let series = [{
        name: '客单价',
        data: chatData,
      }];

      this.setState({
        chartTitle: '客单价',
        chartSubtitle: '非洗车项目营业额/非洗车进厂台次',
        chartUnit: '产值(元)',
        categories: categories,
        series: series,
        allowDecimals: false,
      });
    }.bind(this));
  }

  getMaintainIncomeUnpay(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainIncomeUnpay(startTime, endTime)}, function (data) {
      let categories = [];
      let chatData = [];
      data.res.income_unpay.map(item => {
        categories.push(item.date + text.week[new Date(item.date).getDay()]);
        chatData.push(Number(item.content) || 0);
      });

      let series = [{
        name: '挂账',
        data: chatData,
      }];

      let unpayState = {
        chartTitle: '工单挂账(元)',
        chartSubtitle: '',
        chartUnit: '挂账(元)',
        categories: categories,
        series: series,
        allowDecimals: false,
      };

      this.setState({
        unpayState: unpayState,
      });
    }.bind(this));
  }

  getMaintainWashAndDecorationDaysData(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainWashAndDecorationDaysData(startTime, endTime)}, function (data) {
      this.setState({
        chartTitle: '洗美数量',
        chartUnit: '数量(台)',
        chartData: data.res.list,
        allowDecimals: false,
      });
    }.bind(this));
  }

  getMaintainIncomeDaysData(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainIncomeDaysData(startTime, endTime)}, function (data) {

      let categories = [];
      let chatData = [];
      data.res.list.map(item => {
        categories.push(item.date + text.week[new Date(item.date).getDay()]);
        chatData.push(Number(item.content.total_fee) || 0);
      });

      let series = [{
        name: '营业额',
        data: chatData,
      }];

      this.setState({
        chartTitle: '营业额',
        chartSubtitle: '各类型营业额-整单优惠',
        chartUnit: '产值(元)',
        categories: categories,
        series: series,
        allowDecimals: false,
      });
    }.bind(this));
  }

  getMaintainProfitDaysDate(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainIncomeDaysData(startTime, endTime)}, function (data) {

      let categories = [];
      let chatData = [];
      data.res.list.map(item => {
        categories.push(item.date + text.week[new Date(item.date).getDay()]);
        chatData.push(Number(item.content.total_profit) || 0);
      });

      let series = [{
        name: '毛利润',
        data: chatData,
      }];

      this.setState({
        chartTitle: '毛利润',
        chartSubtitle: '各类型营业额-各类型配件成本-整单优惠',
        chartUnit: '产值(元)',
        categories: categories,
        series: series,
        allowDecimals: false,
      });
    }.bind(this));
  }

  getMaintainMembersDaysData(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainMembersDaysData(startTime, endTime)}, function (data) {
      this.setState({
        chartTitle: '新增会员',
        chartUnit: '会员(位)',
        chartData: data.res.list,
        allowDecimals: false,
      });
    }.bind(this));
  }

  getMaintainIncomeByCategory(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainIncomeByCategory(startTime, endTime)}, function (data) {
      this.setState({incomeOfCategory: data.res.list});
    }.bind(this));
  }

  getMaintainParts(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainParts(startTime, endTime)}, function (data) {
      this.setState({godownEntrySummary: data.res.godown_entry_summary});
    }.bind(this));
  }

  getMaintainTypeCount(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainTypeCount(startTime, endTime)}, function (data) {
      this.setState({
        typeCount: data.res.maintain_type_count,
      });
    }.bind(this));
  }

  getMaintainTypeIncomes(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainTypeIncomes(startTime, endTime)}, function (data) {
      this.setState({
        typeIncomesAmount: data.res.maintain_type_amount,
        typeIncomesProfit: data.res.maintain_type_profit,
      });
    }.bind(this));
  }

  getMaintainPayTypes(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainPayTypes(startTime, endTime)}, function (data) {
      this.setState({
        payTypes: data.res.income_pay_type,
      });
    }.bind(this));
  }

  getMaintainAccident(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainAccident(startTime, endTime)}, function (data) {
      this.setState({
        accidentSummary: data.res.accident_summary,
      });
    }.bind(this));
  }

  getMaintainMembersByLevel(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainMembersByLevel(startTime, endTime)}, function (data) {
      let member = data.res.member_summary;
      let membersOfLevel = [];
      for (let index in member) {
        if (member.hasOwnProperty(index)) {
          membersOfLevel.push(member[index]);
        }
      }
      this.setState({membersOfLevel: membersOfLevel});
    }.bind(this));
  }

  render() {
    let {
      maintainCount,
      washAndDecorationCount,
      maintainIncome,
      chartTitle,
      chartSubtitle,
      chartUnit,
      membersOfLevel,
      salePerIntention,
      maintainProfit,
      categories,
      series,
      startTime,
      endTime,
      typeCount,
      typeIncomesAmount,
      typeIncomesProfit,
      maintainSummary,
      payTypes,
      unpayState,
      godownEntrySummary,
      accidentSummary,
      couponFee,
    } = this.state;

    return (
      <div>
        <CurrentDateRangeSelector
          label="交易时间"
          onDateChange={this.handleDateChange}
          startTime={startTime}
          endTime={endTime}
        />

        <AftersalesSummary
          loadChart={this.handleChartData}
          maintainCount={maintainCount}
          washAndDecorationCount={washAndDecorationCount}
          maintainIncome={maintainIncome}
          chartTitle={chartTitle}
          chartSubtitle={chartSubtitle}
          chartUnit={chartUnit}
          salePerIntention={salePerIntention}
          maintainProfit={maintainProfit}
          categories={categories}
          series={series}
        />

        {/*项目数量, 营业额, 毛利润*/}
        <AftersalesIncomeOfProject
          typeCount={typeCount}
          typeIncomesAmount={typeIncomesAmount}
          typeIncomesProfit={typeIncomesProfit}
          accidentSummary={accidentSummary}
          couponFee={couponFee}
        />

        <Row gutter={16}>
          <Col span={8}>
            <AftersalesIncomeOfAnalysis maintainSummary={maintainSummary}/>
          </Col>
          <Col span={8}>
            <AftersalesPaymentMethod payTypes={payTypes}/>
          </Col>
          <Col span={8}>
            <AftersalesBill unpayState={unpayState}/>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={16}>
            <AftersalesMembers source={membersOfLevel}/>
          </Col>
          <Col span={8}>
            <AftersalesWarehouse startTime={this.state.startTime} godownEntrySummary={godownEntrySummary}/>
          </Col>
        </Row>
      </div>
    );
  }
}
