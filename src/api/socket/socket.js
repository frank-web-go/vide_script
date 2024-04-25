export default {
  ws: null,
  wsUrl: "ws://10.5.24.12:1809/websocket/web/123",
  connectFlag: true,
  lockReconnect: false, //避免重复连接
  timeOutCheck: null,
  onOpenCallback: null, //连接成功回调
  onMessageCallback: null, //消息回调

  createWebSocket: function (url, onOpenCall, onMessCall) {
    this.wsUrl = url;
    this.onOpenCallback = onOpenCall;
    this.onMessageCallback = onMessCall;
    try {
      this.ws = new WebSocket(url);
      this.initEventHandle();
    } catch (e) {
      this.reconnect(url);
    }
    return this;
  },
  initEventHandle: function () {
    this.ws.onclose = (e) => {
      console.log("socket关闭!");
      // this.reconnect(this.wsUrl);
      let isChat = localStorage.getItem('socketState')
      if (e.code == 1006&&isChat=='open') {
        alert('socket错误！请重新连接')
        setTimeout(() => {
          location.reload()
        }, 100);
      }
    };
    this.ws.onerror = () => {
      console.log("socket错误!");
      this.reconnect(this.wsUrl);
    };
    this.ws.onopen = () => {
      console.log("socket连接成功!");
      if (this.onOpenCallback) {
        this.onOpenCallback();
      }
      //心跳检测重置
      this.heartCheck()
        .reset()
        .start();
    };
    this.ws.onmessage = (event) => {
      if (this.onMessageCallback) {
        this.onMessageCallback(event);
      }

      //如果获取到消息，心跳检测重置
      //拿到任何消息都说明当前连接是正常的
      this.heartCheck()
        .reset()
        .start();
    };
  },
  reconnect: function (url) {
    if (this.lockReconnect) return;
    this.lockReconnect = true;
    //没连接上会一直重连，设置延迟避免请求过多
    setTimeout(() => {
      this.createWebSocket(url);
      this.lockReconnect = false;
    }, 2000);
  },

  heartCheck: function () {
    let _this = this;
    return this.timeOutCheck
      ? this.timeOutCheck
      : (this.timeOutCheck = {
        timeout: 30000, //30秒
        timeoutObj: null,
        reset: function () {
          clearTimeout(this.timeoutObj);
          return this;
        },
        start: function () {
          this.timeoutObj = setTimeout(() => {
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            _this.ws.send("HeartBeat");
          }, this.timeout);
        },
      });
  },
  sendWsMess(obj, onSendOkCall, onSendErrCall) {
    if (this.ws.readyState === 1) {
      let sendStr;
      if (typeof obj == "string") {
        sendStr = obj;
      } else {
        sendStr = JSON.stringify(obj);
      }
      this.ws.send(sendStr);
      if (onSendOkCall != undefined) {
        onSendOkCall();
      }
    } else {
      if (onSendErrCall != undefined) {
        onSendErrCall();
      }
    }
  },
};
