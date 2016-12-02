import React from 'react'
import {Row, Col, Button, Form, message} from 'antd'
import api from '../../../middleware/api'
import PrintThisComponent from '../../base/BasePrint'
import Layout from '../Layout'
import formatter from '../../../middleware/formatter'

const FormItem = Form.Item;

export default class NewPartInfoConfirm extends PrintThisComponent {
  constructor(props) {
    super(props);
    this.state = {
        bt_enable: true
    }
  }

  print() {
    let printInfo = this.refs.printInfo.getDOMNode();
    this.printThis({
      element: $(printInfo),
      debug: false,                //show the iframe for debugging
      importCSS: true,             //import page CSS
      importStyle: false,          //import style tags
      printContainer: false,        //grab outer container as well as the contents of the selector
      loadCSS: "/app/dist/print.css",   //path to additional css file - us an array [] for multiple
      pageTitle: App.session.brand_name,               //add title to print page
      removeInline: false,         //remove all inline styles from print elements
      printDelay: 333,            // variable print delay
      header: null,               // prefix to html
      formValues: true             //preserve input/form values
    });
  }

  handlePreview(e) {
    e.preventDefault();
    this.props.onSuccess({
      currentStep: 0,
      visibility_form_part: '',
      visibility_form_preview: 'hide'
    });
  }

  submit(e) {
    e.preventDefault();
    let formData = this.props.formData;
    formData.ctime = formatter.date(formData.ctime);
    this.setState({bt_enable: false});
    api.ajax({
      url: this.props.newParts ? api.addNewParts() : api.addOldParts(),
      type: 'POST',
      data: formData
    }, (data) => {
      message.info('进货成功！');
      this.props.cancelModal();
      location.reload();
      this.handlePreview(e);
    })
  }

  render() {
    const { buttonLayout} = Layout;
    const {formData, part}=this.props;
    return (
      <div className="ant-form-horizontal print" ref="printInfo">
        <Row>
          <Col span="8" offset="8">
            <span className="info-label">配件名称</span>
            <span>{part.name}</span>
          </Col>
          <Col span="8" offset="8">
            <span className="info-label">设配车型</span>
            <span>{part.scope}</span>
          </Col>
        </Row>
        <Row>
          <Col span="8" offset="8">
            <span className="info-label">进货数量</span>
            <span>{formData.amount}</span>
          </Col>
          <Col span="8" offset="8">
            <span className="info-label">进货价</span>
            <span>{formData.in_price}</span>
          </Col>
        </Row>
        <Row>
          <Col span="8" offset="8">
            <span className="info-label">小计</span>
            <span>{(formData.amount * formData.in_price).toFixed(2) || 0}</span>
          </Col>
        </Row>
        <p className="ant-form-item center" style={{color:'#999'}}>入库后，库存数及进价将无法直接更改</p>

        <FormItem {...buttonLayout} className="no-print">
          <Button type="ghost" className="mr15" onClick={this.handlePreview.bind(this)}>返回编辑</Button>
          <Button type="primary" onClick={this.submit.bind(this)} disabled={!this.state.bt_enable}>确认并提交</Button>
        </FormItem>
      </div>
    )
  }
}
