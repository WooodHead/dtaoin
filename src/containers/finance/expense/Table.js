import React from 'react';
import { Link } from 'react-router-dom';
import { message, Badge } from 'antd';

import text from '../../../config/text';
import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';

import NewDetail from './NewDetails';
import FixedAssetsDetail from './FixedAssetsDetail';
import TableWithPagination from '../../../components/widget/TableWithPagination';

export default class TableCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      total: 0,
      isFetching: false,
    };

    [
      'getList',
      'handlePageChange',
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

  getList(source) {
    this.setState({ isFetching: true });
    api.ajax({
      url: source,
    }, data => {
      if (data.code !== 0) {
        message.error(data.msg);
      } else {
        const list = data.res.list ? data.res.list : [];
        const total = Number(data.res.total) || 0;
        this.setState({ list, total, isFetching: false });
      }
    });
  }

  render() {
    const { list, total, isFetching } = this.state;

    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: '48px',
        render: (value, record, index) => index + 1,
      }, {
        title: '收支',
        dataIndex: 'type',
        key: 'type',
        width: '75px',
        render: value => {
          const status = (Number(value) === 0) ? 'success' : 'error';
          return <Badge status={status} text={text.balancePayments[value]}/>;
        },
      }, {
        title: '项目',
        dataIndex: 'sub_type_name',
        key: 'sub_type_name',
      }, {
        title: '金额(元)',
        dataIndex: 'amount',
        key: 'amount',
        className: 'text-right',
        width: '80px',
        render(value) {
          return Number(value).toFixed(2);
        },
      }, {
        title: '经办人',
        dataIndex: 'user_name',
        key: 'user_name',
        width: '110px',
      }, {
        title: '收款方/付款方',
        dataIndex: 'payer',
        key: 'payer',
        render: (value, record) => {
          if (String(record.payee) !== '') {
            return record.payee;
          } else if (String(value) !== '') {
            return value;
          }
        },
      }, {
        title: '付款方式',
        dataIndex: 'pay_type_name',
        key: 'pay_type_name',
        className: 'center',
        width: '95px',
      }, {
        title: '支付时间',
        dataIndex: 'ptime',
        key: 'ptime',
        width: '130px',
        render: value => DateFormatter.getFormatTime(value),
      }, {
        title: '操作',
        width: '90px',
        className: 'center',
        render: (value, record) => {
          switch (record.from_table) {
          case 'dt_auto_part_purchase':// 采购
            return (
                <Link to={{ pathname: `/warehouse/purchase/detail/${record.from_id}` }} target="_blank">
                  查看详情
                </Link>
            );

          case 'dt_auto_part_reject':// 运费 退货
            return (
                <Link to={{ pathname: `/warehouse/purchase-reject/detail/${record.from_id}` }} target="_blank">
                  查看详情
                </Link>
            );

          case 'dt_maintenance_intention':// 工单
            return (
                <Link to={{ pathname: `/aftersales/project/edit/${record.from_id}` }} target="_blank">
                  查看详情
                </Link>
            );

          case 'dt_customer_member_order':// 会员
            return (
                <Link to={{ pathname: `/customer/detail/${record.customer_id}` }} target="_blank">
                  查看详情
                </Link>
            );

          case 'dt_auto':// 新车销售
            return (
                <Link to={{ pathname: `/customer/detail/${record.customer_id}` }} target="_blank">
                  查看详情
                </Link>
            );

          case 'dt_fixed_assets':// 固定资产
            return <FixedAssetsDetail id={record.from_id}/>;

          default:// 新增收入支出
            return <NewDetail detail={record}/>;
          }
        },
      },
    ];

    return (
      <TableWithPagination
        isLoading={isFetching}
        columns={columns}
        dataSource={list}
        total={Number(total)}
        currentPage={this.props.page}
        onPageChange={this.handlePageChange}
      />
    );
  }
}
