import React from 'react';
import formatter from '../../utils/DateFormatter';
import api from '../../middleware/api';
import CurrentDateRangeSelector from '../../components/widget/CurrentDateRangeSelector';
import text from '../../config/text';
import AftersalesSummary from './AftersalesSummary';
import AftersalesIncomeOfProject from './AftersalesIncomeOfProject';
import AftersalesCoupons from './AftersalesCoupons';
import AftersalesBusinessAnalysis from './AftersalesBusinessAnalysis';

export default class AftersalesStatistics extends React.Component {
  constructor(props) {
    super(props);
    // 昨天日期
    const lastDate = new Date(new Date().setDate(new Date().getDate() - 1));
    this.state = {
      startTime: formatter.day(new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() +
        1 - (lastDate.getDay() || 7))),
      endTime: formatter.day(lastDate),
      maintainSummary: '',
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
      typeIncomesAmount: [],
      typeIncomesProfit: [],
      payTypes: [],
      couponFee: 0,

      summaryData: {},
      typeIncomesSummary: [],
      businessAnalysis: [],
      index: '1',
    };
    [
      'handleDateChange',
      'handleChartData',
      'getBusinessAnalysis',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const {
      startTime,
      endTime,
    } = this.state;

    this.getMaintainSummary(startTime, endTime);
    this.getMaintainTypeIncomes(startTime, endTime);
    this.getMaintainPayTypes(startTime, endTime);
    // this.getMaintainIncomeUnpay(startTime, endTime);
    this.getMaintainCouponByLevel(startTime, endTime);
    this.getMaintainIncomeDaysData(startTime, endTime);
  }

  handleDateChange(startTime, endTime) {
    this.setState({ startTime, endTime, index: '1' });
    this.refreshData(startTime, endTime);
  }

  handleChartData(method, index) {
    const { startTime, endTime } = this.state;
    this[method](startTime, endTime);
    this.setState({ index });
  }

  refreshData(startTime, endTime) {
    this.getMaintainSummary(startTime, endTime);
    this.getMaintainTypeIncomes(startTime, endTime);
    this.getMaintainPayTypes(startTime, endTime);
    this.getMaintainCouponByLevel(startTime, endTime);
    this.getMaintainIncomeDaysData(startTime, endTime);
  }

  getMaintainSummary(startTime, endTime) {
    api.ajax({ url: api.statistics.getMaintainSummary(startTime, endTime) }, data => {
      const res = data.res;
      const summaryData = {
        totalFee: res.maintain_incomes.total_fee || 0,
        totalProfitRate: res.maintain_incomes.total_profit_rate || 0,
        count: res.maintain_count.count || 0,
        beautyCount: res.maintain_count.beauty_count || 0,
        totalInPrice: res.auto_part_summary.total_in_price || 0,
        unpayIncome: res.maintain_incomes.unpay_income || 0,
        salePerIntention: res.maintain_incomes.sale_per_intention || 0,
      };
      this.setState({
        summaryData,
        couponFee: res.maintain_incomes.coupon_fee || 0,
      });
    });
  }

  getMaintainCountDaysData(startTime, endTime) {
    api.ajax({ url: api.statistics.getMaintainCountDaysData(startTime, endTime) }, data => {
      const categories = [];
      const chatDataCount = [];
      const chatDataBeautyCount = [];
      data.res.list.map(item => {
        categories.push(item.date + text.week[new Date(item.date).getDay()]);
        chatDataCount.push(Number(item.content.count || 0));
        chatDataBeautyCount.push(Number(item.content.beauty_count || 0));
      });
      const series = [
        {
          name: '工单数',
          data: chatDataCount,
        }, {
          name: '洗车台次',
          data: chatDataBeautyCount,
        }];

      this.setState({
        chartTitle: '工单数/洗车台次',
        chartSubtitle: '',
        chartUnit: '数量(台)',
        categories,
        series,
        allowDecimals: false,
      });
    });
  }

