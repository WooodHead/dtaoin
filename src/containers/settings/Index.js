import React from 'react';
import { Row, Col, Table, Popconfirm, Spin } from 'antd';

import api from '../../middleware/api';
import text from '../../config/text';

import BaseList from '../../components/base/BaseList';
import Edit from './Edit';
import New from './Edit';

export default class Index extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      authData: [],
    };

    [
      'handleInsertAuthData',
      'handleExpandChange',
      'handleEditSuccess',
      'handleDelete',
      'handleCreateSuccess',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getAuthorityList(0);
  }

  handleExpandChange(bool, value) {
    if (bool) {
      const id = value._id;
      this.getAuthorityList(id);
    }
  }

  getAuthorityList(id) {
    this.setState({ isFetching: true });
    api.ajax({
      url: api.authority.list(id),
    }, data => {
      this.setState({ isFetching: false });
      this.handleInsertAuthData(data.res.list);
    }, () => {
      this.setState({ isFetching: false });
    });
  }

  handleDelete(e, value) {
    api.ajax({
      url: api.authority.delete(),
      type: 'POST',
      data: {
        auth_item_id: value._id,
      },
    }, () => {
      this.handleDeleteSuccess(value);
    });
  }

  // todo 下面children 代表要插入的输入，parent为寻找插入数据的父级节点
  // todo 递归里面setState会比较多，目前没找到更好的办法，介于目前层数较少，可以先使用
  handleDeleteSuccess(children, parent) {
    const { authData } = this.state;
    const searchAuthData = parent || authData;

    for (const item  in searchAuthData) {
      if (searchAuthData.hasOwnProperty(item)) {
        if (String(searchAuthData[item]._id) == String(children._id)) {
          searchAuthData.splice(item, 1);
          this.setState({ authData: searchAuthData });
          return true;
        } else {
          if (searchAuthData[item].children && searchAuthData[item].children.length > 0) {
            // 如果没找到信息且有children，递归
            this.handleDeleteSuccess(children, searchAuthData[item].children);
          }
        }
      }
    }
    this.setState({ authData: searchAuthData });
  }

  handleEditSuccess(children, parent) {
    const { authData } = this.state;
    const searchAuthData = parent || authData;

    for (const item in searchAuthData) {
      if (searchAuthData.hasOwnProperty(item)) {
        if (String(searchAuthData[item]._id) == String(children._id)) {
          children.key = children._id;
          children.children = [];
          searchAuthData[item] = children;
          this.setState({ authData: searchAuthData });
          return true;
        } else {
          if (searchAuthData[item].children && searchAuthData[item].children.length > 0) {
            // 如果没找到信息且有children，递归
            this.handleEditSuccess(children, searchAuthData[item].children);
          }
        }
      }
    }
    this.setState({ authData: searchAuthData });
  }

  handleCreateSuccess(children, parent) {
    const { authData } = this.state;
    const searchAuthData = parent || authData;

    for (const item  in searchAuthData) {
      if (searchAuthData.hasOwnProperty(item)) {
        if (String(searchAuthData[item]._id) == String(children.parent_id)) {
          if (!searchAuthData[item].children) {
            searchAuthData[item].children = [];
          }
          children.key = children._id;
          children.children = [];
          searchAuthData[item].children.push(children);
          this.setState({ authData: searchAuthData });
          return true;
        } else {
          if (searchAuthData[item].children && searchAuthData[item].children.length > 0) {
            // 如果没找到信息且有children，递归
            this.handleCreateSuccess(children, searchAuthData[item].children);
          }
        }
      }
    }
    this.setState({ authData: searchAuthData });
  }

  handleInsertAuthData(children, parent) {
    if (children.length == 0) {
      return false;
    }

    const { authData } = this.state;
    const searchAuthData = parent || authData;

    if (searchAuthData.length == 0) {
      for (const key in children) {
        if (children.hasOwnProperty(key)) {
          children[key].key = children[key]._id;
          // 为了让antd中能显示出框
          children[key].children = [];
          searchAuthData.push(children[key]);
        }
      }
      this.setState({ authData: searchAuthData });
      return true;
    }

    for (const item in searchAuthData) {
      if (searchAuthData.hasOwnProperty(item)) {
        if (String(searchAuthData[item]._id) == (children[0] && children[0].parent_id || null)) {
          searchAuthData[item].children = [];
          for (const key in children) {
            if (children.hasOwnProperty(key)) {
              children[key].key = children[key]._id;
              children[key].children = [];
              searchAuthData[item].children.push(children[key]);
            }
          }
          this.setState({ authData: searchAuthData });
          return true;
        } else {
          if (searchAuthData[item].children && searchAuthData[item].children.length > 0) {
            // 如果没找到信息且有children，递归
            this.handleInsertAuthData(children, searchAuthData[item].children);
          }
        }
      }
    }
    this.setState({ authData: searchAuthData });
  }

  render() {
    const data = this.state.authData;
    const { isFetching } = this.state;

    const self = this;
    const columns = [{
      title: '功能名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: value => text.routeType[value],
    }, {
      title: '操作',
      key: 'action',
      className: 'center',
      render: value => (
          <div>
            <Edit value={value} isNew={false} onSuccess={self.handleEditSuccess}/>

            <span className="ant-divider"/>

            <Popconfirm
              title="确定取消吗?"
              onConfirm={e => self.handleDelete(e, value)}
              okText="确定"
              cancelText="取消"
            >
              <a href="javascript:;">删除</a>
            </Popconfirm>

            <span className="ant-divider"/>

            <New value={{ parent_id: value._id }} isNew={true} onSuccess={self.handleCreateSuccess}/>
          </div>
        ),
    }];


    return (
      <div>
        <Row className="head-action-bar">
          <Col span={24}>
            <div className="pull-right">
              <Edit value={{ parent_id: 0 }} isNew={true} type="button" onSuccess={this.handleSuccess}/>
            </div>
          </Col>
        </Row>

        <Spin tip="加载中..." spinning={isFetching}>
          <Table
            columns={columns}
            dataSource={data}
            onExpand={this.handleExpandChange}
            indentSize={30}
            pagination={false}
          />
        </Spin>
      </div>
    );
  }
}
