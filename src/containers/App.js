import React from 'react'
import {message, Menu, Breadcrumb, Dropdown, Icon} from 'antd'
import {Link} from 'react-router'
import classNames from 'classnames'
import api from '../middleware/api'
import text from '../middleware/text'
import AppDownloadModal from '../components/modals/company/AppDownloadModal'

require('../styles/layout.css');
require('../styles/app.css');
require('../styles/common.css');

const SubMenu = Menu.SubMenu;

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'potential',
      initPage: 1,
    };
    [
      'handleMenuClick',
      'logout',
      'handleClick',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    // let bcs = this.assembleBreadcrumb();
    this.setState({
      current: sessionStorage.getItem('menu'),
      isSwitched: Boolean(sessionStorage.getItem('isSwitched')),
    });
  }

  componentDidMount() {
    let USER_SESSION = sessionStorage.getItem('USER_SESSION');
    if (USER_SESSION) USER_SESSION = JSON.parse(USER_SESSION);

    const uid = USER_SESSION && USER_SESSION.uid;
    const department = USER_SESSION && USER_SESSION.department;

    let {isSwitched} = this.state;
    if (location.hash.indexOf('app/download') > 0) {
      return;
    }

    if (!!uid) {
      if (department > 0 || isSwitched) {
        if (!this.getRoute()) {
          location.hash = api.hasPresalesPermission() ? 'presales/potential/list' : 'aftersales/project/list';
        }
      } else {
        location.hash = 'company/board';
      }
    } else {
      location.hash = 'login';
    }
  }

  getRoute() {
    return location.hash.replace(/\?[\w|=|&]*/, '').replace(/\#\//, '');
  }

  assembleBreadcrumb() {
    let route = this.getRoute();
    if (!route) {
      return ['面板'];
    }
    let [bc1, bc2, bc3] = route.split('/');
    let bcs = [];
    if (bc1) {
      bcs.push(text.route[bc1]);
    }
    if (bc2) {
      bcs.push(text.route[bc2]);
    }
    if (bc3) {
      bcs.push(text.route[bc3]);
    }
    return bcs;
  }

  logout() {
    api.ajax({
      url: api.logout(),
      type: 'POST',
      permission: 'no-login'
    }, function (data) {
      if (data.code === 0) {
        location.href = '/';
        sessionStorage.clear();
      }
    })
  }

  handleClick(e) {
    this.setState({current: e.key});
    sessionStorage.setItem('menu', e.key);
  }

  handleMenuClick(e) {
    if (e.key === 'logout') {
      this.logout();
    }
    if (e.key === 'switch-store') {
      location.hash = 'company/board';
    }
    if (e.key === 'company-list') {
      location.hash = 'company/list';
    }
    if (e.key === 'advert-list') {
      location.hash = 'advert/list';
    }
    if (e.key === 'activity-list') {
      location.hash = 'activity/list';
    }
    if (e.key === 'comment-list') {
      location.hash = 'comment/list';
    }
  }

  renderSettings() {
    let USER_SESSION = sessionStorage.getItem('USER_SESSION');
    if (USER_SESSION) USER_SESSION = JSON.parse(USER_SESSION);
    const department = USER_SESSION.department;
    const brand_name = USER_SESSION.brand_name;
    return (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="switch-store" className={department < 0 ? 'switch-store' : 'hide'}><Icon
          type="swap"/>切换门店</Menu.Item>
        <Menu.Item key="company-list" className={department < 0 ? 'company-list' : 'hide'}><Icon
          type="edit"/>门店管理</Menu.Item>
        <Menu.Item key="advert-list" className={department < 0 ? 'advert-list' : 'hide'}><Icon
          type="bars"/>广告管理</Menu.Item>
        <Menu.Item key="activity-list" className={department < 0 ? 'activity-list' : 'hide'}><Icon
          type="bars"/>活动管理</Menu.Item>
        <Menu.Item key="comment-list" className={department < 0 ? 'comment-list' : 'hide'}><Icon
          type="bars"/>评价管理</Menu.Item>
        <Menu.Item key="app-download" className={brand_name === '水稻汽车' ? 'app-download' : 'hide'}><Icon
          type="download"/><AppDownloadModal style={{width: '80%'}}/></Menu.Item>
        <Menu.Item key="logout"><Icon type="poweroff"/> 退出</Menu.Item>
      </Menu>
    )
  }

  render() {
    let USER_SESSION = sessionStorage.getItem('USER_SESSION');
    if (USER_SESSION) USER_SESSION = JSON.parse(USER_SESSION);
    const uid = USER_SESSION && USER_SESSION.uid;
    const company_name = USER_SESSION && USER_SESSION.company_name;
    const department = USER_SESSION && USER_SESSION.department;
    const brand_logo = USER_SESSION && USER_SESSION.brand_logo;
    const brand_name = USER_SESSION && USER_SESSION.brand_name;

    const {children} = this.props;
    const {
      current,
      isSwitched,
      initPage,
    } = this.state;

    const showMenu = classNames({
      'ant-layout-menu': department > 0 || isSwitched,
      'hide': !uid || (department < 0 && !isSwitched),
    });

    const showSetting = classNames({
      'ant-layout-setting': !!uid,
      'hide': !uid
    });

    return (
      <div className="ant-layout-top">
        <div className="ant-layout-header">
          <div className="ant-layout-wrapper">
            <div className="ant-layout-logo">
              <a href={department < 0 ? '#/company/board' : '#'} className="logo">
                <img src={brand_logo} alt={brand_name}/>
              </a>
              <div className="store">{company_name}</div>
            </div>

            <div className={showMenu}>
              <Menu
                theme="dark"
                mode="horizontal"
                onClick={this.handleClick}
                selectedKeys={[current]}
                style={{lineHeight: '64px', marginLeft: '24px', fontSize: '14px'}}>

                <SubMenu key="presales" title={<span><Icon type="shopping-cart"/> 销售</span>}
                         className={api.hasPresalesPermission() ? 'presales' : 'hide'}>
                  <Menu.Item key="presales_potential">
                    <Link
                      to={{pathname: '/presales/potential/list', query: {page: initPage}}}>
                      意向客户
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="presales_customer">
                    <Link
                      to={{pathname: "/presales/customer/list", query: {page: initPage}}}>
                      成交客户
                    </Link>
                  </Menu.Item>
                </SubMenu>

                <SubMenu key="aftersales" title={<span><Icon type="setting"/> 售后</span>}
                         className={api.hasAftersalesPermission() ? 'aftersales' : 'hide'}>
                  <Menu.Item key="aftersales_create">
                    <Link
                      to={{pathname: "/aftersales/project/create"}} target="_blank">
                      创建工单
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="aftersales_project">
                    <Link
                      to={{pathname: "/aftersales/project/list", query: {page: initPage}}}>
                      工单管理
                    </Link>
                  </Menu.Item>
                  {/*
                   <Menu.Item key="aftersales_potential">
                   <Link
                   to={{pathname: "/aftersales/potential/list", query: {page: initPage}}}>
                   潜在客户
                   </Link>
                   </Menu.Item>
                   */}
                  <Menu.Item key="aftersales_customer">
                    <Link
                      to={{pathname: "/aftersales/customer/list", query: {page: initPage}}}>
                      客户管理
                    </Link>
                  </Menu.Item>
                </SubMenu>

                <SubMenu key="warehouse" title={<span><Icon type="appstore-o"/> 仓库</span>}
                         className={api.hasAftersalesPermission() ? 'warehouse' : 'hide'}>
                  <Menu.Item key="warehouse_part_list">
                    <Link
                      to={{pathname: "/warehouse/part/list", query: {page: initPage}}}>
                      配件管理
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="warehouse_part_category">
                    <Link
                      to={{pathname: "/warehouse/category/list", query: {page: initPage}}}>
                      配件分类管理
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="warehouse_supplier">
                    <Link
                      to={{pathname: "/warehouse/supplier/list", query: {page: initPage}}}>
                      供应商管理
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="warehouse_part_entry_log">
                    <Link
                      to={{pathname: "/warehouse/part-entry-log/list", query: {page: initPage}}}>
                      进货历史
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="warehouse_part_store">
                    <Link
                      to={{pathname: "/warehouse/part/store", query: {page: initPage}}}>
                      配件商城
                    </Link>
                  </Menu.Item>
                </SubMenu>

                <SubMenu key="maintain_item" title={<span><Icon type="book"/> 项目</span>}
                         className={api.hasAftersalesPermission() ? 'warehouse' : 'hide'}>
                  <Menu.Item key="maintain_item_mange">
                    <Link
                      to={{pathname: "/maintain/item", query: {page: initPage}}}>
                      项目管理
                    </Link>
                  </Menu.Item>
                  {/*<Menu.Item key="maintain_item_category">*/}
                  {/*<Link*/}
                  {/*to={{pathname: "/maintain/item/category", query: {page: initPage}}}>*/}
                  {/*项目分类*/}
                  {/*</Link>*/}
                  {/*</Menu.Item>*/}
                </SubMenu>

                <SubMenu key="dashboard" title={<span><Icon type="desktop"/> 报表</span>}
                         className={(api.hasPresalesSuperPermission() || api.hasAftersalesSuperPermission()) ? 'dashboard' : 'hide'}>
                  <Menu.Item key="dashboard_presales"
                             className={api.hasPresalesSuperPermission() ? 'dashboard_presales' : 'hide'}>
                    <Link
                      to={{pathname: '/dashboard/presales', query: {page: initPage}}}>
                      销售业务
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="dashboard_aftersales"
                             className={api.hasAftersalesSuperPermission() ? 'dashboard_aftersales' : 'hide'}>
                    <Link
                      to={{pathname: "/dashboard/aftersales", query: {page: initPage}}}>
                      售后业务
                    </Link>
                  </Menu.Item>
                </SubMenu>

                <SubMenu key='finance' title={<span><Icon type="pay-circle-o"/> 财务</span>}
                         className={(api.hasPresalesSuperPermission() || api.hasAftersalesSuperPermission() || api.hasSuperFinancePermission()) ? 'finance' : 'hide' }>
                  <Menu.Item key="presales-income"
                             className={api.hasPresalesSuperPermission() ? 'presales-income' : 'hide'}>
                    <Link
                      to={{pathname: "/finance/presales-income/list", query: {page: initPage}}}>
                      售前收入
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="aftersales-income"
                             className={api.hasAftersalesSuperPermission() ? 'aftersales-income' : 'hide'}>
                    <Link
                      to={{pathname: "/finance/aftersales-income/list", query: {page: initPage}}}>
                      售后收入
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="aftersales-income-transfer"
                             className={api.hasSuperFinancePermission() ? 'aftersales-income-transfer' : 'hide'}>
                    <Link
                      to={{pathname: "/finance/aftersales-income-transfer/list", query: {page: initPage}}}>
                      售后收入结算
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="expense">
                    <Link
                      to={{pathname: "/finance/expense/list", query: {page: initPage}}}>
                      支出明细
                    </Link>
                  </Menu.Item>
                </SubMenu>

                <SubMenu key='personnel' title={<span><Icon type="team"/> 人事</span>}
                         className={api.hasPersonnelPermission() ? 'personnel' : 'hide'}>
                  <Menu.Item key="user">
                    <Link
                      to={{pathname: "/personnel/user/list", query: {page: initPage}}}>
                      员工管理
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="salary">
                    <Link
                      to={{pathname: "/personnel/salary/list", query: {page: initPage}}}>
                      薪资管理
                    </Link>
                  </Menu.Item>
                </SubMenu>

                <SubMenu key='marketing' title={<span><Icon type="tag-o"/> 营销</span>}
                         className={api.hasPersonnelPermission() ? 'personnel' : 'hide'}>
                  <Menu.Item key="timecount">
                    <Link
                      to={{pathname: "/marketing/timecount", query: {page: initPage}}}>
                      计次优惠
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="discount">
                    <Link
                      to={{pathname: "/marketing/discount", query: {page: initPage}}}>
                      折扣优惠
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="minus">
                    <Link
                        to={{pathname: "/marketing/minus", query: {page: initPage}}}>
                      立减优惠
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="membership_card">
                    <Link
                        to={{pathname: "/marketing/membercardtype/list", query: {page: initPage}}}>
                      会员卡管理
                    </Link>
                  </Menu.Item>

                  <Menu.Item key="member_card_sale">
                    <Link
                      to={{pathname: "/marketing/membercard/sale"}}>
                      会员开卡
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="member_card_sale_log">
                    <Link
                      to={{pathname: "/marketing/membercard/salelog", query: {page: initPage}}}>
                      会员购买记录
                    </Link>
                  </Menu.Item>

                </SubMenu>
              </Menu>
            </div>

            <div className={showSetting}>
              <Menu
                theme="dark"
                mode="horizontal"
                style={{lineHeight: '63px', fontSize: '14px'}}>
                <Menu.Item>
                  <div className="user-setting">
                    <Dropdown overlay={this.renderSettings()} trigger={['click']}>
                      <a className="ant-dropdown-link" href="javascript:;">
                        <Icon type="setting"/>{name}
                      </a>
                    </Dropdown>
                  </div>
                </Menu.Item>
              </Menu>
            </div>
          </div>
        </div>

        <div className="ant-layout-wrapper">
          {/*
           <div className="ant-layout-breadcrumb">
           <Breadcrumb>
           {breadcrumbs.map(bc => bc ?
           <Breadcrumb.Item key={bc}>{bc}</Breadcrumb.Item> : '')}
           </Breadcrumb>
           </div>
           */}
          <div className="ant-layout-container">
            <div style={{height: '100%'}}>
              <div style={{clear: 'both'}}>
                {children}
              </div>
            </div>
          </div>
        </div>
        <div className="ant-layout-footer">
          {brand_name} 版权所有 © 2016
        </div>
      </div>
    );
  }
}
