define([ 'react' ], function(React) {
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
            let classes = [ 'row', 'row-gutters', this.props.color ];
            if (this.props.onMove === this.props.color) {
                classes.push('on-move');
            }

            return DOM.div({ className: classes.join(' ') },
                DOM.div({ className: 'col' }, this.props.color),
                DOM.div({ className: 'col u-text-right' }, this.props.score)
            );
        }
    });
});
