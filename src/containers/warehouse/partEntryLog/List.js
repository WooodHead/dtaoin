import React from 'react'
import api from '../../../middleware/api'
import BaseList from '../../../components/base/BaseList'
import PartEntryLogTable from '../../../components/tables/warehouse/PartEntryLogTable'

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
        <h3 className="page-title">仓库-进货管理</h3>
        <PartEntryLogTable
          source={api.warehouse.getGodownEntryLog(this.state)}
          page={this.state.page}
          pathname="/warehouse/part-entry-log/list"
          updateState={this.updateState}
        />
      </div>
    )
  }
}
