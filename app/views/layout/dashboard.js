/**
 * Created by ztxs on 15-9-8.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'text!templates/layout/dashboard.html'
],function($,_,Backbone,Handlebars,ViewTemplate){
    var DashboardView=Backbone.View.extend({
        template:Handlebars.compile(ViewTemplate),
        events: {
            'click a':	'onClick'
        },
        initialize:function(){

        },
        render:function(){
            this.$el.html(this.template());
            return this;
        },
        onClick:function(event){
            console.log($(event.currentTarget).text());
        }
    });
    return DashboardView;
});