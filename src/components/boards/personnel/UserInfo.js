import React from 'react'
import {Card, Row, Col} from 'antd'
import text from '../../../middleware/text'
import api from '../../../middleware/api'
import EditUserModal from '../../../components/modals/personnel/EditUserModal'
import ImagePreview from '../../modals/ImagePreview'

export default class UserInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      user,
      certificates,
      salaryItems
    } = this.props;

    let idCardImages = [];
    if(user.id_card_front_pic){
      idCardImages.push({
        title: `${user.name}-身份证正面`,
        url: api.user.getFileUrl(user._id, 'id_card_front_pic')
      });
    }
    if(user.id_card_back_pic){
      idCardImages.push({
        title: `${user.name}-身份证背面`,
        url: api.user.getFileUrl(user._id, 'id_card_back_pic')
      });
    }

    return (
      <div>
        <Card title="员工信息" extra={<EditUserModal user={user} />} className="mb15">
          <h3 className="mb15">基本信息</h3>
          <Row className="mb10">
            <Col span="8">
              <span className="info-label">姓名</span>
              <span>{user.name}</span>
            </Col>
            <Col span="8">
              <span className="info-label">性别</span>
              <span>{text.gender[user.gender]}</span>
            </Col>
            <Col span="8">
              <span className="info-label">编号</span>
              <span>{user._id}</span>
            </Col>
          </Row>
          <Row className="mb10">
            <Col span="8">
              <span className="info-label">手机号</span>
              <span>{user.phone}</span>
            </Col>
            <Col span="16">
              <span className="info-label">身份证号</span>
              <span>{user.id_card}</span>
            </Col>
          </Row>
          <Row className="mb10">
            <Col span="8">
              <span className="info-label">紧急联系人</span>
              <span>{user.emergency_contact}</span>
            </Col>
            <Col span="16">
              <span className="info-label">紧急联系人电话</span>
              <span>{user.emergency_phone}</span>
            </Col>
          </Row>
          <Row className="mb10">
            <Col span="8">
              <span className="info-label">民族</span>
              <span>{user.nation}</span>
            </Col>
            <Col span="16">
              <span className="info-label">籍贯</span>
              <span>{user.native_place}</span>
            </Col>
          </Row>
          <Row className="mb10">
            <Col span="8">
              <span className="info-label">学历</span>
              <span>{user.degree}</span>
            </Col>
            <Col span="8">
              <span className="info-label">学校</span>
              <span>{user.school}</span>
            </Col>
            <Col span="8">
              <span className="info-label">专业</span>
              <span>{user.major}</span>
            </Col>
          </Row>
          <Row className="mb10 with-bottom-border">
            <Col span="8">
              <span className="info-label">邮箱</span>
              <span>{user.email}</span>
            </Col>
            <Col span="16">
              <span className="info-label">通讯地址</span>
              <span>{user.address}</span>
            </Col>
          </Row>

          <h3 className="mb15">资格证书</h3>
          {certificates.map((ca, index) => {
            return (
              <Row className={certificates.length -1 == index ? 'mb15 with-bottom-border' : 'mb10'} key={index}>
                <Col span="8">
                  <span className="info-label">证书名称</span>
                  <span>{ca.name}</span>
                </Col>
                <Col span="8">
                  <span className="info-label">资格证书</span>
                  <ImagePreview
                    title="资格证书"
                    images={[{
                      title: `${user.name}-资格证书-${ca.name}`,
                      url: api.user.getCaFileUrl(ca._id, 'user_certificate_pic')
                    }]}
                    disabled={!ca.user_certificate_pic}
                  />
                </Col>
              </Row>
            )
          })}

          <Row className="mb10">
            <Col span="8">
              <span className="info-label">身份证</span>
              <ImagePreview
                title="身份证"
                images={idCardImages}
                disabled={!user.id_card_front_pic}
              />
            </Col>
          </Row>

          <Row className="mb10">
            <Col span="8">
              <span className="info-label">个人信息登记表</span>
              <ImagePreview
                title="个人信息登记表"
                images={[{
                  title: `${user.name}-个人信息登记表`,
                  url: api.user.getFileUrl(user._id, 'registry_form_pic')
                }]}
                disabled={!user.registry_form_pic}
              />
            </Col>
            <Col span="8">
              <span className="info-label">一寸证件照</span>
              <ImagePreview
                title="一寸证件照"
                images={[{
                  title: `${user.name}-一寸证件照`,
                  url: api.user.getFileUrl(user._id, 'id_photo_pic')
                }]}
                disabled={!user.id_photo_pic}
              />
            </Col>
            <Col span="8">
              <span className="info-label">体检表</span>
              <ImagePreview
                title="体检表"
                images={[{
                  title: `${user.name}-体检表`,
                  url: api.user.getFileUrl(user._id, 'health_form_pic')
                }]}
                disabled={!user.health_form_pic}
              />
            </Col>
          </Row>
          <Row className="mb10">
            <Col span="8">
              <span className="info-label">劳动合同</span>
              <ImagePreview
                title="劳动合同"
                images={[{
                  title: `${user.name}-劳动合同`,
                  url: api.user.getFileUrl(user._id, 'labor_contract_pic')
                }]}
                disabled={!user.labor_contract_pic}
              />
            </Col>
            <Col span="8">
              <span className="info-label">原单位离职证明</span>
              <ImagePreview
                title="原单位离职证明"
                images={[{
                  title: `${user.name}-原单位离职证明`,
                  url: api.user.getFileUrl(user._id, 'leaving_certificate_pic')
                }]}
                disabled={!user.leaving_certificate_pic}
              />
            </Col>
            <Col span="8">
              <span className="info-label">工资卡</span>
              <ImagePreview
                title="工资卡"
                images={[{
                  title: `${user.name}-工资卡`,
                  url: api.user.getFileUrl(user._id, 'pay_card_pic')
                }]}
                disabled={!user.pay_card_pic}
              />
            </Col>
          </Row>
        </Card>

        <Card title="岗位及薪资信息">
          <Row className="mb10">
            <Col span="8">
              <span className="info-label">区域</span>
              <span>{user.company_region}</span>
            </Col>
            <Col span="8">
              <span className="info-label">门店</span>
              <span>{user.company_name}</span>
            </Col>
            <Col span="8">
              <span className="info-label">部门</span>
              <span>{user.department_name}</span>
            </Col>
          </Row>
          <Row className="mb10">
            <Col span="8">
              <span className="info-label">职位</span>
              <span>{user.role_name}</span>
            </Col>
            <Col span="8">
              <span className="info-label">职位级别</span>
              <span>{user.level}</span>
            </Col>
            <Col span="8">
              <span className="info-label">入职时间</span>
              <span>{user.hire_date}</span>
            </Col>
          </Row>
          <Row className="mb10">
            <Col span="8">
              <span className="info-label">入职确认人</span>
              <span>{user.hire_person}</span>
            </Col>
            <Col span="8">
              <span className="info-label">离职时间</span>
              <span>{user.fire_date}</span>
            </Col>
            <Col span="8">
              <span className="info-label">固定工资</span>
              <span>{user.base_salary}</span>
            </Col>
          </Row>
          <Row className="mb10">
            <Col span="8">
              <span className="info-label">提成类型</span>
              <span>{user.salary_type}</span>
            </Col>
            <Col span="8">
              <span className="info-label">薪资组</span>
              <span>{user.salary_group_name || user.salary_group}</span>
            </Col>
          </Row>

          {salaryItems.map((item, index) => {
            return (
              <Row className="mb10" key={index}>
                <Col span="8">
                  <span className="info-label">{`提成项目${index + 1}`}</span>
                  <span>{item.item_name}</span>
                </Col>
                <Col span="8">
                  <span className="info-label">提成比例</span>
                  <span>{(Number(item.percent) * 100).toFixed(2)}%</span>
                </Col>
              </Row>
            )
          })}
        </Card>
      </div>
    )
  }
}
