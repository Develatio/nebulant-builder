export const MIN_CLI_VERSION = "0.0.1";

export const SLUG = /^[-a-zA-Z0-9_]+$/;

export const CONTENT_PATH = "" +
  /(?:([-a-zA-Z0-9_]+)\/)?/.source + // organization_slug, optional
  /([-a-zA-Z0-9_]+)\//.source +      // collection_slug, required
  /([-a-zA-Z0-9_]+)/.source +        // blueprint_slug, required
  /(?::([-a-zA-Z0-9_.]+))?/.source   // version, optional

export const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

export const EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const CIDR = /^((?:\d{1,3}.){3}\d{1,3})\/(\d{1,2})$/;
export const NETMASK = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/;

export const RE_RGB_6 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
export const RE_RGB_3 = /^#?([a-f\d]{3})$/i;
export const RE_RGB_2 = /^#?([a-f\d]{2})$/i;

export const OUTPUT_VAR_CHARS = /^[A-Za-z0-9_-]*$/;
