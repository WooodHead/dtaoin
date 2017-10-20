import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';

import { getActivities, setPage } from '../../../reducers/activity/activityActions';

import BaseList from '../../../components/base/BaseList_';

import New from './New';
import Table from './Table';

class List extends BaseList {
  componentDidMount() {
    this.props.actions.getActivities(this.props);
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps');

    console.log(nextProps);
    !!this.isParamsChange(['page'], nextProps) && this.props.actions.getActivities(nextProps);
  }

  handleSuccess() {
    this.props.actions.getActivities(this.props);
  }

  render() {
    const { isFetching, page, list, total } = this.props;
    return (
      <div>
        <Row className="head-action-bar">
          <Col span={24}>
            <div className="pull-right">
              <New onSuccess={this.handleSuccess} />
            </div>
          </Col>
        </Row>

        <Table
          updatePage={this.updatePage}
          onSuccess={this.handleSuccess}
          isFetching={isFetching}
          page={page}
          list={list}
          total={total}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isFetching, page, list, total } = state.activity;
  return { isFetching, page, list, total };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ getActivities, setPage }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
