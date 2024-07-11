import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { GConfig } from "@src/core/GConfig";
import { EventBus } from "@src/core/EventBus";
import { BackendConnector } from "@src/core/BackendConnector";


export class AccountConnector {
  constructor() {
    if(!!AccountConnector.instance) {
      return AccountConnector.instance;
    }

    this.logger = new Logger();
    this.gconfig = new GConfig();
    this.runtime = new Runtime();
    this.eventBus = new EventBus();

    this.allowedOrigins = [];
    let { protocol, host } = new URL(process.env.LOGIN_ENDPOINT);
    this.allowedOrigins.push(`${protocol}//${host}`);
    ({ protocol, host } = new URL(process.env.LOGOUT_ENDPOINT));
    this.allowedOrigins.push(`${protocol}//${host}`);

    this.logger.debug("Creating account connector.");

    AccountConnector.instance = this;

    window.addEventListener("message", event => {
      if(!this.popup) return;

      const { protocol, host } = new URL(event.origin);
      const eventOrigin = `${protocol}//${host}`;

      if(!this.allowedOrigins.includes(eventOrigin)) return;

      try {
        this._handleMsg(event);
      } catch (error) {
        this.logger.error(error);
      }
    }, false);

    return this;
  }

  _handleMsg(event) {
    const { msg, nebulant } = event.data;
    if(!nebulant) return;

    this.logger.debug(`Received "${msg}" message from account connector`);

    switch (msg) {
      case "login_success":
        this.loginsuccess();
        break;
      case "logout_succcess":
        this.logoutsuccess();
        break;
    }
  }

  loginsuccess() {
    // Fetch my own data
    const logger = new Logger();
    const runtime = new Runtime();
    const gconfig = new GConfig();
    const backendConnector = new BackendConnector();

    logger.info("Received OK from the login popup!");

    backendConnector.getMyself().then(me => {
      runtime.set("state.myself", me);

      if(me.builder_prefs) {
        gconfig.set("", me.builder_prefs, { skip_save_myself: true });
      }

      this.popup.close();
      this.popup = null;
    }).catch(_err => {
      logger.error("The login popup sent an OK, but there was an error while retrieving the user's data.");
    });
  }

  login() {
    const logger = new Logger();
    logger.info("Opening login popup...");

    const width = 400;
    const height = 650;
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
      `${process.env.LOGIN_ENDPOINT}/?next=/popuploginsuccess/`,
      "_blank",
      opts,
    );
  }

  logout() {
    const logger = new Logger();
    logger.info("Opening logout popup...");

    const width = 400;
    const height = 650;
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
      `${process.env.LOGOUT_ENDPOINT}/?next=/popuplogoutsuccess/`,
      "_blank",
      opts,
    );
  }

  logoutsuccess() {
    window.location.href = "/";
  }

  close() {
    if(this.popup) {
      this.popup.close();
    }
  }
}
