import React, {Component} from 'react'
import {Link} from 'react-router'
import {Breadcrumb, Button, Table, Pagination, Select, Row, Col, message} from 'antd'
const Option = Select.Option;

import api from '../../../middleware/api'
import HCSearchBox from '../../../components/base/HCSearchBox'

import GenMemberCardModal from '../../../components/modals/marketing/GenMemberCardModal'


export default class MembershipCardList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filterStatus: -1,
      showGenerateCardModal: false,
      currentMemberCardTypeInfo: null,
    };

    //自动绑定
    [
      'onSearch',
      'onStatusChange',
      'onGenMemberCard',
    ].forEach((method) => this[method] = this[method].bind(this));

    this.columns = [
      {
        title: <p style={{textAlign: 'center'}}>名称</p>,
        dataIndex: 'name',
        key: 'name',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>售价（元）</p>,
        dataIndex: 'price',
        key: 'price',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>有效期（天）</p>,
        dataIndex: 'valid_day',
        key: 'valid_day',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>会员卡描述</p>,
        dataIndex: 'remark',
        key: 'remark',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>操作</p>,
        key: 'operation',
        render: (text, record) => (
          <p style={{textAlign: 'center'}}>

            {
              record.status == 1
                ?
                <span>
                  <Link to={{
                    pathname: "/marketing/membercardtype/info",
                    query: {member_card_type: record._id}
                  }}> 
                    查看详情
                  </Link> 
                  <span className="ant-divider" style={{marginLeft: '15px', marginRight: '15px'}}/>
                  <span>已停用</span>
                </span>

                :
                <span>
                  <Link to={{
                    pathname: "/marketing/membercardtype/info",
                    query: {member_card_type: record._id}
                  }}> 
                    查看详情
                  </Link> 
                  <span className="ant-divider" style={{marginLeft: '15px', marginRight: '15px'}}/>
                  <Link onClick={() => this.onGenMemberCard(record)}>发卡</Link>
                  <span className="ant-divider" style={{marginLeft: '15px', marginRight: '15px'}}/>
                  <Link onClick={() => this.onUpdateMemberCardTypeStatus(record, 1)}>停用</Link>
                </span>
            }

          </p>
        ),
      }
    ];
  }

  componentDidMount() {
    this.search('', this.state.filterStatus);
  }

  search(key, status, successHandle, failHandle) {
    successHandle || (successHandle = () => {
    });
    failHandle || (failHandle = (error) => {
      message.error(error);
    });
    let url = api.coupon.getMemberCardTypeList(key, status);
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        this.setState({data: data.res.list});
        successHandle();
      } else {
        failHandle(data.msg);
      }
    }, (error) => {
      failHandle(error);
    })
  }

  onSearch(key, successHandle, failHandle) {
    this.search(key, this.state.filterStatus, successHandle, failHandle);
  }

  onStatusChange(value) {
    this.setStatus({filterStatus: value});
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
        {/*面包屑导航*/}
        <div className="mb10">
          <Breadcrumb>
            <Breadcrumb.Item>
              营销/会员卡管理
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              会员卡列表
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div>
          {/*搜索&筛选*/}
          <div className="mt30">
            <Row className="mb10">
              <Col span="8">
                <HCSearchBox
                  style={{width: 250}}
                  placeholder={'请输入手机号'}
                  onSearch={this.onSearch}
                  autoSearch={false}
                />
              </Col>
              <Col span="8">
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
              <Col span="8">
                <Button type="primary" style={{float: 'right'}} onClick={() => {
                  location.href = '#/marketing/membercardtype/create'
                }}>创建会员卡</Button>
              </Col>
            </Row>

          </div>

          {/*会员卡列表*/}
          <div className="mt30">
            <Table
              columns={columns}
              rowKey={record => record._id}
              dataSource={data}
            />
          </div>

        </div>

        {/*//生成会员卡模态窗口*/}
        <GenMemberCardModal
          memberCardTypeInfo={this.state.currentMemberCardTypeInfo}
          visible={this.state.showGenerateCardModal}
          hidden={() => {
            this.setState({showGenerateCardModal: false})
          }}
        />
      </div>
    );
  }
}
