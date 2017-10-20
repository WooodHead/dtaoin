import React, { Component } from 'react';
import { Card, Row, Col, DatePicker, Spin } from 'antd';

import formatter from '../../utils/DateFormatter';
import api from '../../middleware/api';

const MonthPicker = DatePicker.MonthPicker;

require('./monthlyReport.css');

const icon_1 = require('../../images/monthly_report/yuebao_icon_1.png');
const icon_2 = require('../../images/monthly_report/yuebao_icon_2.png');
const icon_3 = require('../../images/monthly_report/yuebao_icon_3.png');
const icon_4 = require('../../images/monthly_report/yuebao_icon_4.png');
const icon_5 = require('../../images/monthly_report/yuebao_icon_5.png');
const icon_6 = require('../../images/monthly_report/yuebao_icon_6.png');
const icon_7 = require('../../images/monthly_report/yuebao_icon_7.png');
const icon_8 = require('../../images/monthly_report/yuebao_icon_8.png');

export default class MonthlyReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      month: formatter.month(new Date(new Date().getFullYear(), new Date().getMonth() - 1)),
      detail: {},
      isFetching: false,
    };
    [
      'handleDateRangeChange',
      'getList',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getList();
  }

  getList() {
    this.setState({ isFetching: true });
    api.ajax({ url: api.finance.getFinancialSummary(this.state.month) }, data => {
      this.setState({ detail: data.res, isFetching: false });
    }, () => {
    });
  }

  handleDateRangeChange(momentMonth, stringMonth) {
    this.setState({ month: stringMonth }, () => {
      this.getList();
    });
  }

  disabledDate(current) {
    // can not select days after today and today and before 2017.
    const today = new Date();
    const earliestTime = new Date(new Date('2017-01-01 00:00:00'));
    return current && (current.valueOf() >= today || current.valueOf() < earliestTime);
  }

  render() {
    const { detail } = this.state;
    const inventory = (detail.godown && Number(detail.godown.panying) >= 0) ?
      { img: icon_7, word: '盘差金额' } : { img: icon_6, word: '盘差金额' };

    return (
      <div className="monthly-report" style={{ marginLeft: '25px', marginRight: '90px' }}>
        <Row>
          <laber>选择月份：</laber>
          <MonthPicker
            format={formatter.pattern.month}
            value={formatter.getMomentDate(this.state.month)}
            onChange={this.handleDateRangeChange}
            disabledDate={this.disabledDate}
            allowClear={false}
          />
        </Row>

        <Spin tip="加载中..." spinning={this.state.isFetching}>
          <Row gutter={16} className="mt20 mb10">
            <Col span={6}>
              <Card className="card">
                <Col span={5} offset={2}>
                  <img src={icon_1} alt="" className="img-report"/>
                </Col>
                <Col span={17}>
                  <div className="first-div">
                    <p className="explain-word">总毛利</p>
                    <p className="number">
                      {detail.total && detail.total.maoli && Number(detail.total.maoli).toFixed(2) || '0.00'}
                    </p>
                  </div>
                </Col>
              </Card>
            </Col>
            <Col span={6}>
              <Card className="card">
                <Col span={5} offset={2}>
                  <img src={icon_2} alt="" className="img-report"/>
                </Col>
                <Col span={17}>
                  <div className="first-div">
                    <p className="explain-word">总毛利率</p>
                    <p className="number">
                      {detail.total && detail.total.maolilv && (`${Number(detail.total.maolilv).toFixed(2)  }%`) || '0.00%'}
                    </p>
                  </div>
                </Col>
              </Card>
            </Col>
            <Col span={6}>
              <Card className="card">
                <Col span={5} offset={2}>
                  <img src={icon_1} alt="" className="img-report"/>
                </Col>
                <Col span={17}>
                  <div className="first-div">
                    <p className="explain-word">总净利</p>
                    <p className="number">
                      {detail.total && detail.total.jingli && Number(detail.total.jingli).toFixed(2) || '0.00'}
                    </p>
                  </div>
                </Col>
              </Card>
            </Col>
            <Col span={6}>
              <Card className="card">
                <Col span={5} offset={2}>
                  <img src={icon_2} alt="" className="img-report"/>
                </Col>
                <Col span={17}>
                  <div className="first-div">
                    <p className="explain-word">总净利率</p>
                    <p className="number">
                      {detail.total && detail.total.jinglilv && (`${Number(detail.total.jinglilv).toFixed(2)  }%`) || '0.00%'}
                    </p>
                  </div>
                </Col>
              </Card>
            </Col>
          </Row>

          <Row className="mb10">
            <Card style={{ height: '103px' }}>
              <Col span={5} style={{ textAlign: 'center', marginLeft: '0.2%' }}>
                <Col span={5} offset={2}>
                  <img src={icon_3} alt="" className="img-report"/>
                </Col>
                <Col span={17}>
                  <div className="first-div">
                    <p className="explain-word">营业额汇总</p>
                    <p className="number">
                      {detail.in && detail.in.total && Number(detail.in.total).toFixed(2) || '0.00'}
                    </p>
                  </div>
                </Col>
              </Col>
              <div className="vertical-line"></div>
              <Col span={3} offset={2}>
                <p className="explain-word">现金支付</p>
                <p className="small-number">
                  {detail.in && detail.in.现金支付 && Number(detail.in.现金支付).toFixed(2) || '0.00'}
                </p>
              </Col>
              <Col span={3}>
                <p className="explain-word">微信支付</p>
                <p className="small-number">
                  {detail.in && detail.in.微信支付 && Number(detail.in.微信支付).toFixed(2) || '0.00'}
                </p>
              </Col>
              <Col span={3}>
                <p className="explain-word">支付宝支付</p>
                <p className="small-number">
                  {detail.in && detail.in.支付宝支付 && Number(detail.in.支付宝支付).toFixed(2) || '0.00'}
                </p>
              </Col>
              <Col span={3}>
                <p className="explain-word">银行卡支付</p>
                <p className="small-number">
                  {detail.in && detail.in.银行卡支付 && Number(detail.in.银行卡支付).toFixed(2) || '0.00'}
                </p>
              </Col>
            </Card>
          </Row>


          <Row className="mb10">
            <Card style={{ height: '103px' }}>
              <Col span={5} style={{ textAlign: 'center', marginLeft: '0.2%' }}>
                <Col span={5} offset={2}>
                  <img src={icon_4} alt="" className="img-report"/>
                </Col>
                <Col span={17}>
                  <div className="first-div">
                    <p className="explain-word">支出汇总</p>
                    <p className="number">
                      {detail.out && detail.out.total && Number(detail.out.total).toFixed(2) || '0.00'}
                    </p>
                  </div>
                </Col>
              </Col>
              <div className="vertical-line"></div>
              <Col span={3} offset={2}>
                <p className="explain-word">耗材领用</p>
                <p className="small-number">
                  {detail.out && detail.out.haocai && Number(detail.out.haocai).toFixed(2) || '0.00'}
                </p>
              </Col>
              <Col span={3}>
                <p className="explain-word">其它支出</p>
                <p className="small-number">
                  {detail.out && detail.out.other && Number(detail.out.other).toFixed(2) || '0.00'}
                </p>
              </Col>
              <Col span={3}>
                <p className="explain-word">人力成本</p>
                <p className="small-number">
                  {detail.out && detail.out.gongzi && Number(detail.out.gongzi).toFixed(2) || '0.00'}
                </p>
              </Col>
              <Col span={3}>
                <p className="explain-word">工单配件成本</p>
                <p className="small-number">
                  {detail.out && detail.out.gongdan && Number(detail.out.gongdan).toFixed(2) || '0.00'}
                </p>
              </Col>
            </Card>
          </Row>

          <Row gutter={16} className="mb10">
            <Col span={6} className="card">
              <Card className="card">
                <Col span={5} offset={2}>
                  <img src={icon_5} alt="" className="img-report"/>
                </Col>
                <Col span={17}>
                  <div className="first-div">
                    <p className="explain-word">仓库期末金额</p>
                    <p className="number">
                      {detail.godown && detail.godown.godown_total && Number(detail.godown.godown_total).toFixed(2) || '0.00'}
                    </p>
                  </div>
                </Col>
              </Card>
            </Col>
            <Col span={6}>
              <Card className="card">
                <Col span={5} offset={2}>
                  <img src={icon_5} alt="" className="img-report"/>
                </Col>
                <Col span={17}>
                  <div className="first-div">
                    <p className="explain-word">仓库期初金额</p>
                    <p className="number">
                      {detail.godown && detail.godown.last_godown_total && Number(detail.godown.last_godown_total).toFixed(2) || '0.00'}
                    </p>
                  </div>
                </Col>
              </Card>
            </Col>
            <Col span={6}>
              <Card className="card">
                <Col span={5} offset={2}>
                  <img src={inventory.img} alt="" className="img-report"/>
                </Col>
                <Col span={17}>
                  <div className="first-div">
                    <p className="explain-word">{inventory.word}</p>
                    <p className="number">
                      {detail.godown && detail.godown.panying && Number(detail.godown.panying).toFixed(2) || '0.00'}
                    </p>
                  </div>
                </Col>
              </Card>
            </Col>
            <Col span={6}>
              <Card className="card">
                <Col span={5} offset={2}>
                  <img src={icon_8} alt="" className="img-report"/>
                </Col>
                <Col span={17}>
                  <div className="first-div">
                    <p className="explain-word">固定资产</p>
                    <p className="number">
                      {detail.godown && detail.godown.fixed_assets_total && Number(detail.godown.fixed_assets_total).toFixed(2) || '0.00'}
                    </p>
                  </div>
                </Col>
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>
    );
  }
}
