/**
 * Created by ztxs on 15-12-8.
 */
define([
    'jquery',
    './jq-resizer'
],function($){
    "use strict";
    function Parser(){
        this.settings={
            column_selector:"div[class*='column']",
            splite_selector:"div[class*='splite']",
            splite_vertical_selector:"div[class*='splite-vertical']",
            splite_horizontal_selector:"div[class*='splite-horizontal']",
            has_width_selector:"[style*='width']",
            has_height_selector:"[style*='height']"
        };
    }

    $.extend(Parser.prototype,{
        parse:function($columns){
            var opts= $.extend({},this.settings);

            function adjust_as_vertical_splite_column($parentcol,$leftcol,$splite,$rightcol){
                //$parentcol.css({display:'inline-block'});
                if(!$leftcol.is(opts.has_width_selector)){
                    $leftcol.css({width:'50%'});
                }
                if(!$rightcol.is(opts.has_width_selector)){
                    $rightcol.css({width:'50%'});
                }
                if(!$parentcol.is(opts.has_height_selector)){
                    $parentcol.css({height:"200px"});
                }
                //line-height:100px
                console.log("$parentcol.width="+$parentcol.css("width"));
                console.log("$parentcol.height="+$parentcol.css("height"));
                console.log("$leftcol.width="+$leftcol.css("width"));
                console.log("$leftcol.height="+$leftcol.css("height"));
                console.log("$rightcol.width="+$rightcol.css("width"));
                console.log("$rightcol.height="+$rightcol.css("height"));
                console.log("lastest $splite.left="+$splite.css("left"));

                //var splite_left
                $splite.css({
                    top:0,
                    left:0
                });
                var isMoving=false;
                var abs_x=0;
                var last_left=0;
                $parentcol.on("mousedown",function(event){
                    if(event.target===$splite[0]){
                        isMoving=true;
                        console.log($splite.offset());
                        last_left=parseInt($splite.css("left"));
                        abs_x = event.pageX;
                        console.log("abs_x="+abs_x+",last_left="+last_left);


                        //console.log("event.pageX="+event.pageX);
                        //console.log("$splite.offset="+$splite.offset().left);
                        //var abs_y = event.pageY - $splite.offset().top;
                        console.log("move started!!!!!");
                    }
                    return false;
                }).on("mousemove",function(event){
                    if(isMoving){
                        var splite_left=last_left+event.pageX -abs_x;
                        //$leftcol.css({width:splite_left+"px"});

                        /*position:absolite使用的代码
                        $splite.css({'left':splite_left});
                        $leftcol.css({width:splite_left-2});
                        $rightcol.css({
                            left:splite_left+3,
                            width:$parentcol.width()-splite_left
                        });
                        */
                    }
                    return false;
                }).on("mouseup  mouseleave",function(){
                    isMoving=false;
                    return false;
                });

                $leftcol.on("resize",function(event){
                    console.log("$leftcol.onResize invoke");
                });

                $leftcol.off("resize");

                //$rightcol.css({width:'49%'});
            }

            function adjust_as_horizontal_splite_column($parentcol,$topcol,$splite,$bottomcol){

            }

            function analyse_column($ele){
                var $children=$ele.children();
                if($children.length===0){//如果没有内容
                    console.log($ele+"column中没有子元素");
                }else if($ele.find(opts.column_selector).length>0){//如果存在子column,调整其高度宽度位置
                    var $splite=$ele.find(opts.splite_selector);
                    if($splite.length===1){
                        var isFindSplite=false;
                        if($splite.is(opts.splite_vertical_selector)){
                            console.log("发现垂直分隔符");
                            adjust_as_vertical_splite_column($ele,$splite.prev(),$splite,$splite.next());
                            isFindSplite=true;
                        }else
                        if($splite.is(opts.splite_horizontal_selector)){
                            console.log("发现水平分隔符");
                            adjust_as_horizontal_splite_column($ele,$splite.prev(),$splite,$splite.next());
                            isFindSplite=true;
                        }
                        if(isFindSplite){
                            //$ele.on()
                        }
                    }
                }else{
                    console.log($children);
                }
            }

            var parse_func=function($cols){
                //var arguments_callee=arguments.callee;//递归调用,strict模式下不可用
                var arguments_callee=parse_func;//递归调用,strict模式下使用
                $cols.each(function(index){
                    var $col=$(this);
                    if ($col.is(opts.column_selector)) {
                        analyse_column($col);
                        arguments_callee($col.children());//递归调用
                    }else
                    if($col.is(opts.splite_selector)){
                        //console.log("分隔符");
                    }else{
                        //console.log("出现布局内部信息："+$col.html());
                    }
                });
            };
            parse_func($columns);

        }
    });

    return new Parser();
})