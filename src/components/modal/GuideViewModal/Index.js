import React from 'react';
import { Button, Checkbox, Modal } from 'antd';
import className from 'classnames';

require('./style.less');

/**
 * 新手引导模态框
 * @desc 现使用于模态框中表单的新手引导
 * @desc 需要模态框初始状态的宽度固定，使用相同大小的切图覆盖作为引导页
 */
export default function GuideViewModal(props) {
  const {
    visible,
    image,
    onCheck,
    onClick,
    containerStyle,
    modalWidth,
  } = props;

  const modalStyle = className({
    'ant-modal-full': true,
    [containerStyle]: !!containerStyle,
  });

  return (
    <Modal
      title=""
      visible={visible}
      width={modalWidth}
      className={modalStyle}
      footer={null}
    >
      <img src={image} alt="引导页" />

      <div className="modal-bottom-action">
        <Checkbox className="not-remind-checkbox" onChange={onCheck}>不再提醒</Checkbox>
        <Button type="primary" onClick={onClick}>我知道了</Button>
      </div>
    </Modal>
  );
}
