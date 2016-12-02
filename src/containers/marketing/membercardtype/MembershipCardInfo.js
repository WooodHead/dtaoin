import React, {Component} from 'react'
import {Link} from 'react-router'
import {Breadcrumb, Table, Button, Row, Col, message} from 'antd'

import api from '../../../middleware/api'
import GenMemberCardModal from '../../../components/modals/marketing/GenMemberCardModal';


export default class MembershipCardInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showGenerateCardModal: false,
      memberCardTypeInfo: null,
      memberCardTypeGenLog: [],
    };

    this.couponColumns = [
      {
        title: <p style={{textAlign: 'center'}}>序号</p>,
        key: 'index',
        render: (text, record, index) => {
          return <p style={{textAlign: 'center'}}>{index + 1}</p>
        },
      }, {
        title: <p style={{textAlign: 'center'}}>优惠名称</p>,
        dataIndex: 'name',
        key: 'name',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>适用门店</p>,
        dataIndex: 'scope',
        key: 'scope',
        render: (text) => {
          switch ('' + text) {
            case '0':
              return <p style={{textAlign: 'center'}}>通店</p>;
            case '1':
              return <p style={{textAlign: 'center'}}>售卡门店</p>;
            default:
              return null;
          }
        },
      }, {
        title: <p style={{textAlign: 'center'}}>优惠类型</p>,
        dataIndex: 'type',
        key: 'type',
        render: (text) => {
          switch ('' + text) {
            case '1':
              return <p style={{textAlign: 'center'}}>计次优惠</p>;
            case '2':
              return <p style={{textAlign: 'center'}}>折扣优惠</p>;
            case '3':
              return <p style={{textAlign: 'center'}}>立减优惠</p>;
            default:
              return null;
          }
        },
      }, {
        title: <p style={{textAlign: 'center'}}>描述</p>,
        dataIndex: 'remark',
        key: 'remark',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>数量</p>,
        dataIndex: 'amount',
        key: 'amount',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }
    ];
    this.genLogColumn = [
      {
        title: <p style={{textAlign: 'center'}}>发卡门店</p>,
        dataIndex: 'company_name',
        key: 'company_name',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>发卡张数</p>,
        dataIndex: 'count',
        key: 'count',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>免费张数</p>,
        dataIndex: 'free_count',
        key: 'free_count',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>生成时间</p>,
        dataIndex: 'ctime',
        key: 'ctime',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>操作</p>,
        key: 'operation',
        render: (text, record) => (
          <p style={{textAlign: 'center'}}>
          <span>
            <Link onClick={() => this.exportData(record)}>导出卡号</Link>
          </span>
          </p>
        ),
      }
    ];

  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    let memberCardType = this.props.location.query.member_card_type;
    //取会员卡类型数据
    let urlForInfo = api.coupon.getMemberCardTypeInfo(memberCardType);
    api.ajax({url: urlForInfo}, (data) => {
      if (data.code === 0) {
        this.setState({memberCardTypeInfo: data.res.detail});
      } else {
        this.setState({memberCardTypeInfo: null});
        message.error(data.msg);
      }
    }, (error) => {
      this.setState({memberCardTypeInfo: null});
      message.error(error);
    });


    //取会员卡发卡历史数据
    let urlForLog = api.coupon.getGenMemberCardLog(memberCardType);
    api.ajax({url: urlForLog}, (data) => {
      if (data.code === 0) {
        this.setState({memberCardTypeGenLog: data.res.list});
      } else {
        this.setState({memberCardTypeGenLog: []});
        message.error(data.msg);
      }
    }, (error) => {
      this.setState({memberCardTypeGenLog: []});
      message.error(error);
    })
  }

  //导出卡号
  exportData(logDetail) {
    let logId = logDetail._id;
    let typeId = logDetail.member_card_type;

    const url = api.coupon.exportMemberCardDistributeLog(typeId, logId);
    let aToExportCSV = document.createElement('a');
    aToExportCSV.href = url;
    aToExportCSV.target = '_blank';
    aToExportCSV.click();
  }


  render() {
    const memberCardTypeInfo = this.state.memberCardTypeInfo || {};
    const couponColumns = this.couponColumns;
    const coupon = memberCardTypeInfo.coupon_items ? (JSON.parse(memberCardTypeInfo.coupon_items) || []) : [];
    const genLogColumn = this.genLogColumn;
    const genLog = this.state.memberCardTypeGenLog;

    return (
      <div>
        {/*面包屑导航*/}
        <div className="mb10">
          <Breadcrumb>
            <Breadcrumb.Item>
              营销/会员卡管理
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="#/marketing/membercardtype/list">会员卡列表</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              会员卡信息
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>


        <div>

          {/*基本信息填写区*/}
          <div className="mt30">
            <Row className="mb10">
              <Col span="12">
                <p style={{fontSize: 24}}>- 开卡信息</p>
              </Col>
            </Row>

            <Row>
              <Col span={6} offset={1}>
                <p>会员卡名称: {memberCardTypeInfo.name || ''}</p>
              </Col>
              <Col span={6} offset={1}>
                <p>售价: {memberCardTypeInfo.price || ''}</p>
              </Col>
              <Col span={6} offset={1}>
                <p>有效期: {memberCardTypeInfo.valid_day || ''}</p>
              </Col>
            </Row>
            <Row>
              <Col span={14} offset={1}>
                <p>描述: {memberCardTypeInfo.remark || ''}</p>
              </Col>
              <Col span={6} offset={1}>
                <p>创建时间: {memberCardTypeInfo.ctime || ''}</p>
              </Col>
            </Row>

          </div>

          {/*优惠显示区*/}
          <div className="mt15">
            <Row className="mb10">
              <Col span="12">
                <p style={{fontSize: 24}}>- 卡内优惠</p>
              </Col>
            </Row>

            <Table
              columns={couponColumns}
              dataSource={coupon}
              pagination={false}
              bordered
            />

          </div>

          {/*优惠显示区*/}
          <div className="mt15">
            <Row className="mb10">
              <Col span="12">
                <p style={{fontSize: 24}}>- 发卡记录</p>
              </Col>
              <Col span="12">
                <Button type="primary" style={{float: 'right'}} onClick={() => {
                  this.setState({showGenerateCardModal: true})
                }}>发卡</Button>
              </Col>
            </Row>

            <Table
              columns={genLogColumn}
              dataSource={genLog}
              pagination={false}
              bordered
            />

          </div>

        </div>

        {/*//生成会员卡模态窗口*/}
        <GenMemberCardModal
          memberCardTypeInfo={this.state.memberCardTypeInfo}
          visible={this.state.showGenerateCardModal}
          hidden={() => {
            this.setState({showGenerateCardModal: false})
          }}
        />
      </div>
    );
  }
}
