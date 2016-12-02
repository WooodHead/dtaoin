import React from 'react'
import {Tabs, Select, Button, Radio, Row, Col, DatePicker} from "antd";
import api from '../../middleware/api'
import text from "../../middleware/text";
import formatter from "../../middleware/formatter";
import SearchBox from "../../components/search/SearchBox";
import BaseList from '../../components/base/BaseList'
import CommentTable from '../../components/tables/comment/CommentTable'

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: props.location.query.page || 1,
      comment_date: '',
      company_id: '',
      company_data: []
    };
    [
      'onChangeTime'
    ].map(method => this[method] = this[method].bind(this))
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      page: nextProps.location.query.page
    });
  }

  componentDidMount() {
    this.getCompanyList();
  }

  getCompanyList() {
    api.ajax({url: api.company.list()}, (data)=> {
      let list = data.res.company_list;
      if (list.length > 0) {
        this.setState({company_data: list});
      } else {
        this.setState({company_data: []});
      }
    })
  }

  handleSelect(value, option) {
    let index = option.props.index;
    let list = this.state.company_data;
    console.log(option.props.children);
    this.setState({value: option.props.children, company_id: list[index]._id});
  }

  handleChange(value) {
    if (!value) {
      this.setState({company_id: ''});
    }
  }

  onChangeTime(value, dateString) {
    this.setState({
      comment_date: dateString
    });
  }

  render() {
    let {
      comment_date,
    } = this.state;

    return (
      <div>
        <h3 className="page-title">评价管理</h3>
        <div>
          <Row className="mb15">
            <Col span="9">
              <label className="margin-right-20">评价时间:</label>
              <DatePicker
                format="yyyy-MM-dd"
                defaultValue={comment_date}
                onChange={this.onChangeTime.bind(this)}
              />
            </Col>
            <Col span="9">
              <label span="6" className="margin-right-20">门店筛选:</label>
              <Select
                span="14"
                style={{ width: '300px' }}
                placeholder="请选择公司"
                allowClear
                size="large"
                onSelect={this.handleSelect.bind(this)}
                onChange={this.handleChange.bind(this)}>
                {this.state.company_data.map((item, index) => <Option key={index} value={item._id}>{item.name}</Option>)}
              </Select>
            </Col>

            <Col span="6">
              <span className="pull-right">
              </span>
            </Col>
          </Row>

          <CommentTable
            source={api.comment.list(this.state)}
            page={this.state.page}
            pathname="/comment/list"
          />
        </div>
      </div>
    )
  }
}
