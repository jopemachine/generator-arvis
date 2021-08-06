'use strict';
const superb = require('superb');
const normalizeUrl = require('normalize-url');
const humanizeUrl = require('humanize-url');
const Generator = require('yeoman-generator');
const _s = require('underscore.string');
const utils = require('./utils');

module.exports = class extends Generator {
	init() {
		return this.prompt([
			{
				name: 'extensionType',
				message: 'What is the extension type?',
				type: 'list',
				default: 'Workflow',
				choices: [
					'Workflow',
					'Plugin'
				]
			},
			{
				name: 'moduleName',
				message: 'What do you want to name your module?',
				default: _s.slugify(this.appname),
				filter: x => {
					let name = utils.slugifyPackageName(x);

					if (!name.startsWith('arvis-')) {
						name = `arvis-${name}`;
					}

					return name;
				}
			},
			{
				name: 'moduleDescription',
				message: 'What is your module description?',
				default: `My ${superb()} module`
			},
			{
				name: 'arvisCategory',
				message: 'What is the Arvis category?',
				type: 'list',
				default: 'Uncategorised',
				choices: [
					'Tools',
					'Internet',
					'Productivity',
					'Uncategorised'
				]
			},
			{
				name: 'githubUsername',
				message: 'What is your GitHub username?',
				store: true,
				validate: x => x.length > 0 ? true : 'You have to provide a username'
			},
			{
				name: 'website',
				message: 'What is the URL of your extension?',
				store: true,
				validate: x => x.length > 0 ? true : 'You have to provide a website URL',
				filter: x => normalizeUrl(x)
			}
		]).then(props => {
			const tpl = {
				extensionType: props.extensionType,
				moduleName: props.moduleName,
				moduleDescription: props.moduleDescription,
				arvisCategory: props.arvisCategory,
				githubUsername: this.options.org || props.githubUsername,
				repoName: utils.repoName(props.moduleName),
				name: this.user.git.name(),
				email: this.user.git.email(),
				website: props.website,
				humanizedWebsite: humanizeUrl(props.website),
			};

			const mv = (from, to) => {
				this.fs.move(this.destinationPath(from), this.destinationPath(to));
			};

			this.fs.copyTpl([
				`${this.templatePath()}/**`
			], this.destinationPath(), tpl);

			mv('editorconfig', '.editorconfig');
			mv('gitattributes', '.gitattributes');
			mv('gitignore', '.gitignore');
			mv('travis.yml', '.travis.yml');
			mv('_package.json', 'package.json');

			if (props.extensionType === 'Workflow') {
				mv('index-workflow.js', 'index.js');
				this.fs.delete('index-plugin.js');
				this.fs.delete('arvis-plugin.json');
			} else {
				mv('index-plugin.js', 'index.js');
				this.fs.delete('index-workflow.js');
				this.fs.delete('arvis-workflow.json');
			}
		});
	}

	git() {
		this.spawnCommandSync('git', ['init']);
	}

	install() {
		this.npmInstall(null, {ignoreScripts: true});
	}
};
