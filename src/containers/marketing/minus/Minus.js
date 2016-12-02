/**
 * Created by mrz on 16-11-24.
 */
import React, {Component} from 'react'
import {Breadcrumb, Icon, Row, Col, Button, Select, DatePicker} from 'antd'
import api from '../../../middleware/api'
import SearchBox from './SearchBox'
// import CreateTimecoutModal from './CreateTimecout'
import MinusTable from './MinusTable'
import {Link} from 'react-router'

const Option = Select.Option;
export default class Timecount extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="mb10">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="javascript:history.back();"><Icon type="left"/>营销/优惠管理</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              立减优惠管理
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Row className="mb15">
          <Col span="9">
            <label className="margin-right-20">搜索:</label>
            <SearchBox
              api={api.searchAutoPotentialCustomerList()}
              change={this.handleSearchChange}
              style={{width: 250}}
            />
            <Button type="primary"
                    className="margin-left-20">
              搜索
            </Button>
          </Col>
          <Col span="9">
            <label span="6" className="margin-right-20">状态:</label>
            <Select size="large" defaultValue="do" style={{width: 200}}>
              <Option value="all">全部</Option>
              <Option value="do">启用</Option>
              <Option value="undo">停用</Option>
            </Select>
          </Col>
          <Col span="5">
                        <span className="pull-right">
                            <Button type="primary"
                                    size="large">
                                <Link to="/marketing/minus/createMinus">创建立减</Link>
                            </Button>
                         </span>
          </Col>
        </Row>

        <MinusTable />
      </div>
    )
  }
}