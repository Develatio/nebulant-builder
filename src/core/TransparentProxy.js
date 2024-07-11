import { v4 as uuidv4 } from "uuid";
import { Fetch } from "@src/utils/Fetch";
import { Logger } from "@src/core/Logger";

// "WTF is all this shit¿?" you ask. Buckle up, here goes a story about how I
// spent quite some miserable time and how different browser vendors just insist
// in making my life a fucking hell. I hate you all...
//
// So... We want the builder to be able to connect to the CLI. The builder is
// loaded (via https) from either the dev or the prod domain. The CLI, on the
// other hand, might be running on your own machine or a remote server.
// If it's running on your own machine it means that it's going to be http.
// It's not possible to generate a valid SSL cert for localhost. Well... yeah...
// there is... by adding a CA cert to the certs manager of the OS, but I'm
// **NOT** going to do that. Hard no. Http will be.
// If it's running on a remote server, it might be http, it might be https. That
// really depends on how the CLI was deployed.

// Anyways... "Why is that important?" you ask. Well...
// Browsers won't allow "mixed content"[0]; meaning that if your javascript is
// running from a webpage that was loaded via https, attempts to connect to an
// http endpoint will be blocked.
// [0]: https://w3c.github.io/webappsec-mixed-content/
//
// Fuck :(
//
// Luckily for us, there is a standard called "Potentially trustworthy
// origins[1]", which allows browsers to make exceptions in the "mixed content"
// policy. More precisely, it allows mixed content connections to "localhost"
// and "127.0.0.1" (among others), which is exactly what we need!
// [1]: https://w3c.github.io/webappsec-secure-contexts/#is-origin-trustworthy
//
// :D
//
// Except... Safari.. god damn it Safari... why can't you behave like the rest
// of the browsers¿?![2] You're not special. You're stupid. Don't let anyone
// tell you otherwise.
// [2]: https://bugs.webkit.org/show_bug.cgi?id=171934
//
// (╯°□°）╯︵ ┻━┻
//
// So, thanks to Safari, I'm once again stuck in the middle of two roads. I
// could choose not to support Safari, move on and be happy.. Or... I could
// choose suffering, tears and anger. Obviously, it will be the second.
//
// *sigh* ... what's wrong with me¿?! :(
//
// So... how do we support Safari? Well... there is that one thing called
// "postMessage()"[3] that can be used to communicate different pages on
// different domains while also skipping completely the "mixed content" policy!
// [3]: https://www.w3.org/TR/2009/WD-html5-20090423/comms.html
//
// So instead of trying to do this:
//
// HTTPS                   HTTP
// ┌─────────┐ ─────────► ┌─────┐
// │         │            │     │
// │ Builder │   HTTP     │ CLI │
// │         │            │     │
// └─────────┘ ◄───────── └─────┘
//
// We're gonna do this:
//
// HTTPS                    HTTP             HTTP
// ┌─────────┐ ─────────►  ┌───────┐ ─────► ┌─────┐
// │         │             │       │        │     │
// │ Builder │ postMessage │ Proxy │ HTTP   │ CLI │
// │         │             │       │        │     │
// └─────────┘ ◄─────────  └───────┘ ◄───── └─────┘
//
// If the browser complies with the "potentially trustworthy origins" specs,
// we'll just connect to the CLI with plain HTTP connection(s). And if it
// doesn't, we'll open a popup (loaded via http, served by the CLI itself) and
// communicate with it via postMessage. The popup will then receive our messages
// and redirect them to the CLI (which it will be able to connect to via http as
// we wouldn't be violating the "mixed content" policy). When the CLI replies
// with some data, the proxy will retransmit it to our builder via postMessage.
//
// Of course, if you go and read how postMessage works, you'd realise that
// anyone (another tab, an extension, etc...) could receive the messages that
// are sent via postMessage. And you'd be right! This is why both the builder
// and the proxy limit the origins from/to which they can send/receive messages.
// "We should be safe". (that is, unless I made some mistake somewhere...)
//
// Anyways, the popup will act like a reverse proxy for both http and ws
// connections. Ideally in a transparent way, like handling stuff like
// reconnections, the user closing the popup (because who the fuck reads
// anything anyways, not even warning messages warning about not closing stuff),
// etc... Ideally, the callee wouldn't even know anything about the popup. The
// callee should just call .get(), .post() or .whatever() and receive a result,
// just like it would if it was calling the Fetch() class.
//
// That's what all this shit is.

