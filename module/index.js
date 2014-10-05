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
				type: 'confirm',
				name: "external",
				message: "Is this an external module?",
				default: false
			},
			{
				when: function (answers) { return answers.external },
				name: "name",
				message: "What's this external module called?",
				validate: validateName
			},
			{
				when: function (answers) { return answers.external },
				name: "variableName",
				message: "Which (if any) variable does it export?",
				default: null
			},
			{
				when: function (answers) { return !answers.external },
				name: "name",
				message: "What do we call this module?",
				validate: validateName
			}
		], function (answers) {
			_(this.context).extend(answers);
			done();
		}.bind(this));
	},

	writing: function () {
		if (this.context.external) {
			var template = this.context.variableName ?
				'_externalModule.json' :
				'_externalModuleNoVar.json';
			this.template(template, 'modules/' + this.context.name + '.json', this.context);
		} else {
			this.template('_module.json', 'modules/' + this.context.name + '.json', this.context);
			this.template('_behavior.js', 'src/' + this.context.name + '.js', this.context);
			this.template('_style.scss', 'src/' + this.context.name + '.scss', this.context);
		}
	}

});

module.exports = MhelvensLibraryGenerator;
