import React from 'react';
import {message, Row, Col, Form, Input, DatePicker, Select, Checkbox, Button, Collapse} from 'antd';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';
import FormValidator from '../../../utils/FormValidator';
import validator from '../../../utils/validator';
import department from '../../../config/department';

class NewPositionAndSalaryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: true,
      isSocialSecurity: false,
      isProvidentFund: false,
      roles: [],
      salaryGroups: [],
      subItems: [],
    };

    [
      'handlePrevStep',
      'handleSubmit',
      'handleDepartmentChange',
      'handlePositionChange',
      'handleSalaryGroupChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getSalaryGroups();
    this.getDepartmentRoles(1);
  }

  handlePrevStep(e) {
    e.preventDefault();
    this.props.onSuccess({
      currentStep: this.props.prevStep,
      basicInfoForm: '',
      positionAndSalaryForm: 'hide',
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }
      values.hire_date = formatter.day(values.hire_date);

      api.ajax({
        url: api.user.updateSalaryInfo(),
        type: 'POST',
        data: values,
      }, () => {
        message.success('更新成功!');
        this.props.onSuccess();
      });
    });
  }

  handleDepartmentChange(departmentId) {
    this.getDepartmentRoles(departmentId);
  }

  handlePositionChange(roleId) {
    this.props.updateState({roleId});
  }

  handleCheckboxChange(type, e) {
    this.setState({[type]: e.target.checked});
  }

  handleSalaryGroupChange(groupId) {
    let {salaryGroups} = this.state;
    salaryGroups.map(group => {
      if (group._id === groupId) {
        this.setState({subItems: group.items});
      }
    });
  }

  assembleShareObjects(formData) {
    let {subItems} = this.state;
    let salaryGroupItems = [];

    for (let i = 0; i < subItems.length; i++) {
      let idProp = `share_${i}_id`,
        valueProps = `share_${i}`;

      let shareObj = {
        item_id: formData[idProp],
        share: formData[valueProps],
      };
      // delete useless data
      delete formData[idProp];
      delete formData[valueProps];

      salaryGroupItems.push(shareObj);
    }
    return salaryGroupItems;
  }

  translateBooleanValue(formData) {
    let {isTax, isSocialSecurity, isProvidentFund} = this.state;
    isTax ? formData.is_tax = 1 : formData.is_tax = 0;
    isSocialSecurity ? formData.is_social_security = 1 : formData.is_social_security = 0;
    isProvidentFund ? formData.is_provident_fund = 1 : formData.is_provident_fund = 0;
    return formData;
  }

  getSalaryGroups() {
    api.ajax({url: api.user.getSalaryGroups()}, (data) => {
      this.setState({salaryGroups: data.res.salary_groups});
    });
  }

  getDepartmentRoles(departmentId) {
    api.ajax({url: api.user.getDepartmentRoles(departmentId)}, (data) => {
      let {roles} = data.res;
      this.setState({roles: roles});
      if (roles.length > 0) {
        let firstRoleId = String(roles[0]._id);
        this.props.form.setFieldsValue({role: firstRoleId});
        this.props.updateState({roleId: firstRoleId});
      }
    });
  }

  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const Panel = Collapse.Panel;
    const {formItemThree, formItemFour, formNoLabel, formItem8_15, selectStyle} = Layout;
    const {getFieldDecorator} = this.props.form;

    let {
      isSocialSecurity,
      isProvidentFund,
      roles,
      salaryGroups,
      subItems,
    } = this.state;

    return (
      <Form className="form-collapse">
        {getFieldDecorator('user_id', {initialValue: this.props.userId})(
          <Input type="hidden"/>
        )}

        <Collapse defaultActiveKey={['1', '2']}>
          <Panel header="岗位及薪资信息" key="1">
            <Row>
              <Col span={12}>
                <FormItem label="入职时间" {...formItem8_15} required>
                  {getFieldDecorator('hire_date', {initialValue: formatter.getMomentDate()})(
                    <DatePicker allowClear={false}/>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="入职确认人" {...formItem8_15}>
                  {getFieldDecorator('hire_person', {
                    rules: FormValidator.getRuleNotNull(),
                    validatorTrigger: 'onBlur',
                  })(
                    <Input placeholder="入职确认人"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="部门" {...formItem8_15}>
                  {getFieldDecorator('department', {
                    initialValue: '1',
                    rules: FormValidator.getRuleNotNull(),
                    validatorTrigger: 'onBlur',
                  })(
                    <Select
                      onSelect={this.handleDepartmentChange}
                      {...selectStyle}>
                      {department.map((dept) => <Option key={dept.id}>{dept.name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="职位" {...formItem8_15}>
                  {getFieldDecorator('role')(
                    <Select {...selectStyle} onChange={this.handlePositionChange} placeholder="请选择职位">
                      {roles.map(role => <Option key={role._id}>{role.name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            {false && (
              <Row>
                <Col span={8}>
                  <FormItem label="职位等级" {...formItemThree}>
                    {getFieldDecorator('level', {initialValue: '1'})(
                      <Select
                        {...selectStyle}
                        disabled={true}>
                        <Option key="1">T1</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="提成类型" {...formItemThree}>
                    {getFieldDecorator('salary_type', {initialValue: '1'})(
                      <Select
                        {...selectStyle}
                        disabled={true}>
                        <Option key="1">销售提成</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            )}

            <Row>
              <Col span={12}>
                <FormItem label="固定工资" {...formItem8_15}>
                  {getFieldDecorator('base_salary', {
                    rules: FormValidator.getRuleNotNull(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input addonAfter="元" placeholder="请输入固定工资"/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Panel>

          {/*v2 暂不提供一下信息*/}
          {false && (
            <Panel header="薪资信息" key="2">
              <Row>
                <Col span={8}>
                  <FormItem label="固定工资" {...formItemThree} required>
                    {getFieldDecorator('base_salary', {
                      rules: FormValidator.getRuleNotNull(),
                      validateTrigger: 'onBlur',
                    })(
                      <Input addonAfter="元" placeholder="请输入固定工资"/>
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row type="flex">
                <Col span={4} offset={2}>
                  <FormItem label={null} {...formNoLabel}>
                    {getFieldDecorator('is_tax')(
                      <Checkbox>缴税</Checkbox>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label={null} {...formNoLabel}>
                    {getFieldDecorator('is_social_security', {
                      initialValue: isSocialSecurity,
                      onChange: this.handleCheckboxChange.bind(this, 'isSocialSecurity'),
                    })(
                      <Checkbox>
                        缴纳社保
                      </Checkbox>
                    )}
                    {getFieldDecorator('social_security_base')(
                      <Input
                        className={isSocialSecurity ? '' : 'hide'}
                        placeholder="请填写缴纳基数"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label={null} {...formNoLabel}>
                    {getFieldDecorator('is_provident_fund', {
                      initialValue: isProvidentFund,
                      onChange: this.handleCheckboxChange.bind(this, 'isProvidentFund'),
                    })(
                      <Checkbox>
                        公积金
                      </Checkbox>
                    )}
                    {getFieldDecorator('provident_fund_base')(
                      <Input
                        className={isProvidentFund ? '' : 'hide'}
                        placeholder="请填写缴纳基数"
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row type="flex">
                <Col span={8}>
                  <FormItem label="薪资组" {...formItemThree} required>
                    {getFieldDecorator('salary_group', {
                      validate: [{
                        rules: [{validator: FormValidator.notNull}],
                        trigger: ['onBlur'],
                      }, {
                        rules: [{required: true, message: validator.required.notNull}],
                        trigger: 'onBlur',
                      }],
                    })(
                      <Select
                        onSelect={this.handleSalaryGroupChange}
                        {...selectStyle}
                        placeholder="请选择薪资组">
                        {salaryGroups.map(group => <Option key={group._id}>{group.name}</Option>)}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>

              {
                subItems.map((item, index) => {
                  return (
                    <Row type="flex" key={item._id}>
                      <Col span={8}>
                        <FormItem label={`提成项目${index + 1}`} {...formItemFour}>
                          {getFieldDecorator(`share_${index}_id`, {initialValue: item._id})(
                            <p className="ant-form-text">
                              {item.name}
                            </p>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={6}>
                        <FormItem label="提成占比" {...formItemFour}>
                          {getFieldDecorator(`share_${index}`, {initialValue: 0})(
                            <Input placeholder="提成占比"/>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  );
                })
              }
            </Panel>
          )}
        </Collapse>

        <div className="form-action-container">
          <Button size="large" type="primary" className="mr10" onClick={this.handleSubmit}>提交</Button>
          <Button size="large" type="ghost" onClick={this.props.cancelModal}>取消</Button>
        </div>
      </Form>
    );
  }
}

NewPositionAndSalaryForm = Form.create()(NewPositionAndSalaryForm);
export default NewPositionAndSalaryForm;
