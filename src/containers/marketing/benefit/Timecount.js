/**
 * Created by mrz on 16-11-24.
 */
import React, {Component} from 'react'
import {Breadcrumb, Icon, Row, Col, Button, Select, DatePicker} from 'antd'
import api from '../../../middleware/api'
import HCSearchSelectBox from '../../../components/base/HCSearchSelectBox'
import TimecountTable from './tables/CountTable'
import {Link} from 'react-router'
import DetailModal from './modals/DetailModal';
import text from '../../../middleware/text'

const Option = Select.Option;
export default class Timecount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      condition: {
        key: '',
        type: 1,
        status: -1,
      }
    };
    [
      'onSearch',
      'handleData',
      'handleSelect',
      'getList',
      'handleChangeStatus',
      'handleUseStatus',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleData(data) {
    this.setState({data: data});
  }

  //当状态变更时候会变换
  handleSelect(value) {
    this.setState({
      condition: Object.assign(this.state.condition, {status: value})
    }, () => {
      this.getList();
    });
  }

  //处理当状态变化时候data数据变化
  handleChangeStatus(index, data) {
    let currentData = this.state.data;
    currentData.splice(index, 1, data);
    this.setState({data: currentData});
  }

  getList() {
    api.ajax({
      url: api.coupon.getCouponList(this.state.condition),
    }, (data) => {
      if(data.code !== 0) {
        message.error(data.msg);
      }else {
        let list = data.res.list ? data.res.list : [];
        this.handleData(list);
      }
    })
  }

  onSearch(key, successHandle, failHandle) {
    let {type, status} = this.state.condition;
    let condition = {key, type, status};
    let url = api.coupon.getCouponList(condition);
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        this.handleData(data.res.list);
        successHandle(data.res.list);
      } else {
        failHandle(data.msg);
      }
    }, (error) => {
      failHandle(error);
    })
  }


  handleUseStatus(index, record) {
    let coupon_item_id = record._id;
    let status = '';
    if (record.status == 0) {
      status = 1;
    } else if (record.status == 1) {
      status = 0;
    }

    api.ajax({
      url: api.coupon.updataCouponStatus(),
      type: 'POST',
      data: {
        coupon_item_id: coupon_item_id,
        status: status,
      }
    }, (data) => {
      if(data.code !== 0) {
        message.error(data.msg);
      }else {
        let list = data.res.detail ? data.res.detail : [];
        this.handleChangeStatus(index, list);
      }
    });
  }

  render() {

    let handleUseStatus = this.handleUseStatus;
    const columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '描述',
      dataIndex: 'remark',
      key: 'remark',
    }, {
      title: '创建日期',
      dataIndex: 'mtime',
      key: 'mtime',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render(value, record) {
        return text.useStatus[record.status];
      }
    }, {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      render(value, record, index) {
        let userStatus = text.useStatus[-(record.status) + 1];
        return (
          <div>
            <Button
              type="dashed"
              size="small"
              onClick={() => handleUseStatus(index, record)}
            >
              {userStatus}
            </Button>
            <DetailModal
              data={record}
            />
          </div>
        )
      }
    }];
    return (
      <div>
        <div className="mb10">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="javascript:history.back();"><Icon type="left"/>营销/优惠管理</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              计次优惠管理
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Row className="mb15">
          <Col span="9">
            <label className="margin-right-20" style={{float: 'left', position: 'relative', top: '5px'}}>搜索:</label>
            <HCSearchSelectBox
              style={{width: 250, float: 'left'}}
              placeholder={'请输入搜索名称'}
              onSearch={this.onSearch}
              displayPattern={(item) => {
                return item.name + '-----' + item.remark;
              }}
              autoSearch={true}
              onSelectItem={(value) => {
                console.log(JSON.stringify(value));
              }}
            />
          </Col>

          <Col span="9">
            <label span="6" className="margin-right-20">状态:</label>
            <Select size="large" defaultValue="-1" onSelect={this.handleSelect} style={{width: 200}}>
              <Option value="-1">全部</Option>
              <Option value="1">停用</Option>
              <Option value="0">启用</Option>
            </Select>
          </Col>

          <Col span="5">
            <span className="pull-right">
              <Button type="primary"
                      size="large">
                <Link to="/marketing/timecount/createTimecount">创建计次</Link>
              </Button>
            </span>
          </Col>
        </Row>

        <TimecountTable
          data={this.state.data}
          handleData={this.handleData}
          handleChangeStatus={this.handleChangeStatus}
          columns={columns}
          type={this.state.condition.type}
        />
      </div>
    )
  }
}