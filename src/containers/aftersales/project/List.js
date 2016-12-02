import React from "react";
import api from "../../../middleware/api";
import BaseList from "../../../components/base/BaseList";
import MaintProjectTable from "../../../components/tables/aftersales/ProjectTable";

export default class MaintProjectList extends BaseList {
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
        <h3 className="page-title">售后-工单管理</h3>
        <MaintProjectTable
          source={api.maintProjectList(this.state)}
          page={this.state.page}
          pathname="/aftersales/project/list"
        />
      </div>
    )
  }
}
