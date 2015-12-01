/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/app.html',
	'domReady!'

], function ($, _, Backbone,appTemplate) {
	'use strict';

	// Our overall **AppView** is the top-level piece of UI.
	var AppView = Backbone.View.extend({

		el:'body',
		template: _.template(appTemplate),
		events: {
			'click #testbtn':		'testBtnClick',
			'click #sidebar>ul.nav-sidebar>li':'onNavItemClick' //deprecated
		},

		initialize: function (options) {
			this.router=options.router;//将AppRouter传递进来，可以用于路由listenTo;
			this.routes=options.routes;//AppRouter传递来的路由列表
			this.viewState=new Backbone.Model();
			this.listenTo(this.router,"route",this.onRouteChange);
			//this.listenTo(this.viewState,"change:navitem",this.changeNavItem)
		},

		render: function () {
			this.$el.empty();
			this.$el.html(this.template());

			return this;
		},
		onRouteChange:function(routename){
			this.$el.find("#sidebar >ul.nav-sidebar li").removeClass("active");
			var $nav_a=null///this.$el.find(String.format("li>a[href='#{0}']",routename));
			var selectorTemplate="#sidebar > ul.nav-sidebar li > a[href='#{0}']";
			//console.log(String.format("routename={0}",routename));
			var $el=this.$el;
			$.each(this.routes,function(k,v,obj){
				//console.log(String.format("key={0},value={1}",k,v));
				if (!$nav_a){
					if(v===routename)
						$nav_a=$el.find(String.format(selectorTemplate,k));
				}
			});

			//console.log(arguments);
			/*用上面的$.each替换switch写法比较好
			switch (routename){
				case "getReport":
					$nav_a=this.$el.find(String.format(selectorTemplate,'report'));
					break;
				case "getOverview":
					$nav_a=this.$el.find(String.format(selectorTemplate,'overview'));
					break;
				case "getGroup":
					$nav_a=this.$el.find(String.format(selectorTemplate,'group'));
					break;
				default:
					$nav_a=this.$el.find(String.format(selectorTemplate,routename));
					if($nav_a===null){
						console.error(String.format("app.onRouteChange invoked,but route[ {0} ] not found",routename));
						console.log(arguments);
					}
			}
			*/
			if($nav_a){
				$nav_a.parents("li").addClass("active");
				//console.log($nav_a.html());
			}
			else{
				console.error(String.format("app.onRouteChange invoked,but $nav_a not found,routename={0}",routename));
			}
		},
		onNavItemClick:function(event){
			//20150908,这里没有遵守Dom事件只改变Model的原则，是为了简化设计
			//var $nav_li=$(event.currentTarget);
			//this.$el.find("#sidebar >ul.nav-sidebar li").removeClass("active");
			//$nav_li.parent().children().removeClass("active");//这个没有考虑跨组，但是访问parent的好例子
			//$nav_li.addClass("active");
		},
		testInvoke:function(){//20150908,用于验证外部是否可以条用该函数，结果是不能！！！
			console.log("app testInvoke invoked");
		},
		testBtnClick:function(){
			//alert("测试");
		}
	});

	return AppView;
});
