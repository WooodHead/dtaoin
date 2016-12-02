import React from 'react'
import {Button} from 'antd'
import api from '../../middleware/api'
import BaseList from '../../components/base/BaseList'

import AdvertTable from '../../components/tables/advert/AdvertTable'

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: props.location.query.page || 1,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.query.page !== nextProps.location.query.page) {
      this.setState({
        page: nextProps.location.query.page
      });
    }
  }

  render() {
    return (
      <div>
        <h3 className="page-title">广告管理</h3>
        <AdvertTable
          source={api.advert.list(this.state)}
          page={this.state.page}
          pathname="/advert/list"
        />
      </div>
    )
  }
}
