/**
 * Created by Golf on 2016/9/9.
 */

function myTree(initmsg) {
    //工具方法(空参)
    if (arguments.length == 0) {
        var tree = new Object();
        tree.showMsg = function (errMsg) {
            var left = $('body').outerWidth(true) / 2;
            var $treeMsg = $('#treeMsg');
            $('.errInfo').remove();
            $treeMsg.removeClass('alert-info').addClass('alert-danger');
            var msgWidth = $treeMsg.outerWidth(true) / 2;
            $treeMsg.append($('<span class="errInfo">' + errMsg + '</span>'));
            $treeMsg.css({
                'left': left - msgWidth,
                'top': 200,
                'opacity': 1
            });
        };

        tree.showMsgHide = function (successMsg) {
            var left = $('body').outerWidth(true) / 2;
            var $treeMsg = $('#treeMsg');
            $('.errInfo').remove();
            $treeMsg.removeClass('alert-danger').addClass('alert-info');
            var msgWidth = $treeMsg.outerWidth(true) / 2;
            $treeMsg.append($('<span class="errInfo">' + successMsg + '</span>'));
            $treeMsg.css({
                'left': left - msgWidth,
                'top': 200,
                'opacity': 1
            });
            setTimeout(function () {
                $treeMsg.css({
                    'opacity': 0,
                    'left': -1300
                });
            }, 1300);
        };

        return tree;
    }

    this.initMsg = {
        selectNode: initmsg.selectNode,  // jq selector
        checkedField : initmsg.checkedField || null,
        height: initmsg.height || null, //高度控制
        width: initmsg.width || null, //宽度控制
        closeAnimate: initmsg.closeAnimate == false || initmsg.closeAnimate == null || initmsg.closeAnimate == 'undefind' ? false : true,//是否动画
        data: function () {    //加载数据
            var datas = null;
            $.ajax({
                url: initmsg.data,
                type: "get",
                async: false,
                success: function (data) {
                    datas = data;
                },
            });
            return datas;
        }(),
        ajax: initmsg.ajax || false,               //是否异步模式
        checkbox: initmsg.checkbox || false,       //树，是否显示checkbox，默认false
        contextMuen: initmsg.contextMuen || false,  //默认false   boolean值，true弹出自定义菜单，false弹出浏览器默认菜单
        addItem: initmsg.addItem || '',                  //自定义菜单添加方法
        updataItem: initmsg.updataItem || '',        //自定义菜单修改方法
        deleteItem: initmsg.deleteItem || '',     //自定义菜单删除方法
        floorIcon: initmsg.floorIcon || "glyphicon glyphicon-sort-by-attributes",       //顶部节点icon
        parentIcon: initmsg.parentIcon || "glyphicon glyphicon-plus-sign",// 父级icon
        childIcon: initmsg.childIcon || "glyphicon glyphicon-leaf",       // 子级icon
        changIcon: initmsg.changIcon || "glyphicon glyphicon-minus-sign", // 父级点击后，变换的icon
        addNode: initmsg.addNode || function (elem, data) {
            if (data) {
                var $li = null;
                var str = '';
                var showName = '';
                for (var key in data) {
                    if ($.trim(data[key])) {
                        str += key + '=' + data[key] + ' ';
                    } else {
                        str += key + '=' + '""';
                    }

                    if (key == this.initMsg.showName) {
                        showName = data[key]
                    }

                }
                ;

                if (this.checkbox) {
                    $li = $('<li><label><input type="checkbox" class="input_check"></label><span ' + str + '><i class="glyphicon glyphicon-user"></i> ' + data.name + '</span></li>')
                } else {
                    $li = $('<li><span ' + str + '><i class="glyphicon glyphicon-user"></i> ' + /*data.name*/showName + '</span></li>');
                }

                if ($(elem).attr('haschild') == 'true') {
                    $(elem).siblings('ul').append($li);
                } else {
                    var $ul = $('<ul></ul>').append($li);
                    $(elem).closest('li').append($ul);
                    $(elem).attr('haschild', 'true');
                }
                //事件重新生成
                this.baseInit(this);
                if (elem.attr('haschild') == 'true') {
                    if ($(elem).siblings('ul').find('li').css('display') != 'list-item') {
                        $(elem).click();
                    } else {
                        $(elem).find('>i').removeClass().addClass('glyphicon glyphicon-minus-sign');
                        $li.css('display', 'list-item');
                    }
                }

                var pid = '';
                var fatherElem = $(elem).closest('ul').siblings('span');
                var hasFather = fatherElem.attr('pid') != 0 ? true : false;


                while (hasFather) {
                    pid = fatherElem.attr('pid');
                    if (pid != '0' && pid != '' && typeof(pid) != 'undefined') {
                        fatherElem.find('i').removeClass().addClass('glyphicon glyphicon-minus-sign');
                        fatherElem = $('span[id=' + pid + ']');

                    } else {
                        hasFather = false;
                        // strName = fatherElem.attr('projectno') + ' / ' + strName;
                    }
                }
                this.modal.modal('hide');
            }
        }.bind(this),//添加
        updataNode: initmsg.updataNode || function (elem, data) {
            var showNmae = '';
            var $i = elem.find('>i');
            elem.empty();

            for (var attr in data) {
                if (data[attr]) {
                    elem.attr(attr, data[attr]);
                } else {
                    elem.attr(attr, '-');
                }
                if (attr == this.initMsg.showName) {
                    showNmae = data[attr];
                }
            }
            elem.prepend($i).append(' ' + showNmae /*data.name*/);

            this.modal.modal('hide');
            this.baseInit(this);
            var pid = '';
            var fatherElem = $(elem).closest('ul').siblings('span');
            var hasFather = fatherElem.attr('pid') != 0 ? true : false;


            while (hasFather) {
                pid = fatherElem.attr('pid');
                if (pid != '0' && pid != '' && typeof(pid) != 'undefined') {
                    fatherElem.find('>i').removeClass().addClass('glyphicon glyphicon-minus-sign');
                    fatherElem = $('span[id=' + pid + ']');

                } else {
                    hasFather = false;
                    // strName = fatherElem.attr('projectno') + ' / ' + strName;
                }
            }


            if ($(elem).siblings('ul').find('li').css('display') == 'list-item' && $(elem).attr('haschild') == 'true') {
                $(elem).find('>i').removeClass().addClass('glyphicon glyphicon-minus-sign');
            }
        }.bind(this), //修改
        deleteNode: initmsg.deleteNode || function (elem, result) {

            var $ul = elem.closest('ul');
            $pElem = $ul.siblings('span');
            elem.closest('li').remove();
            if ($ul.find('li').length == 0) {
                $pElem.removeAttr('type');
                $ul.remove();
            }
            for (attr in result) {
                $pElem.attr(attr, result[attr]);
            }

            this.modalMsg.modal('hide');

            this.baseInit(this);

            var pid = '';
            var fatherElem = $pElem;
            var hasFather = fatherElem.attr('pid') != 0 ? true : false;


            while (hasFather) {
                pid = fatherElem.attr('pid');
                if (pid != '0' && pid != '') {
                    fatherElem.find('>i').removeClass().addClass('glyphicon glyphicon-minus-sign');
                    fatherElem = $('span[id=' + pid + ']');

                } else {
                    hasFather = false;
                    // strName = fatherElem.attr('projectno') + ' / ' + strName;
                }
            }

            if ($pElem.attr('haschild') == 'false') {
                $pElem.find('i').removeClass().addClass('glyphicon glyphicon-leaf');
            }

        }.bind(this),  //删除
        onLoadSuccess: initmsg.onLoadSuccess || '',   //加载后完成
        showName: initmsg.showName || 'name',     // 显示的字段，默认是name
        ajaxSetting: initmsg.ajaxSetting,         // 异步加载的规则
        ajaxCheckedSetting: initmsg.ajaxCheckedSetting,  // 异步加载 checkbox的规则
        ajaxToDo: initmsg.ajaxToDo || function (id, elem) {

            var that = $(this);

            var innerUl = $('<ul></ul>').insertAfter(elem);
            $.ajax({
                // async: false,
                url: that.get(0).initMsg.ajaxSetting.url(id, elem),
                type: that.get(0).initMsg.ajaxSetting.type,
                success: function (result) {
                    var liStrat = '<li ><span ';
                    var liMid = '><i></i> ';
                    var liEnd = '</span></li>'
                    var liStr = '';
                    for (var i = 0; i < result.length; i++) {
                        var str = '';
                        var showName = '';
                        for (var key in result[i]) {
                            var val = result[i][key];
                            if (result[i][key] == '') {
                                str += '  ' + key + '  ';
                            } else {
                                str += key + '=' + val + '  ';
                            }

                            if (key == that.get(0).initMsg.showName) {
                                showName = result[i][key]
                            }
                        }
                        liStr += result[i].hasChild ? '<li class="parent_li"><span ' + str + liMid + showName + liEnd :
                            liStrat + str + liMid + showName + liEnd
                    }

                    innerUl.append(liStr);

                    //基本初始化方法
                    that.get(0).baseInit(that.get(0));

                    //为点击的节点换Icon  -号的
                    $(elem).find('>i').removeClass().addClass(that.get(0).initMsg.changIcon);
                    //添加后的元素展开
                    !that.get(0).initMsg.closeAnimate ? innerUl.find('li').show('fast').css('display', 'list-item') : innerUl.find('li').show().css('display', 'list-item');

                    var elemId = $(elem).attr('pid');
                    //把父节点的Icon全部变成 -号
                    while (elemId != 0) {
                        if ($('#' + elemId).attr('pid') != 0) {
                            $('#' + elemId).find('>i').removeClass().addClass(that.get(0).initMsg.changIcon);
                        }
                        elemId = $('#' + elemId).attr('pid');
                    }
                    that.get(0).initMsg.ajaxSetting.success ? that.get(0).initMsg.ajaxSetting.success(result, id, elem) : '';
                }
            });

        }.bind(this),
        ajaxCheckedToDo: initmsg.ajaxCheckedToDo || function (id, elem) {
            var that = $(this);

            var innerUl = $('<ul></ul>').insertAfter(elem);
            $.ajax({
                url: that.get(0).initMsg.ajaxCheckedSetting.url(id, elem),
                type: that.get(0).initMsg.ajaxCheckedSetting.type,
                success: function (result) {

                    var liStrat = '<li ><span ';
                    var liMid = '><i></i> ';
                    var liEnd = '</span></li>'
                    var liStr = '';

                    for (var i = 0; i < result.length; i++) {
                        var str = '';
                        var showName = '';
                        for (var key in result[i]) {
                            var val = result[i][key];
                            if (result[i][key] == '') {
                                str += '  ' + key + '  ';
                            } else {
                                str += key + '=' + val + '  ';
                            }

                            if (key == that.get(0).initMsg.showName) {
                                showName = result[i][key]
                            }
                        }
                        liStr += result[i].hasChild ? '<li class="parent_li"><label fid=' + result[i].pid + ' sid=' + result[i].id +
                            '><input type="checkbox" class="input_check"></label><span ' + str +
                            '><i></i> ' + showName + '</span></li>'
                            :
                            '<li><label fid=' + result[i].pid + ' sid=' + result[i].id +
                            '><input type="checkbox" class="input_check"></label><span ' + str + '><i></i> ' + showName + '</span></li>'
                    }

                    innerUl.append(liStr);

                    //基本初始化方法
                    that.get(0).baseInit(that.get(0));

                    //为点击的节点换Icon  -号的
                    $(elem).find('>i').removeClass().addClass(that.get(0).initMsg.changIcon);
                    //添加后的元素展开
                    !that.get(0).initMsg.closeAnimate ? innerUl.find('li').show('fast').css('display', 'list-item') : innerUl.find('li').show().css('display', 'list-item');

                    var elemId = $(elem).attr('pid');
                    //把父节点的Icon全部变成 -号
                    while (elemId != 0) {
                        if ($('#' + elemId).attr('pid') != 0) {
                            $('#' + elemId).find('>i').removeClass().addClass(that.get(0).initMsg.changIcon);
                        }
                        elemId = $('#' + elemId).attr('pid');
                    }
                    ;

                    that.get(0).initMsg.ajaxCheckedSetting.success ? that.get(0).initMsg.ajaxCheckedSetting.success(result, id, elem) : '';
                }
            });
        }.bind(this),
        onCheck: initmsg.onCheck || function ($elem, $checkedNodes) {


        }.bind(this),
        spanClickEvent : initmsg.spanClickEvent,   //span 点击事件

    };
    this.popover = initmsg.popover || $('<div class="popover treepopover right"><div class="arrow"></div><h3 class="popover-title">选择操作</h3><div class="popover-content"><button class="btn-xs btn btn-info btn-block add"><em class="glyphicon glyphicon-plus"></em>添加</button><button class="btn-xs btn btn-info btn-block revision"><em class="glyphicon glyphicon-pencil"></em>修改</button><button class="btn-xs btn btn-danger btn-block delete"><em class="glyphicon glyphicon-remove"></em>删除</button></div></div>');

    this.modal = initmsg.modal || $('<div class="modal fade" id="branchModal" aria-hidden="true" role="dialog" aria-labelledby="gridSystemModalLabel"><div class="modal-dialog modal-md" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="gridSystemModalLabel">新增节点</h4></div><div class="modal-body"><div class="container-fluid"><form class="form-horizontal" id="branchForm"><input type="hidden" name="id" id="branchId"><input type="hidden" class="form-control" id="pid" name="pid" placeholder="上级节点"><div class="form-group"><label for="pname" class="col-sm-3 control-label">上级节点</label><div class="col-sm-10"><input type="text" class="form-control" id="pname" name="pname" placeholder="上级节点" readonly></div></div><div class="form-group"><label for="name" class="col-sm-3 control-label">节点名称</label><div class="col-sm-10"><input type="text" class="form-control" id="name" name="name" placeholder="节点名称"></div></div><div class="form-group"><label for="sortid" class="col-sm-3 control-label">节点排序</label><div class="col-sm-10"><input type="text" class="form-control" id="sortid" name="sortid" placeholder="节点排序"></div></div><div class="form-group"><div class="col-sm-offset-3 col-sm-10"><button type="button" class="btn btn-primary marginRight saveOrUpdataBtn">保存</button><button type="button" class="btn btn-default" data-dismiss="modal">返回</button></div></div></form></div></div><div class="modal-footer"></div></div></div></div>');
    this.treeMsg = initmsg.treeMsg || $('<div id="treeMsg"  class="alert alert-danger alert-dismissible col-md-4" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>注意!</strong></div>');

    this.modalMsg = initmsg.modalMsg || $('<div class="modal" id="modalMsg" aria-hidden="true" role="dialog" aria-labelledby="ModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">删除节点</h4></div><div class="modal-body"><p>是否确认删除该节点？</p></div><div class="modal-footer" style="text-align: center;"><button type="button" class="btn btn-default" aria-hidden="true" data-dismiss="modal">返回</button> <button type="button" data-dismiss="#modalMsg" aria-hidden="true" style="margin-left:30px;" class="btn btn-primary removeNode">删除</button></div></div></div></div>');

};

