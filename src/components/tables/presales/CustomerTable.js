import React from 'react'
import {Link} from 'react-router'
import {Table, Row, Col, Button, message} from 'antd'
import api from '../../../middleware/api'
import CustomerSearchBox from '../../search/CustomerSearchBox'
import TableWithPagination from '../../base/TableWithPagination'
import CalculateDealModal from '../../../components/modals/presales/CalculateDealModal'
import CalculateConfirm from '../../../components/popover/CalculateConfirm'

export default class CustomerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: []
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    this.getListData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getListData(nextProps);
  }

  onCalculate(autoId) {
    console.log('autoId', autoId);
    confirm({
      title: '确定要锁定吗?',
      content: '',
      onOk() {
        console.log('确定');
      },
      onCancel() {}
    });
  }

  handleSearchChange(data) {
    if (data.key) {
      this.setState({customers: data.list});
    } else {
      this.getListData(this.props);
    }
  }

  getListData(props) {
    api.ajax({url: props.source}, function (data) {
      this.setState({customers: data.res.list});
    }.bind(this));
  }

  render() {
    const customerColumns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render(value, record) {
        return (
          <Link to={{pathname:'/presales/customer/detail/',query:{customer_id:record._id}}}>
            {value}
          </Link>
        );
      }
    }, {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone'
    //}, {
    //  title: '客户来源',
    //  dataIndex: 'source_name',
    //  key: 'source'
    }, {
      title: '车牌号',
      dataIndex: 'user_autos',
      key: 'auto_plate_num',
      className: 'no-padding',
      render: function (value, record) {
        let autos = [];
        value.map(function (item, index) {
          autos.push(
            <div className="in-table-line" key={item._id}>
              {item.auto_plate_num ? item.auto_plate_num : <span className="c-grey-c">尚未填写</span>}
            </div>
          )
        });
        return autos;
      }
    }, {
      title: '车辆型号',
      dataIndex: 'user_autos',
      key: 'autoType',
      className: 'no-padding',
      render: function (value, record) {
        let autos = [];
        value.map(function (item, index) {
          autos.push(
            <div className="in-table-line" key={item._id}>
              {item.auto_type_name ? item.auto_type_name : <span className="c-grey-c">暂无信息</span>}
            </div>
          )
        });
        return autos;
      }
    }, {
      title: '成交时间',
      dataIndex: 'user_autos',
      key: 'auto_deal',
      className: 'no-padding',
      render: function (value, record) {
        let autos = [];
        value.map(function (item) {
          autos.push(
            <div className="in-table-line" key={item._id}>
              {item.auto_deal ? item.auto_deal.order_date : <span className="c-grey-c">尚未成交</span>}
            </div>
          )
        });
        return autos;
      }
    }];

    if (api.hasPresalesSuperPermission()) {
      customerColumns.push({
        title: '操作',
        dataIndex: 'user_autos',
        key: 'action',
        className: 'center',
        render: function (value, record) {
          let actions = [];
          value.map(item => {
            actions.push(
              <div className="in-table-line" key={item._id}>
                <CalculateDealModal
                  userAutoId={item._id}
                  isDisabled={item.status.toString() === '3' || !item.auto_deal}
                />
                
                <CalculateConfirm
                  userAutoId={item._id}
                  isDisabled={item.status.toString() === '3' || !item.auto_deal}
                />
              </div>
            )
          });
          return actions;
        }
      })
    }

    return (
      <div>
        <Row className="mb10">
          <Col span="8">
            <CustomerSearchBox
              api={api.searchAutoCustomerList()}
              change={this.handleSearchChange}
              style={{width: 250}}
            />
          </Col>
        </Row>

        <TableWithPagination
          columns={customerColumns}
          dataSource={this.state.customers}
          pathname={this.props.pathname}
          page={this.props.page}
        />
      </div>
    );
  }
}
