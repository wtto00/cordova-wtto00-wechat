# cordova-plugin-wechat

微信 cordova 插件

参考：[xu-li/cordova-plugin-wechat](https://github.com/xu-li/cordova-plugin-wechat)

## 安装

```shell
cordova plugin add https://github.com/wtto00/cordova-plugin-wechat --variable WECHATAPPID=YOUR_WECHAT_APPID --variable UNIVERSALLINK=YOUR_UNIVERSAL_LINK
```

#### 移除

```shell
cordova plugin rm cordova-plugin-wechat --variable WECHATAPPID=YOUR_WECHAT_APPID --variable UNIVERSALLINK=YOUR_UNIVERSAL_LINK
```

## 用法

#### 检查微信是否安装

```Javascript
Wechat.isInstalled(function (installed) {
    alert("Wechat installed: " + (installed ? "Yes" : "No"));
}, function (reason) {
    alert("Failed: " + reason);
});
```

#### 微信认证

```Javascript
var scope = "snsapi_userinfo",
    state = "_" + (+new Date());
Wechat.auth(scope, state, function (response) {
    // you may use response.code to get the access token.
    alert(JSON.stringify(response));
}, function (reason) {
    alert("Failed: " + reason);
});
```

#### 分享文本

```Javascript
Wechat.share({
    text: "This is just a plain string",
    scene: Wechat.Scene.TIMELINE   // share to Timeline
}, function () {
    alert("Success");
}, function (reason) {
    alert("Failed: " + reason);
});
```

#### 分享媒体（例如链接，照片，音乐，视频等）

```Javascript
Wechat.share({
    message: {
        title: "Hi, there",
        description: "This is description.",
        thumb: "www/img/thumbnail.png",
        mediaTagName: "TEST-TAG-001",
        messageExt: "这是第三方带的测试字段",
        messageAction: "<action>dotalist</action>",
        media: "YOUR_MEDIA_OBJECT_HERE"
    },
    scene: Wechat.Scene.TIMELINE   // share to Timeline
}, function () {
    alert("Success");
}, function (reason) {
    alert("Failed: " + reason);
});
```

##### 分享网页

```Javascript
Wechat.share({
    message: {
        ...
        media: {
            type: Wechat.Type.WEBPAGE,
            webpageUrl: "http://www.jason-z.com"
        }
    },
    scene: Wechat.Scene.TIMELINE   // share to Timeline
}, function () {
    alert("Success");
}, function (reason) {
    alert("Failed: " + reason);
});
```

##### 分享到小程序

```Javascript
Wechat.share({
    message: {
        ...
        media: {
            type: Wechat.Type.MINI,
            webpageUrl: "https://www.jason-z.com", // 兼容低版本的网页链接
            userName: "wxxxxxxxx", // 小程序原始id
            path: "user/info", // 小程序的页面路径
            hdImageData: "http://wwww.xxx.com/xx.jpg", // 程序新版本的预览图二进制数据 不超过128kb 支持 地址 base64 temp
            withShareTicket: true, // 是否使用带shareTicket的分享
            miniprogramType: Wechat.Mini.RELEASE
        }
    },
    scene: Wechat.Scene.SESSION   // 小程序仅支持聊天界面
}, function () {
    alert("Success");
}, function (reason) {
    alert("Failed: " + reason);
});
```

## 选择卡券包

```Javascript
// See https://github.com/xu-li/cordova-plugin-wechat-example/blob/master/server/payment_demo.php for php demo
var params = {
    partnerid: '10000100', // merchant id
    prepayid: 'wx201411101639507cbf6ffd8b0779950874', // prepay id
    noncestr: '1add1a30ac87aa2db72f57a2375d8fec', // nonce
    timestamp: '1439531364', // timestamp
    sign: '0CB01533B8C1EF103065174F50BCA001', // signed string
};

Wechat.sendPaymentRequest(params, function () {
    alert("Success");
}, function (reason) {
    alert("Failed: " + reason);
});
```

## 发送支付请求

```Javascript
//offical doc https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1496561749_f7T6D
var params = {
    timeStamp: '1510198391', // timeStamp
    signType: 'SHA1', // sign type
    cardSign: 'dff450eeeed08120159d285e79737173aec3df94', // cardSign
    nonceStr: '5598190f-5fb3-4bff-8314-fd189ab4e4b8', // nonce
};

Wechat.chooseInvoiceFromWX(params,function(data){
    console.log(data);
},function(){
    alert('error');
})
```

## 打开微信微信小程序

```Javascript
//offical doc https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=21526646437Y6nEC&token=&lang=zh_CN
var params = {
    userName: 'gh_d43f693ca31f', // userName
    path: 'pages/index/index?name1=key1&name2=key2', // open mini program page
    miniprogramType: Wechat.Mini.RELEASE // Developer version, trial version, and official version are available for selection
};

Wechat.openMiniProgram(params,function(data){
    console.log(data); // data:{extMsg:""}  extMsg: Corresponds to the app-parameter attribute in the Mini Program component <button open-type="launchApp">
},function(){
    alert('error');
})
```
