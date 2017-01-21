import React from 'react';
import {Link} from 'react-router';
import {Row, Col} from 'antd';
import api from '../../../middleware/api';
import CustomerSearchBox from '../../../components/search/CustomerSearchBox';
import TableWithPagination from '../../../components/base/TableWithPagination';
import CalculateDealModal from '../../../components/modals/presales/CalculateDealModal';
import CalculateConfirm from '../../../components/popover/CalculateConfirm';
import CreateRemind from '../../../components/modals/aftersales/CreateRemind';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      isFetching: false,
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    this.getListData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getListData(nextProps);
  }

  handleSearchChange(data) {
    if (data.key) {
      let {list, total} = data;
      this.setState({list, total: parseInt(total)});
    } else {
      this.getListData(this.props);
    }
  }

  handlePageChange(page) {
    this.props.updateState({page});
  }

  getListData(props) {
    this.setState({isFetching: true});
    api.ajax({url: props.source}, function (data) {
      let {list, total} = data.res;
      this.setState({list, total: parseInt(total), isFetching: false});
    }.bind(this));
  }

  render() {
    let {list, total, isFetching} = this.state;
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render(value, record) {
        return (
          <Link to={{pathname:'/customer/detail/',query:{customer_id:record._id}}}>
            {value}
          </Link>
        );
      },
    }, {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    //}, {
    //  title: '客户来源',
    //  dataIndex: 'source_name',
    //  key: 'source'
    }, {
      title: '车牌号',
      dataIndex: 'autos',
      key: 'auto_plate_num',
      className: 'no-padding',
      render: function (value) {
        let autos = [];
        value.map(function (item) {
          autos.push(
            <div className="in-table-line" key={item._id}>
              {item.auto_plate_num ? item.auto_plate_num : <span className="c-grey-c">尚未填写</span>}
            </div>
          );
        });
        return autos;
      },
    }, {
      title: '车辆型号',
      dataIndex: 'autos',
      key: 'autoType',
      className: 'no-padding',
      render: function (value) {
        let autos = [];
        value.map(function (item) {
          autos.push(
            <div className="in-table-line" key={item._id}>
              {item.auto_type_name ? item.auto_type_name : <span className="c-grey-c">暂无信息</span>}
            </div>
          );
        });
        return autos;
      },
    }, {
      title: '成交时间',
      dataIndex: 'autos',
      key: 'auto_deal',
      className: 'no-padding center',
      render: function (value) {
        let autos = [];
        value.map(function (item) {
          autos.push(
            <div className="in-table-line" key={item._id}>
              {item.auto_deal ? item.auto_deal.order_date : <span className="c-grey-c">尚未成交</span>}
            </div>
          );
        });
        return autos;
      },
    }];

    if (api.hasPresalesSuperPermission()) {
      columns.push({
        title: '操作',
        dataIndex: 'autos',
        key: 'action',
        className: 'center action-three',
        render: function (value, record) {
          let actions = [];
          value.map(item => {
            actions.push(
              <div className="in-table-line" key={item._id}>
                <CreateRemind customer_id={record._id} transaction="transaction"/>
                <CalculateDealModal
                  userAutoId={item._id}
                  isDisabled={item.status.toString() === '3' || !item.auto_deal}
                />
                
                <CalculateConfirm
                  userAutoId={item._id}
                  isDisabled={item.status.toString() !== '2' || !item.auto_deal}
                />
              </div>
            );
          });
          return actions;
        },
      });
    }

    return (
      <div>
        <Row className="mb10">
          <Col span={24}>
            <CustomerSearchBox
              api={api.searchAutoCustomerList()}
              change={this.handleSearchChange}
              style={{width: 250}}
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
