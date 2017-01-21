import React, {Component} from 'react';
import {Link} from 'react-router';
import {Form, Input, Button, Table, Row, Col, message} from 'antd';
import FormModalLayout from '../../../../utils/FormLayout';

import api from '../../../../middleware/api';
import AddDiscountToMCTModal from '../../../../components/modals/marketing/AddDiscountToMCTModal';

const FormItem = Form.Item;

class MembercardTypeCreate extends Component {
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
    ].forEach(method => this[method] = this[method].bind(this));

    this.discountColumns = [
      {
        title: '序号',
        key: 'index',
        render: (text, record, index) => index + 1,
      }, {
        title: '优惠名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '适用门店',
        dataIndex: 'scope',
        key: 'scope',
        render: text => text == 0 ? '通店' : '售卡门店',
      }, {
        title: '优惠类型',
        dataIndex: 'type',
        key: 'type',
        render: text => {
          switch ('' + text) {
            case '1':
              return '计次优惠';
            case '2':
              return '折扣优惠';
            case '3':
              return '立减优惠';
            default:
              return '';
          }
        },
      }, {
        title: '描述',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
        render: text => text === 0 ? '不限次数' : text,
      }, {
        title: '操作',
        key: 'operation',
        className: 'center',
        render: (text, record, index) => <Link onClick={() => this.deleteDiscount(record, index)}>删除</Link>,
      },
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
        message.warn('项目已存在！');
        return false;    //若重复，则不添加
        // flag = true;        //若重复，替换之前的
        // discountList[i] = data;
        // break;
      }
    }
    if (!flag) {
      discountList.push(data);
      this.setState(discountList);
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

        window.location.href = `#/marketing/membercard-type/info?member_card_type=${MCTId}`;
      } else {
        message.error(data.msg);
      }
    }, (error) => {
      message.error(error);
    });

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
    const {getFieldDecorator} = this.props.form;

    return (
      <div>
        <div>

          <Form horizontal onSubmit={this.onSubmit}>
            {/*基本信息填写区*/}
            <div className="mt30">
              <Row className="mb10">
                <Col span={12}>
                  <p className="font-size-24">- 开卡信息</p>
                </Col>
                <Col span={12}>
                  <Button type="primary" htmlType="submit" style={{float: 'right'}}>
                    保存
                  </Button>
                </Col>
              </Row>

              <Row>
                <Col span={6} offset={1}>
                  <FormItem
                    label="会员卡名称"
                    {...formItemThree}
                    required
                  >
                    {getFieldDecorator('name')(
                      <Input placeholder="请输入会员卡名称"/>
                    )}
                  </FormItem>
                </Col>
                <Col span={6} offset={1}>
                  <FormItem
                    label="售价"
                    {...formItemThree}
                    required
                  >
                    {getFieldDecorator('price')(
                      <Input
                        type="number"
                        placeholder="请输入售价"
                        addonAfter="元"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={6} offset={1}>
                  <FormItem
                    label="有效期"
                    {...formItemThree}
                    required
                  >
                    {getFieldDecorator('valid_day')(
                      <Input
                        type="number"
                        placeholder="请输入有效期"
                        addonAfter="天"
                      />
                    )}
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
                    {getFieldDecorator('remark')(
                      <Input type={'textarea'} placeholder="请输入有会员卡描述"/>
                    )}
                  </FormItem>
                </Col>
              </Row>

            </div>

            {/*优惠显示区*/}
            <div className="mt15">
              <Row className="mb10">
                <Col span={12}>
                  <p className="font-size-24">- 卡内优惠</p>
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    style={{float: 'right'}}
                    onClick={() => this.setState({showAddDiscountToMCTModal: true})}
                  >
                    添加
                  </Button>
                </Col>
              </Row>

              <Table
                columns={discountColumns}
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

MembercardTypeCreate = Form.create()(MembercardTypeCreate);

export default MembercardTypeCreate;
