import React from "react";
import api from "../../../middleware/api";
import BaseList from "../../../components/base/BaseList";
import SupplierTable from "../../../components/tables/warehouse/SupplierTable";

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: props.location.query.page || 1,
      company: '',
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
        <h3 className="page-title">仓库-供应商管理</h3>
        <SupplierTable
          updateCondition={this.updateState}
          source={api.warehouse.getSuppliers(this.state)}
          page={this.state.page}
          pathname="/warehouse/supplier/list"
        />
      </div>
    )
  }
}
