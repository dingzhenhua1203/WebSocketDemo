Vue.prototype.$utils = {
    //获取地址参数
    getUrlKey(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
    },
    localStorage: {
        set(key, value) {
            localStorage.setItem(key, value); //存入缓存
        },
        get(key) {
            return localStorage.getItem(key);
        }
    },
    uploadPicture(files) {//上传图片
        //return new Promise(function (resolve, reject) {
        //    var fd = new FormData();
        //    for (var i = 0; i < files.length; i++) fd.append(i, files[i]);
        //    axios.post(window.BaseURL + "/OperateFile/UploadImgFileToCommonServer", fd)
        //        .then(response => {
        //            resolve(response);
        //        })
        //        .catch(response => reject(response));
        //});
    },
    requireComponentJs(js) {//加载依赖的js
        var path = window.BaseURL;
        document.write("<script src='" + path + "/js/component/" + js + "?v=" + new Date() + "'></script>");
    },
    requireComponentCss(css) {
        var path = window.BaseURL;
        document.write("<link href='" + path + "/css/" + css + "?v=" + new Date() + "' rel='stylesheet'>");
    },

    requireTemplate(path) {//加载html模板
        var path = window.BaseURL;
        return axios.get(path + path + "?v=" + new Date());
    },
    loading: {//动态效果
        show(msg, target) {//展示动态效果
            this.loadingProgress = this.$loading({
                lock: true,
                text: msg || '数据传输中，请耐心等待。。。',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.8)',
                target: target || document.body
            });
        },
        hide() {//隐藏动态效果
            if (this.loadingProgress) this.loadingProgress.close();
        }
    },
    formatData: {//格式化 
        dateFormater: function (data, fmt) { //日期格式化 
            if (!data.getFullYear) {
                try {
                    data = new Date(data);
                }
                catch (e) {
                    alert("日期非法，不能格式化失败，详情：" + e);
                    return;
                }
            }

            var o = {
                "M+": data.getMonth() + 1, //月份
                "d+": data.getDate(), //日
                "h+": data.getHours(), //小时
                "m+": data.getMinutes(), //分
                "s+": data.getSeconds(), //秒
                "q+": Math.floor((data.getMonth() + 3) / 3), //季度
                "S": data.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        addDate: function (date, days) {
            var d = new Date(date);
            d.setDate(d.getDate() + days);
            var m = d.getMonth() + 1;
            return d.getFullYear() + '-' + m + '-' + d.getDate();
        },
    },
    formatDate: {//数据格式化
        trim: function (str) {
            str = str || "";
            str = str.replace(/<\/?[^>]*>/gim, "");//去掉所有的html标记
            str = str.replace(/(^\s+)|(\s+$)/g, "");//去掉前后空格
            return str.replace(/\s/g, "");//去除文章中间空格
        }
    },
    //正则验证
    regularCheck(formModel, formRules, vue) {
        var errorCallBack = function (msg) {
            return { IsSuccess: false, Msg: msg };
        }
        var successCallBack = function (msg) {
            return { IsSuccess: true, Msg: msg };
        }
        return new Promise(function (resolve, reject) {
            try {
                if (!formModel) {
                    reject(errorCallBack("要验证的表单实体必须传入"));
                    return;
                }
                if (!formRules) {
                    reject(errorCallBack("要验证的表单规则必须传入"));
                    return;
                }
                //获取所有的正则验证
                var allRules = zby_resouce_regulars;
                //获取当前表单要验证的表单
                var currentFormRules = formRules;
                //循环表单验证规则
                for (var pro in currentFormRules) {
                    //获取当前要验证的值
                    var value = formModel[pro];
                    if (value == null || value == undefined) {
                        reject(errorCallBack("要验证的表单实体,找不到字段:" + pro));
                    }
                    //获取表单里的每个验证规则配置
                    var regulars = currentFormRules[pro].regulars;

                    if (!regulars || !regulars.length) {
                        reject(errorCallBack("表单字段:" + pro + "未配置对应的正则验证配置"));
                        return false;
                    }
                    //循环验证规则配置
                    regulars.forEach((regularConfig, index) => {
                        var regularName = regularConfig.regular;  //拿到当前要验证的规则
                        var regularCheckFn = regularConfig.checkFn;//拿到自定义的验证函数  
                        if (regularName || (regularCheckFn && typeof (regularCheckFn) == 'function')) {
                            if (regularName) {//存在规则 
                                var regularFn = allRules[regularName];
                                if (typeof (regularFn) != 'function') {
                                    reject(errorCallBack(regularName + "不是一个可执行的js函数，请在regularCollection.js加上你的规则"));
                                    return false;
                                }
                                else {
                                    if (!regularFn(value)) {//返回结果是false 抛出错误消息
                                        reject(errorCallBack(regularConfig.errInfo));
                                        return false;
                                    }
                                }
                            }

                            if (regularCheckFn && typeof (regularCheckFn) == 'function') {
                                if (!vue) {
                                    reject(errorCallBack("请传入VUE实例，以便执行你的自定义验证函数"));
                                    return;
                                }
                                //自定义函数验证 
                                if (!regularCheckFn.call(vue)) {
                                    reject(errorCallBack(regularConfig.errInfo));
                                    return false;
                                }
                            }
                        }
                        else {
                            reject(errorCallBack("表单字段:" + pro + "未配置对应的验证配置"));
                            return false;
                        }
                    });
                }
                resolve(successCallBack("验证成功"));
            }
            catch (e) {
                reject(errorCallBack("验证异常" + e));
            }
        });
    },
    openNewWindow: function (href, target) {//打开新窗口
        target = target || "_blank";
        var tagA = document.createElement("a");
        tagA.setAttribute("href", href);
        tagA.setAttribute("target", target);
        document.body.appendChild(tagA);
        tagA.click();
        tagA.remove();
    },
    closeDialog: function () {//关闭父layer弹框 该方法关闭的是最上层弹框
        var index = window.top.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        window.top.layer.close(index); //再执行关闭
    },
    refresh: function () {//页面刷新
        window.location.href = window.location.href;
    },
    getViewSize: function () {//获取可视窗体大小
        var win = window.top;
        if (win.innerWidth) {
            return {
                width: win.innerWidth,
                height: win.innerHeight
            }
        } else if (win.document.documentElement.offsetWidth == win.document.documentElement.clientWidth) {
            return {
                width: win.document.documentElement.offsetWidth,
                height: win.document.documentElement.offsetHeight
            }
        } else {
            return {
                width: win.document.documentElement.clientWidth,
                height: win.document.documentElement.clientHeight
            };
        }
    },



    layerOpenPage: function (url, config) {//弹层 打开一个新页面
        var viewSize = this.getViewSize();
        config = config || {};
        config.dialog_height = config.dialog_height || viewSize.height + 'px';
        config.dialog_width = config.dialog_width || viewSize.width + 'px';
        window.top.layer.open({
            type: 2, //Page层类型
            offset: config.offset || 'r',
            area: [config.dialog_width, config.dialog_height],
            scrollbar: false
            , title: [config.title, 'font-family:微软雅黑;font-weight:bolder;color:rgb(32, 160, 255)']
            , shade: 0.6 //遮罩透明度
            , maxmin: true //允许全屏最小化
            , anim: config.anim || 3, //0-6的动画形式，-1不开启
            shadeClose: true
            , content: url,
            end: function () {//层销毁回调
                if (typeof config.close_callback == "function") {
                    config.close_callback();
                }
            }
        })
    },
    layerSuccessTip: function (msg, callBack) {
        var index = window.top.layer.alert(msg, { icon: 1 }, function () {
            if (typeof callBack == 'function') {
                callBack();
            }
            window.top.layer.close(index);
        });
    },
    layerErrorTip: function (msg, callBack) {
        var index = window.top.layer.alert(msg, { icon: 2 }, function () {
            if (typeof callBack == 'function') {
                callBack();
            }
            window.top.layer.close(index);
        });
    },
    layerConfirmTip: function (msg, yCallBack, nCallBack, yBtnTxt, nBtnTxt) {
        //询问框
        var index = window.top.layer.confirm(msg, {
            btn: [yBtnTxt || '确定', nBtnTxt || '取消'] //按钮
        }, function () {
            if (typeof yCallBack == 'function') {
                yCallBack();
            }
            window.top.layer.close(index);
        }, function () {
            if (typeof nCallBack == 'function') {
                nCallBack();
            }
            window.top.layer.close(index);
        });
    },
    uuid: function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    Converter: {
        ToInt: function (v) {
            if (/^[0-9]*$/.test(v)) return parseInt(v);

            return 0;
        }
    }
}
//格式化
Vue.filter("￥.00", function (amount) {
    amount = Number(amount);
    if (amount != NaN) {
        return "￥" + amount.toFixed(2);
    }
    else {
        return amount;
    }
});
Vue.filter("-", function (v) {
    return !v ? "-" : v;
});
Vue.filter("Num", function (amount) {
    amount = Number(amount);
    if (amount != NaN) {
        return amount;
    }
    else {
        return "0";
    }
});
Vue.filter("Num2", function (amount) {
    amount = Number(amount);
    if (amount != NaN) {
        return amount.toFixed(2);
    }
    else {
        return "0.00";
    }
});

//日期格式化
Vue.filter('formatDataFilter',
    function(v, format) {
        if (!v) return "";
        return Vue.prototype.$utils.formatData.dateFormater(v, format || "yyyy-MM-dd")
    });

Vue.filter('formatDataTimeFilter',
    function(v, format) {
        if (!v) return "";
        return Vue.prototype.$utils.formatData.dateFormater(v, format || "yyyy-MM-dd hh:mm:ss")
    });

Vue.filter("...",
    function(v) {
        if (v.length > 20) {
            v = v.substring(0, 17) + "...";
        }
        return v;
    });

Date.prototype.Format = function (fmt) { //author: meizz
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

String.prototype.replaceAll = function (FindText, RepText) {
    regExp = new RegExp(FindText, "g");
    return this.replace(regExp, RepText);
}


function OpenEditPage(url, title, width, height, closeCallback) {
    title = title > '' ? title : '维护';
    width = width > '' ? width : '900';
    height = height > '' ? height : '600';

    window.top.layer.open({
        type: 2,
        title: [title],
        content: rootPath+ url,
        offset: "auto",
        area: [width+'px', height+'px'],
        end: function () { //层销毁回调
            if (typeof closeCallback == "function") {
                closeCallback();
            }
        }
    });
}