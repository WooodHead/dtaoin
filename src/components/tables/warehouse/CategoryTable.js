import React from 'react'
import {Button, Row, Col, Table} from 'antd'
import api from '../../../middleware/api'
import TableWithPagination from '../../base/TableWithPagination'
import SearchBox from '../../search/SearchBox'
import NewCategory from '../../modals/warehouse/category/NewCategory'
import EditCategory from '../../modals/warehouse/category/EditCategory'

export default class CategoryTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    this.getList(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getList(nextProps);
  }

  handleSearchChange(name) {
    this.props.updateCondition({name: name});
  }

  getList(props) {
    api.ajax({url: props.source}, function (data) {
      this.setState({list: data.res.list});
    }.bind(this))
  }

  render() {
    const columns = [
      {
        title: '配件分类',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '配件档次',
        dataIndex: 'levels',
        key: 'level',
        render (value, record) {
          let ele = [];
          if (value.length > 0) {
            let levels = JSON.parse(value);
            levels.map(function (item) {
              ele.push(<div className="in-table-line" key={item.name}>{item.name}</div>)
            });
          }
          return ele;
        }
      }, {
        title: '报价(元)',
        dataIndex: 'levels',
        key: 'price',
        render (value, record) {
          let ele = [];
          if (value.length > 0) {
            let levels = JSON.parse(value);
            levels.map(function (item) {
              ele.push(<div className="in-table-line column-money" key={item.price}>{Number(item.price).toFixed(2)}</div>)
            });
          }
          return ele;
        }
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'operation',
        render(item, record){
          if (record.levels.length > 0) {
              record.levels = JSON.parse(record.levels);
          }
          return (
            <EditCategory category={record} disabled={App.session.company_id != record.company_id}/>
          )
        }
      }
    ];

    return (
      <div>
        <Row>
          <Col span="12">
            <SearchBox
              change={this.handleSearchChange}
              placeholder="请输入配件分类"
              style={{width: 250}}
            />
          </Col>
          <Col span="12">
            <span className="pull-right">
              <NewCategory />
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
