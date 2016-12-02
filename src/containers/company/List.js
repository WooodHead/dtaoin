import React from 'react'
import {Button} from 'antd'
import api from '../../middleware/api'
import BaseList from '../../components/base/BaseList'
import CompanyTable from '../../components/tables/company/CompanyTable'

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: props.location.query.page || 1
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({page: nextProps.location.query.page});
  }

  render() {
    return (
      <div>
        <h3 className="page-title">门店管理</h3>
        <CompanyTable
          updateCondition={this.updateState}
          source={api.company.list()}
          page={this.state.page}
          pathname="/company/list"
        />
      </div>
    )
  }
}
