//
// the styling to be loaded by webpack
//
require('./<%= name %>.scss');

//
// RequireJS Configuration
// (using an extra variable to stop webpack from messing with it)
//
var requireJs = requirejs;
requireJs.config({
	paths: {
		'domReady': '../../bower_components/requirejs-domready/domReady',
		'jquery': '../bower_components/jquery/dist/jquery',
		'bluebird': '../bower_components/bluebird/js/browser/bluebird'

	},
	shim: {
		'jquery': { exports: 'jQuery' },
		'bluebird': { init: function () { this.longStackTraces() } }

	}
});

//
// the application itself
// using 'requirejs' rather than 'require', to stop webpack from messing with it
//
requirejs(['jquery', 'bluebird', '!domReady'], function ($, P) {
	'use strict';



});
