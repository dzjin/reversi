'use strict';

import React from 'react';

let DOM = React.DOM;


const Modal = function({ isVisible, children }) {
    return DOM.div(
        {
            className: 'modal',
            tabIndex: -1,
            role: 'dialog',
            hidden: !isVisible
        },
        DOM.div({ className: 'modal-content' }, children)
    );
};

Modal.propTypes = {
    isVisible: React.PropTypes.bool
};

Modal.defaultProps = {
    isVisible: false
};

export default Modal;
