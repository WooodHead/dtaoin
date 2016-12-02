import React from "react";
import api from "../../middleware/api";
import {Row, Col} from "antd";
import BaseList from "../../components/base/BaseList";
import NewExpenseModal from "../../components/modals/finance/NewExpenseModal";
import ExpenseTable from "../../components/tables/finance/ExpenseTable";

export default class MaintExpenseList extends BaseList {
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
        <h3 className="page-title">财务-支出管理</h3>

        <Row className="mb15">
          <Col span="12" offset="12">
            <span className="pull-right">
              <NewExpenseModal />
            </span>
          </Col>
        </Row>

        <ExpenseTable
          source={api.getExpenseList(this.state)}
          page={this.state.page}
          pathname="/finance/expense/list"
        />
      </div>
    )
  }
}
