/**
 * Created by ztxs on 15-12-2.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/new-app.html',
    'lib/layout-utils/layout-parser',
    'bootstrap',
    'domReady!'
],function($,_,Backbone,appTemplate,layoutParser){
    var AppView=Backbone.View.extend({
        el:'body',
        template: _.template(appTemplate),
        initialize:function(options){

        },
        events:{
            'mouseenter div[class*="popover-info"]':'onPopoverIn',
            'mouseleave div[class="popover-info"]':'onPopoverOut'
        },
        render:function(){
            this.$el.empty();
            this.$el.html(this.template());
            this.$el.find('div[class*="popover-info"]').each(function(){
                var $element=$(this);
                var txtTitle=$element.find(".popover-title").html();
                var txtContent=$element.find(".popover-content").html();
                $element.popover({
                    trigger: 'manual',
                    placement: 'right', //top, bottom, left or right
                    title: txtTitle,
                    container:"body",
                    html: 'true',
                    content: txtContent,
                }).on("mouseenter", function () {
                    var $this = $(this);
                    $this.popover("show");
                    //$this.siblings(".popover").on("mouseleave", function () {
                    //    $(_this).popover('hide');
                    //});
                }).on("mouseleave", function () {
                    var $this = $(this);
                    setTimeout(function () {
                        //if (!$(".popover:hover").length) {
                            $this.popover("hide")
                        //}
                    }, 100);
                });
            });
            //this.$("[data-toggle='popover']").popover();

            //这里开始处理布局信息
            this.processLayout(this.$el.find("div[id=main]"));
            return this;
        },
        onPopoverIn:function(event){
            //console.log("onPopoverIn");
            //var $tr=$(event.currentTarget).parents("div[class*='popover-info']");
            //var $test=$(event.currentTarget).siblings("div[class*='popover']");
            //console.log($test);
        },
        onPopoverOut:function(){
            //console.log("PopoverOut");
        },
        processLayout:function($layout_container){
            var $children=$layout_container.children();
            layoutParser.parse($children);
        }
    });

    return AppView;
});