import React from 'react';
import { Link } from 'react-router-dom';
import { message, Alert, Modal, Icon, Row, Col, Table, Form, Input, Select, Badge } from 'antd';
import QRCode from 'qrcode.react';
import classNames from 'classnames';

import BaseModal from '../../../components/base/BaseModal';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';

const FormItem = Form.Item;
const Option = Select.Option;

class Clearing extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      itemMap: new Map(),
      unpayTotal: 0,
      purchaseIds: [],
      rejectIds: [],
      purchaseMap: new Map(),
      rejectMap: new Map(),
    };

    [
      'handlePreparePay',
      'closeModal',
      'handlePayWorthChange',
      'handleRowSelectionChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handlePreparePay() {
    const { supplierId } = this.props;
    this.getUnPayList(supplierId);

    this.interval = setInterval(this.checkPayStatus.bind(this, supplierId), 2000);
    this.showModal();
  }

  closeModal() {
    this.props.form.resetFields();
    this.hideModal();
    clearInterval(this.interval);
  }

  handleRowSelectionChange(selectedRowKeys) {
    this.calculateSelectPayTotal(selectedRowKeys);
  }

  handlePayWorthChange(e) {
    const { unpayTotal } = this.state;
    const payWorth = e.target.value;

    if (payWorth < 0) {
      message.warning('应付金额不能小于0');
    } else if (payWorth && payWorth > parseFloat(unpayTotal)) {
      message.warning('付款金额不能大于应付金额');
    }
  }

  calculateSelectPayTotal(selectedIds) {
    const { itemMap } = this.state;

    let unpayTotal = 0;
    let purchaseIds = [], rejectIds = [];
    let purchaseMap = new Map(), rejectMap = new Map();

    itemMap.forEach(item => {
      const itemId = item._id;
      if (selectedIds.indexOf(itemId) > -1) {
        if (item.type) {
          unpayTotal += parseFloat(item.unpay_worth);
          purchaseIds.push(itemId);
          purchaseMap.set(itemId, item);
        } else {
          unpayTotal -= parseFloat(item.unreceive_worth);
          rejectIds.push(itemId);
          rejectMap.set(itemId, item);
        }
      }
    });

    this.setState({
      unpayTotal: Number(unpayTotal).toFixed(2),
      purchaseIds,
      rejectIds,
      purchaseMap,
      rejectMap,
    });
  }

  calculateUnPayTotal(items) {
    let total = 0;
    items.forEach(item => item.type
      ? total += parseFloat(item.unpay_worth)
      : total -= parseFloat(item.unreceive_worth));
    return total;
  }

  // 计算退货单支付金额
  // calculateSelectRejectTotal(items) {
  //   let rejectTotal = 0;
  //   items.forEach(item => {
  //     if (!item.type) {
  //       rejectTotal += parseFloat(item.unreceive_worth);
  //     }
  //   });
  //   return rejectTotal;
  // }

  /**
   * 通过比较采购单/退货单列表中最早的单(列表中id最小)的支付状态或支付金额来判断是否支付成功
   */
  checkPayStatus() {
    const { purchaseIds, rejectIds, purchaseMap, rejectMap } = this.state;

    const orderedPurchaseIds = purchaseIds.sort();
    const orderedRejectIds = rejectIds.sort();

    if (purchaseIds.length > 0) {
      this.checkPayPurchaseStatus(purchaseMap.get(orderedPurchaseIds[0]));
    }
    if (rejectIds.length > 0) {
      this.checkPayRejectStatus(rejectMap.get(orderedRejectIds[0]));
    }
  }

  checkPayPurchaseStatus(purchaseItem) {
    api.ajax({ url: api.warehouse.purchase.detail(purchaseItem._id) }, data => {
      const { detail } = data.res;
      if (String(detail.pay_status) === '2' ||
        parseFloat(detail.unpay_worth) < parseFloat(purchaseItem.unpay_worth)) {
        this.paySuccess();
      }
    });
  }

  checkPayRejectStatus(rejectItem) {
    api.ajax({ url: api.warehouse.reject.detail(rejectItem._id) }, data => {
      const { detail } = data.res;
      if (String(detail.pay_status) === '2' ||
        parseFloat(detail.unpay_worth) < parseFloat(rejectItem.unreceive_worth)) {
        this.paySuccess();
      }
    });
  }

  paySuccess() {
    message.success('支付成功');
    setTimeout(() => {
      this.closeModal();
      location.reload();
    }, 1000);
  }

  getUnPayList(supplierId) {
    this.getUnPayPurchases(supplierId, 1); // 挂账
    this.getUnPayRejects(supplierId, 1);   // 挂账

    this.getUnPayPurchases(supplierId, '0'); // 未结算
    this.getUnPayRejects(supplierId, '0'); // 未结算
  }

  getUnPayPurchases(supplierId, payStatus) {
    api.ajax({ url: api.warehouse.purchase.getAllBySupplierAndPayStatus(supplierId, payStatus) }, data => {
      const { itemMap } = this.state;
      const { list } = data.res;

      list.map(item => itemMap.set(item._id, item));
      this.setState({ itemMap });
    });
  }

  getUnPayRejects(supplierId, payStatus) {
    api.ajax({ url: api.warehouse.reject.getAllBySupplierAndPayStatus(supplierId, payStatus) }, data => {
      const { itemMap } = this.state;
      const { list } = data.res;

      list.map(item => itemMap.set(item._id, item));
      this.setState({ itemMap });
    });
  }

  render() {
    const { visible, itemMap, unpayTotal, purchaseIds, rejectIds } = this.state;
    const { formItemThree, selectStyle } = Layout;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const items = Array.from(itemMap.values());
    const unPayTotal = this.calculateUnPayTotal(items);

    const payInfoContainer = classNames({
      hide: parseFloat(unpayTotal) === 0,
    });

    const payWorth = parseFloat(getFieldValue('pay_worth')) || 0;
    const qrCodeContainer = classNames({
      center: true,
      hide: unPayTotal <= 0 || unpayTotal < payWorth || !getFieldValue('pay_worth') ||
      payWorth <= 0,
    });

    const columns = [
      {
        title: '单号',
        dataIndex: '_id',
        key: '_id',
        className: 'center',
      }, {
        title: '开单时间',
        dataIndex: 'ctime',
        key: 'ctime',
        className: 'center',
      }, {
        title: '出入库时间',
        dataIndex: 'arrival_time',
        key: 'arrival_or_export_time',
        className: 'center',
        render: (value, record) => record.type ? value : record.export_time,
      }, {
        title: '单据',
        dataIndex: '_id',
        key: 'item_type',
        className: 'center',
        render: (value, record) => record.type ? <Badge status="success" text="采购" /> :
            <Badge status="error" text="退货" />,
      }, {
        title: '账单金额(元)',
        dataIndex: 'worth',
        key: 'worth',
        className: 'text-right',
        render: (value, record) => record.type ? value : record.new_worth,
      }, {
        title: '实付金额(元)',
        dataIndex: 'unpay_worth',
        key: 'unpay_worth',
        className: 'text-right',
        render: (value, record) => record.type ? Number(record.worth - record.unpay_worth).
          toFixed(2) : Number(record.new_worth - record.unreceive_worth).toFixed(2),
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        render: (id, record) => {
          const path = record.type ? 'purchase' : 'purchase-reject';
          return <Link to={{ pathname: `/warehouse/${path}/detail/${id}` }}
                       target="_blank">查看详情</Link>;
        },
      },
    ];

    const rowSelection = {
      onChange: this.handleRowSelectionChange,
    };

    return (
      <span>
        <a href="javascript:" onClick={this.handlePreparePay}>结算</a>

        <Modal
          title={<span><Icon type="calculator" /> 供应商货款结算</span>}
          visible={visible}
          width={960}
          onCancel={this.closeModal}
          onOk={this.handleSubmit}
          footer={null}
        >
          <Alert message="请勾选要结算的采购/退货单，并扫码确认付款" className="mb10" type="info" showIcon />

          <Table
            rowSelection={rowSelection}
            dataSource={items}
            columns={columns}
            size="middle"
            bordered
            pagination={false}
            rowKey={record => record._id}
            className="mb15"
            footer={() => (
              <Row>
                <Col span={24}>
                  <span className="pull-right">合计: {Number(unPayTotal > 0 ? unpayTotal : 0).
                    toFixed(2)}元</span>
                </Col>
              </Row>
            )}
          />

          <Row className={payInfoContainer}>
            <Col span={12}>
              <Form>
                <FormItem label="应付金额" {...formItemThree}>
                  <p>{unpayTotal > 0 ? unpayTotal : 0}元</p>
                </FormItem>

                <FormItem label="实付金额" {...formItemThree}>
                  {getFieldDecorator('pay_worth', {
                    onChange: this.handlePayWorthChange,
                  })(
                    <Input
                      type="number"
                      addonAfter="元"
                      placeholder="填写实付金额"
                      disabled={unpayTotal <= 0}
                    />,
                  )}
                </FormItem>

                <FormItem label="支付方式" {...formItemThree}>
                  {getFieldDecorator('pay_type', { initialValue: '2' })(
                    <Select {...selectStyle} disabled={unpayTotal <= 0}>
                      <Option key="1">银行转账</Option>
                      <Option key="2">现金支付</Option>
                      <Option key="3">微信支付</Option>
                      <Option key="4">支付宝支付</Option>
                    </Select>,
                  )}
                </FormItem>
              </Form>
            </Col>

            <Col span={12} className={qrCodeContainer}>
              <QRCode
                value={JSON.stringify({
                  authType: 'supplier_pay',
                  requestParams: {
                    type: 'post',
                    url: api.warehouse.supplier.pay(),
                    data: {
                      purchase_ids: purchaseIds.toString(),
                      reject_ids: rejectIds.toString(),
                      pay_worth: getFieldValue('pay_worth'),
                      pay_type: getFieldValue('pay_type'),
                    },
                  },
                })}
                size={128}
                ref="qrCode"
              />
                <p>请扫码确认该批单据结算</p>
            </Col>
          </Row>
        </Modal>
      </span>
    );
  }
}

Clearing = Form.create()(Clearing);
export default Clearing;