export class TransparentProxy {
  constructor() {
    if(!!TransparentProxy.instance) {
      return TransparentProxy.instance;
    }

    this.logger = new Logger();

    // Toggle the way this proxy will behave. There are two options:
    //
    // "direct" - Direct connections will be used. No popup required, which
    // means that it's less hacky, but all Mixed-Content, Same-Origin and other
    // security policies will kick in. This mode should be used in Chrome or
    // Firefox, and only when the target is "localhost".
    //
    // "popup" - A popup will be created and all communications will be bridged
    // through postMessage. This is kind of a hacky solution, but it will work
    // in all browsers and it will let us completely bypass CSP, MCBP, CORS and
    // any other security measures.
    this.mode = "direct";

    // This will be used to notify the callee when the popup gets closed
    this.closeCallback = null;

    // This is the handle for the popup
    this.popup = null;

    // This is the url that we might use (if/when "popup" mode)
    this.popup_url = null;

    const { protocol, host } = new URL(window.location.href);
    this.builder_url = `${protocol}//${host}`;

    // This is where all the resolve/reject callbacks will be stored. When the
    // proxy makes an HTTP request (not a WS msg), it will generate a promise
    // and it will assign the resolve/reject callbacks of that promise to an
    // UUID. The popup (which is the one who's actually doing the real requests)
    // will return the response and the UUID via a postMessage. We can then use
    // this hashmap to find the corresponding resolve/reject callbacks by using
    // the UUID and trigger them.
    this.msgqueue = {};

    // This might me used as a WebSocket connection handler, depending on
    // whether we're using a direct connection method or if we're proxying over
    // a popup.
    this.ws_conn = null;

    // You MUST assign these in the callee that is creating an instance of this
    // proxy.
    this.onWebSocketOpen = null;
    this.onWebSocketClose = null;
    this.onWebSocketError = null;
    this.onWebSocketMessage = null;

    TransparentProxy.instance = this;

    window.addEventListener("message", event => {
      const { protocol, host } = new URL(event.origin);
      const eventOrigin = `${protocol}//${host}`;

      if(eventOrigin !== this.popup_url) return;

      try {
        this._handleMsg(event);
      } catch (error) {
        this.logger.error(error);
      }
    }, false);

    return this;
  }

  setProxy(url) {
    const { protocol, host } = new URL(url);
    this.popup_url = `${protocol}//${host}`;
  }

  _handleMsg(event) {
    const { command, msgid, status, data, nebulant } = event.data;
    if(!nebulant) return;

    this.logger.debug(`Received "${command || msgid}" (${status}) message from transparent proxy`);

    switch (command) {
      case "log":
        if(status == "ko") {
          this.logger.error(`Msg from transparent proxy: ${data}`);
        } else {
          this.logger.debug(`Msg from transparent proxy: ${data}`);
        }
        break;

      case "onWebSocketOpen":
        this.onWebSocketOpen(data);
        break;

      case "onWebSocketClose":
        this.onWebSocketClose(data);
        break;

      case "onWebSocketError":
        this.onWebSocketError(data);
        break;

      case "onWebSocketMessage":
        this.onWebSocketMessage(data);
        break;

      case "command_reply":
        if(msgid in this.msgqueue) {
          const obj = this.msgqueue[msgid];
          if(status == "ok") {
            obj.resolve(data);
          } else {
            obj.reject(data);
          }
          delete this.msgqueue[msgid];
        }
        break;

      case "onLoaded":
        // Resolve the promise
        const promise = this.msgqueue["load"];
        promise["resolve"]();
        delete this.msgqueue["load"];

        // TODO: find a way to focus the opener window...
        break;

      case "onUnload":
        this._onClose();
        break;
    }
  }

