/**
 * webdisk 入口
 * 遵循seajs module规范
 * @author liuxf
 */

define(function(require, exports, module) {
    var root = window;
    var FS = root.FS;
    var tpl = FS.tpl;
    var store = tpl.store;
    var tplEvent = tpl.event;
    var webdiskTpl = require('./webdisk.html');
    var webdiskCss = require('./webdisk.css');
    var util = require('util');
    var publish = require('modules/publish/publish');
    var Tabs = require('uilibs/tabs');
    var dataTables = require('datatable');
    var Dialog = require('dialog');
    var moment = require('moment');
    var H5Uploader = require('h5uploader'),
            FlashUploader = require('flashuploader');
    var json = require('json');
    var filePreview = require('modules/fs-attach/fs-attach-file-preview');

    /* 组件声明 */
    var AtInput = publish.atInput; //at输入框
    var SelectBar = publish.selectBar; // 选人组件
    var MediaMaker = publish.mediaMaker; //多媒体按钮组件
    var ProgressBar = publish.progressBar; //进度条组件
    var Receipt = publish.Receipt; //回执组件
    var FileReader = filePreview.FileReader; //文件预览组件

    var FLASH_ID_INDEX = 0;
    /**
     * 判断输入内容不能为空
     * @param {object} el
     * @returns {boolean}
     */
    var isEmpty = function(target) {
        var targetText = target.val(),
                passed = true;
        //标题不能为空
        if (targetText == "") {
            util.showInputError(target);
            passed = false;
        }
        return passed;
    };

    /* 公共声明 */
    var tplEl = $(webdiskTpl);
    var contactData = util.getContactData();
    //扩展datatable插件文件分组排序
    $.fn.dataTableExt.oSort['file-group-sort-string-asc'] = function(a, b) {
        var aEl = $(a),
                bEl = $(b);
        var aEntityType = $('.flag-entity-type', aEl).text(),
                bEntityType = $('.flag-entity-type', bEl).text(),
                aValue = $('.field-value', aEl).text(),
                bValue = $('.field-value', bEl).text();
        if (aEntityType > bEntityType) {
            return -1;
        } else if (aEntityType < bEntityType) {
            return 1;
        } else {
            return ((aValue < bValue) ? -1 : ((aValue > bValue) ? 1 : 0));
        }
    };
    $.fn.dataTableExt.oSort['file-group-sort-string-desc'] = function(a, b) {
        var aEl = $(a),
                bEl = $(b);
        var aEntityType = $('.flag-entity-type', aEl).text(),
                bEntityType = $('.flag-entity-type', bEl).text(),
                aValue = $('.field-value', aEl).text(),
                bValue = $('.field-value', bEl).text();
        if (aEntityType > bEntityType) {
            return -1;
        } else if (aEntityType < bEntityType) {
            return 1;
        } else {
            return ((aValue < bValue) ? 1 : ((aValue > bValue) ? -1 : 0));
        }
    };
    $.fn.dataTableExt.oSort['file-group-sort-number-asc'] = function(a, b) {
        var aEl = $(a),
                bEl = $(b);
        var aEntityType = $('.flag-entity-type', aEl).text(),
                bEntityType = $('.flag-entity-type', bEl).text(),
                aValue = parseFloat($('.field-value', aEl).text()),
                bValue = parseFloat($('.field-value', bEl).text());
        if (aEntityType > bEntityType) {
            return -1;
        } else if (aEntityType < bEntityType) {
            return 1;
        } else {
            return ((aValue < bValue) ? -1 : ((aValue > bValue) ? 1 : 0));
        }
    };
    $.fn.dataTableExt.oSort['file-group-sort-number-desc'] = function(a, b) {
        var aEl = $(a),
                bEl = $(b);
        var aEntityType = $('.flag-entity-type', aEl).text(),
                bEntityType = $('.flag-entity-type', bEl).text(),
                aValue = parseFloat($('.field-value', aEl).text()),
                bValue = parseFloat($('.field-value', bEl).text());
        if (aEntityType > bEntityType) {
            return -1;
        } else if (aEntityType < bEntityType) {
            return 1;
        } else {
            return ((aValue < bValue) ? 1 : ((aValue > bValue) ? -1 : 0));
        }
    };
    /**
     * 网盘功能组(Dialog)
     */
    var DiskFnNewDialog = Dialog.extend({//新建或修改目录功能
        "attrs": {
            width: 580,
            content: tplEl.filter('.disk-fn-new-dialog-templet').html(),
            className: 'common-style-richard disk-fn-new-dialog',
            webDisk: null
        },
        "events": {
            'click .f-sub': '_submit',
            'click .is-read-only-radio': '_isreadselect',
            'focusout .fn-new-tit': '_fnNewTitfocusout',
            'focusin .fn-new-tit': '_fnNewTitfocusin',
            'click .f-cancel': '_cancel'
        },
        "render": function() {
            var result = DiskFnNewDialog.superclass.render.apply(this, arguments); //调用阿拉蕾原始渲染接口
            this._rangeSelectBar();
            return result;
        },
        "hide": function() {
            var result = DiskFnNewDialog.superclass.hide.apply(this, arguments);
            this._clear();
            return result;
        },
        "show": function() {
            var result = DiskFnNewDialog.superclass.show.apply(this, arguments);
            var elEl = this.element;
            var webDisk = this.get('webDisk');
            var fnNewTitEl = $('.fn-new-tit', elEl);
            var fnNewTableEl = $('.fn-new-table', elEl);
            var dialogTitEl = $('.ui-dialog-title', elEl);
            var fSubEl = $('.f-sub', elEl);
            var radioEl = $('.is-read-only-radio', elEl);
            var trData = this.trData;
            var rootDirectory = webDisk.rootDirectory; //根目录
            var nDDirectoryID = rootDirectory.nDDirectoryID;
            var sb = this.rangeSelectSb;
            dialogTitEl.text('新建文件夹信息');

            //有trdata证明是点修改带过来的 所以是修改文件夹操作
            if (trData) {
                dialogTitEl.text('修改文件夹信息');
                fSubEl.text('修改文件夹');
                fnNewTitEl.val(trData.name);
                //是否为只读目录
                if (trData.isReadOnly) {
                    radioEl.prop("checked", false).eq(1).prop("checked", true); //选中只读目录
                } else {
                    radioEl.prop("checked", false).eq(0).prop("checked", true); //选中开放目录
                }

                // 请求可见范围
                util.api({
                    "url": '/NetDisk/GetNDDirectoryPermissions', //修改文件夹的接口地址
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        "directoryID": trData.nDDirectoryID
                    },
                    "success": function(responseData) {
                        var permissions = responseData.value.permissions || []; //可见范围的数据
                        var type;
                        var defaultWorker = {};
                        if (responseData.success) {
                            //成功之后
                            _.each(permissions, function(permission) {
                                if (permission.isCircle) {
                                    type = 'g';
                                } else {
                                    type = 'p';
                                }
                                _.extend(defaultWorker, {
                                    id: permission.dataID,
                                    name: permission.name,
                                    type: type
                                });
                                sb.addItem(defaultWorker); //选人组件设置默认值
                            });
                        }
                    }
                });

            }
            //如果不是主目录隐藏对应的元素
            if (nDDirectoryID != 0) {
                $('tr', fnNewTableEl).eq(1).hide();
                $('tr', fnNewTableEl).eq(2).hide();
            } else {
                $('tr', fnNewTableEl).eq(1).show();
                $('tr', fnNewTableEl).eq(2).show();
            }

            return result;
        },
        "_isreadselect": function(e) { //选择只读目录时
            var meEl = $(e.currentTarget);
            var elEl = this.element;
            var infoEl = $('.read-dir-info', elEl);
            var dirType = meEl.val();
            if (dirType == 'read_only') {
                infoEl.text('说明：除创建人外的同事只能预览和下载文件');
            } else {
                infoEl.text('说明：可见范围内的同事都可以上传和删除文件');
            }
        },
        "_fnNewTitfocusout": function(e) { //输出框离开焦点
            var elEl = this.element;
            var fnNewTitEl = $('.fn-new-tit', elEl);
            var fnNewTitPsEl = $('.fn-new-tit-ps', elEl);
            if (fnNewTitEl.val() == '') {
                fnNewTitEl.addClass('warn');
                fnNewTitPsEl.text('请输入文件夹名称').addClass('warn');
            }
        },
        "_fnNewTitfocusin": function(e) { //输出框获得焦点
            var elEl = this.element;
            var fnNewTitEl = $('.fn-new-tit', elEl);
            var fnNewTitPsEl = $('.fn-new-tit-ps', elEl);
            fnNewTitEl.removeClass('warn');
            fnNewTitPsEl.text('文件夹名称，例如：销售部文档').removeClass('warn');
        },
        "_rangeSelectBar": function() { //添加选人组件
            var elEl = this.element;
            var rangeselectbarEl = $('.selectbar', elEl);
            var sb = new SelectBar({
                "element": rangeselectbarEl, //容器
                "data": [
                    {
                        "title": "部门", //选项卡标题文字
                        "type": "g", //p是人 g是部门
                        "list": contactData["g"] //数据来源通过contactData获取
                    },
                    {
                        "title": "同事", //选项卡标题文字
                        "type": "p", //p是人 g是部门
                        "list": contactData["p"] //数据来源通过contactData获取
                    }
                ],
                "singleCked": false, //单选吗？
                "acInitData": util.getPublishRange('share'),
                "title": "选择文件夹同事可见范围", //默认文字内容
                "autoCompleteTitle": "请输入部门或同事姓名或拼音"
            });
            this.rangeSelectSb = sb; //保存起来，为了避免多次渲染
        },
        _sendNewDirectory: function() {
            var sb = this.rangeSelectSb;
            var that = this;
            var trData = this.trData;
            var elEl = this.element;
            var fnNewTitEl = $('.fn-new-tit', elEl);
            var dirType = $('.is-read-only-radio:checked', elEl).val();
            var directoryUrl = '/NetDisk/CreateNDDirectory'; //创建目录的接口地址
            var sbData = sb.getSelectedData();
            var memberDataP = sbData.p || []; //p是人的数据g是部门的数据
            var memberDataG = sbData.g || []; //p是人的数据g是部门的数据
            var isReadOnly = false;
            var directoryID = 0;
            if (dirType == 'read_only') {
                isReadOnly = true;
            }
            if (trData) {
                directoryID = trData.nDDirectoryID;
                directoryUrl = '/NetDisk/ModifyNDDirectory'; //修改目录的接口地址
            }
            var webDisk = this.get('webDisk');
            var thisDirectory = webDisk.thisDirectory,
                    rootDirectory = webDisk.rootDirectory;
            var aoData = {//请求参数
                "directoryName": fnNewTitEl.val(), //目录名称 string
                "isReadOnly": isReadOnly, //是否只读目录 bool
                "rootDirectoryID": rootDirectory.nDDirectoryID, //根目录ID,//第一级添0 int
                "directoryID": directoryID, //目录ID,修改目录时使用
                "parentID": thisDirectory.nDDirectoryID, //父目录ID, 第一级添0 int
                "circleIDs": memberDataG, //范围：部门id集合 string
                "employeeIDs": memberDataP //范围：员工id集合 string
            };
            util.api({
                "url": directoryUrl, //接口地址
                "type": 'post',
                "dataType": 'json',
                "data": aoData,
                "success": function(responseData) {
                    if (responseData.success) {
                        //成功之后
                        webDisk.reload(); //刷新列表
                    }
                }
            });

        },
        "_clear": function() {
            var elEl = this.element;
            var fnNewTitEl = $('.fn-new-tit', elEl);
            var fnNewTitPsEl = $('.fn-new-tit-ps', elEl);
            this.rangeSelectSb.removeAllItem(); //清空选人组件数据
            $('.f-sub', elEl).text('创建文件夹'); //还原按钮内容
            this.trData = null; //清空trData
            $('.is-read-only-radio', elEl).prop("checked", false).eq(0).prop("checked", true); //开放目录默认选择
            fnNewTitEl.val('').removeClass('warn');
            fnNewTitPsEl.text('文件夹名称，例如：销售部文档').removeClass('warn');
        },
        "_submit": function(evt) {
            var elEl = this.element;
            var webDisk = this.get('webDisk');
            var rootDirectory = webDisk.rootDirectory;
            var nDDirectoryID = rootDirectory.nDDirectoryID; // 当前目录ID
            var fnNewTitEl = $('.fn-new-tit', elEl);
            var fnNewTitPsEl = $('.fn-new-tit-ps', elEl);
            var inputFieldEl = $('.input-field', elEl);
            var rangeselectbarEl = $('.selectbar .input-tip', elEl); //选人组件容器
            var sbData = this.rangeSelectSb.getSelectedData(),
                    memberDataP = sbData.p || [], //p是人的数据g是部门的数据
                    memberDataG = sbData.g || []; //g是人的数据g是部门的数据
            if (fnNewTitEl.val() == '') {
                fnNewTitEl.addClass('warn');
                fnNewTitPsEl.text('请输入文件夹名称').addClass('warn');
            } else {
                if ((nDDirectoryID == 0) && (memberDataP.length == 0 && memberDataG.length == 0)) { //如果可见范围为空，弹出选择框
                    rangeselectbarEl.trigger('click'); //触发选择框的点击事件
                    evt.stopPropagation();
                } else {
                    this._sendNewDirectory();
                    this.hide();
                }
            }
        },
        "_cancel": function(evt) {
            this.hide();
        }
    });

    var DiskFnUploadDialog = Dialog.extend({//上传功能
        "attrs": {
            width: 580,
            content: tplEl.filter('.disk-fn-upload-dialog-templet').html(),
            className: 'common-style-richard disk-fn-upload-dialog',
            "webDisk": null
        },
        "events": {
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel',
            'click .upload-file-list .remove-l': '_removeUploadItem',
            'click .is-receipt': '_clickIsReceipt',
            'click .upload-item': '_clickUploadItem'
        },
        "_clickUploadItem": function(e) { //上传后的文件点击行背景变色
            var elEl = this.element;
            var meEl = $(e.currentTarget);
            var tablesEl = $('.upload-file-list', elEl);
            var uploadItemEl = $('.upload-item', elEl);
            var fisttdEl = meEl.find('td:first');
            var lasttdEl = meEl.find('td:last');
            $('tr.row_selected', tablesEl).removeClass('row_selected');
            $('td.border-blue-l', tablesEl).removeClass('border-blue-l');
            $('td.border-blue-r', tablesEl).removeClass('border-blue-r');
            meEl.addClass('row_selected');
            fisttdEl.addClass('border-blue-l');
            lasttdEl.addClass('border-blue-r');


        },
        "setup": function() {
            var result = DiskFnUploadDialog.superclass.setup.apply(this, arguments);
            this.fileInfos = []; //存储成功上传文件信息
            return result;
        },
        "render": function() {
            var result = DiskFnUploadDialog.superclass.render.apply(this, arguments); //调用阿拉蕾原始渲染接口
            this._rangeSelectBar();
            this._renderUploader();
            this._renderPbar();
            this._renderReceipt();
            return result;

        },
        "hide": function() {
            var result = DiskFnUploadDialog.superclass.hide.apply(this, arguments);
            this._clear();
            return result;
        },
        /**
         * 渲染回执弹框
         */
        "_renderReceipt": function() {
            var that = this;
            var elEl = this.element,
                    isReceiptEl = $('.is-receipt', elEl);
            var receipt = new Receipt({
                "inputSelector": null,
                "rangeSb": this.rangeSelectSb,
                "submitCb": function(sbData) {
                    that._setReceiptRange(sbData);
                    this.hide();
                },
                "cancelCb": function() {
                    isReceiptEl.prop('checked', false);
                    //清空回执信息
                    that._clearReceipt();
                }
            });
            this.receipt = receipt;
        },
        /**
         * 设置回执范围信息
         */
        "_setReceiptRange": function(rangeData) {
            var elEl = this.element,
                    isSendSmsEl = $('.is-send-sms', elEl),
                    receiptTipEl = $('.receipt-tip', elEl),
                    smsRangeGroupEl = $('.send-sms-g', elEl), //发送部门范围
                    smsRangePersonEl = $('.send-sms-p', elEl);
            var gData, //部门数据
                    pData; //个人数据
            if (_.isEmpty(rangeData)) {
                receiptTipEl.text("").hide();
            } else {
                gData = rangeData['g'] || [];
                pData = rangeData['p'] || [];
                //设置隐藏传递值
                smsRangeGroupEl.val(gData.join(','));
                smsRangePersonEl.val(pData.join(','));
                isSendSmsEl.val($('.is-sms-send', this.receipt.element).prop('checked') ? "1" : "0");
                receiptTipEl.text('已选择' + gData.length + '个部门，' + pData.length + '个人').show();
            }
        },
        /**
         * 清理回执信息
         */
        "_clearReceipt": function() {
            var elEl = this.element,
                    isReceiptEl = $('.is-receipt', elEl),
                    isSendSmsEl = $('.is-send-sms', elEl),
                    receiptTipEl = $('.receipt-tip', elEl),
                    smsRangeGroupEl = $('.send-sms-g', elEl), //发送部门范围
                    smsRangePersonEl = $('.send-sms-p', elEl);
            smsRangeGroupEl.val('');
            smsRangePersonEl.val('');
            isSendSmsEl.val("0");
            receiptTipEl.empty().hide();
            isReceiptEl.prop('checked', false);
        },
        /**
         * 渲染进度条
         */
        "_renderPbar": function() {
            var elEl = this.element,
                    progressEl = $('.progress-wrapper', elEl),
                    pbarEl = $('.progress-bar', progressEl);
            var pbar = new ProgressBar({
                "element": pbarEl
            });
            this.pbar = pbar;
        },
        /**
         * 上传文件筛选
         * @param actionName
         * @param fileData
         * @param uploadType
         * @returns {Array}
         */
        "uploadFilter": function(fileData, queueList) {
            fileData = [].concat(fileData);
            var passedFiles = [], //保存筛选后的文件
                message;
            var uploadFileSizeLimit=contactData["u"].uploadFileSizeLimit;  //uploadFilesSizeLimit单位是M
            _.each(fileData, function(file) {
                if (file.size < uploadFileSizeLimit*1024*1024 && file.size > 0) { //最大20m
                    if (queueList.length > 0) {
                        if (!_.find(queueList, function(existFile) {
                            return existFile.name == file.name;
                        })) {
                            passedFiles.push(file);
                        }
                    } else {
                        passedFiles.push(file);
                    }

                } //最大20m
            });
            if (passedFiles.length < fileData.length) {
                message = "所选择的文件单个大小必须大于0B且小于"+uploadFileSizeLimit+"MB，文件名必须含有后缀且不能重复选择。有" + (fileData.length - passedFiles.length) + "个文件没有添加。";
                util.alert(message);
            }
            return passedFiles;
        },
        /**
         * 渲染上传组件
         */
        "_renderUploader": function() {
            var that = this;
            var elEl = this.element,
                    subBtnEl = $('.f-sub', elEl),
                    selectBtnEl = $('.select-file-btn', elEl),
                    fileInputEl = $('.upload-input', elEl),
                    tableEl = $('.upload-file-list', elEl),
                    emptyEl = $('.empty-tip', elEl);
            var flashId;
            var uploadFileSizeLimit=contactData["u"].uploadFileSizeLimit;  //uploadFilesSizeLimit单位是M
            var h5ImgUploader = new H5Uploader({
                multiple: true,
                accept: "*/*",
                fileInput: fileInputEl.get(0),
                dragDrop: emptyEl.get(0), //可拖拽区dom
                url: '/File/UploadFile',
                filter: function(files) {
                    //return files;
                    return that.uploadFilter(files, h5ImgUploader.getFiles());
                },
                onSelect: function(files) {
                    var htmlStr = '';
                    if (files.length <= 0) {
                        return;
                    }
                    _.each(files, function(file) {
                        htmlStr += '<tr class="upload-item" fileid="' + file.id + '"><td class="file-name"><div  class="file-name-warp"><img src="' + FS.BLANK_IMG + '" class="fs-attach-' + util.getFileType(file) + '-small-icon upload-item-icon" />&nbsp;<span class="file-names">' + file.name + '</span></div></td><td class="file-ext">.' + util.getFileExtText(file.name) + '</td><td class="file-size">' + util.getFileSize(file.size) + '</td><td class="file-opera"><a href="#" class="remove-l">删除</a></td></tr>';
                    });
                    $('tbody', tableEl).append(htmlStr);
                    emptyEl.hide();
                    subBtnEl.removeClass('button-state-disabled');
                },
                onDelete: function(file) {
                },
                onProgress: function(file, uploadedSize, totalSize) {
                },
                onTotalProgress: function(loaded, total) {
                    that.updateUploadProgress(loaded, total);
                },
                onSuccess: function(file, responseText) {
                    var responseData = json.parse(responseText);
                    if (responseData.success) {
                        that.fileInfos.push({
                            "value": 3, //FeedAttachType,作为附件上传
                            "value1": responseData.value.filePath,
                            "value2": file.size, //文件总长度（字节）
                            "value3": file.name //文件原名
                        });
                    }
                },
                onFailure: function(file) {

                },
                onComplete: function() {
                    //上传完成后调用发送到网盘接口
                    that._sendUploadFiles();
                }
            });
            if (!h5ImgUploader.isSupport()) { //flash fallback
                flashId = 'web-disk-upload-' + FLASH_ID_INDEX;
                FLASH_ID_INDEX++;
                //selectBtnEl.html('<span id="'+flashId+'"></span>');
                selectBtnEl.attr('id', flashId);
                h5ImgUploader = new FlashUploader({
                    upload_url: FS.API_PATH + '/File/UploadFileByForm',
                    file_types: "*.*",
                    file_types_description: "所有文件",
                    button_placeholder_id: flashId,
                    button_text: '',
                    button_image_url: FS.MODULE_PATH + '/webdisk/icon-flash-upload.png',
                    button_width: 74,
                    button_height: 25,
                    file_queued_handler: function(file) {
                        var htmlStr;
                        if (file.size < uploadFileSizeLimit*1024*1024 && file.size > 0) {
                            htmlStr = '<tr class="upload-item" fileid="' + file.id + '"><td class="file-name"  width="235"><img src="' + FS.BLANK_IMG + '" class="fs-attach-' + util.getFileType(file) + '-small-icon upload-item-icon" />&nbsp;<span class="file-names">' + file.name + '</span></td><td class="file-ext"><span>' + util.getFileExtText(file.name) + '</span></td><td class="file-size"><span>' + util.getFileSize(file.size) + '</span></td><td class="file-opera"><a href="#" class="remove-l">删除</a></td></tr>';
                            $('tbody', tableEl).append(htmlStr);
                            emptyEl.hide();
                            subBtnEl.removeClass('button-state-disabled');
                        }else{
                            this.cancelUpload(file.id,false);   //不触发uploadError事件
                            util.alert("所选择的文件单个大小必须大于0B且小于"+uploadFileSizeLimit+"MB");
                        }
                    },
                    file_dialog_complete_handler: function(numFilesSelected, numFilesQueued) {
                    },
                    upload_total_progress_handler: function(totalUploadedSize, totalSize) {
                        that.updateUploadProgress(totalUploadedSize, totalSize);
                    },
                    upload_error_handler: function(file) {
                        util.alert(file.name + '上传失败，请重试！');
                    },
                    upload_success_handler: function(file, responseText) {
                        var responseData = json.parse(responseText);
                        if (responseData.success) {
                            that.fileInfos.push({
                                "value": 3, //FeedAttachType,作为附件上传
                                "value1": responseData.value.filePath,
                                "value2": file.size, //文件总长度（字节）
                                "value3": file.name //文件原名
                            });
                        }
                    },
                    upload_all_complete_handler: function() {
                        //上传完成后调用发送到网盘接口
                        that._sendUploadFiles();
                    }
                });
                //更改空白提示
                $('.filedragwarp', emptyEl).html('请选择文件上传');
            } else {
                elEl.on('click', '.select-file-btn', function() {
                    fileInputEl.click();
                });
            }
            this.uploader = h5ImgUploader;
        },
        /**
         * 更新进度条提示
         * @param loaded
         * @param total
         */
        "updateUploadProgress": function(loaded, total) {
            var elEl = this.element,
                    progressEl = $('.progress-wrapper', elEl);
            var pbar = this.pbar;
            var percent = Math.ceil((loaded / total) * 100) + '%';
            pbar.setProgress(percent);
            if (parseInt(percent) > 0 && parseInt(percent) < 100) {
                progressEl.show();
            } else {
                progressEl.hide();
            }
        },
        "_rangeSelectBar": function() { //修改审批人加选人组件
            var elEl = this.element;
            var rangeselectbarEl = $('.selectbar', elEl);
            var sb = new SelectBar({
                "element": rangeselectbarEl, //容器
                "data": [
                    {
                        "title": "部门", //选项卡标题文字
                        "type": "g", //p是人 g是部门
                        "list": contactData["g"], //数据来源通过contactData获取
                        "unitSuffix": "个部门"
                    },
                    {
                        "title": "同事", //选项卡标题文字
                        "type": "p", //p是人 g是部门
                        "list": contactData["p"] //数据来源通过contactData获取
                    }
                ],
                "singleCked": false, //单选吗？
                "title": "选择提醒范围...", //默认文字内容
                "autoCompleteTitle": "请输入部门或同事姓名或拼音"
            });
            this.rangeSelectSb = sb; //保存起来，为了避免多次渲染
        },
        /**
         * 删除对应的upload item
         */
        "_removeUploadItem": function(evt) {
            var elEl = this.element,
                    subBtnEl = $('.f-sub', elEl);
            var meEl = $(evt.target),
                    trEl = meEl.closest('.upload-item');
            var fileId = trEl.attr('fileid');
            var uploader = this.uploader;
            //删除对应的上传信息
            uploader.removeFile(fileId, false);
            //删除对应的dom节点
            trEl.remove();
            if ($('.upload-item', elEl).length == 0) {
                $('.empty-tip', elEl).show();
                subBtnEl.addClass('button-state-disabled');
            }
            evt.preventDefault();
        },
        /**
         * 打开或关闭回执对话框
         */
        "_clickIsReceipt": function(evt) {
            var receipt = this.receipt;
            var meEl = $(evt.target);
            if (meEl.prop('checked')) {
                receipt.show();
            } else {
                this._clearReceipt();
            }
        },
        _sendUploadFiles: function() { //上传文件的接口
            var sb = this.rangeSelectSb,
                    webDisk = this.get('webDisk');
            var that = this;
            var elEl = this.element,
                    smsRangeGroupEl = $('.send-sms-g', elEl), //发送部门范围
                    smsRangePersonEl = $('.send-sms-p', elEl);

            var sbData = sb.getSelectedData(),
                    thisDirectory = webDisk.thisDirectory,
                    rootDirectory = webDisk.rootDirectory;
            var smsRangeGData = smsRangeGroupEl.val(),
                    smsRangePData = smsRangePersonEl.val();
            var aoData = {//请求参数
                "rootDirectoryID": rootDirectory.nDDirectoryID, //int，根目录ID
                "parentID": thisDirectory.nDDirectoryID, //int，父目录ID
                "circleIDs": sbData['g'] || [], //string，范围：部门id集合
                "employeeIDs": sbData['p'] || [], //string，范围：员工id集合
                "fileInfos": this.fileInfos, //List<ParamValue<int, string, int, string>>，附件集合
                "smsCircleIDs": smsRangeGData ? smsRangeGData.split(',') : [], //string，回执及短信发送部门范围
                "smsEmployeeIDs": smsRangePData ? smsRangePData.split(',') : [] //string，回执及短信发送员工范围
            };
            util.api({
                "url": '/NetDisk/UploadFiles', //上传文件接口地址
                "type": 'post',
                "dataType": 'json',
                "data": aoData,
                "success": function(responseData) {
                    if (responseData.success) {
                        that.hide();
                        //成功之后
                        webDisk._reload(); //刷新列表
                    }
                }
            });
        },
        "_clear": function() {
            var elEl = this.element;
            //清空上传信息
            this.fileInfos = [];
            this.uploader && this.uploader.removeAllFile();
            $('.upload-item', elEl).remove();
            $('.empty-tip', elEl).show();
            this.pbar && this.updateUploadProgress(0, 0);
            //清理回执信息
            this._clearReceipt();
            //清空选人组件数据
            this.rangeSelectSb && this.rangeSelectSb.removeAllItem();
        },
        "_submit": function() {
            //this._sendUploadFiles();
            this.uploader.startUpload();
        },
        "_cancel": function() {
            this.hide();
        },
        "destroy": function() {
            var result;
            this._clear();
            this.uploader && this.uploader.destroy();
            this.pbar && this.pbar.destroy();
            result = DiskFnUploadDialog.superclass.destroy.apply(this, arguments);
            return result;
        }
    });
    var DiskFnDelDialog = Dialog.extend({//删除功能
        "attrs": {
            width: 380,
            content: tplEl.filter('.disk-fn-del-dialog-templet').html(),
            className: 'common-style-richard disk-fn-del-dialog',
            webDisk: null
        },
        "events": {
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel'
        },
        "render": function() {
            var result = DiskFnDelDialog.superclass.render.apply(this, arguments); //调用阿拉蕾原始渲染接口
            return result;
        },
        "hide": function() {
            var result = DiskFnDelDialog.superclass.hide.apply(this, arguments);
            this._clear();
            return result;
        },
        "_sendDel": function() {
            var that = this;
            var webDisk = this.get('webDisk'),
                    oTable = webDisk.oTable;
            var requestData = {};
            var delUrl; //删除文件的接口
            //获取单条选中记录
            var selectedData = oTable.fnGetData(webDisk.getSelectRow().get(0));
            if (selectedData.isDir) {
                delUrl = '/NetDisk/DeleteNDDirectory'; //删除目录的接口
                requestData.directoryID = selectedData.nDDirectoryID;
            } else {
                delUrl = '/NetDisk/DeleteNDFile'; //删除文件的接口
                requestData.fileID = selectedData.nDFileID;
            }
            util.api({
                "url": delUrl, //谁的接口地址
                "type": 'post',
                "dataType": 'json',
                "data": requestData,
                "success": function(responseData) {
                    if (responseData.success) {
                        webDisk.reload();
                    }
                }
            });
        },
        "_clear": function() {

        },
        "_submit": function(evt) {
            this._sendDel();
            this.hide();
        },
        "_cancel": function(evt) {
            this.hide();
        }
    });

    var DiskFnSendcoDialog = Dialog.extend({//发同事功能
        "attrs": {
            width: 600,
            content: tplEl.filter('.disk-fn-sendco-dialog-templet').html(),
            className: 'common-style-richard disk-fn-sendco-dialog'
        },
        "events": {
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel',
            'click .is-receipt': '_clickIsReceipt'
        },
        "render": function() {
            var result = DiskFnSendcoDialog.superclass.render.apply(this, arguments); //调用阿拉蕾原始渲染接口
            this._initAtInput();
            this._renderMedia();
            this._rangeSelectBar();
            this._renderReceipt();
            this.showToppicTip();
            return result;

        },
        showToppicTip: function() {
            var elEl = this.element;
            var inputEl = $('.sendco-input', elEl);
            var topicTipEl = $('.publish-topic-tip', elEl);
            inputEl.keyup(function() {
                var meEl = $(this);
                var v = _.str.trim(meEl.val()),
                        name = meEl.attr('name');
                if (/#[^\n]+?#/g.test(v)) {
                    topicTipEl.slideDown(200, function() {
                        $(root).trigger('resize');  //触发resize事件，引导图重定位
                    });
                } else {
                    topicTipEl.slideUp(200, function() {
                        $(root).trigger('resize');  //触发resize事件，引导图重定位
                    });
                }

            });

        },
        /**
         * 渲染回执弹框
         */
        "_renderReceipt": function() {
            var that = this;
            var elEl = this.element,
                    isReceiptEl = $('.is-receipt', elEl);
            var receipt = new Receipt({
                "inputSelector": null,
                "rangeSb": this.rangeSelectSb,
                "submitCb": function(sbData) {
                    that._setReceiptRange(sbData);
                    this.hide();
                },
                "cancelCb": function() {
                    isReceiptEl.prop('checked', false);
                    //清空回执信息
                    that._clearReceipt();
                }
            });
            this.receipt = receipt;
        },
        /**
         * 设置回执范围信息
         */
        "_setReceiptRange": function(rangeData) {
            var elEl = this.element,
                    isSendSmsEl = $('.is-send-sms', elEl),
                    receiptTipEl = $('.receipt-tip', elEl),
                    smsRangeGroupEl = $('.send-sms-g', elEl), //发送部门范围
                    smsRangePersonEl = $('.send-sms-p', elEl);
            var gData, //部门数据
                    pData; //个人数据
            if (_.isEmpty(rangeData)) {
                receiptTipEl.text("").hide();
            } else {
                gData = rangeData['g'] || [];
                pData = rangeData['p'] || [];
                //设置隐藏传递值
                smsRangeGroupEl.val(gData.join(','));
                smsRangePersonEl.val(pData.join(','));
                isSendSmsEl.val($('.is-sms-send', this.receipt.element).prop('checked') ? "1" : "0");
                receiptTipEl.text('已选择' + gData.length + '个部门，' + pData.length + '个人').show();
            }
        },
        /**
         * 清理回执信息
         */
        "_clearReceipt": function() {
            var elEl = this.element,
                    isReceiptEl = $('.is-receipt', elEl),
                    isSendSmsEl = $('.is-send-sms', elEl),
                    receiptTipEl = $('.receipt-tip', elEl),
                    smsRangeGroupEl = $('.send-sms-g', elEl), //发送部门范围
                    smsRangePersonEl = $('.send-sms-p', elEl);
            smsRangeGroupEl.val('');
            smsRangePersonEl.val('');
            isSendSmsEl.val("0");
            receiptTipEl.empty().hide();
            isReceiptEl.prop('checked', false);
        },
        "_initAtInput": function() { //初始化at input
            var elEl = this.element;
            var inputEl = $('.sendco-input', elEl);
            new AtInput({
                "element": inputEl
            });
        },
        "_renderMedia": function() { //设置多媒体功能
            var elEl = this.element;
            var mediaEl = $('.sendco-input-media', elEl),
                    inputEl = $('.sendco-input', elEl);
            var media = new MediaMaker({
                "element": mediaEl,
                "action": ['at', 'topic'],
                "actionOpts": {
                    "at": {
                        "inputSelector": inputEl
                    },
                    "topic": {
                        "inputSelector": inputEl
                    }
                }
            });
        },
        "_rangeSelectBar": function() { //修改审批人加选人组件
            var elEl = this.element;
            var rangeselectbarEl = $('.selectbar', elEl);
            var sb = new SelectBar({
                "element": rangeselectbarEl, //容器
                "data": [
                    {
                        "title": "部门", //选项卡标题文字
                        "type": "g", //p是人 g是部门
                        "list": contactData["g"] //数据来源通过contactData获取
                    },
                    {
                        "title": "同事", //选项卡标题文字
                        "type": "p", //p是人 g是部门
                        "list": contactData["p"] //数据来源通过contactData获取
                    }
                ],
                "singleCked": false, //单选吗？
                "title": "选择发送范围", //默认文字内容
                "acInitData":util.getPublishRange('share'),
                "autoCompleteTitle": "请输入部门或同事姓名或拼音"
            });
            this.rangeSelectSb = sb; //保存起来，为了避免多次渲染
        },
        "_sendShareNDFile": function() {
            var sb = this.rangeSelectSb;
            var that = this;
            var trData = this.trData;
            var elEl = this.element;
            var sendcoInputEl = $('.sendco-input', elEl);
            var isReadOnlyID = $('.is-read-only-radio:checked', elEl).attr('id');
            var sbData = sb.getSelectedData();
            var memberDataP = sbData.p || []; //p是人的数据
            var memberDataG = sbData.g || []; //g是部门的数据
            // var memberData = memberData.concat(memberDataP, memberDataG);
            var fileID = trData.nDFileID;

            var isSendSmsEl = $('.is-send-sms', elEl),
                    isReceiptEl = $('.is-receipt', elEl),
                    smsRangeGroupEl = $('.send-sms-g', elEl), //发送部门范围
                    smsRangePersonEl = $('.send-sms-p', elEl);
            var smsRangeGData = smsRangeGroupEl.val(),
                    smsRangePData = smsRangePersonEl.val();
            var aoData = {//请求参数
                "fileID": fileID, //int，文件ID
                "feedContent": sendcoInputEl.val(), // string,分享内容
                "circleIDs": memberDataG, // string,发送范围：部门id集合
                "employeeIDs": memberDataP, // string,发送范围：员工id集合
                "isSentReceipt": isReceiptEl.prop('checked'), // bool,是否需要回执
                "isSentSms": (isSendSmsEl.val() == "1" ? true : false), // bool,是否需要发送短信
                "smsCircleIDs": smsRangeGData ? smsRangeGData.split(',') : [], //组织
                "smsEmployeeIDs": smsRangePData ? smsRangePData.split(',') : [] // string回执及短信发送员工范围
            };
            util.api({
                "url": '/NetDisk/SendShareNDFile', //发同事的接口地址
                "type": 'post',
                "dataType": 'json',
                "data": aoData,
                "success": function(responseData) {
                    if (responseData.success) {
                        //成功之后
                        // that.WebDisk._reload(); //刷新列表
                    }
                }
            });

        },
        "show": function() {
            var result = DiskFnNewDialog.superclass.show.apply(this, arguments);
            var elEl = this.element;
            var fileInfoContEl = $('.sendco-file-info-cont', elEl);
            var trData = this.trData;
            var attachName = trData.attachName;
            var attSize = util.getFileSize(trData.attachSize);
            fileInfoContEl.html('<img src="' + FS.ASSETS_PATH + '/images/file/' + util.getFileExtText(attachName) + '.png" alt="" class="info-cont-img">' + attachName + ' (' + attSize + ')');
            return result;
        },
        "hide": function() {
            var result = DiskFnSendcoDialog.superclass.hide.apply(this, arguments);
            this._clear();
            return result;
        },
        "_clickIsReceipt": function(evt) {
            var receipt = this.receipt;
            var meEl = $(evt.target);
            if (meEl.prop('checked')) {
                receipt.show();
            } else {
                this._clearReceipt();
            }
        },
        "_clear": function() {
            var elEl = this.element;
            var inputEl = $('.sendco-input', elEl);
            var topicTipEl = $('.publish-topic-tip', elEl);
            var isImportantCoEl = $('.is-important-co', elEl);
            isImportantCoEl.prop('checked', false); //取消选择状态
            inputEl.val(''); //输入框清空
            topicTipEl.hide();
            this.rangeSelectSb.removeAllItem(); //清空选人组件数据
            this._clearReceipt();
        },
        "_submit": function(evt) {
            var elEl = this.element;
            var sendcoInputTitEl = $('.sendco-input', elEl);
            var rangeselectbarEl = $('.selectbar .input-tip', elEl); //选人组件容器
            var sbData = this.rangeSelectSb.getSelectedData(),
                    memberDataP = sbData.p || [], //p是人的数据g是部门的数据
                    memberDataG = sbData.g || []; //g是人的数据g是部门的数据
            if (isEmpty(sendcoInputTitEl)) { //如果为空暂定操作
                if (memberDataP.length == 0 && memberDataG.length == 0) {
                    rangeselectbarEl.trigger('click'); //触发选择框的点击事件
                    evt.stopPropagation();
                } else {
                    this._sendShareNDFile();
                    this._clear();
                    this.hide();
                }

            }

        },
        "_cancel": function(evt) {
            this._clear();
            this.hide();
        },
        "destroy": function() {
            var result;
            this.receipt && this.receipt.destroy();
            result = DiskFnSendcoDialog.superclass.destroy.apply(this, arguments);
            return result;
        }
    });


    var DiskFnSendclientDialog = Dialog.extend({//发客户功能
        "attrs": {
            width: 560,
            content: tplEl.filter('.disk-fn-sendclient-dialog-templet').html(),
            className: 'common-style-richard disk-fn-sendclient-dialog'
        },
        "events": {
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel'
        },
        "render": function() {
            var result = DiskFnSendclientDialog.superclass.render.apply(this, arguments); //调用阿拉蕾原始渲染接口
            this._initAtInput();
            this._renderMedia();
            //this._rangeSelectBar();      //客户范围和客群相关，已去掉
            this._rangeSelectBarTwo();
            return result;
        },
        "_initAtInput": function() { //初始化at input
            var elEl = this.element;
            var inputEl = $('.sendco-input', elEl);
            new AtInput({
                "element": inputEl
            });
        },
        "_renderMedia": function() { //设置多媒体功能
            var elEl = this.element;
            var inputEl = $('.sendco-input', elEl);
            var mediaEl = $('.sendco-input-media', elEl);
            var media = new MediaMaker({
                "element": mediaEl,
                "action": ["h5attachupload", "at"],
                "actionOpts": {
                    "at": {
                        "inputSelector": inputEl
                    }
                }
            });
        },
        "_rangeSelectBar": function() { //加选人组件
            var elEl = this.element;
            var rangeselectbarEl = $('.selectbar', elEl);
            var sb = new SelectBar({
                "element": rangeselectbarEl, //容器
                "data": [
                    {
                        "title": "部门", //选项卡标题文字
                        "type": "g", //p是人 g是部门
                        "list": contactData["g"] //数据来源通过contactData获取
                    },
                    {
                        "title": "同事", //选项卡标题文字
                        "type": "p", //p是人 g是部门
                        "list": contactData["p"] //数据来源通过contactData获取
                    }
                ],
                "singleCked": false, //单选吗？
                "acInitData": util.getPublishRange('share'),
                "title": "选择客户范围", //默认文字内容
                "autoCompleteTitle": "请输入部门或同事姓名或拼音"
            });
            this.rangeSelectSb = sb; //保存起来，为了避免多次渲染
        },
        "_rangeSelectBarTwo": function() { //加选人组件
            var elEl = this.element;
            var rangeselectbarEl = $('.selectbar-two', elEl);
            var sb = new SelectBar({
                "element": rangeselectbarEl, //容器
                "data": [
                    {
                        "title": "部门", //选项卡标题文字
                        "type": "g", //p是人 g是部门
                        "list": contactData["g"] //数据来源通过contactData获取
                    },
                    {
                        "title": "同事", //选项卡标题文字
                        "type": "p", //p是人 g是部门
                        "list": contactData["p"] //数据来源通过contactData获取
                    }
                ],
                "singleCked": false, //单选吗？
                "acInitData": util.getPublishRange('share'),
                "title": "选择发送范围", //默认文字内容
                "autoCompleteTitle": "请输入部门或同事姓名或拼音"
            });
            this.rangeSelectSb = sb; //保存起来，为了避免多次渲染
        },
        "show": function() {
            var result = DiskFnNewDialog.superclass.show.apply(this, arguments);
            var elEl = this.element;
            var fileInfoContEl = $('.sendco-file-info-cont', elEl);
            var trData = this.trData;
            var attachName = trData.attachName;
            var attSize = util.getFileSize(trData.attachSize);
            fileInfoContEl.html('<img src="' + FS.ASSETS_PATH + '/images/file/' + util.getFileExtText(attachName) + '.png" alt="" class="info-cont-img">' + attachName + ' (' + attSize + ')');
            return result;
        },
        "hide": function() {
            var result = DiskFnSendclientDialog.superclass.hide.apply(this, arguments);
            this._clear();
            return result;
        },
        "_clear": function() {

        },
        "_submit": function(evt) {

            this.hide();
        },
        "_cancel": function(evt) {
            this.hide();
        }
    });
    var DiskFnViewdetailsDialog = Dialog.extend({//查看详情功能
        "attrs": {
            width: 450,
            content: tplEl.filter('.disk-fn-viewdetails-dialog-templet').html(),
            className: 'common-style-richard disk-fn-viewdetails-dialog'
        },
        "events": {
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel'
        },
        "render": function() {
            var result = DiskFnViewdetailsDialog.superclass.render.apply(this, arguments); //调用阿拉蕾原始渲染接口
            this._viewdetailsTabs();
            return result;
        },
        "_formatTableData": function(responseData) { //格式化数据
            var items = responseData.value;
            var downfileTabsEl = $('.viewdetails-tabs', this.element);
            var employeeEl = $('.filedownrecords-employee', downfileTabsEl);
            var tableStr = '';
            var trStr = '';
            var profileImage, name, downloadTime, employeeID, source;
            if (responseData.success) {
                if (items.length > 0) {
                    _.each(items, function(item) {
                        profileImage = util.getDfLink(item.profileImage + '3', "", false, 'jpg');
                        name = item.name;
                        employeeID = item.employeeID;
                        downloadTime = moment.unix(item.downloadTime).format('MMMDD日 hh:mm');
                        source = item.sourceDesc;
                        trStr += '<tr><td><a href="#profile/=/empid-' + employeeID + '"><img src="' + profileImage + '" alt=""></a>&nbsp;&nbsp;<a href="javascript:;">' + name + '</a></td><td>' + downloadTime + '下载</td><td>通过' + source + '</td></tr>';

                    });
                    tableStr = '<table class="filedownrecords-employee-table">' + trStr + '</table>';
                    employeeEl.html(tableStr);
                } else {
                    employeeEl.html('<div class="noinfotip">没有文件的下载记录</div>');
                }

            }
        },
        "_getFileDownRecords": function() {
            var that = this;
            var trData = this.trData;
            var fileID = trData.nDFileID;
            util.api({
                "url": '/NetDisk/GetNDFileDownRecords', //查看下载详情的接口地址
                "type": 'get',
                "dataType": 'json',
                "data": {
                    "fileID": fileID
                },
                "success": function(responseData) {
                    that._formatTableData(responseData);
                }
            });
        },
        "_viewdetailsTabs": function() {
            var downfileTabsEl = $('.viewdetails-tabs', this.element);
            var ViewdetailsTabs = new Tabs({
                "element": downfileTabsEl,
                "triggers": $('.ui-tab-item', downfileTabsEl),
                "panels": $('.ui-tab-panel', downfileTabsEl),
                "activeIndex": 0,
                "activeTriggerClass": "ui-tab-item-current",
                "triggerType": 'click',
                "triggerBgTop": "0"
            }).render();
        },
        "show": function() {
            var result = DiskFnNewDialog.superclass.show.apply(this, arguments);
            this._getFileDownRecords();
            return result;
        },
        "hide": function() {
            var result = DiskFnViewdetailsDialog.superclass.hide.apply(this, arguments);
            this._clear();
            return result;
        },
        "_clear": function() {
            var downfileTabsEl = $('.viewdetails-tabs', this.element);
            var employeeEl = $('.filedownrecords-employee', downfileTabsEl);
            employeeEl.empty();
        },
        "_submit": function(evt) {

            this.hide();
        },
        "_cancel": function(evt) {
            this.hide();
        }
    });
    //辅助组件初始化
    var fileReader = new FileReader();
    /**
     * 网盘-构造函数
     * @param (object)
     * @return  WebDisk
     */
    var WebDisk = function(opts) {
        opts = _.extend({
            "element": null, //容器
            "listPath": "default", //请求列表默认地址
            "searchPath": "#",
            "defaultListRequestData": null, //默认请求列表附加数据
            "navLabel": '<a href="#entnetworkdisk" title="纷享网盘" class="current-disk-l">纷享网盘</a>',
            "rootNode": {//默认打开根节点信息
                "name": '',
                "nDDirectoryID": 0,
                "isReadOnly": false,
                "parentID": 0
            },
            "contextActions": [], //重设右键功能菜单动作行为，无对应设置执行默认行为，格式如下：{"selector":null,"handler":function}
            "showEmpFileOnly": true //打开"某人"所属文件和打开"文件"位置是否能同时存在，默认为true，不能同时存在
        }, opts || {});
        this.opts = opts;
        this.element = $(opts.element);
        this.rootDirectory = null; //保存根目录信息
        this.thisDirectory = null; //保存当前目录信息
        this.navigationInfo = []; //保存导航信息
        this.init(); //初始化
    };

    _.extend(WebDisk.prototype, {
        "init": function() {
            var elEl = this.element;
            var opts = this.opts;
            var templetHtml = $(webdiskTpl).filter('.webdisktpl-warp').html();
            elEl.addClass('disk').html(templetHtml); //渲染html
            //渲染导航label
            $('.nav-label', elEl).html(opts.navLabel);

            //this._initRootNode(); //初始化根节点信息
            //this.dataTables(); //调用datatables插件
            this.windowsOnResize(); //执行窗口改变大小时的操作
            this._rMenuRender(); //渲染右键菜单HTML
            this._initDialogs(); //初始化Dialogs
            this._searchBarInit(); //初始化搜索框
            this._bindEvents(); //事件绑定
            util.regGlobalClick(this.rightMenu); //点击空白处隐藏层
        },
        /*
         "_initRootNode": function() {
         var elEl = this.element,
         navWEl = $('.disk-breadcrumbs', elEl); //导航容器
         var opts = this.opts,
         rootNode = opts.rootNode;
         navWEl.html(rootNode.nodeText); //渲染面包屑导航条
         this.currentDirId = rootNode.nodeId; //设置当前根节点id
         this.rootDirectoryID=rootNode.nodeId;   //设置根目录节点，"纷享网盘"下第一级目录id
         },*/
        "_initDialogs": function() { //初始化弹框
            var diskFnNewDialog = new DiskFnNewDialog({
                "webDisk": this
            }); //网盘功能-新建
            var diskFnUploadDialog = new DiskFnUploadDialog({
                "webDisk": this
            }); //网盘功能-上传
            var diskFnDelDialog = new DiskFnDelDialog({
                "webDisk": this
            }); //网盘功能-删除
            var diskFnSendcoDialog = new DiskFnSendcoDialog(); //网盘功能-发同事
            var diskFnSendclientDialog = new DiskFnSendclientDialog(); //网盘功能-发客户
            var diskFnViewdetailsDialog = new DiskFnViewdetailsDialog(); //网盘功能-查看详情

            this.diskFnNewDialog = diskFnNewDialog;
            this.diskFnUploadDialog = diskFnUploadDialog;
            this.diskFnDelDialog = diskFnDelDialog;
            this.diskFnSendcoDialog = diskFnSendcoDialog;
            this.diskFnSendclientDialog = diskFnSendclientDialog;
            this.diskFnViewdetailsDialog = diskFnViewdetailsDialog;
        },
        "_bindEvents": function() {
            var elEl = this.element;
            var rightmenuEL = this.rightMenu;
            var that = this;
            var opts = this.opts,
                    contextActions = opts.contextActions;
            var fnNewBtnEl = $('.topmenu-fn-new', elEl), //新建按钮
                    fnUploadBtnEl = $('.topmenu-fn-upload', elEl), //上传按钮
                    fnDelBtnEl = $('.topmenu-fn-del', elEl);

            //可见范围按钮点击出现列表
            elEl.on('click', '.range-wrapper', function(evt) { //可见范围按钮
                var meEl = $(evt.currentTarget);
                var rootDirectoryPermissions = meEl.data('rootDirectoryPermissions');
                var circleIDs = []; //部门ID
                var employeeIDs = []; //人的ID
                //组织请求数据
                if (rootDirectoryPermissions.length == 0) {
                    circleIDs.push(999999);
                } else {
                    _.each(rootDirectoryPermissions, function(itemData) {
                        if (itemData.isCircle) {
                            circleIDs.push(itemData.dataID);
                        } else {
                            employeeIDs.push(itemData.dataID);
                        }
                    });
                }
                /* 调用弹层组件 */
                util.showTip({
                    baseElement: meEl,
                    afterShow: function(cb) {
                        var mainEl = this.element;
                        mainEl.html('正在努力的请求数据中……'); //loadding文字
                        /* 请求数据 */
                        var ajax = util.api({
                            "url": '/Account/GetFeedRangeEmployeeInfos', //分享范围接口地址
                            "type": 'post',
                            "data": {
                                "circleIDs": circleIDs,
                                "employeeIDs": employeeIDs
                            },
                            "dataType": 'json',
                            "success": function(responseData) {
                                if (responseData.success) {
                                    var data = responseData.value;
                                    var employeeID = 0,
                                            name = "",
                                            profileImage = "",
                                            contentHtrs = "",
                                            infoType = "";
                                    _.each(data, function(groupdate) {
                                        employeeID = groupdate.employeeID;
                                        name = groupdate.name;
                                        profileImage = util.getAvatarLink(groupdate.profileImage, '2');

                                        contentHtrs += '<div class="share-group-items fn-clear"> <a href="#profile/=/empid-' + employeeID + '" class="profileimage"><img src="' + profileImage + '" alt="" ></a> <a href="#profile/=/empid-' + employeeID + '" class="name">' + name + '</a> <span class="infotype">' + infoType + '</span> </div>';
                                    });
                                    contentHtrs = '<div class="share-group-tpl"><div class="share-group-warp">' + contentHtrs + '</div><div class="share-group-countman">共<span class="num">' + data.length + '</span>人</div> </div>';

                                    mainEl.html(contentHtrs);
                                    cb();
                                }
                            }
                        });

                    }
                });
                return false;
            });

            //当前页面点击当前地址链接刷新到根目录
            elEl.on('click', '.current-disk-l', function(evt) { //返回根目录导航
                var meEl = $(evt.target);
                var href = meEl.attr('href');
                if (location.hash === href) { //当前页面
                    that.load({
                        "directoryID": opts.rootNode.nDDirectoryID
                    });
                }
            });


            /**
             * El的事件们
             *
             */

            elEl.on('mousedown', '.dataTables_scrollBody', function(evt) { //tbody右键单击
                that.isTbody = true; //保存下来
                $(this).get(0).oncontextmenu = function(event) { //点击鼠标右键
                    that._showRMenu(event); //显示右键菜单
                };
            });

            elEl.on('click', '.disk-breadcrumbs .enable-click', function(evt) { //导航
                var meEl = $(evt.target);
                var dirId = meEl.attr('dirid');
                that.load({
                    "directoryID": dirId
                });
                evt.preventDefault();
            });

            elEl.on('click', '.topmenu-fn-reload', function() { //刷新
                that._reload();
            });
            elEl.on('click', '.topmenu-fn-new', function() { //新建的弹框
                that.diskFnNewDialog.WebDisk = that;
                var isdisable = fnNewBtnEl.hasClass('disable');
                if (!isdisable) {
                    that.diskFnNewDialog.show();
                }
            });
            elEl.on('click', '.topmenu-fn-upload', function() { //上传的弹框
                var isdisable = fnUploadBtnEl.hasClass('disable');
                if (!isdisable) {
                    that.diskFnUploadDialog.show();
                }

            });
            elEl.on('click', '.topmenu-fn-del', function() { //删除的弹框
                var isdisable = fnDelBtnEl.hasClass('disable');
                if (!isdisable) {
                    that.diskFnDelDialog.show();
                }
            });
            elEl.on('click', '.table-fn-modif', function(event) { //修改的弹框
                var meEl = $(event.currentTarget);
                var trEl = meEl.closest('tr');
                var trData = that.oTable.fnGetData(trEl.get(0));
                that.diskFnNewDialog.trData = trData;
                that.diskFnNewDialog.WebDisk = that;
                that.diskFnNewDialog.show();
            });
            elEl.on('click', '.topmenu-fn-goback', function(evt) { //返回操作
                var meEl = $(evt.target);
                if (!meEl.hasClass('disable')) {
                    that.load({
                        "directoryID": that.thisDirectory.parentID
                    }, '', function() {
                        that._stateAtemployee = false; //点击返回推送搜素用户文件的状态
                    });
                }
                evt.preventDefault();
            });

            elEl.on('click', '.disktable tbody tr', function(event) { //单击TR选择行
                that.isTbody = false;
                var trData = that.oTable.fnGetData(this);
                if (!trData) {
                    return false;
                }
                var canDelete = trData.canDelete; //是否可以删除
                that.trHasCur($(this)); //表格行高亮
                if (canDelete) { //判断topmenu删除按钮高亮显示
                    fnDelBtnEl.removeClass('disable');
                } else {
                    fnDelBtnEl.addClass('disable');
                }
                that.trData = trData;
            });
            elEl.on('dblclick', '.disktable tbody tr', function(evt) { //鼠标双击
                that.isTbody = false;
                var oTable = that.oTable,
                        rowData = oTable.fnGetData(this);
                if (!rowData) {
                    return false;
                }
                if (rowData.isDir) { //目录的话双击进入下一个目录
                    that.load({
                        "directoryID": rowData.nDDirectoryID
                    }, '', function(responseData, requestData) {
                        var canCreate = responseData.value.thisDiretory.canCreate; //是否是只读目录


                        if (responseData.success) {
                            if (!canCreate) { //如果是只读目录就把新建上传删除disable
                                fnNewBtnEl.addClass('disable');
                                fnUploadBtnEl.addClass('disable');
                            } else {
                                fnNewBtnEl.removeClass('disable');
                                fnUploadBtnEl.removeClass('disable');
                            }
                        }
                    });
                } else {
                    that._showRMenu(evt); //显示右键菜单
                }

            });
            elEl.on('mousedown', '.disktable tbody tr', function() { //右键单击
                that.isTbody = false;
                var trData = that.oTable.fnGetData(this);
                if (!trData) {
                    return false;
                }
                var canDelete = trData.canDelete; //是否可以删除
                that.trHasCur($(this)); //表格行高亮
                if (canDelete) { //判断topmenu删除按钮高亮显示
                    fnDelBtnEl.removeClass('disable');
                } else {
                    fnDelBtnEl.addClass('disable');
                }
                that.trData = trData;
                $(this).get(0).oncontextmenu = function(event) { //点击鼠标右键
                    that._showRMenu(event); //显示右键菜单
                };
                return false;
            });

            elEl.on('click', '.table-fn-preview', function(evt) { //预览
                var meEl = $(this);
                var selectedData = that.oTable.fnGetData(meEl.closest('tr').get(0));
                fileReader.readFile({
                    "fileId": selectedData.nDFileID,
                    "fileName": selectedData.attachName,
                    "filePath": selectedData.attachPath
                });
                //下载计数加1
                that._updateDownloadTime();
                evt.preventDefault();
            }).on('click', '.table-fn-download', function(evt) {
                //下载计数加1
                that._updateDownloadTime();
                window.open($(evt.currentTarget).attr('href'));
                evt.preventDefault();
            });
            elEl.on('click', '.rightmenu-fn-viewdetails', function() { //查看下载详情的弹框
                that.diskFnViewdetailsDialog.trData = that.trData;
                that.diskFnViewdetailsDialog.WebDisk = that;
                that.diskFnViewdetailsDialog.show();
            });

            /**
             * 右键菜单的事件们
             *
             */
            _.each(contextActions, function(config) {
                rightmenuEL.on('click', config.selector, function(evt) { //新建
                    var selectedData = that.oTable.fnGetData(that.getSelectRow().get(0));
                    config.handler && config.handler.call(this, evt, selectedData);
                    rightmenuEL.hide();
                    evt.stopImmediatePropagation(); //阻止事件冒泡，并阻止其他事件处理函数执行
                });
            });
            rightmenuEL.on('click', '.rightmenu-fn-new', function(evt) { //新建
                that.diskFnNewDialog.WebDisk = that;
                that.diskFnNewDialog.show();
            });
            rightmenuEL.on('click', '.rightmenu-fn-upload', function(evt) { //上传
                that.diskFnUploadDialog.show();
            });
            rightmenuEL.on('click', '.rightmenu-fn-open', function(evt) { //打开
                var selectedData = that.oTable.fnGetData(that.getSelectRow().get(0));
                that.load({
                    "directoryID": selectedData.nDDirectoryID
                });
                evt.preventDefault();
            });
            rightmenuEL.on('click', '.rightmenu-fn-modif', function(evt) { //修改
                var trEl = that.getSelectRow();
                $('.table-fn-modif', trEl).click(); //触发行内删除快捷方式
                evt.preventDefault();
            });
            rightmenuEL.on('click', '.rightmenu-fn-preview', function(evt) { //预览
                var selectedData = that.oTable.fnGetData(that.getSelectRow().get(0));
                fileReader.readFile({
                    "fileId": selectedData.nDFileID,
                    "fileName": selectedData.attachName,
                    "filePath": selectedData.attachPath
                });
                that._updateDownloadTime();
                evt.preventDefault();
                //root.open(FS.API_PATH+'/DF/GetNDFile?feedID=0&fileID='+selectedData.nDFileID+'&type=2');
            });
            rightmenuEL.on('click', '.rightmenu-fn-download', function() { //下载
                var selectedData = that.oTable.fnGetData(that.getSelectRow().get(0));
                that._updateDownloadTime();
                // root.open(FS.API_PATH + '/DF/GetNDFile?feedID=0&fileID=' + selectedData.nDFileID + '&type=1');
                root.open(util.getDfLink(selectedData.attachPath, selectedData.attachName, true));
            });
            rightmenuEL.on('click', '.rightmenu-fn-del', function() { //删除的弹框
                that.diskFnDelDialog.show();
            });
            rightmenuEL.on('click', '.rightmenu-fn-sendco', function() { //发同事的弹框
                that.diskFnSendcoDialog.trData = that.trData;
                that.diskFnSendcoDialog.WebDisk = that;
                that.diskFnSendcoDialog.show();
            });
            rightmenuEL.on('click', '.rightmenu-fn-sendclient', function() { //发客户的弹框
                that.diskFnSendclientDialog.trData = that.trData;
                that.diskFnSendclientDialog.WebDisk = that;
                that.diskFnSendclientDialog.show();
            });
            rightmenuEL.on('click', '.rightmenu-fn-viewwho', function(evt) { //查看某某的文件
                var selectedData = that.oTable.fnGetData(that.getSelectRow().get(0)),
                        creator = selectedData.creator;
                that.load({
                    "employeeID": creator.employeeID,
                    "keyword": "",
                    "pageSize": 10000,
                    "pageNumber": 1
                }, '/NetDisk/GetOneEmployeeSendFiles', function(responseData, requestData) {
                    var navWEl = $('.disk-breadcrumbs', elEl);
                    if (responseData.success) {
                        //设置导航
                        navWEl.html('&nbsp;/&nbsp;<span class="nav-item">' + creator.name + '的上传文件</span>');
                    }
                    //禁用新建、上传、删除功能键
                    $('.topmenu-fn-new,.topmenu-fn-upload,.topmenu-fn-del', elEl).addClass('disable');
                    //设置网盘搜索用户状态
                    that._stateAtemployee = true;
                });
                evt.preventDefault();
            });

            rightmenuEL.on('click', '.rightmenu-fn-view-dir', function(evt) { //查看文件所属目录
                var selectedData = that.oTable.fnGetData(that.getSelectRow().get(0));
                that.load({
                    "directoryID": selectedData.parentID
                }, '', function() {
                    //设置网盘搜索用户状态为false
                    that._stateAtemployee = false;
                });
                evt.preventDefault();
            });
            rightmenuEL.on('click', '.rightmenu-fn-viewdetails', function() { //查看下载详情的弹框
                that.diskFnViewdetailsDialog.trData = that.trData;
                that.diskFnViewdetailsDialog.WebDisk = that;
                that.diskFnViewdetailsDialog.show();
            });
        },
        /**
         * 格式化表格数据-把对象转换成数组并添加新属性
         * @param {object}
         * @return {Object}
         */
        "_formatTableData": function(responseData) {
            var formatData = [];
            var data = responseData.value;
            var files = data.files;
            var directorys = data.directorys;
            _.each(directorys, function(directory) { //目录列表
                formatData.push(_.extend({
                    "isDir": true,
                    "downloadTimes": 0,
                    "attachSize": 0
                }, directory));
            });
            _.each(files, function(file) { //文件列表
                formatData.push(_.extend({
                    "isDir": false,
                    "name": file.attachName
                }, file));
            });
            return {
                "aaData": formatData
            };
        },
        /**
         * 选中项下载次数加1
         */
        "_updateDownloadTime": function() {
            var trSelectedEl = this.getSelectRow(),
                    downloadTimesEl = $('.download-times', trSelectedEl),
                    countsEl = $('.counts', downloadTimesEl);
            var selectedData = this.oTable.fnGetData(trSelectedEl.get(0));
            util.api({
                "url": "/File/RecoreDownloadTime",
                "data": {
                    "feedID": 0,
                    "fileID": selectedData.nDFileID
                },
                "type": "get",
                "success": function(responseData) {
                    if (responseData.success) {
                        countsEl.text(parseInt(countsEl.text()) + 1);
                    }
                }
            });
        },
        "dataTables": function() { //DatatTables插件配置
            var elEl = this.element;
            var that = this;
            var opts = this.opts;
            var diskUrl = opts.listPath;
            var datatablesEl = $('.disktable', elEl);
            var oTable = datatablesEl.dataTable({
                "sScrollY": "700px", //高度限制
                "bPaginate": false, //是否启用分页
                "bInfo": false, //页脚信息
                "bAutoWidth": false, //列的宽度会根据table的宽度自适应
                "aoColumnDefs": [
                    {
                        "sType": "file-group-sort-string", //分组排序，目录在上面，文件在下面
                        "aTargets": [1, 4]
                    },
                    {
                        "sType": "file-group-sort-number",
                        "aTargets": [2, 3, 5]
                    }
                ],
                "aoColumns": [
                    {//是否公开
                        "mData": "isDir",
                        "sWidth": "22px",
                        "bSortable": false,
                        "mRender": function(data, type, full) { //第一列内容
                            var isPublic = '';
                            if (data) {
                                if (full.isPublic) {
                                    isPublic = '<img src="' + FS.ASSETS_PATH + '/images/disk/disk_ispublic_ico.png" alt="" class="isPublic-img">';
                                }
                            }
                            if (full.isUnread) { //是否显示“新”
                                isPublic = '<img src="' + FS.ASSETS_PATH + '/images/new.gif" alt="" class="new-img">';
                            }
                            return isPublic;
                        }
                    },
                    {//文件名
                        "sWidth": "260px",
                        "mData": "isDir",
                        "mRender": function(data, type, full) {
                            var name = full.name,
                                    dataId,
                                    dataType;
                            var fname = '<a href="javascript:void(0);" class="attachName-a"><img src="' + FS.BLANK_IMG + '" alt="" class="fs-attach-' + util.getFileType({
                                "name": name
                            }) + '-small-icon attachName-img"><span class="attachName-text">' + name + '</span></a>';
                            if (data) {
                                if (full.isReadOnly) {
                                    fname = '<a href="javascript:void(0);" class="attachName-a"><img src="' + FS.ASSETS_PATH + '/images/disk/disk_root_lock_ico.png" alt="" class="attachName-img"><span class="attachName-text">' + name + '</span></a>';
                                } else {

                                    fname = '<a href="javascript:void(0);" class="attachName-a"><img src="' + FS.ASSETS_PATH + '/images/disk/disk_root_ico.png" alt="" class="attachName-img"><span class="attachName-text">' + name + '</span></a>';
                                }
                                dataId = full.nDDirectoryID;
                                dataType = "dir";
                            } else {
                                dataId = full.nDFileID;
                                dataType = "file";
                            }
                            return '<span dataid="' + dataId + '" datatype="' + dataType + '">' + fname + '<span class="flag-entity-type">' + (data ? 1 : 0) + '</span><span class="field-value">' + name + '</span></span>';
                        }

                    },
                    {//下载次数
                        "sWidth": "80px",
                        "mData": "downloadTimes",
                        "mRender": function(data, type, full) {
                            var downloadnum = '';
                            if (!full.isDir && data >= 0) {
                                downloadnum = '<a href="javascript:;" class="rightmenu-fn-viewdetails download-times"><span class="counts">' + data + '</span>次</a>';
                            }
                            return '<span>' + downloadnum + '<span class="flag-entity-type">' + (full.isDir ? 1 : 0) + '</span><span class="field-value">' + data + '</span></span>';
                        }
                    },
                    {//文件大小
                        "sWidth": "80px",
                        "mData": "attachSize",
                        "mRender": function(data, type, full) {
                            var attSize = '';
                            if (!full.isDir) {
                                attSize = util.getFileSize(data);
                            }
                            return '<span>' + attSize + '<span class="flag-entity-type">' + (full.isDir ? 1 : 0) + '</span><span class="field-value">' + data + '</span></span>';
                        }
                    },
                    {//创建人
                        "sWidth": "80px",
                        "mData": "creator",
                        "mRender": function(data, type, full) {
                            return '<span>' + data.name + '<span class="flag-entity-type">' + (full.isDir ? 1 : 0) + '</span><span class="field-value">' + data.spell + '</span></span>';
                        }
                    },
                    {//创建时间
                        "sWidth": "130px",
                        "mData": "createTime",
                        "mRender": function(data, type, full) {
                            var finalTime = util.getDateSummaryDesc(moment.unix(data), moment.unix(that._lastServiceTime), 1);
                            return '<span class="webdisk-createTime">' + finalTime + '<span class="flag-entity-type">' + (full.isDir ? 1 : 0) + '</span><span class="field-value">' + data + '</span></span>';
                        }
                    },
                    {//操作
                        "mData": "isDir",
                        "bSortable": false,
                        "mRender": function(data, type, full) {
                            var operating = '';
                            var previewBtn = '';
                            if (data) {
                                if (full.canModify) {
                                    operating = '<a href="javascript:void(0);" class="table-fn-modif">修改</a>';
                                } else {
                                    operating = '';
                                }
                            } else {
                                if (full.canPreview) {
                                    previewBtn = '&nbsp;&nbsp;<a href="" class="table-fn-preview">预览</a>';
                                }
                                operating = '<a href="' + util.getDfLink(full.attachPath, full.attachName, true) + '" class="table-fn-download">下载</a>' + previewBtn;
                            }
                            return operating;
                        }
                    }
                ],
                "sAjaxSource": diskUrl,
                "fnServerData": function(sSource, aoData, fnCallback, oSettings) {
                    var requestData = {
                        "directoryID": 0 //默认请求目录节点id为0
                    }, requestPath = sSource;
                    if (opts.defaultListRequestData) {
                        if (_.isFunction(opts.defaultListRequestData)) {
                            _.extend(requestData, opts.defaultListRequestData());
                        } else {
                            _.extend(requestData, opts.defaultListRequestData);
                        }
                    }
                    //通过load传进来的临时参数
                    _.extend(requestData, that._tempListRequestData);
                    //清空_tempListRequestData
                    that._tempListRequestData = null;
                    if (that._listPath) {
                        requestPath = that._listPath;
                        //及时清空
                        this._listPath = '';
                    }
                    //打开遮罩
                    that.showLoading();
                    $('tbody tr', datatablesEl).css({
                        "visibility": "hidden"
                    });
                    that.cancelSelectRow(); //取消选中的行
                    oSettings.jqXHR = util.api({
                        "dataType": 'json',
                        "type": "get",
                        "url": requestPath,
                        "data": requestData,
                        "success": function(responseData) {
                            var formatData,
                                    dataRoot;
                            if (responseData.success) {
                                dataRoot = responseData.value;
                                formatData = that._formatTableData(responseData);
                                if (requestPath == sSource) { //请求列表信息接口会更新状态和内部存储
                                    //设置当前目录节点信息和根目录节点信息
                                    that.thisDirectory = dataRoot.thisDiretory;
                                    that.rootDirectory = dataRoot.rootDiretory;
                                    that.navigationInfo = dataRoot.navigationInfo;
                                    //更新功能键状态
                                    that.updateActionState();
                                    //更新导航信息
                                    that.updateNavInfo();
                                    //更新可视返回信息
                                    that.updateRangeInfo(dataRoot.rangeDescription, dataRoot.rootDirectoryPermissions);
                                    //更新底部统计信息
                                    that.updateBbarInfo(dataRoot);
                                } else { //启用返回按钮，保证可返回到根目录
                                    $('.topmenu-fn-goback', elEl).removeClass('disable');
                                }
                                // 判断当前目录是否有权限创建文件夹和上传文件
                                var canCreate, fnNewBtnEl, fnUploadBtnEl;
                                if (that.rootDirectory) {
                                    canCreate = that.rootDirectory.canCreate;
                                    fnNewBtnEl = $('.topmenu-fn-new', elEl); //新建按钮
                                    fnUploadBtnEl = $('.topmenu-fn-upload', elEl); //上传按钮
                                    if (!canCreate) { //如果是只读目录就把新建上传删除disable
                                        fnNewBtnEl.addClass('disable');
                                        fnUploadBtnEl.addClass('disable');
                                    } else {
                                        fnNewBtnEl.removeClass('disable');
                                        fnUploadBtnEl.removeClass('disable');
                                    }
                                }


                                //保留上一次requestData for refresh
                                that._lastRequestData = requestData;
                                that._lastListPath = requestPath;
                                that._lastServiceTime = responseData.serviceTime;

                                fnCallback(formatData);
                                //关闭遮罩
                                that.hideLoading();
                                //通过load请求回调
                                if (that._listCallback) {
                                    that._listCallback.call(this, responseData, requestData);
                                    that._listCallback = null; //用完即毁
                                }

                                //重新调整尺寸和位置
                                $(root).resize();
                            }
                        }
                    });
                },
                //"fnServerParams":function(aoData){},
                "sDom": '<"top"i>rt<"bottom"flp><"clear">', //改变页面上元素的位置
                //"sDom":'Rlfrtip',
                "oLanguage": {
                    "sEmptyTable": '<span class="empty-tip">当前目录下没有文件夹和文件</span>'
                }
            });
            oTable.fnDraw();
            this.oTable = oTable;
        },
        "trHasCur": function(thisEl) { //选中行高亮显示
            var datatablesEl = $('.disktable', this.element);
            var fisttdEl = thisEl.find('td:first');
            var lasttdEl = thisEl.find('td:last');
            $('tr.row_selected', datatablesEl).removeClass('row_selected');
            $('td.border-blue-l', datatablesEl).removeClass('border-blue-l');
            $('td.border-blue-r', datatablesEl).removeClass('border-blue-r');
            thisEl.addClass('row_selected');
            fisttdEl.addClass('border-blue-l');
            lasttdEl.addClass('border-blue-r');
        },
        /**
         * 更新功能键状态
         */
        "updateActionState": function() {
            var opts = this.opts;
            var thisDirectory = this.thisDirectory || opts.rootNode;
            var elEl = this.element;
            //是否只读
            if (thisDirectory.isReadOnly) {
                $('.topmenu-fn-new,.topmenu-fn-upload', elEl).addClass('disable');
            } else {
                $('.topmenu-fn-new,.topmenu-fn-upload', elEl).removeClass('disable');
            }
            //每次请求刷新列表后禁用删除按钮
            $('.topmenu-fn-del', elEl).addClass('disable');
            //是否可返回
            if (thisDirectory.nDDirectoryID != 0) { //当前目录id不为0可以返回
                $('.topmenu-fn-goback', elEl).removeClass('disable');
            } else {
                $('.topmenu-fn-goback', elEl).addClass('disable');
            }
        },
        /**
         * 更新导航信息
         */
        "updateNavInfo": function() {
            var opts = this.opts;
            var elEl = this.element,
                    navWEl = $('.disk-breadcrumbs', elEl);
            var navigationInfo = this.navigationInfo,
                    thisDirectory = this.thisDirectory || opts.rootNode;
            var htmlStr = '';
            _.each(navigationInfo, function(navItem) {
                htmlStr += '&nbsp;/&nbsp;<span class="nav-item enable-click" dirid="' + navItem.value + '">' + navItem.value1 + '</span>';
            });
            //追加当前目录
            if (thisDirectory.name) {
                htmlStr += '&nbsp;/&nbsp;<span class="nav-item">' + thisDirectory.name + '</span>';
            }
            navWEl.html(htmlStr);
        },
        /**
         * 更新可视范围信息
         * @param rangeDescription
         */
        "updateRangeInfo": function(rangeDescription, rootDirectoryPermissions) {
            var elEl = this.element,
                    rangeWEl = $('.range-wrapper', elEl);
            if (rangeDescription) {
                rangeWEl.html(rangeDescription).closest('.disk-tit-r').show();
                rangeWEl.data('rootDirectoryPermissions', rootDirectoryPermissions);
            } else {
                rangeWEl.closest('.disk-tit-r').hide();
                rangeWEl.removeData('rootDirectoryPermissions');
            }

        },
        /**
         * 更新bbar统计信息
         */
        "updateBbarInfo": function(dataRoot) {
            var elEl = this.element,
                    diskStatusEl = $('.disk-status', elEl),
                    dirNumEl = $('.dir-num', diskStatusEl),
                    fileNumEl = $('.file-num', diskStatusEl);
            var directorys = dataRoot.directorys,
                    files = dataRoot.files;
            dirNumEl.html(directorys ? directorys.length : 0);
            fileNumEl.html(files ? files.length : 0);
        },
        /**
         * 获取选中的行
         */
        "getSelectRow": function() {
            var tableEl = this.oTable;
            return $('tr.row_selected', tableEl);
        },
        /**
         * 取消选中行，如果trSelector为空，则取消全部选中
         * @param trSelector
         */
        "cancelSelectRow": function(trSelector) {
            var oTableEl = this.oTable,
                    trEl;
            if (trSelector) {
                trEl = $(trSelector);
                trEl.removeClass('row_selected');

                $('td.border-blue-l', trEl).removeClass('border-blue-l');
                $('td.border-blue-r', trEl).removeClass('border-blue-r');
            } else {
                $('tr.row_selected', oTableEl).removeClass('row_selected');
                $('td.border-blue-l', oTableEl).removeClass('border-blue-l');
                $('td.border-blue-r', oTableEl).removeClass('border-blue-r');
            }
        },
        _rMenuRender: function() {
            var rightMenuHtml = $(webdiskTpl).filter('.rightmenu-templet').html();
            var rightMenuEl = $(rightMenuHtml);
            rightMenuEl.appendTo('body');
            //设置右键菜单引用
            this.rightMenu = rightMenuEl;
        },
        "_rMenuRenderFormat": function() { //格式化右键菜单数据
            var opts = this.opts;
            var menuEl = this.rightMenu; //右键菜单容器
            var fnNewBtn = $('.rightmenu-fn-new', menuEl); //新建
            var fnUploadBtn = $('.rightmenu-fn-upload', menuEl); //上传
            var fnOpenBtn = $('.rightmenu-fn-open', menuEl); //打开
            var fnModifBtn = $('.rightmenu-fn-modif', menuEl); //修改
            var fnDelBtn = $('.rightmenu-fn-del', menuEl); //删除
            var fnDownloadBtn = $('.rightmenu-fn-download', menuEl); //下载
            var fnPreviewBtn = $('.rightmenu-fn-preview', menuEl); //预览
            var fnViewwhoBtn = $('.rightmenu-fn-viewwho', menuEl); //查看某某的文件
            var sXline = '<span class="x-line-after"></span>';
            var oXlineEl = $('.x-line-after', menuEl);
            var trData = this.trData;
            var isDir = trData.isDir;
            var name = trData.creator.name;
            var isTbody = this.isTbody;
            var fnViewDirBtn = $('.rightmenu-fn-view-dir', menuEl); //查看文件位置

            fnViewwhoBtn.html('<i class="ico"></i>查看' + name + '的文件');

            fnViewwhoBtn.html('<i class="ico"></i>查看' + name + '的文件');
            oXlineEl.remove(); //先清除所有横线
            menuEl.children().hide(); //隐藏所有按钮
            //目录和文件显示不同的右键菜单
            if (isDir) {
                menuEl.children().hide(); //隐藏所有按钮
                fnOpenBtn.show();
            } else {
                menuEl.children().show();
                fnNewBtn.hide();
                fnUploadBtn.hide();
                fnOpenBtn.hide();
                fnModifBtn.hide();
                //打开文件与查看用户上传文件
                if (opts.showEmpFileOnly) {
                    if (this._stateAtemployee) {
                        fnViewDirBtn.show();
                        fnViewwhoBtn.hide();
                    } else {
                        fnViewDirBtn.hide();
                        fnViewwhoBtn.show();
                    }
                } else {
                    fnViewDirBtn.show();
                    fnViewwhoBtn.show();
                }

            }
            /* 权限控制 */

            //是否可删除

            if (trData.canDelete) {
                fnDelBtn.show();
                if (!isDir) {
                    fnDelBtn.after(sXline);
                }
            } else {
                fnDelBtn.hide();
            }
            //是否可修改
            if (trData.canModify) {
                fnModifBtn.show().after(sXline);
            } else {
                fnModifBtn.hide();
            }
            //是否可预览
            if (trData.canPreview) {
                fnDownloadBtn.show().after(sXline);
                fnPreviewBtn.show();
            } else {
                fnPreviewBtn.hide();
            }
            //点击TR之外区域
            if (isTbody) {
                menuEl.children().hide();
                fnNewBtn.show();
                fnUploadBtn.show();
            }

        },
        "_showRMenu": function(event) { //在鼠标当前位置显示右键菜单
            this._rMenuRenderFormat();
            var menuOpenEl = this.rightMenu; //右键菜单元素
            var mH = menuOpenEl.height(); //menu高度
            var mW = menuOpenEl.width(); //menu宽度
            var dH = $(root).height(); //页面高度
            var dW = $(root).width() - 15; //页面宽度
            var site_x, site_y; //鼠标坐标
            var h;
            var w;
            if (!document.all) { //兼容获取鼠标当前位置
                site_x = event.pageX;
                site_y = event.pageY;
            } else {
                site_x = document.documentElement.scrollLeft + window.event.clientX;
                site_y = document.documentElement.scrollTop + window.event.clientY;
            }
            h = site_y + mH;
            w = site_x + mW;
            //定位右键菜单坐标值，与页面整体宽高做比较，以定位具体位置
            site_y = (dH < h) ? (site_y - mH) : site_y;
            site_x = (dW < w) ? (site_x - mW - 15) : site_x;
            //css赋值，并显示出来
            menuOpenEl.css({
                'top': (site_y),
                'left': (site_x + 10)
            }).show();
            if (document.all) { // for IE 中断正常网页右键菜单行为
                window.event.returnValue = false;
            } else {
                event.preventDefault();
            }
            return false;
        },
        "windowsOnResize": function() {
            var elEl = this.element;
            $(root).resize(function() {
                var tbodywarpEl = $('.dataTables_scrollBody', elEl),
                        bbarEl = $('.disk-status', elEl),
                        tbodyOffset,
                        bbarH,
                        winH;
                if (tbodywarpEl.length > 0) {
                    tbodyOffset = tbodywarpEl.offset();
                    bbarH = bbarEl.outerHeight();
                    winH = $(root).height();

                    if (winH > (tbodyOffset.top + bbarH)) {
                        tbodywarpEl.height(winH - tbodyOffset.top - bbarH);
                    } else {
                        tbodywarpEl.height(0);
                    }
                }

            }).resize();
        },
        /**
         * 搜索条初始化，带快速删除icon
         * @private
         */
        _searchBarInit: function() {
            var that = this;
            var opts = this.opts;
            var elEl = this.element,
                    searchInputEl = $('.search-inp', elEl), //搜索输入框
                    searchBtnEl = $('.search-btn', elEl); //搜索按钮
            //创建快速关闭按钮
            var searchEmptyEl = $('<span class="empty-h">x</span>'),
                    searchInputWEl = $('<span class="list-search-input-wrapper"></span>');
            searchInputEl.wrap(searchInputWEl);
            searchInputWEl = searchInputEl.closest('.list-search-input-wrapper');
            searchEmptyEl.hide().appendTo(searchInputWEl);

            //搜索输入框enter提交事件注册和快速清空按钮
            searchInputEl.keydown(function(evt) {
                if (evt.keyCode == 13) { //监听回车按键
                    searchBtnEl.click();
                }
            }).keyup(function() {
                var val = _.str.trim($(this).val());
                if (val.length > 0) {
                    searchEmptyEl.show();
                    searchInputEl.addClass('with-input-value');
                } else {
                    searchEmptyEl.hide();
                    searchInputEl.removeClass('with-input-value');
                }
            });
            searchEmptyEl.click(function() {
                searchInputEl.val("");
                searchInputEl.removeClass('with-input-value');
                searchEmptyEl.hide();
            });
            searchBtnEl.click(function(evt) {
                var thisDirectory = that.thisDirectory || opts.rootNode;
                that.load({
                    "directoryID": thisDirectory.nDDirectoryID,
                    "keyword": _.str.trim(searchInputEl.val()),
                    "pageSize": 10000, //不需要分页，传一个极大值
                    "pageNumber": 1
                }, opts.searchPath);
                evt.preventDefault();
            });
        },
        "showLoading": function() {
            var loading = this.loading,
                    elEl = this.element,
                    loadingEl = $('.list-loading', elEl);
            //第一次show之前render出来
            if (loadingEl.length == 0) {
                loadingEl = $('<div class="list-loading"></div>');
                loadingEl.prependTo($('.dataTables_scrollBody', elEl));
                loadingEl.html('<span class="icon-loading"><img src="' + FS.BLANK_IMG + '" alt="loading" /></span>&nbsp;<span class="loading-text">正在加载，请稍候&#8230;</span>');
                //设置实例引用
                this.loading = loading;
            }
            loadingEl.show();
        },
        "hideLoading": function() {
            var elEl = this.element,
                    loadingEl = $('.list-loading', elEl);
            loadingEl.hide();
        },
        "load": function(requestData, listPath, callback) {
            this._tempListRequestData = requestData || {};
            this._listPath = listPath || "";
            this._listCallback = callback || FS.EMPTY_FN; //列表请求成功后的回调
            if (!this.oTable) {
                this.dataTables(); //调用datatables插件
            } else {
                //重新请求
                this.oTable.fnReloadAjax();
            }
        },
        /**
         * _reload别名，对外暴露
         */
        "reload": function() {
            this._reload();
        },
        "_reload": function() { //刷新datatable数据
            //获取当前的目录节点id
            var thisDirectory = this.thisDirectory;
            var tempListRequestData = this._lastRequestData ? this._lastRequestData : {
                "directoryID": thisDirectory ? thisDirectory.nDDirectoryID : 0
            };
            var listPath = this._lastListPath || "";
            this.load(tempListRequestData, listPath);
        },
        "reset": function() {
            var elEl = this.element,
                    searchInputEl = $('.search-inp', elEl); //搜索输入框
            searchInputEl.val("").keyup();
            this.load(); //重新请求
        },
        "destroy": function() {
            this._tempListRequestData = null;
            this._listCallback = null;
            this.thisDirectory = null;
            this.rootDirectory = null;
            this.navigationInfo = null;
            this._lastRequestData = null; //清除最近一次请求参数
            this._lastListPath = null; //清除最近一次请求地址
            //销毁grid组件
            this.oTable && this.oTable.fnDestroy();
            //销毁弹框组件
            //销毁右键菜单
            this.rightMenu && this.rightMenu.remove();
            this.rightMenu = null;
        }
    });
    module.exports = WebDisk;
});