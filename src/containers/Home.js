import React, {Component} from 'react';
import {Card, Row, Col, Popover} from 'antd';
import {Link} from 'react-router';
import QRCode from 'qrcode.react';

import api from '../middleware/api';

let arrowpng = require('../images/home/arrow.png');
let icon1png = require('../images/home/icon1.png');
let icon2png = require('../images/home/icon2.png');
let icon3png = require('../images/home/icon3.png');
let icon4png = require('../images/home/icon4.png');
let icon5png = require('../images/home/icon5.png');
let icon6png = require('../images/home/icon6.png');
let icon7png = require('../images/home/icon7.png');
let icon8png = require('../images/home/icon8.png');

export default class HomePage extends Component {
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
    // let documentHeight = window.innerHeight;
    this.setState({
      documentHeight: documentHeight * 0.85,
    });
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

    let styleShortcut = {
      height: '130px',
      textAlign: 'center',
    };

    let styleImg = {
      height: '40px',
    };
    let styleFont = {
      color: '#333',
      fontWeight: 'bold',
    };

    const {insuranceTask, inspectionTask, commonTask} = this.state;
    let contentRenewalTask = (
      <p>
        <span className="font-size-13" style={styleFont}>续保任务</span>
        <span style={{float: 'right'}}>
          <img src={arrowpng} alt="增长" style={{width: '7px', height: '4px', marginRight: '5px', marginBottom: '2px'}}/>
          <span className="font-size-13 margin-right-8">{insuranceTask.newly}</span>
          <span className="font-size-12" style={{color: '#999'}}>今日新增</span>
        </span>
      </p>
    );
    let contentYearlyInspectionTask = (
      <p>
        <span className="font-size-13" style={styleFont}>年检任务</span>
        <span style={{float: 'right'}}>
          <img src={arrowpng} alt="增长" style={{width: '7px', height: '4px', marginRight: '5px', marginBottom: '2px'}}/>
          <span className="font-size-13 margin-right-8">{inspectionTask.newly}</span>
          <span className="font-size-12" style={{color: '#999'}}>今日新增</span>
        </span>
      </p>
    );
    let contentCustomertask = (
      <p>
        <span className="font-size-13" style={styleFont}>客户任务</span>
        <span style={{float: 'right'}}>
          <img src={arrowpng} alt="增长" style={{width: '7px', height: '4px', marginRight: '5px', marginBottom: '2px'}}/>
          <span className="font-size-13 margin-right-8">{commonTask.newly}</span>
          <span className="font-size-12" style={{color: '#999'}}>今日新增</span>
        </span>
      </p>
    );

