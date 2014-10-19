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
		fs.readdirSync('./modules')
			.map(function (filename) { return fs.readFileSync('./modules/'+filename) })
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
				var template = this.context.variableName ?
					'_module.json' :
					'_moduleNoVar.json';
				this.template('_module.json', 'modules/' + this.context.name + '.json', this.context);
				this.template('_behavior.js', 'src/' + this.context.name + '.js', this.context);
				this.template('_style.scss', 'src/' + this.context.name + '.scss', this.context);
			} break;
			case 'external-library': {
				var template = this.context.variableName ?
					'_externalModule.json' :
					'_externalModuleNoVar.json';
				this.template(template, 'modules/' + this.context.name + '.json', this.context);
			} break;
			case 'application': {
				this.template('_application.json', 'modules/' + this.context.name + '.json', this.context);
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
