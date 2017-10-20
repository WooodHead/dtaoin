import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import api from '../middleware/api';
import text from '../config/text';

require('../styles/home.less');

const icon1 = require('../images/home/home_icon_1.png');
const icon2 = require('../images/home/home_icon_2.png');
const icon3 = require('../images/home/home_icon_3.png');
const icon4 = require('../images/home/home_icon_4.png');
const icon5 = require('../images/home/home_icon_5.png');
const icon6 = require('../images/home/home_icon_6.png');

/**
 * 首页
 */
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      remindSummary: {},
      warnTotal: 0,
      bodyClientWidth: '',
      greetings: '',
    };

    [
      'getTaskSummary',
      'getBodyClientWidth',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const bodyClientWidth = document.body.clientWidth;
    this.setState({ bodyClientWidth });

    window.addEventListener('resize', this.getBodyClientWidth);

    this.getTaskSummary();
    const documentHeight = document.documentElement.clientHeight || window.innerHeight;
    this.setState({ documentHeight: documentHeight * 0.85 });

    const body = document.getElementsByTagName('body')[0];
    const layOutContainer = this.refs.homeContent.parentNode.parentNode.parentNode;
    layOutContainer.style.overflow = 'initial';
    body.style.overflowX = 'hidden';

    this.getGreetings();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.getBodyClientWidth);

    const body = document.getElementsByTagName('body')[0];
    const layOutContainer = this.refs.homeContent.parentNode.parentNode.parentNode;
    layOutContainer.style.overflow = 'hidden';
    body.style.overflowX = 'initial';
  }

  getBodyClientWidth() {
    const bodyClientWidth = document.body.clientWidth;
    this.setState({ bodyClientWidth });
  }

  getGreetings() {
    const hour = Number(new Date().getHours());
    let greetings = '';
    if (hour >= 6 && hour < 9) {
      greetings = text.greetings['1'];
    } else if (hour >= 9 && hour < 11) {
      greetings = text.greetings['2'];
    } else if (hour >= 11 && hour < 14) {
      greetings = text.greetings['3'];
    } else if (hour >= 14 && hour < 18) {
      greetings = text.greetings['4'];
    } else if (hour >= 18 && hour < 21) {
      greetings = text.greetings['5'];
    } else if (hour >= 21 && hour < 6) {
      greetings = text.greetings['6'];
    }

    this.setState({ greetings });
  }

  getTaskSummary() {
    // 保险，年检，保养及其他
    api.ajax({ url: api.task.tastSummary() }, data => {
      this.setState({ remindSummary: data.res });
    });

    // 库存预警
    api.ajax({ url: api.warehouse.part.partLowAmountList(1) }, data => {
      const warnTotal = data.res.total;
      this.setState({ warnTotal });
    });
  }

  render() {
    const {
      remindSummary,
      warnTotal,
      greetings,
    } = this.state;

    const newInsuranceRemind = classNames({
      hidden: !Number(remindSummary.new_insurance) > 0,
    });
    const newInspectionRemind = classNames({
      hidden: !Number(remindSummary.new_inspection) > 0,
    });
    const newMaintainRemind = classNames({
      hidden: !Number(remindSummary.new_maintain) > 0,
    });
    const newCommonRemind = classNames({
      hidden: !Number(remindSummary.new_common) > 0,
    });
    const newBirthdayRemind = classNames({
      hidden: !Number(remindSummary.new_birthday) > 0,
    });
    const newCouponRemind = classNames({
      hidden: !Number(remindSummary.new_coupon_card) > 0,
    });
    const newDebtRemind = classNames({
      hidden: !Number(remindSummary.new_debt) > 0,
    });

    return (
      <div className="home-content" ref="homeContent" id="homeContent" style={{ marginTop: -20 }}>
        <div className="content">
          <p className="welcome">{greetings}</p>

          <div className="top-navigation">
            <Link to={{ pathname: '/aftersales/project/new' }} target="_blank">
              <div className="navigation">
                <img src={icon1} />
                <div>
                  <p>创建工单</p>
                  <p>日结工单，账目严谨</p>
                </div>
              </div>
            </Link>

            <Link to={{ pathname: '/aftersales/project/index' }} target="_blank">
              <div className="navigation">
                <img src={icon2} />
                <div>
                  <p>工单管理</p>
                  <p>规范管理，提升效率</p>
                </div>
              </div>
            </Link>
            <Link to={{ pathname: '/marketing/membercard/sale' }} target="_blank">
              <div className="navigation">
                <img src={icon3} />
                <div>
                  <p>套餐开卡</p>
                  <p>打包销售，提升客户粘性</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="bottom-navigation">
            <Link to={{ pathname: '/warehouse/purchase/new' }} target="_blank">
              <div className="navigation">
                <img src={icon4} />
                <div>
                  <p>采购开单</p>
                  <p>按需采购，及时补充库存</p>
                </div>
              </div>
            </Link>

            <Link to={{ pathname: '/finance/expense/list' }} target="_blank">
              <div className="navigation">
                <img src={icon5} />
                <div>
                  <p>收支管理</p>
                  <p>流水随手记,</p>
                  <p>收支明细一目了然</p>
                </div>
              </div>
            </Link>

            <Link to={{ pathname: '/aftersales/customer/index' }} target="_blank">
              <div className="navigation">
                <img src={icon6} />
                <div>
                  <p>客户管理</p>
                  <p>提升客户关怀,</p>
                  <p>挖掘潜在商机</p>
                </div>
              </div>
            </Link>
          </div>

          <p className="task-table-title">任务及提醒</p>
          <div className="task-table">
            <div className="table-row">
              <div className="table-cell">
                <Link to={{ pathname: '/remind/maintain' }} target="_blank">
                  <div className="title">
                    <p>保养任务</p>
                    <p className={newMaintainRemind}>{remindSummary.new_maintain}</p>
                  </div>
                  <div className="progress">
                    <p>{remindSummary.maintain_summary || 0}</p>
                    <p>未跟进</p>
                  </div>
                </Link>
              </div>

              <div className="table-cell">
                <Link to={{ pathname: '/remind/renewal' }} target="_blank">
                  <div className="title">
                    <p>续保任务</p>
                    <p className={newInsuranceRemind}>{remindSummary.new_insurance}</p>
                  </div>
                  <div className="progress">
                    <p>{remindSummary.insurance_summary || 0}</p>
                    <p>未跟进</p>
                  </div>
                </Link>
              </div>

              <div className="table-cell">
                <Link to={{ pathname: '/remind/yearly-inspection' }} target="_blank">
                  <div className="title">
                    <p>年检任务</p>
                    <p className={newInspectionRemind}>{remindSummary.new_inspection}</p>
                  </div>
                  <div className="progress">
                    <p>{remindSummary.inspection_summary || 0}</p>
                    <p>未跟进</p>
                  </div>
                </Link>
              </div>

              <div className="table-cell">
                <Link to={{ pathname: '/remind/coupon-card' }} target="_blank">
                  <div className="title">
                    <p>套餐卡到期</p>
                    <p className={newCouponRemind}>{remindSummary.new_coupon_card}</p>
                  </div>
                  <div className="progress">
                    <p>{remindSummary.coupon_card_summary || 0}</p>
                    <p>未跟进</p>
                  </div>
                </Link>
              </div>
            </div>

            <div className="table-row">
              <div className="table-cell">
                <Link to={{ pathname: '/remind/debt' }} target="_blank">
                  <div className="title">
                    <p>收款提醒</p>
                    <p className={newDebtRemind}>{remindSummary.new_debt}</p>
                  </div>
                  <div className="progress">
                    <p>{remindSummary.debt_summary || 0}</p>
                    <p>未跟进</p>
                  </div>
                </Link>
              </div>

              <div className="table-cell">
                <Link to={{ pathname: '/remind/birthday' }} target="_blank">
                  <div className="title">
                    <p>生日提醒</p>
                    <p className={newBirthdayRemind}>{remindSummary.new_birthday}</p>
                  </div>
                  <div className="progress">
                    <p>{remindSummary.birthday_summary || 0}</p>
                    <p>未跟进</p>
                  </div>
                </Link>
              </div>

              <div className="table-cell">
                <Link to={{ pathname: '/remind/common' }} target="_blank">
                  <div className="title">
                    <p>其他回访</p>
                    <p className={newCommonRemind}>{remindSummary.new_common}</p>
                  </div>
                  <div className="progress">
                    <p>{remindSummary.common_summary || 0}</p>
                    <p>未跟进</p>
                  </div>
                </Link>
              </div>

              <div className="table-cell">
                <Link to={{ pathname: 'aftersales/inventory-warn/index' }} target="_blank">
                  <div className="title">
                    <p>库存预警</p>
                  </div>
                  <div className="progress">
                    <p>{warnTotal}</p>
                    <p>低于安全库存</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
