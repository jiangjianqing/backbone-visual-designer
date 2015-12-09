define([
    'jquery'
],function($){

    /*
    * jQuery.event.special对象中，保存着为适配特定事件所需的变量和方法，

     具体有:
     delegateType / bindType （用于事件类型的调整）
     setup （在某一种事件第一次绑定时调用）
     add （在事件绑定时调用）
     remove （在解除事件绑定时调用）
     teardown （在所有事件绑定都被解除时调用）
     trigger （在内部trigger事件的时候调用）
     noBubble
     _default
     handle （在实际触发事件时调用）
     preDispatch （在实际触发事件前调用）
     postDispatch （在实际触发事件后调用）
    * */

    var timeout_id,
        str_setTimeout = 'setTimeout',
        str_resize = 'resize',
        str_data = str_resize + '-special-event',
        str_delay = 'delay',
        str_throttle = 'throttleWindow';

    if($.event.special[ str_resize ])//避免重复定义
        return;

    var $element_array=$([]);
    var jq_resize = $.resize = $.extend( $.resize, {} );

    jq_resize[ str_delay ] = 250;
    jq_resize[ str_throttle ] = true;

    function loopy() {

        timeout_id = window[ str_setTimeout ](function(){
            $element_array.each(function(){
                var elem = $(this),
                    width = elem.width(),
                    height = elem.height(),
                    data = $.data( this, str_data );
                if(!data){//如果还没有记录数据，则填充当前信息
                    $.data(this,str_data, { w: elem.width(), h: elem.height() } );
                }else
                if ( width !== data.w || height !== data.h ) {
                    elem.trigger( str_resize, [ data.w = width, data.h = height ] );
                }

            });
            loopy();
        }, jq_resize[ str_delay ] );

    };

    $.event.special[ str_resize ] ={
        setup: function() {
            if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
            var elem = $(this);
            $element_array.push( elem );
            $.data( this, str_data, { w: elem.width(), h: elem.height() } );
            if ( $element_array.length === 1 ) {
                loopy();
            }
        },
        teardown: function() {
            if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }

            var elem = $(this);
            $element_array.splice($.inArray(elem,$element_array),1);//从数组中移除指定元素
            elem.removeData( str_data );

            if ( !$element_array.length ) {
                clearTimeout( timeout_id );
            }
        },
        // Called every time a 'resize' event callback is bound per element (new in
        // jQuery 1.4).
        add: function( handleObj ) {
            if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }

            var old_handler;

            function new_handler( e, w, h ) {
                var elem = $(this),
                    data = $.data( this, str_data );

                // If called from the polling loop, w and h will be passed in as
                // arguments. If called manually, via .trigger( 'resize' ) or .resize(),
                // those values will need to be computed.
                data.w = w !== undefined ? w : elem.width();
                data.h = h !== undefined ? h : elem.height();

                old_handler.apply( this, arguments );
            };

            // This may seem a little complicated, but it normalizes the special event
            // .add method between jQuery 1.4/1.4.1 and 1.4.2+
            if ( $.isFunction( handleObj ) ) {
                // 1.4, 1.4.1
                old_handler = handleObj;
                return new_handler;
            } else {
                // 1.4.2+
                old_handler = handleObj.handler;
                handleObj.handler = new_handler;
            }
        }

    };

});