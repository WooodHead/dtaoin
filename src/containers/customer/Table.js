import React from 'react';
import {Link} from 'react-router';
import {Button, Row, Col} from 'antd';
import api from '../../middleware/api';
import text from '../../config/text';
import SearchSelectBox from '../../components/base/SearchSelectBox';
import TableWithPagination from '../../components/base/TableWithPagination';
import CreateRemind from '../../components/modals/aftersales/CreateRemind';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKey: '',
      list: [],
      isFetching: false,
    };

    [
      'searchDisplayPattern',
      'handleSearch',
      'handleSelectCustomer',
      'handlePageChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getMaintainCustomers(this.props);
  }

  componentWillReceiveProps(nextProps) {
    let searchKey = this.state.searchKey;
    if (searchKey) {
      this.searchMaintainCustomers(searchKey, nextProps.page);
    } else {
      this.getMaintainCustomers(nextProps);
    }
  }

  //搜索显示模式
  searchDisplayPattern(customer) {
    return `${customer.customer_name} ${customer.customer_phone} ${customer.plate_num}`;
  }

  handleSearch(key, successHandle, failHandle) {
    if (key != this.state.searchKey) {
      this.setState({searchKey: key});
    }

    if (key === '') {
      this.getMaintainCustomers(this.props);
      successHandle([]);
    } else {
      this.searchMaintainCustomers(key, 1, successHandle, failHandle);
    }
  }

  handlePageChange(page) {
    this.props.updateState({page});
  }

  handleSelectCustomer(customer) {
    this.setState({list: [customer]});
  }

  searchMaintainCustomers(key, page, successHandle, failHandle) {
    let url = api.searchMaintainCustomerList({key, page});
    api.ajax({url}, (data) => {
      successHandle && successHandle(data.res.list);
      let {list, total} = data.res;
      this.setState({list, total: parseInt(total)});
    }, (error) => {
      failHandle && failHandle(error);
      this.setState({list: [], total: 0});
    });
  }

  getMaintainCustomers(props) {
    this.setState({isFetching: true});
    api.ajax({url: props.source}, function (data) {
      let {list, total} = data.res;
      this.setState({list, total: parseInt(total), isFetching: false});
    }.bind(this));
  }

  render() {
    let {list, total, isFetching} = this.state;
    const columns = [
      {
        title: '车牌号',
        dataIndex: 'plate_num',
        key: 'plate_num',
        width: '8%',
      }, {
        title: '姓名',
        dataIndex: 'customer_name',
        key: 'customer_name',
        width: '7%',
        render(item, record){
          return <Link
            to={{pathname: '/customer/detail/', query: {customer_id: record.customer_id}}}>{item}</Link>;
        },
      }, {
        title: '性别',
        dataIndex: 'customer_gender',
        key: 'customer_gender',
        width: '5%',
        render(value){
          return text.gender[value];
        },
      }, {
        title: '手机号',
        dataIndex: 'customer_phone',
        key: 'customer_phone',
        width: '10%',
      }, {
        title: '车型',
        key: 'auto_type_name',
        dataIndex: 'auto_type_name',
        width: '20%',
        render: value => value ? value : '',
      }, {
        title: '里程数(km)',
        key: 'mileage',
        dataIndex: 'mileage',
        className: 'column-money',
        width: '7%',
      }, {
        title: '最近维修项目',
        key: 'last_intention_item_names',
        dataIndex: 'last_intention_item_names',
        width: '18%',
        render: value => value ? value : '',
      }, {
        title: '创建时间',
        key: 'ctime',
        dataIndex: 'ctime',
        width: '10%',
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'intention_info',
        className: 'center',
        width: '15%',
        render (value, record) {
          return (
            <span>
              <CreateRemind customer_id={record.customer_id}/>
              <Link
                to={{
                  pathname: '/aftersales/project/create/',
                  query: {customer_id: record.customer_id, auto_id: record._id},
                }}
                target="_blank"
              >
                  <Button type="primary" className="margin-left-10">添加工单</Button>
                </Link>
            </span>
          );
        },
      },
    ];

    return (
      <div>
        <Row className="mb10">
          <Col span={8}>
            <SearchSelectBox
              style={{width: 250}}
              placeholder={'请输入车牌号、姓名或电话搜索'}
              displayPattern={this.searchDisplayPattern}
              onSearch={this.handleSearch}
              autoSearchLength={3}
              onSelectItem={this.handleSelectCustomer}
            />
          </Col>
        </Row>

        <TableWithPagination
          isLoading={isFetching}
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
