import React from "react";
import {Row, Col, DatePicker, Button, Radio, Card} from "antd";
import formatter from "../../middleware/formatter";
import api from "../../middleware/api";
import DateRangeSelector from "../../components/widget/DateRangeSelector";
import AftersalesSummary from "../../components/card/dashboard/AftersalesSummary";
import AftersalesIncomeOfProject from "../../components/card/dashboard/AftersalesIncomeOfProject";
import AftersalesIncomeOfCategory from "../../components/card/dashboard/AftersalesIncomeOfCategory";
import AftersalesProjectOfAccident from "../../components/card/dashboard/AftersalesProjectOfAccident";
import AftersalesMembers from "../../components/card/dashboard/AftersalesMembers";
import AftersalesIncomeOfPayTimes from "../../components/card/dashboard/AftersalesIncomeOfPayTimes";
import AftersalesIncomeOfPayType from "../../components/card/dashboard/AftersalesIncomeOfPayType";
import AftersalesIncomeOfStatus from "../../components/card/dashboard/AftersalesIncomeOfStatus";
import AftersalesWarehouseOfStatus from "../../components/card/dashboard/AftersalesWarehouseOfStatus";

export default class AftersalesStatistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: formatter.date(new Date(new Date().setMonth(new Date().getMonth() - 1))),
      endTime: formatter.date(new Date()),
      maintainCount: 0,
      washAndDecorationCount: 0,
      maintainIncome: 0,
      newMember: 0,
      allMember: 0,
      chartTitle: '',
      chartUnit: '',
      chartData: [],
      incomeOfCategory: [],
      incomeOfProject: [],
      incomeOfPayType: [],
      incomeOfStatus: [],
      incomeOfAccident: {},
      membersOfLevel: [],
      warehouseOfStatus: {}
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

    this.getMaintainSummary(startTime, endTime);
    this.getMaintainCountDaysData(startTime, endTime);

    this.getMaintainIncomeByCategory(startTime, endTime);
    this.getMaintainIncomeByProject(startTime, endTime);
    this.getMaintainIncomeByPayType(startTime, endTime);
    this.getMaintainIncomeByStatus(startTime, endTime);
    this.getMaintainIncomeByAccident(startTime, endTime);
    this.getMaintainMembersByLevel(startTime, endTime);
    this.getMaintainWarehouseByStatus(startTime, endTime);
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

  refreshData(startTime, endTime) {
    this.getMaintainSummary(startTime, endTime);
    this.getMaintainCountDaysData(startTime, endTime);
    this.getMaintainIncomeByCategory(startTime, endTime);
    this.getMaintainIncomeByProject(startTime, endTime);
    this.getMaintainIncomeByPayType(startTime, endTime);
    this.getMaintainIncomeByStatus(startTime, endTime);
    this.getMaintainIncomeByAccident(startTime, endTime);
    this.getMaintainMembersByLevel(startTime, endTime);
    this.getMaintainWarehouseByStatus(startTime, endTime);
  }

  getMaintainSummary(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainSummary(startTime, endTime)}, function (data) {
      let res = data.res;
      this.setState({
        maintainCount: res.maintain_count,
        washAndDecorationCount: res.beauty_count,
        maintainIncome: res.maintain_incomes,
        newMember: res.member_new_count,
        allMember: res.member_all_count
      })
    }.bind(this))
  }

  getMaintainCountDaysData(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainCountDaysData(startTime, endTime)}, function (data) {
      this.setState({
        chartTitle: '进厂台次',
        chartUnit: '台次(台)',
        chartData: data.res.list,
        allowDecimals: false
      })
    }.bind(this))
  }

  getMaintainWashAndDecorationDaysData(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainWashAndDecorationDaysData(startTime, endTime)}, function (data) {
      this.setState({
        chartTitle: '洗美数量',
        chartUnit: '数量(台)',
        chartData: data.res.list,
        allowDecimals: false
      })
    }.bind(this))
  }

  getMaintainIncomeDaysData(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainIncomeDaysData(startTime, endTime)}, function (data) {
      this.setState({
        chartTitle: '每日产值',
        chartUnit: '产值(元)',
        chartData: data.res.list
      })
    }.bind(this))
  }

  getMaintainMembersDaysData(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainMembersDaysData(startTime, endTime)}, function (data) {
      this.setState({
        chartTitle: '新增会员',
        chartUnit: '会员(位)',
        chartData: data.res.list,
        allowDecimals: false
      })
    }.bind(this))
  }

  getMaintainIncomeByCategory(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainIncomeByCategory(startTime, endTime)}, function (data) {
      this.setState({incomeOfCategory: data.res.list})
    }.bind(this))
  }

  getMaintainIncomeByProject(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainIncomeByProject(startTime, endTime)}, function (data) {
      this.setState({incomeOfProject: data.res.list})
    }.bind(this))
  }

  getMaintainIncomeByPayType(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainIncomeByPayType(startTime, endTime)}, function (data) {
      this.setState({incomeOfPayType: data.res.list})
    }.bind(this))
  }

  getMaintainIncomeByStatus(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainIncomeByStatus(startTime, endTime)}, function (data) {
      this.setState({incomeOfStatus: data.res.list})
    }.bind(this))
  }

  getMaintainIncomeByAccident(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainIncomeByAccident(startTime, endTime)}, function (data) {
      this.setState({incomeOfAccident: data.res.list})
    }.bind(this))
  }

  getMaintainMembersByLevel(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainMembersByLevel(startTime, endTime)}, function (data) {
      this.setState({membersOfLevel: data.res.list})
    }.bind(this))
  }

  getMaintainWarehouseByStatus(startTime, endTime) {
    api.ajax({url: api.statistics.getMaintainWarehouseByStatus(startTime, endTime)}, function (data) {
      this.setState({warehouseOfStatus: data.res.list})
    }.bind(this))
  }

  render() {
    let {
      maintainCount,
      washAndDecorationCount,
      maintainIncome,
      newMember,
      allMember,
      chartTitle,
      chartUnit,
      chartData,
      incomeOfProject,
      incomeOfCategory,
      incomeOfPayType,
      incomeOfStatus,
      incomeOfAccident,
      membersOfLevel,
      warehouseOfStatus
    } = this.state;

    return (
      <div>
        <h3 className="page-title">报表-售后业务</h3>

        <DateRangeSelector onDateChange={this.handleDateChange}/>

        <AftersalesSummary
          loadChart={this.handleChartData}
          maintainCount={maintainCount}
          washAndDecorationCount={washAndDecorationCount}
          maintainIncome={maintainIncome}
          newMember={newMember}
          allMember={allMember}
          chartTitle={chartTitle}
          chartUnit={chartUnit}
          chartData={chartData}
        />

        <AftersalesIncomeOfProject source={incomeOfProject}/>

        <Row gutter={16}>
          <Col span="12">
            <AftersalesIncomeOfCategory source={incomeOfCategory}/>
          </Col>
          <Col span="12">
            <AftersalesProjectOfAccident source={incomeOfAccident}/>
          </Col>
        </Row>

        <AftersalesMembers source={membersOfLevel}/>

        <Row gutter={16}>
          <Col span="12">
            <AftersalesIncomeOfPayTimes source={incomeOfPayType}/>
          </Col>
          <Col span="12">
            <AftersalesIncomeOfPayType source={incomeOfPayType}/>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span="12">
            <AftersalesIncomeOfStatus source={incomeOfStatus}/>
          </Col>
          <Col span="12">
            <AftersalesWarehouseOfStatus source={warehouseOfStatus}/>
          </Col>
        </Row>
      </div>
    )
  }
}
