import React, {Component} from 'react';
import {Link} from 'react-router';
import {Card, Row, Col, Popover} from 'antd';

import QRCode from 'qrcode.react';
import api from '../middleware/api';

require('../styles/home.css');
let arrowpng = require('../images/home/arrow.png');
let icon1png = require('../images/home/icon1.png');
let icon2png = require('../images/home/icon2.png');
let icon3png = require('../images/home/icon3.png');
let icon4png = require('../images/home/icon4.png');
let icon5png = require('../images/home/icon5.png');
let icon6png = require('../images/home/icon6.png');
let icon7png = require('../images/home/icon7.png');
// let icon8png = require('../images/home/icon8.png');
let icon9png = require('../images/home/icon9.png');

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleStaff: false,
      visibleCustomer: false,
      data: {},
      insuranceTask: {unfollow: 0, newInspection: 0, conducting: 0},
      inspectionTask: {unfollow: 0, newInspection: 0, conducting: 0},
      commonTask: {unfollow: 0, newInspection: 0, conducting: 0},
    };
    [
      'getTaskSummary',
      'handleVisibleChangeStaff',
      'handleVisibleChangeCustomer',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getTaskSummary();
    let documentHeight = document.documentElement.clientHeight || window.innerHeight;
    this.setState({documentHeight: documentHeight * 0.85});
  }

  handleVisibleChangeStaff(visible) {
    this.setState({visibleStaff: visible});
  }

  handleVisibleChangeCustomer(visible) {
    this.setState({visibleCustomer: visible});

  }

  getTaskSummary() {
    api.ajax({
      url: api.task.tastSummary(),
    }, (data) => {
      let list = data.res || {};

      let insuranceTask = {unfollow: 0, newly: 0, conducting: 0};
      let inspectionTask = {unfollow: 0, newly: 0, conducting: 0};
      let commonTask = {unfollow: 0, newly: 0, conducting: 0};

      list.insurance_sumary && list.insurance_sumary.map((item) => {
        if (Number(item.status) === 0) {
          insuranceTask.unfollow = Number(item.count);
        } else if (Number(item.status) === 1) {
          insuranceTask.conducting = Number(item.count);
        }
      });

      list.inspection_sumary && list.inspection_sumary.map((item) => {
        if (Number(item.status) === 0) {
          inspectionTask.unfollow = Number(item.count);
        } else if (Number(item.status) === 1) {
          inspectionTask.conducting = Number(item.count);
        }
      });

      list.common_sumary && list.common_sumary.map((item) => {
        if (Number(item.status) === 0) {
          commonTask.unfollow = Number(item.count);
        } else if (Number(item.status) === 1) {
          commonTask.conducting = Number(item.count);
        }
      });

      insuranceTask.newly = list.new_insurance && list.new_insurance.count || 0;
      inspectionTask.newly = list.new_inspection && list.new_inspection.count || 0;
      commonTask.newly = list.new_common && list.new_common.count || 0;

      this.setState({
        insuranceTask,
        inspectionTask,
        commonTask,
      });
    });
  }

  render() {
    const {
      insuranceTask,
      inspectionTask,
      commonTask,
    } = this.state;

    let userInfo = api.getLoginUser();

    let contentRenewalTask = (
      <p>
        <span className="font-size-14 font">续保任务</span>
        <span className="pull-right">
          <img src={arrowpng} alt="增长" className="img-tip"/>
          <span className="font-size-14 mr8">{insuranceTask.newly}</span>
          <span className="font-size-14 font-color-one">今日新增</span>
        </span>
      </p>
    );
    let contentYearlyInspectionTask = (
      <p>
        <span className="font-size-14 font">年检任务</span>
        <span className="pull-right">
          <img src={arrowpng} alt="增长" className="img-tip"/>
          <span className="font-size-14 mr8">{inspectionTask.newly}</span>
          <span className="font-size-14 font-color-one">今日新增</span>
        </span>
      </p>
    );
    let contentCustomertask = (
      <p>
        <span className="font-size-14 font">客户任务</span>
        <span className="pull-right">
          <img src={arrowpng} alt="增长" className="img-tip"/>
          <span className="font-size-14 mr8">{commonTask.newly}</span>
          <span className="font-size-14 font-color-one">今日新增</span>
        </span>
      </p>
    );

    return (
      <Row>
        <Col span={17}>
          <div>
            <p className="font-size-16 mb20 font">快捷方式</p>
            <Row gutter={20} className="mt20">
              <Col span={6}>
                <Link to={{pathname: '/aftersales/project/new'}} target="_blank">
                  <Card className="shortcut">
                    <p><img src={icon1png} alt="" className="img"/></p>
                    <p className="font-size-18 mt10 font">创建工单</p>
                  </Card>
                </Link>
              </Col>

              <Col span={6}>
                <Link to={{pathname: '/aftersales/project/index'}} target="_blank">
                  <Card className="shortcut">
                    <p><img src={icon2png} alt="" className="img"/></p>
                    <p className="font-size-18 mt10 font">工单管理</p>
                  </Card>
                </Link>
              </Col>

              <Col span={6}>
                <Link to={{pathname: '/marketing/membercard/sale'}} target="_blank">
                  <Card className="shortcut">
                    <p><img src={icon5png} alt="" className="img"/></p>
                    <p className="font-size-18 mt10 font">办理会员</p>
                  </Card>
                </Link>
              </Col>

              <Col span={6}>
                <Link to={{pathname: '/warehouse/purchase/new'}} target="_blank">
                  <Card className="shortcut">
                    <p><img src={icon6png} alt="" className="img"/></p>
                    <p className="font-size-18 mt10 font">采购开单</p>
                  </Card>
                </Link>
              </Col>
            </Row>

            <Row gutter={20} className="mt20">
              <Col span={6}>
                <Link to={{pathname: '/aftersales/part-sale/new'}}
                      target="_blank">
                  <Card className="shortcut">
                    <p><img src={icon9png} alt="" className="img"/></p>
                    <p className="font-size-18 mt10 font">配件销售</p>
                  </Card>
                </Link>
              </Col>

              <Col span={6}>
                <Link to={{pathname: '/aftersales/consumptive-material', query: {consumptiveShow: true}}}
                      target="_blank">
                  <Card className="shortcut">
                    <p><img src={icon7png} alt="" className="img"/></p>
                    <p className="font-size-18 mt10 font">耗材领用</p>
                  </Card>
                </Link>
              </Col>

              {/*<Col span={6}>
               <Link to={{pathname: '/finance/monthly_report'}} target="_blank">
               <Card className="shortcut">
               <p><img src={icon8png} alt="" className="img"/></p>
               <p className="font-size-18 mt10 font">月报汇总</p>
               </Card>
               </Link>
               </Col>*/}
              <Col span={6}>
                <Link to={{pathname: '/finance/expense/list', query: {incomeShow: 1, expenseShow: 0}}} target="_blank">
                  <Card className="shortcut">
                    <p><img src={icon3png} alt="" className="img"/></p>
                    <p className="font-size-18 mt10 font">新增收入</p>
                  </Card>
                </Link>
              </Col>

              <Col span={6}>
                <Link to={{pathname: '/finance/expense/list', query: {incomeShow: 0, expenseShow: 1}}} target="_blank">
                  <Card className="shortcut">
                    <p><img src={icon4png} alt="" className="img"/></p>
                    <p className="font-size-18 mt10 font">新增支出</p>
                  </Card>
                </Link>
              </Col>
            </Row>

            <p className="font-size-16 mt20 mb20 font">任务管理</p>
            <Row gutter={20} className="margin-bottom-10">
              <Col span={8}>
                <Card title={contentCustomertask}>
                  <Row>
                    <Link to={{pathname: '/task/list-customer', query: {status: 0}}} target="_blank">
                      <Col span={12} className="center">
                        <p className="task-state">未跟进(人)</p>
                        <p className="task-state-num">{commonTask.unfollow}</p>
                      </Col>
                    </Link>
                    <Link to={{pathname: '/task/list-customer', query: {status: 1}}} target="_blank">
                      <Col span={12} className="center">
                        <p className="task-state">进行中(人)</p>
                        <p className="task-state-num">{commonTask.conducting}</p>
                      </Col>
                    </Link>
                  </Row>
                  <Row>
                    <Link to={{pathname: '/task/list-customer', query: {status: 0}}} target="_blank">
                      <Col span={24} className="center">
                        <p className="font-size-14">详情></p>
                      </Col>
                    </Link>
                  </Row>
                </Card>
              </Col>

              <Col span={8}>
                <Card title={contentRenewalTask}>

                  <Row>
                    <Link to={{pathname: '/task/list-renewal', query: {status: 0}}} target="_blank">
                      <Col span={12} className="center">
                        <p className="task-state">未跟进(人)</p>
                        <p className="task-state-num">{insuranceTask.unfollow}</p>
                      </Col>
                    </Link>
                    <Link to={{pathname: '/task/list-renewal', query: {status: 1}}} target="_blank">
                      <Col span={12} className="center">
                        <p className="task-state">进行中(人)</p>
                        <p className="task-state-num">{insuranceTask.conducting}</p>
                      </Col>
                    </Link>
                  </Row>
                  <Row>
                    <Link to={{pathname: '/task/list-renewal', query: {status: 0}}} target="_blank">
                      <Col span={24} className="center">
                        <p className="font-size-14">详情></p>
                      </Col>
                    </Link>
                  </Row>
                </Card>
              </Col>
              <Col span={8}>
                <Card title={contentYearlyInspectionTask}>
                  <Row>
                    <Link to={{pathname: '/task/list-yearlyinspection', query: {status: 0}}} target="_blank">
                      <Col span={12} className="center">
                        <p className="task-state">未跟进(人)</p>
                        <p className="task-state-num">{inspectionTask.unfollow}</p>
                      </Col>
                    </Link>
                    <Link to={{pathname: '/task/list-yearlyinspection', query: {status: 1}}} target="_blank">
                      <Col span={12} className="center">
                        <p className="task-state">进行中(人)</p>
                        <p className="task-state-num">{inspectionTask.conducting}</p>
                      </Col>
                    </Link>
                  </Row>
                  <Row>
                    <Link to={{pathname: '/task/list-yearlyinspection', query: {status: 0}}} target="_blank">
                      <Col span={24} className="center">
                        <p className="font-size-14">详情></p>
                      </Col>
                    </Link>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        </Col>

        <Col span={6} offset={1}>
          <div style={{marginTop: '43px'}}>
            <Card title={<span className="right-font">门店信息</span>}>
              <p className="font-color-one font-size-14">门店名称
                <span className="ml10 font-color-two">{userInfo.companyName}</span>
              </p>
              <p className="mt10 font-color-one font-size-14">门店编号
                <span className="ml10 font-color-two">{userInfo.companyNum}</span>
              </p>
              <p className="mt10 font-color-one font-size-14">合作类型
                <span className="ml10 font-color-two">{userInfo.cooperationTypeName}</span>
              </p>
            </Card>

            <Card
              className="mt20"
              title={<span className="right-font">下载中心</span>}>
              <p className="font-color-two font-size-14">水稻汽车-员工版：
                <Popover
                  content={
                    <span className="canvas no-print">
                        <QRCode
                          value={location.origin + '/app-download-tob.html'}
                          size={128} ref="qrCode"
                        />
                      </span>
                  }
                  trigger="click"
                  visible={this.state.visibleStaff}
                  onVisibleChange={this.handleVisibleChangeStaff}
                >
                  <a href="javascript:">点击扫码下载</a>
                </Popover>
              </p>

              <p className="mt10 font-color-two font-size-14">水稻汽车-客户版：
                <Popover
                  content={
                    <span className="canvas no-print">
                        <QRCode
                          value={location.origin + '/app-download-toc.html'}
                          size={128} ref="qrCode"
                        />
                      </span>
                  }
                  trigger="click"
                  visible={this.state.visibleCustomer}
                  onVisibleChange={this.handleVisibleChangeCustomer}
                >
                  <a href="javascript:">点击扫码下载</a>
                </Popover>
              </p>
            </Card>
          </div>
        </Col>
      </Row>
    );
  }
}
