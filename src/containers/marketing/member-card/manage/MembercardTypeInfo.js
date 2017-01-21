import React, {Component} from 'react';
import {Link} from 'react-router';
import {Table, Button, Row, Col, message} from 'antd';

import api from '../../../../middleware/api';
import GenMemberCardModal from '../../../../components/modals/marketing/GenMemberCardModal';

export default class MembercardTypeInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showGenerateCardModal: false,
      memberCardTypeInfo: null,
      memberCardTypeGenLog: [],
    };

    [
      'handleAddMemberCardCancel',
      'handleAddMemberCardFinish',
    ].map(method => this[method] = this[method].bind(this));

    this.couponColumns = [
      {
        title: '序号',
        key: 'index',
        render: (text, record, index) => index + 1,
      }, {
        title: '优惠名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '适用门店',
        dataIndex: 'scope',
        key: 'scope',
        render: text => {
          switch ('' + text) {
            case '0':
              return '通店';
            case '1':
              return '售卡门店';
            default:
              return null;
          }
        },
      }, {
        title: '优惠类型',
        dataIndex: 'type',
        key: 'type',
        render: text => {
          switch ('' + text) {
            case '1':
              return '计次优惠';
            case '2':
              return '折扣优惠';
            case '3':
              return '立减优惠';
            default:
              return null;
          }
        },
      }, {
        title: '描述',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
        render: text => ('' + text) == '0' ? '不限次数' : text,
      },
    ];
    this.genLogColumn = [
      {
        title: '发卡门店',
        dataIndex: 'company_name',
        key: 'company_name',
      }, {
        title: '发卡张数',
        dataIndex: 'count',
        key: 'count',
      }, {
        title: '免费张数',
        dataIndex: 'free_count',
        key: 'free_count',
      }, {
        title: '生成时间',
        dataIndex: 'ctime',
        key: 'ctime',
      }, {
        title: '操作',
        key: 'operation',
        className: 'center',
        render: (text, record) => <Link onClick={() => this.exportData(record)}>导出卡号</Link>,
      },
    ];

  }

  componentDidMount() {
    this.getMemberCardTypeInfo();
    this.getMemberCardAddLog();
  }

  //取会员卡类型数据
  getMemberCardTypeInfo() {
    let memberCardType = this.props.location.query.member_card_type;
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
  }

  //取会员卡发卡历史数据
  getMemberCardAddLog() {
    let memberCardType = this.props.location.query.member_card_type;

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
    });
  }

  handleAddMemberCardCancel() {
    this.setState({showGenerateCardModal: false});
  }

  handleAddMemberCardFinish(newLog) {
    this.setState({showGenerateCardModal: false});
    //location.reload();
    let {memberCardTypeGenLog} = this.state;
    newLog && memberCardTypeGenLog.unshift(newLog);
    this.setState(memberCardTypeGenLog);
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
        <div>
          {/*基本信息填写区*/}
          <div className="mt30">
            <Row className="mb10">
              <Col span={12}>
                <p className="font-size-24">- 开卡信息</p>
              </Col>
            </Row>

            <Row className="ant-row">
              <Col span={2} offset={1} className="ant-form-item">
                会员卡名称:
              </Col>
              <Col span={3} className="ant-form-item">
                {memberCardTypeInfo.name || ''}
              </Col>

              <Col span={2} offset={1} className="ant-form-item">
                售价:
              </Col>
              <Col span={3} className="ant-form-item">
                {memberCardTypeInfo.price || ''}
              </Col>

              <Col span={2} offset={1} className="ant-form-item">
                有效期:
              </Col>
              <Col span={3} className="ant-form-item">
                {memberCardTypeInfo.valid_day || ''}
              </Col>

              <Col span={2} offset={1} className="ant-form-item">
                创建时间:
              </Col>
              <Col span={3} className="ant-form-item">
                {memberCardTypeInfo.ctime || ''}
              </Col>
            </Row>
            <Row>
              <Col span={2} offset={1} className="ant-form-item">
                描述:
              </Col>
              <Col span={20} className="ant-form-item">
                {memberCardTypeInfo.remark || ''}
              </Col>
            </Row>

          </div>

          {/*优惠显示区*/}
          <div className="mt15">
            <Row className="mb10">
              <Col span={12}>
                <p className="font-size-24">- 卡内优惠</p>
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
              <Col span={12}>
                <p className="font-size-24">- 发卡记录</p>
              </Col>
              <Col span={12}>
                <Button
                  type="primary"
                  style={{float: 'right'}}
                  onClick={() => this.setState({showGenerateCardModal: true})}
                >
                  发卡
                </Button>
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
          cancel={this.handleAddMemberCardCancel}
          finish={this.handleAddMemberCardFinish}
        />
      </div>
    );
  }
}
