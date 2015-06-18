define([ 'react', '../helpers' ], function(React, helpers) {
    'use strict';

    let DOM = React.DOM;


    return React.createClass({
        displayName: 'ScoreItem',
        propTypes: {
            color: React.PropTypes.string.isRequired,
            onMove: React.PropTypes.string,
            score: React.PropTypes.number
        },
        getDefaultProps: function() {
            return {
                onMove: 'light',
                score: 0
            };
        },
        render: function() {
            let classes = [ this.props.color ];
            if (this.props.onMove === this.props.color) {
                classes.push('on-move');
            }

            return DOM.div({ className: classes.join(' ') },
                helpers.capitalize(this.props.color) + ': ' + this.props.score
            );
        }
    });
});