myTree.prototype.getData = function () {
    return this.initMsg.data;
};

myTree.prototype.getCheckedElem = function () {
    return $('.inputItem').siblings('span');
};

myTree.prototype.baseInit = function (that) {
    //通用添加parent_li类，
    $('' + that.initMsg.selectNode + '').find('li:has(ul)').each(function (i, elem) {
        if (i != 0) {
            //可预留增加type属性的各种选项
            $(elem).addClass('parent_li ' + i).find(' > span').attr('type', 'itemList');
        } else {
            $(elem).addClass('parent_li').children("span").find("i").removeClass().addClass(that.initMsg.floorIcon);
        }
    });

    //通用父元素，子元素添加对应 icon
    $('.treeContent').find('li').each(function (i, elem) {

        if ($(elem).children('span').attr('haschild') == 'true') {
            $(elem).children("span").find("i").removeClass().addClass(that.initMsg.parentIcon);
        } else {
            $(elem).find("span i").removeClass().addClass(that.initMsg.childIcon);
        }

    });

    //通用元素的click icon变换
    $(that.initMsg.selectNode).find('li.parent_li > span').each(function (i, elem) {
        if (i != 0) {
            $(elem).off('click.changeIcon');
            $(elem).on('click.changeIcon', function (e) {
                $('.popover').hide('fast');
                var children = $(elem).parent('li.parent_li').find(' > ul > li');

                if (children.is(":visible")) {
                    !that.initMsg.closeAnimate ? children.hide('fast') : children.hide();
                    $(elem).find(' > i').removeClass(that.initMsg.changIcon).addClass(that.initMsg.parentIcon);
                } else {
                    var $sib = $(elem).parent('li.parent_li').siblings();
                    !that.initMsg.closeAnimate ? children.hide('fast') : children.hide();
                    !that.initMsg.closeAnimate ? $sib.find(' ul > li').hide('fast') : $sib.find(' ul > li').hide();
                    $sib.find('span[haschild="true"] >i').removeClass().addClass(that.initMsg.parentIcon);
                    !that.initMsg.closeAnimate ? children.show('fast') : children.show();
                    $(elem).find(' > i').removeClass(that.initMsg.parentIcon).addClass(that.initMsg.changIcon);
                }
                return false;
            });
        }

    });

    //通用active
    $('.treeContent span').each(function (i, elem) {
        $(elem).off('click.active');
        $(elem).on('click.active', function (ev) {
            if (ev.which == 1 || ev.which == 2) {
                that.methods.activeChange(ev, elem, that);
                that.initMsg.spanClickEvent ? that.initMsg.spanClickEvent(ev, elem, that) : '';
            }
            ;
            ev.stopPropagation();
        });
    });
    //ajax的添加元素
    if ((that.initMsg.ajax) == true && (that.initMsg.checkbox) == false) {

        $('.treeContent span[haschild=true]').each(function (i, elem) {
            $(elem).off('click.ajax');
            $(elem).on('click.ajax', function (ev) {

                //如果该元素下，没有ul 而且属性带有 haschild=true
                if ($(elem).siblings('ul').length === 0 && $(elem).attr('haschild') === 'true') {

                    var valueId = $(elem).attr('id');
                    that.initMsg.ajaxToDo ? that.initMsg.ajaxToDo(valueId, $(elem)) : '';
                }
                ev.stopPropagation();
            });
        });
    }
    //ajax 而且 为checkbox 模式
    if ((that.initMsg.ajax) == true && (that.initMsg.checkbox) == true) {
        //点击span 请求服务器数据添加元素
        $('.treeContent span[haschild=true]').each(function (i, elem) {
            $(elem).off('click.ajax');
            $(elem).on('click.ajax', function (ev) {

                //如果该元素下，没有ul 而且属性带有 haschild=true
                if ($(elem).siblings('ul').length === 0 && $(elem).attr('haschild') === 'true') {

                    var valueId = $(elem).attr('id');
                    that.initMsg.ajaxCheckedToDo ? that.initMsg.ajaxCheckedToDo(valueId, $(elem)) : '';
                }
                ev.stopPropagation();
            });
        });

        //ajaxCheckBox模式 - 点击操作
        $(that.initMsg.selectNode).find('label').off('click.inputChecks');
        $(that.initMsg.selectNode).find('label').on('click.inputChecks', function (ev) {
            // this 是 label元素     $(this).siblings('ul')是该元素下的子元素
            var $that = $(this);
            var $thisUl = $that.siblings('ul');
            //是否已经选中元素
            if (!$that.find('>input[type=checkbox]').prop('checked')) {//没选中的操作
                $that.removeClass().addClass('inputItem').find('input[type=checkbox]').prop('checked', true);

                //判断是否有子集，如果有子级，则子集全部选中
                if ($thisUl.length) {
                    $thisUl.children('li').find('label').removeClass().addClass('inputItem').find('input').prop('checked', true);
                }

                var pid = $that.attr('fid');

                while (pid != '0') {
                    //父级元素
                    var fElem = $('label[sid=' + pid + ']');
                    pid = fElem.length ? fElem.attr('fid') : 0;
                    var $sibs = fElem.siblings('ul').find('input[type=checkbox]');
                    if ($sibs.length) {
                        // isAllChecked 是判断兄弟节点是否全部选中
                        var isAllChecked = true;
                        $sibs.each(function (i, elem) {
                            //如果有兄弟节点不是选中，则为fasle，终止循环。
                            if (!$(elem).prop('checked')) {
                                isAllChecked = false;
                                return false;
                            }
                        });

                        if (isAllChecked) {
                            //全部选中 添加 inputItem class
                            fElem.removeClass().addClass('inputItem').find('input[type=checkbox]').prop('checked', true);
                        } else {
                            //不是全部选中 添加 notAllCheck class
                            fElem.removeClass().addClass('notAllCheck').find('input[type=checkbox]').prop('checked', true);
                        }
                    } else {
                        fElem.removeClass();
                    }

                }
                ;

            } else {//选中后点击 的 操作
                //当前元素移除选中 checked
                $that.removeClass().find('input[type=checkbox]').prop('checked', false);

                //如果有子元素 则移除所有子元素的选中状态
                if ($thisUl.length) {
                    $thisUl.children('li').find('label').removeClass().find('input').prop('checked', false);
                }

                var pid = $that.attr('fid');

                while (pid != '0') {
                    var isChecked = false;
                    //父级元素
                    var fElem = $('label[sid=' + pid + ']');
                    pid = fElem.length ? fElem.attr('fid') : 0;
                    fElem.siblings('ul').find('input[type=checkbox]').each(function (i, elem) {
                        if ($(elem).prop('checked')) {
                            isChecked = true;
                            return false;
                        }
                    });

                    if (!isChecked) {
                        //当前元素移除选中 checked
                        fElem.removeClass().find('input[type=checkbox]').prop('checked', false);
                        //如果有子元素 则移除所有子元素的选中状态
                        if (fElem.siblings('ul').length) {
                            fElem.children('li').find('label').removeClass().find('input').prop('checked', false);
                        }
                        ;

                    } else {
                        break;
                    }

                }
                ;

                pid = $that.attr('fid');
                while (pid != '0') {
                    //父级元素
                    var fElem = $('label[sid=' + pid + ']');
                    pid = fElem.length ? fElem.attr('fid') : 0;

                    //如果父级元素选中 ， 则添加class
                    if (fElem.find('>input').prop('checked')) {
                        fElem.removeClass().addClass('notAllCheck');
                    } else {
                        //如果父级元素没选中， 则删除全部class
                        fElem.closest('li').find('input').removeClass();
                    }

                }
                ;
            }
            ;
            //选中的蓝色元素
            that.initMsg.onCheck ? that.initMsg.onCheck($that, $(that.initMsg.selectNode).find('.inputItem')) : '';
            ev.stopPropagation();
            ev.preventDefault();
        });

        //ajaxCheckBox模式 - 点击input[checkBox]值变换的事件
        $(that.initMsg.selectNode).find('input[type=checkbox]').off('change.checkedChange');
        $(that.initMsg.selectNode).find('input[type=checkbox]').on('change.checkedChange', function (ev) {

            if ($(this).prop('checked')) {
                that.methods.checkElemChange(this)
            } else {
                //该input元素的顶级父元素
                var fartherLi = $(this).closest('label').parents('.treeContent > ul >li.parent_li');
                var isClose = true;
                //判断其子集input是否存在选中
                fartherLi.find('>ul input[type=checkbox]').each(function (i, elem) {

                    if ($(elem).prop('checked')) {
                        isClose = false;
                        return false;
                    }
                })
                isClose ? fartherLi.children('label').removeClass('inputItem').find('input[type=checkbox]').prop('checked', false) : '';
            }
            ;

        });

    }
    ;
    //checkBox模式
    if ((that.initMsg.ajax) == false && (that.initMsg.checkbox) == true) {
        //checkBox模式通用 - 点击操作
        $(that.initMsg.selectNode).find('label').off('click.inputCheck');
        $(that.initMsg.selectNode).find('label').on('click.inputCheck', function (ev) {
            // this 是 label元素     $(this).siblings('ul')是该元素下的子元素
            var $that = $(this);
            var $thisUl = $that.siblings('ul');
            //是否已经选中元素
            if (!$that.find('>input[type=checkbox]').prop('checked')) {//没选中的操作
                $that.removeClass().addClass('inputItem').find('input[type=checkbox]').prop('checked', true);

                //判断是否有子集，如果有子级，则子集全部选中
                if ($thisUl.length) {
                    $thisUl.children('li').find('label').removeClass().addClass('inputItem').find('input').prop('checked', true);
                }


                var pid = $that.attr('fid');

                while (pid != '0') {
                    //父级元素
                    var fElem = $('label[sid=' + pid + ']');
                    pid = fElem.length ? fElem.attr('fid') : 0;
                    var $sibs = fElem.siblings('ul').find('input[type=checkbox]');
                    if ($sibs.length) {
                        // isAllChecked 是判断兄弟节点是否全部选中
                        var isAllChecked = true;
                        $sibs.each(function (i, elem) {
                            //如果有兄弟节点不是选中，则为fasle，终止循环。
                            if (!$(elem).prop('checked')) {
                                isAllChecked = false;
                                return false;
                            }
                        });

                        if (isAllChecked) {
                            //全部选中 添加 inputItem class
                            fElem.removeClass().addClass('inputItem').find('input[type=checkbox]').prop('checked', true);
                        } else {
                            //不是全部选中 添加 notAllCheck class
                            fElem.removeClass().addClass('notAllCheck').find('input[type=checkbox]').prop('checked', true);
                        }
                    } else {
                        fElem.removeClass();
                    }

                }
                ;


            } else {//选中后点击 的 操作
                //当前元素移除选中 checked
                $that.removeClass().find('input[type=checkbox]').prop('checked', false);

                //如果有子元素 则移除所有子元素的选中状态
                if ($thisUl.length) {
                    $thisUl.children('li').find('label').removeClass().find('input').prop('checked', false);
                }

                var pid = $that.attr('fid');

                while (pid != '0') {
                    var isChecked = false;
                    //父级元素
                    var fElem = $('label[sid=' + pid + ']');
                    pid = fElem.length ? fElem.attr('fid') : 0;
                    fElem.siblings('ul').find('input[type=checkbox]').each(function (i, elem) {
                        if ($(elem).prop('checked')) {
                            isChecked = true;
                            return false;
                        }
                    });

                    if (!isChecked) {
                        //当前元素移除选中 checked
                        fElem.removeClass().find('input[type=checkbox]').prop('checked', false);
                        //如果有子元素 则移除所有子元素的选中状态
                        if (fElem.siblings('ul').length) {
                            fElem.children('li').find('label').removeClass().find('input').prop('checked', false);
                        }
                        ;

                    } else {
                        break;
                    }

                }
                ;

                pid = $that.attr('fid');
                while (pid != '0') {
                    //父级元素
                    var fElem = $('label[sid=' + pid + ']');
                    pid = fElem.length ? fElem.attr('fid') : 0;

                    //如果父级元素选中 ， 则添加class
                    if (fElem.find('>input').prop('checked')) {
                        fElem.removeClass().addClass('notAllCheck');
                    } else {
                        //如果父级元素没选中， 则删除全部class
                        fElem.closest('li').find('input').removeClass();
                    }

                }
                ;
            }

            that.initMsg.onCheck ? that.initMsg.onCheck($that, $(that.initMsg.selectNode).find('.inputItem')) : '';
            ev.stopPropagation();
            ev.preventDefault();

        });

        //checkBox模式通用 - 点击input[checkBox]值变换的事件
        $(that.initMsg.selectNode).find('input[type=checkbox]').off('change.checkedChange');
        $(that.initMsg.selectNode).find('input[type=checkbox]').on('change.checkedChange', function (ev) {

            if ($(this).prop('checked')) {
                that.methods.checkElemChange(this)
            } else {
                //该input元素的顶级父元素
                var fartherLi = $(this).closest('label').parents('.treeContent > ul >li.parent_li');
                var isClose = true;
                //判断其子集input是否存在选中
                fartherLi.find('>ul input[type=checkbox]').each(function (i, elem) {

                    if ($(elem).prop('checked')) {
                        isClose = false;
                        return false;
                    }
                })
                isClose ? fartherLi.children('label').removeClass('inputItem').find('input[type=checkbox]').prop('checked', false) : '';
            }
        });
    }
    //取消右键默认菜单，然后弹出操作
    if (that.initMsg.contextMuen) {
        $('#modalMsg').remove();
        $('.popover').remove();
        //添加自定义弹出框   .treeContent ul span ->顶级节点不添加   .treeContent span ->顶级节点添加
        $('.treeContent ul span').append(that.popover);

        $('span[pid=0]').append($('<div class="popover treepopover right"><div class="arrow"></div><h3 class="popover-title">选择操作</h3><div class="popover-content"><button class="btn-xs btn btn-info btn-block add"><em class="glyphicon glyphicon-plus"></em>添加</button><!--<button class="btn-xs btn btn-info btn-block revision"><em class="glyphicon glyphicon-pencil"></em>修改</button>--></div></div>'));

        $('body').append(that.modalMsg);
        //添加当前节点模态框弹出事件
        $('.add').each(function (i, elem) {
            $(elem).off();
            $(elem).on('click.doSomeing', function (ev) {
                //当前span节点
                $(".saveOrUpdataBtn").off();  //规定类名
                var $current = $(this).closest('span');
                that.initMsg.addItem ? that.initMsg.addItem($current, that.initMsg.addNode) : '';
                that.modal.modal ? that.modal.modal({backdrop: 'static', keyboard: false}) : '';
                $('.popover').fadeOut();
                ev.stopPropagation();
            });
        });

        //修改当前节点模态框弹出事件
        $('.revision').each(function (i, elem) {
            $(elem).off();
            $(elem).on('click.revisionSomeing', function (ev) {
                //当前span节点
                $(".saveOrUpdataBtn").off();  //规定类名
                var $current = $(this).closest('span');
                that.initMsg.updataItem ? that.initMsg.updataItem($current, that.initMsg.updataNode) : '';
                that.modal.modal ? that.modal.modal({backdrop: 'static', keyboard: false}) : '';
                $('.popover').fadeOut();
                ev.stopPropagation();
            });
        });

        //删除当前节点模态框弹出事件
        $('.delete').each(function (i, elem) {
            $(elem).off();
            $(elem).on('click.deleteSomeing', function (ev) {
                $(".saveOrUpdataBtn").off();  //规定类名
                //当前span节点
                var $current = $(this).closest('span');

                $('.removeNode').off().on('click.removeNode', function (ev) {
                    that.initMsg.deleteItem ? that.initMsg.deleteItem(ev, $current, that.initMsg.deleteNode) : '';
                });

                that.modalMsg.modal({backdrop: 'static', keyboard: false});

                $('.popover').fadeOut();
                ev.stopPropagation();
            });
        });

        //点击空白地方取消 隐藏菜单模块
        $(document).off('click.removePopo');
        $(document).on('click.removePopo', function (ev) {
            $('.treepopover').hide('fast');
        });

        //取消浏览器右键的默认菜单， 然后每个span元素添加右键自定义 菜单
        $(".treeContent").each(function (i, elem) {
            $(elem).off('contextmenu.treeContentRight');
            $(elem).on("contextmenu.treeContentRight", function () {
                return false;
            })
        }).find('span').each(function (i, elem) {
            $(elem).off('contextmenu.showpopover');
            $(elem).on("contextmenu.showpopover", function (ev) {
                //不允许 根顶级节点find('li > span')
                //允许 根顶级节点 find('span')
                that.methods.activeChange(ev, elem, that);

                if (ev.target.tagName.toLocaleLowerCase() === "span" || ev.target.tagName.toLocaleLowerCase() === "i") {

                    $(".treeContent").find('span > .popover').fadeOut();
                    if ($(this).attr('pid') != '0') {
                        $(this).find('.popover').css({
                            'left': $(this).outerWidth(true) + 2
                        }).fadeIn();
                    }else {
                        $(this).find('.popover').css({
                            'left': $(this).outerWidth(true) + 2,
                            'top' : '-16px'
                        }).fadeIn();
                    }

                }
                ;



                ev.stopPropagation();
                return false;
            });
        });
    }
    ;

    that.initMsg.onLoadSuccess ? that.initMsg.onLoadSuccess() : '';
};

