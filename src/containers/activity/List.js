import React from 'react'
import {Button} from 'antd'
import api from '../../middleware/api'
import BaseList from '../../components/base/BaseList'

import ActivityTable from '../../components/tables/activity/ActivityTable'

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: props.location.query.page || 1,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.query.page !== nextProps.location.query.page) {
      this.setState({
        page: nextProps.location.query.page
      });
    }
  }

  render() {
    return (
      <div>
        <h3 className="page-title">活动管理</h3>
        <ActivityTable
          source={api.activity.list(this.state)}
          page={this.state.page}
          pathname="/activity/list"
        />
      </div>
    )
  }
}
