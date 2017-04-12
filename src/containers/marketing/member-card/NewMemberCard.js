import React, {Component} from 'react';
import {Form, Input, Button, Row, Col, Modal, message} from 'antd';
import api from '../../../middleware/api';
import FormModalLayout from '../../../utils/FormLayout';
import SearchSelectBox from '../../../components/widget/SearchSelectBox';
const FormItem = Form.Item;


export default class GenMemberCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyList: [],
      currentIndex: '',
      total_count: 0,
      free_count: 0,
    };

    [
      'handleInputChange',
      'handleFinish',
      'handleFinishAndExport',
      'handleSelectKey',
      'handleSearch',
      'requireData',
    ].forEach((method) => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.visible) {
      this.setState({currentIndex: ''});
    }
    if (!!nextProps.memberCardTypeInfo) {
      this.requireData(nextProps.memberCardTypeInfo);
    }
  }

  requireData(memberCardTypeInfo) {
    const successHandler = function () {
    };
    const failHandler = function (error) {
      message.error(error);
    };
    let url = api.coupon.getMemberCardTypeCompanyList(memberCardTypeInfo._id, '');
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        this.setState({companyList: data.res.list});
        successHandler();
      } else {
        failHandler(data.msg);
      }
    }, (error) => {
      failHandler(error);
    });
  }

  handleInputChange(key, value) {
    const total_count = Number(this.state.total_count);
    const free_count = Number(this.state.free_count);
    value = Number(value);

    if (key == 'total_count' && value < free_count) {
      this.setState({
        total_count: '' + (value || 0),
        free_count: '' + (0),
      });
    } else if (key == 'free_count' && value > total_count) {
      this.setState({
        total_count: '' + (value || 0),
        free_count: '' + (value || 0),
      });
    } else {
      this.setState({
        [key]: '' + (value || 0),
      });
    }
  }

  handleSearch(memberCardTypeInfo, key, successHandle, failHandle) {
    let url = api.coupon.getMemberCardTypeCompanyList(memberCardTypeInfo._id, key);
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        this.setState({companyList: data.res.list});
        successHandle(data.res.list);
      } else {
        failHandle(data.msg);
      }
    }, (error) => {
      failHandle(error);
    });
  }

  handleSelectKey(index) {
    this.setState({
      currentIndex: index,
    });
  }

  submitData(successHandler = null) {
    const {companyList, currentIndex, total_count, free_count} = this.state;
    const memberCardTypeInfo = this.props.memberCardTypeInfo;
    const memberCardTypeId = memberCardTypeInfo._id;
    const company = companyList[currentIndex];
    let companyId = '';

    if (api.getLoginUser().companyId == 1) {
      if (!company || !company._id || parseInt(total_count) == 0) {
        message.error('请填写必要数据。');
        return;
      }
      companyId = company.company_id;
    } else {
      if (parseInt(total_count) == 0) {
        message.error('请填写必要数据。');
        return;
      }
      companyId = api.getLoginUser().companyId;
    }

    const url = api.coupon.genMemberCard();
    const data = {
      member_card_type_id: memberCardTypeId,
      company_id: companyId,
      count: total_count,
      free_count: free_count,
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
  handleFinish() {
    //提交数据
    this.submitData((logDetail) => {
      const {companyList, currentIndex} = this.state;
      const company = companyList[currentIndex];
      logDetail['status'] = '0';
      logDetail['company_name'] = company ? company.name : api.getLoginUser().companyName;

      this.props.finish(logDetail);
      this.props.onSuccess();
    });
  }

  //完成并导出
  handleFinishAndExport() {
    //提交数据, 提交数据成功后，导出
    this.submitData((logDetail) => {
      const {companyList, currentIndex} = this.state;
      const company = companyList[currentIndex];
      logDetail['status'] = '0';
      logDetail['company_name'] = company ? company.name : api.getLoginUser().companyName;

      this.exportData(logDetail);
      this.props.finish(logDetail);
      this.props.onSuccess();
    });
  }

  render() {
    let {formItemTwo, formItemLayout_1014} = FormModalLayout;
    let {total_count, free_count} = this.state;
    let memberCardTypeInfo = this.props.memberCardTypeInfo || {};
    let companyId = api.getLoginUser().companyId;

    return (
      <Modal
        title="发卡"
        visible={this.props.visible}
        onCancel={this.props.cancel}
        width="720px"
        footer={
          <div>
            <Button key="back" type="ghost" onClick={this.handleFinish}>完 成</Button>
            <Button key="submit" type="primary" onClick={this.handleFinishAndExport}>完成并导出</Button>
          </div>
        }
      >
        <Form>
          <Row>
            <Col className={companyId === '1' ? '' : 'hide'}>
              <FormItem
                label="发卡门店"
                labelCol={{span: 4}}
                wrapperCol={{span: 18}}
              >
                <SearchSelectBox
                  style={{width: 170, float: 'left'}}
                  placeholder={'请输入搜索门店名称'}
                  onSearch={this.handleSearch.bind(this, memberCardTypeInfo)}
                  onSelectKey={this.handleSelectKey}
                  displayPattern={item => item.company_name}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem
                label="发放总数"
                {...formItemLayout_1014}
                required
              >
                <Input
                  type="number"
                  placeholder="请输入总数量"
                  value={total_count !== 0 ? total_count : ''}
                  onChange={(e) => this.handleInputChange('total_count', e.target.value)}
                />
              </FormItem>
            </Col>
            <Col span={10} offset={2}>
              <FormItem
                label="免费数量"
                {...formItemTwo}
              >
                <Input
                  type="number"
                  placeholder="请输入免费数量"
                  value={free_count !== 0 ? free_count : ''}
                  onChange={(e) => this.handleInputChange('free_count', e.target.value)}
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