myTree.prototype.methods = {
    //初始化DOM元素
    formatData: function (datas, that) {
        formatTree(datas);
        function formatTree(datas) {
            var str = '';
            var showName = '';
            for (var key in datas) {
                var val = datas[key];
                if (!datas[key]) {
                    str += '  ' + key + '  ';
                } else {
                    str += key + '=' + val + '  ';
                }

                if (key == that.initMsg.showName) {
                    showName = datas[key]
                }
            }


            var oul = $("<ul></ul>");
            var li = $('<li class="treeContent"><span ' + str + '><i></i> ' + showName + '</span></li>');
            var innerUl = $('<ul></ul>')
            if (datas.children) {
                for (var i = 0; i < datas.children.length; i++) {
                    formatchildren(datas.children[i], innerUl);
                }
            }
            li.append(innerUl);
            oul.append(li);
            $(that.initMsg.selectNode).append(oul);
        };

        function formatchildren(data, innerUl) {

            var str = '';
            var showName = '';
            for (var key in data) {
                var val = data[key];
                if (data[key] == '') {
                    str += '  ' + key + '  ';
                } else {
                    str += key + '=' + val + '  ';
                }
                if (key == that.initMsg.showName) {
                    showName = data[key]
                }
            }

            var lis = $('<li><span ' + str + '><i></i> ' + showName + '</span></li>');
            if (data.children) {
                var uls = $("<ul></ul>");
                for (var i = 0; i < data.children.length; i++) {
                    formatchildren(data.children[i], uls);
                }
            }

            lis.append(uls);
            innerUl.append(lis);

        };
    },

    checkFormatData: function (datas, that) {
        checkFormatData(datas);

        function checkFormatData(datas) {
            var str = '';
            var showName = '';
            for (var key in datas) {
                var val = datas[key];
                if (!datas[key]) {
                    str += '  ' + key + '  ';
                } else {
                    str += key + '=' + val + '  ';
                }

                if (key == that.initMsg.showName) {
                    showName = datas[key]
                }
            }
            ;

            var oul = $("<ul></ul>");
            var li = $('<li class="treeContent"><span ' + str + '><i></i> ' + showName + '</span></li>');
            var innerUl = $('<ul></ul>')
            if (datas.children) {
                for (var i = 0; i < datas.children.length; i++) {
                    checkFormatchildren(datas.children[i], innerUl);
                }
            }
            li.append(innerUl);
            oul.append(li);
            $(that.initMsg.selectNode).append(oul);
        };

        function checkFormatchildren(data, innerUl) {

            var str = '';
            var showName = '';
            for (var key in data) {
                var val = data[key];
                if (!data[key]) {
                    str += '  ' + key + '  ';
                } else {
                    str += key + '=' + val + '  ';
                }

                if (key == that.initMsg.showName) {
                    showName = data[key]
                }
            }
            ;
            var checkeds = data[that.initMsg.checkedField] ? "checked" : '';
            var inputItem = data[that.initMsg.checkedField] ? "inputItem" : '';
            var lis = data.hasChild ? $('<li class="parent_li"><label class="'+ inputItem +'" fid=' + data.pid + ' sid=' + data.id + '><input '+ checkeds +' type="checkbox" class="input_check"></label><span ' + str + '><i></i> ' + showName + '</span></li>') : $('<li><label class="'+ inputItem +'" fid=' + data.pid + ' sid=' + data.id + '><input '+ checkeds +' type="checkbox" class="input_check"></label><span ' + str + '><i></i> ' + showName + '</span></li>')

            if (data.children) {
                var uls = $("<ul></ul>");
                for (var i = 0; i < data.children.length; i++) {
                    checkFormatchildren(data.children[i], uls);
                }
            }

            lis.append(uls);
            innerUl.append(lis);

        };
    },

    //通用的点击input[checkBox] change事件
    checkElemChange: function (checkElem) {
        changeCheck(checkElem);
        function changeCheck(checkElem) {
            if ($(checkElem).closest('ul').siblings('label').length) {
                var inputELem = $(checkElem).closest('ul').siblings('label').addClass('inputItem').find('>input').prop('checked', true);
                changeCheck(inputELem);
            }
        }
    },

    activeChange: function (ev, that, obj) {
        $(obj.initMsg.selectNode).find('span').removeClass('active');
        $(that).addClass('active');
        ev.stopPropagation();
    },
    //ajax格式化生成
    ajaxFormat: function (datas, that) {

        ajaxFormatTree(datas, that);

        function ajaxFormatTree(datas) {
            var str = '';
            var showName = '';
            for (var key in datas) {
                var val = datas[key];
                if (!datas[key]) {
                    str += '  ' + key + '  ';
                } else {
                    str += key + '=' + val + '  ';
                }

                if (key == that.initMsg.showName) {
                    showName = datas[key]
                }
            }


            var oul = $("<ul></ul>");
            var li = $('<li class="treeContent"><span ' + str + '><i></i> ' + showName/*datas[that.initMsg.showName]  datas.name*/ + '</span></li>');
            var innerUl = $('<ul></ul>')
            if (datas.children) {
                for (var i = 0; i < datas.children.length; i++) {
                    AjaxFormatChildren(datas.children[i], innerUl);
                }
            }
            li.append(innerUl);
            oul.append(li);
            $(that.initMsg.selectNode).append(oul);
        };

        function AjaxFormatChildren(data, innerUl) {

            var str = '';
            var showName = '';
            for (var key in data) {
                var val = data[key];
                if (data[key] == '') {
                    str += '  ' + key + '  ';
                } else {
                    str += key + '=' + val + '  ';
                }
                if (key == that.initMsg.showName) {
                    showName = data[key]
                }
            }

            var liStr = data.hasChild ?
                '<li class="parent_li"><span ' + str + '><i></i> ' + showName + '</span></li>'
                :
                '<li><span ' + str + '><i></i> ' + showName + '</span></li>';

            var lis = $(liStr);

            if (data.children) {
                var uls = $("<ul></ul>");
                for (var i = 0; i < data.children.length; i++) {
                    AjaxFormatChildren(data.children[i], uls);
                }
            }

            lis.append(uls);
            innerUl.append(lis);

        };

    },


}

myTree.prototype.init = function () {
    var that = this;
    $('#treeMsg').remove();
    $('body').append(that.treeMsg);
    if (that.initMsg.height) {
        $(that.initMsg.selectNode).height(that.initMsg.height);
    }

    if (that.initMsg.width) {
        $(that.initMsg.selectNode).width(that.initMsg.width);
    }

    //格式化数据，生成dom元素   默认ajax方式请求
    if (that.initMsg.checkbox) {

        //是checkbox模式
        this.methods.checkFormatData(that.initMsg.data, that);

    } else {
        //不是checkbox模式
        this.methods.ajaxFormat(that.initMsg.data, that);
    }
    ;

    //基本初始化方法
    that.baseInit(that);

};
