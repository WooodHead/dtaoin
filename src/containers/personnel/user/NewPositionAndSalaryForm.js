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
        message.error(validator.hasError);
        return;
      }
      values.hire_date = formatter.day(values.hire_date);
      values = this.translateBooleanValue(values);
      values.salary_group_items = JSON.stringify(this.assembleShareObjects(values));

      api.ajax({
        url: api.user.updateSalaryInfo(),
        type: 'POST',
        data: values,
      }, function () {
        message.success('更新成功!');
        this.props.cancelModal();
        location.reload();
      }.bind(this));
    });
  }

  handleDepartmentChange(departmentId) {
    this.getDepartmentRoles(departmentId);
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
    api.ajax({url: api.user.getSalaryGroups()}, function (data) {
      this.setState({salaryGroups: data.res.salary_groups});
    }.bind(this));
  }

  getDepartmentRoles(departmentId) {
    api.ajax({url: api.user.getDepartmentRoles(departmentId)}, function (data) {
      let roles = data.res.roles;
      this.setState({roles: roles});
      if (roles.length > 0) {
        this.props.form.setFieldsValue({role: roles[0]._id.toString()});
      }
    }.bind(this));
  }

  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const Panel = Collapse.Panel;
    const {formItemThree, formItemFour, formNoLabel, selectStyle} = Layout;
    const {getFieldDecorator} = this.props.form;

    let {
      isSocialSecurity,
      isProvidentFund,
      roles,
      salaryGroups,
      subItems,
    } = this.state;

    return (
      <Form horizontal>
        {getFieldDecorator('user_id', {initialValue: this.props.userId})(
          <Input type="hidden"/>
        )}

        <Collapse defaultActiveKey={['1', '2']}>
          <Panel header="岗位信息" key="1">
            <Row type="flex">
              <Col span={8}>
                <FormItem label="入职时间" {...formItemThree} required>
                  {getFieldDecorator('hire_date', {initialValue: formatter.getMomentDate()})(
                    <DatePicker/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="入职确认人" {...formItemThree} required>
                  {getFieldDecorator('hire_person', {
                    validate: [{
                      rules: [{validator: FormValidator.validateName}],
                      trigger: ['onBlur'],
                    }, {
                      rules: [{required: true, message: validator.required.notNull}],
                      trigger: 'onBlur',
                    }],
                  })(
                    <Input placeholder="入职确认人"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="部门" {...formItemThree} required>
                  {getFieldDecorator('department', {initialValue: '1'})(
                    <Select
                      onSelect={this.handleDepartmentChange}
                      {...selectStyle}>
                      {department.map((dept) => <Option key={dept.id}>{dept.name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row type="flex">
              <Col span={8}>
                <FormItem label="职位" {...formItemThree}>
                  {getFieldDecorator('role')(
                    <Select
                      {...selectStyle}
                      placeholder="请选择职位">
                      {roles.map(role => <Option key={`${role._id}`}>{role.name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
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
          </Panel>

          <Panel header="薪资信息" key="2">
            <Row>
              <Col span={8}>
                <FormItem label="固定工资" {...formItemThree} required>
                  {getFieldDecorator('base_salary', {
                    rules: [{required: true, message: validator.required.notNull}, {validator: FormValidator.notNull}],
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
        </Collapse>

        <FormItem className="center mt30 mb14">
          <Button type="ghost" className="mr15" onClick={this.handlePrevStep}>上一步</Button>
          <Button type="primary" onClick={this.handleSubmit}>提交</Button>
        </FormItem>
      </Form>
    );
  }
}

NewPositionAndSalaryForm = Form.create()(NewPositionAndSalaryForm);
export default NewPositionAndSalaryForm;
