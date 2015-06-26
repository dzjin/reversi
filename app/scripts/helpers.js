'use strict';

/**
 * @param {string} str
 * @return {string}
 */
export let capitalize = function(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
};
