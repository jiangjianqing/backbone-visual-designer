/**
 * Created by ztxs on 15-12-16.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'd3',
    'text!templates/d3-app.html',
    'bootstrap',
    'domReady!'
],function($,_,Backbone,d3,appTemplate){
    var AppView=Backbone.View.extend({
        el:'body',
        template: _.template(appTemplate),
        initialize:function(options){

        },
        events:{
            //'mouseenter div[class*="popover-info"]':'onPopoverIn',
            //'mouseleave div[class="popover-info"]':'onPopoverOut'
        },
        d3StandardDemo:function(){//d3选择集操作的标准模板
            var dataset = [10, 20, 30];
            var p = d3.select("body").selectAll("p");

            //绑定数据后，分别返回update、enter、exit部分
            var update = p.data(dataset);
            var enter = update.enter();
            var exit = update.exit();

            //1.update部分的处理方法
            update.text( function(d){ return d; } );

            //2.enter部分的处理方法
            enter.append("p")
                .text( function(d){ return d; } );

            //3.exit部分的处理方法
            exit.remove();
        },
        render:function(){
            this.$el.empty();
            this.$el.html(this.template());

            //这里将jquery和d3组合使用
            this.$tooltip=this.$el.find(".tooltip");

            this.svg=d3.select(this.el).select("#test_d3").append("svg").attr("class","mysvg");
            //this.drawSvg();
            //this.testPieLayout(this.svg);
            //this.testForceLayout(this.svg);
            this.testTreeLayout(this.svg);

            return this;
        },
        testTreeLayout:function(svg){

            var $tooltip=this.$tooltip;
            var root={
                "name":"祖先",
                "children":
                    [
                        {
                            "name":"父系" ,
                            "children":
                                [
                                    {"name":"叔叔一" },
                                    {"name":"叔叔二" },
                                    {"name":"婶婶三" },
                                    {"name":"婶婶四" }
                                ]
                        },

                        {
                            "name":"母系" ,
                            "children":
                                [
                                    {"name":"舅舅一"},
                                    {"name":"舅舅二"},
                                    {"name":"舅舅三"},
                                    {"name":"舅舅四"}
                                ]
                        }
                    ]
            };

            //给第一个节点添加初始坐标x0和x1
            var width=500,height=300;

            //给root添加初始坐标x0和x1
            //root.x0 = width / 2;
            //root.y0 = 0;

            //nodeSize与size 是互斥的
            //var tree=d3.layout.tree().nodeSize([100,100]);//根据节点大小计算布局size
            var tree=d3.layout.tree().size([width,height])//根据布局大小计算nodeSize
            var offsetCenter={
                x:width/2,
                y:20
            };
            var offsetX=function(x){
                return x+offsetCenter.x;
            };
            var offsetY=function(y){
                return y+offsetCenter.y;
            };


            var nodes=tree.nodes(root);
            var links=tree.links(nodes);

            console.log(nodes);
            console.log(links);

            //对角线生成器
            var diagonal = d3.svg.diagonal()
                .projection(function(d) { return [d.x, d.y]; });//这里使用[d.x,d.y]为上下排列，[d.y,d.x]为左右排列

            redraw(root);//从root开始刷新

            function togglenode(d){
                if (d.children){
                    d["_children"]= d.children;
                    d.children=null;
                }else{
                    d.children=d["_children"];
                    d["_children"]=null;
                }
            }



            function redraw(source){
                //evaluate nodes and links
                var nodes=tree.nodes(root);
                var links=tree.links(nodes);



                function drawnodes(){
                    var nodeUpdate=svg.selectAll(".node").data(nodes,function(d){ return d.name; });

                    var nodeEnter=nodeUpdate.enter();
                    var nodeExit=nodeUpdate.exit();

                    var enterNodes=nodeEnter.append("g")
                        .attr("class","node")
                        .attr("transform", function(d) { //这里使用[d.x,d.y]为上下排列，[d.y,d.x]为左右排列
                            return "translate(" + source.x + "," + source.y + ")";
                        }).on("mouseover",function(d,i){
                            $tooltip.text("parent:{0},current:{1}".format(d.parent.name, d.name)).css({
                               "opacity":1
                            });
                        }).on("mousemove",function(d,i){
                            $tooltip.css({
                                "left":d3.event.pageX+"px",
                                "top":d3.event.pageY+20+"px"
                            });
                        }).on("mouseout",function(d,i){
                            $tooltip.css({
                                "opacity":0
                            });
                        })
                        .on("click",function(d,i){
                            togglenode(d);
                            redraw(d);
                        });
                    enterNodes.append("circle")
                        .attr("r", 0)
                        .style("fill",function(d,i){
                            return d.children?"black":"#fff";
                        })
                        .on("click",function(d,i){
                            //togglenode(d);
                        });

                    enterNodes.append("text")
                        .attr("x", function(d) { return d.children || d._children ? -10 : 10;})
                        .attr("dy", 5)
                        .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
                        .text(function(d) { return d.name; })
                        .style("fill-opacity", 0);

                    enterNodes.transition()
                        .duration(500)
                        .attr("transform", function(d) { //这里使用[d.x,d.y]为上下排列，[d.y,d.x]为左右排列
                            return "translate(" + d.x + "," + d.y + ")";
                        });

                    //重点updateNode中已经包含了enterNode
                    var updateNodes = nodeUpdate.transition()
                        .duration(500)
                        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                    //updateNodes已经开启了transition
                    updateNodes.selectAll("circle")
                        .attr("r",8)
                        .style("fill", function(d) { return d.children ? "lightsteelblue" : "#fff"; });
                    updateNodes.selectAll("text")
                        .style("fill-opacity", 1);

                    var exitNodes=nodeExit.transition()
                        .duration(500);

                    exitNodes.selectAll("circle")
                        .attr("r",0);
                    exitNodes.selectAll("text")
                        .style("fill-opacity",0);
                    exitNodes.attr("transform",function(d,i){
                            return "translate(" + source.x + "," + source.y + ")";
                        })
                        .remove();



                }

                function drawlinks(){
                    var linkUpdate=svg.selectAll(".link")
                        .data(links,function(d){
                            return d.target.name;
                        });
                    var linkEnter=linkUpdate.enter();
                    var linkExit=linkUpdate.exit();

                    var enterLinks=linkEnter.append("path")
                        .attr("class","link")
                        .style("fill-opacity",0)
                        .attr("d", function(d) {
                            var o = {x: source.x, y: source.y};
                            return diagonal({source: o, target: o});
                        });
                    enterLinks.transition()
                        .duration(500)
                        .style("fill-opacity",1)
                        .attr("d",diagonal);  //使用对角线生成器

                    linkUpdate.transition()//这里加transition是为了屏蔽diagonal生成的默认path效果
                        .duration(500)
                        //.style("fill-opacity",1)
                        .attr("d",diagonal);

                    linkExit.transition()
                        .duration(500)
                        .style("file-opacity",0)
                        .attr("d",function(d,i){
                            var o = {x: source.x, y: source.y};
                            return diagonal({source: o, target: o})
                        })
                        .remove();
                }

                drawlinks();
                drawnodes();

                //nodes.forEach(function(d){
                //    d.x0= d.x;
                //    d.y0.d.y;
                //})
            }


        },
        testForceLayout:function(svg){
            var nodes = [ { name: "桂林" }, { name: "广州" },
                { name: "厦门" }, { name: "杭州" },
                { name: "上海" }, { name: "青岛" },
                { name: "天津" } ];

            var links = [ { source : 0 , target: 1 } , { source : 0 , target: 2 } ,
                { source : 0 , target: 3 } , { source : 1 , target: 4 } ,
                { source : 1 , target: 5 } , { source : 1 , target: 6 } ];

            var width=300,height=500;
            var force = d3.layout.force()
                .nodes(nodes) //指定节点数组
                .links(links) //指定连线数组
                .size([width,height]) //指定作用域范围
                .linkDistance(150) //指定连线长度
                .charge([-400]); //相互之间的作用力

            force.start();
            console.log(nodes);
            console.log(links);
            /**
             index：节点的索引号
             px, py：节点上一个时刻的坐标
             x, y：节点的当前坐标
             weight：节点的权重
             * *
             **/
            var color=d3.scale.category10();
            //添加管理节点和文本的g
            var svg_nodegroups=svg.selectAll("g")
                .data(nodes)
                .enter()
                .append("g")
                .each(function(d,i){
                    //用each可以遍历当前选择集
                    //console.log(d.name);
                });
            //添加节点
            var svg_nodes=svg_nodegroups.append("circle")
                .attr("r",20)
                .attr("fill",function(d,i){
                    return color(i);
                })
                .call(force.drag);
            //添加描述节点的文字
            var svg_texts = svg_nodegroups.append("text")
                .style("fill", "black")
                .attr("dx", 20)
                .attr("dy", 8)
                .text(function(d){
                    return d.name;
                });

            //添加连线
            var svg_links = svg.selectAll("line")
                .data(links)
                .enter()
                .append("line")
                .style("stroke","#ccc")
                .style("stroke-width",1);

            force.on("tick", function(){ //对于每一个时间间隔
                //更新连线坐标
                svg_links.attr("x1",function(d){ return d.source.x; })
                    .attr("y1",function(d){ return d.source.y; })
                    .attr("x2",function(d){ return d.target.x; })
                    .attr("y2",function(d){ return d.target.y; });

                //更新节点坐标
                svg_nodes.attr("cx",function(d){ return d.x; })
                    .attr("cy",function(d){ return d.y; });

                //更新文字坐标
                svg_texts.attr("x", function(d){ return d.x; })
                    .attr("y", function(d){ return d.y; });
            });

        },
        testPieLayout:function(svg){
            var $tooltip=this.$tooltip;
            var dataset=[30,13,10,55,43];
            var pie=d3.layout.pie();
            var piedata=pie(dataset);
            console.log(piedata);

            var outerRadius = 150; //外半径
            var innerRadius = 20; //内半径，为0则中间没有空白

            var arc = d3.svg.arc()  //弧生成器
                .innerRadius(innerRadius)   //设置内半径
                .outerRadius(outerRadius);  //设置外半径

            var color = d3.scale.category10();   //有十种颜色的颜色比例尺
            var width=300;
            var arcs=svg.selectAll("g").data(piedata).enter().append("g")
                .attr("transform","translate("+ (width/2) +","+ (width/2) +")");
            arcs.append("path")
                .attr("fill",function(d,i){
                    return color(i);
                })
                .attr("d",function(d,i){
                    return arc(d);
                });
            arcs.append("text")
                .attr("transform",function(d){
                    return "translate(" + arc.centroid(d) + ")";//arc.centroid可以取得某arc数据的中心点位置
                })
                .attr("text-anchor","middle")//重要：使用该属性让文字居中
                .text(function(d,i){
                    return d.data;
                });
            arcs.on("mouseover",function(d,i){
                $tooltip.text(d.data).css({
                    "opacity":"1"
                })
            }).on("mousemove",function(d,i){
                $tooltip.css({
                   "left":d3.event.pageX+"px",
                    "top":(d3.event.pageY+20)+"px"
                });
            }).on("mouseout",function(d,i){
                $tooltip.css({
                    "opacity":"0"
                });
            })

        },
        drawSvg:function(){
            var dataset=[250 , 210 , 170 , 130 , 170];
            var max=d3.max(dataset);
            var min=d3.min(dataset);

            var index=[0,1,2,3,4];
            var colors=["red", "blue", "green", "yellow", "steelblue"];
            var rectHeight=20;
            var linear=d3.scale.linear().domain([0,max]).range([0,100]);
            var ordinal=d3.scale.ordinal().domain(index).range(colors);


            var rects=this.svg.selectAll("rect").data(dataset).enter().append("rect");
            rects.attr("x",20)
                .attr("y",function(d,i){
                    return i*rectHeight;
                })
                .attr("width","0px")
                .attr("height",rectHeight-2)
                .attr("fill",function(d,i){
                    return ordinal(i);
                })
                .transition()
                .duration(1000)
                .ease("bounce")
                .delay(function(d,i){
                    return i*200;
                })
                .attr("width",function(d,i){
                    return linear(d);
                });
            rects.on("click",function(){
                    console.log(d3.event);
                })
                .on("mouseover",function(d,i){
                    d3.select(this).attr("fill","yellow");
                })
                .on("mouseout",function(d,i){
                    d3.select(this).transition()
                        .duration(200)
                        .attr("fill",ordinal(i));
                })


            var axis=d3.svg.axis()
                .scale(linear)//指定比例尺
                .orient("bottom")//指定刻度的方向
                .ticks(3);//指定刻度数量

            this.svg.append("g").call(axis).attr("class","axis").attr("transform","translate(20,130)");

            //this.svg.append("svg").attr("class","mysvg");
        }
    });

    return AppView;
});