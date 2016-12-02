import React, {Component, PropTypes} from 'react'
import {Table, Row, Col, Button, message} from 'antd'
import api from '../../../middleware/api'
import TableWithPagination from '../../base/TableWithPagination'
import SearchBox from '../../search/SearchBox'
import NewItem from '../../modals/maintain-item/NewItem'
import EditItem from '../../modals/maintain-item/EditItem'

export default class MaintainItemTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maintainItems: [],
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentWillMount() {
    this.getListData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getListData(nextProps);
  }

  handleSearchChange(name) {
    this.props.updateCondition({name: name});
  }

  refreshData() {
    this.getListData(this.props);
  }

  getListData(props) {
    api.ajax({url: props.source}, function (data) {
      this.setState({maintainItems: data.res.item_list});
    }.bind(this));
  }

  render() {
    const columns = [{
      title: '排序',
      dataIndex: 'order',
      key: 'order',
    }, {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '类型',
      dataIndex: 'type_name',
      key: 'type_name',
    }, {
      title: '配件分类',
      dataIndex: 'part_type_list',
      key: 'part_types',
      className: 'no-padding',
      render (value, record) {
        let ele = [];
        if (value.length > 0) {
          value.map(function (item, index) {
            ele.push(item.name)
          });
        }
        return ele.join(',');
      }
    }, {
      title: '工时档次',
      dataIndex: 'levels',
      key: 'level',
      className: 'no-padding',
      render (value, record) {
        let ele = [];
        if (value.length > 0) {
          let levels = JSON.parse(value);
          levels.map(function (item, index) {
            ele.push(<div className="in-table-line" key={record._id + '-' + index}>{item.name}</div>)
          });
        }
        return ele;
      }
    }, {
      title: '工时单价(元)',
      dataIndex: 'levels',
      key: 'price',
      className: 'column-money',
      render (value, record) {
        let ele = [];
        if (value.length > 0) {
          let levels = JSON.parse(value);
          levels.map(function (item, index) {
            ele.push(<div className="in-table-line column-money" key={record._id + '-' + index}>{Number(item.price).toFixed(2)}</div>)
          });
        }
        return ele;
      }
    }, {
      title: '操作',
      dataIndex: '_id',
      key: 'action',
      className: 'center',
      render (value, record) {
        if (record.levels.length > 0) {
          record.levels = JSON.parse(record.levels);
        };
        return (
            <div>
              <EditItem item={record} disabled={App.session.company_id != record.company_id}/>
            </div>
          );
      }
    }];

    return (
      <div>
        <Row>
          <Col span="12">
            <SearchBox
              change={this.handleSearchChange}
              placeholder="请输入名称搜索"
              style={{width: 250}}
            />
          </Col>
          <Col span="12">
            <span className="pull-right">
              <NewItem onSuccess={this.refreshData.bind(this)}/>
            </span>
          </Col>
        </Row>

        <TableWithPagination
          columns={columns}
          dataSource={this.state.maintainItems}
          pathname={this.props.pathname}
          page={this.props.page}
        />
      </div>
    );
  }
}
