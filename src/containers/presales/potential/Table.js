import React from 'react';
import {Link} from 'react-router';
import {Row, Col} from 'antd';
import api from '../../../middleware/api';
import CommonText from '../../../config/text';
import SearchBox from '../../../components/search/CustomerSearchBox';
import TableWithPagination from '../../../components/base/TableWithPagination';
import NewDealModal from '../../../components/modals/presales/NewDealModal';
import LostCustomerModal from './Lost';
import NewIntentionModal from './New';
import NewPotentialCustomerModal from '../../../components/modals/presales/NewPotentialCustomerModal';

import CreateRemind from '../../../components/modals/aftersales/CreateRemind';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      list: [],
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    this.getPotentialCustomers(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getPotentialCustomers(nextProps);
  }

  handleSearchChange(data) {
    if (data.key) {
      let {list, total} = data;
      this.setState({list, total: parseInt(total)});
    } else {
      this.getListData(this.props.source(this.props.filter));
    }
  }

  handlePageChange(page) {
    this.props.updateState({page});
  }

  getPotentialCustomers(props) {
    this.setState({isFetching: true});
    api.ajax({url: props.source(props.filter)}, (data) => {
      let {list, total} = data.res;
      this.setState({
        isFetching: false,
        list,
        total: parseInt(total),
      });
    });
  }

  render() {
    let {isFetching, list, total} = this.state;

    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render (text, record) {
        return <Link to={{pathname: '/customer/detail', query: {customer_id: record._id}}}>{text}</Link>;
      },
    }, {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '更新时间',
      dataIndex: 'intentions',
      key: 'intentionsMtime',
      className: 'no-padding',
      render (value) {
        let autos = [];
        value.map(function (item) {
          autos.push(<div className="in-table-line" key={item.mtime}>{item.mtime}</div>);
        });
        return autos;
      },
    }, {
      title: '意向级别',
      dataIndex: 'intentions',
      key: 'intentionLevel',
      className: 'no-padding',
      render (value) {
        let autos = [];
        value.map(function (item) {
          autos.push(<div className="in-table-line" key={item._id}>{item.level}</div>);
        });
        return autos;
      },
    }, {
      title: '意向车型',
      dataIndex: 'intentions',
      key: 'autoType',
      className: 'no-padding',
      render (value) {
        let autos = [];
        value.map(function (item) {
          autos.push(
            <div className="in-table-line" key={item._id}>
              {item.auto_type_name || <span className="text-gray">无意向车型</span>}
            </div>
          );
        });
        return autos;
      },
    }, {
      title: '指导价',
      dataIndex: 'intentions',
      key: 'guidePrice',
      className: 'no-padding text-right',
      render (value) {
        let autos = [];
        value.map(function (item) {
          autos.push(
            <div className="in-table-line" key={item._id}>
              {item.guide_price}
            </div>
          );
        });
        return autos;
      },
    }, {
      title: '按揭意向',
      dataIndex: 'intentions',
      key: 'mortgage',
      className: 'no-padding center',
      render (value) {
        let autos = [];
        value.map(function (item) {
          autos.push(
            <div className="in-table-line" key={item._id}>
              {CommonText.isMortgage[Number(item.is_mortgage)]}
            </div>
          );
        });
        return autos;
      },
    }, {
      title: '意向操作',
      dataIndex: 'intentions',
      key: 'operation',
      className: 'no-padding center action-two',
      render (value) {
        let operations = [];
        value.map(function (item) {
          let status = item.status != 0;
          operations.push(
            <div className="in-table-line" key={item._id}>
              <NewDealModal
                customer_id={item.customer_id}
                intention_id={item._id}
                disabled={status}
              />

              <LostCustomerModal
                intention_id={item._id}
                customer_id={item.customer_id}
                disabled={status}
              />
            </div>);
        });
        return operations;
      },
    }, {
      title: '客户操作',
      dataIndex: '_id',
      key: 'action',
      className: 'no-padding center action-two',
      render (id) {
        return (
          <div>
            <NewIntentionModal
              customer_id={id}
              size="small"
              isSingle={true}
              refresh={false}
            />
            <CreateRemind customer_id={id} size="small"/>
          </div>
        );
      },
    }];

    return (
      <div>
        <Row className="mb10">
          <Col span={12}>
            <SearchBox
              api={api.autoSellPotentialList(this.props.filter)}
              change={this.handleSearchChange}
              style={{width: 250}}
            />
          </Col>
          <Col span={12}>
            <NewPotentialCustomerModal />
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
