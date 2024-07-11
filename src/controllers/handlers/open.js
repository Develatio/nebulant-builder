import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import FormGroup from "react-bootstrap/esm/FormGroup";

import Url from "@src/utils/domurl";
import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";

import { BlueprintsAutocompleter } from "@src/components/autocompleters/backend/BlueprintsAutocompleter";
import { CollectionsAutocompleter } from "@src/components/autocompleters/backend/CollectionsAutocompleter";

export const open = async () => {
  const runtime = new Runtime();
  const eventBus = new EventBus();

  const me = runtime.get("state.myself");

  if(!me) {
    eventBus.publish("LoginAsRoot");
    return;
  }

  eventBus.publish("OpenOverlay", {
    message: "Please wait...",
  });

  const collections = await new CollectionsAutocompleter({
    filters: { perPage: 100, page: 1 },
  }).run();

  if(collections.total > 0) {
    collections.data[0].selected = true;
  }

  eventBus.publish("CloseOverlay");

  eventBus.publish("OpenDialog", {
    scrollable: false,
    title: "Select a blueprint",
    formValues: {
      blueprint_uri: [],
    },
    body: (props) => {
      return (
        <FormGroup className="form-group" as={Row}>
          <Col sm={12}>
            <DropdownInput
              form={props.form}
              validations={props.validations}
              path="blueprint_uri"
              multi={false}
              label="Select a blueprint"
              placeholder="Select..."
              help_text="Pick one of your collections, then select one of the blueprints"
              groups={collections.data}
              groupsDisallowUnselect={true}
              options={[
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new BlueprintsAutocompleter({
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run();
                },
              ]}
            >
            </DropdownInput>
          </Col>
          <Col sm={2}></Col>
        </FormGroup>
      )
    },
    ok: async ({ form, _validations }) => {
      const [ blueprint_uri ] = form.get("blueprint_uri");
      if(!blueprint_uri) return;

      const url = new Url();
      url.query.blueprint_uri = blueprint_uri;
      window.location.href = `/?${url.query}`;
    },
    cancel: () => {},
  });
}
