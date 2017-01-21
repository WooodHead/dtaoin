import React from 'react';
import {Link} from 'react-router';
import {Button, Row, Col} from 'antd';
import api from '../../../middleware/api';
import SearchSelectBox from '../../../components/base/SearchSelectBox';
import TableWithPagination from '../../../components/base/TableWithPagination';
import PayProjectModal from '../../../components/modals/aftersales/PayProjectModal';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      changeAction: false,
      currentCustomer: null,
      list: [],
    };

    [
      'searchDisplayPattern',
      'handleSearch',
      'handlePageChange',
      'handleSelectCustomer',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getMaintainProjects(this.props);
  }

  componentWillReceiveProps(nextProps) {
    let customer = this.state.currentCustomer;
    if (customer && customer.customer_phone) {
      this.searchMaintainProjects(customer.plate_num || customer.customer_phone, nextProps.currentPage);
    } else {
      this.getMaintainProjects(nextProps);
    }
  }

  //搜索显示模式
  searchDisplayPattern(customer) {
    return `${customer.customer_name} ${customer.customer_phone} ${customer.plate_num}`;
  }

  /**
   * TODO
   * @desc 搜索的逻辑不是很合理
   * @param key
   * @param successHandle
   * @param failHandle
   */
  handleSearch(key, successHandle, failHandle) {
    this.setState({currentCustomer: null});
    if (key) {
      this.searchCustomer(key, successHandle, failHandle);
    } else {
      this.getMaintainProjects(this.props);
      successHandle([]);
    }
  }

  handleSelectCustomer(customer) {
    this.setState({currentCustomer: customer});
    this.props.updateState({page: 1});
    this.searchMaintainProjects(customer.plate_num || customer.customer_phone, 1);
  }

  handlePageChange(page) {
    this.props.updateState({page});
  }

  searchCustomer(key, successHandle, failHandle) {
    api.ajax({
      url: api.searchMaintainCustomerList({key, page: 1}),
    }, (data) => {
      successHandle(data.res.list);
    }, (error) => {
      failHandle(error);
    });
  }

  searchMaintainProjects(key, page) {
    api.ajax({url: api.searchMaintainProjectList({key, page})}, (data) => {
      let {list, total} = data.res;
      this.setState({list, total: parseInt(total)});
    });
  }

  getMaintainProjects(props) {
    this.setState({isFetching: true});
    api.ajax({url: props.source}, (data) => {
      let {intention_list, total} = data.res;
      this.setState({
        isFetching: false,
        list: intention_list,
        total: parseInt(total),
      });
    });
  }

  render() {
    let {isFetching, list, total} = this.state;

    const columns = [
      {
        title: '车牌号',
        dataIndex: 'auto_plate_num',
        width: '8%',
        key: 'auto_plate_num',
        className: 'center',
      }, {
        title: '车型',
        dataIndex: 'auto_type_name',
        width: '17%',
        key: 'auto_type_name',
      }, {
        title: '姓名',
        dataIndex: 'customer_name',
        width: '10%',
        key: 'customer_name',
        render(item, record){
          return (
            <Link to={{pathname: '/customer/detail/', query: {customer_id: record.customer_id}}}>
              {item} {record.customer_gender == 0 ? '女士' : (record.customer_gender == 1 ? '男士' : '')}
            </Link>
          );
        },
      }, {
        title: '电话',
        dataIndex: 'customer_phone',
        width: '10%',
        key: 'customer_phone',
      }, {
        title: '维修项目',
        dataIndex: 'item_names',
        width: '15%',
        key: 'item_names',
      }, {
        title: '工人',
        dataIndex: 'fitter_user_names',
        width: '8%',
        key: 'fitter_user_names',
      }, {
        title: '金额',
        dataIndex: 'total_fee',
        width: '7%',
        key: 'total_fee',
        className: 'text-right',
      }, {
        title: '里程数(km)',
        dataIndex: 'mileage',
        width: '7%',
        key: 'mileage',
        className: 'text-right',
      }, {
        title: '创建时间',
        dataIndex: 'ctime',
        width: '8%',
        key: 'ctime',
        className: 'center',
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'operation',
        width: '10%',
        className: 'center',
        render (item, record) {
          let isDisabled = false;
          if (Number(record.status || 0) == 3 || Number(record.status || 0) == 5) {
            isDisabled = true;
          }
          let info = {
            customer_id: record.customer_id,
            project_id: record._id,
            isDisabled: isDisabled,
          };

          return (
            <div>
              <Link
                to={{
                  pathname: '/aftersales/project/create/',
                  query: {
                    customer_id: record.customer_id,
                    auto_id: record.auto_id,
                    maintain_intention_id: record._id,
                  },
                }}
                target="_blank"
              >
                <Button size="small" className="btn-action-small">
                  {(Number(record.status || 0) == 3 || Number(record.status || 0) == 5) ? '详情' : '编辑'}
                </Button>
              </Link>

              <PayProjectModal {...info}/>
            </div>
          );
        },
      },
    ];

    return (
      <div>
        <Row className="mb10">
          <Col span={12}>
            <SearchSelectBox
              style={{width: 300}}
              placeholder={'请输入车牌号、姓名或电话搜索'}
              displayPattern={this.searchDisplayPattern}
              onSearch={this.handleSearch}
              autoSearchLength={3}
              onSelectItem={this.handleSelectCustomer}
              className="no-print"
            />
          </Col>
          <Col span={12}>
            <div className="pull-right">
              <Link to={{pathname: '/aftersales/project/create/'}} target="_blank">
                <Button type="primary" size="default">新增工单</Button>
              </Link>
            </div>
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
