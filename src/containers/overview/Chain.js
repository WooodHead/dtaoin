import React from 'react';
import {Row, Col, Form, Input} from 'antd';

import api from '../../middleware/api';

import BaseList from '../../components/base/BaseList';

import Table from './TableChain';
import CreateChain from './CreateChain';

const Search = Input.Search;

class Chain extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      key: '',
    };

    [
      'handleSearchCompanyChange',
      'handleSuccess',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSuccess() {
    this.setState({
      reload: true,
    });
  }

  handleSearchCompanyChange(e) {
    this.setState({key: e.target.value});
  }

  render() {
    let {key, page} = this.state;
    return (
      <Form>
        <Row className="mb20">
          <Col span={20}>
            <span className="label">搜索</span>
            <Search
              onChange={this.handleSearchCompanyChange}
              size="large"
              style={{width: 220}}
              placeholder="请输入连锁名称"
            />
          </Col>
          <Col span={4}>
            <span className={api.isSuperAdministrator() ? 'pull-right' : 'hide'}>
              <CreateChain onSuccess={this.handleSuccess}/>
            </span>
          </Col>
        </Row>
        <Table
          page={page}
          source={api.overview.getChainList(key, page)}
          updateState={this.updateState}
          onSuccess={this.handleSuccess}
          reload={this.state.reload}
        />
      </Form>
    );
  }
}

Chain = Form.create()(Chain);
export default Chain;
