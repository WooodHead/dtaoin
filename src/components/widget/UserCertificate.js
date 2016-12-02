import React from 'react'
import {Row, Col} from 'antd'

const UserCertificate = React.createClass({
  render () {
    return (
      <Row>
        <Col span="8">
          <Input type="hidden" {...getFieldProps('_id', {initialValue: userCaId})}/>
          <FormItem label="名称" {...formItemFour}>
            <Input {...getFieldProps('name')} placeholder="请输入证书名称"/>
          </FormItem>
        </Col>
        <Col span="8">
          <Input type="hidden" {...getFieldProps('user_certificate_pic_key')} />
        </Col>
      </Row>
    )
  }
});

UserCertificate.defaultProps = {};

export default UserCertificate;
