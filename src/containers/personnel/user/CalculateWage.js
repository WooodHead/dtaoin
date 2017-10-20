import React from 'react';
import { message, Modal, Icon, Button, Row, Col, Form, Collapse, DatePicker, Input, InputNumber } from 'antd';
import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';
import BaseModal from '../../../components/base/BaseModal';
import Layout from '../../../utils/FormLayout';
import SocialSecurityDetailModal from './SocialSecurityDetail';

const FormItem = Form.Item;
const Panel = Collapse.Panel;
const TextArea = Input.TextArea;
const MonthPicker = DatePicker.MonthPicker;
const now = new Date();

class CalculateWageModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      month: formatter.month(new Date(now.getFullYear(), now.getMonth() - 1)),
      salaryInfo: {},
      rate: 0,
      attendanceRate: 0,
      baseSalary: 0,
      basePerformanceSalary: 0,
      punishment: 0,
      bonus: 0,
      adjustment: 0,
      socialSecurity: 0,
      providentFund: 0,
      tax: 0,
    };
    [
      'showSalaryModal',
      'handleSubmit',
      'handleRateChange',
      'calculateTax',
      'disabledMonth',
      'handleMonthChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  showSalaryModal() {
    const { type, user, month } = this.props;
    switch (type) {
    case 'month':
      this.getBaseSalaryInfo(user._id, this.state.month);
      break;
    case 'performance':
      this.getBaseSalaryInfo(user._id, month);
      break;
    }
    this.showModal();
  }

  handleSubmit() {
    const { type, user, month } = this.props;
    const formData = this.props.form.getFieldsValue();

    api.ajax({
      url: api.user.calculateSalary(user._id, type !== 'month' ? month : this.state.month),
      type: 'POST',
      data: formData,
    }, () => {
      message.success('工资计算成功');
      this.hideModal();
      this.props.onSuccess();
    });
  }

  handleRateChange(rate) {
    this.setState({ rate });

    const stateObj = this.state;
    stateObj.rate = rate;

    const { socialSecurity, providentFund } = stateObj;
    const salary = this.calculateTaxBeforeSalary(stateObj);

    this.calculateTax(salary, socialSecurity, providentFund);
  }

  handleSalaryChange(propName, e) {
    const value = Number(e.target.value);
    this.setState({ [propName]: value });

    const stateObj = this.state;
    stateObj[propName] = value;

    const { socialSecurity, providentFund } = stateObj;
    const salary = this.calculateTaxBeforeSalary(stateObj);

    this.calculateTax(salary, socialSecurity, providentFund);
  }

  calculateTaxBeforeSalary(stateObj) {
    const {
      baseSalary,
      basePerformanceSalary,
      rate,
      punishment,
      bonus,
      adjustment,
    } = stateObj;
    const performanceSalary = basePerformanceSalary * rate;
    const salary = baseSalary + performanceSalary + bonus - punishment + adjustment;
    return salary;
  }

  calculateTax(salary, socialSecurity, providentFund) {
    api.ajax({
      url: api.user.calculateTax(),
      type: 'POST',
      data: {
        salary,
        social_security: socialSecurity,
        provident_fund: providentFund,
      },
    }, data => {
      this.setState({ tax: data.res.tax });
    });
  }

  disabledMonth(month) {
    return month.valueOf() > new Date().valueOf();
  }

  handleMonthChange(date, month) {
    this.getBaseSalaryInfo(this.props.user._id, month);
  }

  getBaseSalaryInfo(userId, month) {
    api.ajax({ url: api.user.prepareCalculateSalary(userId, month) }, data => {
      const salaryInfo = data.res.user_salary;
      const {
        base_salary,
        actual_day,
        paid_vacation,
        due_day,
        punishment,
        performance_salary,
      } = salaryInfo;
      const { person_security_total, person_provident_fund_total } = salaryInfo.security_fund;

      let attendanceRate = (parseInt(actual_day) + parseInt(paid_vacation)) / parseInt(due_day),
        baseSalary = parseFloat(base_salary) * attendanceRate;

      this.setState({
        month,
        salaryInfo,
        attendanceRate,
        baseSalary,
        basePerformanceSalary: performance_salary,
        punishment,
        socialSecurity: person_security_total,
        providentFund: person_provident_fund_total,
      });

      this.calculateTax();
    });
  }

  render() {
    const { formItem12, formItemThree, formItemFour } = Layout;
    const { getFieldDecorator } = this.props.form;

    const { type, user, month, disabled, size } = this.props;
    const {
      salaryInfo,
      rate,
      baseSalary,
      basePerformanceSalary,
      tax,
      bonus,
      adjustment,
      punishment,
    } = this.state;

    const performanceSalary = basePerformanceSalary * rate;
    const finalSalary = baseSalary + performanceSalary + bonus + adjustment - punishment - tax;

    return (
      <span>
        {
          size === 'small'
            ?
            <a href="javascript:;" onClick={this.showSalaryModal} disabled={disabled ? disabled : false}>工资计算</a>
            :
            <Button onClick={this.showSalaryModal} disabled={disabled ? disabled : false}>工资计算</Button>
        }

        <Modal
          title={<span><Icon type="calculator"/> 工资计算</span>}
          visible={this.state.visible}
          width="900px"
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}>
          <Form>
            <Collapse defaultActiveKey={['1', '2']}>
              <Panel header="员工信息" key="1">
                <Row type="flex">
                  <Col span={6}>
                    <FormItem label="姓名" {...formItemFour}>
                      <p className="ant-form-text">{user.name}</p>
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="员工编号" {...formItemFour}>
                      <p className="ant-form-text">{user._id}</p>
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="区域" {...formItemFour}>
                      <p className="ant-form-text">{user.company_region}</p>
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="门店" {...formItemFour}>
                      <p className="ant-form-text">{user.company_name}</p>
                    </FormItem>
                  </Col>
                </Row>

                <Row type="flex">
                  <Col span={6}>
                    <FormItem label="部门" {...formItemFour}>
                      <p className="ant-form-text">{user.department_name}</p>
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="职位" {...formItemFour}>
                      <p className="ant-form-text">{user.role_name}</p>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="薪资组" {...formItem12}>
                      <p className="ant-form-text">{user.salary_group_name}</p>
                    </FormItem>
                  </Col>
                </Row>
              </Panel>

              <Panel
                header={<span>工资明细 <span
                  className="pull-right mr32 text-blue">实发工资:{finalSalary.toFixed(2)}元</span></span>}
                key="2">
                <Row>
                  <Col span={6}>
                    <FormItem label="发放月份" {...formItemFour}>
                      <MonthPicker
                        defaultValue={type !== 'month' ? formatter.getMomentMonth(month) : formatter.getMomentMonth(this.state.month)}
                        onChange={this.handleMonthChange}
                        disabledDate={this.disabledMonth}
                        disabled={type !== 'month'}
                        allowClear={false}
                      />
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="应到" {...formItemFour}>
                      <p className="ant-form-text">{salaryInfo.due_day}天</p>
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="实到" {...formItemFour}>
                      <p className="ant-form-text">{salaryInfo.actual_day}天</p>
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="带薪假" {...formItemFour}>
                      <p className="ant-form-text">{salaryInfo.paid_vacation}天</p>
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={6}>
                    <FormItem label="固定工资" {...formItemFour}>
                      <p className="ant-form-text">{baseSalary.toFixed(2)}</p>
                    </FormItem>
                  </Col>
                  <Col span={18}>
                    <FormItem label="固定工资标准" {...formItem12}>
                      <p className="ant-form-text">{salaryInfo.base_salary}</p>
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={6}>
                    <FormItem label="提成工资" {...formItemFour}>
                      <p className="ant-form-text">{salaryInfo.performance_salary}</p>
                    </FormItem>
                  </Col>
                  {salaryInfo.performance_salary_detail ? salaryInfo.performance_salary_detail.map((item, i) => (
                        <Col span={6} key={i}>
                          <FormItem label={`${item.item_name}`} {...formItemFour}>
                            <p className="ant-form-text">{item.amount}</p>
                          </FormItem>
                        </Col>
                      )) : ''}
                </Row>

                <Row>
                  <Col span={6}>
                    <FormItem label="绩效系数" {...formItemFour} help="请填写0-1.5之间的数">
                      {getFieldDecorator('performance_coefficient', {
                        initialValue: rate,
                        onChange: this.handleRateChange,
                      })(
                        <InputNumber
                          min={0}
                          max={1.5}
                          step={0.1}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="绩效工资" {...formItemFour}>
                      <p className="ant-form-text">{performanceSalary.toFixed(2)}</p>
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={6}>
                    <FormItem label="奖金" {...formItemFour}>
                      {getFieldDecorator('bonus', {
                        initialValue: bonus,
                        onChange: this.handleSalaryChange.bind(this, 'bonus'),
                      })(
                        <Input placeholder="奖金"/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="扣款" {...formItemFour}>
                      <p className="ant-form-text text-red">{salaryInfo.punishment}</p>
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="调整项" {...formItemFour}>
                      {getFieldDecorator('adjustment', {
                        initialValue: adjustment,
                        onChange: this.handleSalaryChange.bind(this, 'adjustment'),
                      })(
                        <Input placeholder="调整项"/>
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={8}>
                    <FormItem label="社保缴纳(个人)" {...formItemThree}>
                      <p className="ant-form-text text-red">
                        {salaryInfo.security_fund ? salaryInfo.security_fund.person_security_total : 0}
                      </p>
                    </FormItem>
                  </Col>
                  <Col span={10}>
                    <FormItem label="公积金缴纳(个人)" {...formItemThree}>
                      <p className="ant-form-text text-red">
                        {salaryInfo.security_fund ? salaryInfo.security_fund.person_provident_fund_total : 0}
                      </p>
                      <span className="ml15">
                        <SocialSecurityDetailModal
                          linkText="五险一金缴纳明细"
                          detail={salaryInfo.security_fund}
                        />
                      </span>
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="缴税" {...formItemThree}>
                      <p className="ant-form-text text-red">
                        {tax.toFixed(2)}
                      </p>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="备注" {...formItem12}>
                      {getFieldDecorator('remark')(
                        <TextArea />
                      )}
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

CalculateWageModal = Form.create()(CalculateWageModal);
export default CalculateWageModal;
