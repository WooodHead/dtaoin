import React from 'react';
import { Link } from 'react-router-dom';
import { message, Popover, Button, Icon } from 'antd';
import QRCode from 'qrcode.react';

import api from '../../../middleware/api';
import path from '../../../config/path';

export default class AuthPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      hasPermission: false,
      updatePermission: false,
      detail: {},
    };

    this.handleAuthPrepare = this.handleAuthPrepare.bind(this);
    this.handleCheckUpdate = this.handleCheckUpdate.bind(this);
  }

  static defaultProps = {
    size: 'small',
    text: '审核',
  };

  componentDidMount() {
    this.checkPermission(path.warehouse.stocktaking.auth);
    this.handleCheckUpdate();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.updatePermission) {
      this.setState({ updatePermission: nextProps.updatePermission });
    }
  }

  handleAuthPrepare(visible) {
    if (visible) {
      this.interval = setInterval(this.getStocktakingDetail.bind(this, this.props.id), 2000);
    } else {
      clearInterval(this.interval);
    }
    this.setState({ visible });
  }

  async checkPermission(path) {
    const hasPermission = await api.checkPermission(path);
    this.setState({ hasPermission });
  }

  handleCheckUpdate() {
    const { id } = this.props;
    api.ajax({
      url: api.warehouse.stocktaking.checkUpdateAllStockaking(),
      type: 'POST',
      data: { stocktaking_id: id },
    }, () => {
      this.setState({ updatePermission: true });
    }, () => {
      this.setState({ updatePermission: false });
    });
  }

  getStocktakingDetail(id) {
    api.ajax({
      url: api.warehouse.stocktaking.detail(id),
    }, data => {
      const detail = data.res.detail;

      this.setState({ detail });

      if (detail.authorize_user_id.toString() !== '0') {
        clearInterval(this.interval);
        location.href = `/warehouse/stocktaking/auth/${id}`;
      }
    }, err => {
      message.error(`获取详情失败[${err}]`);
      clearInterval(this.interval);
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { id, type, size, text } = this.props;
    const { hasPermission, detail, updatePermission } = this.state;
    const authorizeUserId = detail.authorize_user_id;

    const content = (
      <div className="center">
        <QRCode
          value={JSON.stringify({
            authType: type,
            requestParams: {
              type: 'post',
              url: api.warehouse.stocktaking.auth(),
              data: { stocktaking_id: id },
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
      hasPermission ?
        updatePermission ?
          <span>
         {size === 'default' ?
           <Button type="danger" size={size}><Link
             to={{ pathname: `/warehouse/stocktaking/auth/${id}` }}>{text}</Link></Button> :
           <Link to={{ pathname: `/warehouse/stocktaking/auth/${id}` }}>{text}</Link>
         }
         </span> :
          <span>
          {size === 'default' ?
            <Button type="danger" size={size} onClick={() => message.warn('盘点单信息填写不完整')}>{text}</Button> :
            <a href="javascript:;" onClick={() => message.warn('盘点单信息填写不完整')}>{text}</a>
          }
        </span> :
        <Popover
          content={content}
          title=""
          trigger="click"
          visible={this.state.visible}
          onVisibleChange={this.handleAuthPrepare}
        >
          {size === 'default' ?
            <Button type="danger" size={size}>{text}</Button> :
            <a href="javascript:;">{text}</a>
          }
        </Popover>
    );
  }
}
