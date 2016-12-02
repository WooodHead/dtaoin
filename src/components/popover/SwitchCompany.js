import React, {Component, PropTypes} from 'react'
import {Button} from 'antd'
import api from '../../middleware/api'

export default class SwitchCompany extends Component {
  constructor(props){
    super(props);
    this.switchCompany = this.switchCompany.bind(this)
  }

  switchCompany() {
    api.ajax({
      url: api.company.switch(),
      type: 'POST',
      data: {company_id: this.props.companyId}
    }, (data) => {
      sessionStorage.setItem('isSwitched', true);
      location.href = '/';
    })
  }

  render() {
    return (
      <Button
        className="mr15"
        size="small"
        onClick={this.switchCompany}>
        {this.props.companyName || '选择'}
      </Button>
    )
  }
}

SwitchCompany.propTypes = {
  companyId: PropTypes.string.isRequired
}