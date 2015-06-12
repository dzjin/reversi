'use strict';

var config = require('./gulpconfig');
var gulp = require('gulp');
var gutil = require('gulp-util');
var nopt = require('nopt'); // handle CLI arguments
var fs = require('fs');
var semver = require('semver');
var del = require('del');

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
var runSequence = require('run-sequence');

var plugins = require('gulp-load-plugins')();
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');


// helpers
/**
 * Get the version number
 * @param {Array.<string>} packageFiles
 * @throws {Error}
 * @return {string}
 */
var getVersionNumberFromFile = function(packageFiles) {
    if (packageFiles.length === 0) {
        throw new Error(
            'Where are your package files (package.json, bower.json)?'
        );
    }

    var packageFile = packageFiles[0];
    var fileContent = fs.readFileSync(
        __dirname + '/' + packageFile, { encoding: 'utf-8' }
    );

    var pkg = JSON.parse(fileContent);
    if (!pkg.hasOwnProperty('version')) {
        throw new Error(
            'Your package file (' + packageFile +
                ') does not contain any version number!'
        );
    }

    return pkg.version;
};

// parse CLI arguments with nopt
nopt.invalidHandler = function(key) {
    var msg = 'Invalid "' + key + '" parameter!';
    throw new Error(msg);
};

nopt.typeDefs.version = {
    type: 'version',
    validate: function(data, key, val) {
        val = (val + '').toLowerCase();

        // major: 1.0.0
        // minor: 0.1.0
        // patch: 0.0.2
        var shortHands = [ 'major', 'minor', 'patch' ];
        if (shortHands.indexOf(val) === -1 && !semver.valid(val)) {
            return false;
        }
        data[key] = val;
    }
};

var argv = nopt({ version: 'version' }, { v: '--version' }, process.argv, 1);

// set the default values
argv.version = argv.version || 'patch';


// The default task
// Usage: `gulp` or `npm start`
gulp.task('default', [ 'webpack-dev-server' ]);

gulp.task('webpack-dev-server', function() {
    // modify some webpack config options
    var myConfig = Object.create(config.plugins.webpack);
    myConfig.devtool = 'eval';
    myConfig.debug = true;
    myConfig.cache = true;

    // Start a webpack-dev-server
    var server = new WebpackDevServer(webpack(myConfig), {
        publicPath: '/' + myConfig.output.publicPath,
        stats: { colors: true },
        contentBase: './' + config.path.app + '/'
    });

    server.listen(8080, 'localhost', function(err) {
        if (err) {
            throw new gutil.PluginError('webpack-dev-server', err);
        }

        gutil.log('[webpack-dev-server]', 'http://localhost:8080/');
    });
});


// Task for bumping the version number
// Usage: `gulp bump [--version <version>]`
gulp.task('bump', function(cb) {
    return runSequence('bump-version-number', 'bump-commit-and-tag', cb);
});

gulp.task('bump-version-number', function() {
    var options = {};

    var key = ([ 'major', 'minor', 'patch' ].indexOf(argv.version) !== -1) ?
        'type' : 'version';
    options[key] = argv.version;

    var packageFiles = config.plugins.bump.packageFiles;
    return gulp.src(packageFiles).
        pipe(plugins.bump(options)).
        pipe(gulp.dest('./'));
});

gulp.task('bump-commit-and-tag', function(cb) {
    return runSequence('bump-commit', 'bump-tag', cb);
});

gulp.task('bump-commit', function() {
    var packageFiles = config.plugins.bump.packageFiles;

    var version = 'v' + getVersionNumberFromFile(packageFiles);
    var message = 'Release ' + version;

    var filesToCommit = [].concat(packageFiles, config.path.dist + '/**/*');
    return gulp.src(filesToCommit).pipe(plugins.git.commit(message));
});

gulp.task('bump-tag', function(cb) {
    var packageFiles = config.plugins.bump.packageFiles;

    var version = 'v' + getVersionNumberFromFile(packageFiles);
    var message = 'Release ' + version;

    return plugins.git.tag(version, message, cb);
});


// Task for testing and linting
// Usage: `gulp test` or `npm test`
// separately use: `gulp qunit` and `gulp lint`
gulp.task('test', [ 'lint' ]);

gulp.task('qunit', function() {
    return gulp.src(config.path.test + '/index.html').pipe(plugins.qunit());
});

gulp.task('lint', [ 'jscs', 'jshint', 'jsonlint', 'csslint', 'htmllint' ]);

gulp.task('jscs', function() {
    return gulp.src(config.filesForAnalyze.js).pipe(plugins.jscs());
});

gulp.task('jshint', function() {
    return gulp.src(config.filesForAnalyze.js).
        pipe(plugins.jshint()).
        pipe(plugins.jshint.reporter());
});

gulp.task('jsonlint', function() {
    return gulp.src(config.filesForAnalyze.json).
        pipe(plugins.jsonlint()).
        pipe(plugins.jsonlint.reporter());
});

gulp.task('csslint', function() {
    return gulp.src(config.filesForAnalyze.css).
        pipe(plugins.csslint('./.csslintrc')).
        pipe(plugins.csslint.reporter());
});

gulp.task('htmllint', function() {
    return gulp.src(config.filesForAnalyze.html).
        pipe(plugins.htmlhint({ htmlhintrc: './.htmlhintrc' })).
        pipe(plugins.htmlhint.reporter());
});


// Task for building for production
gulp.task('dist', [ 'build' ]);

gulp.task('build', function(cb) {
    return runSequence(
        'cleanup', [ 'copy-html', 'copy-assets', 'webpack-build' ], cb
    );
});

gulp.task('webpack-build', function(cb) {
    // modify some webpack config options
    var myConfig = Object.create(config.plugins.webpack);
    myConfig.plugins.push(
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin()
    );

    // run webpack
    webpack(myConfig, function(err, stats) {
        if (err) {
            throw new gutil.PluginError('build', err);
        }

        gutil.log('[build]', stats.toString({ colors: true }));
        return cb();
    });
});

gulp.task('cleanup', function(cb) {
    return del(config.path.dist, cb);
});

gulp.task('copy-html', function() {
    return gulp.
        src(config.path.app + '/index.html').
        pipe(plugins.minifyHtml(config.plugins.minifyHtml)).
        pipe(gulp.dest(config.path.dist));
});

gulp.task('copy-assets', function() {
    return gulp.
        src(config.path.app + '/*.{png,xml,ico}').
        pipe(gulp.dest(config.path.dist));
});
