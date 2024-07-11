import { BackendConnector } from "@src/core/BackendConnector";

import { BaseAutocompleter } from "@src/components/autocompleters/base/BaseAutocompleter";

export class CollectionsAutocompleter extends BaseAutocompleter {
  run() {
    return new Promise((resolve) => {
      const backendConnector = new BackendConnector();

      const { page, _group, perPage } = this.filters;

      backendConnector.getCollections({
        limit: perPage,
        offset: (page - 1),
        //keyword: searchPattern,
      }).then(result => {
        const data = result?.results?.map?.(bp => {
          return {
            type: "value",
            label: bp.name,
            value: bp.slug,
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
