import React from 'react';
import { Modal, Icon, Button, message } from 'antd';
import BaseModal from '../../../components/base/BaseModal';
import PrintPayment from './PrintPayment';

import api from '../../../middleware/api';

export default class PrintPaymentModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      auto: {},
      items: new Map(),
      parts: new Map(),
    };
    [
      'handleSettlement',
      'getMaintainItemList',
      'getMaintainPartList',
      'getUserAuto',
    ].map(method => this[method] = this[method].bind(this));
  }

  onSuccess(data) {
    this.props.onSuccess(data);
    this.hideModal();
  }

  hideModal() {
    const { isReload } = this.props;
    isReload && location.reload();
    this.setState({ visible: false });
  }

  showModal() {
    this.setState({ visible: true });
    const { project, items, parts } = this.props;

    if (!!items) {
      this.setState({ items, parts });
    } else {
      this.getMaintainItemList(project._id);
      this.getMaintainPartList(project._id);
    }

    this.getUserAuto(project.customer_id, project.auto_id);
  }

  handleSettlement() {
    const { project, payMethod, items, parts } = this.props;

    const payTypeList = [];
    payMethod.map(item => {
      payTypeList.push({ pay_type: item.method, amount: item.money });
    });

    const data = {
      _id: project._id,
      customer_id: project.customer_id,
      pay_type_list: JSON.stringify(payTypeList),
    };
    api.ajax({
      url: api.aftersales.maintainIntentionPayByHand(),
      type: 'POST',
      data,
    }, () => {
      message.success('结算成功');
      this.showModal();
    }, err => {
      message.error(err);
    },
    );

    if (!!items) {
      this.setState({ items, parts });
    } else {
      this.getMaintainItemList(project._id);
      this.getMaintainPartList(project._id);
    }
  }

  getMaintainItemList(intention_id = '') {
    api.ajax({ url: api.aftersales.getItemListOfMaintProj(intention_id) }, data => {
      const items = new Map();
      for (let i = 0; i < data.res.list.length; i++) {
        items.set(data.res.list[i].item_id, data.res.list[i]);
      }
      this.setState({ items });
    });
  }

  getMaintainPartList(intention_id = '') {
    api.ajax({ url: api.aftersales.getPartListOfMaintProj(intention_id) }, data => {
      const parts = new Map();
      for (let i = 0; i < data.res.list.length; i++) {
        parts.set(data.res.list[i].part_type_id, data.res.list[i]);
      }
      this.setState({ parts });
    });
  }

  getUserAuto(customer_id, auto_id) {
    api.ajax({ url: api.auto.detail(customer_id, auto_id) }, data => {
      this.setState({ auto: data.res.detail });
    });
  }

  render() {
    const {
      project,
      customer,
      materialFee,
      timeFee,
      realTotalFee,
      type,
    } = this.props;

    const { items, parts, auto } = this.state;

    return (
      <div className="inline-block">
        {
          type === 'button'
            ? <Button className="ml10" onClick={this.handleSettlement}>结算并打印结算单</Button>
            : <p onClick={this.showModal}>打印结算单</p>
        }

        <Modal
          title={<span><Icon type="file" /> 结算单预览</span>}
          visible={this.state.visible}
          width="980px"
          onCancel={this.hideModal}
          footer={null}
        >
          <PrintPayment
            project={project}
            customer={customer}
            auto={auto}
            itemMap={items}
            partMap={parts}
            timeFee={timeFee}
            materialFee={materialFee}
            realTotalFee={realTotalFee}
          />
        </Modal>
      </div>
    );
  }
}