    return (
      <div>
        <Row>
          <Col span={17}>
            <Card style={{height: this.state.documentHeight}}>
              <p className="font-size-16 margin-bottom-20 padding-top-30" style={styleFont}>快捷方式</p>
              <Row gutter={20} style={{marginTop: '20px'}}>
                <Col span={6}>
                  <Link to={{pathname: '/aftersales/project/create'}} target="_blank">
                    <Card style={styleShortcut}>
                      <p><img src={icon1png} alt="" style={styleImg}/></p>
                      <p className="font-size-18 margin-top-10" style={styleFont}>创建工单</p>
                    </Card>
                  </Link>
                </Col>

                <Col span={6}>
                  <Link to={{pathname: '/aftersales/project/index'}}>
                    <Card style={styleShortcut}>
                      <p><img src={icon2png} alt="" style={styleImg}/></p>
                      <p className="font-size-18 margin-top-10" style={styleFont}>工单管理</p>
                    </Card>
                  </Link>
                </Col>

                <Col span={6}>
                  <Link to={{pathname: '/finance/expense/list', query: {incomeShow: 1, expenseShow: 0}}}>
                    <Card style={styleShortcut}>
                      <p><img src={icon3png} alt="" style={styleImg}/></p>
                      <p className="font-size-18 margin-top-10" style={styleFont}>新增收入</p>
                    </Card>
                  </Link>
                </Col>

                <Col span={6}>
                  <Link to={{pathname: '/finance/expense/list', query: {incomeShow: 0, expenseShow: 1}}}>
                    <Card style={styleShortcut}>
                      <p><img src={icon4png} alt="" style={styleImg}/></p>
                      <p className="font-size-18 margin-top-10" style={styleFont}>新增支出</p>
                    </Card>
                  </Link>
                </Col>
              </Row>

              <Row gutter={20} style={{marginTop: '20px'}}>
                <Col span={6}>
                  <Link to={{pathname: '/marketing/membercard/sale'}} target="_blank">
                    <Card style={styleShortcut}>
                      <p><img src={icon5png} alt="" style={styleImg}/></p>
                      <p className="font-size-18 margin-top-10" style={styleFont}>办理会员</p>
                    </Card>
                  </Link>
                </Col>

                <Col span={6}>
                  <Link to={{pathname: '/warehouse/purchase/new'}}>
                    <Card style={styleShortcut}>
                      <p><img src={icon6png} alt="" style={styleImg}/></p>
                      <p className="font-size-18 margin-top-10" style={styleFont}>采购开单</p>
                    </Card>
                  </Link>
                </Col>

                <Col span={6}>
                  <Link to={{pathname: '/aftersales/consumptive_material'}}>
                    <Card style={styleShortcut}>
                      <p><img src={icon7png} alt="" style={styleImg}/></p>
                      <p className="font-size-18 margin-top-10" style={styleFont}>耗材领用</p>
                    </Card>
                  </Link>
                </Col>

                <Col span={6}>
                  <Link to={{pathname: '/finance/monthly_report'}}>
                    <Card style={styleShortcut}>
                      <p><img src={icon8png} alt="" style={styleImg}/></p>
                      <p className="font-size-18 margin-top-10" style={styleFont}>月报汇总</p>
                    </Card>
                  </Link>
                </Col>
              </Row>

              <p className="font-size-18 margin-top-25 margin-bottom-20" style={styleFont}>任务管理</p>
              <Row type="flex" justify="space-around">
                <Col span={7}>
                  <Card title={contentCustomertask}>
                    <Row>
                      <Link to={{pathname: '/task/customertask', query: {status: 0}}}>
                        <Col span={12} style={{textAlign: 'center'}}>
                          <p style={{color: '#999', fontSize: '12px'}}>未跟进(人)</p>
                          <p style={{color: '#333', fontSize: '36px'}}>{commonTask.unfollow}</p>
                        </Col>
                      </Link>
                      <Link to={{pathname: '/task/customertask', query: {status: 1}}}>
                        <Col span={12} style={{textAlign: 'center'}}>
                          <p style={{color: '#999', fontSize: '12px'}}>进行中(人)</p>
                          <p style={{color: '#333', fontSize: '36px'}}>{commonTask.conducting}</p>
                        </Col>
                      </Link>
                    </Row>
                    <Row>
                      <Link to={{pathname: '/task/customertask', query: {status: 0}}}>
                        <Col span={24} style={{textAlign: 'center'}}>
                          <p>详情></p>
                        </Col>
                      </Link>
                    </Row>
                  </Card>
                </Col>

                <Col span={7}>
                  <Card title={contentRenewalTask}>

                    <Row>
                      <Link to={{pathname: '/task/renewaltask', query: {status: 0}}}>
                        <Col span={12} style={{textAlign: 'center'}}>
                          <p style={{color: '#999', fontSize: '12px'}}>未跟进(人)</p>
                          <p style={{color: '#333', fontSize: '36px'}}>{insuranceTask.unfollow}</p>
                        </Col>
                      </Link>
                      <Link to={{pathname: '/task/renewaltask', query: {status: 1}}}>
                        <Col span={12} style={{textAlign: 'center'}}>
                          <p style={{color: '#999', fontSize: '12px'}}>进行中(人)</p>
                          <p style={{color: '#333', fontSize: '36px'}}>{insuranceTask.conducting}</p>
                        </Col>
                      </Link>
                    </Row>
                    <Row>
                      <Link to={{pathname: '/task/renewaltask', query: {status: 0}}}>
                        <Col span={24} style={{textAlign: 'center'}}>
                          <p>详情></p>
                        </Col>
                      </Link>
                    </Row>
                  </Card>
                </Col>
                <Col span={7}>
                  <Card title={contentYearlyInspectionTask}>

                    <Row>
                      <Link to={{pathname: '/task/yearlyinspectiontask', query: {status: 0}}}>
                        <Col span={12} style={{textAlign: 'center'}}>
                          <p style={{color: '#999', fontSize: '12px'}}>未跟进(人)</p>
                          <p style={{color: '#333', fontSize: '36px'}}>{inspectionTask.unfollow}</p>
                        </Col>
                      </Link>
                      <Link to={{pathname: '/task/yearlyinspectiontask', query: {status: 1}}}>
                        <Col span={12} style={{textAlign: 'center'}}>
                          <p style={{color: '#999', sfontSize: '12px'}}>进行中(人)</p>
                          <p style={{color: '#333', fontSize: '36px'}}>{inspectionTask.conducting}</p>
                        </Col>
                      </Link>
                    </Row>
                    <Row>
                      <Link to={{pathname: '/task/yearlyinspectiontask', query: {status: 0}}}>
                        <Col span={24} style={{textAlign: 'center'}}>
                          <p>详情></p>
                        </Col>
                      </Link>
                    </Row>
                  </Card>
                </Col>

              </Row>
            </Card>
          </Col>

          <Col span={6} offset={1}>
            <Card style={{height: this.state.documentHeight}}>
              <Card title={<span style={{fontWeight: 'bold', fontSize: '16px', color: '#333'}}>门店信息</span>}>
                <p style={{color: '#999'}}>门店名称<span className="margin-left-10"
                                                     style={{color: '#333'}}>{JSON.parse(window.sessionStorage.USER_SESSION).company_name}</span>
                </p>
                <p className="margin-top-10" style={{color: '#999'}}>门店编号<span className="margin-left-10"
                                                                               style={{color: '#333'}}>{JSON.parse(window.sessionStorage.USER_SESSION).company_num}</span>
                </p>
              </Card>

              <Card style={{marginTop: '20px'}}
                    title={<span style={{fontWeight: 'bold', fontSize: '16px', color: '#333'}}>下载中心</span>}>

                <p style={{color: '#333'}}>水稻汽车-员工版：
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

                <p className="margin-top-10" style={{color: '#333'}}>水稻汽车-客户版：
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
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