  getMaintainAutoPartDays(startTime, endTime) {
    api.ajax({ url: api.statistics.getMaintainAutoPartDays(startTime, endTime) }, data => {
      const categories = [];
      const chatDataPrice = [];
      data.res.list.map(item => {
        categories.push(item.date + text.week[new Date(item.date).getDay()]);
        chatDataPrice.push(Number(item.content.total_in_price || 0));
      });
      const series = [
        {
          name: '仓库采购金额',
          data: chatDataPrice,
        }];

      this.setState({
        chartTitle: '仓库采购金额',
        chartSubtitle: '',
        chartUnit: '产值(元)',
        categories,
        series,
        allowDecimals: false,
      });
    });
  }

  getPerTicketSalesDate(startTime, endTime) {
    api.ajax({ url: api.statistics.getMaintainIncomeDaysData(startTime, endTime) }, data => {
      const categories = [];
      const chatData = [];
      data.res.list.map(item => {
        categories.push(item.date + text.week[new Date(item.date).getDay()]);
        chatData.push(Number(item.content.sale_per_intention) || 0);
      });

      const series = [
        {
          name: '客单价',
          data: chatData,
        }];

      this.setState({
        chartTitle: '客单价',
        chartSubtitle: '* 客单价 = 工单项目营业额/非洗车进场台次',
        chartUnit: '产值(元)',
        categories,
        series,
        allowDecimals: false,
      });
    });
  }

  getMaintainIncomeUnpay(startTime, endTime) {
    api.ajax({ url: api.statistics.getMaintainIncomeDaysData(startTime, endTime) }, data => {
      const categories = [];
      const chatData = [];
      data.res.list.map(item => {
        categories.push(item.date + text.week[new Date(item.date).getDay()]);
        chatData.push(Number(item.content.unpay_income) || 0);
      });

      const series = [
        {
          name: '挂账',
          data: chatData,
        }];

      this.setState({
        chartTitle: '工单挂账',
        chartSubtitle: '',
        chartUnit: '挂账(元)',
        categories,
        series,
        allowDecimals: false,
      });
    });
  }

  getMaintainWashAndDecorationDaysData(startTime, endTime) {
    api.ajax({ url: api.statistics.getMaintainWashAndDecorationDaysData(startTime, endTime) }, data => {
      this.setState({
        chartTitle: '洗美数量',
        chartUnit: '数量(台)',
        chartData: data.res.list,
        allowDecimals: false,
      });
    });
  }

  getMaintainIncomeDaysData(startTime, endTime) {
    api.ajax({ url: api.statistics.getMaintainIncomeDaysData(startTime, endTime) }, data => {
      const categories = [];
      const chatData = [];
      const payedIncome = [];
      data.res.list.map(item => {
        categories.push(item.date + text.week[new Date(item.date).getDay()]);
        chatData.push(Number(item.content.total_fee) || 0);
        payedIncome.push(Number(item.content.payed_income || 0));
      });

      const series = [
        {
          name: '营业额',
          data: chatData,
        }, {
          name: '实收金额',
          data: payedIncome,
        }];

      this.setState({
        chartTitle: '营业额',
        chartSubtitle: '* 营业额 = 各类型营业额加和 - 整单优惠' + '<br/>' + '* 实收金额 = 营业额 - 挂账金额',
        chartUnit: '产值(元)',
        categories,
        series,
        allowDecimals: false,
      });
    });
  }

  getMaintainProfitDaysDate(startTime, endTime) {
    api.ajax({ url: api.statistics.getMaintainIncomeDaysData(startTime, endTime) }, data => {
      const categories = [];
      const chatData = [];
      data.res.list.map(item => {
        categories.push(item.date + text.week[new Date(item.date).getDay()]);
        chatData.push(Number((Number(item.content.total_profit_rate) * 100).toFixed(2)) || 0);
      });

      const series = [
        {
          name: '毛利率',
          data: chatData,
        }];

      this.setState({
        chartTitle: '毛利率',
        chartSubtitle: '* 毛利率=毛利/营业额',
        chartUnit: '占比%',
        categories,
        series,
        allowDecimals: false,
      });
    });
  }

