$(function () {


    $('.tree').empty();

    var tree = new myTree({
        selectNode: '.tree',
        //基本用法  也可以 接口请求 返回数据 例如: "system/permission/getPermissionTree/" 数据自动加载
        data: 'data.json',
        closeAnimate: false, //小动画
        contextMuen: true,//默认false，可不写
        checkbox: true,//默认false，可不写
        showName: 'name',  //显示的字段名称 默认字段为name
        ajax: true,
        ajaxSetting: {
            //异步请求的url
            url: function (id, elem) {
                return /*'basic/wllb/list/?pid=' + id;*/     // elem 是点击的元素 id 你懂的,就是json里面对应该元素的id
            },
            //请求方式
            type: "get",
            //数据生成后，做啥 result是请求后的结果，id 是元素ID elem是元素节点  *!注意 不用自己加载数据,会自动装载异步后的数据
            success: function (result, id, elem) {

            }
        },
        spanClickEvent: function (ev, elem, tree) { //span 点击事件


        },
        onCheck: function ($elem, $checkedNodes) { //树点击check事件


        }

    });
    tree.init();

});


