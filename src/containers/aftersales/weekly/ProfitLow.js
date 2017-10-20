import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Form, Input, Button, Table, message, Alert } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

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
    this.getLowGrossProfitIntention(startTime);
  }

  componentWillReceiveProps(nextProps) {
    if (String(nextProps.startTime) !== String(this.props.startTime)) {
      this.getLowGrossProfitIntention(nextProps.startTime);
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
      const Data = detail.length === 0 ? list : detail;
      const submitData = [];

      Data.map((item, index) => {
        submitData.push({ ...item, remark: values[`remark${index}`] });
      });

      const data = {
        start_date: startTime,
        intention_list: JSON.stringify(submitData),
      };

      api.ajax({
        url: api.aftersales.weekly.saveLowGrossProfitIntention(),
        type: 'POST',
        data,
      }, () => {
        message.success('毛利率偏低情况保存成功');
      });
    });
  }

  getLowGrossProfitIntentionDetail(startTime) {
    return new Promise(resolve => {
      api.ajax({ url: api.aftersales.weekly.lowGrossProfitIntentionDetail(startTime) }, data => {
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

  getweekLowGrossProfitIntentionList(startTime) {
    return new Promise(resolve => {
      api.ajax({ url: api.aftersales.weekly.weekLowGrossProfitIntentionList(startTime) }, data => {
        resolve(data.res.list);
      },
      );
    });
  }

  async getLowGrossProfitIntention(startTime) {
    const detail = await this.getLowGrossProfitIntentionDetail(startTime);
    const list = await this.getweekLowGrossProfitIntentionList(startTime);
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
        title: '姓名',
        dataIndex: 'customer_name',
        key: 'customer_name',
      }, {
        title: '车牌号',
        dataIndex: 'auto_plate_num',
        key: 'auto_plate_num',
      }, {
        title: '实收金额',
        dataIndex: 'total_fee',
        key: 'total_fee',
        render: value => Number(value).toFixed(2),
      }, {
        title: '毛利率',
        dataIndex: 'gross_profit_rate',
        key: 'gross_profit_rate',
        render: value => `${(Number(value) * 100).toFixed(2)} %`,
      }];

    const content = (
      showData.map((item, index) => (
          <div key={index}>
            <Row className="mt20">
              <Col span={9}>
                <FormItem label="工单号" {...formItemThree}>
                  <Link to={{ pathname: `/aftersales/project/detail/${item._id}` }} target="_blank">
                    {item._id}
                  </Link>
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

            <Row>
              <Col span={18}>
                <FormItem label="情况说明" {...formItemLg}>
                  {getFieldDecorator(`remark${index}`, {
                    initialValue: item.remark,
                  })(
                    <TextArea rows={1} placeholder="请输入影响报价原因" />,
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

ProfitLow = Form.create()(ProfitLow);
export default ProfitLow;
