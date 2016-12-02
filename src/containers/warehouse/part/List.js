import React from 'react'
import api from '../../../middleware/api'
import BaseList from '../../../components/base/BaseList'
import PartTable from '../../../components/tables/warehouse/PartTable'

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: props.location.query.page || 1
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
        <h3 className="page-title">仓库-配件管理</h3>
        <PartTable
          source={api.warehouse.getParts(this.state)}
          page={this.state.page}
          pathname="/warehouse/part/list"
          updateState={this.updateState}
        />
      </div>
    )
  }
}
