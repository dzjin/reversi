define([ 'react', './Score', './Board' ], function(React, Score, Board) {
    'use strict';

    let DOM = React.DOM;

    const EMPTY_DISK = 0;
    const LIGHT_DISK = 1;
    const DARK_DISK = 2;

    /**
     * @param {number} size
     */
    let createEmptyArray = function(size) {
        return Array.apply(null, { length: size });
    };

    /**
     * @param {number} size
     */
    let createInitialBoard = function(size) {
        let disks = createEmptyArray(size).
            map(() =>
                createEmptyArray(size).fill(EMPTY_DISK)
            );

        let center = Math.floor((size - 1) / 2);

        disks[center][center] = LIGHT_DISK;
        disks[center][center + 1] = DARK_DISK;
        disks[center + 1][center] = DARK_DISK;
        disks[center + 1][center + 1] = LIGHT_DISK;

        return disks;
    };


    return React.createClass({
        displayName: 'ReversiApp',
        getInitialState: function() {
            return {
                onMove: 'light',
                scores: { light: 2, dark: 2 },
                disks: createInitialBoard(this.props.size)
            };
        },
        propTypes: {
            size: React.PropTypes.number.isRequired
        },
        render: function() {
            return DOM.div(null,
                React.createElement(Score, {
                    onMove: this.state.onMove,
                    scores: this.state.scores
                }),
                DOM.div({ className: 'container' },
                    React.createElement(Board, {
                        size: this.props.size,
                        disks: this.state.disks
                    })
                )
            );
        }
    });
});
