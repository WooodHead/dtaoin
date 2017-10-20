/**
 *@fileName:ColorSelect.js
 *@author:mrz
 *@time:下午4:28
 *@disc: 该组件是颜色选择器，TwitterPicker风格
 *
 * 传入参数 String： color 显示展示的颜色  (必须)
 *         Array： defaultColors 默认的颜色组
 *
 * 传出参数 Function： onColorChange  将选择的颜色传出 (必须)
 **/

import React from 'react';
import { TwitterPicker } from 'react-color';

export default class ColorSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colorPickerShow: true,
    };
    [
      'handleColorPickerIsShow',
      'eventListenerFun',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    document.addEventListener('click', this.eventListenerFun, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.eventListenerFun, false);
  }

  eventListenerFun() {
    this.setState({ colorPickerShow: false });
  }

  handleColorPickerIsShow(e) {
    e.nativeEvent.stopImmediatePropagation();
    this.setState({ colorPickerShow: true });
  }

  handleColorPickerClick = e => {
    e.nativeEvent.stopImmediatePropagation();
  };

  render() {
    const { colorPickerShow } = this.state;
    const { color, defaultColors } = this.props;
    return (
      <div>
        <div className="color-out" onClick={this.handleColorPickerIsShow}>
          <div className="color-in" style={{ backgroundColor: color }} />
        </div>
        <div className="color-picker" onClick={this.handleColorPickerClick}>
          {
            colorPickerShow
              ? (
                <TwitterPicker
                  onChange={this.props.onColorChange}
                  color={color}
                  colors={defaultColors}
                />
              )
              : null
          }
        </div>
      </div>
    );
  }
}

ColorSelect.defaultProps = {
  defaultColors: [
    '#FF781A',
    '#6CCF00',
    '#D0021B',
    '#4A90E2',
    '#15BD3F',
    '#21B1C8',
    '#B41F86',
    '#E85074',
    '#ABB8C4',
    '#4A4A4A'],
};
