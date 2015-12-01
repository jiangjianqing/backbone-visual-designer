/*global require*/
'use strict';

// Require.js allows us to configure shortcut alias
require.config({
	// The shim config allows us to configure dependencies for
	// scripts that do not call define() to register a module
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		},
		backboneLocalstorage: {
			deps: ['backbone'],
			exports: 'Store'
		},
		jqueryuiLayout:{
			deps:[
				'jqueryui'
			]
		},
		jqgrid:{
			deps:['jqgridlocale']
		},
		jqgridlocale:{
			deps:['jqueryui']
		}
	},
	paths: {
		jquery: '../node_modules/jquery/jquery',
		jqueryui:'../node_modules/jquery/jquery-ui',
		jqueryuiLayout:'../node_modules/jquery/jquery.layout-latest',
		jqueryThemeHelper:'../node_modules/jquery/jquery.themehelper',
		jqgridlocale: 'https://cdn.bootcss.com/jqgrid/4.6.0/js/i18n/grid.locale-cn',
		jqgrid: 'https://cdn.bootcss.com/jqgrid/4.6.0/js/jquery.jqGrid.min',
		jstree:'../node_modules/jquery/jstree',
		mockjax:'../node_modules/jquery/jquery.mockjax',
		underscore: '../node_modules/underscore/underscore',
		backbone: '../node_modules/backbone/backbone',
		backboneLocalstorage: '../node_modules/backbone.localstorage/backbone.localStorage',
		text: '../node_modules/requirejs/text',
		domReady:'../node_modules/requirejs/domReady',
		handlebars:'../node_modules/handlebars/handlebars'
	}
});

require([
	'backbone',
	'views/app',
	'routers/router'
], function (Backbone, AppView, Workspace) {
	/*jshint nonew:false*/
	// Initialize routing and start Backbone.history()
	console.log("main被调用");
	new Workspace();

	Backbone.history.start();

	// Initialize the application view
	new AppView();
});
