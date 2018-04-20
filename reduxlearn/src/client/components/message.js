/**
 * Created by liuxiaofan on 2017/1/5.
 */
import React, { PropTypes } from 'react';

const Message = ({ message }) => <div>{message}</div>;

Message.propTypes = {
    message: PropTypes.string.isRequired,
};

export default Message;