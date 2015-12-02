/**
 * Created by ztxs on 15-12-2.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/new-app.html',
    'domReady!'
],function($,_,Backbone,appTemplate){
    var AppView=Backbone.View.extend({
        el:'body',
        template: _.template(appTemplate),
        initialize:function(options){

        },
        render:function(){
            this.$el.empty();
            this.$el.html(this.template());
            return this;
        }
    });

    return AppView;
});