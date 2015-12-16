/**
 * Created by ztxs on 15-12-2.
 */
define([
    'jquery',
    'backbone',
    'views/d3-app'
],function($,Backbone,AppView){
    "use strict";
    var AppRouter=Backbone.Router.extend({
        initialize:function(el){
            this.el=el;
            this.$el=$(el);
            console.log("AppRouter initialized！");
            var  router=this;
            this.cleanAppView();
            var appView=new AppView();
            this.setAppView(appView);
        },
        routes: {
            '*filter': 'setFilter',//*filter会拦截所有的请求
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

        setFilter: function (param) {
            // Set the current filter to be used
            //Common.TodoFilter = param || '';
            console.log("route.setFilter invoked,param="+param);
            // Trigger a collection filter event, causing hiding/unhiding
            // of the Todo view items
            //Todos.trigger('filter');
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

    });
    return AppRouter;
});