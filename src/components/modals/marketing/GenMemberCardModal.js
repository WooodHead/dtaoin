import React, {Component} from 'react'
import {Form, Input, Button, Select, Row, Col, Modal, message} from 'antd'
import api from '../../../middleware/api'
import FormModalLayout from '../../../components/forms/Layout';
const FormItem = Form.Item;


export default class GenMemberCardModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyList: [],
      currentIndex: '',
      total_count: 0,
      free_count: 0,
    };

    [
      'onSelectChange',
      'onInputChange',
      'onFinish',
      'onFinishAndExport',
    ].forEach((method) => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.requireData();
  }

  requireData() {
    const successHandler = function () {
    };
    const failHandler = function () {
      message.error(error);
    };
    let url = api.company.list();
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        this.setState({companyList: data.res.company_list});
        successHandler();
      } else {
        failHandler(data.msg);
      }
    }, (error) => {
      failHandler(error);
    })
  }


  onSelectChange(index) {
    this.setState({
      currentIndex: index,
    });
  }

  onInputChange(key, value) {
    const total_count = Number(this.state.total_count);
    const free_count = Number(this.state.free_count);
    value = Number(value);

    if (key == 'total_count' && value < free_count) {
      this.setState({
        total_count: value || 0,
        free_count: 0,
      });
    } else if (key == 'free_count' && value > total_count){
      this.setState({
        total_count: value || 0,
        free_count: value || 0,
      });
    } else {
      this.setState({
        [key]: value || 0,
      });
    }
  }

  submitData(successHandler = null) {
    //提交数据
    const {companyList, currentIndex, total_count, free_count} = this.state;
    const memberCardTypeInfo = this.props.memberCardTypeInfo;
    const memberCardTypeId = memberCardTypeInfo._id;
    const company = companyList[currentIndex];

    if (!company || !company._id || parseInt(total_count) == 0) {
      message.error('请填写必要数据。');
      return;
    }
    const companyId = company._id;

    const url = api.coupon.genMemberCard();
    const data = {
      member_card_type_id: memberCardTypeId,
      company_id: companyId,
      count: total_count,
      free_count: free_count
    };
    api.ajax({url, data, type: 'POST'}, (data) => {
      if (data.code === 0) {
        message.success('生成会员卡成功！');
        typeof(successHandler) == 'function' && successHandler(data.res.detail);
        //重置状态
        this.setState({
          currentIndex: '',
          total_count: 0,
          free_count: 0,
        });
      } else {
        message.error(data.msg);
      }
    }, (error) => {
      message.error(error);
    });


  }

  exportData(logDetail) {
    let logId = logDetail._id;
    let typeId = logDetail.member_card_type;

    const url = api.coupon.exportMemberCardDistributeLog(typeId, logId);
    let aToExportCSV = document.createElement('a');
    aToExportCSV.href = url;
    aToExportCSV.target = '_blank';
    aToExportCSV.click();
  }

  //完成
  onFinish() {
    this.submitData();
  }

  //完成并导出
  onFinishAndExport() {
    //提交数据, 提交数据成功后，导出
    this.submitData(this.exportData);
  }

  render() {
    let {formItemTwo} = FormModalLayout;
    let {companyList, currentIndex, total_count, free_count} = this.state;

    return (
      <Modal
        title="发卡"
        visible={this.props.visible}
        onCancel={this.props.hidden}
        footer={
          <Row>
            <Col span={6} offset={4}>
              <Button
                key="back"
                type="ghost"
                size="large"
                style={{width: '100%'}}
                onClick={this.onFinish}
              >
                完 成
              </Button>
            </Col>
            <Col span={6} offset={4}>
              <Button
                key="submit"
                type="primary"
                size="large"
                style={{width: '100%'}}
                onClick={this.onFinishAndExport}
              >
                完成并导出
              </Button>
            </Col>
          </Row>
        }
      >
        <Form horizontal>
          <Row>
            <Col>
              <FormItem
                label="发卡门店"
                labelCol={{span: 4}}
                wrapperCol={{span: 18}}
              >
                <Select
                  showSearch
                  size="large"
                  placeholder="选择一家门店"
                  defaultValue={currentIndex}
                  optionFilterProp="children"
                  onChange={(value) => {
                    this.onSelectChange(value)
                  }}
                >
                  {companyList.map((item, index) =>
                    <Select.Option key={index} value={'' + index}>{item.name}</Select.Option>
                  )}
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10} offset={1}>
              <FormItem
                label="发放总数"
                {...formItemTwo}
                required
              >
                <Input
                  type="number"
                  placeholder="请输入总数量"
                  value={total_count || ''}
                  onChange={(e) => this.onInputChange('total_count', e.target.value)}
                />
              </FormItem>
            </Col>
            <Col span={10} offset={1}>
              <FormItem
                label="免费数量"
                {...formItemTwo}
                required
              >
                <Input
                  type="number"
                  placeholder="请输入免费数量"
                  value={free_count || ''}
                  onChange={(e) => this.onInputChange('free_count', e.target.value)}
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

