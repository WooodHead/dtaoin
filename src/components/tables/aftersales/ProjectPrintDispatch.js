import React from 'react'
import ReactDOM from 'react-dom'
import {message, Form, Button, Row, Col, Icon} from 'antd'
import api from '../../../middleware/api'
import text from '../../../middleware/text'
import formatter from '../../../middleware/formatter'
import PrintThisComponent from '../../base/BasePrint'

export default class ProjectPrintDispatch extends PrintThisComponent {
  constructor(props) {
    super(props);
    this.state = {
      project: this.props.project ? this.props.project : {},
      customer: this.props.customer ? this.props.customer : {},
      auto: this.props.auto ? this.props.auto : {},
      items: this.props.items ? this.props.items : [],
      parts: this.props.parts ? this.props.parts: [],
      timeFee: 0,
      totalFee: 0
    }
  }

  handlePrint(e) {
    e.preventDefault();

    let printInfo = ReactDOM.findDOMNode(this.refs.printProjectOrder);

    this.printThis({
      element: $(printInfo),
      debug: false,                //show the iframe for debugging
      importCSS: true,             //import page CSS
      importStyle: true,          //import style tags
      printContainer: false,        //grab outer container as well as the contents of the selector
      loadCSS: "/app/dist/print.css",   //path to additional css file - us an array [] for multiple
      pageTitle: App.session.brand_name+"-"+App.session.company_name+"-派工单",               //add title to print page
      removeInline: false,         //remove all inline styles from print elements
      printDelay: 333,            // variable print delay
      header: '<h2 style="text-align:center">'+App.session.brand_name+'-'+App.session.company_name+'-派工单</h2>',               // prefix to body
      footer: null,               // suffix to body
      formValues: true             //preserve input/form values
    });
  }

  renderItem(item) {
    return (
      <Row className="mb5 text-gray" key={item._id}>
        <Col span="6">{item.item_name}</Col>
        <Col span="6">{item.fitter_user_names}</Col>
        <Col span="6"></Col>
      </Row>
    )
  }

  renderPart(part) {
    return (
      <Row className="mb5 text-gray" key={part._id}>
        <Col span="6">{part.part_name}</Col>
        <Col span="6">{part.count}</Col>
        <Col span="6"></Col>
      </Row>
    )
  }

  render() {
    const {project, customer, auto, payUrl, materialFee, timeFee} = this.state;
    let items = [];                                 
    for ( let value of this.state.items.values() ) {
        items.push(value);
    }
    let parts = [];                                 
    for ( let value of this.state.parts.values() ) {
        parts.push(value);
    }

    return (
      <div>
        <h3 className="center">{App.session.brand_name}-{App.session.company_name}-派工单</h3>
        <Form horizontal ref="printProjectOrder" className="mt15">
          <div className="border-ccc">
            <Row className="padding-tb-15 padding-l-10">
              <Col span="8" className="print-col-8">工单编号：{project._id}</Col>
              <Col span="4">接待顾问：{App.session.name}</Col>
              <Col span="4">是否事故车：{text.isOrNot[project.is_accident]}</Col>
              <Col span="4">进厂时间：{formatter.day(project.start_time)}</Col>
              <Col span="4">预计出厂时间：{formatter.day(project.start_time)}</Col>
            </Row>

            <Row
              className={project.is_accident === '1' ? 'padding-bottom-15 padding-l-10' : 'border-bottom-ccc padding-bottom-15 padding-l-10'}>
              <Col span="8">联系方式：{customer.phone}</Col>
              <Col span="4">客户姓名：{customer.name}</Col>
              <Col span="4">车牌号：{auto.plate_num}</Col>
              <Col span="4">公里数：{project.mileage}公里</Col>
              <Col span="4">外观颜色：{auto.out_color_name}</Col>
            </Row>

            <Row className="border-bottom-ccc padding-tb-15 padding-bottom-15 padding-l-10">
              <Col span="24">车型：{auto.auto_brand_name} {auto.auto_type_name} {auto.out_color_name} {auto.in_color_name}</Col>
            </Row>

            <Row className="border-bottom-ccc padding-tb-15 padding-bottom-15 padding-l-10">
              <Col span="24">故障描述：{project.failure_desc}</Col>
            </Row>

            <Row className="border-bottom-ccc padding-tb-15 padding-bottom-15 padding-l-10">
              <Col span="24">维修建议：{project.maintain_advice}</Col>
            </Row>

            <Row className="border-bottom-ccc padding-tb-15 padding-bottom-15 padding-l-10">
              <Col span="24">备注：{project.remark}</Col>
            </Row>

            <Row className={items.length > 0 ? 'border-bottom-ccc padding-tb-15 padding-l-10' : 'hide'}>
              <Col span="3"><span className="strong">维修内容：</span></Col>
              <Col span="21">
                <Row className="mb5">
                  <Col span="6">项目</Col>
                  <Col span="6">维修人员</Col>
                  <Col span="6">维修人员签字</Col>
                </Row>
                {items.map(item => this.renderItem(item))}
              </Col>
            </Row>

            <Row className={parts.length > 0 ? 'border-bottom-ccc padding-tb-15 padding-l-10' : 'hide'}>
              <Col span="3"><span className="strong">维修配件：</span></Col>
              <Col span="21">
                <Row className="mb5">
                  <Col span="6">名称</Col>
                  <Col span="6">数量(个)</Col>
                  <Col span="6">领料人签字</Col>
                </Row>
                {parts.map(part => this.renderPart(part))}
              </Col>
            </Row>
          </div>

          <Row className="padding-tb-15 no-print">
            <Col span="24" className="center">
              <Button type="primary" onClick={this.handlePrint.bind(this)}>打印派工单</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
