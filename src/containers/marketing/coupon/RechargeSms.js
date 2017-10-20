import React from 'react';
import { Link } from 'react-router-dom';

import { Modal, Button } from 'antd';
import BaseModal from '../../../components/base/BaseModal';

require('../sms-manage.less');

export default class Recharge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    [
      'hideModal',
    ].map(method => this[method] = this[method].bind(this));
  }

  hideModal() {
    this.props.hideRechargeSms();
  }

  render() {
    const { visible, smsRemain } = this.props;

    return (
      <span>
        <Modal
          title={null}
          visible={visible}
          onCancel={this.hideModal}
          width={336}
          footer={null}
          style={{ marginTop: '12%' }}
        >
          <h3>短信余额不足</h3>
          <p
            className="mb20 font-size-12 mt20"
            style={{ color: 'rgba(0, 0, 0, 0.65)', lineHeight: '18px' }}
          >
            您门店的当前短信余额为 <span style={{ color: '#f6af38' }}>{smsRemain}</span> 条，不足以支持发送短信至您选择的所有客户，为保证短信正常发放，请先充值短信余额。
          </p>

          <div className="clearfix">
            <Link to={{ pathname: `/marketing/sms-manage/${'2'}` }} target="_blank">
              <Button
                type="primary"
                className="pull-right ml10"
                size="default"
                onClick={this.hideModal}
              >
                立即充值
              </Button>
            </Link>
            <Button className="pull-right" size="default" onClick={this.hideModal}>取消</Button>
          </div>

        </Modal>
      </span>
    );
  }
}
