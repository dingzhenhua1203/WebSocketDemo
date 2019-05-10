var rootPath = '/tccxgc/surprisegame';
window.BaseURL = rootPath;
var ajaxCall = {
    PostForListPage: function (that, url, request) {
        console.log(request);
        $.ajax({
            type: 'post',
            url: rootPath+url,
            data: request,
            success: function (resultData) {
                console.log(resultData);
                if (resultData == undefined) {
                    that.alert.Error("服务器无响应");
                    return;
                }
                if (resultData.ResultCode== 500) {
                    that.alert.Error("服务器开小差了...");
                    return;
                }
                if (resultData.ResultCode!= 1) {
                    let msg = resultData.ResultMsg;
                    msg = msg < "" ? "服务器发生未知错误,代码：" + resultData.ResultCode: msg;
                    that.alert.Error(msg);
                    return;
                }
                if (resultData.Body == undefined) {
                    that.totalRecord = 0;
                    that.gridData = [];
                    return;
                }
                that.totalCount = resultData.Body.TotalCount;
                that.tableData = resultData.Body.List;
            }
        });
    },
    Get: function (that, url, data, callBack, failedCallBack) {
        $.ajax({
            type: 'Get',
            url: rootPath + url,
            data: data,
            success: function (resultData) {
                if (resultData == undefined) {
                    that.alert.Error("服务器无响应");
                    if (typeof (failedCallBack) == "function") {
                        failedCallBack(that);
                    }
                    return;
                }
                if (resultData.ResultCode== 500 || resultData.ResultCode== 500) {
                    that.alert.Error("服务器开小差了。。。");
                    if (typeof (failedCallBack) == "function") {
                        failedCallBack(that);
                    }
                    return;
                }
                if (typeof (callBack) == "function") {
                    callBack(that, resultData);
                }
            }
        });
    },
    Post: function (that, url, data, callBack, failedCallBack) {

        $.ajax({
            type: 'post',
            url: rootPath + url,
            data: data,
            success: function (resultData) {
                if (resultData == undefined) {
                    that.alert.Error("服务器无响应");
                    if (typeof (failedCallBack) == "function") {
                        failedCallBack(that);
                    }
                    return;
                }
                if (resultData.ResultCode== 500 || resultData.ResultCode== 500) {
                    that.alert.Error("服务器开小差了...");
                    if (typeof (failedCallBack) == "function") {
                        failedCallBack(that);
                    }
                    return;
                }
                if (typeof (callBack) == "function") {
                    callBack(that, resultData);
                }
            }
        });
    }
    ,
    GetDicData: function (that, pid, callBack) {
        var url = rootPath  +"/Common/GetDicData?pid=" + pid;
        $.ajax({
            type: 'get',
            url: url,
            success: function (resultData) {
                if (typeof (callBack) == "function") {
                    callBack(that, resultData);
                }
            }
        });
    },
    Upload: function (that, url, data, callBack, failedCallBack) {

        $.ajax({
            type: 'post',
            url: rootPath + url,
            data: data,
            contentType: false,
            processData: false,
            success: function (resultData) {
                if (resultData == undefined) {
                    that.alert.Error("服务器无响应");
                    if (typeof (failedCallBack) == "function") {
                        failedCallBack(that);
                    }
                    return;
                }
                if (resultData.ResultCode == 500 || resultData.ResultCode == 500) {
                    that.alert.Error("服务器开小差了...");
                    if (typeof (failedCallBack) == "function") {
                        failedCallBack(that);
                    }
                    return;
                }
                if (typeof (callBack) == "function") {
                    callBack(that, resultData);
                }
            }
        });
    }
    ,
};