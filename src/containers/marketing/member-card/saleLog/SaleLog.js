import React, {Component} from 'react';
import {Link} from 'react-router';
import {DatePicker, Select, Row, Col, message} from 'antd';
import moment from 'moment';

import SearchBox from '../../../../components/base/SearchBox';
import api from '../../../../middleware/api';
import formatter from '../../../../utils/DateFormatter';
import TableWithPagination from '../../../../components/base/TableWithPagination';

const Option = Select.Option;
const {RangePicker} = DatePicker;

export default class MemberCardSaleLog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      totalPagination: 10,
      searchKey: '',                              //搜索关键词
      memberCardStatus: '0',                      //会员卡状态
      memberCardTypeList: [],                     //会员卡类型列表
      currentCardTypeID: '',                      //选中的卡类型

      // startDate: moment().format('YYYY-MM-DD'),   //开始时间
      // endDate: moment().format('YYYY-MM-DD'),     //结束时间
      startDate: '',                              //开始时间
      endDate: '',                                //结束时间
      isFetching: false,
      saleLog: [],                                //搜索到的销售记录
    };

    //方法绑定
    [
      'onSearch',
      'onCardTypeChange',
      'onDatePickerChange',
      'onPayMemberOrder',
      'handlePaginationChange',
    ].map((method) => this[method] = this[method].bind(this));

    this.columns = [
      {
        title: '卡号',
        dataIndex: 'member_card_number',
        key: 'member_card_number',
      }, {
        title: '客户姓名 性别',
        key: 'name_gender',
        render: (text, record) => {
          return (
            <Link to={{pathname: '/customer/detail/', query: {customer_id: record.customer_id}}}>
              {record.name} {record.gender == '1' ? '先生' : record.gender == '0' ? '女士' : ''}
            </Link>
          );
        },
      }, {
        title: '手机',
        dataIndex: 'phone',
        key: 'phone',
      }, {
        title: '会员卡名称',
        dataIndex: 'member_card_name',
        key: 'member_card_name',
      }, {
        title: '开卡日期',
        dataIndex: 'member_start_date',
        key: 'member_start_date',
      }, {
        title: '到期日期',
        dataIndex: 'member_expire_date',
        key: 'member_expire_date',
      }, {
        title: '实付金额',
        dataIndex: 'price',
        key: 'price',
        className: 'column-money',
        render: (text) => `${Number(text).toFixed(2)} 元`,
      }, {
        title: '销售人员',
        key: 'seller_user_name',
        render: (text, record) => {
          return Number(record.seller_user_id) !== 0
            ?
            record.seller_user_name
            :
            '非本店售卡';
        },
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '操作',
        key: 'operation',
        className: 'center',
        render: (text, record) =>
          '' + record.status === '0'
            ?
            <Link onClick={() => this.onPayMemberOrder(record)}>结算</Link>
            :
            <span>已结算</span>
        ,
      },
    ];
  }

  componentDidMount() {
    //请求所有会员卡类型数据
    this.getMemberCardTypes();

    let startDate = '0000-00-00';
    let endDate = moment().format('YYYY-MM-DD');

    this.search('', '', [startDate, endDate]);
  }

  componentWillReceiveProps() {
    this.search(
      this.state.searchKey,
      this.state.currentCardTypeID,
      [this.state.startDate, this.state.endDate],
      this.state.page || 1
    );
  }

  //请求所有会员卡类型数据
  getMemberCardTypes() {
    let url = api.coupon.getMemberCardTypeList(this.state.searchKey, this.state.memberCardStatus, {
      page: 1,
      pageSize: 100,
    });
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        this.setState({
          memberCardTypeList: data.res.list,
          totalPagination: Number(data.res.total) || 1,
        });
      } else {
        message.error(data.msg);
      }
    }, (error) => {
      message.error(error);
    });
  }

  handlePaginationChange(page) {
    this.setState({
      page: page,
    }, () => {
      this.search('', this.state.currentCardTypeID, [this.state.startDate, this.state.endDate], this.state.page);
    });
  }

  //搜索数据
  search(key, cardTypeId, dates, page, successHandle, failHandle) {
    successHandle || (successHandle = () => {
    });
    failHandle || (failHandle = (error) => {
      message.error(error);
    });
    page = page || this.props.location.query.page || 1;
    let url = api.coupon.getMemberOrderList(key, cardTypeId, dates[0], dates[1], {page});

    api.ajax({url}, (data) => {
      this.setState({isFetching: true});
      if (data.code === 0) {
        this.setState({
          saleLog: data.res.list,
          totalPagination: Number(data.res.total) || Number(data.res.count) || 1,
          isFetching: false,
        });
        successHandle();
      } else {
        failHandle(data.msg);
      }
    }, (error) => {
      failHandle(error);
    });
  }


  //搜索事件
  onSearch(keyword, successHandle, failHandle) {
    const {
      currentCardTypeID,
      startDate,
      endDate,
    } = this.state;
    // 搜索
    this.search(keyword, currentCardTypeID, [startDate, endDate], 1, successHandle, failHandle);

    // 保存搜索关键词
    this.setState({searchKey: keyword});
  }

  //当卡类别发生变化
  onCardTypeChange(value) {
    const {
      searchKey,
      startDate,
      endDate,
    } = this.state;
    this.search(searchKey, value, [startDate, endDate]);

    this.setState({
      currentCardTypeID: value,
      page: 1,
    });
  }

  //当时间选择发生变化
  onDatePickerChange(dates, dateStrings) {
    const {
      searchKey,
      currentCardTypeID,
    } = this.state;
    this.search(searchKey, currentCardTypeID, dateStrings);

    this.setState({
      page: 1,
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
          searchKey,
          currentCardTypeID,
          startDate,
          endDate,
        } = this.state;
        let page = this.props.location.query.page || 1;
        this.search(searchKey, currentCardTypeID, [startDate, endDate], page);
      } else {
        message.error(data.msg);
      }
    }, (error) => {
      message.error(error);
    });
  }


  render() {
    const columns = this.columns;
    const memberCardTypeList = this.state.memberCardTypeList || [];
    const currentCardTypeID = this.state.currentCardTypeID || '';
    const saleLog = this.state.saleLog || [];

    return (
      <div>
        {/*搜索&筛选*/}
        <div className="mt30">
          <Row className="mb10">
            <Col span={6}>
              <SearchBox
                style={{width: 300}}
                placeholder={'请输入手机号、卡号搜索'}
                onSearch={this.onSearch}
                autoSearchLength={3}
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
                    return <Option key={memberCardType._id}
                                   value={memberCardType._id}>{memberCardType.name}</Option>;
                  })
                }
              </Select>
            </Col>
            <Col span={8} offset={2}>
              <span>开卡日期：</span>
              <RangePicker
                size="large"
                format={formatter.pattern.day}
                onChange={this.onDatePickerChange}
              />
            </Col>
          </Row>

        </div>

        {/*会员卡列表*/}
        <div className="mt30">

          <TableWithPagination
            isLoading={this.state.isFetching}
            columns={columns}
            dataSource={saleLog}
            total={this.state.totalPagination}
            currentPage={this.state.page}
            onPageChange={this.handlePaginationChange}
          />
        </div>

      </div>
    );
  }
}
