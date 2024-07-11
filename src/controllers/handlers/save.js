import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import FormGroup from "react-bootstrap/esm/FormGroup";

import { object, string, array } from "yup";

import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";

import Url from "@src/utils/domurl";
import { SLUG } from "@src/utils/constants";
import { clone } from "@src/utils/lang/clone";
import { sluggify } from "@src/utils/sluggify";
import { content_path_parser } from "@src/utils/content_path_parser";

import { TextInput } from "@src/ui/functionality/TextInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";

import { saveAsPNG } from "@src/controllers/handlers/saveAsPNG";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

import {
  Migrator as DiagramMigrator,
} from "@src/components/implementations/base/migrators/DiagramDataMigrator";
import {
  generateBlueprint,
} from "@src/components/blueprintGenerators/generateBlueprint";

const _save = async ({ collection_slug, blueprint_slug, payload, dataURI }) => {
  const runtime = new Runtime();
  const eventBus = new EventBus();
  const backendConnector = runtime.get("objects.backendConnector");

  const ops_counter = runtime.get("state.ops_counter");

  // We have an existing blueprint. Just save it
  backendConnector.saveBlueprint({
    collection_slug,
    blueprint_slug,
    blueprint: payload,
    preview: dataURI,
  }).then(res => {
    runtime.set("state.ops_counter", 0);
    runtime.set("state.pristineBlueprint", clone(res.blueprint));
    eventBus.publish("CloseOverlay");
  }).catch(_ => {
    eventBus.publish("CloseOverlay");
    eventBus.publish("OpenOverlay", {
      message: "Error while saving the blueprint. If this issue persists, please export the blueprint to a file to avoid losing any unsaved changes",
      variant: "danger",
    });

    // If we didn't save the blueprint, revert the "ops_counter" field to
    // it's previous value.
    runtime.set("state.ops_counter", ops_counter);

    setTimeout(() => {
      eventBus.publish("CloseOverlay");
    }, 7000);
  });
}

const _create = async ({ collections, payload, dataURI }) => {
  const runtime = new Runtime();
  const eventBus = new EventBus();
  const backendConnector = runtime.get("objects.backendConnector");

  const ops_counter = runtime.get("state.ops_counter");

  const model = runtime.get("objects.main_model");
  const { name, description } = model.getStartNode().prop("data/settings/parameters");

  eventBus.publish("OpenDialog", {
    scrollable: false,
    title: "Save dialog",
    formValues: {
      name,
      slug: sluggify(name),
      description,
      collection_slug: [],
    },
    schema: object({
      name: string().required().label("Name"),
      slug: string().required().label("Slug").matches(
        SLUG,
        "Slug can contain only upper and lower case letters, numbers, hyphens and underscores"
      ),
      description: string().label("Description"),
      collection_slug: array().of(string()).required().min(1).max(1).label("Collection slug"),
    }),
    body: (props) => {
      return (
        <>
          <FormGroup className="form-group" as={Row}>
            <Col sm={6}>
              <TextInput
                form={props.form}
                validations={props.validations}
                path="name"
                onChange={v => props.form.set("slug", sluggify(v))}
                label="Type a name for this blueprint"
                placeholder="Type a name for this blueprint"
              >
              </TextInput>
            </Col>

            <Col sm={6}>
              <TextInput
                form={props.form}
                validations={props.validations}
                path="slug"
                label="Type a slug for this blueprint"
                placeholder="Type a slug for this blueprint"
              >
              </TextInput>
            </Col>

            <Col sm={6}>
              <TextInput
                as="textarea"
                form={props.form}
                validations={props.validations}
                path="description"
                label="Type a description for this blueprint"
                placeholder="Type a description for this blueprint"
              >
              </TextInput>
            </Col>

            <Col sm={6}>
              <DropdownInput
                form={props.form}
                validations={props.validations}
                path="collection_slug"
                multi={false}
                editable={false}
                label="Select a collection"
                placeholder="Select a collection"
                options={[
                  ({ searchPattern, page, perPage, group, pagingDetails }) => {
                    return new StaticAutocompleter({
                      data: collections,
                      filters: { searchPattern, page, perPage, group, pagingDetails },
                    }).run();
                  },
                ]}
              >
              </DropdownInput>
            </Col>
          </FormGroup>
        </>
      )
    },
    ok: async ({ form, _validations }) => {
      eventBus.publish("CloseDialog");

      let [collection_slug] = form.get("collection_slug");
      const slug = form.get("slug");

      const model = runtime.get("objects.main_model");
      model.getStartNode().prop("data/settings/parameters/name", form.get("name"));
      model.getStartNode().prop("data/settings/parameters/description", form.get("description"));

      // no collection selected, don't close the modal
      if(!collection_slug) {
        setTimeout(() => {
          _create({ collections, payload, dataURI });
        });
        return;
      }

      eventBus.publish("OpenOverlay", {
        message: "Please wait...",
      });

      const me = runtime.get("state.myself");
      try {
        // First create a new blueprint, then update it's content
        const resCreate = await backendConnector.createBlueprint({
          name,
          description,
          slug,
          collection_slug,
        });

        const resSave = await backendConnector.saveBlueprint({
          collection_slug,
          blueprint_slug: resCreate.slug,
          blueprint: payload,
          preview: dataURI,
        });

        // Set the new uuid to the URL
        const url = new Url();
        url.query.blueprint_uri = `${me.current_organization.slug}/${collection_slug}/${resCreate.slug}`;
        window.history.replaceState(null, null, `?${url.query}`);

        runtime.set("state.ops_counter", 0);
        runtime.set("state.pristineBlueprint", clone(resSave.blueprint));

        eventBus.publish("CloseOverlay");
      } catch (_error) {
        eventBus.publish("CloseOverlay");
        eventBus.publish("OpenOverlay", {
          message: "Error while creating blueprint...",
          variant: "danger",
        });

        // If we didn't save the blueprint, revert the "ops_counter" field
        // to it's previous value.
        runtime.set("state.ops_counter", ops_counter);

        setTimeout(() => {
          eventBus.publish("CloseOverlay");
        }, 7000);
      }
    },
    cancel: () => {
      eventBus.publish("CloseDialog");
    },
  });
}

