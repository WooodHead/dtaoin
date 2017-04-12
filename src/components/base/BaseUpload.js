import React from 'react';
import {Icon} from 'antd';
import api from '../../middleware/api';
import text from '../../config/text';
import imgLoadingFailed from '../../images/imgLoadingFailed.jpg';


export default class UploadComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  handleKey(fileType, value) {
    let propKey = fileType + '_key';
    this.setState({[propKey]: value});
  }

  getToken(url, fileType) {
    api.ajax({url: url}, (data) => {
      let propToken = fileType + '_token',
        propKey = fileType + '_key',
        response = data.res;

      this.setState({
        [propToken]: response.token,
        [propKey]: response.file_name,
      });
    });
  }

  getPrivateToken(fileType) {
    api.ajax({
      url: api.system.getPrivatePicUploadToken(fileType),
    }, (data) => {
      let propToken = fileType + '_token',
        propKey = fileType + '_key',
        response = data.res;

      this.setState({
        [propToken]: response.token,
        [propKey]: response.file_name,
      });
    });
  }

  getImageUrl(url, fileType) {
    api.ajax({url: url}, (data) => {
      let imgUrl = fileType + '_url';
      this.setState({[imgUrl]: data.res.url});
    });
  }

  getPrivateImageUrl(fileType, fileKey) {
    api.ajax({url: api.system.getPrivatePicUrl(fileKey)}, (data) => {
      let imgUrl = fileType + '_url';
      this.setState({[imgUrl]: data.res.url});
    });
  }

  onUpload(...args) {
    let fileType = args[0],
      files = args[1],
      progPropName = fileType + '_progress',
      keyPropName = fileType + '_key',
      progress = {},
      self = this;

    files.map(function (file) {
      file.onprogress = (e) => {
        progress[file.preview] = e.percent;
        self.setState({[progPropName]: progress});
        if (e.percent === 100) {
          // 上传成功后,保存对应的值
          // console.info('save uploaded file key=>', self.state[keyPropName]);
          self.props.form.setFieldsValue({[fileType]: self.state[keyPropName]});
        }
      };
    });
  }

  onDrop(...args) {
    let fileType = args[0],
      files = args[1],
      filePropName = fileType + '_files';

    this.setState({[filePropName]: files});
  }

  handleImgError(e) {
    //获取当前是第几张图片
    e.target.src = imgLoadingFailed;
    e.target.style.width = '80px';
    e.target.style.height = '80px';
    e.target.onerror = null;
  }

  renderImage(fileType) {
    let filesPropName = fileType + '_files',
      progPropName = fileType + '_progress',
      imgUrlName = fileType + '_url';

    let files = this.state[filesPropName],
      progress = this.state[progPropName],
      imgUrl = this.state[imgUrlName];

    if (files.length <= 0) {
      if (imgUrl) {
        return <img src={imgUrl} style={{height: '90%', width: '90%'}} onError={this.handleImgError.bind(this)}/>;
      } else {
        return (
          <span className="ant-upload-select-picture-card">
            <Icon type="cloud-upload-o"/>
            <div className="ant-upload-text">{text.imageLabel[fileType]}</div>
          </span>
        );
      }
    }

    return (
      <div className="center">
        {[].map.call(files, function (file, i) {
          let preview = '';
          let uploadProgress = Math.round(progress && progress[file.preview]);

          if (/image/.test(file.type)) {
            preview = <img src={file.preview} style={{height: '90%', width: '90%'}}/>;
          }
          return <span key={i}>{preview} <span
            className="progress">{'已上传' + (uploadProgress || 0) + '%'}</span></span>;
        })}
      </div>
    );
  }
}
