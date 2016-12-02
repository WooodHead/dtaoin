import React, {Component} from 'react'
import {Link} from 'react-router'
import {Breadcrumb, Table, DatePicker, Select, Row, Col, message} from 'antd'
import moment from 'moment';
const Option = Select.Option;
const {RangePicker} = DatePicker;

import HCSearchBox from '../../../components/base/HCSearchBox'
import api from '../../../middleware/api'


export default class MemberCardSaleLog extends Component {

  constructor(props) {
    super(props);

    this.state = {
      keyword: '',                          //搜索关键词
      memberCardStatus: '0',                //会员卡状态
      memberCardTypeList: [],               //会员卡类型列表
      currentCardTypeID: '',                //选中的卡类型

      startDate: moment().format('YYYY-MM-DD'),   //开始时间
      endDate: moment().format('YYYY-MM-DD'),     //结束时间
      endOpen: false,                       //结束时间选择器的打开状态

      saleLog: [],                          //搜索到的销售记录
    };

    //方法绑定
    [
      'onSearch',
      'onCardTypeChange',
      'onDatePickerChange',
      'onPayMemberOrder',
    ].map((method) => this[method] = this[method].bind(this));

    this.columns = [
      {
        title: <p style={{textAlign: 'center'}}>卡号</p>,
        dataIndex: 'member_card_number',
        key: 'member_card_number',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>客户姓名 性别</p>,
        key: 'name_gender',
        render: (text, record) => {
          return (
            <p style={{textAlign: 'center'}}>
              {record.name} {record.gender == '1' ? '先生' : record.gender == '0' ? '女士' : ''}
            </p>
          )
        }
      }, {
        title: <p style={{textAlign: 'center'}}>手机</p>,
        dataIndex: 'phone',
        key: 'phone',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>会员卡名称</p>,
        dataIndex: 'member_card_name',
        key: 'member_card_name',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>开卡日期</p>,
        dataIndex: 'member_start_date',
        key: 'member_start_date',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>到期日期</p>,
        dataIndex: 'member_expire_date',
        key: 'member_expire_date',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>实付金额</p>,
        dataIndex: 'price',
        key: 'price',
        render: (text) => <p style={{textAlign: 'center'}}>{Number(text).toFixed(2)} 元</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>销售人员</p>,
        dataIndex: 'seller_user_id',
        key: 'seller_user_id',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>备注</p>,
        dataIndex: 'remark',
        key: 'remark',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>操作</p>,
        key: 'operation',
        render: (text, record) => (
          <p style={{textAlign: 'center'}}>
            {
              ('' + record.status) == '0'
                ?
                <Link onClick={() => this.onPayMemberOrder(record)}>结算</Link>
                :
                <span>已结算</span>
            }
          </p>
        ),
      }
    ];
  }

  componentDidMount() {
    //请求所有会员卡类型数据
    this.getMemberCardTypes();
    this.search('', '', [this.state.startDate, this.state.endDate]);

  }


  //请求所有会员卡类型数据
  getMemberCardTypes() {
    let url = api.coupon.getMemberCardTypeList(this.state.keyword, this.state.memberCardStatus, 0, 100);
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        this.setState({memberCardTypeList: data.res.list});
      } else {
        message.error(data.msg);
      }
    }, (error) => {
      message.error(error);
    })
  }

  //搜索数据
  search(key, cardTypeId, dates, successHandle, failHandle) {
    successHandle || (successHandle = () => {
    });
    failHandle || (failHandle = (error) => {
      message.error(error);
    });
    let url = api.coupon.getMemberOrderList(key, cardTypeId, dates[0], dates[1]);
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        this.setState({saleLog: data.res.list});
        successHandle();
      } else {
        failHandle(data.msg);
      }
    }, (error) => {
      failHandle(error);
    })
  }


  //搜索事件
  onSearch(keyword, successHandle, failHandle) {
    const {
      currentCardTypeID,
      startDate,
      endDate,
    } = this.state;

    this.setState({keyword});
    this.search(keyword, currentCardTypeID, [startDate, endDate], successHandle, failHandle);
  }

  //当时间选择发生变化
  onCardTypeChange(value) {
    this.setState({currentCardTypeID: value});
  }

  //当时间选择发生变化
  onDatePickerChange(dates, dateStrings) {
    this.setState({
      startDate: dateStrings[0],
      endDate: dateStrings[1],
    });
  }

  //支付某一订单
  onPayMemberOrder(memberCardOrder) {
    let url = api.coupon.payMemberOrder();
    let data = {customer_member_order_id: memberCardOrder._id};
    api.ajax({url, data, type: 'POST'}, (data) => {
      if (data.code === 0) {
        const {
          keyword,
          currentCardTypeID,
          startDate,
          endDate,
        } = this.state;
        this.search(keyword, currentCardTypeID, [startDate, endDate]);
      } else {
        message.error(data.msg);
      }
    }, (error) => {
      message.error(error);
    })
  }


  render() {
    const columns = this.columns;
    const memberCardTypeList = this.state.memberCardTypeList || [];
    const currentCardTypeID = this.state.currentCardTypeID || '';
    const saleLog = this.state.saleLog || [];

    return (
      <div>
        {/*面包屑导航*/}
        <div className="mb10">
          <Breadcrumb>
            <Breadcrumb.Item>
              售后
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              会员卡销售记录
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div>
          {/*搜索&筛选*/}
          <div className="mt30">
            <Row className="mb10">
              <Col span={6}>
                <HCSearchBox
                  style={{width: 300}}
                  placeholder={'请输入手机号、卡号搜索'}
                  onSearch={this.onSearch}
                  autoSearch={false}
                />
              </Col>
              <Col span={6} offset={2}>
                <span className="mr15">会员卡名称</span>
                <Select
                  style={{width: 150}}
                  size="large"
                  defaultValue={currentCardTypeID}
                  onChange={this.onCardTypeChange}
                >
                  <Option value="">全部</Option>
                  {
                    memberCardTypeList.map((memberCardType) => {
                      return <Option key={memberCardType._id} value={memberCardType._id}>{memberCardType.name}</Option>
                    })
                  }
                </Select>
              </Col>
              <Col span={8} offset={2}>
                <RangePicker
                  size="large"
                  defaultValue={[
                    this.state.startDate,
                    this.state.endDate,
                  ]}
                  format="yyyy-MM-dd"
                  onChange={this.onDatePickerChange}
                />
              </Col>
            </Row>

          </div>

          {/*会员卡列表*/}
          <div className="mt30">
            <Table
              bordered
              columns={columns}
              rowKey={record => record._id}
              dataSource={saleLog}
            />
          </div>

        </div>
      </div>
    );
  }
}
