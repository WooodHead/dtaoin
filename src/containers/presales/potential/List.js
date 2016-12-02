import React from "react";
import api from "../../../middleware/api";
import BaseList from "../../../components/base/BaseList";
import Filters from "./Filters";
import PotentialTable from "../../../components/tables/presales/PotentialTable";

export default class PotentialCustomerList extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      source: '0',
      intention_level: '',
      intention_brand: '',
      budget_level: '-1',
      create_day: '0',
      is_mortgage: '-1',
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
        <h3 className="page-title">售前-意向客户</h3>

        <Filters
          filterAction={this.handleConditionChange}
          budgetLevel={this.state.budget_level}
        />
        <PotentialTable
          source={api.autoSellPotentialList(this.state)}
          page={this.state.page}
          pathname="/presales/potential/list"
        />
      </div>
    )
  }
}
