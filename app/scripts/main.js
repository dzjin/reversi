'use strict';

// CSS
/*jshint unused:false */
import normalize from 'normalize-css/normalize.css';
import base from 'base.less/dist/css/base.css';
import main from '../styles/main.css';
import header from '../styles/header.css';
import board from '../styles/board.css';

// JS
import polyfill from 'babel/polyfill';

import React from 'react';
import ReversiApp from './components/ReversiApp';


React.render(React.createElement(ReversiApp), document.body);
