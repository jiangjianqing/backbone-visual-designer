/*global define*/
define([
	'jquery',
	'backbone',
	'views/app',
	'views/layout/dashboard',
	'views/layout/report'
	//'views/group/groups',
	//'views/process/processes'
], function ($, Backbone,AppView,DashboardView,ReportView/*,GroupsView,ProcessesView*/) {
	'use strict';

	var AppRouter = Backbone.Router.extend({
		initialize: function (el) {
			//20150908,initialize的参数由new AppRouter("#appView")的形式指定
			//console.log(arguments.length);
			this.el=el;//表明本应用对应的已有DOM元素，比如body
			this.$el=$(el);
			console.log("AppRouter initialized！");


			var router = this;
			this.cleanAppView();
			var view = new AppView({
					router:router,//重点：将路由传递到每个具体的视图中，
					routes:this.routes
				}
			);
			this.setAppView(view);
		},
		routes: {
			//'*filter': 'setFilter',//*filter会拦截所有的请求
			"" : "index",
			"teams" : "getTeamList",
			"teams/:country" : "getTeamsCountry",
			"teams/:country/:name": "getTeam",
			"overview":"getOverview",
			"report":"getReport",
			"group":"getGroup",
			"process":"getProcess",

			"*error" : "fourOfour"
		},

		index: function(){
			// Homepage
			//var router = this;
			//this.cleanAppView();
			//var view = new AppView({
			//		router:router//重点：将路由传递到每个具体的视图中，
			//	}
			//);
			//this.setAppView(view);
			//20150906,这里对appView进行初始化
			/*
			var view = new UserListView({
					collection: router.userCollection,
					router:router//重点：将路由传递到每个具体的视图中，
				}
			);
			this.setAppView(view);
			*/

			//20150906,在各个view中调用router的方式
			//触发事件处理器，假如不加{trigger:true}则不会触发help事件处理器。
			//this.router.navigate("help/troubleshooting",{trigger: true});

			//应用replace:true表示导航之前那个url将不会计入history，不会被形成浏览记录（即后退也
			//不能回到http://127.0.0.1/index.html）
			//this.router.navigate("help/troubleshooting",{replace: true});
			console.log("route.index ");
			this.getOverview();
		},

		getTeamList: function() {
			// List all teams
			console.log("route.getTeamList ");
		},
		getTeamsCountry: function(country) {
			console.log("route.getTeamsCountry "+country);
		},
		getTeam: function(country, name) {
			console.log(String.format("route.getTeam country={0},name={1}",country,name));
		},
		fourOfour: function(error) {
			console.log("route.fourOfour 404 "+error);
			this.cleanMainview();
		},

		setFilter: function (param) {
			// Set the current filter to be used
			//Common.TodoFilter = param || '';
			console.log("route.setFilter invoked,param="+param);
			// Trigger a collection filter event, causing hiding/unhiding
			// of the Todo view items
			//Todos.trigger('filter');
		},
		getOverview:function(){
			this.setMainview(new DashboardView());
		},
		getReport:function(){
			this.setMainview(new ReportView());
		},
		getGroup:function(){
			this.setMainview(new GroupsView());
		},
		getProcess:function(){
			this.setMainview(new ProcessesView());
		},

		//--------------以下为内部函数--------------
		cleanAppView:function () {/*清除当前页面的appView*/
			if (this.appView) {
				this.appView.remove();
				this.appView = null;
			}
		},
		setAppView:function(newView){/*切换视图函数*/
			this.cleanAppView();
			this.appView=newView.render().$el.appendTo($(this.el));
		},
		cleanMainview:function(){
			if(this.mainView){
				this.mainView.remove();
				this.mainView=null;
			}
		},
		setMainview:function(newView){
			this.cleanMainview();
			this.mainView=newView.render().$el.appendTo(this.$el.find("#main"));
		}

		/**
		 *
		 创建的每个状态可以为书签。当 URL 碰到类似下面情况时，会调用这 5 个活动（index、getTeams、getTeamsCountry、getTeamCountry 和 fourOfour）。

		 http://www.example.com 触发 index()
		 http://www.example.com/#/teams 触发 getTeams()
		 http://www.example.com/#/teams/country1 触发 getTeamsCountry() 传递 country1 作为参数
		 http://www.example.com/#/teams/country1/team1 触发 getTeamCountry() 传递 country1 和 team1 作为参数
		 http://www.example.com/#/something 触发 fourOfour() 以作 * （星号）使用。

		 */

	});

	return AppRouter;
});
