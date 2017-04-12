import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Row, Col} from 'antd';

import api from '../../../middleware/api';

import {getActivities} from '../../../reducers/activity/activityActions';

import BaseList from '../../../components/base/BaseList';

import New from './New';
import Table from './Table';

class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
    };
  }

  componentDidMount() {
    // redux 示例
    // this.props.actions.getActivities({page: this.props.page});
  }

  render() {
    return (
      <div>
        <Row className="head-action-bar">
          <Col span={24}>
            <div className="pull-right">
              <New onSuccess={this.handleSuccess}/>
            </div>
          </Col>
        </Row>

        <Table
          source={api.activity.list(this.state)}
          page={this.state.page}
          reload={this.state.reload}
          updateState={this.updateState}
          onSuccess={this.handleSuccess}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  let {isFetching, page, list, total} = state.activity;
  return {isFetching, page, list, total};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({getActivities}, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
