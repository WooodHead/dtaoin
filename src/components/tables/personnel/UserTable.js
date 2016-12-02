import React from 'react'
import {Link} from 'react-router'
import {Table, Row, Col, Button, message} from 'antd'
import api from '../../../middleware/api'
import SearchBox from '../../search/SearchBox'
import TableWithPagination from '../../base/TableWithPagination'
import NewUserModal from '../../modals/personnel/NewUserModal'
import EditUserModal from '../../modals/personnel/EditUserModal'
import CalculateWageModal from '../../modals/personnel/CalculateWageModal'
import FireUserModal from '../../modals/personnel/FireUserModal'

export default class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
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

  getListData(props) {
    api.ajax({url: props.source}, function (data) {
      this.setState({users: data.res.user_list});
    }.bind(this));
  }

  render() {
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render(value, record) {
        return (
          <Link to={{pathname:'/personnel/user/detail',query:{user_id:record._id}}}>
            {value}
          </Link>
        );
      }
    }, {
      title: '编号',
      dataIndex: '_id',
      key: '_id'
    }, {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone'
    }, {
      title: '区域',
      dataIndex: 'company_region',
      key: 'company_region'
    }, {
      title: '门店',
      dataIndex: 'company_name',
      key: 'company_name'
    }, {
      title: '部门',
      dataIndex: 'department_name',
      key: 'department_name'
    }, {
      title: '职位',
      dataIndex: 'role_name',
      key: 'role_name'
    }, {
      title: '入职时间',
      dataIndex: 'hire_date',
      key: 'hire_date'
    }, {
      title: '固定工资',
      dataIndex: 'base_salary',
      key: 'base_salary'
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      className: 'center',
      render: function (value, record) {
        return (
          <span>
            <EditUserModal user={record}/>

            <CalculateWageModal
              type="month"
              user={record}
              disabled={record.status === '1'}
            />

            <FireUserModal
              user={record}
              disabled={record.status === '-1'}
            />
          </span>
        );
      }
    }];

    /*
     {
     title: '职位等级',
     dataIndex: 'level',
     key: 'level'
     }, {
     title: '薪资组',
     dataIndex: 'salary_group_name',
     key: 'salary_group_name'
     },
     */

    return (
      <div>
        <Row>
          <Col span="12">
            <SearchBox
              change={this.handleSearchChange}
              placeholder="请输入姓名搜索"
              style={{width: 250}}
            />
          </Col>
          <Col span="12">
            <NewUserModal />
          </Col>
        </Row>

        <TableWithPagination
          columns={columns}
          dataSource={this.state.users}
          pathname={this.props.pathname}
          page={this.props.page}
        />
      </div>
    );
  }
}
