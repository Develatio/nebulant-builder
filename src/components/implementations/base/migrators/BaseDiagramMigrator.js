import { Logger } from "@src/core/Logger";
import { clone } from "@src/utils/lang/clone";
import { scrub } from "@src/utils/scrub";

export class BaseDiagramMigrator {
  constructor() {
    this.logger = new Logger();
  }

  // Get all the available migrators. This will return an array such as:
  // ["1.0.1", "1.0.2", "1.1.0", "2.0.0"]
  getAvailableVersions() {
    return [...this.migrations.keys()];
  }

  getLatestVersion() {
    return this.getAvailableVersions().pop();
  }

  isLatestVersion(versions, version) {
    return versions.indexOf(version) == versions.length - 1;
  }

  sortVersions(versions) {
    return versions.sort((a, b) => a.localeCompare(b, undefined, {
      numeric: true,
    }));
  }

  getPendingVersions(versions, version) {
    return versions.slice(versions.indexOf(version) + 1);
  }

  migrate({ data, node_id }) {
    /*
    data = {
      ...other,
      settings: {},
      version: "",
    }
    */
    const dataBkp = clone(data);

    let available_versions = this.getAvailableVersions();

    if(available_versions.length == 0) {
      // There are no migrators
      this.logger.debug("No migrators found. Skipping...");
      return {
        data,
        success: true,
      };
    }

    // Push our version to the list of available migrators. We might be pushing
    // "1.0.0" (which won't exist) or any other semver string (which will exist)
    // Make sure to discard duplicates.
    available_versions = [...new Set([...available_versions, data.version])];

    const versions = this.sortVersions(available_versions);

    this.logger.debug(`Found ${versions.length} migrations: ${versions.join(", ")}. Current version is ${data.version}.`);

    if(this.isLatestVersion(versions, data.version)) {
      // No migrations required
      this.logger.debug("No migrations required.");
      return {
        data,
        success: true,
      };
    } else {
      this.logger.info(`Migrating data of ${data.id} (${node_id}) from version ${data.version} to ${this.getLatestVersion()}...`);
      const pendingMigrations = this.getPendingVersions(versions, data.version);

      let newData = data;

      for(let migration of pendingMigrations) {
        this.logger.info(`Applying migration ${migration} for ${data.id} (${node_id})...`);
        const migrator = this.migrations.get(migration);

        let result = {};
        let errObj = null;
        try {
          result = migrator(clone(newData));
          this.logger.success(`Successfully applied migration ${migration}`);
        } catch (error) {
          errObj = error;
        }

        if(result.success) {
          newData = result.data;
          newData.version = migration;
        } else {
          this.logger.critical(`Error while applying migration for ${data.id} (${node_id}) (${errObj})`);
          this.logger.debug("The data object was:");
          this.logger.debug(scrub(data));
          return {
            data: dataBkp,
            success: false,
          };
        }
      }

      this.logger.debug(`All migrations for ${data.id} (${node_id}) were applied successfully.`);
      return {
        data: newData,
        success: true,
      };
    }
  }
}
