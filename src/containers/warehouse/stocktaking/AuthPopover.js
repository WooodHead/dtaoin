import React from 'react';
import {message, Popover, Button, Icon} from 'antd';
import QRCode from 'qrcode.react';

import api from '../../../middleware/api';

export default class AuthPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      detail: {},
    };

    this.handleAuthPrepare = this.handleAuthPrepare.bind(this);
  }

  static defaultProps = {
    size: 'small',
    text: '审核',
  };

  handleAuthPrepare(visible) {
    if (visible) {
      this.interval = setInterval(this.getStocktakingDetail.bind(this, this.props.id), 2000);
    } else {
      clearInterval(this.interval);
    }
    this.setState({visible});
  }

  getStocktakingDetail(id) {
    api.ajax({
      url: api.warehouse.stocktaking.detail(id),
    }, (data) => {
      let detail = data.res.detail;

      this.setState({detail: detail});

      if (detail.authorize_user_id.toString() !== '0') {
        clearInterval(this.interval);
        location.href = `/warehouse/stocktaking/auth?id=${id}`;
      }
    }, (err) => {
      message.error(`获取详情失败[${err}]`);
      clearInterval(this.interval);
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let {id, type} = this.props;
    let authorizeUserId = this.state.detail.authorize_user_id;

    const content = (
      <div className="center">
        <QRCode
          value={JSON.stringify({
            authType: type,
            requestParams: {
              type: 'post',
              url: api.warehouse.stocktaking.auth(),
              data: {stocktaking_id: id},
            },
          })}
          size={128}
          ref="qrCode"
        />
        <p>请扫码确认</p>
        <p>查看完整盘点单</p>
        <p>
          <Icon
            type="check-circle"
            className={(authorizeUserId && authorizeUserId !== '0') ? 'confirm-check' : 'hide'}
          />
        </p>
      </div>
    );

    return (
      <Popover
        content={content}
        title=""
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleAuthPrepare}
      >
        <Button
          className="btn-action-small"
          size={this.props.size}
        >
          {this.props.text}
        </Button>
      </Popover>
    );
  }
}