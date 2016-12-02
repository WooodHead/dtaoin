import React from 'react'
import {Link} from 'react-router'
import {Button, Row, Col, Table} from 'antd'
import api from '../../../middleware/api'
import text from '../../../middleware/text'
import SearchBox from '../../search/CustomerSearchBox'
import TableWithPagination from '../../base/TableWithPagination'
import NewMaintainProjectModal from '../../modals/aftersales/NewProjectModal'

export default class CustomerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    this.getMaintainCustomers(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getMaintainCustomers(nextProps);
  }

  handleSearchChange(data) {
    if (data.key) {
      this.setState({list: data.list});
    } else {
      this.getMaintainCustomers(this.props);
    }
  }

  getMaintainCustomers(props) {
    api.ajax({url: props.source}, function (data) {
      this.setState({list: data.res.list});
    }.bind(this))
  }

  render() {
    const columns = [
      {
        title: '姓名',
        dataIndex: 'customer_name',
        key: 'customer_name',
        render(item, record){
          return <Link to={{ pathname: "/aftersales/customer/detail/", query: { customer_id:record._id} }}>{item}</Link>
        }
      }, {
        title: '性别',
        dataIndex: 'customer_gender',
        key: 'customer_gender',
        render(value, record){
          return text.gender[value];
        }
      }, {
        title: '电话',
        dataIndex: 'customer_phone',
        key: 'customer_phone'
      }, {
        title: '车型',
        key: 'auto_type_name',
        dataIndex: 'auto_type_name',
        className: 'no-padding',
        render(value, record){
          return <div className="in-table-line">{value ? value : ''}</div>;
        }
      }, {
        title: '里程数(km)',
        key: 'intention_id',
        dataIndex: 'intention_id',
        className: 'column-money',
        render(value, record){
          return <div className="in-table-line">{value ? value : ''}</div>;
        }
      }, {
        title: '最后一次维修项目',
        key: 'ctime',
        dataIndex: 'ctime',
        className: 'no-padding',
        render(value, record){
          return <div className="in-table-line">{value ? value : ''}</div>;
        }
      }, {
        title: '更新时间',
        key: 'mtime',
        dataIndex: 'mtime',
        className: 'no-padding',
        render(value, record){
          return <div className="in-table-line">{value ? value : record.mtime}</div>;
        }
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'intention_info',
        className: 'center',
        render (value, record) {
          return (
            <Link
              to={{ pathname: "/aftersales/project/create/", query: { customer_id: record._id, user_auto_id: record.intention_info ? record.intention_info.user_auto_id : 0}}} target="_blank">
              <Button type="primary" >添加工单</Button>
            </Link>
            )
        }
      }
    ];

    return (
      <div>
        <Row className="mb10">
          <Col span="8">
            <SearchBox
              api={api.searchMaintainCustomerList()}
              change={this.handleSearchChange}
              style={{width: 250}}
            />
          </Col>
        </Row>

        <TableWithPagination
          columns={columns}
          dataSource={this.state.list}
          page={this.props.page}
          pathname={this.props.pathname}
        />
      </div>
    )
  }
}
