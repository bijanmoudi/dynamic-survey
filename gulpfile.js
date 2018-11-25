
'use strict';

/*==============================================================
=            Importing Modules & Defining Variables            =
==============================================================*/

var gulp   = require( 'gulp' );
var gutil  = require( 'gulp-util' );
var del    = require( 'del' );
var uglify = require( 'gulp-uglify' );
var gulpif = require( 'gulp-if' );
var exec   = require( 'gulp-exec' );
var notify = require( 'gulp-notify' );
var buffer = require( 'vinyl-buffer' );
var os     = require( 'os' );
var argv   = require( 'yargs' ).argv;

// SASS
var sass         = require( 'gulp-sass' );
var sassGlob     = require( 'gulp-sass-glob' );
var mmq          = require( 'gulp-merge-media-queries' );
var autoprefixer = require( 'gulp-autoprefixer' );
var sourcemaps   = require( 'gulp-sourcemaps' );

// BrowserSync
var browserSync = require( 'browser-sync' );

// JS
var babelify   = require( 'babelify' );
var watchify   = require( 'watchify' );
var browserify = require( 'browserify' );
var source     = require( 'vinyl-source-stream' );

// Image Optimization
var imagemin = require( 'gulp-imagemin' );

// Linting
var eslint = require( 'gulp-eslint' );

// Testing
var jest = require( 'gulp-jest' ).default;

// gulp build --production
var production = !! argv.production;

// Determine if we're doing a build and if so, bypass the livereload
var build = argv._.length ? argv._[0] === 'build' : false;
var watch = argv._.length ? argv._[0] === 'watch' : true;


/*==================================================
=            Error Notification Methods            =
==================================================*/

var beep = function() {
	var error = gulp.src( 'path/error.wav' );
	if ( os.platform() === 'linux' ) {
		// Linux
		error.pipe( exec( 'aplay <%= file.path %>' ) );
	} else {
		// MacOS
		error.pipe( exec( 'afplay <%= file.path %>' ) );
	}
};

var handleError = function( task ) {
	return function( err ) {
		beep();
		notify.onError({
			sound: false,
			message: task + ' failed, check the logs..'
		})( err );
		gutil.log( gutil.colors.bgRed( task + ' error:' ), gutil.colors.red( err ) );
	};
};


/*===========================================
=            Custom Task Methods            =
===========================================*/

var tasks = {

	// --------------------------
	// Delete Build Folder
	// --------------------------
	clean: function( cb ) {
		del([ 'dist/' ]).then( function() {
			cb();
		});
	},

	// --------------------------
	// Copy Static Assets
	// --------------------------
	assets: function() {
		return gulp.src([
			'src/assets/**',
			'!src/assets/{scss,scss/**}'
		]).pipe( gulp.dest( 'dist/assets/' ) );
	},

	// -------------------------------------------------------------
	// HTML (HTML templates when using the connect server)
	// -------------------------------------------------------------
	templates: function() {
		gulp.src([
			'./src/**/*.html',
			'!src/scripts/__coverage__/**/*'
		]).pipe( gulp.dest( 'dist/' ) );
	},

	// --------------------------
	// SASS (libsass)
	// --------------------------
	sass: function() {
		return gulp.src( './src/assets/scss/*.scss' )
			.pipe( sassGlob() )
			// Sourcemaps + SASS + Error Handling
			.pipe( gulpif( ! production, sourcemaps.init() ) )
			.pipe( sass({
				sourceComments: ! production,
				outputStyle: production ? 'compressed' : 'nested'
			}))
			.on( 'error', handleError( 'SASS' ) )
			// Generate .maps
			.pipe( gulpif( ! production, sourcemaps.write({
				sourceRoot: '.',
				includeContent: false
			})))
			.pipe( gulpif( ! production, sourcemaps.init({
				loadMaps: true
			})))
			// Autoprefixer
			.pipe( autoprefixer({
				browsers: [ 'last 10 versions' ]
			}))
			.pipe( mmq() )
			// We don't serve the source files so include scss content inside the sourcemaps
			.pipe( sourcemaps.write({
				includeContent: true
			}))
			// Write sourcemaps to a specific directory, give it a file and save
			.pipe( gulp.dest( 'dist/assets/css' ) )
			.pipe( browserSync.stream() );
	},

	// --------------------------
	// Browserify
	// --------------------------
	browserify: function() {
		var bundler = browserify( './src/scripts/index.js', {
			cache: {},
			debug: ! production
		});
		if ( watch ) {
			bundler = watchify( bundler );
		}
		var rebundle = function() {
			return bundler
				.transform( babelify, { presets: [ '@babel/preset-env', '@babel/preset-react' ] } )
				.bundle()
				.on( 'error', handleError( 'Browserify' ) )
				.pipe( source( 'bundle.js' ) )
				.pipe( gulpif( production, buffer() ) )
				.pipe( gulpif( production, uglify() ) )
				.pipe( gulp.dest( 'dist/scripts/' ) );
		};
		bundler.on( 'update', rebundle );
		return rebundle();
	},

	// --------------------------
	// Linting
	// --------------------------
	lintjs: function() {
		return gulp.src([ 'gulpfile.js', './src/scripts/index.js', './src/scripts/**/*.js', '!src/scripts/__coverage__/**/*' ])
			.pipe( eslint({
				rules: {
					'indent': [ 2, 'tab' ],
					'semi': [ 2, 'always' ],
					'quotes': [ 2, 'single' ],
					'linebreak-style': [ 2, 'windows' ]
				},
				env: {
					browser: true
				},
				extends: 'eslint:recommended',
				parserOptions : {
					sourceType: 'module',
					ecmaFeatures: {
						jsx: true,
						modules: true,
						experimentalObjectRestSpread: true
					}
				},
				plugins: [ 'react' ]
			}))
			.pipe( eslint.format() )
			.pipe( eslint.failAfterError() );
	},

	// --------------------------
	// Optimize Asset Images
	// --------------------------
	optimize: function() {
		return gulp.src( './src/assets/**/*.{icon,gif,jpg,png,svg}' )
			.pipe( imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				// PNG Optimization
				optimizationLevel: production ? 3 : 1
			}))
			.pipe( gulp.dest( './src/assets/' ) );
	},

	// --------------------------
	// Testing with Mocha
	// --------------------------
	test: function() {
		// process.env.NODE_ENV = 'test';
		return gulp.src( './src/scripts/**/*.test.js' )
			.pipe( jest({
				automock: false,
				collectCoverage: true,
				roots: [ '<rootDir>/src/scripts' ],
				coverageDirectory: './src/scripts/__coverage__',
				collectCoverageFrom: [ './src/scripts/**/*.js'  ],
				preprocessorIgnorePatterns: [ '<rootDir>/node_modules/' ]
			}));
	},

};