export const save = async () => {
  const logger = new Logger();
  const runtime = new Runtime();
  const eventBus = new EventBus();

  // Check if logged in...
  const me = runtime.get("state.myself");
  if(!me) {
    eventBus.publish("LoginAsRoot");
    return;
  }

  const url = new Url();
  const { blueprint_uri } = url.query;

  if(blueprint_uri) {
    const {
      isValid,
      organization_slug,
      version,
    } = content_path_parser(blueprint_uri);

    // We don't want to attempt to save this blueprint if we blueprint_uri is
    // invalid...
    if(!isValid) {
      const e = `Refusing to save blueprint at "${blueprint_uri}". This is an invalid URL!`;
      logger.error(e);
      eventBus.publish("Toast", { msg: e, lvl: "error" });
      return;
    }

    // ... or if this blueprint doesn't belong to the user's organization...
    if(organization_slug !== me.current_organization.slug) {
      const e = `Refusing to save blueprint at "${blueprint_uri}". This blueprint doesn't belong to your organization!`;
      logger.error(e);
      eventBus.publish("Toast", { msg: e, lvl: "error" });
      return;
    }

    // ... or if this is a snapshot. Snapshots are read-only!
    if(version) {
      const e = `Refusing to save blueprint at "${blueprint_uri}". This is a read-only URL!`;
      logger.error(e);
      eventBus.publish("Toast", { msg: e, lvl: "error" });
      return;
    }
  }

  const backendConnector = runtime.get("objects.backendConnector");

  eventBus.publish("OpenOverlay", {
    message: "Please wait...",
  });

  // This is required in order to give the OpenOverlay enough time (and idle
  // cycles) to actually render itself
  await new Promise(resolve => setTimeout(resolve, 500));

  // First generate the actual payload that must be saved:
  const model = runtime.get("objects.main_model");
  const diagram = model.getCleanModel(
    model.getStartNode(),
    "children",
  ).serialize();

  const { actions, min_cli_version, isValid } = generateBlueprint(diagram);

  if(!isValid) {
    eventBus.publish("crash", {
      error: "The blueprint was saved, but it has errors and running it won't be possible, however you'll still be able to load it into the builder and edit it. Check log viewer for details.",
    });
  }

  const cm = runtime.get("objects.commandManager");

  // Don't forget to save the position of the paper in the blueprint
  const engine = runtime.get("objects.engine");
  const center = engine.scroller.getVisibleArea().center();
  model.set("x", center.x, { skip_undo_stack: true });
  model.set("y", center.y, { skip_undo_stack: true });

  const payload = {
    cm: cm.toJSON(),
    diagram: model.serialize(),
    diagram_version: new DiagramMigrator().getLatestVersion(),

    n_errors: runtime.get("state.warn_counter"),
    n_warnings: runtime.get("state.err_counter"),

    actions,
    min_cli_version,

    builder_version: process.env.VERSION,
  };

  // And then save it
  const dataURI = await saveAsPNG({ silent: true });

  if(blueprint_uri) {
    const {
      collection_slug,
      blueprint_slug,
    } = content_path_parser(blueprint_uri);

    _save({ collection_slug, blueprint_slug, payload, dataURI });
  } else {
    // We're creating a new blueprint. Fetch existing collections so we can show
    // them to the user and let him/her chose where to save the blueprint.
    backendConnector.getCollections({ limit: 1000, offset: 0 }).then(collections => {
      eventBus.publish("CloseOverlay");

      collections = collections.results.map(p => ({ label: p.name, value: p.slug }));

      _create({ collections, payload, dataURI });
    }).catch(() => {
      // We failed to get the collections...
      eventBus.publish("CloseOverlay");

      eventBus.publish("OpenOverlay", {
        message: "Failed while retrieving available collections",
        variant: "danger",
      });

      setTimeout(() => {
        eventBus.publish("CloseOverlay");
      }, 5000);
    });
  }
}
