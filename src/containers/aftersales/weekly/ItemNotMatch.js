import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Table, Icon, message } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';

const FormItem = Form.Item;
const Search = Input.Search;
const TextArea = Input.TextArea;

export default class ItemNotMatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: [{ intention_id: '', remark: '' }],
    };

    [
      'handleSearchChange',
      'handleInputChange',
      'handleItemDelete',
      'handleItemAdd',
      'handleSubmit',
      'getInvalidItemPartIntentionDetail',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { startTime } = this.props;
    this.getInvalidItemPartIntentionDetail(startTime);
  }

  componentWillReceiveProps(nextProps) {
    if (String(nextProps.startTime) !== String(this.props.startTime)) {
      this.getInvalidItemPartIntentionDetail(nextProps.startTime);
    }
  }

  handleSearchChange(e, index) {
    const { detail } = this.state;
    const key = e.target.value;
    detail[index].intention_id = key;
    this.setState({ detail });

    if (key.length > 16) {
      api.ajax({ url: api.aftersales.project.list({ key }) }, data => {
        const { list } = data.res;
        if (!!(list[0])) {
          detail[index] = list[0];
          detail[index].intention_id = list[0]._id;
          this.setState({ detail });
        }
      });
    }
  }

  handleInputChange(e, index) {
    const key = e.target.value;
    const { detail } = this.state;

    detail[index].remark = key;
    this.setState({ detail });
  }

  handleItemDelete(index) {
    const { detail } = this.state;

    detail.splice(index, 1);
    this.setState({ detail });
  }

  handleItemAdd() {
    const { detail } = this.state;

    detail.push({ intention_id: '', remark: '' });
    this.setState({ detail });
  }

  getInvalidItemPartIntentionDetail(startTime) {
    api.ajax({ url: api.aftersales.weekly.invalidItemPartIntentionDetail(startTime) }, data => {
      let list = [];
      try {
        list = !!data.res.list ? JSON.parse(data.res.list) : [];
      } catch (e) {
        list = !!data.res.list ? data.res.list : [];
      }

      const detail = [];
      if (list.length > 0) {
        list.map((item, index) => {
          api.ajax({ url: api.aftersales.project.list({ key: item.intention_id }) }, data => {
            const { list } = data.res;
            if (!!(list[0])) {
              detail[index] = list[0];
              detail[index].intention_id = list[0]._id;
              detail[index].remark = item.remark;
            }
            this.setState({ detail });
          });
        });
      } else {
        const detail = [{ intention_id: '', remark: '' }];
        this.setState({ detail });
      }
    },
    );
  }

  handleSubmit() {
    const { detail } = this.state;
    const { startTime } = this.props;
    const submitData = [];

    detail.map(item => {
      submitData.push({ ...item });
    });

    const data = {
      start_date: startTime,
      intention_list: JSON.stringify(submitData),
    };

    api.ajax({
      url: api.aftersales.weekly.saveInvalidItemPartIntention(),
      type: 'POST',
      data,
    }, () => {
      message.success('配件与项目不符情况保存成功');
    });
  }

  render() {
    const { detail } = this.state;
    const { formItemThree, formItemLg } = Layout;

    const columns = [
      {
        title: '姓名',
        dataIndex: 'customer_name',
        key: 'customer_name',
      }, {
        title: '车牌号',
        dataIndex: 'auto_plate_num',
        key: 'auto_plate_num',
      }, {
        title: '维修项目',
        dataIndex: 'item_names',
        key: 'item_names',
        render: value => !!value ? value : '--',
      }, {
        title: '维修配件',
        dataIndex: 'part_names',
        key: 'part_names',
        render: value => !!value ? value : '--',
      }];

    const content = (
      (detail.length > 0) && detail.map((item, index) => (
          <div key={`${item.id}${index}` }>
            <Row className="mt20">
              <Col span={9}>
                <FormItem label="工单号" {...formItemThree}>
                  <Search
                    onChange={e => this.handleSearchChange(e, index)}
                    size="large"
                    style={{ width: 250 }}
                    placeholder="请输入工单号、车牌号、电话搜索"
                    value={item.intention_id}
                  />
                </FormItem>
              </Col>
            </Row>

            <Row className="mt20">
              <Col span={18}>
                <FormItem label="工单" {...formItemLg}>
                  <Table
                    columns={columns}
                    dataSource={[item]}
                    pagination={false}
                    size="middle"
                    rowKey={() => index}
                  />
                </FormItem>
              </Col>
            </Row>

            <Row className="mt20">
              <Col span={18}>
                <FormItem label="情况说明" {...formItemLg}>
                  <TextArea
                    onChange={e => this.handleInputChange(e, index)}
                    value={item.remark}
                    rows={1}
                    placeholder="请输入"
                  />
                </FormItem>
              </Col>

              <Col span={3}>
                <Icon
                  type="delete"
                  className="dynamic-delete-button ml20"
                  onClick={() => this.handleItemDelete(index)}
                />
              </Col>

            </Row>

            <div className="with-bottom-border mlr-20" />
          </div>
        ))
    );
    return (
      <span>
        { content }
        <Row className="add-bottom-line">
          <a href="javascript:;" onClick={this.handleItemAdd}>
            <Icon type="plus" className="mr20 ml20" />新增一条
          </a>
        </Row>
        <Row className="mt20 mb20">
          <Col span={8} offset={3}>
            <Button type="primary" onClick={this.handleSubmit}>提交</Button>
          </Col>
        </Row>
      </span>
    );
  }
}
