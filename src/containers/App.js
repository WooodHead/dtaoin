import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import { Dropdown, Icon, Layout, Menu } from 'antd';

import classNames from 'classnames';
import moment from 'moment';
import 'moment/locale/zh-cn';
import PrivateRoute from './PrivateRoute';

import api from '../middleware/api';
import companySubmenuConfig from '../config/companySubMenu';
import adminSubmenuConfig from '../config/adminSubMenu';
import routes from '../routes';
import Breadcrumb from './Breadcrumb';

import Help from '../components/widget/Help';

import { getUserPermissions, setUserPermissions } from '../reducers/auth/authActions';

moment.locale('zh-cn');

require('babel-polyfill');

require('../styles/common.less');
require('../styles/app.css');
require('../styles/layout.css');
require('../styles/menu.less');
require('../styles/table-fiex.css');

require('../styles/order.less');

require('../styles/reset.css');

const logo = require('../images/nav/daotian_logo.png');
const logoText = require('../images/nav/daotian_text.png');
const navArrowDown = require('../images/nav/top_arrow_down.png');

const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
const MenuItemGroup = Menu.ItemGroup;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'home',
      permissionMap: new Map(),
      companySubMenu: [],
      adminSubMenu: [],
      collapsed: localStorage.getItem('collapsed') === 'true' || false,
      openKeys: ['aftersales'],
    };

    [
      'logout',
      'onMenuClick',
    ].map(method => this[method] = this[method].bind(this));
  }

  toggle = () => {
    this.setState({ collapsed: !this.state.collapsed });
    if (this.state.collapsed) {
      localStorage.setItem('collapsed', false);
    } else {
      localStorage.setItem('collapsed', true);
    }
  };

  /**
   * todo 解决打开新页面后，菜单项的选中问题
   * 还使用之前path作为key,可以方便设置key
   * */
  componentWillMount() {
    const path = location.pathname;

    this.setState({ current: path });
    sessionStorage.setItem('menu', path);

    if (api.isLogin()) {
      this.getAllPermission();
      const parentMenuKey = this.getMenuItemParentKey(path);
      this.setState({ openKeys: parentMenuKey ? [parentMenuKey] : [] });
    }
  }

  logout() {
    api.ajax({
      url: api.system.logout(),
      type: 'POST',
      permission: 'no-login',
    }, data => {
      if (data.code === 0) {
        location.href = '/login';
        sessionStorage.clear();
        localStorage.clear();
      }
    });
  }

  onMenuClick(e) {
    const event = e;
    this.setState({ current: event.key });
    sessionStorage.setItem('menu', event.key);
  }

  onOpenChange = openKeys => {
    const state = this.state;
    const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
    const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    this.setState({ openKeys: nextOpenKeys });
  };

  getAncestorKeys = key => {
    const map = {
      '/aftersales/project/new': ['aftersales'],
      '/aftersales/part-sale/new': ['aftersales'],
      '/aftersales/consumptive-material/index': ['aftersales'],
      '/aftersales/project/index': ['aftersales'],
      '/aftersales/part-sale/index': ['aftersales'],
      '/aftersales/customer/index': ['aftersales'],
      '/aftersales/customer/score': ['aftersales'],
      '/warehouse/purchase/new': ['warehouse'],
      '/warehouse/purchase-reject/new': ['warehouse'],
      '/warehouse/stocktaking/new': ['warehouse'],
      '/warehouse/purchase/index': ['warehouse'],
      '/warehouse/purchase-reject/index': ['warehouse'],
      '/warehouse/stocktaking/index': ['warehouse'],
      '/warehouse/part/index': ['warehouse'],
      '/aftersales/inventory-warn/index': ['warehouse'],
      '/warehouse/supplier/index': ['warehouse'],
      '/warehouse/logs/index': ['warehouse'],
      '/warehouse/markup-rate/index': ['warehouse'],
      '/warehouse/part/store': ['warehouse'],
      '/finance/expense/list': ['finance'],
      '/finance/presales-income/list': ['finance'],
      '/finance/monthly_report': ['finance'],
      '/finance/fixed-assets/index': ['finance'],
      '/marketing/times/list': ['marketing'],
      '/marketing/discount/list': ['marketing'],
      '/marketing/membercard/sale': ['marketing'],
      '/marketing/membercard/list': ['marketing'],
      '/marketing/membercard/salelog': ['marketing'],
      '/marketing/bargain/index': ['marketing'],
      '/marketing/bargain/prize': ['marketing'],
      '/marketing/sms-manage': ['marketing'],
      '/marketing/statistics/coupon': ['marketing'],
    };
    return map[key] || [];
  };

  /**
   * 获取当前item的最顶级item key
   * 使用try catch包裹是为了找到parentKey后跳出forEach循环
   **/
  getMenuItemParentKey(currentPath) {
    const companySubMenu = require('../config/companySubMenu').default;
    let parentKey;

    if (companySubMenu && companySubMenu.length > 0) {
      try {
        companySubMenu.forEach(menuItem => {
          if (menuItem.subMenu.length > 0) {
            menuItem.subMenu.forEach(subMenuItem => {
              if (subMenuItem.path === currentPath) {
                parentKey = menuItem.key;
                throw new Error('找到menuItem的Key啦');
              } else if (subMenuItem.path === 'group' && subMenuItem.items.length > 0) {
                subMenuItem.items.forEach(groupMenuItem => {
                  if (groupMenuItem.path === currentPath) {
                    parentKey = menuItem.key;
                    throw new Error('Whoops!');
                  }
                });
              }
            });
          }
        });
      } catch (e) {
      }
    }
    return parentKey;
  }

  getArrayPermission(list) {
    const listArray = [];
    list.map(item => {
      if (!!item.children) {
        item.children.map(value => {
          listArray.push(value);
        });
        delete item.children;
      }
      listArray.push(item);
    });
    return listArray;
  }

  getAllPermission() {
    const { permissionMap } = this.state;

    api.isStoreGeneralManager()
      ? api.ajax({ url: api.user.getCompanyPermissions() }, data => {
        const list = this.getArrayPermission(data.res.list);
        this.props.actions.setUserPermissions(list);
        list.map(item => {
          permissionMap.set(item.path, item);
        });
        this.setState({ permissionMap }, () => {
          this.getSubMenu();
        });
      })
      : api.ajax({ url: api.user.getAllPermission() }, data => {
        const list = data.res.list;

        this.props.actions.setUserPermissions(list);
        list.map(item => {
          permissionMap.set(item.item_path, item);
        });
        this.setState({ permissionMap }, () => {
          this.getSubMenu();
        });
      });
  }

  getSubMenu() {
    let { companySubMenu, adminSubMenu } = this.state;

    api.isHeadquarters()
      ? adminSubmenuConfig.map(menu => {
        if (api.isRegionAdministrator()) {
          // 区域管理员只能看见新车 暂时这样写，节后重构权限部分
          if (menu.key === 'new-car') {
            const menuTemp = {
              key: 'new-car',
              icon: 'car',
              name: '新车',
              subMenu: [
                {
                  name: '产品管理',
                  path: '/new-car/product/index',
                }, {
                  name: '方案管理',
                  path: '/new-car/programme/list',
                }, {
                  name: '订单管理',
                  path: '/new-car/order/index',
                }, {
                  name: '收益记录',
                  path: '/new-car/earnings-record/list',
                },
              ],
            };
            adminSubMenu.push(menuTemp);
          }
        } else {
          // if条件 只有超级管理员可见  连锁不可见
          if (menu.super) {
            api.isSuperAdministrator() ? adminSubMenu.push(menu) : '';
          } else {
            adminSubMenu.push(menu);
          }
        }
      })
      : api.isSuperAdministrator() || api.isChainAdministrator()
      ? companySubMenu = companySubmenuConfig
      : companySubmenuConfig.map(menu => {
        if (this.checkSubmenuPermission(JSON.parse(JSON.stringify(menu)))) {
          // 对象深拷贝 JSON.parse(JSON.stringify(menu))
          companySubMenu.push(JSON.parse(JSON.stringify(menu)));
          companySubMenu[companySubMenu.length - 1].subMenu = [];
          menu.subMenu.map(subMenu => {
            if (subMenu.path === 'group') {
              if (this.checkGroupPermission(JSON.parse(JSON.stringify(subMenu)))) {
                companySubMenu[companySubMenu.length -
                1].subMenu.push(JSON.parse(JSON.stringify(subMenu)));
                companySubMenu[companySubMenu.length -
                1].subMenu[companySubMenu[companySubMenu.length - 1].subMenu.length - 1].items = [];

                subMenu.items.map(group => {
                  if (this.checkPermission(group.path)) {
                    companySubMenu[companySubMenu.length -
                    1].subMenu[companySubMenu[companySubMenu.length - 1].subMenu.length -
                    1].items.push(group);
                  }
                });
              }
            } else {
              if (this.checkPermission(subMenu.path)) {
                companySubMenu[companySubMenu.length - 1].subMenu.push(subMenu);
              }
            }
          });
        }
      });
    this.setState({ companySubMenu, adminSubMenu });
  }

  checkPermission(path) {
    const { permissionMap } = this.state;

    return permissionMap.has(path.slice(1, path.length));
  }

  checkSubmenuPermission(menu) {
    for (const list of menu.subMenu) {
      if (list.path === 'group') {
        for (const groupList of list.items) {
          if (this.checkPermission(groupList.path)) {
            return true;
          }
        }
      } else {
        if (this.checkPermission(list.path)) {
          return true;
        }
      }
    }
    return false;
  }

  checkGroupPermission(group) {
    for (const list of group.items) {
      if (this.checkPermission(list.path)) {
        return true;
      }
    }
    return false;
  }

  render() {
    const { uid, name, department, companyName, companyId } = api.getLoginUser();

    const { current, companySubMenu, adminSubMenu, collapsed } = this.state;

    const showMenu = classNames({
      'layout-menu': true,
      hide: !uid,
    });

    const showSetting = classNames({
      'layout-setting': !!uid,
      hide: !uid,
    });

    const settingContainer = classNames({
      'setting-container': true,
      'no-company': department >= 0,
    });

    const logoContainer = classNames({
      logo: true,
      'logo-collapsed': collapsed,
    });

    const settingMenu = (
      <Menu style={{ width: 100 }}>
        <Menu.Item key="setting" style={{ textAlign: 'center', height: 32 }}>
          <Link className="center" to={{ pathname: '/company-setting' }} style={{ color: 'black' }}>
            <span>门店设置</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="logout" style={{ textAlign: 'center', height: 32 }}>
          <div onClick={this.logout}>退出</div>
        </Menu.Item>
      </Menu>
    );

    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={160}
        >
          <div className={logoContainer}>
            <img src={logo} style={{ width: 17, height: 17 }} alt="水稻汽车" />
            {!collapsed && (
              <img src={logoText} style={{ width: 56, height: 14, marginLeft: 5 }} alt="水稻汽车" />
            )}
          </div>

          <div className={showMenu}>

            {/** ***总公司导航*****/}
            <div className={api.isHeadquarters() ? '' : 'hide'}>
              <Menu
                theme="dark"
                mode="inline"
                onClick={this.onMenuClick}
                defaultSelectedKeys={[current]}
                inlineCollapsed={collapsed}
              >
                <MenuItem key="/home" className={api.isRegionAdministrator() ? 'hide' : ''}>
                  <Link to={{ pathname: '/home' }}>
                    {!collapsed && <Icon type="home" />}总览
                  </Link>
                </MenuItem>

                {adminSubMenu.length > 0 && (
                  adminSubMenu.map(sub => (
                      <SubMenu
                        key={sub.key}
                        title={
                          <span>
                          {!collapsed && <Icon type={sub.icon} />}
                            <span>{sub.name}</span>
                          </span>
                        }
                      >
                        {sub.subMenu.map(menuList => (
                            <MenuItem
                              key={menuList.path}
                              style={{ height: '28px', lineHeight: '28px' }}
                            >
                              <Link
                                to={{ pathname: menuList.path }}
                                target={menuList.target || ''}
                              >
                                <span>{menuList.name}</span>
                              </Link>
                            </MenuItem>
                          ))}
                      </SubMenu>
                    ))
                )}
              </Menu>
            </div>

            {/** ***门店导航******/}
            {/* todo 二级菜单，添加以下属性后，收起菜单后悬浮菜单隔一个显示，先取消菜单一次只打开一个菜单项的功能
                selectedKeys={[current]}
                defaultOpenKeys={['home']}
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}
                */}
            <div className={api.isHeadquarters() ? 'hide' : ''}>
              <Menu
                theme="dark"
                mode="inline"
                onClick={this.onMenuClick}
                defaultSelectedKeys={[current]}
                inlineCollapsed={collapsed}
              >
                <MenuItem key="/home">
                  <Link to={{ pathname: '/home' }}>
                    {!collapsed && <Icon type="home" />}
                    <span>首页</span>
                  </Link>
                </MenuItem>

                {companySubMenu.length > 0 && (
                  companySubMenu.map(sub => (
                      <SubMenu
                        key={sub.key}
                        title={
                          <span>
                            {!collapsed && <Icon type={sub.icon} />}
                            <span>{sub.name}</span>
                          </span>
                        }
                      >
                        {
                          sub.subMenu.map(menuList => {
                            if (menuList.path === 'group') {
                              return (
                                <MenuItemGroup key={menuList.name} title={menuList.name}>
                                  {
                                    menuList.items.map(groupItem => (
                                      <Menu.Item
                                        key={groupItem.path}
                                        style={{ height: '28px', lineHeight: '28px' }}
                                      >
                                        <Link
                                          to={{ pathname: groupItem.path }}
                                          target={groupItem.target || ''}
                                        >
                                          <span>{groupItem.name}</span>
                                        </Link>
                                      </Menu.Item>
                                    ))
                                  }
                                </MenuItemGroup>
                              );
                            }

                            return (
                              <MenuItem
                                key={menuList.path}
                                style={{ height: '28px', lineHeight: '28px' }}
                              >
                                <Link
                                  to={{ pathname: menuList.path }}
                                  target={menuList.target || ''}
                                >
                                  <span>{menuList.name}</span>
                                </Link>
                              </MenuItem>
                            );
                          })
                        }
                      </SubMenu>
                    ))
                )}
              </Menu>
            </div>
          </div>
        </Sider>

        <Layout>
          <Header style={{
            background: '#fff',
            padding: 0,
            borderBottom: '1px solid #e1e1e1',
            height: 50,
          }}>
            <Icon
              className="menu-trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />

            <Switch>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={() => <Breadcrumb breadcrumbName={route.breadcrumbName} />}
                />
              ))}
            </Switch>

            <div className={showSetting}>
              <div className={settingContainer}>
                <div className="company-name">
                  {
                    Number(companyId) === 1
                      ? null
                      : (
                        <div className="company-name-content">
                          {/* <span className="company-type">{cooperationTypeShort}</span>*/}
                          {companyName}
                        </div>
                      )
                  }
                </div>

                <div className="user-setting">
                  <Dropdown overlay={settingMenu} trigger={['click']} placement="bottomRight">
                    <p className="ant-dropdown-link" style={{ cursor: 'pointer' }}>
                      <Icon type="user" style={{ marginLeft: 20, marginRight: 5 }} />
                      {name}
                      <img
                        src={navArrowDown}
                        alt="设置"
                        style={{ width: 8, height: 4, marginLeft: 5, marginBottom: 2 }}
                      />
                    </p>
                  </Dropdown>
                </div>
              </div>
            </div>
          </Header>

          <Content
            style={{
              margin: 20,
              padding: '20px',
              background: '#fff',
              minHeight: document.body.clientHeight - 156,
              border: '1px solid #e1e1e1',
            }}>
            <Switch>
              {routes.map((route, index) => (
                <PrivateRoute
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={route.render}
                />
              ))}
            </Switch>
          </Content>

          <Footer style={{ textAlign: 'center' }}>水稻汽车 版权所有 © 2017</Footer>
        </Layout>
        <Help />

        {/* <DevTools />*/}
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  const { userPermissions } = state.auth;
  return { userPermissions };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ getUserPermissions, setUserPermissions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
