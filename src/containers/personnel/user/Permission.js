import React from 'react';
import { message, Row, Col, Button, Checkbox, Switch, Popconfirm } from 'antd';

import api from '../../../middleware/api';

export default class Permission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: [],
      permissionMap: new Map(),  // 根级权限
      canLogin: props.user ? props.user.status === '1' : false,
      canAppLogin: props.user ? props.user.can_app_login === '1' : false,
      userId: props.userId || '',
      user: props.user || {},
      appLoginLimit: 0,
      webLoginLimit: 0,
    };

    [
      'handleSubmit',
      'handleLoginSwitchChange',
      'handleRadioChange',
      'handleCheckboxChange',
      'handleAppLoginSwitchChange',
      'getCompanyLoginLimit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getCompanyPermissions();
    this.getUserDetail(this.state.userId);
    this.getCompanyLoginLimit();
  }

  componentWillReceiveProps(nextProps) {
    if (!!nextProps.userId) {
      this.setState({ userId: nextProps.userId });
      this.getUserDetail(nextProps.userId);
    }
    // 为的是让模态窗口关闭的时候重新获取数据
    this.getCompanyPermissions();
    this.getUserDetail(this.state.userId);
    this.getCompanyLoginLimit();
  }

  handleSubmit(e) {
    e.preventDefault();

    const { permissionMap, canLogin, canAppLogin } = this.state;
    let checkedIds = [];
    if (canLogin) {
      checkedIds = this.assembleCheckedIds(permissionMap);

      if ((!checkedIds || checkedIds.length <= 0)) {
        message.warning('请分配权限');
        return false;
      }
    }

    api.ajax({
      url: api.user.editPermission(),
      type: 'post',
      data: {
        user_id: this.props.userId,
        can_login: canLogin ? '1' : '0',
        can_app_login: canAppLogin ? '1' : '0',
        auth_item_ids: checkedIds.toString(),
      },
    }, () => {
      message.success('设置成功');
      this.props.onSuccess();
      this.getCompanyLoginLimit();
      this.props.form.resetFields();
    }, error => {
      message.error(`设置失败[${error}]`);
    });
  }

  handleLoginSwitchChange(checked) {
    const { webLoginLimit, user } = this.state;

    if (!!checked) {
      this.setState({ webLoginLimit: webLoginLimit - 1 });
    } else {
      this.setState({ webLoginLimit: webLoginLimit + 1 });
    }

    if (!!checked && (!user.role || String(user.role) === '0')) {
      message.error('请先完善职位信息');
      setTimeout(() => {
        this.setState({ canLogin: !checked, webLoginLimit });
      }, 500);
    }

    this.setState({ canLogin: checked });
  }

  handleAppLoginSwitchChange(checked) {
    const { appLoginLimit } = this.state;
    if (!!checked) {
      this.setState({ appLoginLimit: appLoginLimit - 1 });
    } else {
      this.setState({ appLoginLimit: appLoginLimit + 1 });
    }
    this.setState({ canAppLogin: checked });
  }

  handleRadioChange(e) {
    const roleId = e.target.value;
    this.setState({ selectedRoleId: roleId });
    this.getRolePermissions(roleId);
  }

  handleCheckboxChange(item, e) {
    const checked = e.target.checked;
    const { permissionMap } = this.state;

    const parentItem = permissionMap.get(item.parent_id);
    const items = parentItem.items;
    item.checked = checked;
    items.set(item._id, item);
    parentItem.items = items;
    permissionMap.set(item.parent_id, parentItem);

    this.setState({ permissionMap });
  }

  assembleCheckedIds(permissionMap) {
    const ids = [];
    permissionMap.forEach(rule => {
      const items = rule.items;
      if (items && items.size > 0) {
        items.forEach(item => item.checked && ids.push(item._id));
      }
    });

    return ids;
  }

  assemblePermissionMap(list) {
    const { permissionMap } = this.state;

    // TODO 优化数据操作
    permissionMap.forEach(permission => {
      const itemsMap = permission.items;
      if (itemsMap && itemsMap.size > 0) {
        // 1. set all to false
        itemsMap.forEach(subItem => {
          subItem.checked = false;
          itemsMap.set(subItem._id, subItem);
        });

        // 2. set checked to true
        list.map(item => {
          const checkedItem = itemsMap.get(item.item_id);
          if (checkedItem) {
            checkedItem.checked = true;
            itemsMap.set(checkedItem._id, checkedItem);
          }
        });
      }

      permission.items = itemsMap;
      permissionMap.set(permission._id, permission);
    });

    this.setState({ permissionMap });
  }

  // 获取当前用户的全部权限
  getCompanyPermissions() {
    api.ajax({ url: api.user.getCompanyPermissions() }, data => {
      const { list } = data.res;
      const { permissionMap } = this.state;

      if (list.length === 0) {
        message.warning('公司权限列表为空');
        return;
      }

      list.forEach(item => {
        const subMap = new Map();
        item.children.map(subItem => {
          subItem.checked = false;
          subMap.set(subItem._id, subItem);
        });

        item.items = subMap;
        permissionMap.set(item._id, item);
      });

      this.setState({ permissionMap });

      this.getUserPermissions(this.props.userId);
    });
  }

  getUserPermissions(userId) {
    api.ajax({ url: api.user.getUserPermissions(userId) }, data => {
      const { list } = data.res;
      if (list.length > 0) {
        this.assemblePermissionMap(list);
      } else {
        this.getRolePermissions(this.props.roleId);
      }
    });
  }

  getRolePermissions(roleId) {
    api.ajax({ url: api.user.getRolePermissions(roleId) }, data => {
      const { list } = data.res;
      // if (list.length > 0) {
      this.assemblePermissionMap(list);
      // }
    });
  }

  getUserDetail(userId) {
    api.ajax({ url: api.user.getDetail(userId) }, data => {
      const user = data.res.user_info;
      const canLogin = String(user.status) === '1';
      const canAppLogin = String(user.can_app_login) === '1';
      this.setState({ user: data.res.user_info, canLogin, canAppLogin });
    });
  }

  getCompanyLoginLimit() {
    api.ajax({ url: api.user.getCompanyLoginLimit() }, data => {
      const { limit } = data.res;
      this.setState({
        appLoginLimit: limit.app_login_limit,
        webLoginLimit: limit.web_login_limit,
      });
    });
  }

  renderPermission(permissionMap) {
    const htmls = [];

    if (permissionMap.size === 0) {
      return null;
    }

    permissionMap.forEach(rule => {
      htmls.push(
        <div className="mb15" key={rule._id}>
          <h3 className="mt10 mb10">{rule.name}</h3>
          <div>
            {rule.items && rule.items.size > 0 && Array.from(rule.items.values()).map(item => (
                <Checkbox
                  checked={item.checked}
                  onChange={this.handleCheckboxChange.bind(this, item)}
                  key={item._id}
                >
                  {item.name}
                </Checkbox>
              ))}
          </div>
        </div>,
      );
    });

    return htmls;
  }

  render() {
    const { permissionMap, canLogin, canAppLogin, appLoginLimit, webLoginLimit, user } = this.state;
    const { roleId } = this.props;
    const popConfirmTitle = `当前员工职位为${user.role_name}，重置后将恢复${user.role_name}默认权限！`;

    return (
      <div>
        <Row>
          <Col span={5}>
            <div className="ml20 mb10">
              <label className="label">工作端权限</label>
              <Switch
                defaultChecked={canAppLogin}
                checkedChildren={'是'}
                unCheckedChildren={'否'}
                onChange={this.handleAppLoginSwitchChange}
                disabled={!(Number(appLoginLimit) > 0) && !canAppLogin}
              />
            </div>
          </Col>
          <Col span={6}>
            <p className="font-size-14" style={{ lineHeight: '24px' }}>
              门店可开通账号数：{appLoginLimit}
            </p>
          </Col>
        </Row>

        <Row>
          <Col span={5}>
            <div className="ml34 mb10">
              <label className="label">系统权限</label>
              <Switch
                checked={canLogin}
                checkedChildren={'是'}
                unCheckedChildren={'否'}
                onChange={this.handleLoginSwitchChange}
                disabled={!(Number(webLoginLimit) > 0) && !canLogin}
              />
            </div>
          </Col>

          <Col span={6}>
            <p className="font-size-14" style={{ lineHeight: '24px' }}>
              门店可开通账号数：{webLoginLimit}
            </p>
          </Col>

          <Col span={10} className={canLogin ? '' : 'hide'}>
            <div>
              <label className="label">权限重置</label>
              <Popconfirm
                title={popConfirmTitle}
                okText="确定"
                cancelText="取消"
                onConfirm={() => this.getRolePermissions(roleId)}
                overlayStyle={{ width: '250px' }}
              >
                <Button size="small" type="primary">重置权限</Button>
              </Popconfirm>
            </div>
          </Col>
        </Row>
        {canLogin && (
          <Row style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Col span={24}>
              {this.renderPermission(permissionMap)}
            </Col>
          </Row>
        )}

        <div className="form-action-container">
          <Button type="primary" onClick={this.handleSubmit} size="large">保存</Button>
        </div>
      </div>
    );
  }
}
