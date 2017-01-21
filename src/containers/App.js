import React from 'react';
import {Menu, Breadcrumb, Dropdown, Icon} from 'antd';
import {Link} from 'react-router';
import classNames from 'classnames';
import moment from 'moment';
import 'moment/locale/zh-cn';

import api from '../middleware/api';
moment.locale('zh-cn');

require('../styles/layout.css');
require('../styles/app.css');
require('../styles/common.css');

let logo = require('../../brand.logo.png');

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
const BreadcrumbItem = Breadcrumb.Item;

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'potential',
    };
    [
      'handleMenuClick',
      'logout',
      'handleClick',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    this.setState({current: sessionStorage.getItem('menu')});
  }

  componentDidMount() {
    let USER_SESSION = sessionStorage.getItem('USER_SESSION');
    USER_SESSION = USER_SESSION ? JSON.parse(USER_SESSION) : {};

    const uid = USER_SESSION && USER_SESSION.uid;

    if (location.pathname.indexOf('app/download') > 0) {
      return;
    }

    // 使用browserHistory时使用
    if (!!uid) {
      if (!location.pathname) {
        location.href = '/';
      }
    } else {
      location.herf = 'login';
    }
  }

  logout() {
    api.ajax({
      url: api.system.logout(),
      type: 'POST',
      permission: 'no-login',
    }, function (data) {
      if (data.code === 0) {
        location.href = '/';
        sessionStorage.clear();
      }
    });
  }

  handleClick(e) {
    this.setState({current: e.key});
    sessionStorage.setItem('menu', e.key);
  }

  handleMenuClick(e) {
    if (e.key === 'logout') {
      this.logout();
    }
  }

  renderSettings(department) {
    let adminClass = classNames({
      'hide': department >= 0,
    });

    return (
      <Menu onClick={this.handleMenuClick}>
        {/*
         <MenuItem key="switch-store" className={department < 0 ? 'switch-store' : 'hide'}>
         <Icon type="swap"/>切换门店
         </MenuItem>
         */}
        <MenuItem key="company" className={adminClass}>
          <Link to={{pathname: '/company'}}><Icon type="edit"/>门店管理</Link>
        </MenuItem>
        <MenuItem key="advert" className={adminClass}>
          <Link to={{pathname: '/advert'}}><Icon type="bars"/>广告管理</Link>
        </MenuItem>
        <MenuItem key="activity" className={adminClass}>
          <Link to={{pathname: '/activity'}}><Icon type="bars"/>活动管理</Link>
        </MenuItem>
        <MenuItem key="comment" className={adminClass}>
          <Link to={{pathname: '/comment'}}><Icon type="bars"/>评价管理</Link>
        </MenuItem>

        <MenuItem key="logout"><Icon type="poweroff"/> 退出</MenuItem>
      </Menu>
    );
  }

  render() {
    let USER_SESSION = sessionStorage.getItem('USER_SESSION');
    if (USER_SESSION) USER_SESSION = JSON.parse(USER_SESSION);
    const uid = USER_SESSION && USER_SESSION.uid || null;
    const name = USER_SESSION && USER_SESSION.name || null;
    const department = USER_SESSION && USER_SESSION.department;
    const companyName = USER_SESSION && USER_SESSION.company_name || null;

    const {routes, children} = this.props;
    const {current} = this.state;

    const showMenu = classNames({
      'layout-menu': true,
      'hide': !uid,
    });

    const showSetting = classNames({
      'layout-setting': !!uid,
      'hide': !uid,
    });

    const settingContainer = classNames({
      'setting-container': true,
      'no-company': department >= 0,
    });

    return (
      <div className="layout-top">
        <div className="layout-header">
          <div className="layout-wrapper">
            <div className="layout-logo">
              <Link to={{pathname: '/'}}>
                <img src={logo} alt="水稻汽车"/>
              </Link>
            </div>

            <div className={showMenu}>
              <Menu
                theme="dark"
                mode="horizontal"
                onClick={this.handleClick}
                selectedKeys={[current]}
                style={{lineHeight: '64px', marginLeft: '24px', fontSize: '14px'}}
              >
                <MenuItem key="home">
                  <Link to={{pathname: '/'}}><Icon type="home"/>首页</Link>
                </MenuItem>

                <SubMenu
                  key="presales" title={<span><Icon type="shopping-cart"/>销售</span>}
                  className={api.hasPresalesPermission() ? 'presales' : 'hide'}
                >
                  <MenuItem key="presales_potential">
                    <Link to={{pathname: '/presales/potential'}}>意向管理</Link>
                  </MenuItem>
                  <MenuItem key="presales_customer">
                    <Link to={{pathname: '/presales/customer'}}>成交客户</Link>
                  </MenuItem>
                </SubMenu>

                <SubMenu
                  key="aftersales" title={<span><Icon type="setting"/>售后</span>}
                  className={api.hasAftersalesPermission() ? 'aftersales' : 'hide'}
                >
                  <MenuItem key="aftersales_create">
                    <Link to={{pathname: '/aftersales/project/create'}} target="_blank">创建工单</Link>
                  </MenuItem>
                  <MenuItem key="aftersales_project">
                    <Link to={{pathname: '/aftersales/project/index'}}>工单管理</Link>
                  </MenuItem>
                  <MenuItem key="aftersales_customer">
                    <Link to={{pathname: '/aftersales/customer'}}>客户管理</Link>
                  </MenuItem>
                  <MenuItem key="aftersales_consumptive_material">
                    <Link to={{pathname: '/aftersales/consumptive_material'}}>耗材领用</Link>
                  </MenuItem>
                </SubMenu>

                <SubMenu
                  key="warehouse" title={<span><Icon type="appstore-o"/>仓库</span>}
                  className={api.hasAftersalesPermission() ? 'warehouse' : 'hide'}
                >
                  <MenuItem key="warehouse_part_list">
                    <Link to={{pathname: '/warehouse/part/index'}}>配件管理</Link>
                  </MenuItem>
                  <MenuItem key="warehouse_part_category">
                    <Link to={{pathname: '/warehouse/category'}}>配件分类管理</Link>
                  </MenuItem>
                  <MenuItem key="warehouse_supplier">
                    <Link to={{pathname: '/warehouse/supplier'}}>供应商管理</Link>
                  </MenuItem>
                  <MenuItem key="warehouse_purchase">
                    <Link to={{pathname: '/warehouse/purchase/index'}}>采购单管理</Link>
                  </MenuItem>
                  <MenuItem key="warehouse_purchase_cancel">
                    <Link to={{pathname: '/warehouse/purchase-reject/index'}}>退货单管理</Link>
                  </MenuItem>
                  <MenuItem key="warehouse_logs">
                    <Link to={{pathname: '/warehouse/logs'}}>出入库管理</Link>
                  </MenuItem>
                  <MenuItem key="warehouse_stocktaking">
                    <Link to={{pathname: '/warehouse/stocktaking/index'}}>盘点管理</Link>
                  </MenuItem>
                  <MenuItem key="warehouse_part_store">
                    <Link to={{pathname: '/warehouse/part/store'}}>配件商城</Link>
                  </MenuItem>
                </SubMenu>

                <SubMenu
                  key="maintain_item" title={<span><Icon type="book"/>项目</span>}
                  className={api.hasAftersalesPermission() ? 'warehouse' : 'hide'}
                >
                  <MenuItem key="maintain_item_mange">
                    <Link to={{pathname: '/maintain-item'}}>项目管理</Link>
                  </MenuItem>
                </SubMenu>

                <SubMenu
                  key="dashboard"
                  title={<span><Icon type="desktop"/>报表</span>}
                  className={(api.hasPresalesSuperPermission() || api.hasAftersalesSuperPermission()) ? 'dashboard' : 'hide'}
                >
                  <MenuItem
                    key="dashboard_presales"
                    className={api.hasPresalesSuperPermission() ? 'dashboard_presales' : 'hide'}
                  >
                    <Link to={{pathname: '/dashboard/presales'}}>销售业务</Link>
                  </MenuItem>
                  <MenuItem
                    key="dashboard_aftersales"
                    className={api.hasAftersalesSuperPermission() ? 'dashboard_aftersales' : 'hide'}
                  >
                    <Link to={{pathname: '/dashboard/aftersales'}}>售后业务</Link>
                  </MenuItem>
                </SubMenu>

                <SubMenu
                  key="finance"
                  title={<span><Icon type="pay-circle-o"/>财务</span>}
                  className={(api.hasPresalesSuperPermission() || api.hasAftersalesSuperPermission() || api.hasSuperFinancePermission()) ? 'finance' : 'hide'}
                >
                  <MenuItem
                    key="presales-income"
                    className={api.hasPresalesSuperPermission() ? 'presales-income' : 'hide'}
                  >
                    <Link to={{pathname: '/finance/presales-income/list'}}>新车收入</Link>
                  </MenuItem>
                 {/* <MenuItem
                    key="aftersales-income"
                    className={api.hasAftersalesSuperPermission() ? 'aftersales-income' : 'hide'}
                  >
                    <Link to={{pathname: '/finance/aftersales-income/list'}}>售后收入</Link>
                  </MenuItem>*/}
                  {/*<MenuItem
                    key="aftersales-income-transfer"
                    className={api.hasSuperFinancePermission() ? 'aftersales-income-transfer' : 'hide'}
                  >
                    <Link
                      to={{pathname: '/finance/aftersales-income-transfer/list'}}>售后收入结算</Link>
                  </MenuItem>*/}
                  <MenuItem key="expense">
                    <Link to={{pathname: '/finance/expense/list'}}>收支管理</Link>
                  </MenuItem>

                  <MenuItem key="fixed_assets">
                    <Link to={{pathname: '/finance/fixed-assets/index'}}>固定资产管理</Link>
                  </MenuItem>

                  <MenuItem key="monthly_report">
                    <Link to={{pathname: '/finance/monthly_report'}}>月报汇总</Link>
                  </MenuItem>
                </SubMenu>

                <SubMenu
                  key="personnel"
                  title={<span><Icon type="team"/>人事</span>}
                  className={api.hasPersonnelPermission() ? 'personnel' : 'hide'}
                >
                  <MenuItem key="user">
                    <Link to={{pathname: '/personnel/user/list'}}>员工管理</Link>
                  </MenuItem>
                  <MenuItem key="salary">
                    <Link to={{pathname: '/personnel/salary/list'}}>薪资管理</Link>
                  </MenuItem>
                </SubMenu>

                <SubMenu
                  key="marketing" title={<span><Icon type="like"/>营销</span>}
                  className={api.hasPersonnelPermission() ? 'personnel' : 'hide'}
                >
                  <MenuItem
                    key="timecount"
                    className={api.hasSuperFinancePermission() ? 'personnel' : 'hide'}
                  >
                    <Link to={{pathname: '/marketing/timecount'}}>计次优惠</Link>
                  </MenuItem>
                  <MenuItem
                    key="discount"
                    className={api.hasSuperFinancePermission() ? 'personnel' : 'hide'}
                  >
                    <Link to={{pathname: '/marketing/discount'}}>折扣优惠</Link>
                  </MenuItem>
                  <MenuItem
                    key="membership_card"
                    className={api.hasSuperFinancePermission() ? 'personnel' : 'hide'}
                  >
                    <Link to={{pathname: '/marketing/membercard-type/list'}}>会员卡管理</Link>
                  </MenuItem>

                  <MenuItem key="member_card_sale">
                    <Link to={{pathname: '/marketing/membercard/sale'}}>会员开卡</Link>
                  </MenuItem>
                  <MenuItem key="member_card_sale_log">
                    <Link to={{pathname: '/marketing/membercard/salelog'}}>会员购买记录</Link>
                  </MenuItem>
                </SubMenu>

                <SubMenu
                  key="task" title={<span><Icon type="tag-o"/>任务</span>}
                  className={api.hasPersonnelPermission() ? 'personnel' : 'hide'}
                >
                  <MenuItem key="renewal_task">
                    <Link to={{pathname: '/task/customertask'}}>客户任务</Link>
                  </MenuItem>
                  <MenuItem key="yearly_inspection_task">
                    <Link to={{pathname: '/task/renewaltask'}}>续保任务</Link>
                  </MenuItem>
                  <MenuItem key="customer_task">
                    <Link to={{pathname: '/task/yearlyinspectiontask'}}>年检任务</Link>
                  </MenuItem>
                </SubMenu>
              </Menu>
            </div>

            <div className={showSetting}>
              <div className={settingContainer}>
                <Dropdown overlay={this.renderSettings(department)} trigger={['click']}>
                  <a className="ant-dropdown-link" href="javascript:;">
                    <Icon type="setting"/> {name}
                  </a>
                </Dropdown>

                <div className="company-name">{department >= 0 ? null : companyName}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="layout-subheader hide">
          <div className="layout-wrapper">
            <Menu mode="horizontal" defaultSelectedKeys={['1']}>
              <MenuItem key="1">二级导航</MenuItem>
              <MenuItem key="2">二级导航</MenuItem>
              <MenuItem key="3">二级导航</MenuItem>
            </Menu>
          </div>
        </div>

        <div className="layout-content-wrapper">
          <Breadcrumb>
            {routes.map((route, index) => <BreadcrumbItem key={index}>{route.breadcrumbName}</BreadcrumbItem>)}
          </Breadcrumb>

          <div className="layout-container" style={{minHeight: document.body.clientHeight - 170}}>
            <div style={{height: '100%'}}>
              <div style={{clear: 'both'}}>
                {children}
              </div>
            </div>
          </div>

          <div className="layout-footer">
            水稻汽车 版权所有 © 2017
          </div>
        </div>
      </div>
    );
  }
}
