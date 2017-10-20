import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Form, Input, Button, Table, message, Alert } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

class PriceRise extends Component {
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
    this.getPriceRisePurchasePart(startTime);
  }

  componentWillReceiveProps(nextProps) {
    if (String(nextProps.startTime) !== String(this.props.startTime)) {
      this.getPriceRisePurchasePart(nextProps.startTime);
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
        url: api.aftersales.weekly.savePriceRisePurchasePart(),
        type: 'POST',
        data,
      }, () => {
        message.success('比历史进价高情况保存成功');
      });
    });
  }

  getPriceRisePurchasePartDetail(startTime) {
    return new Promise(resolve => {
      api.ajax({ url: api.aftersales.weekly.priceRisePurchasePartDetail(startTime) }, data => {
        let detail = [];
        try {
          detail = !!data.res.list ? JSON.parse(data.res.list) : [];
        } catch (e) {
          detail = !!(data.res.list) ? data.res.list : [];
        }
        resolve(detail);
      },
      );
    });
  }

  getWeekPriceRisePurchasePartList(startTime) {
    return new Promise(resolve => {
      api.ajax({ url: api.aftersales.weekly.weekPriceRisePurchasePartList(startTime) }, data => {
        resolve(data.res.list);
      },
      );
    });
  }

  async getPriceRisePurchasePart(startTime) {
    const detail = await this.getPriceRisePurchasePartDetail(startTime);
    const list = await this.getWeekPriceRisePurchasePartList(startTime);
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
        key: 'name',
        render: value => value && value.name,
      }, {
        title: '配件号',
        dataIndex: 'auto_part_info',
        key: 'part_no',
        render: value => value && value.part_no,
      }, {
        title: '历史最低价',
        dataIndex: 'min_in_price',
        key: 'min_in_price',
        render: value => (!isNaN(Number(value))) && Number(value).toFixed(2),
      }, {
        title: '当前进价',
        dataIndex: 'auto_part_info',
        key: 'in_price',
        render: value => !!value && (!isNaN(Number(value.in_price))) &&
          Number(value.in_price).toFixed(2),
      }];

    const content = (
      (showData.length > 0) && showData.map((item, index) => (
          <div key={index}>
            <Row className="mt20">
              <Col span={9}>
                <FormItem label="采购单号" {...formItemThree}>
                  <Link to={{ pathname: `/warehouse/purchase/detail/${item.purchase_id}` }}
                        target="_blank">
                    {item.purchase_id}
                  </Link>
                </FormItem>
              </Col>
              <Col span={4}>
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
                    <TextArea rows={1} placeholder="请说明因何原因产生价格变动" />,
                  )}
                </FormItem>
              </Col>
            </Row>

            <div className="with-bottom-border mlr-20" />
          </div>
        ))
    );
    return (
      <Form>
        <div className={showData.length > 0 ? '' : 'hide'}>
          {content}
          <Row className="mt20 mb20">
            <Col span={8} offset={3}>
              <Button type="primary" onClick={this.handleSubmit}>提交</Button>
            </Col>
          </Row>
        </div>

        <div className={showData.length > 0 ? 'hide' : 'mt20'}>
          <Alert message="本周没有相关异常" type="success" className="width-250" />
        </div>

      </Form>
    );
  }
}

PriceRise = Form.create()(PriceRise);
export default PriceRise;
