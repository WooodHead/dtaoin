import React from "react";
import api from "../../../middleware/api";
import BaseList from "../../../components/base/BaseList";
import PotentialTable from "../../../components/tables/aftersales/PotentialTable";

export default class AftersalesWarehouseListPotentialCustomerList extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: props.location.query.page || 1
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      page: nextProps.location.query.page
    });
  }

  render() {
    return (
      <div>
        <h3 className="page-title">售后-潜在客户管理</h3>
        <PotentialTable
          source={api.maintPotencialCustomerList(this.state)}
          page={this.state.page}
        />
      </div>
    )
  }
}
