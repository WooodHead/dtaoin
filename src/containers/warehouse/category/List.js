import React from "react";
import api from "../../../middleware/api";
import BaseList from "../../../components/base/BaseList";
import CategoryTable from "../../../components/tables/warehouse/CategoryTable";

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: props.location.query.page || 1,
      name: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({page: nextProps.location.query.page});
  }

  render() {
    return (
      <div>
        <h3 className="page-title">仓库-配件分类管理</h3>
        <CategoryTable
          updateCondition={this.updateState}
          source={api.warehouse.getCategories(this.state)}
          page={this.state.page}
          pathname="/warehouse/category/list"
        />
      </div>
    )
  }
}
