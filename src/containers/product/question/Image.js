import React from 'react';

import api from '../../../middleware/api';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avatarUrl: '',
    };
  }

  componentDidMount() {
    const { fileType } = this.props;
    if (fileType) {
      this.getImageUrl(fileType);
    }
  }

  getImageUrl(fileType) {
    api.ajax({ url: api.system.getPublicPicUrl(fileType) }, data => {
      this.setState({ avatarUrl: data.res.url });
    });
  }

  render() {
    return (
      <img
        src={this.state.avatarUrl}
        alt="无头像"
        className="avatar"
        style={{ width: 40, height: 40, cursor: 'pointer' }}
      />
    );
  }
}
