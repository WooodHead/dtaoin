import React from 'react'
import {Link} from 'react-router'
import {Button, Row, Col, Table} from 'antd'
import api from '../../../middleware/api'
import text from '../../../middleware/text'
import CustomerSearchBox from '../../search/CustomerSearchBox'
import TableWithPagination from '../../base/TableWithPagination'
import NewMaintainPotentialModal from '../../modals/aftersales/NewPotentialModal'
import NewMaintainProjectModal from '../../modals/aftersales/NewProjectModal'

export default class PotentialTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: []
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    this.getCustomerList(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getCustomerList(nextProps);
  }

  handleSearchChange(data) {
    if (data.key) {
      this.setState({customers: data.list});
    } else {
      this.getCustomerList(this.props);
    }
  }

  getCustomerList(props) {
    api.ajax({url: props.source}, function (data) {
      this.setState({customers: data.res.customer_list});
    }.bind(this))
  }

  render() {
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        render(item, record){
          return (
            <Link to={{ pathname: "/aftersales/customer/detail/", query: { customer_id:record._id} }}>
              {item}
            </Link>
          )
        }
      }, {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        render(value, record){
          return text.gender[value];
        }
      }, {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone'
      }, {
        title: '车型',
        key: 'auto_type_name',
        dataIndex: 'intention_info',
        className: 'no-padding',
        render(value, record){
          return <div className="in-table-line">{value ? value.auto_type_name : ''}</div>;
        }
      }, {
        title: '更新时间',
        key: 'mtime',
        dataIndex: 'intention_info',
        className: 'no-padding',
        render(value, record){
          return <div className="in-table-line">{value ? value.mtime : ''}</div>;
        }
      }, {
        title: '操作',
        dataIndex: 'intention_info',
        key: 'operation',
        className: 'center',
        render (value, record) {
          return <NewMaintainProjectModal customer_id={record._id}/>
        }
      }
    ];

    return (
      <div>
        <Row className="mb10">
          <Col span="12">
            <CustomerSearchBox
              api={api.searchMaintainPotentialCustomerList()}
              change={this.handleSearchChange}
              style={{width: 250}}
            />
          </Col>
          <Col span="12">
            <span className="pull-right">
              <NewMaintainPotentialModal/>
            </span>
          </Col>
        </Row>

        <TableWithPagination
          columns={columns}
          dataSource={this.state.customers}
          page={this.props.page}
          pathname="/aftersales/potential/list"
        />
      </div>
    )
  }
}
