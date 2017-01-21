import React, {Component} from 'react';
import {Link} from 'react-router';
import {Button, Select, Row, Col, message} from 'antd';
import TableWithPagination from '../../../../components/base/TableWithPagination';
const Option = Select.Option;

import api from '../../../../middleware/api';
import SearchBox from '../../../../components/base/SearchBox';
import GenMemberCardModal from '../../../../components/modals/marketing/GenMemberCardModal';

export default class MembercardTypeList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      totalPagination: 1,
      searchKey: '',
      data: [],
      isFetching: false,
      filterStatus: -1,
      showGenerateCardModal: false,
      currentMemberCardTypeInfo: null,
    };

    //自动绑定
    [
      'onSearch',
      'onHideGenerateCardModal',
      'onStatusChange',
      'onGenMemberCard',
      'handlePaginationChange',
    ].forEach((method) => this[method] = this[method].bind(this));

    this.columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
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
        title: '操作',
        key: 'operation',
        className: 'center',
        render: (text, record) => {
          return record.status == 1
            ?
            <p>
              <Link to={{
                pathname: '/marketing/membercard-type/info',
                query: {member_card_type: record._id},
              }}>
                查看详情
              </Link>
              <span className="ant-divider ml15 mr15 center"/>
              <span>已停用</span>
            </p>
            :
            <p>
              <Link to={{
                pathname: '/marketing/membercard-type/info',
                query: {member_card_type: record._id},
              }}>
                查看详情
              </Link>
              <span className="ant-divider ml15 mr15"/>
              <Link onClick={() => this.onGenMemberCard(record)}>
                发卡
              </Link>
              <span className="ant-divider ml15 mr15"/>
              <Link onClick={() => this.onUpdateMemberCardTypeStatus(record, 1)}>
                停用
              </Link>
            </p>;
        },
      },
    ];
  }

  componentDidMount() {
    this.search('', this.state.filterStatus);
  }

  componentWillReceiveProps() {
    this.search(this.state.searchKey, this.state.filterStatus, this.state.page || 1);
  }

  search(key, status, page, successHandle, failHandle) {
    successHandle || (successHandle = () => {
    });
    failHandle || (failHandle = (error) => {
      message.error(error);
    });
    page = page || 1;
    this.setState({isFetching: true});
    let url = api.coupon.getMemberCardTypeList(key, status, {page});
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        this.setState({
          isFetching: false,
          data: data.res.list,
          totalPagination: Number(data.res.total) || 1,
        });
        successHandle();
      } else {
        failHandle(data.msg);
      }
    }, (error) => {
      failHandle(error);
    });
  }

  onHideGenerateCardModal() {
    this.setState({
      showGenerateCardModal: false,
    });
  }

  handlePaginationChange(page) {
    this.setState({
      page: page,
    }, () => {
      this.search(this.state.searchKey, this.state.filterStatus, this.state.page || 1);
    });
  }

  onSearch(key, successHandle, failHandle) {
    // 搜索
    this.search(key, this.state.filterStatus, 1, successHandle, failHandle);
    // 保存搜索关键词
    this.setState({searchKey: key});
  }

  onStatusChange(value) {
    this.search(this.state.searchKey, value);
    this.setState({
      filterStatus: value,
      page: 1,
    });
  }

  onGenMemberCard(memberCardTypeInfo) {
    this.setState({
      showGenerateCardModal: true,
      currentMemberCardTypeInfo: memberCardTypeInfo,
    });
  }

  onUpdateMemberCardTypeStatus(memberCardTypeInfo, newStatus) {
    let memberCardTypeId = memberCardTypeInfo._id;

    let url = api.coupon.updateMemberCardTypeStatus();
    let data = {member_card_type_id: memberCardTypeId, status: newStatus};
    api.ajax({url, data, type: 'POST'}, (data) => {
      if (data.code === 0) {
        message.success('更改成功！');
        if (newStatus == 1) {
          this.search('', this.state.filterStatus);
        }
      } else {
        message.error(data.msg);
      }
    }, (error) => {
      message.error(error);
    });

  }

  render() {
    const data = this.state.data;
    const columns = this.columns;
    return (
      <div>
        <Row className="mb10">
          <Col span={8}>
            <SearchBox
              style={{width: 250}}
              placeholder={'请输入会员卡名字'}
              onSearch={this.onSearch}
            />
          </Col>
          <Col span={8}>
            <span className="mr15">状态</span>
            <Select
              style={{width: 120}}
              size="large"
              defaultValue="-1"
              onChange={this.onStatusChange}
            >
              <Option key="-1" value="-1">全部</Option>
              <Option key="0" value="0">启用</Option>
              <Option key="1" value="1">停用</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Button type="primary" className="pull-right" onClick={() => {
              location.href = '/marketing/membercard-type/create';
            }}>创建会员卡</Button>
          </Col>
        </Row>

        <TableWithPagination
          isLoading={this.state.isFetching}
          columns={columns}
          dataSource={data}
          total={this.state.totalPagination}
          currentPage={this.state.page}
          onPageChange={this.handlePaginationChange}
        />

        <GenMemberCardModal
          memberCardTypeInfo={this.state.currentMemberCardTypeInfo}
          visible={this.state.showGenerateCardModal}
          cancel={this.onHideGenerateCardModal}
          finish={this.onHideGenerateCardModal}
        />
      </div>
    );
  }
}
