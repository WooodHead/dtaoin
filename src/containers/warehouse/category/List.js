import React from 'react';
import { Row, Col, message } from 'antd';

import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';
import Table from './Table';

require('../category.less');

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      superPartList: [],
      currentId: '',
      page: 1,
      pid: 1,
    };

    [
      'handleSuperPartClick',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getSuperPartTypeList();
  }

  handleSuperPartClick(e, item) {
    this.setState({ currentId: item._id, pid: item._id });
  }

  getSuperPartTypeList() {
    api.ajax({
      url: api.warehouse.category.superPartTypeList(),
    }, data => {
      this.setState({
        superPartList: data.res.list,
        currentId: data.res.list[0]._id,
        pid: data.res.list[0]._id,
      });
    }, error => {
      message.error(`获取列表数据失败[${error}]`);
    });
  }

  render() {
    const { superPartList, currentId, page, pid } = this.state;

    return (
      <Row>
        <Col className="top-category" span={6}>
          <p>配件分类</p>
          <ul>
            {
              superPartList.map(item => {
                const isActive = Number(item._id) === Number(currentId);
                return (
                  <li
                    className={isActive ? 'active' : ''}
                    key={item._id}
                    onClick={() => this.handleSuperPartClick(this, item)}
                  >
                    {item.name}
                  </li>
                );
              })
            }
          </ul>
        </Col>
        <Col className="second-category" span={18}>
          <p />
          <div>
            <Table
              source={api.warehouse.category.partTypeList(pid, page)}
              page={page}
              updateState={this.updateState}
            />
          </div>
        </Col>
      </Row>
    );
  }
}
