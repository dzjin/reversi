'use strict';

// CSS
/*jshint unused:false */
import normalize from 'normalize-css/normalize.css';
import base from 'base.less/dist/css/base.css';
import board from '../styles/utils.css';
import header from '../styles/animations.css';
import main from '../styles/main.css';

// JS
import polyfill from 'babel/polyfill';

import { ready } from './helpers';
import FastClick from 'fastclick';
ready(() => FastClick.attach(document.body));

import React from 'react';
import ReactDOM from 'react-dom';

import ReversiApp from './ui/ReversiApp';
ReactDOM.render(React.createElement(ReversiApp), document.body);
