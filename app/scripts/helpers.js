define(function() {
    'use strict';

    /**
     * @param {string} str
     * @return {string}
     */
    var capitalize = function(str) {
        return str.substr(0, 1).toUpperCase() + str.substr(1);
    };

    return { capitalize };
});

