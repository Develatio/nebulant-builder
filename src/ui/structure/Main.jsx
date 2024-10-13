import { Component } from "react";
import { ToastContainer } from "react-toastify";

import Url from "@src/utils/domurl";
import {
  loadContent,
  importAsBlueprint,
  createNewBlueprint,
} from "@src/controllers/handlers/import";
import { BlueprintActions } from "@src/controllers/BlueprintActions";

import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { GConfig } from "@src/core/GConfig";
import { EventBus } from "@src/core/EventBus";
import { CliConnectorStates } from "@src/core/CliConnector";

import { BaseEngine } from "@src/engine/BaseEngine";
import { BaseStencil } from "@src/engine/BaseStencil";

import { BaseDiagramModel } from "@src/models/BaseDiagramModel";

import { Canvas } from "@src/ui/structure/Canvas";
import { Header } from "@src/ui/structure/Header";
import { Footer } from "@src/ui/structure/Footer";
import { About } from "@src/ui/structure/About/About";
import { DownloadCli } from "@src/ui/structure/DownloadCli";
import { SidebarLeft } from "@src/ui/structure/SidebarLeft";
import { SidebarRight } from "@src/ui/structure/SidebarRight";
import { NodeInfo } from "@src/ui/structure/NodeInfo/NodeInfo";
import { AppSettings } from "@src/ui/structure/AppSettings/AppSettings";
import { NodeSettings } from "@src/ui/structure/NodeSettings/NodeSettings";
import { AutocompletePreview } from "@src/ui/structure/AutocompletePreview";

import { Intellisense } from "@src/intellisense/base/Intellisense";

export class Main extends Component {
  constructor(props) {
    super(props);

    this.logger = new Logger();
    this.runtime = new Runtime();
    this.gconfig = new GConfig();
    this.eventBus = new EventBus();

    // create a new model
    this.model = new BaseDiagramModel();
    this.runtime.set("objects.BaseDiagramModel", BaseDiagramModel);
    this.runtime.set("objects.main_model", this.model);
    this.runtime.set("objects.commandManager", this.model.commandManager);

    // create an instance of the engine
    this.engine = new BaseEngine({ model: this.model });
    this.runtime.set("objects.BaseEngine", BaseEngine);
    this.runtime.set("objects.engine", this.engine);

    this.stencil = new BaseStencil();
    this.runtime.set("objects.stencil", this.stencil);

    const blueprintActions = new BlueprintActions();
    this.runtime.set("objects.blueprintAction", blueprintActions);

    this.state = {
      showInfo: this.gconfig.get("ui.showInfo"),
    };

    this.gconfig.notifyOnChanges("ui.showInfo", (v) => {
      this.setState({
        showInfo: v,
      });
    });
  }

  async componentDidMount() {
    // Not sure if this is dirty or genius... JS's Event Loop consumes from the
    // [Microtask Queue] and then from the [Task Queue]. By awaiting a
    // setTimeout we're effectively pushing <this> to the end of the
    // [Task Queue], which means that this function won't run until all other
    // microtasks and tasks haven been executed (namely, once React has
    // completed running all useEffects() in all the components that are being
    // mounted in "this" moment).
    await new Promise(r => setTimeout(r, 0));

    const url = new Url();
    const { blueprint_uri } = url.query;
    const me = this.runtime.get("state.myself");

    this.engine.drawOn(".application #canvas");

    // If there isn't a blueprint_uri query param in the URL, we must create a
    // new blueprint.
    if((!me && !blueprint_uri) || !blueprint_uri) {
      this.logger.info("No blueprint_uri found in the URL. Creating a new blueprint!");
      const blueprint = createNewBlueprint();
      importAsBlueprint(blueprint);

    // Else, try to load it...
    } else {
      this.logger.info("Found blueprint_uri in the URL. Parsing...");
      this.eventBus.publish("OpenOverlay", {
        message: "Please wait...",
      });

      const data = await loadContent(blueprint_uri);

      this.eventBus.publish("CloseOverlay");

      // ... if we didn't get any data (network problems? not logged in?) it
      // means that we must create a new blueprint.
      //
      // Also, if we did receive something (hopefully a JSON), check it's
      // "blueprint" field. If it's "null", that means that the blueprint was
      // just created (using the user panel) and it doesn't have any actual
      // data, so we just create a new blueprint.
      if(!data || !data?.blueprint) {
        this.logger.warn("No data or incorrect content, falling back to a new blueprint!");
        const blueprint = createNewBlueprint();
        importAsBlueprint(blueprint);

      // If the "blueprint" field does contain something, and the
      // "autosave_diagram" is "true" it means that last time this blueprint was
      // edited there were changes that weren't saved. Ask the user if he/she
      // wants to load these changes or load the blueprint's state at the last
      // time it was saved.
      } else if(data.blueprint?.autosave_diagram) {
        this.eventBus.publish("OpenDialog", {
          title: "Unsaved changes were found...",
          enforceAnswer: true,
          body: (
            <div>
              There were changes that weren't explicitly saved the last time this blueprint was modified.
              These changes were autosaved in a draft.
              <br /><br />
              Do you want to load the draft?
            </div>
          ),
          yes: () => importAsBlueprint(data, { load_autosave: true }),
          no: () => importAsBlueprint(data),
          close: () => importAsBlueprint(data),
        });

      // Else just load the blueprint.
      } else {
        importAsBlueprint(data);
      }
    }

    this.engine.initEventHandlers();
    if(this.gconfig.get("ui.minimap")) {
      this.engine.drawMinimapOn(".application .minimap-container");
    }

    // Right before the tab is closed...
    window.onbeforeunload = e => {
      // ... make sure that there are no unsaved changes. If there are, the user
      // should be made aware of that.
      if(this.runtime.get("state.ops_counter") != 0) {
        e && (e.returnValue = "");
        return "";
      }

      // ... make sure that the CLI state is not higher than "connected". If it
      // is, it means that something is being executed. If so, the user should
      // be made aware of that.
      const cliConnector = this.runtime.get("objects.cliConnector");
      if(cliConnector.state > CliConnectorStates.connected) {
        e && (e.returnValue = "");
        return "";
      } else if(cliConnector.state > CliConnectorStates.disconnected) {
        cliConnector.disconnect();
      }

      const accountConnector = this.runtime.get("objects.accountConnector");
      accountConnector.close();
    };
  }

  render() {
    return (
      <>
        <Header></Header>

        <div className={`
          application-main d-flex
          ${this.state.showInfo ? "show-info" : " hide-info" }
        `}>
          <SidebarLeft></SidebarLeft>

          <ToastContainer
            position="top-right"
            autoClose={15000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            stacked
          />
          <About />
          <DownloadCli />
          <Intellisense />
          <AppSettings />
          <NodeInfo />
          <NodeSettings />
          <AutocompletePreview />

          <Canvas />

          <SidebarRight></SidebarRight>
        </div>

        <Footer></Footer>
      </>
    );
  }
}
