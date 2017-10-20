import React from 'react';
import { Link } from 'react-router-dom';
import { message, Modal, Button, Row, Col, Select, Badge } from 'antd';

import api from '../../../middleware/api';
import text from '../../../config/text';

import BaseTable from '../../../components/base/BaseTable';

const confirm = Modal.confirm;
const Option = Select.Option;

export default class TableSaleLogs extends BaseTable {

  showModal() {
    this.setState({ visible: true });
  }

  hideModal() {
    this.setState({ visible: false });
  }

  handleSelectChange(payType) {
    this.setState({ payType });
  }

  // 支付某一订单
  handlePayMemberOrder(memberCardOrder, payType) {
    const isPosDevice = api.getLoginUser().isPosDevice;
    const timer = isPosDevice == 0 ? 200 : 2000;

    const url = api.coupon.payMemberOrder();
    const data = {
      customer_member_order_id: memberCardOrder._id,
      pay_type: payType,
    };

    this.setState({ btnLoading: true });

    api.ajax({ url, data, type: 'POST' }, () => {
      this.props.updateState({ page: 1 });
      !!payType ? window.time = setInterval(() => {
        api.ajax({ url: api.coupon.getMemberOrderDetail(memberCardOrder._id) }, data => {
          if (Number(data.res.detail.status) === 1) {
            window.clearInterval(window.time);

            this.setState({ btnLoading: false });
            message.success('结算成功!');
            window.location.reload();
          }
        });
      }, Number(timer)) : confirm({
        title: '是否已经结算成功？',
        content: '',
        okText: '结算成功',
        onOk() {
          window.location.reload();
        },
        cancelText: '结算失败',
        onCancel() {
          window.location.reload();
        },
      });
    }, error => {
      message.error(error);
    });
  }

  content(record) {
    const isPosDevice = api.getLoginUser().isPosDevice;
    const { visible, btnLoading } = this.state;

    const footer = [
      <div>
        <Button
          key="btn4"
          type="primary"
          loading={!!btnLoading}
          onClick={() => this.handlePayMemberOrder(record, this.state.payType)}
        >结算
        </Button>
        <Button key="btn5" type="ghost" onClick={this.hideModal.bind(this)}>取消</Button>
      </div>,
    ];

    return (
      <span>
        <div className={Number(isPosDevice) === 1 ? '' : 'hide'}>
          <a href="javascript:;" onClick={() => this.handlePayMemberOrder(record)}>结算</a>
        </div>

        <div className={Number(isPosDevice) === 0 ? '' : 'hide'}>
           <a href="javascript:;" onClick={this.showModal.bind(this)}>结算</a>
             <Modal
               visible={visible}
               title="结算方式"
               onCancel={this.hideModal.bind(this)}
               footer={footer}
             >
               <Row>
                 <Col span={14}>
                   <label className="label">支付方式</label>
                   <Select
                     style={{ width: '150px' }}
                     onChange={this.handleSelectChange.bind(this)}
                   >
                     <Option key="1">银行转账</Option>
                     <Option key="2">现金支付</Option>
                     <Option key="3">微信支付</Option>
                     <Option key="4">支付宝支付</Option>
                   </Select>
                 </Col>
               </Row>
             </Modal>
         </div>
      </span>
    );
  }

  render() {
    const self = this;

    const columns = [
      {
        title: '客户姓名',
        dataIndex: 'name',
        key: 'name',
        width: '110px',
        render(value, record) {
          return <Link to={{ pathname: `/customer/detail/${record.customer_id}` }} target="_blank">{value}</Link>;
        },
      }, {
        title: '套餐卡名称',
        dataIndex: 'coupon_card_name',
        key: 'coupon_card_name',
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
        title: '开卡日期~到期日期',
        key: 'start_date~expire_data',
        width: '200px',
        render: (value, record) => `${record.start_date}~${record.expire_date}`,
      }, {
        title: '售价',
        dataIndex: 'price',
        key: 'total-price',
        className: 'column-money',
        width: '110px',
        render: (value, record) => (Number(value) + Number(record.discount)).toFixed(2),
      }, {
        title: '实付金额',
        dataIndex: 'price',
        key: 'price',
        className: 'column-money',
        width: '110px',
        render: value => Number(value).toFixed(2),
      }, {
        title: '销售人员',
        key: 'seller_user_name',
        width: '110px',
        render: (text, record) => Number(record.seller_user_id) !== 0
            ? record.seller_user_name
            : '非本店售卡',
      }, {
        title: '销售提成',
        dataIndex: 'sell_bonus_amount',
        key: 'sell_bonus_amount',
        className: 'column-money',
        width: '110px',
        render: value => Number(value).toFixed(2),
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        className: 'center',
        width: '75px',
        render: value => {
          const payStatus = String(value);
          let statusLabel = 'default';

          if (payStatus === '1') {
            statusLabel = 'success';
          }
          return <Badge status={statusLabel} text={text.memberCardSale[value]} />;
        },
      }, {
        title: '操作',
        key: 'operation',
        className: 'center',
        width: '48px',
        render: (text, record) =>
          String(record.status) === '0'
            ? self.content(record)
            : (
              <Link to={{ pathname: `/marketing/membercard/sale-detail/${record._id}` }}>详情</Link>
            )
        ,
      },
    ];
    return this.renderTable(columns);
  }
}

