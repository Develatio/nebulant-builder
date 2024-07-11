import { mergeWithArrays } from "@src/utils/lang/mergeWithArrays";
import { BaseAutocompleter } from "@src/components/autocompleters/base/BaseAutocompleter";

export class AWSAutocompleter extends BaseAutocompleter {
  constructor({ node, filters, data } = {}) {
    super({ node, filters, data });

    const setRegionNode = new this.shapes.nebulant.rectangle.vertical.aws.SetRegion();
    this.appendNode(setRegionNode);
    setRegionNode.prop("data/autocomplete", true);
    setRegionNode.prop("data/settings", setRegionNode.validator.getDefaultValues(), {
      rewrite: true, // don't merge, instead overwrite everything
    });
    setRegionNode.prop("data/settings/parameters/Region", [this.filters.group]);
  }

  // A common method that is used to remove a filter from the node's settings.
  removeFilterByName({ node, name = "name" }) {
    let settings = node.prop("data/settings");
    settings.parameters.Filters = settings.parameters.Filters.filter(filter => filter.name != name);

    node.prop("data/settings", settings, {
      rewrite: true, // don't merge, instead overwrite everything
    });
  }

  // A common method that is used to remove a tag filter from the node's settings.
  removeFilterByTagName({ node, tagName = "name" }) {
    let settings = node.prop("data/settings");
    settings.parameters.Filters = settings.parameters.Filters.filter(filter => filter.value[0] != tagName);

    node.prop("data/settings", settings, {
      rewrite: true, // don't merge, instead overwrite everything
    });
  }

  // A common method that is used to add a tag filter to the node's settings.
  // Usually you'd want to use it to filter by the "name" (the tag called "Name")
  // of the aws objects you're looking for.
  addFilterByTag({ node, tagName = "Name", tagValue }) {
    const filterObj = {
      name: "tag",
      value: [tagName, tagValue],
    };

    this.addFilter({ node, filterObj });
  }

  // A common method that is used to add an entire filter to the node's settings.
  addFilter({ node, filterObj }) {
    const settings = node.prop("data/settings");
    node.prop("data/settings", mergeWithArrays(settings, {
      parameters: {
        Filters: [
          filterObj,
        ],
      },
    }), {
      rewrite: true, // don't merge, instead overwrite everything
    });
  }

  // TODO: addFilters() that will allow us to add multiple nodes that will run
  // in parallel (also add a "Join Threads" node).
}
