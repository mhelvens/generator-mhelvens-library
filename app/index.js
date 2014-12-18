'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var _ = require('lodash');
var fs = require('fs');

var MhelvensLibraryGenerator = yeoman.generators.Base.extend({

	initializing: function () {
		this.config.set('packages', {});
	},

	prompting: function () {
		var done = this.async();

		console.log(yosay("Welcome to the ace mhelvens library generator!"));

		this.prompt([
			{
				name: "name",
				message: "What do we call this library?"
			},
			{
				name: "version",
				message: "What is this library's initial version?",
				default: "0.1.0"
			},
			{
				name: "description",
				message: "What is this library's description?",
				default: "no description"
			}
		], function (settings) {
			_(this).extend(settings);
			done();
		}.bind(this));
	},

	writing: {
		projectDirectories: function () {
			this.dest.mkdir('dist');
			this.dest.mkdir('src');
			this.dest.mkdir('test');
			this.dest.mkdir('build-config');
			this.dest.mkdir('build-config/modules');
			this.dest.mkdir('build-config/auto-loaders');
			this.dest.mkdir('build-config/aliases');
		},

		projectFiles: function () {
			this.template('_.editorconfig', '.editorconfig', this);
			this.template('_.gitignore', '.gitignore', this);
			this.template('_.jshintignore', '.jshintignore', this);
			this.template('_.jshintrc', '.jshintrc', this);
			this.template('_bower.json', 'bower.json', this);
			this.template('_package.json', 'package.json', this);
			this.template('_gulpfile.js', 'gulpfile.js', this);
			this.template('_karma.conf.js', 'karma.conf.js', this);
			this.template('_README.md', 'README.md', this);

			fs.readdirSync(this.sourceRoot() + '/build-config/auto-loaders')
				.map(function (filename) {
					this.template(
						'build-config/auto-loaders/' + filename,
						'build-config/auto-loaders/' + filename.slice(1)
					);
				}.bind(this));

			fs.readdirSync(this.sourceRoot() + '/build-config/aliases')
				.map(function (filename) {
					this.template(
						'build-config/aliases/' + filename,
						'build-config/aliases/' + filename.slice(1)
					);
				}.bind(this));
		}
	},

	end: function () {
		this.installDependencies();
		this.config.save();
	}

});

module.exports = MhelvensLibraryGenerator;
