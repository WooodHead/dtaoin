import React from 'react';
import { message } from 'antd';

import api from '../../../middleware/api';

export default class Base extends React.Component {

  handlePageChange(page) {
    this.setState({ page });
    this.getStockTakingParts(this.state.id, page);
  }

  handleComplete() {
    location.href = '/warehouse/stocktaking/index';
  }

  handleInputBlur(stocktakingItemId, partId, id, e) {
    const partCount = e.target.value;

    if (!partCount) {
      return;
    }

    const items = [];
    const stocktakingItem = {
      _id: stocktakingItemId,
      real_amount: partCount,
    };

    if (!stocktakingItemId) {
      stocktakingItem.part_id = partId;
    }

    items.push(stocktakingItem);

    api.ajax({
      url: api.warehouse.stocktaking.updateParts(),
      type: 'POST',
      data: {
        stocktaking_id: this.state.id,
        items: JSON.stringify(items),
      },
    }, () => {
      message.info('保存成功！');
      this.handleCheckUpdate(id);
    });
  }

  handleSaveNewParts() {
    const { id, page } = this.state;
    this.getStockTakingParts(id, page);
  }

  handleCheckUpdate(id) {
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
      this.setState({ detail: data.res.detail });
      this.getAllStockTakingParts(data.res.detail._id);
    });
  }

  getStockTakingParts(id, page) {
    this.setState({ isFetching: true });
    api.ajax({
      url: api.warehouse.stocktaking.parts(id, page),
    }, data => {
      this.setState({
        isFetching: false,
        parts: data.res.list,
        total: parseInt(data.res.total),
      });
    });
  }

  getAllStockTakingParts(id) {
    this.setState({ isFetching: true });
    api.ajax({
      url: api.warehouse.stocktaking.parts(id),
    }, data => {
      this.setState({
        isFetching: false,
        partsAll: data.res.list,
        total: parseInt(data.res.total),
      });
    });
  }
}
