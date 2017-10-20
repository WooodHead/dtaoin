import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Form, Input, Button, Table, message, Alert } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';

const FormItem = Form.Item;

class ProfitLow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showData: [],
    };

    [
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { startTime } = this.props;
    this.getPurchasePart(startTime);
  }

  componentWillReceiveProps(nextProps) {
    if (String(nextProps.startTime) !== String(this.props.startTime)) {
      this.getPurchasePart(nextProps.startTime);
    }
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('输入信息有误，请核实后提交');
        return false;
      }

      const { detail, list } = this.state;
      const { startTime } = this.props;
      const showData = detail.length === 0 ? list : detail;

      const submitData = showData.map((item, index) => {
        item.remark = values[`remark${index}`];
        return item;
      });

      const data = {
        start_date: startTime,
        purchase_item_list: JSON.stringify(submitData),
      };

      api.ajax({
        url: api.aftersales.weekly.saveOverPurchasePart(),
        type: 'POST',
        data,
      }, () => {
        message.success('有库存进货情况保存成功');
      });
    });
  }

  getOverPurchasePartDetail(startTime) {
    return new Promise(resolve => {
      api.ajax({ url: api.aftersales.weekly.overPurchasePartDetail(startTime) }, data => {
        let detail = [];
        try {
          detail = !!data.res.list ? JSON.parse(data.res.list) : [];
        } catch (e) {
          detail = !!data.res.list ? data.res.list : [];
        }
        resolve(detail);
      });
    });
  }

  getWeekOverPurchasePartList(startTime) {
    return new Promise(resolve => {
      api.ajax({ url: api.aftersales.weekly.weekOverPurchasePartList(startTime) }, data => {
        resolve(data.res.list);
      },
      );
    });
  }

  async getPurchasePart(startTime) {
    const detail = await this.getOverPurchasePartDetail(startTime);
    const list = await this.getWeekOverPurchasePartList(startTime);
    this.getShowData(detail, list);
  }

  getShowData(detail, list) {
    const showData = detail;
    list.map(listItem => {
      let bool = false;
      detail.map(detailItem => {
        if (listItem._id === detailItem._id) {
          bool = true;
        }
      });
      if (!bool) {
        showData.push(listItem);
      }
    });

    this.setState({ showData });
  }

  render() {
    const { showData } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { formItemThree, formItemLg } = Layout;

    const columns = [
      {
        title: '配件名',
        dataIndex: 'auto_part_info',
        key: 'auto_part_info_name',
        render: value => value && value.name,
      }, {
        title: '配件号',
        dataIndex: 'auto_part_info',
        key: 'auto_part_info_no',
        render: value => value && value.part_no,
      }, {
        title: '库存数',
        dataIndex: 'auto_part_info',
        key: 'auto_part_info_amount',
        render: value => value && value.amount,
      }, {
        title: '采购数',
        dataIndex: 'remain_amount',
        key: 'remain_amount',
      }];

    const content = (
      (showData.length > 0) && showData.map((item, index) => (
          <Form key={index}>
            <Row className="mt20">
              <Col span={9}>
                <FormItem label="采购单号" {...formItemThree}>
                  <Link to={{ pathname: `/warehouse/purchase/detail/${item.purchase_id}` }}
                        target="_blank">
                    {item.purchase_id}
                  </Link>
                </FormItem>
              </Col>
              <Col span={9}>
                <label className="label">供应商</label>
                <span>{item.supplier_info && item.supplier_info.supplier_company}</span>
              </Col>
            </Row>

            <Row className="mt20">
              <Col span={18}>
                <FormItem label="配件" {...formItemLg}>
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

            <Row>
              <Col span={18}>
                <FormItem label="情况说明" {...formItemLg}>
                  {getFieldDecorator(`remark${index}`, {
                    initialValue: item.remark,
                  })(
                    <Input type="textarea" rows={1} placeholder="请说明进货原因" />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        ))
    );
    return (
      <span>
        <div className={showData.length > 0 ? '' : 'hide'}>
          {content}
          <Row className="mt20">
            <Col span={8} offset={3}>
              <Button type="primary" onClick={this.handleSubmit}>提交</Button>
            </Col>
          </Row>
        </div>

        <div className={showData.length > 0 ? 'hide' : 'mt20'}>
          <Alert message="本周没有相关异常" type="success" className="width-250" />
        </div>

      </span>
    );
  }
}

ProfitLow = Form.create()(ProfitLow);
export default ProfitLow;
