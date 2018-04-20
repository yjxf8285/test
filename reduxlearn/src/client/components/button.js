/**
 * Created by liuxiaofan on 2017/1/5.
 */
import React, {PropTypes} from 'react';

const Button = ({action, actionLabel}) => <button onClick={action}>{actionLabel}</button>;
Button.propTypes = {
    action: PropTypes.func.isRequired,
    actionLabel: PropTypes.string.isRequired,
};

export default Button;