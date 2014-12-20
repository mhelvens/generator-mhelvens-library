'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var _ = require('lodash');
var fs = require('fs');

var MhelvensLibraryGenerator = yeoman.generators.Base.extend({

	initializing: function () {
		this.context = {};
		this.context._ = _;
		this.context.config = this.config;

		this.modules = {};
		fs.readdirSync('./build-config/modules')
			.map(function (filename) { return fs.readFileSync('./build-config/modules/'+filename) })
			.map(JSON.parse)
			.forEach(function (mod) { this.modules[mod.name] = mod }.bind(this));
	},

	prompting: function () {
		var done = this.async();

		var validateName = function (name) {
			if (this.modules[name]) {
				return "The '"+name+"' module already exists!";
			} else {
				return true;
			}
		}.bind(this);

		this.prompt([
			{
				type: 'list',
				name: "type",
				message: "What sort of module is this?",
				choices: [
					'An internal library',
					'An external library',
					'An application'
				],
				default: 0,
				filter: function (choice) {
					switch (choice) {
						case 'An internal library': return "internal-library";
						case 'An external library': return "external-library";
						case 'An application': return "application";
						default: throw new Error("Something went wrong there...");
					}
				}
			},
			{
				when: function (answers) { return answers.type === 'internal-library' },
				name: "name",
				message: "What do we call this internal library?",
				validate: validateName
			},
			{
				when: function (answers) { return answers.type === 'external-library' },
				name: "name",
				message: "What's this external library called?",
				validate: validateName
			},
			{
				when: function (answers) { return answers.type === 'application' },
				name: "name",
				message: "What do we call this application?",
				validate: validateName
			},
			{
				when: function (answers) { return answers.type === 'external-library' },
				name: "variableName",
				message: "Which (if any) variable does it export?",
				default: null
			},
			{
				when: function (answers) { return answers.type === 'internal-library' },
				name: "variableName",
				message: "Which (if any) variable should it export?",
				default: null
			}
		], function (answers) {
			_(this.context).extend(answers);
			done();
		}.bind(this));
	},

	writing: function () {
		switch (this.context.type) {
			case 'internal-library': {
				this.template('_module.json', 'build-config/modules/' + this.context.name + '.json', this.context);
				this.template('_behavior.js', 'src/' + this.context.name + '.js', this.context);
				this.template('_style.scss', 'src/' + this.context.name + '.scss', this.context);
			} break;
			case 'external-library': {
				var done = this.async();

				/* install the external library */
				this.bowerInstall([this.context.name], { 'save': true }, function () {

					/* ask the developer for the path to the library file */
					this.prompt([
						{
							name: "path",
							message: "What's the relative path to the library file?"
						}
					], function (answers) {

						/* create module file */
						var i = answers.path.lastIndexOf('/');
						var subDir = answers.path.substring(0, i);
						this.context.dir = this.context.name + (subDir.length > 0 ? '/' + subDir : '');
						this.context.file = answers.path.substring(i+1);
						this.template('_externalModule.json', 'build-config/modules/' + this.context.name + '.json', this.context);
						done();

					}.bind(this));
				}.bind(this));
			} break;
			case 'application': {
				this.template('_application.json', 'build-config/modules/' + this.context.name + '.json', this.context);
				this.dest.mkdir('src/' + this.context.name);
				this.template('_main.js', 'src/' + this.context.name + '/' + this.context.name + '.js', this.context);
				this.template('_style.scss', 'src/' + this.context.name + '/' + this.context.name +  '.scss', this.context);
				this.template('_view.html', 'src/' + this.context.name + '/' + this.context.name +  '.html', this.context);
			} break;
			default: {
				throw new Error("The requested module type '" + this.context.type + "'is unknown.");
			} break;
		}
	}

});

module.exports = MhelvensLibraryGenerator;
