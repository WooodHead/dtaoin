import React from 'react';
import {Row, Col, message, Button, Icon, Popconfirm} from 'antd';

import api from '../../../middleware/api';
import text from '../../../config/text';
import className from 'classnames';

import ImagePreview from '../../../components/widget/ImagePreview';

import NotPass from './NotPass';
import SettlementHistory from './SettlementHistory';

export default class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerId: props.location.query.customerId,
      auditHistory: [],
      withDrawList: [],
      customerInfo: {},
      totalIncome: 0,
      avatarPic: '',
      alipayAccountEdit: false,
    };

    [
      'handleAuditExamine',
      'handleSettlement',
      'handleAlipayAccountEdit',
      'handleAlipayAccountCancel',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    let {customerId} = this.state;

    this.getCustomerInfo(customerId);
    this.getAuditLogList(customerId);
    this.getWithDrawList(customerId);
  }

  handleSettlement() {
    let {customerInfo, customerId} = this.state;
    let payInfos = {pay_infos: JSON.stringify([{_id: customerInfo._id, pay_amount: customerInfo.unpay_amount}])};

    api.ajax({
      url: api.technician.settlement(),
      data: payInfos,
      type: 'POST',
    }, () => {
      message.success('结算成功');
      this.setState({reload: true});
      this.getCustomerInfo(customerId);
    });
  }

  handleAuditExamine(condition) {
    api.ajax({
      url: api.technician.auditExamine(this.state.customerId),
      data: condition,
      type: 'POST',
    }, () => {
      message.success('审核成功');
      this.setState({reload: true});
    });
  }

  handleAlipayAccountEdit() {
    let {alipayAccountEdit, customerId} = this.state;
    this.setState({alipayAccountEdit: !alipayAccountEdit});

    if (alipayAccountEdit) {
      let alipayAccount = {alipay_account: this['alipayAccount'].value};

      api.ajax({
        url: api.technician.editAlipayAccount(customerId),
        data: alipayAccount,
        type: 'POST',
      }, () => {
        message.success('修改成功');
        this.getCustomerInfo(customerId);
      });
    }
  }

  handleAlipayAccountCancel() {
    this.setState({alipayAccountEdit: false});
  }

  getCustomerInfo(customerId) {
    api.ajax({url: api.technician.detail(customerId)}, data => {
      this.setState({customerInfo: data.res.detail});
      this.getAvatarPic(data.res.detail.avatar_pic);
    });
  }

  getAuditLogList(customerId) {
    api.ajax({url: api.technician.auditLogList(customerId)}, data => {
      this.setState({auditHistory: data.res.list});
    });
  }

  getWithDrawList(customerId) {
    api.ajax({url: api.technician.withDrawList(customerId, 1)}, data => {
      let withDrawList = data.res.list;
      let totalIncome = 0;
      withDrawList.map(item => {
        totalIncome += Number(item.amount);
      });
      this.setState({totalIncome, withDrawList});
    });
  }

  getAvatarPic(avatarUrl) {
    if (avatarUrl) {
      api.ajax({url: api.system.getPublicPicUrl(avatarUrl)}, data => {
        this.setState({
          avatarPic: data.res.url,
        });
      });
    }
  }

  render() {
    let {auditHistory, customerInfo, avatarPic, totalIncome, alipayAccountEdit, customerId} = this.state;

    let content = (
      <div>
        {
          auditHistory.map(item => {
            return (
              <Row key={item._id} className="mt10">
                <Col>
                  <div style={{display: 'inline-block', width: '135px'}}>{item.ctime}</div>
                  <span>{Number(item.type) === 0 ? '驳回' : '通过'}</span>
                  <span className="ml10">{Number(item.type) === 0 ? `驳回原因：${item.reason}` : ''}</span>
                </Col>
              </Row>
            );
          })
        }
      </div>
    );

    let idCardImages = [];
    let driverLicenceImage = [];

    if (customerInfo.id_card_pic) {
      idCardImages.push({
        title: '身份证照片',
        url: api.system.getPrivatePicUrl(customerInfo.id_card_pic),
      });
    }

    if (customerInfo.business_card_pic) {
      driverLicenceImage.push({
        title: `${customerInfo.name}-工牌照片`,
        url: api.system.getPrivatePicUrl(customerInfo.business_card_pic),
      });
    }

    const customerNameIcon = className({
      'icon-first-name-none': !(customerInfo && customerInfo._id),
      'icon-first-name-three': true,
    });

    const customerInfoContainer = className({
      'customer-info': !!(customerInfo && customerInfo._id),
      hide: !(customerInfo && customerInfo._id),
    });

    return (
      <div>
        <Row className="with-bottom-border">
          <h2>技师详情</h2>
        </Row>

        <Row>
          <Row className="mt20">
            <Col span={12}>
              <Icon type="info-circle"/>
              <span className="ml10 font-size-14">
                {
                  Number(customerInfo.status) === 1 ?
                    <span className="text-success">{text.technicianStatus[customerInfo.status]}</span> :
                    text.technicianStatus[customerInfo.status]
                }
              </span>
            </Col>

            <Col span={12}>
              <span className="pull-right">
                <NotPass status={customerInfo.status} handleAuditExamine={this.handleAuditExamine}/>
                <Button
                  className="ml10"
                  onClick={() => this.handleAuditExamine({type: 1})}
                  disabled={Number(customerInfo.status) === 1}
                >
                  通过
                </Button>
              </span>
            </Col>
          </Row>

          <Row className="with-bottom-border">
            <Col span={6}>
              <div className="base-info-noline mb20">
                <div className="customer-container">
                  <div className={customerNameIcon}>
                    {
                      customerInfo.name ?
                        <img src={avatarPic} alt={'暂未上传图片'} style={{width: '100%', height: '100%'}}/> :
                        <Icon type="user" style={{color: '#fff'}}/>
                    }
                  </div>

                  <div className={customerInfoContainer} style={{height: '90px'}}>
                    <div>
                      <span className="customer-name">{customerInfo.customer_name || customerInfo.name}</span>
                      <span
                        className="ml6">{text.gender[String(customerInfo.customer_gender || customerInfo.gender)]}</span>
                    </div>
                    <div><span className="label">手机号</span>{customerInfo.customer_phone || customerInfo.phone}</div>
                    <div><span className="label">擅长品牌</span>{customerInfo.skilled_brand_names}</div>
                  </div>
                </div>
              </div>
            </Col>

            <Col span={6} className="mt42">
              <div><span className="label">身份证号</span>{customerInfo.id_card_num}</div>
              <div className="mt8"><span className="label">所在城市</span>{customerInfo.city}</div>
            </Col>

            <Col span={6} className="mt42">
              <div><span className="label">身份证照片</span>
                <ImagePreview
                  title={`${customerInfo.name}-身份证`}
                  images={idCardImages}
                  disabled={!customerInfo.id_card_pic}
                />
              </div>
              <div className="mt8"><span className="label">入行日期</span>{customerInfo.started_work_time}</div>
            </Col>

            <Col span={6} className="mt42">
              <div><span className="label">工牌照片</span>
                <ImagePreview
                  title={`${customerInfo.name}-工牌`}
                  images={driverLicenceImage}
                  disabled={!customerInfo.business_card_pic}
                />
              </div>
              <div className="mt8"><span className="label">申请时间</span>{customerInfo.ctime}</div>
            </Col>
          </Row>
        </Row>

        <Row className="with-bottom-border">
          <Row className="mb20 mt20">
            <h3>支付信息</h3>
          </Row>

          <Row className="mb20">
            <Col span={2}>支付宝</Col>
            <Col span={2}>
              <span className={alipayAccountEdit ? '' : 'hide'}>
                <input
                  className="ant-input ant-input-sm"
                  style={{width: '105px'}}
                  size="small"
                  ref={alipayAccount => this['alipayAccount'] = alipayAccount}
                />
              </span>

              <span className={alipayAccountEdit ? 'hide' : ''}>
                {customerInfo.alipay_account}
              </span>

            </Col>
            <Col>
              <a href="javascript:;" onClick={this.handleAlipayAccountEdit}>{alipayAccountEdit ? '保存' : '修改'}</a>
              <a
                href="javascript:;"
                className={alipayAccountEdit ? 'ml10' : 'hide'}
                onClick={this.handleAlipayAccountCancel}
              >
                取消
              </a>
            </Col>
          </Row>

          <Row className="mb20">
            <Col span={2}>待支付金额</Col>
            <Col span={2}>{customerInfo.unpay_amount}</Col>
            <Col>
              <Popconfirm
                placement="topRight"
                title="结算后，该技师未结算金额将清空"
                onConfirm={this.handleSettlement}
              >
                <a href="javascript:" disabled={Number(customerInfo.unpay_amount) <= 0}>结算</a>
              </Popconfirm>

              <span className="ml20">
                <SettlementHistory customerId={customerId}/>
              </span>
            </Col>
          </Row>

          <Row className="mb20">
            <Col span={2}>总收益金额</Col>
            <Col>{totalIncome}</Col>
          </Row>
        </Row>

        <Row className="with-bottom-border">
          <Row className="mt20 mb20">
            <Col>
              <h3>审核历史</h3>
            </Col>
          </Row>
          {content}
        </Row>
      </div>
    );
  }
}
