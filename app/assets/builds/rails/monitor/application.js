(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/@rails/actioncable/src/adapters.js
  var adapters_default;
  var init_adapters = __esm({
    "node_modules/@rails/actioncable/src/adapters.js"() {
      adapters_default = {
        logger: typeof console !== "undefined" ? console : void 0,
        WebSocket: typeof WebSocket !== "undefined" ? WebSocket : void 0
      };
    }
  });

  // node_modules/@rails/actioncable/src/logger.js
  var logger_default;
  var init_logger = __esm({
    "node_modules/@rails/actioncable/src/logger.js"() {
      init_adapters();
      logger_default = {
        log(...messages) {
          if (this.enabled) {
            messages.push(Date.now());
            adapters_default.logger.log("[ActionCable]", ...messages);
          }
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/connection_monitor.js
  var now, secondsSince, ConnectionMonitor, connection_monitor_default;
  var init_connection_monitor = __esm({
    "node_modules/@rails/actioncable/src/connection_monitor.js"() {
      init_logger();
      now = () => (/* @__PURE__ */ new Date()).getTime();
      secondsSince = (time) => (now() - time) / 1e3;
      ConnectionMonitor = class {
        constructor(connection) {
          this.visibilityDidChange = this.visibilityDidChange.bind(this);
          this.connection = connection;
          this.reconnectAttempts = 0;
        }
        start() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            addEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log(`ConnectionMonitor started. stale threshold = ${this.constructor.staleThreshold} s`);
          }
        }
        stop() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            removeEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log("ConnectionMonitor stopped");
          }
        }
        isRunning() {
          return this.startedAt && !this.stoppedAt;
        }
        recordPing() {
          this.pingedAt = now();
        }
        recordConnect() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          logger_default.log("ConnectionMonitor recorded connect");
        }
        recordDisconnect() {
          this.disconnectedAt = now();
          logger_default.log("ConnectionMonitor recorded disconnect");
        }
        // Private
        startPolling() {
          this.stopPolling();
          this.poll();
        }
        stopPolling() {
          clearTimeout(this.pollTimeout);
        }
        poll() {
          this.pollTimeout = setTimeout(
            () => {
              this.reconnectIfStale();
              this.poll();
            },
            this.getPollInterval()
          );
        }
        getPollInterval() {
          const { staleThreshold, reconnectionBackoffRate } = this.constructor;
          const backoff = Math.pow(1 + reconnectionBackoffRate, Math.min(this.reconnectAttempts, 10));
          const jitterMax = this.reconnectAttempts === 0 ? 1 : reconnectionBackoffRate;
          const jitter = jitterMax * Math.random();
          return staleThreshold * 1e3 * backoff * (1 + jitter);
        }
        reconnectIfStale() {
          if (this.connectionIsStale()) {
            logger_default.log(`ConnectionMonitor detected stale connection. reconnectAttempts = ${this.reconnectAttempts}, time stale = ${secondsSince(this.refreshedAt)} s, stale threshold = ${this.constructor.staleThreshold} s`);
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              logger_default.log(`ConnectionMonitor skipping reopening recent disconnect. time disconnected = ${secondsSince(this.disconnectedAt)} s`);
            } else {
              logger_default.log("ConnectionMonitor reopening");
              this.connection.reopen();
            }
          }
        }
        get refreshedAt() {
          return this.pingedAt ? this.pingedAt : this.startedAt;
        }
        connectionIsStale() {
          return secondsSince(this.refreshedAt) > this.constructor.staleThreshold;
        }
        disconnectedRecently() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        }
        visibilityDidChange() {
          if (document.visibilityState === "visible") {
            setTimeout(
              () => {
                if (this.connectionIsStale() || !this.connection.isOpen()) {
                  logger_default.log(`ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = ${document.visibilityState}`);
                  this.connection.reopen();
                }
              },
              200
            );
          }
        }
      };
      ConnectionMonitor.staleThreshold = 6;
      ConnectionMonitor.reconnectionBackoffRate = 0.15;
      connection_monitor_default = ConnectionMonitor;
    }
  });

  // node_modules/@rails/actioncable/src/internal.js
  var internal_default;
  var init_internal = __esm({
    "node_modules/@rails/actioncable/src/internal.js"() {
      internal_default = {
        "message_types": {
          "welcome": "welcome",
          "disconnect": "disconnect",
          "ping": "ping",
          "confirmation": "confirm_subscription",
          "rejection": "reject_subscription"
        },
        "disconnect_reasons": {
          "unauthorized": "unauthorized",
          "invalid_request": "invalid_request",
          "server_restart": "server_restart",
          "remote": "remote"
        },
        "default_mount_path": "/cable",
        "protocols": [
          "actioncable-v1-json",
          "actioncable-unsupported"
        ]
      };
    }
  });

  // node_modules/@rails/actioncable/src/connection.js
  var message_types, protocols, supportedProtocols, indexOf, Connection, connection_default;
  var init_connection = __esm({
    "node_modules/@rails/actioncable/src/connection.js"() {
      init_adapters();
      init_connection_monitor();
      init_internal();
      init_logger();
      ({ message_types, protocols } = internal_default);
      supportedProtocols = protocols.slice(0, protocols.length - 1);
      indexOf = [].indexOf;
      Connection = class {
        constructor(consumer2) {
          this.open = this.open.bind(this);
          this.consumer = consumer2;
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new connection_monitor_default(this);
          this.disconnected = true;
        }
        send(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        }
        open() {
          if (this.isActive()) {
            logger_default.log(`Attempted to open WebSocket, but existing socket is ${this.getState()}`);
            return false;
          } else {
            const socketProtocols = [...protocols, ...this.consumer.subprotocols || []];
            logger_default.log(`Opening WebSocket, current state is ${this.getState()}, subprotocols: ${socketProtocols}`);
            if (this.webSocket) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new adapters_default.WebSocket(this.consumer.url, socketProtocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        }
        close({ allowReconnect } = { allowReconnect: true }) {
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isOpen()) {
            return this.webSocket.close();
          }
        }
        reopen() {
          logger_default.log(`Reopening WebSocket, current state is ${this.getState()}`);
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error2) {
              logger_default.log("Failed to reopen WebSocket", error2);
            } finally {
              logger_default.log(`Reopening WebSocket in ${this.constructor.reopenDelay}ms`);
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        }
        getProtocol() {
          if (this.webSocket) {
            return this.webSocket.protocol;
          }
        }
        isOpen() {
          return this.isState("open");
        }
        isActive() {
          return this.isState("open", "connecting");
        }
        triedToReconnect() {
          return this.monitor.reconnectAttempts > 0;
        }
        // Private
        isProtocolSupported() {
          return indexOf.call(supportedProtocols, this.getProtocol()) >= 0;
        }
        isState(...states) {
          return indexOf.call(states, this.getState()) >= 0;
        }
        getState() {
          if (this.webSocket) {
            for (let state in adapters_default.WebSocket) {
              if (adapters_default.WebSocket[state] === this.webSocket.readyState) {
                return state.toLowerCase();
              }
            }
          }
          return null;
        }
        installEventHandlers() {
          for (let eventName in this.events) {
            const handler = this.events[eventName].bind(this);
            this.webSocket[`on${eventName}`] = handler;
          }
        }
        uninstallEventHandlers() {
          for (let eventName in this.events) {
            this.webSocket[`on${eventName}`] = function() {
            };
          }
        }
      };
      Connection.reopenDelay = 500;
      Connection.prototype.events = {
        message(event) {
          if (!this.isProtocolSupported()) {
            return;
          }
          const { identifier: identifier2, message, reason, reconnect, type } = JSON.parse(event.data);
          switch (type) {
            case message_types.welcome:
              if (this.triedToReconnect()) {
                this.reconnectAttempted = true;
              }
              this.monitor.recordConnect();
              return this.subscriptions.reload();
            case message_types.disconnect:
              logger_default.log(`Disconnecting. Reason: ${reason}`);
              return this.close({ allowReconnect: reconnect });
            case message_types.ping:
              return this.monitor.recordPing();
            case message_types.confirmation:
              this.subscriptions.confirmSubscription(identifier2);
              if (this.reconnectAttempted) {
                this.reconnectAttempted = false;
                return this.subscriptions.notify(identifier2, "connected", { reconnected: true });
              } else {
                return this.subscriptions.notify(identifier2, "connected", { reconnected: false });
              }
            case message_types.rejection:
              return this.subscriptions.reject(identifier2);
            default:
              return this.subscriptions.notify(identifier2, "received", message);
          }
        },
        open() {
          logger_default.log(`WebSocket onopen event, using '${this.getProtocol()}' subprotocol`);
          this.disconnected = false;
          if (!this.isProtocolSupported()) {
            logger_default.log("Protocol is unsupported. Stopping monitor and disconnecting.");
            return this.close({ allowReconnect: false });
          }
        },
        close(event) {
          logger_default.log("WebSocket onclose event");
          if (this.disconnected) {
            return;
          }
          this.disconnected = true;
          this.monitor.recordDisconnect();
          return this.subscriptions.notifyAll("disconnected", { willAttemptReconnect: this.monitor.isRunning() });
        },
        error() {
          logger_default.log("WebSocket onerror event");
        }
      };
      connection_default = Connection;
    }
  });

  // node_modules/@rails/actioncable/src/subscription.js
  var extend, Subscription;
  var init_subscription = __esm({
    "node_modules/@rails/actioncable/src/subscription.js"() {
      extend = function(object, properties) {
        if (properties != null) {
          for (let key in properties) {
            const value = properties[key];
            object[key] = value;
          }
        }
        return object;
      };
      Subscription = class {
        constructor(consumer2, params = {}, mixin) {
          this.consumer = consumer2;
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }
        // Perform a channel action with the optional data passed as an attribute
        perform(action, data = {}) {
          data.action = action;
          return this.send(data);
        }
        send(data) {
          return this.consumer.send({ command: "message", identifier: this.identifier, data: JSON.stringify(data) });
        }
        unsubscribe() {
          return this.consumer.subscriptions.remove(this);
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/subscription_guarantor.js
  var SubscriptionGuarantor, subscription_guarantor_default;
  var init_subscription_guarantor = __esm({
    "node_modules/@rails/actioncable/src/subscription_guarantor.js"() {
      init_logger();
      SubscriptionGuarantor = class {
        constructor(subscriptions) {
          this.subscriptions = subscriptions;
          this.pendingSubscriptions = [];
        }
        guarantee(subscription) {
          if (this.pendingSubscriptions.indexOf(subscription) == -1) {
            logger_default.log(`SubscriptionGuarantor guaranteeing ${subscription.identifier}`);
            this.pendingSubscriptions.push(subscription);
          } else {
            logger_default.log(`SubscriptionGuarantor already guaranteeing ${subscription.identifier}`);
          }
          this.startGuaranteeing();
        }
        forget(subscription) {
          logger_default.log(`SubscriptionGuarantor forgetting ${subscription.identifier}`);
          this.pendingSubscriptions = this.pendingSubscriptions.filter((s) => s !== subscription);
        }
        startGuaranteeing() {
          this.stopGuaranteeing();
          this.retrySubscribing();
        }
        stopGuaranteeing() {
          clearTimeout(this.retryTimeout);
        }
        retrySubscribing() {
          this.retryTimeout = setTimeout(
            () => {
              if (this.subscriptions && typeof this.subscriptions.subscribe === "function") {
                this.pendingSubscriptions.map((subscription) => {
                  logger_default.log(`SubscriptionGuarantor resubscribing ${subscription.identifier}`);
                  this.subscriptions.subscribe(subscription);
                });
              }
            },
            500
          );
        }
      };
      subscription_guarantor_default = SubscriptionGuarantor;
    }
  });

  // node_modules/@rails/actioncable/src/subscriptions.js
  var Subscriptions;
  var init_subscriptions = __esm({
    "node_modules/@rails/actioncable/src/subscriptions.js"() {
      init_subscription();
      init_subscription_guarantor();
      init_logger();
      Subscriptions = class {
        constructor(consumer2) {
          this.consumer = consumer2;
          this.guarantor = new subscription_guarantor_default(this);
          this.subscriptions = [];
        }
        create(channelName, mixin) {
          const channel = channelName;
          const params = typeof channel === "object" ? channel : { channel };
          const subscription = new Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        }
        // Private
        add(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.subscribe(subscription);
          return subscription;
        }
        remove(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        }
        reject(identifier2) {
          return this.findAll(identifier2).map((subscription) => {
            this.forget(subscription);
            this.notify(subscription, "rejected");
            return subscription;
          });
        }
        forget(subscription) {
          this.guarantor.forget(subscription);
          this.subscriptions = this.subscriptions.filter((s) => s !== subscription);
          return subscription;
        }
        findAll(identifier2) {
          return this.subscriptions.filter((s) => s.identifier === identifier2);
        }
        reload() {
          return this.subscriptions.map((subscription) => this.subscribe(subscription));
        }
        notifyAll(callbackName, ...args) {
          return this.subscriptions.map((subscription) => this.notify(subscription, callbackName, ...args));
        }
        notify(subscription, callbackName, ...args) {
          let subscriptions;
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          return subscriptions.map((subscription2) => typeof subscription2[callbackName] === "function" ? subscription2[callbackName](...args) : void 0);
        }
        subscribe(subscription) {
          if (this.sendCommand(subscription, "subscribe")) {
            this.guarantor.guarantee(subscription);
          }
        }
        confirmSubscription(identifier2) {
          logger_default.log(`Subscription confirmed ${identifier2}`);
          this.findAll(identifier2).map((subscription) => this.guarantor.forget(subscription));
        }
        sendCommand(subscription, command) {
          const { identifier: identifier2 } = subscription;
          return this.consumer.send({ command, identifier: identifier2 });
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/consumer.js
  function createWebSocketURL(url) {
    if (typeof url === "function") {
      url = url();
    }
    if (url && !/^wss?:/i.test(url)) {
      const a = document.createElement("a");
      a.href = url;
      a.href = a.href;
      a.protocol = a.protocol.replace("http", "ws");
      return a.href;
    } else {
      return url;
    }
  }
  var Consumer;
  var init_consumer = __esm({
    "node_modules/@rails/actioncable/src/consumer.js"() {
      init_connection();
      init_subscriptions();
      Consumer = class {
        constructor(url) {
          this._url = url;
          this.subscriptions = new Subscriptions(this);
          this.connection = new connection_default(this);
          this.subprotocols = [];
        }
        get url() {
          return createWebSocketURL(this._url);
        }
        send(data) {
          return this.connection.send(data);
        }
        connect() {
          return this.connection.open();
        }
        disconnect() {
          return this.connection.close({ allowReconnect: false });
        }
        ensureActiveConnection() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        }
        addSubProtocol(subprotocol) {
          this.subprotocols = [...this.subprotocols, subprotocol];
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/index.js
  var src_exports = {};
  __export(src_exports, {
    Connection: () => connection_default,
    ConnectionMonitor: () => connection_monitor_default,
    Consumer: () => Consumer,
    INTERNAL: () => internal_default,
    Subscription: () => Subscription,
    SubscriptionGuarantor: () => subscription_guarantor_default,
    Subscriptions: () => Subscriptions,
    adapters: () => adapters_default,
    createConsumer: () => createConsumer,
    createWebSocketURL: () => createWebSocketURL,
    getConfig: () => getConfig,
    logger: () => logger_default
  });
  function createConsumer(url = getConfig("url") || internal_default.default_mount_path) {
    return new Consumer(url);
  }
  function getConfig(name) {
    const element = document.head.querySelector(`meta[name='action-cable-${name}']`);
    if (element) {
      return element.getAttribute("content");
    }
  }
  var init_src = __esm({
    "node_modules/@rails/actioncable/src/index.js"() {
      init_connection();
      init_connection_monitor();
      init_consumer();
      init_internal();
      init_subscription();
      init_subscriptions();
      init_subscription_guarantor();
      init_adapters();
      init_logger();
    }
  });

  // node_modules/highlight.js/lib/core.js
  var require_core = __commonJS({
    "node_modules/highlight.js/lib/core.js"(exports, module) {
      function deepFreeze(obj) {
        if (obj instanceof Map) {
          obj.clear = obj.delete = obj.set = function() {
            throw new Error("map is read-only");
          };
        } else if (obj instanceof Set) {
          obj.add = obj.clear = obj.delete = function() {
            throw new Error("set is read-only");
          };
        }
        Object.freeze(obj);
        Object.getOwnPropertyNames(obj).forEach((name) => {
          const prop = obj[name];
          const type = typeof prop;
          if ((type === "object" || type === "function") && !Object.isFrozen(prop)) {
            deepFreeze(prop);
          }
        });
        return obj;
      }
      var Response2 = class {
        /**
         * @param {CompiledMode} mode
         */
        constructor(mode) {
          if (mode.data === void 0) mode.data = {};
          this.data = mode.data;
          this.isMatchIgnored = false;
        }
        ignoreMatch() {
          this.isMatchIgnored = true;
        }
      };
      function escapeHTML(value) {
        return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
      }
      function inherit$1(original, ...objects) {
        const result = /* @__PURE__ */ Object.create(null);
        for (const key in original) {
          result[key] = original[key];
        }
        objects.forEach(function(obj) {
          for (const key in obj) {
            result[key] = obj[key];
          }
        });
        return (
          /** @type {T} */
          result
        );
      }
      var SPAN_CLOSE = "</span>";
      var emitsWrappingTags = (node) => {
        return !!node.scope;
      };
      var scopeToCSSClass = (name, { prefix }) => {
        if (name.startsWith("language:")) {
          return name.replace("language:", "language-");
        }
        if (name.includes(".")) {
          const pieces = name.split(".");
          return [
            `${prefix}${pieces.shift()}`,
            ...pieces.map((x, i) => `${x}${"_".repeat(i + 1)}`)
          ].join(" ");
        }
        return `${prefix}${name}`;
      };
      var HTMLRenderer = class {
        /**
         * Creates a new HTMLRenderer
         *
         * @param {Tree} parseTree - the parse tree (must support `walk` API)
         * @param {{classPrefix: string}} options
         */
        constructor(parseTree, options) {
          this.buffer = "";
          this.classPrefix = options.classPrefix;
          parseTree.walk(this);
        }
        /**
         * Adds texts to the output stream
         *
         * @param {string} text */
        addText(text) {
          this.buffer += escapeHTML(text);
        }
        /**
         * Adds a node open to the output stream (if needed)
         *
         * @param {Node} node */
        openNode(node) {
          if (!emitsWrappingTags(node)) return;
          const className = scopeToCSSClass(
            node.scope,
            { prefix: this.classPrefix }
          );
          this.span(className);
        }
        /**
         * Adds a node close to the output stream (if needed)
         *
         * @param {Node} node */
        closeNode(node) {
          if (!emitsWrappingTags(node)) return;
          this.buffer += SPAN_CLOSE;
        }
        /**
         * returns the accumulated buffer
        */
        value() {
          return this.buffer;
        }
        // helpers
        /**
         * Builds a span element
         *
         * @param {string} className */
        span(className) {
          this.buffer += `<span class="${className}">`;
        }
      };
      var newNode = (opts = {}) => {
        const result = { children: [] };
        Object.assign(result, opts);
        return result;
      };
      var TokenTree = class _TokenTree {
        constructor() {
          this.rootNode = newNode();
          this.stack = [this.rootNode];
        }
        get top() {
          return this.stack[this.stack.length - 1];
        }
        get root() {
          return this.rootNode;
        }
        /** @param {Node} node */
        add(node) {
          this.top.children.push(node);
        }
        /** @param {string} scope */
        openNode(scope) {
          const node = newNode({ scope });
          this.add(node);
          this.stack.push(node);
        }
        closeNode() {
          if (this.stack.length > 1) {
            return this.stack.pop();
          }
          return void 0;
        }
        closeAllNodes() {
          while (this.closeNode()) ;
        }
        toJSON() {
          return JSON.stringify(this.rootNode, null, 4);
        }
        /**
         * @typedef { import("./html_renderer").Renderer } Renderer
         * @param {Renderer} builder
         */
        walk(builder) {
          return this.constructor._walk(builder, this.rootNode);
        }
        /**
         * @param {Renderer} builder
         * @param {Node} node
         */
        static _walk(builder, node) {
          if (typeof node === "string") {
            builder.addText(node);
          } else if (node.children) {
            builder.openNode(node);
            node.children.forEach((child) => this._walk(builder, child));
            builder.closeNode(node);
          }
          return builder;
        }
        /**
         * @param {Node} node
         */
        static _collapse(node) {
          if (typeof node === "string") return;
          if (!node.children) return;
          if (node.children.every((el) => typeof el === "string")) {
            node.children = [node.children.join("")];
          } else {
            node.children.forEach((child) => {
              _TokenTree._collapse(child);
            });
          }
        }
      };
      var TokenTreeEmitter = class extends TokenTree {
        /**
         * @param {*} options
         */
        constructor(options) {
          super();
          this.options = options;
        }
        /**
         * @param {string} text
         */
        addText(text) {
          if (text === "") {
            return;
          }
          this.add(text);
        }
        /** @param {string} scope */
        startScope(scope) {
          this.openNode(scope);
        }
        endScope() {
          this.closeNode();
        }
        /**
         * @param {Emitter & {root: DataNode}} emitter
         * @param {string} name
         */
        __addSublanguage(emitter, name) {
          const node = emitter.root;
          if (name) node.scope = `language:${name}`;
          this.add(node);
        }
        toHTML() {
          const renderer = new HTMLRenderer(this, this.options);
          return renderer.value();
        }
        finalize() {
          this.closeAllNodes();
          return true;
        }
      };
      function source(re) {
        if (!re) return null;
        if (typeof re === "string") return re;
        return re.source;
      }
      function lookahead(re) {
        return concat("(?=", re, ")");
      }
      function anyNumberOfTimes(re) {
        return concat("(?:", re, ")*");
      }
      function optional(re) {
        return concat("(?:", re, ")?");
      }
      function concat(...args) {
        const joined = args.map((x) => source(x)).join("");
        return joined;
      }
      function stripOptionsFromArgs(args) {
        const opts = args[args.length - 1];
        if (typeof opts === "object" && opts.constructor === Object) {
          args.splice(args.length - 1, 1);
          return opts;
        } else {
          return {};
        }
      }
      function either(...args) {
        const opts = stripOptionsFromArgs(args);
        const joined = "(" + (opts.capture ? "" : "?:") + args.map((x) => source(x)).join("|") + ")";
        return joined;
      }
      function countMatchGroups(re) {
        return new RegExp(re.toString() + "|").exec("").length - 1;
      }
      function startsWith(re, lexeme) {
        const match = re && re.exec(lexeme);
        return match && match.index === 0;
      }
      var BACKREF_RE = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
      function _rewriteBackreferences(regexps, { joinWith }) {
        let numCaptures = 0;
        return regexps.map((regex) => {
          numCaptures += 1;
          const offset = numCaptures;
          let re = source(regex);
          let out = "";
          while (re.length > 0) {
            const match = BACKREF_RE.exec(re);
            if (!match) {
              out += re;
              break;
            }
            out += re.substring(0, match.index);
            re = re.substring(match.index + match[0].length);
            if (match[0][0] === "\\" && match[1]) {
              out += "\\" + String(Number(match[1]) + offset);
            } else {
              out += match[0];
              if (match[0] === "(") {
                numCaptures++;
              }
            }
          }
          return out;
        }).map((re) => `(${re})`).join(joinWith);
      }
      var MATCH_NOTHING_RE = /\b\B/;
      var IDENT_RE = "[a-zA-Z]\\w*";
      var UNDERSCORE_IDENT_RE = "[a-zA-Z_]\\w*";
      var NUMBER_RE = "\\b\\d+(\\.\\d+)?";
      var C_NUMBER_RE = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";
      var BINARY_NUMBER_RE = "\\b(0b[01]+)";
      var RE_STARTERS_RE = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";
      var SHEBANG = (opts = {}) => {
        const beginShebang = /^#![ ]*\//;
        if (opts.binary) {
          opts.begin = concat(
            beginShebang,
            /.*\b/,
            opts.binary,
            /\b.*/
          );
        }
        return inherit$1({
          scope: "meta",
          begin: beginShebang,
          end: /$/,
          relevance: 0,
          /** @type {ModeCallback} */
          "on:begin": (m, resp) => {
            if (m.index !== 0) resp.ignoreMatch();
          }
        }, opts);
      };
      var BACKSLASH_ESCAPE = {
        begin: "\\\\[\\s\\S]",
        relevance: 0
      };
      var APOS_STRING_MODE = {
        scope: "string",
        begin: "'",
        end: "'",
        illegal: "\\n",
        contains: [BACKSLASH_ESCAPE]
      };
      var QUOTE_STRING_MODE = {
        scope: "string",
        begin: '"',
        end: '"',
        illegal: "\\n",
        contains: [BACKSLASH_ESCAPE]
      };
      var PHRASAL_WORDS_MODE = {
        begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
      };
      var COMMENT = function(begin, end, modeOptions = {}) {
        const mode = inherit$1(
          {
            scope: "comment",
            begin,
            end,
            contains: []
          },
          modeOptions
        );
        mode.contains.push({
          scope: "doctag",
          // hack to avoid the space from being included. the space is necessary to
          // match here to prevent the plain text rule below from gobbling up doctags
          begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
          end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
          excludeBegin: true,
          relevance: 0
        });
        const ENGLISH_WORD = either(
          // list of common 1 and 2 letter words in English
          "I",
          "a",
          "is",
          "so",
          "us",
          "to",
          "at",
          "if",
          "in",
          "it",
          "on",
          // note: this is not an exhaustive list of contractions, just popular ones
          /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
          // contractions - can't we'd they're let's, etc
          /[A-Za-z]+[-][a-z]+/,
          // `no-way`, etc.
          /[A-Za-z][a-z]{2,}/
          // allow capitalized words at beginning of sentences
        );
        mode.contains.push(
          {
            // TODO: how to include ", (, ) without breaking grammars that use these for
            // comment delimiters?
            // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
            // ---
            // this tries to find sequences of 3 english words in a row (without any
            // "programming" type syntax) this gives us a strong signal that we've
            // TRULY found a comment - vs perhaps scanning with the wrong language.
            // It's possible to find something that LOOKS like the start of the
            // comment - but then if there is no readable text - good chance it is a
            // false match and not a comment.
            //
            // for a visual example please see:
            // https://github.com/highlightjs/highlight.js/issues/2827
            begin: concat(
              /[ ]+/,
              // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
              "(",
              ENGLISH_WORD,
              /[.]?[:]?([.][ ]|[ ])/,
              "){3}"
            )
            // look for 3 words in a row
          }
        );
        return mode;
      };
      var C_LINE_COMMENT_MODE = COMMENT("//", "$");
      var C_BLOCK_COMMENT_MODE = COMMENT("/\\*", "\\*/");
      var HASH_COMMENT_MODE = COMMENT("#", "$");
      var NUMBER_MODE = {
        scope: "number",
        begin: NUMBER_RE,
        relevance: 0
      };
      var C_NUMBER_MODE = {
        scope: "number",
        begin: C_NUMBER_RE,
        relevance: 0
      };
      var BINARY_NUMBER_MODE = {
        scope: "number",
        begin: BINARY_NUMBER_RE,
        relevance: 0
      };
      var REGEXP_MODE = {
        scope: "regexp",
        begin: /\/(?=[^/\n]*\/)/,
        end: /\/[gimuy]*/,
        contains: [
          BACKSLASH_ESCAPE,
          {
            begin: /\[/,
            end: /\]/,
            relevance: 0,
            contains: [BACKSLASH_ESCAPE]
          }
        ]
      };
      var TITLE_MODE = {
        scope: "title",
        begin: IDENT_RE,
        relevance: 0
      };
      var UNDERSCORE_TITLE_MODE = {
        scope: "title",
        begin: UNDERSCORE_IDENT_RE,
        relevance: 0
      };
      var METHOD_GUARD = {
        // excludes method names from keyword processing
        begin: "\\.\\s*" + UNDERSCORE_IDENT_RE,
        relevance: 0
      };
      var END_SAME_AS_BEGIN = function(mode) {
        return Object.assign(
          mode,
          {
            /** @type {ModeCallback} */
            "on:begin": (m, resp) => {
              resp.data._beginMatch = m[1];
            },
            /** @type {ModeCallback} */
            "on:end": (m, resp) => {
              if (resp.data._beginMatch !== m[1]) resp.ignoreMatch();
            }
          }
        );
      };
      var MODES = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        APOS_STRING_MODE,
        BACKSLASH_ESCAPE,
        BINARY_NUMBER_MODE,
        BINARY_NUMBER_RE,
        COMMENT,
        C_BLOCK_COMMENT_MODE,
        C_LINE_COMMENT_MODE,
        C_NUMBER_MODE,
        C_NUMBER_RE,
        END_SAME_AS_BEGIN,
        HASH_COMMENT_MODE,
        IDENT_RE,
        MATCH_NOTHING_RE,
        METHOD_GUARD,
        NUMBER_MODE,
        NUMBER_RE,
        PHRASAL_WORDS_MODE,
        QUOTE_STRING_MODE,
        REGEXP_MODE,
        RE_STARTERS_RE,
        SHEBANG,
        TITLE_MODE,
        UNDERSCORE_IDENT_RE,
        UNDERSCORE_TITLE_MODE
      });
      function skipIfHasPrecedingDot(match, response) {
        const before = match.input[match.index - 1];
        if (before === ".") {
          response.ignoreMatch();
        }
      }
      function scopeClassName(mode, _parent) {
        if (mode.className !== void 0) {
          mode.scope = mode.className;
          delete mode.className;
        }
      }
      function beginKeywords(mode, parent) {
        if (!parent) return;
        if (!mode.beginKeywords) return;
        mode.begin = "\\b(" + mode.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)";
        mode.__beforeBegin = skipIfHasPrecedingDot;
        mode.keywords = mode.keywords || mode.beginKeywords;
        delete mode.beginKeywords;
        if (mode.relevance === void 0) mode.relevance = 0;
      }
      function compileIllegal(mode, _parent) {
        if (!Array.isArray(mode.illegal)) return;
        mode.illegal = either(...mode.illegal);
      }
      function compileMatch(mode, _parent) {
        if (!mode.match) return;
        if (mode.begin || mode.end) throw new Error("begin & end are not supported with match");
        mode.begin = mode.match;
        delete mode.match;
      }
      function compileRelevance(mode, _parent) {
        if (mode.relevance === void 0) mode.relevance = 1;
      }
      var beforeMatchExt = (mode, parent) => {
        if (!mode.beforeMatch) return;
        if (mode.starts) throw new Error("beforeMatch cannot be used with starts");
        const originalMode = Object.assign({}, mode);
        Object.keys(mode).forEach((key) => {
          delete mode[key];
        });
        mode.keywords = originalMode.keywords;
        mode.begin = concat(originalMode.beforeMatch, lookahead(originalMode.begin));
        mode.starts = {
          relevance: 0,
          contains: [
            Object.assign(originalMode, { endsParent: true })
          ]
        };
        mode.relevance = 0;
        delete originalMode.beforeMatch;
      };
      var COMMON_KEYWORDS = [
        "of",
        "and",
        "for",
        "in",
        "not",
        "or",
        "if",
        "then",
        "parent",
        // common variable name
        "list",
        // common variable name
        "value"
        // common variable name
      ];
      var DEFAULT_KEYWORD_SCOPE = "keyword";
      function compileKeywords(rawKeywords, caseInsensitive, scopeName = DEFAULT_KEYWORD_SCOPE) {
        const compiledKeywords = /* @__PURE__ */ Object.create(null);
        if (typeof rawKeywords === "string") {
          compileList(scopeName, rawKeywords.split(" "));
        } else if (Array.isArray(rawKeywords)) {
          compileList(scopeName, rawKeywords);
        } else {
          Object.keys(rawKeywords).forEach(function(scopeName2) {
            Object.assign(
              compiledKeywords,
              compileKeywords(rawKeywords[scopeName2], caseInsensitive, scopeName2)
            );
          });
        }
        return compiledKeywords;
        function compileList(scopeName2, keywordList) {
          if (caseInsensitive) {
            keywordList = keywordList.map((x) => x.toLowerCase());
          }
          keywordList.forEach(function(keyword) {
            const pair = keyword.split("|");
            compiledKeywords[pair[0]] = [scopeName2, scoreForKeyword(pair[0], pair[1])];
          });
        }
      }
      function scoreForKeyword(keyword, providedScore) {
        if (providedScore) {
          return Number(providedScore);
        }
        return commonKeyword(keyword) ? 0 : 1;
      }
      function commonKeyword(keyword) {
        return COMMON_KEYWORDS.includes(keyword.toLowerCase());
      }
      var seenDeprecations = {};
      var error2 = (message) => {
        console.error(message);
      };
      var warn = (message, ...args) => {
        console.log(`WARN: ${message}`, ...args);
      };
      var deprecated = (version2, message) => {
        if (seenDeprecations[`${version2}/${message}`]) return;
        console.log(`Deprecated as of ${version2}. ${message}`);
        seenDeprecations[`${version2}/${message}`] = true;
      };
      var MultiClassError = new Error();
      function remapScopeNames(mode, regexes, { key }) {
        let offset = 0;
        const scopeNames = mode[key];
        const emit = {};
        const positions = {};
        for (let i = 1; i <= regexes.length; i++) {
          positions[i + offset] = scopeNames[i];
          emit[i + offset] = true;
          offset += countMatchGroups(regexes[i - 1]);
        }
        mode[key] = positions;
        mode[key]._emit = emit;
        mode[key]._multi = true;
      }
      function beginMultiClass(mode) {
        if (!Array.isArray(mode.begin)) return;
        if (mode.skip || mode.excludeBegin || mode.returnBegin) {
          error2("skip, excludeBegin, returnBegin not compatible with beginScope: {}");
          throw MultiClassError;
        }
        if (typeof mode.beginScope !== "object" || mode.beginScope === null) {
          error2("beginScope must be object");
          throw MultiClassError;
        }
        remapScopeNames(mode, mode.begin, { key: "beginScope" });
        mode.begin = _rewriteBackreferences(mode.begin, { joinWith: "" });
      }
      function endMultiClass(mode) {
        if (!Array.isArray(mode.end)) return;
        if (mode.skip || mode.excludeEnd || mode.returnEnd) {
          error2("skip, excludeEnd, returnEnd not compatible with endScope: {}");
          throw MultiClassError;
        }
        if (typeof mode.endScope !== "object" || mode.endScope === null) {
          error2("endScope must be object");
          throw MultiClassError;
        }
        remapScopeNames(mode, mode.end, { key: "endScope" });
        mode.end = _rewriteBackreferences(mode.end, { joinWith: "" });
      }
      function scopeSugar(mode) {
        if (mode.scope && typeof mode.scope === "object" && mode.scope !== null) {
          mode.beginScope = mode.scope;
          delete mode.scope;
        }
      }
      function MultiClass(mode) {
        scopeSugar(mode);
        if (typeof mode.beginScope === "string") {
          mode.beginScope = { _wrap: mode.beginScope };
        }
        if (typeof mode.endScope === "string") {
          mode.endScope = { _wrap: mode.endScope };
        }
        beginMultiClass(mode);
        endMultiClass(mode);
      }
      function compileLanguage(language) {
        function langRe(value, global) {
          return new RegExp(
            source(value),
            "m" + (language.case_insensitive ? "i" : "") + (language.unicodeRegex ? "u" : "") + (global ? "g" : "")
          );
        }
        class MultiRegex {
          constructor() {
            this.matchIndexes = {};
            this.regexes = [];
            this.matchAt = 1;
            this.position = 0;
          }
          // @ts-ignore
          addRule(re, opts) {
            opts.position = this.position++;
            this.matchIndexes[this.matchAt] = opts;
            this.regexes.push([opts, re]);
            this.matchAt += countMatchGroups(re) + 1;
          }
          compile() {
            if (this.regexes.length === 0) {
              this.exec = () => null;
            }
            const terminators = this.regexes.map((el) => el[1]);
            this.matcherRe = langRe(_rewriteBackreferences(terminators, { joinWith: "|" }), true);
            this.lastIndex = 0;
          }
          /** @param {string} s */
          exec(s) {
            this.matcherRe.lastIndex = this.lastIndex;
            const match = this.matcherRe.exec(s);
            if (!match) {
              return null;
            }
            const i = match.findIndex((el, i2) => i2 > 0 && el !== void 0);
            const matchData = this.matchIndexes[i];
            match.splice(0, i);
            return Object.assign(match, matchData);
          }
        }
        class ResumableMultiRegex {
          constructor() {
            this.rules = [];
            this.multiRegexes = [];
            this.count = 0;
            this.lastIndex = 0;
            this.regexIndex = 0;
          }
          // @ts-ignore
          getMatcher(index) {
            if (this.multiRegexes[index]) return this.multiRegexes[index];
            const matcher = new MultiRegex();
            this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
            matcher.compile();
            this.multiRegexes[index] = matcher;
            return matcher;
          }
          resumingScanAtSamePosition() {
            return this.regexIndex !== 0;
          }
          considerAll() {
            this.regexIndex = 0;
          }
          // @ts-ignore
          addRule(re, opts) {
            this.rules.push([re, opts]);
            if (opts.type === "begin") this.count++;
          }
          /** @param {string} s */
          exec(s) {
            const m = this.getMatcher(this.regexIndex);
            m.lastIndex = this.lastIndex;
            let result = m.exec(s);
            if (this.resumingScanAtSamePosition()) {
              if (result && result.index === this.lastIndex) ;
              else {
                const m2 = this.getMatcher(0);
                m2.lastIndex = this.lastIndex + 1;
                result = m2.exec(s);
              }
            }
            if (result) {
              this.regexIndex += result.position + 1;
              if (this.regexIndex === this.count) {
                this.considerAll();
              }
            }
            return result;
          }
        }
        function buildModeRegex(mode) {
          const mm = new ResumableMultiRegex();
          mode.contains.forEach((term) => mm.addRule(term.begin, { rule: term, type: "begin" }));
          if (mode.terminatorEnd) {
            mm.addRule(mode.terminatorEnd, { type: "end" });
          }
          if (mode.illegal) {
            mm.addRule(mode.illegal, { type: "illegal" });
          }
          return mm;
        }
        function compileMode(mode, parent) {
          const cmode = (
            /** @type CompiledMode */
            mode
          );
          if (mode.isCompiled) return cmode;
          [
            scopeClassName,
            // do this early so compiler extensions generally don't have to worry about
            // the distinction between match/begin
            compileMatch,
            MultiClass,
            beforeMatchExt
          ].forEach((ext) => ext(mode, parent));
          language.compilerExtensions.forEach((ext) => ext(mode, parent));
          mode.__beforeBegin = null;
          [
            beginKeywords,
            // do this later so compiler extensions that come earlier have access to the
            // raw array if they wanted to perhaps manipulate it, etc.
            compileIllegal,
            // default to 1 relevance if not specified
            compileRelevance
          ].forEach((ext) => ext(mode, parent));
          mode.isCompiled = true;
          let keywordPattern = null;
          if (typeof mode.keywords === "object" && mode.keywords.$pattern) {
            mode.keywords = Object.assign({}, mode.keywords);
            keywordPattern = mode.keywords.$pattern;
            delete mode.keywords.$pattern;
          }
          keywordPattern = keywordPattern || /\w+/;
          if (mode.keywords) {
            mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
          }
          cmode.keywordPatternRe = langRe(keywordPattern, true);
          if (parent) {
            if (!mode.begin) mode.begin = /\B|\b/;
            cmode.beginRe = langRe(cmode.begin);
            if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
            if (mode.end) cmode.endRe = langRe(cmode.end);
            cmode.terminatorEnd = source(cmode.end) || "";
            if (mode.endsWithParent && parent.terminatorEnd) {
              cmode.terminatorEnd += (mode.end ? "|" : "") + parent.terminatorEnd;
            }
          }
          if (mode.illegal) cmode.illegalRe = langRe(
            /** @type {RegExp | string} */
            mode.illegal
          );
          if (!mode.contains) mode.contains = [];
          mode.contains = [].concat(...mode.contains.map(function(c) {
            return expandOrCloneMode(c === "self" ? mode : c);
          }));
          mode.contains.forEach(function(c) {
            compileMode(
              /** @type Mode */
              c,
              cmode
            );
          });
          if (mode.starts) {
            compileMode(mode.starts, parent);
          }
          cmode.matcher = buildModeRegex(cmode);
          return cmode;
        }
        if (!language.compilerExtensions) language.compilerExtensions = [];
        if (language.contains && language.contains.includes("self")) {
          throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
        }
        language.classNameAliases = inherit$1(language.classNameAliases || {});
        return compileMode(
          /** @type Mode */
          language
        );
      }
      function dependencyOnParent(mode) {
        if (!mode) return false;
        return mode.endsWithParent || dependencyOnParent(mode.starts);
      }
      function expandOrCloneMode(mode) {
        if (mode.variants && !mode.cachedVariants) {
          mode.cachedVariants = mode.variants.map(function(variant) {
            return inherit$1(mode, { variants: null }, variant);
          });
        }
        if (mode.cachedVariants) {
          return mode.cachedVariants;
        }
        if (dependencyOnParent(mode)) {
          return inherit$1(mode, { starts: mode.starts ? inherit$1(mode.starts) : null });
        }
        if (Object.isFrozen(mode)) {
          return inherit$1(mode);
        }
        return mode;
      }
      var version = "11.9.0";
      var HTMLInjectionError = class extends Error {
        constructor(reason, html) {
          super(reason);
          this.name = "HTMLInjectionError";
          this.html = html;
        }
      };
      var escape = escapeHTML;
      var inherit = inherit$1;
      var NO_MATCH = Symbol("nomatch");
      var MAX_KEYWORD_HITS = 7;
      var HLJS = function(hljs) {
        const languages = /* @__PURE__ */ Object.create(null);
        const aliases = /* @__PURE__ */ Object.create(null);
        const plugins = [];
        let SAFE_MODE = true;
        const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
        const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: "Plain text", contains: [] };
        let options = {
          ignoreUnescapedHTML: false,
          throwUnescapedHTML: false,
          noHighlightRe: /^(no-?highlight)$/i,
          languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
          classPrefix: "hljs-",
          cssSelector: "pre code",
          languages: null,
          // beta configuration options, subject to change, welcome to discuss
          // https://github.com/highlightjs/highlight.js/issues/1086
          __emitter: TokenTreeEmitter
        };
        function shouldNotHighlight(languageName) {
          return options.noHighlightRe.test(languageName);
        }
        function blockLanguage(block) {
          let classes = block.className + " ";
          classes += block.parentNode ? block.parentNode.className : "";
          const match = options.languageDetectRe.exec(classes);
          if (match) {
            const language = getLanguage(match[1]);
            if (!language) {
              warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
              warn("Falling back to no-highlight mode for this block.", block);
            }
            return language ? match[1] : "no-highlight";
          }
          return classes.split(/\s+/).find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
        }
        function highlight2(codeOrLanguageName, optionsOrCode, ignoreIllegals) {
          let code = "";
          let languageName = "";
          if (typeof optionsOrCode === "object") {
            code = codeOrLanguageName;
            ignoreIllegals = optionsOrCode.ignoreIllegals;
            languageName = optionsOrCode.language;
          } else {
            deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
            deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
            languageName = codeOrLanguageName;
            code = optionsOrCode;
          }
          if (ignoreIllegals === void 0) {
            ignoreIllegals = true;
          }
          const context = {
            code,
            language: languageName
          };
          fire("before:highlight", context);
          const result = context.result ? context.result : _highlight(context.language, context.code, ignoreIllegals);
          result.code = context.code;
          fire("after:highlight", result);
          return result;
        }
        function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
          const keywordHits = /* @__PURE__ */ Object.create(null);
          function keywordData(mode, matchText) {
            return mode.keywords[matchText];
          }
          function processKeywords() {
            if (!top.keywords) {
              emitter.addText(modeBuffer);
              return;
            }
            let lastIndex = 0;
            top.keywordPatternRe.lastIndex = 0;
            let match = top.keywordPatternRe.exec(modeBuffer);
            let buf = "";
            while (match) {
              buf += modeBuffer.substring(lastIndex, match.index);
              const word = language.case_insensitive ? match[0].toLowerCase() : match[0];
              const data = keywordData(top, word);
              if (data) {
                const [kind, keywordRelevance] = data;
                emitter.addText(buf);
                buf = "";
                keywordHits[word] = (keywordHits[word] || 0) + 1;
                if (keywordHits[word] <= MAX_KEYWORD_HITS) relevance += keywordRelevance;
                if (kind.startsWith("_")) {
                  buf += match[0];
                } else {
                  const cssClass = language.classNameAliases[kind] || kind;
                  emitKeyword(match[0], cssClass);
                }
              } else {
                buf += match[0];
              }
              lastIndex = top.keywordPatternRe.lastIndex;
              match = top.keywordPatternRe.exec(modeBuffer);
            }
            buf += modeBuffer.substring(lastIndex);
            emitter.addText(buf);
          }
          function processSubLanguage() {
            if (modeBuffer === "") return;
            let result2 = null;
            if (typeof top.subLanguage === "string") {
              if (!languages[top.subLanguage]) {
                emitter.addText(modeBuffer);
                return;
              }
              result2 = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
              continuations[top.subLanguage] = /** @type {CompiledMode} */
              result2._top;
            } else {
              result2 = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
            }
            if (top.relevance > 0) {
              relevance += result2.relevance;
            }
            emitter.__addSublanguage(result2._emitter, result2.language);
          }
          function processBuffer() {
            if (top.subLanguage != null) {
              processSubLanguage();
            } else {
              processKeywords();
            }
            modeBuffer = "";
          }
          function emitKeyword(keyword, scope) {
            if (keyword === "") return;
            emitter.startScope(scope);
            emitter.addText(keyword);
            emitter.endScope();
          }
          function emitMultiClass(scope, match) {
            let i = 1;
            const max = match.length - 1;
            while (i <= max) {
              if (!scope._emit[i]) {
                i++;
                continue;
              }
              const klass = language.classNameAliases[scope[i]] || scope[i];
              const text = match[i];
              if (klass) {
                emitKeyword(text, klass);
              } else {
                modeBuffer = text;
                processKeywords();
                modeBuffer = "";
              }
              i++;
            }
          }
          function startNewMode(mode, match) {
            if (mode.scope && typeof mode.scope === "string") {
              emitter.openNode(language.classNameAliases[mode.scope] || mode.scope);
            }
            if (mode.beginScope) {
              if (mode.beginScope._wrap) {
                emitKeyword(modeBuffer, language.classNameAliases[mode.beginScope._wrap] || mode.beginScope._wrap);
                modeBuffer = "";
              } else if (mode.beginScope._multi) {
                emitMultiClass(mode.beginScope, match);
                modeBuffer = "";
              }
            }
            top = Object.create(mode, { parent: { value: top } });
            return top;
          }
          function endOfMode(mode, match, matchPlusRemainder) {
            let matched = startsWith(mode.endRe, matchPlusRemainder);
            if (matched) {
              if (mode["on:end"]) {
                const resp = new Response2(mode);
                mode["on:end"](match, resp);
                if (resp.isMatchIgnored) matched = false;
              }
              if (matched) {
                while (mode.endsParent && mode.parent) {
                  mode = mode.parent;
                }
                return mode;
              }
            }
            if (mode.endsWithParent) {
              return endOfMode(mode.parent, match, matchPlusRemainder);
            }
          }
          function doIgnore(lexeme) {
            if (top.matcher.regexIndex === 0) {
              modeBuffer += lexeme[0];
              return 1;
            } else {
              resumeScanAtSamePosition = true;
              return 0;
            }
          }
          function doBeginMatch(match) {
            const lexeme = match[0];
            const newMode = match.rule;
            const resp = new Response2(newMode);
            const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
            for (const cb of beforeCallbacks) {
              if (!cb) continue;
              cb(match, resp);
              if (resp.isMatchIgnored) return doIgnore(lexeme);
            }
            if (newMode.skip) {
              modeBuffer += lexeme;
            } else {
              if (newMode.excludeBegin) {
                modeBuffer += lexeme;
              }
              processBuffer();
              if (!newMode.returnBegin && !newMode.excludeBegin) {
                modeBuffer = lexeme;
              }
            }
            startNewMode(newMode, match);
            return newMode.returnBegin ? 0 : lexeme.length;
          }
          function doEndMatch(match) {
            const lexeme = match[0];
            const matchPlusRemainder = codeToHighlight.substring(match.index);
            const endMode = endOfMode(top, match, matchPlusRemainder);
            if (!endMode) {
              return NO_MATCH;
            }
            const origin = top;
            if (top.endScope && top.endScope._wrap) {
              processBuffer();
              emitKeyword(lexeme, top.endScope._wrap);
            } else if (top.endScope && top.endScope._multi) {
              processBuffer();
              emitMultiClass(top.endScope, match);
            } else if (origin.skip) {
              modeBuffer += lexeme;
            } else {
              if (!(origin.returnEnd || origin.excludeEnd)) {
                modeBuffer += lexeme;
              }
              processBuffer();
              if (origin.excludeEnd) {
                modeBuffer = lexeme;
              }
            }
            do {
              if (top.scope) {
                emitter.closeNode();
              }
              if (!top.skip && !top.subLanguage) {
                relevance += top.relevance;
              }
              top = top.parent;
            } while (top !== endMode.parent);
            if (endMode.starts) {
              startNewMode(endMode.starts, match);
            }
            return origin.returnEnd ? 0 : lexeme.length;
          }
          function processContinuations() {
            const list = [];
            for (let current = top; current !== language; current = current.parent) {
              if (current.scope) {
                list.unshift(current.scope);
              }
            }
            list.forEach((item) => emitter.openNode(item));
          }
          let lastMatch = {};
          function processLexeme(textBeforeMatch, match) {
            const lexeme = match && match[0];
            modeBuffer += textBeforeMatch;
            if (lexeme == null) {
              processBuffer();
              return 0;
            }
            if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
              modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
              if (!SAFE_MODE) {
                const err = new Error(`0 width match regex (${languageName})`);
                err.languageName = languageName;
                err.badRule = lastMatch.rule;
                throw err;
              }
              return 1;
            }
            lastMatch = match;
            if (match.type === "begin") {
              return doBeginMatch(match);
            } else if (match.type === "illegal" && !ignoreIllegals) {
              const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.scope || "<unnamed>") + '"');
              err.mode = top;
              throw err;
            } else if (match.type === "end") {
              const processed = doEndMatch(match);
              if (processed !== NO_MATCH) {
                return processed;
              }
            }
            if (match.type === "illegal" && lexeme === "") {
              return 1;
            }
            if (iterations > 1e5 && iterations > match.index * 3) {
              const err = new Error("potential infinite loop, way more iterations than matches");
              throw err;
            }
            modeBuffer += lexeme;
            return lexeme.length;
          }
          const language = getLanguage(languageName);
          if (!language) {
            error2(LANGUAGE_NOT_FOUND.replace("{}", languageName));
            throw new Error('Unknown language: "' + languageName + '"');
          }
          const md = compileLanguage(language);
          let result = "";
          let top = continuation || md;
          const continuations = {};
          const emitter = new options.__emitter(options);
          processContinuations();
          let modeBuffer = "";
          let relevance = 0;
          let index = 0;
          let iterations = 0;
          let resumeScanAtSamePosition = false;
          try {
            if (!language.__emitTokens) {
              top.matcher.considerAll();
              for (; ; ) {
                iterations++;
                if (resumeScanAtSamePosition) {
                  resumeScanAtSamePosition = false;
                } else {
                  top.matcher.considerAll();
                }
                top.matcher.lastIndex = index;
                const match = top.matcher.exec(codeToHighlight);
                if (!match) break;
                const beforeMatch = codeToHighlight.substring(index, match.index);
                const processedCount = processLexeme(beforeMatch, match);
                index = match.index + processedCount;
              }
              processLexeme(codeToHighlight.substring(index));
            } else {
              language.__emitTokens(codeToHighlight, emitter);
            }
            emitter.finalize();
            result = emitter.toHTML();
            return {
              language: languageName,
              value: result,
              relevance,
              illegal: false,
              _emitter: emitter,
              _top: top
            };
          } catch (err) {
            if (err.message && err.message.includes("Illegal")) {
              return {
                language: languageName,
                value: escape(codeToHighlight),
                illegal: true,
                relevance: 0,
                _illegalBy: {
                  message: err.message,
                  index,
                  context: codeToHighlight.slice(index - 100, index + 100),
                  mode: err.mode,
                  resultSoFar: result
                },
                _emitter: emitter
              };
            } else if (SAFE_MODE) {
              return {
                language: languageName,
                value: escape(codeToHighlight),
                illegal: false,
                relevance: 0,
                errorRaised: err,
                _emitter: emitter,
                _top: top
              };
            } else {
              throw err;
            }
          }
        }
        function justTextHighlightResult(code) {
          const result = {
            value: escape(code),
            illegal: false,
            relevance: 0,
            _top: PLAINTEXT_LANGUAGE,
            _emitter: new options.__emitter(options)
          };
          result._emitter.addText(code);
          return result;
        }
        function highlightAuto(code, languageSubset) {
          languageSubset = languageSubset || options.languages || Object.keys(languages);
          const plaintext = justTextHighlightResult(code);
          const results = languageSubset.filter(getLanguage).filter(autoDetection).map(
            (name) => _highlight(name, code, false)
          );
          results.unshift(plaintext);
          const sorted = results.sort((a, b) => {
            if (a.relevance !== b.relevance) return b.relevance - a.relevance;
            if (a.language && b.language) {
              if (getLanguage(a.language).supersetOf === b.language) {
                return 1;
              } else if (getLanguage(b.language).supersetOf === a.language) {
                return -1;
              }
            }
            return 0;
          });
          const [best, secondBest] = sorted;
          const result = best;
          result.secondBest = secondBest;
          return result;
        }
        function updateClassName(element, currentLang, resultLang) {
          const language = currentLang && aliases[currentLang] || resultLang;
          element.classList.add("hljs");
          element.classList.add(`language-${language}`);
        }
        function highlightElement(element) {
          let node = null;
          const language = blockLanguage(element);
          if (shouldNotHighlight(language)) return;
          fire(
            "before:highlightElement",
            { el: element, language }
          );
          if (element.dataset.highlighted) {
            console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", element);
            return;
          }
          if (element.children.length > 0) {
            if (!options.ignoreUnescapedHTML) {
              console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk.");
              console.warn("https://github.com/highlightjs/highlight.js/wiki/security");
              console.warn("The element with unescaped HTML:");
              console.warn(element);
            }
            if (options.throwUnescapedHTML) {
              const err = new HTMLInjectionError(
                "One of your code blocks includes unescaped HTML.",
                element.innerHTML
              );
              throw err;
            }
          }
          node = element;
          const text = node.textContent;
          const result = language ? highlight2(text, { language, ignoreIllegals: true }) : highlightAuto(text);
          element.innerHTML = result.value;
          element.dataset.highlighted = "yes";
          updateClassName(element, language, result.language);
          element.result = {
            language: result.language,
            // TODO: remove with version 11.0
            re: result.relevance,
            relevance: result.relevance
          };
          if (result.secondBest) {
            element.secondBest = {
              language: result.secondBest.language,
              relevance: result.secondBest.relevance
            };
          }
          fire("after:highlightElement", { el: element, result, text });
        }
        function configure(userOptions) {
          options = inherit(options, userOptions);
        }
        const initHighlighting = () => {
          highlightAll();
          deprecated("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
        };
        function initHighlightingOnLoad() {
          highlightAll();
          deprecated("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
        }
        let wantsHighlight = false;
        function highlightAll() {
          if (document.readyState === "loading") {
            wantsHighlight = true;
            return;
          }
          const blocks = document.querySelectorAll(options.cssSelector);
          blocks.forEach(highlightElement);
        }
        function boot() {
          if (wantsHighlight) highlightAll();
        }
        if (typeof window !== "undefined" && window.addEventListener) {
          window.addEventListener("DOMContentLoaded", boot, false);
        }
        function registerLanguage(languageName, languageDefinition) {
          let lang = null;
          try {
            lang = languageDefinition(hljs);
          } catch (error$1) {
            error2("Language definition for '{}' could not be registered.".replace("{}", languageName));
            if (!SAFE_MODE) {
              throw error$1;
            } else {
              error2(error$1);
            }
            lang = PLAINTEXT_LANGUAGE;
          }
          if (!lang.name) lang.name = languageName;
          languages[languageName] = lang;
          lang.rawDefinition = languageDefinition.bind(null, hljs);
          if (lang.aliases) {
            registerAliases(lang.aliases, { languageName });
          }
        }
        function unregisterLanguage(languageName) {
          delete languages[languageName];
          for (const alias of Object.keys(aliases)) {
            if (aliases[alias] === languageName) {
              delete aliases[alias];
            }
          }
        }
        function listLanguages() {
          return Object.keys(languages);
        }
        function getLanguage(name) {
          name = (name || "").toLowerCase();
          return languages[name] || languages[aliases[name]];
        }
        function registerAliases(aliasList, { languageName }) {
          if (typeof aliasList === "string") {
            aliasList = [aliasList];
          }
          aliasList.forEach((alias) => {
            aliases[alias.toLowerCase()] = languageName;
          });
        }
        function autoDetection(name) {
          const lang = getLanguage(name);
          return lang && !lang.disableAutodetect;
        }
        function upgradePluginAPI(plugin) {
          if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
            plugin["before:highlightElement"] = (data) => {
              plugin["before:highlightBlock"](
                Object.assign({ block: data.el }, data)
              );
            };
          }
          if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
            plugin["after:highlightElement"] = (data) => {
              plugin["after:highlightBlock"](
                Object.assign({ block: data.el }, data)
              );
            };
          }
        }
        function addPlugin(plugin) {
          upgradePluginAPI(plugin);
          plugins.push(plugin);
        }
        function removePlugin(plugin) {
          const index = plugins.indexOf(plugin);
          if (index !== -1) {
            plugins.splice(index, 1);
          }
        }
        function fire(event, args) {
          const cb = event;
          plugins.forEach(function(plugin) {
            if (plugin[cb]) {
              plugin[cb](args);
            }
          });
        }
        function deprecateHighlightBlock(el) {
          deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
          deprecated("10.7.0", "Please use highlightElement now.");
          return highlightElement(el);
        }
        Object.assign(hljs, {
          highlight: highlight2,
          highlightAuto,
          highlightAll,
          highlightElement,
          // TODO: Remove with v12 API
          highlightBlock: deprecateHighlightBlock,
          configure,
          initHighlighting,
          initHighlightingOnLoad,
          registerLanguage,
          unregisterLanguage,
          listLanguages,
          getLanguage,
          registerAliases,
          autoDetection,
          inherit,
          addPlugin,
          removePlugin
        });
        hljs.debugMode = function() {
          SAFE_MODE = false;
        };
        hljs.safeMode = function() {
          SAFE_MODE = true;
        };
        hljs.versionString = version;
        hljs.regex = {
          concat,
          lookahead,
          either,
          optional,
          anyNumberOfTimes
        };
        for (const key in MODES) {
          if (typeof MODES[key] === "object") {
            deepFreeze(MODES[key]);
          }
        }
        Object.assign(hljs, MODES);
        return hljs;
      };
      var highlight = HLJS({});
      highlight.newInstance = () => HLJS({});
      module.exports = highlight;
      highlight.HighlightJS = highlight;
      highlight.default = highlight;
    }
  });

  // node_modules/nearley/lib/nearley.js
  var require_nearley = __commonJS({
    "node_modules/nearley/lib/nearley.js"(exports, module) {
      (function(root, factory) {
        if (typeof module === "object" && module.exports) {
          module.exports = factory();
        } else {
          root.nearley = factory();
        }
      })(exports, function() {
        function Rule(name, symbols, postprocess) {
          this.id = ++Rule.highestId;
          this.name = name;
          this.symbols = symbols;
          this.postprocess = postprocess;
          return this;
        }
        Rule.highestId = 0;
        Rule.prototype.toString = function(withCursorAt) {
          var symbolSequence = typeof withCursorAt === "undefined" ? this.symbols.map(getSymbolShortDisplay).join(" ") : this.symbols.slice(0, withCursorAt).map(getSymbolShortDisplay).join(" ") + " \u25CF " + this.symbols.slice(withCursorAt).map(getSymbolShortDisplay).join(" ");
          return this.name + " \u2192 " + symbolSequence;
        };
        function State(rule, dot, reference, wantedBy) {
          this.rule = rule;
          this.dot = dot;
          this.reference = reference;
          this.data = [];
          this.wantedBy = wantedBy;
          this.isComplete = this.dot === rule.symbols.length;
        }
        State.prototype.toString = function() {
          return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
        };
        State.prototype.nextState = function(child) {
          var state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
          state.left = this;
          state.right = child;
          if (state.isComplete) {
            state.data = state.build();
            state.right = void 0;
          }
          return state;
        };
        State.prototype.build = function() {
          var children = [];
          var node = this;
          do {
            children.push(node.right.data);
            node = node.left;
          } while (node.left);
          children.reverse();
          return children;
        };
        State.prototype.finish = function() {
          if (this.rule.postprocess) {
            this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);
          }
        };
        function Column(grammar2, index) {
          this.grammar = grammar2;
          this.index = index;
          this.states = [];
          this.wants = {};
          this.scannable = [];
          this.completed = {};
        }
        Column.prototype.process = function(nextColumn) {
          var states = this.states;
          var wants = this.wants;
          var completed = this.completed;
          for (var w = 0; w < states.length; w++) {
            var state = states[w];
            if (state.isComplete) {
              state.finish();
              if (state.data !== Parser.fail) {
                var wantedBy = state.wantedBy;
                for (var i = wantedBy.length; i--; ) {
                  var left = wantedBy[i];
                  this.complete(left, state);
                }
                if (state.reference === this.index) {
                  var exp = state.rule.name;
                  (this.completed[exp] = this.completed[exp] || []).push(state);
                }
              }
            } else {
              var exp = state.rule.symbols[state.dot];
              if (typeof exp !== "string") {
                this.scannable.push(state);
                continue;
              }
              if (wants[exp]) {
                wants[exp].push(state);
                if (completed.hasOwnProperty(exp)) {
                  var nulls = completed[exp];
                  for (var i = 0; i < nulls.length; i++) {
                    var right = nulls[i];
                    this.complete(state, right);
                  }
                }
              } else {
                wants[exp] = [state];
                this.predict(exp);
              }
            }
          }
        };
        Column.prototype.predict = function(exp) {
          var rules = this.grammar.byName[exp] || [];
          for (var i = 0; i < rules.length; i++) {
            var r = rules[i];
            var wantedBy = this.wants[exp];
            var s = new State(r, 0, this.index, wantedBy);
            this.states.push(s);
          }
        };
        Column.prototype.complete = function(left, right) {
          var copy = left.nextState(right);
          this.states.push(copy);
        };
        function Grammar2(rules, start2) {
          this.rules = rules;
          this.start = start2 || this.rules[0].name;
          var byName = this.byName = {};
          this.rules.forEach(function(rule) {
            if (!byName.hasOwnProperty(rule.name)) {
              byName[rule.name] = [];
            }
            byName[rule.name].push(rule);
          });
        }
        Grammar2.fromCompiled = function(rules, start2) {
          var lexer2 = rules.Lexer;
          if (rules.ParserStart) {
            start2 = rules.ParserStart;
            rules = rules.ParserRules;
          }
          var rules = rules.map(function(r) {
            return new Rule(r.name, r.symbols, r.postprocess);
          });
          var g = new Grammar2(rules, start2);
          g.lexer = lexer2;
          return g;
        };
        function StreamLexer() {
          this.reset("");
        }
        StreamLexer.prototype.reset = function(data, state) {
          this.buffer = data;
          this.index = 0;
          this.line = state ? state.line : 1;
          this.lastLineBreak = state ? -state.col : 0;
        };
        StreamLexer.prototype.next = function() {
          if (this.index < this.buffer.length) {
            var ch = this.buffer[this.index++];
            if (ch === "\n") {
              this.line += 1;
              this.lastLineBreak = this.index;
            }
            return { value: ch };
          }
        };
        StreamLexer.prototype.save = function() {
          return {
            line: this.line,
            col: this.index - this.lastLineBreak
          };
        };
        StreamLexer.prototype.formatError = function(token, message) {
          var buffer = this.buffer;
          if (typeof buffer === "string") {
            var lines = buffer.split("\n").slice(
              Math.max(0, this.line - 5),
              this.line
            );
            var nextLineBreak = buffer.indexOf("\n", this.index);
            if (nextLineBreak === -1) nextLineBreak = buffer.length;
            var col = this.index - this.lastLineBreak;
            var lastLineDigits = String(this.line).length;
            message += " at line " + this.line + " col " + col + ":\n\n";
            message += lines.map(function(line, i) {
              return pad(this.line - lines.length + i + 1, lastLineDigits) + " " + line;
            }, this).join("\n");
            message += "\n" + pad("", lastLineDigits + col) + "^\n";
            return message;
          } else {
            return message + " at index " + (this.index - 1);
          }
          function pad(n, length) {
            var s = String(n);
            return Array(length - s.length + 1).join(" ") + s;
          }
        };
        function Parser(rules, start2, options) {
          if (rules instanceof Grammar2) {
            var grammar2 = rules;
            var options = start2;
          } else {
            var grammar2 = Grammar2.fromCompiled(rules, start2);
          }
          this.grammar = grammar2;
          this.options = {
            keepHistory: false,
            lexer: grammar2.lexer || new StreamLexer()
          };
          for (var key in options || {}) {
            this.options[key] = options[key];
          }
          this.lexer = this.options.lexer;
          this.lexerState = void 0;
          var column = new Column(grammar2, 0);
          var table = this.table = [column];
          column.wants[grammar2.start] = [];
          column.predict(grammar2.start);
          column.process();
          this.current = 0;
        }
        Parser.fail = {};
        Parser.prototype.feed = function(chunk) {
          var lexer2 = this.lexer;
          lexer2.reset(chunk, this.lexerState);
          var token;
          while (true) {
            try {
              token = lexer2.next();
              if (!token) {
                break;
              }
            } catch (e) {
              var nextColumn = new Column(this.grammar, this.current + 1);
              this.table.push(nextColumn);
              var err = new Error(this.reportLexerError(e));
              err.offset = this.current;
              err.token = e.token;
              throw err;
            }
            var column = this.table[this.current];
            if (!this.options.keepHistory) {
              delete this.table[this.current - 1];
            }
            var n = this.current + 1;
            var nextColumn = new Column(this.grammar, n);
            this.table.push(nextColumn);
            var literal = token.text !== void 0 ? token.text : token.value;
            var value = lexer2.constructor === StreamLexer ? token.value : token;
            var scannable = column.scannable;
            for (var w = scannable.length; w--; ) {
              var state = scannable[w];
              var expect = state.rule.symbols[state.dot];
              if (expect.test ? expect.test(value) : expect.type ? expect.type === token.type : expect.literal === literal) {
                var next = state.nextState({ data: value, token, isToken: true, reference: n - 1 });
                nextColumn.states.push(next);
              }
            }
            nextColumn.process();
            if (nextColumn.states.length === 0) {
              var err = new Error(this.reportError(token));
              err.offset = this.current;
              err.token = token;
              throw err;
            }
            if (this.options.keepHistory) {
              column.lexerState = lexer2.save();
            }
            this.current++;
          }
          if (column) {
            this.lexerState = lexer2.save();
          }
          this.results = this.finish();
          return this;
        };
        Parser.prototype.reportLexerError = function(lexerError) {
          var tokenDisplay, lexerMessage;
          var token = lexerError.token;
          if (token) {
            tokenDisplay = "input " + JSON.stringify(token.text[0]) + " (lexer error)";
            lexerMessage = this.lexer.formatError(token, "Syntax error");
          } else {
            tokenDisplay = "input (lexer error)";
            lexerMessage = lexerError.message;
          }
          return this.reportErrorCommon(lexerMessage, tokenDisplay);
        };
        Parser.prototype.reportError = function(token) {
          var tokenDisplay = (token.type ? token.type + " token: " : "") + JSON.stringify(token.value !== void 0 ? token.value : token);
          var lexerMessage = this.lexer.formatError(token, "Syntax error");
          return this.reportErrorCommon(lexerMessage, tokenDisplay);
        };
        Parser.prototype.reportErrorCommon = function(lexerMessage, tokenDisplay) {
          var lines = [];
          lines.push(lexerMessage);
          var lastColumnIndex = this.table.length - 2;
          var lastColumn = this.table[lastColumnIndex];
          var expectantStates = lastColumn.states.filter(function(state) {
            var nextSymbol = state.rule.symbols[state.dot];
            return nextSymbol && typeof nextSymbol !== "string";
          });
          if (expectantStates.length === 0) {
            lines.push("Unexpected " + tokenDisplay + ". I did not expect any more input. Here is the state of my parse table:\n");
            this.displayStateStack(lastColumn.states, lines);
          } else {
            lines.push("Unexpected " + tokenDisplay + ". Instead, I was expecting to see one of the following:\n");
            var stateStacks = expectantStates.map(function(state) {
              return this.buildFirstStateStack(state, []) || [state];
            }, this);
            stateStacks.forEach(function(stateStack) {
              var state = stateStack[0];
              var nextSymbol = state.rule.symbols[state.dot];
              var symbolDisplay = this.getSymbolDisplay(nextSymbol);
              lines.push("A " + symbolDisplay + " based on:");
              this.displayStateStack(stateStack, lines);
            }, this);
          }
          lines.push("");
          return lines.join("\n");
        };
        Parser.prototype.displayStateStack = function(stateStack, lines) {
          var lastDisplay;
          var sameDisplayCount = 0;
          for (var j = 0; j < stateStack.length; j++) {
            var state = stateStack[j];
            var display = state.rule.toString(state.dot);
            if (display === lastDisplay) {
              sameDisplayCount++;
            } else {
              if (sameDisplayCount > 0) {
                lines.push("    ^ " + sameDisplayCount + " more lines identical to this");
              }
              sameDisplayCount = 0;
              lines.push("    " + display);
            }
            lastDisplay = display;
          }
        };
        Parser.prototype.getSymbolDisplay = function(symbol) {
          return getSymbolLongDisplay(symbol);
        };
        Parser.prototype.buildFirstStateStack = function(state, visited) {
          if (visited.indexOf(state) !== -1) {
            return null;
          }
          if (state.wantedBy.length === 0) {
            return [state];
          }
          var prevState = state.wantedBy[0];
          var childVisited = [state].concat(visited);
          var childResult = this.buildFirstStateStack(prevState, childVisited);
          if (childResult === null) {
            return null;
          }
          return [state].concat(childResult);
        };
        Parser.prototype.save = function() {
          var column = this.table[this.current];
          column.lexerState = this.lexerState;
          return column;
        };
        Parser.prototype.restore = function(column) {
          var index = column.index;
          this.current = index;
          this.table[index] = column;
          this.table.splice(index + 1);
          this.lexerState = column.lexerState;
          this.results = this.finish();
        };
        Parser.prototype.rewind = function(index) {
          if (!this.options.keepHistory) {
            throw new Error("set option `keepHistory` to enable rewinding");
          }
          this.restore(this.table[index]);
        };
        Parser.prototype.finish = function() {
          var considerations = [];
          var start2 = this.grammar.start;
          var column = this.table[this.table.length - 1];
          column.states.forEach(function(t) {
            if (t.rule.name === start2 && t.dot === t.rule.symbols.length && t.reference === 0 && t.data !== Parser.fail) {
              considerations.push(t);
            }
          });
          return considerations.map(function(c) {
            return c.data;
          });
        };
        function getSymbolLongDisplay(symbol) {
          var type = typeof symbol;
          if (type === "string") {
            return symbol;
          } else if (type === "object") {
            if (symbol.literal) {
              return JSON.stringify(symbol.literal);
            } else if (symbol instanceof RegExp) {
              return "character matching " + symbol;
            } else if (symbol.type) {
              return symbol.type + " token";
            } else if (symbol.test) {
              return "token matching " + String(symbol.test);
            } else {
              throw new Error("Unknown symbol type: " + symbol);
            }
          }
        }
        function getSymbolShortDisplay(symbol) {
          var type = typeof symbol;
          if (type === "string") {
            return symbol;
          } else if (type === "object") {
            if (symbol.literal) {
              return JSON.stringify(symbol.literal);
            } else if (symbol instanceof RegExp) {
              return symbol.toString();
            } else if (symbol.type) {
              return "%" + symbol.type;
            } else if (symbol.test) {
              return "<" + String(symbol.test) + ">";
            } else {
              throw new Error("Unknown symbol type: " + symbol);
            }
          }
        }
        return {
          Parser,
          Grammar: Grammar2,
          Rule
        };
      });
    }
  });

  // node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js
  var turbo_es2017_esm_exports = {};
  __export(turbo_es2017_esm_exports, {
    FetchEnctype: () => FetchEnctype,
    FetchMethod: () => FetchMethod,
    FetchRequest: () => FetchRequest,
    FetchResponse: () => FetchResponse,
    FrameElement: () => FrameElement,
    FrameLoadingStyle: () => FrameLoadingStyle,
    FrameRenderer: () => FrameRenderer,
    PageRenderer: () => PageRenderer,
    PageSnapshot: () => PageSnapshot,
    StreamActions: () => StreamActions,
    StreamElement: () => StreamElement,
    StreamSourceElement: () => StreamSourceElement,
    cache: () => cache,
    clearCache: () => clearCache,
    connectStreamSource: () => connectStreamSource,
    disconnectStreamSource: () => disconnectStreamSource,
    fetch: () => fetchWithTurboHeaders,
    fetchEnctypeFromString: () => fetchEnctypeFromString,
    fetchMethodFromString: () => fetchMethodFromString,
    isSafe: () => isSafe,
    navigator: () => navigator$1,
    registerAdapter: () => registerAdapter,
    renderStreamMessage: () => renderStreamMessage,
    session: () => session,
    setConfirmMethod: () => setConfirmMethod,
    setFormMode: () => setFormMode,
    setProgressBarDelay: () => setProgressBarDelay,
    start: () => start,
    visit: () => visit
  });
  (function(prototype) {
    if (typeof prototype.requestSubmit == "function") return;
    prototype.requestSubmit = function(submitter) {
      if (submitter) {
        validateSubmitter(submitter, this);
        submitter.click();
      } else {
        submitter = document.createElement("input");
        submitter.type = "submit";
        submitter.hidden = true;
        this.appendChild(submitter);
        submitter.click();
        this.removeChild(submitter);
      }
    };
    function validateSubmitter(submitter, form) {
      submitter instanceof HTMLElement || raise(TypeError, "parameter 1 is not of type 'HTMLElement'");
      submitter.type == "submit" || raise(TypeError, "The specified element is not a submit button");
      submitter.form == form || raise(DOMException, "The specified element is not owned by this form element", "NotFoundError");
    }
    function raise(errorConstructor, message, name) {
      throw new errorConstructor("Failed to execute 'requestSubmit' on 'HTMLFormElement': " + message + ".", name);
    }
  })(HTMLFormElement.prototype);
  var submittersByForm = /* @__PURE__ */ new WeakMap();
  function findSubmitterFromClickTarget(target) {
    const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
    const candidate = element ? element.closest("input, button") : null;
    return candidate?.type == "submit" ? candidate : null;
  }
  function clickCaptured(event) {
    const submitter = findSubmitterFromClickTarget(event.target);
    if (submitter && submitter.form) {
      submittersByForm.set(submitter.form, submitter);
    }
  }
  (function() {
    if ("submitter" in Event.prototype) return;
    let prototype = window.Event.prototype;
    if ("SubmitEvent" in window) {
      const prototypeOfSubmitEvent = window.SubmitEvent.prototype;
      if (/Apple Computer/.test(navigator.vendor) && !("submitter" in prototypeOfSubmitEvent)) {
        prototype = prototypeOfSubmitEvent;
      } else {
        return;
      }
    }
    addEventListener("click", clickCaptured, true);
    Object.defineProperty(prototype, "submitter", {
      get() {
        if (this.type == "submit" && this.target instanceof HTMLFormElement) {
          return submittersByForm.get(this.target);
        }
      }
    });
  })();
  var FrameLoadingStyle = {
    eager: "eager",
    lazy: "lazy"
  };
  var FrameElement = class _FrameElement extends HTMLElement {
    static delegateConstructor = void 0;
    loaded = Promise.resolve();
    static get observedAttributes() {
      return ["disabled", "loading", "src"];
    }
    constructor() {
      super();
      this.delegate = new _FrameElement.delegateConstructor(this);
    }
    connectedCallback() {
      this.delegate.connect();
    }
    disconnectedCallback() {
      this.delegate.disconnect();
    }
    reload() {
      return this.delegate.sourceURLReloaded();
    }
    attributeChangedCallback(name) {
      if (name == "loading") {
        this.delegate.loadingStyleChanged();
      } else if (name == "src") {
        this.delegate.sourceURLChanged();
      } else if (name == "disabled") {
        this.delegate.disabledChanged();
      }
    }
    /**
     * Gets the URL to lazily load source HTML from
     */
    get src() {
      return this.getAttribute("src");
    }
    /**
     * Sets the URL to lazily load source HTML from
     */
    set src(value) {
      if (value) {
        this.setAttribute("src", value);
      } else {
        this.removeAttribute("src");
      }
    }
    /**
     * Gets the refresh mode for the frame.
     */
    get refresh() {
      return this.getAttribute("refresh");
    }
    /**
     * Sets the refresh mode for the frame.
     */
    set refresh(value) {
      if (value) {
        this.setAttribute("refresh", value);
      } else {
        this.removeAttribute("refresh");
      }
    }
    /**
     * Determines if the element is loading
     */
    get loading() {
      return frameLoadingStyleFromString(this.getAttribute("loading") || "");
    }
    /**
     * Sets the value of if the element is loading
     */
    set loading(value) {
      if (value) {
        this.setAttribute("loading", value);
      } else {
        this.removeAttribute("loading");
      }
    }
    /**
     * Gets the disabled state of the frame.
     *
     * If disabled, no requests will be intercepted by the frame.
     */
    get disabled() {
      return this.hasAttribute("disabled");
    }
    /**
     * Sets the disabled state of the frame.
     *
     * If disabled, no requests will be intercepted by the frame.
     */
    set disabled(value) {
      if (value) {
        this.setAttribute("disabled", "");
      } else {
        this.removeAttribute("disabled");
      }
    }
    /**
     * Gets the autoscroll state of the frame.
     *
     * If true, the frame will be scrolled into view automatically on update.
     */
    get autoscroll() {
      return this.hasAttribute("autoscroll");
    }
    /**
     * Sets the autoscroll state of the frame.
     *
     * If true, the frame will be scrolled into view automatically on update.
     */
    set autoscroll(value) {
      if (value) {
        this.setAttribute("autoscroll", "");
      } else {
        this.removeAttribute("autoscroll");
      }
    }
    /**
     * Determines if the element has finished loading
     */
    get complete() {
      return !this.delegate.isLoading;
    }
    /**
     * Gets the active state of the frame.
     *
     * If inactive, source changes will not be observed.
     */
    get isActive() {
      return this.ownerDocument === document && !this.isPreview;
    }
    /**
     * Sets the active state of the frame.
     *
     * If inactive, source changes will not be observed.
     */
    get isPreview() {
      return this.ownerDocument?.documentElement?.hasAttribute("data-turbo-preview");
    }
  };
  function frameLoadingStyleFromString(style) {
    switch (style.toLowerCase()) {
      case "lazy":
        return FrameLoadingStyle.lazy;
      default:
        return FrameLoadingStyle.eager;
    }
  }
  function expandURL(locatable) {
    return new URL(locatable.toString(), document.baseURI);
  }
  function getAnchor(url) {
    let anchorMatch;
    if (url.hash) {
      return url.hash.slice(1);
    } else if (anchorMatch = url.href.match(/#(.*)$/)) {
      return anchorMatch[1];
    }
  }
  function getAction$1(form, submitter) {
    const action = submitter?.getAttribute("formaction") || form.getAttribute("action") || form.action;
    return expandURL(action);
  }
  function getExtension(url) {
    return (getLastPathComponent(url).match(/\.[^.]*$/) || [])[0] || "";
  }
  function isHTML(url) {
    return !!getExtension(url).match(/^(?:|\.(?:htm|html|xhtml|php))$/);
  }
  function isPrefixedBy(baseURL, url) {
    const prefix = getPrefix(url);
    return baseURL.href === expandURL(prefix).href || baseURL.href.startsWith(prefix);
  }
  function locationIsVisitable(location2, rootLocation) {
    return isPrefixedBy(location2, rootLocation) && isHTML(location2);
  }
  function getRequestURL(url) {
    const anchor = getAnchor(url);
    return anchor != null ? url.href.slice(0, -(anchor.length + 1)) : url.href;
  }
  function toCacheKey(url) {
    return getRequestURL(url);
  }
  function urlsAreEqual(left, right) {
    return expandURL(left).href == expandURL(right).href;
  }
  function getPathComponents(url) {
    return url.pathname.split("/").slice(1);
  }
  function getLastPathComponent(url) {
    return getPathComponents(url).slice(-1)[0];
  }
  function getPrefix(url) {
    return addTrailingSlash(url.origin + url.pathname);
  }
  function addTrailingSlash(value) {
    return value.endsWith("/") ? value : value + "/";
  }
  var FetchResponse = class {
    constructor(response) {
      this.response = response;
    }
    get succeeded() {
      return this.response.ok;
    }
    get failed() {
      return !this.succeeded;
    }
    get clientError() {
      return this.statusCode >= 400 && this.statusCode <= 499;
    }
    get serverError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
    get redirected() {
      return this.response.redirected;
    }
    get location() {
      return expandURL(this.response.url);
    }
    get isHTML() {
      return this.contentType && this.contentType.match(/^(?:text\/([^\s;,]+\b)?html|application\/xhtml\+xml)\b/);
    }
    get statusCode() {
      return this.response.status;
    }
    get contentType() {
      return this.header("Content-Type");
    }
    get responseText() {
      return this.response.clone().text();
    }
    get responseHTML() {
      if (this.isHTML) {
        return this.response.clone().text();
      } else {
        return Promise.resolve(void 0);
      }
    }
    header(name) {
      return this.response.headers.get(name);
    }
  };
  function activateScriptElement(element) {
    if (element.getAttribute("data-turbo-eval") == "false") {
      return element;
    } else {
      const createdScriptElement = document.createElement("script");
      const cspNonce = getMetaContent("csp-nonce");
      if (cspNonce) {
        createdScriptElement.nonce = cspNonce;
      }
      createdScriptElement.textContent = element.textContent;
      createdScriptElement.async = false;
      copyElementAttributes(createdScriptElement, element);
      return createdScriptElement;
    }
  }
  function copyElementAttributes(destinationElement, sourceElement) {
    for (const { name, value } of sourceElement.attributes) {
      destinationElement.setAttribute(name, value);
    }
  }
  function createDocumentFragment(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content;
  }
  function dispatch(eventName, { target, cancelable, detail } = {}) {
    const event = new CustomEvent(eventName, {
      cancelable,
      bubbles: true,
      composed: true,
      detail
    });
    if (target && target.isConnected) {
      target.dispatchEvent(event);
    } else {
      document.documentElement.dispatchEvent(event);
    }
    return event;
  }
  function nextRepaint() {
    if (document.visibilityState === "hidden") {
      return nextEventLoopTick();
    } else {
      return nextAnimationFrame();
    }
  }
  function nextAnimationFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }
  function nextEventLoopTick() {
    return new Promise((resolve) => setTimeout(() => resolve(), 0));
  }
  function nextMicrotask() {
    return Promise.resolve();
  }
  function parseHTMLDocument(html = "") {
    return new DOMParser().parseFromString(html, "text/html");
  }
  function unindent(strings, ...values) {
    const lines = interpolate(strings, values).replace(/^\n/, "").split("\n");
    const match = lines[0].match(/^\s+/);
    const indent = match ? match[0].length : 0;
    return lines.map((line) => line.slice(indent)).join("\n");
  }
  function interpolate(strings, values) {
    return strings.reduce((result, string2, i) => {
      const value = values[i] == void 0 ? "" : values[i];
      return result + string2 + value;
    }, "");
  }
  function uuid() {
    return Array.from({ length: 36 }).map((_, i) => {
      if (i == 8 || i == 13 || i == 18 || i == 23) {
        return "-";
      } else if (i == 14) {
        return "4";
      } else if (i == 19) {
        return (Math.floor(Math.random() * 4) + 8).toString(16);
      } else {
        return Math.floor(Math.random() * 15).toString(16);
      }
    }).join("");
  }
  function getAttribute(attributeName, ...elements) {
    for (const value of elements.map((element) => element?.getAttribute(attributeName))) {
      if (typeof value == "string") return value;
    }
    return null;
  }
  function hasAttribute(attributeName, ...elements) {
    return elements.some((element) => element && element.hasAttribute(attributeName));
  }
  function markAsBusy(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.setAttribute("busy", "");
      }
      element.setAttribute("aria-busy", "true");
    }
  }
  function clearBusyState(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.removeAttribute("busy");
      }
      element.removeAttribute("aria-busy");
    }
  }
  function waitForLoad(element, timeoutInMilliseconds = 2e3) {
    return new Promise((resolve) => {
      const onComplete = () => {
        element.removeEventListener("error", onComplete);
        element.removeEventListener("load", onComplete);
        resolve();
      };
      element.addEventListener("load", onComplete, { once: true });
      element.addEventListener("error", onComplete, { once: true });
      setTimeout(resolve, timeoutInMilliseconds);
    });
  }
  function getHistoryMethodForAction(action) {
    switch (action) {
      case "replace":
        return history.replaceState;
      case "advance":
      case "restore":
        return history.pushState;
    }
  }
  function isAction(action) {
    return action == "advance" || action == "replace" || action == "restore";
  }
  function getVisitAction(...elements) {
    const action = getAttribute("data-turbo-action", ...elements);
    return isAction(action) ? action : null;
  }
  function getMetaElement(name) {
    return document.querySelector(`meta[name="${name}"]`);
  }
  function getMetaContent(name) {
    const element = getMetaElement(name);
    return element && element.content;
  }
  function setMetaContent(name, content) {
    let element = getMetaElement(name);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute("name", name);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
    return element;
  }
  function findClosestRecursively(element, selector) {
    if (element instanceof Element) {
      return element.closest(selector) || findClosestRecursively(element.assignedSlot || element.getRootNode()?.host, selector);
    }
  }
  function elementIsFocusable(element) {
    const inertDisabledOrHidden = "[inert], :disabled, [hidden], details:not([open]), dialog:not([open])";
    return !!element && element.closest(inertDisabledOrHidden) == null && typeof element.focus == "function";
  }
  function queryAutofocusableElement(elementOrDocumentFragment) {
    return Array.from(elementOrDocumentFragment.querySelectorAll("[autofocus]")).find(elementIsFocusable);
  }
  async function around(callback, reader) {
    const before = reader();
    callback();
    await nextAnimationFrame();
    const after = reader();
    return [before, after];
  }
  function doesNotTargetIFrame(anchor) {
    if (anchor.hasAttribute("target")) {
      for (const element of document.getElementsByName(anchor.target)) {
        if (element instanceof HTMLIFrameElement) return false;
      }
    }
    return true;
  }
  function findLinkFromClickTarget(target) {
    return findClosestRecursively(target, "a[href]:not([target^=_]):not([download])");
  }
  function getLocationForLink(link) {
    return expandURL(link.getAttribute("href") || "");
  }
  function debounce(fn, delay) {
    let timeoutId = null;
    return (...args) => {
      const callback = () => fn.apply(this, args);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, delay);
    };
  }
  var LimitedSet = class extends Set {
    constructor(maxSize) {
      super();
      this.maxSize = maxSize;
    }
    add(value) {
      if (this.size >= this.maxSize) {
        const iterator = this.values();
        const oldestValue = iterator.next().value;
        this.delete(oldestValue);
      }
      super.add(value);
    }
  };
  var recentRequests = new LimitedSet(20);
  var nativeFetch = window.fetch;
  function fetchWithTurboHeaders(url, options = {}) {
    const modifiedHeaders = new Headers(options.headers || {});
    const requestUID = uuid();
    recentRequests.add(requestUID);
    modifiedHeaders.append("X-Turbo-Request-Id", requestUID);
    return nativeFetch(url, {
      ...options,
      headers: modifiedHeaders
    });
  }
  function fetchMethodFromString(method) {
    switch (method.toLowerCase()) {
      case "get":
        return FetchMethod.get;
      case "post":
        return FetchMethod.post;
      case "put":
        return FetchMethod.put;
      case "patch":
        return FetchMethod.patch;
      case "delete":
        return FetchMethod.delete;
    }
  }
  var FetchMethod = {
    get: "get",
    post: "post",
    put: "put",
    patch: "patch",
    delete: "delete"
  };
  function fetchEnctypeFromString(encoding) {
    switch (encoding.toLowerCase()) {
      case FetchEnctype.multipart:
        return FetchEnctype.multipart;
      case FetchEnctype.plain:
        return FetchEnctype.plain;
      default:
        return FetchEnctype.urlEncoded;
    }
  }
  var FetchEnctype = {
    urlEncoded: "application/x-www-form-urlencoded",
    multipart: "multipart/form-data",
    plain: "text/plain"
  };
  var FetchRequest = class {
    abortController = new AbortController();
    #resolveRequestPromise = (_value) => {
    };
    constructor(delegate, method, location2, requestBody = new URLSearchParams(), target = null, enctype = FetchEnctype.urlEncoded) {
      const [url, body] = buildResourceAndBody(expandURL(location2), method, requestBody, enctype);
      this.delegate = delegate;
      this.url = url;
      this.target = target;
      this.fetchOptions = {
        credentials: "same-origin",
        redirect: "follow",
        method,
        headers: { ...this.defaultHeaders },
        body,
        signal: this.abortSignal,
        referrer: this.delegate.referrer?.href
      };
      this.enctype = enctype;
    }
    get method() {
      return this.fetchOptions.method;
    }
    set method(value) {
      const fetchBody = this.isSafe ? this.url.searchParams : this.fetchOptions.body || new FormData();
      const fetchMethod = fetchMethodFromString(value) || FetchMethod.get;
      this.url.search = "";
      const [url, body] = buildResourceAndBody(this.url, fetchMethod, fetchBody, this.enctype);
      this.url = url;
      this.fetchOptions.body = body;
      this.fetchOptions.method = fetchMethod;
    }
    get headers() {
      return this.fetchOptions.headers;
    }
    set headers(value) {
      this.fetchOptions.headers = value;
    }
    get body() {
      if (this.isSafe) {
        return this.url.searchParams;
      } else {
        return this.fetchOptions.body;
      }
    }
    set body(value) {
      this.fetchOptions.body = value;
    }
    get location() {
      return this.url;
    }
    get params() {
      return this.url.searchParams;
    }
    get entries() {
      return this.body ? Array.from(this.body.entries()) : [];
    }
    cancel() {
      this.abortController.abort();
    }
    async perform() {
      const { fetchOptions } = this;
      this.delegate.prepareRequest(this);
      const event = await this.#allowRequestToBeIntercepted(fetchOptions);
      try {
        this.delegate.requestStarted(this);
        if (event.detail.fetchRequest) {
          this.response = event.detail.fetchRequest.response;
        } else {
          this.response = fetchWithTurboHeaders(this.url.href, fetchOptions);
        }
        const response = await this.response;
        return await this.receive(response);
      } catch (error2) {
        if (error2.name !== "AbortError") {
          if (this.#willDelegateErrorHandling(error2)) {
            this.delegate.requestErrored(this, error2);
          }
          throw error2;
        }
      } finally {
        this.delegate.requestFinished(this);
      }
    }
    async receive(response) {
      const fetchResponse = new FetchResponse(response);
      const event = dispatch("turbo:before-fetch-response", {
        cancelable: true,
        detail: { fetchResponse },
        target: this.target
      });
      if (event.defaultPrevented) {
        this.delegate.requestPreventedHandlingResponse(this, fetchResponse);
      } else if (fetchResponse.succeeded) {
        this.delegate.requestSucceededWithResponse(this, fetchResponse);
      } else {
        this.delegate.requestFailedWithResponse(this, fetchResponse);
      }
      return fetchResponse;
    }
    get defaultHeaders() {
      return {
        Accept: "text/html, application/xhtml+xml"
      };
    }
    get isSafe() {
      return isSafe(this.method);
    }
    get abortSignal() {
      return this.abortController.signal;
    }
    acceptResponseType(mimeType) {
      this.headers["Accept"] = [mimeType, this.headers["Accept"]].join(", ");
    }
    async #allowRequestToBeIntercepted(fetchOptions) {
      const requestInterception = new Promise((resolve) => this.#resolveRequestPromise = resolve);
      const event = dispatch("turbo:before-fetch-request", {
        cancelable: true,
        detail: {
          fetchOptions,
          url: this.url,
          resume: this.#resolveRequestPromise
        },
        target: this.target
      });
      this.url = event.detail.url;
      if (event.defaultPrevented) await requestInterception;
      return event;
    }
    #willDelegateErrorHandling(error2) {
      const event = dispatch("turbo:fetch-request-error", {
        target: this.target,
        cancelable: true,
        detail: { request: this, error: error2 }
      });
      return !event.defaultPrevented;
    }
  };
  function isSafe(fetchMethod) {
    return fetchMethodFromString(fetchMethod) == FetchMethod.get;
  }
  function buildResourceAndBody(resource, method, requestBody, enctype) {
    const searchParams = Array.from(requestBody).length > 0 ? new URLSearchParams(entriesExcludingFiles(requestBody)) : resource.searchParams;
    if (isSafe(method)) {
      return [mergeIntoURLSearchParams(resource, searchParams), null];
    } else if (enctype == FetchEnctype.urlEncoded) {
      return [resource, searchParams];
    } else {
      return [resource, requestBody];
    }
  }
  function entriesExcludingFiles(requestBody) {
    const entries = [];
    for (const [name, value] of requestBody) {
      if (value instanceof File) continue;
      else entries.push([name, value]);
    }
    return entries;
  }
  function mergeIntoURLSearchParams(url, requestBody) {
    const searchParams = new URLSearchParams(entriesExcludingFiles(requestBody));
    url.search = searchParams.toString();
    return url;
  }
  var AppearanceObserver = class {
    started = false;
    constructor(delegate, element) {
      this.delegate = delegate;
      this.element = element;
      this.intersectionObserver = new IntersectionObserver(this.intersect);
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.intersectionObserver.observe(this.element);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.intersectionObserver.unobserve(this.element);
      }
    }
    intersect = (entries) => {
      const lastEntry = entries.slice(-1)[0];
      if (lastEntry?.isIntersecting) {
        this.delegate.elementAppearedInViewport(this.element);
      }
    };
  };
  var StreamMessage = class {
    static contentType = "text/vnd.turbo-stream.html";
    static wrap(message) {
      if (typeof message == "string") {
        return new this(createDocumentFragment(message));
      } else {
        return message;
      }
    }
    constructor(fragment) {
      this.fragment = importStreamElements(fragment);
    }
  };
  function importStreamElements(fragment) {
    for (const element of fragment.querySelectorAll("turbo-stream")) {
      const streamElement = document.importNode(element, true);
      for (const inertScriptElement of streamElement.templateElement.content.querySelectorAll("script")) {
        inertScriptElement.replaceWith(activateScriptElement(inertScriptElement));
      }
      element.replaceWith(streamElement);
    }
    return fragment;
  }
  var PREFETCH_DELAY = 100;
  var PrefetchCache = class {
    #prefetchTimeout = null;
    #prefetched = null;
    get(url) {
      if (this.#prefetched && this.#prefetched.url === url && this.#prefetched.expire > Date.now()) {
        return this.#prefetched.request;
      }
    }
    setLater(url, request, ttl) {
      this.clear();
      this.#prefetchTimeout = setTimeout(() => {
        request.perform();
        this.set(url, request, ttl);
        this.#prefetchTimeout = null;
      }, PREFETCH_DELAY);
    }
    set(url, request, ttl) {
      this.#prefetched = { url, request, expire: new Date((/* @__PURE__ */ new Date()).getTime() + ttl) };
    }
    clear() {
      if (this.#prefetchTimeout) clearTimeout(this.#prefetchTimeout);
      this.#prefetched = null;
    }
  };
  var cacheTtl = 10 * 1e3;
  var prefetchCache = new PrefetchCache();
  var FormSubmissionState = {
    initialized: "initialized",
    requesting: "requesting",
    waiting: "waiting",
    receiving: "receiving",
    stopping: "stopping",
    stopped: "stopped"
  };
  var FormSubmission = class _FormSubmission {
    state = FormSubmissionState.initialized;
    static confirmMethod(message, _element, _submitter) {
      return Promise.resolve(confirm(message));
    }
    constructor(delegate, formElement, submitter, mustRedirect = false) {
      const method = getMethod(formElement, submitter);
      const action = getAction(getFormAction(formElement, submitter), method);
      const body = buildFormData(formElement, submitter);
      const enctype = getEnctype(formElement, submitter);
      this.delegate = delegate;
      this.formElement = formElement;
      this.submitter = submitter;
      this.fetchRequest = new FetchRequest(this, method, action, body, formElement, enctype);
      this.mustRedirect = mustRedirect;
    }
    get method() {
      return this.fetchRequest.method;
    }
    set method(value) {
      this.fetchRequest.method = value;
    }
    get action() {
      return this.fetchRequest.url.toString();
    }
    set action(value) {
      this.fetchRequest.url = expandURL(value);
    }
    get body() {
      return this.fetchRequest.body;
    }
    get enctype() {
      return this.fetchRequest.enctype;
    }
    get isSafe() {
      return this.fetchRequest.isSafe;
    }
    get location() {
      return this.fetchRequest.url;
    }
    // The submission process
    async start() {
      const { initialized, requesting } = FormSubmissionState;
      const confirmationMessage = getAttribute("data-turbo-confirm", this.submitter, this.formElement);
      if (typeof confirmationMessage === "string") {
        const answer = await _FormSubmission.confirmMethod(confirmationMessage, this.formElement, this.submitter);
        if (!answer) {
          return;
        }
      }
      if (this.state == initialized) {
        this.state = requesting;
        return this.fetchRequest.perform();
      }
    }
    stop() {
      const { stopping, stopped } = FormSubmissionState;
      if (this.state != stopping && this.state != stopped) {
        this.state = stopping;
        this.fetchRequest.cancel();
        return true;
      }
    }
    // Fetch request delegate
    prepareRequest(request) {
      if (!request.isSafe) {
        const token = getCookieValue(getMetaContent("csrf-param")) || getMetaContent("csrf-token");
        if (token) {
          request.headers["X-CSRF-Token"] = token;
        }
      }
      if (this.requestAcceptsTurboStreamResponse(request)) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted(_request) {
      this.state = FormSubmissionState.waiting;
      this.submitter?.setAttribute("disabled", "");
      this.setSubmitsWith();
      markAsBusy(this.formElement);
      dispatch("turbo:submit-start", {
        target: this.formElement,
        detail: { formSubmission: this }
      });
      this.delegate.formSubmissionStarted(this);
    }
    requestPreventedHandlingResponse(request, response) {
      prefetchCache.clear();
      this.result = { success: response.succeeded, fetchResponse: response };
    }
    requestSucceededWithResponse(request, response) {
      if (response.clientError || response.serverError) {
        this.delegate.formSubmissionFailedWithResponse(this, response);
        return;
      }
      prefetchCache.clear();
      if (this.requestMustRedirect(request) && responseSucceededWithoutRedirect(response)) {
        const error2 = new Error("Form responses must redirect to another location");
        this.delegate.formSubmissionErrored(this, error2);
      } else {
        this.state = FormSubmissionState.receiving;
        this.result = { success: true, fetchResponse: response };
        this.delegate.formSubmissionSucceededWithResponse(this, response);
      }
    }
    requestFailedWithResponse(request, response) {
      this.result = { success: false, fetchResponse: response };
      this.delegate.formSubmissionFailedWithResponse(this, response);
    }
    requestErrored(request, error2) {
      this.result = { success: false, error: error2 };
      this.delegate.formSubmissionErrored(this, error2);
    }
    requestFinished(_request) {
      this.state = FormSubmissionState.stopped;
      this.submitter?.removeAttribute("disabled");
      this.resetSubmitterText();
      clearBusyState(this.formElement);
      dispatch("turbo:submit-end", {
        target: this.formElement,
        detail: { formSubmission: this, ...this.result }
      });
      this.delegate.formSubmissionFinished(this);
    }
    // Private
    setSubmitsWith() {
      if (!this.submitter || !this.submitsWith) return;
      if (this.submitter.matches("button")) {
        this.originalSubmitText = this.submitter.innerHTML;
        this.submitter.innerHTML = this.submitsWith;
      } else if (this.submitter.matches("input")) {
        const input = this.submitter;
        this.originalSubmitText = input.value;
        input.value = this.submitsWith;
      }
    }
    resetSubmitterText() {
      if (!this.submitter || !this.originalSubmitText) return;
      if (this.submitter.matches("button")) {
        this.submitter.innerHTML = this.originalSubmitText;
      } else if (this.submitter.matches("input")) {
        const input = this.submitter;
        input.value = this.originalSubmitText;
      }
    }
    requestMustRedirect(request) {
      return !request.isSafe && this.mustRedirect;
    }
    requestAcceptsTurboStreamResponse(request) {
      return !request.isSafe || hasAttribute("data-turbo-stream", this.submitter, this.formElement);
    }
    get submitsWith() {
      return this.submitter?.getAttribute("data-turbo-submits-with");
    }
  };
  function buildFormData(formElement, submitter) {
    const formData = new FormData(formElement);
    const name = submitter?.getAttribute("name");
    const value = submitter?.getAttribute("value");
    if (name) {
      formData.append(name, value || "");
    }
    return formData;
  }
  function getCookieValue(cookieName) {
    if (cookieName != null) {
      const cookies = document.cookie ? document.cookie.split("; ") : [];
      const cookie = cookies.find((cookie2) => cookie2.startsWith(cookieName));
      if (cookie) {
        const value = cookie.split("=").slice(1).join("=");
        return value ? decodeURIComponent(value) : void 0;
      }
    }
  }
  function responseSucceededWithoutRedirect(response) {
    return response.statusCode == 200 && !response.redirected;
  }
  function getFormAction(formElement, submitter) {
    const formElementAction = typeof formElement.action === "string" ? formElement.action : null;
    if (submitter?.hasAttribute("formaction")) {
      return submitter.getAttribute("formaction") || "";
    } else {
      return formElement.getAttribute("action") || formElementAction || "";
    }
  }
  function getAction(formAction, fetchMethod) {
    const action = expandURL(formAction);
    if (isSafe(fetchMethod)) {
      action.search = "";
    }
    return action;
  }
  function getMethod(formElement, submitter) {
    const method = submitter?.getAttribute("formmethod") || formElement.getAttribute("method") || "";
    return fetchMethodFromString(method.toLowerCase()) || FetchMethod.get;
  }
  function getEnctype(formElement, submitter) {
    return fetchEnctypeFromString(submitter?.getAttribute("formenctype") || formElement.enctype);
  }
  var Snapshot = class {
    constructor(element) {
      this.element = element;
    }
    get activeElement() {
      return this.element.ownerDocument.activeElement;
    }
    get children() {
      return [...this.element.children];
    }
    hasAnchor(anchor) {
      return this.getElementForAnchor(anchor) != null;
    }
    getElementForAnchor(anchor) {
      return anchor ? this.element.querySelector(`[id='${anchor}'], a[name='${anchor}']`) : null;
    }
    get isConnected() {
      return this.element.isConnected;
    }
    get firstAutofocusableElement() {
      return queryAutofocusableElement(this.element);
    }
    get permanentElements() {
      return queryPermanentElementsAll(this.element);
    }
    getPermanentElementById(id2) {
      return getPermanentElementById(this.element, id2);
    }
    getPermanentElementMapForSnapshot(snapshot) {
      const permanentElementMap = {};
      for (const currentPermanentElement of this.permanentElements) {
        const { id: id2 } = currentPermanentElement;
        const newPermanentElement = snapshot.getPermanentElementById(id2);
        if (newPermanentElement) {
          permanentElementMap[id2] = [currentPermanentElement, newPermanentElement];
        }
      }
      return permanentElementMap;
    }
  };
  function getPermanentElementById(node, id2) {
    return node.querySelector(`#${id2}[data-turbo-permanent]`);
  }
  function queryPermanentElementsAll(node) {
    return node.querySelectorAll("[id][data-turbo-permanent]");
  }
  var FormSubmitObserver = class {
    started = false;
    constructor(delegate, eventTarget) {
      this.delegate = delegate;
      this.eventTarget = eventTarget;
    }
    start() {
      if (!this.started) {
        this.eventTarget.addEventListener("submit", this.submitCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.eventTarget.removeEventListener("submit", this.submitCaptured, true);
        this.started = false;
      }
    }
    submitCaptured = () => {
      this.eventTarget.removeEventListener("submit", this.submitBubbled, false);
      this.eventTarget.addEventListener("submit", this.submitBubbled, false);
    };
    submitBubbled = (event) => {
      if (!event.defaultPrevented) {
        const form = event.target instanceof HTMLFormElement ? event.target : void 0;
        const submitter = event.submitter || void 0;
        if (form && submissionDoesNotDismissDialog(form, submitter) && submissionDoesNotTargetIFrame(form, submitter) && this.delegate.willSubmitForm(form, submitter)) {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.delegate.formSubmitted(form, submitter);
        }
      }
    };
  };
  function submissionDoesNotDismissDialog(form, submitter) {
    const method = submitter?.getAttribute("formmethod") || form.getAttribute("method");
    return method != "dialog";
  }
  function submissionDoesNotTargetIFrame(form, submitter) {
    if (submitter?.hasAttribute("formtarget") || form.hasAttribute("target")) {
      const target = submitter?.getAttribute("formtarget") || form.target;
      for (const element of document.getElementsByName(target)) {
        if (element instanceof HTMLIFrameElement) return false;
      }
      return true;
    } else {
      return true;
    }
  }
  var View = class {
    #resolveRenderPromise = (_value) => {
    };
    #resolveInterceptionPromise = (_value) => {
    };
    constructor(delegate, element) {
      this.delegate = delegate;
      this.element = element;
    }
    // Scrolling
    scrollToAnchor(anchor) {
      const element = this.snapshot.getElementForAnchor(anchor);
      if (element) {
        this.scrollToElement(element);
        this.focusElement(element);
      } else {
        this.scrollToPosition({ x: 0, y: 0 });
      }
    }
    scrollToAnchorFromLocation(location2) {
      this.scrollToAnchor(getAnchor(location2));
    }
    scrollToElement(element) {
      element.scrollIntoView();
    }
    focusElement(element) {
      if (element instanceof HTMLElement) {
        if (element.hasAttribute("tabindex")) {
          element.focus();
        } else {
          element.setAttribute("tabindex", "-1");
          element.focus();
          element.removeAttribute("tabindex");
        }
      }
    }
    scrollToPosition({ x, y }) {
      this.scrollRoot.scrollTo(x, y);
    }
    scrollToTop() {
      this.scrollToPosition({ x: 0, y: 0 });
    }
    get scrollRoot() {
      return window;
    }
    // Rendering
    async render(renderer) {
      const { isPreview, shouldRender, willRender, newSnapshot: snapshot } = renderer;
      const shouldInvalidate = willRender;
      if (shouldRender) {
        try {
          this.renderPromise = new Promise((resolve) => this.#resolveRenderPromise = resolve);
          this.renderer = renderer;
          await this.prepareToRenderSnapshot(renderer);
          const renderInterception = new Promise((resolve) => this.#resolveInterceptionPromise = resolve);
          const options = { resume: this.#resolveInterceptionPromise, render: this.renderer.renderElement, renderMethod: this.renderer.renderMethod };
          const immediateRender = this.delegate.allowsImmediateRender(snapshot, options);
          if (!immediateRender) await renderInterception;
          await this.renderSnapshot(renderer);
          this.delegate.viewRenderedSnapshot(snapshot, isPreview, this.renderer.renderMethod);
          this.delegate.preloadOnLoadLinksForView(this.element);
          this.finishRenderingSnapshot(renderer);
        } finally {
          delete this.renderer;
          this.#resolveRenderPromise(void 0);
          delete this.renderPromise;
        }
      } else if (shouldInvalidate) {
        this.invalidate(renderer.reloadReason);
      }
    }
    invalidate(reason) {
      this.delegate.viewInvalidated(reason);
    }
    async prepareToRenderSnapshot(renderer) {
      this.markAsPreview(renderer.isPreview);
      await renderer.prepareToRender();
    }
    markAsPreview(isPreview) {
      if (isPreview) {
        this.element.setAttribute("data-turbo-preview", "");
      } else {
        this.element.removeAttribute("data-turbo-preview");
      }
    }
    markVisitDirection(direction) {
      this.element.setAttribute("data-turbo-visit-direction", direction);
    }
    unmarkVisitDirection() {
      this.element.removeAttribute("data-turbo-visit-direction");
    }
    async renderSnapshot(renderer) {
      await renderer.render();
    }
    finishRenderingSnapshot(renderer) {
      renderer.finishRendering();
    }
  };
  var FrameView = class extends View {
    missing() {
      this.element.innerHTML = `<strong class="turbo-frame-error">Content missing</strong>`;
    }
    get snapshot() {
      return new Snapshot(this.element);
    }
  };
  var LinkInterceptor = class {
    constructor(delegate, element) {
      this.delegate = delegate;
      this.element = element;
    }
    start() {
      this.element.addEventListener("click", this.clickBubbled);
      document.addEventListener("turbo:click", this.linkClicked);
      document.addEventListener("turbo:before-visit", this.willVisit);
    }
    stop() {
      this.element.removeEventListener("click", this.clickBubbled);
      document.removeEventListener("turbo:click", this.linkClicked);
      document.removeEventListener("turbo:before-visit", this.willVisit);
    }
    clickBubbled = (event) => {
      if (this.respondsToEventTarget(event.target)) {
        this.clickEvent = event;
      } else {
        delete this.clickEvent;
      }
    };
    linkClicked = (event) => {
      if (this.clickEvent && this.respondsToEventTarget(event.target) && event.target instanceof Element) {
        if (this.delegate.shouldInterceptLinkClick(event.target, event.detail.url, event.detail.originalEvent)) {
          this.clickEvent.preventDefault();
          event.preventDefault();
          this.delegate.linkClickIntercepted(event.target, event.detail.url, event.detail.originalEvent);
        }
      }
      delete this.clickEvent;
    };
    willVisit = (_event) => {
      delete this.clickEvent;
    };
    respondsToEventTarget(target) {
      const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
      return element && element.closest("turbo-frame, html") == this.element;
    }
  };
  var LinkClickObserver = class {
    started = false;
    constructor(delegate, eventTarget) {
      this.delegate = delegate;
      this.eventTarget = eventTarget;
    }
    start() {
      if (!this.started) {
        this.eventTarget.addEventListener("click", this.clickCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.eventTarget.removeEventListener("click", this.clickCaptured, true);
        this.started = false;
      }
    }
    clickCaptured = () => {
      this.eventTarget.removeEventListener("click", this.clickBubbled, false);
      this.eventTarget.addEventListener("click", this.clickBubbled, false);
    };
    clickBubbled = (event) => {
      if (event instanceof MouseEvent && this.clickEventIsSignificant(event)) {
        const target = event.composedPath && event.composedPath()[0] || event.target;
        const link = findLinkFromClickTarget(target);
        if (link && doesNotTargetIFrame(link)) {
          const location2 = getLocationForLink(link);
          if (this.delegate.willFollowLinkToLocation(link, location2, event)) {
            event.preventDefault();
            this.delegate.followedLinkToLocation(link, location2);
          }
        }
      }
    };
    clickEventIsSignificant(event) {
      return !(event.target && event.target.isContentEditable || event.defaultPrevented || event.which > 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
    }
  };
  var FormLinkClickObserver = class {
    constructor(delegate, element) {
      this.delegate = delegate;
      this.linkInterceptor = new LinkClickObserver(this, element);
    }
    start() {
      this.linkInterceptor.start();
    }
    stop() {
      this.linkInterceptor.stop();
    }
    // Link hover observer delegate
    canPrefetchRequestToLocation(link, location2) {
      return false;
    }
    prefetchAndCacheRequestToLocation(link, location2) {
      return;
    }
    // Link click observer delegate
    willFollowLinkToLocation(link, location2, originalEvent) {
      return this.delegate.willSubmitFormLinkToLocation(link, location2, originalEvent) && (link.hasAttribute("data-turbo-method") || link.hasAttribute("data-turbo-stream"));
    }
    followedLinkToLocation(link, location2) {
      const form = document.createElement("form");
      const type = "hidden";
      for (const [name, value] of location2.searchParams) {
        form.append(Object.assign(document.createElement("input"), { type, name, value }));
      }
      const action = Object.assign(location2, { search: "" });
      form.setAttribute("data-turbo", "true");
      form.setAttribute("action", action.href);
      form.setAttribute("hidden", "");
      const method = link.getAttribute("data-turbo-method");
      if (method) form.setAttribute("method", method);
      const turboFrame = link.getAttribute("data-turbo-frame");
      if (turboFrame) form.setAttribute("data-turbo-frame", turboFrame);
      const turboAction = getVisitAction(link);
      if (turboAction) form.setAttribute("data-turbo-action", turboAction);
      const turboConfirm = link.getAttribute("data-turbo-confirm");
      if (turboConfirm) form.setAttribute("data-turbo-confirm", turboConfirm);
      const turboStream = link.hasAttribute("data-turbo-stream");
      if (turboStream) form.setAttribute("data-turbo-stream", "");
      this.delegate.submittedFormLinkToLocation(link, location2, form);
      document.body.appendChild(form);
      form.addEventListener("turbo:submit-end", () => form.remove(), { once: true });
      requestAnimationFrame(() => form.requestSubmit());
    }
  };
  var Bardo = class {
    static async preservingPermanentElements(delegate, permanentElementMap, callback) {
      const bardo = new this(delegate, permanentElementMap);
      bardo.enter();
      await callback();
      bardo.leave();
    }
    constructor(delegate, permanentElementMap) {
      this.delegate = delegate;
      this.permanentElementMap = permanentElementMap;
    }
    enter() {
      for (const id2 in this.permanentElementMap) {
        const [currentPermanentElement, newPermanentElement] = this.permanentElementMap[id2];
        this.delegate.enteringBardo(currentPermanentElement, newPermanentElement);
        this.replaceNewPermanentElementWithPlaceholder(newPermanentElement);
      }
    }
    leave() {
      for (const id2 in this.permanentElementMap) {
        const [currentPermanentElement] = this.permanentElementMap[id2];
        this.replaceCurrentPermanentElementWithClone(currentPermanentElement);
        this.replacePlaceholderWithPermanentElement(currentPermanentElement);
        this.delegate.leavingBardo(currentPermanentElement);
      }
    }
    replaceNewPermanentElementWithPlaceholder(permanentElement) {
      const placeholder = createPlaceholderForPermanentElement(permanentElement);
      permanentElement.replaceWith(placeholder);
    }
    replaceCurrentPermanentElementWithClone(permanentElement) {
      const clone = permanentElement.cloneNode(true);
      permanentElement.replaceWith(clone);
    }
    replacePlaceholderWithPermanentElement(permanentElement) {
      const placeholder = this.getPlaceholderById(permanentElement.id);
      placeholder?.replaceWith(permanentElement);
    }
    getPlaceholderById(id2) {
      return this.placeholders.find((element) => element.content == id2);
    }
    get placeholders() {
      return [...document.querySelectorAll("meta[name=turbo-permanent-placeholder][content]")];
    }
  };
  function createPlaceholderForPermanentElement(permanentElement) {
    const element = document.createElement("meta");
    element.setAttribute("name", "turbo-permanent-placeholder");
    element.setAttribute("content", permanentElement.id);
    return element;
  }
  var Renderer = class {
    #activeElement = null;
    constructor(currentSnapshot, newSnapshot, renderElement, isPreview, willRender = true) {
      this.currentSnapshot = currentSnapshot;
      this.newSnapshot = newSnapshot;
      this.isPreview = isPreview;
      this.willRender = willRender;
      this.renderElement = renderElement;
      this.promise = new Promise((resolve, reject) => this.resolvingFunctions = { resolve, reject });
    }
    get shouldRender() {
      return true;
    }
    get reloadReason() {
      return;
    }
    prepareToRender() {
      return;
    }
    render() {
    }
    finishRendering() {
      if (this.resolvingFunctions) {
        this.resolvingFunctions.resolve();
        delete this.resolvingFunctions;
      }
    }
    async preservingPermanentElements(callback) {
      await Bardo.preservingPermanentElements(this, this.permanentElementMap, callback);
    }
    focusFirstAutofocusableElement() {
      const element = this.connectedSnapshot.firstAutofocusableElement;
      if (element) {
        element.focus();
      }
    }
    // Bardo delegate
    enteringBardo(currentPermanentElement) {
      if (this.#activeElement) return;
      if (currentPermanentElement.contains(this.currentSnapshot.activeElement)) {
        this.#activeElement = this.currentSnapshot.activeElement;
      }
    }
    leavingBardo(currentPermanentElement) {
      if (currentPermanentElement.contains(this.#activeElement) && this.#activeElement instanceof HTMLElement) {
        this.#activeElement.focus();
        this.#activeElement = null;
      }
    }
    get connectedSnapshot() {
      return this.newSnapshot.isConnected ? this.newSnapshot : this.currentSnapshot;
    }
    get currentElement() {
      return this.currentSnapshot.element;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    get permanentElementMap() {
      return this.currentSnapshot.getPermanentElementMapForSnapshot(this.newSnapshot);
    }
    get renderMethod() {
      return "replace";
    }
  };
  var FrameRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      const destinationRange = document.createRange();
      destinationRange.selectNodeContents(currentElement);
      destinationRange.deleteContents();
      const frameElement = newElement;
      const sourceRange = frameElement.ownerDocument?.createRange();
      if (sourceRange) {
        sourceRange.selectNodeContents(frameElement);
        currentElement.appendChild(sourceRange.extractContents());
      }
    }
    constructor(delegate, currentSnapshot, newSnapshot, renderElement, isPreview, willRender = true) {
      super(currentSnapshot, newSnapshot, renderElement, isPreview, willRender);
      this.delegate = delegate;
    }
    get shouldRender() {
      return true;
    }
    async render() {
      await nextRepaint();
      this.preservingPermanentElements(() => {
        this.loadFrameElement();
      });
      this.scrollFrameIntoView();
      await nextRepaint();
      this.focusFirstAutofocusableElement();
      await nextRepaint();
      this.activateScriptElements();
    }
    loadFrameElement() {
      this.delegate.willRenderFrame(this.currentElement, this.newElement);
      this.renderElement(this.currentElement, this.newElement);
    }
    scrollFrameIntoView() {
      if (this.currentElement.autoscroll || this.newElement.autoscroll) {
        const element = this.currentElement.firstElementChild;
        const block = readScrollLogicalPosition(this.currentElement.getAttribute("data-autoscroll-block"), "end");
        const behavior = readScrollBehavior(this.currentElement.getAttribute("data-autoscroll-behavior"), "auto");
        if (element) {
          element.scrollIntoView({ block, behavior });
          return true;
        }
      }
      return false;
    }
    activateScriptElements() {
      for (const inertScriptElement of this.newScriptElements) {
        const activatedScriptElement = activateScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    get newScriptElements() {
      return this.currentElement.querySelectorAll("script");
    }
  };
  function readScrollLogicalPosition(value, defaultValue) {
    if (value == "end" || value == "start" || value == "center" || value == "nearest") {
      return value;
    } else {
      return defaultValue;
    }
  }
  function readScrollBehavior(value, defaultValue) {
    if (value == "auto" || value == "smooth") {
      return value;
    } else {
      return defaultValue;
    }
  }
  var ProgressBar = class _ProgressBar {
    static animationDuration = 300;
    /*ms*/
    static get defaultCSS() {
      return unindent`
      .turbo-progress-bar {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        height: 3px;
        background: #0076ff;
        z-index: 2147483647;
        transition:
          width ${_ProgressBar.animationDuration}ms ease-out,
          opacity ${_ProgressBar.animationDuration / 2}ms ${_ProgressBar.animationDuration / 2}ms ease-in;
        transform: translate3d(0, 0, 0);
      }
    `;
    }
    hiding = false;
    value = 0;
    visible = false;
    constructor() {
      this.stylesheetElement = this.createStylesheetElement();
      this.progressElement = this.createProgressElement();
      this.installStylesheetElement();
      this.setValue(0);
    }
    show() {
      if (!this.visible) {
        this.visible = true;
        this.installProgressElement();
        this.startTrickling();
      }
    }
    hide() {
      if (this.visible && !this.hiding) {
        this.hiding = true;
        this.fadeProgressElement(() => {
          this.uninstallProgressElement();
          this.stopTrickling();
          this.visible = false;
          this.hiding = false;
        });
      }
    }
    setValue(value) {
      this.value = value;
      this.refresh();
    }
    // Private
    installStylesheetElement() {
      document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
    }
    installProgressElement() {
      this.progressElement.style.width = "0";
      this.progressElement.style.opacity = "1";
      document.documentElement.insertBefore(this.progressElement, document.body);
      this.refresh();
    }
    fadeProgressElement(callback) {
      this.progressElement.style.opacity = "0";
      setTimeout(callback, _ProgressBar.animationDuration * 1.5);
    }
    uninstallProgressElement() {
      if (this.progressElement.parentNode) {
        document.documentElement.removeChild(this.progressElement);
      }
    }
    startTrickling() {
      if (!this.trickleInterval) {
        this.trickleInterval = window.setInterval(this.trickle, _ProgressBar.animationDuration);
      }
    }
    stopTrickling() {
      window.clearInterval(this.trickleInterval);
      delete this.trickleInterval;
    }
    trickle = () => {
      this.setValue(this.value + Math.random() / 100);
    };
    refresh() {
      requestAnimationFrame(() => {
        this.progressElement.style.width = `${10 + this.value * 90}%`;
      });
    }
    createStylesheetElement() {
      const element = document.createElement("style");
      element.type = "text/css";
      element.textContent = _ProgressBar.defaultCSS;
      if (this.cspNonce) {
        element.nonce = this.cspNonce;
      }
      return element;
    }
    createProgressElement() {
      const element = document.createElement("div");
      element.className = "turbo-progress-bar";
      return element;
    }
    get cspNonce() {
      return getMetaContent("csp-nonce");
    }
  };
  var HeadSnapshot = class extends Snapshot {
    detailsByOuterHTML = this.children.filter((element) => !elementIsNoscript(element)).map((element) => elementWithoutNonce(element)).reduce((result, element) => {
      const { outerHTML } = element;
      const details = outerHTML in result ? result[outerHTML] : {
        type: elementType(element),
        tracked: elementIsTracked(element),
        elements: []
      };
      return {
        ...result,
        [outerHTML]: {
          ...details,
          elements: [...details.elements, element]
        }
      };
    }, {});
    get trackedElementSignature() {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => this.detailsByOuterHTML[outerHTML].tracked).join("");
    }
    getScriptElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("script", snapshot);
    }
    getStylesheetElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("stylesheet", snapshot);
    }
    getElementsMatchingTypeNotInSnapshot(matchedType, snapshot) {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => !(outerHTML in snapshot.detailsByOuterHTML)).map((outerHTML) => this.detailsByOuterHTML[outerHTML]).filter(({ type }) => type == matchedType).map(({ elements: [element] }) => element);
    }
    get provisionalElements() {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const { type, tracked, elements } = this.detailsByOuterHTML[outerHTML];
        if (type == null && !tracked) {
          return [...result, ...elements];
        } else if (elements.length > 1) {
          return [...result, ...elements.slice(1)];
        } else {
          return result;
        }
      }, []);
    }
    getMetaValue(name) {
      const element = this.findMetaElementByName(name);
      return element ? element.getAttribute("content") : null;
    }
    findMetaElementByName(name) {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const {
          elements: [element]
        } = this.detailsByOuterHTML[outerHTML];
        return elementIsMetaElementWithName(element, name) ? element : result;
      }, void 0 | void 0);
    }
  };
  function elementType(element) {
    if (elementIsScript(element)) {
      return "script";
    } else if (elementIsStylesheet(element)) {
      return "stylesheet";
    }
  }
  function elementIsTracked(element) {
    return element.getAttribute("data-turbo-track") == "reload";
  }
  function elementIsScript(element) {
    const tagName = element.localName;
    return tagName == "script";
  }
  function elementIsNoscript(element) {
    const tagName = element.localName;
    return tagName == "noscript";
  }
  function elementIsStylesheet(element) {
    const tagName = element.localName;
    return tagName == "style" || tagName == "link" && element.getAttribute("rel") == "stylesheet";
  }
  function elementIsMetaElementWithName(element, name) {
    const tagName = element.localName;
    return tagName == "meta" && element.getAttribute("name") == name;
  }
  function elementWithoutNonce(element) {
    if (element.hasAttribute("nonce")) {
      element.setAttribute("nonce", "");
    }
    return element;
  }
  var PageSnapshot = class _PageSnapshot extends Snapshot {
    static fromHTMLString(html = "") {
      return this.fromDocument(parseHTMLDocument(html));
    }
    static fromElement(element) {
      return this.fromDocument(element.ownerDocument);
    }
    static fromDocument({ documentElement, body, head }) {
      return new this(documentElement, body, new HeadSnapshot(head));
    }
    constructor(documentElement, body, headSnapshot) {
      super(body);
      this.documentElement = documentElement;
      this.headSnapshot = headSnapshot;
    }
    clone() {
      const clonedElement = this.element.cloneNode(true);
      const selectElements = this.element.querySelectorAll("select");
      const clonedSelectElements = clonedElement.querySelectorAll("select");
      for (const [index, source] of selectElements.entries()) {
        const clone = clonedSelectElements[index];
        for (const option of clone.selectedOptions) option.selected = false;
        for (const option of source.selectedOptions) clone.options[option.index].selected = true;
      }
      for (const clonedPasswordInput of clonedElement.querySelectorAll('input[type="password"]')) {
        clonedPasswordInput.value = "";
      }
      return new _PageSnapshot(this.documentElement, clonedElement, this.headSnapshot);
    }
    get lang() {
      return this.documentElement.getAttribute("lang");
    }
    get headElement() {
      return this.headSnapshot.element;
    }
    get rootLocation() {
      const root = this.getSetting("root") ?? "/";
      return expandURL(root);
    }
    get cacheControlValue() {
      return this.getSetting("cache-control");
    }
    get isPreviewable() {
      return this.cacheControlValue != "no-preview";
    }
    get isCacheable() {
      return this.cacheControlValue != "no-cache";
    }
    get isVisitable() {
      return this.getSetting("visit-control") != "reload";
    }
    get prefersViewTransitions() {
      return this.headSnapshot.getMetaValue("view-transition") === "same-origin";
    }
    get shouldMorphPage() {
      return this.getSetting("refresh-method") === "morph";
    }
    get shouldPreserveScrollPosition() {
      return this.getSetting("refresh-scroll") === "preserve";
    }
    // Private
    getSetting(name) {
      return this.headSnapshot.getMetaValue(`turbo-${name}`);
    }
  };
  var ViewTransitioner = class {
    #viewTransitionStarted = false;
    #lastOperation = Promise.resolve();
    renderChange(useViewTransition, render) {
      if (useViewTransition && this.viewTransitionsAvailable && !this.#viewTransitionStarted) {
        this.#viewTransitionStarted = true;
        this.#lastOperation = this.#lastOperation.then(async () => {
          await document.startViewTransition(render).finished;
        });
      } else {
        this.#lastOperation = this.#lastOperation.then(render);
      }
      return this.#lastOperation;
    }
    get viewTransitionsAvailable() {
      return document.startViewTransition;
    }
  };
  var defaultOptions = {
    action: "advance",
    historyChanged: false,
    visitCachedSnapshot: () => {
    },
    willRender: true,
    updateHistory: true,
    shouldCacheSnapshot: true,
    acceptsStreamResponse: false
  };
  var TimingMetric = {
    visitStart: "visitStart",
    requestStart: "requestStart",
    requestEnd: "requestEnd",
    visitEnd: "visitEnd"
  };
  var VisitState = {
    initialized: "initialized",
    started: "started",
    canceled: "canceled",
    failed: "failed",
    completed: "completed"
  };
  var SystemStatusCode = {
    networkFailure: 0,
    timeoutFailure: -1,
    contentTypeMismatch: -2
  };
  var Direction = {
    advance: "forward",
    restore: "back",
    replace: "none"
  };
  var Visit = class {
    identifier = uuid();
    // Required by turbo-ios
    timingMetrics = {};
    followedRedirect = false;
    historyChanged = false;
    scrolled = false;
    shouldCacheSnapshot = true;
    acceptsStreamResponse = false;
    snapshotCached = false;
    state = VisitState.initialized;
    viewTransitioner = new ViewTransitioner();
    constructor(delegate, location2, restorationIdentifier, options = {}) {
      this.delegate = delegate;
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier || uuid();
      const {
        action,
        historyChanged,
        referrer,
        snapshot,
        snapshotHTML,
        response,
        visitCachedSnapshot,
        willRender,
        updateHistory,
        shouldCacheSnapshot,
        acceptsStreamResponse,
        direction
      } = {
        ...defaultOptions,
        ...options
      };
      this.action = action;
      this.historyChanged = historyChanged;
      this.referrer = referrer;
      this.snapshot = snapshot;
      this.snapshotHTML = snapshotHTML;
      this.response = response;
      this.isSamePage = this.delegate.locationWithActionIsSamePage(this.location, this.action);
      this.isPageRefresh = this.view.isPageRefresh(this);
      this.visitCachedSnapshot = visitCachedSnapshot;
      this.willRender = willRender;
      this.updateHistory = updateHistory;
      this.scrolled = !willRender;
      this.shouldCacheSnapshot = shouldCacheSnapshot;
      this.acceptsStreamResponse = acceptsStreamResponse;
      this.direction = direction || Direction[action];
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get history() {
      return this.delegate.history;
    }
    get restorationData() {
      return this.history.getRestorationDataForIdentifier(this.restorationIdentifier);
    }
    get silent() {
      return this.isSamePage;
    }
    start() {
      if (this.state == VisitState.initialized) {
        this.recordTimingMetric(TimingMetric.visitStart);
        this.state = VisitState.started;
        this.adapter.visitStarted(this);
        this.delegate.visitStarted(this);
      }
    }
    cancel() {
      if (this.state == VisitState.started) {
        if (this.request) {
          this.request.cancel();
        }
        this.cancelRender();
        this.state = VisitState.canceled;
      }
    }
    complete() {
      if (this.state == VisitState.started) {
        this.recordTimingMetric(TimingMetric.visitEnd);
        this.adapter.visitCompleted(this);
        this.state = VisitState.completed;
        this.followRedirect();
        if (!this.followedRedirect) {
          this.delegate.visitCompleted(this);
        }
      }
    }
    fail() {
      if (this.state == VisitState.started) {
        this.state = VisitState.failed;
        this.adapter.visitFailed(this);
        this.delegate.visitCompleted(this);
      }
    }
    changeHistory() {
      if (!this.historyChanged && this.updateHistory) {
        const actionForHistory = this.location.href === this.referrer?.href ? "replace" : this.action;
        const method = getHistoryMethodForAction(actionForHistory);
        this.history.update(method, this.location, this.restorationIdentifier);
        this.historyChanged = true;
      }
    }
    issueRequest() {
      if (this.hasPreloadedResponse()) {
        this.simulateRequest();
      } else if (this.shouldIssueRequest() && !this.request) {
        this.request = new FetchRequest(this, FetchMethod.get, this.location);
        this.request.perform();
      }
    }
    simulateRequest() {
      if (this.response) {
        this.startRequest();
        this.recordResponse();
        this.finishRequest();
      }
    }
    startRequest() {
      this.recordTimingMetric(TimingMetric.requestStart);
      this.adapter.visitRequestStarted(this);
    }
    recordResponse(response = this.response) {
      this.response = response;
      if (response) {
        const { statusCode } = response;
        if (isSuccessful(statusCode)) {
          this.adapter.visitRequestCompleted(this);
        } else {
          this.adapter.visitRequestFailedWithStatusCode(this, statusCode);
        }
      }
    }
    finishRequest() {
      this.recordTimingMetric(TimingMetric.requestEnd);
      this.adapter.visitRequestFinished(this);
    }
    loadResponse() {
      if (this.response) {
        const { statusCode, responseHTML } = this.response;
        this.render(async () => {
          if (this.shouldCacheSnapshot) this.cacheSnapshot();
          if (this.view.renderPromise) await this.view.renderPromise;
          if (isSuccessful(statusCode) && responseHTML != null) {
            const snapshot = PageSnapshot.fromHTMLString(responseHTML);
            await this.renderPageSnapshot(snapshot, false);
            this.adapter.visitRendered(this);
            this.complete();
          } else {
            await this.view.renderError(PageSnapshot.fromHTMLString(responseHTML), this);
            this.adapter.visitRendered(this);
            this.fail();
          }
        });
      }
    }
    getCachedSnapshot() {
      const snapshot = this.view.getCachedSnapshotForLocation(this.location) || this.getPreloadedSnapshot();
      if (snapshot && (!getAnchor(this.location) || snapshot.hasAnchor(getAnchor(this.location)))) {
        if (this.action == "restore" || snapshot.isPreviewable) {
          return snapshot;
        }
      }
    }
    getPreloadedSnapshot() {
      if (this.snapshotHTML) {
        return PageSnapshot.fromHTMLString(this.snapshotHTML);
      }
    }
    hasCachedSnapshot() {
      return this.getCachedSnapshot() != null;
    }
    loadCachedSnapshot() {
      const snapshot = this.getCachedSnapshot();
      if (snapshot) {
        const isPreview = this.shouldIssueRequest();
        this.render(async () => {
          this.cacheSnapshot();
          if (this.isSamePage || this.isPageRefresh) {
            this.adapter.visitRendered(this);
          } else {
            if (this.view.renderPromise) await this.view.renderPromise;
            await this.renderPageSnapshot(snapshot, isPreview);
            this.adapter.visitRendered(this);
            if (!isPreview) {
              this.complete();
            }
          }
        });
      }
    }
    followRedirect() {
      if (this.redirectedToLocation && !this.followedRedirect && this.response?.redirected) {
        this.adapter.visitProposedToLocation(this.redirectedToLocation, {
          action: "replace",
          response: this.response,
          shouldCacheSnapshot: false,
          willRender: false
        });
        this.followedRedirect = true;
      }
    }
    goToSamePageAnchor() {
      if (this.isSamePage) {
        this.render(async () => {
          this.cacheSnapshot();
          this.performScroll();
          this.changeHistory();
          this.adapter.visitRendered(this);
        });
      }
    }
    // Fetch request delegate
    prepareRequest(request) {
      if (this.acceptsStreamResponse) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted() {
      this.startRequest();
    }
    requestPreventedHandlingResponse(_request, _response) {
    }
    async requestSucceededWithResponse(request, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({
          statusCode: SystemStatusCode.contentTypeMismatch,
          redirected
        });
      } else {
        this.redirectedToLocation = response.redirected ? response.location : void 0;
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    async requestFailedWithResponse(request, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({
          statusCode: SystemStatusCode.contentTypeMismatch,
          redirected
        });
      } else {
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    requestErrored(_request, _error) {
      this.recordResponse({
        statusCode: SystemStatusCode.networkFailure,
        redirected: false
      });
    }
    requestFinished() {
      this.finishRequest();
    }
    // Scrolling
    performScroll() {
      if (!this.scrolled && !this.view.forceReloaded && !this.view.shouldPreserveScrollPosition(this)) {
        if (this.action == "restore") {
          this.scrollToRestoredPosition() || this.scrollToAnchor() || this.view.scrollToTop();
        } else {
          this.scrollToAnchor() || this.view.scrollToTop();
        }
        if (this.isSamePage) {
          this.delegate.visitScrolledToSamePageLocation(this.view.lastRenderedLocation, this.location);
        }
        this.scrolled = true;
      }
    }
    scrollToRestoredPosition() {
      const { scrollPosition } = this.restorationData;
      if (scrollPosition) {
        this.view.scrollToPosition(scrollPosition);
        return true;
      }
    }
    scrollToAnchor() {
      const anchor = getAnchor(this.location);
      if (anchor != null) {
        this.view.scrollToAnchor(anchor);
        return true;
      }
    }
    // Instrumentation
    recordTimingMetric(metric) {
      this.timingMetrics[metric] = (/* @__PURE__ */ new Date()).getTime();
    }
    getTimingMetrics() {
      return { ...this.timingMetrics };
    }
    // Private
    getHistoryMethodForAction(action) {
      switch (action) {
        case "replace":
          return history.replaceState;
        case "advance":
        case "restore":
          return history.pushState;
      }
    }
    hasPreloadedResponse() {
      return typeof this.response == "object";
    }
    shouldIssueRequest() {
      if (this.isSamePage) {
        return false;
      } else if (this.action == "restore") {
        return !this.hasCachedSnapshot();
      } else {
        return this.willRender;
      }
    }
    cacheSnapshot() {
      if (!this.snapshotCached) {
        this.view.cacheSnapshot(this.snapshot).then((snapshot) => snapshot && this.visitCachedSnapshot(snapshot));
        this.snapshotCached = true;
      }
    }
    async render(callback) {
      this.cancelRender();
      this.frame = await nextRepaint();
      await callback();
      delete this.frame;
    }
    async renderPageSnapshot(snapshot, isPreview) {
      await this.viewTransitioner.renderChange(this.view.shouldTransitionTo(snapshot), async () => {
        await this.view.renderPage(snapshot, isPreview, this.willRender, this);
        this.performScroll();
      });
    }
    cancelRender() {
      if (this.frame) {
        cancelAnimationFrame(this.frame);
        delete this.frame;
      }
    }
  };
  function isSuccessful(statusCode) {
    return statusCode >= 200 && statusCode < 300;
  }
  var BrowserAdapter = class {
    progressBar = new ProgressBar();
    constructor(session2) {
      this.session = session2;
    }
    visitProposedToLocation(location2, options) {
      if (locationIsVisitable(location2, this.navigator.rootLocation)) {
        this.navigator.startVisit(location2, options?.restorationIdentifier || uuid(), options);
      } else {
        window.location.href = location2.toString();
      }
    }
    visitStarted(visit2) {
      this.location = visit2.location;
      visit2.loadCachedSnapshot();
      visit2.issueRequest();
      visit2.goToSamePageAnchor();
    }
    visitRequestStarted(visit2) {
      this.progressBar.setValue(0);
      if (visit2.hasCachedSnapshot() || visit2.action != "restore") {
        this.showVisitProgressBarAfterDelay();
      } else {
        this.showProgressBar();
      }
    }
    visitRequestCompleted(visit2) {
      visit2.loadResponse();
    }
    visitRequestFailedWithStatusCode(visit2, statusCode) {
      switch (statusCode) {
        case SystemStatusCode.networkFailure:
        case SystemStatusCode.timeoutFailure:
        case SystemStatusCode.contentTypeMismatch:
          return this.reload({
            reason: "request_failed",
            context: {
              statusCode
            }
          });
        default:
          return visit2.loadResponse();
      }
    }
    visitRequestFinished(_visit) {
    }
    visitCompleted(_visit) {
      this.progressBar.setValue(1);
      this.hideVisitProgressBar();
    }
    pageInvalidated(reason) {
      this.reload(reason);
    }
    visitFailed(_visit) {
      this.progressBar.setValue(1);
      this.hideVisitProgressBar();
    }
    visitRendered(_visit) {
    }
    // Form Submission Delegate
    formSubmissionStarted(_formSubmission) {
      this.progressBar.setValue(0);
      this.showFormProgressBarAfterDelay();
    }
    formSubmissionFinished(_formSubmission) {
      this.progressBar.setValue(1);
      this.hideFormProgressBar();
    }
    // Private
    showVisitProgressBarAfterDelay() {
      this.visitProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
    }
    hideVisitProgressBar() {
      this.progressBar.hide();
      if (this.visitProgressBarTimeout != null) {
        window.clearTimeout(this.visitProgressBarTimeout);
        delete this.visitProgressBarTimeout;
      }
    }
    showFormProgressBarAfterDelay() {
      if (this.formProgressBarTimeout == null) {
        this.formProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
      }
    }
    hideFormProgressBar() {
      this.progressBar.hide();
      if (this.formProgressBarTimeout != null) {
        window.clearTimeout(this.formProgressBarTimeout);
        delete this.formProgressBarTimeout;
      }
    }
    showProgressBar = () => {
      this.progressBar.show();
    };
    reload(reason) {
      dispatch("turbo:reload", { detail: reason });
      window.location.href = this.location?.toString() || window.location.href;
    }
    get navigator() {
      return this.session.navigator;
    }
  };
  var CacheObserver = class {
    selector = "[data-turbo-temporary]";
    deprecatedSelector = "[data-turbo-cache=false]";
    started = false;
    start() {
      if (!this.started) {
        this.started = true;
        addEventListener("turbo:before-cache", this.removeTemporaryElements, false);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        removeEventListener("turbo:before-cache", this.removeTemporaryElements, false);
      }
    }
    removeTemporaryElements = (_event) => {
      for (const element of this.temporaryElements) {
        element.remove();
      }
    };
    get temporaryElements() {
      return [...document.querySelectorAll(this.selector), ...this.temporaryElementsWithDeprecation];
    }
    get temporaryElementsWithDeprecation() {
      const elements = document.querySelectorAll(this.deprecatedSelector);
      if (elements.length) {
        console.warn(
          `The ${this.deprecatedSelector} selector is deprecated and will be removed in a future version. Use ${this.selector} instead.`
        );
      }
      return [...elements];
    }
  };
  var FrameRedirector = class {
    constructor(session2, element) {
      this.session = session2;
      this.element = element;
      this.linkInterceptor = new LinkInterceptor(this, element);
      this.formSubmitObserver = new FormSubmitObserver(this, element);
    }
    start() {
      this.linkInterceptor.start();
      this.formSubmitObserver.start();
    }
    stop() {
      this.linkInterceptor.stop();
      this.formSubmitObserver.stop();
    }
    // Link interceptor delegate
    shouldInterceptLinkClick(element, _location, _event) {
      return this.#shouldRedirect(element);
    }
    linkClickIntercepted(element, url, event) {
      const frame = this.#findFrameElement(element);
      if (frame) {
        frame.delegate.linkClickIntercepted(element, url, event);
      }
    }
    // Form submit observer delegate
    willSubmitForm(element, submitter) {
      return element.closest("turbo-frame") == null && this.#shouldSubmit(element, submitter) && this.#shouldRedirect(element, submitter);
    }
    formSubmitted(element, submitter) {
      const frame = this.#findFrameElement(element, submitter);
      if (frame) {
        frame.delegate.formSubmitted(element, submitter);
      }
    }
    #shouldSubmit(form, submitter) {
      const action = getAction$1(form, submitter);
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const rootLocation = expandURL(meta?.content ?? "/");
      return this.#shouldRedirect(form, submitter) && locationIsVisitable(action, rootLocation);
    }
    #shouldRedirect(element, submitter) {
      const isNavigatable = element instanceof HTMLFormElement ? this.session.submissionIsNavigatable(element, submitter) : this.session.elementIsNavigatable(element);
      if (isNavigatable) {
        const frame = this.#findFrameElement(element, submitter);
        return frame ? frame != element.closest("turbo-frame") : false;
      } else {
        return false;
      }
    }
    #findFrameElement(element, submitter) {
      const id2 = submitter?.getAttribute("data-turbo-frame") || element.getAttribute("data-turbo-frame");
      if (id2 && id2 != "_top") {
        const frame = this.element.querySelector(`#${id2}:not([disabled])`);
        if (frame instanceof FrameElement) {
          return frame;
        }
      }
    }
  };
  var History = class {
    location;
    restorationIdentifier = uuid();
    restorationData = {};
    started = false;
    pageLoaded = false;
    currentIndex = 0;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("popstate", this.onPopState, false);
        addEventListener("load", this.onPageLoad, false);
        this.currentIndex = history.state?.turbo?.restorationIndex || 0;
        this.started = true;
        this.replace(new URL(window.location.href));
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("popstate", this.onPopState, false);
        removeEventListener("load", this.onPageLoad, false);
        this.started = false;
      }
    }
    push(location2, restorationIdentifier) {
      this.update(history.pushState, location2, restorationIdentifier);
    }
    replace(location2, restorationIdentifier) {
      this.update(history.replaceState, location2, restorationIdentifier);
    }
    update(method, location2, restorationIdentifier = uuid()) {
      if (method === history.pushState) ++this.currentIndex;
      const state = { turbo: { restorationIdentifier, restorationIndex: this.currentIndex } };
      method.call(history, state, "", location2.href);
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier;
    }
    // Restoration data
    getRestorationDataForIdentifier(restorationIdentifier) {
      return this.restorationData[restorationIdentifier] || {};
    }
    updateRestorationData(additionalData) {
      const { restorationIdentifier } = this;
      const restorationData = this.restorationData[restorationIdentifier];
      this.restorationData[restorationIdentifier] = {
        ...restorationData,
        ...additionalData
      };
    }
    // Scroll restoration
    assumeControlOfScrollRestoration() {
      if (!this.previousScrollRestoration) {
        this.previousScrollRestoration = history.scrollRestoration ?? "auto";
        history.scrollRestoration = "manual";
      }
    }
    relinquishControlOfScrollRestoration() {
      if (this.previousScrollRestoration) {
        history.scrollRestoration = this.previousScrollRestoration;
        delete this.previousScrollRestoration;
      }
    }
    // Event handlers
    onPopState = (event) => {
      if (this.shouldHandlePopState()) {
        const { turbo } = event.state || {};
        if (turbo) {
          this.location = new URL(window.location.href);
          const { restorationIdentifier, restorationIndex } = turbo;
          this.restorationIdentifier = restorationIdentifier;
          const direction = restorationIndex > this.currentIndex ? "forward" : "back";
          this.delegate.historyPoppedToLocationWithRestorationIdentifierAndDirection(this.location, restorationIdentifier, direction);
          this.currentIndex = restorationIndex;
        }
      }
    };
    onPageLoad = async (_event) => {
      await nextMicrotask();
      this.pageLoaded = true;
    };
    // Private
    shouldHandlePopState() {
      return this.pageIsLoaded();
    }
    pageIsLoaded() {
      return this.pageLoaded || document.readyState == "complete";
    }
  };
  var LinkPrefetchObserver = class {
    started = false;
    #prefetchedLink = null;
    constructor(delegate, eventTarget) {
      this.delegate = delegate;
      this.eventTarget = eventTarget;
    }
    start() {
      if (this.started) return;
      if (this.eventTarget.readyState === "loading") {
        this.eventTarget.addEventListener("DOMContentLoaded", this.#enable, { once: true });
      } else {
        this.#enable();
      }
    }
    stop() {
      if (!this.started) return;
      this.eventTarget.removeEventListener("mouseenter", this.#tryToPrefetchRequest, {
        capture: true,
        passive: true
      });
      this.eventTarget.removeEventListener("mouseleave", this.#cancelRequestIfObsolete, {
        capture: true,
        passive: true
      });
      this.eventTarget.removeEventListener("turbo:before-fetch-request", this.#tryToUsePrefetchedRequest, true);
      this.started = false;
    }
    #enable = () => {
      this.eventTarget.addEventListener("mouseenter", this.#tryToPrefetchRequest, {
        capture: true,
        passive: true
      });
      this.eventTarget.addEventListener("mouseleave", this.#cancelRequestIfObsolete, {
        capture: true,
        passive: true
      });
      this.eventTarget.addEventListener("turbo:before-fetch-request", this.#tryToUsePrefetchedRequest, true);
      this.started = true;
    };
    #tryToPrefetchRequest = (event) => {
      if (getMetaContent("turbo-prefetch") === "false") return;
      const target = event.target;
      const isLink = target.matches && target.matches("a[href]:not([target^=_]):not([download])");
      if (isLink && this.#isPrefetchable(target)) {
        const link = target;
        const location2 = getLocationForLink(link);
        if (this.delegate.canPrefetchRequestToLocation(link, location2)) {
          this.#prefetchedLink = link;
          const fetchRequest = new FetchRequest(
            this,
            FetchMethod.get,
            location2,
            new URLSearchParams(),
            target
          );
          prefetchCache.setLater(location2.toString(), fetchRequest, this.#cacheTtl);
        }
      }
    };
    #cancelRequestIfObsolete = (event) => {
      if (event.target === this.#prefetchedLink) this.#cancelPrefetchRequest();
    };
    #cancelPrefetchRequest = () => {
      prefetchCache.clear();
      this.#prefetchedLink = null;
    };
    #tryToUsePrefetchedRequest = (event) => {
      if (event.target.tagName !== "FORM" && event.detail.fetchOptions.method === "get") {
        const cached = prefetchCache.get(event.detail.url.toString());
        if (cached) {
          event.detail.fetchRequest = cached;
        }
        prefetchCache.clear();
      }
    };
    prepareRequest(request) {
      const link = request.target;
      request.headers["X-Sec-Purpose"] = "prefetch";
      const turboFrame = link.closest("turbo-frame");
      const turboFrameTarget = link.getAttribute("data-turbo-frame") || turboFrame?.getAttribute("target") || turboFrame?.id;
      if (turboFrameTarget && turboFrameTarget !== "_top") {
        request.headers["Turbo-Frame"] = turboFrameTarget;
      }
    }
    // Fetch request interface
    requestSucceededWithResponse() {
    }
    requestStarted(fetchRequest) {
    }
    requestErrored(fetchRequest) {
    }
    requestFinished(fetchRequest) {
    }
    requestPreventedHandlingResponse(fetchRequest, fetchResponse) {
    }
    requestFailedWithResponse(fetchRequest, fetchResponse) {
    }
    get #cacheTtl() {
      return Number(getMetaContent("turbo-prefetch-cache-time")) || cacheTtl;
    }
    #isPrefetchable(link) {
      const href = link.getAttribute("href");
      if (!href) return false;
      if (unfetchableLink(link)) return false;
      if (linkToTheSamePage(link)) return false;
      if (linkOptsOut(link)) return false;
      if (nonSafeLink(link)) return false;
      if (eventPrevented(link)) return false;
      return true;
    }
  };
  var unfetchableLink = (link) => {
    return link.origin !== document.location.origin || !["http:", "https:"].includes(link.protocol) || link.hasAttribute("target");
  };
  var linkToTheSamePage = (link) => {
    return link.pathname + link.search === document.location.pathname + document.location.search || link.href.startsWith("#");
  };
  var linkOptsOut = (link) => {
    if (link.getAttribute("data-turbo-prefetch") === "false") return true;
    if (link.getAttribute("data-turbo") === "false") return true;
    const turboPrefetchParent = findClosestRecursively(link, "[data-turbo-prefetch]");
    if (turboPrefetchParent && turboPrefetchParent.getAttribute("data-turbo-prefetch") === "false") return true;
    return false;
  };
  var nonSafeLink = (link) => {
    const turboMethod = link.getAttribute("data-turbo-method");
    if (turboMethod && turboMethod.toLowerCase() !== "get") return true;
    if (isUJS(link)) return true;
    if (link.hasAttribute("data-turbo-confirm")) return true;
    if (link.hasAttribute("data-turbo-stream")) return true;
    return false;
  };
  var isUJS = (link) => {
    return link.hasAttribute("data-remote") || link.hasAttribute("data-behavior") || link.hasAttribute("data-confirm") || link.hasAttribute("data-method");
  };
  var eventPrevented = (link) => {
    const event = dispatch("turbo:before-prefetch", { target: link, cancelable: true });
    return event.defaultPrevented;
  };
  var Navigator = class {
    constructor(delegate) {
      this.delegate = delegate;
    }
    proposeVisit(location2, options = {}) {
      if (this.delegate.allowsVisitingLocationWithAction(location2, options.action)) {
        this.delegate.visitProposedToLocation(location2, options);
      }
    }
    startVisit(locatable, restorationIdentifier, options = {}) {
      this.stop();
      this.currentVisit = new Visit(this, expandURL(locatable), restorationIdentifier, {
        referrer: this.location,
        ...options
      });
      this.currentVisit.start();
    }
    submitForm(form, submitter) {
      this.stop();
      this.formSubmission = new FormSubmission(this, form, submitter, true);
      this.formSubmission.start();
    }
    stop() {
      if (this.formSubmission) {
        this.formSubmission.stop();
        delete this.formSubmission;
      }
      if (this.currentVisit) {
        this.currentVisit.cancel();
        delete this.currentVisit;
      }
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get rootLocation() {
      return this.view.snapshot.rootLocation;
    }
    get history() {
      return this.delegate.history;
    }
    // Form submission delegate
    formSubmissionStarted(formSubmission) {
      if (typeof this.adapter.formSubmissionStarted === "function") {
        this.adapter.formSubmissionStarted(formSubmission);
      }
    }
    async formSubmissionSucceededWithResponse(formSubmission, fetchResponse) {
      if (formSubmission == this.formSubmission) {
        const responseHTML = await fetchResponse.responseHTML;
        if (responseHTML) {
          const shouldCacheSnapshot = formSubmission.isSafe;
          if (!shouldCacheSnapshot) {
            this.view.clearSnapshotCache();
          }
          const { statusCode, redirected } = fetchResponse;
          const action = this.#getActionForFormSubmission(formSubmission, fetchResponse);
          const visitOptions = {
            action,
            shouldCacheSnapshot,
            response: { statusCode, responseHTML, redirected }
          };
          this.proposeVisit(fetchResponse.location, visitOptions);
        }
      }
    }
    async formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      const responseHTML = await fetchResponse.responseHTML;
      if (responseHTML) {
        const snapshot = PageSnapshot.fromHTMLString(responseHTML);
        if (fetchResponse.serverError) {
          await this.view.renderError(snapshot, this.currentVisit);
        } else {
          await this.view.renderPage(snapshot, false, true, this.currentVisit);
        }
        if (!snapshot.shouldPreserveScrollPosition) {
          this.view.scrollToTop();
        }
        this.view.clearSnapshotCache();
      }
    }
    formSubmissionErrored(formSubmission, error2) {
      console.error(error2);
    }
    formSubmissionFinished(formSubmission) {
      if (typeof this.adapter.formSubmissionFinished === "function") {
        this.adapter.formSubmissionFinished(formSubmission);
      }
    }
    // Visit delegate
    visitStarted(visit2) {
      this.delegate.visitStarted(visit2);
    }
    visitCompleted(visit2) {
      this.delegate.visitCompleted(visit2);
    }
    locationWithActionIsSamePage(location2, action) {
      const anchor = getAnchor(location2);
      const currentAnchor = getAnchor(this.view.lastRenderedLocation);
      const isRestorationToTop = action === "restore" && typeof anchor === "undefined";
      return action !== "replace" && getRequestURL(location2) === getRequestURL(this.view.lastRenderedLocation) && (isRestorationToTop || anchor != null && anchor !== currentAnchor);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.delegate.visitScrolledToSamePageLocation(oldURL, newURL);
    }
    // Visits
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    #getActionForFormSubmission(formSubmission, fetchResponse) {
      const { submitter, formElement } = formSubmission;
      return getVisitAction(submitter, formElement) || this.#getDefaultAction(fetchResponse);
    }
    #getDefaultAction(fetchResponse) {
      const sameLocationRedirect = fetchResponse.redirected && fetchResponse.location.href === this.location?.href;
      return sameLocationRedirect ? "replace" : "advance";
    }
  };
  var PageStage = {
    initial: 0,
    loading: 1,
    interactive: 2,
    complete: 3
  };
  var PageObserver = class {
    stage = PageStage.initial;
    started = false;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        if (this.stage == PageStage.initial) {
          this.stage = PageStage.loading;
        }
        document.addEventListener("readystatechange", this.interpretReadyState, false);
        addEventListener("pagehide", this.pageWillUnload, false);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        document.removeEventListener("readystatechange", this.interpretReadyState, false);
        removeEventListener("pagehide", this.pageWillUnload, false);
        this.started = false;
      }
    }
    interpretReadyState = () => {
      const { readyState } = this;
      if (readyState == "interactive") {
        this.pageIsInteractive();
      } else if (readyState == "complete") {
        this.pageIsComplete();
      }
    };
    pageIsInteractive() {
      if (this.stage == PageStage.loading) {
        this.stage = PageStage.interactive;
        this.delegate.pageBecameInteractive();
      }
    }
    pageIsComplete() {
      this.pageIsInteractive();
      if (this.stage == PageStage.interactive) {
        this.stage = PageStage.complete;
        this.delegate.pageLoaded();
      }
    }
    pageWillUnload = () => {
      this.delegate.pageWillUnload();
    };
    get readyState() {
      return document.readyState;
    }
  };
  var ScrollObserver = class {
    started = false;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("scroll", this.onScroll, false);
        this.onScroll();
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("scroll", this.onScroll, false);
        this.started = false;
      }
    }
    onScroll = () => {
      this.updatePosition({ x: window.pageXOffset, y: window.pageYOffset });
    };
    // Private
    updatePosition(position) {
      this.delegate.scrollPositionChanged(position);
    }
  };
  var StreamMessageRenderer = class {
    render({ fragment }) {
      Bardo.preservingPermanentElements(this, getPermanentElementMapForFragment(fragment), () => {
        withAutofocusFromFragment(fragment, () => {
          withPreservedFocus(() => {
            document.documentElement.appendChild(fragment);
          });
        });
      });
    }
    // Bardo delegate
    enteringBardo(currentPermanentElement, newPermanentElement) {
      newPermanentElement.replaceWith(currentPermanentElement.cloneNode(true));
    }
    leavingBardo() {
    }
  };
  function getPermanentElementMapForFragment(fragment) {
    const permanentElementsInDocument = queryPermanentElementsAll(document.documentElement);
    const permanentElementMap = {};
    for (const permanentElementInDocument of permanentElementsInDocument) {
      const { id: id2 } = permanentElementInDocument;
      for (const streamElement of fragment.querySelectorAll("turbo-stream")) {
        const elementInStream = getPermanentElementById(streamElement.templateElement.content, id2);
        if (elementInStream) {
          permanentElementMap[id2] = [permanentElementInDocument, elementInStream];
        }
      }
    }
    return permanentElementMap;
  }
  async function withAutofocusFromFragment(fragment, callback) {
    const generatedID = `turbo-stream-autofocus-${uuid()}`;
    const turboStreams = fragment.querySelectorAll("turbo-stream");
    const elementWithAutofocus = firstAutofocusableElementInStreams(turboStreams);
    let willAutofocusId = null;
    if (elementWithAutofocus) {
      if (elementWithAutofocus.id) {
        willAutofocusId = elementWithAutofocus.id;
      } else {
        willAutofocusId = generatedID;
      }
      elementWithAutofocus.id = willAutofocusId;
    }
    callback();
    await nextRepaint();
    const hasNoActiveElement = document.activeElement == null || document.activeElement == document.body;
    if (hasNoActiveElement && willAutofocusId) {
      const elementToAutofocus = document.getElementById(willAutofocusId);
      if (elementIsFocusable(elementToAutofocus)) {
        elementToAutofocus.focus();
      }
      if (elementToAutofocus && elementToAutofocus.id == generatedID) {
        elementToAutofocus.removeAttribute("id");
      }
    }
  }
  async function withPreservedFocus(callback) {
    const [activeElementBeforeRender, activeElementAfterRender] = await around(callback, () => document.activeElement);
    const restoreFocusTo = activeElementBeforeRender && activeElementBeforeRender.id;
    if (restoreFocusTo) {
      const elementToFocus = document.getElementById(restoreFocusTo);
      if (elementIsFocusable(elementToFocus) && elementToFocus != activeElementAfterRender) {
        elementToFocus.focus();
      }
    }
  }
  function firstAutofocusableElementInStreams(nodeListOfStreamElements) {
    for (const streamElement of nodeListOfStreamElements) {
      const elementWithAutofocus = queryAutofocusableElement(streamElement.templateElement.content);
      if (elementWithAutofocus) return elementWithAutofocus;
    }
    return null;
  }
  var StreamObserver = class {
    sources = /* @__PURE__ */ new Set();
    #started = false;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.#started) {
        this.#started = true;
        addEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    stop() {
      if (this.#started) {
        this.#started = false;
        removeEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    connectStreamSource(source) {
      if (!this.streamSourceIsConnected(source)) {
        this.sources.add(source);
        source.addEventListener("message", this.receiveMessageEvent, false);
      }
    }
    disconnectStreamSource(source) {
      if (this.streamSourceIsConnected(source)) {
        this.sources.delete(source);
        source.removeEventListener("message", this.receiveMessageEvent, false);
      }
    }
    streamSourceIsConnected(source) {
      return this.sources.has(source);
    }
    inspectFetchResponse = (event) => {
      const response = fetchResponseFromEvent(event);
      if (response && fetchResponseIsStream(response)) {
        event.preventDefault();
        this.receiveMessageResponse(response);
      }
    };
    receiveMessageEvent = (event) => {
      if (this.#started && typeof event.data == "string") {
        this.receiveMessageHTML(event.data);
      }
    };
    async receiveMessageResponse(response) {
      const html = await response.responseHTML;
      if (html) {
        this.receiveMessageHTML(html);
      }
    }
    receiveMessageHTML(html) {
      this.delegate.receivedMessageFromStream(StreamMessage.wrap(html));
    }
  };
  function fetchResponseFromEvent(event) {
    const fetchResponse = event.detail?.fetchResponse;
    if (fetchResponse instanceof FetchResponse) {
      return fetchResponse;
    }
  }
  function fetchResponseIsStream(response) {
    const contentType = response.contentType ?? "";
    return contentType.startsWith(StreamMessage.contentType);
  }
  var ErrorRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      const { documentElement, body } = document;
      documentElement.replaceChild(newElement, body);
    }
    async render() {
      this.replaceHeadAndBody();
      this.activateScriptElements();
    }
    replaceHeadAndBody() {
      const { documentElement, head } = document;
      documentElement.replaceChild(this.newHead, head);
      this.renderElement(this.currentElement, this.newElement);
    }
    activateScriptElements() {
      for (const replaceableElement of this.scriptElements) {
        const parentNode = replaceableElement.parentNode;
        if (parentNode) {
          const element = activateScriptElement(replaceableElement);
          parentNode.replaceChild(element, replaceableElement);
        }
      }
    }
    get newHead() {
      return this.newSnapshot.headSnapshot.element;
    }
    get scriptElements() {
      return document.documentElement.querySelectorAll("script");
    }
  };
  var Idiomorph = /* @__PURE__ */ function() {
    let EMPTY_SET = /* @__PURE__ */ new Set();
    let defaults = {
      morphStyle: "outerHTML",
      callbacks: {
        beforeNodeAdded: noOp,
        afterNodeAdded: noOp,
        beforeNodeMorphed: noOp,
        afterNodeMorphed: noOp,
        beforeNodeRemoved: noOp,
        afterNodeRemoved: noOp,
        beforeAttributeUpdated: noOp
      },
      head: {
        style: "merge",
        shouldPreserve: function(elt) {
          return elt.getAttribute("im-preserve") === "true";
        },
        shouldReAppend: function(elt) {
          return elt.getAttribute("im-re-append") === "true";
        },
        shouldRemove: noOp,
        afterHeadMorphed: noOp
      }
    };
    function morph(oldNode, newContent, config = {}) {
      if (oldNode instanceof Document) {
        oldNode = oldNode.documentElement;
      }
      if (typeof newContent === "string") {
        newContent = parseContent(newContent);
      }
      let normalizedContent = normalizeContent(newContent);
      let ctx = createMorphContext(oldNode, normalizedContent, config);
      return morphNormalizedContent(oldNode, normalizedContent, ctx);
    }
    function morphNormalizedContent(oldNode, normalizedNewContent, ctx) {
      if (ctx.head.block) {
        let oldHead = oldNode.querySelector("head");
        let newHead = normalizedNewContent.querySelector("head");
        if (oldHead && newHead) {
          let promises = handleHeadElement(newHead, oldHead, ctx);
          Promise.all(promises).then(function() {
            morphNormalizedContent(oldNode, normalizedNewContent, Object.assign(ctx, {
              head: {
                block: false,
                ignore: true
              }
            }));
          });
          return;
        }
      }
      if (ctx.morphStyle === "innerHTML") {
        morphChildren(normalizedNewContent, oldNode, ctx);
        return oldNode.children;
      } else if (ctx.morphStyle === "outerHTML" || ctx.morphStyle == null) {
        let bestMatch = findBestNodeMatch(normalizedNewContent, oldNode, ctx);
        let previousSibling = bestMatch?.previousSibling;
        let nextSibling = bestMatch?.nextSibling;
        let morphedNode = morphOldNodeTo(oldNode, bestMatch, ctx);
        if (bestMatch) {
          return insertSiblings(previousSibling, morphedNode, nextSibling);
        } else {
          return [];
        }
      } else {
        throw "Do not understand how to morph style " + ctx.morphStyle;
      }
    }
    function ignoreValueOfActiveElement(possibleActiveElement, ctx) {
      return ctx.ignoreActiveValue && possibleActiveElement === document.activeElement && possibleActiveElement !== document.body;
    }
    function morphOldNodeTo(oldNode, newContent, ctx) {
      if (ctx.ignoreActive && oldNode === document.activeElement) ;
      else if (newContent == null) {
        if (ctx.callbacks.beforeNodeRemoved(oldNode) === false) return oldNode;
        oldNode.remove();
        ctx.callbacks.afterNodeRemoved(oldNode);
        return null;
      } else if (!isSoftMatch(oldNode, newContent)) {
        if (ctx.callbacks.beforeNodeRemoved(oldNode) === false) return oldNode;
        if (ctx.callbacks.beforeNodeAdded(newContent) === false) return oldNode;
        oldNode.parentElement.replaceChild(newContent, oldNode);
        ctx.callbacks.afterNodeAdded(newContent);
        ctx.callbacks.afterNodeRemoved(oldNode);
        return newContent;
      } else {
        if (ctx.callbacks.beforeNodeMorphed(oldNode, newContent) === false) return oldNode;
        if (oldNode instanceof HTMLHeadElement && ctx.head.ignore) ;
        else if (oldNode instanceof HTMLHeadElement && ctx.head.style !== "morph") {
          handleHeadElement(newContent, oldNode, ctx);
        } else {
          syncNodeFrom(newContent, oldNode, ctx);
          if (!ignoreValueOfActiveElement(oldNode, ctx)) {
            morphChildren(newContent, oldNode, ctx);
          }
        }
        ctx.callbacks.afterNodeMorphed(oldNode, newContent);
        return oldNode;
      }
    }
    function morphChildren(newParent, oldParent, ctx) {
      let nextNewChild = newParent.firstChild;
      let insertionPoint = oldParent.firstChild;
      let newChild;
      while (nextNewChild) {
        newChild = nextNewChild;
        nextNewChild = newChild.nextSibling;
        if (insertionPoint == null) {
          if (ctx.callbacks.beforeNodeAdded(newChild) === false) return;
          oldParent.appendChild(newChild);
          ctx.callbacks.afterNodeAdded(newChild);
          removeIdsFromConsideration(ctx, newChild);
          continue;
        }
        if (isIdSetMatch(newChild, insertionPoint, ctx)) {
          morphOldNodeTo(insertionPoint, newChild, ctx);
          insertionPoint = insertionPoint.nextSibling;
          removeIdsFromConsideration(ctx, newChild);
          continue;
        }
        let idSetMatch = findIdSetMatch(newParent, oldParent, newChild, insertionPoint, ctx);
        if (idSetMatch) {
          insertionPoint = removeNodesBetween(insertionPoint, idSetMatch, ctx);
          morphOldNodeTo(idSetMatch, newChild, ctx);
          removeIdsFromConsideration(ctx, newChild);
          continue;
        }
        let softMatch = findSoftMatch(newParent, oldParent, newChild, insertionPoint, ctx);
        if (softMatch) {
          insertionPoint = removeNodesBetween(insertionPoint, softMatch, ctx);
          morphOldNodeTo(softMatch, newChild, ctx);
          removeIdsFromConsideration(ctx, newChild);
          continue;
        }
        if (ctx.callbacks.beforeNodeAdded(newChild) === false) return;
        oldParent.insertBefore(newChild, insertionPoint);
        ctx.callbacks.afterNodeAdded(newChild);
        removeIdsFromConsideration(ctx, newChild);
      }
      while (insertionPoint !== null) {
        let tempNode = insertionPoint;
        insertionPoint = insertionPoint.nextSibling;
        removeNode(tempNode, ctx);
      }
    }
    function ignoreAttribute(attr, to, updateType, ctx) {
      if (attr === "value" && ctx.ignoreActiveValue && to === document.activeElement) {
        return true;
      }
      return ctx.callbacks.beforeAttributeUpdated(attr, to, updateType) === false;
    }
    function syncNodeFrom(from, to, ctx) {
      let type = from.nodeType;
      if (type === 1) {
        const fromAttributes = from.attributes;
        const toAttributes = to.attributes;
        for (const fromAttribute of fromAttributes) {
          if (ignoreAttribute(fromAttribute.name, to, "update", ctx)) {
            continue;
          }
          if (to.getAttribute(fromAttribute.name) !== fromAttribute.value) {
            to.setAttribute(fromAttribute.name, fromAttribute.value);
          }
        }
        for (let i = toAttributes.length - 1; 0 <= i; i--) {
          const toAttribute = toAttributes[i];
          if (ignoreAttribute(toAttribute.name, to, "remove", ctx)) {
            continue;
          }
          if (!from.hasAttribute(toAttribute.name)) {
            to.removeAttribute(toAttribute.name);
          }
        }
      }
      if (type === 8 || type === 3) {
        if (to.nodeValue !== from.nodeValue) {
          to.nodeValue = from.nodeValue;
        }
      }
      if (!ignoreValueOfActiveElement(to, ctx)) {
        syncInputValue(from, to, ctx);
      }
    }
    function syncBooleanAttribute(from, to, attributeName, ctx) {
      if (from[attributeName] !== to[attributeName]) {
        let ignoreUpdate = ignoreAttribute(attributeName, to, "update", ctx);
        if (!ignoreUpdate) {
          to[attributeName] = from[attributeName];
        }
        if (from[attributeName]) {
          if (!ignoreUpdate) {
            to.setAttribute(attributeName, from[attributeName]);
          }
        } else {
          if (!ignoreAttribute(attributeName, to, "remove", ctx)) {
            to.removeAttribute(attributeName);
          }
        }
      }
    }
    function syncInputValue(from, to, ctx) {
      if (from instanceof HTMLInputElement && to instanceof HTMLInputElement && from.type !== "file") {
        let fromValue = from.value;
        let toValue = to.value;
        syncBooleanAttribute(from, to, "checked", ctx);
        syncBooleanAttribute(from, to, "disabled", ctx);
        if (!from.hasAttribute("value")) {
          if (!ignoreAttribute("value", to, "remove", ctx)) {
            to.value = "";
            to.removeAttribute("value");
          }
        } else if (fromValue !== toValue) {
          if (!ignoreAttribute("value", to, "update", ctx)) {
            to.setAttribute("value", fromValue);
            to.value = fromValue;
          }
        }
      } else if (from instanceof HTMLOptionElement) {
        syncBooleanAttribute(from, to, "selected", ctx);
      } else if (from instanceof HTMLTextAreaElement && to instanceof HTMLTextAreaElement) {
        let fromValue = from.value;
        let toValue = to.value;
        if (ignoreAttribute("value", to, "update", ctx)) {
          return;
        }
        if (fromValue !== toValue) {
          to.value = fromValue;
        }
        if (to.firstChild && to.firstChild.nodeValue !== fromValue) {
          to.firstChild.nodeValue = fromValue;
        }
      }
    }
    function handleHeadElement(newHeadTag, currentHead, ctx) {
      let added = [];
      let removed = [];
      let preserved = [];
      let nodesToAppend = [];
      let headMergeStyle = ctx.head.style;
      let srcToNewHeadNodes = /* @__PURE__ */ new Map();
      for (const newHeadChild of newHeadTag.children) {
        srcToNewHeadNodes.set(newHeadChild.outerHTML, newHeadChild);
      }
      for (const currentHeadElt of currentHead.children) {
        let inNewContent = srcToNewHeadNodes.has(currentHeadElt.outerHTML);
        let isReAppended = ctx.head.shouldReAppend(currentHeadElt);
        let isPreserved = ctx.head.shouldPreserve(currentHeadElt);
        if (inNewContent || isPreserved) {
          if (isReAppended) {
            removed.push(currentHeadElt);
          } else {
            srcToNewHeadNodes.delete(currentHeadElt.outerHTML);
            preserved.push(currentHeadElt);
          }
        } else {
          if (headMergeStyle === "append") {
            if (isReAppended) {
              removed.push(currentHeadElt);
              nodesToAppend.push(currentHeadElt);
            }
          } else {
            if (ctx.head.shouldRemove(currentHeadElt) !== false) {
              removed.push(currentHeadElt);
            }
          }
        }
      }
      nodesToAppend.push(...srcToNewHeadNodes.values());
      let promises = [];
      for (const newNode of nodesToAppend) {
        let newElt = document.createRange().createContextualFragment(newNode.outerHTML).firstChild;
        if (ctx.callbacks.beforeNodeAdded(newElt) !== false) {
          if (newElt.href || newElt.src) {
            let resolve = null;
            let promise = new Promise(function(_resolve) {
              resolve = _resolve;
            });
            newElt.addEventListener("load", function() {
              resolve();
            });
            promises.push(promise);
          }
          currentHead.appendChild(newElt);
          ctx.callbacks.afterNodeAdded(newElt);
          added.push(newElt);
        }
      }
      for (const removedElement of removed) {
        if (ctx.callbacks.beforeNodeRemoved(removedElement) !== false) {
          currentHead.removeChild(removedElement);
          ctx.callbacks.afterNodeRemoved(removedElement);
        }
      }
      ctx.head.afterHeadMorphed(currentHead, { added, kept: preserved, removed });
      return promises;
    }
    function noOp() {
    }
    function mergeDefaults(config) {
      let finalConfig = {};
      Object.assign(finalConfig, defaults);
      Object.assign(finalConfig, config);
      finalConfig.callbacks = {};
      Object.assign(finalConfig.callbacks, defaults.callbacks);
      Object.assign(finalConfig.callbacks, config.callbacks);
      finalConfig.head = {};
      Object.assign(finalConfig.head, defaults.head);
      Object.assign(finalConfig.head, config.head);
      return finalConfig;
    }
    function createMorphContext(oldNode, newContent, config) {
      config = mergeDefaults(config);
      return {
        target: oldNode,
        newContent,
        config,
        morphStyle: config.morphStyle,
        ignoreActive: config.ignoreActive,
        ignoreActiveValue: config.ignoreActiveValue,
        idMap: createIdMap(oldNode, newContent),
        deadIds: /* @__PURE__ */ new Set(),
        callbacks: config.callbacks,
        head: config.head
      };
    }
    function isIdSetMatch(node1, node2, ctx) {
      if (node1 == null || node2 == null) {
        return false;
      }
      if (node1.nodeType === node2.nodeType && node1.tagName === node2.tagName) {
        if (node1.id !== "" && node1.id === node2.id) {
          return true;
        } else {
          return getIdIntersectionCount(ctx, node1, node2) > 0;
        }
      }
      return false;
    }
    function isSoftMatch(node1, node2) {
      if (node1 == null || node2 == null) {
        return false;
      }
      return node1.nodeType === node2.nodeType && node1.tagName === node2.tagName;
    }
    function removeNodesBetween(startInclusive, endExclusive, ctx) {
      while (startInclusive !== endExclusive) {
        let tempNode = startInclusive;
        startInclusive = startInclusive.nextSibling;
        removeNode(tempNode, ctx);
      }
      removeIdsFromConsideration(ctx, endExclusive);
      return endExclusive.nextSibling;
    }
    function findIdSetMatch(newContent, oldParent, newChild, insertionPoint, ctx) {
      let newChildPotentialIdCount = getIdIntersectionCount(ctx, newChild, oldParent);
      let potentialMatch = null;
      if (newChildPotentialIdCount > 0) {
        let potentialMatch2 = insertionPoint;
        let otherMatchCount = 0;
        while (potentialMatch2 != null) {
          if (isIdSetMatch(newChild, potentialMatch2, ctx)) {
            return potentialMatch2;
          }
          otherMatchCount += getIdIntersectionCount(ctx, potentialMatch2, newContent);
          if (otherMatchCount > newChildPotentialIdCount) {
            return null;
          }
          potentialMatch2 = potentialMatch2.nextSibling;
        }
      }
      return potentialMatch;
    }
    function findSoftMatch(newContent, oldParent, newChild, insertionPoint, ctx) {
      let potentialSoftMatch = insertionPoint;
      let nextSibling = newChild.nextSibling;
      let siblingSoftMatchCount = 0;
      while (potentialSoftMatch != null) {
        if (getIdIntersectionCount(ctx, potentialSoftMatch, newContent) > 0) {
          return null;
        }
        if (isSoftMatch(newChild, potentialSoftMatch)) {
          return potentialSoftMatch;
        }
        if (isSoftMatch(nextSibling, potentialSoftMatch)) {
          siblingSoftMatchCount++;
          nextSibling = nextSibling.nextSibling;
          if (siblingSoftMatchCount >= 2) {
            return null;
          }
        }
        potentialSoftMatch = potentialSoftMatch.nextSibling;
      }
      return potentialSoftMatch;
    }
    function parseContent(newContent) {
      let parser = new DOMParser();
      let contentWithSvgsRemoved = newContent.replace(/<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim, "");
      if (contentWithSvgsRemoved.match(/<\/html>/) || contentWithSvgsRemoved.match(/<\/head>/) || contentWithSvgsRemoved.match(/<\/body>/)) {
        let content = parser.parseFromString(newContent, "text/html");
        if (contentWithSvgsRemoved.match(/<\/html>/)) {
          content.generatedByIdiomorph = true;
          return content;
        } else {
          let htmlElement = content.firstChild;
          if (htmlElement) {
            htmlElement.generatedByIdiomorph = true;
            return htmlElement;
          } else {
            return null;
          }
        }
      } else {
        let responseDoc = parser.parseFromString("<body><template>" + newContent + "</template></body>", "text/html");
        let content = responseDoc.body.querySelector("template").content;
        content.generatedByIdiomorph = true;
        return content;
      }
    }
    function normalizeContent(newContent) {
      if (newContent == null) {
        const dummyParent = document.createElement("div");
        return dummyParent;
      } else if (newContent.generatedByIdiomorph) {
        return newContent;
      } else if (newContent instanceof Node) {
        const dummyParent = document.createElement("div");
        dummyParent.append(newContent);
        return dummyParent;
      } else {
        const dummyParent = document.createElement("div");
        for (const elt of [...newContent]) {
          dummyParent.append(elt);
        }
        return dummyParent;
      }
    }
    function insertSiblings(previousSibling, morphedNode, nextSibling) {
      let stack = [];
      let added = [];
      while (previousSibling != null) {
        stack.push(previousSibling);
        previousSibling = previousSibling.previousSibling;
      }
      while (stack.length > 0) {
        let node = stack.pop();
        added.push(node);
        morphedNode.parentElement.insertBefore(node, morphedNode);
      }
      added.push(morphedNode);
      while (nextSibling != null) {
        stack.push(nextSibling);
        added.push(nextSibling);
        nextSibling = nextSibling.nextSibling;
      }
      while (stack.length > 0) {
        morphedNode.parentElement.insertBefore(stack.pop(), morphedNode.nextSibling);
      }
      return added;
    }
    function findBestNodeMatch(newContent, oldNode, ctx) {
      let currentElement;
      currentElement = newContent.firstChild;
      let bestElement = currentElement;
      let score = 0;
      while (currentElement) {
        let newScore = scoreElement(currentElement, oldNode, ctx);
        if (newScore > score) {
          bestElement = currentElement;
          score = newScore;
        }
        currentElement = currentElement.nextSibling;
      }
      return bestElement;
    }
    function scoreElement(node1, node2, ctx) {
      if (isSoftMatch(node1, node2)) {
        return 0.5 + getIdIntersectionCount(ctx, node1, node2);
      }
      return 0;
    }
    function removeNode(tempNode, ctx) {
      removeIdsFromConsideration(ctx, tempNode);
      if (ctx.callbacks.beforeNodeRemoved(tempNode) === false) return;
      tempNode.remove();
      ctx.callbacks.afterNodeRemoved(tempNode);
    }
    function isIdInConsideration(ctx, id2) {
      return !ctx.deadIds.has(id2);
    }
    function idIsWithinNode(ctx, id2, targetNode) {
      let idSet = ctx.idMap.get(targetNode) || EMPTY_SET;
      return idSet.has(id2);
    }
    function removeIdsFromConsideration(ctx, node) {
      let idSet = ctx.idMap.get(node) || EMPTY_SET;
      for (const id2 of idSet) {
        ctx.deadIds.add(id2);
      }
    }
    function getIdIntersectionCount(ctx, node1, node2) {
      let sourceSet = ctx.idMap.get(node1) || EMPTY_SET;
      let matchCount = 0;
      for (const id2 of sourceSet) {
        if (isIdInConsideration(ctx, id2) && idIsWithinNode(ctx, id2, node2)) {
          ++matchCount;
        }
      }
      return matchCount;
    }
    function populateIdMapForNode(node, idMap) {
      let nodeParent = node.parentElement;
      let idElements = node.querySelectorAll("[id]");
      for (const elt of idElements) {
        let current = elt;
        while (current !== nodeParent && current != null) {
          let idSet = idMap.get(current);
          if (idSet == null) {
            idSet = /* @__PURE__ */ new Set();
            idMap.set(current, idSet);
          }
          idSet.add(elt.id);
          current = current.parentElement;
        }
      }
    }
    function createIdMap(oldContent, newContent) {
      let idMap = /* @__PURE__ */ new Map();
      populateIdMapForNode(oldContent, idMap);
      populateIdMapForNode(newContent, idMap);
      return idMap;
    }
    return {
      morph,
      defaults
    };
  }();
  var PageRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      if (document.body && newElement instanceof HTMLBodyElement) {
        document.body.replaceWith(newElement);
      } else {
        document.documentElement.appendChild(newElement);
      }
    }
    get shouldRender() {
      return this.newSnapshot.isVisitable && this.trackedElementsAreIdentical;
    }
    get reloadReason() {
      if (!this.newSnapshot.isVisitable) {
        return {
          reason: "turbo_visit_control_is_reload"
        };
      }
      if (!this.trackedElementsAreIdentical) {
        return {
          reason: "tracked_element_mismatch"
        };
      }
    }
    async prepareToRender() {
      this.#setLanguage();
      await this.mergeHead();
    }
    async render() {
      if (this.willRender) {
        await this.replaceBody();
      }
    }
    finishRendering() {
      super.finishRendering();
      if (!this.isPreview) {
        this.focusFirstAutofocusableElement();
      }
    }
    get currentHeadSnapshot() {
      return this.currentSnapshot.headSnapshot;
    }
    get newHeadSnapshot() {
      return this.newSnapshot.headSnapshot;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    #setLanguage() {
      const { documentElement } = this.currentSnapshot;
      const { lang } = this.newSnapshot;
      if (lang) {
        documentElement.setAttribute("lang", lang);
      } else {
        documentElement.removeAttribute("lang");
      }
    }
    async mergeHead() {
      const mergedHeadElements = this.mergeProvisionalElements();
      const newStylesheetElements = this.copyNewHeadStylesheetElements();
      this.copyNewHeadScriptElements();
      await mergedHeadElements;
      await newStylesheetElements;
      if (this.willRender) {
        this.removeUnusedDynamicStylesheetElements();
      }
    }
    async replaceBody() {
      await this.preservingPermanentElements(async () => {
        this.activateNewBody();
        await this.assignNewBody();
      });
    }
    get trackedElementsAreIdentical() {
      return this.currentHeadSnapshot.trackedElementSignature == this.newHeadSnapshot.trackedElementSignature;
    }
    async copyNewHeadStylesheetElements() {
      const loadingElements = [];
      for (const element of this.newHeadStylesheetElements) {
        loadingElements.push(waitForLoad(element));
        document.head.appendChild(element);
      }
      await Promise.all(loadingElements);
    }
    copyNewHeadScriptElements() {
      for (const element of this.newHeadScriptElements) {
        document.head.appendChild(activateScriptElement(element));
      }
    }
    removeUnusedDynamicStylesheetElements() {
      for (const element of this.unusedDynamicStylesheetElements) {
        document.head.removeChild(element);
      }
    }
    async mergeProvisionalElements() {
      const newHeadElements = [...this.newHeadProvisionalElements];
      for (const element of this.currentHeadProvisionalElements) {
        if (!this.isCurrentElementInElementList(element, newHeadElements)) {
          document.head.removeChild(element);
        }
      }
      for (const element of newHeadElements) {
        document.head.appendChild(element);
      }
    }
    isCurrentElementInElementList(element, elementList) {
      for (const [index, newElement] of elementList.entries()) {
        if (element.tagName == "TITLE") {
          if (newElement.tagName != "TITLE") {
            continue;
          }
          if (element.innerHTML == newElement.innerHTML) {
            elementList.splice(index, 1);
            return true;
          }
        }
        if (newElement.isEqualNode(element)) {
          elementList.splice(index, 1);
          return true;
        }
      }
      return false;
    }
    removeCurrentHeadProvisionalElements() {
      for (const element of this.currentHeadProvisionalElements) {
        document.head.removeChild(element);
      }
    }
    copyNewHeadProvisionalElements() {
      for (const element of this.newHeadProvisionalElements) {
        document.head.appendChild(element);
      }
    }
    activateNewBody() {
      document.adoptNode(this.newElement);
      this.activateNewBodyScriptElements();
    }
    activateNewBodyScriptElements() {
      for (const inertScriptElement of this.newBodyScriptElements) {
        const activatedScriptElement = activateScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    async assignNewBody() {
      await this.renderElement(this.currentElement, this.newElement);
    }
    get unusedDynamicStylesheetElements() {
      return this.oldHeadStylesheetElements.filter((element) => {
        return element.getAttribute("data-turbo-track") === "dynamic";
      });
    }
    get oldHeadStylesheetElements() {
      return this.currentHeadSnapshot.getStylesheetElementsNotInSnapshot(this.newHeadSnapshot);
    }
    get newHeadStylesheetElements() {
      return this.newHeadSnapshot.getStylesheetElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get newHeadScriptElements() {
      return this.newHeadSnapshot.getScriptElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get currentHeadProvisionalElements() {
      return this.currentHeadSnapshot.provisionalElements;
    }
    get newHeadProvisionalElements() {
      return this.newHeadSnapshot.provisionalElements;
    }
    get newBodyScriptElements() {
      return this.newElement.querySelectorAll("script");
    }
  };
  var MorphRenderer = class extends PageRenderer {
    async render() {
      if (this.willRender) await this.#morphBody();
    }
    get renderMethod() {
      return "morph";
    }
    // Private
    async #morphBody() {
      this.#morphElements(this.currentElement, this.newElement);
      this.#reloadRemoteFrames();
      dispatch("turbo:morph", {
        detail: {
          currentElement: this.currentElement,
          newElement: this.newElement
        }
      });
    }
    #morphElements(currentElement, newElement, morphStyle = "outerHTML") {
      this.isMorphingTurboFrame = this.#isFrameReloadedWithMorph(currentElement);
      Idiomorph.morph(currentElement, newElement, {
        morphStyle,
        callbacks: {
          beforeNodeAdded: this.#shouldAddElement,
          beforeNodeMorphed: this.#shouldMorphElement,
          beforeAttributeUpdated: this.#shouldUpdateAttribute,
          beforeNodeRemoved: this.#shouldRemoveElement,
          afterNodeMorphed: this.#didMorphElement
        }
      });
    }
    #shouldAddElement = (node) => {
      return !(node.id && node.hasAttribute("data-turbo-permanent") && document.getElementById(node.id));
    };
    #shouldMorphElement = (oldNode, newNode) => {
      if (oldNode instanceof HTMLElement) {
        if (!oldNode.hasAttribute("data-turbo-permanent") && (this.isMorphingTurboFrame || !this.#isFrameReloadedWithMorph(oldNode))) {
          const event = dispatch("turbo:before-morph-element", {
            cancelable: true,
            target: oldNode,
            detail: {
              newElement: newNode
            }
          });
          return !event.defaultPrevented;
        } else {
          return false;
        }
      }
    };
    #shouldUpdateAttribute = (attributeName, target, mutationType) => {
      const event = dispatch("turbo:before-morph-attribute", { cancelable: true, target, detail: { attributeName, mutationType } });
      return !event.defaultPrevented;
    };
    #didMorphElement = (oldNode, newNode) => {
      if (newNode instanceof HTMLElement) {
        dispatch("turbo:morph-element", {
          target: oldNode,
          detail: {
            newElement: newNode
          }
        });
      }
    };
    #shouldRemoveElement = (node) => {
      return this.#shouldMorphElement(node);
    };
    #reloadRemoteFrames() {
      this.#remoteFrames().forEach((frame) => {
        if (this.#isFrameReloadedWithMorph(frame)) {
          this.#renderFrameWithMorph(frame);
          frame.reload();
        }
      });
    }
    #renderFrameWithMorph(frame) {
      frame.addEventListener("turbo:before-frame-render", (event) => {
        event.detail.render = this.#morphFrameUpdate;
      }, { once: true });
    }
    #morphFrameUpdate = (currentElement, newElement) => {
      dispatch("turbo:before-frame-morph", {
        target: currentElement,
        detail: { currentElement, newElement }
      });
      this.#morphElements(currentElement, newElement.children, "innerHTML");
    };
    #isFrameReloadedWithMorph(element) {
      return element.src && element.refresh === "morph";
    }
    #remoteFrames() {
      return Array.from(document.querySelectorAll("turbo-frame[src]")).filter((frame) => {
        return !frame.closest("[data-turbo-permanent]");
      });
    }
  };
  var SnapshotCache = class {
    keys = [];
    snapshots = {};
    constructor(size) {
      this.size = size;
    }
    has(location2) {
      return toCacheKey(location2) in this.snapshots;
    }
    get(location2) {
      if (this.has(location2)) {
        const snapshot = this.read(location2);
        this.touch(location2);
        return snapshot;
      }
    }
    put(location2, snapshot) {
      this.write(location2, snapshot);
      this.touch(location2);
      return snapshot;
    }
    clear() {
      this.snapshots = {};
    }
    // Private
    read(location2) {
      return this.snapshots[toCacheKey(location2)];
    }
    write(location2, snapshot) {
      this.snapshots[toCacheKey(location2)] = snapshot;
    }
    touch(location2) {
      const key = toCacheKey(location2);
      const index = this.keys.indexOf(key);
      if (index > -1) this.keys.splice(index, 1);
      this.keys.unshift(key);
      this.trim();
    }
    trim() {
      for (const key of this.keys.splice(this.size)) {
        delete this.snapshots[key];
      }
    }
  };
  var PageView = class extends View {
    snapshotCache = new SnapshotCache(10);
    lastRenderedLocation = new URL(location.href);
    forceReloaded = false;
    shouldTransitionTo(newSnapshot) {
      return this.snapshot.prefersViewTransitions && newSnapshot.prefersViewTransitions;
    }
    renderPage(snapshot, isPreview = false, willRender = true, visit2) {
      const shouldMorphPage = this.isPageRefresh(visit2) && this.snapshot.shouldMorphPage;
      const rendererClass = shouldMorphPage ? MorphRenderer : PageRenderer;
      const renderer = new rendererClass(this.snapshot, snapshot, PageRenderer.renderElement, isPreview, willRender);
      if (!renderer.shouldRender) {
        this.forceReloaded = true;
      } else {
        visit2?.changeHistory();
      }
      return this.render(renderer);
    }
    renderError(snapshot, visit2) {
      visit2?.changeHistory();
      const renderer = new ErrorRenderer(this.snapshot, snapshot, ErrorRenderer.renderElement, false);
      return this.render(renderer);
    }
    clearSnapshotCache() {
      this.snapshotCache.clear();
    }
    async cacheSnapshot(snapshot = this.snapshot) {
      if (snapshot.isCacheable) {
        this.delegate.viewWillCacheSnapshot();
        const { lastRenderedLocation: location2 } = this;
        await nextEventLoopTick();
        const cachedSnapshot = snapshot.clone();
        this.snapshotCache.put(location2, cachedSnapshot);
        return cachedSnapshot;
      }
    }
    getCachedSnapshotForLocation(location2) {
      return this.snapshotCache.get(location2);
    }
    isPageRefresh(visit2) {
      return !visit2 || this.lastRenderedLocation.pathname === visit2.location.pathname && visit2.action === "replace";
    }
    shouldPreserveScrollPosition(visit2) {
      return this.isPageRefresh(visit2) && this.snapshot.shouldPreserveScrollPosition;
    }
    get snapshot() {
      return PageSnapshot.fromElement(this.element);
    }
  };
  var Preloader = class {
    selector = "a[data-turbo-preload]";
    constructor(delegate, snapshotCache) {
      this.delegate = delegate;
      this.snapshotCache = snapshotCache;
    }
    start() {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", this.#preloadAll);
      } else {
        this.preloadOnLoadLinksForView(document.body);
      }
    }
    stop() {
      document.removeEventListener("DOMContentLoaded", this.#preloadAll);
    }
    preloadOnLoadLinksForView(element) {
      for (const link of element.querySelectorAll(this.selector)) {
        if (this.delegate.shouldPreloadLink(link)) {
          this.preloadURL(link);
        }
      }
    }
    async preloadURL(link) {
      const location2 = new URL(link.href);
      if (this.snapshotCache.has(location2)) {
        return;
      }
      const fetchRequest = new FetchRequest(this, FetchMethod.get, location2, new URLSearchParams(), link);
      await fetchRequest.perform();
    }
    // Fetch request delegate
    prepareRequest(fetchRequest) {
      fetchRequest.headers["X-Sec-Purpose"] = "prefetch";
    }
    async requestSucceededWithResponse(fetchRequest, fetchResponse) {
      try {
        const responseHTML = await fetchResponse.responseHTML;
        const snapshot = PageSnapshot.fromHTMLString(responseHTML);
        this.snapshotCache.put(fetchRequest.url, snapshot);
      } catch (_) {
      }
    }
    requestStarted(fetchRequest) {
    }
    requestErrored(fetchRequest) {
    }
    requestFinished(fetchRequest) {
    }
    requestPreventedHandlingResponse(fetchRequest, fetchResponse) {
    }
    requestFailedWithResponse(fetchRequest, fetchResponse) {
    }
    #preloadAll = () => {
      this.preloadOnLoadLinksForView(document.body);
    };
  };
  var Cache = class {
    constructor(session2) {
      this.session = session2;
    }
    clear() {
      this.session.clearCache();
    }
    resetCacheControl() {
      this.#setCacheControl("");
    }
    exemptPageFromCache() {
      this.#setCacheControl("no-cache");
    }
    exemptPageFromPreview() {
      this.#setCacheControl("no-preview");
    }
    #setCacheControl(value) {
      setMetaContent("turbo-cache-control", value);
    }
  };
  var Session = class {
    navigator = new Navigator(this);
    history = new History(this);
    view = new PageView(this, document.documentElement);
    adapter = new BrowserAdapter(this);
    pageObserver = new PageObserver(this);
    cacheObserver = new CacheObserver();
    linkPrefetchObserver = new LinkPrefetchObserver(this, document);
    linkClickObserver = new LinkClickObserver(this, window);
    formSubmitObserver = new FormSubmitObserver(this, document);
    scrollObserver = new ScrollObserver(this);
    streamObserver = new StreamObserver(this);
    formLinkClickObserver = new FormLinkClickObserver(this, document.documentElement);
    frameRedirector = new FrameRedirector(this, document.documentElement);
    streamMessageRenderer = new StreamMessageRenderer();
    cache = new Cache(this);
    drive = true;
    enabled = true;
    progressBarDelay = 500;
    started = false;
    formMode = "on";
    #pageRefreshDebouncePeriod = 150;
    constructor(recentRequests2) {
      this.recentRequests = recentRequests2;
      this.preloader = new Preloader(this, this.view.snapshotCache);
      this.debouncedRefresh = this.refresh;
      this.pageRefreshDebouncePeriod = this.pageRefreshDebouncePeriod;
    }
    start() {
      if (!this.started) {
        this.pageObserver.start();
        this.cacheObserver.start();
        this.linkPrefetchObserver.start();
        this.formLinkClickObserver.start();
        this.linkClickObserver.start();
        this.formSubmitObserver.start();
        this.scrollObserver.start();
        this.streamObserver.start();
        this.frameRedirector.start();
        this.history.start();
        this.preloader.start();
        this.started = true;
        this.enabled = true;
      }
    }
    disable() {
      this.enabled = false;
    }
    stop() {
      if (this.started) {
        this.pageObserver.stop();
        this.cacheObserver.stop();
        this.linkPrefetchObserver.stop();
        this.formLinkClickObserver.stop();
        this.linkClickObserver.stop();
        this.formSubmitObserver.stop();
        this.scrollObserver.stop();
        this.streamObserver.stop();
        this.frameRedirector.stop();
        this.history.stop();
        this.preloader.stop();
        this.started = false;
      }
    }
    registerAdapter(adapter) {
      this.adapter = adapter;
    }
    visit(location2, options = {}) {
      const frameElement = options.frame ? document.getElementById(options.frame) : null;
      if (frameElement instanceof FrameElement) {
        const action = options.action || getVisitAction(frameElement);
        frameElement.delegate.proposeVisitIfNavigatedWithAction(frameElement, action);
        frameElement.src = location2.toString();
      } else {
        this.navigator.proposeVisit(expandURL(location2), options);
      }
    }
    refresh(url, requestId) {
      const isRecentRequest = requestId && this.recentRequests.has(requestId);
      if (!isRecentRequest) {
        this.visit(url, { action: "replace", shouldCacheSnapshot: false });
      }
    }
    connectStreamSource(source) {
      this.streamObserver.connectStreamSource(source);
    }
    disconnectStreamSource(source) {
      this.streamObserver.disconnectStreamSource(source);
    }
    renderStreamMessage(message) {
      this.streamMessageRenderer.render(StreamMessage.wrap(message));
    }
    clearCache() {
      this.view.clearSnapshotCache();
    }
    setProgressBarDelay(delay) {
      this.progressBarDelay = delay;
    }
    setFormMode(mode) {
      this.formMode = mode;
    }
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    get pageRefreshDebouncePeriod() {
      return this.#pageRefreshDebouncePeriod;
    }
    set pageRefreshDebouncePeriod(value) {
      this.refresh = debounce(this.debouncedRefresh.bind(this), value);
      this.#pageRefreshDebouncePeriod = value;
    }
    // Preloader delegate
    shouldPreloadLink(element) {
      const isUnsafe = element.hasAttribute("data-turbo-method");
      const isStream = element.hasAttribute("data-turbo-stream");
      const frameTarget = element.getAttribute("data-turbo-frame");
      const frame = frameTarget == "_top" ? null : document.getElementById(frameTarget) || findClosestRecursively(element, "turbo-frame:not([disabled])");
      if (isUnsafe || isStream || frame instanceof FrameElement) {
        return false;
      } else {
        const location2 = new URL(element.href);
        return this.elementIsNavigatable(element) && locationIsVisitable(location2, this.snapshot.rootLocation);
      }
    }
    // History delegate
    historyPoppedToLocationWithRestorationIdentifierAndDirection(location2, restorationIdentifier, direction) {
      if (this.enabled) {
        this.navigator.startVisit(location2, restorationIdentifier, {
          action: "restore",
          historyChanged: true,
          direction
        });
      } else {
        this.adapter.pageInvalidated({
          reason: "turbo_disabled"
        });
      }
    }
    // Scroll observer delegate
    scrollPositionChanged(position) {
      this.history.updateRestorationData({ scrollPosition: position });
    }
    // Form click observer delegate
    willSubmitFormLinkToLocation(link, location2) {
      return this.elementIsNavigatable(link) && locationIsVisitable(location2, this.snapshot.rootLocation);
    }
    submittedFormLinkToLocation() {
    }
    // Link hover observer delegate
    canPrefetchRequestToLocation(link, location2) {
      return this.elementIsNavigatable(link) && locationIsVisitable(location2, this.snapshot.rootLocation);
    }
    // Link click observer delegate
    willFollowLinkToLocation(link, location2, event) {
      return this.elementIsNavigatable(link) && locationIsVisitable(location2, this.snapshot.rootLocation) && this.applicationAllowsFollowingLinkToLocation(link, location2, event);
    }
    followedLinkToLocation(link, location2) {
      const action = this.getActionForLink(link);
      const acceptsStreamResponse = link.hasAttribute("data-turbo-stream");
      this.visit(location2.href, { action, acceptsStreamResponse });
    }
    // Navigator delegate
    allowsVisitingLocationWithAction(location2, action) {
      return this.locationWithActionIsSamePage(location2, action) || this.applicationAllowsVisitingLocation(location2);
    }
    visitProposedToLocation(location2, options) {
      extendURLWithDeprecatedProperties(location2);
      this.adapter.visitProposedToLocation(location2, options);
    }
    // Visit delegate
    visitStarted(visit2) {
      if (!visit2.acceptsStreamResponse) {
        markAsBusy(document.documentElement);
        this.view.markVisitDirection(visit2.direction);
      }
      extendURLWithDeprecatedProperties(visit2.location);
      if (!visit2.silent) {
        this.notifyApplicationAfterVisitingLocation(visit2.location, visit2.action);
      }
    }
    visitCompleted(visit2) {
      this.view.unmarkVisitDirection();
      clearBusyState(document.documentElement);
      this.notifyApplicationAfterPageLoad(visit2.getTimingMetrics());
    }
    locationWithActionIsSamePage(location2, action) {
      return this.navigator.locationWithActionIsSamePage(location2, action);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL);
    }
    // Form submit observer delegate
    willSubmitForm(form, submitter) {
      const action = getAction$1(form, submitter);
      return this.submissionIsNavigatable(form, submitter) && locationIsVisitable(expandURL(action), this.snapshot.rootLocation);
    }
    formSubmitted(form, submitter) {
      this.navigator.submitForm(form, submitter);
    }
    // Page observer delegate
    pageBecameInteractive() {
      this.view.lastRenderedLocation = this.location;
      this.notifyApplicationAfterPageLoad();
    }
    pageLoaded() {
      this.history.assumeControlOfScrollRestoration();
    }
    pageWillUnload() {
      this.history.relinquishControlOfScrollRestoration();
    }
    // Stream observer delegate
    receivedMessageFromStream(message) {
      this.renderStreamMessage(message);
    }
    // Page view delegate
    viewWillCacheSnapshot() {
      if (!this.navigator.currentVisit?.silent) {
        this.notifyApplicationBeforeCachingSnapshot();
      }
    }
    allowsImmediateRender({ element }, options) {
      const event = this.notifyApplicationBeforeRender(element, options);
      const {
        defaultPrevented,
        detail: { render }
      } = event;
      if (this.view.renderer && render) {
        this.view.renderer.renderElement = render;
      }
      return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, _isPreview, renderMethod) {
      this.view.lastRenderedLocation = this.history.location;
      this.notifyApplicationAfterRender(renderMethod);
    }
    preloadOnLoadLinksForView(element) {
      this.preloader.preloadOnLoadLinksForView(element);
    }
    viewInvalidated(reason) {
      this.adapter.pageInvalidated(reason);
    }
    // Frame element
    frameLoaded(frame) {
      this.notifyApplicationAfterFrameLoad(frame);
    }
    frameRendered(fetchResponse, frame) {
      this.notifyApplicationAfterFrameRender(fetchResponse, frame);
    }
    // Application events
    applicationAllowsFollowingLinkToLocation(link, location2, ev) {
      const event = this.notifyApplicationAfterClickingLinkToLocation(link, location2, ev);
      return !event.defaultPrevented;
    }
    applicationAllowsVisitingLocation(location2) {
      const event = this.notifyApplicationBeforeVisitingLocation(location2);
      return !event.defaultPrevented;
    }
    notifyApplicationAfterClickingLinkToLocation(link, location2, event) {
      return dispatch("turbo:click", {
        target: link,
        detail: { url: location2.href, originalEvent: event },
        cancelable: true
      });
    }
    notifyApplicationBeforeVisitingLocation(location2) {
      return dispatch("turbo:before-visit", {
        detail: { url: location2.href },
        cancelable: true
      });
    }
    notifyApplicationAfterVisitingLocation(location2, action) {
      return dispatch("turbo:visit", { detail: { url: location2.href, action } });
    }
    notifyApplicationBeforeCachingSnapshot() {
      return dispatch("turbo:before-cache");
    }
    notifyApplicationBeforeRender(newBody, options) {
      return dispatch("turbo:before-render", {
        detail: { newBody, ...options },
        cancelable: true
      });
    }
    notifyApplicationAfterRender(renderMethod) {
      return dispatch("turbo:render", { detail: { renderMethod } });
    }
    notifyApplicationAfterPageLoad(timing = {}) {
      return dispatch("turbo:load", {
        detail: { url: this.location.href, timing }
      });
    }
    notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL) {
      dispatchEvent(
        new HashChangeEvent("hashchange", {
          oldURL: oldURL.toString(),
          newURL: newURL.toString()
        })
      );
    }
    notifyApplicationAfterFrameLoad(frame) {
      return dispatch("turbo:frame-load", { target: frame });
    }
    notifyApplicationAfterFrameRender(fetchResponse, frame) {
      return dispatch("turbo:frame-render", {
        detail: { fetchResponse },
        target: frame,
        cancelable: true
      });
    }
    // Helpers
    submissionIsNavigatable(form, submitter) {
      if (this.formMode == "off") {
        return false;
      } else {
        const submitterIsNavigatable = submitter ? this.elementIsNavigatable(submitter) : true;
        if (this.formMode == "optin") {
          return submitterIsNavigatable && form.closest('[data-turbo="true"]') != null;
        } else {
          return submitterIsNavigatable && this.elementIsNavigatable(form);
        }
      }
    }
    elementIsNavigatable(element) {
      const container = findClosestRecursively(element, "[data-turbo]");
      const withinFrame = findClosestRecursively(element, "turbo-frame");
      if (this.drive || withinFrame) {
        if (container) {
          return container.getAttribute("data-turbo") != "false";
        } else {
          return true;
        }
      } else {
        if (container) {
          return container.getAttribute("data-turbo") == "true";
        } else {
          return false;
        }
      }
    }
    // Private
    getActionForLink(link) {
      return getVisitAction(link) || "advance";
    }
    get snapshot() {
      return this.view.snapshot;
    }
  };
  function extendURLWithDeprecatedProperties(url) {
    Object.defineProperties(url, deprecatedLocationPropertyDescriptors);
  }
  var deprecatedLocationPropertyDescriptors = {
    absoluteURL: {
      get() {
        return this.toString();
      }
    }
  };
  var session = new Session(recentRequests);
  var { cache, navigator: navigator$1 } = session;
  function start() {
    session.start();
  }
  function registerAdapter(adapter) {
    session.registerAdapter(adapter);
  }
  function visit(location2, options) {
    session.visit(location2, options);
  }
  function connectStreamSource(source) {
    session.connectStreamSource(source);
  }
  function disconnectStreamSource(source) {
    session.disconnectStreamSource(source);
  }
  function renderStreamMessage(message) {
    session.renderStreamMessage(message);
  }
  function clearCache() {
    console.warn(
      "Please replace `Turbo.clearCache()` with `Turbo.cache.clear()`. The top-level function is deprecated and will be removed in a future version of Turbo.`"
    );
    session.clearCache();
  }
  function setProgressBarDelay(delay) {
    session.setProgressBarDelay(delay);
  }
  function setConfirmMethod(confirmMethod) {
    FormSubmission.confirmMethod = confirmMethod;
  }
  function setFormMode(mode) {
    session.setFormMode(mode);
  }
  var Turbo = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    navigator: navigator$1,
    session,
    cache,
    PageRenderer,
    PageSnapshot,
    FrameRenderer,
    fetch: fetchWithTurboHeaders,
    start,
    registerAdapter,
    visit,
    connectStreamSource,
    disconnectStreamSource,
    renderStreamMessage,
    clearCache,
    setProgressBarDelay,
    setConfirmMethod,
    setFormMode
  });
  var TurboFrameMissingError = class extends Error {
  };
  var FrameController = class {
    fetchResponseLoaded = (_fetchResponse) => Promise.resolve();
    #currentFetchRequest = null;
    #resolveVisitPromise = () => {
    };
    #connected = false;
    #hasBeenLoaded = false;
    #ignoredAttributes = /* @__PURE__ */ new Set();
    action = null;
    constructor(element) {
      this.element = element;
      this.view = new FrameView(this, this.element);
      this.appearanceObserver = new AppearanceObserver(this, this.element);
      this.formLinkClickObserver = new FormLinkClickObserver(this, this.element);
      this.linkInterceptor = new LinkInterceptor(this, this.element);
      this.restorationIdentifier = uuid();
      this.formSubmitObserver = new FormSubmitObserver(this, this.element);
    }
    // Frame delegate
    connect() {
      if (!this.#connected) {
        this.#connected = true;
        if (this.loadingStyle == FrameLoadingStyle.lazy) {
          this.appearanceObserver.start();
        } else {
          this.#loadSourceURL();
        }
        this.formLinkClickObserver.start();
        this.linkInterceptor.start();
        this.formSubmitObserver.start();
      }
    }
    disconnect() {
      if (this.#connected) {
        this.#connected = false;
        this.appearanceObserver.stop();
        this.formLinkClickObserver.stop();
        this.linkInterceptor.stop();
        this.formSubmitObserver.stop();
      }
    }
    disabledChanged() {
      if (this.loadingStyle == FrameLoadingStyle.eager) {
        this.#loadSourceURL();
      }
    }
    sourceURLChanged() {
      if (this.#isIgnoringChangesTo("src")) return;
      if (this.element.isConnected) {
        this.complete = false;
      }
      if (this.loadingStyle == FrameLoadingStyle.eager || this.#hasBeenLoaded) {
        this.#loadSourceURL();
      }
    }
    sourceURLReloaded() {
      const { src } = this.element;
      this.element.removeAttribute("complete");
      this.element.src = null;
      this.element.src = src;
      return this.element.loaded;
    }
    loadingStyleChanged() {
      if (this.loadingStyle == FrameLoadingStyle.lazy) {
        this.appearanceObserver.start();
      } else {
        this.appearanceObserver.stop();
        this.#loadSourceURL();
      }
    }
    async #loadSourceURL() {
      if (this.enabled && this.isActive && !this.complete && this.sourceURL) {
        this.element.loaded = this.#visit(expandURL(this.sourceURL));
        this.appearanceObserver.stop();
        await this.element.loaded;
        this.#hasBeenLoaded = true;
      }
    }
    async loadResponse(fetchResponse) {
      if (fetchResponse.redirected || fetchResponse.succeeded && fetchResponse.isHTML) {
        this.sourceURL = fetchResponse.response.url;
      }
      try {
        const html = await fetchResponse.responseHTML;
        if (html) {
          const document2 = parseHTMLDocument(html);
          const pageSnapshot = PageSnapshot.fromDocument(document2);
          if (pageSnapshot.isVisitable) {
            await this.#loadFrameResponse(fetchResponse, document2);
          } else {
            await this.#handleUnvisitableFrameResponse(fetchResponse);
          }
        }
      } finally {
        this.fetchResponseLoaded = () => Promise.resolve();
      }
    }
    // Appearance observer delegate
    elementAppearedInViewport(element) {
      this.proposeVisitIfNavigatedWithAction(element, getVisitAction(element));
      this.#loadSourceURL();
    }
    // Form link click observer delegate
    willSubmitFormLinkToLocation(link) {
      return this.#shouldInterceptNavigation(link);
    }
    submittedFormLinkToLocation(link, _location, form) {
      const frame = this.#findFrameElement(link);
      if (frame) form.setAttribute("data-turbo-frame", frame.id);
    }
    // Link interceptor delegate
    shouldInterceptLinkClick(element, _location, _event) {
      return this.#shouldInterceptNavigation(element);
    }
    linkClickIntercepted(element, location2) {
      this.#navigateFrame(element, location2);
    }
    // Form submit observer delegate
    willSubmitForm(element, submitter) {
      return element.closest("turbo-frame") == this.element && this.#shouldInterceptNavigation(element, submitter);
    }
    formSubmitted(element, submitter) {
      if (this.formSubmission) {
        this.formSubmission.stop();
      }
      this.formSubmission = new FormSubmission(this, element, submitter);
      const { fetchRequest } = this.formSubmission;
      this.prepareRequest(fetchRequest);
      this.formSubmission.start();
    }
    // Fetch request delegate
    prepareRequest(request) {
      request.headers["Turbo-Frame"] = this.id;
      if (this.currentNavigationElement?.hasAttribute("data-turbo-stream")) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted(_request) {
      markAsBusy(this.element);
    }
    requestPreventedHandlingResponse(_request, _response) {
      this.#resolveVisitPromise();
    }
    async requestSucceededWithResponse(request, response) {
      await this.loadResponse(response);
      this.#resolveVisitPromise();
    }
    async requestFailedWithResponse(request, response) {
      await this.loadResponse(response);
      this.#resolveVisitPromise();
    }
    requestErrored(request, error2) {
      console.error(error2);
      this.#resolveVisitPromise();
    }
    requestFinished(_request) {
      clearBusyState(this.element);
    }
    // Form submission delegate
    formSubmissionStarted({ formElement }) {
      markAsBusy(formElement, this.#findFrameElement(formElement));
    }
    formSubmissionSucceededWithResponse(formSubmission, response) {
      const frame = this.#findFrameElement(formSubmission.formElement, formSubmission.submitter);
      frame.delegate.proposeVisitIfNavigatedWithAction(frame, getVisitAction(formSubmission.submitter, formSubmission.formElement, frame));
      frame.delegate.loadResponse(response);
      if (!formSubmission.isSafe) {
        session.clearCache();
      }
    }
    formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      this.element.delegate.loadResponse(fetchResponse);
      session.clearCache();
    }
    formSubmissionErrored(formSubmission, error2) {
      console.error(error2);
    }
    formSubmissionFinished({ formElement }) {
      clearBusyState(formElement, this.#findFrameElement(formElement));
    }
    // View delegate
    allowsImmediateRender({ element: newFrame }, options) {
      const event = dispatch("turbo:before-frame-render", {
        target: this.element,
        detail: { newFrame, ...options },
        cancelable: true
      });
      const {
        defaultPrevented,
        detail: { render }
      } = event;
      if (this.view.renderer && render) {
        this.view.renderer.renderElement = render;
      }
      return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, _isPreview, _renderMethod) {
    }
    preloadOnLoadLinksForView(element) {
      session.preloadOnLoadLinksForView(element);
    }
    viewInvalidated() {
    }
    // Frame renderer delegate
    willRenderFrame(currentElement, _newElement) {
      this.previousFrameElement = currentElement.cloneNode(true);
    }
    visitCachedSnapshot = ({ element }) => {
      const frame = element.querySelector("#" + this.element.id);
      if (frame && this.previousFrameElement) {
        frame.replaceChildren(...this.previousFrameElement.children);
      }
      delete this.previousFrameElement;
    };
    // Private
    async #loadFrameResponse(fetchResponse, document2) {
      const newFrameElement = await this.extractForeignFrameElement(document2.body);
      if (newFrameElement) {
        const snapshot = new Snapshot(newFrameElement);
        const renderer = new FrameRenderer(this, this.view.snapshot, snapshot, FrameRenderer.renderElement, false, false);
        if (this.view.renderPromise) await this.view.renderPromise;
        this.changeHistory();
        await this.view.render(renderer);
        this.complete = true;
        session.frameRendered(fetchResponse, this.element);
        session.frameLoaded(this.element);
        await this.fetchResponseLoaded(fetchResponse);
      } else if (this.#willHandleFrameMissingFromResponse(fetchResponse)) {
        this.#handleFrameMissingFromResponse(fetchResponse);
      }
    }
    async #visit(url) {
      const request = new FetchRequest(this, FetchMethod.get, url, new URLSearchParams(), this.element);
      this.#currentFetchRequest?.cancel();
      this.#currentFetchRequest = request;
      return new Promise((resolve) => {
        this.#resolveVisitPromise = () => {
          this.#resolveVisitPromise = () => {
          };
          this.#currentFetchRequest = null;
          resolve();
        };
        request.perform();
      });
    }
    #navigateFrame(element, url, submitter) {
      const frame = this.#findFrameElement(element, submitter);
      frame.delegate.proposeVisitIfNavigatedWithAction(frame, getVisitAction(submitter, element, frame));
      this.#withCurrentNavigationElement(element, () => {
        frame.src = url;
      });
    }
    proposeVisitIfNavigatedWithAction(frame, action = null) {
      this.action = action;
      if (this.action) {
        const pageSnapshot = PageSnapshot.fromElement(frame).clone();
        const { visitCachedSnapshot } = frame.delegate;
        frame.delegate.fetchResponseLoaded = async (fetchResponse) => {
          if (frame.src) {
            const { statusCode, redirected } = fetchResponse;
            const responseHTML = await fetchResponse.responseHTML;
            const response = { statusCode, redirected, responseHTML };
            const options = {
              response,
              visitCachedSnapshot,
              willRender: false,
              updateHistory: false,
              restorationIdentifier: this.restorationIdentifier,
              snapshot: pageSnapshot
            };
            if (this.action) options.action = this.action;
            session.visit(frame.src, options);
          }
        };
      }
    }
    changeHistory() {
      if (this.action) {
        const method = getHistoryMethodForAction(this.action);
        session.history.update(method, expandURL(this.element.src || ""), this.restorationIdentifier);
      }
    }
    async #handleUnvisitableFrameResponse(fetchResponse) {
      console.warn(
        `The response (${fetchResponse.statusCode}) from <turbo-frame id="${this.element.id}"> is performing a full page visit due to turbo-visit-control.`
      );
      await this.#visitResponse(fetchResponse.response);
    }
    #willHandleFrameMissingFromResponse(fetchResponse) {
      this.element.setAttribute("complete", "");
      const response = fetchResponse.response;
      const visit2 = async (url, options) => {
        if (url instanceof Response) {
          this.#visitResponse(url);
        } else {
          session.visit(url, options);
        }
      };
      const event = dispatch("turbo:frame-missing", {
        target: this.element,
        detail: { response, visit: visit2 },
        cancelable: true
      });
      return !event.defaultPrevented;
    }
    #handleFrameMissingFromResponse(fetchResponse) {
      this.view.missing();
      this.#throwFrameMissingError(fetchResponse);
    }
    #throwFrameMissingError(fetchResponse) {
      const message = `The response (${fetchResponse.statusCode}) did not contain the expected <turbo-frame id="${this.element.id}"> and will be ignored. To perform a full page visit instead, set turbo-visit-control to reload.`;
      throw new TurboFrameMissingError(message);
    }
    async #visitResponse(response) {
      const wrapped = new FetchResponse(response);
      const responseHTML = await wrapped.responseHTML;
      const { location: location2, redirected, statusCode } = wrapped;
      return session.visit(location2, { response: { redirected, statusCode, responseHTML } });
    }
    #findFrameElement(element, submitter) {
      const id2 = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
      return getFrameElementById(id2) ?? this.element;
    }
    async extractForeignFrameElement(container) {
      let element;
      const id2 = CSS.escape(this.id);
      try {
        element = activateElement(container.querySelector(`turbo-frame#${id2}`), this.sourceURL);
        if (element) {
          return element;
        }
        element = activateElement(container.querySelector(`turbo-frame[src][recurse~=${id2}]`), this.sourceURL);
        if (element) {
          await element.loaded;
          return await this.extractForeignFrameElement(element);
        }
      } catch (error2) {
        console.error(error2);
        return new FrameElement();
      }
      return null;
    }
    #formActionIsVisitable(form, submitter) {
      const action = getAction$1(form, submitter);
      return locationIsVisitable(expandURL(action), this.rootLocation);
    }
    #shouldInterceptNavigation(element, submitter) {
      const id2 = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
      if (element instanceof HTMLFormElement && !this.#formActionIsVisitable(element, submitter)) {
        return false;
      }
      if (!this.enabled || id2 == "_top") {
        return false;
      }
      if (id2) {
        const frameElement = getFrameElementById(id2);
        if (frameElement) {
          return !frameElement.disabled;
        }
      }
      if (!session.elementIsNavigatable(element)) {
        return false;
      }
      if (submitter && !session.elementIsNavigatable(submitter)) {
        return false;
      }
      return true;
    }
    // Computed properties
    get id() {
      return this.element.id;
    }
    get enabled() {
      return !this.element.disabled;
    }
    get sourceURL() {
      if (this.element.src) {
        return this.element.src;
      }
    }
    set sourceURL(sourceURL) {
      this.#ignoringChangesToAttribute("src", () => {
        this.element.src = sourceURL ?? null;
      });
    }
    get loadingStyle() {
      return this.element.loading;
    }
    get isLoading() {
      return this.formSubmission !== void 0 || this.#resolveVisitPromise() !== void 0;
    }
    get complete() {
      return this.element.hasAttribute("complete");
    }
    set complete(value) {
      if (value) {
        this.element.setAttribute("complete", "");
      } else {
        this.element.removeAttribute("complete");
      }
    }
    get isActive() {
      return this.element.isActive && this.#connected;
    }
    get rootLocation() {
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const root = meta?.content ?? "/";
      return expandURL(root);
    }
    #isIgnoringChangesTo(attributeName) {
      return this.#ignoredAttributes.has(attributeName);
    }
    #ignoringChangesToAttribute(attributeName, callback) {
      this.#ignoredAttributes.add(attributeName);
      callback();
      this.#ignoredAttributes.delete(attributeName);
    }
    #withCurrentNavigationElement(element, callback) {
      this.currentNavigationElement = element;
      callback();
      delete this.currentNavigationElement;
    }
  };
  function getFrameElementById(id2) {
    if (id2 != null) {
      const element = document.getElementById(id2);
      if (element instanceof FrameElement) {
        return element;
      }
    }
  }
  function activateElement(element, currentURL) {
    if (element) {
      const src = element.getAttribute("src");
      if (src != null && currentURL != null && urlsAreEqual(src, currentURL)) {
        throw new Error(`Matching <turbo-frame id="${element.id}"> element has a source URL which references itself`);
      }
      if (element.ownerDocument !== document) {
        element = document.importNode(element, true);
      }
      if (element instanceof FrameElement) {
        element.connectedCallback();
        element.disconnectedCallback();
        return element;
      }
    }
  }
  var StreamActions = {
    after() {
      this.targetElements.forEach((e) => e.parentElement?.insertBefore(this.templateContent, e.nextSibling));
    },
    append() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e) => e.append(this.templateContent));
    },
    before() {
      this.targetElements.forEach((e) => e.parentElement?.insertBefore(this.templateContent, e));
    },
    prepend() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e) => e.prepend(this.templateContent));
    },
    remove() {
      this.targetElements.forEach((e) => e.remove());
    },
    replace() {
      this.targetElements.forEach((e) => e.replaceWith(this.templateContent));
    },
    update() {
      this.targetElements.forEach((targetElement) => {
        targetElement.innerHTML = "";
        targetElement.append(this.templateContent);
      });
    },
    refresh() {
      session.refresh(this.baseURI, this.requestId);
    }
  };
  var StreamElement = class _StreamElement extends HTMLElement {
    static async renderElement(newElement) {
      await newElement.performAction();
    }
    async connectedCallback() {
      try {
        await this.render();
      } catch (error2) {
        console.error(error2);
      } finally {
        this.disconnect();
      }
    }
    async render() {
      return this.renderPromise ??= (async () => {
        const event = this.beforeRenderEvent;
        if (this.dispatchEvent(event)) {
          await nextRepaint();
          await event.detail.render(this);
        }
      })();
    }
    disconnect() {
      try {
        this.remove();
      } catch {
      }
    }
    /**
     * Removes duplicate children (by ID)
     */
    removeDuplicateTargetChildren() {
      this.duplicateChildren.forEach((c) => c.remove());
    }
    /**
     * Gets the list of duplicate children (i.e. those with the same ID)
     */
    get duplicateChildren() {
      const existingChildren = this.targetElements.flatMap((e) => [...e.children]).filter((c) => !!c.id);
      const newChildrenIds = [...this.templateContent?.children || []].filter((c) => !!c.id).map((c) => c.id);
      return existingChildren.filter((c) => newChildrenIds.includes(c.id));
    }
    /**
     * Gets the action function to be performed.
     */
    get performAction() {
      if (this.action) {
        const actionFunction = StreamActions[this.action];
        if (actionFunction) {
          return actionFunction;
        }
        this.#raise("unknown action");
      }
      this.#raise("action attribute is missing");
    }
    /**
     * Gets the target elements which the template will be rendered to.
     */
    get targetElements() {
      if (this.target) {
        return this.targetElementsById;
      } else if (this.targets) {
        return this.targetElementsByQuery;
      } else {
        this.#raise("target or targets attribute is missing");
      }
    }
    /**
     * Gets the contents of the main `<template>`.
     */
    get templateContent() {
      return this.templateElement.content.cloneNode(true);
    }
    /**
     * Gets the main `<template>` used for rendering
     */
    get templateElement() {
      if (this.firstElementChild === null) {
        const template = this.ownerDocument.createElement("template");
        this.appendChild(template);
        return template;
      } else if (this.firstElementChild instanceof HTMLTemplateElement) {
        return this.firstElementChild;
      }
      this.#raise("first child element must be a <template> element");
    }
    /**
     * Gets the current action.
     */
    get action() {
      return this.getAttribute("action");
    }
    /**
     * Gets the current target (an element ID) to which the result will
     * be rendered.
     */
    get target() {
      return this.getAttribute("target");
    }
    /**
     * Gets the current "targets" selector (a CSS selector)
     */
    get targets() {
      return this.getAttribute("targets");
    }
    /**
     * Reads the request-id attribute
     */
    get requestId() {
      return this.getAttribute("request-id");
    }
    #raise(message) {
      throw new Error(`${this.description}: ${message}`);
    }
    get description() {
      return (this.outerHTML.match(/<[^>]+>/) ?? [])[0] ?? "<turbo-stream>";
    }
    get beforeRenderEvent() {
      return new CustomEvent("turbo:before-stream-render", {
        bubbles: true,
        cancelable: true,
        detail: { newStream: this, render: _StreamElement.renderElement }
      });
    }
    get targetElementsById() {
      const element = this.ownerDocument?.getElementById(this.target);
      if (element !== null) {
        return [element];
      } else {
        return [];
      }
    }
    get targetElementsByQuery() {
      const elements = this.ownerDocument?.querySelectorAll(this.targets);
      if (elements.length !== 0) {
        return Array.prototype.slice.call(elements);
      } else {
        return [];
      }
    }
  };
  var StreamSourceElement = class extends HTMLElement {
    streamSource = null;
    connectedCallback() {
      this.streamSource = this.src.match(/^ws{1,2}:/) ? new WebSocket(this.src) : new EventSource(this.src);
      connectStreamSource(this.streamSource);
    }
    disconnectedCallback() {
      if (this.streamSource) {
        this.streamSource.close();
        disconnectStreamSource(this.streamSource);
      }
    }
    get src() {
      return this.getAttribute("src") || "";
    }
  };
  FrameElement.delegateConstructor = FrameController;
  if (customElements.get("turbo-frame") === void 0) {
    customElements.define("turbo-frame", FrameElement);
  }
  if (customElements.get("turbo-stream") === void 0) {
    customElements.define("turbo-stream", StreamElement);
  }
  if (customElements.get("turbo-stream-source") === void 0) {
    customElements.define("turbo-stream-source", StreamSourceElement);
  }
  (() => {
    let element = document.currentScript;
    if (!element) return;
    if (element.hasAttribute("data-turbo-suppress-warning")) return;
    element = element.parentElement;
    while (element) {
      if (element == document.body) {
        return console.warn(
          unindent`
        You are loading Turbo from a <script> element inside the <body> element. This is probably not what you meant to do!

        Load your application’s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.

        For more information, see: https://turbo.hotwired.dev/handbook/building#working-with-script-elements

        ——
        Suppress this warning by adding a "data-turbo-suppress-warning" attribute to: %s
      `,
          element.outerHTML
        );
      }
      element = element.parentElement;
    }
  })();
  window.Turbo = { ...Turbo, StreamActions };
  start();

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable.js
  var consumer;
  async function getConsumer() {
    return consumer || setConsumer(createConsumer2().then(setConsumer));
  }
  function setConsumer(newConsumer) {
    return consumer = newConsumer;
  }
  async function createConsumer2() {
    const { createConsumer: createConsumer3 } = await Promise.resolve().then(() => (init_src(), src_exports));
    return createConsumer3();
  }
  async function subscribeTo(channel, mixin) {
    const { subscriptions } = await getConsumer();
    return subscriptions.create(channel, mixin);
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/snakeize.js
  function walk(obj) {
    if (!obj || typeof obj !== "object") return obj;
    if (obj instanceof Date || obj instanceof RegExp) return obj;
    if (Array.isArray(obj)) return obj.map(walk);
    return Object.keys(obj).reduce(function(acc, key) {
      var camel = key[0].toLowerCase() + key.slice(1).replace(/([A-Z]+)/g, function(m, x) {
        return "_" + x.toLowerCase();
      });
      acc[camel] = walk(obj[key]);
      return acc;
    }, {});
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable_stream_source_element.js
  var TurboCableStreamSourceElement = class extends HTMLElement {
    async connectedCallback() {
      connectStreamSource(this);
      this.subscription = await subscribeTo(this.channel, {
        received: this.dispatchMessageEvent.bind(this),
        connected: this.subscriptionConnected.bind(this),
        disconnected: this.subscriptionDisconnected.bind(this)
      });
    }
    disconnectedCallback() {
      disconnectStreamSource(this);
      if (this.subscription) this.subscription.unsubscribe();
    }
    dispatchMessageEvent(data) {
      const event = new MessageEvent("message", { data });
      return this.dispatchEvent(event);
    }
    subscriptionConnected() {
      this.setAttribute("connected", "");
    }
    subscriptionDisconnected() {
      this.removeAttribute("connected");
    }
    get channel() {
      const channel = this.getAttribute("channel");
      const signed_stream_name = this.getAttribute("signed-stream-name");
      return { channel, signed_stream_name, ...walk({ ...this.dataset }) };
    }
  };
  if (customElements.get("turbo-cable-stream-source") === void 0) {
    customElements.define("turbo-cable-stream-source", TurboCableStreamSourceElement);
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/fetch_requests.js
  function encodeMethodIntoRequestBody(event) {
    if (event.target instanceof HTMLFormElement) {
      const { target: form, detail: { fetchOptions } } = event;
      form.addEventListener("turbo:submit-start", ({ detail: { formSubmission: { submitter } } }) => {
        const body = isBodyInit(fetchOptions.body) ? fetchOptions.body : new URLSearchParams();
        const method = determineFetchMethod(submitter, body, form);
        if (!/get/i.test(method)) {
          if (/post/i.test(method)) {
            body.delete("_method");
          } else {
            body.set("_method", method);
          }
          fetchOptions.method = "post";
        }
      }, { once: true });
    }
  }
  function determineFetchMethod(submitter, body, form) {
    const formMethod = determineFormMethod(submitter);
    const overrideMethod = body.get("_method");
    const method = form.getAttribute("method") || "get";
    if (typeof formMethod == "string") {
      return formMethod;
    } else if (typeof overrideMethod == "string") {
      return overrideMethod;
    } else {
      return method;
    }
  }
  function determineFormMethod(submitter) {
    if (submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement) {
      if (submitter.name === "_method") {
        return submitter.value;
      } else if (submitter.hasAttribute("formmethod")) {
        return submitter.formMethod;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  function isBodyInit(body) {
    return body instanceof FormData || body instanceof URLSearchParams;
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/index.js
  window.Turbo = turbo_es2017_esm_exports;
  addEventListener("turbo:before-fetch-request", encodeMethodIntoRequestBody);

  // node_modules/@hotwired/stimulus/dist/stimulus.js
  var EventListener = class {
    constructor(eventTarget, eventName, eventOptions) {
      this.eventTarget = eventTarget;
      this.eventName = eventName;
      this.eventOptions = eventOptions;
      this.unorderedBindings = /* @__PURE__ */ new Set();
    }
    connect() {
      this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
    }
    disconnect() {
      this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions);
    }
    bindingConnected(binding) {
      this.unorderedBindings.add(binding);
    }
    bindingDisconnected(binding) {
      this.unorderedBindings.delete(binding);
    }
    handleEvent(event) {
      const extendedEvent = extendEvent(event);
      for (const binding of this.bindings) {
        if (extendedEvent.immediatePropagationStopped) {
          break;
        } else {
          binding.handleEvent(extendedEvent);
        }
      }
    }
    hasBindings() {
      return this.unorderedBindings.size > 0;
    }
    get bindings() {
      return Array.from(this.unorderedBindings).sort((left, right) => {
        const leftIndex = left.index, rightIndex = right.index;
        return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0;
      });
    }
  };
  function extendEvent(event) {
    if ("immediatePropagationStopped" in event) {
      return event;
    } else {
      const { stopImmediatePropagation } = event;
      return Object.assign(event, {
        immediatePropagationStopped: false,
        stopImmediatePropagation() {
          this.immediatePropagationStopped = true;
          stopImmediatePropagation.call(this);
        }
      });
    }
  }
  var Dispatcher = class {
    constructor(application2) {
      this.application = application2;
      this.eventListenerMaps = /* @__PURE__ */ new Map();
      this.started = false;
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.eventListeners.forEach((eventListener) => eventListener.connect());
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.eventListeners.forEach((eventListener) => eventListener.disconnect());
      }
    }
    get eventListeners() {
      return Array.from(this.eventListenerMaps.values()).reduce((listeners, map) => listeners.concat(Array.from(map.values())), []);
    }
    bindingConnected(binding) {
      this.fetchEventListenerForBinding(binding).bindingConnected(binding);
    }
    bindingDisconnected(binding, clearEventListeners = false) {
      this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
      if (clearEventListeners)
        this.clearEventListenersForBinding(binding);
    }
    handleError(error2, message, detail = {}) {
      this.application.handleError(error2, `Error ${message}`, detail);
    }
    clearEventListenersForBinding(binding) {
      const eventListener = this.fetchEventListenerForBinding(binding);
      if (!eventListener.hasBindings()) {
        eventListener.disconnect();
        this.removeMappedEventListenerFor(binding);
      }
    }
    removeMappedEventListenerFor(binding) {
      const { eventTarget, eventName, eventOptions } = binding;
      const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      const cacheKey = this.cacheKey(eventName, eventOptions);
      eventListenerMap.delete(cacheKey);
      if (eventListenerMap.size == 0)
        this.eventListenerMaps.delete(eventTarget);
    }
    fetchEventListenerForBinding(binding) {
      const { eventTarget, eventName, eventOptions } = binding;
      return this.fetchEventListener(eventTarget, eventName, eventOptions);
    }
    fetchEventListener(eventTarget, eventName, eventOptions) {
      const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      const cacheKey = this.cacheKey(eventName, eventOptions);
      let eventListener = eventListenerMap.get(cacheKey);
      if (!eventListener) {
        eventListener = this.createEventListener(eventTarget, eventName, eventOptions);
        eventListenerMap.set(cacheKey, eventListener);
      }
      return eventListener;
    }
    createEventListener(eventTarget, eventName, eventOptions) {
      const eventListener = new EventListener(eventTarget, eventName, eventOptions);
      if (this.started) {
        eventListener.connect();
      }
      return eventListener;
    }
    fetchEventListenerMapForEventTarget(eventTarget) {
      let eventListenerMap = this.eventListenerMaps.get(eventTarget);
      if (!eventListenerMap) {
        eventListenerMap = /* @__PURE__ */ new Map();
        this.eventListenerMaps.set(eventTarget, eventListenerMap);
      }
      return eventListenerMap;
    }
    cacheKey(eventName, eventOptions) {
      const parts = [eventName];
      Object.keys(eventOptions).sort().forEach((key) => {
        parts.push(`${eventOptions[key] ? "" : "!"}${key}`);
      });
      return parts.join(":");
    }
  };
  var defaultActionDescriptorFilters = {
    stop({ event, value }) {
      if (value)
        event.stopPropagation();
      return true;
    },
    prevent({ event, value }) {
      if (value)
        event.preventDefault();
      return true;
    },
    self({ event, value, element }) {
      if (value) {
        return element === event.target;
      } else {
        return true;
      }
    }
  };
  var descriptorPattern = /^(?:(?:([^.]+?)\+)?(.+?)(?:\.(.+?))?(?:@(window|document))?->)?(.+?)(?:#([^:]+?))(?::(.+))?$/;
  function parseActionDescriptorString(descriptorString) {
    const source = descriptorString.trim();
    const matches = source.match(descriptorPattern) || [];
    let eventName = matches[2];
    let keyFilter = matches[3];
    if (keyFilter && !["keydown", "keyup", "keypress"].includes(eventName)) {
      eventName += `.${keyFilter}`;
      keyFilter = "";
    }
    return {
      eventTarget: parseEventTarget(matches[4]),
      eventName,
      eventOptions: matches[7] ? parseEventOptions(matches[7]) : {},
      identifier: matches[5],
      methodName: matches[6],
      keyFilter: matches[1] || keyFilter
    };
  }
  function parseEventTarget(eventTargetName) {
    if (eventTargetName == "window") {
      return window;
    } else if (eventTargetName == "document") {
      return document;
    }
  }
  function parseEventOptions(eventOptions) {
    return eventOptions.split(":").reduce((options, token) => Object.assign(options, { [token.replace(/^!/, "")]: !/^!/.test(token) }), {});
  }
  function stringifyEventTarget(eventTarget) {
    if (eventTarget == window) {
      return "window";
    } else if (eventTarget == document) {
      return "document";
    }
  }
  function camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
  }
  function namespaceCamelize(value) {
    return camelize(value.replace(/--/g, "-").replace(/__/g, "_"));
  }
  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  function dasherize(value) {
    return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
  }
  function tokenize(value) {
    return value.match(/[^\s]+/g) || [];
  }
  function isSomething(object) {
    return object !== null && object !== void 0;
  }
  function hasProperty(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }
  var allModifiers = ["meta", "ctrl", "alt", "shift"];
  var Action = class {
    constructor(element, index, descriptor, schema) {
      this.element = element;
      this.index = index;
      this.eventTarget = descriptor.eventTarget || element;
      this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name");
      this.eventOptions = descriptor.eventOptions || {};
      this.identifier = descriptor.identifier || error("missing identifier");
      this.methodName = descriptor.methodName || error("missing method name");
      this.keyFilter = descriptor.keyFilter || "";
      this.schema = schema;
    }
    static forToken(token, schema) {
      return new this(token.element, token.index, parseActionDescriptorString(token.content), schema);
    }
    toString() {
      const eventFilter = this.keyFilter ? `.${this.keyFilter}` : "";
      const eventTarget = this.eventTargetName ? `@${this.eventTargetName}` : "";
      return `${this.eventName}${eventFilter}${eventTarget}->${this.identifier}#${this.methodName}`;
    }
    shouldIgnoreKeyboardEvent(event) {
      if (!this.keyFilter) {
        return false;
      }
      const filters = this.keyFilter.split("+");
      if (this.keyFilterDissatisfied(event, filters)) {
        return true;
      }
      const standardFilter = filters.filter((key) => !allModifiers.includes(key))[0];
      if (!standardFilter) {
        return false;
      }
      if (!hasProperty(this.keyMappings, standardFilter)) {
        error(`contains unknown key filter: ${this.keyFilter}`);
      }
      return this.keyMappings[standardFilter].toLowerCase() !== event.key.toLowerCase();
    }
    shouldIgnoreMouseEvent(event) {
      if (!this.keyFilter) {
        return false;
      }
      const filters = [this.keyFilter];
      if (this.keyFilterDissatisfied(event, filters)) {
        return true;
      }
      return false;
    }
    get params() {
      const params = {};
      const pattern = new RegExp(`^data-${this.identifier}-(.+)-param$`, "i");
      for (const { name, value } of Array.from(this.element.attributes)) {
        const match = name.match(pattern);
        const key = match && match[1];
        if (key) {
          params[camelize(key)] = typecast(value);
        }
      }
      return params;
    }
    get eventTargetName() {
      return stringifyEventTarget(this.eventTarget);
    }
    get keyMappings() {
      return this.schema.keyMappings;
    }
    keyFilterDissatisfied(event, filters) {
      const [meta, ctrl, alt, shift] = allModifiers.map((modifier) => filters.includes(modifier));
      return event.metaKey !== meta || event.ctrlKey !== ctrl || event.altKey !== alt || event.shiftKey !== shift;
    }
  };
  var defaultEventNames = {
    a: () => "click",
    button: () => "click",
    form: () => "submit",
    details: () => "toggle",
    input: (e) => e.getAttribute("type") == "submit" ? "click" : "input",
    select: () => "change",
    textarea: () => "input"
  };
  function getDefaultEventNameForElement(element) {
    const tagName = element.tagName.toLowerCase();
    if (tagName in defaultEventNames) {
      return defaultEventNames[tagName](element);
    }
  }
  function error(message) {
    throw new Error(message);
  }
  function typecast(value) {
    try {
      return JSON.parse(value);
    } catch (o_O) {
      return value;
    }
  }
  var Binding = class {
    constructor(context, action) {
      this.context = context;
      this.action = action;
    }
    get index() {
      return this.action.index;
    }
    get eventTarget() {
      return this.action.eventTarget;
    }
    get eventOptions() {
      return this.action.eventOptions;
    }
    get identifier() {
      return this.context.identifier;
    }
    handleEvent(event) {
      const actionEvent = this.prepareActionEvent(event);
      if (this.willBeInvokedByEvent(event) && this.applyEventModifiers(actionEvent)) {
        this.invokeWithEvent(actionEvent);
      }
    }
    get eventName() {
      return this.action.eventName;
    }
    get method() {
      const method = this.controller[this.methodName];
      if (typeof method == "function") {
        return method;
      }
      throw new Error(`Action "${this.action}" references undefined method "${this.methodName}"`);
    }
    applyEventModifiers(event) {
      const { element } = this.action;
      const { actionDescriptorFilters } = this.context.application;
      const { controller } = this.context;
      let passes = true;
      for (const [name, value] of Object.entries(this.eventOptions)) {
        if (name in actionDescriptorFilters) {
          const filter = actionDescriptorFilters[name];
          passes = passes && filter({ name, value, event, element, controller });
        } else {
          continue;
        }
      }
      return passes;
    }
    prepareActionEvent(event) {
      return Object.assign(event, { params: this.action.params });
    }
    invokeWithEvent(event) {
      const { target, currentTarget } = event;
      try {
        this.method.call(this.controller, event);
        this.context.logDebugActivity(this.methodName, { event, target, currentTarget, action: this.methodName });
      } catch (error2) {
        const { identifier: identifier2, controller, element, index } = this;
        const detail = { identifier: identifier2, controller, element, index, event };
        this.context.handleError(error2, `invoking action "${this.action}"`, detail);
      }
    }
    willBeInvokedByEvent(event) {
      const eventTarget = event.target;
      if (event instanceof KeyboardEvent && this.action.shouldIgnoreKeyboardEvent(event)) {
        return false;
      }
      if (event instanceof MouseEvent && this.action.shouldIgnoreMouseEvent(event)) {
        return false;
      }
      if (this.element === eventTarget) {
        return true;
      } else if (eventTarget instanceof Element && this.element.contains(eventTarget)) {
        return this.scope.containsElement(eventTarget);
      } else {
        return this.scope.containsElement(this.action.element);
      }
    }
    get controller() {
      return this.context.controller;
    }
    get methodName() {
      return this.action.methodName;
    }
    get element() {
      return this.scope.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  var ElementObserver = class {
    constructor(element, delegate) {
      this.mutationObserverInit = { attributes: true, childList: true, subtree: true };
      this.element = element;
      this.started = false;
      this.delegate = delegate;
      this.elements = /* @__PURE__ */ new Set();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.refresh();
      }
    }
    pause(callback) {
      if (this.started) {
        this.mutationObserver.disconnect();
        this.started = false;
      }
      callback();
      if (!this.started) {
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        const matches = new Set(this.matchElementsInTree());
        for (const element of Array.from(this.elements)) {
          if (!matches.has(element)) {
            this.removeElement(element);
          }
        }
        for (const element of Array.from(matches)) {
          this.addElement(element);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      if (mutation.type == "attributes") {
        this.processAttributeChange(mutation.target, mutation.attributeName);
      } else if (mutation.type == "childList") {
        this.processRemovedNodes(mutation.removedNodes);
        this.processAddedNodes(mutation.addedNodes);
      }
    }
    processAttributeChange(element, attributeName) {
      if (this.elements.has(element)) {
        if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
          this.delegate.elementAttributeChanged(element, attributeName);
        } else {
          this.removeElement(element);
        }
      } else if (this.matchElement(element)) {
        this.addElement(element);
      }
    }
    processRemovedNodes(nodes) {
      for (const node of Array.from(nodes)) {
        const element = this.elementFromNode(node);
        if (element) {
          this.processTree(element, this.removeElement);
        }
      }
    }
    processAddedNodes(nodes) {
      for (const node of Array.from(nodes)) {
        const element = this.elementFromNode(node);
        if (element && this.elementIsActive(element)) {
          this.processTree(element, this.addElement);
        }
      }
    }
    matchElement(element) {
      return this.delegate.matchElement(element);
    }
    matchElementsInTree(tree = this.element) {
      return this.delegate.matchElementsInTree(tree);
    }
    processTree(tree, processor) {
      for (const element of this.matchElementsInTree(tree)) {
        processor.call(this, element);
      }
    }
    elementFromNode(node) {
      if (node.nodeType == Node.ELEMENT_NODE) {
        return node;
      }
    }
    elementIsActive(element) {
      if (element.isConnected != this.element.isConnected) {
        return false;
      } else {
        return this.element.contains(element);
      }
    }
    addElement(element) {
      if (!this.elements.has(element)) {
        if (this.elementIsActive(element)) {
          this.elements.add(element);
          if (this.delegate.elementMatched) {
            this.delegate.elementMatched(element);
          }
        }
      }
    }
    removeElement(element) {
      if (this.elements.has(element)) {
        this.elements.delete(element);
        if (this.delegate.elementUnmatched) {
          this.delegate.elementUnmatched(element);
        }
      }
    }
  };
  var AttributeObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeName = attributeName;
      this.delegate = delegate;
      this.elementObserver = new ElementObserver(element, this);
    }
    get element() {
      return this.elementObserver.element;
    }
    get selector() {
      return `[${this.attributeName}]`;
    }
    start() {
      this.elementObserver.start();
    }
    pause(callback) {
      this.elementObserver.pause(callback);
    }
    stop() {
      this.elementObserver.stop();
    }
    refresh() {
      this.elementObserver.refresh();
    }
    get started() {
      return this.elementObserver.started;
    }
    matchElement(element) {
      return element.hasAttribute(this.attributeName);
    }
    matchElementsInTree(tree) {
      const match = this.matchElement(tree) ? [tree] : [];
      const matches = Array.from(tree.querySelectorAll(this.selector));
      return match.concat(matches);
    }
    elementMatched(element) {
      if (this.delegate.elementMatchedAttribute) {
        this.delegate.elementMatchedAttribute(element, this.attributeName);
      }
    }
    elementUnmatched(element) {
      if (this.delegate.elementUnmatchedAttribute) {
        this.delegate.elementUnmatchedAttribute(element, this.attributeName);
      }
    }
    elementAttributeChanged(element, attributeName) {
      if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) {
        this.delegate.elementAttributeValueChanged(element, attributeName);
      }
    }
  };
  function add(map, key, value) {
    fetch(map, key).add(value);
  }
  function del(map, key, value) {
    fetch(map, key).delete(value);
    prune(map, key);
  }
  function fetch(map, key) {
    let values = map.get(key);
    if (!values) {
      values = /* @__PURE__ */ new Set();
      map.set(key, values);
    }
    return values;
  }
  function prune(map, key) {
    const values = map.get(key);
    if (values != null && values.size == 0) {
      map.delete(key);
    }
  }
  var Multimap = class {
    constructor() {
      this.valuesByKey = /* @__PURE__ */ new Map();
    }
    get keys() {
      return Array.from(this.valuesByKey.keys());
    }
    get values() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((values, set) => values.concat(Array.from(set)), []);
    }
    get size() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((size, set) => size + set.size, 0);
    }
    add(key, value) {
      add(this.valuesByKey, key, value);
    }
    delete(key, value) {
      del(this.valuesByKey, key, value);
    }
    has(key, value) {
      const values = this.valuesByKey.get(key);
      return values != null && values.has(value);
    }
    hasKey(key) {
      return this.valuesByKey.has(key);
    }
    hasValue(value) {
      const sets = Array.from(this.valuesByKey.values());
      return sets.some((set) => set.has(value));
    }
    getValuesForKey(key) {
      const values = this.valuesByKey.get(key);
      return values ? Array.from(values) : [];
    }
    getKeysForValue(value) {
      return Array.from(this.valuesByKey).filter(([_key, values]) => values.has(value)).map(([key, _values]) => key);
    }
  };
  var SelectorObserver = class {
    constructor(element, selector, delegate, details) {
      this._selector = selector;
      this.details = details;
      this.elementObserver = new ElementObserver(element, this);
      this.delegate = delegate;
      this.matchesByElement = new Multimap();
    }
    get started() {
      return this.elementObserver.started;
    }
    get selector() {
      return this._selector;
    }
    set selector(selector) {
      this._selector = selector;
      this.refresh();
    }
    start() {
      this.elementObserver.start();
    }
    pause(callback) {
      this.elementObserver.pause(callback);
    }
    stop() {
      this.elementObserver.stop();
    }
    refresh() {
      this.elementObserver.refresh();
    }
    get element() {
      return this.elementObserver.element;
    }
    matchElement(element) {
      const { selector } = this;
      if (selector) {
        const matches = element.matches(selector);
        if (this.delegate.selectorMatchElement) {
          return matches && this.delegate.selectorMatchElement(element, this.details);
        }
        return matches;
      } else {
        return false;
      }
    }
    matchElementsInTree(tree) {
      const { selector } = this;
      if (selector) {
        const match = this.matchElement(tree) ? [tree] : [];
        const matches = Array.from(tree.querySelectorAll(selector)).filter((match2) => this.matchElement(match2));
        return match.concat(matches);
      } else {
        return [];
      }
    }
    elementMatched(element) {
      const { selector } = this;
      if (selector) {
        this.selectorMatched(element, selector);
      }
    }
    elementUnmatched(element) {
      const selectors = this.matchesByElement.getKeysForValue(element);
      for (const selector of selectors) {
        this.selectorUnmatched(element, selector);
      }
    }
    elementAttributeChanged(element, _attributeName) {
      const { selector } = this;
      if (selector) {
        const matches = this.matchElement(element);
        const matchedBefore = this.matchesByElement.has(selector, element);
        if (matches && !matchedBefore) {
          this.selectorMatched(element, selector);
        } else if (!matches && matchedBefore) {
          this.selectorUnmatched(element, selector);
        }
      }
    }
    selectorMatched(element, selector) {
      this.delegate.selectorMatched(element, selector, this.details);
      this.matchesByElement.add(selector, element);
    }
    selectorUnmatched(element, selector) {
      this.delegate.selectorUnmatched(element, selector, this.details);
      this.matchesByElement.delete(selector, element);
    }
  };
  var StringMapObserver = class {
    constructor(element, delegate) {
      this.element = element;
      this.delegate = delegate;
      this.started = false;
      this.stringMap = /* @__PURE__ */ new Map();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, { attributes: true, attributeOldValue: true });
        this.refresh();
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        for (const attributeName of this.knownAttributeNames) {
          this.refreshAttribute(attributeName, null);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      const attributeName = mutation.attributeName;
      if (attributeName) {
        this.refreshAttribute(attributeName, mutation.oldValue);
      }
    }
    refreshAttribute(attributeName, oldValue) {
      const key = this.delegate.getStringMapKeyForAttribute(attributeName);
      if (key != null) {
        if (!this.stringMap.has(attributeName)) {
          this.stringMapKeyAdded(key, attributeName);
        }
        const value = this.element.getAttribute(attributeName);
        if (this.stringMap.get(attributeName) != value) {
          this.stringMapValueChanged(value, key, oldValue);
        }
        if (value == null) {
          const oldValue2 = this.stringMap.get(attributeName);
          this.stringMap.delete(attributeName);
          if (oldValue2)
            this.stringMapKeyRemoved(key, attributeName, oldValue2);
        } else {
          this.stringMap.set(attributeName, value);
        }
      }
    }
    stringMapKeyAdded(key, attributeName) {
      if (this.delegate.stringMapKeyAdded) {
        this.delegate.stringMapKeyAdded(key, attributeName);
      }
    }
    stringMapValueChanged(value, key, oldValue) {
      if (this.delegate.stringMapValueChanged) {
        this.delegate.stringMapValueChanged(value, key, oldValue);
      }
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      if (this.delegate.stringMapKeyRemoved) {
        this.delegate.stringMapKeyRemoved(key, attributeName, oldValue);
      }
    }
    get knownAttributeNames() {
      return Array.from(new Set(this.currentAttributeNames.concat(this.recordedAttributeNames)));
    }
    get currentAttributeNames() {
      return Array.from(this.element.attributes).map((attribute) => attribute.name);
    }
    get recordedAttributeNames() {
      return Array.from(this.stringMap.keys());
    }
  };
  var TokenListObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeObserver = new AttributeObserver(element, attributeName, this);
      this.delegate = delegate;
      this.tokensByElement = new Multimap();
    }
    get started() {
      return this.attributeObserver.started;
    }
    start() {
      this.attributeObserver.start();
    }
    pause(callback) {
      this.attributeObserver.pause(callback);
    }
    stop() {
      this.attributeObserver.stop();
    }
    refresh() {
      this.attributeObserver.refresh();
    }
    get element() {
      return this.attributeObserver.element;
    }
    get attributeName() {
      return this.attributeObserver.attributeName;
    }
    elementMatchedAttribute(element) {
      this.tokensMatched(this.readTokensForElement(element));
    }
    elementAttributeValueChanged(element) {
      const [unmatchedTokens, matchedTokens] = this.refreshTokensForElement(element);
      this.tokensUnmatched(unmatchedTokens);
      this.tokensMatched(matchedTokens);
    }
    elementUnmatchedAttribute(element) {
      this.tokensUnmatched(this.tokensByElement.getValuesForKey(element));
    }
    tokensMatched(tokens) {
      tokens.forEach((token) => this.tokenMatched(token));
    }
    tokensUnmatched(tokens) {
      tokens.forEach((token) => this.tokenUnmatched(token));
    }
    tokenMatched(token) {
      this.delegate.tokenMatched(token);
      this.tokensByElement.add(token.element, token);
    }
    tokenUnmatched(token) {
      this.delegate.tokenUnmatched(token);
      this.tokensByElement.delete(token.element, token);
    }
    refreshTokensForElement(element) {
      const previousTokens = this.tokensByElement.getValuesForKey(element);
      const currentTokens = this.readTokensForElement(element);
      const firstDifferingIndex = zip(previousTokens, currentTokens).findIndex(([previousToken, currentToken]) => !tokensAreEqual(previousToken, currentToken));
      if (firstDifferingIndex == -1) {
        return [[], []];
      } else {
        return [previousTokens.slice(firstDifferingIndex), currentTokens.slice(firstDifferingIndex)];
      }
    }
    readTokensForElement(element) {
      const attributeName = this.attributeName;
      const tokenString = element.getAttribute(attributeName) || "";
      return parseTokenString(tokenString, element, attributeName);
    }
  };
  function parseTokenString(tokenString, element, attributeName) {
    return tokenString.trim().split(/\s+/).filter((content) => content.length).map((content, index) => ({ element, attributeName, content, index }));
  }
  function zip(left, right) {
    const length = Math.max(left.length, right.length);
    return Array.from({ length }, (_, index) => [left[index], right[index]]);
  }
  function tokensAreEqual(left, right) {
    return left && right && left.index == right.index && left.content == right.content;
  }
  var ValueListObserver = class {
    constructor(element, attributeName, delegate) {
      this.tokenListObserver = new TokenListObserver(element, attributeName, this);
      this.delegate = delegate;
      this.parseResultsByToken = /* @__PURE__ */ new WeakMap();
      this.valuesByTokenByElement = /* @__PURE__ */ new WeakMap();
    }
    get started() {
      return this.tokenListObserver.started;
    }
    start() {
      this.tokenListObserver.start();
    }
    stop() {
      this.tokenListObserver.stop();
    }
    refresh() {
      this.tokenListObserver.refresh();
    }
    get element() {
      return this.tokenListObserver.element;
    }
    get attributeName() {
      return this.tokenListObserver.attributeName;
    }
    tokenMatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).set(token, value);
        this.delegate.elementMatchedValue(element, value);
      }
    }
    tokenUnmatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).delete(token);
        this.delegate.elementUnmatchedValue(element, value);
      }
    }
    fetchParseResultForToken(token) {
      let parseResult = this.parseResultsByToken.get(token);
      if (!parseResult) {
        parseResult = this.parseToken(token);
        this.parseResultsByToken.set(token, parseResult);
      }
      return parseResult;
    }
    fetchValuesByTokenForElement(element) {
      let valuesByToken = this.valuesByTokenByElement.get(element);
      if (!valuesByToken) {
        valuesByToken = /* @__PURE__ */ new Map();
        this.valuesByTokenByElement.set(element, valuesByToken);
      }
      return valuesByToken;
    }
    parseToken(token) {
      try {
        const value = this.delegate.parseValueForToken(token);
        return { value };
      } catch (error2) {
        return { error: error2 };
      }
    }
  };
  var BindingObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.bindingsByAction = /* @__PURE__ */ new Map();
    }
    start() {
      if (!this.valueListObserver) {
        this.valueListObserver = new ValueListObserver(this.element, this.actionAttribute, this);
        this.valueListObserver.start();
      }
    }
    stop() {
      if (this.valueListObserver) {
        this.valueListObserver.stop();
        delete this.valueListObserver;
        this.disconnectAllActions();
      }
    }
    get element() {
      return this.context.element;
    }
    get identifier() {
      return this.context.identifier;
    }
    get actionAttribute() {
      return this.schema.actionAttribute;
    }
    get schema() {
      return this.context.schema;
    }
    get bindings() {
      return Array.from(this.bindingsByAction.values());
    }
    connectAction(action) {
      const binding = new Binding(this.context, action);
      this.bindingsByAction.set(action, binding);
      this.delegate.bindingConnected(binding);
    }
    disconnectAction(action) {
      const binding = this.bindingsByAction.get(action);
      if (binding) {
        this.bindingsByAction.delete(action);
        this.delegate.bindingDisconnected(binding);
      }
    }
    disconnectAllActions() {
      this.bindings.forEach((binding) => this.delegate.bindingDisconnected(binding, true));
      this.bindingsByAction.clear();
    }
    parseValueForToken(token) {
      const action = Action.forToken(token, this.schema);
      if (action.identifier == this.identifier) {
        return action;
      }
    }
    elementMatchedValue(element, action) {
      this.connectAction(action);
    }
    elementUnmatchedValue(element, action) {
      this.disconnectAction(action);
    }
  };
  var ValueObserver = class {
    constructor(context, receiver) {
      this.context = context;
      this.receiver = receiver;
      this.stringMapObserver = new StringMapObserver(this.element, this);
      this.valueDescriptorMap = this.controller.valueDescriptorMap;
    }
    start() {
      this.stringMapObserver.start();
      this.invokeChangedCallbacksForDefaultValues();
    }
    stop() {
      this.stringMapObserver.stop();
    }
    get element() {
      return this.context.element;
    }
    get controller() {
      return this.context.controller;
    }
    getStringMapKeyForAttribute(attributeName) {
      if (attributeName in this.valueDescriptorMap) {
        return this.valueDescriptorMap[attributeName].name;
      }
    }
    stringMapKeyAdded(key, attributeName) {
      const descriptor = this.valueDescriptorMap[attributeName];
      if (!this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), descriptor.writer(descriptor.defaultValue));
      }
    }
    stringMapValueChanged(value, name, oldValue) {
      const descriptor = this.valueDescriptorNameMap[name];
      if (value === null)
        return;
      if (oldValue === null) {
        oldValue = descriptor.writer(descriptor.defaultValue);
      }
      this.invokeChangedCallback(name, value, oldValue);
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      const descriptor = this.valueDescriptorNameMap[key];
      if (this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), oldValue);
      } else {
        this.invokeChangedCallback(key, descriptor.writer(descriptor.defaultValue), oldValue);
      }
    }
    invokeChangedCallbacksForDefaultValues() {
      for (const { key, name, defaultValue, writer } of this.valueDescriptors) {
        if (defaultValue != void 0 && !this.controller.data.has(key)) {
          this.invokeChangedCallback(name, writer(defaultValue), void 0);
        }
      }
    }
    invokeChangedCallback(name, rawValue, rawOldValue) {
      const changedMethodName = `${name}Changed`;
      const changedMethod = this.receiver[changedMethodName];
      if (typeof changedMethod == "function") {
        const descriptor = this.valueDescriptorNameMap[name];
        try {
          const value = descriptor.reader(rawValue);
          let oldValue = rawOldValue;
          if (rawOldValue) {
            oldValue = descriptor.reader(rawOldValue);
          }
          changedMethod.call(this.receiver, value, oldValue);
        } catch (error2) {
          if (error2 instanceof TypeError) {
            error2.message = `Stimulus Value "${this.context.identifier}.${descriptor.name}" - ${error2.message}`;
          }
          throw error2;
        }
      }
    }
    get valueDescriptors() {
      const { valueDescriptorMap } = this;
      return Object.keys(valueDescriptorMap).map((key) => valueDescriptorMap[key]);
    }
    get valueDescriptorNameMap() {
      const descriptors = {};
      Object.keys(this.valueDescriptorMap).forEach((key) => {
        const descriptor = this.valueDescriptorMap[key];
        descriptors[descriptor.name] = descriptor;
      });
      return descriptors;
    }
    hasValue(attributeName) {
      const descriptor = this.valueDescriptorNameMap[attributeName];
      const hasMethodName = `has${capitalize(descriptor.name)}`;
      return this.receiver[hasMethodName];
    }
  };
  var TargetObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.targetsByName = new Multimap();
    }
    start() {
      if (!this.tokenListObserver) {
        this.tokenListObserver = new TokenListObserver(this.element, this.attributeName, this);
        this.tokenListObserver.start();
      }
    }
    stop() {
      if (this.tokenListObserver) {
        this.disconnectAllTargets();
        this.tokenListObserver.stop();
        delete this.tokenListObserver;
      }
    }
    tokenMatched({ element, content: name }) {
      if (this.scope.containsElement(element)) {
        this.connectTarget(element, name);
      }
    }
    tokenUnmatched({ element, content: name }) {
      this.disconnectTarget(element, name);
    }
    connectTarget(element, name) {
      var _a;
      if (!this.targetsByName.has(name, element)) {
        this.targetsByName.add(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetConnected(element, name));
      }
    }
    disconnectTarget(element, name) {
      var _a;
      if (this.targetsByName.has(name, element)) {
        this.targetsByName.delete(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetDisconnected(element, name));
      }
    }
    disconnectAllTargets() {
      for (const name of this.targetsByName.keys) {
        for (const element of this.targetsByName.getValuesForKey(name)) {
          this.disconnectTarget(element, name);
        }
      }
    }
    get attributeName() {
      return `data-${this.context.identifier}-target`;
    }
    get element() {
      return this.context.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  function readInheritableStaticArrayValues(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return Array.from(ancestors.reduce((values, constructor2) => {
      getOwnStaticArrayValues(constructor2, propertyName).forEach((name) => values.add(name));
      return values;
    }, /* @__PURE__ */ new Set()));
  }
  function readInheritableStaticObjectPairs(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return ancestors.reduce((pairs, constructor2) => {
      pairs.push(...getOwnStaticObjectPairs(constructor2, propertyName));
      return pairs;
    }, []);
  }
  function getAncestorsForConstructor(constructor) {
    const ancestors = [];
    while (constructor) {
      ancestors.push(constructor);
      constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
  }
  function getOwnStaticArrayValues(constructor, propertyName) {
    const definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
  }
  function getOwnStaticObjectPairs(constructor, propertyName) {
    const definition = constructor[propertyName];
    return definition ? Object.keys(definition).map((key) => [key, definition[key]]) : [];
  }
  var OutletObserver = class {
    constructor(context, delegate) {
      this.started = false;
      this.context = context;
      this.delegate = delegate;
      this.outletsByName = new Multimap();
      this.outletElementsByName = new Multimap();
      this.selectorObserverMap = /* @__PURE__ */ new Map();
      this.attributeObserverMap = /* @__PURE__ */ new Map();
    }
    start() {
      if (!this.started) {
        this.outletDefinitions.forEach((outletName) => {
          this.setupSelectorObserverForOutlet(outletName);
          this.setupAttributeObserverForOutlet(outletName);
        });
        this.started = true;
        this.dependentContexts.forEach((context) => context.refresh());
      }
    }
    refresh() {
      this.selectorObserverMap.forEach((observer) => observer.refresh());
      this.attributeObserverMap.forEach((observer) => observer.refresh());
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.disconnectAllOutlets();
        this.stopSelectorObservers();
        this.stopAttributeObservers();
      }
    }
    stopSelectorObservers() {
      if (this.selectorObserverMap.size > 0) {
        this.selectorObserverMap.forEach((observer) => observer.stop());
        this.selectorObserverMap.clear();
      }
    }
    stopAttributeObservers() {
      if (this.attributeObserverMap.size > 0) {
        this.attributeObserverMap.forEach((observer) => observer.stop());
        this.attributeObserverMap.clear();
      }
    }
    selectorMatched(element, _selector, { outletName }) {
      const outlet = this.getOutlet(element, outletName);
      if (outlet) {
        this.connectOutlet(outlet, element, outletName);
      }
    }
    selectorUnmatched(element, _selector, { outletName }) {
      const outlet = this.getOutletFromMap(element, outletName);
      if (outlet) {
        this.disconnectOutlet(outlet, element, outletName);
      }
    }
    selectorMatchElement(element, { outletName }) {
      const selector = this.selector(outletName);
      const hasOutlet = this.hasOutlet(element, outletName);
      const hasOutletController = element.matches(`[${this.schema.controllerAttribute}~=${outletName}]`);
      if (selector) {
        return hasOutlet && hasOutletController && element.matches(selector);
      } else {
        return false;
      }
    }
    elementMatchedAttribute(_element, attributeName) {
      const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
      if (outletName) {
        this.updateSelectorObserverForOutlet(outletName);
      }
    }
    elementAttributeValueChanged(_element, attributeName) {
      const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
      if (outletName) {
        this.updateSelectorObserverForOutlet(outletName);
      }
    }
    elementUnmatchedAttribute(_element, attributeName) {
      const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
      if (outletName) {
        this.updateSelectorObserverForOutlet(outletName);
      }
    }
    connectOutlet(outlet, element, outletName) {
      var _a;
      if (!this.outletElementsByName.has(outletName, element)) {
        this.outletsByName.add(outletName, outlet);
        this.outletElementsByName.add(outletName, element);
        (_a = this.selectorObserverMap.get(outletName)) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.outletConnected(outlet, element, outletName));
      }
    }
    disconnectOutlet(outlet, element, outletName) {
      var _a;
      if (this.outletElementsByName.has(outletName, element)) {
        this.outletsByName.delete(outletName, outlet);
        this.outletElementsByName.delete(outletName, element);
        (_a = this.selectorObserverMap.get(outletName)) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.outletDisconnected(outlet, element, outletName));
      }
    }
    disconnectAllOutlets() {
      for (const outletName of this.outletElementsByName.keys) {
        for (const element of this.outletElementsByName.getValuesForKey(outletName)) {
          for (const outlet of this.outletsByName.getValuesForKey(outletName)) {
            this.disconnectOutlet(outlet, element, outletName);
          }
        }
      }
    }
    updateSelectorObserverForOutlet(outletName) {
      const observer = this.selectorObserverMap.get(outletName);
      if (observer) {
        observer.selector = this.selector(outletName);
      }
    }
    setupSelectorObserverForOutlet(outletName) {
      const selector = this.selector(outletName);
      const selectorObserver = new SelectorObserver(document.body, selector, this, { outletName });
      this.selectorObserverMap.set(outletName, selectorObserver);
      selectorObserver.start();
    }
    setupAttributeObserverForOutlet(outletName) {
      const attributeName = this.attributeNameForOutletName(outletName);
      const attributeObserver = new AttributeObserver(this.scope.element, attributeName, this);
      this.attributeObserverMap.set(outletName, attributeObserver);
      attributeObserver.start();
    }
    selector(outletName) {
      return this.scope.outlets.getSelectorForOutletName(outletName);
    }
    attributeNameForOutletName(outletName) {
      return this.scope.schema.outletAttributeForScope(this.identifier, outletName);
    }
    getOutletNameFromOutletAttributeName(attributeName) {
      return this.outletDefinitions.find((outletName) => this.attributeNameForOutletName(outletName) === attributeName);
    }
    get outletDependencies() {
      const dependencies = new Multimap();
      this.router.modules.forEach((module) => {
        const constructor = module.definition.controllerConstructor;
        const outlets = readInheritableStaticArrayValues(constructor, "outlets");
        outlets.forEach((outlet) => dependencies.add(outlet, module.identifier));
      });
      return dependencies;
    }
    get outletDefinitions() {
      return this.outletDependencies.getKeysForValue(this.identifier);
    }
    get dependentControllerIdentifiers() {
      return this.outletDependencies.getValuesForKey(this.identifier);
    }
    get dependentContexts() {
      const identifiers = this.dependentControllerIdentifiers;
      return this.router.contexts.filter((context) => identifiers.includes(context.identifier));
    }
    hasOutlet(element, outletName) {
      return !!this.getOutlet(element, outletName) || !!this.getOutletFromMap(element, outletName);
    }
    getOutlet(element, outletName) {
      return this.application.getControllerForElementAndIdentifier(element, outletName);
    }
    getOutletFromMap(element, outletName) {
      return this.outletsByName.getValuesForKey(outletName).find((outlet) => outlet.element === element);
    }
    get scope() {
      return this.context.scope;
    }
    get schema() {
      return this.context.schema;
    }
    get identifier() {
      return this.context.identifier;
    }
    get application() {
      return this.context.application;
    }
    get router() {
      return this.application.router;
    }
  };
  var Context = class {
    constructor(module, scope) {
      this.logDebugActivity = (functionName, detail = {}) => {
        const { identifier: identifier2, controller, element } = this;
        detail = Object.assign({ identifier: identifier2, controller, element }, detail);
        this.application.logDebugActivity(this.identifier, functionName, detail);
      };
      this.module = module;
      this.scope = scope;
      this.controller = new module.controllerConstructor(this);
      this.bindingObserver = new BindingObserver(this, this.dispatcher);
      this.valueObserver = new ValueObserver(this, this.controller);
      this.targetObserver = new TargetObserver(this, this);
      this.outletObserver = new OutletObserver(this, this);
      try {
        this.controller.initialize();
        this.logDebugActivity("initialize");
      } catch (error2) {
        this.handleError(error2, "initializing controller");
      }
    }
    connect() {
      this.bindingObserver.start();
      this.valueObserver.start();
      this.targetObserver.start();
      this.outletObserver.start();
      try {
        this.controller.connect();
        this.logDebugActivity("connect");
      } catch (error2) {
        this.handleError(error2, "connecting controller");
      }
    }
    refresh() {
      this.outletObserver.refresh();
    }
    disconnect() {
      try {
        this.controller.disconnect();
        this.logDebugActivity("disconnect");
      } catch (error2) {
        this.handleError(error2, "disconnecting controller");
      }
      this.outletObserver.stop();
      this.targetObserver.stop();
      this.valueObserver.stop();
      this.bindingObserver.stop();
    }
    get application() {
      return this.module.application;
    }
    get identifier() {
      return this.module.identifier;
    }
    get schema() {
      return this.application.schema;
    }
    get dispatcher() {
      return this.application.dispatcher;
    }
    get element() {
      return this.scope.element;
    }
    get parentElement() {
      return this.element.parentElement;
    }
    handleError(error2, message, detail = {}) {
      const { identifier: identifier2, controller, element } = this;
      detail = Object.assign({ identifier: identifier2, controller, element }, detail);
      this.application.handleError(error2, `Error ${message}`, detail);
    }
    targetConnected(element, name) {
      this.invokeControllerMethod(`${name}TargetConnected`, element);
    }
    targetDisconnected(element, name) {
      this.invokeControllerMethod(`${name}TargetDisconnected`, element);
    }
    outletConnected(outlet, element, name) {
      this.invokeControllerMethod(`${namespaceCamelize(name)}OutletConnected`, outlet, element);
    }
    outletDisconnected(outlet, element, name) {
      this.invokeControllerMethod(`${namespaceCamelize(name)}OutletDisconnected`, outlet, element);
    }
    invokeControllerMethod(methodName, ...args) {
      const controller = this.controller;
      if (typeof controller[methodName] == "function") {
        controller[methodName](...args);
      }
    }
  };
  function bless(constructor) {
    return shadow(constructor, getBlessedProperties(constructor));
  }
  function shadow(constructor, properties) {
    const shadowConstructor = extend2(constructor);
    const shadowProperties = getShadowProperties(constructor.prototype, properties);
    Object.defineProperties(shadowConstructor.prototype, shadowProperties);
    return shadowConstructor;
  }
  function getBlessedProperties(constructor) {
    const blessings = readInheritableStaticArrayValues(constructor, "blessings");
    return blessings.reduce((blessedProperties, blessing) => {
      const properties = blessing(constructor);
      for (const key in properties) {
        const descriptor = blessedProperties[key] || {};
        blessedProperties[key] = Object.assign(descriptor, properties[key]);
      }
      return blessedProperties;
    }, {});
  }
  function getShadowProperties(prototype, properties) {
    return getOwnKeys(properties).reduce((shadowProperties, key) => {
      const descriptor = getShadowedDescriptor(prototype, properties, key);
      if (descriptor) {
        Object.assign(shadowProperties, { [key]: descriptor });
      }
      return shadowProperties;
    }, {});
  }
  function getShadowedDescriptor(prototype, properties, key) {
    const shadowingDescriptor = Object.getOwnPropertyDescriptor(prototype, key);
    const shadowedByValue = shadowingDescriptor && "value" in shadowingDescriptor;
    if (!shadowedByValue) {
      const descriptor = Object.getOwnPropertyDescriptor(properties, key).value;
      if (shadowingDescriptor) {
        descriptor.get = shadowingDescriptor.get || descriptor.get;
        descriptor.set = shadowingDescriptor.set || descriptor.set;
      }
      return descriptor;
    }
  }
  var getOwnKeys = (() => {
    if (typeof Object.getOwnPropertySymbols == "function") {
      return (object) => [...Object.getOwnPropertyNames(object), ...Object.getOwnPropertySymbols(object)];
    } else {
      return Object.getOwnPropertyNames;
    }
  })();
  var extend2 = (() => {
    function extendWithReflect(constructor) {
      function extended() {
        return Reflect.construct(constructor, arguments, new.target);
      }
      extended.prototype = Object.create(constructor.prototype, {
        constructor: { value: extended }
      });
      Reflect.setPrototypeOf(extended, constructor);
      return extended;
    }
    function testReflectExtension() {
      const a = function() {
        this.a.call(this);
      };
      const b = extendWithReflect(a);
      b.prototype.a = function() {
      };
      return new b();
    }
    try {
      testReflectExtension();
      return extendWithReflect;
    } catch (error2) {
      return (constructor) => class extended extends constructor {
      };
    }
  })();
  function blessDefinition(definition) {
    return {
      identifier: definition.identifier,
      controllerConstructor: bless(definition.controllerConstructor)
    };
  }
  var Module = class {
    constructor(application2, definition) {
      this.application = application2;
      this.definition = blessDefinition(definition);
      this.contextsByScope = /* @__PURE__ */ new WeakMap();
      this.connectedContexts = /* @__PURE__ */ new Set();
    }
    get identifier() {
      return this.definition.identifier;
    }
    get controllerConstructor() {
      return this.definition.controllerConstructor;
    }
    get contexts() {
      return Array.from(this.connectedContexts);
    }
    connectContextForScope(scope) {
      const context = this.fetchContextForScope(scope);
      this.connectedContexts.add(context);
      context.connect();
    }
    disconnectContextForScope(scope) {
      const context = this.contextsByScope.get(scope);
      if (context) {
        this.connectedContexts.delete(context);
        context.disconnect();
      }
    }
    fetchContextForScope(scope) {
      let context = this.contextsByScope.get(scope);
      if (!context) {
        context = new Context(this, scope);
        this.contextsByScope.set(scope, context);
      }
      return context;
    }
  };
  var ClassMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    has(name) {
      return this.data.has(this.getDataKey(name));
    }
    get(name) {
      return this.getAll(name)[0];
    }
    getAll(name) {
      const tokenString = this.data.get(this.getDataKey(name)) || "";
      return tokenize(tokenString);
    }
    getAttributeName(name) {
      return this.data.getAttributeNameForKey(this.getDataKey(name));
    }
    getDataKey(name) {
      return `${name}-class`;
    }
    get data() {
      return this.scope.data;
    }
  };
  var DataMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.getAttribute(name);
    }
    set(key, value) {
      const name = this.getAttributeNameForKey(key);
      this.element.setAttribute(name, value);
      return this.get(key);
    }
    has(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.hasAttribute(name);
    }
    delete(key) {
      if (this.has(key)) {
        const name = this.getAttributeNameForKey(key);
        this.element.removeAttribute(name);
        return true;
      } else {
        return false;
      }
    }
    getAttributeNameForKey(key) {
      return `data-${this.identifier}-${dasherize(key)}`;
    }
  };
  var Guide = class {
    constructor(logger) {
      this.warnedKeysByObject = /* @__PURE__ */ new WeakMap();
      this.logger = logger;
    }
    warn(object, key, message) {
      let warnedKeys = this.warnedKeysByObject.get(object);
      if (!warnedKeys) {
        warnedKeys = /* @__PURE__ */ new Set();
        this.warnedKeysByObject.set(object, warnedKeys);
      }
      if (!warnedKeys.has(key)) {
        warnedKeys.add(key);
        this.logger.warn(message, object);
      }
    }
  };
  function attributeValueContainsToken(attributeName, token) {
    return `[${attributeName}~="${token}"]`;
  }
  var TargetSet = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get schema() {
      return this.scope.schema;
    }
    has(targetName) {
      return this.find(targetName) != null;
    }
    find(...targetNames) {
      return targetNames.reduce((target, targetName) => target || this.findTarget(targetName) || this.findLegacyTarget(targetName), void 0);
    }
    findAll(...targetNames) {
      return targetNames.reduce((targets, targetName) => [
        ...targets,
        ...this.findAllTargets(targetName),
        ...this.findAllLegacyTargets(targetName)
      ], []);
    }
    findTarget(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findElement(selector);
    }
    findAllTargets(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findAllElements(selector);
    }
    getSelectorForTargetName(targetName) {
      const attributeName = this.schema.targetAttributeForScope(this.identifier);
      return attributeValueContainsToken(attributeName, targetName);
    }
    findLegacyTarget(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.deprecate(this.scope.findElement(selector), targetName);
    }
    findAllLegacyTargets(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.scope.findAllElements(selector).map((element) => this.deprecate(element, targetName));
    }
    getLegacySelectorForTargetName(targetName) {
      const targetDescriptor = `${this.identifier}.${targetName}`;
      return attributeValueContainsToken(this.schema.targetAttribute, targetDescriptor);
    }
    deprecate(element, targetName) {
      if (element) {
        const { identifier: identifier2 } = this;
        const attributeName = this.schema.targetAttribute;
        const revisedAttributeName = this.schema.targetAttributeForScope(identifier2);
        this.guide.warn(element, `target:${targetName}`, `Please replace ${attributeName}="${identifier2}.${targetName}" with ${revisedAttributeName}="${targetName}". The ${attributeName} attribute is deprecated and will be removed in a future version of Stimulus.`);
      }
      return element;
    }
    get guide() {
      return this.scope.guide;
    }
  };
  var OutletSet = class {
    constructor(scope, controllerElement) {
      this.scope = scope;
      this.controllerElement = controllerElement;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get schema() {
      return this.scope.schema;
    }
    has(outletName) {
      return this.find(outletName) != null;
    }
    find(...outletNames) {
      return outletNames.reduce((outlet, outletName) => outlet || this.findOutlet(outletName), void 0);
    }
    findAll(...outletNames) {
      return outletNames.reduce((outlets, outletName) => [...outlets, ...this.findAllOutlets(outletName)], []);
    }
    getSelectorForOutletName(outletName) {
      const attributeName = this.schema.outletAttributeForScope(this.identifier, outletName);
      return this.controllerElement.getAttribute(attributeName);
    }
    findOutlet(outletName) {
      const selector = this.getSelectorForOutletName(outletName);
      if (selector)
        return this.findElement(selector, outletName);
    }
    findAllOutlets(outletName) {
      const selector = this.getSelectorForOutletName(outletName);
      return selector ? this.findAllElements(selector, outletName) : [];
    }
    findElement(selector, outletName) {
      const elements = this.scope.queryElements(selector);
      return elements.filter((element) => this.matchesElement(element, selector, outletName))[0];
    }
    findAllElements(selector, outletName) {
      const elements = this.scope.queryElements(selector);
      return elements.filter((element) => this.matchesElement(element, selector, outletName));
    }
    matchesElement(element, selector, outletName) {
      const controllerAttribute = element.getAttribute(this.scope.schema.controllerAttribute) || "";
      return element.matches(selector) && controllerAttribute.split(" ").includes(outletName);
    }
  };
  var Scope = class _Scope {
    constructor(schema, element, identifier2, logger) {
      this.targets = new TargetSet(this);
      this.classes = new ClassMap(this);
      this.data = new DataMap(this);
      this.containsElement = (element2) => {
        return element2.closest(this.controllerSelector) === this.element;
      };
      this.schema = schema;
      this.element = element;
      this.identifier = identifier2;
      this.guide = new Guide(logger);
      this.outlets = new OutletSet(this.documentScope, element);
    }
    findElement(selector) {
      return this.element.matches(selector) ? this.element : this.queryElements(selector).find(this.containsElement);
    }
    findAllElements(selector) {
      return [
        ...this.element.matches(selector) ? [this.element] : [],
        ...this.queryElements(selector).filter(this.containsElement)
      ];
    }
    queryElements(selector) {
      return Array.from(this.element.querySelectorAll(selector));
    }
    get controllerSelector() {
      return attributeValueContainsToken(this.schema.controllerAttribute, this.identifier);
    }
    get isDocumentScope() {
      return this.element === document.documentElement;
    }
    get documentScope() {
      return this.isDocumentScope ? this : new _Scope(this.schema, document.documentElement, this.identifier, this.guide.logger);
    }
  };
  var ScopeObserver = class {
    constructor(element, schema, delegate) {
      this.element = element;
      this.schema = schema;
      this.delegate = delegate;
      this.valueListObserver = new ValueListObserver(this.element, this.controllerAttribute, this);
      this.scopesByIdentifierByElement = /* @__PURE__ */ new WeakMap();
      this.scopeReferenceCounts = /* @__PURE__ */ new WeakMap();
    }
    start() {
      this.valueListObserver.start();
    }
    stop() {
      this.valueListObserver.stop();
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    parseValueForToken(token) {
      const { element, content: identifier2 } = token;
      return this.parseValueForElementAndIdentifier(element, identifier2);
    }
    parseValueForElementAndIdentifier(element, identifier2) {
      const scopesByIdentifier = this.fetchScopesByIdentifierForElement(element);
      let scope = scopesByIdentifier.get(identifier2);
      if (!scope) {
        scope = this.delegate.createScopeForElementAndIdentifier(element, identifier2);
        scopesByIdentifier.set(identifier2, scope);
      }
      return scope;
    }
    elementMatchedValue(element, value) {
      const referenceCount = (this.scopeReferenceCounts.get(value) || 0) + 1;
      this.scopeReferenceCounts.set(value, referenceCount);
      if (referenceCount == 1) {
        this.delegate.scopeConnected(value);
      }
    }
    elementUnmatchedValue(element, value) {
      const referenceCount = this.scopeReferenceCounts.get(value);
      if (referenceCount) {
        this.scopeReferenceCounts.set(value, referenceCount - 1);
        if (referenceCount == 1) {
          this.delegate.scopeDisconnected(value);
        }
      }
    }
    fetchScopesByIdentifierForElement(element) {
      let scopesByIdentifier = this.scopesByIdentifierByElement.get(element);
      if (!scopesByIdentifier) {
        scopesByIdentifier = /* @__PURE__ */ new Map();
        this.scopesByIdentifierByElement.set(element, scopesByIdentifier);
      }
      return scopesByIdentifier;
    }
  };
  var Router = class {
    constructor(application2) {
      this.application = application2;
      this.scopeObserver = new ScopeObserver(this.element, this.schema, this);
      this.scopesByIdentifier = new Multimap();
      this.modulesByIdentifier = /* @__PURE__ */ new Map();
    }
    get element() {
      return this.application.element;
    }
    get schema() {
      return this.application.schema;
    }
    get logger() {
      return this.application.logger;
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    get modules() {
      return Array.from(this.modulesByIdentifier.values());
    }
    get contexts() {
      return this.modules.reduce((contexts, module) => contexts.concat(module.contexts), []);
    }
    start() {
      this.scopeObserver.start();
    }
    stop() {
      this.scopeObserver.stop();
    }
    loadDefinition(definition) {
      this.unloadIdentifier(definition.identifier);
      const module = new Module(this.application, definition);
      this.connectModule(module);
      const afterLoad = definition.controllerConstructor.afterLoad;
      if (afterLoad) {
        afterLoad.call(definition.controllerConstructor, definition.identifier, this.application);
      }
    }
    unloadIdentifier(identifier2) {
      const module = this.modulesByIdentifier.get(identifier2);
      if (module) {
        this.disconnectModule(module);
      }
    }
    getContextForElementAndIdentifier(element, identifier2) {
      const module = this.modulesByIdentifier.get(identifier2);
      if (module) {
        return module.contexts.find((context) => context.element == element);
      }
    }
    proposeToConnectScopeForElementAndIdentifier(element, identifier2) {
      const scope = this.scopeObserver.parseValueForElementAndIdentifier(element, identifier2);
      if (scope) {
        this.scopeObserver.elementMatchedValue(scope.element, scope);
      } else {
        console.error(`Couldn't find or create scope for identifier: "${identifier2}" and element:`, element);
      }
    }
    handleError(error2, message, detail) {
      this.application.handleError(error2, message, detail);
    }
    createScopeForElementAndIdentifier(element, identifier2) {
      return new Scope(this.schema, element, identifier2, this.logger);
    }
    scopeConnected(scope) {
      this.scopesByIdentifier.add(scope.identifier, scope);
      const module = this.modulesByIdentifier.get(scope.identifier);
      if (module) {
        module.connectContextForScope(scope);
      }
    }
    scopeDisconnected(scope) {
      this.scopesByIdentifier.delete(scope.identifier, scope);
      const module = this.modulesByIdentifier.get(scope.identifier);
      if (module) {
        module.disconnectContextForScope(scope);
      }
    }
    connectModule(module) {
      this.modulesByIdentifier.set(module.identifier, module);
      const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach((scope) => module.connectContextForScope(scope));
    }
    disconnectModule(module) {
      this.modulesByIdentifier.delete(module.identifier);
      const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach((scope) => module.disconnectContextForScope(scope));
    }
  };
  var defaultSchema = {
    controllerAttribute: "data-controller",
    actionAttribute: "data-action",
    targetAttribute: "data-target",
    targetAttributeForScope: (identifier2) => `data-${identifier2}-target`,
    outletAttributeForScope: (identifier2, outlet) => `data-${identifier2}-${outlet}-outlet`,
    keyMappings: Object.assign(Object.assign({ enter: "Enter", tab: "Tab", esc: "Escape", space: " ", up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", home: "Home", end: "End", page_up: "PageUp", page_down: "PageDown" }, objectFromEntries("abcdefghijklmnopqrstuvwxyz".split("").map((c) => [c, c]))), objectFromEntries("0123456789".split("").map((n) => [n, n])))
  };
  function objectFromEntries(array) {
    return array.reduce((memo, [k, v]) => Object.assign(Object.assign({}, memo), { [k]: v }), {});
  }
  var Application = class {
    constructor(element = document.documentElement, schema = defaultSchema) {
      this.logger = console;
      this.debug = false;
      this.logDebugActivity = (identifier2, functionName, detail = {}) => {
        if (this.debug) {
          this.logFormattedMessage(identifier2, functionName, detail);
        }
      };
      this.element = element;
      this.schema = schema;
      this.dispatcher = new Dispatcher(this);
      this.router = new Router(this);
      this.actionDescriptorFilters = Object.assign({}, defaultActionDescriptorFilters);
    }
    static start(element, schema) {
      const application2 = new this(element, schema);
      application2.start();
      return application2;
    }
    async start() {
      await domReady();
      this.logDebugActivity("application", "starting");
      this.dispatcher.start();
      this.router.start();
      this.logDebugActivity("application", "start");
    }
    stop() {
      this.logDebugActivity("application", "stopping");
      this.dispatcher.stop();
      this.router.stop();
      this.logDebugActivity("application", "stop");
    }
    register(identifier2, controllerConstructor) {
      this.load({ identifier: identifier2, controllerConstructor });
    }
    registerActionOption(name, filter) {
      this.actionDescriptorFilters[name] = filter;
    }
    load(head, ...rest) {
      const definitions = Array.isArray(head) ? head : [head, ...rest];
      definitions.forEach((definition) => {
        if (definition.controllerConstructor.shouldLoad) {
          this.router.loadDefinition(definition);
        }
      });
    }
    unload(head, ...rest) {
      const identifiers = Array.isArray(head) ? head : [head, ...rest];
      identifiers.forEach((identifier2) => this.router.unloadIdentifier(identifier2));
    }
    get controllers() {
      return this.router.contexts.map((context) => context.controller);
    }
    getControllerForElementAndIdentifier(element, identifier2) {
      const context = this.router.getContextForElementAndIdentifier(element, identifier2);
      return context ? context.controller : null;
    }
    handleError(error2, message, detail) {
      var _a;
      this.logger.error(`%s

%o

%o`, message, error2, detail);
      (_a = window.onerror) === null || _a === void 0 ? void 0 : _a.call(window, message, "", 0, 0, error2);
    }
    logFormattedMessage(identifier2, functionName, detail = {}) {
      detail = Object.assign({ application: this }, detail);
      this.logger.groupCollapsed(`${identifier2} #${functionName}`);
      this.logger.log("details:", Object.assign({}, detail));
      this.logger.groupEnd();
    }
  };
  function domReady() {
    return new Promise((resolve) => {
      if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", () => resolve());
      } else {
        resolve();
      }
    });
  }
  function ClassPropertiesBlessing(constructor) {
    const classes = readInheritableStaticArrayValues(constructor, "classes");
    return classes.reduce((properties, classDefinition) => {
      return Object.assign(properties, propertiesForClassDefinition(classDefinition));
    }, {});
  }
  function propertiesForClassDefinition(key) {
    return {
      [`${key}Class`]: {
        get() {
          const { classes } = this;
          if (classes.has(key)) {
            return classes.get(key);
          } else {
            const attribute = classes.getAttributeName(key);
            throw new Error(`Missing attribute "${attribute}"`);
          }
        }
      },
      [`${key}Classes`]: {
        get() {
          return this.classes.getAll(key);
        }
      },
      [`has${capitalize(key)}Class`]: {
        get() {
          return this.classes.has(key);
        }
      }
    };
  }
  function OutletPropertiesBlessing(constructor) {
    const outlets = readInheritableStaticArrayValues(constructor, "outlets");
    return outlets.reduce((properties, outletDefinition) => {
      return Object.assign(properties, propertiesForOutletDefinition(outletDefinition));
    }, {});
  }
  function getOutletController(controller, element, identifier2) {
    return controller.application.getControllerForElementAndIdentifier(element, identifier2);
  }
  function getControllerAndEnsureConnectedScope(controller, element, outletName) {
    let outletController = getOutletController(controller, element, outletName);
    if (outletController)
      return outletController;
    controller.application.router.proposeToConnectScopeForElementAndIdentifier(element, outletName);
    outletController = getOutletController(controller, element, outletName);
    if (outletController)
      return outletController;
  }
  function propertiesForOutletDefinition(name) {
    const camelizedName = namespaceCamelize(name);
    return {
      [`${camelizedName}Outlet`]: {
        get() {
          const outletElement = this.outlets.find(name);
          const selector = this.outlets.getSelectorForOutletName(name);
          if (outletElement) {
            const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
            if (outletController)
              return outletController;
            throw new Error(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`);
          }
          throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
        }
      },
      [`${camelizedName}Outlets`]: {
        get() {
          const outlets = this.outlets.findAll(name);
          if (outlets.length > 0) {
            return outlets.map((outletElement) => {
              const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
              if (outletController)
                return outletController;
              console.warn(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`, outletElement);
            }).filter((controller) => controller);
          }
          return [];
        }
      },
      [`${camelizedName}OutletElement`]: {
        get() {
          const outletElement = this.outlets.find(name);
          const selector = this.outlets.getSelectorForOutletName(name);
          if (outletElement) {
            return outletElement;
          } else {
            throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
          }
        }
      },
      [`${camelizedName}OutletElements`]: {
        get() {
          return this.outlets.findAll(name);
        }
      },
      [`has${capitalize(camelizedName)}Outlet`]: {
        get() {
          return this.outlets.has(name);
        }
      }
    };
  }
  function TargetPropertiesBlessing(constructor) {
    const targets = readInheritableStaticArrayValues(constructor, "targets");
    return targets.reduce((properties, targetDefinition) => {
      return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
    }, {});
  }
  function propertiesForTargetDefinition(name) {
    return {
      [`${name}Target`]: {
        get() {
          const target = this.targets.find(name);
          if (target) {
            return target;
          } else {
            throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
          }
        }
      },
      [`${name}Targets`]: {
        get() {
          return this.targets.findAll(name);
        }
      },
      [`has${capitalize(name)}Target`]: {
        get() {
          return this.targets.has(name);
        }
      }
    };
  }
  function ValuePropertiesBlessing(constructor) {
    const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
    const propertyDescriptorMap = {
      valueDescriptorMap: {
        get() {
          return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
            const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair, this.identifier);
            const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
            return Object.assign(result, { [attributeName]: valueDescriptor });
          }, {});
        }
      }
    };
    return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
      return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
    }, propertyDescriptorMap);
  }
  function propertiesForValueDefinitionPair(valueDefinitionPair, controller) {
    const definition = parseValueDefinitionPair(valueDefinitionPair, controller);
    const { key, name, reader: read, writer: write } = definition;
    return {
      [name]: {
        get() {
          const value = this.data.get(key);
          if (value !== null) {
            return read(value);
          } else {
            return definition.defaultValue;
          }
        },
        set(value) {
          if (value === void 0) {
            this.data.delete(key);
          } else {
            this.data.set(key, write(value));
          }
        }
      },
      [`has${capitalize(name)}`]: {
        get() {
          return this.data.has(key) || definition.hasCustomDefaultValue;
        }
      }
    };
  }
  function parseValueDefinitionPair([token, typeDefinition], controller) {
    return valueDescriptorForTokenAndTypeDefinition({
      controller,
      token,
      typeDefinition
    });
  }
  function parseValueTypeConstant(constant) {
    switch (constant) {
      case Array:
        return "array";
      case Boolean:
        return "boolean";
      case Number:
        return "number";
      case Object:
        return "object";
      case String:
        return "string";
    }
  }
  function parseValueTypeDefault(defaultValue) {
    switch (typeof defaultValue) {
      case "boolean":
        return "boolean";
      case "number":
        return "number";
      case "string":
        return "string";
    }
    if (Array.isArray(defaultValue))
      return "array";
    if (Object.prototype.toString.call(defaultValue) === "[object Object]")
      return "object";
  }
  function parseValueTypeObject(payload) {
    const { controller, token, typeObject } = payload;
    const hasType = isSomething(typeObject.type);
    const hasDefault = isSomething(typeObject.default);
    const fullObject = hasType && hasDefault;
    const onlyType = hasType && !hasDefault;
    const onlyDefault = !hasType && hasDefault;
    const typeFromObject = parseValueTypeConstant(typeObject.type);
    const typeFromDefaultValue = parseValueTypeDefault(payload.typeObject.default);
    if (onlyType)
      return typeFromObject;
    if (onlyDefault)
      return typeFromDefaultValue;
    if (typeFromObject !== typeFromDefaultValue) {
      const propertyPath = controller ? `${controller}.${token}` : token;
      throw new Error(`The specified default value for the Stimulus Value "${propertyPath}" must match the defined type "${typeFromObject}". The provided default value of "${typeObject.default}" is of type "${typeFromDefaultValue}".`);
    }
    if (fullObject)
      return typeFromObject;
  }
  function parseValueTypeDefinition(payload) {
    const { controller, token, typeDefinition } = payload;
    const typeObject = { controller, token, typeObject: typeDefinition };
    const typeFromObject = parseValueTypeObject(typeObject);
    const typeFromDefaultValue = parseValueTypeDefault(typeDefinition);
    const typeFromConstant = parseValueTypeConstant(typeDefinition);
    const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
    if (type)
      return type;
    const propertyPath = controller ? `${controller}.${typeDefinition}` : token;
    throw new Error(`Unknown value type "${propertyPath}" for "${token}" value`);
  }
  function defaultValueForDefinition(typeDefinition) {
    const constant = parseValueTypeConstant(typeDefinition);
    if (constant)
      return defaultValuesByType[constant];
    const hasDefault = hasProperty(typeDefinition, "default");
    const hasType = hasProperty(typeDefinition, "type");
    const typeObject = typeDefinition;
    if (hasDefault)
      return typeObject.default;
    if (hasType) {
      const { type } = typeObject;
      const constantFromType = parseValueTypeConstant(type);
      if (constantFromType)
        return defaultValuesByType[constantFromType];
    }
    return typeDefinition;
  }
  function valueDescriptorForTokenAndTypeDefinition(payload) {
    const { token, typeDefinition } = payload;
    const key = `${dasherize(token)}-value`;
    const type = parseValueTypeDefinition(payload);
    return {
      type,
      key,
      name: camelize(key),
      get defaultValue() {
        return defaultValueForDefinition(typeDefinition);
      },
      get hasCustomDefaultValue() {
        return parseValueTypeDefault(typeDefinition) !== void 0;
      },
      reader: readers[type],
      writer: writers[type] || writers.default
    };
  }
  var defaultValuesByType = {
    get array() {
      return [];
    },
    boolean: false,
    number: 0,
    get object() {
      return {};
    },
    string: ""
  };
  var readers = {
    array(value) {
      const array = JSON.parse(value);
      if (!Array.isArray(array)) {
        throw new TypeError(`expected value of type "array" but instead got value "${value}" of type "${parseValueTypeDefault(array)}"`);
      }
      return array;
    },
    boolean(value) {
      return !(value == "0" || String(value).toLowerCase() == "false");
    },
    number(value) {
      return Number(value.replace(/_/g, ""));
    },
    object(value) {
      const object = JSON.parse(value);
      if (object === null || typeof object != "object" || Array.isArray(object)) {
        throw new TypeError(`expected value of type "object" but instead got value "${value}" of type "${parseValueTypeDefault(object)}"`);
      }
      return object;
    },
    string(value) {
      return value;
    }
  };
  var writers = {
    default: writeString,
    array: writeJSON,
    object: writeJSON
  };
  function writeJSON(value) {
    return JSON.stringify(value);
  }
  function writeString(value) {
    return `${value}`;
  }
  var Controller = class {
    constructor(context) {
      this.context = context;
    }
    static get shouldLoad() {
      return true;
    }
    static afterLoad(_identifier, _application) {
      return;
    }
    get application() {
      return this.context.application;
    }
    get scope() {
      return this.context.scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get targets() {
      return this.scope.targets;
    }
    get outlets() {
      return this.scope.outlets;
    }
    get classes() {
      return this.scope.classes;
    }
    get data() {
      return this.scope.data;
    }
    initialize() {
    }
    connect() {
    }
    disconnect() {
    }
    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
      const type = prefix ? `${prefix}:${eventName}` : eventName;
      const event = new CustomEvent(type, { detail, bubbles, cancelable });
      target.dispatchEvent(event);
      return event;
    }
  };
  Controller.blessings = [
    ClassPropertiesBlessing,
    TargetPropertiesBlessing,
    ValuePropertiesBlessing,
    OutletPropertiesBlessing
  ];
  Controller.targets = [];
  Controller.outlets = [];
  Controller.values = {};

  // app/javascript/controllers/application.js
  var application = Application.start();
  application.debug = false;
  window.Stimulus = application;

  // node_modules/highlight.js/es/core.js
  var import_core = __toESM(require_core(), 1);
  var core_default = import_core.default;

  // node_modules/highlight.js/es/languages/sql.js
  function sql(hljs) {
    const regex = hljs.regex;
    const COMMENT_MODE = hljs.COMMENT("--", "$");
    const STRING2 = {
      className: "string",
      variants: [
        {
          begin: /'/,
          end: /'/,
          contains: [{ begin: /''/ }]
        }
      ]
    };
    const QUOTED_IDENTIFIER2 = {
      begin: /"/,
      end: /"/,
      contains: [{ begin: /""/ }]
    };
    const LITERALS = [
      "true",
      "false",
      // Not sure it's correct to call NULL literal, and clauses like IS [NOT] NULL look strange that way.
      // "null",
      "unknown"
    ];
    const MULTI_WORD_TYPES = [
      "double precision",
      "large object",
      "with timezone",
      "without timezone"
    ];
    const TYPES = [
      "bigint",
      "binary",
      "blob",
      "boolean",
      "char",
      "character",
      "clob",
      "date",
      "dec",
      "decfloat",
      "decimal",
      "float",
      "int",
      "integer",
      "interval",
      "nchar",
      "nclob",
      "national",
      "numeric",
      "real",
      "row",
      "smallint",
      "time",
      "timestamp",
      "varchar",
      "varying",
      // modifier (character varying)
      "varbinary"
    ];
    const NON_RESERVED_WORDS = [
      "add",
      "asc",
      "collation",
      "desc",
      "final",
      "first",
      "last",
      "view"
    ];
    const RESERVED_WORDS = [
      "abs",
      "acos",
      "all",
      "allocate",
      "alter",
      "and",
      "any",
      "are",
      "array",
      "array_agg",
      "array_max_cardinality",
      "as",
      "asensitive",
      "asin",
      "asymmetric",
      "at",
      "atan",
      "atomic",
      "authorization",
      "avg",
      "begin",
      "begin_frame",
      "begin_partition",
      "between",
      "bigint",
      "binary",
      "blob",
      "boolean",
      "both",
      "by",
      "call",
      "called",
      "cardinality",
      "cascaded",
      "case",
      "cast",
      "ceil",
      "ceiling",
      "char",
      "char_length",
      "character",
      "character_length",
      "check",
      "classifier",
      "clob",
      "close",
      "coalesce",
      "collate",
      "collect",
      "column",
      "commit",
      "condition",
      "connect",
      "constraint",
      "contains",
      "convert",
      "copy",
      "corr",
      "corresponding",
      "cos",
      "cosh",
      "count",
      "covar_pop",
      "covar_samp",
      "create",
      "cross",
      "cube",
      "cume_dist",
      "current",
      "current_catalog",
      "current_date",
      "current_default_transform_group",
      "current_path",
      "current_role",
      "current_row",
      "current_schema",
      "current_time",
      "current_timestamp",
      "current_path",
      "current_role",
      "current_transform_group_for_type",
      "current_user",
      "cursor",
      "cycle",
      "date",
      "day",
      "deallocate",
      "dec",
      "decimal",
      "decfloat",
      "declare",
      "default",
      "define",
      "delete",
      "dense_rank",
      "deref",
      "describe",
      "deterministic",
      "disconnect",
      "distinct",
      "double",
      "drop",
      "dynamic",
      "each",
      "element",
      "else",
      "empty",
      "end",
      "end_frame",
      "end_partition",
      "end-exec",
      "equals",
      "escape",
      "every",
      "except",
      "exec",
      "execute",
      "exists",
      "exp",
      "external",
      "extract",
      "false",
      "fetch",
      "filter",
      "first_value",
      "float",
      "floor",
      "for",
      "foreign",
      "frame_row",
      "free",
      "from",
      "full",
      "function",
      "fusion",
      "get",
      "global",
      "grant",
      "group",
      "grouping",
      "groups",
      "having",
      "hold",
      "hour",
      "identity",
      "in",
      "indicator",
      "initial",
      "inner",
      "inout",
      "insensitive",
      "insert",
      "int",
      "integer",
      "intersect",
      "intersection",
      "interval",
      "into",
      "is",
      "join",
      "json_array",
      "json_arrayagg",
      "json_exists",
      "json_object",
      "json_objectagg",
      "json_query",
      "json_table",
      "json_table_primitive",
      "json_value",
      "lag",
      "language",
      "large",
      "last_value",
      "lateral",
      "lead",
      "leading",
      "left",
      "like",
      "like_regex",
      "listagg",
      "ln",
      "local",
      "localtime",
      "localtimestamp",
      "log",
      "log10",
      "lower",
      "match",
      "match_number",
      "match_recognize",
      "matches",
      "max",
      "member",
      "merge",
      "method",
      "min",
      "minute",
      "mod",
      "modifies",
      "module",
      "month",
      "multiset",
      "national",
      "natural",
      "nchar",
      "nclob",
      "new",
      "no",
      "none",
      "normalize",
      "not",
      "nth_value",
      "ntile",
      "null",
      "nullif",
      "numeric",
      "octet_length",
      "occurrences_regex",
      "of",
      "offset",
      "old",
      "omit",
      "on",
      "one",
      "only",
      "open",
      "or",
      "order",
      "out",
      "outer",
      "over",
      "overlaps",
      "overlay",
      "parameter",
      "partition",
      "pattern",
      "per",
      "percent",
      "percent_rank",
      "percentile_cont",
      "percentile_disc",
      "period",
      "portion",
      "position",
      "position_regex",
      "power",
      "precedes",
      "precision",
      "prepare",
      "primary",
      "procedure",
      "ptf",
      "range",
      "rank",
      "reads",
      "real",
      "recursive",
      "ref",
      "references",
      "referencing",
      "regr_avgx",
      "regr_avgy",
      "regr_count",
      "regr_intercept",
      "regr_r2",
      "regr_slope",
      "regr_sxx",
      "regr_sxy",
      "regr_syy",
      "release",
      "result",
      "return",
      "returns",
      "revoke",
      "right",
      "rollback",
      "rollup",
      "row",
      "row_number",
      "rows",
      "running",
      "savepoint",
      "scope",
      "scroll",
      "search",
      "second",
      "seek",
      "select",
      "sensitive",
      "session_user",
      "set",
      "show",
      "similar",
      "sin",
      "sinh",
      "skip",
      "smallint",
      "some",
      "specific",
      "specifictype",
      "sql",
      "sqlexception",
      "sqlstate",
      "sqlwarning",
      "sqrt",
      "start",
      "static",
      "stddev_pop",
      "stddev_samp",
      "submultiset",
      "subset",
      "substring",
      "substring_regex",
      "succeeds",
      "sum",
      "symmetric",
      "system",
      "system_time",
      "system_user",
      "table",
      "tablesample",
      "tan",
      "tanh",
      "then",
      "time",
      "timestamp",
      "timezone_hour",
      "timezone_minute",
      "to",
      "trailing",
      "translate",
      "translate_regex",
      "translation",
      "treat",
      "trigger",
      "trim",
      "trim_array",
      "true",
      "truncate",
      "uescape",
      "union",
      "unique",
      "unknown",
      "unnest",
      "update",
      "upper",
      "user",
      "using",
      "value",
      "values",
      "value_of",
      "var_pop",
      "var_samp",
      "varbinary",
      "varchar",
      "varying",
      "versioning",
      "when",
      "whenever",
      "where",
      "width_bucket",
      "window",
      "with",
      "within",
      "without",
      "year"
    ];
    const RESERVED_FUNCTIONS = [
      "abs",
      "acos",
      "array_agg",
      "asin",
      "atan",
      "avg",
      "cast",
      "ceil",
      "ceiling",
      "coalesce",
      "corr",
      "cos",
      "cosh",
      "count",
      "covar_pop",
      "covar_samp",
      "cume_dist",
      "dense_rank",
      "deref",
      "element",
      "exp",
      "extract",
      "first_value",
      "floor",
      "json_array",
      "json_arrayagg",
      "json_exists",
      "json_object",
      "json_objectagg",
      "json_query",
      "json_table",
      "json_table_primitive",
      "json_value",
      "lag",
      "last_value",
      "lead",
      "listagg",
      "ln",
      "log",
      "log10",
      "lower",
      "max",
      "min",
      "mod",
      "nth_value",
      "ntile",
      "nullif",
      "percent_rank",
      "percentile_cont",
      "percentile_disc",
      "position",
      "position_regex",
      "power",
      "rank",
      "regr_avgx",
      "regr_avgy",
      "regr_count",
      "regr_intercept",
      "regr_r2",
      "regr_slope",
      "regr_sxx",
      "regr_sxy",
      "regr_syy",
      "row_number",
      "sin",
      "sinh",
      "sqrt",
      "stddev_pop",
      "stddev_samp",
      "substring",
      "substring_regex",
      "sum",
      "tan",
      "tanh",
      "translate",
      "translate_regex",
      "treat",
      "trim",
      "trim_array",
      "unnest",
      "upper",
      "value_of",
      "var_pop",
      "var_samp",
      "width_bucket"
    ];
    const POSSIBLE_WITHOUT_PARENS = [
      "current_catalog",
      "current_date",
      "current_default_transform_group",
      "current_path",
      "current_role",
      "current_schema",
      "current_transform_group_for_type",
      "current_user",
      "session_user",
      "system_time",
      "system_user",
      "current_time",
      "localtime",
      "current_timestamp",
      "localtimestamp"
    ];
    const COMBOS = [
      "create table",
      "insert into",
      "primary key",
      "foreign key",
      "not null",
      "alter table",
      "add constraint",
      "grouping sets",
      "on overflow",
      "character set",
      "respect nulls",
      "ignore nulls",
      "nulls first",
      "nulls last",
      "depth first",
      "breadth first"
    ];
    const FUNCTIONS = RESERVED_FUNCTIONS;
    const KEYWORDS = [
      ...RESERVED_WORDS,
      ...NON_RESERVED_WORDS
    ].filter((keyword) => {
      return !RESERVED_FUNCTIONS.includes(keyword);
    });
    const VARIABLE2 = {
      className: "variable",
      begin: /@[a-z0-9][a-z0-9_]*/
    };
    const OPERATOR2 = {
      className: "operator",
      begin: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
      relevance: 0
    };
    const FUNCTION_CALL = {
      begin: regex.concat(/\b/, regex.either(...FUNCTIONS), /\s*\(/),
      relevance: 0,
      keywords: { built_in: FUNCTIONS }
    };
    function reduceRelevancy(list, {
      exceptions,
      when
    } = {}) {
      const qualifyFn = when;
      exceptions = exceptions || [];
      return list.map((item) => {
        if (item.match(/\|\d+$/) || exceptions.includes(item)) {
          return item;
        } else if (qualifyFn(item)) {
          return `${item}|0`;
        } else {
          return item;
        }
      });
    }
    return {
      name: "SQL",
      case_insensitive: true,
      // does not include {} or HTML tags `</`
      illegal: /[{}]|<\//,
      keywords: {
        $pattern: /\b[\w\.]+/,
        keyword: reduceRelevancy(KEYWORDS, { when: (x) => x.length < 3 }),
        literal: LITERALS,
        type: TYPES,
        built_in: POSSIBLE_WITHOUT_PARENS
      },
      contains: [
        {
          begin: regex.either(...COMBOS),
          relevance: 0,
          keywords: {
            $pattern: /[\w\.]+/,
            keyword: KEYWORDS.concat(COMBOS),
            literal: LITERALS,
            type: TYPES
          }
        },
        {
          className: "type",
          begin: regex.either(...MULTI_WORD_TYPES)
        },
        FUNCTION_CALL,
        VARIABLE2,
        STRING2,
        QUOTED_IDENTIFIER2,
        hljs.C_NUMBER_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        COMMENT_MODE,
        OPERATOR2
      ]
    };
  }

  // node_modules/sql-formatter/dist/index.js
  var import_nearley = __toESM(require_nearley(), 1);
  var __defProp2 = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp2.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp2.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var allDialects_exports = {};
  __export2(allDialects_exports, {
    bigquery: () => bigquery,
    db2: () => db2,
    db2i: () => db2i,
    hive: () => hive,
    mariadb: () => mariadb,
    mysql: () => mysql,
    n1ql: () => n1ql,
    plsql: () => plsql,
    postgresql: () => postgresql,
    redshift: () => redshift,
    singlestoredb: () => singlestoredb,
    snowflake: () => snowflake,
    spark: () => spark,
    sql: () => sql2,
    sqlite: () => sqlite,
    tidb: () => tidb,
    transactsql: () => transactsql,
    trino: () => trino
  });
  var expandPhrases = (phrases) => phrases.flatMap(expandSinglePhrase);
  var expandSinglePhrase = (phrase) => buildCombinations(parsePhrase(phrase)).map(stripExtraWhitespace);
  var stripExtraWhitespace = (text) => text.replace(/ +/g, " ").trim();
  var parsePhrase = (text) => ({
    type: "mandatory_block",
    items: parseAlteration(text, 0)[0]
  });
  var parseAlteration = (text, index, expectClosing) => {
    const alterations = [];
    while (text[index]) {
      const [term, newIndex] = parseConcatenation(text, index);
      alterations.push(term);
      index = newIndex;
      if (text[index] === "|") {
        index++;
      } else if (text[index] === "}" || text[index] === "]") {
        if (expectClosing !== text[index]) {
          throw new Error(`Unbalanced parenthesis in: ${text}`);
        }
        index++;
        return [alterations, index];
      } else if (index === text.length) {
        if (expectClosing) {
          throw new Error(`Unbalanced parenthesis in: ${text}`);
        }
        return [alterations, index];
      } else {
        throw new Error(`Unexpected "${text[index]}"`);
      }
    }
    return [alterations, index];
  };
  var parseConcatenation = (text, index) => {
    const items = [];
    while (true) {
      const [term, newIndex] = parseTerm(text, index);
      if (term) {
        items.push(term);
        index = newIndex;
      } else {
        break;
      }
    }
    return items.length === 1 ? [items[0], index] : [{ type: "concatenation", items }, index];
  };
  var parseTerm = (text, index) => {
    if (text[index] === "{") {
      return parseMandatoryBlock(text, index + 1);
    } else if (text[index] === "[") {
      return parseOptionalBlock(text, index + 1);
    } else {
      let word = "";
      while (text[index] && /[A-Za-z0-9_ ]/.test(text[index])) {
        word += text[index];
        index++;
      }
      return [word, index];
    }
  };
  var parseMandatoryBlock = (text, index) => {
    const [items, newIndex] = parseAlteration(text, index, "}");
    return [{ type: "mandatory_block", items }, newIndex];
  };
  var parseOptionalBlock = (text, index) => {
    const [items, newIndex] = parseAlteration(text, index, "]");
    return [{ type: "optional_block", items }, newIndex];
  };
  var buildCombinations = (node) => {
    if (typeof node === "string") {
      return [node];
    } else if (node.type === "concatenation") {
      return node.items.map(buildCombinations).reduce(stringCombinations, [""]);
    } else if (node.type === "mandatory_block") {
      return node.items.flatMap(buildCombinations);
    } else if (node.type === "optional_block") {
      return ["", ...node.items.flatMap(buildCombinations)];
    } else {
      throw new Error(`Unknown node type: ${node}`);
    }
  };
  var stringCombinations = (xs, ys) => {
    const results = [];
    for (const x of xs) {
      for (const y of ys) {
        results.push(x + y);
      }
    }
    return results;
  };
  var TokenType = /* @__PURE__ */ ((TokenType2) => {
    TokenType2["QUOTED_IDENTIFIER"] = "QUOTED_IDENTIFIER";
    TokenType2["IDENTIFIER"] = "IDENTIFIER";
    TokenType2["STRING"] = "STRING";
    TokenType2["VARIABLE"] = "VARIABLE";
    TokenType2["RESERVED_DATA_TYPE"] = "RESERVED_DATA_TYPE";
    TokenType2["RESERVED_PARAMETERIZED_DATA_TYPE"] = "RESERVED_PARAMETERIZED_DATA_TYPE";
    TokenType2["RESERVED_KEYWORD"] = "RESERVED_KEYWORD";
    TokenType2["RESERVED_FUNCTION_NAME"] = "RESERVED_FUNCTION_NAME";
    TokenType2["RESERVED_PHRASE"] = "RESERVED_PHRASE";
    TokenType2["RESERVED_SET_OPERATION"] = "RESERVED_SET_OPERATION";
    TokenType2["RESERVED_CLAUSE"] = "RESERVED_CLAUSE";
    TokenType2["RESERVED_SELECT"] = "RESERVED_SELECT";
    TokenType2["RESERVED_JOIN"] = "RESERVED_JOIN";
    TokenType2["ARRAY_IDENTIFIER"] = "ARRAY_IDENTIFIER";
    TokenType2["ARRAY_KEYWORD"] = "ARRAY_KEYWORD";
    TokenType2["CASE"] = "CASE";
    TokenType2["END"] = "END";
    TokenType2["WHEN"] = "WHEN";
    TokenType2["ELSE"] = "ELSE";
    TokenType2["THEN"] = "THEN";
    TokenType2["LIMIT"] = "LIMIT";
    TokenType2["BETWEEN"] = "BETWEEN";
    TokenType2["AND"] = "AND";
    TokenType2["OR"] = "OR";
    TokenType2["XOR"] = "XOR";
    TokenType2["OPERATOR"] = "OPERATOR";
    TokenType2["COMMA"] = "COMMA";
    TokenType2["ASTERISK"] = "ASTERISK";
    TokenType2["PROPERTY_ACCESS_OPERATOR"] = "PROPERTY_ACCESS_OPERATOR";
    TokenType2["OPEN_PAREN"] = "OPEN_PAREN";
    TokenType2["CLOSE_PAREN"] = "CLOSE_PAREN";
    TokenType2["LINE_COMMENT"] = "LINE_COMMENT";
    TokenType2["BLOCK_COMMENT"] = "BLOCK_COMMENT";
    TokenType2["DISABLE_COMMENT"] = "DISABLE_COMMENT";
    TokenType2["NUMBER"] = "NUMBER";
    TokenType2["NAMED_PARAMETER"] = "NAMED_PARAMETER";
    TokenType2["QUOTED_PARAMETER"] = "QUOTED_PARAMETER";
    TokenType2["NUMBERED_PARAMETER"] = "NUMBERED_PARAMETER";
    TokenType2["POSITIONAL_PARAMETER"] = "POSITIONAL_PARAMETER";
    TokenType2["CUSTOM_PARAMETER"] = "CUSTOM_PARAMETER";
    TokenType2["DELIMITER"] = "DELIMITER";
    TokenType2["EOF"] = "EOF";
    return TokenType2;
  })(TokenType || {});
  var createEofToken = (index) => ({
    type: "EOF",
    raw: "\xABEOF\xBB",
    text: "\xABEOF\xBB",
    start: index
  });
  var EOF_TOKEN = createEofToken(Infinity);
  var testToken = (compareToken) => (token) => token.type === compareToken.type && token.text === compareToken.text;
  var isToken = {
    ARRAY: testToken({
      text: "ARRAY",
      type: "RESERVED_DATA_TYPE"
      /* RESERVED_DATA_TYPE */
    }),
    BY: testToken({
      text: "BY",
      type: "RESERVED_KEYWORD"
      /* RESERVED_KEYWORD */
    }),
    SET: testToken({
      text: "SET",
      type: "RESERVED_CLAUSE"
      /* RESERVED_CLAUSE */
    }),
    STRUCT: testToken({
      text: "STRUCT",
      type: "RESERVED_DATA_TYPE"
      /* RESERVED_DATA_TYPE */
    }),
    WINDOW: testToken({
      text: "WINDOW",
      type: "RESERVED_CLAUSE"
      /* RESERVED_CLAUSE */
    }),
    VALUES: testToken({
      text: "VALUES",
      type: "RESERVED_CLAUSE"
      /* RESERVED_CLAUSE */
    })
  };
  var isReserved = (type) => type === "RESERVED_DATA_TYPE" || type === "RESERVED_KEYWORD" || type === "RESERVED_FUNCTION_NAME" || type === "RESERVED_PHRASE" || type === "RESERVED_CLAUSE" || type === "RESERVED_SELECT" || type === "RESERVED_SET_OPERATION" || type === "RESERVED_JOIN" || type === "ARRAY_KEYWORD" || type === "CASE" || type === "END" || type === "WHEN" || type === "ELSE" || type === "THEN" || type === "LIMIT" || type === "BETWEEN" || type === "AND" || type === "OR" || type === "XOR";
  var isLogicalOperator = (type) => type === "AND" || type === "OR" || type === "XOR";
  var functions = [
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/aead_encryption_functions
    "KEYS.NEW_KEYSET",
    "KEYS.ADD_KEY_FROM_RAW_BYTES",
    "AEAD.DECRYPT_BYTES",
    "AEAD.DECRYPT_STRING",
    "AEAD.ENCRYPT",
    "KEYS.KEYSET_CHAIN",
    "KEYS.KEYSET_FROM_JSON",
    "KEYS.KEYSET_TO_JSON",
    "KEYS.ROTATE_KEYSET",
    "KEYS.KEYSET_LENGTH",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/aggregate_analytic_functions
    "ANY_VALUE",
    "ARRAY_AGG",
    "AVG",
    "CORR",
    "COUNT",
    "COUNTIF",
    "COVAR_POP",
    "COVAR_SAMP",
    "MAX",
    "MIN",
    "ST_CLUSTERDBSCAN",
    "STDDEV_POP",
    "STDDEV_SAMP",
    "STRING_AGG",
    "SUM",
    "VAR_POP",
    "VAR_SAMP",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/aggregate_functions
    "ANY_VALUE",
    "ARRAY_AGG",
    "ARRAY_CONCAT_AGG",
    "AVG",
    "BIT_AND",
    "BIT_OR",
    "BIT_XOR",
    "COUNT",
    "COUNTIF",
    "LOGICAL_AND",
    "LOGICAL_OR",
    "MAX",
    "MIN",
    "STRING_AGG",
    "SUM",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/approximate_aggregate_functions
    "APPROX_COUNT_DISTINCT",
    "APPROX_QUANTILES",
    "APPROX_TOP_COUNT",
    "APPROX_TOP_SUM",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/array_functions
    // 'ARRAY',
    "ARRAY_CONCAT",
    "ARRAY_LENGTH",
    "ARRAY_TO_STRING",
    "GENERATE_ARRAY",
    "GENERATE_DATE_ARRAY",
    "GENERATE_TIMESTAMP_ARRAY",
    "ARRAY_REVERSE",
    "OFFSET",
    "SAFE_OFFSET",
    "ORDINAL",
    "SAFE_ORDINAL",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/bit_functions
    "BIT_COUNT",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/conversion_functions
    // 'CASE',
    "PARSE_BIGNUMERIC",
    "PARSE_NUMERIC",
    "SAFE_CAST",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/date_functions
    "CURRENT_DATE",
    "EXTRACT",
    "DATE",
    "DATE_ADD",
    "DATE_SUB",
    "DATE_DIFF",
    "DATE_TRUNC",
    "DATE_FROM_UNIX_DATE",
    "FORMAT_DATE",
    "LAST_DAY",
    "PARSE_DATE",
    "UNIX_DATE",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/datetime_functions
    "CURRENT_DATETIME",
    "DATETIME",
    "EXTRACT",
    "DATETIME_ADD",
    "DATETIME_SUB",
    "DATETIME_DIFF",
    "DATETIME_TRUNC",
    "FORMAT_DATETIME",
    "LAST_DAY",
    "PARSE_DATETIME",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/debugging_functions
    "ERROR",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/federated_query_functions
    "EXTERNAL_QUERY",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/geography_functions
    "S2_CELLIDFROMPOINT",
    "S2_COVERINGCELLIDS",
    "ST_ANGLE",
    "ST_AREA",
    "ST_ASBINARY",
    "ST_ASGEOJSON",
    "ST_ASTEXT",
    "ST_AZIMUTH",
    "ST_BOUNDARY",
    "ST_BOUNDINGBOX",
    "ST_BUFFER",
    "ST_BUFFERWITHTOLERANCE",
    "ST_CENTROID",
    "ST_CENTROID_AGG",
    "ST_CLOSESTPOINT",
    "ST_CLUSTERDBSCAN",
    "ST_CONTAINS",
    "ST_CONVEXHULL",
    "ST_COVEREDBY",
    "ST_COVERS",
    "ST_DIFFERENCE",
    "ST_DIMENSION",
    "ST_DISJOINT",
    "ST_DISTANCE",
    "ST_DUMP",
    "ST_DWITHIN",
    "ST_ENDPOINT",
    "ST_EQUALS",
    "ST_EXTENT",
    "ST_EXTERIORRING",
    "ST_GEOGFROM",
    "ST_GEOGFROMGEOJSON",
    "ST_GEOGFROMTEXT",
    "ST_GEOGFROMWKB",
    "ST_GEOGPOINT",
    "ST_GEOGPOINTFROMGEOHASH",
    "ST_GEOHASH",
    "ST_GEOMETRYTYPE",
    "ST_INTERIORRINGS",
    "ST_INTERSECTION",
    "ST_INTERSECTS",
    "ST_INTERSECTSBOX",
    "ST_ISCOLLECTION",
    "ST_ISEMPTY",
    "ST_LENGTH",
    "ST_MAKELINE",
    "ST_MAKEPOLYGON",
    "ST_MAKEPOLYGONORIENTED",
    "ST_MAXDISTANCE",
    "ST_NPOINTS",
    "ST_NUMGEOMETRIES",
    "ST_NUMPOINTS",
    "ST_PERIMETER",
    "ST_POINTN",
    "ST_SIMPLIFY",
    "ST_SNAPTOGRID",
    "ST_STARTPOINT",
    "ST_TOUCHES",
    "ST_UNION",
    "ST_UNION_AGG",
    "ST_WITHIN",
    "ST_X",
    "ST_Y",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/hash_functions
    "FARM_FINGERPRINT",
    "MD5",
    "SHA1",
    "SHA256",
    "SHA512",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/hll_functions
    "HLL_COUNT.INIT",
    "HLL_COUNT.MERGE",
    "HLL_COUNT.MERGE_PARTIAL",
    "HLL_COUNT.EXTRACT",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/interval_functions
    "MAKE_INTERVAL",
    "EXTRACT",
    "JUSTIFY_DAYS",
    "JUSTIFY_HOURS",
    "JUSTIFY_INTERVAL",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/json_functions
    "JSON_EXTRACT",
    "JSON_QUERY",
    "JSON_EXTRACT_SCALAR",
    "JSON_VALUE",
    "JSON_EXTRACT_ARRAY",
    "JSON_QUERY_ARRAY",
    "JSON_EXTRACT_STRING_ARRAY",
    "JSON_VALUE_ARRAY",
    "TO_JSON_STRING",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/mathematical_functions
    "ABS",
    "SIGN",
    "IS_INF",
    "IS_NAN",
    "IEEE_DIVIDE",
    "RAND",
    "SQRT",
    "POW",
    "POWER",
    "EXP",
    "LN",
    "LOG",
    "LOG10",
    "GREATEST",
    "LEAST",
    "DIV",
    "SAFE_DIVIDE",
    "SAFE_MULTIPLY",
    "SAFE_NEGATE",
    "SAFE_ADD",
    "SAFE_SUBTRACT",
    "MOD",
    "ROUND",
    "TRUNC",
    "CEIL",
    "CEILING",
    "FLOOR",
    "COS",
    "COSH",
    "ACOS",
    "ACOSH",
    "SIN",
    "SINH",
    "ASIN",
    "ASINH",
    "TAN",
    "TANH",
    "ATAN",
    "ATANH",
    "ATAN2",
    "RANGE_BUCKET",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/navigation_functions
    "FIRST_VALUE",
    "LAST_VALUE",
    "NTH_VALUE",
    "LEAD",
    "LAG",
    "PERCENTILE_CONT",
    "PERCENTILE_DISC",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/net_functions
    "NET.IP_FROM_STRING",
    "NET.SAFE_IP_FROM_STRING",
    "NET.IP_TO_STRING",
    "NET.IP_NET_MASK",
    "NET.IP_TRUNC",
    "NET.IPV4_FROM_INT64",
    "NET.IPV4_TO_INT64",
    "NET.HOST",
    "NET.PUBLIC_SUFFIX",
    "NET.REG_DOMAIN",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/numbering_functions
    "RANK",
    "DENSE_RANK",
    "PERCENT_RANK",
    "CUME_DIST",
    "NTILE",
    "ROW_NUMBER",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/security_functions
    "SESSION_USER",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/statistical_aggregate_functions
    "CORR",
    "COVAR_POP",
    "COVAR_SAMP",
    "STDDEV_POP",
    "STDDEV_SAMP",
    "STDDEV",
    "VAR_POP",
    "VAR_SAMP",
    "VARIANCE",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/string_functions
    "ASCII",
    "BYTE_LENGTH",
    "CHAR_LENGTH",
    "CHARACTER_LENGTH",
    "CHR",
    "CODE_POINTS_TO_BYTES",
    "CODE_POINTS_TO_STRING",
    "CONCAT",
    "CONTAINS_SUBSTR",
    "ENDS_WITH",
    "FORMAT",
    "FROM_BASE32",
    "FROM_BASE64",
    "FROM_HEX",
    "INITCAP",
    "INSTR",
    "LEFT",
    "LENGTH",
    "LPAD",
    "LOWER",
    "LTRIM",
    "NORMALIZE",
    "NORMALIZE_AND_CASEFOLD",
    "OCTET_LENGTH",
    "REGEXP_CONTAINS",
    "REGEXP_EXTRACT",
    "REGEXP_EXTRACT_ALL",
    "REGEXP_INSTR",
    "REGEXP_REPLACE",
    "REGEXP_SUBSTR",
    "REPLACE",
    "REPEAT",
    "REVERSE",
    "RIGHT",
    "RPAD",
    "RTRIM",
    "SAFE_CONVERT_BYTES_TO_STRING",
    "SOUNDEX",
    "SPLIT",
    "STARTS_WITH",
    "STRPOS",
    "SUBSTR",
    "SUBSTRING",
    "TO_BASE32",
    "TO_BASE64",
    "TO_CODE_POINTS",
    "TO_HEX",
    "TRANSLATE",
    "TRIM",
    "UNICODE",
    "UPPER",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/time_functions
    "CURRENT_TIME",
    "TIME",
    "EXTRACT",
    "TIME_ADD",
    "TIME_SUB",
    "TIME_DIFF",
    "TIME_TRUNC",
    "FORMAT_TIME",
    "PARSE_TIME",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/timestamp_functions
    "CURRENT_TIMESTAMP",
    "EXTRACT",
    "STRING",
    "TIMESTAMP",
    "TIMESTAMP_ADD",
    "TIMESTAMP_SUB",
    "TIMESTAMP_DIFF",
    "TIMESTAMP_TRUNC",
    "FORMAT_TIMESTAMP",
    "PARSE_TIMESTAMP",
    "TIMESTAMP_SECONDS",
    "TIMESTAMP_MILLIS",
    "TIMESTAMP_MICROS",
    "UNIX_SECONDS",
    "UNIX_MILLIS",
    "UNIX_MICROS",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/uuid_functions
    "GENERATE_UUID",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/conditional_expressions
    "COALESCE",
    "IF",
    "IFNULL",
    "NULLIF",
    // https://cloud.google.com/bigquery/docs/reference/legacy-sql
    // legacyAggregate
    "AVG",
    "BIT_AND",
    "BIT_OR",
    "BIT_XOR",
    "CORR",
    "COUNT",
    "COVAR_POP",
    "COVAR_SAMP",
    "EXACT_COUNT_DISTINCT",
    "FIRST",
    "GROUP_CONCAT",
    "GROUP_CONCAT_UNQUOTED",
    "LAST",
    "MAX",
    "MIN",
    "NEST",
    "NTH",
    "QUANTILES",
    "STDDEV",
    "STDDEV_POP",
    "STDDEV_SAMP",
    "SUM",
    "TOP",
    "UNIQUE",
    "VARIANCE",
    "VAR_POP",
    "VAR_SAMP",
    // legacyBitwise
    "BIT_COUNT",
    // legacyCasting
    "BOOLEAN",
    "BYTES",
    "CAST",
    "FLOAT",
    "HEX_STRING",
    "INTEGER",
    "STRING",
    // legacyComparison
    // expr 'IN',
    "COALESCE",
    "GREATEST",
    "IFNULL",
    "IS_INF",
    "IS_NAN",
    "IS_EXPLICITLY_DEFINED",
    "LEAST",
    "NVL",
    // legacyDatetime
    "CURRENT_DATE",
    "CURRENT_TIME",
    "CURRENT_TIMESTAMP",
    "DATE",
    "DATE_ADD",
    "DATEDIFF",
    "DAY",
    "DAYOFWEEK",
    "DAYOFYEAR",
    "FORMAT_UTC_USEC",
    "HOUR",
    "MINUTE",
    "MONTH",
    "MSEC_TO_TIMESTAMP",
    "NOW",
    "PARSE_UTC_USEC",
    "QUARTER",
    "SEC_TO_TIMESTAMP",
    "SECOND",
    "STRFTIME_UTC_USEC",
    "TIME",
    "TIMESTAMP",
    "TIMESTAMP_TO_MSEC",
    "TIMESTAMP_TO_SEC",
    "TIMESTAMP_TO_USEC",
    "USEC_TO_TIMESTAMP",
    "UTC_USEC_TO_DAY",
    "UTC_USEC_TO_HOUR",
    "UTC_USEC_TO_MONTH",
    "UTC_USEC_TO_WEEK",
    "UTC_USEC_TO_YEAR",
    "WEEK",
    "YEAR",
    // legacyIp
    "FORMAT_IP",
    "PARSE_IP",
    "FORMAT_PACKED_IP",
    "PARSE_PACKED_IP",
    // legacyJson
    "JSON_EXTRACT",
    "JSON_EXTRACT_SCALAR",
    // legacyMath
    "ABS",
    "ACOS",
    "ACOSH",
    "ASIN",
    "ASINH",
    "ATAN",
    "ATANH",
    "ATAN2",
    "CEIL",
    "COS",
    "COSH",
    "DEGREES",
    "EXP",
    "FLOOR",
    "LN",
    "LOG",
    "LOG2",
    "LOG10",
    "PI",
    "POW",
    "RADIANS",
    "RAND",
    "ROUND",
    "SIN",
    "SINH",
    "SQRT",
    "TAN",
    "TANH",
    // legacyRegex
    "REGEXP_MATCH",
    "REGEXP_EXTRACT",
    "REGEXP_REPLACE",
    // legacyString
    "CONCAT",
    // expr CONTAINS 'str'
    "INSTR",
    "LEFT",
    "LENGTH",
    "LOWER",
    "LPAD",
    "LTRIM",
    "REPLACE",
    "RIGHT",
    "RPAD",
    "RTRIM",
    "SPLIT",
    "SUBSTR",
    "UPPER",
    // legacyTableWildcard
    "TABLE_DATE_RANGE",
    "TABLE_DATE_RANGE_STRICT",
    "TABLE_QUERY",
    // legacyUrl
    "HOST",
    "DOMAIN",
    "TLD",
    // legacyWindow
    "AVG",
    "COUNT",
    "MAX",
    "MIN",
    "STDDEV",
    "SUM",
    "CUME_DIST",
    "DENSE_RANK",
    "FIRST_VALUE",
    "LAG",
    "LAST_VALUE",
    "LEAD",
    "NTH_VALUE",
    "NTILE",
    "PERCENT_RANK",
    "PERCENTILE_CONT",
    "PERCENTILE_DISC",
    "RANK",
    "RATIO_TO_REPORT",
    "ROW_NUMBER",
    // legacyMisc
    "CURRENT_USER",
    "EVERY",
    "FROM_BASE64",
    "HASH",
    "FARM_FINGERPRINT",
    "IF",
    "POSITION",
    "SHA1",
    "SOME",
    "TO_BASE64",
    // other
    "BQ.JOBS.CANCEL",
    "BQ.REFRESH_MATERIALIZED_VIEW",
    // ddl
    "OPTIONS",
    // pivot
    "PIVOT",
    "UNPIVOT"
  ];
  var keywords = [
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/lexical#reserved_keywords
    "ALL",
    "AND",
    "ANY",
    "AS",
    "ASC",
    "ASSERT_ROWS_MODIFIED",
    "AT",
    "BETWEEN",
    "BY",
    "CASE",
    "CAST",
    "COLLATE",
    "CONTAINS",
    "CREATE",
    "CROSS",
    "CUBE",
    "CURRENT",
    "DEFAULT",
    "DEFINE",
    "DESC",
    "DISTINCT",
    "ELSE",
    "END",
    "ENUM",
    "ESCAPE",
    "EXCEPT",
    "EXCLUDE",
    "EXISTS",
    "EXTRACT",
    "FALSE",
    "FETCH",
    "FOLLOWING",
    "FOR",
    "FROM",
    "FULL",
    "GROUP",
    "GROUPING",
    "GROUPS",
    "HASH",
    "HAVING",
    "IF",
    "IGNORE",
    "IN",
    "INNER",
    "INTERSECT",
    "INTO",
    "IS",
    "JOIN",
    "LATERAL",
    "LEFT",
    "LIMIT",
    "LOOKUP",
    "MERGE",
    "NATURAL",
    "NEW",
    "NO",
    "NOT",
    "NULL",
    "NULLS",
    "OF",
    "ON",
    "OR",
    "ORDER",
    "OUTER",
    "OVER",
    "PARTITION",
    "PRECEDING",
    "PROTO",
    "RANGE",
    "RECURSIVE",
    "RESPECT",
    "RIGHT",
    "ROLLUP",
    "ROWS",
    "SELECT",
    "SET",
    "SOME",
    "TABLE",
    "TABLESAMPLE",
    "THEN",
    "TO",
    "TREAT",
    "TRUE",
    "UNBOUNDED",
    "UNION",
    "UNNEST",
    "USING",
    "WHEN",
    "WHERE",
    "WINDOW",
    "WITH",
    "WITHIN",
    // misc
    "SAFE",
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language
    "LIKE",
    // CREATE TABLE LIKE
    "COPY",
    // CREATE TABLE COPY
    "CLONE",
    // CREATE TABLE CLONE
    "IN",
    "OUT",
    "INOUT",
    "RETURNS",
    "LANGUAGE",
    "CASCADE",
    "RESTRICT",
    "DETERMINISTIC"
  ];
  var dataTypes = [
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types
    "ARRAY",
    // parametric, ARRAY<T>
    "BOOL",
    "BYTES",
    // parameterised, BYTES(Length)
    "DATE",
    "DATETIME",
    "GEOGRAPHY",
    "INTERVAL",
    "INT64",
    "INT",
    "SMALLINT",
    "INTEGER",
    "BIGINT",
    "TINYINT",
    "BYTEINT",
    "NUMERIC",
    // parameterised, NUMERIC(Precision[, Scale])
    "DECIMAL",
    // parameterised, DECIMAL(Precision[, Scale])
    "BIGNUMERIC",
    // parameterised, BIGNUMERIC(Precision[, Scale])
    "BIGDECIMAL",
    // parameterised, BIGDECIMAL(Precision[, Scale])
    "FLOAT64",
    "STRING",
    // parameterised, STRING(Length)
    "STRUCT",
    // parametric, STRUCT<T>
    "TIME",
    "TIMEZONE"
  ];
  var reservedSelect = expandPhrases(["SELECT [ALL | DISTINCT] [AS STRUCT | AS VALUE]"]);
  var reservedClauses = expandPhrases([
    // Queries: https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax
    "WITH [RECURSIVE]",
    "FROM",
    "WHERE",
    "GROUP BY",
    "HAVING",
    "QUALIFY",
    "WINDOW",
    "PARTITION BY",
    "ORDER BY",
    "LIMIT",
    "OFFSET",
    "OMIT RECORD IF",
    // legacy
    // Data modification: https://cloud.google.com/bigquery/docs/reference/standard-sql/dml-syntax
    // - insert:
    "INSERT [INTO]",
    "VALUES",
    // - update:
    "SET",
    // - merge:
    "MERGE [INTO]",
    "WHEN [NOT] MATCHED [BY SOURCE | BY TARGET] [THEN]",
    "UPDATE SET",
    "CLUSTER BY",
    "FOR SYSTEM_TIME AS OF",
    // CREATE SNAPSHOT TABLE
    "WITH CONNECTION",
    "WITH PARTITION COLUMNS",
    "REMOTE WITH CONNECTION"
  ]);
  var standardOnelineClauses = expandPhrases([
    "CREATE [OR REPLACE] [TEMP|TEMPORARY|SNAPSHOT|EXTERNAL] TABLE [IF NOT EXISTS]"
  ]);
  var tabularOnelineClauses = expandPhrases([
    // - create:
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language
    "CREATE [OR REPLACE] [MATERIALIZED] VIEW [IF NOT EXISTS]",
    // - update:
    "UPDATE",
    // - delete:
    "DELETE [FROM]",
    // - drop table:
    "DROP [SNAPSHOT | EXTERNAL] TABLE [IF EXISTS]",
    // - alter table:
    "ALTER TABLE [IF EXISTS]",
    "ADD COLUMN [IF NOT EXISTS]",
    "DROP COLUMN [IF EXISTS]",
    "RENAME TO",
    "ALTER COLUMN [IF EXISTS]",
    "SET DEFAULT COLLATE",
    // for alter column
    "SET OPTIONS",
    // for alter column
    "DROP NOT NULL",
    // for alter column
    "SET DATA TYPE",
    // for alter column
    // - alter schema
    "ALTER SCHEMA [IF EXISTS]",
    // - alter view
    "ALTER [MATERIALIZED] VIEW [IF EXISTS]",
    // - alter bi_capacity
    "ALTER BI_CAPACITY",
    // - truncate:
    "TRUNCATE TABLE",
    // - create schema
    "CREATE SCHEMA [IF NOT EXISTS]",
    "DEFAULT COLLATE",
    // stored procedures
    "CREATE [OR REPLACE] [TEMP|TEMPORARY|TABLE] FUNCTION [IF NOT EXISTS]",
    "CREATE [OR REPLACE] PROCEDURE [IF NOT EXISTS]",
    // row access policy
    "CREATE [OR REPLACE] ROW ACCESS POLICY [IF NOT EXISTS]",
    "GRANT TO",
    "FILTER USING",
    // capacity
    "CREATE CAPACITY",
    "AS JSON",
    // reservation
    "CREATE RESERVATION",
    // assignment
    "CREATE ASSIGNMENT",
    // search index
    "CREATE SEARCH INDEX [IF NOT EXISTS]",
    // drop
    "DROP SCHEMA [IF EXISTS]",
    "DROP [MATERIALIZED] VIEW [IF EXISTS]",
    "DROP [TABLE] FUNCTION [IF EXISTS]",
    "DROP PROCEDURE [IF EXISTS]",
    "DROP ROW ACCESS POLICY",
    "DROP ALL ROW ACCESS POLICIES",
    "DROP CAPACITY [IF EXISTS]",
    "DROP RESERVATION [IF EXISTS]",
    "DROP ASSIGNMENT [IF EXISTS]",
    "DROP SEARCH INDEX [IF EXISTS]",
    "DROP [IF EXISTS]",
    // DCL, https://cloud.google.com/bigquery/docs/reference/standard-sql/data-control-language
    "GRANT",
    "REVOKE",
    // Script, https://cloud.google.com/bigquery/docs/reference/standard-sql/scripting
    "DECLARE",
    "EXECUTE IMMEDIATE",
    "LOOP",
    "END LOOP",
    "REPEAT",
    "END REPEAT",
    "WHILE",
    "END WHILE",
    "BREAK",
    "LEAVE",
    "CONTINUE",
    "ITERATE",
    "FOR",
    "END FOR",
    "BEGIN",
    "BEGIN TRANSACTION",
    "COMMIT TRANSACTION",
    "ROLLBACK TRANSACTION",
    "RAISE",
    "RETURN",
    "CALL",
    // Debug, https://cloud.google.com/bigquery/docs/reference/standard-sql/debugging-statements
    "ASSERT",
    // Other, https://cloud.google.com/bigquery/docs/reference/standard-sql/other-statements
    "EXPORT DATA"
  ]);
  var reservedSetOperations = expandPhrases([
    "UNION {ALL | DISTINCT}",
    "EXCEPT DISTINCT",
    "INTERSECT DISTINCT"
  ]);
  var reservedJoins = expandPhrases([
    "JOIN",
    "{LEFT | RIGHT | FULL} [OUTER] JOIN",
    "{INNER | CROSS} JOIN"
  ]);
  var reservedPhrases = expandPhrases([
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax#tablesample_operator
    "TABLESAMPLE SYSTEM",
    // From DDL: https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language
    "ANY TYPE",
    "ALL COLUMNS",
    "NOT DETERMINISTIC",
    // inside window definitions
    "{ROWS | RANGE} BETWEEN",
    // comparison operator
    "IS [NOT] DISTINCT FROM"
  ]);
  var bigquery = {
    name: "bigquery",
    tokenizerOptions: {
      reservedSelect,
      reservedClauses: [...reservedClauses, ...tabularOnelineClauses, ...standardOnelineClauses],
      reservedSetOperations,
      reservedJoins,
      reservedPhrases,
      reservedKeywords: keywords,
      reservedDataTypes: dataTypes,
      reservedFunctionNames: functions,
      extraParens: ["[]"],
      stringTypes: [
        // The triple-quoted strings are listed first, so they get matched first.
        // Otherwise the first two quotes of """ will get matched as an empty "" string.
        { quote: '""".."""', prefixes: ["R", "B", "RB", "BR"] },
        { quote: "'''..'''", prefixes: ["R", "B", "RB", "BR"] },
        '""-bs',
        "''-bs",
        { quote: '""-raw', prefixes: ["R", "B", "RB", "BR"], requirePrefix: true },
        { quote: "''-raw", prefixes: ["R", "B", "RB", "BR"], requirePrefix: true }
      ],
      identTypes: ["``"],
      identChars: { dashes: true },
      paramTypes: { positional: true, named: ["@"], quoted: ["@"] },
      variableTypes: [{ regex: String.raw`@@\w+` }],
      lineCommentTypes: ["--", "#"],
      operators: ["&", "|", "^", "~", ">>", "<<", "||", "=>"],
      postProcess
    },
    formatOptions: {
      onelineClauses: [...standardOnelineClauses, ...tabularOnelineClauses],
      tabularOnelineClauses
    }
  };
  function postProcess(tokens) {
    return detectArraySubscripts(combineParameterizedTypes(tokens));
  }
  function detectArraySubscripts(tokens) {
    let prevToken = EOF_TOKEN;
    return tokens.map((token) => {
      if (token.text === "OFFSET" && prevToken.text === "[") {
        prevToken = token;
        return __spreadProps(__spreadValues({}, token), {
          type: "RESERVED_FUNCTION_NAME"
          /* RESERVED_FUNCTION_NAME */
        });
      } else {
        prevToken = token;
        return token;
      }
    });
  }
  function combineParameterizedTypes(tokens) {
    var _a;
    const processed = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if ((isToken.ARRAY(token) || isToken.STRUCT(token)) && ((_a = tokens[i + 1]) == null ? void 0 : _a.text) === "<") {
        const endIndex = findClosingAngleBracketIndex(tokens, i + 1);
        const typeDefTokens = tokens.slice(i, endIndex + 1);
        processed.push({
          type: "IDENTIFIER",
          raw: typeDefTokens.map(formatTypeDefToken("raw")).join(""),
          text: typeDefTokens.map(formatTypeDefToken("text")).join(""),
          start: token.start
        });
        i = endIndex;
      } else {
        processed.push(token);
      }
    }
    return processed;
  }
  var formatTypeDefToken = (key) => (token) => {
    if (token.type === "IDENTIFIER" || token.type === "COMMA") {
      return token[key] + " ";
    } else {
      return token[key];
    }
  };
  function findClosingAngleBracketIndex(tokens, startIndex) {
    let level = 0;
    for (let i = startIndex; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.text === "<") {
        level++;
      } else if (token.text === ">") {
        level--;
      } else if (token.text === ">>") {
        level -= 2;
      }
      if (level === 0) {
        return i;
      }
    }
    return tokens.length - 1;
  }
  var functions2 = [
    // https://www.ibm.com/docs/en/db2/11.5?topic=bif-aggregate-functions
    "ARRAY_AGG",
    "AVG",
    "CORRELATION",
    "COUNT",
    "COUNT_BIG",
    "COVARIANCE",
    "COVARIANCE_SAMP",
    "CUME_DIST",
    "GROUPING",
    "LISTAGG",
    "MAX",
    "MEDIAN",
    "MIN",
    "PERCENTILE_CONT",
    "PERCENTILE_DISC",
    "PERCENT_RANK",
    "REGR_AVGX",
    "REGR_AVGY",
    "REGR_COUNT",
    "REGR_INTERCEPT",
    "REGR_ICPT",
    "REGR_R2",
    "REGR_SLOPE",
    "REGR_SXX",
    "REGR_SXY",
    "REGR_SYY",
    "STDDEV",
    "STDDEV_SAMP",
    "SUM",
    "VARIANCE",
    "VARIANCE_SAMP",
    "XMLAGG",
    "XMLGROUP",
    // https://www.ibm.com/docs/en/db2/11.5?topic=bif-scalar-functions
    "ABS",
    "ABSVAL",
    "ACOS",
    "ADD_DAYS",
    "ADD_HOURS",
    "ADD_MINUTES",
    "ADD_MONTHS",
    "ADD_SECONDS",
    "ADD_YEARS",
    "AGE",
    "ARRAY_DELETE",
    "ARRAY_FIRST",
    "ARRAY_LAST",
    "ARRAY_NEXT",
    "ARRAY_PRIOR",
    "ASCII",
    "ASCII_STR",
    "ASIN",
    "ATAN",
    "ATAN2",
    "ATANH",
    "BITAND",
    "BITANDNOT",
    "BITOR",
    "BITXOR",
    "BITNOT",
    "BPCHAR",
    "BSON_TO_JSON",
    "BTRIM",
    "CARDINALITY",
    "CEILING",
    "CEIL",
    "CHARACTER_LENGTH",
    "CHR",
    "COALESCE",
    "COLLATION_KEY",
    "COLLATION_KEY_BIT",
    "COMPARE_DECFLOAT",
    "CONCAT",
    "COS",
    "COSH",
    "COT",
    "CURSOR_ROWCOUNT",
    "DATAPARTITIONNUM",
    "DATE_PART",
    "DATE_TRUNC",
    "DAY",
    "DAYNAME",
    "DAYOFMONTH",
    "DAYOFWEEK",
    "DAYOFWEEK_ISO",
    "DAYOFYEAR",
    "DAYS",
    "DAYS_BETWEEN",
    "DAYS_TO_END_OF_MONTH",
    "DBPARTITIONNUM",
    "DECFLOAT",
    "DECFLOAT_FORMAT",
    "DECODE",
    "DECRYPT_BIN",
    "DECRYPT_CHAR",
    "DEGREES",
    "DEREF",
    "DIFFERENCE",
    "DIGITS",
    "DOUBLE_PRECISION",
    "EMPTY_BLOB",
    "EMPTY_CLOB",
    "EMPTY_DBCLOB",
    "EMPTY_NCLOB",
    "ENCRYPT",
    "EVENT_MON_STATE",
    "EXP",
    "EXTRACT",
    "FIRST_DAY",
    "FLOOR",
    "FROM_UTC_TIMESTAMP",
    "GENERATE_UNIQUE",
    "GETHINT",
    "GREATEST",
    "HASH",
    "HASH4",
    "HASH8",
    "HASHEDVALUE",
    "HEX",
    "HEXTORAW",
    "HOUR",
    "HOURS_BETWEEN",
    "IDENTITY_VAL_LOCAL",
    "IFNULL",
    "INITCAP",
    "INSERT",
    "INSTR",
    "INSTR2",
    "INSTR4",
    "INSTRB",
    "INTNAND",
    "INTNOR",
    "INTNXOR",
    "INTNNOT",
    "ISNULL",
    "JSON_ARRAY",
    "JSON_OBJECT",
    "JSON_QUERY",
    "JSON_TO_BSON",
    "JSON_VALUE",
    "JULIAN_DAY",
    "LAST_DAY",
    "LCASE",
    "LEAST",
    "LEFT",
    "LENGTH",
    "LENGTH2",
    "LENGTH4",
    "LENGTHB",
    "LN",
    "LOCATE",
    "LOCATE_IN_STRING",
    "LOG10",
    "LONG_VARCHAR",
    "LONG_VARGRAPHIC",
    "LOWER",
    "LPAD",
    "LTRIM",
    "MAX",
    "MAX_CARDINALITY",
    "MICROSECOND",
    "MIDNIGHT_SECONDS",
    "MIN",
    "MINUTE",
    "MINUTES_BETWEEN",
    "MOD",
    "MONTH",
    "MONTHNAME",
    "MONTHS_BETWEEN",
    "MULTIPLY_ALT",
    "NEXT_DAY",
    "NEXT_MONTH",
    "NEXT_QUARTER",
    "NEXT_WEEK",
    "NEXT_YEAR",
    "NORMALIZE_DECFLOAT",
    "NOW",
    "NULLIF",
    "NVL",
    "NVL2",
    "OCTET_LENGTH",
    "OVERLAY",
    "PARAMETER",
    "POSITION",
    "POSSTR",
    "POW",
    "POWER",
    "QUANTIZE",
    "QUARTER",
    "QUOTE_IDENT",
    "QUOTE_LITERAL",
    "RADIANS",
    "RAISE_ERROR",
    "RAND",
    "RANDOM",
    "RAWTOHEX",
    "REC2XML",
    "REGEXP_COUNT",
    "REGEXP_EXTRACT",
    "REGEXP_INSTR",
    "REGEXP_LIKE",
    "REGEXP_MATCH_COUNT",
    "REGEXP_REPLACE",
    "REGEXP_SUBSTR",
    "REPEAT",
    "REPLACE",
    "RID",
    "RID_BIT",
    "RIGHT",
    "ROUND",
    "ROUND_TIMESTAMP",
    "RPAD",
    "RTRIM",
    "SECLABEL",
    "SECLABEL_BY_NAME",
    "SECLABEL_TO_CHAR",
    "SECOND",
    "SECONDS_BETWEEN",
    "SIGN",
    "SIN",
    "SINH",
    "SOUNDEX",
    "SPACE",
    "SQRT",
    "STRIP",
    "STRLEFT",
    "STRPOS",
    "STRRIGHT",
    "SUBSTR",
    "SUBSTR2",
    "SUBSTR4",
    "SUBSTRB",
    "SUBSTRING",
    "TABLE_NAME",
    "TABLE_SCHEMA",
    "TAN",
    "TANH",
    "THIS_MONTH",
    "THIS_QUARTER",
    "THIS_WEEK",
    "THIS_YEAR",
    "TIMESTAMP_FORMAT",
    "TIMESTAMP_ISO",
    "TIMESTAMPDIFF",
    "TIMEZONE",
    "TO_CHAR",
    "TO_CLOB",
    "TO_DATE",
    "TO_HEX",
    "TO_MULTI_BYTE",
    "TO_NCHAR",
    "TO_NCLOB",
    "TO_NUMBER",
    "TO_SINGLE_BYTE",
    "TO_TIMESTAMP",
    "TO_UTC_TIMESTAMP",
    "TOTALORDER",
    "TRANSLATE",
    "TRIM",
    "TRIM_ARRAY",
    "TRUNC_TIMESTAMP",
    "TRUNCATE",
    "TRUNC",
    "TYPE_ID",
    "TYPE_NAME",
    "TYPE_SCHEMA",
    "UCASE",
    "UNICODE_STR",
    "UPPER",
    "VALUE",
    "VARCHAR_BIT_FORMAT",
    "VARCHAR_FORMAT",
    "VARCHAR_FORMAT_BIT",
    "VERIFY_GROUP_FOR_USER",
    "VERIFY_ROLE_FOR_USER",
    "VERIFY_TRUSTED_CONTEXT_ROLE_FOR_USER",
    "WEEK",
    "WEEK_ISO",
    "WEEKS_BETWEEN",
    "WIDTH_BUCKET",
    "XMLATTRIBUTES",
    "XMLCOMMENT",
    "XMLCONCAT",
    "XMLDOCUMENT",
    "XMLELEMENT",
    "XMLFOREST",
    "XMLNAMESPACES",
    "XMLPARSE",
    "XMLPI",
    "XMLQUERY",
    "XMLROW",
    "XMLSERIALIZE",
    "XMLTEXT",
    "XMLVALIDATE",
    "XMLXSROBJECTID",
    "XSLTRANSFORM",
    "YEAR",
    "YEARS_BETWEEN",
    "YMD_BETWEEN",
    // https://www.ibm.com/docs/en/db2/11.5?topic=bif-table-functions
    "BASE_TABLE",
    "JSON_TABLE",
    "UNNEST",
    "XMLTABLE",
    // https://www.ibm.com/docs/en/db2/11.5?topic=expressions-olap-specification
    // Additional function names not already present in the aggregate functions list
    "RANK",
    "DENSE_RANK",
    "NTILE",
    "LAG",
    "LEAD",
    "ROW_NUMBER",
    "FIRST_VALUE",
    "LAST_VALUE",
    "NTH_VALUE",
    "RATIO_TO_REPORT",
    // Type casting
    "CAST"
  ];
  var keywords2 = [
    // https://www.ibm.com/docs/en/db2/11.5?topic=sql-reserved-schema-names-reserved-words
    "ACTIVATE",
    "ADD",
    "AFTER",
    "ALIAS",
    "ALL",
    "ALLOCATE",
    "ALLOW",
    "ALTER",
    "AND",
    "ANY",
    "AS",
    "ASENSITIVE",
    "ASSOCIATE",
    "ASUTIME",
    "AT",
    "ATTRIBUTES",
    "AUDIT",
    "AUTHORIZATION",
    "AUX",
    "AUXILIARY",
    "BEFORE",
    "BEGIN",
    "BETWEEN",
    "BINARY",
    "BUFFERPOOL",
    "BY",
    "CACHE",
    "CALL",
    "CALLED",
    "CAPTURE",
    "CARDINALITY",
    "CASCADED",
    "CASE",
    "CAST",
    "CHECK",
    "CLONE",
    "CLOSE",
    "CLUSTER",
    "COLLECTION",
    "COLLID",
    "COLUMN",
    "COMMENT",
    "COMMIT",
    "CONCAT",
    "CONDITION",
    "CONNECT",
    "CONNECTION",
    "CONSTRAINT",
    "CONTAINS",
    "CONTINUE",
    "COUNT",
    "COUNT_BIG",
    "CREATE",
    "CROSS",
    "CURRENT",
    "CURRENT_DATE",
    "CURRENT_LC_CTYPE",
    "CURRENT_PATH",
    "CURRENT_SCHEMA",
    "CURRENT_SERVER",
    "CURRENT_TIME",
    "CURRENT_TIMESTAMP",
    "CURRENT_TIMEZONE",
    "CURRENT_USER",
    "CURSOR",
    "CYCLE",
    "DATA",
    "DATABASE",
    "DATAPARTITIONNAME",
    "DATAPARTITIONNUM",
    "DAY",
    "DAYS",
    "DB2GENERAL",
    "DB2GENRL",
    "DB2SQL",
    "DBINFO",
    "DBPARTITIONNAME",
    "DBPARTITIONNUM",
    "DEALLOCATE",
    "DECLARE",
    "DEFAULT",
    "DEFAULTS",
    "DEFINITION",
    "DELETE",
    "DENSERANK",
    "DENSE_RANK",
    "DESCRIBE",
    "DESCRIPTOR",
    "DETERMINISTIC",
    "DIAGNOSTICS",
    "DISABLE",
    "DISALLOW",
    "DISCONNECT",
    "DISTINCT",
    "DO",
    "DOCUMENT",
    "DROP",
    "DSSIZE",
    "DYNAMIC",
    "EACH",
    "EDITPROC",
    "ELSE",
    "ELSEIF",
    "ENABLE",
    "ENCODING",
    "ENCRYPTION",
    "END",
    "END-EXEC",
    "ENDING",
    "ERASE",
    "ESCAPE",
    "EVERY",
    "EXCEPT",
    "EXCEPTION",
    "EXCLUDING",
    "EXCLUSIVE",
    "EXECUTE",
    "EXISTS",
    "EXIT",
    "EXPLAIN",
    "EXTENDED",
    "EXTERNAL",
    "EXTRACT",
    "FENCED",
    "FETCH",
    "FIELDPROC",
    "FILE",
    "FINAL",
    "FIRST1",
    "FOR",
    "FOREIGN",
    "FREE",
    "FROM",
    "FULL",
    "FUNCTION",
    "GENERAL",
    "GENERATED",
    "GET",
    "GLOBAL",
    "GO",
    "GOTO",
    "GRANT",
    "GRAPHIC",
    "GROUP",
    "HANDLER",
    "HASH",
    "HASHED_VALUE",
    "HAVING",
    "HINT",
    "HOLD",
    "HOUR",
    "HOURS",
    "IDENTITY",
    "IF",
    "IMMEDIATE",
    "IMPORT",
    "IN",
    "INCLUDING",
    "INCLUSIVE",
    "INCREMENT",
    "INDEX",
    "INDICATOR",
    "INDICATORS",
    "INF",
    "INFINITY",
    "INHERIT",
    "INNER",
    "INOUT",
    "INSENSITIVE",
    "INSERT",
    "INTEGRITY",
    "INTERSECT",
    "INTO",
    "IS",
    "ISNULL",
    "ISOBID",
    "ISOLATION",
    "ITERATE",
    "JAR",
    "JAVA",
    "JOIN",
    "KEEP",
    "KEY",
    "LABEL",
    "LANGUAGE",
    "LAST3",
    "LATERAL",
    "LC_CTYPE",
    "LEAVE",
    "LEFT",
    "LIKE",
    "LIMIT",
    "LINKTYPE",
    "LOCAL",
    "LOCALDATE",
    "LOCALE",
    "LOCALTIME",
    "LOCALTIMESTAMP",
    "LOCATOR",
    "LOCATORS",
    "LOCK",
    "LOCKMAX",
    "LOCKSIZE",
    "LOOP",
    "MAINTAINED",
    "MATERIALIZED",
    "MAXVALUE",
    "MICROSECOND",
    "MICROSECONDS",
    "MINUTE",
    "MINUTES",
    "MINVALUE",
    "MODE",
    "MODIFIES",
    "MONTH",
    "MONTHS",
    "NAN",
    "NEW",
    "NEW_TABLE",
    "NEXTVAL",
    "NO",
    "NOCACHE",
    "NOCYCLE",
    "NODENAME",
    "NODENUMBER",
    "NOMAXVALUE",
    "NOMINVALUE",
    "NONE",
    "NOORDER",
    "NORMALIZED",
    "NOT2",
    "NOTNULL",
    "NULL",
    "NULLS",
    "NUMPARTS",
    "OBID",
    "OF",
    "OFF",
    "OFFSET",
    "OLD",
    "OLD_TABLE",
    "ON",
    "OPEN",
    "OPTIMIZATION",
    "OPTIMIZE",
    "OPTION",
    "OR",
    "ORDER",
    "OUT",
    "OUTER",
    "OVER",
    "OVERRIDING",
    "PACKAGE",
    "PADDED",
    "PAGESIZE",
    "PARAMETER",
    "PART",
    "PARTITION",
    "PARTITIONED",
    "PARTITIONING",
    "PARTITIONS",
    "PASSWORD",
    "PATH",
    "PERCENT",
    "PIECESIZE",
    "PLAN",
    "POSITION",
    "PRECISION",
    "PREPARE",
    "PREVVAL",
    "PRIMARY",
    "PRIQTY",
    "PRIVILEGES",
    "PROCEDURE",
    "PROGRAM",
    "PSID",
    "PUBLIC",
    "QUERY",
    "QUERYNO",
    "RANGE",
    "RANK",
    "READ",
    "READS",
    "RECOVERY",
    "REFERENCES",
    "REFERENCING",
    "REFRESH",
    "RELEASE",
    "RENAME",
    "REPEAT",
    "RESET",
    "RESIGNAL",
    "RESTART",
    "RESTRICT",
    "RESULT",
    "RESULT_SET_LOCATOR",
    "RETURN",
    "RETURNS",
    "REVOKE",
    "RIGHT",
    "ROLE",
    "ROLLBACK",
    "ROUND_CEILING",
    "ROUND_DOWN",
    "ROUND_FLOOR",
    "ROUND_HALF_DOWN",
    "ROUND_HALF_EVEN",
    "ROUND_HALF_UP",
    "ROUND_UP",
    "ROUTINE",
    "ROW",
    "ROWNUMBER",
    "ROWS",
    "ROWSET",
    "ROW_NUMBER",
    "RRN",
    "RUN",
    "SAVEPOINT",
    "SCHEMA",
    "SCRATCHPAD",
    "SCROLL",
    "SEARCH",
    "SECOND",
    "SECONDS",
    "SECQTY",
    "SECURITY",
    "SELECT",
    "SENSITIVE",
    "SEQUENCE",
    "SESSION",
    "SESSION_USER",
    "SET",
    "SIGNAL",
    "SIMPLE",
    "SNAN",
    "SOME",
    "SOURCE",
    "SPECIFIC",
    "SQL",
    "SQLID",
    "STACKED",
    "STANDARD",
    "START",
    "STARTING",
    "STATEMENT",
    "STATIC",
    "STATMENT",
    "STAY",
    "STOGROUP",
    "STORES",
    "STYLE",
    "SUBSTRING",
    "SUMMARY",
    "SYNONYM",
    "SYSFUN",
    "SYSIBM",
    "SYSPROC",
    "SYSTEM",
    "SYSTEM_USER",
    "TABLE",
    "TABLESPACE",
    "THEN",
    "TO",
    "TRANSACTION",
    "TRIGGER",
    "TRIM",
    "TRUNCATE",
    "TYPE",
    "UNDO",
    "UNION",
    "UNIQUE",
    "UNTIL",
    "UPDATE",
    "USAGE",
    "USER",
    "USING",
    "VALIDPROC",
    "VALUE",
    "VALUES",
    "VARIABLE",
    "VARIANT",
    "VCAT",
    "VERSION",
    "VIEW",
    "VOLATILE",
    "VOLUMES",
    "WHEN",
    "WHENEVER",
    "WHERE",
    "WHILE",
    "WITH",
    "WITHOUT",
    "WLM",
    "WRITE",
    "XMLELEMENT",
    "XMLEXISTS",
    "XMLNAMESPACES",
    "YEAR",
    "YEARS"
  ];
  var dataTypes2 = [
    // https://www.ibm.com/docs/en/db2-for-zos/12?topic=columns-data-types
    "ARRAY",
    "BIGINT",
    "BINARY",
    "BLOB",
    "BOOLEAN",
    "CCSID",
    "CHAR",
    "CHARACTER",
    "CLOB",
    "DATE",
    "DATETIME",
    "DBCLOB",
    "DEC",
    "DECIMAL",
    "DOUBLE",
    "DOUBLE PRECISION",
    "FLOAT",
    "FLOAT4",
    "FLOAT8",
    "GRAPHIC",
    "INT",
    "INT2",
    "INT4",
    "INT8",
    "INTEGER",
    "INTERVAL",
    "LONG VARCHAR",
    "LONG VARGRAPHIC",
    "NCHAR",
    "NCHR",
    "NCLOB",
    "NVARCHAR",
    "NUMERIC",
    "SMALLINT",
    "REAL",
    "TIME",
    "TIMESTAMP",
    "VARBINARY",
    "VARCHAR",
    "VARGRAPHIC"
  ];
  var reservedSelect2 = expandPhrases(["SELECT [ALL | DISTINCT]"]);
  var reservedClauses2 = expandPhrases([
    // queries
    "WITH",
    "FROM",
    "WHERE",
    "GROUP BY",
    "HAVING",
    "PARTITION BY",
    "ORDER BY [INPUT SEQUENCE]",
    "LIMIT",
    "OFFSET",
    "FETCH NEXT",
    "FOR UPDATE [OF]",
    "FOR {READ | FETCH} ONLY",
    "FOR {RR | CS | UR | RS} [USE AND KEEP {SHARE | UPDATE | EXCLUSIVE} LOCKS]",
    "WAIT FOR OUTCOME",
    "SKIP LOCKED DATA",
    "INTO",
    // Data modification
    // - insert:
    "INSERT INTO",
    "VALUES",
    // - update:
    "SET",
    // - merge:
    "MERGE INTO",
    "WHEN [NOT] MATCHED [THEN]",
    "UPDATE SET",
    "INSERT"
  ]);
  var standardOnelineClauses2 = expandPhrases([
    "CREATE [GLOBAL TEMPORARY | EXTERNAL] TABLE [IF NOT EXISTS]"
  ]);
  var tabularOnelineClauses2 = expandPhrases([
    // - create:
    "CREATE [OR REPLACE] VIEW",
    // - update:
    "UPDATE",
    "WHERE CURRENT OF",
    "WITH {RR | RS | CS | UR}",
    // - delete:
    "DELETE FROM",
    // - drop table:
    "DROP TABLE [IF EXISTS]",
    // alter table:
    "ALTER TABLE",
    "ADD [COLUMN]",
    "DROP [COLUMN]",
    "RENAME COLUMN",
    "ALTER [COLUMN]",
    "SET DATA TYPE",
    // for alter column
    "SET NOT NULL",
    // for alter column
    "DROP {DEFAULT | GENERATED | NOT NULL}",
    // for alter column
    // - truncate:
    "TRUNCATE [TABLE]",
    // https://www.ibm.com/docs/en/db2/11.5?topic=s-statements
    "ALLOCATE",
    "ALTER AUDIT POLICY",
    "ALTER BUFFERPOOL",
    "ALTER DATABASE PARTITION GROUP",
    "ALTER DATABASE",
    "ALTER EVENT MONITOR",
    "ALTER FUNCTION",
    "ALTER HISTOGRAM TEMPLATE",
    "ALTER INDEX",
    "ALTER MASK",
    "ALTER METHOD",
    "ALTER MODULE",
    "ALTER NICKNAME",
    "ALTER PACKAGE",
    "ALTER PERMISSION",
    "ALTER PROCEDURE",
    "ALTER SCHEMA",
    "ALTER SECURITY LABEL COMPONENT",
    "ALTER SECURITY POLICY",
    "ALTER SEQUENCE",
    "ALTER SERVER",
    "ALTER SERVICE CLASS",
    "ALTER STOGROUP",
    "ALTER TABLESPACE",
    "ALTER THRESHOLD",
    "ALTER TRIGGER",
    "ALTER TRUSTED CONTEXT",
    "ALTER TYPE",
    "ALTER USAGE LIST",
    "ALTER USER MAPPING",
    "ALTER VIEW",
    "ALTER WORK ACTION SET",
    "ALTER WORK CLASS SET",
    "ALTER WORKLOAD",
    "ALTER WRAPPER",
    "ALTER XSROBJECT",
    "ALTER STOGROUP",
    "ALTER TABLESPACE",
    "ALTER TRIGGER",
    "ALTER TRUSTED CONTEXT",
    "ALTER VIEW",
    "ASSOCIATE [RESULT SET] {LOCATOR | LOCATORS}",
    "AUDIT",
    "BEGIN DECLARE SECTION",
    "CALL",
    "CLOSE",
    "COMMENT ON",
    "COMMIT [WORK]",
    "CONNECT",
    "CREATE [OR REPLACE] [PUBLIC] ALIAS",
    "CREATE AUDIT POLICY",
    "CREATE BUFFERPOOL",
    "CREATE DATABASE PARTITION GROUP",
    "CREATE EVENT MONITOR",
    "CREATE [OR REPLACE] FUNCTION",
    "CREATE FUNCTION MAPPING",
    "CREATE HISTOGRAM TEMPLATE",
    "CREATE [UNIQUE] INDEX",
    "CREATE INDEX EXTENSION",
    "CREATE [OR REPLACE] MASK",
    "CREATE [SPECIFIC] METHOD",
    "CREATE [OR REPLACE] MODULE",
    "CREATE [OR REPLACE] NICKNAME",
    "CREATE [OR REPLACE] PERMISSION",
    "CREATE [OR REPLACE] PROCEDURE",
    "CREATE ROLE",
    "CREATE SCHEMA",
    "CREATE SECURITY LABEL [COMPONENT]",
    "CREATE SECURITY POLICY",
    "CREATE [OR REPLACE] SEQUENCE",
    "CREATE SERVICE CLASS",
    "CREATE SERVER",
    "CREATE STOGROUP",
    "CREATE SYNONYM",
    "CREATE [LARGE | REGULAR | {SYSTEM | USER} TEMPORARY] TABLESPACE",
    "CREATE THRESHOLD",
    "CREATE {TRANSFORM | TRANSFORMS} FOR",
    "CREATE [OR REPLACE] TRIGGER",
    "CREATE TRUSTED CONTEXT",
    "CREATE [OR REPLACE] TYPE",
    "CREATE TYPE MAPPING",
    "CREATE USAGE LIST",
    "CREATE USER MAPPING FOR",
    "CREATE [OR REPLACE] VARIABLE",
    "CREATE WORK ACTION SET",
    "CREATE WORK CLASS SET",
    "CREATE WORKLOAD",
    "CREATE WRAPPER",
    "DECLARE",
    "DECLARE GLOBAL TEMPORARY TABLE",
    "DESCRIBE [INPUT | OUTPUT]",
    "DISCONNECT",
    "DROP [PUBLIC] ALIAS",
    "DROP AUDIT POLICY",
    "DROP BUFFERPOOL",
    "DROP DATABASE PARTITION GROUP",
    "DROP EVENT MONITOR",
    "DROP [SPECIFIC] FUNCTION",
    "DROP FUNCTION MAPPING",
    "DROP HISTOGRAM TEMPLATE",
    "DROP INDEX [EXTENSION]",
    "DROP MASK",
    "DROP [SPECIFIC] METHOD",
    "DROP MODULE",
    "DROP NICKNAME",
    "DROP PACKAGE",
    "DROP PERMISSION",
    "DROP [SPECIFIC] PROCEDURE",
    "DROP ROLE",
    "DROP SCHEMA",
    "DROP SECURITY LABEL [COMPONENT]",
    "DROP SECURITY POLICY",
    "DROP SEQUENCE",
    "DROP SERVER",
    "DROP SERVICE CLASS",
    "DROP STOGROUP",
    "DROP TABLE HIERARCHY",
    "DROP {TABLESPACE | TABLESPACES}",
    "DROP {TRANSFORM | TRANSFORMS}",
    "DROP THRESHOLD",
    "DROP TRIGGER",
    "DROP TRUSTED CONTEXT",
    "DROP TYPE [MAPPING]",
    "DROP USAGE LIST",
    "DROP USER MAPPING FOR",
    "DROP VARIABLE",
    "DROP VIEW [HIERARCHY]",
    "DROP WORK {ACTION | CLASS} SET",
    "DROP WORKLOAD",
    "DROP WRAPPER",
    "DROP XSROBJECT",
    "END DECLARE SECTION",
    "EXECUTE [IMMEDIATE]",
    "EXPLAIN {PLAN [SECTION] | ALL}",
    "FETCH [FROM]",
    "FLUSH {BUFFERPOOL | BUFFERPOOLS} ALL",
    "FLUSH EVENT MONITOR",
    "FLUSH FEDERATED CACHE",
    "FLUSH OPTIMIZATION PROFILE CACHE",
    "FLUSH PACKAGE CACHE [DYNAMIC]",
    "FLUSH AUTHENTICATION CACHE [FOR ALL]",
    "FREE LOCATOR",
    "GET DIAGNOSTICS",
    "GOTO",
    "GRANT",
    // TODO: lots of syntax here
    "INCLUDE",
    "ITERATE",
    "LEAVE",
    "LOCK TABLE",
    "LOOP",
    "OPEN",
    "PIPE",
    "PREPARE",
    "REFRESH TABLE",
    "RELEASE",
    "RELEASE [TO] SAVEPOINT",
    "RENAME [TABLE | INDEX | STOGROUP | TABLESPACE]",
    "REPEAT",
    "RESIGNAL",
    "RETURN",
    "REVOKE",
    // TODO: lots of syntax here
    "ROLLBACK [WORK] [TO SAVEPOINT]",
    "SAVEPOINT",
    "SET COMPILATION ENVIRONMENT",
    "SET CONNECTION",
    "SET CURRENT",
    // TODO: bunch of syntax here
    "SET ENCRYPTION PASSWORD",
    "SET EVENT MONITOR STATE",
    "SET INTEGRITY",
    "SET PASSTHRU",
    "SET PATH",
    "SET ROLE",
    "SET SCHEMA",
    "SET SERVER OPTION",
    "SET {SESSION AUTHORIZATION | SESSION_USER}",
    "SET USAGE LIST",
    "SIGNAL",
    "TRANSFER OWNERSHIP OF",
    "WHENEVER {NOT FOUND | SQLERROR | SQLWARNING}",
    "WHILE"
  ]);
  var reservedSetOperations2 = expandPhrases(["UNION [ALL]", "EXCEPT [ALL]", "INTERSECT [ALL]"]);
  var reservedJoins2 = expandPhrases([
    "JOIN",
    "{LEFT | RIGHT | FULL} [OUTER] JOIN",
    "{INNER | CROSS} JOIN"
  ]);
  var reservedPhrases2 = expandPhrases([
    "ON DELETE",
    "ON UPDATE",
    "SET NULL",
    "{ROWS | RANGE} BETWEEN"
  ]);
  var db2 = {
    name: "db2",
    tokenizerOptions: {
      reservedSelect: reservedSelect2,
      reservedClauses: [...reservedClauses2, ...standardOnelineClauses2, ...tabularOnelineClauses2],
      reservedSetOperations: reservedSetOperations2,
      reservedJoins: reservedJoins2,
      reservedPhrases: reservedPhrases2,
      reservedKeywords: keywords2,
      reservedDataTypes: dataTypes2,
      reservedFunctionNames: functions2,
      extraParens: ["[]"],
      stringTypes: [
        { quote: "''-qq", prefixes: ["G", "N", "U&"] },
        { quote: "''-raw", prefixes: ["X", "BX", "GX", "UX"], requirePrefix: true }
      ],
      identTypes: [`""-qq`],
      identChars: { first: "@#$", rest: "@#$" },
      paramTypes: { positional: true, named: [":"] },
      paramChars: { first: "@#$", rest: "@#$" },
      operators: [
        "**",
        "%",
        "|",
        "&",
        "^",
        "~",
        "\xAC=",
        "\xAC>",
        "\xAC<",
        "!>",
        "!<",
        "^=",
        "^>",
        "^<",
        "||",
        "->",
        "=>"
      ]
    },
    formatOptions: {
      onelineClauses: [...standardOnelineClauses2, ...tabularOnelineClauses2],
      tabularOnelineClauses: tabularOnelineClauses2
    }
  };
  var functions3 = [
    // https://www.ibm.com/docs/en/i/7.5?topic=functions-aggregate
    // TODO: 'ANY', - conflicts with test for ANY predicate in 'operators.ys'!!
    "ARRAY_AGG",
    "AVG",
    "CORR",
    "CORRELATION",
    "COUNT",
    "COUNT_BIG",
    "COVAR_POP",
    "COVARIANCE",
    "COVAR",
    "COVAR_SAMP",
    "COVARIANCE_SAMP",
    "EVERY",
    "GROUPING",
    "JSON_ARRAYAGG",
    "JSON_OBJECTAGG",
    "LISTAGG",
    "MAX",
    "MEDIAN",
    "MIN",
    "PERCENTILE_CONT",
    "PERCENTILE_DISC",
    // https://www.ibm.com/docs/en/i/7.5?topic=functions-regression'
    "REGR_AVGX",
    "REGR_AVGY",
    "REGR_COUNT",
    "REGR_INTERCEPT",
    "REGR_R2",
    "REGR_SLOPE",
    "REGR_SXX",
    "REGR_SXY",
    "REGR_SYY",
    "SOME",
    "STDDEV_POP",
    "STDDEV",
    "STDDEV_SAMP",
    "SUM",
    "VAR_POP",
    "VARIANCE",
    "VAR",
    "VAR_SAMP",
    "VARIANCE_SAMP",
    "XMLAGG",
    "XMLGROUP",
    // https://www.ibm.com/docs/en/i/7.5?topic=functions-scalar
    "ABS",
    "ABSVAL",
    "ACOS",
    "ADD_DAYS",
    "ADD_HOURS",
    "ADD_MINUTES",
    "ADD_MONTHS",
    "ADD_SECONDS",
    "ADD_YEARS",
    "ANTILOG",
    "ARRAY_MAX_CARDINALITY",
    "ARRAY_TRIM",
    "ASCII",
    "ASIN",
    "ATAN",
    "ATAN2",
    "ATANH",
    "BASE64_DECODE",
    "BASE64_ENCODE",
    "BIT_LENGTH",
    "BITAND",
    "BITANDNOT",
    "BITNOT",
    "BITOR",
    "BITXOR",
    "BSON_TO_JSON",
    "CARDINALITY",
    "CEIL",
    "CEILING",
    "CHAR_LENGTH",
    "CHARACTER_LENGTH",
    "CHR",
    "COALESCE",
    "COMPARE_DECFLOAT",
    "CONCAT",
    "CONTAINS",
    "COS",
    "COSH",
    "COT",
    "CURDATE",
    "CURTIME",
    "DATABASE",
    "DATAPARTITIONNAME",
    "DATAPARTITIONNUM",
    "DAY",
    "DAYNAME",
    "DAYOFMONTH",
    "DAYOFWEEK_ISO",
    "DAYOFWEEK",
    "DAYOFYEAR",
    "DAYS",
    "DBPARTITIONNAME",
    "DBPARTITIONNUM",
    "DECFLOAT_FORMAT",
    "DECFLOAT_SORTKEY",
    "DECRYPT_BINARY",
    "DECRYPT_BIT",
    "DECRYPT_CHAR",
    "DECRYPT_DB",
    "DEGREES",
    "DIFFERENCE",
    "DIGITS",
    "DLCOMMENT",
    "DLLINKTYPE",
    "DLURLCOMPLETE",
    "DLURLPATH",
    "DLURLPATHONLY",
    "DLURLSCHEME",
    "DLURLSERVER",
    "DLVALUE",
    "DOUBLE_PRECISION",
    "DOUBLE",
    "ENCRPYT",
    "ENCRYPT_AES",
    "ENCRYPT_AES256",
    "ENCRYPT_RC2",
    "ENCRYPT_TDES",
    "EXP",
    "EXTRACT",
    "FIRST_DAY",
    "FLOOR",
    "GENERATE_UNIQUE",
    "GET_BLOB_FROM_FILE",
    "GET_CLOB_FROM_FILE",
    "GET_DBCLOB_FROM_FILE",
    "GET_XML_FILE",
    "GETHINT",
    "GREATEST",
    "HASH_MD5",
    "HASH_ROW",
    "HASH_SHA1",
    "HASH_SHA256",
    "HASH_SHA512",
    "HASH_VALUES",
    "HASHED_VALUE",
    "HEX",
    "HEXTORAW",
    "HOUR",
    "HTML_ENTITY_DECODE",
    "HTML_ENTITY_ENCODE",
    "HTTP_DELETE_BLOB",
    "HTTP_DELETE",
    "HTTP_GET_BLOB",
    "HTTP_GET",
    "HTTP_PATCH_BLOB",
    "HTTP_PATCH",
    "HTTP_POST_BLOB",
    "HTTP_POST",
    "HTTP_PUT_BLOB",
    "HTTP_PUT",
    "IDENTITY_VAL_LOCAL",
    "IFNULL",
    "INSERT",
    "INSTR",
    "INTERPRET",
    "ISFALSE",
    "ISNOTFALSE",
    "ISNOTTRUE",
    "ISTRUE",
    "JSON_ARRAY",
    "JSON_OBJECT",
    "JSON_QUERY",
    "JSON_TO_BSON",
    "JSON_UPDATE",
    "JSON_VALUE",
    "JULIAN_DAY",
    "LAND",
    "LAST_DAY",
    "LCASE",
    "LEAST",
    "LEFT",
    "LENGTH",
    "LN",
    "LNOT",
    "LOCATE_IN_STRING",
    "LOCATE",
    "LOG10",
    "LOR",
    "LOWER",
    "LPAD",
    "LTRIM",
    "MAX_CARDINALITY",
    "MAX",
    "MICROSECOND",
    "MIDNIGHT_SECONDS",
    "MIN",
    "MINUTE",
    "MOD",
    "MONTH",
    "MONTHNAME",
    "MONTHS_BETWEEN",
    "MQREAD",
    "MQREADCLOB",
    "MQRECEIVE",
    "MQRECEIVECLOB",
    "MQSEND",
    "MULTIPLY_ALT",
    "NEXT_DAY",
    "NORMALIZE_DECFLOAT",
    "NOW",
    "NULLIF",
    "NVL",
    "OCTET_LENGTH",
    "OVERLAY",
    "PI",
    "POSITION",
    "POSSTR",
    "POW",
    "POWER",
    "QUANTIZE",
    "QUARTER",
    "RADIANS",
    "RAISE_ERROR",
    "RANDOM",
    "RAND",
    "REGEXP_COUNT",
    "REGEXP_INSTR",
    "REGEXP_REPLACE",
    "REGEXP_SUBSTR",
    "REPEAT",
    "REPLACE",
    "RID",
    "RIGHT",
    "ROUND_TIMESTAMP",
    "ROUND",
    "RPAD",
    "RRN",
    "RTRIM",
    "SCORE",
    "SECOND",
    "SIGN",
    "SIN",
    "SINH",
    "SOUNDEX",
    "SPACE",
    "SQRT",
    "STRIP",
    "STRLEFT",
    "STRPOS",
    "STRRIGHT",
    "SUBSTR",
    "SUBSTRING",
    "TABLE_NAME",
    "TABLE_SCHEMA",
    "TAN",
    "TANH",
    "TIMESTAMP_FORMAT",
    "TIMESTAMP_ISO",
    "TIMESTAMPDIFF_BIG",
    "TIMESTAMPDIFF",
    "TO_CHAR",
    "TO_CLOB",
    "TO_DATE",
    "TO_NUMBER",
    "TO_TIMESTAMP",
    "TOTALORDER",
    "TRANSLATE",
    "TRIM_ARRAY",
    "TRIM",
    "TRUNC_TIMESTAMP",
    "TRUNC",
    "TRUNCATE",
    "UCASE",
    "UPPER",
    "URL_DECODE",
    "URL_ENCODE",
    "VALUE",
    "VARBINARY_FORMAT",
    "VARCHAR_BIT_FORMAT",
    "VARCHAR_FORMAT_BINARY",
    "VARCHAR_FORMAT",
    "VERIFY_GROUP_FOR_USER",
    "WEEK_ISO",
    "WEEK",
    "WRAP",
    "XMLATTRIBUTES",
    "XMLCOMMENT",
    "XMLCONCAT",
    "XMLDOCUMENT",
    "XMLELEMENT",
    "XMLFOREST",
    "XMLNAMESPACES",
    "XMLPARSE",
    "XMLPI",
    "XMLROW",
    "XMLSERIALIZE",
    "XMLTEXT",
    "XMLVALIDATE",
    "XOR",
    "XSLTRANSFORM",
    "YEAR",
    "ZONED",
    // https://www.ibm.com/docs/en/i/7.5?topic=functions-table
    "BASE_TABLE",
    "HTTP_DELETE_BLOB_VERBOSE",
    "HTTP_DELETE_VERBOSE",
    "HTTP_GET_BLOB_VERBOSE",
    "HTTP_GET_VERBOSE",
    "HTTP_PATCH_BLOB_VERBOSE",
    "HTTP_PATCH_VERBOSE",
    "HTTP_POST_BLOB_VERBOSE",
    "HTTP_POST_VERBOSE",
    "HTTP_PUT_BLOB_VERBOSE",
    "HTTP_PUT_VERBOSE",
    "JSON_TABLE",
    "MQREADALL",
    "MQREADALLCLOB",
    "MQRECEIVEALL",
    "MQRECEIVEALLCLOB",
    "XMLTABLE",
    // https://www.ibm.com/docs/en/db2-for-zos/11?topic=functions-row
    "UNPACK",
    // https://www.ibm.com/docs/en/i/7.5?topic=expressions-olap-specifications
    "CUME_DIST",
    "DENSE_RANK",
    "FIRST_VALUE",
    "LAG",
    "LAST_VALUE",
    "LEAD",
    "NTH_VALUE",
    "NTILE",
    "PERCENT_RANK",
    "RANK",
    "RATIO_TO_REPORT",
    "ROW_NUMBER",
    // Type casting
    "CAST"
  ];
  var keywords3 = [
    // https://www.ibm.com/docs/en/i/7.5?topic=words-reserved
    // TODO: This list likely contains all keywords, not only the reserved ones,
    // try to filter it down to just the reserved keywords.
    "ABSENT",
    "ACCORDING",
    "ACCTNG",
    "ACTION",
    "ACTIVATE",
    "ADD",
    "ALIAS",
    "ALL",
    "ALLOCATE",
    "ALLOW",
    "ALTER",
    "AND",
    "ANY",
    "APPEND",
    "APPLNAME",
    "ARRAY",
    "ARRAY_AGG",
    "ARRAY_TRIM",
    "AS",
    "ASC",
    "ASENSITIVE",
    "ASSOCIATE",
    "ATOMIC",
    "ATTACH",
    "ATTRIBUTES",
    "AUTHORIZATION",
    "AUTONOMOUS",
    "BEFORE",
    "BEGIN",
    "BETWEEN",
    "BIND",
    "BSON",
    "BUFFERPOOL",
    "BY",
    "CACHE",
    "CALL",
    "CALLED",
    "CARDINALITY",
    "CASE",
    "CAST",
    "CHECK",
    "CL",
    "CLOSE",
    "CLUSTER",
    "COLLECT",
    "COLLECTION",
    "COLUMN",
    "COMMENT",
    "COMMIT",
    "COMPACT",
    "COMPARISONS",
    "COMPRESS",
    "CONCAT",
    "CONCURRENT",
    "CONDITION",
    "CONNECT",
    "CONNECT_BY_ROOT",
    "CONNECTION",
    "CONSTANT",
    "CONSTRAINT",
    "CONTAINS",
    "CONTENT",
    "CONTINUE",
    "COPY",
    "COUNT",
    "COUNT_BIG",
    "CREATE",
    "CREATEIN",
    "CROSS",
    "CUBE",
    "CUME_DIST",
    "CURRENT",
    "CURRENT_DATE",
    "CURRENT_PATH",
    "CURRENT_SCHEMA",
    "CURRENT_SERVER",
    "CURRENT_TIME",
    "CURRENT_TIMESTAMP",
    "CURRENT_TIMEZONE",
    "CURRENT_USER",
    "CURSOR",
    "CYCLE",
    "DATABASE",
    "DATAPARTITIONNAME",
    "DATAPARTITIONNUM",
    "DAY",
    "DAYS",
    "DB2GENERAL",
    "DB2GENRL",
    "DB2SQL",
    "DBINFO",
    "DBPARTITIONNAME",
    "DBPARTITIONNUM",
    "DEACTIVATE",
    "DEALLOCATE",
    "DECLARE",
    "DEFAULT",
    "DEFAULTS",
    "DEFER",
    "DEFINE",
    "DEFINITION",
    "DELETE",
    "DELETING",
    "DENSE_RANK",
    "DENSERANK",
    "DESC",
    "DESCRIBE",
    "DESCRIPTOR",
    "DETACH",
    "DETERMINISTIC",
    "DIAGNOSTICS",
    "DISABLE",
    "DISALLOW",
    "DISCONNECT",
    "DISTINCT",
    "DO",
    "DOCUMENT",
    "DROP",
    "DYNAMIC",
    "EACH",
    "ELSE",
    "ELSEIF",
    "EMPTY",
    "ENABLE",
    "ENCODING",
    "ENCRYPTION",
    "END",
    "END-EXEC",
    "ENDING",
    "ENFORCED",
    "ERROR",
    "ESCAPE",
    "EVERY",
    "EXCEPT",
    "EXCEPTION",
    "EXCLUDING",
    "EXCLUSIVE",
    "EXECUTE",
    "EXISTS",
    "EXIT",
    "EXTEND",
    "EXTERNAL",
    "EXTRACT",
    "FALSE",
    "FENCED",
    "FETCH",
    "FIELDPROC",
    "FILE",
    "FINAL",
    "FIRST_VALUE",
    "FOR",
    "FOREIGN",
    "FORMAT",
    "FREE",
    "FREEPAGE",
    "FROM",
    "FULL",
    "FUNCTION",
    "GBPCACHE",
    "GENERAL",
    "GENERATED",
    "GET",
    "GLOBAL",
    "GO",
    "GOTO",
    "GRANT",
    "GROUP",
    "HANDLER",
    "HASH",
    "HASH_ROW",
    "HASHED_VALUE",
    "HAVING",
    "HINT",
    "HOLD",
    "HOUR",
    "HOURS",
    // 'ID', Not actually a reserved keyword
    "IDENTITY",
    "IF",
    "IGNORE",
    "IMMEDIATE",
    "IMPLICITLY",
    "IN",
    "INCLUDE",
    "INCLUDING",
    "INCLUSIVE",
    "INCREMENT",
    "INDEX",
    "INDEXBP",
    "INDICATOR",
    "INF",
    "INFINITY",
    "INHERIT",
    "INLINE",
    "INNER",
    "INOUT",
    "INSENSITIVE",
    "INSERT",
    "INSERTING",
    "INTEGRITY",
    "INTERPRET",
    "INTERSECT",
    "INTO",
    "IS",
    "ISNULL",
    "ISOLATION",
    "ITERATE",
    "JAVA",
    "JOIN",
    "JSON",
    "JSON_ARRAY",
    "JSON_ARRAYAGG",
    "JSON_EXISTS",
    "JSON_OBJECT",
    "JSON_OBJECTAGG",
    "JSON_QUERY",
    "JSON_TABLE",
    "JSON_VALUE",
    "KEEP",
    "KEY",
    "KEYS",
    "LABEL",
    "LAG",
    "LANGUAGE",
    "LAST_VALUE",
    "LATERAL",
    "LEAD",
    "LEAVE",
    "LEFT",
    "LEVEL2",
    "LIKE",
    "LIMIT",
    "LINKTYPE",
    "LISTAGG",
    "LOCAL",
    "LOCALDATE",
    "LOCALTIME",
    "LOCALTIMESTAMP",
    "LOCATION",
    "LOCATOR",
    "LOCK",
    "LOCKSIZE",
    "LOG",
    "LOGGED",
    "LOOP",
    "MAINTAINED",
    "MASK",
    "MATCHED",
    "MATERIALIZED",
    "MAXVALUE",
    "MERGE",
    "MICROSECOND",
    "MICROSECONDS",
    "MINPCTUSED",
    "MINUTE",
    "MINUTES",
    "MINVALUE",
    "MIRROR",
    "MIXED",
    "MODE",
    "MODIFIES",
    "MONTH",
    "MONTHS",
    "NAMESPACE",
    "NAN",
    "NATIONAL",
    "NCHAR",
    "NCLOB",
    "NESTED",
    "NEW",
    "NEW_TABLE",
    "NEXTVAL",
    "NO",
    "NOCACHE",
    "NOCYCLE",
    "NODENAME",
    "NODENUMBER",
    "NOMAXVALUE",
    "NOMINVALUE",
    "NONE",
    "NOORDER",
    "NORMALIZED",
    "NOT",
    "NOTNULL",
    "NTH_VALUE",
    "NTILE",
    "NULL",
    "NULLS",
    "NVARCHAR",
    "OBID",
    "OBJECT",
    "OF",
    "OFF",
    "OFFSET",
    "OLD",
    "OLD_TABLE",
    "OMIT",
    "ON",
    "ONLY",
    "OPEN",
    "OPTIMIZE",
    "OPTION",
    "OR",
    "ORDER",
    "ORDINALITY",
    "ORGANIZE",
    "OUT",
    "OUTER",
    "OVER",
    "OVERLAY",
    "OVERRIDING",
    "PACKAGE",
    "PADDED",
    "PAGE",
    "PAGESIZE",
    "PARAMETER",
    "PART",
    "PARTITION",
    "PARTITIONED",
    "PARTITIONING",
    "PARTITIONS",
    "PASSING",
    "PASSWORD",
    "PATH",
    "PCTFREE",
    "PERCENT_RANK",
    "PERCENTILE_CONT",
    "PERCENTILE_DISC",
    "PERIOD",
    "PERMISSION",
    "PIECESIZE",
    "PIPE",
    "PLAN",
    "POSITION",
    "PREPARE",
    "PREVVAL",
    "PRIMARY",
    "PRIOR",
    "PRIQTY",
    "PRIVILEGES",
    "PROCEDURE",
    "PROGRAM",
    "PROGRAMID",
    "QUERY",
    "RANGE",
    "RANK",
    "RATIO_TO_REPORT",
    "RCDFMT",
    "READ",
    "READS",
    "RECOVERY",
    "REFERENCES",
    "REFERENCING",
    "REFRESH",
    "REGEXP_LIKE",
    "RELEASE",
    "RENAME",
    "REPEAT",
    "RESET",
    "RESIGNAL",
    "RESTART",
    "RESULT",
    "RESULT_SET_LOCATOR",
    "RETURN",
    "RETURNING",
    "RETURNS",
    "REVOKE",
    "RID",
    "RIGHT",
    "ROLLBACK",
    "ROLLUP",
    "ROUTINE",
    "ROW",
    "ROW_NUMBER",
    "ROWNUMBER",
    "ROWS",
    "RRN",
    "RUN",
    "SAVEPOINT",
    "SBCS",
    "SCALAR",
    "SCHEMA",
    "SCRATCHPAD",
    "SCROLL",
    "SEARCH",
    "SECOND",
    "SECONDS",
    "SECQTY",
    "SECURED",
    "SELECT",
    "SENSITIVE",
    "SEQUENCE",
    "SESSION",
    "SESSION_USER",
    "SET",
    "SIGNAL",
    "SIMPLE",
    "SKIP",
    "SNAN",
    "SOME",
    "SOURCE",
    "SPECIFIC",
    "SQL",
    "SQLID",
    "SQLIND_DEFAULT",
    "SQLIND_UNASSIGNED",
    "STACKED",
    "START",
    "STARTING",
    "STATEMENT",
    "STATIC",
    "STOGROUP",
    "SUBSTRING",
    "SUMMARY",
    "SYNONYM",
    "SYSTEM_TIME",
    "SYSTEM_USER",
    "TABLE",
    "TABLESPACE",
    "TABLESPACES",
    "TAG",
    "THEN",
    "THREADSAFE",
    "TO",
    "TRANSACTION",
    "TRANSFER",
    "TRIGGER",
    "TRIM",
    "TRIM_ARRAY",
    "TRUE",
    "TRUNCATE",
    "TRY_CAST",
    "TYPE",
    "UNDO",
    "UNION",
    "UNIQUE",
    "UNIT",
    "UNKNOWN",
    "UNNEST",
    "UNTIL",
    "UPDATE",
    "UPDATING",
    "URI",
    "USAGE",
    "USE",
    "USER",
    "USERID",
    "USING",
    "VALUE",
    "VALUES",
    "VARIABLE",
    "VARIANT",
    "VCAT",
    "VERSION",
    "VERSIONING",
    "VIEW",
    "VOLATILE",
    "WAIT",
    "WHEN",
    "WHENEVER",
    "WHERE",
    "WHILE",
    "WITH",
    "WITHIN",
    "WITHOUT",
    "WRAPPED",
    "WRAPPER",
    "WRITE",
    "WRKSTNNAME",
    "XMLAGG",
    "XMLATTRIBUTES",
    "XMLCAST",
    "XMLCOMMENT",
    "XMLCONCAT",
    "XMLDOCUMENT",
    "XMLELEMENT",
    "XMLFOREST",
    "XMLGROUP",
    "XMLNAMESPACES",
    "XMLPARSE",
    "XMLPI",
    "XMLROW",
    "XMLSERIALIZE",
    "XMLTABLE",
    "XMLTEXT",
    "XMLVALIDATE",
    "XSLTRANSFORM",
    "XSROBJECT",
    "YEAR",
    "YEARS",
    "YES",
    "ZONE"
  ];
  var dataTypes3 = [
    // https://www.ibm.com/docs/en/i/7.2?topic=iaodsd-odbc-data-types-how-they-correspond-db2-i-database-types
    "ARRAY",
    "BIGINT",
    "BINARY",
    "BIT",
    "BLOB",
    "BOOLEAN",
    "CCSID",
    "CHAR",
    "CHARACTER",
    "CLOB",
    "DATA",
    "DATALINK",
    "DATE",
    "DBCLOB",
    "DECFLOAT",
    "DECIMAL",
    "DEC",
    "DOUBLE",
    "DOUBLE PRECISION",
    "FLOAT",
    "GRAPHIC",
    "INT",
    "INTEGER",
    "LONG",
    "NUMERIC",
    "REAL",
    "ROWID",
    "SMALLINT",
    "TIME",
    "TIMESTAMP",
    "VARBINARY",
    "VARCHAR",
    "VARGRAPHIC",
    "XML"
  ];
  var reservedSelect3 = expandPhrases(["SELECT [ALL | DISTINCT]"]);
  var reservedClauses3 = expandPhrases([
    // queries
    "WITH [RECURSIVE]",
    "INTO",
    "FROM",
    "WHERE",
    "GROUP BY",
    "HAVING",
    "PARTITION BY",
    "ORDER [SIBLINGS] BY [INPUT SEQUENCE]",
    "LIMIT",
    "OFFSET",
    "FETCH {FIRST | NEXT}",
    "FOR UPDATE [OF]",
    "FOR READ ONLY",
    "OPTIMIZE FOR",
    // Data modification
    // - insert:
    "INSERT INTO",
    "VALUES",
    // - update:
    "SET",
    // - merge:
    "MERGE INTO",
    "WHEN [NOT] MATCHED [THEN]",
    "UPDATE SET",
    "DELETE",
    "INSERT",
    // Data definition - table
    "FOR SYSTEM NAME"
  ]);
  var standardOnelineClauses3 = expandPhrases(["CREATE [OR REPLACE] TABLE"]);
  var tabularOnelineClauses3 = expandPhrases([
    // - create:
    "CREATE [OR REPLACE] [RECURSIVE] VIEW",
    // - update:
    "UPDATE",
    "WHERE CURRENT OF",
    "WITH {NC | RR | RS | CS | UR}",
    // - delete:
    "DELETE FROM",
    // - drop table:
    "DROP TABLE",
    // alter table:
    "ALTER TABLE",
    "ADD [COLUMN]",
    "ALTER [COLUMN]",
    "DROP [COLUMN]",
    "SET DATA TYPE",
    // for alter column
    "SET {GENERATED ALWAYS | GENERATED BY DEFAULT}",
    // for alter column
    "SET NOT NULL",
    // for alter column
    "SET {NOT HIDDEN | IMPLICITLY HIDDEN}",
    // for alter column
    "SET FIELDPROC",
    // for alter column
    "DROP {DEFAULT | NOT NULL | GENERATED | IDENTITY | ROW CHANGE TIMESTAMP | FIELDPROC}",
    // for alter column
    // - truncate:
    "TRUNCATE [TABLE]",
    // other
    "SET [CURRENT] SCHEMA",
    "SET CURRENT_SCHEMA",
    // https://www.ibm.com/docs/en/i/7.5?topic=reference-statements
    "ALLOCATE CURSOR",
    "ALLOCATE [SQL] DESCRIPTOR [LOCAL | GLOBAL] SQL",
    "ALTER [SPECIFIC] {FUNCTION | PROCEDURE}",
    "ALTER {MASK | PERMISSION | SEQUENCE | TRIGGER}",
    "ASSOCIATE [RESULT SET] {LOCATOR | LOCATORS}",
    "BEGIN DECLARE SECTION",
    "CALL",
    "CLOSE",
    "COMMENT ON {ALIAS | COLUMN | CONSTRAINT | INDEX | MASK | PACKAGE | PARAMETER | PERMISSION | SEQUENCE | TABLE | TRIGGER | VARIABLE | XSROBJECT}",
    "COMMENT ON [SPECIFIC] {FUNCTION | PROCEDURE | ROUTINE}",
    "COMMENT ON PARAMETER SPECIFIC {FUNCTION | PROCEDURE | ROUTINE}",
    "COMMENT ON [TABLE FUNCTION] RETURN COLUMN",
    "COMMENT ON [TABLE FUNCTION] RETURN COLUMN SPECIFIC [PROCEDURE | ROUTINE]",
    "COMMIT [WORK] [HOLD]",
    "CONNECT [TO | RESET] USER",
    "CREATE [OR REPLACE] {ALIAS | FUNCTION | MASK | PERMISSION | PROCEDURE | SEQUENCE | TRIGGER | VARIABLE}",
    "CREATE [ENCODED VECTOR] INDEX",
    "CREATE UNIQUE [WHERE NOT NULL] INDEX",
    "CREATE SCHEMA",
    "CREATE TYPE",
    "DEALLOCATE [SQL] DESCRIPTOR [LOCAL | GLOBAL]",
    "DECLARE CURSOR",
    "DECLARE GLOBAL TEMPORARY TABLE",
    "DECLARE",
    "DESCRIBE CURSOR",
    "DESCRIBE INPUT",
    "DESCRIBE [OUTPUT]",
    "DESCRIBE {PROCEDURE | ROUTINE}",
    "DESCRIBE TABLE",
    "DISCONNECT ALL [SQL]",
    "DISCONNECT [CURRENT]",
    "DROP {ALIAS | INDEX | MASK | PACKAGE | PERMISSION | SCHEMA | SEQUENCE | TABLE | TYPE | VARIABLE | XSROBJECT} [IF EXISTS]",
    "DROP [SPECIFIC] {FUNCTION | PROCEDURE | ROUTINE} [IF EXISTS]",
    "END DECLARE SECTION",
    "EXECUTE [IMMEDIATE]",
    // 'FETCH {NEXT | PRIOR | FIRST | LAST | BEFORE | AFTER | CURRENT} [FROM]',
    "FREE LOCATOR",
    "GET [SQL] DESCRIPTOR [LOCAL | GLOBAL]",
    "GET [CURRENT | STACKED] DIAGNOSTICS",
    "GRANT {ALL [PRIVILEGES] | ALTER | EXECUTE} ON {FUNCTION | PROCEDURE | ROUTINE | PACKAGE | SCHEMA | SEQUENCE | TABLE | TYPE | VARIABLE | XSROBJECT}",
    "HOLD LOCATOR",
    "INCLUDE",
    "LABEL ON {ALIAS | COLUMN | CONSTRAINT | INDEX | MASK | PACKAGE | PERMISSION | SEQUENCE | TABLE | TRIGGER | VARIABLE | XSROBJECT}",
    "LABEL ON [SPECIFIC] {FUNCTION | PROCEDURE | ROUTINE}",
    "LOCK TABLE",
    "OPEN",
    "PREPARE",
    "REFRESH TABLE",
    "RELEASE",
    "RELEASE [TO] SAVEPOINT",
    "RENAME [TABLE | INDEX] TO",
    "REVOKE {ALL [PRIVILEGES] | ALTER | EXECUTE} ON {FUNCTION | PROCEDURE | ROUTINE | PACKAGE | SCHEMA | SEQUENCE | TABLE | TYPE | VARIABLE | XSROBJECT}",
    "ROLLBACK [WORK] [HOLD | TO SAVEPOINT]",
    "SAVEPOINT",
    "SET CONNECTION",
    "SET CURRENT {DEBUG MODE | DECFLOAT ROUNDING MODE | DEGREE | IMPLICIT XMLPARSE OPTION | TEMPORAL SYSTEM_TIME}",
    "SET [SQL] DESCRIPTOR [LOCAL | GLOBAL]",
    "SET ENCRYPTION PASSWORD",
    "SET OPTION",
    "SET {[CURRENT [FUNCTION]] PATH | CURRENT_PATH}",
    "SET RESULT SETS [WITH RETURN [TO CALLER | TO CLIENT]]",
    "SET SESSION AUTHORIZATION",
    "SET SESSION_USER",
    "SET TRANSACTION",
    "SIGNAL SQLSTATE [VALUE]",
    "TAG",
    "TRANSFER OWNERSHIP OF",
    "WHENEVER {NOT FOUND | SQLERROR | SQLWARNING}"
  ]);
  var reservedSetOperations3 = expandPhrases(["UNION [ALL]", "EXCEPT [ALL]", "INTERSECT [ALL]"]);
  var reservedJoins3 = expandPhrases([
    "JOIN",
    "{LEFT | RIGHT | FULL} [OUTER] JOIN",
    "[LEFT | RIGHT] EXCEPTION JOIN",
    "{INNER | CROSS} JOIN"
  ]);
  var reservedPhrases3 = expandPhrases([
    "ON DELETE",
    "ON UPDATE",
    "SET NULL",
    "{ROWS | RANGE} BETWEEN"
  ]);
  var db2i = {
    name: "db2i",
    tokenizerOptions: {
      reservedSelect: reservedSelect3,
      reservedClauses: [...reservedClauses3, ...standardOnelineClauses3, ...tabularOnelineClauses3],
      reservedSetOperations: reservedSetOperations3,
      reservedJoins: reservedJoins3,
      reservedPhrases: reservedPhrases3,
      reservedKeywords: keywords3,
      reservedDataTypes: dataTypes3,
      reservedFunctionNames: functions3,
      nestedBlockComments: true,
      extraParens: ["[]"],
      stringTypes: [
        { quote: "''-qq", prefixes: ["G", "N"] },
        { quote: "''-raw", prefixes: ["X", "BX", "GX", "UX"], requirePrefix: true }
      ],
      identTypes: [`""-qq`],
      identChars: { first: "@#$", rest: "@#$" },
      paramTypes: { positional: true, named: [":"] },
      paramChars: { first: "@#$", rest: "@#$" },
      operators: ["**", "\xAC=", "\xAC>", "\xAC<", "!>", "!<", "||", "=>"]
    },
    formatOptions: {
      onelineClauses: [...standardOnelineClauses3, ...tabularOnelineClauses3],
      tabularOnelineClauses: tabularOnelineClauses3
    }
  };
  var functions4 = [
    // https://cwiki.apache.org/confluence/display/Hive/LanguageManual+UDF
    // math
    "ABS",
    "ACOS",
    "ASIN",
    "ATAN",
    "BIN",
    "BROUND",
    "CBRT",
    "CEIL",
    "CEILING",
    "CONV",
    "COS",
    "DEGREES",
    // 'E',
    "EXP",
    "FACTORIAL",
    "FLOOR",
    "GREATEST",
    "HEX",
    "LEAST",
    "LN",
    "LOG",
    "LOG10",
    "LOG2",
    "NEGATIVE",
    "PI",
    "PMOD",
    "POSITIVE",
    "POW",
    "POWER",
    "RADIANS",
    "RAND",
    "ROUND",
    "SHIFTLEFT",
    "SHIFTRIGHT",
    "SHIFTRIGHTUNSIGNED",
    "SIGN",
    "SIN",
    "SQRT",
    "TAN",
    "UNHEX",
    "WIDTH_BUCKET",
    // array
    "ARRAY_CONTAINS",
    "MAP_KEYS",
    "MAP_VALUES",
    "SIZE",
    "SORT_ARRAY",
    // conversion
    "BINARY",
    "CAST",
    // date
    "ADD_MONTHS",
    "DATE",
    "DATE_ADD",
    "DATE_FORMAT",
    "DATE_SUB",
    "DATEDIFF",
    "DAY",
    "DAYNAME",
    "DAYOFMONTH",
    "DAYOFYEAR",
    "EXTRACT",
    "FROM_UNIXTIME",
    "FROM_UTC_TIMESTAMP",
    "HOUR",
    "LAST_DAY",
    "MINUTE",
    "MONTH",
    "MONTHS_BETWEEN",
    "NEXT_DAY",
    "QUARTER",
    "SECOND",
    "TIMESTAMP",
    "TO_DATE",
    "TO_UTC_TIMESTAMP",
    "TRUNC",
    "UNIX_TIMESTAMP",
    "WEEKOFYEAR",
    "YEAR",
    // conditional
    "ASSERT_TRUE",
    "COALESCE",
    "IF",
    "ISNOTNULL",
    "ISNULL",
    "NULLIF",
    "NVL",
    // string
    "ASCII",
    "BASE64",
    "CHARACTER_LENGTH",
    "CHR",
    "CONCAT",
    "CONCAT_WS",
    "CONTEXT_NGRAMS",
    "DECODE",
    "ELT",
    "ENCODE",
    "FIELD",
    "FIND_IN_SET",
    "FORMAT_NUMBER",
    "GET_JSON_OBJECT",
    "IN_FILE",
    "INITCAP",
    "INSTR",
    "LCASE",
    "LENGTH",
    "LEVENSHTEIN",
    "LOCATE",
    "LOWER",
    "LPAD",
    "LTRIM",
    "NGRAMS",
    "OCTET_LENGTH",
    "PARSE_URL",
    "PRINTF",
    "QUOTE",
    "REGEXP_EXTRACT",
    "REGEXP_REPLACE",
    "REPEAT",
    "REVERSE",
    "RPAD",
    "RTRIM",
    "SENTENCES",
    "SOUNDEX",
    "SPACE",
    "SPLIT",
    "STR_TO_MAP",
    "SUBSTR",
    "SUBSTRING",
    "TRANSLATE",
    "TRIM",
    "UCASE",
    "UNBASE64",
    "UPPER",
    // masking
    "MASK",
    "MASK_FIRST_N",
    "MASK_HASH",
    "MASK_LAST_N",
    "MASK_SHOW_FIRST_N",
    "MASK_SHOW_LAST_N",
    // misc
    "AES_DECRYPT",
    "AES_ENCRYPT",
    "CRC32",
    "CURRENT_DATABASE",
    "CURRENT_USER",
    "HASH",
    "JAVA_METHOD",
    "LOGGED_IN_USER",
    "MD5",
    "REFLECT",
    "SHA",
    "SHA1",
    "SHA2",
    "SURROGATE_KEY",
    "VERSION",
    // aggregate
    "AVG",
    "COLLECT_LIST",
    "COLLECT_SET",
    "CORR",
    "COUNT",
    "COVAR_POP",
    "COVAR_SAMP",
    "HISTOGRAM_NUMERIC",
    "MAX",
    "MIN",
    "NTILE",
    "PERCENTILE",
    "PERCENTILE_APPROX",
    "REGR_AVGX",
    "REGR_AVGY",
    "REGR_COUNT",
    "REGR_INTERCEPT",
    "REGR_R2",
    "REGR_SLOPE",
    "REGR_SXX",
    "REGR_SXY",
    "REGR_SYY",
    "STDDEV_POP",
    "STDDEV_SAMP",
    "SUM",
    "VAR_POP",
    "VAR_SAMP",
    "VARIANCE",
    // table
    "EXPLODE",
    "INLINE",
    "JSON_TUPLE",
    "PARSE_URL_TUPLE",
    "POSEXPLODE",
    "STACK",
    // https://cwiki.apache.org/confluence/display/Hive/LanguageManual+WindowingAndAnalytics
    "LEAD",
    "LAG",
    "FIRST_VALUE",
    "LAST_VALUE",
    "RANK",
    "ROW_NUMBER",
    "DENSE_RANK",
    "CUME_DIST",
    "PERCENT_RANK",
    "NTILE"
  ];
  var keywords4 = [
    // https://cwiki.apache.org/confluence/display/hive/languagemanual+ddl
    // Non-reserved keywords have proscribed meanings in. HiveQL, but can still be used as table or column names
    "ADD",
    "ADMIN",
    "AFTER",
    "ANALYZE",
    "ARCHIVE",
    "ASC",
    "BEFORE",
    "BUCKET",
    "BUCKETS",
    "CASCADE",
    "CHANGE",
    "CLUSTER",
    "CLUSTERED",
    "CLUSTERSTATUS",
    "COLLECTION",
    "COLUMNS",
    "COMMENT",
    "COMPACT",
    "COMPACTIONS",
    "COMPUTE",
    "CONCATENATE",
    "CONTINUE",
    "DATA",
    "DATABASES",
    "DATETIME",
    "DAY",
    "DBPROPERTIES",
    "DEFERRED",
    "DEFINED",
    "DELIMITED",
    "DEPENDENCY",
    "DESC",
    "DIRECTORIES",
    "DIRECTORY",
    "DISABLE",
    "DISTRIBUTE",
    "ELEM_TYPE",
    "ENABLE",
    "ESCAPED",
    "EXCLUSIVE",
    "EXPLAIN",
    "EXPORT",
    "FIELDS",
    "FILE",
    "FILEFORMAT",
    "FIRST",
    "FORMAT",
    "FORMATTED",
    "FUNCTIONS",
    "HOLD_DDLTIME",
    "HOUR",
    "IDXPROPERTIES",
    "IGNORE",
    "INDEX",
    "INDEXES",
    "INPATH",
    "INPUTDRIVER",
    "INPUTFORMAT",
    "ITEMS",
    "JAR",
    "KEYS",
    "KEY_TYPE",
    "LIMIT",
    "LINES",
    "LOAD",
    "LOCATION",
    "LOCK",
    "LOCKS",
    "LOGICAL",
    "LONG",
    "MAPJOIN",
    "MATERIALIZED",
    "METADATA",
    "MINUS",
    "MINUTE",
    "MONTH",
    "MSCK",
    "NOSCAN",
    "NO_DROP",
    "OFFLINE",
    "OPTION",
    "OUTPUTDRIVER",
    "OUTPUTFORMAT",
    "OVERWRITE",
    "OWNER",
    "PARTITIONED",
    "PARTITIONS",
    "PLUS",
    "PRETTY",
    "PRINCIPALS",
    "PROTECTION",
    "PURGE",
    "READ",
    "READONLY",
    "REBUILD",
    "RECORDREADER",
    "RECORDWRITER",
    "RELOAD",
    "RENAME",
    "REPAIR",
    "REPLACE",
    "REPLICATION",
    "RESTRICT",
    "REWRITE",
    "ROLE",
    "ROLES",
    "SCHEMA",
    "SCHEMAS",
    "SECOND",
    "SEMI",
    "SERDE",
    "SERDEPROPERTIES",
    "SERVER",
    "SETS",
    "SHARED",
    "SHOW",
    "SHOW_DATABASE",
    "SKEWED",
    "SORT",
    "SORTED",
    "SSL",
    "STATISTICS",
    "STORED",
    "STREAMTABLE",
    "STRING",
    "TABLES",
    "TBLPROPERTIES",
    "TEMPORARY",
    "TERMINATED",
    "TINYINT",
    "TOUCH",
    "TRANSACTIONS",
    "UNARCHIVE",
    "UNDO",
    "UNIONTYPE",
    "UNLOCK",
    "UNSET",
    "UNSIGNED",
    "URI",
    "USE",
    "UTC",
    "UTCTIMESTAMP",
    "VALUE_TYPE",
    "VIEW",
    "WHILE",
    "YEAR",
    "AUTOCOMMIT",
    "ISOLATION",
    "LEVEL",
    "OFFSET",
    "SNAPSHOT",
    "TRANSACTION",
    "WORK",
    "WRITE",
    "ABORT",
    "KEY",
    "LAST",
    "NORELY",
    "NOVALIDATE",
    "NULLS",
    "RELY",
    "VALIDATE",
    "DETAIL",
    "DOW",
    "EXPRESSION",
    "OPERATOR",
    "QUARTER",
    "SUMMARY",
    "VECTORIZATION",
    "WEEK",
    "YEARS",
    "MONTHS",
    "WEEKS",
    "DAYS",
    "HOURS",
    "MINUTES",
    "SECONDS",
    "TIMESTAMPTZ",
    "ZONE",
    // reserved
    "ALL",
    "ALTER",
    "AND",
    "AS",
    "AUTHORIZATION",
    "BETWEEN",
    "BOTH",
    "BY",
    "CASE",
    "CAST",
    "COLUMN",
    "CONF",
    "CREATE",
    "CROSS",
    "CUBE",
    "CURRENT",
    "CURRENT_DATE",
    "CURRENT_TIMESTAMP",
    "CURSOR",
    "DATABASE",
    "DELETE",
    "DESCRIBE",
    "DISTINCT",
    "DROP",
    "ELSE",
    "END",
    "EXCHANGE",
    "EXISTS",
    "EXTENDED",
    "EXTERNAL",
    "FALSE",
    "FETCH",
    "FOLLOWING",
    "FOR",
    "FROM",
    "FULL",
    "FUNCTION",
    "GRANT",
    "GROUP",
    "GROUPING",
    "HAVING",
    "IF",
    "IMPORT",
    "IN",
    "INNER",
    "INSERT",
    "INTERSECT",
    "INTO",
    "IS",
    "JOIN",
    "LATERAL",
    "LEFT",
    "LESS",
    "LIKE",
    "LOCAL",
    "MACRO",
    "MORE",
    "NONE",
    "NOT",
    "NULL",
    "OF",
    "ON",
    "OR",
    "ORDER",
    "OUT",
    "OUTER",
    "OVER",
    "PARTIALSCAN",
    "PARTITION",
    "PERCENT",
    "PRECEDING",
    "PRESERVE",
    "PROCEDURE",
    "RANGE",
    "READS",
    "REDUCE",
    "REVOKE",
    "RIGHT",
    "ROLLUP",
    "ROW",
    "ROWS",
    "SELECT",
    "SET",
    "TABLE",
    "TABLESAMPLE",
    "THEN",
    "TO",
    "TRANSFORM",
    "TRIGGER",
    "TRUE",
    "TRUNCATE",
    "UNBOUNDED",
    "UNION",
    "UNIQUEJOIN",
    "UPDATE",
    "USER",
    "USING",
    "UTC_TMESTAMP",
    "VALUES",
    "WHEN",
    "WHERE",
    "WINDOW",
    "WITH",
    "COMMIT",
    "ONLY",
    "REGEXP",
    "RLIKE",
    "ROLLBACK",
    "START",
    "CACHE",
    "CONSTRAINT",
    "FOREIGN",
    "PRIMARY",
    "REFERENCES",
    "DAYOFWEEK",
    "EXTRACT",
    "FLOOR",
    "VIEWS",
    "TIME",
    "SYNC",
    // fileTypes
    "TEXTFILE",
    "SEQUENCEFILE",
    "ORC",
    "CSV",
    "TSV",
    "PARQUET",
    "AVRO",
    "RCFILE",
    "JSONFILE",
    "INPUTFORMAT",
    "OUTPUTFORMAT"
  ];
  var dataTypes4 = [
    // https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Types
    "ARRAY",
    "BIGINT",
    "BINARY",
    "BOOLEAN",
    "CHAR",
    "DATE",
    "DECIMAL",
    "DOUBLE",
    "FLOAT",
    "INT",
    "INTEGER",
    "INTERVAL",
    "MAP",
    "NUMERIC",
    "PRECISION",
    "SMALLINT",
    "STRUCT",
    "TIMESTAMP",
    "VARCHAR"
  ];
  var reservedSelect4 = expandPhrases(["SELECT [ALL | DISTINCT]"]);
  var reservedClauses4 = expandPhrases([
    // queries
    "WITH",
    "FROM",
    "WHERE",
    "GROUP BY",
    "HAVING",
    "WINDOW",
    "PARTITION BY",
    "ORDER BY",
    "SORT BY",
    "CLUSTER BY",
    "DISTRIBUTE BY",
    "LIMIT",
    // Data manipulation
    // - insert:
    //   Hive does not actually support plain INSERT INTO, only INSERT INTO TABLE
    //   but it's a nuisance to not support it, as all other dialects do.
    "INSERT INTO [TABLE]",
    "VALUES",
    // - update:
    "SET",
    // - merge:
    "MERGE INTO",
    "WHEN [NOT] MATCHED [THEN]",
    "UPDATE SET",
    "INSERT [VALUES]",
    // - insert overwrite directory:
    //   https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DML#LanguageManualDML-Writingdataintothefilesystemfromqueries
    "INSERT OVERWRITE [LOCAL] DIRECTORY",
    // - load:
    //   https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DML#LanguageManualDML-Loadingfilesintotables
    "LOAD DATA [LOCAL] INPATH",
    "[OVERWRITE] INTO TABLE"
  ]);
  var standardOnelineClauses4 = expandPhrases([
    "CREATE [TEMPORARY] [EXTERNAL] TABLE [IF NOT EXISTS]"
  ]);
  var tabularOnelineClauses4 = expandPhrases([
    // - create:
    "CREATE [MATERIALIZED] VIEW [IF NOT EXISTS]",
    // - update:
    "UPDATE",
    // - delete:
    "DELETE FROM",
    // - drop table:
    "DROP TABLE [IF EXISTS]",
    // - alter table:
    "ALTER TABLE",
    "RENAME TO",
    // - truncate:
    "TRUNCATE [TABLE]",
    // other
    "ALTER",
    "CREATE",
    "USE",
    "DESCRIBE",
    "DROP",
    "FETCH",
    "SHOW",
    "STORED AS",
    "STORED BY",
    "ROW FORMAT"
  ]);
  var reservedSetOperations4 = expandPhrases(["UNION [ALL | DISTINCT]"]);
  var reservedJoins4 = expandPhrases([
    "JOIN",
    "{LEFT | RIGHT | FULL} [OUTER] JOIN",
    "{INNER | CROSS} JOIN",
    // non-standard joins
    "LEFT SEMI JOIN"
  ]);
  var reservedPhrases4 = expandPhrases(["{ROWS | RANGE} BETWEEN"]);
  var hive = {
    name: "hive",
    tokenizerOptions: {
      reservedSelect: reservedSelect4,
      reservedClauses: [...reservedClauses4, ...standardOnelineClauses4, ...tabularOnelineClauses4],
      reservedSetOperations: reservedSetOperations4,
      reservedJoins: reservedJoins4,
      reservedPhrases: reservedPhrases4,
      reservedKeywords: keywords4,
      reservedDataTypes: dataTypes4,
      reservedFunctionNames: functions4,
      extraParens: ["[]"],
      stringTypes: ['""-bs', "''-bs"],
      identTypes: ["``"],
      variableTypes: [{ quote: "{}", prefixes: ["$"], requirePrefix: true }],
      operators: ["%", "~", "^", "|", "&", "<=>", "==", "!", "||"]
    },
    formatOptions: {
      onelineClauses: [...standardOnelineClauses4, ...tabularOnelineClauses4],
      tabularOnelineClauses: tabularOnelineClauses4
    }
  };
  function postProcess2(tokens) {
    return tokens.map((token, i) => {
      const nextToken = tokens[i + 1] || EOF_TOKEN;
      if (isToken.SET(token) && nextToken.text === "(") {
        return __spreadProps(__spreadValues({}, token), {
          type: "RESERVED_FUNCTION_NAME"
          /* RESERVED_FUNCTION_NAME */
        });
      }
      const prevToken = tokens[i - 1] || EOF_TOKEN;
      if (isToken.VALUES(token) && prevToken.text === "=") {
        return __spreadProps(__spreadValues({}, token), {
          type: "RESERVED_FUNCTION_NAME"
          /* RESERVED_FUNCTION_NAME */
        });
      }
      return token;
    });
  }
  var keywords5 = [
    // https://mariadb.com/kb/en/reserved-words/
    "ACCESSIBLE",
    "ADD",
    "ALL",
    "ALTER",
    "ANALYZE",
    "AND",
    "AS",
    "ASC",
    "ASENSITIVE",
    "BEFORE",
    "BETWEEN",
    "BOTH",
    "BY",
    "CALL",
    "CASCADE",
    "CASE",
    "CHANGE",
    "CHECK",
    "COLLATE",
    "COLUMN",
    "CONDITION",
    "CONSTRAINT",
    "CONTINUE",
    "CONVERT",
    "CREATE",
    "CROSS",
    "CURRENT_DATE",
    "CURRENT_ROLE",
    "CURRENT_TIME",
    "CURRENT_TIMESTAMP",
    "CURRENT_USER",
    "CURSOR",
    "DATABASE",
    "DATABASES",
    "DAY_HOUR",
    "DAY_MICROSECOND",
    "DAY_MINUTE",
    "DAY_SECOND",
    "DECLARE",
    "DEFAULT",
    "DELAYED",
    "DELETE",
    "DELETE_DOMAIN_ID",
    "DESC",
    "DESCRIBE",
    "DETERMINISTIC",
    "DISTINCT",
    "DISTINCTROW",
    "DIV",
    "DO_DOMAIN_IDS",
    "DROP",
    "DUAL",
    "EACH",
    "ELSE",
    "ELSEIF",
    "ENCLOSED",
    "ESCAPED",
    "EXCEPT",
    "EXISTS",
    "EXIT",
    "EXPLAIN",
    "FALSE",
    "FETCH",
    "FOR",
    "FORCE",
    "FOREIGN",
    "FROM",
    "FULLTEXT",
    "GENERAL",
    "GRANT",
    "GROUP",
    "HAVING",
    "HIGH_PRIORITY",
    "HOUR_MICROSECOND",
    "HOUR_MINUTE",
    "HOUR_SECOND",
    "IF",
    "IGNORE",
    "IGNORE_DOMAIN_IDS",
    "IGNORE_SERVER_IDS",
    "IN",
    "INDEX",
    "INFILE",
    "INNER",
    "INOUT",
    "INSENSITIVE",
    "INSERT",
    "INTERSECT",
    "INTERVAL",
    "INTO",
    "IS",
    "ITERATE",
    "JOIN",
    "KEY",
    "KEYS",
    "KILL",
    "LEADING",
    "LEAVE",
    "LEFT",
    "LIKE",
    "LIMIT",
    "LINEAR",
    "LINES",
    "LOAD",
    "LOCALTIME",
    "LOCALTIMESTAMP",
    "LOCK",
    "LOOP",
    "LOW_PRIORITY",
    "MASTER_HEARTBEAT_PERIOD",
    "MASTER_SSL_VERIFY_SERVER_CERT",
    "MATCH",
    "MAXVALUE",
    "MINUTE_MICROSECOND",
    "MINUTE_SECOND",
    "MOD",
    "MODIFIES",
    "NATURAL",
    "NOT",
    "NO_WRITE_TO_BINLOG",
    "NULL",
    "OFFSET",
    "ON",
    "OPTIMIZE",
    "OPTION",
    "OPTIONALLY",
    "OR",
    "ORDER",
    "OUT",
    "OUTER",
    "OUTFILE",
    "OVER",
    "PAGE_CHECKSUM",
    "PARSE_VCOL_EXPR",
    "PARTITION",
    "POSITION",
    "PRIMARY",
    "PROCEDURE",
    "PURGE",
    "RANGE",
    "READ",
    "READS",
    "READ_WRITE",
    "RECURSIVE",
    "REF_SYSTEM_ID",
    "REFERENCES",
    "REGEXP",
    "RELEASE",
    "RENAME",
    "REPEAT",
    "REPLACE",
    "REQUIRE",
    "RESIGNAL",
    "RESTRICT",
    "RETURN",
    "RETURNING",
    "REVOKE",
    "RIGHT",
    "RLIKE",
    "ROW_NUMBER",
    "ROWS",
    "SCHEMA",
    "SCHEMAS",
    "SECOND_MICROSECOND",
    "SELECT",
    "SENSITIVE",
    "SEPARATOR",
    "SET",
    "SHOW",
    "SIGNAL",
    "SLOW",
    "SPATIAL",
    "SPECIFIC",
    "SQL",
    "SQLEXCEPTION",
    "SQLSTATE",
    "SQLWARNING",
    "SQL_BIG_RESULT",
    "SQL_CALC_FOUND_ROWS",
    "SQL_SMALL_RESULT",
    "SSL",
    "STARTING",
    "STATS_AUTO_RECALC",
    "STATS_PERSISTENT",
    "STATS_SAMPLE_PAGES",
    "STRAIGHT_JOIN",
    "TABLE",
    "TERMINATED",
    "THEN",
    "TO",
    "TRAILING",
    "TRIGGER",
    "TRUE",
    "UNDO",
    "UNION",
    "UNIQUE",
    "UNLOCK",
    "UNSIGNED",
    "UPDATE",
    "USAGE",
    "USE",
    "USING",
    "UTC_DATE",
    "UTC_TIME",
    "UTC_TIMESTAMP",
    "VALUES",
    "WHEN",
    "WHERE",
    "WHILE",
    "WINDOW",
    "WITH",
    "WRITE",
    "XOR",
    "YEAR_MONTH",
    "ZEROFILL"
  ];
  var dataTypes5 = [
    // https://mariadb.com/kb/en/data-types/
    "BIGINT",
    "BINARY",
    "BIT",
    "BLOB",
    "CHAR BYTE",
    "CHAR",
    "CHARACTER",
    "DATETIME",
    "DEC",
    "DECIMAL",
    "DOUBLE PRECISION",
    "DOUBLE",
    "ENUM",
    "FIXED",
    "FLOAT",
    "FLOAT4",
    "FLOAT8",
    "INT",
    "INT1",
    "INT2",
    "INT3",
    "INT4",
    "INT8",
    "INTEGER",
    "LONG",
    "LONGBLOB",
    "LONGTEXT",
    "MEDIUMBLOB",
    "MEDIUMINT",
    "MEDIUMTEXT",
    "MIDDLEINT",
    "NATIONAL CHAR",
    "NATIONAL VARCHAR",
    "NUMERIC",
    "PRECISION",
    "REAL",
    "SMALLINT",
    "TEXT",
    "TIMESTAMP",
    "TINYBLOB",
    "TINYINT",
    "TINYTEXT",
    "VARBINARY",
    "VARCHAR",
    "VARCHARACTER",
    "VARYING",
    "YEAR"
    // 'NUMBER', // ?? In oracle mode only
    // 'SET' // handled as special-case in postProcess
  ];
  var functions5 = [
    // https://mariadb.com/kb/en/information-schema-sql_functions-table/
    "ADDDATE",
    "ADD_MONTHS",
    "BIT_AND",
    "BIT_OR",
    "BIT_XOR",
    "CAST",
    "COUNT",
    "CUME_DIST",
    "CURDATE",
    "CURTIME",
    "DATE_ADD",
    "DATE_SUB",
    "DATE_FORMAT",
    "DECODE",
    "DENSE_RANK",
    "EXTRACT",
    "FIRST_VALUE",
    "GROUP_CONCAT",
    "JSON_ARRAYAGG",
    "JSON_OBJECTAGG",
    "LAG",
    "LEAD",
    "MAX",
    "MEDIAN",
    "MID",
    "MIN",
    "NOW",
    "NTH_VALUE",
    "NTILE",
    "POSITION",
    "PERCENT_RANK",
    "PERCENTILE_CONT",
    "PERCENTILE_DISC",
    "RANK",
    "ROW_NUMBER",
    "SESSION_USER",
    "STD",
    "STDDEV",
    "STDDEV_POP",
    "STDDEV_SAMP",
    "SUBDATE",
    "SUBSTR",
    "SUBSTRING",
    "SUM",
    "SYSTEM_USER",
    "TRIM",
    "TRIM_ORACLE",
    "VARIANCE",
    "VAR_POP",
    "VAR_SAMP",
    "ABS",
    "ACOS",
    "ADDTIME",
    "AES_DECRYPT",
    "AES_ENCRYPT",
    "ASIN",
    "ATAN",
    "ATAN2",
    "BENCHMARK",
    "BIN",
    "BINLOG_GTID_POS",
    "BIT_COUNT",
    "BIT_LENGTH",
    "CEIL",
    "CEILING",
    "CHARACTER_LENGTH",
    "CHAR_LENGTH",
    "CHR",
    "COERCIBILITY",
    "COLUMN_CHECK",
    "COLUMN_EXISTS",
    "COLUMN_LIST",
    "COLUMN_JSON",
    "COMPRESS",
    "CONCAT",
    "CONCAT_OPERATOR_ORACLE",
    "CONCAT_WS",
    "CONNECTION_ID",
    "CONV",
    "CONVERT_TZ",
    "COS",
    "COT",
    "CRC32",
    "DATEDIFF",
    "DAYNAME",
    "DAYOFMONTH",
    "DAYOFWEEK",
    "DAYOFYEAR",
    "DEGREES",
    "DECODE_HISTOGRAM",
    "DECODE_ORACLE",
    "DES_DECRYPT",
    "DES_ENCRYPT",
    "ELT",
    "ENCODE",
    "ENCRYPT",
    "EXP",
    "EXPORT_SET",
    "EXTRACTVALUE",
    "FIELD",
    "FIND_IN_SET",
    "FLOOR",
    "FORMAT",
    "FOUND_ROWS",
    "FROM_BASE64",
    "FROM_DAYS",
    "FROM_UNIXTIME",
    "GET_LOCK",
    "GREATEST",
    "HEX",
    "IFNULL",
    "INSTR",
    "ISNULL",
    "IS_FREE_LOCK",
    "IS_USED_LOCK",
    "JSON_ARRAY",
    "JSON_ARRAY_APPEND",
    "JSON_ARRAY_INSERT",
    "JSON_COMPACT",
    "JSON_CONTAINS",
    "JSON_CONTAINS_PATH",
    "JSON_DEPTH",
    "JSON_DETAILED",
    "JSON_EXISTS",
    "JSON_EXTRACT",
    "JSON_INSERT",
    "JSON_KEYS",
    "JSON_LENGTH",
    "JSON_LOOSE",
    "JSON_MERGE",
    "JSON_MERGE_PATCH",
    "JSON_MERGE_PRESERVE",
    "JSON_QUERY",
    "JSON_QUOTE",
    "JSON_OBJECT",
    "JSON_REMOVE",
    "JSON_REPLACE",
    "JSON_SET",
    "JSON_SEARCH",
    "JSON_TYPE",
    "JSON_UNQUOTE",
    "JSON_VALID",
    "JSON_VALUE",
    "LAST_DAY",
    "LAST_INSERT_ID",
    "LCASE",
    "LEAST",
    "LENGTH",
    "LENGTHB",
    "LN",
    "LOAD_FILE",
    "LOCATE",
    "LOG",
    "LOG10",
    "LOG2",
    "LOWER",
    "LPAD",
    "LPAD_ORACLE",
    "LTRIM",
    "LTRIM_ORACLE",
    "MAKEDATE",
    "MAKETIME",
    "MAKE_SET",
    "MASTER_GTID_WAIT",
    "MASTER_POS_WAIT",
    "MD5",
    "MONTHNAME",
    "NAME_CONST",
    "NVL",
    "NVL2",
    "OCT",
    "OCTET_LENGTH",
    "ORD",
    "PERIOD_ADD",
    "PERIOD_DIFF",
    "PI",
    "POW",
    "POWER",
    "QUOTE",
    "REGEXP_INSTR",
    "REGEXP_REPLACE",
    "REGEXP_SUBSTR",
    "RADIANS",
    "RAND",
    "RELEASE_ALL_LOCKS",
    "RELEASE_LOCK",
    "REPLACE_ORACLE",
    "REVERSE",
    "ROUND",
    "RPAD",
    "RPAD_ORACLE",
    "RTRIM",
    "RTRIM_ORACLE",
    "SEC_TO_TIME",
    "SHA",
    "SHA1",
    "SHA2",
    "SIGN",
    "SIN",
    "SLEEP",
    "SOUNDEX",
    "SPACE",
    "SQRT",
    "STRCMP",
    "STR_TO_DATE",
    "SUBSTR_ORACLE",
    "SUBSTRING_INDEX",
    "SUBTIME",
    "SYS_GUID",
    "TAN",
    "TIMEDIFF",
    "TIME_FORMAT",
    "TIME_TO_SEC",
    "TO_BASE64",
    "TO_CHAR",
    "TO_DAYS",
    "TO_SECONDS",
    "UCASE",
    "UNCOMPRESS",
    "UNCOMPRESSED_LENGTH",
    "UNHEX",
    "UNIX_TIMESTAMP",
    "UPDATEXML",
    "UPPER",
    "UUID",
    "UUID_SHORT",
    "VERSION",
    "WEEKDAY",
    "WEEKOFYEAR",
    "WSREP_LAST_WRITTEN_GTID",
    "WSREP_LAST_SEEN_GTID",
    "WSREP_SYNC_WAIT_UPTO_GTID",
    "YEARWEEK",
    // CASE expression shorthands
    "COALESCE",
    "NULLIF"
  ];
  var reservedSelect5 = expandPhrases(["SELECT [ALL | DISTINCT | DISTINCTROW]"]);
  var reservedClauses5 = expandPhrases([
    // queries
    "WITH [RECURSIVE]",
    "FROM",
    "WHERE",
    "GROUP BY",
    "HAVING",
    "PARTITION BY",
    "ORDER BY",
    "LIMIT",
    "OFFSET",
    "FETCH {FIRST | NEXT}",
    // Data manipulation
    // - insert:
    "INSERT [LOW_PRIORITY | DELAYED | HIGH_PRIORITY] [IGNORE] [INTO]",
    "REPLACE [LOW_PRIORITY | DELAYED] [INTO]",
    "VALUES",
    "ON DUPLICATE KEY UPDATE",
    // - update:
    "SET",
    // other
    "RETURNING"
  ]);
  var standardOnelineClauses5 = expandPhrases([
    "CREATE [OR REPLACE] [TEMPORARY] TABLE [IF NOT EXISTS]"
  ]);
  var tabularOnelineClauses5 = expandPhrases([
    // - create:
    "CREATE [OR REPLACE] [SQL SECURITY DEFINER | SQL SECURITY INVOKER] VIEW [IF NOT EXISTS]",
    // - update:
    "UPDATE [LOW_PRIORITY] [IGNORE]",
    // - delete:
    "DELETE [LOW_PRIORITY] [QUICK] [IGNORE] FROM",
    // - drop table:
    "DROP [TEMPORARY] TABLE [IF EXISTS]",
    // - alter table:
    "ALTER [ONLINE] [IGNORE] TABLE [IF EXISTS]",
    "ADD [COLUMN] [IF NOT EXISTS]",
    "{CHANGE | MODIFY} [COLUMN] [IF EXISTS]",
    "DROP [COLUMN] [IF EXISTS]",
    "RENAME [TO]",
    "RENAME COLUMN",
    "ALTER [COLUMN]",
    "{SET | DROP} DEFAULT",
    // for alter column
    "SET {VISIBLE | INVISIBLE}",
    // for alter column
    // - truncate:
    "TRUNCATE [TABLE]",
    // https://mariadb.com/docs/reference/mdb/sql-statements/
    "ALTER DATABASE",
    "ALTER DATABASE COMMENT",
    "ALTER EVENT",
    "ALTER FUNCTION",
    "ALTER PROCEDURE",
    "ALTER SCHEMA",
    "ALTER SCHEMA COMMENT",
    "ALTER SEQUENCE",
    "ALTER SERVER",
    "ALTER USER",
    "ALTER VIEW",
    "ANALYZE",
    "ANALYZE TABLE",
    "BACKUP LOCK",
    "BACKUP STAGE",
    "BACKUP UNLOCK",
    "BEGIN",
    "BINLOG",
    "CACHE INDEX",
    "CALL",
    "CHANGE MASTER TO",
    "CHECK TABLE",
    "CHECK VIEW",
    "CHECKSUM TABLE",
    "COMMIT",
    "CREATE AGGREGATE FUNCTION",
    "CREATE DATABASE",
    "CREATE EVENT",
    "CREATE FUNCTION",
    "CREATE INDEX",
    "CREATE PROCEDURE",
    "CREATE ROLE",
    "CREATE SEQUENCE",
    "CREATE SERVER",
    "CREATE SPATIAL INDEX",
    "CREATE TRIGGER",
    "CREATE UNIQUE INDEX",
    "CREATE USER",
    "DEALLOCATE PREPARE",
    "DESCRIBE",
    "DROP DATABASE",
    "DROP EVENT",
    "DROP FUNCTION",
    "DROP INDEX",
    "DROP PREPARE",
    "DROP PROCEDURE",
    "DROP ROLE",
    "DROP SEQUENCE",
    "DROP SERVER",
    "DROP TRIGGER",
    "DROP USER",
    "DROP VIEW",
    "EXECUTE",
    "EXPLAIN",
    "FLUSH",
    "GET DIAGNOSTICS",
    "GET DIAGNOSTICS CONDITION",
    "GRANT",
    "HANDLER",
    "HELP",
    "INSTALL PLUGIN",
    "INSTALL SONAME",
    "KILL",
    "LOAD DATA INFILE",
    "LOAD INDEX INTO CACHE",
    "LOAD XML INFILE",
    "LOCK TABLE",
    "OPTIMIZE TABLE",
    "PREPARE",
    "PURGE BINARY LOGS",
    "PURGE MASTER LOGS",
    "RELEASE SAVEPOINT",
    "RENAME TABLE",
    "RENAME USER",
    "REPAIR TABLE",
    "REPAIR VIEW",
    "RESET MASTER",
    "RESET QUERY CACHE",
    "RESET REPLICA",
    "RESET SLAVE",
    "RESIGNAL",
    "REVOKE",
    "ROLLBACK",
    "SAVEPOINT",
    "SET CHARACTER SET",
    "SET DEFAULT ROLE",
    "SET GLOBAL TRANSACTION",
    "SET NAMES",
    "SET PASSWORD",
    "SET ROLE",
    "SET STATEMENT",
    "SET TRANSACTION",
    "SHOW",
    "SHOW ALL REPLICAS STATUS",
    "SHOW ALL SLAVES STATUS",
    "SHOW AUTHORS",
    "SHOW BINARY LOGS",
    "SHOW BINLOG EVENTS",
    "SHOW BINLOG STATUS",
    "SHOW CHARACTER SET",
    "SHOW CLIENT_STATISTICS",
    "SHOW COLLATION",
    "SHOW COLUMNS",
    "SHOW CONTRIBUTORS",
    "SHOW CREATE DATABASE",
    "SHOW CREATE EVENT",
    "SHOW CREATE FUNCTION",
    "SHOW CREATE PACKAGE",
    "SHOW CREATE PACKAGE BODY",
    "SHOW CREATE PROCEDURE",
    "SHOW CREATE SEQUENCE",
    "SHOW CREATE TABLE",
    "SHOW CREATE TRIGGER",
    "SHOW CREATE USER",
    "SHOW CREATE VIEW",
    "SHOW DATABASES",
    "SHOW ENGINE",
    "SHOW ENGINE INNODB STATUS",
    "SHOW ENGINES",
    "SHOW ERRORS",
    "SHOW EVENTS",
    "SHOW EXPLAIN",
    "SHOW FUNCTION CODE",
    "SHOW FUNCTION STATUS",
    "SHOW GRANTS",
    "SHOW INDEX",
    "SHOW INDEXES",
    "SHOW INDEX_STATISTICS",
    "SHOW KEYS",
    "SHOW LOCALES",
    "SHOW MASTER LOGS",
    "SHOW MASTER STATUS",
    "SHOW OPEN TABLES",
    "SHOW PACKAGE BODY CODE",
    "SHOW PACKAGE BODY STATUS",
    "SHOW PACKAGE STATUS",
    "SHOW PLUGINS",
    "SHOW PLUGINS SONAME",
    "SHOW PRIVILEGES",
    "SHOW PROCEDURE CODE",
    "SHOW PROCEDURE STATUS",
    "SHOW PROCESSLIST",
    "SHOW PROFILE",
    "SHOW PROFILES",
    "SHOW QUERY_RESPONSE_TIME",
    "SHOW RELAYLOG EVENTS",
    "SHOW REPLICA",
    "SHOW REPLICA HOSTS",
    "SHOW REPLICA STATUS",
    "SHOW SCHEMAS",
    "SHOW SLAVE",
    "SHOW SLAVE HOSTS",
    "SHOW SLAVE STATUS",
    "SHOW STATUS",
    "SHOW STORAGE ENGINES",
    "SHOW TABLE STATUS",
    "SHOW TABLES",
    "SHOW TRIGGERS",
    "SHOW USER_STATISTICS",
    "SHOW VARIABLES",
    "SHOW WARNINGS",
    "SHOW WSREP_MEMBERSHIP",
    "SHOW WSREP_STATUS",
    "SHUTDOWN",
    "SIGNAL",
    "START ALL REPLICAS",
    "START ALL SLAVES",
    "START REPLICA",
    "START SLAVE",
    "START TRANSACTION",
    "STOP ALL REPLICAS",
    "STOP ALL SLAVES",
    "STOP REPLICA",
    "STOP SLAVE",
    "UNINSTALL PLUGIN",
    "UNINSTALL SONAME",
    "UNLOCK TABLE",
    "USE",
    "XA BEGIN",
    "XA COMMIT",
    "XA END",
    "XA PREPARE",
    "XA RECOVER",
    "XA ROLLBACK",
    "XA START"
  ]);
  var reservedSetOperations5 = expandPhrases([
    "UNION [ALL | DISTINCT]",
    "EXCEPT [ALL | DISTINCT]",
    "INTERSECT [ALL | DISTINCT]",
    "MINUS [ALL | DISTINCT]"
  ]);
  var reservedJoins5 = expandPhrases([
    "JOIN",
    "{LEFT | RIGHT} [OUTER] JOIN",
    "{INNER | CROSS} JOIN",
    "NATURAL JOIN",
    "NATURAL {LEFT | RIGHT} [OUTER] JOIN",
    // non-standard joins
    "STRAIGHT_JOIN"
  ]);
  var reservedPhrases5 = expandPhrases([
    "ON {UPDATE | DELETE} [SET NULL | SET DEFAULT]",
    "CHARACTER SET",
    "{ROWS | RANGE} BETWEEN",
    "IDENTIFIED BY"
  ]);
  var mariadb = {
    name: "mariadb",
    tokenizerOptions: {
      reservedSelect: reservedSelect5,
      reservedClauses: [...reservedClauses5, ...standardOnelineClauses5, ...tabularOnelineClauses5],
      reservedSetOperations: reservedSetOperations5,
      reservedJoins: reservedJoins5,
      reservedPhrases: reservedPhrases5,
      supportsXor: true,
      reservedKeywords: keywords5,
      reservedDataTypes: dataTypes5,
      reservedFunctionNames: functions5,
      // TODO: support _ char set prefixes such as _utf8, _latin1, _binary, _utf8mb4, etc.
      stringTypes: [
        '""-qq-bs',
        "''-qq-bs",
        { quote: "''-raw", prefixes: ["B", "X"], requirePrefix: true }
      ],
      identTypes: ["``"],
      identChars: { first: "$", rest: "$", allowFirstCharNumber: true },
      variableTypes: [
        { regex: "@@?[A-Za-z0-9_.$]+" },
        { quote: '""-qq-bs', prefixes: ["@"], requirePrefix: true },
        { quote: "''-qq-bs", prefixes: ["@"], requirePrefix: true },
        { quote: "``", prefixes: ["@"], requirePrefix: true }
      ],
      paramTypes: { positional: true },
      lineCommentTypes: ["--", "#"],
      operators: [
        "%",
        ":=",
        "&",
        "|",
        "^",
        "~",
        "<<",
        ">>",
        "<=>",
        "&&",
        "||",
        "!",
        "*.*"
        // Not actually an operator
      ],
      postProcess: postProcess2
    },
    formatOptions: {
      onelineClauses: [...standardOnelineClauses5, ...tabularOnelineClauses5],
      tabularOnelineClauses: tabularOnelineClauses5
    }
  };
  var keywords6 = [
    // https://dev.mysql.com/doc/refman/8.0/en/keywords.html
    "ACCESSIBLE",
    // (R)
    "ADD",
    // (R)
    "ALL",
    // (R)
    "ALTER",
    // (R)
    "ANALYZE",
    // (R)
    "AND",
    // (R)
    "AS",
    // (R)
    "ASC",
    // (R)
    "ASENSITIVE",
    // (R)
    "BEFORE",
    // (R)
    "BETWEEN",
    // (R)
    "BOTH",
    // (R)
    "BY",
    // (R)
    "CALL",
    // (R)
    "CASCADE",
    // (R)
    "CASE",
    // (R)
    "CHANGE",
    // (R)
    "CHECK",
    // (R)
    "COLLATE",
    // (R)
    "COLUMN",
    // (R)
    "CONDITION",
    // (R)
    "CONSTRAINT",
    // (R)
    "CONTINUE",
    // (R)
    "CONVERT",
    // (R)
    "CREATE",
    // (R)
    "CROSS",
    // (R)
    "CUBE",
    // (R)
    "CUME_DIST",
    // (R)
    "CURRENT_DATE",
    // (R)
    "CURRENT_TIME",
    // (R)
    "CURRENT_TIMESTAMP",
    // (R)
    "CURRENT_USER",
    // (R)
    "CURSOR",
    // (R)
    "DATABASE",
    // (R)
    "DATABASES",
    // (R)
    "DAY_HOUR",
    // (R)
    "DAY_MICROSECOND",
    // (R)
    "DAY_MINUTE",
    // (R)
    "DAY_SECOND",
    // (R)
    "DECLARE",
    // (R)
    "DEFAULT",
    // (R)
    "DELAYED",
    // (R)
    "DELETE",
    // (R)
    "DENSE_RANK",
    // (R)
    "DESC",
    // (R)
    "DESCRIBE",
    // (R)
    "DETERMINISTIC",
    // (R)
    "DISTINCT",
    // (R)
    "DISTINCTROW",
    // (R)
    "DIV",
    // (R)
    "DROP",
    // (R)
    "DUAL",
    // (R)
    "EACH",
    // (R)
    "ELSE",
    // (R)
    "ELSEIF",
    // (R)
    "EMPTY",
    // (R)
    "ENCLOSED",
    // (R)
    "ESCAPED",
    // (R)
    "EXCEPT",
    // (R)
    "EXISTS",
    // (R)
    "EXIT",
    // (R)
    "EXPLAIN",
    // (R)
    "FALSE",
    // (R)
    "FETCH",
    // (R)
    "FIRST_VALUE",
    // (R)
    "FOR",
    // (R)
    "FORCE",
    // (R)
    "FOREIGN",
    // (R)
    "FROM",
    // (R)
    "FULLTEXT",
    // (R)
    "FUNCTION",
    // (R)
    "GENERATED",
    // (R)
    "GET",
    // (R)
    "GRANT",
    // (R)
    "GROUP",
    // (R)
    "GROUPING",
    // (R)
    "GROUPS",
    // (R)
    "HAVING",
    // (R)
    "HIGH_PRIORITY",
    // (R)
    "HOUR_MICROSECOND",
    // (R)
    "HOUR_MINUTE",
    // (R)
    "HOUR_SECOND",
    // (R)
    "IF",
    // (R)
    "IGNORE",
    // (R)
    "IN",
    // (R)
    "INDEX",
    // (R)
    "INFILE",
    // (R)
    "INNER",
    // (R)
    "INOUT",
    // (R)
    "INSENSITIVE",
    // (R)
    "INSERT",
    // (R)
    "IN",
    // <-- moved over from functions
    "INTERSECT",
    // (R)
    "INTERVAL",
    // (R)
    "INTO",
    // (R)
    "IO_AFTER_GTIDS",
    // (R)
    "IO_BEFORE_GTIDS",
    // (R)
    "IS",
    // (R)
    "ITERATE",
    // (R)
    "JOIN",
    // (R)
    "JSON_TABLE",
    // (R)
    "KEY",
    // (R)
    "KEYS",
    // (R)
    "KILL",
    // (R)
    "LAG",
    // (R)
    "LAST_VALUE",
    // (R)
    "LATERAL",
    // (R)
    "LEAD",
    // (R)
    "LEADING",
    // (R)
    "LEAVE",
    // (R)
    "LEFT",
    // (R)
    "LIKE",
    // (R)
    "LIMIT",
    // (R)
    "LINEAR",
    // (R)
    "LINES",
    // (R)
    "LOAD",
    // (R)
    "LOCALTIME",
    // (R)
    "LOCALTIMESTAMP",
    // (R)
    "LOCK",
    // (R)
    "LONG",
    // (R)
    "LOOP",
    // (R)
    "LOW_PRIORITY",
    // (R)
    "MASTER_BIND",
    // (R)
    "MASTER_SSL_VERIFY_SERVER_CERT",
    // (R)
    "MATCH",
    // (R)
    "MAXVALUE",
    // (R)
    "MINUTE_MICROSECOND",
    // (R)
    "MINUTE_SECOND",
    // (R)
    "MOD",
    // (R)
    "MODIFIES",
    // (R)
    "NATURAL",
    // (R)
    "NOT",
    // (R)
    "NO_WRITE_TO_BINLOG",
    // (R)
    "NTH_VALUE",
    // (R)
    "NTILE",
    // (R)
    "NULL",
    // (R)
    "OF",
    // (R)
    "ON",
    // (R)
    "OPTIMIZE",
    // (R)
    "OPTIMIZER_COSTS",
    // (R)
    "OPTION",
    // (R)
    "OPTIONALLY",
    // (R)
    "OR",
    // (R)
    "ORDER",
    // (R)
    "OUT",
    // (R)
    "OUTER",
    // (R)
    "OUTFILE",
    // (R)
    "OVER",
    // (R)
    "PARTITION",
    // (R)
    "PERCENT_RANK",
    // (R)
    "PRIMARY",
    // (R)
    "PROCEDURE",
    // (R)
    "PURGE",
    // (R)
    "RANGE",
    // (R)
    "RANK",
    // (R)
    "READ",
    // (R)
    "READS",
    // (R)
    "READ_WRITE",
    // (R)
    "RECURSIVE",
    // (R)
    "REFERENCES",
    // (R)
    "REGEXP",
    // (R)
    "RELEASE",
    // (R)
    "RENAME",
    // (R)
    "REPEAT",
    // (R)
    "REPLACE",
    // (R)
    "REQUIRE",
    // (R)
    "RESIGNAL",
    // (R)
    "RESTRICT",
    // (R)
    "RETURN",
    // (R)
    "REVOKE",
    // (R)
    "RIGHT",
    // (R)
    "RLIKE",
    // (R)
    "ROW",
    // (R)
    "ROWS",
    // (R)
    "ROW_NUMBER",
    // (R)
    "SCHEMA",
    // (R)
    "SCHEMAS",
    // (R)
    "SECOND_MICROSECOND",
    // (R)
    "SELECT",
    // (R)
    "SENSITIVE",
    // (R)
    "SEPARATOR",
    // (R)
    "SET",
    // (R)
    "SHOW",
    // (R)
    "SIGNAL",
    // (R)
    "SPATIAL",
    // (R)
    "SPECIFIC",
    // (R)
    "SQL",
    // (R)
    "SQLEXCEPTION",
    // (R)
    "SQLSTATE",
    // (R)
    "SQLWARNING",
    // (R)
    "SQL_BIG_RESULT",
    // (R)
    "SQL_CALC_FOUND_ROWS",
    // (R)
    "SQL_SMALL_RESULT",
    // (R)
    "SSL",
    // (R)
    "STARTING",
    // (R)
    "STORED",
    // (R)
    "STRAIGHT_JOIN",
    // (R)
    "SYSTEM",
    // (R)
    "TABLE",
    // (R)
    "TERMINATED",
    // (R)
    "THEN",
    // (R)
    "TO",
    // (R)
    "TRAILING",
    // (R)
    "TRIGGER",
    // (R)
    "TRUE",
    // (R)
    "UNDO",
    // (R)
    "UNION",
    // (R)
    "UNIQUE",
    // (R)
    "UNLOCK",
    // (R)
    "UNSIGNED",
    // (R)
    "UPDATE",
    // (R)
    "USAGE",
    // (R)
    "USE",
    // (R)
    "USING",
    // (R)
    "UTC_DATE",
    // (R)
    "UTC_TIME",
    // (R)
    "UTC_TIMESTAMP",
    // (R)
    "VALUES",
    // (R)
    "VIRTUAL",
    // (R)
    "WHEN",
    // (R)
    "WHERE",
    // (R)
    "WHILE",
    // (R)
    "WINDOW",
    // (R)
    "WITH",
    // (R)
    "WRITE",
    // (R)
    "XOR",
    // (R)
    "YEAR_MONTH",
    // (R)
    "ZEROFILL"
    // (R)
  ];
  var dataTypes6 = [
    // https://dev.mysql.com/doc/refman/8.0/en/data-types.html
    "BIGINT",
    // (R)
    "BINARY",
    // (R)
    "BIT",
    "BLOB",
    // (R)
    "BOOL",
    // (R)
    "BOOLEAN",
    // (R)
    "CHAR",
    // (R)
    "CHARACTER",
    // (R)
    "DATE",
    // (R)
    "DATETIME",
    // (R)
    "DEC",
    // (R)
    "DECIMAL",
    // (R)
    "DOUBLE PRECISION",
    "DOUBLE",
    // (R)
    "ENUM",
    "FIXED",
    "FLOAT",
    // (R)
    "FLOAT4",
    // (R)
    "FLOAT8",
    // (R)
    "INT",
    // (R)
    "INT1",
    // (R)
    "INT2",
    // (R)
    "INT3",
    // (R)
    "INT4",
    // (R)
    "INT8",
    // (R)
    "INTEGER",
    // (R)
    "LONGBLOB",
    // (R)
    "LONGTEXT",
    // (R)
    "MEDIUMBLOB",
    // (R)
    "MEDIUMINT",
    // (R)
    "MEDIUMTEXT",
    // (R)
    "MIDDLEINT",
    // (R)
    "NATIONAL CHAR",
    // (R)
    "NATIONAL VARCHAR",
    // (R)
    "NUMERIC",
    // (R)
    "PRECISION",
    // (R)
    "REAL",
    // (R)
    "SMALLINT",
    // (R)
    "TEXT",
    "TIME",
    "TIMESTAMP",
    // (R)
    "TINYBLOB",
    // (R)
    "TINYINT",
    // (R)
    "TINYTEXT",
    // (R)
    "VARBINARY",
    // (R)
    "VARCHAR",
    // (R)
    "VARCHARACTER",
    // (R)
    "VARYING",
    // (R)
    "YEAR"
    // 'SET' // handled as special-case in postProcess
  ];
  var functions6 = [
    // https://dev.mysql.com/doc/refman/8.0/en/built-in-function-reference.html
    "ABS",
    "ACOS",
    "ADDDATE",
    "ADDTIME",
    "AES_DECRYPT",
    "AES_ENCRYPT",
    // 'AND',
    "ANY_VALUE",
    "ASCII",
    "ASIN",
    "ATAN",
    "ATAN2",
    "AVG",
    "BENCHMARK",
    "BIN",
    "BIN_TO_UUID",
    "BINARY",
    "BIT_AND",
    "BIT_COUNT",
    "BIT_LENGTH",
    "BIT_OR",
    "BIT_XOR",
    "CAN_ACCESS_COLUMN",
    "CAN_ACCESS_DATABASE",
    "CAN_ACCESS_TABLE",
    "CAN_ACCESS_USER",
    "CAN_ACCESS_VIEW",
    "CAST",
    "CEIL",
    "CEILING",
    "CHAR",
    "CHAR_LENGTH",
    "CHARACTER_LENGTH",
    "CHARSET",
    "COALESCE",
    "COERCIBILITY",
    "COLLATION",
    "COMPRESS",
    "CONCAT",
    "CONCAT_WS",
    "CONNECTION_ID",
    "CONV",
    "CONVERT",
    "CONVERT_TZ",
    "COS",
    "COT",
    "COUNT",
    "CRC32",
    "CUME_DIST",
    "CURDATE",
    "CURRENT_DATE",
    "CURRENT_ROLE",
    "CURRENT_TIME",
    "CURRENT_TIMESTAMP",
    "CURRENT_USER",
    "CURTIME",
    "DATABASE",
    "DATE",
    "DATE_ADD",
    "DATE_FORMAT",
    "DATE_SUB",
    "DATEDIFF",
    "DAY",
    "DAYNAME",
    "DAYOFMONTH",
    "DAYOFWEEK",
    "DAYOFYEAR",
    "DEFAULT",
    "DEGREES",
    "DENSE_RANK",
    "DIV",
    "ELT",
    "EXP",
    "EXPORT_SET",
    "EXTRACT",
    "EXTRACTVALUE",
    "FIELD",
    "FIND_IN_SET",
    "FIRST_VALUE",
    "FLOOR",
    "FORMAT",
    "FORMAT_BYTES",
    "FORMAT_PICO_TIME",
    "FOUND_ROWS",
    "FROM_BASE64",
    "FROM_DAYS",
    "FROM_UNIXTIME",
    "GEOMCOLLECTION",
    "GEOMETRYCOLLECTION",
    "GET_DD_COLUMN_PRIVILEGES",
    "GET_DD_CREATE_OPTIONS",
    "GET_DD_INDEX_SUB_PART_LENGTH",
    "GET_FORMAT",
    "GET_LOCK",
    "GREATEST",
    "GROUP_CONCAT",
    "GROUPING",
    "GTID_SUBSET",
    "GTID_SUBTRACT",
    "HEX",
    "HOUR",
    "ICU_VERSION",
    "IF",
    "IFNULL",
    // 'IN',
    "INET_ATON",
    "INET_NTOA",
    "INET6_ATON",
    "INET6_NTOA",
    "INSERT",
    "INSTR",
    "INTERNAL_AUTO_INCREMENT",
    "INTERNAL_AVG_ROW_LENGTH",
    "INTERNAL_CHECK_TIME",
    "INTERNAL_CHECKSUM",
    "INTERNAL_DATA_FREE",
    "INTERNAL_DATA_LENGTH",
    "INTERNAL_DD_CHAR_LENGTH",
    "INTERNAL_GET_COMMENT_OR_ERROR",
    "INTERNAL_GET_ENABLED_ROLE_JSON",
    "INTERNAL_GET_HOSTNAME",
    "INTERNAL_GET_USERNAME",
    "INTERNAL_GET_VIEW_WARNING_OR_ERROR",
    "INTERNAL_INDEX_COLUMN_CARDINALITY",
    "INTERNAL_INDEX_LENGTH",
    "INTERNAL_IS_ENABLED_ROLE",
    "INTERNAL_IS_MANDATORY_ROLE",
    "INTERNAL_KEYS_DISABLED",
    "INTERNAL_MAX_DATA_LENGTH",
    "INTERNAL_TABLE_ROWS",
    "INTERNAL_UPDATE_TIME",
    "INTERVAL",
    "IS",
    "IS_FREE_LOCK",
    "IS_IPV4",
    "IS_IPV4_COMPAT",
    "IS_IPV4_MAPPED",
    "IS_IPV6",
    "IS NOT",
    "IS NOT NULL",
    "IS NULL",
    "IS_USED_LOCK",
    "IS_UUID",
    "ISNULL",
    "JSON_ARRAY",
    "JSON_ARRAY_APPEND",
    "JSON_ARRAY_INSERT",
    "JSON_ARRAYAGG",
    "JSON_CONTAINS",
    "JSON_CONTAINS_PATH",
    "JSON_DEPTH",
    "JSON_EXTRACT",
    "JSON_INSERT",
    "JSON_KEYS",
    "JSON_LENGTH",
    "JSON_MERGE",
    "JSON_MERGE_PATCH",
    "JSON_MERGE_PRESERVE",
    "JSON_OBJECT",
    "JSON_OBJECTAGG",
    "JSON_OVERLAPS",
    "JSON_PRETTY",
    "JSON_QUOTE",
    "JSON_REMOVE",
    "JSON_REPLACE",
    "JSON_SCHEMA_VALID",
    "JSON_SCHEMA_VALIDATION_REPORT",
    "JSON_SEARCH",
    "JSON_SET",
    "JSON_STORAGE_FREE",
    "JSON_STORAGE_SIZE",
    "JSON_TABLE",
    "JSON_TYPE",
    "JSON_UNQUOTE",
    "JSON_VALID",
    "JSON_VALUE",
    "LAG",
    "LAST_DAY",
    "LAST_INSERT_ID",
    "LAST_VALUE",
    "LCASE",
    "LEAD",
    "LEAST",
    "LEFT",
    "LENGTH",
    "LIKE",
    "LINESTRING",
    "LN",
    "LOAD_FILE",
    "LOCALTIME",
    "LOCALTIMESTAMP",
    "LOCATE",
    "LOG",
    "LOG10",
    "LOG2",
    "LOWER",
    "LPAD",
    "LTRIM",
    "MAKE_SET",
    "MAKEDATE",
    "MAKETIME",
    "MASTER_POS_WAIT",
    "MATCH",
    "MAX",
    "MBRCONTAINS",
    "MBRCOVEREDBY",
    "MBRCOVERS",
    "MBRDISJOINT",
    "MBREQUALS",
    "MBRINTERSECTS",
    "MBROVERLAPS",
    "MBRTOUCHES",
    "MBRWITHIN",
    "MD5",
    "MEMBER OF",
    "MICROSECOND",
    "MID",
    "MIN",
    "MINUTE",
    "MOD",
    "MONTH",
    "MONTHNAME",
    "MULTILINESTRING",
    "MULTIPOINT",
    "MULTIPOLYGON",
    "NAME_CONST",
    "NOT",
    "NOT IN",
    "NOT LIKE",
    "NOT REGEXP",
    "NOW",
    "NTH_VALUE",
    "NTILE",
    "NULLIF",
    "OCT",
    "OCTET_LENGTH",
    // 'OR',
    "ORD",
    "PERCENT_RANK",
    "PERIOD_ADD",
    "PERIOD_DIFF",
    "PI",
    "POINT",
    "POLYGON",
    "POSITION",
    "POW",
    "POWER",
    "PS_CURRENT_THREAD_ID",
    "PS_THREAD_ID",
    "QUARTER",
    "QUOTE",
    "RADIANS",
    "RAND",
    "RANDOM_BYTES",
    "RANK",
    "REGEXP",
    "REGEXP_INSTR",
    "REGEXP_LIKE",
    "REGEXP_REPLACE",
    "REGEXP_SUBSTR",
    "RELEASE_ALL_LOCKS",
    "RELEASE_LOCK",
    "REPEAT",
    "REPLACE",
    "REVERSE",
    "RIGHT",
    "RLIKE",
    "ROLES_GRAPHML",
    "ROUND",
    "ROW_COUNT",
    "ROW_NUMBER",
    "RPAD",
    "RTRIM",
    "SCHEMA",
    "SEC_TO_TIME",
    "SECOND",
    "SESSION_USER",
    "SHA1",
    "SHA2",
    "SIGN",
    "SIN",
    "SLEEP",
    "SOUNDEX",
    "SOUNDS LIKE",
    "SOURCE_POS_WAIT",
    "SPACE",
    "SQRT",
    "ST_AREA",
    "ST_ASBINARY",
    "ST_ASGEOJSON",
    "ST_ASTEXT",
    "ST_BUFFER",
    "ST_BUFFER_STRATEGY",
    "ST_CENTROID",
    "ST_COLLECT",
    "ST_CONTAINS",
    "ST_CONVEXHULL",
    "ST_CROSSES",
    "ST_DIFFERENCE",
    "ST_DIMENSION",
    "ST_DISJOINT",
    "ST_DISTANCE",
    "ST_DISTANCE_SPHERE",
    "ST_ENDPOINT",
    "ST_ENVELOPE",
    "ST_EQUALS",
    "ST_EXTERIORRING",
    "ST_FRECHETDISTANCE",
    "ST_GEOHASH",
    "ST_GEOMCOLLFROMTEXT",
    "ST_GEOMCOLLFROMWKB",
    "ST_GEOMETRYN",
    "ST_GEOMETRYTYPE",
    "ST_GEOMFROMGEOJSON",
    "ST_GEOMFROMTEXT",
    "ST_GEOMFROMWKB",
    "ST_HAUSDORFFDISTANCE",
    "ST_INTERIORRINGN",
    "ST_INTERSECTION",
    "ST_INTERSECTS",
    "ST_ISCLOSED",
    "ST_ISEMPTY",
    "ST_ISSIMPLE",
    "ST_ISVALID",
    "ST_LATFROMGEOHASH",
    "ST_LATITUDE",
    "ST_LENGTH",
    "ST_LINEFROMTEXT",
    "ST_LINEFROMWKB",
    "ST_LINEINTERPOLATEPOINT",
    "ST_LINEINTERPOLATEPOINTS",
    "ST_LONGFROMGEOHASH",
    "ST_LONGITUDE",
    "ST_MAKEENVELOPE",
    "ST_MLINEFROMTEXT",
    "ST_MLINEFROMWKB",
    "ST_MPOINTFROMTEXT",
    "ST_MPOINTFROMWKB",
    "ST_MPOLYFROMTEXT",
    "ST_MPOLYFROMWKB",
    "ST_NUMGEOMETRIES",
    "ST_NUMINTERIORRING",
    "ST_NUMPOINTS",
    "ST_OVERLAPS",
    "ST_POINTATDISTANCE",
    "ST_POINTFROMGEOHASH",
    "ST_POINTFROMTEXT",
    "ST_POINTFROMWKB",
    "ST_POINTN",
    "ST_POLYFROMTEXT",
    "ST_POLYFROMWKB",
    "ST_SIMPLIFY",
    "ST_SRID",
    "ST_STARTPOINT",
    "ST_SWAPXY",
    "ST_SYMDIFFERENCE",
    "ST_TOUCHES",
    "ST_TRANSFORM",
    "ST_UNION",
    "ST_VALIDATE",
    "ST_WITHIN",
    "ST_X",
    "ST_Y",
    "STATEMENT_DIGEST",
    "STATEMENT_DIGEST_TEXT",
    "STD",
    "STDDEV",
    "STDDEV_POP",
    "STDDEV_SAMP",
    "STR_TO_DATE",
    "STRCMP",
    "SUBDATE",
    "SUBSTR",
    "SUBSTRING",
    "SUBSTRING_INDEX",
    "SUBTIME",
    "SUM",
    "SYSDATE",
    "SYSTEM_USER",
    "TAN",
    "TIME",
    "TIME_FORMAT",
    "TIME_TO_SEC",
    "TIMEDIFF",
    "TIMESTAMP",
    "TIMESTAMPADD",
    "TIMESTAMPDIFF",
    "TO_BASE64",
    "TO_DAYS",
    "TO_SECONDS",
    "TRIM",
    "TRUNCATE",
    "UCASE",
    "UNCOMPRESS",
    "UNCOMPRESSED_LENGTH",
    "UNHEX",
    "UNIX_TIMESTAMP",
    "UPDATEXML",
    "UPPER",
    // 'USER',
    "UTC_DATE",
    "UTC_TIME",
    "UTC_TIMESTAMP",
    "UUID",
    "UUID_SHORT",
    "UUID_TO_BIN",
    "VALIDATE_PASSWORD_STRENGTH",
    "VALUES",
    "VAR_POP",
    "VAR_SAMP",
    "VARIANCE",
    "VERSION",
    "WAIT_FOR_EXECUTED_GTID_SET",
    "WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS",
    "WEEK",
    "WEEKDAY",
    "WEEKOFYEAR",
    "WEIGHT_STRING",
    // 'XOR',
    "YEAR",
    "YEARWEEK"
  ];
  var reservedSelect6 = expandPhrases(["SELECT [ALL | DISTINCT | DISTINCTROW]"]);
  var reservedClauses6 = expandPhrases([
    // queries
    "WITH [RECURSIVE]",
    "FROM",
    "WHERE",
    "GROUP BY",
    "HAVING",
    "WINDOW",
    "PARTITION BY",
    "ORDER BY",
    "LIMIT",
    "OFFSET",
    // Data manipulation
    // - insert:
    "INSERT [LOW_PRIORITY | DELAYED | HIGH_PRIORITY] [IGNORE] [INTO]",
    "REPLACE [LOW_PRIORITY | DELAYED] [INTO]",
    "VALUES",
    "ON DUPLICATE KEY UPDATE",
    // - update:
    "SET"
  ]);
  var standardOnelineClauses6 = expandPhrases(["CREATE [TEMPORARY] TABLE [IF NOT EXISTS]"]);
  var tabularOnelineClauses6 = expandPhrases([
    // - create:
    "CREATE [OR REPLACE] [SQL SECURITY DEFINER | SQL SECURITY INVOKER] VIEW [IF NOT EXISTS]",
    // - update:
    "UPDATE [LOW_PRIORITY] [IGNORE]",
    // - delete:
    "DELETE [LOW_PRIORITY] [QUICK] [IGNORE] FROM",
    // - drop table:
    "DROP [TEMPORARY] TABLE [IF EXISTS]",
    // - alter table:
    "ALTER TABLE",
    "ADD [COLUMN]",
    "{CHANGE | MODIFY} [COLUMN]",
    "DROP [COLUMN]",
    "RENAME [TO | AS]",
    "RENAME COLUMN",
    "ALTER [COLUMN]",
    "{SET | DROP} DEFAULT",
    // for alter column
    // - truncate:
    "TRUNCATE [TABLE]",
    // https://dev.mysql.com/doc/refman/8.0/en/sql-statements.html
    "ALTER DATABASE",
    "ALTER EVENT",
    "ALTER FUNCTION",
    "ALTER INSTANCE",
    "ALTER LOGFILE GROUP",
    "ALTER PROCEDURE",
    "ALTER RESOURCE GROUP",
    "ALTER SERVER",
    "ALTER TABLESPACE",
    "ALTER USER",
    "ALTER VIEW",
    "ANALYZE TABLE",
    "BINLOG",
    "CACHE INDEX",
    "CALL",
    "CHANGE MASTER TO",
    "CHANGE REPLICATION FILTER",
    "CHANGE REPLICATION SOURCE TO",
    "CHECK TABLE",
    "CHECKSUM TABLE",
    "CLONE",
    "COMMIT",
    "CREATE DATABASE",
    "CREATE EVENT",
    "CREATE FUNCTION",
    "CREATE FUNCTION",
    "CREATE INDEX",
    "CREATE LOGFILE GROUP",
    "CREATE PROCEDURE",
    "CREATE RESOURCE GROUP",
    "CREATE ROLE",
    "CREATE SERVER",
    "CREATE SPATIAL REFERENCE SYSTEM",
    "CREATE TABLESPACE",
    "CREATE TRIGGER",
    "CREATE USER",
    "DEALLOCATE PREPARE",
    "DESCRIBE",
    "DROP DATABASE",
    "DROP EVENT",
    "DROP FUNCTION",
    "DROP FUNCTION",
    "DROP INDEX",
    "DROP LOGFILE GROUP",
    "DROP PROCEDURE",
    "DROP RESOURCE GROUP",
    "DROP ROLE",
    "DROP SERVER",
    "DROP SPATIAL REFERENCE SYSTEM",
    "DROP TABLESPACE",
    "DROP TRIGGER",
    "DROP USER",
    "DROP VIEW",
    "EXECUTE",
    "EXPLAIN",
    "FLUSH",
    "GRANT",
    "HANDLER",
    "HELP",
    "IMPORT TABLE",
    "INSTALL COMPONENT",
    "INSTALL PLUGIN",
    "KILL",
    "LOAD DATA",
    "LOAD INDEX INTO CACHE",
    "LOAD XML",
    "LOCK INSTANCE FOR BACKUP",
    "LOCK TABLES",
    "MASTER_POS_WAIT",
    "OPTIMIZE TABLE",
    "PREPARE",
    "PURGE BINARY LOGS",
    "RELEASE SAVEPOINT",
    "RENAME TABLE",
    "RENAME USER",
    "REPAIR TABLE",
    "RESET",
    "RESET MASTER",
    "RESET PERSIST",
    "RESET REPLICA",
    "RESET SLAVE",
    "RESTART",
    "REVOKE",
    "ROLLBACK",
    "ROLLBACK TO SAVEPOINT",
    "SAVEPOINT",
    "SET CHARACTER SET",
    "SET DEFAULT ROLE",
    "SET NAMES",
    "SET PASSWORD",
    "SET RESOURCE GROUP",
    "SET ROLE",
    "SET TRANSACTION",
    "SHOW",
    "SHOW BINARY LOGS",
    "SHOW BINLOG EVENTS",
    "SHOW CHARACTER SET",
    "SHOW COLLATION",
    "SHOW COLUMNS",
    "SHOW CREATE DATABASE",
    "SHOW CREATE EVENT",
    "SHOW CREATE FUNCTION",
    "SHOW CREATE PROCEDURE",
    "SHOW CREATE TABLE",
    "SHOW CREATE TRIGGER",
    "SHOW CREATE USER",
    "SHOW CREATE VIEW",
    "SHOW DATABASES",
    "SHOW ENGINE",
    "SHOW ENGINES",
    "SHOW ERRORS",
    "SHOW EVENTS",
    "SHOW FUNCTION CODE",
    "SHOW FUNCTION STATUS",
    "SHOW GRANTS",
    "SHOW INDEX",
    "SHOW MASTER STATUS",
    "SHOW OPEN TABLES",
    "SHOW PLUGINS",
    "SHOW PRIVILEGES",
    "SHOW PROCEDURE CODE",
    "SHOW PROCEDURE STATUS",
    "SHOW PROCESSLIST",
    "SHOW PROFILE",
    "SHOW PROFILES",
    "SHOW RELAYLOG EVENTS",
    "SHOW REPLICA STATUS",
    "SHOW REPLICAS",
    "SHOW SLAVE",
    "SHOW SLAVE HOSTS",
    "SHOW STATUS",
    "SHOW TABLE STATUS",
    "SHOW TABLES",
    "SHOW TRIGGERS",
    "SHOW VARIABLES",
    "SHOW WARNINGS",
    "SHUTDOWN",
    "SOURCE_POS_WAIT",
    "START GROUP_REPLICATION",
    "START REPLICA",
    "START SLAVE",
    "START TRANSACTION",
    "STOP GROUP_REPLICATION",
    "STOP REPLICA",
    "STOP SLAVE",
    "TABLE",
    "UNINSTALL COMPONENT",
    "UNINSTALL PLUGIN",
    "UNLOCK INSTANCE",
    "UNLOCK TABLES",
    "USE",
    "XA",
    // flow control
    // 'IF',
    "ITERATE",
    "LEAVE",
    "LOOP",
    "REPEAT",
    "RETURN",
    "WHILE"
  ]);
  var reservedSetOperations6 = expandPhrases(["UNION [ALL | DISTINCT]"]);
  var reservedJoins6 = expandPhrases([
    "JOIN",
    "{LEFT | RIGHT} [OUTER] JOIN",
    "{INNER | CROSS} JOIN",
    "NATURAL [INNER] JOIN",
    "NATURAL {LEFT | RIGHT} [OUTER] JOIN",
    // non-standard joins
    "STRAIGHT_JOIN"
  ]);
  var reservedPhrases6 = expandPhrases([
    "ON {UPDATE | DELETE} [SET NULL]",
    "CHARACTER SET",
    "{ROWS | RANGE} BETWEEN",
    "IDENTIFIED BY"
  ]);
  var mysql = {
    name: "mysql",
    tokenizerOptions: {
      reservedSelect: reservedSelect6,
      reservedClauses: [...reservedClauses6, ...standardOnelineClauses6, ...tabularOnelineClauses6],
      reservedSetOperations: reservedSetOperations6,
      reservedJoins: reservedJoins6,
      reservedPhrases: reservedPhrases6,
      supportsXor: true,
      reservedKeywords: keywords6,
      reservedDataTypes: dataTypes6,
      reservedFunctionNames: functions6,
      // TODO: support _ char set prefixes such as _utf8, _latin1, _binary, _utf8mb4, etc.
      stringTypes: [
        '""-qq-bs',
        { quote: "''-qq-bs", prefixes: ["N"] },
        { quote: "''-raw", prefixes: ["B", "X"], requirePrefix: true }
      ],
      identTypes: ["``"],
      identChars: { first: "$", rest: "$", allowFirstCharNumber: true },
      variableTypes: [
        { regex: "@@?[A-Za-z0-9_.$]+" },
        { quote: '""-qq-bs', prefixes: ["@"], requirePrefix: true },
        { quote: "''-qq-bs", prefixes: ["@"], requirePrefix: true },
        { quote: "``", prefixes: ["@"], requirePrefix: true }
      ],
      paramTypes: { positional: true },
      lineCommentTypes: ["--", "#"],
      operators: [
        "%",
        ":=",
        "&",
        "|",
        "^",
        "~",
        "<<",
        ">>",
        "<=>",
        "->",
        "->>",
        "&&",
        "||",
        "!",
        "*.*"
        // Not actually an operator
      ],
      postProcess: postProcess2
    },
    formatOptions: {
      onelineClauses: [...standardOnelineClauses6, ...tabularOnelineClauses6],
      tabularOnelineClauses: tabularOnelineClauses6
    }
  };
  var keywords7 = [
    // https://docs.pingcap.com/tidb/stable/keywords
    "ADD",
    // (R)
    "ALL",
    // (R)
    "ALTER",
    // (R)
    "ANALYZE",
    // (R)
    "AND",
    // (R)
    "ARRAY",
    // (R)
    "AS",
    // (R)
    "ASC",
    // (R)
    "BETWEEN",
    // (R)
    "BOTH",
    // (R)
    "BY",
    // (R)
    "CALL",
    // (R)
    "CASCADE",
    // (R)
    "CASE",
    // (R)
    "CHANGE",
    // (R)
    "CHECK",
    // (R)
    "COLLATE",
    // (R)
    "COLUMN",
    // (R)
    "CONSTRAINT",
    // (R)
    "CONTINUE",
    // (R)
    "CONVERT",
    // (R)
    "CREATE",
    // (R)
    "CROSS",
    // (R)
    "CURRENT_DATE",
    // (R)
    "CURRENT_ROLE",
    // (R)
    "CURRENT_TIME",
    // (R)
    "CURRENT_TIMESTAMP",
    // (R)
    "CURRENT_USER",
    // (R)
    "CURSOR",
    // (R)
    "DATABASE",
    // (R)
    "DATABASES",
    // (R)
    "DAY_HOUR",
    // (R)
    "DAY_MICROSECOND",
    // (R)
    "DAY_MINUTE",
    // (R)
    "DAY_SECOND",
    // (R)
    "DEFAULT",
    // (R)
    "DELAYED",
    // (R)
    "DELETE",
    // (R)
    "DESC",
    // (R)
    "DESCRIBE",
    // (R)
    "DISTINCT",
    // (R)
    "DISTINCTROW",
    // (R)
    "DIV",
    // (R)
    "DOUBLE",
    // (R)
    "DROP",
    // (R)
    "DUAL",
    // (R)
    "ELSE",
    // (R)
    "ELSEIF",
    // (R)
    "ENCLOSED",
    // (R)
    "ESCAPED",
    // (R)
    "EXCEPT",
    // (R)
    "EXISTS",
    // (R)
    "EXIT",
    // (R)
    "EXPLAIN",
    // (R)
    "FALSE",
    // (R)
    "FETCH",
    // (R)
    "FOR",
    // (R)
    "FORCE",
    // (R)
    "FOREIGN",
    // (R)
    "FROM",
    // (R)
    "FULLTEXT",
    // (R)
    "GENERATED",
    // (R)
    "GRANT",
    // (R)
    "GROUP",
    // (R)
    "GROUPS",
    // (R)
    "HAVING",
    // (R)
    "HIGH_PRIORITY",
    // (R)
    "HOUR_MICROSECOND",
    // (R)
    "HOUR_MINUTE",
    // (R)
    "HOUR_SECOND",
    // (R)
    "IF",
    // (R)
    "IGNORE",
    // (R)
    "ILIKE",
    // (R)
    "IN",
    // (R)
    "INDEX",
    // (R)
    "INFILE",
    // (R)
    "INNER",
    // (R)
    "INOUT",
    // (R)
    "INSERT",
    // (R)
    "INTERSECT",
    // (R)
    "INTERVAL",
    // (R)
    "INTO",
    // (R)
    "IS",
    // (R)
    "ITERATE",
    // (R)
    "JOIN",
    // (R)
    "KEY",
    // (R)
    "KEYS",
    // (R)
    "KILL",
    // (R)
    "LEADING",
    // (R)
    "LEAVE",
    // (R)
    "LEFT",
    // (R)
    "LIKE",
    // (R)
    "LIMIT",
    // (R)
    "LINEAR",
    // (R)
    "LINES",
    // (R)
    "LOAD",
    // (R)
    "LOCALTIME",
    // (R)
    "LOCALTIMESTAMP",
    // (R)
    "LOCK",
    // (R)
    "LONG",
    // (R)
    "LOW_PRIORITY",
    // (R)
    "MATCH",
    // (R)
    "MAXVALUE",
    // (R)
    "MINUTE_MICROSECOND",
    // (R)
    "MINUTE_SECOND",
    // (R)
    "MOD",
    // (R)
    "NATURAL",
    // (R)
    "NOT",
    // (R)
    "NO_WRITE_TO_BINLOG",
    // (R)
    "NULL",
    // (R)
    "OF",
    // (R)
    "ON",
    // (R)
    "OPTIMIZE",
    // (R)
    "OPTION",
    // (R)
    "OPTIONALLY",
    // (R)
    "OR",
    // (R)
    "ORDER",
    // (R)
    "OUT",
    // (R)
    "OUTER",
    // (R)
    "OUTFILE",
    // (R)
    "OVER",
    // (R)
    "PARTITION",
    // (R)
    "PRIMARY",
    // (R)
    "PROCEDURE",
    // (R)
    "RANGE",
    // (R)
    "READ",
    // (R)
    "RECURSIVE",
    // (R)
    "REFERENCES",
    // (R)
    "REGEXP",
    // (R)
    "RELEASE",
    // (R)
    "RENAME",
    // (R)
    "REPEAT",
    // (R)
    "REPLACE",
    // (R)
    "REQUIRE",
    // (R)
    "RESTRICT",
    // (R)
    "REVOKE",
    // (R)
    "RIGHT",
    // (R)
    "RLIKE",
    // (R)
    "ROW",
    // (R)
    "ROWS",
    // (R)
    "SECOND_MICROSECOND",
    // (R)
    "SELECT",
    // (R)
    "SET",
    // (R)
    "SHOW",
    // (R)
    "SPATIAL",
    // (R)
    "SQL",
    // (R)
    "SQLEXCEPTION",
    // (R)
    "SQLSTATE",
    // (R)
    "SQLWARNING",
    // (R)
    "SQL_BIG_RESULT",
    // (R)
    "SQL_CALC_FOUND_ROWS",
    // (R)
    "SQL_SMALL_RESULT",
    // (R)
    "SSL",
    // (R)
    "STARTING",
    // (R)
    "STATS_EXTENDED",
    // (R)
    "STORED",
    // (R)
    "STRAIGHT_JOIN",
    // (R)
    "TABLE",
    // (R)
    "TABLESAMPLE",
    // (R)
    "TERMINATED",
    // (R)
    "THEN",
    // (R)
    "TO",
    // (R)
    "TRAILING",
    // (R)
    "TRIGGER",
    // (R)
    "TRUE",
    // (R)
    "TiDB_CURRENT_TSO",
    // (R)
    "UNION",
    // (R)
    "UNIQUE",
    // (R)
    "UNLOCK",
    // (R)
    "UNSIGNED",
    // (R)
    "UNTIL",
    // (R)
    "UPDATE",
    // (R)
    "USAGE",
    // (R)
    "USE",
    // (R)
    "USING",
    // (R)
    "UTC_DATE",
    // (R)
    "UTC_TIME",
    // (R)
    "UTC_TIMESTAMP",
    // (R)
    "VALUES",
    // (R)
    "VIRTUAL",
    // (R)
    "WHEN",
    // (R)
    "WHERE",
    // (R)
    "WHILE",
    // (R)
    "WINDOW",
    // (R)
    "WITH",
    // (R)
    "WRITE",
    // (R)
    "XOR",
    // (R)
    "YEAR_MONTH",
    // (R)
    "ZEROFILL"
    // (R)
  ];
  var dataTypes7 = [
    // https://docs.pingcap.com/tidb/stable/data-type-overview
    "BIGINT",
    // (R)
    "BINARY",
    // (R)
    "BIT",
    "BLOB",
    // (R)
    "BOOL",
    // (R)
    "BOOLEAN",
    // (R)
    "CHAR",
    // (R)
    "CHARACTER",
    // (R)
    "DATE",
    // (R)
    "DATETIME",
    // (R)
    "DEC",
    // (R)
    "DECIMAL",
    // (R)
    "DOUBLE PRECISION",
    "DOUBLE",
    // (R)
    "ENUM",
    "FIXED",
    "INT",
    // (R)
    "INT1",
    // (R)
    "INT2",
    // (R)
    "INT3",
    // (R)
    "INT4",
    // (R)
    "INT8",
    // (R)
    "INTEGER",
    // (R)
    "LONGBLOB",
    // (R)
    "LONGTEXT",
    // (R)
    "MEDIUMBLOB",
    // (R)
    "MEDIUMINT",
    // (R)
    "MIDDLEINT",
    // (R)
    "NATIONAL CHAR",
    // (R)
    "NATIONAL VARCHAR",
    // (R)
    "NUMERIC",
    // (R)
    "PRECISION",
    // (R)
    "SMALLINT",
    // (R)
    "TEXT",
    "TIME",
    "TIMESTAMP",
    // (R)
    "TINYBLOB",
    // (R)
    "TINYINT",
    // (R)
    "TINYTEXT",
    // (R)
    "VARBINARY",
    // (R)
    "VARCHAR",
    // (R)
    "VARCHARACTER",
    // (R)
    "VARYING",
    // (R)
    "YEAR"
    // 'SET' // handled as special-case in postProcess
  ];
  var functions7 = [
    // https://docs.pingcap.com/tidb/stable/sql-statement-show-builtins
    // https://docs.pingcap.com/tidb/stable/functions-and-operators-overview
    // + MySQL aggregate functions: https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html
    // + MySQL window functions: https://dev.mysql.com/doc/refman/8.0/en/window-functions-usage.html
    "ABS",
    "ACOS",
    "ADDDATE",
    "ADDTIME",
    "AES_DECRYPT",
    "AES_ENCRYPT",
    // 'AND',
    "ANY_VALUE",
    "ASCII",
    "ASIN",
    "ATAN",
    "ATAN2",
    "AVG",
    "BENCHMARK",
    "BIN",
    "BIN_TO_UUID",
    "BIT_AND",
    "BIT_COUNT",
    "BIT_LENGTH",
    "BIT_OR",
    "BIT_XOR",
    "BITAND",
    "BITNEG",
    "BITOR",
    "BITXOR",
    "CASE",
    "CAST",
    "CEIL",
    "CEILING",
    "CHAR_FUNC",
    "CHAR_LENGTH",
    "CHARACTER_LENGTH",
    "CHARSET",
    "COALESCE",
    "COERCIBILITY",
    "COLLATION",
    "COMPRESS",
    "CONCAT",
    "CONCAT_WS",
    "CONNECTION_ID",
    "CONV",
    "CONVERT",
    "CONVERT_TZ",
    "COS",
    "COT",
    "COUNT",
    "CRC32",
    "CUME_DIST",
    "CURDATE",
    "CURRENT_DATE",
    "CURRENT_RESOURCE_GROUP",
    "CURRENT_ROLE",
    "CURRENT_TIME",
    "CURRENT_TIMESTAMP",
    "CURRENT_USER",
    "CURTIME",
    "DATABASE",
    "DATE",
    "DATE_ADD",
    "DATE_FORMAT",
    "DATE_SUB",
    "DATEDIFF",
    "DAY",
    "DAYNAME",
    "DAYOFMONTH",
    "DAYOFWEEK",
    "DAYOFYEAR",
    "DECODE",
    "DEFAULT_FUNC",
    "DEGREES",
    "DENSE_RANK",
    "DES_DECRYPT",
    "DES_ENCRYPT",
    "DIV",
    "ELT",
    "ENCODE",
    "ENCRYPT",
    "EQ",
    "EXP",
    "EXPORT_SET",
    "EXTRACT",
    "FIELD",
    "FIND_IN_SET",
    "FIRST_VALUE",
    "FLOOR",
    "FORMAT",
    "FORMAT_BYTES",
    "FORMAT_NANO_TIME",
    "FOUND_ROWS",
    "FROM_BASE64",
    "FROM_DAYS",
    "FROM_UNIXTIME",
    "GE",
    "GET_FORMAT",
    "GET_LOCK",
    "GETPARAM",
    "GREATEST",
    "GROUP_CONCAT",
    "GROUPING",
    "GT",
    "HEX",
    "HOUR",
    "IF",
    "IFNULL",
    "ILIKE",
    // 'IN',
    "INET6_ATON",
    "INET6_NTOA",
    "INET_ATON",
    "INET_NTOA",
    "INSERT_FUNC",
    "INSTR",
    "INTDIV",
    "INTERVAL",
    "IS_FREE_LOCK",
    "IS_IPV4",
    "IS_IPV4_COMPAT",
    "IS_IPV4_MAPPED",
    "IS_IPV6",
    "IS_USED_LOCK",
    "IS_UUID",
    "ISFALSE",
    "ISNULL",
    "ISTRUE",
    "JSON_ARRAY",
    "JSON_ARRAYAGG",
    "JSON_ARRAY_APPEND",
    "JSON_ARRAY_INSERT",
    "JSON_CONTAINS",
    "JSON_CONTAINS_PATH",
    "JSON_DEPTH",
    "JSON_EXTRACT",
    "JSON_INSERT",
    "JSON_KEYS",
    "JSON_LENGTH",
    "JSON_MEMBEROF",
    "JSON_MERGE",
    "JSON_MERGE_PATCH",
    "JSON_MERGE_PRESERVE",
    "JSON_OBJECT",
    "JSON_OBJECTAGG",
    "JSON_OVERLAPS",
    "JSON_PRETTY",
    "JSON_QUOTE",
    "JSON_REMOVE",
    "JSON_REPLACE",
    "JSON_SEARCH",
    "JSON_SET",
    "JSON_STORAGE_FREE",
    "JSON_STORAGE_SIZE",
    "JSON_TYPE",
    "JSON_UNQUOTE",
    "JSON_VALID",
    "LAG",
    "LAST_DAY",
    "LAST_INSERT_ID",
    "LAST_VALUE",
    "LASTVAL",
    "LCASE",
    "LE",
    "LEAD",
    "LEAST",
    "LEFT",
    "LEFTSHIFT",
    "LENGTH",
    "LIKE",
    "LN",
    "LOAD_FILE",
    "LOCALTIME",
    "LOCALTIMESTAMP",
    "LOCATE",
    "LOG",
    "LOG10",
    "LOG2",
    "LOWER",
    "LPAD",
    "LT",
    "LTRIM",
    "MAKE_SET",
    "MAKEDATE",
    "MAKETIME",
    "MASTER_POS_WAIT",
    "MAX",
    "MD5",
    "MICROSECOND",
    "MID",
    "MIN",
    "MINUS",
    "MINUTE",
    "MOD",
    "MONTH",
    "MONTHNAME",
    "MUL",
    "NAME_CONST",
    "NE",
    "NEXTVAL",
    "NOT",
    "NOW",
    "NTH_VALUE",
    "NTILE",
    "NULLEQ",
    "OCT",
    "OCTET_LENGTH",
    "OLD_PASSWORD",
    // 'OR',
    "ORD",
    "PASSWORD_FUNC",
    "PERCENT_RANK",
    "PERIOD_ADD",
    "PERIOD_DIFF",
    "PI",
    "PLUS",
    "POSITION",
    "POW",
    "POWER",
    "QUARTER",
    "QUOTE",
    "RADIANS",
    "RAND",
    "RANDOM_BYTES",
    "RANK",
    "REGEXP",
    "REGEXP_INSTR",
    "REGEXP_LIKE",
    "REGEXP_REPLACE",
    "REGEXP_SUBSTR",
    "RELEASE_ALL_LOCKS",
    "RELEASE_LOCK",
    "REPEAT",
    "REPLACE",
    "REVERSE",
    "RIGHT",
    "RIGHTSHIFT",
    "ROUND",
    "ROW_COUNT",
    "ROW_NUMBER",
    "RPAD",
    "RTRIM",
    "SCHEMA",
    "SEC_TO_TIME",
    "SECOND",
    "SESSION_USER",
    "SETVAL",
    "SETVAR",
    "SHA",
    "SHA1",
    "SHA2",
    "SIGN",
    "SIN",
    "SLEEP",
    "SM3",
    "SPACE",
    "SQRT",
    "STD",
    "STDDEV",
    "STDDEV_POP",
    "STDDEV_SAMP",
    "STR_TO_DATE",
    "STRCMP",
    "SUBDATE",
    "SUBSTR",
    "SUBSTRING",
    "SUBSTRING_INDEX",
    "SUBTIME",
    "SUM",
    "SYSDATE",
    "SYSTEM_USER",
    "TAN",
    "TIDB_BOUNDED_STALENESS",
    "TIDB_CURRENT_TSO",
    "TIDB_DECODE_BINARY_PLAN",
    "TIDB_DECODE_KEY",
    "TIDB_DECODE_PLAN",
    "TIDB_DECODE_SQL_DIGESTS",
    "TIDB_ENCODE_SQL_DIGEST",
    "TIDB_IS_DDL_OWNER",
    "TIDB_PARSE_TSO",
    "TIDB_PARSE_TSO_LOGICAL",
    "TIDB_ROW_CHECKSUM",
    "TIDB_SHARD",
    "TIDB_VERSION",
    "TIME",
    "TIME_FORMAT",
    "TIME_TO_SEC",
    "TIMEDIFF",
    "TIMESTAMP",
    "TIMESTAMPADD",
    "TIMESTAMPDIFF",
    "TO_BASE64",
    "TO_DAYS",
    "TO_SECONDS",
    "TRANSLATE",
    "TRIM",
    "TRUNCATE",
    "UCASE",
    "UNARYMINUS",
    "UNCOMPRESS",
    "UNCOMPRESSED_LENGTH",
    "UNHEX",
    "UNIX_TIMESTAMP",
    "UPPER",
    // 'USER',
    "UTC_DATE",
    "UTC_TIME",
    "UTC_TIMESTAMP",
    "UUID",
    "UUID_SHORT",
    "UUID_TO_BIN",
    "VALIDATE_PASSWORD_STRENGTH",
    "VAR_POP",
    "VAR_SAMP",
    "VARIANCE",
    "VERSION",
    "VITESS_HASH",
    "WEEK",
    "WEEKDAY",
    "WEEKOFYEAR",
    "WEIGHT_STRING",
    // 'XOR',
    "YEAR",
    "YEARWEEK"
  ];
  var reservedSelect7 = expandPhrases(["SELECT [ALL | DISTINCT | DISTINCTROW]"]);
  var reservedClauses7 = expandPhrases([
    // queries
    "WITH [RECURSIVE]",
    "FROM",
    "WHERE",
    "GROUP BY",
    "HAVING",
    "WINDOW",
    "PARTITION BY",
    "ORDER BY",
    "LIMIT",
    "OFFSET",
    // Data manipulation
    // - insert:
    "INSERT [LOW_PRIORITY | DELAYED | HIGH_PRIORITY] [IGNORE] [INTO]",
    "REPLACE [LOW_PRIORITY | DELAYED] [INTO]",
    "VALUES",
    "ON DUPLICATE KEY UPDATE",
    // - update:
    "SET"
  ]);
  var standardOnelineClauses7 = expandPhrases(["CREATE [TEMPORARY] TABLE [IF NOT EXISTS]"]);
  var tabularOnelineClauses7 = expandPhrases([
    // https://docs.pingcap.com/tidb/stable/sql-statement-create-view
    "CREATE [OR REPLACE] [SQL SECURITY DEFINER | SQL SECURITY INVOKER] VIEW [IF NOT EXISTS]",
    // https://docs.pingcap.com/tidb/stable/sql-statement-update
    "UPDATE [LOW_PRIORITY] [IGNORE]",
    // https://docs.pingcap.com/tidb/stable/sql-statement-delete
    "DELETE [LOW_PRIORITY] [QUICK] [IGNORE] FROM",
    // https://docs.pingcap.com/tidb/stable/sql-statement-drop-table
    "DROP [TEMPORARY] TABLE [IF EXISTS]",
    // https://docs.pingcap.com/tidb/stable/sql-statement-alter-table
    "ALTER TABLE",
    "ADD [COLUMN]",
    "{CHANGE | MODIFY} [COLUMN]",
    "DROP [COLUMN]",
    "RENAME [TO | AS]",
    "RENAME COLUMN",
    "ALTER [COLUMN]",
    "{SET | DROP} DEFAULT",
    // for alter column
    // https://docs.pingcap.com/tidb/stable/sql-statement-truncate
    "TRUNCATE [TABLE]",
    // https://docs.pingcap.com/tidb/stable/sql-statement-alter-database
    "ALTER DATABASE",
    // https://docs.pingcap.com/tidb/stable/sql-statement-alter-instance
    "ALTER INSTANCE",
    "ALTER RESOURCE GROUP",
    "ALTER SEQUENCE",
    // https://docs.pingcap.com/tidb/stable/sql-statement-alter-user
    "ALTER USER",
    "ALTER VIEW",
    "ANALYZE TABLE",
    "CHECK TABLE",
    "CHECKSUM TABLE",
    "COMMIT",
    "CREATE DATABASE",
    "CREATE INDEX",
    "CREATE RESOURCE GROUP",
    "CREATE ROLE",
    "CREATE SEQUENCE",
    "CREATE USER",
    "DEALLOCATE PREPARE",
    "DESCRIBE",
    "DROP DATABASE",
    "DROP INDEX",
    "DROP RESOURCE GROUP",
    "DROP ROLE",
    "DROP TABLESPACE",
    "DROP USER",
    "DROP VIEW",
    "EXPLAIN",
    "FLUSH",
    // https://docs.pingcap.com/tidb/stable/sql-statement-grant-privileges
    "GRANT",
    "IMPORT TABLE",
    "INSTALL COMPONENT",
    "INSTALL PLUGIN",
    "KILL",
    "LOAD DATA",
    "LOCK INSTANCE FOR BACKUP",
    "LOCK TABLES",
    "OPTIMIZE TABLE",
    "PREPARE",
    "RELEASE SAVEPOINT",
    "RENAME TABLE",
    "RENAME USER",
    "REPAIR TABLE",
    "RESET",
    "REVOKE",
    "ROLLBACK",
    "ROLLBACK TO SAVEPOINT",
    "SAVEPOINT",
    "SET CHARACTER SET",
    "SET DEFAULT ROLE",
    "SET NAMES",
    "SET PASSWORD",
    "SET RESOURCE GROUP",
    "SET ROLE",
    "SET TRANSACTION",
    "SHOW",
    "SHOW BINARY LOGS",
    "SHOW BINLOG EVENTS",
    "SHOW CHARACTER SET",
    "SHOW COLLATION",
    "SHOW COLUMNS",
    "SHOW CREATE DATABASE",
    "SHOW CREATE TABLE",
    "SHOW CREATE USER",
    "SHOW CREATE VIEW",
    "SHOW DATABASES",
    "SHOW ENGINE",
    "SHOW ENGINES",
    "SHOW ERRORS",
    "SHOW EVENTS",
    "SHOW GRANTS",
    "SHOW INDEX",
    "SHOW MASTER STATUS",
    "SHOW OPEN TABLES",
    "SHOW PLUGINS",
    "SHOW PRIVILEGES",
    "SHOW PROCESSLIST",
    "SHOW PROFILE",
    "SHOW PROFILES",
    "SHOW STATUS",
    "SHOW TABLE STATUS",
    "SHOW TABLES",
    "SHOW TRIGGERS",
    "SHOW VARIABLES",
    "SHOW WARNINGS",
    // https://docs.pingcap.com/tidb/stable/sql-statement-table
    "TABLE",
    "UNINSTALL COMPONENT",
    "UNINSTALL PLUGIN",
    "UNLOCK INSTANCE",
    "UNLOCK TABLES",
    // https://docs.pingcap.com/tidb/stable/sql-statement-use
    "USE"
  ]);
  var reservedSetOperations7 = expandPhrases(["UNION [ALL | DISTINCT]"]);
  var reservedJoins7 = expandPhrases([
    "JOIN",
    "{LEFT | RIGHT} [OUTER] JOIN",
    "{INNER | CROSS} JOIN",
    "NATURAL [INNER] JOIN",
    "NATURAL {LEFT | RIGHT} [OUTER] JOIN",
    // non-standard joins
    "STRAIGHT_JOIN"
  ]);
  var reservedPhrases7 = expandPhrases([
    "ON {UPDATE | DELETE} [SET NULL]",
    "CHARACTER SET",
    "{ROWS | RANGE} BETWEEN",
    "IDENTIFIED BY"
  ]);
  var tidb = {
    name: "tidb",
    tokenizerOptions: {
      reservedSelect: reservedSelect7,
      reservedClauses: [...reservedClauses7, ...standardOnelineClauses7, ...tabularOnelineClauses7],
      reservedSetOperations: reservedSetOperations7,
      reservedJoins: reservedJoins7,
      reservedPhrases: reservedPhrases7,
      supportsXor: true,
      reservedKeywords: keywords7,
      reservedDataTypes: dataTypes7,
      reservedFunctionNames: functions7,
      // TODO: support _ char set prefixes such as _utf8, _latin1, _binary, _utf8mb4, etc.
      stringTypes: [
        '""-qq-bs',
        { quote: "''-qq-bs", prefixes: ["N"] },
        { quote: "''-raw", prefixes: ["B", "X"], requirePrefix: true }
      ],
      identTypes: ["``"],
      identChars: { first: "$", rest: "$", allowFirstCharNumber: true },
      variableTypes: [
        { regex: "@@?[A-Za-z0-9_.$]+" },
        { quote: '""-qq-bs', prefixes: ["@"], requirePrefix: true },
        { quote: "''-qq-bs", prefixes: ["@"], requirePrefix: true },
        { quote: "``", prefixes: ["@"], requirePrefix: true }
      ],
      paramTypes: { positional: true },
      lineCommentTypes: ["--", "#"],
      operators: [
        "%",
        ":=",
        "&",
        "|",
        "^",
        "~",
        "<<",
        ">>",
        "<=>",
        "->",
        "->>",
        "&&",
        "||",
        "!",
        "*.*"
        // Not actually an operator
      ],
      postProcess: postProcess2
    },
    formatOptions: {
      onelineClauses: [...standardOnelineClauses7, ...tabularOnelineClauses7],
      tabularOnelineClauses: tabularOnelineClauses7
    }
  };
  var functions8 = [
    // https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/functions.html
    "ABORT",
    "ABS",
    "ACOS",
    "ADVISOR",
    "ARRAY_AGG",
    "ARRAY_AGG",
    "ARRAY_APPEND",
    "ARRAY_AVG",
    "ARRAY_BINARY_SEARCH",
    "ARRAY_CONCAT",
    "ARRAY_CONTAINS",
    "ARRAY_COUNT",
    "ARRAY_DISTINCT",
    "ARRAY_EXCEPT",
    "ARRAY_FLATTEN",
    "ARRAY_IFNULL",
    "ARRAY_INSERT",
    "ARRAY_INTERSECT",
    "ARRAY_LENGTH",
    "ARRAY_MAX",
    "ARRAY_MIN",
    "ARRAY_MOVE",
    "ARRAY_POSITION",
    "ARRAY_PREPEND",
    "ARRAY_PUT",
    "ARRAY_RANGE",
    "ARRAY_REMOVE",
    "ARRAY_REPEAT",
    "ARRAY_REPLACE",
    "ARRAY_REVERSE",
    "ARRAY_SORT",
    "ARRAY_STAR",
    "ARRAY_SUM",
    "ARRAY_SYMDIFF",
    "ARRAY_SYMDIFF1",
    "ARRAY_SYMDIFFN",
    "ARRAY_UNION",
    "ASIN",
    "ATAN",
    "ATAN2",
    "AVG",
    "BASE64",
    "BASE64_DECODE",
    "BASE64_ENCODE",
    "BITAND ",
    "BITCLEAR ",
    "BITNOT ",
    "BITOR ",
    "BITSET ",
    "BITSHIFT ",
    "BITTEST ",
    "BITXOR ",
    "CEIL",
    "CLOCK_LOCAL",
    "CLOCK_MILLIS",
    "CLOCK_STR",
    "CLOCK_TZ",
    "CLOCK_UTC",
    "COALESCE",
    "CONCAT",
    "CONCAT2",
    "CONTAINS",
    "CONTAINS_TOKEN",
    "CONTAINS_TOKEN_LIKE",
    "CONTAINS_TOKEN_REGEXP",
    "COS",
    "COUNT",
    "COUNT",
    "COUNTN",
    "CUME_DIST",
    "CURL",
    "DATE_ADD_MILLIS",
    "DATE_ADD_STR",
    "DATE_DIFF_MILLIS",
    "DATE_DIFF_STR",
    "DATE_FORMAT_STR",
    "DATE_PART_MILLIS",
    "DATE_PART_STR",
    "DATE_RANGE_MILLIS",
    "DATE_RANGE_STR",
    "DATE_TRUNC_MILLIS",
    "DATE_TRUNC_STR",
    "DECODE",
    "DECODE_JSON",
    "DEGREES",
    "DENSE_RANK",
    "DURATION_TO_STR",
    // 'E',
    "ENCODED_SIZE",
    "ENCODE_JSON",
    "EXP",
    "FIRST_VALUE",
    "FLOOR",
    "GREATEST",
    "HAS_TOKEN",
    "IFINF",
    "IFMISSING",
    "IFMISSINGORNULL",
    "IFNAN",
    "IFNANORINF",
    "IFNULL",
    "INITCAP",
    "ISARRAY",
    "ISATOM",
    "ISBITSET",
    "ISBOOLEAN",
    "ISNUMBER",
    "ISOBJECT",
    "ISSTRING",
    "LAG",
    "LAST_VALUE",
    "LEAD",
    "LEAST",
    "LENGTH",
    "LN",
    "LOG",
    "LOWER",
    "LTRIM",
    "MAX",
    "MEAN",
    "MEDIAN",
    "META",
    "MILLIS",
    "MILLIS_TO_LOCAL",
    "MILLIS_TO_STR",
    "MILLIS_TO_TZ",
    "MILLIS_TO_UTC",
    "MILLIS_TO_ZONE_NAME",
    "MIN",
    "MISSINGIF",
    "NANIF",
    "NEGINFIF",
    "NOW_LOCAL",
    "NOW_MILLIS",
    "NOW_STR",
    "NOW_TZ",
    "NOW_UTC",
    "NTH_VALUE",
    "NTILE",
    "NULLIF",
    "NVL",
    "NVL2",
    "OBJECT_ADD",
    "OBJECT_CONCAT",
    "OBJECT_INNER_PAIRS",
    "OBJECT_INNER_VALUES",
    "OBJECT_LENGTH",
    "OBJECT_NAMES",
    "OBJECT_PAIRS",
    "OBJECT_PUT",
    "OBJECT_REMOVE",
    "OBJECT_RENAME",
    "OBJECT_REPLACE",
    "OBJECT_UNWRAP",
    "OBJECT_VALUES",
    "PAIRS",
    "PERCENT_RANK",
    "PI",
    "POLY_LENGTH",
    "POSINFIF",
    "POSITION",
    "POWER",
    "RADIANS",
    "RANDOM",
    "RANK",
    "RATIO_TO_REPORT",
    "REGEXP_CONTAINS",
    "REGEXP_LIKE",
    "REGEXP_MATCHES",
    "REGEXP_POSITION",
    "REGEXP_REPLACE",
    "REGEXP_SPLIT",
    "REGEX_CONTAINS",
    "REGEX_LIKE",
    "REGEX_MATCHES",
    "REGEX_POSITION",
    "REGEX_REPLACE",
    "REGEX_SPLIT",
    "REPEAT",
    "REPLACE",
    "REVERSE",
    "ROUND",
    "ROW_NUMBER",
    "RTRIM",
    "SEARCH",
    "SEARCH_META",
    "SEARCH_SCORE",
    "SIGN",
    "SIN",
    "SPLIT",
    "SQRT",
    "STDDEV",
    "STDDEV_POP",
    "STDDEV_SAMP",
    "STR_TO_DURATION",
    "STR_TO_MILLIS",
    "STR_TO_TZ",
    "STR_TO_UTC",
    "STR_TO_ZONE_NAME",
    "SUBSTR",
    "SUFFIXES",
    "SUM",
    "TAN",
    "TITLE",
    "TOARRAY",
    "TOATOM",
    "TOBOOLEAN",
    "TOKENS",
    "TOKENS",
    "TONUMBER",
    "TOOBJECT",
    "TOSTRING",
    "TRIM",
    "TRUNC",
    // 'TYPE', // disabled
    "UPPER",
    "UUID",
    "VARIANCE",
    "VARIANCE_POP",
    "VARIANCE_SAMP",
    "VAR_POP",
    "VAR_SAMP",
    "WEEKDAY_MILLIS",
    "WEEKDAY_STR",
    // type casting
    // not implemented in N1QL, but added here now for the sake of tests
    // https://docs.couchbase.com/server/current/analytics/3_query.html#Vs_SQL-92
    "CAST"
  ];
  var keywords8 = [
    // https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/reservedwords.html
    "ADVISE",
    "ALL",
    "ALTER",
    "ANALYZE",
    "AND",
    "ANY",
    "ARRAY",
    "AS",
    "ASC",
    "AT",
    "BEGIN",
    "BETWEEN",
    "BINARY",
    "BOOLEAN",
    "BREAK",
    "BUCKET",
    "BUILD",
    "BY",
    "CALL",
    "CASE",
    "CAST",
    "CLUSTER",
    "COLLATE",
    "COLLECTION",
    "COMMIT",
    "COMMITTED",
    "CONNECT",
    "CONTINUE",
    "CORRELATED",
    "COVER",
    "CREATE",
    "CURRENT",
    "DATABASE",
    "DATASET",
    "DATASTORE",
    "DECLARE",
    "DECREMENT",
    "DELETE",
    "DERIVED",
    "DESC",
    "DESCRIBE",
    "DISTINCT",
    "DO",
    "DROP",
    "EACH",
    "ELEMENT",
    "ELSE",
    "END",
    "EVERY",
    "EXCEPT",
    "EXCLUDE",
    "EXECUTE",
    "EXISTS",
    "EXPLAIN",
    "FALSE",
    "FETCH",
    "FILTER",
    "FIRST",
    "FLATTEN",
    "FLUSH",
    "FOLLOWING",
    "FOR",
    "FORCE",
    "FROM",
    "FTS",
    "FUNCTION",
    "GOLANG",
    "GRANT",
    "GROUP",
    "GROUPS",
    "GSI",
    "HASH",
    "HAVING",
    "IF",
    "IGNORE",
    "ILIKE",
    "IN",
    "INCLUDE",
    "INCREMENT",
    "INDEX",
    "INFER",
    "INLINE",
    "INNER",
    "INSERT",
    "INTERSECT",
    "INTO",
    "IS",
    "ISOLATION",
    "JAVASCRIPT",
    "JOIN",
    "KEY",
    "KEYS",
    "KEYSPACE",
    "KNOWN",
    "LANGUAGE",
    "LAST",
    "LEFT",
    "LET",
    "LETTING",
    "LEVEL",
    "LIKE",
    "LIMIT",
    "LSM",
    "MAP",
    "MAPPING",
    "MATCHED",
    "MATERIALIZED",
    "MERGE",
    "MINUS",
    "MISSING",
    "NAMESPACE",
    "NEST",
    "NL",
    "NO",
    "NOT",
    "NTH_VALUE",
    "NULL",
    "NULLS",
    "NUMBER",
    "OBJECT",
    "OFFSET",
    "ON",
    "OPTION",
    "OPTIONS",
    "OR",
    "ORDER",
    "OTHERS",
    "OUTER",
    "OVER",
    "PARSE",
    "PARTITION",
    "PASSWORD",
    "PATH",
    "POOL",
    "PRECEDING",
    "PREPARE",
    "PRIMARY",
    "PRIVATE",
    "PRIVILEGE",
    "PROBE",
    "PROCEDURE",
    "PUBLIC",
    "RANGE",
    "RAW",
    "REALM",
    "REDUCE",
    "RENAME",
    "RESPECT",
    "RETURN",
    "RETURNING",
    "REVOKE",
    "RIGHT",
    "ROLE",
    "ROLLBACK",
    "ROW",
    "ROWS",
    "SATISFIES",
    "SAVEPOINT",
    "SCHEMA",
    "SCOPE",
    "SELECT",
    "SELF",
    "SEMI",
    "SET",
    "SHOW",
    "SOME",
    "START",
    "STATISTICS",
    "STRING",
    "SYSTEM",
    "THEN",
    "TIES",
    "TO",
    "TRAN",
    "TRANSACTION",
    "TRIGGER",
    "TRUE",
    "TRUNCATE",
    "UNBOUNDED",
    "UNDER",
    "UNION",
    "UNIQUE",
    "UNKNOWN",
    "UNNEST",
    "UNSET",
    "UPDATE",
    "UPSERT",
    "USE",
    "USER",
    "USING",
    "VALIDATE",
    "VALUE",
    "VALUED",
    "VALUES",
    "VIA",
    "VIEW",
    "WHEN",
    "WHERE",
    "WHILE",
    "WINDOW",
    "WITH",
    "WITHIN",
    "WORK",
    "XOR"
  ];
  var dataTypes8 = [
    // N1QL does not support any way of declaring types for columns.
    // It does not support the CREATE TABLE statement nor the CAST() expression.
    //
    // It does have several keywords like ARRAY and OBJECT, which seem to refer to types,
    // but they are used as operators. It also reserves several words like STRING and NUMBER,
    // which it actually doesn't use.
    //
    // https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/datatypes.html
  ];
  var reservedSelect8 = expandPhrases(["SELECT [ALL | DISTINCT]"]);
  var reservedClauses8 = expandPhrases([
    // queries
    "WITH",
    "FROM",
    "WHERE",
    "GROUP BY",
    "HAVING",
    "WINDOW",
    "PARTITION BY",
    "ORDER BY",
    "LIMIT",
    "OFFSET",
    // Data manipulation
    // - insert:
    "INSERT INTO",
    "VALUES",
    // - update:
    "SET",
    // - merge:
    "MERGE INTO",
    "WHEN [NOT] MATCHED THEN",
    "UPDATE SET",
    "INSERT",
    // other
    "NEST",
    "UNNEST",
    "RETURNING"
  ]);
  var onelineClauses = expandPhrases([
    // - update:
    "UPDATE",
    // - delete:
    "DELETE FROM",
    // - set schema:
    "SET SCHEMA",
    // https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/reservedwords.html
    "ADVISE",
    "ALTER INDEX",
    "BEGIN TRANSACTION",
    "BUILD INDEX",
    "COMMIT TRANSACTION",
    "CREATE COLLECTION",
    "CREATE FUNCTION",
    "CREATE INDEX",
    "CREATE PRIMARY INDEX",
    "CREATE SCOPE",
    "DROP COLLECTION",
    "DROP FUNCTION",
    "DROP INDEX",
    "DROP PRIMARY INDEX",
    "DROP SCOPE",
    "EXECUTE",
    "EXECUTE FUNCTION",
    "EXPLAIN",
    "GRANT",
    "INFER",
    "PREPARE",
    "REVOKE",
    "ROLLBACK TRANSACTION",
    "SAVEPOINT",
    "SET TRANSACTION",
    "UPDATE STATISTICS",
    "UPSERT",
    // other
    "LET",
    "SET CURRENT SCHEMA",
    "SHOW",
    "USE [PRIMARY] KEYS"
  ]);
  var reservedSetOperations8 = expandPhrases(["UNION [ALL]", "EXCEPT [ALL]", "INTERSECT [ALL]"]);
  var reservedJoins8 = expandPhrases(["JOIN", "{LEFT | RIGHT} [OUTER] JOIN", "INNER JOIN"]);
  var reservedPhrases8 = expandPhrases(["{ROWS | RANGE | GROUPS} BETWEEN"]);
  var n1ql = {
    name: "n1ql",
    tokenizerOptions: {
      reservedSelect: reservedSelect8,
      reservedClauses: [...reservedClauses8, ...onelineClauses],
      reservedSetOperations: reservedSetOperations8,
      reservedJoins: reservedJoins8,
      reservedPhrases: reservedPhrases8,
      supportsXor: true,
      reservedKeywords: keywords8,
      reservedDataTypes: dataTypes8,
      reservedFunctionNames: functions8,
      // NOTE: single quotes are actually not supported in N1QL,
      // but we support them anyway as all other SQL dialects do,
      // which simplifies writing tests that are shared between all dialects.
      stringTypes: ['""-bs', "''-bs"],
      identTypes: ["``"],
      extraParens: ["[]", "{}"],
      paramTypes: { positional: true, numbered: ["$"], named: ["$"] },
      lineCommentTypes: ["#", "--"],
      operators: ["%", "==", ":", "||"]
    },
    formatOptions: {
      onelineClauses
    }
  };
  var keywords9 = [
    // https://docs.oracle.com/cd/B19306_01/appdev.102/b14261/reservewords.htm
    // 'A',
    "ADD",
    "AGENT",
    "AGGREGATE",
    "ALL",
    "ALTER",
    "AND",
    "ANY",
    "ARROW",
    "AS",
    "ASC",
    "AT",
    "ATTRIBUTE",
    "AUTHID",
    "AVG",
    "BEGIN",
    "BETWEEN",
    "BLOCK",
    "BODY",
    "BOTH",
    "BOUND",
    "BULK",
    "BY",
    "BYTE",
    // 'C',
    "CALL",
    "CALLING",
    "CASCADE",
    "CASE",
    "CHARSET",
    "CHARSETFORM",
    "CHARSETID",
    "CHECK",
    "CLOSE",
    "CLUSTER",
    "CLUSTERS",
    "COLAUTH",
    "COLLECT",
    "COLUMNS",
    "COMMENT",
    "COMMIT",
    "COMMITTED",
    "COMPILED",
    "COMPRESS",
    "CONNECT",
    "CONSTANT",
    "CONSTRUCTOR",
    "CONTEXT",
    "CONVERT",
    "COUNT",
    "CRASH",
    "CREATE",
    "CURRENT",
    "CURSOR",
    "CUSTOMDATUM",
    "DANGLING",
    "DATA",
    "DAY",
    "DECLARE",
    "DEFAULT",
    "DEFINE",
    "DELETE",
    "DESC",
    "DETERMINISTIC",
    "DISTINCT",
    "DROP",
    "DURATION",
    "ELEMENT",
    "ELSE",
    "ELSIF",
    "EMPTY",
    "END",
    "ESCAPE",
    "EXCEPT",
    "EXCEPTION",
    "EXCEPTIONS",
    "EXCLUSIVE",
    "EXECUTE",
    "EXISTS",
    "EXIT",
    "EXTERNAL",
    "FETCH",
    "FINAL",
    "FIXED",
    "FOR",
    "FORALL",
    "FORCE",
    "FORM",
    "FROM",
    "FUNCTION",
    "GENERAL",
    "GOTO",
    "GRANT",
    "GROUP",
    "HASH",
    "HAVING",
    "HEAP",
    "HIDDEN",
    "HOUR",
    "IDENTIFIED",
    "IF",
    "IMMEDIATE",
    "IN",
    "INCLUDING",
    "INDEX",
    "INDEXES",
    "INDICATOR",
    "INDICES",
    "INFINITE",
    "INSERT",
    "INSTANTIABLE",
    "INTERFACE",
    "INTERSECT",
    "INTERVAL",
    "INTO",
    "INVALIDATE",
    "IS",
    "ISOLATION",
    "JAVA",
    "LANGUAGE",
    "LARGE",
    "LEADING",
    "LENGTH",
    "LEVEL",
    "LIBRARY",
    "LIKE",
    "LIKE2",
    "LIKE4",
    "LIKEC",
    "LIMIT",
    "LIMITED",
    "LOCAL",
    "LOCK",
    "LOOP",
    "MAP",
    "MAX",
    "MAXLEN",
    "MEMBER",
    "MERGE",
    "MIN",
    "MINUS",
    "MINUTE",
    "MOD",
    "MODE",
    "MODIFY",
    "MONTH",
    "MULTISET",
    "NAME",
    "NAN",
    "NATIONAL",
    "NATIVE",
    "NEW",
    "NOCOMPRESS",
    "NOCOPY",
    "NOT",
    "NOWAIT",
    "NULL",
    "OBJECT",
    "OCICOLL",
    "OCIDATE",
    "OCIDATETIME",
    "OCIDURATION",
    "OCIINTERVAL",
    "OCILOBLOCATOR",
    "OCINUMBER",
    "OCIRAW",
    "OCIREF",
    "OCIREFCURSOR",
    "OCIROWID",
    "OCISTRING",
    "OCITYPE",
    "OF",
    "ON",
    "ONLY",
    "OPAQUE",
    "OPEN",
    "OPERATOR",
    "OPTION",
    "OR",
    "ORACLE",
    "ORADATA",
    "ORDER",
    "OVERLAPS",
    "ORGANIZATION",
    "ORLANY",
    "ORLVARY",
    "OTHERS",
    "OUT",
    "OVERRIDING",
    "PACKAGE",
    "PARALLEL_ENABLE",
    "PARAMETER",
    "PARAMETERS",
    "PARTITION",
    "PASCAL",
    "PIPE",
    "PIPELINED",
    "PRAGMA",
    "PRIOR",
    "PRIVATE",
    "PROCEDURE",
    "PUBLIC",
    "RAISE",
    "RANGE",
    "READ",
    "RECORD",
    "REF",
    "REFERENCE",
    "REM",
    "REMAINDER",
    "RENAME",
    "RESOURCE",
    "RESULT",
    "RETURN",
    "RETURNING",
    "REVERSE",
    "REVOKE",
    "ROLLBACK",
    "ROW",
    "SAMPLE",
    "SAVE",
    "SAVEPOINT",
    "SB1",
    "SB2",
    "SB4",
    "SECOND",
    "SEGMENT",
    "SELECT",
    "SELF",
    "SEPARATE",
    "SEQUENCE",
    "SERIALIZABLE",
    "SET",
    "SHARE",
    "SHORT",
    "SIZE",
    "SIZE_T",
    "SOME",
    "SPARSE",
    "SQL",
    "SQLCODE",
    "SQLDATA",
    "SQLNAME",
    "SQLSTATE",
    "STANDARD",
    "START",
    "STATIC",
    "STDDEV",
    "STORED",
    "STRING",
    "STRUCT",
    "STYLE",
    "SUBMULTISET",
    "SUBPARTITION",
    "SUBSTITUTABLE",
    "SUBTYPE",
    "SUM",
    "SYNONYM",
    "TABAUTH",
    "TABLE",
    "TDO",
    "THE",
    "THEN",
    "TIME",
    "TIMEZONE_ABBR",
    "TIMEZONE_HOUR",
    "TIMEZONE_MINUTE",
    "TIMEZONE_REGION",
    "TO",
    "TRAILING",
    "TRANSAC",
    "TRANSACTIONAL",
    "TRUSTED",
    "TYPE",
    "UB1",
    "UB2",
    "UB4",
    "UNDER",
    "UNION",
    "UNIQUE",
    "UNSIGNED",
    "UNTRUSTED",
    "UPDATE",
    "USE",
    "USING",
    "VALIST",
    "VALUE",
    "VALUES",
    "VARIABLE",
    "VARIANCE",
    "VARRAY",
    "VIEW",
    "VIEWS",
    "VOID",
    "WHEN",
    "WHERE",
    "WHILE",
    "WITH",
    "WORK",
    "WRAPPED",
    "WRITE",
    "YEAR",
    "ZONE"
  ];
  var dataTypes9 = [
    // https://www.ibm.com/docs/en/db2/10.5?topic=plsql-data-types
    "ARRAY",
    "BFILE_BASE",
    "BINARY",
    "BLOB_BASE",
    "CHAR VARYING",
    "CHAR_BASE",
    "CHAR",
    "CHARACTER VARYING",
    "CHARACTER",
    "CLOB_BASE",
    "DATE_BASE",
    "DATE",
    "DECIMAL",
    "DOUBLE",
    "FLOAT",
    "INT",
    "INTERVAL DAY",
    "INTERVAL YEAR",
    "LONG",
    "NATIONAL CHAR VARYING",
    "NATIONAL CHAR",
    "NATIONAL CHARACTER VARYING",
    "NATIONAL CHARACTER",
    "NCHAR VARYING",
    "NCHAR",
    "NCHAR",
    "NUMBER_BASE",
    "NUMBER",
    "NUMBERIC",
    "NVARCHAR",
    "PRECISION",
    "RAW",
    "TIMESTAMP",
    "UROWID",
    "VARCHAR",
    "VARCHAR2"
  ];
  var functions9 = [
    // https://docs.oracle.com/cd/B19306_01/server.102/b14200/functions001.htm
    // numeric
    "ABS",
    "ACOS",
    "ASIN",
    "ATAN",
    "ATAN2",
    "BITAND",
    "CEIL",
    "COS",
    "COSH",
    "EXP",
    "FLOOR",
    "LN",
    "LOG",
    "MOD",
    "NANVL",
    "POWER",
    "REMAINDER",
    "ROUND",
    "SIGN",
    "SIN",
    "SINH",
    "SQRT",
    "TAN",
    "TANH",
    "TRUNC",
    "WIDTH_BUCKET",
    // character
    "CHR",
    "CONCAT",
    "INITCAP",
    "LOWER",
    "LPAD",
    "LTRIM",
    "NLS_INITCAP",
    "NLS_LOWER",
    "NLSSORT",
    "NLS_UPPER",
    "REGEXP_REPLACE",
    "REGEXP_SUBSTR",
    "REPLACE",
    "RPAD",
    "RTRIM",
    "SOUNDEX",
    "SUBSTR",
    "TRANSLATE",
    "TREAT",
    "TRIM",
    "UPPER",
    "NLS_CHARSET_DECL_LEN",
    "NLS_CHARSET_ID",
    "NLS_CHARSET_NAME",
    "ASCII",
    "INSTR",
    "LENGTH",
    "REGEXP_INSTR",
    // datetime
    "ADD_MONTHS",
    "CURRENT_DATE",
    "CURRENT_TIMESTAMP",
    "DBTIMEZONE",
    "EXTRACT",
    "FROM_TZ",
    "LAST_DAY",
    "LOCALTIMESTAMP",
    "MONTHS_BETWEEN",
    "NEW_TIME",
    "NEXT_DAY",
    "NUMTODSINTERVAL",
    "NUMTOYMINTERVAL",
    "ROUND",
    "SESSIONTIMEZONE",
    "SYS_EXTRACT_UTC",
    "SYSDATE",
    "SYSTIMESTAMP",
    "TO_CHAR",
    "TO_TIMESTAMP",
    "TO_TIMESTAMP_TZ",
    "TO_DSINTERVAL",
    "TO_YMINTERVAL",
    "TRUNC",
    "TZ_OFFSET",
    // comparison
    "GREATEST",
    "LEAST",
    // conversion
    "ASCIISTR",
    "BIN_TO_NUM",
    "CAST",
    "CHARTOROWID",
    "COMPOSE",
    "CONVERT",
    "DECOMPOSE",
    "HEXTORAW",
    "NUMTODSINTERVAL",
    "NUMTOYMINTERVAL",
    "RAWTOHEX",
    "RAWTONHEX",
    "ROWIDTOCHAR",
    "ROWIDTONCHAR",
    "SCN_TO_TIMESTAMP",
    "TIMESTAMP_TO_SCN",
    "TO_BINARY_DOUBLE",
    "TO_BINARY_FLOAT",
    "TO_CHAR",
    "TO_CLOB",
    "TO_DATE",
    "TO_DSINTERVAL",
    "TO_LOB",
    "TO_MULTI_BYTE",
    "TO_NCHAR",
    "TO_NCLOB",
    "TO_NUMBER",
    "TO_DSINTERVAL",
    "TO_SINGLE_BYTE",
    "TO_TIMESTAMP",
    "TO_TIMESTAMP_TZ",
    "TO_YMINTERVAL",
    "TO_YMINTERVAL",
    "TRANSLATE",
    "UNISTR",
    // largeObject
    "BFILENAME",
    "EMPTY_BLOB,",
    "EMPTY_CLOB",
    // collection
    "CARDINALITY",
    "COLLECT",
    "POWERMULTISET",
    "POWERMULTISET_BY_CARDINALITY",
    "SET",
    // hierarchical
    "SYS_CONNECT_BY_PATH",
    // dataMining
    "CLUSTER_ID",
    "CLUSTER_PROBABILITY",
    "CLUSTER_SET",
    "FEATURE_ID",
    "FEATURE_SET",
    "FEATURE_VALUE",
    "PREDICTION",
    "PREDICTION_COST",
    "PREDICTION_DETAILS",
    "PREDICTION_PROBABILITY",
    "PREDICTION_SET",
    // xml
    "APPENDCHILDXML",
    "DELETEXML",
    "DEPTH",
    "EXTRACT",
    "EXISTSNODE",
    "EXTRACTVALUE",
    "INSERTCHILDXML",
    "INSERTXMLBEFORE",
    "PATH",
    "SYS_DBURIGEN",
    "SYS_XMLAGG",
    "SYS_XMLGEN",
    "UPDATEXML",
    "XMLAGG",
    "XMLCDATA",
    "XMLCOLATTVAL",
    "XMLCOMMENT",
    "XMLCONCAT",
    "XMLFOREST",
    "XMLPARSE",
    "XMLPI",
    "XMLQUERY",
    "XMLROOT",
    "XMLSEQUENCE",
    "XMLSERIALIZE",
    "XMLTABLE",
    "XMLTRANSFORM",
    // encoding
    "DECODE",
    "DUMP",
    "ORA_HASH",
    "VSIZE",
    // nullRelated
    "COALESCE",
    "LNNVL",
    "NULLIF",
    "NVL",
    "NVL2",
    // env
    "SYS_CONTEXT",
    "SYS_GUID",
    "SYS_TYPEID",
    "UID",
    "USER",
    "USERENV",
    // aggregate
    "AVG",
    "COLLECT",
    "CORR",
    "CORR_S",
    "CORR_K",
    "COUNT",
    "COVAR_POP",
    "COVAR_SAMP",
    "CUME_DIST",
    "DENSE_RANK",
    "FIRST",
    "GROUP_ID",
    "GROUPING",
    "GROUPING_ID",
    "LAST",
    "MAX",
    "MEDIAN",
    "MIN",
    "PERCENTILE_CONT",
    "PERCENTILE_DISC",
    "PERCENT_RANK",
    "RANK",
    "REGR_SLOPE",
    "REGR_INTERCEPT",
    "REGR_COUNT",
    "REGR_R2",
    "REGR_AVGX",
    "REGR_AVGY",
    "REGR_SXX",
    "REGR_SYY",
    "REGR_SXY",
    "STATS_BINOMIAL_TEST",
    "STATS_CROSSTAB",
    "STATS_F_TEST",
    "STATS_KS_TEST",
    "STATS_MODE",
    "STATS_MW_TEST",
    "STATS_ONE_WAY_ANOVA",
    "STATS_T_TEST_ONE",
    "STATS_T_TEST_PAIRED",
    "STATS_T_TEST_INDEP",
    "STATS_T_TEST_INDEPU",
    "STATS_WSR_TEST",
    "STDDEV",
    "STDDEV_POP",
    "STDDEV_SAMP",
    "SUM",
    "VAR_POP",
    "VAR_SAMP",
    "VARIANCE",
    // Windowing functions (minus the ones already listed in aggregates)
    // window
    "FIRST_VALUE",
    "LAG",
    "LAST_VALUE",
    "LEAD",
    "NTILE",
    "RATIO_TO_REPORT",
    "ROW_NUMBER",
    // objectReference
    "DEREF",
    "MAKE_REF",
    "REF",
    "REFTOHEX",
    "VALUE",
    // model
    "CV",
    "ITERATION_NUMBER",
    "PRESENTNNV",
    "PRESENTV",
    "PREVIOUS"
  ];
  var reservedSelect9 = expandPhrases(["SELECT [ALL | DISTINCT | UNIQUE]"]);
  var reservedClauses9 = expandPhrases([
    // queries
    "WITH",
    "FROM",
    "WHERE",
    "GROUP BY",
    "HAVING",
    "PARTITION BY",
    "ORDER [SIBLINGS] BY",
    "OFFSET",
    "FETCH {FIRST | NEXT}",
    "FOR UPDATE [OF]",
    // Data manipulation
    // - insert:
    "INSERT [INTO | ALL INTO]",
    "VALUES",
    // - update:
    "SET",
    // - merge:
    "MERGE [INTO]",
    "WHEN [NOT] MATCHED [THEN]",
    "UPDATE SET",
    // other
    "RETURNING"
  ]);
  var standardOnelineClauses8 = expandPhrases([
    "CREATE [GLOBAL TEMPORARY | PRIVATE TEMPORARY | SHARDED | DUPLICATED | IMMUTABLE BLOCKCHAIN | BLOCKCHAIN | IMMUTABLE] TABLE"
  ]);
  var tabularOnelineClauses8 = expandPhrases([
    // - create:
    "CREATE [OR REPLACE] [NO FORCE | FORCE] [EDITIONING | EDITIONABLE | EDITIONABLE EDITIONING | NONEDITIONABLE] VIEW",
    "CREATE MATERIALIZED VIEW",
    // - update:
    "UPDATE [ONLY]",
    // - delete:
    "DELETE FROM [ONLY]",
    // - drop table:
    "DROP TABLE",
    // - alter table:
    "ALTER TABLE",
    "ADD",
    "DROP {COLUMN | UNUSED COLUMNS | COLUMNS CONTINUE}",
    "MODIFY",
    "RENAME TO",
    "RENAME COLUMN",
    // - truncate:
    "TRUNCATE TABLE",
    // other
    "SET SCHEMA",
    "BEGIN",
    "CONNECT BY",
    "DECLARE",
    "EXCEPT",
    "EXCEPTION",
    "LOOP",
    "START WITH"
  ]);
  var reservedSetOperations9 = expandPhrases(["UNION [ALL]", "EXCEPT", "INTERSECT"]);
  var reservedJoins9 = expandPhrases([
    "JOIN",
    "{LEFT | RIGHT | FULL} [OUTER] JOIN",
    "{INNER | CROSS} JOIN",
    "NATURAL [INNER] JOIN",
    "NATURAL {LEFT | RIGHT | FULL} [OUTER] JOIN",
    // non-standard joins
    "{CROSS | OUTER} APPLY"
  ]);
  var reservedPhrases9 = expandPhrases([
    "ON {UPDATE | DELETE} [SET NULL]",
    "ON COMMIT",
    "{ROWS | RANGE} BETWEEN"
  ]);
  var plsql = {
    name: "plsql",
    tokenizerOptions: {
      reservedSelect: reservedSelect9,
      reservedClauses: [...reservedClauses9, ...standardOnelineClauses8, ...tabularOnelineClauses8],
      reservedSetOperations: reservedSetOperations9,
      reservedJoins: reservedJoins9,
      reservedPhrases: reservedPhrases9,
      supportsXor: true,
      reservedKeywords: keywords9,
      reservedDataTypes: dataTypes9,
      reservedFunctionNames: functions9,
      stringTypes: [
        { quote: "''-qq", prefixes: ["N"] },
        { quote: "q''", prefixes: ["N"] }
      ],
      // PL/SQL doesn't actually support escaping of quotes in identifiers,
      // but for the sake of simpler testing we'll support this anyway
      // as all other SQL dialects with "identifiers" do.
      identTypes: [`""-qq`],
      identChars: { rest: "$#" },
      variableTypes: [{ regex: "&{1,2}[A-Za-z][A-Za-z0-9_$#]*" }],
      paramTypes: { numbered: [":"], named: [":"] },
      paramChars: {},
      // Empty object used on purpose to not allow $ and # chars as specified in identChars
      operators: [
        "**",
        ":=",
        "%",
        "~=",
        "^=",
        // '..', // Conflicts with float followed by dot (so "2..3" gets parsed as ["2.", ".", "3"])
        ">>",
        "<<",
        "=>",
        "@",
        "||"
      ],
      postProcess: postProcess3
    },
    formatOptions: {
      alwaysDenseOperators: ["@"],
      onelineClauses: [...standardOnelineClauses8, ...tabularOnelineClauses8],
      tabularOnelineClauses: tabularOnelineClauses8
    }
  };
  function postProcess3(tokens) {
    let previousReservedToken = EOF_TOKEN;
    return tokens.map((token) => {
      if (isToken.SET(token) && isToken.BY(previousReservedToken)) {
        return __spreadProps(__spreadValues({}, token), {
          type: "RESERVED_KEYWORD"
          /* RESERVED_KEYWORD */
        });
      }
      if (isReserved(token.type)) {
        previousReservedToken = token;
      }
      return token;
    });
  }
  var functions10 = [
    // https://www.postgresql.org/docs/14/functions.html
    //
    // https://www.postgresql.org/docs/14/functions-math.html
    "ABS",
    "ACOS",
    "ACOSD",
    "ACOSH",
    "ASIN",
    "ASIND",
    "ASINH",
    "ATAN",
    "ATAN2",
    "ATAN2D",
    "ATAND",
    "ATANH",
    "CBRT",
    "CEIL",
    "CEILING",
    "COS",
    "COSD",
    "COSH",
    "COT",
    "COTD",
    "DEGREES",
    "DIV",
    "EXP",
    "FACTORIAL",
    "FLOOR",
    "GCD",
    "LCM",
    "LN",
    "LOG",
    "LOG10",
    "MIN_SCALE",
    "MOD",
    "PI",
    "POWER",
    "RADIANS",
    "RANDOM",
    "ROUND",
    "SCALE",
    "SETSEED",
    "SIGN",
    "SIN",
    "SIND",
    "SINH",
    "SQRT",
    "TAN",
    "TAND",
    "TANH",
    "TRIM_SCALE",
    "TRUNC",
    "WIDTH_BUCKET",
    // https://www.postgresql.org/docs/14/functions-string.html
    "ABS",
    "ASCII",
    "BIT_LENGTH",
    "BTRIM",
    "CHARACTER_LENGTH",
    "CHAR_LENGTH",
    "CHR",
    "CONCAT",
    "CONCAT_WS",
    "FORMAT",
    "INITCAP",
    "LEFT",
    "LENGTH",
    "LOWER",
    "LPAD",
    "LTRIM",
    "MD5",
    "NORMALIZE",
    "OCTET_LENGTH",
    "OVERLAY",
    "PARSE_IDENT",
    "PG_CLIENT_ENCODING",
    "POSITION",
    "QUOTE_IDENT",
    "QUOTE_LITERAL",
    "QUOTE_NULLABLE",
    "REGEXP_MATCH",
    "REGEXP_MATCHES",
    "REGEXP_REPLACE",
    "REGEXP_SPLIT_TO_ARRAY",
    "REGEXP_SPLIT_TO_TABLE",
    "REPEAT",
    "REPLACE",
    "REVERSE",
    "RIGHT",
    "RPAD",
    "RTRIM",
    "SPLIT_PART",
    "SPRINTF",
    "STARTS_WITH",
    "STRING_AGG",
    "STRING_TO_ARRAY",
    "STRING_TO_TABLE",
    "STRPOS",
    "SUBSTR",
    "SUBSTRING",
    "TO_ASCII",
    "TO_HEX",
    "TRANSLATE",
    "TRIM",
    "UNISTR",
    "UPPER",
    // https://www.postgresql.org/docs/14/functions-binarystring.html
    "BIT_COUNT",
    "BIT_LENGTH",
    "BTRIM",
    "CONVERT",
    "CONVERT_FROM",
    "CONVERT_TO",
    "DECODE",
    "ENCODE",
    "GET_BIT",
    "GET_BYTE",
    "LENGTH",
    "LTRIM",
    "MD5",
    "OCTET_LENGTH",
    "OVERLAY",
    "POSITION",
    "RTRIM",
    "SET_BIT",
    "SET_BYTE",
    "SHA224",
    "SHA256",
    "SHA384",
    "SHA512",
    "STRING_AGG",
    "SUBSTR",
    "SUBSTRING",
    "TRIM",
    // https://www.postgresql.org/docs/14/functions-bitstring.html
    "BIT_COUNT",
    "BIT_LENGTH",
    "GET_BIT",
    "LENGTH",
    "OCTET_LENGTH",
    "OVERLAY",
    "POSITION",
    "SET_BIT",
    "SUBSTRING",
    // https://www.postgresql.org/docs/14/functions-matching.html
    "REGEXP_MATCH",
    "REGEXP_MATCHES",
    "REGEXP_REPLACE",
    "REGEXP_SPLIT_TO_ARRAY",
    "REGEXP_SPLIT_TO_TABLE",
    // https://www.postgresql.org/docs/14/functions-formatting.html
    "TO_CHAR",
    "TO_DATE",
    "TO_NUMBER",
    "TO_TIMESTAMP",
    // https://www.postgresql.org/docs/14/functions-datetime.html
    // 'AGE',
    "CLOCK_TIMESTAMP",
    "CURRENT_DATE",
    "CURRENT_TIME",
    "CURRENT_TIMESTAMP",
    "DATE_BIN",
    "DATE_PART",
    "DATE_TRUNC",
    "EXTRACT",
    "ISFINITE",
    "JUSTIFY_DAYS",
    "JUSTIFY_HOURS",
    "JUSTIFY_INTERVAL",
    "LOCALTIME",
    "LOCALTIMESTAMP",
    "MAKE_DATE",
    "MAKE_INTERVAL",
    "MAKE_TIME",
    "MAKE_TIMESTAMP",
    "MAKE_TIMESTAMPTZ",
    "NOW",
    "PG_SLEEP",
    "PG_SLEEP_FOR",
    "PG_SLEEP_UNTIL",
    "STATEMENT_TIMESTAMP",
    "TIMEOFDAY",
    "TO_TIMESTAMP",
    "TRANSACTION_TIMESTAMP",
    // https://www.postgresql.org/docs/14/functions-enum.html
    "ENUM_FIRST",
    "ENUM_LAST",
    "ENUM_RANGE",
    // https://www.postgresql.org/docs/14/functions-geometry.html
    "AREA",
    "BOUND_BOX",
    "BOX",
    "CENTER",
    "CIRCLE",
    "DIAGONAL",
    "DIAMETER",
    "HEIGHT",
    "ISCLOSED",
    "ISOPEN",
    "LENGTH",
    "LINE",
    "LSEG",
    "NPOINTS",
    "PATH",
    "PCLOSE",
    "POINT",
    "POLYGON",
    "POPEN",
    "RADIUS",
    "SLOPE",
    "WIDTH",
    // https://www.postgresql.org/docs/14/functions-net.html
    "ABBREV",
    "BROADCAST",
    "FAMILY",
    "HOST",
    "HOSTMASK",
    "INET_MERGE",
    "INET_SAME_FAMILY",
    "MACADDR8_SET7BIT",
    "MASKLEN",
    "NETMASK",
    "NETWORK",
    "SET_MASKLEN",
    // 'TEXT', // excluded because it's also a data type name
    "TRUNC",
    // https://www.postgresql.org/docs/14/functions-textsearch.html
    "ARRAY_TO_TSVECTOR",
    "GET_CURRENT_TS_CONFIG",
    "JSONB_TO_TSVECTOR",
    "JSON_TO_TSVECTOR",
    "LENGTH",
    "NUMNODE",
    "PHRASETO_TSQUERY",
    "PLAINTO_TSQUERY",
    "QUERYTREE",
    "SETWEIGHT",
    "STRIP",
    "TO_TSQUERY",
    "TO_TSVECTOR",
    "TSQUERY_PHRASE",
    "TSVECTOR_TO_ARRAY",
    "TS_DEBUG",
    "TS_DELETE",
    "TS_FILTER",
    "TS_HEADLINE",
    "TS_LEXIZE",
    "TS_PARSE",
    "TS_RANK",
    "TS_RANK_CD",
    "TS_REWRITE",
    "TS_STAT",
    "TS_TOKEN_TYPE",
    "WEBSEARCH_TO_TSQUERY",
    // https://www.postgresql.org/docs/14/functions-uuid.html
    "UUID",
    // https://www.postgresql.org/docs/14/functions-xml.html
    "CURSOR_TO_XML",
    "CURSOR_TO_XMLSCHEMA",
    "DATABASE_TO_XML",
    "DATABASE_TO_XMLSCHEMA",
    "DATABASE_TO_XML_AND_XMLSCHEMA",
    "NEXTVAL",
    "QUERY_TO_XML",
    "QUERY_TO_XMLSCHEMA",
    "QUERY_TO_XML_AND_XMLSCHEMA",
    "SCHEMA_TO_XML",
    "SCHEMA_TO_XMLSCHEMA",
    "SCHEMA_TO_XML_AND_XMLSCHEMA",
    "STRING",
    "TABLE_TO_XML",
    "TABLE_TO_XMLSCHEMA",
    "TABLE_TO_XML_AND_XMLSCHEMA",
    "XMLAGG",
    "XMLCOMMENT",
    "XMLCONCAT",
    "XMLELEMENT",
    "XMLEXISTS",
    "XMLFOREST",
    "XMLPARSE",
    "XMLPI",
    "XMLROOT",
    "XMLSERIALIZE",
    "XMLTABLE",
    "XML_IS_WELL_FORMED",
    "XML_IS_WELL_FORMED_CONTENT",
    "XML_IS_WELL_FORMED_DOCUMENT",
    "XPATH",
    "XPATH_EXISTS",
    // https://www.postgresql.org/docs/14/functions-json.html
    "ARRAY_TO_JSON",
    "JSONB_AGG",
    "JSONB_ARRAY_ELEMENTS",
    "JSONB_ARRAY_ELEMENTS_TEXT",
    "JSONB_ARRAY_LENGTH",
    "JSONB_BUILD_ARRAY",
    "JSONB_BUILD_OBJECT",
    "JSONB_EACH",
    "JSONB_EACH_TEXT",
    "JSONB_EXTRACT_PATH",
    "JSONB_EXTRACT_PATH_TEXT",
    "JSONB_INSERT",
    "JSONB_OBJECT",
    "JSONB_OBJECT_AGG",
    "JSONB_OBJECT_KEYS",
    "JSONB_PATH_EXISTS",
    "JSONB_PATH_EXISTS_TZ",
    "JSONB_PATH_MATCH",
    "JSONB_PATH_MATCH_TZ",
    "JSONB_PATH_QUERY",
    "JSONB_PATH_QUERY_ARRAY",
    "JSONB_PATH_QUERY_ARRAY_TZ",
    "JSONB_PATH_QUERY_FIRST",
    "JSONB_PATH_QUERY_FIRST_TZ",
    "JSONB_PATH_QUERY_TZ",
    "JSONB_POPULATE_RECORD",
    "JSONB_POPULATE_RECORDSET",
    "JSONB_PRETTY",
    "JSONB_SET",
    "JSONB_SET_LAX",
    "JSONB_STRIP_NULLS",
    "JSONB_TO_RECORD",
    "JSONB_TO_RECORDSET",
    "JSONB_TYPEOF",
    "JSON_AGG",
    "JSON_ARRAY_ELEMENTS",
    "JSON_ARRAY_ELEMENTS_TEXT",
    "JSON_ARRAY_LENGTH",
    "JSON_BUILD_ARRAY",
    "JSON_BUILD_OBJECT",
    "JSON_EACH",
    "JSON_EACH_TEXT",
    "JSON_EXTRACT_PATH",
    "JSON_EXTRACT_PATH_TEXT",
    "JSON_OBJECT",
    "JSON_OBJECT_AGG",
    "JSON_OBJECT_KEYS",
    "JSON_POPULATE_RECORD",
    "JSON_POPULATE_RECORDSET",
    "JSON_STRIP_NULLS",
    "JSON_TO_RECORD",
    "JSON_TO_RECORDSET",
    "JSON_TYPEOF",
    "ROW_TO_JSON",
    "TO_JSON",
    "TO_JSONB",
    "TO_TIMESTAMP",
    // https://www.postgresql.org/docs/14/functions-sequence.html
    "CURRVAL",
    "LASTVAL",
    "NEXTVAL",
    "SETVAL",
    // https://www.postgresql.org/docs/14/functions-conditional.html
    // 'CASE',
    "COALESCE",
    "GREATEST",
    "LEAST",
    "NULLIF",
    // https://www.postgresql.org/docs/14/functions-array.html
    "ARRAY_AGG",
    "ARRAY_APPEND",
    "ARRAY_CAT",
    "ARRAY_DIMS",
    "ARRAY_FILL",
    "ARRAY_LENGTH",
    "ARRAY_LOWER",
    "ARRAY_NDIMS",
    "ARRAY_POSITION",
    "ARRAY_POSITIONS",
    "ARRAY_PREPEND",
    "ARRAY_REMOVE",
    "ARRAY_REPLACE",
    "ARRAY_TO_STRING",
    "ARRAY_UPPER",
    "CARDINALITY",
    "STRING_TO_ARRAY",
    "TRIM_ARRAY",
    "UNNEST",
    // https://www.postgresql.org/docs/14/functions-range.html
    "ISEMPTY",
    "LOWER",
    "LOWER_INC",
    "LOWER_INF",
    "MULTIRANGE",
    "RANGE_MERGE",
    "UPPER",
    "UPPER_INC",
    "UPPER_INF",
    // https://www.postgresql.org/docs/14/functions-aggregate.html
    // 'ANY',
    "ARRAY_AGG",
    "AVG",
    "BIT_AND",
    "BIT_OR",
    "BIT_XOR",
    "BOOL_AND",
    "BOOL_OR",
    "COALESCE",
    "CORR",
    "COUNT",
    "COVAR_POP",
    "COVAR_SAMP",
    "CUME_DIST",
    "DENSE_RANK",
    "EVERY",
    "GROUPING",
    "JSONB_AGG",
    "JSONB_OBJECT_AGG",
    "JSON_AGG",
    "JSON_OBJECT_AGG",
    "MAX",
    "MIN",
    "MODE",
    "PERCENTILE_CONT",
    "PERCENTILE_DISC",
    "PERCENT_RANK",
    "RANGE_AGG",
    "RANGE_INTERSECT_AGG",
    "RANK",
    "REGR_AVGX",
    "REGR_AVGY",
    "REGR_COUNT",
    "REGR_INTERCEPT",
    "REGR_R2",
    "REGR_SLOPE",
    "REGR_SXX",
    "REGR_SXY",
    "REGR_SYY",
    // 'SOME',
    "STDDEV",
    "STDDEV_POP",
    "STDDEV_SAMP",
    "STRING_AGG",
    "SUM",
    "TO_JSON",
    "TO_JSONB",
    "VARIANCE",
    "VAR_POP",
    "VAR_SAMP",
    "XMLAGG",
    // https://www.postgresql.org/docs/14/functions-window.html
    "CUME_DIST",
    "DENSE_RANK",
    "FIRST_VALUE",
    "LAG",
    "LAST_VALUE",
    "LEAD",
    "NTH_VALUE",
    "NTILE",
    "PERCENT_RANK",
    "RANK",
    "ROW_NUMBER",
    // https://www.postgresql.org/docs/14/functions-srf.html
    "GENERATE_SERIES",
    "GENERATE_SUBSCRIPTS",
    // https://www.postgresql.org/docs/14/functions-info.html
    "ACLDEFAULT",
    "ACLEXPLODE",
    "COL_DESCRIPTION",
    "CURRENT_CATALOG",
    "CURRENT_DATABASE",
    "CURRENT_QUERY",
    "CURRENT_ROLE",
    "CURRENT_SCHEMA",
    "CURRENT_SCHEMAS",
    "CURRENT_USER",
    "FORMAT_TYPE",
    "HAS_ANY_COLUMN_PRIVILEGE",
    "HAS_COLUMN_PRIVILEGE",
    "HAS_DATABASE_PRIVILEGE",
    "HAS_FOREIGN_DATA_WRAPPER_PRIVILEGE",
    "HAS_FUNCTION_PRIVILEGE",
    "HAS_LANGUAGE_PRIVILEGE",
    "HAS_SCHEMA_PRIVILEGE",
    "HAS_SEQUENCE_PRIVILEGE",
    "HAS_SERVER_PRIVILEGE",
    "HAS_TABLESPACE_PRIVILEGE",
    "HAS_TABLE_PRIVILEGE",
    "HAS_TYPE_PRIVILEGE",
    "INET_CLIENT_ADDR",
    "INET_CLIENT_PORT",
    "INET_SERVER_ADDR",
    "INET_SERVER_PORT",
    "MAKEACLITEM",
    "OBJ_DESCRIPTION",
    "PG_BACKEND_PID",
    "PG_BLOCKING_PIDS",
    "PG_COLLATION_IS_VISIBLE",
    "PG_CONF_LOAD_TIME",
    "PG_CONTROL_CHECKPOINT",
    "PG_CONTROL_INIT",
    "PG_CONTROL_SYSTEM",
    "PG_CONVERSION_IS_VISIBLE",
    "PG_CURRENT_LOGFILE",
    "PG_CURRENT_SNAPSHOT",
    "PG_CURRENT_XACT_ID",
    "PG_CURRENT_XACT_ID_IF_ASSIGNED",
    "PG_DESCRIBE_OBJECT",
    "PG_FUNCTION_IS_VISIBLE",
    "PG_GET_CATALOG_FOREIGN_KEYS",
    "PG_GET_CONSTRAINTDEF",
    "PG_GET_EXPR",
    "PG_GET_FUNCTIONDEF",
    "PG_GET_FUNCTION_ARGUMENTS",
    "PG_GET_FUNCTION_IDENTITY_ARGUMENTS",
    "PG_GET_FUNCTION_RESULT",
    "PG_GET_INDEXDEF",
    "PG_GET_KEYWORDS",
    "PG_GET_OBJECT_ADDRESS",
    "PG_GET_OWNED_SEQUENCE",
    "PG_GET_RULEDEF",
    "PG_GET_SERIAL_SEQUENCE",
    "PG_GET_STATISTICSOBJDEF",
    "PG_GET_TRIGGERDEF",
    "PG_GET_USERBYID",
    "PG_GET_VIEWDEF",
    "PG_HAS_ROLE",
    "PG_IDENTIFY_OBJECT",
    "PG_IDENTIFY_OBJECT_AS_ADDRESS",
    "PG_INDEXAM_HAS_PROPERTY",
    "PG_INDEX_COLUMN_HAS_PROPERTY",
    "PG_INDEX_HAS_PROPERTY",
    "PG_IS_OTHER_TEMP_SCHEMA",
    "PG_JIT_AVAILABLE",
    "PG_LAST_COMMITTED_XACT",
    "PG_LISTENING_CHANNELS",
    "PG_MY_TEMP_SCHEMA",
    "PG_NOTIFICATION_QUEUE_USAGE",
    "PG_OPCLASS_IS_VISIBLE",
    "PG_OPERATOR_IS_VISIBLE",
    "PG_OPFAMILY_IS_VISIBLE",
    "PG_OPTIONS_TO_TABLE",
    "PG_POSTMASTER_START_TIME",
    "PG_SAFE_SNAPSHOT_BLOCKING_PIDS",
    "PG_SNAPSHOT_XIP",
    "PG_SNAPSHOT_XMAX",
    "PG_SNAPSHOT_XMIN",
    "PG_STATISTICS_OBJ_IS_VISIBLE",
    "PG_TABLESPACE_DATABASES",
    "PG_TABLESPACE_LOCATION",
    "PG_TABLE_IS_VISIBLE",
    "PG_TRIGGER_DEPTH",
    "PG_TS_CONFIG_IS_VISIBLE",
    "PG_TS_DICT_IS_VISIBLE",
    "PG_TS_PARSER_IS_VISIBLE",
    "PG_TS_TEMPLATE_IS_VISIBLE",
    "PG_TYPEOF",
    "PG_TYPE_IS_VISIBLE",
    "PG_VISIBLE_IN_SNAPSHOT",
    "PG_XACT_COMMIT_TIMESTAMP",
    "PG_XACT_COMMIT_TIMESTAMP_ORIGIN",
    "PG_XACT_STATUS",
    "PQSERVERVERSION",
    "ROW_SECURITY_ACTIVE",
    "SESSION_USER",
    "SHOBJ_DESCRIPTION",
    "TO_REGCLASS",
    "TO_REGCOLLATION",
    "TO_REGNAMESPACE",
    "TO_REGOPER",
    "TO_REGOPERATOR",
    "TO_REGPROC",
    "TO_REGPROCEDURE",
    "TO_REGROLE",
    "TO_REGTYPE",
    "TXID_CURRENT",
    "TXID_CURRENT_IF_ASSIGNED",
    "TXID_CURRENT_SNAPSHOT",
    "TXID_SNAPSHOT_XIP",
    "TXID_SNAPSHOT_XMAX",
    "TXID_SNAPSHOT_XMIN",
    "TXID_STATUS",
    "TXID_VISIBLE_IN_SNAPSHOT",
    "USER",
    "VERSION",
    // https://www.postgresql.org/docs/14/functions-admin.html
    "BRIN_DESUMMARIZE_RANGE",
    "BRIN_SUMMARIZE_NEW_VALUES",
    "BRIN_SUMMARIZE_RANGE",
    "CONVERT_FROM",
    "CURRENT_SETTING",
    "GIN_CLEAN_PENDING_LIST",
    "PG_ADVISORY_LOCK",
    "PG_ADVISORY_LOCK_SHARED",
    "PG_ADVISORY_UNLOCK",
    "PG_ADVISORY_UNLOCK_ALL",
    "PG_ADVISORY_UNLOCK_SHARED",
    "PG_ADVISORY_XACT_LOCK",
    "PG_ADVISORY_XACT_LOCK_SHARED",
    "PG_BACKUP_START_TIME",
    "PG_CANCEL_BACKEND",
    "PG_COLLATION_ACTUAL_VERSION",
    "PG_COLUMN_COMPRESSION",
    "PG_COLUMN_SIZE",
    "PG_COPY_LOGICAL_REPLICATION_SLOT",
    "PG_COPY_PHYSICAL_REPLICATION_SLOT",
    "PG_CREATE_LOGICAL_REPLICATION_SLOT",
    "PG_CREATE_PHYSICAL_REPLICATION_SLOT",
    "PG_CREATE_RESTORE_POINT",
    "PG_CURRENT_WAL_FLUSH_LSN",
    "PG_CURRENT_WAL_INSERT_LSN",
    "PG_CURRENT_WAL_LSN",
    "PG_DATABASE_SIZE",
    "PG_DROP_REPLICATION_SLOT",
    "PG_EXPORT_SNAPSHOT",
    "PG_FILENODE_RELATION",
    "PG_GET_WAL_REPLAY_PAUSE_STATE",
    "PG_IMPORT_SYSTEM_COLLATIONS",
    "PG_INDEXES_SIZE",
    "PG_IS_IN_BACKUP",
    "PG_IS_IN_RECOVERY",
    "PG_IS_WAL_REPLAY_PAUSED",
    "PG_LAST_WAL_RECEIVE_LSN",
    "PG_LAST_WAL_REPLAY_LSN",
    "PG_LAST_XACT_REPLAY_TIMESTAMP",
    "PG_LOGICAL_EMIT_MESSAGE",
    "PG_LOGICAL_SLOT_GET_BINARY_CHANGES",
    "PG_LOGICAL_SLOT_GET_CHANGES",
    "PG_LOGICAL_SLOT_PEEK_BINARY_CHANGES",
    "PG_LOGICAL_SLOT_PEEK_CHANGES",
    "PG_LOG_BACKEND_MEMORY_CONTEXTS",
    "PG_LS_ARCHIVE_STATUSDIR",
    "PG_LS_DIR",
    "PG_LS_LOGDIR",
    "PG_LS_TMPDIR",
    "PG_LS_WALDIR",
    "PG_PARTITION_ANCESTORS",
    "PG_PARTITION_ROOT",
    "PG_PARTITION_TREE",
    "PG_PROMOTE",
    "PG_READ_BINARY_FILE",
    "PG_READ_FILE",
    "PG_RELATION_FILENODE",
    "PG_RELATION_FILEPATH",
    "PG_RELATION_SIZE",
    "PG_RELOAD_CONF",
    "PG_REPLICATION_ORIGIN_ADVANCE",
    "PG_REPLICATION_ORIGIN_CREATE",
    "PG_REPLICATION_ORIGIN_DROP",
    "PG_REPLICATION_ORIGIN_OID",
    "PG_REPLICATION_ORIGIN_PROGRESS",
    "PG_REPLICATION_ORIGIN_SESSION_IS_SETUP",
    "PG_REPLICATION_ORIGIN_SESSION_PROGRESS",
    "PG_REPLICATION_ORIGIN_SESSION_RESET",
    "PG_REPLICATION_ORIGIN_SESSION_SETUP",
    "PG_REPLICATION_ORIGIN_XACT_RESET",
    "PG_REPLICATION_ORIGIN_XACT_SETUP",
    "PG_REPLICATION_SLOT_ADVANCE",
    "PG_ROTATE_LOGFILE",
    "PG_SIZE_BYTES",
    "PG_SIZE_PRETTY",
    "PG_START_BACKUP",
    "PG_STAT_FILE",
    "PG_STOP_BACKUP",
    "PG_SWITCH_WAL",
    "PG_TABLESPACE_SIZE",
    "PG_TABLE_SIZE",
    "PG_TERMINATE_BACKEND",
    "PG_TOTAL_RELATION_SIZE",
    "PG_TRY_ADVISORY_LOCK",
    "PG_TRY_ADVISORY_LOCK_SHARED",
    "PG_TRY_ADVISORY_XACT_LOCK",
    "PG_TRY_ADVISORY_XACT_LOCK_SHARED",
    "PG_WALFILE_NAME",
    "PG_WALFILE_NAME_OFFSET",
    "PG_WAL_LSN_DIFF",
    "PG_WAL_REPLAY_PAUSE",
    "PG_WAL_REPLAY_RESUME",
    "SET_CONFIG",
    // https://www.postgresql.org/docs/14/functions-trigger.html
    "SUPPRESS_REDUNDANT_UPDATES_TRIGGER",
    "TSVECTOR_UPDATE_TRIGGER",
    "TSVECTOR_UPDATE_TRIGGER_COLUMN",
    // https://www.postgresql.org/docs/14/functions-event-triggers.html
    "PG_EVENT_TRIGGER_DDL_COMMANDS",
    "PG_EVENT_TRIGGER_DROPPED_OBJECTS",
    "PG_EVENT_TRIGGER_TABLE_REWRITE_OID",
    "PG_EVENT_TRIGGER_TABLE_REWRITE_REASON",
    "PG_GET_OBJECT_ADDRESS",
    // https://www.postgresql.org/docs/14/functions-statistics.html
    "PG_MCV_LIST_ITEMS",
    // cast
    "CAST"
  ];
  var keywords10 = [
    // https://www.postgresql.org/docs/14/sql-keywords-appendix.html
    "ALL",
    // reserved
    "ANALYSE",
    // reserved
    "ANALYZE",
    // reserved
    "AND",
    // reserved
    "ANY",
    // reserved
    "AS",
    // reserved, requires AS
    "ASC",
    // reserved
    "ASYMMETRIC",
    // reserved
    "AUTHORIZATION",
    // reserved (can be function or type)
    "BETWEEN",
    // (cannot be function or type)
    "BINARY",
    // reserved (can be function or type)
    "BOTH",
    // reserved
    "CASE",
    // reserved
    "CAST",
    // reserved
    "CHECK",
    // reserved
    "COLLATE",
    // reserved
    "COLLATION",
    // reserved (can be function or type)
    "COLUMN",
    // reserved
    "CONCURRENTLY",
    // reserved (can be function or type)
    "CONSTRAINT",
    // reserved
    "CREATE",
    // reserved, requires AS
    "CROSS",
    // reserved (can be function or type)
    "CURRENT_CATALOG",
    // reserved
    "CURRENT_DATE",
    // reserved
    "CURRENT_ROLE",
    // reserved
    "CURRENT_SCHEMA",
    // reserved (can be function or type)
    "CURRENT_TIME",
    // reserved
    "CURRENT_TIMESTAMP",
    // reserved
    "CURRENT_USER",
    // reserved
    "DAY",
    // requires AS
    "DEFAULT",
    // reserved
    "DEFERRABLE",
    // reserved
    "DESC",
    // reserved
    "DISTINCT",
    // reserved
    "DO",
    // reserved
    "ELSE",
    // reserved
    "END",
    // reserved
    "EXCEPT",
    // reserved, requires AS
    "EXISTS",
    // (cannot be function or type)
    "FALSE",
    // reserved
    "FETCH",
    // reserved, requires AS
    "FILTER",
    // requires AS
    "FOR",
    // reserved, requires AS
    "FOREIGN",
    // reserved
    "FREEZE",
    // reserved (can be function or type)
    "FROM",
    // reserved, requires AS
    "FULL",
    // reserved (can be function or type)
    "GRANT",
    // reserved, requires AS
    "GROUP",
    // reserved, requires AS
    "HAVING",
    // reserved, requires AS
    "HOUR",
    // requires AS
    "ILIKE",
    // reserved (can be function or type)
    "IN",
    // reserved
    "INITIALLY",
    // reserved
    "INNER",
    // reserved (can be function or type)
    "INOUT",
    // (cannot be function or type)
    "INTERSECT",
    // reserved, requires AS
    "INTO",
    // reserved, requires AS
    "IS",
    // reserved (can be function or type)
    "ISNULL",
    // reserved (can be function or type), requires AS
    "JOIN",
    // reserved (can be function or type)
    "LATERAL",
    // reserved
    "LEADING",
    // reserved
    "LEFT",
    // reserved (can be function or type)
    "LIKE",
    // reserved (can be function or type)
    "LIMIT",
    // reserved, requires AS
    "LOCALTIME",
    // reserved
    "LOCALTIMESTAMP",
    // reserved
    "MINUTE",
    // requires AS
    "MONTH",
    // requires AS
    "NATURAL",
    // reserved (can be function or type)
    "NOT",
    // reserved
    "NOTNULL",
    // reserved (can be function or type), requires AS
    "NULL",
    // reserved
    "NULLIF",
    // (cannot be function or type)
    "OFFSET",
    // reserved, requires AS
    "ON",
    // reserved, requires AS
    "ONLY",
    // reserved
    "OR",
    // reserved
    "ORDER",
    // reserved, requires AS
    "OUT",
    // (cannot be function or type)
    "OUTER",
    // reserved (can be function or type)
    "OVER",
    // requires AS
    "OVERLAPS",
    // reserved (can be function or type), requires AS
    "PLACING",
    // reserved
    "PRIMARY",
    // reserved
    "REFERENCES",
    // reserved
    "RETURNING",
    // reserved, requires AS
    "RIGHT",
    // reserved (can be function or type)
    "ROW",
    // (cannot be function or type)
    "SECOND",
    // requires AS
    "SELECT",
    // reserved
    "SESSION_USER",
    // reserved
    "SIMILAR",
    // reserved (can be function or type)
    "SOME",
    // reserved
    "SYMMETRIC",
    // reserved
    "TABLE",
    // reserved
    "TABLESAMPLE",
    // reserved (can be function or type)
    "THEN",
    // reserved
    "TO",
    // reserved, requires AS
    "TRAILING",
    // reserved
    "TRUE",
    // reserved
    "UNION",
    // reserved, requires AS
    "UNIQUE",
    // reserved
    "USER",
    // reserved
    "USING",
    // reserved
    "VALUES",
    // (cannot be function or type)
    "VARIADIC",
    // reserved
    "VERBOSE",
    // reserved (can be function or type)
    "WHEN",
    // reserved
    "WHERE",
    // reserved, requires AS
    "WINDOW",
    // reserved, requires AS
    "WITH",
    // reserved, requires AS
    "WITHIN",
    // requires AS
    "WITHOUT",
    // requires AS
    "YEAR"
    // requires AS
  ];
  var dataTypes10 = [
    // https://www.postgresql.org/docs/current/datatype.html
    "ARRAY",
    // reserved, requires AS
    "BIGINT",
    // (cannot be function or type)
    "BIT",
    // (cannot be function or type)
    "BIT VARYING",
    "BOOL",
    // (cannot be function or type)
    "BOOLEAN",
    // (cannot be function or type)
    "CHAR",
    // (cannot be function or type), requires AS
    "CHARACTER",
    // (cannot be function or type), requires AS
    "CHARACTER VARYING",
    "DECIMAL",
    // (cannot be function or type)
    "DEC",
    // (cannot be function or type)
    "DOUBLE",
    "ENUM",
    "FLOAT",
    // (cannot be function or type)
    "INT",
    // (cannot be function or type)
    "INTEGER",
    // (cannot be function or type)
    "INTERVAL",
    // (cannot be function or type)
    "NCHAR",
    // (cannot be function or type)
    "NUMERIC",
    // (cannot be function or type)
    "PRECISION",
    // (cannot be function or type), requires AS
    "REAL",
    // (cannot be function or type)
    "SMALLINT",
    // (cannot be function or type)
    "TEXT",
    "TIME",
    // (cannot be function or type)
    "TIMESTAMP",
    // (cannot be function or type)
    "TIMESTAMPTZ",
    // (cannot be function or type)
    "VARCHAR",
    // (cannot be function or type)
    "XML",
    "ZONE"
  ];
  var reservedSelect10 = expandPhrases(["SELECT [ALL | DISTINCT]"]);
  var reservedClauses10 = expandPhrases([
    // queries
    "WITH [RECURSIVE]",
    "FROM",
    "WHERE",
    "GROUP BY [ALL | DISTINCT]",
    "HAVING",
    "WINDOW",
    "PARTITION BY",
    "ORDER BY",
    "LIMIT",
    "OFFSET",
    "FETCH {FIRST | NEXT}",
    "FOR {UPDATE | NO KEY UPDATE | SHARE | KEY SHARE} [OF]",
    // Data manipulation
    // - insert:
    "INSERT INTO",
    "VALUES",
    "DEFAULT VALUES",
    // - update:
    "SET",
    // other
    "RETURNING"
  ]);
  var standardOnelineClauses9 = expandPhrases([
    "CREATE [GLOBAL | LOCAL] [TEMPORARY | TEMP | UNLOGGED] TABLE [IF NOT EXISTS]"
  ]);
  var tabularOnelineClauses9 = expandPhrases([
    // - create
    "CREATE [OR REPLACE] [TEMP | TEMPORARY] [RECURSIVE] VIEW",
    "CREATE [MATERIALIZED] VIEW [IF NOT EXISTS]",
    // - update:
    "UPDATE [ONLY]",
    "WHERE CURRENT OF",
    // - insert:
    "ON CONFLICT",
    // - delete:
    "DELETE FROM [ONLY]",
    // - drop table:
    "DROP TABLE [IF EXISTS]",
    // - alter table:
    "ALTER TABLE [IF EXISTS] [ONLY]",
    "ALTER TABLE ALL IN TABLESPACE",
    "RENAME [COLUMN]",
    "RENAME TO",
    "ADD [COLUMN] [IF NOT EXISTS]",
    "DROP [COLUMN] [IF EXISTS]",
    "ALTER [COLUMN]",
    "SET DATA TYPE",
    // for alter column
    "{SET | DROP} DEFAULT",
    // for alter column
    "{SET | DROP} NOT NULL",
    // for alter column
    // - truncate:
    "TRUNCATE [TABLE] [ONLY]",
    // other
    "SET SCHEMA",
    "AFTER",
    // https://www.postgresql.org/docs/14/sql-commands.html
    "ABORT",
    "ALTER AGGREGATE",
    "ALTER COLLATION",
    "ALTER CONVERSION",
    "ALTER DATABASE",
    "ALTER DEFAULT PRIVILEGES",
    "ALTER DOMAIN",
    "ALTER EVENT TRIGGER",
    "ALTER EXTENSION",
    "ALTER FOREIGN DATA WRAPPER",
    "ALTER FOREIGN TABLE",
    "ALTER FUNCTION",
    "ALTER GROUP",
    "ALTER INDEX",
    "ALTER LANGUAGE",
    "ALTER LARGE OBJECT",
    "ALTER MATERIALIZED VIEW",
    "ALTER OPERATOR",
    "ALTER OPERATOR CLASS",
    "ALTER OPERATOR FAMILY",
    "ALTER POLICY",
    "ALTER PROCEDURE",
    "ALTER PUBLICATION",
    "ALTER ROLE",
    "ALTER ROUTINE",
    "ALTER RULE",
    "ALTER SCHEMA",
    "ALTER SEQUENCE",
    "ALTER SERVER",
    "ALTER STATISTICS",
    "ALTER SUBSCRIPTION",
    "ALTER SYSTEM",
    "ALTER TABLESPACE",
    "ALTER TEXT SEARCH CONFIGURATION",
    "ALTER TEXT SEARCH DICTIONARY",
    "ALTER TEXT SEARCH PARSER",
    "ALTER TEXT SEARCH TEMPLATE",
    "ALTER TRIGGER",
    "ALTER TYPE",
    "ALTER USER",
    "ALTER USER MAPPING",
    "ALTER VIEW",
    "ANALYZE",
    "BEGIN",
    "CALL",
    "CHECKPOINT",
    "CLOSE",
    "CLUSTER",
    "COMMIT",
    "COMMIT PREPARED",
    "COPY",
    "CREATE ACCESS METHOD",
    "CREATE AGGREGATE",
    "CREATE CAST",
    "CREATE COLLATION",
    "CREATE CONVERSION",
    "CREATE DATABASE",
    "CREATE DOMAIN",
    "CREATE EVENT TRIGGER",
    "CREATE EXTENSION",
    "CREATE FOREIGN DATA WRAPPER",
    "CREATE FOREIGN TABLE",
    "CREATE FUNCTION",
    "CREATE GROUP",
    "CREATE INDEX",
    "CREATE LANGUAGE",
    "CREATE OPERATOR",
    "CREATE OPERATOR CLASS",
    "CREATE OPERATOR FAMILY",
    "CREATE POLICY",
    "CREATE PROCEDURE",
    "CREATE PUBLICATION",
    "CREATE ROLE",
    "CREATE RULE",
    "CREATE SCHEMA",
    "CREATE SEQUENCE",
    "CREATE SERVER",
    "CREATE STATISTICS",
    "CREATE SUBSCRIPTION",
    "CREATE TABLESPACE",
    "CREATE TEXT SEARCH CONFIGURATION",
    "CREATE TEXT SEARCH DICTIONARY",
    "CREATE TEXT SEARCH PARSER",
    "CREATE TEXT SEARCH TEMPLATE",
    "CREATE TRANSFORM",
    "CREATE TRIGGER",
    "CREATE TYPE",
    "CREATE USER",
    "CREATE USER MAPPING",
    "DEALLOCATE",
    "DECLARE",
    "DISCARD",
    "DROP ACCESS METHOD",
    "DROP AGGREGATE",
    "DROP CAST",
    "DROP COLLATION",
    "DROP CONVERSION",
    "DROP DATABASE",
    "DROP DOMAIN",
    "DROP EVENT TRIGGER",
    "DROP EXTENSION",
    "DROP FOREIGN DATA WRAPPER",
    "DROP FOREIGN TABLE",
    "DROP FUNCTION",
    "DROP GROUP",
    "DROP INDEX",
    "DROP LANGUAGE",
    "DROP MATERIALIZED VIEW",
    "DROP OPERATOR",
    "DROP OPERATOR CLASS",
    "DROP OPERATOR FAMILY",
    "DROP OWNED",
    "DROP POLICY",
    "DROP PROCEDURE",
    "DROP PUBLICATION",
    "DROP ROLE",
    "DROP ROUTINE",
    "DROP RULE",
    "DROP SCHEMA",
    "DROP SEQUENCE",
    "DROP SERVER",
    "DROP STATISTICS",
    "DROP SUBSCRIPTION",
    "DROP TABLESPACE",
    "DROP TEXT SEARCH CONFIGURATION",
    "DROP TEXT SEARCH DICTIONARY",
    "DROP TEXT SEARCH PARSER",
    "DROP TEXT SEARCH TEMPLATE",
    "DROP TRANSFORM",
    "DROP TRIGGER",
    "DROP TYPE",
    "DROP USER",
    "DROP USER MAPPING",
    "DROP VIEW",
    "EXECUTE",
    "EXPLAIN",
    "FETCH",
    "GRANT",
    "IMPORT FOREIGN SCHEMA",
    "LISTEN",
    "LOAD",
    "LOCK",
    "MOVE",
    "NOTIFY",
    "PREPARE",
    "PREPARE TRANSACTION",
    "REASSIGN OWNED",
    "REFRESH MATERIALIZED VIEW",
    "REINDEX",
    "RELEASE SAVEPOINT",
    "RESET",
    "REVOKE",
    "ROLLBACK",
    "ROLLBACK PREPARED",
    "ROLLBACK TO SAVEPOINT",
    "SAVEPOINT",
    "SECURITY LABEL",
    "SELECT INTO",
    "SET CONSTRAINTS",
    "SET ROLE",
    "SET SESSION AUTHORIZATION",
    "SET TRANSACTION",
    "SHOW",
    "START TRANSACTION",
    "UNLISTEN",
    "VACUUM"
  ]);
  var reservedSetOperations10 = expandPhrases([
    "UNION [ALL | DISTINCT]",
    "EXCEPT [ALL | DISTINCT]",
    "INTERSECT [ALL | DISTINCT]"
  ]);
  var reservedJoins10 = expandPhrases([
    "JOIN",
    "{LEFT | RIGHT | FULL} [OUTER] JOIN",
    "{INNER | CROSS} JOIN",
    "NATURAL [INNER] JOIN",
    "NATURAL {LEFT | RIGHT | FULL} [OUTER] JOIN"
  ]);
  var reservedPhrases10 = expandPhrases([
    "PRIMARY KEY",
    "GENERATED {ALWAYS | BY DEFAULT} AS IDENTITY",
    "ON {UPDATE | DELETE} [SET NULL | SET DEFAULT]",
    "{ROWS | RANGE | GROUPS} BETWEEN",
    // https://www.postgresql.org/docs/current/datatype-datetime.html
    "[TIMESTAMP | TIME] {WITH | WITHOUT} TIME ZONE",
    // comparison operator
    "IS [NOT] DISTINCT FROM"
  ]);
  var postgresql = {
    name: "postgresql",
    tokenizerOptions: {
      reservedSelect: reservedSelect10,
      reservedClauses: [...reservedClauses10, ...standardOnelineClauses9, ...tabularOnelineClauses9],
      reservedSetOperations: reservedSetOperations10,
      reservedJoins: reservedJoins10,
      reservedPhrases: reservedPhrases10,
      reservedKeywords: keywords10,
      reservedDataTypes: dataTypes10,
      reservedFunctionNames: functions10,
      nestedBlockComments: true,
      extraParens: ["[]"],
      stringTypes: [
        "$$",
        { quote: "''-qq", prefixes: ["U&"] },
        { quote: "''-qq-bs", prefixes: ["E"], requirePrefix: true },
        { quote: "''-raw", prefixes: ["B", "X"], requirePrefix: true }
      ],
      identTypes: [{ quote: '""-qq', prefixes: ["U&"] }],
      identChars: { rest: "$" },
      paramTypes: { numbered: ["$"] },
      operators: [
        // Arithmetic
        "%",
        "^",
        "|/",
        "||/",
        "@",
        // Assignment
        ":=",
        // Bitwise
        "&",
        "|",
        "#",
        "~",
        "<<",
        ">>",
        // Byte comparison
        "~>~",
        "~<~",
        "~>=~",
        "~<=~",
        // Geometric
        "@-@",
        "@@",
        "##",
        "<->",
        "&&",
        "&<",
        "&>",
        "<<|",
        "&<|",
        "|>>",
        "|&>",
        "<^",
        "^>",
        "?#",
        "?-",
        "?|",
        "?-|",
        "?||",
        "@>",
        "<@",
        "~=",
        // JSON
        "?",
        "@?",
        "?&",
        "->",
        "->>",
        "#>",
        "#>>",
        "#-",
        // Named function params
        "=>",
        // Network address
        ">>=",
        "<<=",
        // Pattern matching
        "~~",
        "~~*",
        "!~~",
        "!~~*",
        // POSIX RegExp
        "~",
        "~*",
        "!~",
        "!~*",
        // Range/multirange
        "-|-",
        // String concatenation
        "||",
        // Text search
        "@@@",
        "!!",
        "^@",
        // Trigram/trigraph
        "<%",
        "%>",
        "<<%",
        "%>>",
        "<<->",
        "<->>",
        "<<<->",
        "<->>>",
        // Type cast
        "::",
        ":"
      ]
    },
    formatOptions: {
      alwaysDenseOperators: ["::", ":"],
      onelineClauses: [...standardOnelineClauses9, ...tabularOnelineClauses9],
      tabularOnelineClauses: tabularOnelineClauses9
    }
  };
  var functions11 = [
    // https://docs.aws.amazon.com/redshift/latest/dg/c_Aggregate_Functions.html
    "ANY_VALUE",
    "APPROXIMATE PERCENTILE_DISC",
    "AVG",
    "COUNT",
    "LISTAGG",
    "MAX",
    "MEDIAN",
    "MIN",
    "PERCENTILE_CONT",
    "STDDEV_SAMP",
    "STDDEV_POP",
    "SUM",
    "VAR_SAMP",
    "VAR_POP",
    // https://docs.aws.amazon.com/redshift/latest/dg/c_Array_Functions.html
    "array",
    "array_concat",
    "array_flatten",
    "get_array_length",
    "split_to_array",
    "subarray",
    // https://docs.aws.amazon.com/redshift/latest/dg/c_bitwise_aggregate_functions.html
    "BIT_AND",
    "BIT_OR",
    "BOOL_AND",
    "BOOL_OR",
    // https://docs.aws.amazon.com/redshift/latest/dg/c_conditional_expressions.html
    "COALESCE",
    "DECODE",
    "GREATEST",
    "LEAST",
    "NVL",
    "NVL2",
    "NULLIF",
    // https://docs.aws.amazon.com/redshift/latest/dg/Date_functions_header.html
    "ADD_MONTHS",
    "AT TIME ZONE",
    "CONVERT_TIMEZONE",
    "CURRENT_DATE",
    "CURRENT_TIME",
    "CURRENT_TIMESTAMP",
    "DATE_CMP",
    "DATE_CMP_TIMESTAMP",
    "DATE_CMP_TIMESTAMPTZ",
    "DATE_PART_YEAR",
    "DATEADD",
    "DATEDIFF",
    "DATE_PART",
    "DATE_TRUNC",
    "EXTRACT",
    "GETDATE",
    "INTERVAL_CMP",
    "LAST_DAY",
    "MONTHS_BETWEEN",
    "NEXT_DAY",
    "SYSDATE",
    "TIMEOFDAY",
    "TIMESTAMP_CMP",
    "TIMESTAMP_CMP_DATE",
    "TIMESTAMP_CMP_TIMESTAMPTZ",
    "TIMESTAMPTZ_CMP",
    "TIMESTAMPTZ_CMP_DATE",
    "TIMESTAMPTZ_CMP_TIMESTAMP",
    "TIMEZONE",
    "TO_TIMESTAMP",
    "TRUNC",
    // https://docs.aws.amazon.com/redshift/latest/dg/geospatial-functions.html
    "AddBBox",
    "DropBBox",
    "GeometryType",
    "ST_AddPoint",
    "ST_Angle",
    "ST_Area",
    "ST_AsBinary",
    "ST_AsEWKB",
    "ST_AsEWKT",
    "ST_AsGeoJSON",
    "ST_AsText",
    "ST_Azimuth",
    "ST_Boundary",
    "ST_Collect",
    "ST_Contains",
    "ST_ContainsProperly",
    "ST_ConvexHull",
    "ST_CoveredBy",
    "ST_Covers",
    "ST_Crosses",
    "ST_Dimension",
    "ST_Disjoint",
    "ST_Distance",
    "ST_DistanceSphere",
    "ST_DWithin",
    "ST_EndPoint",
    "ST_Envelope",
    "ST_Equals",
    "ST_ExteriorRing",
    "ST_Force2D",
    "ST_Force3D",
    "ST_Force3DM",
    "ST_Force3DZ",
    "ST_Force4D",
    "ST_GeometryN",
    "ST_GeometryType",
    "ST_GeomFromEWKB",
    "ST_GeomFromEWKT",
    "ST_GeomFromText",
    "ST_GeomFromWKB",
    "ST_InteriorRingN",
    "ST_Intersects",
    "ST_IsPolygonCCW",
    "ST_IsPolygonCW",
    "ST_IsClosed",
    "ST_IsCollection",
    "ST_IsEmpty",
    "ST_IsSimple",
    "ST_IsValid",
    "ST_Length",
    "ST_LengthSphere",
    "ST_Length2D",
    "ST_LineFromMultiPoint",
    "ST_LineInterpolatePoint",
    "ST_M",
    "ST_MakeEnvelope",
    "ST_MakeLine",
    "ST_MakePoint",
    "ST_MakePolygon",
    "ST_MemSize",
    "ST_MMax",
    "ST_MMin",
    "ST_Multi",
    "ST_NDims",
    "ST_NPoints",
    "ST_NRings",
    "ST_NumGeometries",
    "ST_NumInteriorRings",
    "ST_NumPoints",
    "ST_Perimeter",
    "ST_Perimeter2D",
    "ST_Point",
    "ST_PointN",
    "ST_Points",
    "ST_Polygon",
    "ST_RemovePoint",
    "ST_Reverse",
    "ST_SetPoint",
    "ST_SetSRID",
    "ST_Simplify",
    "ST_SRID",
    "ST_StartPoint",
    "ST_Touches",
    "ST_Within",
    "ST_X",
    "ST_XMax",
    "ST_XMin",
    "ST_Y",
    "ST_YMax",
    "ST_YMin",
    "ST_Z",
    "ST_ZMax",
    "ST_ZMin",
    "SupportsBBox",
    // https://docs.aws.amazon.com/redshift/latest/dg/hash-functions.html
    "CHECKSUM",
    "FUNC_SHA1",
    "FNV_HASH",
    "MD5",
    "SHA",
    "SHA1",
    "SHA2",
    // https://docs.aws.amazon.com/redshift/latest/dg/hyperloglog-functions.html
    "HLL",
    "HLL_CREATE_SKETCH",
    "HLL_CARDINALITY",
    "HLL_COMBINE",
    // https://docs.aws.amazon.com/redshift/latest/dg/json-functions.html
    "IS_VALID_JSON",
    "IS_VALID_JSON_ARRAY",
    "JSON_ARRAY_LENGTH",
    "JSON_EXTRACT_ARRAY_ELEMENT_TEXT",
    "JSON_EXTRACT_PATH_TEXT",
    "JSON_PARSE",
    "JSON_SERIALIZE",
    // https://docs.aws.amazon.com/redshift/latest/dg/Math_functions.html
    "ABS",
    "ACOS",
    "ASIN",
    "ATAN",
    "ATAN2",
    "CBRT",
    "CEILING",
    "CEIL",
    "COS",
    "COT",
    "DEGREES",
    "DEXP",
    "DLOG1",
    "DLOG10",
    "EXP",
    "FLOOR",
    "LN",
    "LOG",
    "MOD",
    "PI",
    "POWER",
    "RADIANS",
    "RANDOM",
    "ROUND",
    "SIN",
    "SIGN",
    "SQRT",
    "TAN",
    "TO_HEX",
    "TRUNC",
    // https://docs.aws.amazon.com/redshift/latest/dg/ml-function.html
    "EXPLAIN_MODEL",
    // https://docs.aws.amazon.com/redshift/latest/dg/String_functions_header.html
    "ASCII",
    "BPCHARCMP",
    "BTRIM",
    "BTTEXT_PATTERN_CMP",
    "CHAR_LENGTH",
    "CHARACTER_LENGTH",
    "CHARINDEX",
    "CHR",
    "COLLATE",
    "CONCAT",
    "CRC32",
    "DIFFERENCE",
    "INITCAP",
    "LEFT",
    "RIGHT",
    "LEN",
    "LENGTH",
    "LOWER",
    "LPAD",
    "RPAD",
    "LTRIM",
    "OCTETINDEX",
    "OCTET_LENGTH",
    "POSITION",
    "QUOTE_IDENT",
    "QUOTE_LITERAL",
    "REGEXP_COUNT",
    "REGEXP_INSTR",
    "REGEXP_REPLACE",
    "REGEXP_SUBSTR",
    "REPEAT",
    "REPLACE",
    "REPLICATE",
    "REVERSE",
    "RTRIM",
    "SOUNDEX",
    "SPLIT_PART",
    "STRPOS",
    "STRTOL",
    "SUBSTRING",
    "TEXTLEN",
    "TRANSLATE",
    "TRIM",
    "UPPER",
    // https://docs.aws.amazon.com/redshift/latest/dg/c_Type_Info_Functions.html
    "decimal_precision",
    "decimal_scale",
    "is_array",
    "is_bigint",
    "is_boolean",
    "is_char",
    "is_decimal",
    "is_float",
    "is_integer",
    "is_object",
    "is_scalar",
    "is_smallint",
    "is_varchar",
    "json_typeof",
    // https://docs.aws.amazon.com/redshift/latest/dg/c_Window_functions.html
    "AVG",
    "COUNT",
    "CUME_DIST",
    "DENSE_RANK",
    "FIRST_VALUE",
    "LAST_VALUE",
    "LAG",
    "LEAD",
    "LISTAGG",
    "MAX",
    "MEDIAN",
    "MIN",
    "NTH_VALUE",
    "NTILE",
    "PERCENT_RANK",
    "PERCENTILE_CONT",
    "PERCENTILE_DISC",
    "RANK",
    "RATIO_TO_REPORT",
    "ROW_NUMBER",
    "STDDEV_SAMP",
    "STDDEV_POP",
    "SUM",
    "VAR_SAMP",
    "VAR_POP",
    // https://docs.aws.amazon.com/redshift/latest/dg/r_Data_type_formatting.html
    "CAST",
    "CONVERT",
    "TO_CHAR",
    "TO_DATE",
    "TO_NUMBER",
    "TEXT_TO_INT_ALT",
    "TEXT_TO_NUMERIC_ALT",
    // https://docs.aws.amazon.com/redshift/latest/dg/r_System_administration_functions.html
    "CHANGE_QUERY_PRIORITY",
    "CHANGE_SESSION_PRIORITY",
    "CHANGE_USER_PRIORITY",
    "CURRENT_SETTING",
    "PG_CANCEL_BACKEND",
    "PG_TERMINATE_BACKEND",
    "REBOOT_CLUSTER",
    "SET_CONFIG",
    // https://docs.aws.amazon.com/redshift/latest/dg/r_System_information_functions.html
    "CURRENT_AWS_ACCOUNT",
    "CURRENT_DATABASE",
    "CURRENT_NAMESPACE",
    "CURRENT_SCHEMA",
    "CURRENT_SCHEMAS",
    "CURRENT_USER",
    "CURRENT_USER_ID",
    "HAS_ASSUMEROLE_PRIVILEGE",
    "HAS_DATABASE_PRIVILEGE",
    "HAS_SCHEMA_PRIVILEGE",
    "HAS_TABLE_PRIVILEGE",
    "PG_BACKEND_PID",
    "PG_GET_COLS",
    "PG_GET_GRANTEE_BY_IAM_ROLE",
    "PG_GET_IAM_ROLE_BY_USER",
    "PG_GET_LATE_BINDING_VIEW_COLS",
    "PG_LAST_COPY_COUNT",
    "PG_LAST_COPY_ID",
    "PG_LAST_UNLOAD_ID",
    "PG_LAST_QUERY_ID",
    "PG_LAST_UNLOAD_COUNT",
    "SESSION_USER",
    "SLICE_NUM",
    "USER",
    "VERSION"
  ];
  var keywords11 = [
    // https://docs.aws.amazon.com/redshift/latest/dg/r_pg_keywords.html
    "AES128",
    "AES256",
    "ALL",
    "ALLOWOVERWRITE",
    "ANY",
    "AS",
    "ASC",
    "AUTHORIZATION",
    "BACKUP",
    "BETWEEN",
    "BINARY",
    "BOTH",
    "CHECK",
    "COLUMN",
    "CONSTRAINT",
    "CREATE",
    "CROSS",
    "DEFAULT",
    "DEFERRABLE",
    "DEFLATE",
    "DEFRAG",
    "DESC",
    "DISABLE",
    "DISTINCT",
    "DO",
    "ENABLE",
    "ENCODE",
    "ENCRYPT",
    "ENCRYPTION",
    "EXPLICIT",
    "FALSE",
    "FOR",
    "FOREIGN",
    "FREEZE",
    "FROM",
    "FULL",
    "GLOBALDICT256",
    "GLOBALDICT64K",
    "GROUP",
    "IDENTITY",
    "IGNORE",
    "ILIKE",
    "IN",
    "INITIALLY",
    "INNER",
    "INTO",
    "IS",
    "ISNULL",
    "LANGUAGE",
    "LEADING",
    "LIKE",
    "LIMIT",
    "LOCALTIME",
    "LOCALTIMESTAMP",
    "LUN",
    "LUNS",
    "MINUS",
    "NATURAL",
    "NEW",
    "NOT",
    "NOTNULL",
    "NULL",
    "NULLS",
    "OFF",
    "OFFLINE",
    "OFFSET",
    "OID",
    "OLD",
    "ON",
    "ONLY",
    "OPEN",
    "ORDER",
    "OUTER",
    "OVERLAPS",
    "PARALLEL",
    "PARTITION",
    "PERCENT",
    "PERMISSIONS",
    "PLACING",
    "PRIMARY",
    "RECOVER",
    "REFERENCES",
    "REJECTLOG",
    "RESORT",
    "RESPECT",
    "RESTORE",
    "SIMILAR",
    "SNAPSHOT",
    "SOME",
    "SYSTEM",
    "TABLE",
    "TAG",
    "TDES",
    "THEN",
    "TIMESTAMP",
    "TO",
    "TOP",
    "TRAILING",
    "TRUE",
    "UNIQUE",
    "USING",
    "VERBOSE",
    "WALLET",
    "WITHOUT",
    // https://docs.aws.amazon.com/redshift/latest/dg/copy-parameters-data-conversion.html
    "ACCEPTANYDATE",
    "ACCEPTINVCHARS",
    "BLANKSASNULL",
    "DATEFORMAT",
    "EMPTYASNULL",
    "ENCODING",
    "ESCAPE",
    "EXPLICIT_IDS",
    "FILLRECORD",
    "IGNOREBLANKLINES",
    "IGNOREHEADER",
    "REMOVEQUOTES",
    "ROUNDEC",
    "TIMEFORMAT",
    "TRIMBLANKS",
    "TRUNCATECOLUMNS",
    // https://docs.aws.amazon.com/redshift/latest/dg/copy-parameters-data-load.html
    "COMPROWS",
    "COMPUPDATE",
    "MAXERROR",
    "NOLOAD",
    "STATUPDATE",
    // https://docs.aws.amazon.com/redshift/latest/dg/copy-parameters-data-format.html
    "FORMAT",
    "CSV",
    "DELIMITER",
    "FIXEDWIDTH",
    "SHAPEFILE",
    "AVRO",
    "JSON",
    "PARQUET",
    "ORC",
    // https://docs.aws.amazon.com/redshift/latest/dg/copy-parameters-authorization.html
    "ACCESS_KEY_ID",
    "CREDENTIALS",
    "ENCRYPTED",
    "IAM_ROLE",
    "MASTER_SYMMETRIC_KEY",
    "SECRET_ACCESS_KEY",
    "SESSION_TOKEN",
    // https://docs.aws.amazon.com/redshift/latest/dg/copy-parameters-file-compression.html
    "BZIP2",
    "GZIP",
    "LZOP",
    "ZSTD",
    // https://docs.aws.amazon.com/redshift/latest/dg/r_COPY-alphabetical-parm-list.html
    "MANIFEST",
    "READRATIO",
    "REGION",
    "SSH",
    // https://docs.aws.amazon.com/redshift/latest/dg/c_Compression_encodings.html
    "RAW",
    "AZ64",
    "BYTEDICT",
    "DELTA",
    "DELTA32K",
    "LZO",
    "MOSTLY8",
    "MOSTLY16",
    "MOSTLY32",
    "RUNLENGTH",
    "TEXT255",
    "TEXT32K",
    // misc
    // CREATE EXTERNAL SCHEMA (https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_EXTERNAL_SCHEMA.html)
    "CATALOG_ROLE",
    "SECRET_ARN",
    "EXTERNAL",
    // https://docs.aws.amazon.com/redshift/latest/dg/c_choosing_dist_sort.html
    "AUTO",
    "EVEN",
    "KEY",
    "PREDICATE",
    // ANALYZE | ANALYSE (https://docs.aws.amazon.com/redshift/latest/dg/r_ANALYZE.html)
    // unknown
    "COMPRESSION"
    /**
     * Other keywords not included:
     * STL: https://docs.aws.amazon.com/redshift/latest/dg/c_intro_STL_tables.html
     * SVCS: https://docs.aws.amazon.com/redshift/latest/dg/svcs_views.html
     * SVL: https://docs.aws.amazon.com/redshift/latest/dg/svl_views.html
     * SVV: https://docs.aws.amazon.com/redshift/latest/dg/svv_views.html
     */
  ];
  var dataTypes11 = [
    // https://docs.aws.amazon.com/redshift/latest/dg/r_Character_types.html#r_Character_types-text-and-bpchar-types
    "ARRAY",
    "BIGINT",
    "BPCHAR",
    "CHAR",
    "CHARACTER VARYING",
    "CHARACTER",
    "DECIMAL",
    "INT",
    "INT2",
    "INT4",
    "INT8",
    "INTEGER",
    "NCHAR",
    "NUMERIC",
    "NVARCHAR",
    "SMALLINT",
    "TEXT",
    "VARBYTE",
    "VARCHAR"
  ];
  var reservedSelect11 = expandPhrases(["SELECT [ALL | DISTINCT]"]);
  var reservedClauses11 = expandPhrases([
    // queries
    "WITH [RECURSIVE]",
    "FROM",
    "WHERE",
    "GROUP BY",
    "HAVING",
    "PARTITION BY",
    "ORDER BY",
    "LIMIT",
    "OFFSET",
    // Data manipulation
    // - insert:
    "INSERT INTO",
    "VALUES",
    // - update:
    "SET"
  ]);
  var standardOnelineClauses10 = expandPhrases([
    "CREATE [TEMPORARY | TEMP | LOCAL TEMPORARY | LOCAL TEMP] TABLE [IF NOT EXISTS]"
  ]);
  var tabularOnelineClauses10 = expandPhrases([
    // - create:
    "CREATE [OR REPLACE | MATERIALIZED] VIEW",
    // - update:
    "UPDATE",
    // - delete:
    "DELETE [FROM]",
    // - drop table:
    "DROP TABLE [IF EXISTS]",
    // - alter table:
    "ALTER TABLE",
    "ALTER TABLE APPEND",
    "ADD [COLUMN]",
    "DROP [COLUMN]",
    "RENAME TO",
    "RENAME COLUMN",
    "ALTER COLUMN",
    "TYPE",
    // for alter column
    "ENCODE",
    // for alter column
    // - truncate:
    "TRUNCATE [TABLE]",
    // https://docs.aws.amazon.com/redshift/latest/dg/c_SQL_commands.html
    "ABORT",
    "ALTER DATABASE",
    "ALTER DATASHARE",
    "ALTER DEFAULT PRIVILEGES",
    "ALTER GROUP",
    "ALTER MATERIALIZED VIEW",
    "ALTER PROCEDURE",
    "ALTER SCHEMA",
    "ALTER USER",
    "ANALYSE",
    "ANALYZE",
    "ANALYSE COMPRESSION",
    "ANALYZE COMPRESSION",
    "BEGIN",
    "CALL",
    "CANCEL",
    "CLOSE",
    "COMMIT",
    "COPY",
    "CREATE DATABASE",
    "CREATE DATASHARE",
    "CREATE EXTERNAL FUNCTION",
    "CREATE EXTERNAL SCHEMA",
    "CREATE EXTERNAL TABLE",
    "CREATE FUNCTION",
    "CREATE GROUP",
    "CREATE LIBRARY",
    "CREATE MODEL",
    "CREATE PROCEDURE",
    "CREATE SCHEMA",
    "CREATE USER",
    "DEALLOCATE",
    "DECLARE",
    "DESC DATASHARE",
    "DROP DATABASE",
    "DROP DATASHARE",
    "DROP FUNCTION",
    "DROP GROUP",
    "DROP LIBRARY",
    "DROP MODEL",
    "DROP MATERIALIZED VIEW",
    "DROP PROCEDURE",
    "DROP SCHEMA",
    "DROP USER",
    "DROP VIEW",
    "DROP",
    "EXECUTE",
    "EXPLAIN",
    "FETCH",
    "GRANT",
    "LOCK",
    "PREPARE",
    "REFRESH MATERIALIZED VIEW",
    "RESET",
    "REVOKE",
    "ROLLBACK",
    "SELECT INTO",
    "SET SESSION AUTHORIZATION",
    "SET SESSION CHARACTERISTICS",
    "SHOW",
    "SHOW EXTERNAL TABLE",
    "SHOW MODEL",
    "SHOW DATASHARES",
    "SHOW PROCEDURE",
    "SHOW TABLE",
    "SHOW VIEW",
    "START TRANSACTION",
    "UNLOAD",
    "VACUUM"
  ]);
  var reservedSetOperations11 = expandPhrases(["UNION [ALL]", "EXCEPT", "INTERSECT", "MINUS"]);
  var reservedJoins11 = expandPhrases([
    "JOIN",
    "{LEFT | RIGHT | FULL} [OUTER] JOIN",
    "{INNER | CROSS} JOIN",
    "NATURAL [INNER] JOIN",
    "NATURAL {LEFT | RIGHT | FULL} [OUTER] JOIN"
  ]);
  var reservedPhrases11 = expandPhrases([
    // https://docs.aws.amazon.com/redshift/latest/dg/copy-parameters-data-conversion.html
    "NULL AS",
    // https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_EXTERNAL_SCHEMA.html
    "DATA CATALOG",
    "HIVE METASTORE",
    // in window specifications
    "{ROWS | RANGE} BETWEEN"
  ]);
  var redshift = {
    name: "redshift",
    tokenizerOptions: {
      reservedSelect: reservedSelect11,
      reservedClauses: [...reservedClauses11, ...standardOnelineClauses10, ...tabularOnelineClauses10],
      reservedSetOperations: reservedSetOperations11,
      reservedJoins: reservedJoins11,
      reservedPhrases: reservedPhrases11,
      reservedKeywords: keywords11,
      reservedDataTypes: dataTypes11,
      reservedFunctionNames: functions11,
      stringTypes: ["''-qq"],
      identTypes: [`""-qq`],
      identChars: { first: "#" },
      paramTypes: { numbered: ["$"] },
      operators: [
        "^",
        "%",
        "@",
        "|/",
        "||/",
        "&",
        "|",
        // '#', conflicts with first char of identifier
        "~",
        "<<",
        ">>",
        "||",
        "::"
      ]
    },
    formatOptions: {
      alwaysDenseOperators: ["::"],
      onelineClauses: [...standardOnelineClauses10, ...tabularOnelineClauses10],
      tabularOnelineClauses: tabularOnelineClauses10
    }
  };
  var keywords12 = [
    // https://deepkb.com/CO_000013/en/kb/IMPORT-fbfa59f0-2bf1-31fe-bb7b-0f9efe9932c6/spark-sql-keywords
    "ADD",
    "AFTER",
    "ALL",
    "ALTER",
    "ANALYZE",
    "AND",
    "ANTI",
    "ANY",
    "ARCHIVE",
    "AS",
    "ASC",
    "AT",
    "AUTHORIZATION",
    "BETWEEN",
    "BOTH",
    "BUCKET",
    "BUCKETS",
    "BY",
    "CACHE",
    "CASCADE",
    "CAST",
    "CHANGE",
    "CHECK",
    "CLEAR",
    "CLUSTER",
    "CLUSTERED",
    "CODEGEN",
    "COLLATE",
    "COLLECTION",
    "COLUMN",
    "COLUMNS",
    "COMMENT",
    "COMMIT",
    "COMPACT",
    "COMPACTIONS",
    "COMPUTE",
    "CONCATENATE",
    "CONSTRAINT",
    "COST",
    "CREATE",
    "CROSS",
    "CUBE",
    "CURRENT",
    "CURRENT_DATE",
    "CURRENT_TIME",
    "CURRENT_TIMESTAMP",
    "CURRENT_USER",
    "DATA",
    "DATABASE",
    "DATABASES",
    "DAY",
    "DBPROPERTIES",
    "DEFINED",
    "DELETE",
    "DELIMITED",
    "DESC",
    "DESCRIBE",
    "DFS",
    "DIRECTORIES",
    "DIRECTORY",
    "DISTINCT",
    "DISTRIBUTE",
    "DIV",
    "DROP",
    "ESCAPE",
    "ESCAPED",
    "EXCEPT",
    "EXCHANGE",
    "EXISTS",
    "EXPORT",
    "EXTENDED",
    "EXTERNAL",
    "EXTRACT",
    "FALSE",
    "FETCH",
    "FIELDS",
    "FILTER",
    "FILEFORMAT",
    "FIRST",
    "FIRST_VALUE",
    "FOLLOWING",
    "FOR",
    "FOREIGN",
    "FORMAT",
    "FORMATTED",
    "FULL",
    "FUNCTION",
    "FUNCTIONS",
    "GLOBAL",
    "GRANT",
    "GROUP",
    "GROUPING",
    "HOUR",
    "IF",
    "IGNORE",
    "IMPORT",
    "IN",
    "INDEX",
    "INDEXES",
    "INNER",
    "INPATH",
    "INPUTFORMAT",
    "INTERSECT",
    "INTO",
    "IS",
    "ITEMS",
    "KEYS",
    "LAST",
    "LAST_VALUE",
    "LATERAL",
    "LAZY",
    "LEADING",
    "LEFT",
    "LIKE",
    "LINES",
    "LIST",
    "LOCAL",
    "LOCATION",
    "LOCK",
    "LOCKS",
    "LOGICAL",
    "MACRO",
    "MATCHED",
    "MERGE",
    "MINUTE",
    "MONTH",
    "MSCK",
    "NAMESPACE",
    "NAMESPACES",
    "NATURAL",
    "NO",
    "NOT",
    "NULL",
    "NULLS",
    "OF",
    "ONLY",
    "OPTION",
    "OPTIONS",
    "OR",
    "ORDER",
    "OUT",
    "OUTER",
    "OUTPUTFORMAT",
    "OVER",
    "OVERLAPS",
    "OVERLAY",
    "OVERWRITE",
    "OWNER",
    "PARTITION",
    "PARTITIONED",
    "PARTITIONS",
    "PERCENT",
    "PLACING",
    "POSITION",
    "PRECEDING",
    "PRIMARY",
    "PRINCIPALS",
    "PROPERTIES",
    "PURGE",
    "QUERY",
    "RANGE",
    "RECORDREADER",
    "RECORDWRITER",
    "RECOVER",
    "REDUCE",
    "REFERENCES",
    "RENAME",
    "REPAIR",
    "REPLACE",
    "RESPECT",
    "RESTRICT",
    "REVOKE",
    "RIGHT",
    "RLIKE",
    "ROLE",
    "ROLES",
    "ROLLBACK",
    "ROLLUP",
    "ROW",
    "ROWS",
    "SCHEMA",
    "SECOND",
    "SELECT",
    "SEMI",
    "SEPARATED",
    "SERDE",
    "SERDEPROPERTIES",
    "SESSION_USER",
    "SETS",
    "SHOW",
    "SKEWED",
    "SOME",
    "SORT",
    "SORTED",
    "START",
    "STATISTICS",
    "STORED",
    "STRATIFY",
    "SUBSTR",
    "SUBSTRING",
    "TABLE",
    "TABLES",
    "TBLPROPERTIES",
    "TEMPORARY",
    "TERMINATED",
    "THEN",
    "TO",
    "TOUCH",
    "TRAILING",
    "TRANSACTION",
    "TRANSACTIONS",
    "TRIM",
    "TRUE",
    "TRUNCATE",
    "UNARCHIVE",
    "UNBOUNDED",
    "UNCACHE",
    "UNIQUE",
    "UNKNOWN",
    "UNLOCK",
    "UNSET",
    "USE",
    "USER",
    "USING",
    "VIEW",
    "WINDOW",
    "YEAR",
    // other
    "ANALYSE",
    "ARRAY_ZIP",
    "COALESCE",
    "CONTAINS",
    "CONVERT",
    "DAYS",
    "DAY_HOUR",
    "DAY_MINUTE",
    "DAY_SECOND",
    "DECODE",
    "DEFAULT",
    "DISTINCTROW",
    "ENCODE",
    "EXPLODE",
    "EXPLODE_OUTER",
    "FIXED",
    "GREATEST",
    "GROUP_CONCAT",
    "HOURS",
    "HOUR_MINUTE",
    "HOUR_SECOND",
    "IFNULL",
    "LEAST",
    "LEVEL",
    "MINUTE_SECOND",
    "NULLIF",
    "OFFSET",
    "ON",
    "OPTIMIZE",
    "REGEXP",
    "SEPARATOR",
    "SIZE",
    "TYPE",
    "TYPES",
    "UNSIGNED",
    "VARIABLES",
    "YEAR_MONTH"
  ];
  var dataTypes12 = [
    // https://spark.apache.org/docs/latest/sql-ref-datatypes.html
    "ARRAY",
    "BIGINT",
    "BINARY",
    "BOOLEAN",
    "BYTE",
    "CHAR",
    "DATE",
    "DEC",
    "DECIMAL",
    "DOUBLE",
    "FLOAT",
    "INT",
    "INTEGER",
    "INTERVAL",
    "LONG",
    "MAP",
    "NUMERIC",
    "REAL",
    "SHORT",
    "SMALLINT",
    "STRING",
    "STRUCT",
    "TIMESTAMP_LTZ",
    "TIMESTAMP_NTZ",
    "TIMESTAMP",
    "TINYINT",
    "VARCHAR"
    // No varchar type in Spark, only STRING. Added for the sake of tests
  ];
  var functions12 = [
    // http://spark.apache.org/docs/latest/sql-ref-functions.html
    //
    // http://spark.apache.org/docs/latest/sql-ref-functions-builtin.html#aggregate-functions
    // 'ANY',
    "APPROX_COUNT_DISTINCT",
    "APPROX_PERCENTILE",
    "AVG",
    "BIT_AND",
    "BIT_OR",
    "BIT_XOR",
    "BOOL_AND",
    "BOOL_OR",
    "COLLECT_LIST",
    "COLLECT_SET",
    "CORR",
    "COUNT",
    "COUNT",
    "COUNT",
    "COUNT_IF",
    "COUNT_MIN_SKETCH",
    "COVAR_POP",
    "COVAR_SAMP",
    "EVERY",
    "FIRST",
    "FIRST_VALUE",
    "GROUPING",
    "GROUPING_ID",
    "KURTOSIS",
    "LAST",
    "LAST_VALUE",
    "MAX",
    "MAX_BY",
    "MEAN",
    "MIN",
    "MIN_BY",
    "PERCENTILE",
    "PERCENTILE",
    "PERCENTILE_APPROX",
    "SKEWNESS",
    // 'SOME',
    "STD",
    "STDDEV",
    "STDDEV_POP",
    "STDDEV_SAMP",
    "SUM",
    "VAR_POP",
    "VAR_SAMP",
    "VARIANCE",
    // http://spark.apache.org/docs/latest/sql-ref-functions-builtin.html#window-functions
    "CUME_DIST",
    "DENSE_RANK",
    "LAG",
    "LEAD",
    "NTH_VALUE",
    "NTILE",
    "PERCENT_RANK",
    "RANK",
    "ROW_NUMBER",
    // http://spark.apache.org/docs/latest/sql-ref-functions-builtin.html#array-functions
    "ARRAY",
    "ARRAY_CONTAINS",
    "ARRAY_DISTINCT",
    "ARRAY_EXCEPT",
    "ARRAY_INTERSECT",
    "ARRAY_JOIN",
    "ARRAY_MAX",
    "ARRAY_MIN",
    "ARRAY_POSITION",
    "ARRAY_REMOVE",
    "ARRAY_REPEAT",
    "ARRAY_UNION",
    "ARRAYS_OVERLAP",
    "ARRAYS_ZIP",
    "FLATTEN",
    "SEQUENCE",
    "SHUFFLE",
    "SLICE",
    "SORT_ARRAY",
    // http://spark.apache.org/docs/latest/sql-ref-functions-builtin.html#map-functions
    "ELEMENT_AT",
    "ELEMENT_AT",
    "MAP_CONCAT",
    "MAP_ENTRIES",
    "MAP_FROM_ARRAYS",
    "MAP_FROM_ENTRIES",
    "MAP_KEYS",
    "MAP_VALUES",
    "STR_TO_MAP",
    // http://spark.apache.org/docs/latest/sql-ref-functions-builtin.html#date-and-timestamp-functions
    "ADD_MONTHS",
    "CURRENT_DATE",
    "CURRENT_DATE",
    "CURRENT_TIMESTAMP",
    "CURRENT_TIMESTAMP",
    "CURRENT_TIMEZONE",
    "DATE_ADD",
    "DATE_FORMAT",
    "DATE_FROM_UNIX_DATE",
    "DATE_PART",
    "DATE_SUB",
    "DATE_TRUNC",
    "DATEDIFF",
    "DAY",
    "DAYOFMONTH",
    "DAYOFWEEK",
    "DAYOFYEAR",
    "EXTRACT",
    "FROM_UNIXTIME",
    "FROM_UTC_TIMESTAMP",
    "HOUR",
    "LAST_DAY",
    "MAKE_DATE",
    "MAKE_DT_INTERVAL",
    "MAKE_INTERVAL",
    "MAKE_TIMESTAMP",
    "MAKE_YM_INTERVAL",
    "MINUTE",
    "MONTH",
    "MONTHS_BETWEEN",
    "NEXT_DAY",
    "NOW",
    "QUARTER",
    "SECOND",
    "SESSION_WINDOW",
    "TIMESTAMP_MICROS",
    "TIMESTAMP_MILLIS",
    "TIMESTAMP_SECONDS",
    "TO_DATE",
    "TO_TIMESTAMP",
    "TO_UNIX_TIMESTAMP",
    "TO_UTC_TIMESTAMP",
    "TRUNC",
    "UNIX_DATE",
    "UNIX_MICROS",
    "UNIX_MILLIS",
    "UNIX_SECONDS",
    "UNIX_TIMESTAMP",
    "WEEKDAY",
    "WEEKOFYEAR",
    "WINDOW",
    "YEAR",
    // http://spark.apache.org/docs/latest/sql-ref-functions-builtin.html#json-functions
    "FROM_JSON",
    "GET_JSON_OBJECT",
    "JSON_ARRAY_LENGTH",
    "JSON_OBJECT_KEYS",
    "JSON_TUPLE",
    "SCHEMA_OF_JSON",
    "TO_JSON",
    // http://spark.apache.org/docs/latest/api/sql/index.html
    "ABS",
    "ACOS",
    "ACOSH",
    "AGGREGATE",
    "ARRAY_SORT",
    "ASCII",
    "ASIN",
    "ASINH",
    "ASSERT_TRUE",
    "ATAN",
    "ATAN2",
    "ATANH",
    "BASE64",
    "BIN",
    "BIT_COUNT",
    "BIT_GET",
    "BIT_LENGTH",
    "BROUND",
    "BTRIM",
    "CARDINALITY",
    "CBRT",
    "CEIL",
    "CEILING",
    "CHAR_LENGTH",
    "CHARACTER_LENGTH",
    "CHR",
    "CONCAT",
    "CONCAT_WS",
    "CONV",
    "COS",
    "COSH",
    "COT",
    "CRC32",
    "CURRENT_CATALOG",
    "CURRENT_DATABASE",
    "CURRENT_USER",
    "DEGREES",
    // 'E',
    "ELT",
    "EXP",
    "EXPM1",
    "FACTORIAL",
    "FIND_IN_SET",
    "FLOOR",
    "FORALL",
    "FORMAT_NUMBER",
    "FORMAT_STRING",
    "FROM_CSV",
    "GETBIT",
    "HASH",
    "HEX",
    "HYPOT",
    "INITCAP",
    "INLINE",
    "INLINE_OUTER",
    "INPUT_FILE_BLOCK_LENGTH",
    "INPUT_FILE_BLOCK_START",
    "INPUT_FILE_NAME",
    "INSTR",
    "ISNAN",
    "ISNOTNULL",
    "ISNULL",
    "JAVA_METHOD",
    "LCASE",
    "LEFT",
    "LENGTH",
    "LEVENSHTEIN",
    "LN",
    "LOCATE",
    "LOG",
    "LOG10",
    "LOG1P",
    "LOG2",
    "LOWER",
    "LPAD",
    "LTRIM",
    "MAP_FILTER",
    "MAP_ZIP_WITH",
    "MD5",
    "MOD",
    "MONOTONICALLY_INCREASING_ID",
    "NAMED_STRUCT",
    "NANVL",
    "NEGATIVE",
    "NVL",
    "NVL2",
    "OCTET_LENGTH",
    "OVERLAY",
    "PARSE_URL",
    "PI",
    "PMOD",
    "POSEXPLODE",
    "POSEXPLODE_OUTER",
    "POSITION",
    "POSITIVE",
    "POW",
    "POWER",
    "PRINTF",
    "RADIANS",
    "RAISE_ERROR",
    "RAND",
    "RANDN",
    "RANDOM",
    "REFLECT",
    "REGEXP_EXTRACT",
    "REGEXP_EXTRACT_ALL",
    "REGEXP_LIKE",
    "REGEXP_REPLACE",
    "REPEAT",
    "REPLACE",
    "REVERSE",
    "RIGHT",
    "RINT",
    "ROUND",
    "RPAD",
    "RTRIM",
    "SCHEMA_OF_CSV",
    "SENTENCES",
    "SHA",
    "SHA1",
    "SHA2",
    "SHIFTLEFT",
    "SHIFTRIGHT",
    "SHIFTRIGHTUNSIGNED",
    "SIGN",
    "SIGNUM",
    "SIN",
    "SINH",
    "SOUNDEX",
    "SPACE",
    "SPARK_PARTITION_ID",
    "SPLIT",
    "SQRT",
    "STACK",
    "SUBSTR",
    "SUBSTRING",
    "SUBSTRING_INDEX",
    "TAN",
    "TANH",
    "TO_CSV",
    "TRANSFORM_KEYS",
    "TRANSFORM_VALUES",
    "TRANSLATE",
    "TRIM",
    "TRY_ADD",
    "TRY_DIVIDE",
    "TYPEOF",
    "UCASE",
    "UNBASE64",
    "UNHEX",
    "UPPER",
    "UUID",
    "VERSION",
    "WIDTH_BUCKET",
    "XPATH",
    "XPATH_BOOLEAN",
    "XPATH_DOUBLE",
    "XPATH_FLOAT",
    "XPATH_INT",
    "XPATH_LONG",
    "XPATH_NUMBER",
    "XPATH_SHORT",
    "XPATH_STRING",
    "XXHASH64",
    "ZIP_WITH",
    // cast
    "CAST",
    // Shorthand functions to use in place of CASE expression
    "COALESCE",
    "NULLIF"
  ];
  var reservedSelect12 = expandPhrases(["SELECT [ALL | DISTINCT]"]);
  var reservedClauses12 = expandPhrases([
    // queries
    "WITH",
    "FROM",
    "WHERE",
    "GROUP BY",
    "HAVING",
    "WINDOW",
    "PARTITION BY",
    "ORDER BY",
    "SORT BY",
    "CLUSTER BY",
    "DISTRIBUTE BY",
    "LIMIT",
    // Data manipulation
    // - insert:
    "INSERT [INTO | OVERWRITE] [TABLE]",
    "VALUES",
    // - insert overwrite directory:
    //   https://spark.apache.org/docs/latest/sql-ref-syntax-dml-insert-overwrite-directory.html
    "INSERT OVERWRITE [LOCAL] DIRECTORY",
    // - load:
    //   https://spark.apache.org/docs/latest/sql-ref-syntax-dml-load.html
    "LOAD DATA [LOCAL] INPATH",
    "[OVERWRITE] INTO TABLE"
  ]);
  var standardOnelineClauses11 = expandPhrases(["CREATE [EXTERNAL] TABLE [IF NOT EXISTS]"]);
  var tabularOnelineClauses11 = expandPhrases([
    // - create:
    "CREATE [OR REPLACE] [GLOBAL TEMPORARY | TEMPORARY] VIEW [IF NOT EXISTS]",
    // - drop table:
    "DROP TABLE [IF EXISTS]",
    // - alter table:
    "ALTER TABLE",
    "ADD COLUMNS",
    "DROP {COLUMN | COLUMNS}",
    "RENAME TO",
    "RENAME COLUMN",
    "ALTER COLUMN",
    // - truncate:
    "TRUNCATE TABLE",
    // other
    "LATERAL VIEW",
    "ALTER DATABASE",
    "ALTER VIEW",
    "CREATE DATABASE",
    "CREATE FUNCTION",
    "DROP DATABASE",
    "DROP FUNCTION",
    "DROP VIEW",
    "REPAIR TABLE",
    "USE DATABASE",
    // Data Retrieval
    "TABLESAMPLE",
    "PIVOT",
    "TRANSFORM",
    "EXPLAIN",
    // Auxiliary
    "ADD FILE",
    "ADD JAR",
    "ANALYZE TABLE",
    "CACHE TABLE",
    "CLEAR CACHE",
    "DESCRIBE DATABASE",
    "DESCRIBE FUNCTION",
    "DESCRIBE QUERY",
    "DESCRIBE TABLE",
    "LIST FILE",
    "LIST JAR",
    "REFRESH",
    "REFRESH TABLE",
    "REFRESH FUNCTION",
    "RESET",
    "SHOW COLUMNS",
    "SHOW CREATE TABLE",
    "SHOW DATABASES",
    "SHOW FUNCTIONS",
    "SHOW PARTITIONS",
    "SHOW TABLE EXTENDED",
    "SHOW TABLES",
    "SHOW TBLPROPERTIES",
    "SHOW VIEWS",
    "UNCACHE TABLE"
  ]);
  var reservedSetOperations12 = expandPhrases([
    "UNION [ALL | DISTINCT]",
    "EXCEPT [ALL | DISTINCT]",
    "INTERSECT [ALL | DISTINCT]"
  ]);
  var reservedJoins12 = expandPhrases([
    "JOIN",
    "{LEFT | RIGHT | FULL} [OUTER] JOIN",
    "{INNER | CROSS} JOIN",
    "NATURAL [INNER] JOIN",
    "NATURAL {LEFT | RIGHT | FULL} [OUTER] JOIN",
    // non-standard-joins
    "[LEFT] {ANTI | SEMI} JOIN",
    "NATURAL [LEFT] {ANTI | SEMI} JOIN"
  ]);
  var reservedPhrases12 = expandPhrases([
    "ON DELETE",
    "ON UPDATE",
    "CURRENT ROW",
    "{ROWS | RANGE} BETWEEN"
  ]);
  var spark = {
    name: "spark",
    tokenizerOptions: {
      reservedSelect: reservedSelect12,
      reservedClauses: [...reservedClauses12, ...standardOnelineClauses11, ...tabularOnelineClauses11],
      reservedSetOperations: reservedSetOperations12,
      reservedJoins: reservedJoins12,
      reservedPhrases: reservedPhrases12,
      supportsXor: true,
      reservedKeywords: keywords12,
      reservedDataTypes: dataTypes12,
      reservedFunctionNames: functions12,
      extraParens: ["[]"],
      stringTypes: [
        "''-bs",
        '""-bs',
        { quote: "''-raw", prefixes: ["R", "X"], requirePrefix: true },
        { quote: '""-raw', prefixes: ["R", "X"], requirePrefix: true }
      ],
      identTypes: ["``"],
      variableTypes: [{ quote: "{}", prefixes: ["$"], requirePrefix: true }],
      operators: ["%", "~", "^", "|", "&", "<=>", "==", "!", "||", "->"],
      postProcess: postProcess4
    },
    formatOptions: {
      onelineClauses: [...standardOnelineClauses11, ...tabularOnelineClauses11],
      tabularOnelineClauses: tabularOnelineClauses11
    }
  };
  function postProcess4(tokens) {
    return tokens.map((token, i) => {
      const prevToken = tokens[i - 1] || EOF_TOKEN;
      const nextToken = tokens[i + 1] || EOF_TOKEN;
      if (isToken.WINDOW(token) && nextToken.type === "OPEN_PAREN") {
        return __spreadProps(__spreadValues({}, token), {
          type: "RESERVED_FUNCTION_NAME"
          /* RESERVED_FUNCTION_NAME */
        });
      }
      if (token.text === "ITEMS" && token.type === "RESERVED_KEYWORD") {
        if (!(prevToken.text === "COLLECTION" && nextToken.text === "TERMINATED")) {
          return __spreadProps(__spreadValues({}, token), { type: "IDENTIFIER", text: token.raw });
        }
      }
      return token;
    });
  }
  var functions13 = [
    // https://www.sqlite.org/lang_corefunc.html
    "ABS",
    "CHANGES",
    "CHAR",
    "COALESCE",
    "FORMAT",
    "GLOB",
    "HEX",
    "IFNULL",
    "IIF",
    "INSTR",
    "LAST_INSERT_ROWID",
    "LENGTH",
    "LIKE",
    "LIKELIHOOD",
    "LIKELY",
    "LOAD_EXTENSION",
    "LOWER",
    "LTRIM",
    "NULLIF",
    "PRINTF",
    "QUOTE",
    "RANDOM",
    "RANDOMBLOB",
    "REPLACE",
    "ROUND",
    "RTRIM",
    "SIGN",
    "SOUNDEX",
    "SQLITE_COMPILEOPTION_GET",
    "SQLITE_COMPILEOPTION_USED",
    "SQLITE_OFFSET",
    "SQLITE_SOURCE_ID",
    "SQLITE_VERSION",
    "SUBSTR",
    "SUBSTRING",
    "TOTAL_CHANGES",
    "TRIM",
    "TYPEOF",
    "UNICODE",
    "UNLIKELY",
    "UPPER",
    "ZEROBLOB",
    // https://www.sqlite.org/lang_aggfunc.html
    "AVG",
    "COUNT",
    "GROUP_CONCAT",
    "MAX",
    "MIN",
    "SUM",
    "TOTAL",
    // https://www.sqlite.org/lang_datefunc.html
    "DATE",
    "TIME",
    "DATETIME",
    "JULIANDAY",
    "UNIXEPOCH",
    "STRFTIME",
    // https://www.sqlite.org/windowfunctions.html#biwinfunc
    "row_number",
    "rank",
    "dense_rank",
    "percent_rank",
    "cume_dist",
    "ntile",
    "lag",
    "lead",
    "first_value",
    "last_value",
    "nth_value",
    // https://www.sqlite.org/lang_mathfunc.html
    "ACOS",
    "ACOSH",
    "ASIN",
    "ASINH",
    "ATAN",
    "ATAN2",
    "ATANH",
    "CEIL",
    "CEILING",
    "COS",
    "COSH",
    "DEGREES",
    "EXP",
    "FLOOR",
    "LN",
    "LOG",
    "LOG",
    "LOG10",
    "LOG2",
    "MOD",
    "PI",
    "POW",
    "POWER",
    "RADIANS",
    "SIN",
    "SINH",
    "SQRT",
    "TAN",
    "TANH",
    "TRUNC",
    // https://www.sqlite.org/json1.html
    "JSON",
    "JSON_ARRAY",
    "JSON_ARRAY_LENGTH",
    "JSON_ARRAY_LENGTH",
    "JSON_EXTRACT",
    "JSON_INSERT",
    "JSON_OBJECT",
    "JSON_PATCH",
    "JSON_REMOVE",
    "JSON_REPLACE",
    "JSON_SET",
    "JSON_TYPE",
    "JSON_TYPE",
    "JSON_VALID",
    "JSON_QUOTE",
    "JSON_GROUP_ARRAY",
    "JSON_GROUP_OBJECT",
    "JSON_EACH",
    "JSON_TREE",
    // cast
    "CAST"
  ];
  var keywords13 = [
    // https://www.sqlite.org/lang_keywords.html
    "ABORT",
    "ACTION",
    "ADD",
    "AFTER",
    "ALL",
    "ALTER",
    "AND",
    "ARE",
    "ALWAYS",
    "ANALYZE",
    "AS",
    "ASC",
    "ATTACH",
    "AUTOINCREMENT",
    "BEFORE",
    "BEGIN",
    "BETWEEN",
    "BY",
    "CASCADE",
    "CASE",
    "CAST",
    "CHECK",
    "COLLATE",
    "COLUMN",
    "COMMIT",
    "CONFLICT",
    "CONSTRAINT",
    "CREATE",
    "CROSS",
    "CURRENT",
    "CURRENT_DATE",
    "CURRENT_TIME",
    "CURRENT_TIMESTAMP",
    "DATABASE",
    "DEFAULT",
    "DEFERRABLE",
    "DEFERRED",
    "DELETE",
    "DESC",
    "DETACH",
    "DISTINCT",
    "DO",
    "DROP",
    "EACH",
    "ELSE",
    "END",
    "ESCAPE",
    "EXCEPT",
    "EXCLUDE",
    "EXCLUSIVE",
    "EXISTS",
    "EXPLAIN",
    "FAIL",
    "FILTER",
    "FIRST",
    "FOLLOWING",
    "FOR",
    "FOREIGN",
    "FROM",
    "FULL",
    "GENERATED",
    "GLOB",
    "GROUP",
    "GROUPS",
    "HAVING",
    "IF",
    "IGNORE",
    "IMMEDIATE",
    "IN",
    "INDEX",
    "INDEXED",
    "INITIALLY",
    "INNER",
    "INSERT",
    "INSTEAD",
    "INTERSECT",
    "INTO",
    "IS",
    "ISNULL",
    "JOIN",
    "KEY",
    "LAST",
    "LEFT",
    "LIKE",
    "LIMIT",
    "MATCH",
    "MATERIALIZED",
    "NATURAL",
    "NO",
    "NOT",
    "NOTHING",
    "NOTNULL",
    "NULL",
    "NULLS",
    "OF",
    "OFFSET",
    "ON",
    "ONLY",
    "OPEN",
    "OR",
    "ORDER",
    "OTHERS",
    "OUTER",
    "OVER",
    "PARTITION",
    "PLAN",
    "PRAGMA",
    "PRECEDING",
    "PRIMARY",
    "QUERY",
    "RAISE",
    "RANGE",
    "RECURSIVE",
    "REFERENCES",
    "REGEXP",
    "REINDEX",
    "RELEASE",
    "RENAME",
    "REPLACE",
    "RESTRICT",
    "RETURNING",
    "RIGHT",
    "ROLLBACK",
    "ROW",
    "ROWS",
    "SAVEPOINT",
    "SELECT",
    "SET",
    "TABLE",
    "TEMP",
    "TEMPORARY",
    "THEN",
    "TIES",
    "TO",
    "TRANSACTION",
    "TRIGGER",
    "UNBOUNDED",
    "UNION",
    "UNIQUE",
    "UPDATE",
    "USING",
    "VACUUM",
    "VALUES",
    "VIEW",
    "VIRTUAL",
    "WHEN",
    "WHERE",
    "WINDOW",
    "WITH",
    "WITHOUT"
  ];
  var dataTypes13 = [
    // SQLite allows any word as a data type, e.g. CREATE TABLE foo (col1 madeupname(123));
    // Here we just list some common ones as SQL Formatter
    // is only able to detect a predefined list of data types.
    // https://www.sqlite.org/stricttables.html
    // https://www.sqlite.org/datatype3.html
    "ANY",
    "ARRAY",
    "BLOB",
    "CHARACTER",
    "DECIMAL",
    "INT",
    "INTEGER",
    "NATIVE CHARACTER",
    "NCHAR",
    "NUMERIC",
    "NVARCHAR",
    "REAL",
    "TEXT",
    "VARCHAR",
    "VARYING CHARACTER"
  ];
  var reservedSelect13 = expandPhrases(["SELECT [ALL | DISTINCT]"]);
  var reservedClauses13 = expandPhrases([
    // queries
    "WITH [RECURSIVE]",
    "FROM",
    "WHERE",
    "GROUP BY",
    "HAVING",
    "WINDOW",
    "PARTITION BY",
    "ORDER BY",
    "LIMIT",
    "OFFSET",
    // Data manipulation
    // - insert:
    "INSERT [OR ABORT | OR FAIL | OR IGNORE | OR REPLACE | OR ROLLBACK] INTO",
    "REPLACE INTO",
    "VALUES",
    // - update:
    "SET"
  ]);
  var standardOnelineClauses12 = expandPhrases(["CREATE [TEMPORARY | TEMP] TABLE [IF NOT EXISTS]"]);
  var tabularOnelineClauses12 = expandPhrases([
    // - create:
    "CREATE [TEMPORARY | TEMP] VIEW [IF NOT EXISTS]",
    // - update:
    "UPDATE [OR ABORT | OR FAIL | OR IGNORE | OR REPLACE | OR ROLLBACK]",
    // - insert:
    "ON CONFLICT",
    // - delete:
    "DELETE FROM",
    // - drop table:
    "DROP TABLE [IF EXISTS]",
    // - alter table:
    "ALTER TABLE",
    "ADD [COLUMN]",
    "DROP [COLUMN]",
    "RENAME [COLUMN]",
    "RENAME TO",
    // - set schema
    "SET SCHEMA"
  ]);
  var reservedSetOperations13 = expandPhrases(["UNION [ALL]", "EXCEPT", "INTERSECT"]);
  var reservedJoins13 = expandPhrases([
    "JOIN",
    "{LEFT | RIGHT | FULL} [OUTER] JOIN",
    "{INNER | CROSS} JOIN",
    "NATURAL [INNER] JOIN",
    "NATURAL {LEFT | RIGHT | FULL} [OUTER] JOIN"
  ]);
  var reservedPhrases13 = expandPhrases([
    "ON {UPDATE | DELETE} [SET NULL | SET DEFAULT]",
    "{ROWS | RANGE | GROUPS} BETWEEN"
  ]);
  var sqlite = {
    name: "sqlite",
    tokenizerOptions: {
      reservedSelect: reservedSelect13,
      reservedClauses: [...reservedClauses13, ...standardOnelineClauses12, ...tabularOnelineClauses12],
      reservedSetOperations: reservedSetOperations13,
      reservedJoins: reservedJoins13,
      reservedPhrases: reservedPhrases13,
      reservedKeywords: keywords13,
      reservedDataTypes: dataTypes13,
      reservedFunctionNames: functions13,
      stringTypes: [
        "''-qq",
        { quote: "''-raw", prefixes: ["X"], requirePrefix: true }
        // Depending on context SQLite also supports double-quotes for strings,
        // and single-quotes for identifiers.
      ],
      identTypes: [`""-qq`, "``", "[]"],
      // https://www.sqlite.org/lang_expr.html#parameters
      paramTypes: { positional: true, numbered: ["?"], named: [":", "@", "$"] },
      operators: ["%", "~", "&", "|", "<<", ">>", "==", "->", "->>", "||"]
    },
    formatOptions: {
      onelineClauses: [...standardOnelineClauses12, ...tabularOnelineClauses12],
      tabularOnelineClauses: tabularOnelineClauses12
    }
  };
  var functions14 = [
    // https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_6_9_set_function_specification
    "GROUPING",
    // https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_6_10_window_function
    "RANK",
    "DENSE_RANK",
    "PERCENT_RANK",
    "CUME_DIST",
    "ROW_NUMBER",
    // https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_6_27_numeric_value_function
    "POSITION",
    "OCCURRENCES_REGEX",
    "POSITION_REGEX",
    "EXTRACT",
    "CHAR_LENGTH",
    "CHARACTER_LENGTH",
    "OCTET_LENGTH",
    "CARDINALITY",
    "ABS",
    "MOD",
    "LN",
    "EXP",
    "POWER",
    "SQRT",
    "FLOOR",
    "CEIL",
    "CEILING",
    "WIDTH_BUCKET",
    // https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_6_29_string_value_function
    "SUBSTRING",
    "SUBSTRING_REGEX",
    "UPPER",
    "LOWER",
    "CONVERT",
    "TRANSLATE",
    "TRANSLATE_REGEX",
    "TRIM",
    "OVERLAY",
    "NORMALIZE",
    "SPECIFICTYPE",
    // https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_6_31_datetime_value_function
    "CURRENT_DATE",
    "CURRENT_TIME",
    "LOCALTIME",
    "CURRENT_TIMESTAMP",
    "LOCALTIMESTAMP",
    // https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_6_38_multiset_value_function
    // SET serves multiple roles: a SET() function and a SET keyword e.g. in UPDATE table SET ...
    // multiset
    // 'SET', (disabled for now)
    // https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_10_9_aggregate_function
    "COUNT",
    "AVG",
    "MAX",
    "MIN",
    "SUM",
    // 'EVERY',
    // 'ANY',
    // 'SOME',
    "STDDEV_POP",
    "STDDEV_SAMP",
    "VAR_SAMP",
    "VAR_POP",
    "COLLECT",
    "FUSION",
    "INTERSECTION",
    "COVAR_POP",
    "COVAR_SAMP",
    "CORR",
    "REGR_SLOPE",
    "REGR_INTERCEPT",
    "REGR_COUNT",
    "REGR_R2",
    "REGR_AVGX",
    "REGR_AVGY",
    "REGR_SXX",
    "REGR_SYY",
    "REGR_SXY",
    "PERCENTILE_CONT",
    "PERCENTILE_DISC",
    // CAST is a pretty complex case, involving multiple forms:
    // - CAST(col AS int)
    // - CAST(...) WITH ...
    // - CAST FROM int
    // - CREATE CAST(mycol AS int) WITH ...
    "CAST",
    // Shorthand functions to use in place of CASE expression
    "COALESCE",
    "NULLIF",
    // Non-standard functions that have widespread support
    "ROUND",
    "SIN",
    "COS",
    "TAN",
    "ASIN",
    "ACOS",
    "ATAN"
  ];
  var keywords14 = [
    // https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#reserved-word
    "ALL",
    "ALLOCATE",
    "ALTER",
    "ANY",
    // <- moved over from functions
    "ARE",
    "AS",
    "ASC",
    // Not reserved in SQL-2008, but commonly reserved in most dialects
    "ASENSITIVE",
    "ASYMMETRIC",
    "AT",
    "ATOMIC",
    "AUTHORIZATION",
    "BEGIN",
    "BETWEEN",
    "BOTH",
    "BY",
    "CALL",
    "CALLED",
    "CASCADED",
    "CAST",
    "CHECK",
    "CLOSE",
    "COALESCE",
    "COLLATE",
    "COLUMN",
    "COMMIT",
    "CONDITION",
    "CONNECT",
    "CONSTRAINT",
    "CORRESPONDING",
    "CREATE",
    "CROSS",
    "CUBE",
    "CURRENT",
    "CURRENT_CATALOG",
    "CURRENT_DEFAULT_TRANSFORM_GROUP",
    "CURRENT_PATH",
    "CURRENT_ROLE",
    "CURRENT_SCHEMA",
    "CURRENT_TRANSFORM_GROUP_FOR_TYPE",
    "CURRENT_USER",
    "CURSOR",
    "CYCLE",
    "DEALLOCATE",
    "DAY",
    "DECLARE",
    "DEFAULT",
    "DELETE",
    "DEREF",
    "DESC",
    // Not reserved in SQL-2008, but commonly reserved in most dialects
    "DESCRIBE",
    "DETERMINISTIC",
    "DISCONNECT",
    "DISTINCT",
    "DROP",
    "DYNAMIC",
    "EACH",
    "ELEMENT",
    "END-EXEC",
    "ESCAPE",
    "EVERY",
    // <- moved over from functions
    "EXCEPT",
    "EXEC",
    "EXECUTE",
    "EXISTS",
    "EXTERNAL",
    "FALSE",
    "FETCH",
    "FILTER",
    "FOR",
    "FOREIGN",
    "FREE",
    "FROM",
    "FULL",
    "FUNCTION",
    "GET",
    "GLOBAL",
    "GRANT",
    "GROUP",
    "HAVING",
    "HOLD",
    "HOUR",
    "IDENTITY",
    "IN",
    "INDICATOR",
    "INNER",
    "INOUT",
    "INSENSITIVE",
    "INSERT",
    "INTERSECT",
    "INTO",
    "IS",
    "LANGUAGE",
    "LARGE",
    "LATERAL",
    "LEADING",
    "LEFT",
    "LIKE",
    "LIKE_REGEX",
    "LOCAL",
    "MATCH",
    "MEMBER",
    "MERGE",
    "METHOD",
    "MINUTE",
    "MODIFIES",
    "MODULE",
    "MONTH",
    "NATURAL",
    "NEW",
    "NO",
    "NONE",
    "NOT",
    "NULL",
    "NULLIF",
    "OF",
    "OLD",
    "ON",
    "ONLY",
    "OPEN",
    "ORDER",
    "OUT",
    "OUTER",
    "OVER",
    "OVERLAPS",
    "PARAMETER",
    "PARTITION",
    "PRECISION",
    "PREPARE",
    "PRIMARY",
    "PROCEDURE",
    "RANGE",
    "READS",
    "REAL",
    "RECURSIVE",
    "REF",
    "REFERENCES",
    "REFERENCING",
    "RELEASE",
    "RESULT",
    "RETURN",
    "RETURNS",
    "REVOKE",
    "RIGHT",
    "ROLLBACK",
    "ROLLUP",
    "ROW",
    "ROWS",
    "SAVEPOINT",
    "SCOPE",
    "SCROLL",
    "SEARCH",
    "SECOND",
    "SELECT",
    "SENSITIVE",
    "SESSION_USER",
    "SET",
    "SIMILAR",
    "SOME",
    // <- moved over from functions
    "SPECIFIC",
    "SQL",
    "SQLEXCEPTION",
    "SQLSTATE",
    "SQLWARNING",
    "START",
    "STATIC",
    "SUBMULTISET",
    "SYMMETRIC",
    "SYSTEM",
    "SYSTEM_USER",
    "TABLE",
    "TABLESAMPLE",
    "THEN",
    "TIMEZONE_HOUR",
    "TIMEZONE_MINUTE",
    "TO",
    "TRAILING",
    "TRANSLATION",
    "TREAT",
    "TRIGGER",
    "TRUE",
    "UESCAPE",
    "UNION",
    "UNIQUE",
    "UNKNOWN",
    "UNNEST",
    "UPDATE",
    "USER",
    "USING",
    "VALUE",
    "VALUES",
    "WHENEVER",
    "WINDOW",
    "WITHIN",
    "WITHOUT",
    "YEAR"
  ];
  var dataTypes14 = [
    // https://jakewheat.github.io/sql-overview/sql-2008-foundation-grammar.html#_6_1_data_type
    "ARRAY",
    "BIGINT",
    "BINARY LARGE OBJECT",
    "BINARY VARYING",
    "BINARY",
    "BLOB",
    "BOOLEAN",
    "CHAR LARGE OBJECT",
    "CHAR VARYING",
    "CHAR",
    "CHARACTER LARGE OBJECT",
    "CHARACTER VARYING",
    "CHARACTER",
    "CLOB",
    "DATE",
    "DEC",
    "DECIMAL",
    "DOUBLE",
    "FLOAT",
    "INT",
    "INTEGER",
    "INTERVAL",
    "MULTISET",
    "NATIONAL CHAR VARYING",
    "NATIONAL CHAR",
    "NATIONAL CHARACTER LARGE OBJECT",
    "NATIONAL CHARACTER VARYING",
    "NATIONAL CHARACTER",
    "NCHAR LARGE OBJECT",
    "NCHAR VARYING",
    "NCHAR",
    "NCLOB",
    "NUMERIC",
    "SMALLINT",
    "TIME",
    "TIMESTAMP",
    "VARBINARY",
    "VARCHAR"
  ];
  var reservedSelect14 = expandPhrases(["SELECT [ALL | DISTINCT]"]);
  var reservedClauses14 = expandPhrases([
    // queries
    "WITH [RECURSIVE]",
    "FROM",
    "WHERE",
    "GROUP BY [ALL | DISTINCT]",
    "HAVING",
    "WINDOW",
    "PARTITION BY",
    "ORDER BY",
    "LIMIT",
    "OFFSET",
    "FETCH {FIRST | NEXT}",
    // Data manipulation
    // - insert:
    "INSERT INTO",
    "VALUES",
    // - update:
    "SET"
  ]);
  var standardOnelineClauses13 = expandPhrases(["CREATE [GLOBAL TEMPORARY | LOCAL TEMPORARY] TABLE"]);
  var tabularOnelineClauses13 = expandPhrases([
    // - create:
    "CREATE [RECURSIVE] VIEW",
    // - update:
    "UPDATE",
    "WHERE CURRENT OF",
    // - delete:
    "DELETE FROM",
    // - drop table:
    "DROP TABLE",
    // - alter table:
    "ALTER TABLE",
    "ADD COLUMN",
    "DROP [COLUMN]",
    "RENAME COLUMN",
    "RENAME TO",
    "ALTER [COLUMN]",
    "{SET | DROP} DEFAULT",
    // for alter column
    "ADD SCOPE",
    // for alter column
    "DROP SCOPE {CASCADE | RESTRICT}",
    // for alter column
    "RESTART WITH",
    // for alter column
    // - truncate:
    "TRUNCATE TABLE",
    // other
    "SET SCHEMA"
  ]);
  var reservedSetOperations14 = expandPhrases([
    "UNION [ALL | DISTINCT]",
    "EXCEPT [ALL | DISTINCT]",
    "INTERSECT [ALL | DISTINCT]"
  ]);
  var reservedJoins14 = expandPhrases([
    "JOIN",
    "{LEFT | RIGHT | FULL} [OUTER] JOIN",
    "{INNER | CROSS} JOIN",
    "NATURAL [INNER] JOIN",
    "NATURAL {LEFT | RIGHT | FULL} [OUTER] JOIN"
  ]);
  var reservedPhrases14 = expandPhrases([
    "ON {UPDATE | DELETE} [SET NULL | SET DEFAULT]",
    "{ROWS | RANGE} BETWEEN"
  ]);
  var sql2 = {
    name: "sql",
    tokenizerOptions: {
      reservedSelect: reservedSelect14,
      reservedClauses: [...reservedClauses14, ...standardOnelineClauses13, ...tabularOnelineClauses13],
      reservedSetOperations: reservedSetOperations14,
      reservedJoins: reservedJoins14,
      reservedPhrases: reservedPhrases14,
      reservedKeywords: keywords14,
      reservedDataTypes: dataTypes14,
      reservedFunctionNames: functions14,
      stringTypes: [
        { quote: "''-qq-bs", prefixes: ["N", "U&"] },
        { quote: "''-raw", prefixes: ["X"], requirePrefix: true }
      ],
      identTypes: [`""-qq`, "``"],
      paramTypes: { positional: true },
      operators: ["||"]
    },
    formatOptions: {
      onelineClauses: [...standardOnelineClauses13, ...tabularOnelineClauses13],
      tabularOnelineClauses: tabularOnelineClauses13
    }
  };
  var functions15 = [
    // https://github.com/trinodb/trino/tree/432d2897bdef99388c1a47188743a061c4ac1f34/docs/src/main/sphinx/functions
    // rg '^\.\. function::' ./docs/src/main/sphinx/functions | cut -d' ' -f 3 | cut -d '(' -f 1 | sort | uniq
    // rg '\* ' ./docs/src/main/sphinx/functions/list-by-topic.rst | grep    '\* :func:' | cut -d'`' -f 2
    // rg '\* ' ./docs/src/main/sphinx/functions/list-by-topic.rst | grep -v '\* :func:'
    // grep -e '^- ' ./docs/src/main/sphinx/functions/list.rst | grep  -e '^- :func:' | cut -d'`' -f2
    // grep -e '^- ' ./docs/src/main/sphinx/functions/list.rst | grep -ve '^- :func:'
    "ABS",
    "ACOS",
    "ALL_MATCH",
    "ANY_MATCH",
    "APPROX_DISTINCT",
    "APPROX_MOST_FREQUENT",
    "APPROX_PERCENTILE",
    "APPROX_SET",
    "ARBITRARY",
    "ARRAYS_OVERLAP",
    "ARRAY_AGG",
    "ARRAY_DISTINCT",
    "ARRAY_EXCEPT",
    "ARRAY_INTERSECT",
    "ARRAY_JOIN",
    "ARRAY_MAX",
    "ARRAY_MIN",
    "ARRAY_POSITION",
    "ARRAY_REMOVE",
    "ARRAY_SORT",
    "ARRAY_UNION",
    "ASIN",
    "ATAN",
    "ATAN2",
    "AT_TIMEZONE",
    "AVG",
    "BAR",
    "BETA_CDF",
    "BING_TILE",
    "BING_TILES_AROUND",
    "BING_TILE_AT",
    "BING_TILE_COORDINATES",
    "BING_TILE_POLYGON",
    "BING_TILE_QUADKEY",
    "BING_TILE_ZOOM_LEVEL",
    "BITWISE_AND",
    "BITWISE_AND_AGG",
    "BITWISE_LEFT_SHIFT",
    "BITWISE_NOT",
    "BITWISE_OR",
    "BITWISE_OR_AGG",
    "BITWISE_RIGHT_SHIFT",
    "BITWISE_RIGHT_SHIFT_ARITHMETIC",
    "BITWISE_XOR",
    "BIT_COUNT",
    "BOOL_AND",
    "BOOL_OR",
    "CARDINALITY",
    "CAST",
    "CBRT",
    "CEIL",
    "CEILING",
    "CHAR2HEXINT",
    "CHECKSUM",
    "CHR",
    "CLASSIFY",
    "COALESCE",
    "CODEPOINT",
    "COLOR",
    "COMBINATIONS",
    "CONCAT",
    "CONCAT_WS",
    "CONTAINS",
    "CONTAINS_SEQUENCE",
    "CONVEX_HULL_AGG",
    "CORR",
    "COS",
    "COSH",
    "COSINE_SIMILARITY",
    "COUNT",
    "COUNT_IF",
    "COVAR_POP",
    "COVAR_SAMP",
    "CRC32",
    "CUME_DIST",
    "CURRENT_CATALOG",
    "CURRENT_DATE",
    "CURRENT_GROUPS",
    "CURRENT_SCHEMA",
    "CURRENT_TIME",
    "CURRENT_TIMESTAMP",
    "CURRENT_TIMEZONE",
    "CURRENT_USER",
    "DATE",
    "DATE_ADD",
    "DATE_DIFF",
    "DATE_FORMAT",
    "DATE_PARSE",
    "DATE_TRUNC",
    "DAY",
    "DAY_OF_MONTH",
    "DAY_OF_WEEK",
    "DAY_OF_YEAR",
    "DEGREES",
    "DENSE_RANK",
    "DOW",
    "DOY",
    "E",
    "ELEMENT_AT",
    "EMPTY_APPROX_SET",
    "EVALUATE_CLASSIFIER_PREDICTIONS",
    "EVERY",
    "EXP",
    "EXTRACT",
    "FEATURES",
    "FILTER",
    "FIRST_VALUE",
    "FLATTEN",
    "FLOOR",
    "FORMAT",
    "FORMAT_DATETIME",
    "FORMAT_NUMBER",
    "FROM_BASE",
    "FROM_BASE32",
    "FROM_BASE64",
    "FROM_BASE64URL",
    "FROM_BIG_ENDIAN_32",
    "FROM_BIG_ENDIAN_64",
    "FROM_ENCODED_POLYLINE",
    "FROM_GEOJSON_GEOMETRY",
    "FROM_HEX",
    "FROM_IEEE754_32",
    "FROM_IEEE754_64",
    "FROM_ISO8601_DATE",
    "FROM_ISO8601_TIMESTAMP",
    "FROM_ISO8601_TIMESTAMP_NANOS",
    "FROM_UNIXTIME",
    "FROM_UNIXTIME_NANOS",
    "FROM_UTF8",
    "GEOMETRIC_MEAN",
    "GEOMETRY_FROM_HADOOP_SHAPE",
    "GEOMETRY_INVALID_REASON",
    "GEOMETRY_NEAREST_POINTS",
    "GEOMETRY_TO_BING_TILES",
    "GEOMETRY_UNION",
    "GEOMETRY_UNION_AGG",
    "GREATEST",
    "GREAT_CIRCLE_DISTANCE",
    "HAMMING_DISTANCE",
    "HASH_COUNTS",
    "HISTOGRAM",
    "HMAC_MD5",
    "HMAC_SHA1",
    "HMAC_SHA256",
    "HMAC_SHA512",
    "HOUR",
    "HUMAN_READABLE_SECONDS",
    "IF",
    "INDEX",
    "INFINITY",
    "INTERSECTION_CARDINALITY",
    "INVERSE_BETA_CDF",
    "INVERSE_NORMAL_CDF",
    "IS_FINITE",
    "IS_INFINITE",
    "IS_JSON_SCALAR",
    "IS_NAN",
    "JACCARD_INDEX",
    "JSON_ARRAY_CONTAINS",
    "JSON_ARRAY_GET",
    "JSON_ARRAY_LENGTH",
    "JSON_EXISTS",
    "JSON_EXTRACT",
    "JSON_EXTRACT_SCALAR",
    "JSON_FORMAT",
    "JSON_PARSE",
    "JSON_QUERY",
    "JSON_SIZE",
    "JSON_VALUE",
    "KURTOSIS",
    "LAG",
    "LAST_DAY_OF_MONTH",
    "LAST_VALUE",
    "LEAD",
    "LEARN_CLASSIFIER",
    "LEARN_LIBSVM_CLASSIFIER",
    "LEARN_LIBSVM_REGRESSOR",
    "LEARN_REGRESSOR",
    "LEAST",
    "LENGTH",
    "LEVENSHTEIN_DISTANCE",
    "LINE_INTERPOLATE_POINT",
    "LINE_INTERPOLATE_POINTS",
    "LINE_LOCATE_POINT",
    "LISTAGG",
    "LN",
    "LOCALTIME",
    "LOCALTIMESTAMP",
    "LOG",
    "LOG10",
    "LOG2",
    "LOWER",
    "LPAD",
    "LTRIM",
    "LUHN_CHECK",
    "MAKE_SET_DIGEST",
    "MAP",
    "MAP_AGG",
    "MAP_CONCAT",
    "MAP_ENTRIES",
    "MAP_FILTER",
    "MAP_FROM_ENTRIES",
    "MAP_KEYS",
    "MAP_UNION",
    "MAP_VALUES",
    "MAP_ZIP_WITH",
    "MAX",
    "MAX_BY",
    "MD5",
    "MERGE",
    "MERGE_SET_DIGEST",
    "MILLISECOND",
    "MIN",
    "MINUTE",
    "MIN_BY",
    "MOD",
    "MONTH",
    "MULTIMAP_AGG",
    "MULTIMAP_FROM_ENTRIES",
    "MURMUR3",
    "NAN",
    "NGRAMS",
    "NONE_MATCH",
    "NORMALIZE",
    "NORMAL_CDF",
    "NOW",
    "NTH_VALUE",
    "NTILE",
    "NULLIF",
    "NUMERIC_HISTOGRAM",
    "OBJECTID",
    "OBJECTID_TIMESTAMP",
    "PARSE_DATA_SIZE",
    "PARSE_DATETIME",
    "PARSE_DURATION",
    "PERCENT_RANK",
    "PI",
    "POSITION",
    "POW",
    "POWER",
    "QDIGEST_AGG",
    "QUARTER",
    "RADIANS",
    "RAND",
    "RANDOM",
    "RANK",
    "REDUCE",
    "REDUCE_AGG",
    "REGEXP_COUNT",
    "REGEXP_EXTRACT",
    "REGEXP_EXTRACT_ALL",
    "REGEXP_LIKE",
    "REGEXP_POSITION",
    "REGEXP_REPLACE",
    "REGEXP_SPLIT",
    "REGRESS",
    "REGR_INTERCEPT",
    "REGR_SLOPE",
    "RENDER",
    "REPEAT",
    "REPLACE",
    "REVERSE",
    "RGB",
    "ROUND",
    "ROW_NUMBER",
    "RPAD",
    "RTRIM",
    "SECOND",
    "SEQUENCE",
    "SHA1",
    "SHA256",
    "SHA512",
    "SHUFFLE",
    "SIGN",
    "SIMPLIFY_GEOMETRY",
    "SIN",
    "SKEWNESS",
    "SLICE",
    "SOUNDEX",
    "SPATIAL_PARTITIONING",
    "SPATIAL_PARTITIONS",
    "SPLIT",
    "SPLIT_PART",
    "SPLIT_TO_MAP",
    "SPLIT_TO_MULTIMAP",
    "SPOOKY_HASH_V2_32",
    "SPOOKY_HASH_V2_64",
    "SQRT",
    "STARTS_WITH",
    "STDDEV",
    "STDDEV_POP",
    "STDDEV_SAMP",
    "STRPOS",
    "ST_AREA",
    "ST_ASBINARY",
    "ST_ASTEXT",
    "ST_BOUNDARY",
    "ST_BUFFER",
    "ST_CENTROID",
    "ST_CONTAINS",
    "ST_CONVEXHULL",
    "ST_COORDDIM",
    "ST_CROSSES",
    "ST_DIFFERENCE",
    "ST_DIMENSION",
    "ST_DISJOINT",
    "ST_DISTANCE",
    "ST_ENDPOINT",
    "ST_ENVELOPE",
    "ST_ENVELOPEASPTS",
    "ST_EQUALS",
    "ST_EXTERIORRING",
    "ST_GEOMETRIES",
    "ST_GEOMETRYFROMTEXT",
    "ST_GEOMETRYN",
    "ST_GEOMETRYTYPE",
    "ST_GEOMFROMBINARY",
    "ST_INTERIORRINGN",
    "ST_INTERIORRINGS",
    "ST_INTERSECTION",
    "ST_INTERSECTS",
    "ST_ISCLOSED",
    "ST_ISEMPTY",
    "ST_ISRING",
    "ST_ISSIMPLE",
    "ST_ISVALID",
    "ST_LENGTH",
    "ST_LINEFROMTEXT",
    "ST_LINESTRING",
    "ST_MULTIPOINT",
    "ST_NUMGEOMETRIES",
    "ST_NUMINTERIORRING",
    "ST_NUMPOINTS",
    "ST_OVERLAPS",
    "ST_POINT",
    "ST_POINTN",
    "ST_POINTS",
    "ST_POLYGON",
    "ST_RELATE",
    "ST_STARTPOINT",
    "ST_SYMDIFFERENCE",
    "ST_TOUCHES",
    "ST_UNION",
    "ST_WITHIN",
    "ST_X",
    "ST_XMAX",
    "ST_XMIN",
    "ST_Y",
    "ST_YMAX",
    "ST_YMIN",
    "SUBSTR",
    "SUBSTRING",
    "SUM",
    "TAN",
    "TANH",
    "TDIGEST_AGG",
    "TIMESTAMP_OBJECTID",
    "TIMEZONE_HOUR",
    "TIMEZONE_MINUTE",
    "TO_BASE",
    "TO_BASE32",
    "TO_BASE64",
    "TO_BASE64URL",
    "TO_BIG_ENDIAN_32",
    "TO_BIG_ENDIAN_64",
    "TO_CHAR",
    "TO_DATE",
    "TO_ENCODED_POLYLINE",
    "TO_GEOJSON_GEOMETRY",
    "TO_GEOMETRY",
    "TO_HEX",
    "TO_IEEE754_32",
    "TO_IEEE754_64",
    "TO_ISO8601",
    "TO_MILLISECONDS",
    "TO_SPHERICAL_GEOGRAPHY",
    "TO_TIMESTAMP",
    "TO_UNIXTIME",
    "TO_UTF8",
    "TRANSFORM",
    "TRANSFORM_KEYS",
    "TRANSFORM_VALUES",
    "TRANSLATE",
    "TRIM",
    "TRIM_ARRAY",
    "TRUNCATE",
    "TRY",
    "TRY_CAST",
    "TYPEOF",
    "UPPER",
    "URL_DECODE",
    "URL_ENCODE",
    "URL_EXTRACT_FRAGMENT",
    "URL_EXTRACT_HOST",
    "URL_EXTRACT_PARAMETER",
    "URL_EXTRACT_PATH",
    "URL_EXTRACT_PORT",
    "URL_EXTRACT_PROTOCOL",
    "URL_EXTRACT_QUERY",
    "UUID",
    "VALUES_AT_QUANTILES",
    "VALUE_AT_QUANTILE",
    "VARIANCE",
    "VAR_POP",
    "VAR_SAMP",
    "VERSION",
    "WEEK",
    "WEEK_OF_YEAR",
    "WIDTH_BUCKET",
    "WILSON_INTERVAL_LOWER",
    "WILSON_INTERVAL_UPPER",
    "WITH_TIMEZONE",
    "WORD_STEM",
    "XXHASH64",
    "YEAR",
    "YEAR_OF_WEEK",
    "YOW",
    "ZIP",
    "ZIP_WITH",
    // https://trino.io/docs/current/sql/match-recognize.html#row-pattern-recognition-expressions
    "CLASSIFIER",
    "FIRST",
    "LAST",
    "MATCH_NUMBER",
    "NEXT",
    "PERMUTE",
    "PREV"
  ];
  var keywords15 = [
    // https://github.com/trinodb/trino/blob/432d2897bdef99388c1a47188743a061c4ac1f34/core/trino-parser/src/main/antlr4/io/trino/sql/parser/SqlBase.g4#L858-L1128
    "ABSENT",
    "ADD",
    "ADMIN",
    "AFTER",
    "ALL",
    "ALTER",
    "ANALYZE",
    "AND",
    "ANY",
    "AS",
    "ASC",
    "AT",
    "AUTHORIZATION",
    "BERNOULLI",
    "BETWEEN",
    "BOTH",
    "BY",
    "CALL",
    "CASCADE",
    "CASE",
    "CATALOGS",
    "COLUMN",
    "COLUMNS",
    "COMMENT",
    "COMMIT",
    "COMMITTED",
    "CONDITIONAL",
    "CONSTRAINT",
    "COPARTITION",
    "CREATE",
    "CROSS",
    "CUBE",
    "CURRENT",
    "CURRENT_PATH",
    "CURRENT_ROLE",
    "DATA",
    "DEALLOCATE",
    "DEFAULT",
    "DEFINE",
    "DEFINER",
    "DELETE",
    "DENY",
    "DESC",
    "DESCRIBE",
    "DESCRIPTOR",
    "DISTINCT",
    "DISTRIBUTED",
    "DOUBLE",
    "DROP",
    "ELSE",
    "EMPTY",
    "ENCODING",
    "END",
    "ERROR",
    "ESCAPE",
    "EXCEPT",
    "EXCLUDING",
    "EXECUTE",
    "EXISTS",
    "EXPLAIN",
    "FALSE",
    "FETCH",
    "FINAL",
    "FIRST",
    "FOLLOWING",
    "FOR",
    "FROM",
    "FULL",
    "FUNCTIONS",
    "GRANT",
    "GRANTED",
    "GRANTS",
    "GRAPHVIZ",
    "GROUP",
    "GROUPING",
    "GROUPS",
    "HAVING",
    "IGNORE",
    "IN",
    "INCLUDING",
    "INITIAL",
    "INNER",
    "INPUT",
    "INSERT",
    "INTERSECT",
    "INTERVAL",
    "INTO",
    "INVOKER",
    "IO",
    "IS",
    "ISOLATION",
    "JOIN",
    "JSON",
    "JSON_ARRAY",
    "JSON_OBJECT",
    "KEEP",
    "KEY",
    "KEYS",
    "LAST",
    "LATERAL",
    "LEADING",
    "LEFT",
    "LEVEL",
    "LIKE",
    "LIMIT",
    "LOCAL",
    "LOGICAL",
    "MATCH",
    "MATCHED",
    "MATCHES",
    "MATCH_RECOGNIZE",
    "MATERIALIZED",
    "MEASURES",
    "NATURAL",
    "NEXT",
    "NFC",
    "NFD",
    "NFKC",
    "NFKD",
    "NO",
    "NONE",
    "NOT",
    "NULL",
    "NULLS",
    "OBJECT",
    "OF",
    "OFFSET",
    "OMIT",
    "ON",
    "ONE",
    "ONLY",
    "OPTION",
    "OR",
    "ORDER",
    "ORDINALITY",
    "OUTER",
    "OUTPUT",
    "OVER",
    "OVERFLOW",
    "PARTITION",
    "PARTITIONS",
    "PASSING",
    "PAST",
    "PATH",
    "PATTERN",
    "PER",
    "PERMUTE",
    "PRECEDING",
    "PRECISION",
    "PREPARE",
    "PRIVILEGES",
    "PROPERTIES",
    "PRUNE",
    "QUOTES",
    "RANGE",
    "READ",
    "RECURSIVE",
    "REFRESH",
    "RENAME",
    "REPEATABLE",
    "RESET",
    "RESPECT",
    "RESTRICT",
    "RETURNING",
    "REVOKE",
    "RIGHT",
    "ROLE",
    "ROLES",
    "ROLLBACK",
    "ROLLUP",
    "ROW",
    "ROWS",
    "RUNNING",
    "SCALAR",
    "SCHEMA",
    "SCHEMAS",
    "SECURITY",
    "SEEK",
    "SELECT",
    "SERIALIZABLE",
    "SESSION",
    "SET",
    "SETS",
    "SHOW",
    "SKIP",
    "SOME",
    "START",
    "STATS",
    "STRING",
    "SUBSET",
    "SYSTEM",
    "TABLE",
    "TABLES",
    "TABLESAMPLE",
    "TEXT",
    "THEN",
    "TIES",
    "TIME",
    "TIMESTAMP",
    "TO",
    "TRAILING",
    "TRANSACTION",
    "TRUE",
    "TYPE",
    "UESCAPE",
    "UNBOUNDED",
    "UNCOMMITTED",
    "UNCONDITIONAL",
    "UNION",
    "UNIQUE",
    "UNKNOWN",
    "UNMATCHED",
    "UNNEST",
    "UPDATE",
    "USE",
    "USER",
    "USING",
    "UTF16",
    "UTF32",
    "UTF8",
    "VALIDATE",
    "VALUE",
    "VALUES",
    "VERBOSE",
    "VIEW",
    "WHEN",
    "WHERE",
    "WINDOW",
    "WITH",
    "WITHIN",
    "WITHOUT",
    "WORK",
    "WRAPPER",
    "WRITE",
    "ZONE"
  ];
  var dataTypes15 = [
    // https://github.com/trinodb/trino/blob/432d2897bdef99388c1a47188743a061c4ac1f34/core/trino-main/src/main/java/io/trino/metadata/TypeRegistry.java#L131-L168
    // or https://trino.io/docs/current/language/types.html
    "BIGINT",
    "INT",
    "INTEGER",
    "SMALLINT",
    "TINYINT",
    "BOOLEAN",
    "DATE",
    "DECIMAL",
    "REAL",
    "DOUBLE",
    "HYPERLOGLOG",
    "QDIGEST",
    "TDIGEST",
    "P4HYPERLOGLOG",
    "INTERVAL",
    "TIMESTAMP",
    "TIME",
    "VARBINARY",
    "VARCHAR",
    "CHAR",
    "ROW",
    "ARRAY",
    "MAP",
    "JSON",
    "JSON2016",
    "IPADDRESS",
    "GEOMETRY",
    "UUID",
    "SETDIGEST",
    "JONIREGEXP",
    "RE2JREGEXP",
    "LIKEPATTERN",
    "COLOR",
    "CODEPOINTS",
    "FUNCTION",
    "JSONPATH"
  ];
  var reservedSelect15 = expandPhrases(["SELECT [ALL | DISTINCT]"]);
  var reservedClauses15 = expandPhrases([
    // queries
    "WITH [RECURSIVE]",
    "FROM",
    "WHERE",
    "GROUP BY [ALL | DISTINCT]",
    "HAVING",
    "WINDOW",
    "PARTITION BY",
    "ORDER BY",
    "LIMIT",
    "OFFSET",
    "FETCH {FIRST | NEXT}",
    // Data manipulation
    // - insert:
    "INSERT INTO",
    "VALUES",
    // - update:
    "SET",
    // MATCH_RECOGNIZE
    "MATCH_RECOGNIZE",
    "MEASURES",
    "ONE ROW PER MATCH",
    "ALL ROWS PER MATCH",
    "AFTER MATCH",
    "PATTERN",
    "SUBSET",
    "DEFINE"
  ]);
  var standardOnelineClauses14 = expandPhrases(["CREATE TABLE [IF NOT EXISTS]"]);
  var tabularOnelineClauses14 = expandPhrases([
    // - create:
    "CREATE [OR REPLACE] [MATERIALIZED] VIEW",
    // - update:
    "UPDATE",
    // - delete:
    "DELETE FROM",
    // - drop table:
    "DROP TABLE [IF EXISTS]",
    // - alter table:
    "ALTER TABLE [IF EXISTS]",
    "ADD COLUMN [IF NOT EXISTS]",
    "DROP COLUMN [IF EXISTS]",
    "RENAME COLUMN [IF EXISTS]",
    "RENAME TO",
    "SET AUTHORIZATION [USER | ROLE]",
    "SET PROPERTIES",
    "EXECUTE",
    // - truncate:
    "TRUNCATE TABLE",
    // other
    "ALTER SCHEMA",
    "ALTER MATERIALIZED VIEW",
    "ALTER VIEW",
    "CREATE SCHEMA",
    "CREATE ROLE",
    "DROP SCHEMA",
    "DROP MATERIALIZED VIEW",
    "DROP VIEW",
    "DROP ROLE",
    // Auxiliary
    "EXPLAIN",
    "ANALYZE",
    "EXPLAIN ANALYZE",
    "EXPLAIN ANALYZE VERBOSE",
    "USE",
    "DESCRIBE INPUT",
    "DESCRIBE OUTPUT",
    "REFRESH MATERIALIZED VIEW",
    "RESET SESSION",
    "SET SESSION",
    "SET PATH",
    "SET TIME ZONE",
    "SHOW GRANTS",
    "SHOW CREATE TABLE",
    "SHOW CREATE SCHEMA",
    "SHOW CREATE VIEW",
    "SHOW CREATE MATERIALIZED VIEW",
    "SHOW TABLES",
    "SHOW SCHEMAS",
    "SHOW CATALOGS",
    "SHOW COLUMNS",
    "SHOW STATS FOR",
    "SHOW ROLES",
    "SHOW CURRENT ROLES",
    "SHOW ROLE GRANTS",
    "SHOW FUNCTIONS",
    "SHOW SESSION"
  ]);
  var reservedSetOperations15 = expandPhrases([
    "UNION [ALL | DISTINCT]",
    "EXCEPT [ALL | DISTINCT]",
    "INTERSECT [ALL | DISTINCT]"
  ]);
  var reservedJoins15 = expandPhrases([
    "JOIN",
    "{LEFT | RIGHT | FULL} [OUTER] JOIN",
    "{INNER | CROSS} JOIN",
    "NATURAL [INNER] JOIN",
    "NATURAL {LEFT | RIGHT | FULL} [OUTER] JOIN"
  ]);
  var reservedPhrases15 = expandPhrases([
    "{ROWS | RANGE | GROUPS} BETWEEN",
    // comparison operator
    "IS [NOT] DISTINCT FROM"
  ]);
  var trino = {
    name: "trino",
    tokenizerOptions: {
      reservedSelect: reservedSelect15,
      reservedClauses: [...reservedClauses15, ...standardOnelineClauses14, ...tabularOnelineClauses14],
      reservedSetOperations: reservedSetOperations15,
      reservedJoins: reservedJoins15,
      reservedPhrases: reservedPhrases15,
      reservedKeywords: keywords15,
      reservedDataTypes: dataTypes15,
      reservedFunctionNames: functions15,
      // Trino also supports {- ... -} parenthesis.
      // The formatting of these currently works out as a result of { and -
      // not getting a space added in-between.
      // https://trino.io/docs/current/sql/match-recognize.html#row-pattern-syntax
      extraParens: ["[]", "{}"],
      // https://trino.io/docs/current/language/types.html#string
      // https://trino.io/docs/current/language/types.html#varbinary
      stringTypes: [
        { quote: "''-qq", prefixes: ["U&"] },
        { quote: "''-raw", prefixes: ["X"], requirePrefix: true }
      ],
      // https://trino.io/docs/current/language/reserved.html
      identTypes: ['""-qq'],
      paramTypes: { positional: true },
      operators: [
        "%",
        "->",
        "=>",
        ":",
        "||",
        // Row pattern syntax
        "|",
        "^",
        "$"
        // '?', conflicts with positional placeholders
      ]
    },
    formatOptions: {
      onelineClauses: [...standardOnelineClauses14, ...tabularOnelineClauses14],
      tabularOnelineClauses: tabularOnelineClauses14
    }
  };
  var functions16 = [
    // https://docs.microsoft.com/en-us/sql/t-sql/functions/functions?view=sql-server-ver15
    // aggregate
    "APPROX_COUNT_DISTINCT",
    "AVG",
    "CHECKSUM_AGG",
    "COUNT",
    "COUNT_BIG",
    "GROUPING",
    "GROUPING_ID",
    "MAX",
    "MIN",
    "STDEV",
    "STDEVP",
    "SUM",
    "VAR",
    "VARP",
    // analytic
    "CUME_DIST",
    "FIRST_VALUE",
    "LAG",
    "LAST_VALUE",
    "LEAD",
    "PERCENTILE_CONT",
    "PERCENTILE_DISC",
    "PERCENT_RANK",
    "Collation - COLLATIONPROPERTY",
    "Collation - TERTIARY_WEIGHTS",
    // configuration
    "@@DBTS",
    "@@LANGID",
    "@@LANGUAGE",
    "@@LOCK_TIMEOUT",
    "@@MAX_CONNECTIONS",
    "@@MAX_PRECISION",
    "@@NESTLEVEL",
    "@@OPTIONS",
    "@@REMSERVER",
    "@@SERVERNAME",
    "@@SERVICENAME",
    "@@SPID",
    "@@TEXTSIZE",
    "@@VERSION",
    // conversion
    "CAST",
    "CONVERT",
    "PARSE",
    "TRY_CAST",
    "TRY_CONVERT",
    "TRY_PARSE",
    // cryptographic
    "ASYMKEY_ID",
    "ASYMKEYPROPERTY",
    "CERTPROPERTY",
    "CERT_ID",
    "CRYPT_GEN_RANDOM",
    "DECRYPTBYASYMKEY",
    "DECRYPTBYCERT",
    "DECRYPTBYKEY",
    "DECRYPTBYKEYAUTOASYMKEY",
    "DECRYPTBYKEYAUTOCERT",
    "DECRYPTBYPASSPHRASE",
    "ENCRYPTBYASYMKEY",
    "ENCRYPTBYCERT",
    "ENCRYPTBYKEY",
    "ENCRYPTBYPASSPHRASE",
    "HASHBYTES",
    "IS_OBJECTSIGNED",
    "KEY_GUID",
    "KEY_ID",
    "KEY_NAME",
    "SIGNBYASYMKEY",
    "SIGNBYCERT",
    "SYMKEYPROPERTY",
    "VERIFYSIGNEDBYCERT",
    "VERIFYSIGNEDBYASYMKEY",
    // cursor
    "@@CURSOR_ROWS",
    "@@FETCH_STATUS",
    "CURSOR_STATUS",
    // dataType
    "DATALENGTH",
    "IDENT_CURRENT",
    "IDENT_INCR",
    "IDENT_SEED",
    "IDENTITY",
    "SQL_VARIANT_PROPERTY",
    // datetime
    "@@DATEFIRST",
    "CURRENT_TIMESTAMP",
    "CURRENT_TIMEZONE",
    "CURRENT_TIMEZONE_ID",
    "DATEADD",
    "DATEDIFF",
    "DATEDIFF_BIG",
    "DATEFROMPARTS",
    "DATENAME",
    "DATEPART",
    "DATETIME2FROMPARTS",
    "DATETIMEFROMPARTS",
    "DATETIMEOFFSETFROMPARTS",
    "DAY",
    "EOMONTH",
    "GETDATE",
    "GETUTCDATE",
    "ISDATE",
    "MONTH",
    "SMALLDATETIMEFROMPARTS",
    "SWITCHOFFSET",
    "SYSDATETIME",
    "SYSDATETIMEOFFSET",
    "SYSUTCDATETIME",
    "TIMEFROMPARTS",
    "TODATETIMEOFFSET",
    "YEAR",
    "JSON",
    "ISJSON",
    "JSON_VALUE",
    "JSON_QUERY",
    "JSON_MODIFY",
    // mathematical
    "ABS",
    "ACOS",
    "ASIN",
    "ATAN",
    "ATN2",
    "CEILING",
    "COS",
    "COT",
    "DEGREES",
    "EXP",
    "FLOOR",
    "LOG",
    "LOG10",
    "PI",
    "POWER",
    "RADIANS",
    "RAND",
    "ROUND",
    "SIGN",
    "SIN",
    "SQRT",
    "SQUARE",
    "TAN",
    "CHOOSE",
    "GREATEST",
    "IIF",
    "LEAST",
    // metadata
    "@@PROCID",
    "APP_NAME",
    "APPLOCK_MODE",
    "APPLOCK_TEST",
    "ASSEMBLYPROPERTY",
    "COL_LENGTH",
    "COL_NAME",
    "COLUMNPROPERTY",
    "DATABASEPROPERTYEX",
    "DB_ID",
    "DB_NAME",
    "FILE_ID",
    "FILE_IDEX",
    "FILE_NAME",
    "FILEGROUP_ID",
    "FILEGROUP_NAME",
    "FILEGROUPPROPERTY",
    "FILEPROPERTY",
    "FILEPROPERTYEX",
    "FULLTEXTCATALOGPROPERTY",
    "FULLTEXTSERVICEPROPERTY",
    "INDEX_COL",
    "INDEXKEY_PROPERTY",
    "INDEXPROPERTY",
    "NEXT VALUE FOR",
    "OBJECT_DEFINITION",
    "OBJECT_ID",
    "OBJECT_NAME",
    "OBJECT_SCHEMA_NAME",
    "OBJECTPROPERTY",
    "OBJECTPROPERTYEX",
    "ORIGINAL_DB_NAME",
    "PARSENAME",
    "SCHEMA_ID",
    "SCHEMA_NAME",
    "SCOPE_IDENTITY",
    "SERVERPROPERTY",
    "STATS_DATE",
    "TYPE_ID",
    "TYPE_NAME",
    "TYPEPROPERTY",
    // ranking
    "DENSE_RANK",
    "NTILE",
    "RANK",
    "ROW_NUMBER",
    "PUBLISHINGSERVERNAME",
    // security
    "CERTENCODED",
    "CERTPRIVATEKEY",
    "CURRENT_USER",
    "DATABASE_PRINCIPAL_ID",
    "HAS_DBACCESS",
    "HAS_PERMS_BY_NAME",
    "IS_MEMBER",
    "IS_ROLEMEMBER",
    "IS_SRVROLEMEMBER",
    "LOGINPROPERTY",
    "ORIGINAL_LOGIN",
    "PERMISSIONS",
    "PWDENCRYPT",
    "PWDCOMPARE",
    "SESSION_USER",
    "SESSIONPROPERTY",
    "SUSER_ID",
    "SUSER_NAME",
    "SUSER_SID",
    "SUSER_SNAME",
    "SYSTEM_USER",
    "USER",
    "USER_ID",
    "USER_NAME",
    // string
    "ASCII",
    "CHAR",
    "CHARINDEX",
    "CONCAT",
    "CONCAT_WS",
    "DIFFERENCE",
    "FORMAT",
    "LEFT",
    "LEN",
    "LOWER",
    "LTRIM",
    "NCHAR",
    "PATINDEX",
    "QUOTENAME",
    "REPLACE",
    "REPLICATE",
    "REVERSE",
    "RIGHT",
    "RTRIM",
    "SOUNDEX",
    "SPACE",
    "STR",
    "STRING_AGG",
    "STRING_ESCAPE",
    "STUFF",
    "SUBSTRING",
    "TRANSLATE",
    "TRIM",
    "UNICODE",
    "UPPER",
    // system
    "$PARTITION",
    "@@ERROR",
    "@@IDENTITY",
    "@@PACK_RECEIVED",
    "@@ROWCOUNT",
    "@@TRANCOUNT",
    "BINARY_CHECKSUM",
    "CHECKSUM",
    "COMPRESS",
    "CONNECTIONPROPERTY",
    "CONTEXT_INFO",
    "CURRENT_REQUEST_ID",
    "CURRENT_TRANSACTION_ID",
    "DECOMPRESS",
    "ERROR_LINE",
    "ERROR_MESSAGE",
    "ERROR_NUMBER",
    "ERROR_PROCEDURE",
    "ERROR_SEVERITY",
    "ERROR_STATE",
    "FORMATMESSAGE",
    "GET_FILESTREAM_TRANSACTION_CONTEXT",
    "GETANSINULL",
    "HOST_ID",
    "HOST_NAME",
    "ISNULL",
    "ISNUMERIC",
    "MIN_ACTIVE_ROWVERSION",
    "NEWID",
    "NEWSEQUENTIALID",
    "ROWCOUNT_BIG",
    "SESSION_CONTEXT",
    "XACT_STATE",
    // statistical
    "@@CONNECTIONS",
    "@@CPU_BUSY",
    "@@IDLE",
    "@@IO_BUSY",
    "@@PACK_SENT",
    "@@PACKET_ERRORS",
    "@@TIMETICKS",
    "@@TOTAL_ERRORS",
    "@@TOTAL_READ",
    "@@TOTAL_WRITE",
    "TEXTPTR",
    "TEXTVALID",
    // trigger
    "COLUMNS_UPDATED",
    "EVENTDATA",
    "TRIGGER_NESTLEVEL",
    "UPDATE",
    // Shorthand functions to use in place of CASE expression
    "COALESCE",
    "NULLIF"
  ];
  var keywords16 = [
    // https://docs.microsoft.com/en-us/sql/t-sql/language-elements/reserved-keywords-transact-sql?view=sql-server-ver15
    // standard
    "ADD",
    "ALL",
    "ALTER",
    "AND",
    "ANY",
    "AS",
    "ASC",
    "AUTHORIZATION",
    "BACKUP",
    "BEGIN",
    "BETWEEN",
    "BREAK",
    "BROWSE",
    "BULK",
    "BY",
    "CASCADE",
    "CHECK",
    "CHECKPOINT",
    "CLOSE",
    "CLUSTERED",
    "COALESCE",
    "COLLATE",
    "COLUMN",
    "COMMIT",
    "COMPUTE",
    "CONSTRAINT",
    "CONTAINS",
    "CONTAINSTABLE",
    "CONTINUE",
    "CONVERT",
    "CREATE",
    "CROSS",
    "CURRENT",
    "CURRENT_DATE",
    "CURRENT_TIME",
    "CURRENT_TIMESTAMP",
    "CURRENT_USER",
    "CURSOR",
    "DATABASE",
    "DBCC",
    "DEALLOCATE",
    "DECLARE",
    "DEFAULT",
    "DELETE",
    "DENY",
    "DESC",
    "DISK",
    "DISTINCT",
    "DISTRIBUTED",
    "DROP",
    "DUMP",
    "ERRLVL",
    "ESCAPE",
    "EXEC",
    "EXECUTE",
    "EXISTS",
    "EXIT",
    "EXTERNAL",
    "FETCH",
    "FILE",
    "FILLFACTOR",
    "FOR",
    "FOREIGN",
    "FREETEXT",
    "FREETEXTTABLE",
    "FROM",
    "FULL",
    "FUNCTION",
    "GOTO",
    "GRANT",
    "GROUP",
    "HAVING",
    "HOLDLOCK",
    "IDENTITY",
    "IDENTITYCOL",
    "IDENTITY_INSERT",
    "IF",
    "IN",
    "INDEX",
    "INNER",
    "INSERT",
    "INTERSECT",
    "INTO",
    "IS",
    "JOIN",
    "KEY",
    "KILL",
    "LEFT",
    "LIKE",
    "LINENO",
    "LOAD",
    "MERGE",
    "NOCHECK",
    "NONCLUSTERED",
    "NOT",
    "NULL",
    "NULLIF",
    "OF",
    "OFF",
    "OFFSETS",
    "ON",
    "OPEN",
    "OPENDATASOURCE",
    "OPENQUERY",
    "OPENROWSET",
    "OPENXML",
    "OPTION",
    "OR",
    "ORDER",
    "OUTER",
    "OVER",
    "PERCENT",
    "PIVOT",
    "PLAN",
    "PRIMARY",
    "PRINT",
    "PROC",
    "PROCEDURE",
    "PUBLIC",
    "RAISERROR",
    "READ",
    "READTEXT",
    "RECONFIGURE",
    "REFERENCES",
    "REPLICATION",
    "RESTORE",
    "RESTRICT",
    "RETURN",
    "REVERT",
    "REVOKE",
    "RIGHT",
    "ROLLBACK",
    "ROWCOUNT",
    "ROWGUIDCOL",
    "RULE",
    "SAVE",
    "SCHEMA",
    "SECURITYAUDIT",
    "SELECT",
    "SEMANTICKEYPHRASETABLE",
    "SEMANTICSIMILARITYDETAILSTABLE",
    "SEMANTICSIMILARITYTABLE",
    "SESSION_USER",
    "SET",
    "SETUSER",
    "SHUTDOWN",
    "SOME",
    "STATISTICS",
    "SYSTEM_USER",
    "TABLE",
    "TABLESAMPLE",
    "TEXTSIZE",
    "THEN",
    "TO",
    "TOP",
    "TRAN",
    "TRANSACTION",
    "TRIGGER",
    "TRUNCATE",
    "TRY_CONVERT",
    "TSEQUAL",
    "UNION",
    "UNIQUE",
    "UNPIVOT",
    "UPDATE",
    "UPDATETEXT",
    "USE",
    "USER",
    "VALUES",
    "VIEW",
    "WAITFOR",
    "WHERE",
    "WHILE",
    "WITH",
    "WITHIN GROUP",
    "WRITETEXT",
    // odbc
    "ABSOLUTE",
    "ACTION",
    "ADA",
    "ALLOCATE",
    "ARE",
    "ASSERTION",
    "AT",
    "AVG",
    "BIT_LENGTH",
    "BOTH",
    "CASCADED",
    "CAST",
    "CATALOG",
    "CHARACTER_LENGTH",
    "CHAR_LENGTH",
    "COLLATION",
    "CONNECT",
    "CONNECTION",
    "CONSTRAINTS",
    "CORRESPONDING",
    "COUNT",
    "DAY",
    "DEFERRABLE",
    "DEFERRED",
    "DESCRIBE",
    "DESCRIPTOR",
    "DIAGNOSTICS",
    "DISCONNECT",
    "DOMAIN",
    "END-EXEC",
    "EXCEPTION",
    "EXTRACT",
    "FALSE",
    "FIRST",
    "FORTRAN",
    "FOUND",
    "GET",
    "GLOBAL",
    "GO",
    "HOUR",
    "IMMEDIATE",
    "INCLUDE",
    "INDICATOR",
    "INITIALLY",
    "INPUT",
    "INSENSITIVE",
    "INTERVAL",
    "ISOLATION",
    "LANGUAGE",
    "LAST",
    "LEADING",
    "LEVEL",
    "LOCAL",
    "LOWER",
    "MATCH",
    "MAX",
    "MIN",
    "MINUTE",
    "MODULE",
    "MONTH",
    "NAMES",
    "NATURAL",
    "NEXT",
    "NO",
    "NONE",
    "OCTET_LENGTH",
    "ONLY",
    "OUTPUT",
    "OVERLAPS",
    "PAD",
    "PARTIAL",
    "PASCAL",
    "POSITION",
    "PREPARE",
    "PRESERVE",
    "PRIOR",
    "PRIVILEGES",
    "RELATIVE",
    "ROWS",
    "SCROLL",
    "SECOND",
    "SECTION",
    "SESSION",
    "SIZE",
    "SPACE",
    "SQL",
    "SQLCA",
    "SQLCODE",
    "SQLERROR",
    "SQLSTATE",
    "SQLWARNING",
    "SUBSTRING",
    "SUM",
    "TEMPORARY",
    "TIMEZONE_HOUR",
    "TIMEZONE_MINUTE",
    "TRAILING",
    "TRANSLATE",
    "TRANSLATION",
    "TRIM",
    "TRUE",
    "UNKNOWN",
    "UPPER",
    "USAGE",
    "VALUE",
    "WHENEVER",
    "WORK",
    "WRITE",
    "YEAR",
    "ZONE"
  ];
  var dataTypes16 = [
    // https://learn.microsoft.com/en-us/sql/t-sql/data-types/data-types-transact-sql?view=sql-server-ver15
    "BINARY",
    "BIT",
    "CHAR",
    "CHAR",
    "CHARACTER",
    "DATE",
    "DATETIME2",
    "DATETIMEOFFSET",
    "DEC",
    "DECIMAL",
    "DOUBLE",
    "FLOAT",
    "INT",
    "INTEGER",
    "NATIONAL",
    "NCHAR",
    "NUMERIC",
    "NVARCHAR",
    "PRECISION",
    "REAL",
    "SMALLINT",
    "TIME",
    "TIMESTAMP",
    "VARBINARY",
    "VARCHAR"
  ];
  var reservedSelect16 = expandPhrases(["SELECT [ALL | DISTINCT]"]);
  var reservedClauses16 = expandPhrases([
    // queries
    "WITH",
    "INTO",
    "FROM",
    "WHERE",
    "GROUP BY",
    "HAVING",
    "WINDOW",
    "PARTITION BY",
    "ORDER BY",
    "OFFSET",
    "FETCH {FIRST | NEXT}",
    "FOR {BROWSE | XML | JSON}",
    "OPTION",
    // Data manipulation
    // - insert:
    "INSERT [INTO]",
    "VALUES",
    // - update:
    "SET",
    // - merge:
    "MERGE [INTO]",
    "WHEN [NOT] MATCHED [BY TARGET | BY SOURCE] [THEN]",
    "UPDATE SET",
    // Data definition
    "CREATE [OR ALTER] {PROC | PROCEDURE}"
  ]);
  var standardOnelineClauses15 = expandPhrases(["CREATE TABLE"]);
  var tabularOnelineClauses15 = expandPhrases([
    // - create:
    "CREATE [OR ALTER] [MATERIALIZED] VIEW",
    // - update:
    "UPDATE",
    "WHERE CURRENT OF",
    // - delete:
    "DELETE [FROM]",
    // - drop table:
    "DROP TABLE [IF EXISTS]",
    // - alter table:
    "ALTER TABLE",
    "ADD",
    "DROP COLUMN [IF EXISTS]",
    "ALTER COLUMN",
    // - truncate:
    "TRUNCATE TABLE",
    // https://docs.microsoft.com/en-us/sql/t-sql/statements/statements?view=sql-server-ver15
    "ADD SENSITIVITY CLASSIFICATION",
    "ADD SIGNATURE",
    "AGGREGATE",
    "ANSI_DEFAULTS",
    "ANSI_NULLS",
    "ANSI_NULL_DFLT_OFF",
    "ANSI_NULL_DFLT_ON",
    "ANSI_PADDING",
    "ANSI_WARNINGS",
    "APPLICATION ROLE",
    "ARITHABORT",
    "ARITHIGNORE",
    "ASSEMBLY",
    "ASYMMETRIC KEY",
    "AUTHORIZATION",
    "AVAILABILITY GROUP",
    "BACKUP",
    "BACKUP CERTIFICATE",
    "BACKUP MASTER KEY",
    "BACKUP SERVICE MASTER KEY",
    "BEGIN CONVERSATION TIMER",
    "BEGIN DIALOG CONVERSATION",
    "BROKER PRIORITY",
    "BULK INSERT",
    "CERTIFICATE",
    "CLOSE MASTER KEY",
    "CLOSE SYMMETRIC KEY",
    "COLLATE",
    "COLUMN ENCRYPTION KEY",
    "COLUMN MASTER KEY",
    "COLUMNSTORE INDEX",
    "CONCAT_NULL_YIELDS_NULL",
    "CONTEXT_INFO",
    "CONTRACT",
    "CREDENTIAL",
    "CRYPTOGRAPHIC PROVIDER",
    "CURSOR_CLOSE_ON_COMMIT",
    "DATABASE",
    "DATABASE AUDIT SPECIFICATION",
    "DATABASE ENCRYPTION KEY",
    "DATABASE HADR",
    "DATABASE SCOPED CONFIGURATION",
    "DATABASE SCOPED CREDENTIAL",
    "DATABASE SET",
    "DATEFIRST",
    "DATEFORMAT",
    "DEADLOCK_PRIORITY",
    "DENY",
    "DENY XML",
    "DISABLE TRIGGER",
    "ENABLE TRIGGER",
    "END CONVERSATION",
    "ENDPOINT",
    "EVENT NOTIFICATION",
    "EVENT SESSION",
    "EXECUTE AS",
    "EXTERNAL DATA SOURCE",
    "EXTERNAL FILE FORMAT",
    "EXTERNAL LANGUAGE",
    "EXTERNAL LIBRARY",
    "EXTERNAL RESOURCE POOL",
    "EXTERNAL TABLE",
    "FIPS_FLAGGER",
    "FMTONLY",
    "FORCEPLAN",
    "FULLTEXT CATALOG",
    "FULLTEXT INDEX",
    "FULLTEXT STOPLIST",
    "FUNCTION",
    "GET CONVERSATION GROUP",
    "GET_TRANSMISSION_STATUS",
    "GRANT",
    "GRANT XML",
    "IDENTITY_INSERT",
    "IMPLICIT_TRANSACTIONS",
    "INDEX",
    "LANGUAGE",
    "LOCK_TIMEOUT",
    "LOGIN",
    "MASTER KEY",
    "MESSAGE TYPE",
    "MOVE CONVERSATION",
    "NOCOUNT",
    "NOEXEC",
    "NUMERIC_ROUNDABORT",
    "OFFSETS",
    "OPEN MASTER KEY",
    "OPEN SYMMETRIC KEY",
    "PARSEONLY",
    "PARTITION FUNCTION",
    "PARTITION SCHEME",
    "PROCEDURE",
    "QUERY_GOVERNOR_COST_LIMIT",
    "QUEUE",
    "QUOTED_IDENTIFIER",
    "RECEIVE",
    "REMOTE SERVICE BINDING",
    "REMOTE_PROC_TRANSACTIONS",
    "RESOURCE GOVERNOR",
    "RESOURCE POOL",
    "RESTORE",
    "RESTORE FILELISTONLY",
    "RESTORE HEADERONLY",
    "RESTORE LABELONLY",
    "RESTORE MASTER KEY",
    "RESTORE REWINDONLY",
    "RESTORE SERVICE MASTER KEY",
    "RESTORE VERIFYONLY",
    "REVERT",
    "REVOKE",
    "REVOKE XML",
    "ROLE",
    "ROUTE",
    "ROWCOUNT",
    "RULE",
    "SCHEMA",
    "SEARCH PROPERTY LIST",
    "SECURITY POLICY",
    "SELECTIVE XML INDEX",
    "SEND",
    "SENSITIVITY CLASSIFICATION",
    "SEQUENCE",
    "SERVER AUDIT",
    "SERVER AUDIT SPECIFICATION",
    "SERVER CONFIGURATION",
    "SERVER ROLE",
    "SERVICE",
    "SERVICE MASTER KEY",
    "SETUSER",
    "SHOWPLAN_ALL",
    "SHOWPLAN_TEXT",
    "SHOWPLAN_XML",
    "SIGNATURE",
    "SPATIAL INDEX",
    "STATISTICS",
    "STATISTICS IO",
    "STATISTICS PROFILE",
    "STATISTICS TIME",
    "STATISTICS XML",
    "SYMMETRIC KEY",
    "SYNONYM",
    "TABLE",
    "TABLE IDENTITY",
    "TEXTSIZE",
    "TRANSACTION ISOLATION LEVEL",
    "TRIGGER",
    "TYPE",
    "UPDATE STATISTICS",
    "USER",
    "WORKLOAD GROUP",
    "XACT_ABORT",
    "XML INDEX",
    "XML SCHEMA COLLECTION"
  ]);
  var reservedSetOperations16 = expandPhrases(["UNION [ALL]", "EXCEPT", "INTERSECT"]);
  var reservedJoins16 = expandPhrases([
    "JOIN",
    "{LEFT | RIGHT | FULL} [OUTER] JOIN",
    "{INNER | CROSS} JOIN",
    // non-standard joins
    "{CROSS | OUTER} APPLY"
  ]);
  var reservedPhrases16 = expandPhrases([
    "ON {UPDATE | DELETE} [SET NULL | SET DEFAULT]",
    "{ROWS | RANGE} BETWEEN"
  ]);
  var transactsql = {
    name: "transactsql",
    tokenizerOptions: {
      reservedSelect: reservedSelect16,
      reservedClauses: [...reservedClauses16, ...standardOnelineClauses15, ...tabularOnelineClauses15],
      reservedSetOperations: reservedSetOperations16,
      reservedJoins: reservedJoins16,
      reservedPhrases: reservedPhrases16,
      reservedKeywords: keywords16,
      reservedDataTypes: dataTypes16,
      reservedFunctionNames: functions16,
      nestedBlockComments: true,
      stringTypes: [{ quote: "''-qq", prefixes: ["N"] }],
      identTypes: [`""-qq`, "[]"],
      identChars: { first: "#@", rest: "#@$" },
      paramTypes: { named: ["@"], quoted: ["@"] },
      operators: [
        "%",
        "&",
        "|",
        "^",
        "~",
        "!<",
        "!>",
        "+=",
        "-=",
        "*=",
        "/=",
        "%=",
        "|=",
        "&=",
        "^=",
        "::",
        ":"
      ],
      propertyAccessOperators: [".."]
      // TODO: Support for money constants
    },
    formatOptions: {
      alwaysDenseOperators: ["::"],
      onelineClauses: [...standardOnelineClauses15, ...tabularOnelineClauses15],
      tabularOnelineClauses: tabularOnelineClauses15
    }
  };
  var keywords17 = [
    // List of all keywords taken from:
    // https://docs.singlestore.com/managed-service/en/reference/sql-reference/restricted-keywords/list-of-restricted-keywords.html
    // Then filtered down to reserved keywords by running
    // > SELECT * AS <keyword>;
    // for each keyword in that list and observing which of these produce an error.
    "ADD",
    "ALL",
    "ALTER",
    "ANALYZE",
    "AND",
    "AS",
    "ASC",
    "ASENSITIVE",
    "BEFORE",
    "BETWEEN",
    "_BINARY",
    "BOTH",
    "BY",
    "CALL",
    "CASCADE",
    "CASE",
    "CHANGE",
    "CHECK",
    "COLLATE",
    "COLUMN",
    "CONDITION",
    "CONSTRAINT",
    "CONTINUE",
    "CONVERT",
    "CREATE",
    "CROSS",
    "CURRENT_DATE",
    "CURRENT_TIME",
    "CURRENT_TIMESTAMP",
    "CURRENT_USER",
    "CURSOR",
    "DATABASE",
    "DATABASES",
    "DAY_HOUR",
    "DAY_MICROSECOND",
    "DAY_MINUTE",
    "DAY_SECOND",
    "DECLARE",
    "DEFAULT",
    "DELAYED",
    "DELETE",
    "DESC",
    "DESCRIBE",
    "DETERMINISTIC",
    "DISTINCT",
    "DISTINCTROW",
    "DIV",
    "DROP",
    "DUAL",
    "EACH",
    "ELSE",
    "ELSEIF",
    "ENCLOSED",
    "ESCAPED",
    "EXCEPT",
    "EXISTS",
    "EXIT",
    "EXPLAIN",
    "EXTRA_JOIN",
    "FALSE",
    "FETCH",
    "FOR",
    "FORCE",
    "FORCE_COMPILED_MODE",
    "FORCE_INTERPRETER_MODE",
    "FOREIGN",
    "FROM",
    "FULL",
    "FULLTEXT",
    "GRANT",
    "GROUP",
    "HAVING",
    "HEARTBEAT_NO_LOGGING",
    "HIGH_PRIORITY",
    "HOUR_MICROSECOND",
    "HOUR_MINUTE",
    "HOUR_SECOND",
    "IF",
    "IGNORE",
    "IN",
    "INDEX",
    "INFILE",
    "INNER",
    "INOUT",
    "INSENSITIVE",
    "INSERT",
    "IN",
    "_INTERNAL_DYNAMIC_TYPECAST",
    "INTERSECT",
    "INTERVAL",
    "INTO",
    "ITERATE",
    "JOIN",
    "KEY",
    "KEYS",
    "KILL",
    "LEADING",
    "LEAVE",
    "LEFT",
    "LIKE",
    "LIMIT",
    "LINES",
    "LOAD",
    "LOCALTIME",
    "LOCALTIMESTAMP",
    "LOCK",
    "LOOP",
    "LOW_PRIORITY",
    "MATCH",
    "MAXVALUE",
    "MINUS",
    "MINUTE_MICROSECOND",
    "MINUTE_SECOND",
    "MOD",
    "MODIFIES",
    "NATURAL",
    "NO_QUERY_REWRITE",
    "NOT",
    "NO_WRITE_TO_BINLOG",
    "NO_QUERY_REWRITE",
    "NULL",
    "ON",
    "OPTIMIZE",
    "OPTION",
    "OPTIONALLY",
    "OR",
    "ORDER",
    "OUT",
    "OUTER",
    "OUTFILE",
    "OVER",
    "PRIMARY",
    "PROCEDURE",
    "PURGE",
    "RANGE",
    "READ",
    "READS",
    "REFERENCES",
    "REGEXP",
    "RELEASE",
    "RENAME",
    "REPEAT",
    "REPLACE",
    "REQUIRE",
    "RESTRICT",
    "RETURN",
    "REVOKE",
    "RIGHT",
    "RIGHT_ANTI_JOIN",
    "RIGHT_SEMI_JOIN",
    "RIGHT_STRAIGHT_JOIN",
    "RLIKE",
    "SCHEMA",
    "SCHEMAS",
    "SECOND_MICROSECOND",
    "SELECT",
    "SEMI_JOIN",
    "SENSITIVE",
    "SEPARATOR",
    "SET",
    "SHOW",
    "SIGNAL",
    "SPATIAL",
    "SPECIFIC",
    "SQL",
    "SQL_BIG_RESULT",
    "SQL_BUFFER_RESULT",
    "SQL_CACHE",
    "SQL_CALC_FOUND_ROWS",
    "SQLEXCEPTION",
    "SQL_NO_CACHE",
    "SQL_NO_LOGGING",
    "SQL_SMALL_RESULT",
    "SQLSTATE",
    "SQLWARNING",
    "STRAIGHT_JOIN",
    "TABLE",
    "TERMINATED",
    "THEN",
    "TO",
    "TRAILING",
    "TRIGGER",
    "TRUE",
    "UNBOUNDED",
    "UNDO",
    "UNION",
    "UNIQUE",
    "UNLOCK",
    "UPDATE",
    "USAGE",
    "USE",
    "USING",
    "UTC_DATE",
    "UTC_TIME",
    "UTC_TIMESTAMP",
    "_UTF8",
    "VALUES",
    "WHEN",
    "WHERE",
    "WHILE",
    "WINDOW",
    "WITH",
    "WITHIN",
    "WRITE",
    "XOR",
    "YEAR_MONTH",
    "ZEROFILL"
  ];
  var dataTypes17 = [
    // https://docs.singlestore.com/cloud/reference/sql-reference/data-types/
    "BIGINT",
    "BINARY",
    "BIT",
    "BLOB",
    "CHAR",
    "CHARACTER",
    "DATETIME",
    "DEC",
    "DECIMAL",
    "DOUBLE PRECISION",
    "DOUBLE",
    "ENUM",
    "FIXED",
    "FLOAT",
    "FLOAT4",
    "FLOAT8",
    "INT",
    "INT1",
    "INT2",
    "INT3",
    "INT4",
    "INT8",
    "INTEGER",
    "LONG",
    "LONGBLOB",
    "LONGTEXT",
    "MEDIUMBLOB",
    "MEDIUMINT",
    "MEDIUMTEXT",
    "MIDDLEINT",
    "NATIONAL CHAR",
    "NATIONAL VARCHAR",
    "NUMERIC",
    "PRECISION",
    "REAL",
    "SMALLINT",
    "TEXT",
    "TIME",
    "TIMESTAMP",
    "TINYBLOB",
    "TINYINT",
    "TINYTEXT",
    "UNSIGNED",
    "VARBINARY",
    "VARCHAR",
    "VARCHARACTER",
    "YEAR"
  ];
  var functions17 = [
    // https://docs.singlestore.com/managed-service/en/reference/sql-reference/vector-functions/vector-functions.html
    // https://docs.singlestore.com/managed-service/en/reference/sql-reference/window-functions/window-functions.html
    // https://docs.singlestore.com/managed-service/en/reference/sql-reference/string-functions/string-functions.html
    // https://docs.singlestore.com/managed-service/en/reference/sql-reference/conditional-functions/conditional-functions.html
    // https://docs.singlestore.com/managed-service/en/reference/sql-reference/numeric-functions/numeric-functions.html
    // https://docs.singlestore.com/managed-service/en/reference/sql-reference/geospatial-functions/geospatial-functions.html
    // https://docs.singlestore.com/managed-service/en/reference/sql-reference/json-functions/json-functions.html
    // https://docs.singlestore.com/managed-service/en/reference/sql-reference/information-functions/information-functions.html
    // https://docs.singlestore.com/managed-service/en/reference/sql-reference/aggregate-functions/aggregate-functions.html
    // https://docs.singlestore.com/managed-service/en/reference/sql-reference/time-series-functions/time-series-functions.html
    // https://docs.singlestore.com/managed-service/en/reference/sql-reference/identifier-generation-functions.html
    // https://docs.singlestore.com/managed-service/en/reference/sql-reference/date-and-time-functions/date-and-time-functions.html
    // https://docs.singlestore.com/managed-service/en/reference/sql-reference/distinct-count-estimation-functions.html
    // https://docs.singlestore.com/managed-service/en/reference/sql-reference/full-text-search-functions/full-text-search-functions.html
    // https://docs.singlestore.com/managed-service/en/reference/sql-reference/regular-expression-functions.html
    "ABS",
    "ACOS",
    "ADDDATE",
    "ADDTIME",
    "AES_DECRYPT",
    "AES_ENCRYPT",
    "ANY_VALUE",
    "APPROX_COUNT_DISTINCT",
    "APPROX_COUNT_DISTINCT_ACCUMULATE",
    "APPROX_COUNT_DISTINCT_COMBINE",
    "APPROX_COUNT_DISTINCT_ESTIMATE",
    "APPROX_GEOGRAPHY_INTERSECTS",
    "APPROX_PERCENTILE",
    "ASCII",
    "ASIN",
    "ATAN",
    "ATAN2",
    "AVG",
    "BIN",
    "BINARY",
    "BIT_AND",
    "BIT_COUNT",
    "BIT_OR",
    "BIT_XOR",
    "CAST",
    "CEIL",
    "CEILING",
    "CHAR",
    "CHARACTER_LENGTH",
    "CHAR_LENGTH",
    "CHARSET",
    "COALESCE",
    "COERCIBILITY",
    "COLLATION",
    "COLLECT",
    "CONCAT",
    "CONCAT_WS",
    "CONNECTION_ID",
    "CONV",
    "CONVERT",
    "CONVERT_TZ",
    "COS",
    "COT",
    "COUNT",
    "CUME_DIST",
    "CURDATE",
    "CURRENT_DATE",
    "CURRENT_ROLE",
    "CURRENT_TIME",
    "CURRENT_TIMESTAMP",
    "CURRENT_USER",
    "CURTIME",
    "DATABASE",
    "DATE",
    "DATE_ADD",
    "DATEDIFF",
    "DATE_FORMAT",
    "DATE_SUB",
    "DATE_TRUNC",
    "DAY",
    "DAYNAME",
    "DAYOFMONTH",
    "DAYOFWEEK",
    "DAYOFYEAR",
    "DECODE",
    "DEFAULT",
    "DEGREES",
    "DENSE_RANK",
    "DIV",
    "DOT_PRODUCT",
    "ELT",
    "EUCLIDEAN_DISTANCE",
    "EXP",
    "EXTRACT",
    "FIELD",
    "FIRST",
    "FIRST_VALUE",
    "FLOOR",
    "FORMAT",
    "FOUND_ROWS",
    "FROM_BASE64",
    "FROM_DAYS",
    "FROM_UNIXTIME",
    "GEOGRAPHY_AREA",
    "GEOGRAPHY_CONTAINS",
    "GEOGRAPHY_DISTANCE",
    "GEOGRAPHY_INTERSECTS",
    "GEOGRAPHY_LATITUDE",
    "GEOGRAPHY_LENGTH",
    "GEOGRAPHY_LONGITUDE",
    "GEOGRAPHY_POINT",
    "GEOGRAPHY_WITHIN_DISTANCE",
    "GEOMETRY_AREA",
    "GEOMETRY_CONTAINS",
    "GEOMETRY_DISTANCE",
    "GEOMETRY_FILTER",
    "GEOMETRY_INTERSECTS",
    "GEOMETRY_LENGTH",
    "GEOMETRY_POINT",
    "GEOMETRY_WITHIN_DISTANCE",
    "GEOMETRY_X",
    "GEOMETRY_Y",
    "GREATEST",
    "GROUPING",
    "GROUP_CONCAT",
    "HEX",
    "HIGHLIGHT",
    "HOUR",
    "ICU_VERSION",
    "IF",
    "IFNULL",
    "INET_ATON",
    "INET_NTOA",
    "INET6_ATON",
    "INET6_NTOA",
    "INITCAP",
    "INSERT",
    "INSTR",
    "INTERVAL",
    "IS",
    "IS NULL",
    "JSON_AGG",
    "JSON_ARRAY_CONTAINS_DOUBLE",
    "JSON_ARRAY_CONTAINS_JSON",
    "JSON_ARRAY_CONTAINS_STRING",
    "JSON_ARRAY_PUSH_DOUBLE",
    "JSON_ARRAY_PUSH_JSON",
    "JSON_ARRAY_PUSH_STRING",
    "JSON_DELETE_KEY",
    "JSON_EXTRACT_DOUBLE",
    "JSON_EXTRACT_JSON",
    "JSON_EXTRACT_STRING",
    "JSON_EXTRACT_BIGINT",
    "JSON_GET_TYPE",
    "JSON_LENGTH",
    "JSON_SET_DOUBLE",
    "JSON_SET_JSON",
    "JSON_SET_STRING",
    "JSON_SPLICE_DOUBLE",
    "JSON_SPLICE_JSON",
    "JSON_SPLICE_STRING",
    "LAG",
    "LAST_DAY",
    "LAST_VALUE",
    "LCASE",
    "LEAD",
    "LEAST",
    "LEFT",
    "LENGTH",
    "LIKE",
    "LN",
    "LOCALTIME",
    "LOCALTIMESTAMP",
    "LOCATE",
    "LOG",
    "LOG10",
    "LOG2",
    "LPAD",
    "LTRIM",
    "MATCH",
    "MAX",
    "MD5",
    "MEDIAN",
    "MICROSECOND",
    "MIN",
    "MINUTE",
    "MOD",
    "MONTH",
    "MONTHNAME",
    "MONTHS_BETWEEN",
    "NOT",
    "NOW",
    "NTH_VALUE",
    "NTILE",
    "NULLIF",
    "OCTET_LENGTH",
    "PERCENT_RANK",
    "PERCENTILE_CONT",
    "PERCENTILE_DISC",
    "PI",
    "PIVOT",
    "POSITION",
    "POW",
    "POWER",
    "QUARTER",
    "QUOTE",
    "RADIANS",
    "RAND",
    "RANK",
    "REGEXP",
    "REPEAT",
    "REPLACE",
    "REVERSE",
    "RIGHT",
    "RLIKE",
    "ROUND",
    "ROW_COUNT",
    "ROW_NUMBER",
    "RPAD",
    "RTRIM",
    "SCALAR",
    "SCHEMA",
    "SEC_TO_TIME",
    "SHA1",
    "SHA2",
    "SIGMOID",
    "SIGN",
    "SIN",
    "SLEEP",
    "SPLIT",
    "SOUNDEX",
    "SOUNDS LIKE",
    "SOURCE_POS_WAIT",
    "SPACE",
    "SQRT",
    "STDDEV",
    "STDDEV_POP",
    "STDDEV_SAMP",
    "STR_TO_DATE",
    "SUBDATE",
    "SUBSTR",
    "SUBSTRING",
    "SUBSTRING_INDEX",
    "SUM",
    "SYS_GUID",
    "TAN",
    "TIME",
    "TIMEDIFF",
    "TIME_BUCKET",
    "TIME_FORMAT",
    "TIMESTAMP",
    "TIMESTAMPADD",
    "TIMESTAMPDIFF",
    "TIME_TO_SEC",
    "TO_BASE64",
    "TO_CHAR",
    "TO_DAYS",
    "TO_JSON",
    "TO_NUMBER",
    "TO_SECONDS",
    "TO_TIMESTAMP",
    "TRIM",
    "TRUNC",
    "TRUNCATE",
    "UCASE",
    "UNHEX",
    "UNIX_TIMESTAMP",
    "UPDATEXML",
    "UPPER",
    // 'USER',
    "UTC_DATE",
    "UTC_TIME",
    "UTC_TIMESTAMP",
    "UUID",
    "VALUES",
    "VARIANCE",
    "VAR_POP",
    "VAR_SAMP",
    "VECTOR_SUB",
    "VERSION",
    "WEEK",
    "WEEKDAY",
    "WEEKOFYEAR",
    "YEAR"
  ];
  var reservedSelect17 = expandPhrases(["SELECT [ALL | DISTINCT | DISTINCTROW]"]);
  var reservedClauses17 = expandPhrases([
    // queries
    "WITH",
    "FROM",
    "WHERE",
    "GROUP BY",
    "HAVING",
    "PARTITION BY",
    "ORDER BY",
    "LIMIT",
    "OFFSET",
    // Data manipulation
    // - insert:
    "INSERT [IGNORE] [INTO]",
    "VALUES",
    "REPLACE [INTO]",
    "ON DUPLICATE KEY UPDATE",
    // - update:
    "SET",
    // Data definition
    "CREATE [OR REPLACE] [TEMPORARY] PROCEDURE [IF NOT EXISTS]",
    "CREATE [OR REPLACE] [EXTERNAL] FUNCTION"
  ]);
  var standardOnelineClauses16 = expandPhrases([
    "CREATE [ROWSTORE] [REFERENCE | TEMPORARY | GLOBAL TEMPORARY] TABLE [IF NOT EXISTS]"
  ]);
  var tabularOnelineClauses16 = expandPhrases([
    // - create:
    "CREATE VIEW",
    // - update:
    "UPDATE",
    // - delete:
    "DELETE [FROM]",
    // - drop table:
    "DROP [TEMPORARY] TABLE [IF EXISTS]",
    // - alter table:
    "ALTER [ONLINE] TABLE",
    "ADD [COLUMN]",
    "ADD [UNIQUE] {INDEX | KEY}",
    "DROP [COLUMN]",
    "MODIFY [COLUMN]",
    "CHANGE",
    "RENAME [TO | AS]",
    // - truncate:
    "TRUNCATE [TABLE]",
    // https://docs.singlestore.com/managed-service/en/reference/sql-reference.html
    "ADD AGGREGATOR",
    "ADD LEAF",
    "AGGREGATOR SET AS MASTER",
    "ALTER DATABASE",
    "ALTER PIPELINE",
    "ALTER RESOURCE POOL",
    "ALTER USER",
    "ALTER VIEW",
    "ANALYZE TABLE",
    "ATTACH DATABASE",
    "ATTACH LEAF",
    "ATTACH LEAF ALL",
    "BACKUP DATABASE",
    "BINLOG",
    "BOOTSTRAP AGGREGATOR",
    "CACHE INDEX",
    "CALL",
    "CHANGE",
    "CHANGE MASTER TO",
    "CHANGE REPLICATION FILTER",
    "CHANGE REPLICATION SOURCE TO",
    "CHECK BLOB CHECKSUM",
    "CHECK TABLE",
    "CHECKSUM TABLE",
    "CLEAR ORPHAN DATABASES",
    "CLONE",
    "COMMIT",
    "CREATE DATABASE",
    "CREATE GROUP",
    "CREATE INDEX",
    "CREATE LINK",
    "CREATE MILESTONE",
    "CREATE PIPELINE",
    "CREATE RESOURCE POOL",
    "CREATE ROLE",
    "CREATE USER",
    "DEALLOCATE PREPARE",
    "DESCRIBE",
    "DETACH DATABASE",
    "DETACH PIPELINE",
    "DROP DATABASE",
    "DROP FUNCTION",
    "DROP INDEX",
    "DROP LINK",
    "DROP PIPELINE",
    "DROP PROCEDURE",
    "DROP RESOURCE POOL",
    "DROP ROLE",
    "DROP USER",
    "DROP VIEW",
    "EXECUTE",
    "EXPLAIN",
    "FLUSH",
    "FORCE",
    "GRANT",
    "HANDLER",
    "HELP",
    "KILL CONNECTION",
    "KILLALL QUERIES",
    "LOAD DATA",
    "LOAD INDEX INTO CACHE",
    "LOAD XML",
    "LOCK INSTANCE FOR BACKUP",
    "LOCK TABLES",
    "MASTER_POS_WAIT",
    "OPTIMIZE TABLE",
    "PREPARE",
    "PURGE BINARY LOGS",
    "REBALANCE PARTITIONS",
    "RELEASE SAVEPOINT",
    "REMOVE AGGREGATOR",
    "REMOVE LEAF",
    "REPAIR TABLE",
    "REPLACE",
    "REPLICATE DATABASE",
    "RESET",
    "RESET MASTER",
    "RESET PERSIST",
    "RESET REPLICA",
    "RESET SLAVE",
    "RESTART",
    "RESTORE DATABASE",
    "RESTORE REDUNDANCY",
    "REVOKE",
    "ROLLBACK",
    "ROLLBACK TO SAVEPOINT",
    "SAVEPOINT",
    "SET CHARACTER SET",
    "SET DEFAULT ROLE",
    "SET NAMES",
    "SET PASSWORD",
    "SET RESOURCE GROUP",
    "SET ROLE",
    "SET TRANSACTION",
    "SHOW",
    "SHOW CHARACTER SET",
    "SHOW COLLATION",
    "SHOW COLUMNS",
    "SHOW CREATE DATABASE",
    "SHOW CREATE FUNCTION",
    "SHOW CREATE PIPELINE",
    "SHOW CREATE PROCEDURE",
    "SHOW CREATE TABLE",
    "SHOW CREATE USER",
    "SHOW CREATE VIEW",
    "SHOW DATABASES",
    "SHOW ENGINE",
    "SHOW ENGINES",
    "SHOW ERRORS",
    "SHOW FUNCTION CODE",
    "SHOW FUNCTION STATUS",
    "SHOW GRANTS",
    "SHOW INDEX",
    "SHOW MASTER STATUS",
    "SHOW OPEN TABLES",
    "SHOW PLUGINS",
    "SHOW PRIVILEGES",
    "SHOW PROCEDURE CODE",
    "SHOW PROCEDURE STATUS",
    "SHOW PROCESSLIST",
    "SHOW PROFILE",
    "SHOW PROFILES",
    "SHOW RELAYLOG EVENTS",
    "SHOW REPLICA STATUS",
    "SHOW REPLICAS",
    "SHOW SLAVE",
    "SHOW SLAVE HOSTS",
    "SHOW STATUS",
    "SHOW TABLE STATUS",
    "SHOW TABLES",
    "SHOW VARIABLES",
    "SHOW WARNINGS",
    "SHUTDOWN",
    "SNAPSHOT DATABASE",
    "SOURCE_POS_WAIT",
    "START GROUP_REPLICATION",
    "START PIPELINE",
    "START REPLICA",
    "START SLAVE",
    "START TRANSACTION",
    "STOP GROUP_REPLICATION",
    "STOP PIPELINE",
    "STOP REPLICA",
    "STOP REPLICATING",
    "STOP SLAVE",
    "TEST PIPELINE",
    "UNLOCK INSTANCE",
    "UNLOCK TABLES",
    "USE",
    "XA",
    // flow control
    "ITERATE",
    "LEAVE",
    "LOOP",
    "REPEAT",
    "RETURN",
    "WHILE"
  ]);
  var reservedSetOperations17 = expandPhrases([
    "UNION [ALL | DISTINCT]",
    "EXCEPT",
    "INTERSECT",
    "MINUS"
  ]);
  var reservedJoins17 = expandPhrases([
    "JOIN",
    "{LEFT | RIGHT | FULL} [OUTER] JOIN",
    "{INNER | CROSS} JOIN",
    "NATURAL {LEFT | RIGHT} [OUTER] JOIN",
    // non-standard joins
    "STRAIGHT_JOIN"
  ]);
  var reservedPhrases17 = expandPhrases([
    "ON DELETE",
    "ON UPDATE",
    "CHARACTER SET",
    "{ROWS | RANGE} BETWEEN",
    "IDENTIFIED BY"
  ]);
  var singlestoredb = {
    name: "singlestoredb",
    tokenizerOptions: {
      reservedSelect: reservedSelect17,
      reservedClauses: [...reservedClauses17, ...standardOnelineClauses16, ...tabularOnelineClauses16],
      reservedSetOperations: reservedSetOperations17,
      reservedJoins: reservedJoins17,
      reservedPhrases: reservedPhrases17,
      reservedKeywords: keywords17,
      reservedDataTypes: dataTypes17,
      reservedFunctionNames: functions17,
      // TODO: support _binary"some string" prefix
      stringTypes: [
        '""-qq-bs',
        "''-qq-bs",
        { quote: "''-raw", prefixes: ["B", "X"], requirePrefix: true }
      ],
      identTypes: ["``"],
      identChars: { first: "$", rest: "$", allowFirstCharNumber: true },
      variableTypes: [
        { regex: "@@?[A-Za-z0-9_$]+" },
        { quote: "``", prefixes: ["@"], requirePrefix: true }
      ],
      lineCommentTypes: ["--", "#"],
      operators: [
        ":=",
        "&",
        "|",
        "^",
        "~",
        "<<",
        ">>",
        "<=>",
        "&&",
        "||",
        "::",
        "::$",
        "::%",
        ":>",
        "!:>",
        "*.*"
        // Not actually an operator
      ],
      postProcess: postProcess2
    },
    formatOptions: {
      alwaysDenseOperators: ["::", "::$", "::%"],
      onelineClauses: [...standardOnelineClauses16, ...tabularOnelineClauses16],
      tabularOnelineClauses: tabularOnelineClauses16
    }
  };
  var functions18 = [
    // https://docs.snowflake.com/en/sql-reference-functions.html
    //
    // https://docs.snowflake.com/en/sql-reference/functions-all.html
    // 1. run in console on this page: $x('//tbody/tr/*[1]//a/span/text()').map(x => x.nodeValue)
    // 2. split all lines that contain ',' or '/' into multiple lines
    // 3. remove all '— Deprecated' parts from the strings
    // 4. delete all strings that end with '<object_type>', they are already covered in the list
    // 5. remove all strings that contain '[', they are operators not functions
    // 6. fix all values that contain '*'
    // 7. delete operatos ':', '::', '||'
    //
    // Steps 1-5 can be combined by the following script in the developer console:
    // $x('//tbody/tr/*[1]//a/span/text()').map(x => x.nodeValue) // Step 1
    //   .map(x => x.split(x.includes(',') ? ',' : '/')).flat().map(x => x.trim()) // Step 2
    //   .map(x => x.replace('— Deprecated', '')) // Step 3
    //   .filter(x => !x.endsWith('<object_type>')) // Step 4
    //   .filter(x => !x.includes('[')) // Step 5
    "ABS",
    "ACOS",
    "ACOSH",
    "ADD_MONTHS",
    "ALL_USER_NAMES",
    "ANY_VALUE",
    "APPROX_COUNT_DISTINCT",
    "APPROX_PERCENTILE",
    "APPROX_PERCENTILE_ACCUMULATE",
    "APPROX_PERCENTILE_COMBINE",
    "APPROX_PERCENTILE_ESTIMATE",
    "APPROX_TOP_K",
    "APPROX_TOP_K_ACCUMULATE",
    "APPROX_TOP_K_COMBINE",
    "APPROX_TOP_K_ESTIMATE",
    "APPROXIMATE_JACCARD_INDEX",
    "APPROXIMATE_SIMILARITY",
    "ARRAY_AGG",
    "ARRAY_APPEND",
    "ARRAY_CAT",
    "ARRAY_COMPACT",
    "ARRAY_CONSTRUCT",
    "ARRAY_CONSTRUCT_COMPACT",
    "ARRAY_CONTAINS",
    "ARRAY_INSERT",
    "ARRAY_INTERSECTION",
    "ARRAY_POSITION",
    "ARRAY_PREPEND",
    "ARRAY_SIZE",
    "ARRAY_SLICE",
    "ARRAY_TO_STRING",
    "ARRAY_UNION_AGG",
    "ARRAY_UNIQUE_AGG",
    "ARRAYS_OVERLAP",
    "AS_ARRAY",
    "AS_BINARY",
    "AS_BOOLEAN",
    "AS_CHAR",
    "AS_VARCHAR",
    "AS_DATE",
    "AS_DECIMAL",
    "AS_NUMBER",
    "AS_DOUBLE",
    "AS_REAL",
    "AS_INTEGER",
    "AS_OBJECT",
    "AS_TIME",
    "AS_TIMESTAMP_LTZ",
    "AS_TIMESTAMP_NTZ",
    "AS_TIMESTAMP_TZ",
    "ASCII",
    "ASIN",
    "ASINH",
    "ATAN",
    "ATAN2",
    "ATANH",
    "AUTO_REFRESH_REGISTRATION_HISTORY",
    "AUTOMATIC_CLUSTERING_HISTORY",
    "AVG",
    "BASE64_DECODE_BINARY",
    "BASE64_DECODE_STRING",
    "BASE64_ENCODE",
    "BIT_LENGTH",
    "BITAND",
    "BITAND_AGG",
    "BITMAP_BIT_POSITION",
    "BITMAP_BUCKET_NUMBER",
    "BITMAP_CONSTRUCT_AGG",
    "BITMAP_COUNT",
    "BITMAP_OR_AGG",
    "BITNOT",
    "BITOR",
    "BITOR_AGG",
    "BITSHIFTLEFT",
    "BITSHIFTRIGHT",
    "BITXOR",
    "BITXOR_AGG",
    "BOOLAND",
    "BOOLAND_AGG",
    "BOOLNOT",
    "BOOLOR",
    "BOOLOR_AGG",
    "BOOLXOR",
    "BOOLXOR_AGG",
    "BUILD_SCOPED_FILE_URL",
    "BUILD_STAGE_FILE_URL",
    "CASE",
    "CAST",
    "CBRT",
    "CEIL",
    "CHARINDEX",
    "CHECK_JSON",
    "CHECK_XML",
    "CHR",
    "CHAR",
    "COALESCE",
    "COLLATE",
    "COLLATION",
    "COMPLETE_TASK_GRAPHS",
    "COMPRESS",
    "CONCAT",
    "CONCAT_WS",
    "CONDITIONAL_CHANGE_EVENT",
    "CONDITIONAL_TRUE_EVENT",
    "CONTAINS",
    "CONVERT_TIMEZONE",
    "COPY_HISTORY",
    "CORR",
    "COS",
    "COSH",
    "COT",
    "COUNT",
    "COUNT_IF",
    "COVAR_POP",
    "COVAR_SAMP",
    "CUME_DIST",
    "CURRENT_ACCOUNT",
    "CURRENT_AVAILABLE_ROLES",
    "CURRENT_CLIENT",
    "CURRENT_DATABASE",
    "CURRENT_DATE",
    "CURRENT_IP_ADDRESS",
    "CURRENT_REGION",
    "CURRENT_ROLE",
    "CURRENT_SCHEMA",
    "CURRENT_SCHEMAS",
    "CURRENT_SECONDARY_ROLES",
    "CURRENT_SESSION",
    "CURRENT_STATEMENT",
    "CURRENT_TASK_GRAPHS",
    "CURRENT_TIME",
    "CURRENT_TIMESTAMP",
    "CURRENT_TRANSACTION",
    "CURRENT_USER",
    "CURRENT_VERSION",
    "CURRENT_WAREHOUSE",
    "DATA_TRANSFER_HISTORY",
    "DATABASE_REFRESH_HISTORY",
    "DATABASE_REFRESH_PROGRESS",
    "DATABASE_REFRESH_PROGRESS_BY_JOB",
    "DATABASE_STORAGE_USAGE_HISTORY",
    "DATE_FROM_PARTS",
    "DATE_PART",
    "DATE_TRUNC",
    "DATEADD",
    "DATEDIFF",
    "DAYNAME",
    "DECODE",
    "DECOMPRESS_BINARY",
    "DECOMPRESS_STRING",
    "DECRYPT",
    "DECRYPT_RAW",
    "DEGREES",
    "DENSE_RANK",
    "DIV0",
    "EDITDISTANCE",
    "ENCRYPT",
    "ENCRYPT_RAW",
    "ENDSWITH",
    "EQUAL_NULL",
    "EXP",
    "EXPLAIN_JSON",
    "EXTERNAL_FUNCTIONS_HISTORY",
    "EXTERNAL_TABLE_FILES",
    "EXTERNAL_TABLE_FILE_REGISTRATION_HISTORY",
    "EXTRACT",
    "EXTRACT_SEMANTIC_CATEGORIES",
    "FACTORIAL",
    "FIRST_VALUE",
    "FLATTEN",
    "FLOOR",
    "GENERATE_COLUMN_DESCRIPTION",
    "GENERATOR",
    "GET",
    "GET_ABSOLUTE_PATH",
    "GET_DDL",
    "GET_IGNORE_CASE",
    "GET_OBJECT_REFERENCES",
    "GET_PATH",
    "GET_PRESIGNED_URL",
    "GET_RELATIVE_PATH",
    "GET_STAGE_LOCATION",
    "GETBIT",
    "GREATEST",
    "GROUPING",
    "GROUPING_ID",
    "HASH",
    "HASH_AGG",
    "HAVERSINE",
    "HEX_DECODE_BINARY",
    "HEX_DECODE_STRING",
    "HEX_ENCODE",
    "HLL",
    "HLL_ACCUMULATE",
    "HLL_COMBINE",
    "HLL_ESTIMATE",
    "HLL_EXPORT",
    "HLL_IMPORT",
    "HOUR",
    "MINUTE",
    "SECOND",
    "IFF",
    "IFNULL",
    "ILIKE",
    "ILIKE ANY",
    "INFER_SCHEMA",
    "INITCAP",
    "INSERT",
    "INVOKER_ROLE",
    "INVOKER_SHARE",
    "IS_ARRAY",
    "IS_BINARY",
    "IS_BOOLEAN",
    "IS_CHAR",
    "IS_VARCHAR",
    "IS_DATE",
    "IS_DATE_VALUE",
    "IS_DECIMAL",
    "IS_DOUBLE",
    "IS_REAL",
    "IS_GRANTED_TO_INVOKER_ROLE",
    "IS_INTEGER",
    "IS_NULL_VALUE",
    "IS_OBJECT",
    "IS_ROLE_IN_SESSION",
    "IS_TIME",
    "IS_TIMESTAMP_LTZ",
    "IS_TIMESTAMP_NTZ",
    "IS_TIMESTAMP_TZ",
    "JAROWINKLER_SIMILARITY",
    "JSON_EXTRACT_PATH_TEXT",
    "KURTOSIS",
    "LAG",
    "LAST_DAY",
    "LAST_QUERY_ID",
    "LAST_TRANSACTION",
    "LAST_VALUE",
    "LEAD",
    "LEAST",
    "LEFT",
    "LENGTH",
    "LEN",
    "LIKE",
    "LIKE ALL",
    "LIKE ANY",
    "LISTAGG",
    "LN",
    "LOCALTIME",
    "LOCALTIMESTAMP",
    "LOG",
    "LOGIN_HISTORY",
    "LOGIN_HISTORY_BY_USER",
    "LOWER",
    "LPAD",
    "LTRIM",
    "MATERIALIZED_VIEW_REFRESH_HISTORY",
    "MD5",
    "MD5_HEX",
    "MD5_BINARY",
    "MD5_NUMBER \u2014 Obsoleted",
    "MD5_NUMBER_LOWER64",
    "MD5_NUMBER_UPPER64",
    "MEDIAN",
    "MIN",
    "MAX",
    "MINHASH",
    "MINHASH_COMBINE",
    "MOD",
    "MODE",
    "MONTHNAME",
    "MONTHS_BETWEEN",
    "NEXT_DAY",
    "NORMAL",
    "NTH_VALUE",
    "NTILE",
    "NULLIF",
    "NULLIFZERO",
    "NVL",
    "NVL2",
    "OBJECT_AGG",
    "OBJECT_CONSTRUCT",
    "OBJECT_CONSTRUCT_KEEP_NULL",
    "OBJECT_DELETE",
    "OBJECT_INSERT",
    "OBJECT_KEYS",
    "OBJECT_PICK",
    "OCTET_LENGTH",
    "PARSE_IP",
    "PARSE_JSON",
    "PARSE_URL",
    "PARSE_XML",
    "PERCENT_RANK",
    "PERCENTILE_CONT",
    "PERCENTILE_DISC",
    "PI",
    "PIPE_USAGE_HISTORY",
    "POLICY_CONTEXT",
    "POLICY_REFERENCES",
    "POSITION",
    "POW",
    "POWER",
    "PREVIOUS_DAY",
    "QUERY_ACCELERATION_HISTORY",
    "QUERY_HISTORY",
    "QUERY_HISTORY_BY_SESSION",
    "QUERY_HISTORY_BY_USER",
    "QUERY_HISTORY_BY_WAREHOUSE",
    "RADIANS",
    "RANDOM",
    "RANDSTR",
    "RANK",
    "RATIO_TO_REPORT",
    "REGEXP",
    "REGEXP_COUNT",
    "REGEXP_INSTR",
    "REGEXP_LIKE",
    "REGEXP_REPLACE",
    "REGEXP_SUBSTR",
    "REGEXP_SUBSTR_ALL",
    "REGR_AVGX",
    "REGR_AVGY",
    "REGR_COUNT",
    "REGR_INTERCEPT",
    "REGR_R2",
    "REGR_SLOPE",
    "REGR_SXX",
    "REGR_SXY",
    "REGR_SYY",
    "REGR_VALX",
    "REGR_VALY",
    "REPEAT",
    "REPLACE",
    "REPLICATION_GROUP_REFRESH_HISTORY",
    "REPLICATION_GROUP_REFRESH_PROGRESS",
    "REPLICATION_GROUP_REFRESH_PROGRESS_BY_JOB",
    "REPLICATION_GROUP_USAGE_HISTORY",
    "REPLICATION_USAGE_HISTORY",
    "REST_EVENT_HISTORY",
    "RESULT_SCAN",
    "REVERSE",
    "RIGHT",
    "RLIKE",
    "ROUND",
    "ROW_NUMBER",
    "RPAD",
    "RTRIM",
    "RTRIMMED_LENGTH",
    "SEARCH_OPTIMIZATION_HISTORY",
    "SEQ1",
    "SEQ2",
    "SEQ4",
    "SEQ8",
    "SERVERLESS_TASK_HISTORY",
    "SHA1",
    "SHA1_HEX",
    "SHA1_BINARY",
    "SHA2",
    "SHA2_HEX",
    "SHA2_BINARY",
    "SIGN",
    "SIN",
    "SINH",
    "SKEW",
    "SOUNDEX",
    "SPACE",
    "SPLIT",
    "SPLIT_PART",
    "SPLIT_TO_TABLE",
    "SQRT",
    "SQUARE",
    "ST_AREA",
    "ST_ASEWKB",
    "ST_ASEWKT",
    "ST_ASGEOJSON",
    "ST_ASWKB",
    "ST_ASBINARY",
    "ST_ASWKT",
    "ST_ASTEXT",
    "ST_AZIMUTH",
    "ST_CENTROID",
    "ST_COLLECT",
    "ST_CONTAINS",
    "ST_COVEREDBY",
    "ST_COVERS",
    "ST_DIFFERENCE",
    "ST_DIMENSION",
    "ST_DISJOINT",
    "ST_DISTANCE",
    "ST_DWITHIN",
    "ST_ENDPOINT",
    "ST_ENVELOPE",
    "ST_GEOGFROMGEOHASH",
    "ST_GEOGPOINTFROMGEOHASH",
    "ST_GEOGRAPHYFROMWKB",
    "ST_GEOGRAPHYFROMWKT",
    "ST_GEOHASH",
    "ST_GEOMETRYFROMWKB",
    "ST_GEOMETRYFROMWKT",
    "ST_HAUSDORFFDISTANCE",
    "ST_INTERSECTION",
    "ST_INTERSECTS",
    "ST_LENGTH",
    "ST_MAKEGEOMPOINT",
    "ST_GEOM_POINT",
    "ST_MAKELINE",
    "ST_MAKEPOINT",
    "ST_POINT",
    "ST_MAKEPOLYGON",
    "ST_POLYGON",
    "ST_NPOINTS",
    "ST_NUMPOINTS",
    "ST_PERIMETER",
    "ST_POINTN",
    "ST_SETSRID",
    "ST_SIMPLIFY",
    "ST_SRID",
    "ST_STARTPOINT",
    "ST_SYMDIFFERENCE",
    "ST_UNION",
    "ST_WITHIN",
    "ST_X",
    "ST_XMAX",
    "ST_XMIN",
    "ST_Y",
    "ST_YMAX",
    "ST_YMIN",
    "STAGE_DIRECTORY_FILE_REGISTRATION_HISTORY",
    "STAGE_STORAGE_USAGE_HISTORY",
    "STARTSWITH",
    "STDDEV",
    "STDDEV_POP",
    "STDDEV_SAMP",
    "STRIP_NULL_VALUE",
    "STRTOK",
    "STRTOK_SPLIT_TO_TABLE",
    "STRTOK_TO_ARRAY",
    "SUBSTR",
    "SUBSTRING",
    "SUM",
    "SYSDATE",
    "SYSTEM$ABORT_SESSION",
    "SYSTEM$ABORT_TRANSACTION",
    "SYSTEM$AUTHORIZE_PRIVATELINK",
    "SYSTEM$AUTHORIZE_STAGE_PRIVATELINK_ACCESS",
    "SYSTEM$BEHAVIOR_CHANGE_BUNDLE_STATUS",
    "SYSTEM$CANCEL_ALL_QUERIES",
    "SYSTEM$CANCEL_QUERY",
    "SYSTEM$CLUSTERING_DEPTH",
    "SYSTEM$CLUSTERING_INFORMATION",
    "SYSTEM$CLUSTERING_RATIO ",
    "SYSTEM$CURRENT_USER_TASK_NAME",
    "SYSTEM$DATABASE_REFRESH_HISTORY ",
    "SYSTEM$DATABASE_REFRESH_PROGRESS",
    "SYSTEM$DATABASE_REFRESH_PROGRESS_BY_JOB ",
    "SYSTEM$DISABLE_BEHAVIOR_CHANGE_BUNDLE",
    "SYSTEM$DISABLE_DATABASE_REPLICATION",
    "SYSTEM$ENABLE_BEHAVIOR_CHANGE_BUNDLE",
    "SYSTEM$ESTIMATE_QUERY_ACCELERATION",
    "SYSTEM$ESTIMATE_SEARCH_OPTIMIZATION_COSTS",
    "SYSTEM$EXPLAIN_JSON_TO_TEXT",
    "SYSTEM$EXPLAIN_PLAN_JSON",
    "SYSTEM$EXTERNAL_TABLE_PIPE_STATUS",
    "SYSTEM$GENERATE_SAML_CSR",
    "SYSTEM$GENERATE_SCIM_ACCESS_TOKEN",
    "SYSTEM$GET_AWS_SNS_IAM_POLICY",
    "SYSTEM$GET_PREDECESSOR_RETURN_VALUE",
    "SYSTEM$GET_PRIVATELINK",
    "SYSTEM$GET_PRIVATELINK_AUTHORIZED_ENDPOINTS",
    "SYSTEM$GET_PRIVATELINK_CONFIG",
    "SYSTEM$GET_SNOWFLAKE_PLATFORM_INFO",
    "SYSTEM$GET_TAG",
    "SYSTEM$GET_TAG_ALLOWED_VALUES",
    "SYSTEM$GET_TAG_ON_CURRENT_COLUMN",
    "SYSTEM$GET_TAG_ON_CURRENT_TABLE",
    "SYSTEM$GLOBAL_ACCOUNT_SET_PARAMETER",
    "SYSTEM$LAST_CHANGE_COMMIT_TIME",
    "SYSTEM$LINK_ACCOUNT_OBJECTS_BY_NAME",
    "SYSTEM$MIGRATE_SAML_IDP_REGISTRATION",
    "SYSTEM$PIPE_FORCE_RESUME",
    "SYSTEM$PIPE_STATUS",
    "SYSTEM$REVOKE_PRIVATELINK",
    "SYSTEM$REVOKE_STAGE_PRIVATELINK_ACCESS",
    "SYSTEM$SET_RETURN_VALUE",
    "SYSTEM$SHOW_OAUTH_CLIENT_SECRETS",
    "SYSTEM$STREAM_GET_TABLE_TIMESTAMP",
    "SYSTEM$STREAM_HAS_DATA",
    "SYSTEM$TASK_DEPENDENTS_ENABLE",
    "SYSTEM$TYPEOF",
    "SYSTEM$USER_TASK_CANCEL_ONGOING_EXECUTIONS",
    "SYSTEM$VERIFY_EXTERNAL_OAUTH_TOKEN",
    "SYSTEM$WAIT",
    "SYSTEM$WHITELIST",
    "SYSTEM$WHITELIST_PRIVATELINK",
    "TAG_REFERENCES",
    "TAG_REFERENCES_ALL_COLUMNS",
    "TAG_REFERENCES_WITH_LINEAGE",
    "TAN",
    "TANH",
    "TASK_DEPENDENTS",
    "TASK_HISTORY",
    "TIME_FROM_PARTS",
    "TIME_SLICE",
    "TIMEADD",
    "TIMEDIFF",
    "TIMESTAMP_FROM_PARTS",
    "TIMESTAMPADD",
    "TIMESTAMPDIFF",
    "TO_ARRAY",
    "TO_BINARY",
    "TO_BOOLEAN",
    "TO_CHAR",
    "TO_VARCHAR",
    "TO_DATE",
    "DATE",
    "TO_DECIMAL",
    "TO_NUMBER",
    "TO_NUMERIC",
    "TO_DOUBLE",
    "TO_GEOGRAPHY",
    "TO_GEOMETRY",
    "TO_JSON",
    "TO_OBJECT",
    "TO_TIME",
    "TIME",
    "TO_TIMESTAMP",
    "TO_TIMESTAMP_LTZ",
    "TO_TIMESTAMP_NTZ",
    "TO_TIMESTAMP_TZ",
    "TO_VARIANT",
    "TO_XML",
    "TRANSLATE",
    "TRIM",
    "TRUNCATE",
    "TRUNC",
    "TRUNC",
    "TRY_BASE64_DECODE_BINARY",
    "TRY_BASE64_DECODE_STRING",
    "TRY_CAST",
    "TRY_HEX_DECODE_BINARY",
    "TRY_HEX_DECODE_STRING",
    "TRY_PARSE_JSON",
    "TRY_TO_BINARY",
    "TRY_TO_BOOLEAN",
    "TRY_TO_DATE",
    "TRY_TO_DECIMAL",
    "TRY_TO_NUMBER",
    "TRY_TO_NUMERIC",
    "TRY_TO_DOUBLE",
    "TRY_TO_GEOGRAPHY",
    "TRY_TO_GEOMETRY",
    "TRY_TO_TIME",
    "TRY_TO_TIMESTAMP",
    "TRY_TO_TIMESTAMP_LTZ",
    "TRY_TO_TIMESTAMP_NTZ",
    "TRY_TO_TIMESTAMP_TZ",
    "TYPEOF",
    "UNICODE",
    "UNIFORM",
    "UPPER",
    "UUID_STRING",
    "VALIDATE",
    "VALIDATE_PIPE_LOAD",
    "VAR_POP",
    "VAR_SAMP",
    "VARIANCE",
    "VARIANCE_SAMP",
    "VARIANCE_POP",
    "WAREHOUSE_LOAD_HISTORY",
    "WAREHOUSE_METERING_HISTORY",
    "WIDTH_BUCKET",
    "XMLGET",
    "YEAR",
    "YEAROFWEEK",
    "YEAROFWEEKISO",
    "DAY",
    "DAYOFMONTH",
    "DAYOFWEEK",
    "DAYOFWEEKISO",
    "DAYOFYEAR",
    "WEEK",
    "WEEK",
    "WEEKOFYEAR",
    "WEEKISO",
    "MONTH",
    "QUARTER",
    "ZEROIFNULL",
    "ZIPF"
  ];
  var keywords18 = [
    // https://docs.snowflake.com/en/sql-reference/reserved-keywords.html
    //
    // run in console on this page: $x('//tbody/tr/*[1]/p/text()').map(x => x.nodeValue)
    "ACCOUNT",
    "ALL",
    "ALTER",
    "AND",
    "ANY",
    "AS",
    "BETWEEN",
    "BY",
    "CASE",
    "CAST",
    "CHECK",
    "COLUMN",
    "CONNECT",
    "CONNECTION",
    "CONSTRAINT",
    "CREATE",
    "CROSS",
    "CURRENT",
    "CURRENT_DATE",
    "CURRENT_TIME",
    "CURRENT_TIMESTAMP",
    "CURRENT_USER",
    "DATABASE",
    "DELETE",
    "DISTINCT",
    "DROP",
    "ELSE",
    "EXISTS",
    "FALSE",
    "FOLLOWING",
    "FOR",
    "FROM",
    "FULL",
    "GRANT",
    "GROUP",
    "GSCLUSTER",
    "HAVING",
    "ILIKE",
    "IN",
    "INCREMENT",
    "INNER",
    "INSERT",
    "INTERSECT",
    "INTO",
    "IS",
    "ISSUE",
    "JOIN",
    "LATERAL",
    "LEFT",
    "LIKE",
    "LOCALTIME",
    "LOCALTIMESTAMP",
    "MINUS",
    "NATURAL",
    "NOT",
    "NULL",
    "OF",
    "ON",
    "OR",
    "ORDER",
    "ORGANIZATION",
    "QUALIFY",
    "REGEXP",
    "REVOKE",
    "RIGHT",
    "RLIKE",
    "ROW",
    "ROWS",
    "SAMPLE",
    "SCHEMA",
    "SELECT",
    "SET",
    "SOME",
    "START",
    "TABLE",
    "TABLESAMPLE",
    "THEN",
    "TO",
    "TRIGGER",
    "TRUE",
    "TRY_CAST",
    "UNION",
    "UNIQUE",
    "UPDATE",
    "USING",
    "VALUES",
    "VIEW",
    "WHEN",
    "WHENEVER",
    "WHERE",
    "WITH",
    // These are definitely keywords, but haven't found a definite list in the docs
    "COMMENT"
  ];
  var dataTypes18 = [
    "NUMBER",
    "DECIMAL",
    "NUMERIC",
    "INT",
    "INTEGER",
    "BIGINT",
    "SMALLINT",
    "TINYINT",
    "BYTEINT",
    "FLOAT",
    "FLOAT4",
    "FLOAT8",
    "DOUBLE",
    "DOUBLE PRECISION",
    "REAL",
    "VARCHAR",
    "CHAR",
    "CHARACTER",
    "STRING",
    "TEXT",
    "BINARY",
    "VARBINARY",
    "BOOLEAN",
    "DATE",
    "DATETIME",
    "TIME",
    "TIMESTAMP",
    "TIMESTAMP_LTZ",
    "TIMESTAMP_NTZ",
    "TIMESTAMP",
    "TIMESTAMP_TZ",
    "VARIANT",
    "OBJECT",
    "ARRAY",
    "GEOGRAPHY",
    "GEOMETRY"
  ];
  var reservedSelect18 = expandPhrases(["SELECT [ALL | DISTINCT]"]);
  var reservedClauses18 = expandPhrases([
    // queries
    "WITH [RECURSIVE]",
    "FROM",
    "WHERE",
    "GROUP BY",
    "HAVING",
    "PARTITION BY",
    "ORDER BY",
    "QUALIFY",
    "LIMIT",
    "OFFSET",
    "FETCH [FIRST | NEXT]",
    // Data manipulation
    // - insert:
    "INSERT [OVERWRITE] [ALL INTO | INTO | ALL | FIRST]",
    "{THEN | ELSE} INTO",
    "VALUES",
    // - update:
    "SET",
    "CLUSTER BY",
    "[WITH] {MASKING POLICY | TAG | ROW ACCESS POLICY}",
    "COPY GRANTS",
    "USING TEMPLATE",
    "MERGE INTO",
    "WHEN MATCHED [AND]",
    "THEN {UPDATE SET | DELETE}",
    "WHEN NOT MATCHED THEN INSERT"
  ]);
  var standardOnelineClauses17 = expandPhrases([
    "CREATE [OR REPLACE] [VOLATILE] TABLE [IF NOT EXISTS]",
    "CREATE [OR REPLACE] [LOCAL | GLOBAL] {TEMP|TEMPORARY} TABLE [IF NOT EXISTS]"
  ]);
  var tabularOnelineClauses17 = expandPhrases([
    // - create:
    "CREATE [OR REPLACE] [SECURE] [RECURSIVE] VIEW [IF NOT EXISTS]",
    // - update:
    "UPDATE",
    // - delete:
    "DELETE FROM",
    // - drop table:
    "DROP TABLE [IF EXISTS]",
    // - alter table:
    "ALTER TABLE [IF EXISTS]",
    "RENAME TO",
    "SWAP WITH",
    "[SUSPEND | RESUME] RECLUSTER",
    "DROP CLUSTERING KEY",
    "ADD [COLUMN]",
    "RENAME COLUMN",
    "{ALTER | MODIFY} [COLUMN]",
    "DROP [COLUMN]",
    "{ADD | ALTER | MODIFY | DROP} [CONSTRAINT]",
    "RENAME CONSTRAINT",
    "{ADD | DROP} SEARCH OPTIMIZATION",
    "{SET | UNSET} TAG",
    // Actually TAG is optional, but that conflicts with UPDATE..SET statement
    "{ADD | DROP} ROW ACCESS POLICY",
    "DROP ALL ROW ACCESS POLICIES",
    "{SET | DROP} DEFAULT",
    // for alter column
    "{SET | DROP} NOT NULL",
    // for alter column
    "[SET DATA] TYPE",
    // for alter column
    "UNSET COMMENT",
    // for alter column
    "{SET | UNSET} MASKING POLICY",
    // for alter column
    // - truncate:
    "TRUNCATE [TABLE] [IF EXISTS]",
    // other
    // https://docs.snowflake.com/en/sql-reference/sql-all.html
    //
    // 1. run in console on this page: $x('//tbody/tr/*[1]//a/span/text()').map(x => x.nodeValue)
    // 2. delete all lines that contain a sting like '(.*)', they are already covered in the list
    // 3. delete all lines that contain a sting like '<.*>', they are already covered in the list
    // 4. delete all lines that contain '…', they are part of a regex statement that can't be covered here
    // 5. Manually add 'COPY INTO'
    // 6. Remove all lines that are already in `reservedClauses`
    //
    // Steps 1-4 can be combined by the following script in the developer console:
    // $x('//tbody/tr/*[1]//a/span/text()').map(x => x.nodeValue) // Step 1
    //   filter(x => !x.match(/\(.*\)/) && !x.match(/…/) && !x.match(/<.*>/)) // Step 2-4
    "ALTER ACCOUNT",
    "ALTER API INTEGRATION",
    "ALTER CONNECTION",
    "ALTER DATABASE",
    "ALTER EXTERNAL TABLE",
    "ALTER FAILOVER GROUP",
    "ALTER FILE FORMAT",
    "ALTER FUNCTION",
    "ALTER INTEGRATION",
    "ALTER MASKING POLICY",
    "ALTER MATERIALIZED VIEW",
    "ALTER NETWORK POLICY",
    "ALTER NOTIFICATION INTEGRATION",
    "ALTER PIPE",
    "ALTER PROCEDURE",
    "ALTER REPLICATION GROUP",
    "ALTER RESOURCE MONITOR",
    "ALTER ROLE",
    "ALTER ROW ACCESS POLICY",
    "ALTER SCHEMA",
    "ALTER SECURITY INTEGRATION",
    "ALTER SEQUENCE",
    "ALTER SESSION",
    "ALTER SESSION POLICY",
    "ALTER SHARE",
    "ALTER STAGE",
    "ALTER STORAGE INTEGRATION",
    "ALTER STREAM",
    "ALTER TAG",
    "ALTER TASK",
    "ALTER USER",
    "ALTER VIEW",
    "ALTER WAREHOUSE",
    "BEGIN",
    "CALL",
    "COMMIT",
    "COPY INTO",
    "CREATE ACCOUNT",
    "CREATE API INTEGRATION",
    "CREATE CONNECTION",
    "CREATE DATABASE",
    "CREATE EXTERNAL FUNCTION",
    "CREATE EXTERNAL TABLE",
    "CREATE FAILOVER GROUP",
    "CREATE FILE FORMAT",
    "CREATE FUNCTION",
    "CREATE INTEGRATION",
    "CREATE MANAGED ACCOUNT",
    "CREATE MASKING POLICY",
    "CREATE MATERIALIZED VIEW",
    "CREATE NETWORK POLICY",
    "CREATE NOTIFICATION INTEGRATION",
    "CREATE PIPE",
    "CREATE PROCEDURE",
    "CREATE REPLICATION GROUP",
    "CREATE RESOURCE MONITOR",
    "CREATE ROLE",
    "CREATE ROW ACCESS POLICY",
    "CREATE SCHEMA",
    "CREATE SECURITY INTEGRATION",
    "CREATE SEQUENCE",
    "CREATE SESSION POLICY",
    "CREATE SHARE",
    "CREATE STAGE",
    "CREATE STORAGE INTEGRATION",
    "CREATE STREAM",
    "CREATE TAG",
    "CREATE TASK",
    "CREATE USER",
    "CREATE WAREHOUSE",
    "DELETE",
    "DESCRIBE DATABASE",
    "DESCRIBE EXTERNAL TABLE",
    "DESCRIBE FILE FORMAT",
    "DESCRIBE FUNCTION",
    "DESCRIBE INTEGRATION",
    "DESCRIBE MASKING POLICY",
    "DESCRIBE MATERIALIZED VIEW",
    "DESCRIBE NETWORK POLICY",
    "DESCRIBE PIPE",
    "DESCRIBE PROCEDURE",
    "DESCRIBE RESULT",
    "DESCRIBE ROW ACCESS POLICY",
    "DESCRIBE SCHEMA",
    "DESCRIBE SEQUENCE",
    "DESCRIBE SESSION POLICY",
    "DESCRIBE SHARE",
    "DESCRIBE STAGE",
    "DESCRIBE STREAM",
    "DESCRIBE TABLE",
    "DESCRIBE TASK",
    "DESCRIBE TRANSACTION",
    "DESCRIBE USER",
    "DESCRIBE VIEW",
    "DESCRIBE WAREHOUSE",
    "DROP CONNECTION",
    "DROP DATABASE",
    "DROP EXTERNAL TABLE",
    "DROP FAILOVER GROUP",
    "DROP FILE FORMAT",
    "DROP FUNCTION",
    "DROP INTEGRATION",
    "DROP MANAGED ACCOUNT",
    "DROP MASKING POLICY",
    "DROP MATERIALIZED VIEW",
    "DROP NETWORK POLICY",
    "DROP PIPE",
    "DROP PROCEDURE",
    "DROP REPLICATION GROUP",
    "DROP RESOURCE MONITOR",
    "DROP ROLE",
    "DROP ROW ACCESS POLICY",
    "DROP SCHEMA",
    "DROP SEQUENCE",
    "DROP SESSION POLICY",
    "DROP SHARE",
    "DROP STAGE",
    "DROP STREAM",
    "DROP TAG",
    "DROP TASK",
    "DROP USER",
    "DROP VIEW",
    "DROP WAREHOUSE",
    "EXECUTE IMMEDIATE",
    "EXECUTE TASK",
    "EXPLAIN",
    "GET",
    "GRANT OWNERSHIP",
    "GRANT ROLE",
    "INSERT",
    "LIST",
    "MERGE",
    "PUT",
    "REMOVE",
    "REVOKE ROLE",
    "ROLLBACK",
    "SHOW COLUMNS",
    "SHOW CONNECTIONS",
    "SHOW DATABASES",
    "SHOW DATABASES IN FAILOVER GROUP",
    "SHOW DATABASES IN REPLICATION GROUP",
    "SHOW DELEGATED AUTHORIZATIONS",
    "SHOW EXTERNAL FUNCTIONS",
    "SHOW EXTERNAL TABLES",
    "SHOW FAILOVER GROUPS",
    "SHOW FILE FORMATS",
    "SHOW FUNCTIONS",
    "SHOW GLOBAL ACCOUNTS",
    "SHOW GRANTS",
    "SHOW INTEGRATIONS",
    "SHOW LOCKS",
    "SHOW MANAGED ACCOUNTS",
    "SHOW MASKING POLICIES",
    "SHOW MATERIALIZED VIEWS",
    "SHOW NETWORK POLICIES",
    "SHOW OBJECTS",
    "SHOW ORGANIZATION ACCOUNTS",
    "SHOW PARAMETERS",
    "SHOW PIPES",
    "SHOW PRIMARY KEYS",
    "SHOW PROCEDURES",
    "SHOW REGIONS",
    "SHOW REPLICATION ACCOUNTS",
    "SHOW REPLICATION DATABASES",
    "SHOW REPLICATION GROUPS",
    "SHOW RESOURCE MONITORS",
    "SHOW ROLES",
    "SHOW ROW ACCESS POLICIES",
    "SHOW SCHEMAS",
    "SHOW SEQUENCES",
    "SHOW SESSION POLICIES",
    "SHOW SHARES",
    "SHOW SHARES IN FAILOVER GROUP",
    "SHOW SHARES IN REPLICATION GROUP",
    "SHOW STAGES",
    "SHOW STREAMS",
    "SHOW TABLES",
    "SHOW TAGS",
    "SHOW TASKS",
    "SHOW TRANSACTIONS",
    "SHOW USER FUNCTIONS",
    "SHOW USERS",
    "SHOW VARIABLES",
    "SHOW VIEWS",
    "SHOW WAREHOUSES",
    "TRUNCATE MATERIALIZED VIEW",
    "UNDROP DATABASE",
    "UNDROP SCHEMA",
    "UNDROP TABLE",
    "UNDROP TAG",
    "UNSET",
    "USE DATABASE",
    "USE ROLE",
    "USE SCHEMA",
    "USE SECONDARY ROLES",
    "USE WAREHOUSE"
  ]);
  var reservedSetOperations18 = expandPhrases(["UNION [ALL]", "MINUS", "EXCEPT", "INTERSECT"]);
  var reservedJoins18 = expandPhrases([
    "[INNER] JOIN",
    "[NATURAL] {LEFT | RIGHT | FULL} [OUTER] JOIN",
    "{CROSS | NATURAL} JOIN"
  ]);
  var reservedPhrases18 = expandPhrases([
    "{ROWS | RANGE} BETWEEN",
    "ON {UPDATE | DELETE} [SET NULL | SET DEFAULT]"
  ]);
  var snowflake = {
    name: "snowflake",
    tokenizerOptions: {
      reservedSelect: reservedSelect18,
      reservedClauses: [...reservedClauses18, ...standardOnelineClauses17, ...tabularOnelineClauses17],
      reservedSetOperations: reservedSetOperations18,
      reservedJoins: reservedJoins18,
      reservedPhrases: reservedPhrases18,
      reservedKeywords: keywords18,
      reservedDataTypes: dataTypes18,
      reservedFunctionNames: functions18,
      stringTypes: ["$$", `''-qq-bs`],
      identTypes: ['""-qq'],
      variableTypes: [
        // for accessing columns at certain positons in the table
        { regex: "[$][1-9]\\d*" },
        // identifier style syntax
        { regex: "[$][_a-zA-Z][_a-zA-Z0-9$]*" }
      ],
      extraParens: ["[]"],
      identChars: { rest: "$" },
      lineCommentTypes: ["--", "//"],
      operators: [
        // Modulo
        "%",
        // Type cast
        "::",
        // String concat
        "||",
        // Generators: https://docs.snowflake.com/en/sql-reference/functions/generator.html#generator
        "=>"
      ],
      propertyAccessOperators: [":"]
    },
    formatOptions: {
      alwaysDenseOperators: ["::"],
      onelineClauses: [...standardOnelineClauses17, ...tabularOnelineClauses17],
      tabularOnelineClauses: tabularOnelineClauses17
    }
  };
  var last = (arr) => arr[arr.length - 1];
  var sortByLengthDesc = (strings) => strings.sort((a, b) => b.length - a.length || a.localeCompare(b));
  var equalizeWhitespace = (s) => s.replace(/\s+/gu, " ");
  var isMultiline = (text) => /\n/.test(text);
  var escapeRegExp = (string2) => string2.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  var WHITESPACE_REGEX = /\s+/uy;
  var patternToRegex = (pattern) => new RegExp(`(?:${pattern})`, "uy");
  var toCaseInsensitivePattern = (prefix) => prefix.split("").map((char) => / /gu.test(char) ? "\\s+" : `[${char.toUpperCase()}${char.toLowerCase()}]`).join("");
  var withDashes = (pattern) => pattern + "(?:-" + pattern + ")*";
  var prefixesPattern = ({ prefixes, requirePrefix }) => `(?:${prefixes.map(toCaseInsensitivePattern).join("|")}${requirePrefix ? "" : "|"})`;
  var lineComment = (lineCommentTypes) => new RegExp(`(?:${lineCommentTypes.map(escapeRegExp).join("|")}).*?(?=\r
|\r|
|$)`, "uy");
  var parenthesis = (kind, extraParens = []) => {
    const index = kind === "open" ? 0 : 1;
    const parens = ["()", ...extraParens].map((pair) => pair[index]);
    return patternToRegex(parens.map(escapeRegExp).join("|"));
  };
  var operator = (operators) => patternToRegex(`${sortByLengthDesc(operators).map(escapeRegExp).join("|")}`);
  var rejectIdentCharsPattern = ({ rest, dashes }) => rest || dashes ? `(?![${rest || ""}${dashes ? "-" : ""}])` : "";
  var reservedWord = (reservedKeywords, identChars = {}) => {
    if (reservedKeywords.length === 0) {
      return /^\b$/u;
    }
    const avoidIdentChars = rejectIdentCharsPattern(identChars);
    const reservedKeywordsPattern = sortByLengthDesc(reservedKeywords).map(escapeRegExp).join("|").replace(/ /gu, "\\s+");
    return new RegExp(`(?:${reservedKeywordsPattern})${avoidIdentChars}\\b`, "iuy");
  };
  var parameter = (paramTypes, pattern) => {
    if (!paramTypes.length) {
      return void 0;
    }
    const typesRegex = paramTypes.map(escapeRegExp).join("|");
    return patternToRegex(`(?:${typesRegex})(?:${pattern})`);
  };
  var buildQStringPatterns = () => {
    const specialDelimiterMap = {
      "<": ">",
      "[": "]",
      "(": ")",
      "{": "}"
    };
    const singlePattern = "{left}(?:(?!{right}').)*?{right}";
    const patternList = Object.entries(specialDelimiterMap).map(
      ([left, right]) => singlePattern.replace(/{left}/g, escapeRegExp(left)).replace(/{right}/g, escapeRegExp(right))
    );
    const specialDelimiters = escapeRegExp(Object.keys(specialDelimiterMap).join(""));
    const standardDelimiterPattern = String.raw`(?<tag>[^\s${specialDelimiters}])(?:(?!\k<tag>').)*?\k<tag>`;
    const qStringPattern = `[Qq]'(?:${standardDelimiterPattern}|${patternList.join("|")})'`;
    return qStringPattern;
  };
  var quotePatterns = {
    // - backtick quoted (using `` to escape)
    "``": "(?:`[^`]*`)+",
    // - Transact-SQL square bracket quoted (using ]] to escape)
    "[]": String.raw`(?:\[[^\]]*\])(?:\][^\]]*\])*`,
    // double-quoted
    '""-qq': String.raw`(?:"[^"]*")+`,
    // with repeated quote escapes
    '""-bs': String.raw`(?:"[^"\\]*(?:\\.[^"\\]*)*")`,
    // with backslash escapes
    '""-qq-bs': String.raw`(?:"[^"\\]*(?:\\.[^"\\]*)*")+`,
    // with repeated quote or backslash escapes
    '""-raw': String.raw`(?:"[^"]*")`,
    // no escaping
    // single-quoted
    "''-qq": String.raw`(?:'[^']*')+`,
    // with repeated quote escapes
    "''-bs": String.raw`(?:'[^'\\]*(?:\\.[^'\\]*)*')`,
    // with backslash escapes
    "''-qq-bs": String.raw`(?:'[^'\\]*(?:\\.[^'\\]*)*')+`,
    // with repeated quote or backslash escapes
    "''-raw": String.raw`(?:'[^']*')`,
    // no escaping
    // PostgreSQL dollar-quoted
    "$$": String.raw`(?<tag>\$\w*\$)[\s\S]*?\k<tag>`,
    // BigQuery '''triple-quoted''' (using \' to escape)
    "'''..'''": String.raw`'''[^\\]*?(?:\\.[^\\]*?)*?'''`,
    // BigQuery """triple-quoted""" (using \" to escape)
    '""".."""': String.raw`"""[^\\]*?(?:\\.[^\\]*?)*?"""`,
    // Hive and Spark variables: ${name}
    "{}": String.raw`(?:\{[^\}]*\})`,
    // Oracle q'' strings: q'<text>' q'|text|' ...
    "q''": buildQStringPatterns()
  };
  var singleQuotePattern = (quoteTypes) => {
    if (typeof quoteTypes === "string") {
      return quotePatterns[quoteTypes];
    } else if ("regex" in quoteTypes) {
      return quoteTypes.regex;
    } else {
      return prefixesPattern(quoteTypes) + quotePatterns[quoteTypes.quote];
    }
  };
  var variable = (varTypes) => patternToRegex(
    varTypes.map((varType) => "regex" in varType ? varType.regex : singleQuotePattern(varType)).join("|")
  );
  var stringPattern = (quoteTypes) => quoteTypes.map(singleQuotePattern).join("|");
  var string = (quoteTypes) => patternToRegex(stringPattern(quoteTypes));
  var identifier = (specialChars = {}) => patternToRegex(identifierPattern(specialChars));
  var identifierPattern = ({
    first,
    rest,
    dashes,
    allowFirstCharNumber
  } = {}) => {
    const letter = "\\p{Alphabetic}\\p{Mark}_";
    const number = "\\p{Decimal_Number}";
    const firstChars = escapeRegExp(first != null ? first : "");
    const restChars = escapeRegExp(rest != null ? rest : "");
    const pattern = allowFirstCharNumber ? `[${letter}${number}${firstChars}][${letter}${number}${restChars}]*` : `[${letter}${firstChars}][${letter}${number}${restChars}]*`;
    return dashes ? withDashes(pattern) : pattern;
  };
  function lineColFromIndex(source, index) {
    const lines = source.slice(0, index).split(/\n/);
    return { line: lines.length, col: lines[lines.length - 1].length + 1 };
  }
  var TokenizerEngine = class {
    // Current position in string
    constructor(rules, dialectName) {
      this.rules = rules;
      this.dialectName = dialectName;
      this.input = "";
      this.index = 0;
    }
    /**
     * Takes a SQL string and breaks it into tokens.
     * Each token is an object with type and value.
     *
     * @param {string} input - The SQL string
     * @returns {Token[]} output token stream
     */
    tokenize(input) {
      this.input = input;
      this.index = 0;
      const tokens = [];
      let token;
      while (this.index < this.input.length) {
        const precedingWhitespace = this.getWhitespace();
        if (this.index < this.input.length) {
          token = this.getNextToken();
          if (!token) {
            throw this.createParseError();
          }
          tokens.push(__spreadProps(__spreadValues({}, token), { precedingWhitespace }));
        }
      }
      return tokens;
    }
    createParseError() {
      const text = this.input.slice(this.index, this.index + 10);
      const { line, col } = lineColFromIndex(this.input, this.index);
      return new Error(
        `Parse error: Unexpected "${text}" at line ${line} column ${col}.
${this.dialectInfo()}`
      );
    }
    dialectInfo() {
      if (this.dialectName === "sql") {
        return `This likely happens because you're using the default "sql" dialect.
If possible, please select a more specific dialect (like sqlite, postgresql, etc).`;
      } else {
        return `SQL dialect used: "${this.dialectName}".`;
      }
    }
    getWhitespace() {
      WHITESPACE_REGEX.lastIndex = this.index;
      const matches = WHITESPACE_REGEX.exec(this.input);
      if (matches) {
        this.index += matches[0].length;
        return matches[0];
      }
      return void 0;
    }
    getNextToken() {
      for (const rule of this.rules) {
        const token = this.match(rule);
        if (token) {
          return token;
        }
      }
      return void 0;
    }
    // Attempts to match token rule regex at current position in input
    match(rule) {
      rule.regex.lastIndex = this.index;
      const matches = rule.regex.exec(this.input);
      if (matches) {
        const matchedText = matches[0];
        const token = {
          type: rule.type,
          raw: matchedText,
          text: rule.text ? rule.text(matchedText) : matchedText,
          start: this.index
        };
        if (rule.key) {
          token.key = rule.key(matchedText);
        }
        this.index += matchedText.length;
        return token;
      }
      return void 0;
    }
  };
  var START = /\/\*/uy;
  var MIDDLE = /([^/*]|\*[^/]|\/[^*])+/uy;
  var END2 = /\*\//uy;
  var NestedComment = class {
    constructor() {
      this.lastIndex = 0;
    }
    exec(input) {
      let result = "";
      let match;
      let nestLevel = 0;
      if (match = this.matchSection(START, input)) {
        result += match;
        nestLevel++;
      } else {
        return null;
      }
      while (nestLevel > 0) {
        if (match = this.matchSection(START, input)) {
          result += match;
          nestLevel++;
        } else if (match = this.matchSection(END2, input)) {
          result += match;
          nestLevel--;
        } else if (match = this.matchSection(MIDDLE, input)) {
          result += match;
        } else {
          return null;
        }
      }
      return [result];
    }
    matchSection(regex, input) {
      regex.lastIndex = this.lastIndex;
      const matches = regex.exec(input);
      if (matches) {
        this.lastIndex += matches[0].length;
      }
      return matches ? matches[0] : null;
    }
  };
  var Tokenizer = class {
    constructor(cfg, dialectName) {
      this.cfg = cfg;
      this.dialectName = dialectName;
      this.rulesBeforeParams = this.buildRulesBeforeParams(cfg);
      this.rulesAfterParams = this.buildRulesAfterParams(cfg);
    }
    tokenize(input, paramTypesOverrides) {
      const rules = [
        ...this.rulesBeforeParams,
        ...this.buildParamRules(this.cfg, paramTypesOverrides),
        ...this.rulesAfterParams
      ];
      const tokens = new TokenizerEngine(rules, this.dialectName).tokenize(input);
      return this.cfg.postProcess ? this.cfg.postProcess(tokens) : tokens;
    }
    // These rules can be cached as they only depend on
    // the Tokenizer config options specified for each SQL dialect
    buildRulesBeforeParams(cfg) {
      var _a, _b;
      return this.validRules([
        {
          type: "BLOCK_COMMENT",
          regex: /(\/\* *sql-formatter-disable *\*\/[\s\S]*?(?:\/\* *sql-formatter-enable *\*\/|$))/uy
        },
        {
          type: "BLOCK_COMMENT",
          regex: cfg.nestedBlockComments ? new NestedComment() : /(\/\*[^]*?\*\/)/uy
        },
        {
          type: "LINE_COMMENT",
          regex: lineComment((_a = cfg.lineCommentTypes) != null ? _a : ["--"])
        },
        {
          type: "QUOTED_IDENTIFIER",
          regex: string(cfg.identTypes)
        },
        {
          type: "NUMBER",
          regex: /(?:0x[0-9a-fA-F]+|0b[01]+|(?:-\s*)?[0-9]+(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+(?:\.[0-9]+)?)?)(?![\w\p{Alphabetic}])/uy
        },
        // RESERVED_PHRASE is matched before all other keyword tokens
        // to e.g. prioritize matching "TIMESTAMP WITH TIME ZONE" phrase over "WITH" clause.
        {
          type: "RESERVED_PHRASE",
          regex: reservedWord((_b = cfg.reservedPhrases) != null ? _b : [], cfg.identChars),
          text: toCanonical
        },
        {
          type: "CASE",
          regex: /CASE\b/iuy,
          text: toCanonical
        },
        {
          type: "END",
          regex: /END\b/iuy,
          text: toCanonical
        },
        {
          type: "BETWEEN",
          regex: /BETWEEN\b/iuy,
          text: toCanonical
        },
        {
          type: "LIMIT",
          regex: cfg.reservedClauses.includes("LIMIT") ? /LIMIT\b/iuy : void 0,
          text: toCanonical
        },
        {
          type: "RESERVED_CLAUSE",
          regex: reservedWord(cfg.reservedClauses, cfg.identChars),
          text: toCanonical
        },
        {
          type: "RESERVED_SELECT",
          regex: reservedWord(cfg.reservedSelect, cfg.identChars),
          text: toCanonical
        },
        {
          type: "RESERVED_SET_OPERATION",
          regex: reservedWord(cfg.reservedSetOperations, cfg.identChars),
          text: toCanonical
        },
        {
          type: "WHEN",
          regex: /WHEN\b/iuy,
          text: toCanonical
        },
        {
          type: "ELSE",
          regex: /ELSE\b/iuy,
          text: toCanonical
        },
        {
          type: "THEN",
          regex: /THEN\b/iuy,
          text: toCanonical
        },
        {
          type: "RESERVED_JOIN",
          regex: reservedWord(cfg.reservedJoins, cfg.identChars),
          text: toCanonical
        },
        {
          type: "AND",
          regex: /AND\b/iuy,
          text: toCanonical
        },
        {
          type: "OR",
          regex: /OR\b/iuy,
          text: toCanonical
        },
        {
          type: "XOR",
          regex: cfg.supportsXor ? /XOR\b/iuy : void 0,
          text: toCanonical
        },
        {
          type: "RESERVED_FUNCTION_NAME",
          regex: reservedWord(cfg.reservedFunctionNames, cfg.identChars),
          text: toCanonical
        },
        {
          type: "RESERVED_DATA_TYPE",
          regex: reservedWord(cfg.reservedDataTypes, cfg.identChars),
          text: toCanonical
        },
        {
          type: "RESERVED_KEYWORD",
          regex: reservedWord(cfg.reservedKeywords, cfg.identChars),
          text: toCanonical
        }
      ]);
    }
    // These rules can also be cached as they only depend on
    // the Tokenizer config options specified for each SQL dialect
    buildRulesAfterParams(cfg) {
      var _a, _b;
      return this.validRules([
        {
          type: "VARIABLE",
          regex: cfg.variableTypes ? variable(cfg.variableTypes) : void 0
        },
        { type: "STRING", regex: string(cfg.stringTypes) },
        {
          type: "IDENTIFIER",
          regex: identifier(cfg.identChars)
        },
        { type: "DELIMITER", regex: /[;]/uy },
        { type: "COMMA", regex: /[,]/y },
        {
          type: "OPEN_PAREN",
          regex: parenthesis("open", cfg.extraParens)
        },
        {
          type: "CLOSE_PAREN",
          regex: parenthesis("close", cfg.extraParens)
        },
        {
          type: "OPERATOR",
          regex: operator([
            // standard operators
            "+",
            "-",
            "/",
            ">",
            "<",
            "=",
            "<>",
            "<=",
            ">=",
            "!=",
            ...(_a = cfg.operators) != null ? _a : []
          ])
        },
        { type: "ASTERISK", regex: /[*]/uy },
        {
          type: "PROPERTY_ACCESS_OPERATOR",
          regex: operator([".", ...(_b = cfg.propertyAccessOperators) != null ? _b : []])
        }
      ]);
    }
    // These rules can't be blindly cached as the paramTypesOverrides object
    // can differ on each invocation of the format() function.
    buildParamRules(cfg, paramTypesOverrides) {
      var _a, _b, _c, _d, _e;
      const paramTypes = {
        named: (paramTypesOverrides == null ? void 0 : paramTypesOverrides.named) || ((_a = cfg.paramTypes) == null ? void 0 : _a.named) || [],
        quoted: (paramTypesOverrides == null ? void 0 : paramTypesOverrides.quoted) || ((_b = cfg.paramTypes) == null ? void 0 : _b.quoted) || [],
        numbered: (paramTypesOverrides == null ? void 0 : paramTypesOverrides.numbered) || ((_c = cfg.paramTypes) == null ? void 0 : _c.numbered) || [],
        positional: typeof (paramTypesOverrides == null ? void 0 : paramTypesOverrides.positional) === "boolean" ? paramTypesOverrides.positional : (_d = cfg.paramTypes) == null ? void 0 : _d.positional,
        custom: (paramTypesOverrides == null ? void 0 : paramTypesOverrides.custom) || ((_e = cfg.paramTypes) == null ? void 0 : _e.custom) || []
      };
      return this.validRules([
        {
          type: "NAMED_PARAMETER",
          regex: parameter(
            paramTypes.named,
            identifierPattern(cfg.paramChars || cfg.identChars)
          ),
          key: (v) => v.slice(1)
        },
        {
          type: "QUOTED_PARAMETER",
          regex: parameter(paramTypes.quoted, stringPattern(cfg.identTypes)),
          key: (v) => (({ tokenKey, quoteChar }) => tokenKey.replace(new RegExp(escapeRegExp("\\" + quoteChar), "gu"), quoteChar))({
            tokenKey: v.slice(2, -1),
            quoteChar: v.slice(-1)
          })
        },
        {
          type: "NUMBERED_PARAMETER",
          regex: parameter(paramTypes.numbered, "[0-9]+"),
          key: (v) => v.slice(1)
        },
        {
          type: "POSITIONAL_PARAMETER",
          regex: paramTypes.positional ? /[?]/y : void 0
        },
        ...paramTypes.custom.map(
          (customParam) => {
            var _a2;
            return {
              type: "CUSTOM_PARAMETER",
              regex: patternToRegex(customParam.regex),
              key: (_a2 = customParam.key) != null ? _a2 : (v) => v
            };
          }
        )
      ]);
    }
    // filters out rules for token types whose regex is undefined
    validRules(rules) {
      return rules.filter((rule) => Boolean(rule.regex));
    }
  };
  var toCanonical = (v) => equalizeWhitespace(v.toUpperCase());
  var cache2 = /* @__PURE__ */ new Map();
  var createDialect = (options) => {
    let dialect = cache2.get(options);
    if (!dialect) {
      dialect = dialectFromOptions(options);
      cache2.set(options, dialect);
    }
    return dialect;
  };
  var dialectFromOptions = (dialectOptions) => ({
    tokenizer: new Tokenizer(dialectOptions.tokenizerOptions, dialectOptions.name),
    formatOptions: processDialectFormatOptions(dialectOptions.formatOptions)
  });
  var processDialectFormatOptions = (options) => {
    var _a;
    return {
      alwaysDenseOperators: options.alwaysDenseOperators || [],
      onelineClauses: Object.fromEntries(options.onelineClauses.map((name) => [name, true])),
      tabularOnelineClauses: Object.fromEntries(
        ((_a = options.tabularOnelineClauses) != null ? _a : options.onelineClauses).map((name) => [name, true])
      )
    };
  };
  function indentString(cfg) {
    if (cfg.indentStyle === "tabularLeft" || cfg.indentStyle === "tabularRight") {
      return " ".repeat(10);
    }
    if (cfg.useTabs) {
      return "	";
    }
    return " ".repeat(cfg.tabWidth);
  }
  function isTabularStyle(cfg) {
    return cfg.indentStyle === "tabularLeft" || cfg.indentStyle === "tabularRight";
  }
  var Params = class {
    constructor(params) {
      this.params = params;
      this.index = 0;
    }
    /**
     * Returns param value that matches given placeholder with param key.
     */
    get({ key, text }) {
      if (!this.params) {
        return text;
      }
      if (key) {
        return this.params[key];
      }
      return this.params[this.index++];
    }
    /**
     * Returns index of current positional parameter.
     */
    getPositionalParameterIndex() {
      return this.index;
    }
    /**
     * Sets index of current positional parameter.
     */
    setPositionalParameterIndex(i) {
      this.index = i;
    }
  };
  function disambiguateTokens(tokens) {
    return tokens.map(propertyNameKeywordToIdent).map(funcNameToKeyword).map(dataTypeToParameterizedDataType).map(identToArrayIdent).map(dataTypeToArrayKeyword);
  }
  var propertyNameKeywordToIdent = (token, i, tokens) => {
    if (isReserved(token.type)) {
      const prevToken = prevNonCommentToken(tokens, i);
      if (prevToken && prevToken.type === "PROPERTY_ACCESS_OPERATOR") {
        return __spreadProps(__spreadValues({}, token), { type: "IDENTIFIER", text: token.raw });
      }
    }
    return token;
  };
  var funcNameToKeyword = (token, i, tokens) => {
    if (token.type === "RESERVED_FUNCTION_NAME") {
      const nextToken = nextNonCommentToken(tokens, i);
      if (!nextToken || !isOpenParen(nextToken)) {
        return __spreadProps(__spreadValues({}, token), {
          type: "RESERVED_KEYWORD"
          /* RESERVED_KEYWORD */
        });
      }
    }
    return token;
  };
  var dataTypeToParameterizedDataType = (token, i, tokens) => {
    if (token.type === "RESERVED_DATA_TYPE") {
      const nextToken = nextNonCommentToken(tokens, i);
      if (nextToken && isOpenParen(nextToken)) {
        return __spreadProps(__spreadValues({}, token), {
          type: "RESERVED_PARAMETERIZED_DATA_TYPE"
          /* RESERVED_PARAMETERIZED_DATA_TYPE */
        });
      }
    }
    return token;
  };
  var identToArrayIdent = (token, i, tokens) => {
    if (token.type === "IDENTIFIER") {
      const nextToken = nextNonCommentToken(tokens, i);
      if (nextToken && isOpenBracket(nextToken)) {
        return __spreadProps(__spreadValues({}, token), {
          type: "ARRAY_IDENTIFIER"
          /* ARRAY_IDENTIFIER */
        });
      }
    }
    return token;
  };
  var dataTypeToArrayKeyword = (token, i, tokens) => {
    if (token.type === "RESERVED_DATA_TYPE") {
      const nextToken = nextNonCommentToken(tokens, i);
      if (nextToken && isOpenBracket(nextToken)) {
        return __spreadProps(__spreadValues({}, token), {
          type: "ARRAY_KEYWORD"
          /* ARRAY_KEYWORD */
        });
      }
    }
    return token;
  };
  var prevNonCommentToken = (tokens, index) => nextNonCommentToken(tokens, index, -1);
  var nextNonCommentToken = (tokens, index, dir = 1) => {
    let i = 1;
    while (tokens[index + i * dir] && isComment(tokens[index + i * dir])) {
      i++;
    }
    return tokens[index + i * dir];
  };
  var isOpenParen = (t) => t.type === "OPEN_PAREN" && t.text === "(";
  var isOpenBracket = (t) => t.type === "OPEN_PAREN" && t.text === "[";
  var isComment = (t) => t.type === "BLOCK_COMMENT" || t.type === "LINE_COMMENT";
  var LexerAdapter = class {
    constructor(tokenize2) {
      this.tokenize = tokenize2;
      this.index = 0;
      this.tokens = [];
      this.input = "";
    }
    reset(chunk, _info) {
      this.input = chunk;
      this.index = 0;
      this.tokens = this.tokenize(chunk);
    }
    next() {
      return this.tokens[this.index++];
    }
    save() {
    }
    formatError(token) {
      const { line, col } = lineColFromIndex(this.input, token.start);
      return `Parse error at token: ${token.text} at line ${line} column ${col}`;
    }
    has(name) {
      return name in TokenType;
    }
  };
  function id(d) {
    return d[0];
  }
  var lexer = new LexerAdapter((chunk) => []);
  var unwrap = ([[el]]) => el;
  var toKeywordNode = (token) => ({
    type: "keyword",
    tokenType: token.type,
    text: token.text,
    raw: token.raw
  });
  var toDataTypeNode = (token) => ({
    type: "data_type",
    text: token.text,
    raw: token.raw
  });
  var addComments = (node, { leading, trailing }) => {
    if (leading == null ? void 0 : leading.length) {
      node = __spreadProps(__spreadValues({}, node), { leadingComments: leading });
    }
    if (trailing == null ? void 0 : trailing.length) {
      node = __spreadProps(__spreadValues({}, node), { trailingComments: trailing });
    }
    return node;
  };
  var addCommentsToArray = (nodes, { leading, trailing }) => {
    if (leading == null ? void 0 : leading.length) {
      const [first, ...rest] = nodes;
      nodes = [addComments(first, { leading }), ...rest];
    }
    if (trailing == null ? void 0 : trailing.length) {
      const lead = nodes.slice(0, -1);
      const last2 = nodes[nodes.length - 1];
      nodes = [...lead, addComments(last2, { trailing })];
    }
    return nodes;
  };
  var grammar = {
    Lexer: lexer,
    ParserRules: [
      { "name": "main$ebnf$1", "symbols": [] },
      { "name": "main$ebnf$1", "symbols": ["main$ebnf$1", "statement"], "postprocess": (d) => d[0].concat([d[1]]) },
      {
        "name": "main",
        "symbols": ["main$ebnf$1"],
        "postprocess": ([statements]) => {
          const last2 = statements[statements.length - 1];
          if (last2 && !last2.hasSemicolon) {
            return last2.children.length > 0 ? statements : statements.slice(0, -1);
          } else {
            return statements;
          }
        }
      },
      { "name": "statement$subexpression$1", "symbols": [lexer.has("DELIMITER") ? { type: "DELIMITER" } : DELIMITER] },
      { "name": "statement$subexpression$1", "symbols": [lexer.has("EOF") ? { type: "EOF" } : EOF] },
      {
        "name": "statement",
        "symbols": ["expressions_or_clauses", "statement$subexpression$1"],
        "postprocess": ([children, [delimiter]]) => ({
          type: "statement",
          children,
          hasSemicolon: delimiter.type === "DELIMITER"
          /* DELIMITER */
        })
      },
      { "name": "expressions_or_clauses$ebnf$1", "symbols": [] },
      { "name": "expressions_or_clauses$ebnf$1", "symbols": ["expressions_or_clauses$ebnf$1", "free_form_sql"], "postprocess": (d) => d[0].concat([d[1]]) },
      { "name": "expressions_or_clauses$ebnf$2", "symbols": [] },
      { "name": "expressions_or_clauses$ebnf$2", "symbols": ["expressions_or_clauses$ebnf$2", "clause"], "postprocess": (d) => d[0].concat([d[1]]) },
      {
        "name": "expressions_or_clauses",
        "symbols": ["expressions_or_clauses$ebnf$1", "expressions_or_clauses$ebnf$2"],
        "postprocess": ([expressions, clauses]) => [...expressions, ...clauses]
      },
      { "name": "clause$subexpression$1", "symbols": ["limit_clause"] },
      { "name": "clause$subexpression$1", "symbols": ["select_clause"] },
      { "name": "clause$subexpression$1", "symbols": ["other_clause"] },
      { "name": "clause$subexpression$1", "symbols": ["set_operation"] },
      { "name": "clause", "symbols": ["clause$subexpression$1"], "postprocess": unwrap },
      { "name": "limit_clause$ebnf$1$subexpression$1$ebnf$1", "symbols": ["free_form_sql"] },
      { "name": "limit_clause$ebnf$1$subexpression$1$ebnf$1", "symbols": ["limit_clause$ebnf$1$subexpression$1$ebnf$1", "free_form_sql"], "postprocess": (d) => d[0].concat([d[1]]) },
      { "name": "limit_clause$ebnf$1$subexpression$1", "symbols": [lexer.has("COMMA") ? { type: "COMMA" } : COMMA, "limit_clause$ebnf$1$subexpression$1$ebnf$1"] },
      { "name": "limit_clause$ebnf$1", "symbols": ["limit_clause$ebnf$1$subexpression$1"], "postprocess": id },
      { "name": "limit_clause$ebnf$1", "symbols": [], "postprocess": () => null },
      {
        "name": "limit_clause",
        "symbols": [lexer.has("LIMIT") ? { type: "LIMIT" } : LIMIT, "_", "expression_chain_", "limit_clause$ebnf$1"],
        "postprocess": ([limitToken, _, exp1, optional]) => {
          if (optional) {
            const [comma, exp2] = optional;
            return {
              type: "limit_clause",
              limitKw: addComments(toKeywordNode(limitToken), { trailing: _ }),
              offset: exp1,
              count: exp2
            };
          } else {
            return {
              type: "limit_clause",
              limitKw: addComments(toKeywordNode(limitToken), { trailing: _ }),
              count: exp1
            };
          }
        }
      },
      { "name": "select_clause$subexpression$1$ebnf$1", "symbols": [] },
      { "name": "select_clause$subexpression$1$ebnf$1", "symbols": ["select_clause$subexpression$1$ebnf$1", "free_form_sql"], "postprocess": (d) => d[0].concat([d[1]]) },
      { "name": "select_clause$subexpression$1", "symbols": ["all_columns_asterisk", "select_clause$subexpression$1$ebnf$1"] },
      { "name": "select_clause$subexpression$1$ebnf$2", "symbols": [] },
      { "name": "select_clause$subexpression$1$ebnf$2", "symbols": ["select_clause$subexpression$1$ebnf$2", "free_form_sql"], "postprocess": (d) => d[0].concat([d[1]]) },
      { "name": "select_clause$subexpression$1", "symbols": ["asteriskless_free_form_sql", "select_clause$subexpression$1$ebnf$2"] },
      {
        "name": "select_clause",
        "symbols": [lexer.has("RESERVED_SELECT") ? { type: "RESERVED_SELECT" } : RESERVED_SELECT, "select_clause$subexpression$1"],
        "postprocess": ([nameToken, [exp, expressions]]) => ({
          type: "clause",
          nameKw: toKeywordNode(nameToken),
          children: [exp, ...expressions]
        })
      },
      {
        "name": "select_clause",
        "symbols": [lexer.has("RESERVED_SELECT") ? { type: "RESERVED_SELECT" } : RESERVED_SELECT],
        "postprocess": ([nameToken]) => ({
          type: "clause",
          nameKw: toKeywordNode(nameToken),
          children: []
        })
      },
      {
        "name": "all_columns_asterisk",
        "symbols": [lexer.has("ASTERISK") ? { type: "ASTERISK" } : ASTERISK],
        "postprocess": () => ({
          type: "all_columns_asterisk"
          /* all_columns_asterisk */
        })
      },
      { "name": "other_clause$ebnf$1", "symbols": [] },
      { "name": "other_clause$ebnf$1", "symbols": ["other_clause$ebnf$1", "free_form_sql"], "postprocess": (d) => d[0].concat([d[1]]) },
      {
        "name": "other_clause",
        "symbols": [lexer.has("RESERVED_CLAUSE") ? { type: "RESERVED_CLAUSE" } : RESERVED_CLAUSE, "other_clause$ebnf$1"],
        "postprocess": ([nameToken, children]) => ({
          type: "clause",
          nameKw: toKeywordNode(nameToken),
          children
        })
      },
      { "name": "set_operation$ebnf$1", "symbols": [] },
      { "name": "set_operation$ebnf$1", "symbols": ["set_operation$ebnf$1", "free_form_sql"], "postprocess": (d) => d[0].concat([d[1]]) },
      {
        "name": "set_operation",
        "symbols": [lexer.has("RESERVED_SET_OPERATION") ? { type: "RESERVED_SET_OPERATION" } : RESERVED_SET_OPERATION, "set_operation$ebnf$1"],
        "postprocess": ([nameToken, children]) => ({
          type: "set_operation",
          nameKw: toKeywordNode(nameToken),
          children
        })
      },
      { "name": "expression_chain_$ebnf$1", "symbols": ["expression_with_comments_"] },
      { "name": "expression_chain_$ebnf$1", "symbols": ["expression_chain_$ebnf$1", "expression_with_comments_"], "postprocess": (d) => d[0].concat([d[1]]) },
      { "name": "expression_chain_", "symbols": ["expression_chain_$ebnf$1"], "postprocess": id },
      { "name": "expression_chain$ebnf$1", "symbols": [] },
      { "name": "expression_chain$ebnf$1", "symbols": ["expression_chain$ebnf$1", "_expression_with_comments"], "postprocess": (d) => d[0].concat([d[1]]) },
      {
        "name": "expression_chain",
        "symbols": ["expression", "expression_chain$ebnf$1"],
        "postprocess": ([expr, chain]) => [expr, ...chain]
      },
      { "name": "andless_expression_chain$ebnf$1", "symbols": [] },
      { "name": "andless_expression_chain$ebnf$1", "symbols": ["andless_expression_chain$ebnf$1", "_andless_expression_with_comments"], "postprocess": (d) => d[0].concat([d[1]]) },
      {
        "name": "andless_expression_chain",
        "symbols": ["andless_expression", "andless_expression_chain$ebnf$1"],
        "postprocess": ([expr, chain]) => [expr, ...chain]
      },
      {
        "name": "expression_with_comments_",
        "symbols": ["expression", "_"],
        "postprocess": ([expr, _]) => addComments(expr, { trailing: _ })
      },
      {
        "name": "_expression_with_comments",
        "symbols": ["_", "expression"],
        "postprocess": ([_, expr]) => addComments(expr, { leading: _ })
      },
      {
        "name": "_andless_expression_with_comments",
        "symbols": ["_", "andless_expression"],
        "postprocess": ([_, expr]) => addComments(expr, { leading: _ })
      },
      { "name": "free_form_sql$subexpression$1", "symbols": ["asteriskless_free_form_sql"] },
      { "name": "free_form_sql$subexpression$1", "symbols": ["asterisk"] },
      { "name": "free_form_sql", "symbols": ["free_form_sql$subexpression$1"], "postprocess": unwrap },
      { "name": "asteriskless_free_form_sql$subexpression$1", "symbols": ["asteriskless_andless_expression"] },
      { "name": "asteriskless_free_form_sql$subexpression$1", "symbols": ["logic_operator"] },
      { "name": "asteriskless_free_form_sql$subexpression$1", "symbols": ["comma"] },
      { "name": "asteriskless_free_form_sql$subexpression$1", "symbols": ["comment"] },
      { "name": "asteriskless_free_form_sql$subexpression$1", "symbols": ["other_keyword"] },
      { "name": "asteriskless_free_form_sql", "symbols": ["asteriskless_free_form_sql$subexpression$1"], "postprocess": unwrap },
      { "name": "expression$subexpression$1", "symbols": ["andless_expression"] },
      { "name": "expression$subexpression$1", "symbols": ["logic_operator"] },
      { "name": "expression", "symbols": ["expression$subexpression$1"], "postprocess": unwrap },
      { "name": "andless_expression$subexpression$1", "symbols": ["asteriskless_andless_expression"] },
      { "name": "andless_expression$subexpression$1", "symbols": ["asterisk"] },
      { "name": "andless_expression", "symbols": ["andless_expression$subexpression$1"], "postprocess": unwrap },
      { "name": "asteriskless_andless_expression$subexpression$1", "symbols": ["atomic_expression"] },
      { "name": "asteriskless_andless_expression$subexpression$1", "symbols": ["between_predicate"] },
      { "name": "asteriskless_andless_expression$subexpression$1", "symbols": ["case_expression"] },
      { "name": "asteriskless_andless_expression", "symbols": ["asteriskless_andless_expression$subexpression$1"], "postprocess": unwrap },
      { "name": "atomic_expression$subexpression$1", "symbols": ["array_subscript"] },
      { "name": "atomic_expression$subexpression$1", "symbols": ["function_call"] },
      { "name": "atomic_expression$subexpression$1", "symbols": ["property_access"] },
      { "name": "atomic_expression$subexpression$1", "symbols": ["parenthesis"] },
      { "name": "atomic_expression$subexpression$1", "symbols": ["curly_braces"] },
      { "name": "atomic_expression$subexpression$1", "symbols": ["square_brackets"] },
      { "name": "atomic_expression$subexpression$1", "symbols": ["operator"] },
      { "name": "atomic_expression$subexpression$1", "symbols": ["identifier"] },
      { "name": "atomic_expression$subexpression$1", "symbols": ["parameter"] },
      { "name": "atomic_expression$subexpression$1", "symbols": ["literal"] },
      { "name": "atomic_expression$subexpression$1", "symbols": ["data_type"] },
      { "name": "atomic_expression$subexpression$1", "symbols": ["keyword"] },
      { "name": "atomic_expression", "symbols": ["atomic_expression$subexpression$1"], "postprocess": unwrap },
      {
        "name": "array_subscript",
        "symbols": [lexer.has("ARRAY_IDENTIFIER") ? { type: "ARRAY_IDENTIFIER" } : ARRAY_IDENTIFIER, "_", "square_brackets"],
        "postprocess": ([arrayToken, _, brackets]) => ({
          type: "array_subscript",
          array: addComments({ type: "identifier", quoted: false, text: arrayToken.text }, { trailing: _ }),
          parenthesis: brackets
        })
      },
      {
        "name": "array_subscript",
        "symbols": [lexer.has("ARRAY_KEYWORD") ? { type: "ARRAY_KEYWORD" } : ARRAY_KEYWORD, "_", "square_brackets"],
        "postprocess": ([arrayToken, _, brackets]) => ({
          type: "array_subscript",
          array: addComments(toKeywordNode(arrayToken), { trailing: _ }),
          parenthesis: brackets
        })
      },
      {
        "name": "function_call",
        "symbols": [lexer.has("RESERVED_FUNCTION_NAME") ? { type: "RESERVED_FUNCTION_NAME" } : RESERVED_FUNCTION_NAME, "_", "parenthesis"],
        "postprocess": ([nameToken, _, parens]) => ({
          type: "function_call",
          nameKw: addComments(toKeywordNode(nameToken), { trailing: _ }),
          parenthesis: parens
        })
      },
      {
        "name": "parenthesis",
        "symbols": [{ "literal": "(" }, "expressions_or_clauses", { "literal": ")" }],
        "postprocess": ([open, children, close]) => ({
          type: "parenthesis",
          children,
          openParen: "(",
          closeParen: ")"
        })
      },
      { "name": "curly_braces$ebnf$1", "symbols": [] },
      { "name": "curly_braces$ebnf$1", "symbols": ["curly_braces$ebnf$1", "free_form_sql"], "postprocess": (d) => d[0].concat([d[1]]) },
      {
        "name": "curly_braces",
        "symbols": [{ "literal": "{" }, "curly_braces$ebnf$1", { "literal": "}" }],
        "postprocess": ([open, children, close]) => ({
          type: "parenthesis",
          children,
          openParen: "{",
          closeParen: "}"
        })
      },
      { "name": "square_brackets$ebnf$1", "symbols": [] },
      { "name": "square_brackets$ebnf$1", "symbols": ["square_brackets$ebnf$1", "free_form_sql"], "postprocess": (d) => d[0].concat([d[1]]) },
      {
        "name": "square_brackets",
        "symbols": [{ "literal": "[" }, "square_brackets$ebnf$1", { "literal": "]" }],
        "postprocess": ([open, children, close]) => ({
          type: "parenthesis",
          children,
          openParen: "[",
          closeParen: "]"
        })
      },
      { "name": "property_access$subexpression$1", "symbols": ["identifier"] },
      { "name": "property_access$subexpression$1", "symbols": ["array_subscript"] },
      { "name": "property_access$subexpression$1", "symbols": ["all_columns_asterisk"] },
      { "name": "property_access$subexpression$1", "symbols": ["parameter"] },
      {
        "name": "property_access",
        "symbols": ["atomic_expression", "_", lexer.has("PROPERTY_ACCESS_OPERATOR") ? { type: "PROPERTY_ACCESS_OPERATOR" } : PROPERTY_ACCESS_OPERATOR, "_", "property_access$subexpression$1"],
        "postprocess": (
          // Allowing property to be <array_subscript> is currently a hack.
          // A better way would be to allow <property_access> on the left side of array_subscript,
          // but we currently can't do that because of another hack that requires
          // %ARRAY_IDENTIFIER on the left side of <array_subscript>.
          ([object, _1, dot, _2, [property]]) => {
            return {
              type: "property_access",
              object: addComments(object, { trailing: _1 }),
              operator: dot.text,
              property: addComments(property, { leading: _2 })
            };
          }
        )
      },
      {
        "name": "between_predicate",
        "symbols": [lexer.has("BETWEEN") ? { type: "BETWEEN" } : BETWEEN, "_", "andless_expression_chain", "_", lexer.has("AND") ? { type: "AND" } : AND, "_", "andless_expression"],
        "postprocess": ([betweenToken, _1, expr1, _2, andToken, _3, expr2]) => ({
          type: "between_predicate",
          betweenKw: toKeywordNode(betweenToken),
          expr1: addCommentsToArray(expr1, { leading: _1, trailing: _2 }),
          andKw: toKeywordNode(andToken),
          expr2: [addComments(expr2, { leading: _3 })]
        })
      },
      { "name": "case_expression$ebnf$1", "symbols": ["expression_chain_"], "postprocess": id },
      { "name": "case_expression$ebnf$1", "symbols": [], "postprocess": () => null },
      { "name": "case_expression$ebnf$2", "symbols": [] },
      { "name": "case_expression$ebnf$2", "symbols": ["case_expression$ebnf$2", "case_clause"], "postprocess": (d) => d[0].concat([d[1]]) },
      {
        "name": "case_expression",
        "symbols": [lexer.has("CASE") ? { type: "CASE" } : CASE, "_", "case_expression$ebnf$1", "case_expression$ebnf$2", lexer.has("END") ? { type: "END" } : END],
        "postprocess": ([caseToken, _, expr, clauses, endToken]) => ({
          type: "case_expression",
          caseKw: addComments(toKeywordNode(caseToken), { trailing: _ }),
          endKw: toKeywordNode(endToken),
          expr: expr || [],
          clauses
        })
      },
      {
        "name": "case_clause",
        "symbols": [lexer.has("WHEN") ? { type: "WHEN" } : WHEN, "_", "expression_chain_", lexer.has("THEN") ? { type: "THEN" } : THEN, "_", "expression_chain_"],
        "postprocess": ([whenToken, _1, cond, thenToken, _2, expr]) => ({
          type: "case_when",
          whenKw: addComments(toKeywordNode(whenToken), { trailing: _1 }),
          thenKw: addComments(toKeywordNode(thenToken), { trailing: _2 }),
          condition: cond,
          result: expr
        })
      },
      {
        "name": "case_clause",
        "symbols": [lexer.has("ELSE") ? { type: "ELSE" } : ELSE, "_", "expression_chain_"],
        "postprocess": ([elseToken, _, expr]) => ({
          type: "case_else",
          elseKw: addComments(toKeywordNode(elseToken), { trailing: _ }),
          result: expr
        })
      },
      { "name": "comma$subexpression$1", "symbols": [lexer.has("COMMA") ? { type: "COMMA" } : COMMA] },
      { "name": "comma", "symbols": ["comma$subexpression$1"], "postprocess": ([[token]]) => ({
        type: "comma"
        /* comma */
      }) },
      { "name": "asterisk$subexpression$1", "symbols": [lexer.has("ASTERISK") ? { type: "ASTERISK" } : ASTERISK] },
      { "name": "asterisk", "symbols": ["asterisk$subexpression$1"], "postprocess": ([[token]]) => ({ type: "operator", text: token.text }) },
      { "name": "operator$subexpression$1", "symbols": [lexer.has("OPERATOR") ? { type: "OPERATOR" } : OPERATOR] },
      { "name": "operator", "symbols": ["operator$subexpression$1"], "postprocess": ([[token]]) => ({ type: "operator", text: token.text }) },
      { "name": "identifier$subexpression$1", "symbols": [lexer.has("IDENTIFIER") ? { type: "IDENTIFIER" } : IDENTIFIER] },
      { "name": "identifier$subexpression$1", "symbols": [lexer.has("QUOTED_IDENTIFIER") ? { type: "QUOTED_IDENTIFIER" } : QUOTED_IDENTIFIER] },
      { "name": "identifier$subexpression$1", "symbols": [lexer.has("VARIABLE") ? { type: "VARIABLE" } : VARIABLE] },
      { "name": "identifier", "symbols": ["identifier$subexpression$1"], "postprocess": ([[token]]) => ({ type: "identifier", quoted: token.type !== "IDENTIFIER", text: token.text }) },
      { "name": "parameter$subexpression$1", "symbols": [lexer.has("NAMED_PARAMETER") ? { type: "NAMED_PARAMETER" } : NAMED_PARAMETER] },
      { "name": "parameter$subexpression$1", "symbols": [lexer.has("QUOTED_PARAMETER") ? { type: "QUOTED_PARAMETER" } : QUOTED_PARAMETER] },
      { "name": "parameter$subexpression$1", "symbols": [lexer.has("NUMBERED_PARAMETER") ? { type: "NUMBERED_PARAMETER" } : NUMBERED_PARAMETER] },
      { "name": "parameter$subexpression$1", "symbols": [lexer.has("POSITIONAL_PARAMETER") ? { type: "POSITIONAL_PARAMETER" } : POSITIONAL_PARAMETER] },
      { "name": "parameter$subexpression$1", "symbols": [lexer.has("CUSTOM_PARAMETER") ? { type: "CUSTOM_PARAMETER" } : CUSTOM_PARAMETER] },
      { "name": "parameter", "symbols": ["parameter$subexpression$1"], "postprocess": ([[token]]) => ({ type: "parameter", key: token.key, text: token.text }) },
      { "name": "literal$subexpression$1", "symbols": [lexer.has("NUMBER") ? { type: "NUMBER" } : NUMBER] },
      { "name": "literal$subexpression$1", "symbols": [lexer.has("STRING") ? { type: "STRING" } : STRING] },
      { "name": "literal", "symbols": ["literal$subexpression$1"], "postprocess": ([[token]]) => ({ type: "literal", text: token.text }) },
      { "name": "keyword$subexpression$1", "symbols": [lexer.has("RESERVED_KEYWORD") ? { type: "RESERVED_KEYWORD" } : RESERVED_KEYWORD] },
      { "name": "keyword$subexpression$1", "symbols": [lexer.has("RESERVED_PHRASE") ? { type: "RESERVED_PHRASE" } : RESERVED_PHRASE] },
      { "name": "keyword$subexpression$1", "symbols": [lexer.has("RESERVED_JOIN") ? { type: "RESERVED_JOIN" } : RESERVED_JOIN] },
      {
        "name": "keyword",
        "symbols": ["keyword$subexpression$1"],
        "postprocess": ([[token]]) => toKeywordNode(token)
      },
      { "name": "data_type$subexpression$1", "symbols": [lexer.has("RESERVED_DATA_TYPE") ? { type: "RESERVED_DATA_TYPE" } : RESERVED_DATA_TYPE] },
      {
        "name": "data_type",
        "symbols": ["data_type$subexpression$1"],
        "postprocess": ([[token]]) => toDataTypeNode(token)
      },
      {
        "name": "data_type",
        "symbols": [lexer.has("RESERVED_PARAMETERIZED_DATA_TYPE") ? { type: "RESERVED_PARAMETERIZED_DATA_TYPE" } : RESERVED_PARAMETERIZED_DATA_TYPE, "_", "parenthesis"],
        "postprocess": ([nameToken, _, parens]) => ({
          type: "parameterized_data_type",
          dataType: addComments(toDataTypeNode(nameToken), { trailing: _ }),
          parenthesis: parens
        })
      },
      { "name": "logic_operator$subexpression$1", "symbols": [lexer.has("AND") ? { type: "AND" } : AND] },
      { "name": "logic_operator$subexpression$1", "symbols": [lexer.has("OR") ? { type: "OR" } : OR] },
      { "name": "logic_operator$subexpression$1", "symbols": [lexer.has("XOR") ? { type: "XOR" } : XOR] },
      {
        "name": "logic_operator",
        "symbols": ["logic_operator$subexpression$1"],
        "postprocess": ([[token]]) => toKeywordNode(token)
      },
      { "name": "other_keyword$subexpression$1", "symbols": [lexer.has("WHEN") ? { type: "WHEN" } : WHEN] },
      { "name": "other_keyword$subexpression$1", "symbols": [lexer.has("THEN") ? { type: "THEN" } : THEN] },
      { "name": "other_keyword$subexpression$1", "symbols": [lexer.has("ELSE") ? { type: "ELSE" } : ELSE] },
      { "name": "other_keyword$subexpression$1", "symbols": [lexer.has("END") ? { type: "END" } : END] },
      {
        "name": "other_keyword",
        "symbols": ["other_keyword$subexpression$1"],
        "postprocess": ([[token]]) => toKeywordNode(token)
      },
      { "name": "_$ebnf$1", "symbols": [] },
      { "name": "_$ebnf$1", "symbols": ["_$ebnf$1", "comment"], "postprocess": (d) => d[0].concat([d[1]]) },
      { "name": "_", "symbols": ["_$ebnf$1"], "postprocess": ([comments]) => comments },
      {
        "name": "comment",
        "symbols": [lexer.has("LINE_COMMENT") ? { type: "LINE_COMMENT" } : LINE_COMMENT],
        "postprocess": ([token]) => ({
          type: "line_comment",
          text: token.text,
          precedingWhitespace: token.precedingWhitespace
        })
      },
      {
        "name": "comment",
        "symbols": [lexer.has("BLOCK_COMMENT") ? { type: "BLOCK_COMMENT" } : BLOCK_COMMENT],
        "postprocess": ([token]) => ({
          type: "block_comment",
          text: token.text,
          precedingWhitespace: token.precedingWhitespace
        })
      },
      {
        "name": "comment",
        "symbols": [lexer.has("DISABLE_COMMENT") ? { type: "DISABLE_COMMENT" } : DISABLE_COMMENT],
        "postprocess": ([token]) => ({
          type: "disable_comment",
          text: token.text,
          precedingWhitespace: token.precedingWhitespace
        })
      }
    ],
    ParserStart: "main"
  };
  var grammar_default = grammar;
  var { Parser: NearleyParser, Grammar } = import_nearley.default;
  function createParser(tokenizer) {
    let paramTypesOverrides = {};
    const lexer2 = new LexerAdapter((chunk) => [
      ...disambiguateTokens(tokenizer.tokenize(chunk, paramTypesOverrides)),
      createEofToken(chunk.length)
    ]);
    const parser = new NearleyParser(Grammar.fromCompiled(grammar_default), { lexer: lexer2 });
    return {
      parse: (sql22, paramTypes) => {
        paramTypesOverrides = paramTypes;
        const { results } = parser.feed(sql22);
        if (results.length === 1) {
          return results[0];
        } else if (results.length === 0) {
          throw new Error("Parse error: Invalid SQL");
        } else {
          throw new Error(`Parse error: Ambiguous grammar
${JSON.stringify(results, void 0, 2)}`);
        }
      }
    };
  }
  var Layout = class {
    constructor(indentation) {
      this.indentation = indentation;
      this.items = [];
    }
    /**
     * Appends token strings and whitespace modifications to SQL string.
     */
    add(...items) {
      for (const item of items) {
        switch (item) {
          case 0:
            this.items.push(
              0
              /* SPACE */
            );
            break;
          case 1:
            this.trimHorizontalWhitespace();
            break;
          case 2:
            this.trimWhitespace();
            break;
          case 3:
            this.trimHorizontalWhitespace();
            this.addNewline(
              3
              /* NEWLINE */
            );
            break;
          case 4:
            this.trimHorizontalWhitespace();
            this.addNewline(
              4
              /* MANDATORY_NEWLINE */
            );
            break;
          case 5:
            this.addIndentation();
            break;
          case 6:
            this.items.push(
              6
              /* SINGLE_INDENT */
            );
            break;
          default:
            this.items.push(item);
        }
      }
    }
    trimHorizontalWhitespace() {
      while (isHorizontalWhitespace(last(this.items))) {
        this.items.pop();
      }
    }
    trimWhitespace() {
      while (isRemovableWhitespace(last(this.items))) {
        this.items.pop();
      }
    }
    addNewline(newline) {
      if (this.items.length > 0) {
        switch (last(this.items)) {
          case 3:
            this.items.pop();
            this.items.push(newline);
            break;
          case 4:
            break;
          default:
            this.items.push(newline);
            break;
        }
      }
    }
    addIndentation() {
      for (let i = 0; i < this.indentation.getLevel(); i++) {
        this.items.push(
          6
          /* SINGLE_INDENT */
        );
      }
    }
    /**
     * Returns the final SQL string.
     */
    toString() {
      return this.items.map((item) => this.itemToString(item)).join("");
    }
    /**
     * Returns the internal layout data
     */
    getLayoutItems() {
      return this.items;
    }
    itemToString(item) {
      switch (item) {
        case 0:
          return " ";
        case 3:
        case 4:
          return "\n";
        case 6:
          return this.indentation.getSingleIndent();
        default:
          return item;
      }
    }
  };
  var isHorizontalWhitespace = (item) => item === 0 || item === 6;
  var isRemovableWhitespace = (item) => item === 0 || item === 6 || item === 3;
  function toTabularFormat(tokenText, indentStyle) {
    if (indentStyle === "standard") {
      return tokenText;
    }
    let tail = [];
    if (tokenText.length >= 10 && tokenText.includes(" ")) {
      [tokenText, ...tail] = tokenText.split(" ");
    }
    if (indentStyle === "tabularLeft") {
      tokenText = tokenText.padEnd(9, " ");
    } else {
      tokenText = tokenText.padStart(9, " ");
    }
    return tokenText + ["", ...tail].join(" ");
  }
  function isTabularToken(type) {
    return isLogicalOperator(type) || type === "RESERVED_CLAUSE" || type === "RESERVED_SELECT" || type === "RESERVED_SET_OPERATION" || type === "RESERVED_JOIN" || type === "LIMIT";
  }
  var INDENT_TYPE_TOP_LEVEL = "top-level";
  var INDENT_TYPE_BLOCK_LEVEL = "block-level";
  var Indentation = class {
    /**
     * @param {string} indent A string to indent with
     */
    constructor(indent) {
      this.indent = indent;
      this.indentTypes = [];
    }
    /**
     * Returns indentation string for single indentation step.
     */
    getSingleIndent() {
      return this.indent;
    }
    /**
     * Returns current indentation level
     */
    getLevel() {
      return this.indentTypes.length;
    }
    /**
     * Increases indentation by one top-level indent.
     */
    increaseTopLevel() {
      this.indentTypes.push(INDENT_TYPE_TOP_LEVEL);
    }
    /**
     * Increases indentation by one block-level indent.
     */
    increaseBlockLevel() {
      this.indentTypes.push(INDENT_TYPE_BLOCK_LEVEL);
    }
    /**
     * Decreases indentation by one top-level indent.
     * Does nothing when the previous indent is not top-level.
     */
    decreaseTopLevel() {
      if (this.indentTypes.length > 0 && last(this.indentTypes) === INDENT_TYPE_TOP_LEVEL) {
        this.indentTypes.pop();
      }
    }
    /**
     * Decreases indentation by one block-level indent.
     * If there are top-level indents within the block-level indent,
     * throws away these as well.
     */
    decreaseBlockLevel() {
      while (this.indentTypes.length > 0) {
        const type = this.indentTypes.pop();
        if (type !== INDENT_TYPE_TOP_LEVEL) {
          break;
        }
      }
    }
  };
  var InlineLayout = class extends Layout {
    constructor(expressionWidth) {
      super(new Indentation(""));
      this.expressionWidth = expressionWidth;
      this.length = 0;
      this.trailingSpace = false;
    }
    add(...items) {
      items.forEach((item) => this.addToLength(item));
      if (this.length > this.expressionWidth) {
        throw new InlineLayoutError();
      }
      super.add(...items);
    }
    addToLength(item) {
      if (typeof item === "string") {
        this.length += item.length;
        this.trailingSpace = false;
      } else if (item === 4 || item === 3) {
        throw new InlineLayoutError();
      } else if (item === 5 || item === 6 || item === 0) {
        if (!this.trailingSpace) {
          this.length++;
          this.trailingSpace = true;
        }
      } else if (item === 2 || item === 1) {
        if (this.trailingSpace) {
          this.trailingSpace = false;
          this.length--;
        }
      }
    }
  };
  var InlineLayoutError = class extends Error {
  };
  var ExpressionFormatter = class _ExpressionFormatter {
    constructor({ cfg, dialectCfg, params, layout, inline = false }) {
      this.inline = false;
      this.nodes = [];
      this.index = -1;
      this.cfg = cfg;
      this.dialectCfg = dialectCfg;
      this.inline = inline;
      this.params = params;
      this.layout = layout;
    }
    format(nodes) {
      this.nodes = nodes;
      for (this.index = 0; this.index < this.nodes.length; this.index++) {
        this.formatNode(this.nodes[this.index]);
      }
      return this.layout;
    }
    formatNode(node) {
      this.formatComments(node.leadingComments);
      this.formatNodeWithoutComments(node);
      this.formatComments(node.trailingComments);
    }
    formatNodeWithoutComments(node) {
      switch (node.type) {
        case "function_call":
          return this.formatFunctionCall(node);
        case "parameterized_data_type":
          return this.formatParameterizedDataType(node);
        case "array_subscript":
          return this.formatArraySubscript(node);
        case "property_access":
          return this.formatPropertyAccess(node);
        case "parenthesis":
          return this.formatParenthesis(node);
        case "between_predicate":
          return this.formatBetweenPredicate(node);
        case "case_expression":
          return this.formatCaseExpression(node);
        case "case_when":
          return this.formatCaseWhen(node);
        case "case_else":
          return this.formatCaseElse(node);
        case "clause":
          return this.formatClause(node);
        case "set_operation":
          return this.formatSetOperation(node);
        case "limit_clause":
          return this.formatLimitClause(node);
        case "all_columns_asterisk":
          return this.formatAllColumnsAsterisk(node);
        case "literal":
          return this.formatLiteral(node);
        case "identifier":
          return this.formatIdentifier(node);
        case "parameter":
          return this.formatParameter(node);
        case "operator":
          return this.formatOperator(node);
        case "comma":
          return this.formatComma(node);
        case "line_comment":
          return this.formatLineComment(node);
        case "block_comment":
          return this.formatBlockComment(node);
        case "disable_comment":
          return this.formatBlockComment(node);
        case "data_type":
          return this.formatDataType(node);
        case "keyword":
          return this.formatKeywordNode(node);
      }
    }
    formatFunctionCall(node) {
      this.withComments(node.nameKw, () => {
        this.layout.add(this.showFunctionKw(node.nameKw));
      });
      this.formatNode(node.parenthesis);
    }
    formatParameterizedDataType(node) {
      this.withComments(node.dataType, () => {
        this.layout.add(this.showDataType(node.dataType));
      });
      this.formatNode(node.parenthesis);
    }
    formatArraySubscript(node) {
      let formattedArray;
      switch (node.array.type) {
        case "data_type":
          formattedArray = this.showDataType(node.array);
          break;
        case "keyword":
          formattedArray = this.showKw(node.array);
          break;
        default:
          formattedArray = this.showIdentifier(node.array);
          break;
      }
      this.withComments(node.array, () => {
        this.layout.add(formattedArray);
      });
      this.formatNode(node.parenthesis);
    }
    formatPropertyAccess(node) {
      this.formatNode(node.object);
      this.layout.add(1, node.operator);
      this.formatNode(node.property);
    }
    formatParenthesis(node) {
      const inlineLayout = this.formatInlineExpression(node.children);
      if (inlineLayout) {
        this.layout.add(node.openParen);
        this.layout.add(...inlineLayout.getLayoutItems());
        this.layout.add(
          1,
          node.closeParen,
          0
          /* SPACE */
        );
      } else {
        this.layout.add(
          node.openParen,
          3
          /* NEWLINE */
        );
        if (isTabularStyle(this.cfg)) {
          this.layout.add(
            5
            /* INDENT */
          );
          this.layout = this.formatSubExpression(node.children);
        } else {
          this.layout.indentation.increaseBlockLevel();
          this.layout.add(
            5
            /* INDENT */
          );
          this.layout = this.formatSubExpression(node.children);
          this.layout.indentation.decreaseBlockLevel();
        }
        this.layout.add(
          3,
          5,
          node.closeParen,
          0
          /* SPACE */
        );
      }
    }
    formatBetweenPredicate(node) {
      this.layout.add(
        this.showKw(node.betweenKw),
        0
        /* SPACE */
      );
      this.layout = this.formatSubExpression(node.expr1);
      this.layout.add(
        1,
        0,
        this.showNonTabularKw(node.andKw),
        0
        /* SPACE */
      );
      this.layout = this.formatSubExpression(node.expr2);
      this.layout.add(
        0
        /* SPACE */
      );
    }
    formatCaseExpression(node) {
      this.formatNode(node.caseKw);
      this.layout.indentation.increaseBlockLevel();
      this.layout = this.formatSubExpression(node.expr);
      this.layout = this.formatSubExpression(node.clauses);
      this.layout.indentation.decreaseBlockLevel();
      this.layout.add(
        3,
        5
        /* INDENT */
      );
      this.formatNode(node.endKw);
    }
    formatCaseWhen(node) {
      this.layout.add(
        3,
        5
        /* INDENT */
      );
      this.formatNode(node.whenKw);
      this.layout = this.formatSubExpression(node.condition);
      this.formatNode(node.thenKw);
      this.layout = this.formatSubExpression(node.result);
    }
    formatCaseElse(node) {
      this.layout.add(
        3,
        5
        /* INDENT */
      );
      this.formatNode(node.elseKw);
      this.layout = this.formatSubExpression(node.result);
    }
    formatClause(node) {
      if (this.isOnelineClause(node)) {
        this.formatClauseInOnelineStyle(node);
      } else if (isTabularStyle(this.cfg)) {
        this.formatClauseInTabularStyle(node);
      } else {
        this.formatClauseInIndentedStyle(node);
      }
    }
    isOnelineClause(node) {
      if (isTabularStyle(this.cfg)) {
        return this.dialectCfg.tabularOnelineClauses[node.nameKw.text];
      } else {
        return this.dialectCfg.onelineClauses[node.nameKw.text];
      }
    }
    formatClauseInIndentedStyle(node) {
      this.layout.add(
        3,
        5,
        this.showKw(node.nameKw),
        3
        /* NEWLINE */
      );
      this.layout.indentation.increaseTopLevel();
      this.layout.add(
        5
        /* INDENT */
      );
      this.layout = this.formatSubExpression(node.children);
      this.layout.indentation.decreaseTopLevel();
    }
    formatClauseInOnelineStyle(node) {
      this.layout.add(
        3,
        5,
        this.showKw(node.nameKw),
        0
        /* SPACE */
      );
      this.layout = this.formatSubExpression(node.children);
    }
    formatClauseInTabularStyle(node) {
      this.layout.add(
        3,
        5,
        this.showKw(node.nameKw),
        0
        /* SPACE */
      );
      this.layout.indentation.increaseTopLevel();
      this.layout = this.formatSubExpression(node.children);
      this.layout.indentation.decreaseTopLevel();
    }
    formatSetOperation(node) {
      this.layout.add(
        3,
        5,
        this.showKw(node.nameKw),
        3
        /* NEWLINE */
      );
      this.layout.add(
        5
        /* INDENT */
      );
      this.layout = this.formatSubExpression(node.children);
    }
    formatLimitClause(node) {
      this.withComments(node.limitKw, () => {
        this.layout.add(3, 5, this.showKw(node.limitKw));
      });
      this.layout.indentation.increaseTopLevel();
      if (isTabularStyle(this.cfg)) {
        this.layout.add(
          0
          /* SPACE */
        );
      } else {
        this.layout.add(
          3,
          5
          /* INDENT */
        );
      }
      if (node.offset) {
        this.layout = this.formatSubExpression(node.offset);
        this.layout.add(
          1,
          ",",
          0
          /* SPACE */
        );
        this.layout = this.formatSubExpression(node.count);
      } else {
        this.layout = this.formatSubExpression(node.count);
      }
      this.layout.indentation.decreaseTopLevel();
    }
    formatAllColumnsAsterisk(_node) {
      this.layout.add(
        "*",
        0
        /* SPACE */
      );
    }
    formatLiteral(node) {
      this.layout.add(
        node.text,
        0
        /* SPACE */
      );
    }
    formatIdentifier(node) {
      this.layout.add(
        this.showIdentifier(node),
        0
        /* SPACE */
      );
    }
    formatParameter(node) {
      this.layout.add(
        this.params.get(node),
        0
        /* SPACE */
      );
    }
    formatOperator({ text }) {
      if (this.cfg.denseOperators || this.dialectCfg.alwaysDenseOperators.includes(text)) {
        this.layout.add(1, text);
      } else if (text === ":") {
        this.layout.add(
          1,
          text,
          0
          /* SPACE */
        );
      } else {
        this.layout.add(
          text,
          0
          /* SPACE */
        );
      }
    }
    formatComma(_node) {
      if (!this.inline) {
        this.layout.add(
          1,
          ",",
          3,
          5
          /* INDENT */
        );
      } else {
        this.layout.add(
          1,
          ",",
          0
          /* SPACE */
        );
      }
    }
    withComments(node, fn) {
      this.formatComments(node.leadingComments);
      fn();
      this.formatComments(node.trailingComments);
    }
    formatComments(comments) {
      if (!comments) {
        return;
      }
      comments.forEach((com) => {
        if (com.type === "line_comment") {
          this.formatLineComment(com);
        } else {
          this.formatBlockComment(com);
        }
      });
    }
    formatLineComment(node) {
      if (isMultiline(node.precedingWhitespace || "")) {
        this.layout.add(
          3,
          5,
          node.text,
          4,
          5
          /* INDENT */
        );
      } else if (this.layout.getLayoutItems().length > 0) {
        this.layout.add(
          2,
          0,
          node.text,
          4,
          5
          /* INDENT */
        );
      } else {
        this.layout.add(
          node.text,
          4,
          5
          /* INDENT */
        );
      }
    }
    formatBlockComment(node) {
      if (node.type === "block_comment" && this.isMultilineBlockComment(node)) {
        this.splitBlockComment(node.text).forEach((line) => {
          this.layout.add(3, 5, line);
        });
        this.layout.add(
          3,
          5
          /* INDENT */
        );
      } else {
        this.layout.add(
          node.text,
          0
          /* SPACE */
        );
      }
    }
    isMultilineBlockComment(node) {
      return isMultiline(node.text) || isMultiline(node.precedingWhitespace || "");
    }
    isDocComment(comment) {
      const lines = comment.split(/\n/);
      return (
        // first line starts with /* or /**
        /^\/\*\*?$/.test(lines[0]) && // intermediate lines start with *
        lines.slice(1, lines.length - 1).every((line) => /^\s*\*/.test(line)) && // last line ends with */
        /^\s*\*\/$/.test(last(lines))
      );
    }
    // Breaks up block comment to multiple lines.
    // For example this doc-comment (dots representing leading whitespace):
    //
    //   ..../**
    //   .....* Some description here
    //   .....* and here too
    //   .....*/
    //
    // gets broken to this array (note the leading single spaces):
    //
    //   [ '/**',
    //     '.* Some description here',
    //     '.* and here too',
    //     '.*/' ]
    //
    // However, a normal comment (non-doc-comment) like this:
    //
    //   ..../*
    //   ....Some description here
    //   ....*/
    //
    // gets broken to this array (no leading spaces):
    //
    //   [ '/*',
    //     'Some description here',
    //     '*/' ]
    //
    splitBlockComment(comment) {
      if (this.isDocComment(comment)) {
        return comment.split(/\n/).map((line) => {
          if (/^\s*\*/.test(line)) {
            return " " + line.replace(/^\s*/, "");
          } else {
            return line;
          }
        });
      } else {
        return comment.split(/\n/).map((line) => line.replace(/^\s*/, ""));
      }
    }
    formatSubExpression(nodes) {
      return new _ExpressionFormatter({
        cfg: this.cfg,
        dialectCfg: this.dialectCfg,
        params: this.params,
        layout: this.layout,
        inline: this.inline
      }).format(nodes);
    }
    formatInlineExpression(nodes) {
      const oldParamIndex = this.params.getPositionalParameterIndex();
      try {
        return new _ExpressionFormatter({
          cfg: this.cfg,
          dialectCfg: this.dialectCfg,
          params: this.params,
          layout: new InlineLayout(this.cfg.expressionWidth),
          inline: true
        }).format(nodes);
      } catch (e) {
        if (e instanceof InlineLayoutError) {
          this.params.setPositionalParameterIndex(oldParamIndex);
          return void 0;
        } else {
          throw e;
        }
      }
    }
    formatKeywordNode(node) {
      switch (node.tokenType) {
        case "RESERVED_JOIN":
          return this.formatJoin(node);
        case "AND":
        case "OR":
        case "XOR":
          return this.formatLogicalOperator(node);
        default:
          return this.formatKeyword(node);
      }
    }
    formatJoin(node) {
      if (isTabularStyle(this.cfg)) {
        this.layout.indentation.decreaseTopLevel();
        this.layout.add(
          3,
          5,
          this.showKw(node),
          0
          /* SPACE */
        );
        this.layout.indentation.increaseTopLevel();
      } else {
        this.layout.add(
          3,
          5,
          this.showKw(node),
          0
          /* SPACE */
        );
      }
    }
    formatKeyword(node) {
      this.layout.add(
        this.showKw(node),
        0
        /* SPACE */
      );
    }
    formatLogicalOperator(node) {
      if (this.cfg.logicalOperatorNewline === "before") {
        if (isTabularStyle(this.cfg)) {
          this.layout.indentation.decreaseTopLevel();
          this.layout.add(
            3,
            5,
            this.showKw(node),
            0
            /* SPACE */
          );
          this.layout.indentation.increaseTopLevel();
        } else {
          this.layout.add(
            3,
            5,
            this.showKw(node),
            0
            /* SPACE */
          );
        }
      } else {
        this.layout.add(
          this.showKw(node),
          3,
          5
          /* INDENT */
        );
      }
    }
    formatDataType(node) {
      this.layout.add(
        this.showDataType(node),
        0
        /* SPACE */
      );
    }
    showKw(node) {
      if (isTabularToken(node.tokenType)) {
        return toTabularFormat(this.showNonTabularKw(node), this.cfg.indentStyle);
      } else {
        return this.showNonTabularKw(node);
      }
    }
    // Like showKw(), but skips tabular formatting
    showNonTabularKw(node) {
      switch (this.cfg.keywordCase) {
        case "preserve":
          return equalizeWhitespace(node.raw);
        case "upper":
          return node.text;
        case "lower":
          return node.text.toLowerCase();
      }
    }
    showFunctionKw(node) {
      if (isTabularToken(node.tokenType)) {
        return toTabularFormat(this.showNonTabularFunctionKw(node), this.cfg.indentStyle);
      } else {
        return this.showNonTabularFunctionKw(node);
      }
    }
    // Like showFunctionKw(), but skips tabular formatting
    showNonTabularFunctionKw(node) {
      switch (this.cfg.functionCase) {
        case "preserve":
          return equalizeWhitespace(node.raw);
        case "upper":
          return node.text;
        case "lower":
          return node.text.toLowerCase();
      }
    }
    showIdentifier(node) {
      if (node.quoted) {
        return node.text;
      } else {
        switch (this.cfg.identifierCase) {
          case "preserve":
            return node.text;
          case "upper":
            return node.text.toUpperCase();
          case "lower":
            return node.text.toLowerCase();
        }
      }
    }
    showDataType(node) {
      switch (this.cfg.dataTypeCase) {
        case "preserve":
          return equalizeWhitespace(node.raw);
        case "upper":
          return node.text;
        case "lower":
          return node.text.toLowerCase();
      }
    }
  };
  var Formatter = class {
    constructor(dialect, cfg) {
      this.dialect = dialect;
      this.cfg = cfg;
      this.params = new Params(this.cfg.params);
    }
    /**
     * Formats an SQL query.
     * @param {string} query - The SQL query string to be formatted
     * @return {string} The formatter query
     */
    format(query) {
      const ast = this.parse(query);
      const formattedQuery = this.formatAst(ast);
      return formattedQuery.trimEnd();
    }
    parse(query) {
      return createParser(this.dialect.tokenizer).parse(query, this.cfg.paramTypes || {});
    }
    formatAst(statements) {
      return statements.map((stat) => this.formatStatement(stat)).join("\n".repeat(this.cfg.linesBetweenQueries + 1));
    }
    formatStatement(statement) {
      const layout = new ExpressionFormatter({
        cfg: this.cfg,
        dialectCfg: this.dialect.formatOptions,
        params: this.params,
        layout: new Layout(new Indentation(indentString(this.cfg)))
      }).format(statement.children);
      if (!statement.hasSemicolon) {
      } else if (this.cfg.newlineBeforeSemicolon) {
        layout.add(3, ";");
      } else {
        layout.add(2, ";");
      }
      return layout.toString();
    }
  };
  var ConfigError = class extends Error {
  };
  function validateConfig(cfg) {
    const removedOptions = [
      "multilineLists",
      "newlineBeforeOpenParen",
      "newlineBeforeCloseParen",
      "aliasAs",
      "commaPosition",
      "tabulateAlias"
    ];
    for (const optionName of removedOptions) {
      if (optionName in cfg) {
        throw new ConfigError(`${optionName} config is no more supported.`);
      }
    }
    if (cfg.expressionWidth <= 0) {
      throw new ConfigError(
        `expressionWidth config must be positive number. Received ${cfg.expressionWidth} instead.`
      );
    }
    if (cfg.params && !validateParams(cfg.params)) {
      console.warn('WARNING: All "params" option values should be strings.');
    }
    return cfg;
  }
  function validateParams(params) {
    const paramValues = params instanceof Array ? params : Object.values(params);
    return paramValues.every((p) => typeof p === "string");
  }
  var dialectNameMap = {
    bigquery: "bigquery",
    db2: "db2",
    db2i: "db2i",
    hive: "hive",
    mariadb: "mariadb",
    mysql: "mysql",
    n1ql: "n1ql",
    plsql: "plsql",
    postgresql: "postgresql",
    redshift: "redshift",
    spark: "spark",
    sqlite: "sqlite",
    sql: "sql",
    tidb: "tidb",
    trino: "trino",
    transactsql: "transactsql",
    tsql: "transactsql",
    // alias for transactsq
    singlestoredb: "singlestoredb",
    snowflake: "snowflake"
  };
  var supportedDialects = Object.keys(dialectNameMap);
  var defaultOptions2 = {
    tabWidth: 2,
    useTabs: false,
    keywordCase: "preserve",
    identifierCase: "preserve",
    dataTypeCase: "preserve",
    functionCase: "preserve",
    indentStyle: "standard",
    logicalOperatorNewline: "before",
    expressionWidth: 50,
    linesBetweenQueries: 1,
    denseOperators: false,
    newlineBeforeSemicolon: false
  };
  var format = (query, cfg = {}) => {
    if (typeof cfg.language === "string" && !supportedDialects.includes(cfg.language)) {
      throw new ConfigError(`Unsupported SQL dialect: ${cfg.language}`);
    }
    const canonicalDialectName = dialectNameMap[cfg.language || "sql"];
    return formatDialect(query, __spreadProps(__spreadValues({}, cfg), {
      dialect: allDialects_exports[canonicalDialectName]
    }));
  };
  var formatDialect = (query, _a) => {
    var _b = _a, { dialect } = _b, cfg = __objRest(_b, ["dialect"]);
    if (typeof query !== "string") {
      throw new Error("Invalid query argument. Expected string, instead got " + typeof query);
    }
    const options = validateConfig(__spreadValues(__spreadValues({}, defaultOptions2), cfg));
    return new Formatter(createDialect(dialect), options).format(query);
  };

  // app/javascript/controllers/code_syntax_controller.js
  core_default.registerLanguage("sql", sql);
  var code_syntax_controller_default = class extends Controller {
    static values = { query: Object };
    get sql() {
      return this.queryValue.sql;
    }
    connect() {
      const formatted = format(this.sql, { language: "postgresql" });
      this.element.innerHTML = core_default.highlight(formatted, { language: "sql" }).value;
    }
  };

  // app/javascript/controllers/home_controller.js
  var home_controller_default = class extends Controller {
    openRequest() {
      this.element.classList.add("request-opened");
    }
    closeRequest() {
      this.element.classList.remove("request-opened");
    }
  };

  // app/javascript/controllers/tabs_controller.js
  var tabs_controller_default = class extends Controller {
    static targets = ["panel", "tab"];
    nav(event) {
      this.tabTargets.forEach((tab) => {
        tab.classList.toggle("current", tab === event.target);
      });
      this.panelTargets.forEach((panel) => {
        panel.classList.toggle("hidden", panel.id !== event.target.getAttribute("target"));
      });
    }
  };

  // app/javascript/controllers/index.js
  application.register("code-syntax", code_syntax_controller_default);
  application.register("home", home_controller_default);
  application.register("tabs", tabs_controller_default);
})();
/*! Bundled license information:

@hotwired/turbo/dist/turbo.es2017-esm.js:
  (*!
  Turbo 8.0.4
  Copyright © 2024 37signals LLC
   *)
*/
//# sourceMappingURL=application.js.map
