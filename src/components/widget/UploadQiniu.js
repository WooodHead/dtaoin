const React = require('react');
const request = require('superagent-bluebird-promise');

import api from '../../middleware/api';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

const isFunction = function (fn) {
  const getType = {};
  return fn && getType.toString.call(fn) === '[object Function]';
};

const ReactQiniu = createReactClass({
  // based on https://github.com/paramaggarwal/react-dropzone
  propTypes: {
    saveKey: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    // token: React.PropTypes.string.isRequired,
    // called before upload to set callback to files
    onUpload: PropTypes.func,
    // size: React.PropTypes.number,
    style: PropTypes.object,
    supportClick: PropTypes.bool,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
    // Qiniu
    // uploadUrl: React.PropTypes.string,
    // key: React.PropTypes.string,
    prefix: PropTypes.string,
  },

  getDefaultProps () {
    return {
      supportClick: true,
      multiple: true,
      className: 'ant-upload',
    };
  },

  getInitialState () {
    return {
      isFirst: true,
      isDragActive: false,
      uploadUrl: api.system.uploadURl,
      key: '',
      token: '',
    };
  },

  onDragLeave () {
    this.setState({
      isDragActive: false,
    });
  },

  onDragOver (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

    this.setState({
      isDragActive: true,
    });
  },

  onDrop (e) {
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

    const maxFiles = (this.props.multiple) ? files.length : 1;

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

  onClick () {
    if (this.props.supportClick) {
      if (this.state.isFirst) {
        api.ajax({ url: this.props.source }, data => {
          const res = data.res;
          this.setState({
            isFirst: false,
            key: res.file_name,
            token: res.token,
          });
        });
      } else {
        this.open();
      }
    }
  },

  open () {
    const fileInput = this.refs.fileInput;
    fileInput.value = null;
    fileInput.click();
  },

  upload (file) {
    if (!file || file.size === 0) return null;
    const r = request
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

  render () {
    let className = this.props.className || 'dropzone';
    if (this.state.isDragActive) {
      className += ' active';
    }

    const style = this.props.style || {
      width: this.props.size || 80,
      height: this.props.size || 80,
      borderStyle: this.state.isDragActive ? 'solid' : 'dashed',
    };

    return (
      React.createElement('div', {
        className,
        style,
        onClick: this.onClick,
        onDragLeave: this.onDragLeave,
        onDragOver: this.onDragOver,
        onDrop: this.onDrop,
      },
        React.createElement('input', {
          style: { display: 'none' },
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
