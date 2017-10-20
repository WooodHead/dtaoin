import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import React from 'react';
import { Row, Col } from 'antd';

import {
  getQaList,
  setPage,
  editArticle,
  createArticle,
  qaOffLine,
} from '../../../reducers/new-car/qa/qaActions';

import BaseList from '../../../components/base/BaseList_';

import New from './New';
import Table from './Table';

class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      listName: 'getQaList',
      paramsChange: ['page'],
    };

    [
      'handleArticleCreate',
      'handleArticleEdit',
      'handleOffLine',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleArticleEdit(data, callback) {
    this.props.actions.editArticle(data, callback);
  }

  handleArticleCreate(data) {
    this.props.actions.createArticle(data);
  }

  handleOffLine(id) {
    this.props.actions.qaOffLine(id);
  }

  render() {
    const { isFetching, page, list, total } = this.props;
    return (
      <div>
        <Row className="head-action-bar">
          <Col span={24}>
            <div className="pull-right">
              <New
                onSuccess={this.handleSuccess}
                createArticle={this.handleArticleCreate}
              />
            </div>
          </Col>
        </Row>

        <span className="new-car-qa">
          <Table
            updatePage={this.updatePage}
            onSuccess={this.handleSuccess}
            isFetching={isFetching}
            page={page}
            list={list}
            total={total}

            submit={this.handleArticleEdit}
            offLine={this.handleOffLine}
          />
        </span>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isFetching, page, list, total } = state.newCarQa;
  return { isFetching, page, list, total };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      getQaList,
      setPage,
      editArticle,
      createArticle,
      qaOffLine,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
