import React from 'react';
import { Link } from 'react-router-dom';
import { Popover, Button } from 'antd';
import QRCode from 'qrcode.react';

import api from '../../../middleware/api';
import path from '../../../config/path';

export default class AuthPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      hasPermission: false,
    };

    this.handleAuthPrepare = this.handleAuthPrepare.bind(this);
  }

  componentDidMount() {
    this.getIsAuthorization();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleAuthPrepare(visible) {
    const { detail } = this.props;
    if (visible) {
      this.interval = setInterval(this.getDealDetail.bind(this, detail._id), 2000);
    } else {
      clearInterval(this.interval);
    }
    this.setState({ visible });
  }

  getDealDetail(id) {
    api.ajax({
      url: api.presales.getAutoPurchaseDetail(id),
    }, () => {
      clearInterval(this.interval);
      // location.href = `/presales/deal/clearing?id=${this.props.detail._id}`;
      window.open(`/presales/deal/clearing?id=${this.props.detail._id}`, '_black');
    }, () => {
      // message.error(`授权失败[${err}]`);
      // clearInterval(this.interval);
    });
  }

  async getIsAuthorization() {
    const hasPermission = await api.checkPermission(path.deal.calculatedReturn);
    this.setState({ hasPermission });
  }

  render() {
    const { detail, size } = this.props;

    const content = (
      <div className="center">
        <QRCode
          value={JSON.stringify({
            authType: 'presales_clearing',
            requestParams: {
              type: 'get',
              url: api.presales.deal.auth(detail._id),
            },
          })}
          size={128}
          ref="qrCode"
        />
        <p>请扫码授权</p>
      </div>
    );

    return (
      <span>
        {
          this.state.hasPermission ? <span>
              {
                size === 'small' ? <Link
                  to={{ pathname: `/presales/deal/clearing/${this.props.detail._id}` }}
                  target="_blank"
                >
                  {String(detail.pay_status) === '1' ? '查看收益' : '计算收益'}
                </Link> : <Link
                  to={{ pathname: `/presales/deal/clearing/${this.props.detail._id}` }}
                  target="_blank"
                >
                  <Button type="primary">{String(detail.pay_status) === '1'
                    ? '查看收益'
                    : '计算收益'}</Button>
                </Link>
              }
            </span>
            : <Popover
              content={content}
              title=""
              trigger="click"
              visible={this.state.visible}
              onVisibleChange={this.handleAuthPrepare}
            >
              {
                size === 'small' ?
                  <a href="javascript:;">{String(detail.pay_status) === '1' ? '查看收益' : '计算收益'}</a> :
                  <Button type="primary">{String(detail.pay_status) === '1'
                    ? '查看收益'
                    : '计算收益'}</Button>
              }
            </Popover>
        }
      </span>
    );
  }
}
