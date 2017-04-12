import React from 'react';
import {Link} from 'react-router';
import {message, Modal, Button, Row, Col, Select} from 'antd';

import api from '../../../middleware/api';

import BaseTable from '../../../components/base/BaseTable';

const confirm = Modal.confirm;
const Option = Select.Option;

export default class TableSaleLogs extends BaseTable {

  showModal() {
    this.setState({visible: true});
  }

  hideModal() {
    this.setState({visible: false});
  }

  handleSelectChange(payType) {
    this.setState({payType});
  }

  //支付某一订单
  handlePayMemberOrder(memberCardOrder, payType) {
    const isPosDevice = api.getLoginUser().isPosDevice;
    let timer = isPosDevice == 0 ? 200 : 2000;

    let url = api.coupon.payMemberOrder();
    let data = {
      customer_member_order_id: memberCardOrder._id,
      pay_type: payType,
    };

    this.setState({btnLoading: true});

    api.ajax({url, data, type: 'POST'}, () => {
      this.props.updateState({page: 1});
      !!payType ?
        window.time = setInterval(() => {
          api.ajax({url: api.coupon.getMemberOrderDetail(memberCardOrder._id)}, data => {
            if (Number(data.res.detail.status) === 1) {
              window.clearInterval(window.time);

              this.setState({btnLoading: false});
              message.success('结算成功!');
              window.location.reload();
            }
          });
        }, Number(timer)) :
        confirm({
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
    }, (error) => {
      message.error(error);
    });
  }

  content(record) {
    const isPosDevice = api.getLoginUser().isPosDevice;
    let {visible, btnLoading} = this.state;

    let footer = [
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
                     style={{width: '150px'}}
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
    let self = this;

    let columns = [
      {
        title: '卡号',
        dataIndex: 'member_card_number',
        key: 'member_card_number',
      }, {
        title: '客户姓名 性别',
        key: 'name_gender',
        render: (text, record) => {
          return (
            <Link to={{pathname: '/customer/detail', query: {customerId: record.customer_id}}}>
              {record.name} {record.gender == '1' ? '先生' : record.gender == '0' ? '女士' : ''}
            </Link>
          );
        },
      }, {
        title: '手机',
        dataIndex: 'phone',
        key: 'phone',
      }, {
        title: '会员卡名称',
        dataIndex: 'member_card_name',
        key: 'member_card_name',
      }, {
        title: '开卡日期',
        dataIndex: 'member_start_date',
        key: 'member_start_date',
      }, {
        title: '到期日期',
        dataIndex: 'member_expire_date',
        key: 'member_expire_date',
      }, {
        title: '售价(元)',
        dataIndex: 'original_price',
        key: 'original_price',
        className: 'column-money',
        render: text => `${Number(text).toFixed(2)}`,
      }, {
        title: '实付金额(元)',
        dataIndex: 'price',
        key: 'price',
        className: 'column-money',
        render: text => `${Number(text).toFixed(2)}`,
      }, {
        title: '销售人员',
        key: 'seller_user_name',
        render: (text, record) => {
          return Number(record.seller_user_id) !== 0
            ?
            record.seller_user_name
            :
            '非本店售卡';
        },
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '操作',
        key: 'operation',
        className: 'center',
        render: (text, record) =>
          String(record.status) === '0'
            ?
            self.content(record)
            :
            <span>已结算</span>
        ,
      },
    ];
    return this.renderTable(columns);

  }
}

