import React from "react";
import api from "../../../middleware/api";
import BaseList from "../../../components/base/BaseList";
import CustomerTable from "../../../components/tables/aftersales/CustomerTable";

export default class CustomerList extends BaseList {
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
        <h3 className="page-title">售后-客户管理</h3>
        <CustomerTable
          source={api.maintCustomerList(this.state)}
          page={this.state.page}
          pathname="/aftersales/customer/list"
        />
      </div>
    )
  }
}
