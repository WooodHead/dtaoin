import React from 'react';
import ReactDOM from 'react-dom';
import {Form, Button, Row, Col} from 'antd';
import text from '../../../config/text';
import formatter from '../../../utils/DateFormatter';
import PrintThisComponent from '../../base/BasePrint';

export default class ProjectPrintPay extends PrintThisComponent {
  constructor(props) {
    super(props);
    this.state = {
      project: this.props.project ? this.props.project : {},
      customer: this.props.customer ? this.props.customer : {},
      auto: this.props.auto ? this.props.auto : {},
      items: this.props.items ? this.props.items : [],
      parts: this.props.parts ? this.props.parts : [],
      timeFee: 0,
      totalFee: 0,
    };
  }

  handlePrint(e) {
    e.preventDefault();
    let USER_SESSION = sessionStorage.getItem('USER_SESSION');
    USER_SESSION = USER_SESSION ? JSON.parse(USER_SESSION) : {};

    let printInfo = ReactDOM.findDOMNode(this.refs.printProjectOrder);

    this.printThis({
      element: $(printInfo),
      debug: false,                //show the iframe for debugging
      importCSS: true,             //import page CSS
      importStyle: true,          //import style tags
      printContainer: false,        //grab outer container as well as the contents of the selector
      loadCSS: '/app/dist/print.css',   //path to additional css file - us an array [] for multiple
      pageTitle: USER_SESSION.brand_name + '-' + USER_SESSION.company_name + '-客户结算单',               //add title to print page
      removeInline: false,         //remove all inline styles from print elements
      printDelay: 333,            // variable print delay
      header: '<h2 style="text-align:center">' + USER_SESSION.brand_name + '-' + USER_SESSION.company_name + '-客户结算单</h2>',               // prefix to body
      footer: null,               // suffix to body
      formValues: true,             //preserve input/form values
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
        <Col span={6}>{part.part_name}</Col>
        <Col span={6}>{part.count}</Col>
        <Col span={6}>{(Number(part.material_fee) || 0) / (Number(part.count) || 0) || 0}</Col>
        <Col span={4} className="text-right">{part.material_fee}</Col>
      </Row>
    );
  }

  render() {
    const {project, customer, auto} = this.state;
    let USER_SESSION = sessionStorage.getItem('USER_SESSION');
    USER_SESSION = USER_SESSION ? JSON.parse(USER_SESSION) : {};
    let items = [];
    for (let value of this.state.items.values()) {
      items.push(value);
    }
    let parts = [];
    for (let value of this.state.parts.values()) {
      parts.push(value);
    }

    return (
      <div>
        <h3 className="center">{USER_SESSION.brand_name}-{USER_SESSION.company_name}-客户结算单</h3>
        <Form horizontal ref="printProjectOrder" className="mt15">
          <div className="border-ccc">
            <Row className="padding-tb-15 padding-l-10">
              <Col span={8} className="print-col-8">工单编号：{project._id}</Col>
              <Col span={5}>接待顾问：{USER_SESSION.name}</Col>
              <Col span={5}>是否事故车：{text.isOrNot[project.is_accident]}</Col>
              <Col span={5}>进厂时间：{formatter.day(project.start_time)}</Col>
            </Row>

            <Row
              className={project.is_accident === '1' ? 'padding-bottom-15 padding-l-10' : 'border-bottom-ccc padding-bottom-15 padding-l-10'}>
              <Col span={8}>联系方式：{customer.phone}</Col>
              <Col span={5}>客户姓名：{customer.name}</Col>
              <Col span={5}>车牌号：{auto.plate_num}</Col>
              <Col span={5}>公里数：{project.mileage}公里</Col>
            </Row>

            <Row className="border-bottom-ccc padding-tb-15 padding-bottom-15 padding-l-10">
              <Col span="24">
                车型：
                {auto.auto_brand_name && auto.auto_brand_name != 0 ? auto.auto_brand_name + ' ' : ''}
                {auto.auto_series_name && auto.auto_series_name != 0 ? auto.auto_series_name + ' ' : ''}
                {auto.auto_type_name && auto.auto_type_name != 0 ? auto.auto_type_name + ' ' : ''}
                {auto.out_color_name && auto.out_color_name != 0 ? auto.out_color_name + ' ' : ''}
              </Col>
            </Row>

            <Row className="border-bottom-ccc padding-tb-15 padding-bottom-15 padding-l-10">
              <Col span={24}>故障描述：{project.failure_desc}</Col>
            </Row>

            <Row className="border-bottom-ccc padding-tb-15 padding-bottom-15 padding-l-10">
              <Col span={24}>维修建议：{project.maintain_advice}</Col>
            </Row>

            <Row className="border-bottom-ccc padding-tb-15 padding-bottom-15 padding-l-10">
              <Col span={24}>备注：{project.remark}</Col>
            </Row>

            <Row className={items.length > 0 ? 'border-bottom-ccc padding-tb-15 padding-l-10' : 'hide'}>
              <Col span={3}><span className="strong">维修内容：</span></Col>
              <Col span={21}>
                <Row className="mb5">
                  <Col span={6}>项目</Col>
                  <Col span={6}>工时费(元)</Col>
                  <Col span={6}>维修人员</Col>
                </Row>
                {items.map(item => this.renderItem(item))}
              </Col>
            </Row>

            <Row className={parts.length > 0 ? 'border-bottom-ccc padding-tb-15 padding-l-10' : 'hide'}>
              <Col span={3}><span className="strong">维修配件：</span></Col>
              <Col span={21}>
                <Row className="mb5">
                  <Col span={6}>名称</Col>
                  <Col span={6}>数量(个)</Col>
                  <Col span={6}>单价(元)</Col>
                  <Col span={4} className="text-right">金额小计(元)</Col>
                </Row>
                {parts.map(part => this.renderPart(part))}
              </Col>
            </Row>

            <Row className="border-bottom-ccc padding-tb-15 padding-l-10">
              <Col span={3}><span className="strong">收费：</span></Col>
              <Col span={15}>
                <Row className="mb5">
                  <Col span={6}>项目</Col>
                  <Col span={6}>金额(元)</Col>
                </Row>
                <Row className="mb5">
                  <Col span={6}>材料费</Col>
                  <Col span={6}>{Number(this.props.materialFee).toFixed(2)}</Col>
                </Row>
                <Row className="mb5">
                  <Col span={6}>工时费</Col>
                  <Col span={6}>{Number(this.props.timeFee).toFixed(2)}</Col>
                </Row>
                <Row className={project.coupon > 0 ? 'mb5' : 'hide'}>
                  <Col span={6}>优惠券优惠</Col>
                  <Col span={6}>{project.coupon}</Col>
                </Row>
                <Row className={project.group_purchase > 0 ? 'mb5' : 'hide'}>
                  <Col span={6}>团购优惠</Col>
                  <Col span={6}>{project.group_purchase}</Col>
                </Row>
                <Row className={project.discount > 0 ? 'mb5' : 'hide'}>
                  <Col span={6}>抹零优惠</Col>
                  <Col span={6}>{project.discount}</Col>
                </Row>
              </Col>
            </Row>

            <Row className="padding-tb-15 padding-l-10">
              <Col span={6} className="strong">总结算金额:{Number(this.props.realTotalFee).toFixed(2)}元</Col>
              <Col span={10}></Col>
              <Col span={4}>客户签字：</Col>
              <Col span={4}>日期：{formatter.day(new Date())}</Col>
            </Row>
          </div>

          <Row className="padding-tb-15 no-print">
            <Col span={24} className="center">
              <Button type="primary" onClick={this.handlePrint.bind(this)}>打印结算单</Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
