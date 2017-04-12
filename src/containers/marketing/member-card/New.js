import React, {Component} from 'react';
import {Link} from 'react-router';
import {Form, Input, Button, Table, Row, Col, message, TreeSelect} from 'antd';

import Layout from '../../../utils/FormLayout';
import FormValidator from '../../../utils/FormValidator';
import api from '../../../middleware/api';

import AddDiscountToMCTModal from './AddDiscount';
import CardStore from './CardStore';

const FormItem = Form.Item;

class New extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memberCardInfo: '',
      discountList: [],
      showAddDiscountToMCTModal: false,
      treeData: [],
      companyListId: [],
      selectValue: '',
      storeValue: [],
      memberCardId: props.location.query.memberCardId,
    };

    [
      'handleSendData',
      'handleSubmit',
      'handleDeleteDiscount',
      'getCompanyList',
      'handleStoreSelect',
      'getCompanyListAsync',
    ].forEach(method => this[method] = this[method].bind(this));

    let scopeVisible = api.getLoginUser().companyId == 1 ? '' : 'hide';
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
        className: {scopeVisible},
        render: text => text == 0 ? '发卡门店' : '售卡门店',
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
        render: (text, record, index) => <Link onClick={() => this.handleDeleteDiscount(record, index)}>删除</Link>,
      },
    ];

  }

  componentDidMount() {
    this.setState({
      treeData: [
        {label: 'FC友情合作店', value: '1', key: '1'},
        {label: 'MC重要合作店', value: '2', key: '2'},
        {label: 'AP高级合伙店', value: '3', key: '3'},
        {label: 'TP顶级合伙店', value: '4', key: '4'},
      ],
    });
    this.getCompanyList();
    if (this.props.location.query.memberCardId) {
      this.getMemberCardTypeInfo();
    }
  }

  getMemberCardTypeInfo() {
    let memberCardType = this.props.location.query.memberCardId;
    let url = api.coupon.getMemberCardTypeInfo(memberCardType);
    api.ajax({url: url}, (data) => {
      if (data.code === 0) {
        this.setState({
          memberCardInfo: data.res.detail,
          discountList: JSON.parse(data.res.detail.coupon_items),
        });
      } else {
        this.setState({memberCardInfo: null});
        message.error(data.msg);
      }
    }, (error) => {
      this.setState({memberCardInfo: null});
      message.error(error);
    });
  }

  getCompanyListAsync(treeNode) {
    const treeData = [...this.state.treeData];
    let type = treeNode.props.value;
    let index = type - 1;

    return new Promise((resolve, reject) => {
      api.ajax({url: api.overview.companyList({limit: '-1', cooperationType: type})}, data => {
        treeData[index].children = [];
        let companyList = data.res.list;
        companyList.map(item => {
          treeData[index].children.push({
            label: item.name,
            value: item._id,
            key: item._id,
            isLeaf: true,
          });
        });
        this.setState({treeData}, () => {
        });
        resolve(true);
      }, () => {
        reject(false);
      });
    });
  }

  getCompanyList() {
    let companyListId = this.state.companyListId;

    [1, 2, 3, 4].map((item, index) => {
      let companyId = '';

      api.ajax({url: api.overview.companyList({limit: '-1', cooperationType: item})}, data => {
        let companyList = data.res.list;
        companyList.map(item => {
          if (!!item) {
            companyId += `${item._id},`;
          }
        });
        companyListId[index] = companyId;
        this.setState({companyListId});
      });
    });
  }

  handleSendData(data) {
    if (!data) return false;
    let discountList = this.state.discountList;
    const len = discountList.length;
    let flag = false;
    for (let i = 0; i < len; i++) {
      if (discountList[i]._id == data._id) {
        message.warn('项目已存在！');
        return false;
      }
    }
    if (!flag) {
      discountList.push(data);
      this.setState(discountList);
    }
    return true;
  }

  handleSubmit(e) {
    e.preventDefault();
    let formValue = this.props.form.getFieldsValue();
    let discountList = this.state.discountList;
    formValue['coupon_items'] = JSON.stringify(discountList);

    if (!!this.state.selectValue) {
      formValue.company_ids = this.state.selectValue;
    } else if (api.getLoginUser().companyId != 1) {
      formValue.company_ids = api.getLoginUser().companyId;
    }

    formValue.member_card_type_id = this.props.location.query.memberCardId;

    let url = api.coupon.addMemberCardType();
    if (!!this.props.location.query.memberCardId) {
      url = api.coupon.editMemberCardType();
    }

    api.ajax({url, data: formValue, type: 'POST'}, (data) => {
      if (data.code === 0) {
        message.success('提交成功！');
        this.setState({memberCardInfo: data.res.detail});
      } else {
        message.error(data.msg);
      }
    }, (error) => {
      message.error(error);
    });

  }

  handleDeleteDiscount(discount, index) {
    let discountList = this.state.discountList;
    discountList.splice(index, 1);
    this.setState({discountList});
  }

  handleStoreSelect(value) {
    let {companyListId} = this.state;

    let selectValue = [...value];

    ['1', '2', '3', '4'].map((item, index) => {
      if (selectValue.indexOf(item) != -1) {
        selectValue.splice(selectValue.indexOf(item), 1, companyListId[index]);
      }
    });

    while (selectValue.indexOf('') != -1) {
      selectValue.splice(selectValue.indexOf(''), 1);
    }

    selectValue = selectValue.join('');
    this.setState({storeValue: value, selectValue});
  }

  handleUpdateMemberCardTypeStatus(newStatus) {
    let memberCardTypeId = this.state.memberCardInfo._id;
    let url = api.coupon.updateMemberCardTypeStatus();
    let data = {member_card_type_id: memberCardTypeId, status: newStatus};
    api.ajax({url, data, type: 'POST'}, data => {
      if (data.code === 0) {
        message.success('更改成功！');
        setTimeout(() => {
          window.location.href = `/marketing/membercard/detail?member_card_type=${this.state.memberCardInfo._id}`;
        }, 1000);
      } else {
        message.error(data.msg);
      }
    }, (error) => {
      message.error(error);
    });
  }

  render() {
    const discountColumns = this.discountColumns;
    const {discountList, showAddDiscountToMCTModal, treeData, memberCardInfo, memberCardId} = this.state;
    let {formItemThree} = Layout;
    const {getFieldDecorator} = this.props.form;

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <div className="with-bottom-divider">
            <Row className="head-action-bar-line">
              <Col span={24}>
                <Button className="ml10 pull-right" type="primary" htmlType="submit">
                  保存
                </Button>

                <Button
                  disabled={!memberCardInfo || memberCardInfo.status == 0}
                  type="primary"
                  className="pull-right"
                  onClick={() => this.handleUpdateMemberCardTypeStatus(0)}
                >
                  启用
                </Button>
              </Col>
            </Row>

            <Row className="mt20 mb20">
              <Col span={12}>
                <h3>开卡信息</h3>
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                <FormItem label="名称" {...formItemThree}>
                  {getFieldDecorator('name', {
                    initialValue: memberCardInfo && memberCardInfo.name,
                    rules: FormValidator.getRuleNotNull(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入会员卡名称"/>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="售价" {...formItemThree}>
                  {getFieldDecorator('price', {
                    initialValue: memberCardInfo && memberCardInfo.price,
                    rules: FormValidator.getRuleNotNull(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input type="number" placeholder="请输入售价" addonAfter="元"/>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="有效期" {...formItemThree}>
                  {getFieldDecorator('valid_day', {
                    initialValue: memberCardInfo && memberCardInfo.valid_day,
                    rules: FormValidator.getRuleNotNull(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input type="number" placeholder="请输入有效期" addonAfter="天"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={16}>
                <FormItem label="描述" labelCol={{span: 3}} wrapperCol={{span: 15}}>
                  {getFieldDecorator('remark', {
                    initialValue: memberCardInfo && memberCardInfo.remark,
                  })(
                    <Input type="textarea" autosize={true} placeholder="请输入有会员卡描述"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row className={api.getLoginUser().companyId == 1 ? '' : 'hide'}>
              <Col span={6}>
                <FormItem label="发卡门店" {...formItemThree} required>
                  <TreeSelect
                    treeData={treeData}
                    value={this.state.storeValue}
                    onChange={this.handleStoreSelect}
                    multiple={true}
                    treeCheckable={true}
                    showCheckedStrategy={TreeSelect.SHOW_PARENT}
                    searchPlaceholder="请选择发卡门店"
                    style={{width: 300}}
                    loadData={this.getCompanyListAsync}
                    disabled={!!memberCardId}
                  />
                </FormItem>
              </Col>

              <Col span={10} offset={2} memberCardId className={!!memberCardId ? 'padding-tb-7' : 'hide'}>
                <CardStore memberCardType={memberCardId}/>
              </Col>

            </Row>
          </div>

          <div className="mt15">
            <Row className="mb10">
              <Col span={12}>
                <h3>卡内优惠</h3>
              </Col>
              <Col span={12}>
                <Button
                  type="primary"
                  className="pull-right"
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
        <AddDiscountToMCTModal
          visible={showAddDiscountToMCTModal}
          cancel={() => this.setState({showAddDiscountToMCTModal: false})}
          finish={(data) => this.handleSendData(data)}
        />
      </div>
    );
  }
}

New = Form.create()(New);
export default New;
