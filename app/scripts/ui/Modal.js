'use strict';

import React from 'react';

let DOM = React.DOM;


export default class Modal extends React.Component {
    render() {
        return DOM.div(
            {
                className: 'modal',
                tabIndex: -1,
                role: 'dialog',
                hidden: !this.props.visible
            },
            DOM.div({ className: 'modal-content' }, this.props.children)
        );
    }
}

Modal.propTypes = {
    isVisible: React.PropTypes.bool
};

Modal.defaultProps = {
    isVisible: false
};
