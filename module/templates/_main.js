//
// RequireJS Configuration
//
requirejs.config({
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
//
require(['jquery', 'bluebird', './<%= name %>.scss'], function ($, P) {
	'use strict';



});
