define(function(require, exports, module) {
    require('ztree_core');
    require('../css/ztree.css');
    
    
    /** 
     * HACK {qigb}
     * 解决新ui 样式 与插件不兼容问题
     */
    function switchHack(treeNode) {
        var $switch = $('#' + treeNode.tId + '_switch');
        if (treeNode.isParent && (!treeNode.children || treeNode.children.length <= 0)) {
            var curClass = $switch.attr('class');
            $switch.attr('class', 'hack-switch ' + curClass);
        }
    }
    
    // 配置项数据
    var setting = {
        
        /**
         * 数据配置项
         */
        data: {
            key: {
                name: 'nodeName'
            },
            simpleData: {
                enable: true,
                idKey: 'nodeID',
                pIdKey: 'parentID',
                rootPId: 0
            },
            keep: {
                parent: false
            }
        }, 

        edit: {
           enable: true,
           showRenameBtn: false,
           showRemoveBtn: false,
           editNameSelectAll: true
        },
        

        /*
         * 显示配置
         */
        view: {
            showIcon: false,
            autoCancelSelected: false,
            selectedMulti: false,
            dblClickExpand: false,
            /** 
             * HACK {qigb}
             * 解决新ui 样式 与插件不兼容问题
             */
            addDiyDom: function(treeId, treeNode) {
                switchHack(treeNode);
            },
            
            addHoverDom: function(treeId, treeNode) {
                var that = setting,
                    treeObj = $.fn.zTree.getZTreeObj(treeId),
                    $a = $("#" + treeNode.tId + "_a"),
                    btnSetId = 'diyBtn_set_' + treeNode.nodeID,
                    editStr = '';

                    
                if ($('#' + btnSetId).length > 0) { return; }
                
                editStr = '<span id="' + btnSetId + '" class="diy_set_box">' +
                          '<span class="diy_set_btn"></span><span class="diy_set_list">' + 
                          '<em class="diy_edit_btn">重命名</em><b></b>' + 
                          (!treeNode.isBottom ? '<em class="diy_add_btn" data-type="manage">新建管理节点</em><em class="diy_add_btn" data-type="report">新建上报节点</em><b></b>' : '') + 
                          '<em class="diy_move_btn">移动</em><em class="diy_del_btn">删除</em></span></span>';
                
                $a.append(editStr);
                
                // bindEvents
                $('#' + btnSetId).on('mouseleave', function() {
                    $(this).find('.diy_set_list').hide();
                })
                
                .on('click', '.diy_set_btn', function(e) {
                    e.stopPropagation();
                    $(this).parent().find('.diy_set_list').toggle();
                })
                
                .on('click', '.diy_move_btn', function() {   // 移动节点
                    that.onMoveNode(treeNode);
                })
                
                .on('click', '.diy_del_btn', function(e) {    // 删除节点
                    e.stopPropagation();
                    that.onDelNode(treeNode);
                })
                
                .on('click', '.diy_edit_btn', function() {    // 重命名节点
                    
                    treeObj.editName(treeNode);
                })

                .on('click', '.diy_add_btn', function(e) {    // 新增节点
                    //$('#' + treeNode.tId + '_switch').removeClass('hack-switch');
                    that.onAddNode(treeNode, $(e.target).data('type'));
                })                

                .on('hover', 'em', function() {
                    $(this).toggleClass('diy_btns_hover');
                });
            },
            
            removeHoverDom: function(treeId, treeNode) {
                $('#diyBtn_set_' + treeNode.nodeID).unbind().remove(); 
            }
        },
        
        callback: {
            beforeDrag: function() {
                return false;
            },
            onClick: function(e, treeId, treeNode) {
                var that = setting,
                    treeObj = $.fn.zTree.getZTreeObj(treeId);

                that.onSelected(treeNode);
                treeObj.expandNode(treeNode, true);
            },            
            beforeRename: function(treeId, treeNode, newName) {
                var that = setting,
                    treeObj = $.fn.zTree.getZTreeObj(treeId);
                    
                return that.onRenameNode(treeNode, newName);
            }
        }
    };
    
    
    /**
     * 对外接口
     */
    module.exports = {
        init: function(selector, treeNodes, config) {
            $(selector).append('<ul id="reportTree" class="report-ztree"></ul>');
            
            var treeObj = $.fn.zTree.init($('#reportTree'), $.extend(setting, {
                'onMoveNode': function(treeNode) {
                    console.log('移动节点')
                },
                'onDelNode': function(treeNode) {
                    console.log('删除节点')
                },
                'onRenameNode': function(treeNode) {
                    console.log('重命名节点')
                },
                'onAddNode': function(treeNode, type) {
                    console.log('新增节点')
                },
                'onSelected': function(treeNode) {
                    console.log('选中节点')
                }
            }, config), treeNodes);

            // 选中节点
            var nodes = treeObj.getNodes();
            if (nodes.length > 0 ) {
                treeObj.selectNode(nodes[0]);
                treeObj.expandNode(nodes[0], true);
                setting.onSelected(nodes[0]);
            }
            
            return treeObj;
        }
    };
});