import React from 'react';
import { Popover } from 'antd';

import api from '../../../middleware/api';
import text from '../../../config/text';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avatarUrl: '',
    };
  }

  componentDidMount() {
    this.getImageUrl(this.props.item.from_avatar_pic);
  }

  getImageUrl(fileType) {
    api.ajax({ url: api.system.getPublicPicUrl(fileType) }, data => {
      this.setState({ avatarUrl: data.res.url });
    });
  }

  render() {
    const { artificer } = this.props;
    const { avatarUrl } = this.state;

    const content = (
      <div>
        <div className="profile">
          <img
            src={avatarUrl}
            width={40}
            height={40}
            alt="无头像"
            style={{ cursor: 'pointer' }}
          />
          <div className="profile-content">
            <h3>{artificer.name}
              <small className="ml5">{text.gender[artificer.gender]}</small>
            </h3>
            <p>{artificer.phone}</p>
          </div>
        </div>

        <p>擅长品牌：{artificer.skilled_brand_names}</p>
        <p>所在地区：{`${artificer.province} ${artificer.city} ${artificer.country}`}</p>
        <p>入行时间：{artificer.started_work_time}</p>
      </div>
    );

    return (
      <div>
        <Popover
          title={null}
          content={content}
          trigger="click"
        >
          <img
            src={avatarUrl}
            width={40}
            height={40}
            alt="无头像"
            style={{ cursor: 'pointer' }}
          />
        </Popover>
      </div>
    );
  }
}
