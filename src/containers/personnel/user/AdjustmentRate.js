import React from 'react';
import {message, Modal, Form, Collapse, Row, Col, Icon, Button, InputNumber} from 'antd';
import api from '../../../middleware/api';
import BaseModal from '../../../components/base/BaseModal';
import Layout from '../../../utils/FormLayout';

class AdjustmentRateModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      amountRate: 0,
      salaryRate: 0,
      boss: 0,
      purchase: 0,
      maintenance: 0,
      g_dianzongjingli: 0,
      g_xiaoshoujingli: 0,
      g_shouhoujingli: 0,
      g_xinchexiaoshou: 0,
      g_xubao: 0,
      g_anjie: 0,
      g_jixiu: 0,
      g_banjin: 0,
      g_youqi: 0,
      g_ximei: 0,
      g_weibao: 0,
      g_sajiedai: 0,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showRateModal = this.showRateModal.bind(this);
  }

  showRateModal() {
    this.getCommissionRateDetail();
    this.showModal();
  }

  handleSubmit() {
    let data = this.state;
    if (data.amountRate !== 100 && data.salaryRate !== 100) {
      message.error('分成比例或薪资组占比之和必须等于100');
      return false;
    } else {
      delete data.visible;
      delete data.amountRate;
      delete data.salaryRate;
    }

    for (let prop in data) {
      data[prop] = data[prop] / 100;
    }

    api.ajax({
        url: api.company.editCommissionRate(),
        type: 'POST',
        data: data,
      },
      () => {
        message.success('比例调整成功');
        this.hideModal();
      });
  }

  calculateAmountRate(propName, value) {
    let amountRateObj = this.state,
      amountRate = 0;

    amountRateObj[propName] = value;
    [
      'boss',
      'purchase',
      'maintenance',
    ].map((prop) => amountRate += amountRateObj[prop]);

    this.setState({
      [propName]: value,
      amountRate: amountRate,
    });

    if (amountRate > 100) {
      message.error('分成比例之和必须等于100');
    }
  }

  calculateSalaryRate(propName, value) {
    let salaryRateObj = this.state;
    salaryRateObj[propName] = value;

    let salaryRate = 0;
    [
      'g_dianzongjingli',
      'g_xiaoshoujingli',
      'g_shouhoujingli',
      'g_xinchexiaoshou',
      'g_xubao',
      'g_anjie',
      'g_jixiu',
      'g_banjin',
      'g_youqi',
      'g_ximei',
      'g_weibao',
      'g_sajiedai',
    ].map((prop) => salaryRate += salaryRateObj[prop]);

    this.setState({
      [propName]: value,
      salaryRate: salaryRate,
    });
    if (salaryRate > 100) {
      message.error('薪资组占比之和必须等于100');
    }
  }

  getCommissionRateDetail() {
    api.ajax({url: api.company.getCommissionRate()}, function (data) {
      let rate = data.res.commission_rate,
        stateObj = {};
      let amountRate = 0, salaryRate = 0;
      [
        'boss',
        'purchase',
        'maintenance',
        'g_dianzongjingli',
        'g_xiaoshoujingli',
        'g_shouhoujingli',
        'g_xinchexiaoshou',
        'g_xubao',
        'g_anjie',
        'g_jixiu',
        'g_banjin',
        'g_youqi',
        'g_ximei',
        'g_weibao',
        'g_sajiedai',
      ].map((prop) => {
        let value = Number(rate[prop]) * 100;

        if (prop.startsWith('g_')) {
          salaryRate += value;
        } else {
          amountRate += value;
        }
        stateObj[prop] = value;
      });
      stateObj.amountRate = amountRate;
      stateObj.salaryRate = salaryRate;

      this.setState(stateObj);
    }.bind(this));
  }

  render() {
    const FormItem = Form.Item;
    const Panel = Collapse.Panel;
    let {formItemTwo} = Layout;
    let inProps = {
      min: 0,
      max: 100,
      step: 1,
    };

    let {
      boss,
      purchase,
      maintenance,
      g_dianzongjingli,
      g_xiaoshoujingli,
      g_shouhoujingli,
      g_xinchexiaoshou,
      g_xubao,
      g_anjie,
      g_jixiu,
      g_banjin,
      g_youqi,
      g_ximei,
      g_weibao,
      g_sajiedai,
    } = this.state;

    return (
      <span>
        <Button
          type="primary"
          onClick={this.showRateModal}
          className="pull-right">
          调整比例
        </Button>
        <Modal
          title={<span><Icon type="edit"/> 调整比例</span>}
          visible={this.state.visible}
          width="620px"
          onCancel={this.hideModal}
          onOk={this.handleSubmit}
          maskClosable={false}>
          <Form horizontal>
            <Collapse defaultActiveKey={['1', '2']}>
              <Panel header="分成比例(%)" key="1">
                <Row>
                  <Col span={8}>
                    <FormItem label="店总占比" {...formItemTwo}>
                      <InputNumber
                        {...inProps}
                        value={boss}
                        onChange={this.calculateAmountRate.bind(this, 'boss')}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="售前占比" {...formItemTwo}>
                      <InputNumber
                        {...inProps}
                        value={purchase}
                        onChange={this.calculateAmountRate.bind(this, 'purchase')}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="售后占比" {...formItemTwo}>
                      <InputNumber
                        {...inProps}
                        value={maintenance}
                        onChange={this.calculateAmountRate.bind(this, 'maintenance')}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </Panel>

              <Panel header="薪资组占比(%)" key="2">
                <Row>
                  <Col span={8}>
                    <FormItem label="店总经理" {...formItemTwo}>
                      <InputNumber
                        {...inProps}
                        value={g_dianzongjingli}
                        onChange={this.calculateSalaryRate.bind(this, 'g_dianzongjingli')}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="销售经理" {...formItemTwo}>
                      <InputNumber
                        {...inProps}
                        value={g_xiaoshoujingli}
                        onChange={this.calculateSalaryRate.bind(this, 'g_xiaoshoujingli')}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="售后经理" {...formItemTwo}>
                      <InputNumber
                        {...inProps}
                        value={g_shouhoujingli}
                        onChange={this.calculateSalaryRate.bind(this, 'g_shouhoujingli')}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="新车销售" {...formItemTwo}>
                      <InputNumber
                        {...inProps}
                        value={g_xinchexiaoshou}
                        onChange={this.calculateSalaryRate.bind(this, 'g_xinchexiaoshou')}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="续保组" {...formItemTwo}>
                      <InputNumber
                        {...inProps}
                        value={g_xubao}
                        onChange={this.calculateSalaryRate.bind(this, 'g_xubao')}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="按揭组" {...formItemTwo}>
                      <InputNumber
                        {...inProps}
                        value={g_anjie}
                        onChange={this.calculateSalaryRate.bind(this, 'g_anjie')}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="机修组" {...formItemTwo}>
                      <InputNumber
                        {...inProps}
                        value={g_jixiu}
                        onChange={this.calculateSalaryRate.bind(this, 'g_jixiu')}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="钣金组" {...formItemTwo}>
                      <InputNumber
                        {...inProps}
                        value={g_banjin}
                        onChange={this.calculateSalaryRate.bind(this, 'g_banjin')}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="油漆组" {...formItemTwo}>
                      <InputNumber
                        {...inProps}
                        value={g_youqi}
                        onChange={this.calculateSalaryRate.bind(this, 'g_youqi')}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="洗美组" {...formItemTwo}>
                      <InputNumber
                        {...inProps}
                        value={g_ximei}
                        onChange={this.calculateSalaryRate.bind(this, 'g_ximei')}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="保养组" {...formItemTwo}>
                      <InputNumber
                        {...inProps}
                        value={g_weibao}
                        onChange={this.calculateSalaryRate.bind(this, 'g_weibao')}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="SA接待组" {...formItemTwo}>
                      <InputNumber
                        {...inProps}
                        value={g_sajiedai}
                        onChange={this.calculateSalaryRate.bind(this, 'g_sajiedai')}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </Panel>
            </Collapse>
          </Form>
        </Modal>
      </span>
    );
  }
}

AdjustmentRateModal = Form.create()(AdjustmentRateModal);
export default AdjustmentRateModal;
