import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import React from 'react';
import { Row, Col } from 'antd';

import {
  getBannerList,
  setPage,
  editBanner,
  createBanner,
  bannerOffLine,
} from '../../../reducers/new-car/banner/bannerActions';

import BaseList from '../../../components/base/BaseList_';

import New from './New';
import Table from './Table';

class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      listName: 'getBannerList',
      paramsChange: ['page'],
    };

    [
      'handleArticleCreate',
      'handleBannerEdit',
      'handleOffLine',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleBannerEdit(data, callback) {
    this.props.actions.editBanner(data, callback);
  }

  handleOffLine(id) {
    this.props.actions.bannerOffLine(id);
  }

  handleArticleCreate(data) {
    this.props.actions.createBanner(data);
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

        <span className="new-car-banner">
          <Table
            updatePage={this.updatePage}
            onSuccess={this.handleSuccess}
            isFetching={isFetching}
            page={page}
            list={list}
            total={total}

            bannerEdit={this.handleBannerEdit}
            offLine={this.handleOffLine}
          />
        </span>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isFetching, page, list, total } = state.newCarBanner;
  return { isFetching, page, list, total };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      getBannerList,
      setPage,
      editBanner,
      createBanner,
      bannerOffLine,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
