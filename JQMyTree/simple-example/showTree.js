$(function () {


    new myTree({
        selectNode: '.tree',
        modal: $('.modal'),
        closeAnimate: false,
        //基本用法  也可以 接口请求 返回数据 例如: "system/permission/getPermissionTree/" 数据自动加载
        data: 'data.json',
        contextMuen: true,//默认false，可不写
        checkbox: false,//默认false，可不写
        ajax: false, //默认ajax方式为false *****

        addItem: function (elem, callBack) { //自定义菜单添加方法,elem是右键点击的元素
            //callBack 把元素 callBack(elem,res)

           // saveOrUpdate(elem, callBack)
        },
        updataItem: function (elem, callBack) {
           // saveOrUpdate(elem, callBack)
        },
        deleteItem: function (ev, elem, callBack) {
            // elem 当前元素

        },

    }).init();


});


function saveOrUpdate(elem, callBack) {
    $.ajax({
        async: false,
        url: "system/permission/saveOrUpdate/",
        type: "get",
        data: $('#permissionForm').serialize(),// 你的formid
        success: function (result) {
            //data必须返回该添加数据
            if ($.isPlainObject(result)) {

                callBack ? callBack(elem, result) : '';
                if (!$('#permissionId').val()) {
                   alert('新增成功');
                } else {
                   alert('修改成功');
                }

            } else {
                alert('添加失败');
            }
        }
    });
}