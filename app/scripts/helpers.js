'use strict';

// String helpers
/**
 * @param {string} str
 * @return {string}
 */
export let capitalize = (str) =>
    str.substr(0, 1).toUpperCase() + str.substr(1);


// DOM helpers
/**
 * @param {HTMLElement} node
 * @param {string} eventName
 * @param {function(Event)} fn
 */
export let on = (node, eventName, fn) =>
    node.addEventListener(eventName, fn, false);

/**
 * Execute a function when the DOM is ready
 * @param {function(Event)} fn
 */
export let ready = (fn) =>
    on(document, 'DOMContentLoaded', fn);

/**
 * @param {HTMLElement} node
 * @param {string} eventName
 * @param {function} fn
 */
export let off = (node, eventName, fn) =>
    node.removeEventListener(eventName, fn);

/**
 * @param {HTMLElement} node
 * @param {string} eventName
 * @param {function(Event)} fn
 */
export let one = (node, eventName, fn) => {
    let callback = function callback(e) {
        fn(e);
        off(node, eventName, callback);
    };
    on(node, eventName, callback);
};
