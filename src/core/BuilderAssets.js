import { Fetch } from "@src/utils/Fetch";
import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";

export class BuilderAssets {
  constructor() {
    if(!!BuilderAssets.instance) {
      return BuilderAssets.instance;
    }

    this.logger = new Logger();
    this.runtime = new Runtime();

    // This will be populated by the preload() method.
    this.assets_descriptor = [];

    BuilderAssets.instance = this;
    return this;
  }

  getUrlFromAssetPath(asset_path) {
    return `${process.env.BUILDER_ASSETS_ENDPOINT}/${asset_path}`;
  }

  preload() {
    const r = (new Date()).getTime(); // Make sure to avoid any cache
    const url = this.getUrlFromAssetPath(`assets.json?r=${r}`);

    this.logger.debug("Loading assets descriptor");
    new Fetch().get(url).then(response => {
      this.assets_descriptor = response.data;
    }).catch(err => {
      if(err.response) {
        this.logger.error(`Error ${err.status} while fetching assets descriptor`);
      } else {
        this.logger.error("Unhandled error while trying to fetch assets descriptor");
      }
    });
  }

  getAssetDescriptor(asset_id) {
    const asset = this.assets_descriptor.find(asset => asset.id === asset_id);

    return asset;
  }

  // Fetch an asset from the builder-assets domain
  get({ asset_id, asset_path, version }) {
    return new Promise((resolve, reject) => {
      let asset;

      // If we received an asset_id, find it in the assets descriptor and use
      // it; if we received an asset_path, just build and fetch that url.
      //
      // NOTE: Not all assets are listed in the assets descriptor as that would
      // increase the size of the assets descriptor. For example, the name, url
      // and hash of each AWS AMI is not listed.
      if(asset_id) {
        asset = this.getAssetDescriptor(asset_id);
      } else if(asset_path) {
        asset = {
          url: this.getUrlFromAssetPath(asset_path),
          // NOTE: we might want to cache forever some assets, which is why we
          // might want to pass the "version" parameter. For example, the
          // response with the details of an AWS AMI should be cached forever,
          // without versioning (because that asset won't change ever).
          version: version || process.env.BUILD_TIMESTAMP,
        };
      }

      if(!asset) {
        this.logger.error(`Can't find requested asset (${asset_id}) in assets descriptor`);
        reject();
      }

      const url = asset.url;
      const params = new URLSearchParams({
        revision: asset.version,
      }).toString();

      new Fetch().get(`${url}?${params}`).then(response => {
        resolve(response.data);
      }).catch(err => {
        if(err.response) {
          this.logger.error(`Error ${err.status} while fetching asset ${asset_id}`);
        } else {
          this.logger.error(`Unhandled error while trying to fetch asset ${asset_id}`);
        }
        reject();
      });
    });
  }

  // Use the CLI to search in an asset
  search({ asset_id, keyword, limit = 10, offset = 0, sort, region }) {
    return new Promise((resolve, _reject) => {
      const cliConnector = this.runtime.get("objects.cliConnector");
      cliConnector.asset({ asset_id, keyword, limit, offset, sort, region }).then(data => {
        if(data.count == 0) {
          resolve([]);
        } else {
          resolve(data.results);
        }
      }).catch(_err => {
        resolve([]);
      });
    });
  }
}
