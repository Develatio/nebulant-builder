// I just wanted things to load fast, but this got out of hand...
// Good luck making any sense of this!

import { CacheFirst } from "workbox-strategies";
import { setCacheNameDetails } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { registerRoute, NavigationRoute, Route } from "workbox-routing";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";

self.addEventListener("install", () => {
  // Skip over the "waiting" lifecycle state, to ensure that our new service
  // worker is activated immediately, even if there's another tab open
  // controlled by our older service worker code.
  self.skipWaiting();
});

// Make it possible to use the builder offline. This will precache the
// "index.html" file.
//
// NOTE: If we enable this in dev mode we'd need to refresh twice in order to
// see any changes. This occurs because of the specific cache strategy that is
// used for the navigation. Nevertheless, if you want to enable this in dev
// mode, uncomment the following condition:
//                        vvvvvvvvvvvvv
if(process.env.PRODUCTION /* || true */) {
  setCacheNameDetails({
    prefix: "",
    precache: "html-assets",
    suffix: "",
  });

  // Precache HTMLs for offline usage
  precacheAndRoute([
    {
      url: "/",
      revision: process.env.BUILD_TIMESTAMP,
    },
    {
      url: "/index.html",
      revision: process.env.BUILD_TIMESTAMP,
    },
  ], {
    // Ignore all URL parameters.
    ignoreURLParametersMatching: [/.*/],

    // Don't append ".html" to URLs
    cleanUrls: false,
  });

  // This will intercept all navigation routes and it will return the precached
  // content of "index.html".
  const handler = createHandlerBoundToURL("/index.html");
  const navigationRoute = new NavigationRoute(handler);
  registerRoute(navigationRoute);
}

// Setup expiration plugin
// This will be used to cache all the scripts, styles fonts and images of the
// builder itself.
const expPlugin = new ExpirationPlugin({
  maxEntries: 10,
  purgeOnQuotaError: true,
  matchOptions: {
    ignoreVary: true,
  },
});

// Setup cacheable plugin
// This will be used by all cache strategies.
const cachePlugin200OK_SW = new CacheableResponsePlugin({
  statuses: [200],
  headers: {
    "X-Nebulant-SW-Cache": "true",
  },
});

// Cache static resources (images, fonts, JS scripts and CSS styles)
[
  {
    type: "image",
    urlhints: [".svg", ".png", ".jpeg", ".jpg"],
    cacheName: "image-assets",
    plugins: [cachePlugin200OK_SW],
  },
  {
    type: "font",
    urlhints: [".woff", ".woff2"],
    cacheName: "font-assets",
    plugins: [cachePlugin200OK_SW],
  },
  {
    type: "script",
    urlhints: [".js"],
    cacheName: "script-assets",
    plugins: [expPlugin, cachePlugin200OK_SW],
  },
  {
    type: "style",
    urlhints: [".css"],
    cacheName: "style-assets",
    plugins: [expPlugin, cachePlugin200OK_SW],
  },
].forEach(obj => {
  const assetRoute = new Route(({ request }) => {
    if(request.destination) {
      return request.destination === obj.type;
    } else {
      const [requrl] = request.url.split("?");
      return obj.urlhints.some(url => requrl.endsWith(url));
    }
  }, new CacheFirst({
    cacheName: obj.cacheName,
    matchOptions: {
      ignoreVary: true,
    },
    plugins: obj.plugins,
  }));
  registerRoute(assetRoute);
});

// Setup expiration plugin (with incremented maxEntries)
// This will be used to cache all the assets fetched from the several
// builer-assets domains.
const expPluginExtended = new ExpirationPlugin({
  maxEntries: 100,
  purgeOnQuotaError: true,
  matchOptions: {
    ignoreVary: true,
  },
});

// This will cache all the resources that must be fetched from the
// builder-assets domain (shared with the CLI), except for the URLs in the
// array below.
const NO_CACHE_ASSETS = [
  "/assets.json",
];

const cachePlugin200OK = new CacheableResponsePlugin({
  statuses: [200],
});

const assetRoute = new Route(({ url, request }) => {
  // Skip the SW if the URL of the request is contained in the array of URLs
  // that shouldn't be cached.
  if(NO_CACHE_ASSETS.some(u => request.url.includes(u))) {
    return false;
  }

  if(request.destination === "") {
    return [
      "builder-assets.nebulant.lc",
      "builder-assets.nebulant.dev",
      "builder-assets.nebulant.app",
    ].includes(url.hostname);
  }

  return false;
}, new CacheFirst({
  cacheName: "builder-assets",
  matchOptions: {
    ignoreVary: true,
  },
  plugins: [expPluginExtended, cachePlugin200OK],
}));
registerRoute(assetRoute);
