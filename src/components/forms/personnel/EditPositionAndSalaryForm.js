import React from 'react'
import {message, Icon, Row, Col, Form, Input, DatePicker, Select, Checkbox, Radio, Button, Collapse} from 'antd'
import Layout from '../Layout'
import api from '../../../middleware/api'
import formatter from '../../../middleware/formatter'
import FormValidator from '../FormValidator'
import validator from '../../../middleware/validator'
import department from '../../../config/department'
import super_department from '../../../config/super_department'

class EditPositionAndSalaryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFirst: true,
      user: props.user,
      isTax: false,
      isSocialSecurity: false,
      isProvidentFund: false,
      roles: [],
      salaryGroups: [],
      subItems: []
    };
    [
      'handlePrevStep',
      'handleSubmit',
      'handleDepartmentChange',
      'handleSalaryGroupChange'
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    let {user} = this.props;
    this.getDepartmentRoles(user.department);
    this.getSalaryItems(user._id);
  }

  // compare this.props and nextProps to decide action
  componentWillReceiveProps(nextProps) {
    let user = nextProps.usrDetail;
    if (this.state.isFirst && user) {
      this.setState({
        isFirst: false,
        user: user,
        isTax: user.is_tax === '1',
        isSocialSecurity: user.is_social_security === '1',
        isProvidentFund: user.is_provident_fund === '1'
      });
      this.getSalaryGroups();
    }
  }

  handlePrevStep(e) {
    e.preventDefault();
    this.props.onSuccess({
      currentStep: this.props.prevStep,
      basicInfoForm: '',
      positionAndSalaryForm: 'hide'
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
        data: values
      }, function (data) {
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
    })
  }

  assembleShareObjects(formData) {
    let {subItems} = this.state;
    let salaryGroupItems = [];

    for (let i = 0; i < subItems.length; i++) {
      let idProp = `share_${i}_id`,
        valueProps = `share_${i}`;

      let shareObj = {
        item_id: formData[idProp],
        share: formData[valueProps]
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

  getSalaryItems(userId) {
    api.ajax({url: api.user.getSalaryItems(userId)}, function (data) {
      this.setState({subItems: data.res.user_salary_item_list});
    }.bind(this));
  }

  getDepartmentRoles(departmentId) {
    api.ajax({url: api.user.getDepartmentRoles(departmentId)}, function (data) {
      this.setState({roles: data.res.roles});
    }.bind(this));
  }

  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const Panel = Collapse.Panel;
    const {formItemThree, formItemFour, formNoLabel, selectStyle} = Layout;
    const {getFieldProps} = this.props.form;

    let {
      user,
      isTax,
      isSocialSecurity,
      isProvidentFund,
      roles,
      salaryGroups,
      subItems
    } = this.state;

    const hirePerson = getFieldProps('hire_person', {
      initialValue: user.hire_person,
      validate: [{
        rules: [{validator: FormValidator.validateName}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.notNull}],
        trigger: 'onBlur'
      }]
    });

    const baseSalaryProps = getFieldProps('base_salary', {
      initialValue: user.base_salary,
      validate: [{
        rules: [{validator: FormValidator.notNull}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.notNull}],
        trigger: 'onBlur'
      }]
    });

    const salaryGroupProps = getFieldProps('salary_group', {
      initialValue: user.salary_group,
      validate: [{
        rules: [{validator: FormValidator.notNull}],
        trigger: ['onBlur']
      }, {
        rules: [{required: true, message: validator.required.notNull}],
        trigger: 'onBlur'
      }]
    });

    const {company_id} = App.session;
    let department = (company_id === '1') ? super_department : department;

    return (
      <Form horizontal >
        <Input type="hidden" {...getFieldProps('user_id', {initialValue: user._id})}/>

        <Collapse defaultActiveKey={['1', '2']}>
          <Panel header="岗位信息" key="1">
            <Row type="flex">
              <Col span="8">
                <FormItem label="入职时间" {...formItemThree} required>
                  <DatePicker {...getFieldProps('hire_date', {initialValue: user.hire_date})}/>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="入职确认人" {...formItemThree} required>
                  <Input {...hirePerson}/>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="部门" {...formItemThree} required>
                  <Select
                    onSelect={this.handleDepartmentChange}
                    {...getFieldProps('department', {initialValue: user.department})}
                    {...selectStyle}>
                    {department.map((dept) => <Option key={dept.id}>{dept.name}</Option>)}
                  </Select>
                </FormItem>
              </Col>
            </Row>

            <Row type="flex">
              <Col span="8">
                <FormItem label="职位" {...formItemThree}>
                  <Select
                    {...getFieldProps('role', {initialValue: user.role})}
                    {...selectStyle}
                    placeholder="请选择职位">
                    {roles.map(role => <Option key={`${role._id}`}>{role.name}</Option>)}
                  </Select>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="职位等级" {...formItemThree}>
                  <Select
                    {...getFieldProps('level', {initialValue: user.level})}
                    {...selectStyle}
                    disabled={true}>
                    <Option key="1">T1</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="提成类型" {...formItemThree}>
                  <Select
                    {...getFieldProps('salary_type', {initialValue: user.salary_type})}
                    {...selectStyle}
                    disabled={true}>
                    <Option key="1">销售提成</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Panel>

          <Panel header="薪资信息" key="2">
            <Row>
              <Col span="8">
                <FormItem label="固定工资" {...formItemThree} required>
                  <Input
                    {...baseSalaryProps}
                    addonAfter="元"
                    placeholder="请输入固定工资"
                  />
                </FormItem>
              </Col>
            </Row>

            <Row type="flex">
              <Col span="4" offset="2">
                <FormItem label={null} {...formNoLabel}>
                  <Checkbox
                    checked={isTax}
                    {...getFieldProps('is_tax', {
                      onChange: this.handleCheckboxChange.bind(this, 'isTax')
                    })}>
                    缴税
                  </Checkbox>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label={null} {...formNoLabel}>
                  <Checkbox
                    checked={isSocialSecurity}
                    {...getFieldProps('is_social_security', {
                      onChange: this.handleCheckboxChange.bind(this, 'isSocialSecurity')
                    })}>
                    缴纳社保
                  </Checkbox>
                  <Input
                    className={isSocialSecurity ? '' : 'hide'}
                    {...getFieldProps('social_security_base', {initialValue: user.social_security_base})}
                  />
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label={null} {...formNoLabel}>
                  <Checkbox
                    checked={isProvidentFund}
                    {...getFieldProps('is_provident_fund', {
                      onChange: this.handleCheckboxChange.bind(this, 'isProvidentFund')
                    })}>
                    公积金
                  </Checkbox>
                  <Input
                    className={isProvidentFund ? '' : 'hide'}
                    {...getFieldProps('provident_fund_base', {initialValue: user.provident_fund_base})}
                  />
                </FormItem>
              </Col>
            </Row>

            <Row type="flex">
              <Col span="8">
                <FormItem label="薪资组" {...formItemThree} required>
                  <Select
                    onSelect={this.handleSalaryGroupChange}
                    {...salaryGroupProps}
                    {...selectStyle}
                    placeholder="请选择薪资组">
                    {salaryGroups.map(group => <Option key={group._id}>{group.name}</Option>)}
                  </Select>
                </FormItem>
              </Col>
            </Row>

            {
              subItems.map((item, index) => {
                return (
                  <Row type="flex" key={item._id}>
                    <Col span="8">
                      <FormItem label={`提成项目${index+1}`} {...formItemFour}>
                        <p
                          className="ant-form-text"
                          {...getFieldProps(`share_${index}_id`, {initialValue: item.item_id || item._id})}>
                          {item.item_name || item.name}
                        </p>
                      </FormItem>
                    </Col>
                    <Col span="6">
                      <FormItem label="提成占比" {...formItemFour}>
                        <Input {...getFieldProps(`share_${index}`, {initialValue: item.share || 0})}
                          placeholder="提成占比"/>
                      </FormItem>
                    </Col>
                  </Row>
                )
              })
            }
          </Panel>
        </Collapse>

        <FormItem className="center mt30 mb14">
          <Button type="ghost" className="mr15" onClick={this.handlePrevStep}>上一步</Button>
          <Button type="primary" onClick={this.handleSubmit}>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

EditPositionAndSalaryForm = Form.create()(EditPositionAndSalaryForm);
export default EditPositionAndSalaryForm