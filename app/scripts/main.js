'use strict';

// CSS
import 'normalize-css/normalize.css';
import 'base.less/dist/css/base.css';
import '../styles/utils.css';
import '../styles/animations.css';
import '../styles/main.css';

// JS
import 'babel-polyfill';

import { ready } from './helpers';
import FastClick from 'fastclick';
ready(() => FastClick.attach(document.body));

import React from 'react';
import ReactDOM from 'react-dom';

import ReversiApp from './ui/ReversiApp';
ReactDOM.render(React.createElement(ReversiApp), document.body);
