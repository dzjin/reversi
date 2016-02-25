'use strict';

import config from './gulpconfig';
import gulp from 'gulp';
import gutil from 'gulp-util';
import nopt from 'nopt'; // handle CLI arguments
import fs from 'fs';
import semver from 'semver';
import del from 'del';

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
import runSequence from 'run-sequence';

import gulpLoadPlugins from 'gulp-load-plugins';
const plugins = gulpLoadPlugins();

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';


// helpers
/**
 * Get the version number
 * @param {Array.<string>} packageFiles
 * @throws {Error}
 * @return {string}
 */
let getVersionNumberFromFile = function(packageFiles) {
    if (packageFiles.length === 0) {
        throw new Error(
            'Where are your package files (package.json, bower.json)?'
        );
    }

    let packageFile = packageFiles[0];
    let fileContent = fs.readFileSync(
        `${__dirname}/${packageFile}`, { encoding: 'utf-8' }
    );

    let pkg = JSON.parse(fileContent);
    if (!pkg.version) {
        throw new Error(
            `Your package file (${packageFile}) does not contain` +
                'any version number!'
        );
    }

    return pkg.version;
};

// parse CLI arguments with nopt
nopt.invalidHandler = function(key) {
    let msg = `Invalid "${key}" parameter!`;
    throw new Error(msg);
};

nopt.typeDefs.version = {
    type: 'version',
    validate(data, key, val) {
        val = (val + '').toLowerCase();

        // major: 1.0.0
        // minor: 0.1.0
        // patch: 0.0.2
        const shortHands = [ 'major', 'minor', 'patch' ];
        if (shortHands.indexOf(val) === -1 && !semver.valid(val)) {
            return false;
        }
        data[key] = val;
    }
};

let argv = nopt({ version: 'version' }, { v: '--version' }, process.argv, 1);

// set the default values
argv.version = argv.version || 'patch';


// The default task
// Usage: `gulp` or `npm start`
gulp.task('default', [ 'webpack-dev-server' ]);

gulp.task('webpack-dev-server', () => {
    // modify some webpack config options
    let myConfig = Object.create(config.plugins.webpack);
    myConfig.devtool = 'eval';
    myConfig.debug = true;
    myConfig.cache = true;

    // Start a webpack-dev-server
    let server = new WebpackDevServer(webpack(myConfig), {
        publicPath: '/' + myConfig.output.publicPath,
        stats: { colors: true },
        contentBase: `./${config.path.app}/`
    });

    server.listen(8080, 'localhost', (err) => {
        if (err) {
            throw new gutil.PluginError('webpack-dev-server', err);
        }

        gutil.log('[webpack-dev-server]', 'http://localhost:8080/');
    });
});


// Task for bumping the version number
// Usage: `gulp bump [--version <version>]`
gulp.task('bump', (cb) =>
    runSequence('bump-version-number', 'bump-commit-and-tag', cb)
);

gulp.task('bump-version-number', () => {
    let options = {};

    const shortHands = [ 'major', 'minor', 'patch' ];
    let key = (shortHands.indexOf(argv.version) !== -1) ? 'type' : 'version';
    options[key] = argv.version;

    let packageFiles = config.plugins.bump.packageFiles;
    return gulp.src(packageFiles).
        pipe(plugins.bump(options)).
        pipe(gulp.dest('./'));
});

gulp.task('bump-commit-and-tag', (cb) =>
    runSequence('bump-commit', 'bump-tag', cb)
);

gulp.task('bump-commit', () => {
    let packageFiles = config.plugins.bump.packageFiles;
    let message = `Release v${getVersionNumberFromFile(packageFiles)}`;

    return gulp.src(packageFiles).pipe(plugins.git.commit(message));
});

gulp.task('bump-tag', (cb) => {
    let packageFiles = config.plugins.bump.packageFiles;
    let version = getVersionNumberFromFile(packageFiles);
    let message = `Release v${version}`;

    plugins.git.tag(`v${version}`, message, cb);
});


// Task for testing and linting
// Usage: `gulp test` or `npm test`
gulp.task('test', [ 'lint', 'mocha' ]);

gulp.task('mocha', () =>
    gulp.src(config.path.test + '/*', { read: false }).
        pipe(plugins.mocha({ reporter: 'nyan' }))
);

gulp.task('lint', [ 'jscs', 'jshint', 'jsonlint', 'csslint', 'htmllint' ]);

gulp.task('jscs', () =>
    gulp.src(config.filesForAnalyze.js).
        pipe(plugins.jscs()).
        pipe(plugins.jscs.reporter())
);

gulp.task('jshint', () =>
    gulp.src(config.filesForAnalyze.js).
        pipe(plugins.jshint()).
        pipe(plugins.jshint.reporter())
);

gulp.task('jsonlint', () =>
    gulp.src(config.filesForAnalyze.json).
        pipe(plugins.jsonlint()).
        pipe(plugins.jsonlint.reporter())
);

gulp.task('csslint', () =>
    gulp.src(config.filesForAnalyze.css).
        pipe(plugins.csslint('./.csslintrc')).
        pipe(plugins.csslint.reporter())
);

gulp.task('htmllint', () =>
    gulp.src(config.filesForAnalyze.html).
        pipe(plugins.htmlhint({ htmlhintrc: './.htmlhintrc' })).
        pipe(plugins.htmlhint.reporter())
);


// Task for building for production
gulp.task('dist', [ 'build' ]);

gulp.task('build', (cb) =>
    runSequence(
        'cleanup', [ 'copy-html', 'copy-assets', 'webpack-build' ], cb
    )
);

gulp.task('webpack-build', (cb) => {
    // modify some webpack config options
    let myConfig = Object.create(config.plugins.webpack);
    myConfig.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                // This has effect on the react lib size
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin()
    );

    // run webpack
    webpack(myConfig, (err, stats) => {
        if (err) {
            throw new gutil.PluginError('build', err);
        }

        gutil.log('[build]', stats.toString({ colors: true }));
        return cb();
    });
});

gulp.task('cleanup', () =>
    del(config.path.dist)
);

gulp.task('copy-html', () =>
    gulp.
        src(config.path.app + '/index.html').
        pipe(plugins.minifyHtml(config.plugins.minifyHtml)).
        pipe(gulp.dest(config.path.dist))
);

gulp.task('copy-assets', () =>
    gulp.
        src(config.path.app + '/*.{png,xml,ico}').
        pipe(gulp.dest(config.path.dist))
);
