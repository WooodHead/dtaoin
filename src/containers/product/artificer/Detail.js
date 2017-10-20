import React from 'react';
import { Row, Col, message, Button, Icon, Popconfirm, Input, Select } from 'antd';

import api from '../../../middleware/api';
import text from '../../../config/text';
import className from 'classnames';

import ImagePreview from '../../../components/widget/ImagePreview';

import NotPass from './NotPass';
import SettlementHistory from './SettlementHistory';
import TableRecharge from './Recharge';

require('../artificer.less');

export default class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerId: props.match.params.customerId,
      auditHistory: [],
      withDrawList: [],
      customerInfo: {},
      totalIncome: 0,
      avatarPic: '',
      alipayAccountEdit: false,
      nameIsEdit: false,
      name: '',
      gender: '',
      artificerChargeList: [],
    };

    [
      'handleAuditExamine',
      'handleSettlement',
      'handleAlipayAccountEdit',
      'handleAlipayAccountCancel',
      'handleNameChange',
      'handleNameEdit',
      'handleSaveUserInfo',
      'getArtificerChargeList',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { customerId } = this.state;

    this.getCustomerInfo(customerId);
    this.getAuditLogList(customerId);
    this.getWithDrawList(customerId);
    this.getArtificerChargeList({ customerId, page: 1 });
  }

  handleSettlement() {
    const { customerInfo, customerId } = this.state;
    const payInfos = {
      pay_infos: JSON.stringify([
        {
          _id: customerInfo._id,
          pay_amount: customerInfo.unpay_amount,
        }]),
    };

    api.ajax({
      url: api.technician.settlement(),
      data: payInfos,
      type: 'POST',
    }, () => {
      message.success('结算成功');
      this.setState({ reload: true });
      this.getCustomerInfo(customerId);
      location.reload();
    });
  }

  handleAuditExamine(condition) {
    api.ajax({
      url: api.technician.auditExamine(this.state.customerId),
      data: condition,
      type: 'POST',
    }, () => {
      message.success('审核成功');
      this.setState({ reload: true });
      location.reload();
    });
  }

  handleAlipayAccountEdit() {
    const { alipayAccountEdit, customerId } = this.state;
    this.setState({ alipayAccountEdit: !alipayAccountEdit });

    if (alipayAccountEdit) {
      const alipayAccount = { alipay_account: this.alipayAccount.value };

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
    this.setState({ alipayAccountEdit: false });
  }

  handleNameEdit() {
    this.setState({ nameIsEdit: true });
  }

  handleNameChange(e) {
    const name = e.target.value;
    this.setState({ name });
  }

  handleSaveUserInfo() {
    const { customerInfo, name } = this.state;
    api.ajax({
      url: api.technician.editArtificerName(customerInfo._id),
      type: 'POST',
      data: { name },
    }, () => {
      message.success('修改客户信息成功');
      this.getCustomerInfo(customerInfo._id);
      this.setState({ nameIsEdit: false });
    });
  }

  getCustomerInfo(customerId) {
    api.ajax({ url: api.technician.detail(customerId) }, data => {
      this.setState({
        customerInfo: data.res.detail,
        name: data.res.detail.customer_name || data.res.detail.name,
        gender: String(data.res.detail.customer_gender || data.res.detail.gender),
      });
      this.getAvatarPic(data.res.detail.avatar_pic);
    });
  }

  getAuditLogList(customerId) {
    api.ajax({ url: api.technician.auditLogList(customerId) }, data => {
      this.setState({ auditHistory: data.res.list });
    });
  }

  getWithDrawList(customerId) {
    api.ajax({ url: api.technician.withDrawList(customerId, 1) }, data => {
      const withDrawList = data.res.list;
      let totalIncome = 0;
      withDrawList.map(item => {
        totalIncome += Number(item.amount);
      });
      this.setState({ totalIncome, withDrawList });
    });
  }

  getAvatarPic(avatarUrl) {
    if (avatarUrl) {
      api.ajax({ url: api.system.getPublicPicUrl(avatarUrl) }, data => {
        this.setState({
          avatarPic: data.res.url,
        });
      });
    }
  }

  getArtificerChargeList(customerId) {
    api.ajax({ url: api.technician.getArtificerChargeList(customerId) }, data => {
      const { list } = data.res;
      this.setState({ artificerChargeList: list });
    });
  }

  render() {
    const {
      auditHistory,
      customerInfo,
      avatarPic,
      totalIncome,
      alipayAccountEdit,
      customerId,
      nameIsEdit,
      name,
      artificerChargeList,
    } = this.state;

    const content = (
      <div>
        {
          auditHistory.map(item => (
              <Row key={item._id} className="mt10">
                <Col>
                  <div style={{ display: 'inline-block', width: '200px' }}>{item.ctime}</div>
                  <span>{Number(item.type) === 0 ? '驳回' : '通过'}</span>
                  <span className="ml10">{Number(item.type) === 0
                    ? `驳回原因：${item.reason}`
                    : ''}</span>
                </Col>
              </Row>
            ))
        }
      </div>
    );

    {/* <Option value="-2">全部</Option>
     <Option value="0">待认证</Option>
     <Option value="1">已认证</Option>
     <Option value="2">已驳回</Option>
     <Option value="3">审核中</Option>*/
    }

    let status = '';
    switch (Number(customerInfo.status)) {
    case 0:
      status = <Icon type="clock-circle-o" className="text-gray" />;
      break;
    case 1:
      status = <Icon type="check-circle-o" className="text-success" />;
      break;
    case 2:
      status = <Icon type="exclamation-circle-o" className="text-red" />;
      break;
    case 3:
      status = <Icon type="clock-circle-o" className="text-gray" />;
      break;
    default:

    }

    const driverLicenceImage = [];
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

    const editName = className({
      '': nameIsEdit,
      hide: !nameIsEdit,
    });

    const showName = className({
      hide: nameIsEdit,
      '': !nameIsEdit,
    });

    return (
      <div>
        <Row>
          <Row >
            <Col span={12}>
              <div className="base-info-noline mb20">
                <div className="customer-container">
                  <div className={customerNameIcon}>
                    {
                      !!avatarPic ? <img
                        src={avatarPic}
                        style={{ width: '100%', height: '100%' }}
                      /> : <Icon type="user" style={{ color: '#fff' }} />
                    }
                  </div>

                  <div className={customerInfoContainer} style={{ height: '50px' }}>
                    <div className={showName}>
                      <span className="customer-name">
                        {customerInfo.customer_name || customerInfo.name}
                      </span>
                      <span className="ml6 text-gray">
                        {text.gender_o[String(customerInfo.customer_gender || customerInfo.gender)]}
                      </span>
                      <a href="javascript:;" className="ml10" onClick={this.handleNameEdit}>修改</a>
                    </div>

                    <div className={editName}>
                      <Input
                        placeholder="客户姓名"
                        style={{ width: 100 }}
                        value={name}
                        onChange={this.handleNameChange}
                      />
                      <a href="javascript:" className="ml6" onClick={this.handleSaveUserInfo}>保存</a>
                    </div>

                    <div>
                      {status}
                      <span className="ml10 font-size-14">
                        {
                          Number(customerInfo.status) === 1
                            ? <span className="text-success">
                                {text.technicianStatus[customerInfo.status]}
                              </span>
                            : text.technicianStatus[customerInfo.status]
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col span={12}>
              <span className="pull-right">
                <NotPass
                  status={customerInfo.status}
                  handleAuditExamine={this.handleAuditExamine}
                />
                <Button
                  className="ml10"
                  onClick={() => this.handleAuditExamine({ type: 1 })}
                  disabled={String(customerInfo.status) !== '3'}
                >
                  通过
                </Button>
              </span>
            </Col>
          </Row>

          <Row className="with-bottom-border">
            <div className="artificer_info clearfix">
              <Col span={6}>
                <div>
                  <span className="label">手机号</span>
                  {customerInfo.customer_phone || customerInfo.phone}
                </div>
                <div className="mt15">
                  <span className="label">擅长品牌</span>
                  {customerInfo.skilled_brand_names}
                </div>
              </Col>

              <Col span={6}>
                <div><span className="label">身份证号</span>{customerInfo.id_card_num}</div>
                <div className="mt15">
                  <span className="label">所在城市</span>
                  {`${customerInfo.province || ''} ${customerInfo.city === '市辖区'
                    ? ''
                    : (customerInfo.city || '')} ${customerInfo.country || ''}`}
                </div>
              </Col>

              <Col span={6}>
                <div>
                  <span className="label">职业证明材料</span>
                  <span style={{ marginLeft: '-20px' }}>
                    <ImagePreview
                      title={`${customerInfo.name}-职业证明材料`}
                      images={driverLicenceImage}
                      disabled={!customerInfo.business_card_pic}
                    />
                  </span>
                </div>

                <div className="mt15">
                  <span className="label">入行日期</span>
                  {customerInfo.started_work_time}
                </div>
              </Col>

              <Col span={6}>
                <div className="mt36"><span className="label">申请时间</span>{customerInfo.ctime}</div>
              </Col>
            </div>
          </Row>
        </Row>

        <Row className="with-bottom-border">
          <Row className="mb20 mt20">
            <h3>支付信息</h3>
          </Row>

          <Row className="mb20">
            <Col span={2}>支付宝</Col>
            <Col span={4}>
              <span className={alipayAccountEdit ? '' : 'hide'}>
                <input
                  className="ant-input ant-input-sm"
                  style={{ width: '105px' }}
                  size="small"
                  ref={alipayAccount => this.alipayAccount = alipayAccount}
                />
              </span>

              <span className={alipayAccountEdit ? 'hide' : ''}>
                {customerInfo.alipay_account}
              </span>
            </Col>
            <Col>
              <a href="javascript:;" onClick={this.handleAlipayAccountEdit}>
                {alipayAccountEdit ? '保存' : '修改'}
              </a>
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
            <Col span={4}>{`${customerInfo.unpay_amount} 元`}</Col>
            <Col>
              <Popconfirm
                placement="topRight"
                title="结算后，该技师未结算金额将清空"
                onConfirm={this.handleSettlement}
              >
                <a href="javascript:" disabled={Number(customerInfo.unpay_amount) <= 0}>结算</a>
              </Popconfirm>

              <span className="ml20">
                <SettlementHistory customerId={customerId} />
              </span>
            </Col>
          </Row>

          <Row className="mb20">
            <Col span={2}>总收益金额</Col>
            <Col>{`${Number(totalIncome).toFixed(2)} 元`}</Col>
          </Row>

          <div className={artificerChargeList.length === 0 ? 'hide' : ''}>
            <Row className="mb20">
              <Col span={2}>充值金额</Col>
              <Col span={4}>{`${Number(customerInfo.total_charge_amount).toFixed(2)} 元`}</Col>
              <Col>
                <TableRecharge customerId={customerId} />
              </Col>
            </Row>

            <Row className="mb20">
              <Col span={2}>充值剩余金额</Col>
              <Col span={4}>{`${Number(customerInfo.remain_charge_amount).toFixed(2)} 元`}</Col>
            </Row>
          </div>
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
