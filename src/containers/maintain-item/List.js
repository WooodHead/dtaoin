import React from 'react'
import {Button} from 'antd'
import api from '../../middleware/api'
import BaseList from '../../components/base/BaseList'

import MaintainItemTable from '../../components/tables/maintain-item/MaintainItemTable'

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: props.location.query.page || 1,
      name: '',
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
        <h3 className="page-title">项目管理</h3>
        <MaintainItemTable
          updateCondition={this.updateState}
          source={api.maintain.getItems(this.state)}
          page={this.state.page}
          pathname="/maintain/item"
        />
      </div>
    )
  }
}
