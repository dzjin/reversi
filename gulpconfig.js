'use strict';

var webpack = require('webpack');

var config = {};

// Configurable paths
// Don't use leading or trailing slashes!
config.path = {
    app: 'app',
    dist: 'dist'
};

// Files for linting and stuff like that
config.filesForAnalyze = {
    js: [
        'gulpconfig.js', 'gulpfile.js',
        config.path.app + '/scripts/**/*.js',
    ],
    json: [ '*.json', '.*rc' ],
    css: [ config.path.app + '/styles/**/*.css' ],
    html: [ config.path.app + '/index.html' ]
};

// Plugins preferences
config.plugins = {
    // Bumps the version number (and create a git commit and tag)
    bump: {
        packageFiles: [ 'package.json', 'bower.json' ]
    },

    minifyHtml: {
        removeComments: true,
        removeCommentsFromCDATA: true,
        removeCDATASectionsFromCDATA: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        useShortDoctype: true
    },

    // http://webpack.github.io/docs/configuration.html
    webpack: {
        context: __dirname + '/' + config.path.app,
        entry: './scripts/main.js',
        output: {
            path: __dirname + '/' + config.path.dist + '/assets/',
            filename: 'bundle.js',
            publicPath: 'assets/'
        },
        resolve: {
            extensions: [ '', '.js' ],
            modulesDirectories: [
                'node_modules', config.path.app + '/bower_components'
            ]
        },
        plugins: [
            new webpack.ResolverPlugin(
                new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(
                    'bower.json', [ 'main' ]
                )
            )
        ],
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loaders: [ 'babel-loader' ]
                }, {
                    test: /\.css$/,
                    loaders: [
                        'style-loader',
                        'css-loader',
                        'autoprefixer-loader?browsers=last 2 version'
                    ]
                }, {
                    test: /\.(png|jpg|svg)$/,
                    loaders: [ 'url-loader?limit=8192' ]
                }
            ]
        }
    }
};

module.exports = config;
