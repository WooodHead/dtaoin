let React = require('react');
let request = require('superagent-bluebird-promise');

import api from '../../middleware/api';

let isFunction = function (fn) {
  let getType = {};
  return fn && getType.toString.call(fn) === '[object Function]';
};

let ReactQiniu = React.createClass({
  // based on https://github.com/paramaggarwal/react-dropzone
  propTypes: {
    saveKey: React.PropTypes.func.isRequired,
    onDrop: React.PropTypes.func.isRequired,
    // token: React.PropTypes.string.isRequired,
    // called before upload to set callback to files
    onUpload: React.PropTypes.func,
    // size: React.PropTypes.number,
    style: React.PropTypes.object,
    supportClick: React.PropTypes.bool,
    accept: React.PropTypes.string,
    multiple: React.PropTypes.bool,
    // Qiniu
    // uploadUrl: React.PropTypes.string,
    // key: React.PropTypes.string,
    prefix: React.PropTypes.string,
  },

  getDefaultProps: function () {
    return {
      supportClick: true,
      multiple: true,
      className: 'ant-upload',
    };
  },

  getInitialState: function () {
    return {
      isFirst: true,
      isDragActive: false,
      uploadUrl: api.system.uploadURl,
      key: '',
      token: '',
    };
  },

  onDragLeave: function () {
    this.setState({
      isDragActive: false,
    });
  },

  onDragOver: function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

    this.setState({
      isDragActive: true,
    });
  },

  onDrop: function (e) {
    e.preventDefault();

    this.setState({
      isDragActive: false,
    });

    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    let maxFiles = (this.props.multiple) ? files.length : 1;

    if (this.props.onUpload) {
      files = Array.prototype.slice.call(files, 0, maxFiles);
      this.props.onUpload(files, e);
    }

    for (let i = 0; i < maxFiles; i++) {
      files[i].preview = URL.createObjectURL(files[i]);
      files[i].request = this.upload(files[i]);
      files[i].uploadPromise = files[i].request.promise();
    }

    if (this.props.onDrop) {
      files = Array.prototype.slice.call(files, 0, maxFiles);
      this.props.onDrop(files, e);
    }
  },

  onClick: function () {
    if (this.props.supportClick) {
      if (this.state.isFirst) {
        api.ajax({url: this.props.source}, function (data) {
          let res = data.res;
          this.setState({
            isFirst: false,
            key: res.file_name,
            token: res.token,
          });
        }.bind(this));
      } else {
        this.open();
      }
    }
  },

  open: function () {
    let fileInput = this.refs.fileInput;
    fileInput.value = null;
    fileInput.click();
  },

  upload: function (file) {
    if (!file || file.size === 0) return null;
    let r = request
      .post(this.state.uploadUrl)
      .field('key', this.state.key)
      .field('token', this.state.token)
      .field('x:filename', file.name)
      .field('x:size', file.size)
      .attach('file', file, file.name)
      .set('Accept', 'application/json');
    if (isFunction(file.onprogress)) {
      r.on('progress', file.onprogress);
    }
    this.props.saveKey(this.props.prefix, this.state.key);
    return r;
  },

  render: function () {
    let className = this.props.className || 'dropzone';
    if (this.state.isDragActive) {
      className += ' active';
    }

    let style = this.props.style || {
        width: this.props.size || 80,
        height: this.props.size || 80,
        borderStyle: this.state.isDragActive ? 'solid' : 'dashed',
      };

    return (
      React.createElement('div', {
          className: className,
          style: style,
          onClick: this.onClick,
          onDragLeave: this.onDragLeave,
          onDragOver: this.onDragOver,
          onDrop: this.onDrop,
        },
        React.createElement('input', {
          style: {display: 'none'},
          type: 'file',
          multiple: this.props.multiple,
          ref: 'fileInput',
          onChange: this.onDrop,
          accept: this.props.accept,
        }),
        this.props.children
      )
    );
  },
});

export default ReactQiniu;
