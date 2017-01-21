import React from 'react';
import {Link} from 'react-router';
import {Row, Col} from 'antd';
import api from '../../../middleware/api';
import SearchBox from '../../../components/search/SearchBox';
import TableWithPagination from '../../../components/base/TableWithPagination';
import CalculateWageModal from '../user/CalculateWage';
import AdjustmentRateModal from '../user/AdjustmentRate';
import FreezeSalaryModal from '../user/FreezeSalary';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      salaryIds: [],
      isFetching: false,
    };

    [
      'handleSearchChange',
      'handleRowSelectionChange',
      'handlePageChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getListData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getListData(nextProps);
  }

  handleSearchChange(name) {
    this.props.updateState({name, page: 1});
  }

  handlePageChange(page) {
    this.props.updateState({page});
  }

  handleRowSelectionChange(selectedRowKeys) {
    this.setState({salaryIds: selectedRowKeys, page: 1});
  }

  getListData(props) {
    this.setState({isFetching: true});
    api.ajax({url: props.source}, function (data) {
      let {list, total} = data.res;
      this.setState({list, total: parseInt(total), isFetching: false});
    }.bind(this));
  }

  render() {
    let {list, total, isFetching} = this.state;
    const columns = [{
      title: '姓名',
      dataIndex: 'user_info',
      key: 'name',
      render(value) {
        return (
          <Link to={{pathname:'/personnel/user/detail',query:{user_id: value._id}}}>
            {value.name}
          </Link>
        );
      },
    }, {
      title: '编号',
      dataIndex: 'user_info._id',
      key: 'user_id',
    }, {
      title: '区域',
      dataIndex: 'user_info.company_region',
      key: 'company_region',
    }, {
      title: '门店',
      dataIndex: 'user_info.company_name',
      key: 'company_name',
    }, {
      title: '部门',
      dataIndex: 'user_info.department_name',
      key: 'department_name',
    }, {
      title: '薪资组',
      dataIndex: 'user_info.salary_group_name',
      key: 'salary_group_name',
    }, {
      title: '职位',
      dataIndex: 'user_info.role_name',
      key: 'role_name',
    }, {
      title: '发放月份',
      dataIndex: 'month',
      key: 'month',
    }, {
      title: '本月实到/本月应到',
      dataIndex: 'actual_day',
      key: 'actual_day',
      render(value, record){
        return <span>{value}/{record.due_day}</span>;
      },
    }, {
      title: '本月固定工资',
      dataIndex: 'base_salary_gain',
      key: 'base_salary_gain',
    }, {
      title: '本月绩效工资',
      dataIndex: 'performance_salary',
      key: 'performance_salary',
      render(value, record) {
        return <span>{(Number(value) * Number(record.performance_coefficient)).toFixed(2)}</span>;
      },
    }, {
      title: '本月工资',
      dataIndex: 'fix_date',
      key: 'fix_date',
    }, {
      title: '操作',
      dataIndex: 'user_info',
      key: 'action',
      className: 'center',
      render: function (value, record) {
        return (
          <span>
            <FreezeSalaryModal
              salaryIds={record._id}
              size="small"
              disabled={record.status === '1'}
            />

            <CalculateWageModal
              type="performance"
              user={value}
              month={record.month}
              disabled={record.status === '1'}
            />
          </span>
        );
      },
    }];

    const rowSelection = {
      getCheckboxProps: record => ({
        disabled: record.status === '1',
      }),
      onChange: this.handleRowSelectionChange,
    };

    return (
      <div>
        <Row className="mb10">
          <Col span={12}>
            <SearchBox
              change={this.handleSearchChange}
              style={{width: 250}}
              placeholder="请输入姓名搜索"
            />
          </Col>
          <Col span={12}>
            <div className="pull-right">
              <AdjustmentRateModal />
              <FreezeSalaryModal salaryIds={this.state.salaryIds}/>
            </div>
          </Col>
        </Row>

        <TableWithPagination
          isLoading={isFetching}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={list}
          total={total}
          currentPage={this.props.currentPage}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }
}