  getMaintainMembersDaysData(startTime, endTime) {
    api.ajax({ url: api.statistics.getMaintainMembersDaysData(startTime, endTime) }, data => {
      this.setState({
        chartTitle: '新增套餐卡',
        chartUnit: '套餐卡(张)',
        chartData: data.res.list,
        allowDecimals: false,
      });
    });
  }

  getMaintainIncomeByCategory(startTime, endTime) {
    api.ajax({ url: api.statistics.getMaintainIncomeByCategory(startTime, endTime) }, data => {
      this.setState({ incomeOfCategory: data.res.list });
    });
  }

  getMaintainTypeIncomes(startTime, endTime) {
    api.ajax({ url: api.statistics.getMaintainTypeIncomes(startTime, endTime) }, data => {
      const typeIncomesSummary = data.res.list;
      const analysis = data.res.object_list;
      this.setState({ typeIncomesSummary });
      this.getBusinessAnalysis(analysis);
    });
  }

  getMaintainPayTypes(startTime, endTime) {
    api.ajax({ url: api.statistics.getMaintainPayTypes(startTime, endTime) }, data => {
      this.setState({
        payTypes: data.res.income_pay_type,
      });
    });
  }

  getMaintainCouponByLevel(startTime, endTime) {
    api.ajax({ url: api.statistics.getMaintainCouponByLevel(startTime, endTime) }, data => {
      const member = data.res.coupon_card_summary;
      const membersOfLevel = [];
      for (const index in member) {
        if (member.hasOwnProperty(index)) {
          membersOfLevel.push(member[index]);
        }
      }
      this.setState({ membersOfLevel });
    });
  }

  getBusinessAnalysis(analysis) {
    let totalAmount = 0;
    for (const key in analysis) {
      if (analysis.hasOwnProperty(key)) {
        totalAmount += Number(analysis[key].amount);
      }
    }

    const type = ['洗车', '美容', '保养', '轮胎', '钣喷', '维修', '配件销售', '套餐卡'];
    const yingyee = { type: '营业额' };
    const chengben = { type: '成本' };
    const maoli = { type: '毛利' };
    const maolilv = { type: '毛利率' };
    const zhanbi = { type: '占比' };

    type.forEach(item => {
      yingyee[item] = analysis[item].amount;
      maoli[item] = analysis[item].profit;
      maolilv[item] = analysis[item].profit_rate;
      chengben[item] = analysis[item].amount - analysis[item].profit;
      zhanbi[item] = Number(totalAmount) === 0
        ? '0.00%' : `${((analysis[item].amount / totalAmount) * 100).toFixed(2)  }%`;
    });

    const data = [yingyee, chengben, maoli, maolilv, zhanbi];
    this.setState({ businessAnalysis: data });
  }

  render() {
    const {
      chartTitle,
      chartSubtitle,
      chartUnit,
      membersOfLevel,
      categories,
      series,
      startTime,
      endTime,
      typeIncomesAmount,
      typeIncomesProfit,
      payTypes,
      couponFee,

      summaryData,
      typeIncomesSummary,
      businessAnalysis,
      index,
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
          chartTitle={chartTitle}
          chartSubtitle={chartSubtitle}
          chartUnit={chartUnit}
          categories={categories}
          series={series}
          summaryData={summaryData}
          index={index}
        />

        {/* 营业额, 毛利率, 支付方式*/}
        <AftersalesIncomeOfProject
          typeIncomesAmount={typeIncomesAmount}
          typeIncomesProfit={typeIncomesProfit}
          couponFee={couponFee}
          payTypes={payTypes}
          startTime={startTime}
          endTime={endTime}
          typeIncomesSummary={typeIncomesSummary}
        />
        <div className="mb20">
          <AftersalesBusinessAnalysis source={businessAnalysis} couponFee={couponFee} />
        </div>
        <AftersalesCoupons source={membersOfLevel} />
      </div>
    );
  }
}
