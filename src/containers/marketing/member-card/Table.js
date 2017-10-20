import React from 'react';
import { Link } from 'react-router-dom';
import { message, Popconfirm, Badge, Tooltip } from 'antd';

import text from '../../../config/text';
import TableWithPagination from '../../../components/widget/TableWithPagination';
import api from '../../../middleware/api';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      total: 0,
      isFetching: false,
    };

    [
      'handlePageChange',
      'getList',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getList(this.props.source);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.source != nextProps.source) {
      this.getList(nextProps.source);
    }
  }

  handlePageChange(page) {
    this.props.updateState({ page });
  }

  handleUpdateMemberCardTypeStatus(couponCardTypeInfo, newStatus) {
    const couponCardTypeId = couponCardTypeInfo._id;
    const url = api.coupon.updateCouponCardTypeStatus();
    const data = { coupon_card_type_id: couponCardTypeId, status: newStatus };
    api.ajax({ url, data, type: 'POST' }, data => {
      if (data.code === 0) {
        message.success('更改成功！');
        this.getList(this.props.source);
      } else {
        message.error(data.msg);
      }
    }, error => {
      message.error(error);
    });
  }

  getList(source) {
    this.setState({ isFetching: true });
    api.ajax({ url: source }, data => {
      if (data.code !== 0) {
        message.error(data.msg);
      } else {
        const list = data.res.list ? data.res.list : [];
        this.setState({ list, total: data.res.total, isFetching: false });
      }
    });
  }

  render() {
    const { list, total, isFetching } = this.state;
    const self = this;

    const userInfo = api.getLoginUser();

    const columns = [
      {
        title: '序号',
        key: 'index',
        width: '48px',
        render: (value, record, index) => index + 1,
      }, {
        title: '套餐卡名称',
        dataIndex: 'name',
        key: 'name',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 8) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '售价',
        dataIndex: 'price',
        key: 'price',
        width: '110px',
        className: 'column-money',
      }, {
        title: '描述',
        dataIndex: 'remark',
        key: 'remark',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 8) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '有效期(天)',
        dataIndex: 'valid_day',
        key: 'valid_day',
        className: 'center',
        width: '85px',
      }, {
        title: '提成金额(元)',
        dataIndex: 'sell_bonus_amount',
        key: 'sell_bonus_amount',
        className: 'text-right',
        width: '110px',
        render: value => Number(value).toFixed(2),
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        className: 'center',
        width: '89px',
        render: value => (
            <Badge
              status={String(value) === '1' ? 'default' : 'success'}
              text={text.memberCardStatus[value]}
            />
          ),
      }, {
        title: '操作',
        key: 'operation',
        className: 'center',
        width: '94px',
        render: (text, record) =>
          // disabled={userInfo.companyId != record.company_id}
           (
            <div>
              {
                Number(record.card_count) === 0
                  ? Number(record.status) === 0
                  ? <Link to={{ pathname: `/marketing/membercard/detail/${record._id}` }}>
                    查看
                  </Link>
                  : <Link
                    to={{ pathname: `/marketing/membercard/new/${record._id}` }}
                  >
                    编辑
                  </Link>
                  : <Link to={{ pathname: `/marketing/membercard/detail/${record._id}` }}>
                    查看
                  </Link>
              }
              <span className="ant-divider" />
              {
                Number(record.status) === 0
                  ? <Popconfirm
                    placement="topRight"
                    title="套餐卡停用后，该套餐卡停止发放，已经发卡的用户可以继续使用套餐卡"
                    onConfirm={() => self.handleUpdateMemberCardTypeStatus(record, 1)}
                    overlayStyle={{ width: '200px' }}
                  >
                    <a href="javascript:;">{'停用'}</a>
                  </Popconfirm>

                  : <Popconfirm
                    placement="topRight"
                    title="确定启用？"
                    onConfirm={() => self.handleUpdateMemberCardTypeStatus(record, 0)}
                    overlayStyle={{ width: '200px' }}
                  >
                    <a href="javascript:;">{'启用'}</a>
                  </Popconfirm>

              }
            </div>
          ),
      },
    ];
    return (
      <div>
        <TableWithPagination
          isLoading={isFetching}
          columns={columns}
          dataSource={list}
          total={Number(total)}
          currentPage={this.props.page}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }
}
