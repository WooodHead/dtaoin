import React from 'react'
import {Link} from 'react-router'
import {Table, Button, Row, Col, Icon} from 'antd'
import api from '../../../middleware/api'
import CommonText from '../../../middleware/text'
import SearchBox from '../../search/CustomerSearchBox'
import TableWithPagination from '../../base/TableWithPagination'
import NewDealModal from '../../modals/presales/NewDealModal'
import LostCustomerModal from '../../modals/presales/LostCustomerModal'
import NewIntentionModal from '../../modals/presales/NewIntentionModal'
import NewPotentialCustomerModal from '../../modals/presales/NewPotentialCustomerModal'

export default class PotentialTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: []
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    this.getPotentialCustomers(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getPotentialCustomers(nextProps);
  }

  handleSearchChange(data) {
    if (data.key) {
      this.setState({customers: data.list});
    } else {
      this.getListData(this.props.source);
    }
  }

  getPotentialCustomers(props) {
    api.ajax({url: props.source}, function (data) {
      let customers = data.res.list;
      this.setState({customers: customers});
    }.bind(this));
  }

  render() {
    const potentialCustomerColumns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render (text, record) {
        return <Link to={{pathname: '/presales/potential/detail/', query: {customer_id: record._id}}}>{text}</Link>;
      }
    //}, {
    //  title: '客户来源',
    //  dataIndex: 'source_name',
    //  key: 'source'
    }, {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone'
    }, {
      title: '更新时间',
      dataIndex: 'intentions',
      key: 'intentionsMtime',
      className: 'no-padding',
      render (value, record) {
        let autos = [];
        value.map(function (item) {
          autos.push(<div className="in-table-line" key={item.mtime}>{item.mtime}</div>)
        });
        return autos;
      }
    }, {
      title: '意向级别',
      dataIndex: 'intentions',
      key: 'intentionLevel',
      className: 'no-padding',
      render (value, record) {
        let autos = [];
        value.map(function (item, index) {
          autos.push(<div className="in-table-line" key={item._id}>{item.level}</div>)
        });
        return autos;
      }
    }, {
      title: '意向车型',
      dataIndex: 'intentions',
      key: 'autoType',
      className: 'no-padding',
      render (value, record) {
        let autos = [];
        value.map(function (item, index) {
          autos.push(<div className="in-table-line" key={item._id}>{item.auto_type_name}</div>)
        });
        return autos;
      }
    }, {
      title: '指导价',
      dataIndex: 'intentions',
      key: 'guidePrice',
      className: 'column-money',
      render (value, record) {
        let autos = [];
        value.map(function (item, index) {
          autos.push(<div className="in-table-line" key={item._id}>{item.guide_price}</div>)
        });
        return autos;
      }
    }, {
      title: '按揭意向',
      dataIndex: 'intentions',
      key: 'mortgage',
      className: 'no-padding',
      render (value, record) {
        let autos = [];
        value.map(function (item, index) {
          autos.push(<div className="in-table-line"
                          key={item._id}>{CommonText.isMortgage[Number(item.is_mortgage)]}</div>)
        });
        return autos;
      }
    }, {
      title: '意向操作',
      dataIndex: 'intentions',
      key: 'operation',
      className: 'center action-two no-padding',
      render (value, record) {
        let operations = [];
        value.map(function (item, index) {
          let status = item.status == -1 ? true : false;
          operations.push(
            <div className="in-table-line" key={item._id}>
              <NewDealModal customer_id={item.customer_id} intention_id={item._id} disabled={status}/>
              <LostCustomerModal intention_id={item._id} customer_id={item.customer_id} disabled={status}/>
            </div>)
        });
        return operations;
      }
    }, {
      title: '客户操作',
      dataIndex: 'intentions',
      key: 'newIntention',
      className: 'center',
      render (value, record) {
        return (
          <NewIntentionModal
            customer_id={record._id}
            isSingle={true}
            refresh={false}
          />
        )
      }
    }];

    return (
      <div>
        <Row className="mb10">
          <Col span="12">
            <SearchBox
              api={api.searchAutoPotentialCustomerList()}
              change={this.handleSearchChange}
              style={{width: 250}}
            />
          </Col>
          <Col span="12">
            <NewPotentialCustomerModal />
          </Col>
        </Row>

        <TableWithPagination
          columns={potentialCustomerColumns}
          dataSource={this.state.customers}
          pathname={this.props.pathname}
          page={this.props.page}
        />
      </div>
    );
  }
}