  _open() {
    return new Promise((resolve, reject) => {
      if(this.popup) {
        this.logger.debug("We already have a popup, refusing to open another one...");
        resolve();
        return;
      }

      this.logger.debug("Trying to open a new popup...");

      const width = 440;
      const height = 140;
      const centerX = window.screenX + (window.outerWidth / 2) - (width / 2);
      const centerY = window.screenY + 100; // + (window.outerHeight / 2) - (height / 2);

      const opts = Object.entries({
        width: width,
        height: height,
        left: centerX,
        top: centerY,
        menubar: 0,
        toolbar: 0,
        location: 0,
        status: 0,
        resizable: 0,
        scrollbars: 0,
      }).map(([k, v]) => `${k}=${v}`).join(",");

      this.popup = window.open(
        `${this.popup_url}/proxy.html?targetOrigin=${encodeURIComponent(this.builder_url)}`,
        "_blank",
        opts,
      );

      this.msgqueue["load"] = { resolve, reject };
    });
  }

  // This will be trigger by a postMessage "unload" sent when the popup is being
  // closed (or if the user managed to somehow change the href of the popup)
  _onClose() {
    this.popup = null;
    this.onClose && this.onClose();
  }

  _send(data) {
    this.popup && this.popup.postMessage({
      ...data,
      nebulant: true,
    }, this.popup_url);
  }

  // This will be triggered from the CliConnector, probably when the user clicks
  // on the "disconnect" button.
  closeProxy() {
    if(this.popup) {
      this.popup.close();
      this.popup = null;
    }
  }

  get(target, opts = {}) {
    if(this.mode == "popup") {
      return new Promise((resolve, reject) => {
        this._open().then(() => {
          const msgid = uuidv4();

          // Breakpoint useful for debugging the proxy
          //debugger;

          // We need this because the opts object might contain an AbortController
          // object. That object can't be serialized and sent via postMessage, so
          // we need to remove it. The proxy.js will create a new one after it has
          // received the message.
          delete opts.signal;

          this.msgqueue[msgid] = { resolve, reject };
          this._send({ command: "get", target, opts, msgid });
        });
      });
    } else {
      return new Fetch().get(target, opts);
    }
  }

  post(target, data = {}, opts = {}) {
    if(this.mode == "popup") {
      return new Promise((resolve, reject) => {
        this._open().then(() => {
          const msgid = uuidv4();

          // Breakpoint useful for debugging the proxy
          //debugger;

          // We need this because the opts object might contain an AbortController
          // object. That object can't be serialized and sent via postMessage, so
          // we need to remove it. The proxy.js will create a new one after it has
          // received the message.
          delete opts.signal;

          this.msgqueue[msgid] = { resolve, reject };
          this._send({ command: "post", target, data, opts, msgid });
        });
      });
    } else {
      return new Fetch().post(target, data, opts);
    }
  }

  WebSocket(target) {
    if(this.mode == "popup") {
      this._send({ command: "openws", target });
    } else {
      this.ws_conn = new WebSocket(target);

      this.ws_conn.onopen = (evt) => {
        this.onWebSocketOpen && this.onWebSocketOpen(evt);
      }

      this.ws_conn.onclose = (evt) => {
        this.onWebSocketClose && this.onWebSocketClose(evt);
      }

      this.ws_conn.onerror = (err) => {
        this.onWebSocketError && this.onWebSocketError(err);
      }

      this.ws_conn.onmessage = (evt) => {
        this.onWebSocketMessage && this.onWebSocketMessage(evt);
      }
    }
  }

  closeWS(status=1000) {
    if(this.mode == "popup") {
      this._send({ command: "closews", data: { status } });
    } else {
      if(this.ws_conn) {
        try {
          this.ws_conn.close(status);
        } catch (_error) {
          //
        }
        this.ws_conn = null;
      }
    }
  }
}
