import React from 'react';
import ReactDOM from 'react-dom';
import {Form, Button, Row, Col} from 'antd';
import api from '../../../middleware/api';
import text from '../../../config/text';
import formatter from '../../../utils/DateFormatter';
import PrintThisComponent from '../../base/BasePrint';

export default class ConfirmProjectFrom extends PrintThisComponent {
  constructor(props) {
    super(props);
    this.state = {
      first: true,
      project: {},
      customer: {},
      auto: {},
      items: [],
      parts: [],
      timeFee: 0,
      totalFee: 0,
      payUrl: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.isNew && nextProps.project_id) || (!nextProps.isNew && nextProps.items.length > 0)) {
      let {
        customer_id,
        project_id,
        items,
        parts,
      } = nextProps;
      let timeFee = 0, materialFee = 0;

      this.getProjectDetail(customer_id, project_id);
      this.getCustomerDetail(customer_id);
      this.getMaintProjPayURL(project_id);

      items.map(item => timeFee += Number(item.time_fee));
      parts.map(part => materialFee += Number(part.material_fee));

      this.setState({
        first: false,
        items: items,
        parts: parts,
        timeFee: timeFee,
        materialFee: materialFee,
      });
    }
  }

  handlePrevStep(e) {
    e.preventDefault();
    this.props.onSuccess({
      currentStep: this.props.prevStep,
      projectForm: '',
      confirmProject: 'hide',
    });
  }

  handleCancel() {
    this.props.cancelModal();
    location.reload();
  }

  handlePrint(e) {
    e.preventDefault();

    // let qrCode = ReactDOM.findDOMNode(this.refs.qrCode);
    // let printImg = ReactDOM.findDOMNode(this.refs.printImg);
    let printInfo = ReactDOM.findDOMNode(this.refs.printProjectOrder);
    let USER_SESSION = sessionStorage.getItem('USER_SESSION');
    USER_SESSION = USER_SESSION ? JSON.parse(USER_SESSION) : {};

    //this.setCanvasPrintImg(qrCode, printImg);

    this.printThis({
      element: $(printInfo),
      debug: false,                //show the iframe for debugging
      importCSS: true,             //import page CSS
      importStyle: true,          //import style tags
      printContainer: false,        //grab outer container as well as the contents of the selector
      loadCSS: '/app/dist/print.css',   //path to additional css file - us an array [] for multiple
      pageTitle: USER_SESSION.brand_name,               //add title to print page
      removeInline: false,         //remove all inline styles from print elements
      printDelay: 333,            // variable print delay
      header: null,               // prefix to body
      footer: null,               // suffix to body
      formValues: true,             //preserve input/form values
    });
  }

  renderItem(item) {
    return (
      <Row className="mb5 text-gray" key={item._id}>
        <Col span={6}>{item.item_name}</Col>
        <Col span={6}>{item.time_fee}</Col>
        <Col span={6}>{item.fitter_user_name}</Col>
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

  getProjectDetail(customerId, projectId) {
    api.ajax({url: api.maintProjectByProjectId(customerId, projectId)}, function (data) {
      let detail = data.res.intention_info;
      this.setState({project: detail});
      this.getUserAutoDetail(detail.customer_id, detail.auto_id);
    }.bind(this));
  }

  getCustomerDetail(customerId) {
    api.ajax({url: api.customer.detail(customerId)}, function (data) {
      let detail = data.res.customer_info;
      this.setState({customer: detail});
    }.bind(this));
  }

  getMaintProjPayURL(projectId) {
    api.ajax({url: api.getMaintProjPayURL(projectId)}, function (data) {
      this.setState({payUrl: data.res.pay_url});
    }.bind(this));
  }

  getUserAutoDetail(customerId, userAutoId) {
    api.ajax({url: api.auto.detail(customerId, userAutoId)}, function (data) {
      this.setState({auto: data.res.detail});
    }.bind(this));
  }

  render() {
    const {project, customer, auto, items, parts, materialFee, timeFee} = this.state;
    let USER_SESSION = sessionStorage.getItem('USER_SESSION');
    USER_SESSION = USER_SESSION ? JSON.parse(USER_SESSION) : {};

    return (
      <div>
        <h3 className="center">{USER_SESSION.brand_name}-{USER_SESSION.company_name}客户结算单</h3>
        <Form horizontal ref="printProjectOrder" className="mt15">
          <div className="border-ccc">
            <Row className="padding-tb-15 padding-l-10">
              <Col span={8} className="print-col-8">工单编号：{project._id}</Col>
              <Col span={4}>接待顾问：{USER_SESSION.name}</Col>
              <Col span={4}>维修负责人：{project.fitter_admin_name}</Col>
              <Col span={4}>进厂时间：{formatter.day(project.start_time)}</Col>
              <Col span={4}>出厂时间：{formatter.day(project.end_time)}</Col>
            </Row>

            <Row
              className={project.is_accident === '1' ? 'padding-bottom-15 padding-l-10' : 'border-bottom-ccc padding-bottom-15 padding-l-10'}>
              <Col span={8}>客户姓名：{customer.name}</Col>
              <Col span={4}>联系方式：{customer.phone}</Col>
              <Col span={4}>车牌号：{auto.plate_num}</Col>
              <Col span={4}>公里数：{project.mileage}Km</Col>
              <Col span={4}>外观颜色：{auto.out_color_name}</Col>
            </Row>

            <Row
              className={project.is_accident === '1' ? 'border-bottom-ccc border-bottom-ccc padding-bottom-15 padding-l-10' : 'hide' }>
              <Col span={8}>是否事故车：{text.isOrNot[project.is_accident]}</Col>
            </Row>

            <Row className="border-bottom-ccc padding-tb-15 padding-bottom-15 padding-l-10">
              <Col span={24}>车型：{auto.auto_type_name}</Col>
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
                  <Col span={6}>{materialFee}</Col>
                </Row>
                <Row className="mb5">
                  <Col span={6}>工时费</Col>
                  <Col span={6}>{timeFee}</Col>
                </Row>
                <Row className={project.coupon > 0 ? 'mb5' : 'hide'}>
                  <Col span={6}>优惠券优惠</Col>
                  <Col span={6}>{project.coupon}</Col>
                </Row>
                <Row className={project.discount > 0 ? 'mb5' : 'hide'}>
                  <Col span={6}>抹零优惠</Col>
                  <Col span={6}>{project.discount}</Col>
                </Row>
              </Col>
            </Row>

            <Row className="padding-tb-15 padding-l-10">
              <Col span={6} className="strong">总结算金额:</Col>
              <Col span={6}>{project.total_fee}元</Col>
              <Col span={6}>客户签字：</Col>
              <Col span={6}>日期：{formatter.day(project.ctime)}</Col>
            </Row>
          </div>

          <Row className="padding-tb-15 no-print">
            <Col span={24} className="center">
              <Button type="ghost" className="mr15" onClick={this.handlePrevStep.bind(this)}>返回修改</Button>
              <Button type="ghost" className="mr15" onClick={this.handleCancel.bind(this)}>关闭预览</Button>
              <Button type="primary" onClick={this.handlePrint.bind(this)}>打印工单</Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
