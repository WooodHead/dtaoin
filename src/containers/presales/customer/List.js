import React from "react";
import {Button} from "antd";
import api from "../../../middleware/api";
import BaseList from "../../../components/base/BaseList";
import Filters from "./Filters";
import CustomerTable from "../../../components/tables/presales/CustomerTable";

export default class CustomerList extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      source: '0',
      create_day: '0',
      customer_type: '0',
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
        <h3 className="page-title">售前-成交客户管理</h3>
        <Filters
          filterAction={this.handleConditionChange}
          budgetMin={this.state.budget_min}
        />
        <CustomerTable
          source={api.autoSellCustomerList(this.state)}
          page={this.state.page}
          pathname="/presales/customer/list"
        />
      </div>
    )
  }
}
