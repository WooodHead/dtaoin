import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Button, Row, Col } from 'antd';

import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';
import PrintThisComponent from '../../../components/base/BasePrint';

export default class PrintPayment extends PrintThisComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handlePrint(e) {
    e.preventDefault();
    const userInfo = api.getLoginUser();
    const printInfo = ReactDOM.findDOMNode(this.refs.printProjectOrder);

    this.printThis({
      element: $(printInfo),
      debug: false,                // show the iframe for debugging
      importCSS: true,             // import page CSS
      importStyle: true,          // import style tags
      printContainer: false,        // grab outer container as well as the contents of the selector
      loadCSS: '/dist/print.css',   // path to additional css file - us an array [] for multiple
      pageTitle: `水稻汽车-${  userInfo.companyName  }-客户结算单`,               // add title to print page
      removeInline: false,         // remove all inline styles from print elements
      printDelay: 333,            // variable print delay
      header: `<p style="text-align:center">水稻汽车-${  userInfo.companyName  }-客户结算单</p>`,               // prefix to body
      footer: null,               // suffix to body
      formValues: true,             // preserve input/form values
    });
  }

  renderItem(item) {
    return (
      <Row className="mb5 text-gray" key={item._id}>
        <Col span={6}>{item.item_name}</Col>
        <Col span={6}>{item.time_fee}</Col>
        <Col span={6}>{item.fitter_user_names}</Col>
      </Row>
    );
  }

  renderPart(part) {
    return (
      <Row className="mb5 text-gray" key={part._id}>
        <Col span={3}>{part.part_name}</Col>
        <Col span={3}>{part.part_no}</Col>
        <Col span={3}>{part.part_scope}</Col>
        <Col span={3}>{part.part_brand}</Col>
        <Col span={3}>{part.count}</Col>
        <Col span={3}>{Number(part.price).toFixed(2)}</Col>
        <Col span={3} className="text-right">{Number(part.total).toFixed(2)}</Col>
      </Row>
    );
  }

  render() {
    const { customerInfo, partsDetail } = this.props;
    const userInfo = api.getLoginUser();

    return (
      <div>
        <h3 className="center">水稻汽车-{userInfo.companyName}-配件销售单</h3>
        <Form ref="printProjectOrder" className="mt15">
          <div className="border-ccc">
            <Row className="padding-tb-15 padding-l-10 border-bottom-ccc">
              <Col span={8} className="print-col-8">单号：{customerInfo._id}</Col>
              <Col span={5}>客户姓名：{customerInfo.customer_name}</Col>
              <Col span={5}>联系电话：{customerInfo.customer_phone}</Col>
              <Col span={5}>创建时间：{customerInfo.ctime}</Col>
            </Row>

            <Row className={partsDetail.length > 0 ? 'border-bottom-ccc padding-tb-15 padding-l-10' : 'hide'}>
              <Col span={3}><span className="strong">配件明细：</span></Col>
              <Col span={21}>
                <Row className="mb5">
                  <Col span={3}>名称</Col>
                  <Col span={3}>配件号</Col>
                  <Col span={3}>适用车型</Col>
                  <Col span={3}>品牌</Col>
                  <Col span={3}>数量(个)</Col>
                  <Col span={3}>单价(元)</Col>
                  <Col span={3} className="text-right">金额(元)</Col>
                </Row>
                {partsDetail.map(part => this.renderPart(part))}
              </Col>
            </Row>

            <Row className="border-bottom-ccc padding-tb-15 padding-l-10">
              <Col span={3}><span className="strong">收费：</span></Col>
              <Col span={21}>
                <Row className="mb5">
                  <Col span={3}>结算金额(元)</Col>
                  <Col span={3}>优惠金额(元)</Col>
                  <Col span={3}>应付金额(元)</Col>
                </Row>
                <Row className="mb5">
                  <Col span={3}>{Number(customerInfo.total_amount || 0).toFixed(2)}</Col>
                  <Col span={3}>{Number(customerInfo.discount || 0).toFixed(2)}</Col>
                  <Col span={3}>{Number(customerInfo.real_amount || 0).toFixed(2)}</Col>
                </Row>
              </Col>
            </Row>

            <Row className="padding-tb-15 padding-l-10">
              <Col span={4} offset={16}>客户签字：</Col>
              <Col span={4}>日期：{formatter.day(new Date())}</Col>
            </Row>
          </div>
        </Form>

        <div className="center mt20">
          <Button type="primary" onClick={this.handlePrint.bind(this)}>打印结算单</Button>
        </div>
      </div>
    );
  }
}
