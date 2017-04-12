import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React from 'react';
import {Link} from 'react-router';
import {Menu, Breadcrumb, Dropdown, Icon} from 'antd';

import classNames from 'classnames';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

import api from '../middleware/api';
import companySubmenuConfig from '../config/companySubMenu';
import adminSubmenuConfig from '../config/adminSubMenu';

import Help from '../components/widget/Help';

import {getUserPermissions, setUserPermissions} from '../reducers/auth/authActions';

require('../styles/common.less');
require('../styles/app.css');
require('../styles/layout.css');
require('../styles/menu.less');
require('babel-polyfill');

let logo = require('../images/nav_logo.png');

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
const BreadcrumbItem = Breadcrumb.Item;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'potential',
      permissionMap: new Map(),
      companySubMenu: [],
      adminSubMenu: [],
    };

    [
      'handleMenuClick',
      'logout',
      'handleClick',
    ].map(method => this[method] = this[method].bind(this));
  }

  /*componentWillMount() {
   this.setState({current: sessionStorage.getItem('menu')});
   }*/

  componentWillMount() {
    this.setState({current: sessionStorage.getItem('menu')});
    if (location.pathname.indexOf('/login') > -1) {
      return;
    }

    // 使用browserHistory时使用
    if (api.isLogin()) {
      this.getAllPermission();

      if (!location.pathname) {
        location.href = '/';
      }
    } else {
      location.href = '/login';
    }
  }

  logout() {
    api.ajax({
      url: api.system.logout(),
      type: 'POST',
      permission: 'no-login',
    }, data => {
      if (data.code === 0) {
        location.href = '/';
        sessionStorage.clear();
        localStorage.clear();
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

  getArrayPermisson(list) {
    let listArray = [];
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
    let {permissionMap} = this.state;

    api.isStoreGeneralManager() ?
      api.ajax({url: api.user.getCompanyPermissions()}, data => {
        let list = this.getArrayPermisson(data.res.list);
        this.props.actions.setUserPermissions(list);
        list.map(item => {
          permissionMap.set(item.path, item);
        });
        this.setState({permissionMap}, () => {
          this.getSubMenu();
        });
      })
      :
      api.ajax({url: api.user.getAllPermission()}, data => {
        let list = data.res.list;

        this.props.actions.setUserPermissions(list);
        list.map(item => {
          permissionMap.set(item.item_path, item);
        });
        this.setState({permissionMap}, () => {
          this.getSubMenu();
        });
      });
  }

  getSubMenu() {
    let {companySubMenu, adminSubMenu} = this.state;

    api.isHeadquarters() ?
      adminSubmenuConfig.map(menu => {
        if (menu.super) {
          api.isSuperAdministrator() ? adminSubMenu.push(menu) : '';
        } else {
          adminSubMenu.push(menu);
        }
      })
      :
      api.isSuperAdministrator() || api.isChainAdministrator() ?
        companySubMenu = companySubmenuConfig :
        companySubmenuConfig.map(menu => {
          if (this.checkSubmenuPermission(JSON.parse(JSON.stringify(menu)))) {
            //对象深拷贝 JSON.parse(JSON.stringify(menu))
            companySubMenu.push(JSON.parse(JSON.stringify(menu)));
            companySubMenu[companySubMenu.length - 1].subMenu = [];
            menu.subMenu.map(subMenu => {
              if (this.checkPermission(subMenu.path)) {
                companySubMenu[companySubMenu.length - 1].subMenu.push(subMenu);
              }
              if (subMenu.path == 'divider') {
                companySubMenu[companySubMenu.length - 1].subMenu.push(subMenu);
              }
            });
          }
        });
    this.setState({companySubMenu, adminSubMenu});
  }

  checkPermission(path) {
    let {permissionMap} = this.state;

    return permissionMap.has(path.slice(1, path.length));
  }

  checkSubmenuPermission(menu) {
    for (let list of menu.subMenu) {
      if (this.checkPermission(list.path)) {
        return true;
      }
    }
    return false;
  }

  renderSettings() {
    return (
      <Menu onClick={this.handleMenuClick}>
        {/*<MenuItem key="company">*/}
        {/*<Link to={{pathname: '/company'}}><Icon type="edit"/><span>门店管理</span></Link>*/}
        {/*</MenuItem>*/}
        <MenuItem key="logout"><Icon type="poweroff"/> 退出</MenuItem>
      </Menu>
    );
  }

  render() {
    let {uid, name, department, companyName, companyId} = api.getLoginUser();

    const {routes, children} = this.props;
    const {current, companySubMenu, adminSubMenu} = this.state;

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
                <img src={logo} style={{width: 130, height: 30}} alt="水稻汽车"/>
              </Link>
            </div>

            <div className={showMenu}>
              <div className={api.isHeadquarters() ? '' : 'hide'}>
                <Menu
                  theme="dark"
                  mode="horizontal"
                  onClick={this.handleClick}
                  selectedKeys={[current]}
                  style={{lineHeight: '64px', marginLeft: '37px', fontSize: '14px'}}
                >
                  <MenuItem key="overview">
                    <Link to={{pathname: '/overview/index'}}>
                      <span style={{display: 'inline-block', marginRight: '6px'}}>
                        <i className="icon icon-home"/>
                      </span>
                      <span>总览</span>
                    </Link>
                  </MenuItem>
                  {
                    adminSubMenu.length > 0 && (
                      adminSubMenu.map(sub => {
                        return (
                          <SubMenu
                            key={sub.key} title={
                            <span>
                              <span style={{display: 'inline-block', marginRight: '6px'}}>
                                <i className={`icon icon-${sub.icon}`}/>
                              </span>
                              {sub.name}
                            </span>
                          }
                          >
                            {
                              sub.subMenu.map(menuList => {
                                return (
                                  <MenuItem key={menuList.path} style={{height: '28px', lineHeight: '28px'}}>
                                    <Link
                                      to={{pathname: menuList.path}}
                                      target={menuList.target || ''}
                                      style={{paddingTop: '2px'}}
                                    >
                                      <span>{menuList.name}</span>
                                    </Link>
                                  </MenuItem>
                                );
                              })
                            }
                          </SubMenu>
                        );
                      })
                    )
                  }
                </Menu>
              </div>

              <div className={api.isHeadquarters() ? 'hide' : ''}>
                <Menu
                  theme="dark"
                  mode="horizontal"
                  onClick={this.handleClick}
                  selectedKeys={[current]}
                  style={{lineHeight: '64px', marginLeft: '37px', fontSize: '14px'}}
                >
                  <MenuItem key="home">
                    <Link to={{pathname: '/'}}>
                      <span style={{display: 'inline-block', marginRight: '6px'}}>
                        <i className="icon icon-home"/>
                      </span>
                      <span>首页</span>
                    </Link>
                  </MenuItem>
                  {
                    companySubMenu.length > 0 && (
                      companySubMenu.map(sub => {
                        return (
                          <SubMenu
                            key={sub.key}
                            title={
                              <span>
                                <span style={{display: 'inline-block', marginRight: '6px'}}>
                                  <i className={`icon icon-${sub.icon}`}/>
                                </span>
                                {sub.name}
                              </span>
                            }
                          >
                            {
                              sub.subMenu.map((menuList, index) => {
                                if (menuList.path == 'divider') {
                                  return (
                                    <Menu.Divider key={index}/>
                                  );
                                }
                                return (
                                  <MenuItem key={menuList.path} style={{height: '28px', lineHeight: '28px'}}>
                                    <Link
                                      to={{pathname: menuList.path}}
                                      target={menuList.target || ''}
                                    >
                                      <span>{menuList.name}</span>
                                    </Link>
                                  </MenuItem>
                                );
                              })
                            }
                          </SubMenu>
                        );
                      })
                    )
                  }
                </Menu>
              </div>
            </div>

            <div className={showSetting}>
              <div className={settingContainer}>
                <div className="company-name">{Number(companyId) == 1 ? null : companyName }</div>

                <span className="user-name">
                  <Dropdown overlay={this.renderSettings(department)} trigger={['click']}>
                    <a className="ant-dropdown-link" href="javascript:;">
                      <Icon type="user" className="ml5"/> {name}
                    </a>
                  </Dropdown>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/*<div className="layout-subheader hide">
         <div className="layout-wrapper">
         <Menu mode="horizontal" defaultSelectedKeys={['1']}>
         <MenuItem key="1">二级导航1</MenuItem>
         <MenuItem key="2">二级导航2</MenuItem>
         <MenuItem key="3">二级导航3</MenuItem>
         </Menu>
         </div>
         </div>*/}

        <Help />

        <div className="layout-content-wrapper">
          <Breadcrumb>
            {routes.map((route, index) => {
              if (index === 0) {
                return null;
              } else {
                return <BreadcrumbItem key={index}>{route.breadcrumbName}</BreadcrumbItem>;
              }

            })}
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

function mapStateToProps(state) {
  let {userPermissions} = state.auth;
  return {userPermissions};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({getUserPermissions, setUserPermissions}, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
