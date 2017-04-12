import React from 'react';
import { Link } from 'react-router';
import { message, Popconfirm } from 'antd';

import text from '../../../config/text';
import TableWithPagination from '../../../components/widget/TableWithPagination';
import GenMemberCardModal from './NewMemberCard';
import api from '../../../middleware/api';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      total: 0,
      isFetching: false,
      showGenerateCardModal: false,
      currentMemberCardTypeInfo: null,
    };

    [
      'handlePageChange',
      'handleHideGenerateCardModal',
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

  handleUpdateMemberCardTypeStatus(memberCardTypeInfo, newStatus) {
    let memberCardTypeId = memberCardTypeInfo._id;
    let url = api.coupon.updateMemberCardTypeStatus();
    let data = { member_card_type_id: memberCardTypeId, status: newStatus };
    api.ajax({ url, data, type: 'POST' }, data => {
      if (data.code === 0) {
        message.success('更改成功！');
        this.getList(this.props.source);
      } else {
        message.error(data.msg);
      }
    }, (error) => {
      message.error(error);
    });
  }

  handleGenMemberCard(memberCardTypeInfo) {
    this.setState({ showGenerateCardModal: true, currentMemberCardTypeInfo: memberCardTypeInfo });
  }

  handleHideGenerateCardModal() {
    this.setState({ showGenerateCardModal: false });
  }

  getList(source) {
    this.setState({ isFetching: true });
    api.ajax({ url: source }, (data) => {
      if (data.code !== 0) {
        message.error(data.msg);
      } else {
        let list = data.res.list ? data.res.list : [];
        this.setState({ list: list, total: data.res.total, isFetching: false });
      }
    });
  }

  render() {
    let { list, total, isFetching } = this.state;
    let self = this;

    let userInfo = api.getLoginUser();

    let columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '类型',
        dataIndex: 'company_id',
        key: 'company_id',
        render: value => Number(value) === 1 ? '总公司设置' : '门店自营',
      }, {
        title: '售价（元）',
        dataIndex: 'price',
        key: 'price',
        className: 'column-money',
      }, {
        title: '有效期（天）',
        dataIndex: 'valid_day',
        key: 'valid_day',
        className: 'center',
      }, {
        title: '会员卡描述',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: value => text.memberCardStatus[value],
      }, {
        title: '发卡数量',
        dataIndex: 'card_count',
        key: 'card_count',
        className: 'center',
      }, {
        title: '创建时间',
        dataIndex: 'ctime',
        key: 'ctime',
      }, {
        title: '操作',
        key: 'operation',
        className: 'center',
        width: '15%',
        render: (text, record) => {
          return (
            <div>
              {
                Number(record.card_count) === 0 ?
                  record.status == 0 ?
                    <Link to={{
                      pathname: '/marketing/membercard/detail',
                      query: { member_card_type: record._id },
                    }}>
                      查看
                    </Link> :
                    <Link
                      to={{
                        pathname: '/marketing/membercard/new',
                        query: { memberCardId: record._id },
                      }}
                      disabled={userInfo.companyId != record.company_id}
                    >
                      编辑
                    </Link> :
                  <Link to={{
                    pathname: '/marketing/membercard/detail',
                    query: { member_card_type: record._id },
                  }}>
                    查看
                  </Link>
              }
              <span className="ant-divider" />
              {
                record.status == 0 ?
                  <span>
                    <a href="javascript:;" onClick={() => self.handleGenMemberCard(record)}>发卡</a>
                    <span className="ant-divider" />
                    <Popconfirm
                      placement="topRight"
                      title="会员卡停用后，该会员停止发放，已经发卡的用户可以继续使用会员卡"
                      onConfirm={() => self.handleUpdateMemberCardTypeStatus(record, 1)}
                      overlayStyle={{ width: '200px' }}
                    >
                      <a href="javascript:;" disabled={userInfo.companyId != record.company_id}>{'停用'}</a>
                    </Popconfirm>
                  </span> :
                  <span>
                    <Popconfirm
                      placement="topRight"
                      title="确定启用？"
                      onConfirm={() => self.handleUpdateMemberCardTypeStatus(record, 0)}
                      overlayStyle={{ width: '200px' }}
                    >
                      <a href="javascript:;" disabled={userInfo.companyId != record.company_id}>{'启用'}</a>
                    </Popconfirm>
                  </span>

              }
            </div>
          );
        },
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
        <GenMemberCardModal
          memberCardTypeInfo={this.state.currentMemberCardTypeInfo}
          visible={this.state.showGenerateCardModal}
          cancel={this.handleHideGenerateCardModal}
          finish={this.handleHideGenerateCardModal}
          onSuccess={() => this.getList(this.props.source)}
        />
      </div>
    );
  }
}
