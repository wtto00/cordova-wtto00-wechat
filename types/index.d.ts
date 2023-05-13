declare namespace Wechat {
  interface SceneType {
    /**
     * 聊天界面
     */
    SESSION: 0;
    /**
     * 朋友圈
     */
    TIMELINE: 1;
    /**
     * 收藏
     */
    FAVORITE: 2;
  }
  const Scene: SceneType;

  interface MediaType {
    APP: 1;
    EMOTION: 2;
    FILE: 3;
    IMAGE: 4;
    MUSIC: 5;
    VIDEO: 6;
    WEBPAGE: 7;
    MINI: 8;
  }
  const Type: MediaType;

  interface MiniEnv {
    /**
     * 正式版
     */
    RELEASE: 0;
    /**
     * 测试版
     */
    TEST: 1;
    /**
     * 体验版
     */
    PREVIEW: 2;
  }
  const Mini: MiniEnv;

  /**
   * 是否安装微信
   *
   * @param onSuccess 成功回调
   * @param onError 失败回调
   */
  function isInstalled(
    onSuccess: (installed: number) => void,
    onError: (reason: string) => void
  ): void;

  interface AuthResponse {
    /**
     * ERR_OK = 0(用户同意)
     * ERR_AUTH_DENIED = -4（用户拒绝授权）
     * ERR_USER_CANCEL = -2（用户取消）
     */
    ErrCode: number;
    /**
     * 用户换取 access_token 的 code，仅在 ErrCode 为 0 时有效
     */
    code: string;
    /**
     * 第三方程序发送时用来标识其请求的唯一性的标志，由第三方程序调用 sendReq 时传入，由微信终端回传，state 字符串长度不能超过 1K
     */
    state: string;
    /**
     * 微信客户端当前语言
     */
    lang: string;
    /**
     * 微信用户当前国家信息
     */
    country: string;
  }
  /**
   * 登录授权
   *
   * @link https://developers.weixin.qq.com/doc/oplatform/Mobile_App/WeChat_Login/Development_Guide.html
   * @param scope 应用授权作用域，获取用户个人信息则填写 snsapi_userinfo （只能填 snsapi_userinfo）
   * @param state 用于保持请求和回调的状态，授权请求后原样带回给第三方。该参数可用于防止 csrf 攻击（跨站请求伪造攻击），建议第三方带上该参数，可设置为简单的随机数加 session 进行校验。在state传递的过程中会将该参数作为url的一部分进行处理，因此建议对该参数进行url encode操作，防止其中含有影响url解析的特殊字符（如'#'、'&'等）导致该参数无法正确回传。
   * @param onSuccess 成功回调
   * @param onError 失败回调
   *
   * @example
   * ```javascript
   * Wechat.auth(function (response) { alert(response.code); });
   * ```
   */
  function auth(
    onSuccess: (response: AuthResponse) => void,
    onError: (reason: string) => void
  ): void;
  function auth(
    scope: string,
    onSuccess: (response: AuthResponse) => void,
    onError: (reason: string) => void
  ): void;
  function auth(
    scope: string,
    state: string,
    onSuccess: (response: AuthResponse) => void,
    onError: (reason: string) => void
  ): void;

  interface ShareMessageContent {
    /**
     * 消息标题
     *
     * 限制长度不超过 512Bytes
     */
    title?: string;
    /**
     * 消息描述
     *
     * 限制长度不超过 1KB
     */
    description?: string;
    /**
     * 缩略图（支持本地资源，远程资源，base64）
     */
    thumb?: string;
    /**
     * 媒体消息内容
     */
    media: {
      /**
       * 媒体类型
       *
       * e.g. Wechat.Type.IMAGE
       */
      type: MediaType[keyof MediaType];
      /**
       * 链接地址
       *
       * 分享小程序时，兼容低版本的网页链接
       *
       * type: Wechat.Type.WEBPAGE | Wechat.Type.MINI
       */
      webpageUrl?: string;
      /**
       * 分享图片（支持本地资源，远程资源，base64）
       *
       * type: Wechat.Type.IMAGE
       */
      image?: string;
      /**
       * 音频网页的URL地址
       *
       * type: Wechat.Type.MUSIC
       */
      musicUrl?: string;
      /**
       * 音频数据的URL地址
       *
       * type: Wechat.Type.MUSIC
       */
      musicDataUrl?: string;
      /**
       * 视频网页的URL地址
       *
       * type: Wechat.Type.VIDEO
       */
      videoUrl?: string;
      /**
       * 小程序原始id
       *
       * type: Wechat.Type.MINI
       */
      userName?: string;
      /**
       * 小程序的页面路径
       *
       * type: Wechat.Type.MINI
       */
      path?: string;
      /**
       * 分享缩略图（支持url和base64）
       *
       * 程序新版本的预览图二进制数据 不超过128kb 支持 地址 base64 temp
       *
       * type: Wechat.Type.MINI
       */
      hdImageData?: string;
      /**
       * 是否使用带shareTicket的分享
       *
       * type: Wechat.Type.MINI
       */
      withShareTicket?: boolean;
      /**
       * 小程序类型：RELEASE发布版 TEST测试版 PREVIEW体验版
       *
       * type: Wechat.Type.MINI
       *
       * e.g. Wechat.Mini.PREVIEW
       */
      miniprogramType?: MiniEnv[keyof MiniEnv];
    };
  }
  interface ShareMessage {
    /**
     * 微信媒体消息内容，媒体类型分享
     */
    message?: ShareMessageContent;
    /**
     * 文本数据，文字类型分享
     *
     * 长度需大于 0 且不超过 10KB
     */
    text?: string;
    /**
     * 发送的目标场景
     *
     * e.g. Wechat.Scene.SESSION
     */
    scene: SceneType[keyof SceneType];
  }

  /**
   * 分享与收藏
   *
   * @link https://developers.weixin.qq.com/doc/oplatform/Mobile_App/Share_and_Favorites/Share_and_Favorites.html
   * @param message 消息内容
   * @param onSuccess 成功回调
   * @param onError 失败回调
   *
   * @example
   * ```javascript
   * Wechat.share({
   *     message: {
   *        title: "Message Title",
   *        description: "Message Description(optional)",
   *        mediaTagName: "Media Tag Name(optional)",
   *        thumb: "http://YOUR_THUMBNAIL_IMAGE",
   *        media: {
   *            type: Wechat.Type.WEBPAGE,   // webpage
   *            webpageUrl: "https://github.com/wtto00/cordova-plugin-wechat"    // webpage
   *        }
   *    },
   *    scene: Wechat.Scene.TIMELINE   // share to Timeline
   * }, function () {
   *     alert("Success");
   * }, function (reason) {
   *     alert("Failed: " + reason);
   * });
   * ```
   */
  function share(
    message: ShareMessage,
    onSuccess: () => void,
    onError: (reason: string) => void
  ): void;

  interface SendPaymentRequestParams {
    /**
     * 商户 ID
     */
    mch_id: string;
    /**
     * 预支付交易会话标识
     *
     * 服务端返回
     */
    prepay_id: string;
    /**
     * 随机数
     *
     * 服务端返回
     */
    nonce: string;
    /**
     * 时间戳
     *
     * 服务端返回
     */
    timestamp: string;
    /**
     * 签名
     *
     * 服务端返回
     */
    sign: string;
  }
  /**
   * 微信APP支付
   *
   * @link https://pay.weixin.qq.com/wiki/doc/apiv3/open/pay/chapter2_5_2.shtml
   * @param params 订单数据
   * @param onSuccess 成功回调
   * @param onError 失败回调
   * @example
   * ```javascipt
   * var params = {
   *     mch_id: '10000100', // merchant id
   *     prepay_id: 'wx201411101639507cbf6ffd8b0779950874', // prepay id returned from server
   *     nonce: '1add1a30ac87aa2db72f57a2375d8fec', // nonce string returned from server
   *     timestamp: '1439531364', // timestamp
   *     sign: '0CB01533B8C1EF103065174F50BCA001', // signed string
   * };
   * Wechat.sendPaymentRequest(params, function () {
   *     alert("Success");
   * }, function (reason) {
   *     alert("Failed: " + reason);
   * });
   * ```
   */
  function sendPaymentRequest(
    params: SendPaymentRequestParams,
    onSuccess: () => void,
    onError: (reason: string) => void
  ): void;

  interface JumpToBizProfileParams {
    info: string;
    type: string;
  }
  function jumpToBizProfile(
    params: JumpToBizProfileParams,
    onSuccess: () => void,
    onError: (reason: string) => void
  ): void;

  function jumpToWechat(
    url: string,
    onSuccess: () => void,
    onError: (reason: string) => void
  ): void;

  interface ChooseInvoiceFromWXParams {
    signType: string;
    cardSign: string;
    nonceStr: string;
    timeStamp: string;
  }
  function chooseInvoiceFromWX(
    params: ChooseInvoiceFromWXParams,
    onSuccess: () => void,
    onError: (reason: string) => void
  ): void;

  interface OpenMiniProgramParams {
    userName: string;
    path: string;
    miniprogramType: string;
  }
  function openMiniProgram(
    params: OpenMiniProgramParams,
    onSuccess: (data: { extMsg: string }) => void,
    onError: (reason: string) => void
  ): void;
}

interface Window {
  Wechat: typeof Wechat;
}
