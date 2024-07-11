import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

export class CountriesAutocompleter extends StaticAutocompleter {
  async prerun() {
    await new Promise((resolve) => {
      this.builderAssets.get({ asset_id: "hetznerCloud/countries" }).then(data => {
        this.data = data || [];

        this.data = this.data.map(country => {
          return {
            label: `${country.network_zone} (${country.country})`,
            value: country.network_zone,
          };
        });
        resolve();
      }).catch(_err => {
        resolve();
      });
    });
  }
}