gulp.task( 'browser-sync', function() {
	browserSync({
		server: {
			baseDir: './dist'
		},
		port: process.env.PORT || 3000
	});
});

gulp.task( 'reload-sass', [ 'sass' ] );

gulp.task( 'reload-js', [ 'browserify' ], function() {
	browserSync.reload();
});

gulp.task( 'reload-data', [ 'browserify' ], function() {
	browserSync.reload();
});

gulp.task( 'reload-templates', [ 'templates' ], function() {
	browserSync.reload();
});


/*====================================
=            Custom Tasks            =
====================================*/

gulp.task( 'clean', tasks.clean );
// For production we require the clean method on every individual task
var req = build ? [ 'clean' ] : [];
// Individual Tasks
gulp.task( 'templates', req, tasks.templates );
gulp.task( 'assets', req, tasks.assets );
gulp.task( 'sass', req, tasks.sass );
gulp.task( 'browserify', req, tasks.browserify );
gulp.task( 'lint:js', tasks.lintjs );
gulp.task( 'optimize', tasks.optimize );
gulp.task( 'test', tasks.test );


/*=======================================
=            Dev/Watch Tasks            =
=======================================*/

gulp.task( 'watch', [ 'assets', 'templates', 'sass', 'browserify', 'browser-sync' ], function() {

	// --------------------------
	// watch:data
	// --------------------------
	gulp.watch( './src/data/**/*', [ 'reload-data' ] );

	// --------------------------
	// watch:sass
	// --------------------------
	gulp.watch( './src/assets/scss/**/*.scss', [ 'reload-sass' ] );

	// --------------------------
	// watch:js
	// --------------------------
	gulp.watch( './src/scripts/**/*.js', [ 'lint:js', 'reload-js' ] );

	// --------------------------
	// watch:html
	// --------------------------
	gulp.watch( 'src/**/*.html', [ 'reload-templates' ] );

	gutil.log( gutil.colors.bgGreen( 'Watching for changes...' ) );

});


/*==================================
=            Build Task            =
==================================*/

gulp.task( 'build', [
	'optimize',
	'clean',
	'templates',
	'assets',
	'sass',
	'browserify'
]);


/*====================================
=            Default Task            =
====================================*/

gulp.task( 'default', [ 'watch' ] );


/*====================================
=            Instructions            =
====================================*/

// gulp (watch) : for development and livereload
// gulp test : for test and coverage report
// gulp build : for a one off development build
// gulp build --production : for a minified production build