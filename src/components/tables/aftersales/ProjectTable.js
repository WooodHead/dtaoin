import React from 'react'
import {Link} from 'react-router'
import {Button, Row, Col, Table} from 'antd'
import api from '../../../middleware/api'
import ProjectSearchBox from '../../search/ProjectSearchBox'
import TableWithPagination from '../../base/TableWithPagination'
import NewMaintainPotentialModal from '../../modals/aftersales/NewPotentialModal'
import EditProjectModal from '../../modals/aftersales/EditProjectModal'
import PayProjectModal from '../../modals/aftersales/PayProjectModal'

export default class ProjectTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changeAction: false,
      list: []
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    this.getMaintainProjects(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getMaintainProjects(nextProps);
  }

  handleSearchChange(data) {
    if (data.key) {
      this.setState({list: data.list});
    } else {
      this.getMaintainProjects(this.props);
    }
  }

  getMaintainProjects(props) {
    api.ajax({url: props.source}, function (data) {
      this.setState({list: data.res.intention_list});
    }.bind(this))
  }

  render() {
    const columns = [
      {
        title: '车牌号',
        dataIndex: 'auto_plate_num',
        width: 85,
        key: 'auto_plate_num'
      }, {
        title: '车型',
        dataIndex: 'auto_type_name',
        width: 280,
        key: 'auto_type_name'
      }, {
        title: '姓名',
        dataIndex: 'customer_name',
        key: 'customer_name',
        width: 95,
        render(item, record){
          return (
            <Link
              to={{ pathname: "/aftersales/customer/detail/", query: { customer_id:record.customer_id} }}>
              {item} {record.customer_gender == 0 ? '女士' : (record.customer_gender == 1 ? '男士' : '')}
            </Link>
          );
        }
      }, {
        title: '电话',
        dataIndex: 'customer_phone',
        width: 105,
        key: 'customer_phone'
      }, {
        title: '维修项目',
        dataIndex: 'item_names',
        key: 'item_names'
      }, {
        title: '工人',
        dataIndex: 'fitter_user_names',
        width: 150,
        key: 'fitter_user_names'
      }, {
        title: '金额',
        className: 'column-money',
        dataIndex: 'total_fee',
        width: 75,
        key: 'total_fee'
      }, {
        title: '里程数(km)',
        className: 'column-money',
        dataIndex: 'mileage',
        width: 90,
        key: 'mileage'
      }, {
        title: '创建时间',
        dataIndex: 'ctime',
        width: 93,
        key: 'ctime'
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'operation',
        className: 'center action-two',
        render (item, record) {
          let isDisabled = false;
          if (Number(record.status) === 3) {
            isDisabled = true;
          }
          let info = {
            customer_id: record.customer_id,
            project_id: record._id,
            isDisabled: isDisabled
          };

          return (
            <span>
              <Link
                to={{ pathname: "/aftersales/project/create/", query: { customer_id:record.customer_id, user_auto_id:record.user_auto_id, maintain_intention_id:record._id}}} target="_blank">
                  <Button type="primary" size="small" disabled={isDisabled} >编辑</Button>
              </Link>
              <PayProjectModal {...info}/>
              <Link
                to={{ pathname: "/aftersales/project/detail/", query: { customer_id:record.customer_id, auto_id:record.user_auto_id, project_id:record._id} }}>
                <Button type="primary" size="small" >详情</Button>
              </Link>
              <a href={record.wx_consume_url} target="_blank" className={record.wx_consume_url?'':'hide'}>
                <Button type="primary" size="small" disabled={isDisabled}>会员卡核销</Button>
              </a>
            </span>
          );
        }
      }
    ];

    return (
      <div>
        <Row className="mb10">
          <Col span="12">
            <ProjectSearchBox
              api={api.searchMaintainProjectList()}
              change={this.handleSearchChange}
              style={{width: 250}}
              className="no-print"/>
          </Col>
          <Col span="12">
            <span className="pull-right">
            <Link
              to={{ pathname: "/aftersales/project/create/"}} target="_blank">
                <Button type="primary" size="default" >新增工单</Button>
            </Link>
            </span>
          </Col>
        </Row>

        <TableWithPagination
          columns={columns}
          dataSource={this.state.list}
          pathname={this.props.pathname}
          page={this.props.page}
        />
      </div>
    )
  }
}
