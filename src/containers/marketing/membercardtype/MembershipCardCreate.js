import React, {Component} from 'react'
import {Link} from 'react-router'
import {Breadcrumb, Form, Input, Modal, Button, Select, Checkbox, Table, Row, Col, message} from 'antd'
import FormModalLayout from '../../../components/forms/Layout';
const FormItem = Form.Item;

import api from '../../../middleware/api'

import AddDiscountToMCTModal from '../../../components/modals/marketing/AddDiscountToMCTModal';


class MembershipCardCreate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      discountList: [],
      showAddDiscountToMCTModal: false,
    };

    //自动绑定
    [
      'onModalSendData',
      'onSubmit',
      'deleteDiscount',
    ].forEach((method) => this[method] = this[method].bind(this));

    this.discountColumns = [
      {
        title: <p style={{textAlign: 'center'}}>序号</p>,
        key: 'index',
        render: (text, record, index) => <p style={{textAlign: 'center'}}>{index + 1}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>优惠名称</p>,
        dataIndex: 'name',
        key: 'name',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>适用门店</p>,
        dataIndex: 'scope',
        key: 'scope',
        render: (text) => <p style={{textAlign: 'center'}}>{text == 0 ? '通店' : '售卡门店'}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>优惠类型</p>,
        dataIndex: 'type',
        key: 'type',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>描述</p>,
        dataIndex: 'remark',
        key: 'remark',
        render: (text) => <p style={{textAlign: 'center'}}>{text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>数量</p>,
        dataIndex: 'amount',
        key: 'amount',
        render: (text) => <p style={{textAlign: 'center'}}>{text === 0 ? '不限次数' : text}</p>,
      }, {
        title: <p style={{textAlign: 'center'}}>操作</p>,
        key: 'operation',
        render: (text, record, index) => (
          <p style={{textAlign: 'center'}}>
          <span>
            <Link onClick={() => this.deleteDiscount(record, index)}>删除</Link>
          </span>
          </p>
        ),
      }
    ];

  }

  onModalSendData(data) {
    if (!data) return false;
    let discountList = this.state.discountList;
    //检测优惠是否重复
    const len = discountList.length;
    let flag = false;   //假定没有重复
    for (let i = 0; i < len; i++) {
      if (discountList[i]._id == data._id) {
        // return false;   //若重复，则不添加
        flag = true;     //若重复，替换之前的
        discountList[i] = data;
        break;
      }
    }
    if (!flag) {
      discountList.push(data);
    }
    return true;
  }

  onSubmit(e) {
    e.preventDefault();
    let formValue = this.props.form.getFieldsValue();
    let discountList = this.state.discountList;
    formValue['coupon_items'] = JSON.stringify(discountList);

    let url = api.coupon.addMemberCardType();
    api.ajax({url, data: formValue, type: 'POST'}, (data) => {
      if (data.code === 0) {
        message.success('提交成功！');
        const newMCT = data.res.detail;     //MCT = MemberCardType
        const MCTId = newMCT._id;

        window.location.href = `#/marketing/membercardtype/info?member_card_type=${MCTId}`;
      } else {
        message.error(data.msg);
      }
    }, (error) => {
      message.error(error);
    })

  }

  deleteDiscount(discount, index) {
    let discountList = this.state.discountList;
    discountList.splice(index, 1);
    this.setState({discountList});
  }


  render() {
    const discountColumns = this.discountColumns;
    const {discountList, showAddDiscountToMCTModal} = this.state;
    let {formNoLabel, formItemThree} = FormModalLayout;
    const {getFieldProps} = this.props.form;

    return (
      <div>
        {/*面包屑导航*/}
        <div className="mb10">
          <Breadcrumb>
            <Breadcrumb.Item>
              营销/会员卡管理
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="#/marketing/membercardtype/list">会员卡列表</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              创建会员卡
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div>

          <Form horizontal onSubmit={this.onSubmit}>
            {/*基本信息填写区*/}
            <div className="mt30">
              <Row className="mb10">
                <Col span="12">
                  <p style={{fontSize: 24}}>- 开卡信息</p>
                </Col>
                <Col span="12">
                  <Button type="primary" htmlType="submit" style={{float: 'right'}}>保存</Button>
                </Col>
              </Row>

              <Row>
                <Col span={6} offset={1}>
                  <FormItem
                    label="会员卡名称"
                    {...formItemThree}
                    required
                  >
                    <Input {...getFieldProps('name')} defaultValue="" placeholder="请输入会员卡名称"/>
                  </FormItem>
                </Col>
                <Col span={6} offset={1}>
                  <FormItem
                    label="售价"
                    {...formItemThree}
                    required
                  >
                    <Input {...getFieldProps('price')} defaultValue="" type="number" placeholder="请输入售价" addonAfter="元"/>
                  </FormItem>
                </Col>
                <Col span={6} offset={1}>
                  <FormItem
                    label="有效期"
                    {...formItemThree}
                    required
                  >
                    <Input {...getFieldProps('valid_day')} defaultValue="" type="number" placeholder="请输入有效期" addonAfter="天"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={20} offset={2}>
                  <FormItem
                    label="描述"
                    {...formNoLabel}
                    required
                  >
                    <Input {...getFieldProps('remark')} defaultValue="" placeholder="请输入有会员卡描述"/>
                  </FormItem>
                </Col>
              </Row>

            </div>

            {/*优惠显示区*/}
            <div className="mt15">
              <Row className="mb10">
                <Col span="12">
                  <p style={{fontSize: 24}}>- 卡内优惠</p>
                </Col>
                <Col span="12">
                  <Button type="primary" style={{float: 'right'}} onClick={() => {
                    this.setState({showAddDiscountToMCTModal: true})
                  }}>添加</Button>
                </Col>
              </Row>

              <Table columns={discountColumns}
                     dataSource={discountList}
                     pagination={false}
                     bordered
              />

            </div>

          </Form>

        </div>

        <AddDiscountToMCTModal
          visible={showAddDiscountToMCTModal}
          cancel={() => this.setState({showAddDiscountToMCTModal: false})}
          finish={(data) => this.onModalSendData(data)}
        />

      </div>
    );
  }
}

MembershipCardCreate = Form.create()(MembershipCardCreate);

export default MembershipCardCreate
