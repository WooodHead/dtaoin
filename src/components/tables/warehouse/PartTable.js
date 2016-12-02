import React from 'react'
import {Link} from 'react-router'
import {Button, Row, Col, Table} from 'antd'
import api from '../../../middleware/api'
import TableWithPagination from '../../base/TableWithPagination'
import SearchBox from '../../search/PartsNoSearchBox'
import NewPart from '../../modals/warehouse/part/NewPart'
import EditPart from '../../modals/warehouse/part/EditPart'
import PayWareModal from '../../modals/warehouse/part/PayWareModal'
import StockPartModal from '../../modals/warehouse/part/StockPartModal'

export default class PartTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changeAction: false,
      list: []
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentWillMount() {
    this.getList(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getList(nextProps);
  }

  handleSearchChange(data) {
    if (data.key) {
      this.setState({list: data.list});
    } else {
      this.getList(this.props);
    }
  }

  handleAdd() {
    this.getList(this.props);
  }

  getList(props) {
    api.ajax({url: props.source}, function (data) {
      this.setState({list: data.res.list});
    }.bind(this))
  }

  render() {
    const columns = [
      {
        title: '配件名',
        dataIndex: 'name',
        key: 'name',
        render(item, record){
          return (
            <Link
              to={{pathname: `/warehouse/part/detail/${record._id}`, query: {page: 1}}}>
              {item}
            </Link>
          );
        }
      }, {
        title: '配件号',
        dataIndex: 'part_no',
        key: 'part_no'
      }, {
        title: '产值类型',
        dataIndex: 'maintain_type_name',
        key: 'maintain_type_name'
      }, {
        title: '配件分类',
        dataIndex: 'part_type_name',
        key: 'part_type_name'
      }, {
        title: '适用车型',
        dataIndex: 'scope',
        key: 'scope'
      }, {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand'
      }, {
        title: '库存数量/已冻结',
        dataIndex: 'amount',
        className: 'column-money',
        key: 'amount',
        render(item, record){
          return <span>{item}/{record.freeze}</span>
        }
      }, {
        title: '当前进货价（元）',
        className: 'column-money',
        dataIndex: 'in_price',
        key: 'in_price'
      }, {
        title: '进货时间',
        dataIndex: 'ctime',
        key: 'ctime'
      }, {
        title: '操作',
        dataIndex: '',
        key: '',
        render(item, record, index){
          return (
            <div>
              <EditPart part={record} size='small'/>
              <StockPartModal part={record} size='small'/>
            </div>
          )
        }
      }
    ];

    return (
      <div>
        <Row className="mb10">
          <Col span="12">
            <SearchBox
              api={api.searchParts}
              change={this.handleSearchChange}
              style={{width: 250}}
            />
          </Col>
          <Col span="12">
            <span className="pull-right">
              <NewPart onSuccess={this.handleAdd.bind(this)} />
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
