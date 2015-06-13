define([ 'react' ], function(React) {
    'use strict';

    let DOM = React.DOM;

    const EMPTY_DISK = 0;
    const LIGHT_DISK = 1;
    const DARK_DISK = 2;


    return React.createClass({
        displayName: 'BoardCell',
        getDefaultProps: function() {
            return {
                value: EMPTY_DISK
            };
        },
        propTypes: {
            value: React.PropTypes.oneOf([ EMPTY_DISK, LIGHT_DISK, DARK_DISK ])
        },
        render: function() {
            let disk;
            switch (this.props.value) {
            case EMPTY_DISK:
                disk = '';
                break;
            case LIGHT_DISK:
                disk = 'light';
                break;
            case DARK_DISK:
                disk = 'dark';
                break;
            }

            return DOM.div({ className: 'col', 'data-disk': disk });
        }
    });
});
