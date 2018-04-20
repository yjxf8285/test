/**
 * 定义发布@、上传、录音、选人、选取可视范围、发布框自适应大小
 *
 * 遵循seajs module规范
 * @author qisx
 */
define("modules/publish/publish", [ "util", "detector", "json", "moment", "events", "overlay", "dialog", "uilibs/tabs", "filter", "autocomplete", "select", "placeholder", "calendar", "swfupload", "fsupload" ], function(require, exports, module) {
    var root = window, FS = root.FS, tpl = FS.tpl, store = tpl.store, tplEvent = tpl.event;
    var util = require("util"), detector = require("detector"), json = require("json"), moment = require("moment"), Events = require("events"), Overlay = require("overlay"), Dialog = require("dialog"), Tabs = require("uilibs/tabs"), filter = require("filter"), AutoComplete = require("autocomplete"), Select = require("select"), placeholder = require("placeholder"), Calendar = require("calendar"), SWFUpload = require("swfupload"), FsUpload = require("fsupload"), publishTpl = require("modules/publish/publish.html"), publishStyle = require("modules/publish/publish.css");
    var publishTplEl = $(publishTpl);
    var UPLOAD_FILES_PATH = FS.BASE_PATH + "/Files/Temp";
    //将组织和个人数据的获取和格式化绑定到publish组件下，作为SelectBar和SelectPanel的默认数据?(待定)
    //设置publish store
    //util.localStore('module','publish',{});
    /**
     * 发布at
     * @param {Object} elSelector
     */
    var AtInput = function(opts) {
        var elEl;
        opts = _.extend({
            element: null,
            data: util.getContactData()["p"]
        }, opts || {});
        elEl = $(opts.element);
        this.element = elEl;
        util.asyncOrder([ "stylelibs/jquery.atwho.css", "jslibs/jquery.atwho.min.js", "jslibs/jquery.atwho.custom.js", "jslibs/jquery.autosize.js" ], function() {
            var filterHandler = filter.stringMatch;
            elEl.atwho("@", {
                data: opts.data,
                callbacks: {
                    filter: function(query, data, search_key) {
                        var filterData = [], filterData1, filterData2;
                        if (_.str.trim(query).length == 0) {
                            //如果为空，显示常用联系人信息
                            var lastAtEmployees = util.getPersonalConfig("lastAtEmployees");
                            _.each(lastAtEmployees, function(employeeData) {
                                var userData = util.getContactDataById(employeeData.dataID, "p");
                                filterData.push(userData);
                            });
                        } else {
                            filterData1 = filterHandler.apply(this, [ data, query, {
                                key: "name"
                            } ]);
                            filterData2 = filterHandler.apply(this, [ data, query.toLowerCase(), {
                                key: "spell"
                            } ]);
                            //先插入filterData2的数据
                            _.each(filterData2, function(itemData) {
                                if (!_.find(filterData1, function(itemData2) {
                                    return itemData2.id == itemData.id;
                                })) {
                                    filterData.push(itemData);
                                }
                            });
                            filterData = filterData.concat(filterData1);
                        }
                        return filterData;
                    },
                    matcher: function(flag, subtext) {
                        var match, matched, regexp;
                        regexp = new RegExp(flag + "([\\S]*)$", "gi");
                        match = regexp.exec(subtext);
                        matched = null;
                        if (match) {
                            matched = match[2] ? match[2] : match[1];
                        }
                        return matched;
                    }
                }
            }).addClass("fs-publish-input");
            if (detector.browser.ie) {
                //ie触发propertychange后window scroll会重新定位，未找到具体原因，采用以下修正补丁
                elEl.keyup(function() {
                    var atwho = elEl.data("atwho");
                    var rect = atwho.rect(), winH = $(window).height();
                    if (rect.bottom > winH) {
                        $(window).scrollTop(rect.bottom - winH + 120);
                    }
                });
            }
            //ie6取消自适应textarea高度功能
            //ie6也加入自适应高度功能
            //if (!(detector.browser.ie && detector.browser.version < 7)) {
            elEl.addClass("autosize-animated").autosize();
        });
    };
    _.extend(AtInput.prototype, {
        destroy: function() {
            this.element.trigger("autosize.destroy").removeClass("autosize-animated");
        }
    });
    /**
     * 上传、附件、投票、at
     */
    var MediaMaker = function(opts) {
        var that = this;
        opts = _.extend({
            element: null,
            action: [ "imgUpload", "attachUpload", "vote", "at" ],
            actionOpts: {}
        }, opts || {});
        this.opts = opts;
        this.element = $(opts.element);
        this.init();
        this.allUploaded = true;
        //设置全部上传完毕(img/attach)标志
        _.each(opts.action, function(v) {
            that[v].call(that);
        });
    };
    _.extend(MediaMaker.prototype, {
        init: function() {
            var that = this;
            var elEl = this.element, opts = this.opts;
            var btnWEl, panelWEl;
            elEl.html('<div class="fs-publish-action-btns"></div><div class="fs-publish-action-panels"></div>');
            btnWEl = $(".fs-publish-action-btns", elEl);
            panelWEl = $(".fs-publish-action-panels", elEl);
            _.each(opts.action, function(v) {
                var vName = v.toLowerCase();
                var btnEl = $('<a href="#" class="fs-publish-' + vName + '-btn fs-publish-media-btn"></a>'), panelBoxEl = $('<div class="fs-publish-media-panel-wrapper"></div>'), panelCloseBtnEl = $('<span class="close-btn">×</span>'), panelEl = $('<div class="fs-publish-' + vName + '-panel fs-publish-media-panel"></div>');
                btnEl.appendTo(btnWEl);
                panelCloseBtnEl.appendTo(panelBoxEl);
                panelEl.appendTo(panelBoxEl);
                panelBoxEl.appendTo(panelWEl);
                //通过自定义事件控制面板的显隐
                btnEl.bind("showpanel", function() {
                    panelBoxEl.show();
                });
                panelCloseBtnEl.click(function() {
                    that[v + "Clear"]();
                    panelBoxEl.hide();
                    that.trigger("closeaction", v);
                });
            });
            //设置uploadprogress事件监听
            if (_.indexOf(opts.action, "imgUpload") != -1 || _.indexOf(opts.action, "attachUpload") != -1) {
                this.on("uploadstart", function(file, bytesLoaded, type, infoEl) {
                    this.trigger("uploadprogress", file, bytesLoaded, type, infoEl);
                });
                this.on("uploadprogress", function(file, bytesLoaded, type, infoEl) {
                    var upload = that[type + "Upload"], uploadFiles = upload.uploadFiles || [];
                    var uploadFile = _.find(uploadFiles, function(v) {
                        if (v.id == file.id) {
                            _.extend(v, file, {
                                //更新file状态
                                uploadedSize: bytesLoaded
                            });
                            return true;
                        }
                    });
                    if (!uploadFile) {
                        uploadFiles.push(_.extend(file, {
                            uploadedSize: bytesLoaded
                        }));
                    }
                    upload.uploadFiles = uploadFiles;
                    //console.info(uploadFiles);
                    //设置上传信息
                    that.updateUploadInfo(upload, infoEl);
                });
                this.on("uploadsuccess", function(file, serverData, type) {
                    var upload = that[type + "Upload"], uploadFiles = upload.uploadFiles || [];
                    var uploadFile = _.find(uploadFiles, function(v) {
                        if (v.id == file.id) {
                            _.extend(v, file, {
                                //更新file状态
                                pathName: json.parse(serverData).value
                            });
                            return true;
                        }
                    });
                    if (!uploadFile) {
                        uploadFiles.push(_.extend(file, {
                            pathName: json.parse(serverData).value
                        }));
                    }
                    upload.uploadFiles = uploadFiles;
                });
                //test
                this.on("alluploadcomplete", function() {});
                this.on("typeuploadcomplete", function(upload) {
                    var allUpload = true;
                    upload.uploaded = true;
                    _.find([ that["imgUpload"], that["attachUpload"] ], function(v) {
                        if (v && v.uploaded === false) {
                            allUpload = false;
                            return true;
                        }
                    });
                    if (allUpload) {
                        that.allUploaded = true;
                        //全部上传完毕标志
                        that.trigger("alluploadcomplete");
                    }
                });
            }
        },
        getUploadItem: function(file, wSelector) {
            var wEl = $(wSelector);
            var fileName = file.name;
            var itemEl = $('[filename="' + fileName + '"]', wEl);
            if (itemEl.length == 0) {
                itemEl = $('<div class="fs-publish-upload-item" filename="' + fileName + '" fileid="' + file.id + '"></div>');
                itemEl.html('<div class="fs-publish-upload-item-inner fn-clear"><div class="thumb"></div><div class="summary"></div></div><div class="fs-publish-upload-pbar"></div>');
                itemEl.appendTo(wEl);
            }
            return itemEl;
        },
        renderUploadItem: function(file, serverData, wSelector, type) {
            var wEl = $(wSelector), serverData = json.parse(serverData);
            var itemEl = this.getUploadItem(file, wEl), innerEl = $(".fs-publish-upload-item-inner", itemEl), thumbEl = $(".thumb", innerEl), summaryEl = $(".summary", innerEl);
            if (type == "img") {
                thumbEl.html('<div class="thumb-img"><img src="' + FS.BASE_PATH + "/" + serverData.value + '" alt="' + file.name + '" /></div>');
            } else {
                thumbEl.html('<div class="thumb-attach"><img src="' + FS.ASSETS_PATH + '/images/clear.gif" alt="' + file.name + '" class="icon-file icon-file-' + util.getFileType(file) + '" /></div>');
            }
            summaryEl.html('<p class="file-name">' + file.name + '</p><p class="file-remove-wrapper"><a href="#" class="file-remove-l">取消</a></p>');
        },
        renderUploadError: function(file, errorCode, wSelector) {
            var wEl = $(wSelector);
            var itemEl = this.getUploadItem(file, wEl), innerEl = $(".fs-publish-upload-item-inner", itemEl), thumbEl = $(".thumb", innerEl), summaryEl = $(".summary", innerEl);
            thumbEl.html('<img src="' + FS.ASSETS_PATH + '/images/error.png" alt="' + file.name + '" />');
            summaryEl.html('<p class="file-error">上传失败(' + errorCode + ')，请取消后重试</p><p class="file-remove-wrapper"><a href="#" class="file-remove-l">取消</a></p>');
        },
        getUploadStatus: function(upload) {
            var uploader = upload.uploader, files = [], file, i = 0, uploadFiles = upload.uploadFiles, uploadedSize = 0, totalSize = 0;
            while (file = uploader.getFile(i)) {
                _.find(uploadFiles, function(v) {
                    if (v.id == file.id) {
                        files.push(_.extend({
                            uploadType: upload.type
                        }, v, file));
                        //最后的防线，更新文件上传状态
                        return true;
                    }
                });
                i++;
            }
            //获得upload下的文件总大小和总上传量
            _.each(files, function(file) {
                var fileStatus = file.filestatus;
                totalSize += file.size;
                _.find(uploadFiles, function(v) {
                    if (v.id == file.id) {
                        uploadedSize += v.uploadedSize;
                        return true;
                    }
                });
            });
            return {
                files: files,
                uploadedSize: uploadedSize,
                totalSize: totalSize
            };
        },
        updateUploadInfo: function(upload, infoSelector) {
            var infoEl = $(infoSelector);
            var uploadStatus = this.getUploadStatus(upload), files = uploadStatus.files, uploadedSize = uploadStatus.uploadedSize, totalSize = uploadStatus.totalSize;
            infoEl.html("共添加了" + files.length + "个文件，总大小" + util.getFileSize(totalSize) + '&nbsp;&nbsp;<a href="#" class="file-remove-all-l" title="全部取消">全部取消</a>');
        },
        getAllUploadStatus: function() {
            var that = this, imgUpload = this.imgUpload, attachUpload = this.attachUpload, uploadedSize = 0, totalSize = 0, files = [];
            _.each([ imgUpload, attachUpload ], function(upload) {
                var uploadStatus = that.getUploadStatus(upload);
                uploadedSize += uploadStatus.uploadedSize;
                totalSize += uploadStatus.totalSize;
                files = files.concat(uploadStatus.files);
            });
            return {
                files: files,
                uploadedSize: uploadedSize,
                totalSize: totalSize
            };
        },
        getUploadValue: function() {
            var addUploadStatus = this.getAllUploadStatus();
            return addUploadStatus.files;
        },
        removeUploadFile: function(upload, fileId) {
            var uploadFiles = upload.uploadFiles;
            uploadFiles = _.filter(uploadFiles, function(v) {
                return v.id != fileId;
            });
            upload.uploadFiles = uploadFiles;
        },
        uploadValid: function(upload, file) {
            var passed = true;
            var uploadFiles = upload.uploadFiles;
            _.find(uploadFiles, function(v) {
                if (v.name == file.name) {
                    //同名验证
                    passed = false;
                    util.alert("有同名文件存在");
                    return true;
                }
            });
            return passed;
        },
        /**
         * [ description]
         * @param  {[type]} type img/attach
         * @return {[type]}      [description]
         */
        uploadInit: function(type) {
            var that = this;
            var elEl = this.element;
            var btnEl = $(".fs-publish-" + type + "upload-btn", elEl), panelEl = $(".fs-publish-" + type + "upload-panel", elEl), listEl, infoEl, iconName;
            //设置上传唯一id供FsUpload配置使用
            var uploadId = "fs-publish-upload-" + MediaMaker.uploadCount;
            btnEl.html('<span id="' + uploadId + '"></span>');
            panelEl.html('<div class="fs-publish-upload-list"></div><div class="fs-publish-upload-info color-333333"></div>');
            listEl = $(".fs-publish-upload-list", panelEl);
            infoEl = $(".fs-publish-upload-info", panelEl);
            listEl.addClass("fn-clear");
            //设置link alt
            if (type == "img") {
                btnEl.attr("title", "添加图片（多张）");
            } else {
                btnEl.attr("title", "添加附件（多个）");
            }
            btnEl.click(function(evt) {
                evt.preventDefault();
            });
            MediaMaker.uploadCount++;
            var upload = new FsUpload({
                upload_url: FS.API_PATH + "/uploadfile_html/fileUpload",
                file_types: type == "img" ? "*.jpg;*.gif;*.jpeg;*.png" : "*.*",
                file_types_description: type == "img" ? "图片格式" : "所有格式",
                button_placeholder_id: uploadId,
                button_image_url: FS.BASE_PATH + "/content/fs/modules/publish/images/icon-upload-" + type + ".png",
                button_width: 18,
                //button_disabled:true,
                button_height: type == "img" ? 14 : 15,
                fileDialogComplete: function(numFilesSelected, numFilesQueued) {
                    try {
                        if (numFilesQueued > 0) {
                            this.startUpload();
                        }
                    } catch (ex) {
                        this.debug(ex);
                    }
                },
                upload_start_handler: function(file) {
                    var itemEl, progressBarEl;
                    //上传验证
                    if (!that.uploadValid(upload, file)) {
                        return false;
                    }
                    itemEl = that.getUploadItem(file, listEl);
                    progressBarEl = $(".fs-publish-upload-pbar", itemEl);
                    //设置进度条位置
                    progressBarEl.css({
                        top: "50px",
                        left: "14px",
                        width: "100px"
                    });
                    new ProgressBar({
                        element: progressBarEl
                    });
                    //that.trigger('uploadprogress', file, 0, type, infoEl);
                    //触发上传开始事件
                    that.trigger("uploadstart", file, 0, type, infoEl);
                    //如果panel当前状态为隐藏，显示出来
                    if (panelEl.is(":hidden")) {
                        btnEl.trigger("showpanel");
                    }
                    that.allUploaded = false;
                    upload.uploaded = false;
                },
                upload_progress_handler: function(file, bytesLoaded) {
                    var percent = Math.ceil(bytesLoaded / file.size * 100) + "%";
                    var itemEl = that.getUploadItem(file, listEl), progressBarEl = $(".fs-publish-upload-pbar", itemEl);
                    var progressBar = progressBarEl.data("progressBar");
                    progressBar.setProgress(percent);
                    that.trigger("uploadprogress", file, bytesLoaded, type, infoEl);
                },
                upload_success_handler: function(file, serverData) {
                    var state = this.getStats();
                    var itemEl = that.getUploadItem(file, listEl), progressBarEl = $(".fs-publish-upload-pbar", itemEl);
                    //隐藏上传指示器
                    progressBarEl.hide();
                    that.renderUploadItem(file, serverData, listEl, type);
                    if (state.files_queued > 0) {
                        this.startUpload();
                    }
                    that.trigger("uploadsuccess", file, serverData, type);
                },
                upload_error_handler: function(file, errorCode, message) {
                    var state = this.getStats();
                    if (errorCode == SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED) {
                        this.cancelUpload(file.id, false);
                    } else {
                        that.renderUploadError(file, errorCode, listEl);
                    }
                    if (state.files_queued > 0) {
                        this.startUpload();
                    }
                },
                upload_complete_handler: function(file) {
                    var state = this.getStats();
                    if (state.files_queued == 0) {
                        that.trigger("typeuploadcomplete", upload);
                    }
                }
            });
            upload.type = type;
            upload.uploaded = true;
            //注册对象外引用
            this[type + "Upload"] = upload;
            //绑定删除事件
            panelEl.on("click", ".file-remove-l", function(e) {
                var meEl = $(this), fileItemEl = meEl.closest(".fs-publish-upload-item");
                var fileId = fileItemEl.attr("fileid");
                //清除swfupload容器
                upload.uploader.cancelUpload(fileId);
                //清空html结构
                fileItemEl.remove();
                //清空upload.uploadFiles列表
                that.removeUploadFile(upload, fileId);
                //更新上传信息
                that.updateUploadInfo(upload, infoEl);
                //如果列表为空，隐藏对应面板
                if ($(".fs-publish-upload-item", listEl).length == 0) {
                    $(".close-btn", panelEl.closest(".fs-publish-media-panel-wrapper")).click();
                }
                e.preventDefault();
            }).on("click", ".file-remove-all-l", function(evt) {
                    //全部取消
                    $(".file-remove-l", panelEl).click();
                    evt.preventDefault();
                });
        },
        imgUpload: function() {
            this.uploadInit("img");
        },
        imgUploadClear: function() {
            var elEl = this.element;
            var panelEl = $(".fs-publish-imgupload-panel", elEl), listEl = $(".fs-publish-upload-list", panelEl), uploadInfoEl = $(".fs-publish-upload-info", panelEl);
            listEl.empty();
            uploadInfoEl.empty();
            this["imgUpload"].uploadFiles = [];
        },
        attachUpload: function() {
            this.uploadInit("attach");
        },
        attachUploadClear: function() {
            var elEl = this.element;
            var panelEl = $(".fs-publish-attachupload-panel", elEl), listEl = $(".fs-publish-upload-list", panelEl), uploadInfoEl = $(".fs-publish-upload-info", panelEl);
            listEl.empty();
            uploadInfoEl.empty();
            this["attachUpload"].uploadFiles = [];
        },
        vote: function() {
            var opts = this.opts, actionOpts = opts.actionOpts, voteOpts = actionOpts["vote"] || {}, contactData = voteOpts.contactData;
            var elEl = this.element;
            var btnEl = $(".fs-publish-vote-btn", elEl), panelEl = $(".fs-publish-vote-panel", elEl), voteEl;
            var voteHtmlStr = publishTplEl.filter(".vote-wrapper").html();
            panelEl.html(voteHtmlStr);
            btnEl.html('<img src="' + FS.BLANK_IMG + '" alt="vote" />');
            voteEl = $(".vote", panelEl);
            //设置link title
            btnEl.attr("title", "添加投票");
            //placeholder兼容处理
            util.placeholder($("[placeholder]", voteEl));
            var customRangeEl = $(".custom-range", voteEl);
            //创建自定义类型
            var customRangeSb = new SelectBar({
                element: customRangeEl,
                data: [ {
                    title: "同事",
                    type: "p",
                    list: contactData
                } ],
                singleCked: false,
                //可以多选
                title: "选择投票后可见人",
                autoCompleteTitle: "请输入姓名或拼音"
            });
            customRangeEl.data("sb", customRangeSb);
            //自定义时间区间
            var deadlineTicksEl = $(".deadline-ticks", voteEl), dealineDtEl = $(".dealine-date-time", voteEl), dateWrapperEl = $(".date-wrapper", dealineDtEl), timeWrapperEl = $(".time-wrapper", dealineDtEl), dateSelect, timeSelect;
            dateSelect = new DateSelect({
                element: dateWrapperEl,
                placeholder: "请选择日期"
            });
            timeSelect = new TimeSelect({
                element: timeWrapperEl,
                placeholder: "请选择时间"
            });
            //如果time栏为空，选择date栏时默认选中第一个time option
            dateSelect.on("change", function() {
                if (timeSelect.getValue() == "") {
                    timeSelect.selector.select(0);
                }
            });
            dealineDtEl.data("ds", dateSelect);
            dealineDtEl.data("ts", timeSelect);
            //添加新选项
            var addOptEl = $(".add-vote-option-l", voteEl), optWEl = $(".option-wrapper", voteEl), optTpl = $(".option-tpl", voteEl), optCompiled = _.template(optTpl.html());
            addOptEl.click(function(evt) {
                var htmlStr;
                var index = $(".option-item", optWEl).length + 1;
                htmlStr = optCompiled({
                    index: index
                });
                $(htmlStr).appendTo(optWEl);
                evt.preventDefault();
            });
            //删除选项
            optWEl.on("click", ".remove-l", function() {
                var meEl = $(this), itemEl = meEl.closest(".option-item");
                itemEl.remove();
                //序号重排
                $(".option-index", optWEl).each(function(i) {
                    $(this).text(i + 1 + "、");
                });
                //触发option的change时间，重新渲染可选数量
                $(".vote-option", optWEl).change();
            });
            //选择自定义截止时间显示对应面板
            deadlineTicksEl.change(function() {
                var v = $(this).val();
                if (v == "0") {
                    //自定义时间类型
                    dealineDtEl.show();
                } else {
                    dealineDtEl.hide();
                }
            }).change();
            //默认选择一周
            //点击投票结果选择可见范围
            $(".result-view-type", voteEl).click(function() {
                var meEl = $(this), customRangeEl = $(".custom-range", voteEl);
                //如果是自定义范围显示select bar
                if (meEl.val() == "3") {
                    customRangeEl.show();
                } else {
                    customRangeEl.hide();
                }
            }).eq(0).click();
            //默认选中投票人可见
            //动态调整可选option数量
            optWEl.on("change", ".vote-option", function() {
                var optEl = $(".vote-option", optWEl), voteCountEl = $(".vote-count", voteEl), //单选多选select
                    defaultSelectValue = voteCountEl.val(), //默认选中的value
                    validCount = 0;
                //有效非空option的数量
                optEl.each(function() {
                    if (_.str.trim($(this).val()).length > 0) {
                        validCount++;
                    }
                });
                if (validCount < 1) {
                    validCount = 1;
                }
                //重新渲染可选数量
                var htmlStr = "";
                for (var i = 1; i <= validCount; i++) {
                    if (i == 1) {
                        htmlStr += '<option value="1">单选</option>';
                    } else {
                        htmlStr += '<option value="' + i + '">最多选' + i + "个项目</option>";
                    }
                }
                voteCountEl.html(htmlStr).val(defaultSelectValue);
            });
            //点击btn触发showpanel事件显示对应的面板
            btnEl.click(function(evt) {
                $(this).trigger("showpanel");
                evt.preventDefault();
            });
        },
        voteClear: function() {
            var value = this.voteGetValue();
            //reset里面的内容
            value.employeeIDs.element.removeAllItem();
            //title清空
            value.title.element.val("");
            //投票选项
            value.voteOptions.element.each(function() {
                var meEl = $(this), itemEl = meEl.closest(".option-item");
                if ($(".remove-l", itemEl).length > 0) {
                    itemEl.remove();
                } else {
                    meEl.val("");
                }
            }).change();
            //触发change
            //单选多选
            value.voteCount.element.val("1");
            //截止时间
            value.deadlineTicks.element.val("1").change();
            //匿名投票
            value.isAnoymouse.element.prop("checked", false);
        },
        voteIsValid: function() {
            var passed = true;
            var value = this.voteGetValue(), voteOptions = value.voteOptions, optValue = voteOptions.value;
            //标题验证
            if (value.title.value.length == 0) {
                util.alert("投票标题不能为空");
                passed = false;
                return passed;
            }
            if (value.title.value.length > 25) {
                //标题限制25个字符
                util.alert("投票标题不能超过25个字符");
                passed = false;
                return passed;
            }
            if (optValue.length < 2) {
                util.alert("至少两个投票选项");
                passed = false;
                return passed;
            }
            //截止时间非空判定
            if (value.deadlineTicks.value.length == 0) {
                util.alert("请设置自定义截止时间");
                passed = false;
                return passed;
            }
            //可视范围限制
            if (value.resultViewType.value == "3") {
                if (value.employeeIDs.value.length == 0) {
                    util.alert("请选择自定义范围");
                    passed = false;
                }
                return passed;
            }
            return passed;
        },
        voteGetValue: function() {
            var value = {};
            var elEl = this.element;
            var panelEl = $(".fs-publish-vote-panel", elEl), voteEl = $(".vote", panelEl);
            var titleEl = $(".vote-title", voteEl), //投票标题
                voteOptEl = $(".vote-option", voteEl), //投票选项
                voteCountEl = $(".vote-count", voteEl), //可选数量
                deadlineTicksEl = $(".deadline-ticks", voteEl), //截止时间
                dealineDtEl = $(".dealine-date-time", voteEl), //自定义截止时间
                isAnoymouseEl = $(".is-anoymouse", voteEl), //是否匿名
                viewTypeEl = $(".result-view-type", voteEl), //可视范围
                customRangeEl = $(".custom-range", voteEl), customRangeSb = customRangeEl.data("sb"), rangeData = customRangeSb.getSelectedData();
            var optValue = [], ds = dealineDtEl.data("ds"), ts = dealineDtEl.data("ts"), dsValue, //自定义截止日期
                tsValue, //自定义截止时间
                now = moment(), timeTypeValue;
            //截止时间类型
            value["timeType"] = {
                element: deadlineTicksEl,
                value: deadlineTicksEl.val()
            };
            value["title"] = {
                element: titleEl,
                value: _.str.trim(titleEl.val())
            };
            value["deadlineTicks"] = {
                element: dealineDtEl,
                value: deadlineTicksEl.val()
            };
            //根据不同的截止时间类型得出unix ticks
            timeTypeValue = parseInt(value["timeType"].value);
            if (timeTypeValue != 0) {
                if (timeTypeValue <= 3) {
                    value["deadlineTicks"].value = now.add("weeks", timeTypeValue).unix();
                } else {
                    //timeValue==4 weeks==1 month
                    value["deadlineTicks"].value = now.add("months", 1).unix();
                }
            } else {
                //自定义截止时间
                dsValue = ds.getValue(), tsValue = ts.getValue();
                if (dsValue.length > 0) {
                    value["deadlineTicks"].value = moment(dsValue + " " + tsValue, "YYYYMMDD HH:mm").unix();
                } else {
                    value["deadlineTicks"].value = "";
                }
            }
            value["isAnoymouse"] = {
                element: isAnoymouseEl,
                value: isAnoymouseEl.prop("checked")
            };
            value["resultViewType"] = {
                element: viewTypeEl,
                value: viewTypeEl.filter(":checked").val()
            };
            value["employeeIDs"] = {
                element: customRangeSb,
                value: rangeData["p"] || []
            };
            //投票选项
            voteOptEl.each(function(i) {
                var v = _.str.trim($(this).val());
                //只筛选非空值
                if (v.length > 0) {
                    optValue.push(v);
                }
            });
            value["voteOptions"] = {
                element: voteOptEl,
                value: optValue
            };
            //可选数量
            value["voteCount"] = {
                element: voteCountEl,
                value: voteCountEl.val()
            };
            return value;
        },
        at: function() {
            var elEl = this.element;
            var btnEl = $(".fs-publish-at-btn", elEl), panelEl = $(".fs-publish-at-panel", elEl);
            var opts = this.opts, actionOpts = opts.actionOpts, atOpts = actionOpts["at"] || {};
            var inputEl = $(atOpts.inputSelector);
            btnEl.html('<img src="' + FS.BLANK_IMG + '" alt="vote" />');
            //设置link title
            btnEl.attr("title", "添加提到");
            var atSelectPanel = new SelectPanel(_.extend({
                trigger: btnEl,
                singleCked: true,
                data: this.atGetDefaultSpData()
            }, atOpts.spOpts || {}));
            atSelectPanel.on("select", function(selectedData) {
                _.each(selectedData, function(val) {
                    util.appendInput(inputEl.get(0), "@" + val[0].name + " ");
                });
                atSelectPanel.unselect("all", "all");
                atSelectPanel.hide();
            });
            this.atSelectPanel = atSelectPanel;
        },
        atClear: function() {},
        /**
         * 获取默认的at功能中select panel的数据源
         */
        atGetDefaultSpData: function() {
            var spData, spData1 = [], //第一部分数据，常用联系人
                spData2 = util.getContactData()["p"], //第二部分数据，全部同事
                lastAtEmployees = util.getPersonalConfig("lastAtEmployees");
            _.each(lastAtEmployees, function(employeeData, i) {
                var userData = util.getContactDataById(employeeData.dataID, "p");
                spData1[i] = _.extend({}, userData);
            });
            spData = [ {
                title: "常用联系人",
                type: "p",
                list: spData1
            }, {
                title: "同事",
                type: "p",
                list: spData2
            } ];
            return spData;
        },
        /**
         * 更新at功能中的select panel的数据源
         */
        atUpdateSpData: function() {
            var opts = this.opts, actionOpts = opts.actionOpts, atOpts = actionOpts["at"] || {};
            var inputEl = $(atOpts.inputSelector);
            var atEmployeeData = util.getPersonalConfig("lastAtEmployees") || [];
            inputEl.each(function() {
                var atContents = util.getAtFromInput(this);
                //获取所有的at同事
                _.each(atContents, function(employeeName) {
                    var userData = util.getContactDataByName(employeeName, "p");
                    if (!_.find(atEmployeeData, function(employeeData) {
                        //不在常用联系人里的，push进去
                        return employeeData.dataID == userData.id;
                    })) {
                        atEmployeeData.push({
                            dataID: userData.id,
                            name: userData.name,
                            isCircle: false
                        });
                    }
                });
            });
            //保存到presonal config中
            util.setPersonalConfig("lastAtEmployees", atEmployeeData);
            //更新at selectpanel数据源并重绘
            this.atSelectPanel.updateData(this.atGetDefaultSpData());
        },
        /**
         * 判断传入action是否处于激活态
         * @param actionName
         * @returns {boolean}
         */
        isActive: function(actionName) {
            var elEl = this.element;
            var panelEl = $(".fs-publish-" + actionName + "-panel", elEl);
            if (panelEl.is(":visible")) {
                return true;
            } else {
                return false;
            }
        },
        /**
         * 禁用某个action
         * @param actionName
         */
        disableAction: function(actionName) {
            var actionCls = actionName.toLowerCase();
            var elEl = this.element, btnEl = $(".fs-publish-" + actionCls + "-btn", elEl);
            if (actionName == "imgUpload" || actionName == "attachUpload") {
                this[actionName].uploader.setButtonDisabled(true);
            }
            btnEl.addClass("fs-publish-" + actionCls + "-disabled");
        },
        /**
         * 启用某个action
         * @param actionName
         */
        enableAction: function(actionName) {
            var actionCls = actionName.toLowerCase();
            var elEl = this.element, btnEl = $(".fs-publish-" + actionCls + "-btn", elEl);
            if (actionName == "imgUpload" || actionName == "attachUpload") {
                this[actionName].uploader.setButtonDisabled(false);
            }
            btnEl.removeClass("fs-publish-" + actionCls + "-disabled");
        },
        /**
         * 重置所有面板
         */
        resetAll: function() {
            var that = this, elEl = this.element, opts = this.opts;
            _.each(opts.action, function(v) {
                that[v + "Clear"]();
            });
            //隐藏所有面板
            $(".fs-publish-media-panel-wrapper", elEl).hide();
        },
        /**
         * 多媒体提交接口
         * @param sendHandler
         * @param modalSelector
         */
        send: function(sendHandler, modalSelector) {
            var that = this;
            //初始化文件上传进度dialog
            var sendDialog = this.sendDialog;
            var pbar = this.sendPbar, sendInfoEl;
            var modalEl = modalSelector ? $(modalSelector) : $(document);
            var sendCb = function() {
                sendDialog.hide();
                pbar.setProgress(0);
                pbar.element.hide();
                //默认隐藏进度条，只有存在附件上传时才显示
                sendInfoEl.empty();
            };
            if (!sendDialog) {
                sendDialog = new Overlay({
                    height: "100px",
                    className: "fs-publish-allupload-dialog",
                    template: '<div><div class="fs-publish-allupload-pbar"></div><div class="fs-publish-send-info"></div></div>'
                }).render();
                pbar = new ProgressBar({
                    element: $(".fs-publish-allupload-pbar", sendDialog.element)
                });
                //默认隐藏进度条
                pbar.element.hide();
                this.sendDialog = sendDialog;
                this.sendPbar = pbar;
            }
            sendInfoEl = $(".fs-publish-send-info", sendDialog.element);
            //定位自适应尺寸
            sendDialog.set("width", modalEl.outerWidth());
            sendDialog.set("height", modalEl.outerHeight());
            sendDialog.set("align", {
                selfXY: [ 0, 0 ],
                baseElement: modalEl,
                baseXY: [ 0, 0 ]
            });
            //更新at功能中的常用联系人个人配置
            if (this.atSelectPanel) {
                this.atUpdateSpData();
            }
            if (this.allUploaded) {
                //文件已经上传成功
                sendInfoEl.html("正在提交请稍后...");
                sendHandler(sendCb);
            } else {
                //显示文件上传进度，上传成功后提交send接口
                //注册media上传文件uploadprogress事件
                this.one("uploadprogress", function() {
                    var uploadStatus = that.getAllUploadStatus(), files = uploadStatus.files, uploadedSize = uploadStatus.uploadedSize, totalSize = uploadStatus.totalSize;
                    var percent = Math.ceil(uploadedSize / totalSize * 100) + "%";
                    if (pbar.element.is(":hidden")) {
                        pbar.element.show();
                    }
                    pbar.setProgress(percent);
                    sendInfoEl.html("已上传" + util.getFileSize(uploadedSize) + "/" + util.getFileSize(totalSize));
                });
                this.one("alluploadcomplete", function() {
                    sendDialog.hide();
                    sendHandler(sendCb);
                    sendInfoEl.html("正在提交请稍后...");
                    //上传完毕隐藏进度条
                    pbar.element.hide();
                });
            }
            sendDialog.show();
        },
        destroy: function() {
            if (this.imgUpload) {
                this.imgUpload.destroy();
                this.imgUpload = null;
            }
            if (this.attachUpload) {
                this.attachUpload.destroy();
                this.attachUpload = null;
            }
            if (this.atSelectPanel) {
                this.atSelectPanel.destroy();
                this.atSelectPanel = null;
            }
            this.off();
            this.element.empty();
        }
    });
    MediaMaker.uploadCount = 0;
    Events.mixTo(MediaMaker);
    var ProgressBar = function(opts) {
        opts = _.extend({
            element: null
        }, opts || {});
        var elEl = $(opts.element);
        this.element = elEl;
        this.opts = opts;
        elEl.data("progressBar", this);
        this.init();
    };
    ProgressBar.prototype.init = function() {
        var elEl = this.element;
        elEl.html('<div class="fs-progress-indicator"></div><div class="fs-progress-text"></div>');
        elEl.addClass("fs-progressbar");
    };
    ProgressBar.prototype.setProgress = function(percent) {
        var elEl = this.element, indicatorEl = $(".fs-progress-indicator", elEl), textEl = $(".fs-progress-text", elEl);
        indicatorEl.css({
            width: percent
        });
        textEl.text(percent);
    };
    ProgressBar.prototype.reset = function() {
        this.setProgress("0%");
    };
    /**
     * 选人或可视范围面板
     */
    var SelectPanel = function(opts) {
        opts = _.extend({
            trigger: null,
            singleCked: false,
            data: [ {
                title: "标题 A",
                type: "a",
                list: [ {
                    name: "测试",
                    id: "test",
                    spell: "test"
                }, {
                    name: "测试a",
                    id: "test2",
                    spell: "aest"
                }, {
                    name: "测试b-1",
                    id: "test3",
                    spell: "best"
                }, {
                    name: "测试b-2",
                    id: "test4",
                    spell: "best"
                } ]
            }, {
                title: "标题 B",
                type: "b",
                list: [ {
                    name: "测试A",
                    id: "test1",
                    spell: "aest"
                } ]
            }, {
                title: "标题 B",
                type: "c",
                list: [ {
                    name: "测试b",
                    id: "test1",
                    spell: "best"
                } ]
            } ]
        }, opts || {});
        var panelTpl = '<div class="fs-contact-letter-nav fn-clear"></div><div class="fs-contact-list-wrapper"><ul class="fs-contact-list"></ul></div>';
        var navHtmlStr = "", panelHtmlStr = "";
        _.each(opts.data, function() {
            navHtmlStr += '<li class="ui-tab-item" data-role="trigger"></li>';
            panelHtmlStr += '<div data-role="panel" class="ui-tab-panel fn-clear">' + panelTpl + "</div>";
        });
        var triggerEl = $(opts.trigger);
        var dialog = new Dialog(_.extend({
            hasMask: false,
            width: 280,
            height: 415,
            className: "fs-contact-dialog",
            content: '<div class="fs-contact-content"><div class="fs-contact-tabs ui-tab"><ul class="ui-switchable-nav ui-tab-items" data-role="nav">' + navHtmlStr + '</ul><div class="ui-switchable-content">' + panelHtmlStr + "</div></div>" + '<div class="fs-contact-bbar fn-clear"><div class="fs-contact-summary">共有<span class="num">0</span>位同事</div><div class="fs-contact-action"><button class="fs-contact-close-btn">关闭</button></div></div>' + "</div>",
            align: {
                selfXY: [ "right", 0 ],
                // element 的定位点，默认为左上角
                baseElement: triggerEl,
                // 基准定位元素，默认为当前可视区域
                baseXY: [ triggerEl.width(), triggerEl.height() ]
            },
            zIndex: 2e3
        }, opts.dialogOpts || {})).render();
        var tab = new Tabs(_.extend({
            element: $(".fs-contact-tabs", dialog.element),
            triggers: $(".ui-tab-item", dialog.element),
            panels: $(".ui-tab-panel", dialog.element),
            activeIndex: 0,
            triggerType: "click",
            withTabEffect: false
        }, opts.tabOpts || {})).render();
        this.opts = opts;
        this.dialog = dialog;
        this.tab = tab;
        //保留每个实例的引用
        SelectPanel.ins.push(this);
        this.init();
    };
    _.extend(SelectPanel.prototype, {
        init: function() {
            var that = this;
            var opts = this.opts, data = opts.data;
            _.each(data, function(row, i) {
                that.updateTab(row, i);
            });
            this.bindEvents();
        },
        /**
         * 更新数据源，重绘组件
         * @param listData
         */
        updateData: function(listData) {
            var that = this;
            _.each(listData, function(row, i) {
                that.updateTab(row, i);
            });
        },
        updateTab: function(data, i) {
            var title = data.title, type = data.type, list = data.list;
            var dialog = this.dialog, tab = this.tab, tabNavEl = tab.get("triggers").eq(i), tabPanelEl = tab.get("panels").eq(i);
            tabNavEl.html('<a href="javascript:;">' + title + "</a>");
            tabPanelEl.attr("emptype", type);
            //tabNavEl.html(title);
            this.doTabPanel(tabPanelEl, list);
        },
        doTabPanel: function(panelSelector, list) {
            var panelEl = $(panelSelector), letterNavEl = $(".fs-contact-letter-nav", panelEl), listEl = $(".fs-contact-list", panelEl), letterNavEl;
            var i, htmlStr = "";
            var groupList = this.groupByLetter(list), groupKeys = _.sortBy(_.keys(groupList), function(v) {
                return v;
            });
            letterNavEl.html('<ul class="list-0"></ul><ul class="list-1"></ul>');
            for (i = 65; i <= 77; i++) {
                htmlStr += "<li>" + String.fromCharCode(i) + "</li>";
            }
            $(".list-0", letterNavEl).html(htmlStr);
            htmlStr = "";
            for (i = 78; i <= 90; i++) {
                htmlStr += "<li>" + String.fromCharCode(i) + "</li>";
            }
            $(".list-1", letterNavEl).html(htmlStr);
            //获得letter navs
            letterNavEl = $("li", letterNavEl);
            //构建contact list列表
            htmlStr = "";
            _.each(groupKeys, function(key) {
                var item = groupList[key];
                var len = item.length, htmlStr2 = "";
                htmlStr += '<li><div class="index-box fn-clear"><div class="index-keyword">' + key + '</div><div class="item-length">' + len + '项</div></div><ul class="fs-contact-view">';
                _.each(item, function(subItem) {
                    htmlStr2 += '<li class="fs-contact-item" itemid="' + subItem.id + '">' + subItem.name + "</li>";
                });
                htmlStr += htmlStr2 + "</ul></li>";
                //设置导航高亮
                letterNavEl.each(function() {
                    var meEl = $(this), letter = meEl.text();
                    if (letter == key) {
                        meEl.addClass("fs-contact-letter-selected");
                    }
                });
            });
            listEl.html(htmlStr);
            this.updateSummary();
        },
        show: function(emitEvent) {
            //修正对dialog定位
            var triggerEl = $(this.opts.trigger);
            this.dialog.set("align", {
                selfXY: [ "right", 0 ],
                // element 的定位点，默认为左上角
                baseElement: triggerEl,
                // 基准定位元素，默认为当前可视区域
                baseXY: [ triggerEl.width(), triggerEl.height() ]
            });
            this.dialog.show();
            if (emitEvent !== false) {
                //默认触发show事件，除非emitEvent===false
                this.trigger("show");
            }
        },
        hide: function(emitEvent) {
            //默认触发hide事件，除非emitEvent===false
            this.dialog.hide();
            if (emitEvent !== false) {
                this.trigger("hide");
            }
        },
        groupByLetter: function(list) {
            var groupList = [];
            groupList = _.groupBy(list, function(v) {
                return v.spell.slice(0, 1).toUpperCase();
            });
            return groupList;
        },
        updateSummary: function() {
            var tab = this.tab, dialog = this.dialog, dialogEl = dialog.element, contactItemEl = $(".fs-contact-item", tab.get("panels").eq(tab.get("activeIndex"))), selectedItemEl = contactItemEl.filter(".fs-contact-item-selected"), summaryEl = $(".fs-contact-summary", dialogEl);
            if (selectedItemEl.length > 0) {
                summaryEl.html("已选中" + selectedItemEl.length + "/" + contactItemEl.length);
            } else {
                summaryEl.html("共有" + contactItemEl.length + "位同事");
            }
        },
        /**
         * [ description]
         * @param  {[type]} ids   [description]
         * @param  {[type]} reset 是否清空原来选中项
         * @return {[type]}       [description]
         */
        select: function(ids, type, reset) {
            var opts = this.opts;
            var tab = this.tab, tabEl = tab.element, tabPanelEl = tab.get("panels"), itemsEl;
            var eventData = {};
            //select事件数据
            ids = [].concat(ids);
            if (type == "all") {
                itemsEl = $(".fs-contact-item", tabEl);
                tabPanelEl.each(function() {
                    var meEl = $(this), empType = meEl.attr("emptype");
                    eventData[empType] = [];
                });
            } else {
                itemsEl = $(".fs-contact-item", $('[emptype="' + type + '"]', tabEl));
                eventData[tabPanelEl.filter('[emptype="' + type + '"]').attr("emptype")] = [];
            }
            if (ids[0] == "all") {
                itemsEl.addClass("fs-contact-item-selected");
                //设置select事件数据
                itemsEl.each(function() {
                    var meEl = $(this), panelEl = meEl.closest(".ui-tab-panel"), itemId = meEl.attr("itemid"), empType = panelEl.attr("emptype");
                    eventData[empType].push({
                        name: meEl.text(),
                        id: itemId
                    });
                });
            } else {
                if (!!reset) {
                    itemsEl.removeClass("fs-contact-item-selected");
                }
                _.each(ids, function(id) {
                    var itemEl = itemsEl.filter('[itemid="' + id + '"]');
                    itemEl.addClass("fs-contact-item-selected");
                    //设置select事件数据
                    itemEl.each(function() {
                        var meEl = $(this), panelEl = meEl.closest(".ui-tab-panel"), itemId = meEl.attr("itemid"), empType = panelEl.attr("emptype");
                        eventData[empType].push({
                            name: meEl.text(),
                            id: itemId
                        });
                    });
                });
            }
            if (opts.singleCked) {
                //如果是单选的话，选中后隐藏
                this.hide();
            }
            this.trigger("select", eventData);
        },
        unselect: function(ids, type) {
            var tab = this.tab, tabEl = tab.element, tabPanelEl = tab.get("panels"), itemsEl;
            var eventData = {};
            //unselect事件数据
            ids = [].concat(ids);
            if (type == "all") {
                itemsEl = $(".fs-contact-item", tabEl);
                tabPanelEl.each(function() {
                    var meEl = $(this), empType = meEl.attr("emptype");
                    eventData[empType] = [];
                });
            } else {
                itemsEl = $(".fs-contact-item", $('[emptype="' + type + '"]', tabEl));
                eventData[tabPanelEl.filter('[emptype="' + type + '"]').attr("emptype")] = [];
            }
            if (ids[0] == "all") {
                itemsEl.removeClass("fs-contact-item-selected");
                //设置unselect事件数据
                itemsEl.each(function() {
                    var meEl = $(this), panelEl = meEl.closest(".ui-tab-panel"), itemId = meEl.attr("itemid"), empType = panelEl.attr("emptype");
                    eventData[empType].push({
                        name: meEl.text(),
                        id: itemId
                    });
                });
            } else {
                _.each(ids, function(id) {
                    var itemEl = itemsEl.filter('[itemid="' + id + '"]');
                    itemEl.removeClass("fs-contact-item-selected");
                    //设置unselect事件数据
                    itemEl.each(function() {
                        var meEl = $(this), panelEl = meEl.closest(".ui-tab-panel"), itemId = meEl.attr("itemid"), empType = panelEl.attr("emptype");
                        eventData[empType].push({
                            name: meEl.text(),
                            id: itemId
                        });
                    });
                });
            }
            this.trigger("unselect", eventData);
        },
        bindEvents: function() {
            var that = this;
            var tab = this.tab, tabEl = tab.element, dialog = this.dialog, dialogEl = dialog.element, opts = this.opts;
            tabEl.on("click", ".fs-contact-item", function(e) {
                var meEl = $(this), panelEl = meEl.closest(".ui-tab-panel"), itemId = meEl.attr("itemid"), empType = panelEl.attr("emptype");
                if (meEl.hasClass("fs-contact-item-selected")) {
                    //meEl.removeClass('fs-contact-item-selected');
                    that.unselect(itemId, empType);
                } else {
                    if (opts.singleCked) {
                        that.unselect("all", "all");
                    }
                    that.select(itemId, empType);
                }
                that.updateSummary();
            });
            tab.on("switched", function() {
                that.updateSummary();
            });
            dialogEl.click(function(e) {
                e.stopPropagation();
            });
            dialogEl.on("click", ".fs-contact-close-btn", function() {
                that.hide();
            });
            //点击字母导航到对应条目开始
            tabEl.on("click", ".fs-contact-letter-selected", function() {
                var meEl = $(this), letter = meEl.text(), listWEl = meEl.closest(".ui-tab-panel").find(".fs-contact-list-wrapper"), contactListEl = $(".fs-contact-list", listWEl), letterItem;
                $("li", contactListEl).each(function() {
                    var itemEl = $(this), indexKeywordEl = $(".index-keyword", itemEl);
                    if (indexKeywordEl.text() == letter) {
                        letterItem = itemEl;
                        return false;
                    }
                });
                if (letterItem) {
                    listWEl.scrollTop(letterItem.position().top);
                }
            });
            //点击trigger显示面板
            $(opts.trigger).click(function(e) {
                //隐藏其它instance
                _.each(_.filter(SelectPanel.ins, function(item) {
                    return item !== that;
                }), function(item) {
                    item.hide();
                });
                that.show();
                e.stopPropagation();
                e.preventDefault();
            });
            /*this.regHide = util.regDocEvent('click', function () {
             that.hide();
             });*/
            util.regGlobalClick(this.dialog.element, function() {
                that.hide();
            });
        },
        destroy: function() {
            var that = this;
            var opts = this.opts;
            this.dialog.destroy();
            this.tab.destroy();
            this.off();
            //注销事件
            $(opts.trigger).unbind("click");
            //util.unRegDocEvent('click', this.regHide);
            //清空引用
            SelectPanel.ins = _.filter(SelectPanel.ins, function(item) {
                return item !== that;
            });
        }
    });
    SelectPanel.ins = [];
    Events.mixTo(SelectPanel);
    /**
     * 选人或可视范围bar
     */
    var SelectBar = function(opts) {
        opts = _.extend({
            element: null,
            data: null,
            title: "",
            autoCompleteTitle: "",
            acTpl: "",
            singleCked: false,
            defaultSelectedData: []
        }, opts || {});
        var elEl = $(opts.element);
        var that = this;
        var acTpl = "", acTplEl = publishTplEl.filter(".publish-ac"), acDataBak;
        //自动完成的筛选数据
        if (opts.acTpl.length == 0) {
            acTplEl = publishTplEl.filter(".publish-ac");
            $(".fs-publish-ac-title", acTplEl).html(opts.autoCompleteTitle);
            acTpl = acTplEl.html();
        } else {
            acTpl = opts.acTpl;
        }
        $(".fs-publish-ac-title", acTplEl).html(opts.autoCompleteTitle);
        this.opts = opts;
        this.element = elEl;
        //设置自动完成的筛选数据
        acDataBak = this.getAcData();
        if (elEl.length > 0) {
            elEl.each(function() {
                var barEl = $(this), selectPanel, ac, acFilter, acFilterFunc;
                //构建html结构
                barEl.html('<div class="fs-contact-bar fn-clear"><div class="fs-contact-bar-content fn-clear"><ul class="fs-contact-bar-list"></ul><div class="input-wrapper"><span class="input-tip"><i class="prefix">+</i>' + opts.title + '</span><input class="input-field" type="text" /></div></div><em class="show-select-panel-h">&nbsp;</em></div>');
                //自动完成输入
                ac = new AutoComplete({
                    trigger: $(".input-field", barEl),
                    template: acTpl,
                    delay: 0,
                    //默认延迟100ms
                    submitOnEnter: false,
                    //回车不会提交表单
                    dataSource: acDataBak.slice(0),
                    zIndex: 2e3,
                    initDataSource: opts.acInitData,
                    className: "fs-contact-bar-ac"
                }).render();
                //重设过滤器
                acFilter = ac.get("filter");
                acFilterFunc = acFilter.func;
                acFilter.func = function(data, query, options) {
                    var selectedData = that.getSelectedData(barEl);
                    var filterData = [];
                    var filterData1 = acFilterFunc.apply(this, [ data, query, {
                        key: "name"
                    } ]);
                    var filterData2 = acFilterFunc.apply(this, [ data, query.toLowerCase(), {
                        key: "spell"
                    } ]);
                    //先插入filterData2的数据
                    _.each(filterData2, function(itemData) {
                        if (!_.find(filterData1, function(itemData2) {
                            return itemData2.id == itemData.id;
                        })) {
                            filterData.push(itemData);
                        }
                    });
                    filterData = filterData.concat(filterData1);
                    //过滤掉已选中的data
                    _.each(selectedData, function(cateData, empType) {
                        _.each(cateData, function(selectedDataId) {
                            filterData = _.reject(filterData, function(v) {
                                if (v.type == empType && v.id == selectedDataId) {
                                    return true;
                                }
                            });
                        });
                    });
                    return filterData;
                };
                ac.set("filter", acFilter);
                //监听itemSelect事件
                ac.on("itemSelect", function(data) {
                    if (opts.singleCked) {
                        that.removeAllItem(barEl);
                    }
                    that.addItem(data, barEl);
                    //隐藏输入框
                    that.switchInputState(barEl, "hide");
                });
                selectPanel = new SelectPanel({
                    trigger: $(".show-select-panel-h", barEl),
                    data: opts.data,
                    singleCked: opts.singleCked
                });
                selectPanel.on("show", function() {
                    var selectedData = that.getSelectedData(barEl);
                    _.each(selectedData, function(v, key) {
                        selectPanel.select(v, key, true);
                    });
                    //隐藏单选的话调用select会隐藏selectPanel,所有要手动显示出selectPanel并且不触发show事件
                    if (opts.singleCked) {
                        selectPanel.show(false);
                    }
                });
                selectPanel.on("select", function(eventData) {
                    _.each(eventData, function(v, key) {
                        _.each(v, function(itemData) {
                            that.addItem({
                                type: key,
                                id: itemData.id,
                                name: itemData.name
                            }, barEl);
                        });
                    });
                });
                selectPanel.on("unselect", function(eventData) {
                    _.each(eventData, function(v, key) {
                        _.each(v, function(itemData) {
                            that.removeItem({
                                type: key,
                                id: itemData.id,
                                name: itemData.name
                            }, barEl);
                        });
                    });
                });
                //注册组件事件
                barEl.on("click", ".fs-contact-bar-content", function(e) {
                    that.switchInputState(barEl, "show");
                    e.stopPropagation();
                }).on("click", ".fs-contact-bar-list", function(evt) {
                        evt.stopPropagation();
                    });
                //可通过删除键删除已选中的item
                $(".input-field", barEl).keydown(function(e) {
                    var meEl = $(this), listEl = $(".fs-contact-bar-list", barEl), lastItemEl = $(".fs-contact-bar-item", listEl).slice(-1), v = _.str.trim(meEl.val());
                    if (v.length == 0 && lastItemEl.length > 0 && e.keyCode == 8) {
                        //backspace.keyCode==8
                        that.removeItem({
                            id: lastItemEl.attr("itemid"),
                            type: lastItemEl.attr("emptype")
                        }, barEl);
                    }
                });
                /*that.docClick = util.regDocEvent('click', function () {
                 that.switchInputState(barEl, 'hide');
                 });*/
                util.regGlobalClick(barEl, function() {
                    that.switchInputState(barEl, "hide");
                });
                barEl.on("click", ".fs-contact-bar-list .remove-h", function() {
                    var meEl = $(this), itemEl = meEl.closest(".fs-contact-bar-item"), itemId = itemEl.attr("itemid"), empType = itemEl.attr("emptype");
                    that.removeItem({
                        id: itemId,
                        type: empType
                    }, barEl);
                });
                //设置默认选中值
                if (opts.defaultSelectedData.length > 0) {
                    _.each(opts.defaultSelectedData, function(val) {
                        var itemData = that.getItemData(val.id, val.type);
                        //加入
                        that.addItem(itemData, barEl);
                    });
                }
                barEl.data("ins", {
                    ac: ac,
                    selectPanel: selectPanel
                });
            });
            //end of each
            //监听add和remove事件，更新ac的初始化面板
            this.on("add", function(itemData, elSelector) {
                if (opts.acInitData) {
                    that.updateAcState(elSelector, opts.acInitData);
                }
            });
            this.on("remove", function(itemData, elSelector) {
                if (opts.acInitData) {
                    that.updateAcState(elSelector, opts.acInitData);
                }
            });
        }
    };
    Events.mixTo(SelectBar);
    /**
     * 格式化自动完成数据
     * @return {[type]} [description]
     */
    SelectBar.prototype.getAcData = function() {
        var opts = this.opts, data = opts.data, acData = [], type;
        _.each(data, function(item) {
            type = item.type;
            _.each(item.list, function(subItem) {
                acData.push({
                    name: subItem.name,
                    id: subItem.id,
                    spell: subItem.spell.toLowerCase(),
                    type: type
                });
            });
        });
        return acData;
    };
    /**
     * 设置自定完成的初始init数据
     * @param acInitData
     * @param elSelector
     */
    SelectBar.prototype.setAcInitData = function(acInitData, elSelector) {
        var elEl = this.getEl(elSelector), ac = elEl.data("ins").ac;
        ac.set("initDataSource", acInitData);
    };
    SelectBar.prototype.addItem = function(itemData, elSelector) {
        var elEl = this.getEl(elSelector), listEl = $(".fs-contact-bar-list", elEl);
        var htmlStr, itemEl = $('[itemid="' + itemData.id + '"]', listEl).filter('[emptype="' + itemData.type + '"]'), cls = "";
        if (itemEl.length == 0) {
            if (itemData.type == "g") {
                cls = " fs-cbi-dept";
            }
            if (parseInt(itemData.id) == 999999) {
                cls = " fs-cbi-allcomp";
            }
            htmlStr = '<li class="fs-contact-bar-item' + cls + '" itemid="' + itemData.id + '" emptype="' + itemData.type + '"><span class="item-name">' + itemData.name + '</span><span class="remove-h">×</span></li>';
            $(htmlStr).appendTo(listEl);
            this.trigger("add", itemData, elSelector);
        }
    };
    SelectBar.prototype.removeItem = function(itemData, elSelector) {
        var elEl = this.getEl(elSelector), listEl = $(".fs-contact-bar-list", elEl);
        var itemEl = $('[itemid="' + itemData.id + '"]', listEl).filter('[emptype="' + itemData.type + '"]');
        itemEl.remove();
        this.trigger("remove", itemData, elSelector);
    };
    SelectBar.prototype.removeAllItem = function(elSelector) {
        var that = this;
        var elEl = this.getEl(elSelector), listEl = $(".fs-contact-bar-list", elEl);
        var itemEl = $(".fs-contact-bar-item", listEl);
        itemEl.each(function() {
            var meEl = $(this);
            that.removeItem({
                id: meEl.attr("itemid"),
                type: meEl.attr("emptype")
            }, elEl);
        });
    };
    SelectBar.prototype.switchInputState = function(elSelector, state) {
        var elEl = this.getEl(elSelector), inputWEl = $(".input-wrapper", elEl), tipEl = $(".input-tip", inputWEl), inputEl = $(".input-field", inputWEl);
        var ins = elEl.data("ins");
        state = state || "show";
        if (state == "show") {
            tipEl.hide();
            inputEl.show().get(0).focus();
            this.trigger("inputshow");
        } else if (state == "hide") {
            tipEl.show();
            inputEl.val("").hide();
            //隐藏自动完成
            ins.ac.hide();
            this.trigger("inputhide");
        }
    };
    SelectBar.prototype.getSelectedData = function(elSelector) {
        var itemEl;
        var data = {};
        var elEl = this.getEl(elSelector);
        itemEl = $(".fs-contact-bar-item", elEl);
        if (itemEl.length > 0) {
            itemEl.each(function() {
                var meEl = $(this), empType = meEl.attr("emptype"), itemId = meEl.attr("itemid");
                if (!data[empType]) {
                    data[empType] = [];
                }
                data[empType].push(itemId);
            });
        }
        return data;
    };
    /**
     * 根据itemId和empType获取item详细信息
     * @param itemId
     * @param empType
     * @returns {*}
     */
    SelectBar.prototype.getItemData = function(itemId, empType) {
        var acData = this.getAcData();
        return _.find(acData, function(itemData) {
            if (itemData.id == itemId && itemData.type == empType) {
                return true;
            }
        });
    };
    SelectBar.prototype.updateAcState = function(elSelector, acInitData) {
        var elEl = this.getEl(elSelector), ac = elEl.data("ins").ac, selectData = this.getSelectedData(elEl), newAcInitData = [];
        _.each(acInitData, function(itemInitData, i) {
            newAcInitData[i] = {
                parseData: itemInitData.parseData,
                createHtml: itemInitData.createHtml,
                eqFields: itemInitData.eqFields
            };
            newAcInitData[i].store = util.deepClone(itemInitData.store);
        });
        //下面这一团是为了从ac的初始化数据中删除已选中的item data
        _.each(selectData, function(typeData, type) {
            _.each(typeData, function(itemId) {
                _.each(newAcInitData, function(itemInitData) {
                    var parseData = itemInitData.parseData, store = itemInitData.store;
                    itemInitData.store = _.filter(store, function(storeItemData) {
                        var data = parseData(storeItemData)[0];
                        if (storeItemData.type == "mix") {
                            //对于type==mix的item直接放行
                            return true;
                        } else {
                            if (data.id == itemId && data.type == type) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    });
                });
            });
        });
        //更新ac的初始面板
        ac.set("initDataSource", newAcInitData);
    };
    SelectBar.prototype.getEl = function(elSelector) {
        if (elSelector) {
            return $(elSelector);
        } else {
            return this.element.eq(0);
        }
    };
    SelectBar.prototype.destroy = function() {
        this.element.each(function() {
            var meEl = $(this), ins = meEl.data("ins");
            ins.ac.destroy();
            ins.selectPanel.destroy();
        });
        this.off();
        //util.unRegDocEvent('click', this.docClick);
        this.element.removeData();
        this.element.empty();
        this.element = null;
    };
    var InnerCalendar = Calendar.extend({
        attrs: {
            showTodayBtn: false,
            align: {
                getter: function() {
                    var trigger = this.get("trigger");
                    if (trigger) {
                        return {
                            selfXY: [ 0, 0 ],
                            baseElement: trigger,
                            baseXY: [ 13, 13 ]
                        };
                    }
                    return {
                        selfXY: [ 0, 0 ],
                        baseXY: [ 0, 0 ]
                    };
                }
            }
        }
    });
    var DateSelect = function(opts) {
        opts = _.extend({
            element: null,
            placeholder: "请选择日期",
            formatStr: "YYYY-MM-DD"
        }, opts || {});
        this.element = $(opts.element);
        this.opts = opts;
        this.init();
    };
    DateSelect.prototype.init = function() {
        var that = this;
        var elEl = this.element, opts = this.opts, inputEl;
        var dateModel = [], tempDate, tempDateText;
        var formatStr = opts.formatStr;
        elEl.html('<input type="text" class="fs-publish-dateselect-input" readonly="readonly" placeholder="' + opts.placeholder + '" />');
        inputEl = $(".fs-publish-dateselect-input", elEl);
        placeholder(inputEl);
        //设置date model
        tempDate = moment();
        //今天
        tempDateText = tempDate.format(formatStr);
        dateModel[0] = {
            value: tempDateText,
            text: "今天"
        };
        tempDate = moment().add("days", 1);
        //明天
        tempDateText = tempDate.format(formatStr);
        dateModel[1] = {
            value: tempDateText,
            text: "明天"
        };
        tempDate = moment().startOf("week").add("days", 5);
        //本周五
        tempDateText = tempDate.format(formatStr);
        dateModel[2] = {
            value: tempDateText,
            text: "本周五"
        };
        tempDate = moment().startOf("week").add("days", 8);
        //下周一
        tempDateText = tempDate.format(formatStr);
        dateModel[3] = {
            value: tempDateText,
            text: "下周一"
        };
        var selector = new Select({
            trigger: inputEl,
            className: "fs-publish-dateselect",
            template: '<div class="{{classPrefix}}">' + '<div class="fs-publish-dateselect-title">请选择日期</div>' + '<div class="fs-publish-dateselect-calendar"></div>' + '<ul class="{{classPrefix}}-content" data-role="content">' + "{{#each select}}" + '<li data-role="item" class="{{../classPrefix}}-item" data-value="{{value}}" data-defaultSelected="{{defaultSelected}}" data-selected="{{selected}}"><a href="javascript:;" title="{{{text}}}">{{{text}}}</a></li>' + "{{/each}}" + "</ul>" + "</div>",
            model: dateModel,
            zIndex: 2e3,
            autoWidth: false
        }).render();
        var selectorEl = selector.element, calendarPlaceEl = $(".fs-publish-dateselect-calendar", selectorEl);
        var calendar = new InnerCalendar({
            trigger: calendarPlaceEl,
            zIndex: 2e3
        });
        calendar.on("selectDate", function(date) {
            var val = date.format(formatStr);
            inputEl.val(val);
            that.trigger("change", val);
        });
        selector.on("change", function(targetEl) {
            var val = targetEl.data("value");
            inputEl.val(val);
            that.trigger("change", val);
        });
        selector.after("show", function() {
            calendar.show();
        });
        selector.after("hide", function() {
            calendar.hide();
        });
        this.calendar = calendar;
        this.selector = selector;
    };
    DateSelect.prototype.getValue = function(isDate) {
        var opts = this.opts, formatStr = opts.formatStr;
        var elEl = this.element, inputEl = $(".fs-publish-dateselect-input", elEl), dateText = _.str.trim(inputEl.val()), dateValue = moment(dateText, formatStr);
        if (isDate) {
            return dateValue;
        } else {
            return _.str.trim(dateValue ? dateValue.format("YYYY-MM-DD") : "");
        }
    };
    DateSelect.prototype.setValue = function(momentParam) {
        var momentDate = moment(momentParam);
        var calendar = this.calendar;
        //设置calendar日期
        calendar.setFocus(momentDate);
        calendar.trigger("selectDate", momentDate);
    };
    DateSelect.prototype.clear = function() {
        var elEl = this.element, inputEl = $(".fs-publish-dateselect-input", elEl);
        this.selector.select(-1);
        //select清空
        return inputEl.val("");
    };
    Events.mixTo(DateSelect);
    var TimeSelect = function(opts) {
        opts = _.extend({
            element: null,
            placeholder: "请选择时间"
        }, opts || {});
        this.element = $(opts.element);
        this.opts = opts;
        this.init();
    };
    TimeSelect.prototype.init = function() {
        var that = this;
        var elEl = this.element, opts = this.opts, inputEl;
        var timeModel = [], i = 0, beginTime = moment("20130423080000", "YYYYMMDDhhmmss"), //2013-04-23 08:00:00
            tempTime = beginTime;
        elEl.html('<input type="text" class="fs-publish-timeselect-input" readonly="readonly" placeholder="' + opts.placeholder + '" />');
        inputEl = $(".fs-publish-timeselect-input", elEl);
        placeholder(inputEl);
        //设置time model
        for (i = 0; i < 48; i++) {
            timeModel.push({
                value: tempTime.format("HH:mm"),
                text: tempTime.format("HH:mm")
            });
            tempTime = beginTime.add("minutes", 30);
        }
        this.selector = new Select({
            trigger: inputEl,
            model: timeModel,
            zIndex: 2e3,
            autoWidth: false,
            className: "fs-publish-timeselect",
            template: '<div class="{{classPrefix}}">' + '<div class="fs-publish-timeselect-title">请选择时间</div>' + '<ul class="{{classPrefix}}-content" data-role="content">' + "{{#each select}}" + '<li data-role="item" class="{{../classPrefix}}-item" data-value="{{value}}" data-defaultSelected="{{defaultSelected}}" data-selected="{{selected}}"><a href="javascript:;" title="{{{text}}}">{{{text}}}</a></li>' + "{{/each}}" + "</ul>" + "</div>"
        }).render().on("change", function(targetEl) {
                var val = targetEl.data("value");
                inputEl.val(val);
                that.trigger("change", val);
            });
    };
    TimeSelect.prototype.getValue = function() {
        var elEl = this.element, inputEl = $(".fs-publish-timeselect-input", elEl);
        return _.str.trim(inputEl.val());
    };
    TimeSelect.prototype.setValue = function(mix) {
        var selector = this.selector;
        selector.select(mix);
    };
    TimeSelect.prototype.clear = function() {
        var elEl = this.element, inputEl = $(".fs-publish-timeselect-input", elEl);
        this.selector.select(-1);
        //select清空
        return inputEl.val("");
    };
    Events.mixTo(TimeSelect);
    /**
     * 输入框自适应高度
     */
    var InputAutoHeight = function() {};
    _.extend(exports, {
        progressBar: ProgressBar,
        atInput: AtInput,
        selectPanel: SelectPanel,
        selectBar: SelectBar,
        mediaMaker: MediaMaker,
        inputAutoHeight: InputAutoHeight,
        dateSelect: DateSelect,
        timeSelect: TimeSelect
    });
    exports.atInput = AtInput;
});
