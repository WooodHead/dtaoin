import React from 'react'
import {Link} from 'react-router'
import {Table, Row, Col, Button, message} from 'antd'
import api from '../../../middleware/api'
import SearchBox from '../../search/SearchBox'
import TableWithPagination from '../../base/TableWithPagination'
import CalculateWageModal from '../../../components/modals/personnel/CalculateWageModal'
import AdjustmentRateModal from '../../../components/modals/personnel/AdjustmentRateModal'
import FreezeSalaryModal from '../../../components/modals/personnel/FreezeSalaryModal'

export default class SalaryTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      salaryList: [],
      salaryIds: []
    };
    [
      'handleSearchChange',
      'handleRowSelectionChange'
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getListData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getListData(nextProps);
  }

  handleSearchChange(key) {
    this.props.updateCondition({key: key});
  }

  handleRowSelectionChange(selectedRowKeys) {
    this.setState({salaryIds: selectedRowKeys});
  }

  getListData(props) {
    api.ajax({url: props.source}, function (data) {
      this.setState({salaryList: data.res.list});
    }.bind(this));
  }

  render() {
    const columns = [{
      title: '姓名',
      dataIndex: 'user_info',
      key: 'name',
      render(value, record) {
        return (
          <Link to={{pathname:'/personnel/user/detail',query:{user_id: value._id}}}>
            {value.name}
          </Link>
        );
      }
    }, {
      title: '编号',
      dataIndex: 'user_info',
      key: 'user_id',
      render(value){
        return <span>{value._id}</span>
      }
    }, {
      title: '区域',
      dataIndex: 'user_info',
      key: 'company_region',
      render(value){
        return <span>{value.company_region}</span>
      }
    }, {
      title: '门店',
      dataIndex: 'user_info',
      key: 'company_name',
      render(value){
        return <span>{value.company_name}</span>
      }
    }, {
      title: '部门',
      dataIndex: 'user_info',
      key: 'department_name',
      render(value, record){
        return <span>{value.department_name}</span>;
      }
    }, {
      title: '薪资组',
      dataIndex: 'user_info',
      key: 'salary_group_name',
      render(value, record){
        return <span>{value.salary_group_name}</span>;
      }
    }, {
      title: '职位',
      dataIndex: 'user_info',
      key: 'role_name',
      render(value, record){
        return <span>{value.role_name}</span>;
      }
    }, {
      title: '发放月份',
      dataIndex: 'month',
      key: 'month'
    }, {
      title: '本月实到/本月应到',
      dataIndex: 'actual_day',
      key: 'actual_day',
      render(value, record){
        return <span>{value}/{record.due_day}</span>
      }
    }, {
      title: '本月固定工资',
      dataIndex: 'base_salary_gain',
      key: 'base_salary_gain'
    }, {
      title: '本月绩效工资',
      dataIndex: 'performance_salary',
      key: 'performance_salary',
      render(value, record) {
        return <span>{(Number(value) * Number(record.performance_coefficient)).toFixed(2)}</span>
      }
    }, {
      title: '本月工资',
      dataIndex: 'fix_date',
      key: 'fix_date'
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
      }
    }];

    const rowSelection = {
      getCheckboxProps: record => ({
        disabled: record.status === '1'
      }),
      onChange: this.handleRowSelectionChange
    };

    return (
      <div>
        <Row>
          <Col span="12">
            <SearchBox
              change={this.handleSearchChange}
              style={{width: 250}}
              placeholder="请输入姓名搜索"
            />
          </Col>
          <Col span="12">
            <div className="pull-right">
              <AdjustmentRateModal />
              <FreezeSalaryModal
                salaryIds={this.state.salaryIds}
              />
            </div>
          </Col>
        </Row>

        <TableWithPagination
          rowSelection={rowSelection}
          columns={columns}
          dataSource={this.state.salaryList}
          pathname={this.props.pathname}
          page={this.props.page}
        />
      </div>
    );
  }
}
