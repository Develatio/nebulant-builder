import { Runtime } from "@src/core/Runtime";
import { BackendConnector } from "@src/core/BackendConnector";

import { BaseAutocompleter } from "@src/components/autocompleters/base/BaseAutocompleter";

export class BlueprintsAutocompleter extends BaseAutocompleter {
  run() {
    return new Promise((resolve) => {
      const backendConnector = new BackendConnector();

      const { page, group, perPage } = this.filters;

      backendConnector.getBlueprints({
        limit: perPage,
        offset: (page - 1),
        //keyword: searchPattern,
        collection_slug: group,
      }).then(result => {
        const runtime = new Runtime();
        const me = runtime.get("state.myself");

        const data = result?.results?.map?.(bp => {
          return {
            type: "value",
            label: bp.name,
            value: `${me.current_organization.slug}/${group}/${bp.slug}`,
          }
        }) || [];

        resolve({
          data,
          prev: result.previous,
          next: result.next,
          total: Math.ceil(result.count / perPage),
        });
      }).catch(_err => {
        resolve({ data: [], total: 0 });
      });
    });
  }
}
