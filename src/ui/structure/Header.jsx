import { useState, useEffect } from "react";

import Nav from "react-bootstrap/esm/Nav";
import Navbar from "react-bootstrap/esm/Navbar";
import Dropdown from "react-bootstrap/esm/Dropdown";

import { GConfig } from "@src/core/GConfig";
import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";
import { DiagramQL } from "@src/data/DiagramQL";

import Logo from "@src/assets/img/logo.svg?transform";

export const Header = () => {
  const runtime = new Runtime();
  const eventBus = new EventBus();
  const gconfig = new GConfig();

  const [me, setMe] = useState(runtime.get("state.myself"));
  const [debug, setDebug] = useState(gconfig.get("advanced.debug"));

  const [menuItemsVisibility, setMenuItemVisibility] = useState({
    "blueprint": false,
    "tools": false,
    "nodes": false,
    "debug": false,
  });

  useEffect(() => {
    runtime.notifyOnChanges("state.myself", setMe);
    gconfig.notifyOnChanges("advanced.debug", setDebug);

    return () => {
      runtime.stopNotifying("state.myself", setMe);
      gconfig.stopNotifying("advanced.debug", setDebug);
    };
  }, []);

  const handleMenuItemHover = (menuKey) => {
    if(Object.values(menuItemsVisibility).some(v => v)) {
      // close all items and then open this item
      setMenuItemVisibility((obj) => {
        Object.entries(obj).forEach(([k, _v]) => obj[k] = false);
        return { ...obj, [menuKey]: true };
      })
    }
  }

  const handleMenuItemToggle = (visible, menuKey) => {
    setMenuItemVisibility((obj) => ({ ...obj, [menuKey]: visible }))
  }

  const getMenuItemVisibility = (menuKey) => menuItemsVisibility[menuKey];

  return (
    <div className="application-header d-flex">
      <div className="w-100 d-flex flex-column px-0">
        {/*<div className="w-100 d-flex align-items-center p-2 main-wrapper"></div>*/}

        <Navbar variant="dark" data-bs-theme="dark" expand="sm" className="w-100 py-3 menu px-3">
          <Nav className="flex-grow-1">
            <Nav.Link as="div" className="logo-wrapper">
              <Logo className="logo" />
            </Nav.Link>

            <Dropdown
              className=""
              onToggle={(visible) => handleMenuItemToggle(visible, "blueprint")}
              onMouseEnter={() => handleMenuItemHover("blueprint")}
              show={getMenuItemVisibility("blueprint")}
            >
              <Dropdown.Toggle as="div" className="nav-link pointer">
                <div className="">Blueprint</div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("NewBlueprint") }>
                  <span className="me-5">Create new</span>
                  <kbd>ctrl/meta + e</kbd>
                </Dropdown.Item>
                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("OpenBlueprint") }>
                  {
                    me ? (
                      <span className="me-5">Open</span>
                    ) : (
                      <span className="me-5">Open <small className="text-muted">(Login required)</small></span>
                    )
                  }
                  <kbd>ctrl/meta + o</kbd>
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("ImportBlueprint")}>
                  <span className="me-5">Import blueprint from file</span>
                </Dropdown.Item>
                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("ExportBlueprint")}>
                  <span className="me-5">Export blueprint to file</span>
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("Save")}>
                  {
                    me ? (
                      <span className="me-5">Save</span>
                    ) : (
                      <span className="me-5">Save <small className="text-muted">(Login required)</small></span>
                    )
                  }
                  <kbd>ctrl/meta + s</kbd>
                </Dropdown.Item>
                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("SaveAsSVG")}>
                  <span className="me-5">Save as SVG</span>
                </Dropdown.Item>
                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("SaveAsPNG")}>
                  <span className="me-5">Save as PNG</span>
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => window.location.href = process.env.PANEL_ENDPOINT}>
                  <span className="me-5">Close</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>


            <Dropdown
              className=""
              onToggle={(visible) => handleMenuItemToggle(visible, "tools")}
              onMouseEnter={() => handleMenuItemHover("tools")}
              show={getMenuItemVisibility("tools")}
            >
              <Dropdown.Toggle as="div" className="nav-link pointer">
                <div className="">Tools</div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("UndoAction")}>
                  <span className="me-5">Undo</span>
                  <kbd>ctrl/meta + z</kbd>
                </Dropdown.Item>
                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("RedoAction")}>
                  <span className="me-5">Redo</span>
                  <kbd>ctrl/meta + y</kbd>
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("CutSelectedElements")}>
                  <span className="me-5">Cut</span>
                  <kbd>ctrl/meta + x</kbd>
                </Dropdown.Item>
                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("CopySelectedElements")}>
                  <span className="me-5">Copy</span>
                  <kbd>ctrl/meta + c</kbd>
                </Dropdown.Item>
                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("PasteSelectedElements")}>
                  <span className="me-5">Paste</span>
                  <kbd>ctrl/meta + v</kbd>
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item onClick={() => eventBus.publish("DeleteSelectedElements")}>
                  <span className="me-5">Delete</span>
                  <kbd>delete</kbd>, <kbd>backspace</kbd>
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("SelectAllElements")}>
                  <span className="me-5">Select all</span>
                  <kbd>ctrl/meta + a</kbd>
                </Dropdown.Item>
                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("UnselectAllElements")}>
                  <span className="me-5">Select none</span>
                  <kbd>escape</kbd>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown
              className=""
              onToggle={(visible) => handleMenuItemToggle(visible, "nodes")}
              onMouseEnter={() => handleMenuItemHover("nodes")}
              show={getMenuItemVisibility("nodes")}
            >
              <Dropdown.Toggle as="div" className="nav-link pointer">
                <div className="">Nodes</div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("GroupSelectedElements")}>
                  <span className="me-5">Group selection</span>
                  <kbd>ctrl/meta + g</kbd>
                </Dropdown.Item>

                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("UngroupSelectedElements")}>
                  <span className="me-5">Ungroup selection</span>
                  <kbd>ctrl/meta + b</kbd>
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("AlignSelectionTop")}>
                  <span className="me-5">Align selection to the top</span>
                  <kbd>ctrl/meta + ↑</kbd>
                </Dropdown.Item>

                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("AlignSelectionBottom")}>
                  <span className="me-5">Align selection to the bottom</span>
                  <kbd>ctrl/meta + ↓</kbd>
                </Dropdown.Item>

                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("AlignSelectionLeft")}>
                  <span className="me-5">Align selection to the left</span>
                  <kbd>ctrl/meta + ←</kbd>
                </Dropdown.Item>

                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("AlignSelectionRight")}>
                  <span className="me-5">Align selection to the right</span>
                  <kbd>ctrl/meta + →</kbd>
                </Dropdown.Item>

                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("CenterSelectionVertically")}>
                  <span className="me-5">Center selection vertically</span>
                </Dropdown.Item>

                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("CenterSelectionHorizontally")}>
                  <span className="me-5">Center selection horizontally</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {
              debug && (
                <Dropdown
                  className=""
                  onToggle={(visible) => handleMenuItemToggle(visible, "debug")}
                  onMouseEnter={() => handleMenuItemHover("debug")}
                  show={getMenuItemVisibility("debug")}
                >
                  <Dropdown.Toggle as="div" className="nav-link pointer">
                    <div className="">Debug</div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("_debug_TraceSelectedNode")}>
                      <span className="me-5">Trace path from start to selected node</span>
                    </Dropdown.Item>
                    <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("_debug_HighlightParentsOfSelectedNode")}>
                      <span className="me-5">Highlight all parents of selected node</span>
                    </Dropdown.Item>
                    <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("_debug_HighlightChildrenOfSelectedNode")}>
                      <span className="me-5">Highlight all children of selected node</span>
                    </Dropdown.Item>

                    <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("_debug_HighlightOutboundNeighborsOfSelectedNode")}>
                      <span className="me-5">Highlight outbound neighbors (children) of selected node</span>
                    </Dropdown.Item>
                    <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("_debug_HighlightInboundNeighborsOfSelectedNode")}>
                      <span className="me-5">Highlight inbound neighbors (parents) of selected node</span>
                    </Dropdown.Item>

                    <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("_debug_HighlightConnectedElements_children")}>
                      <span className="me-5">Highlight connected elements (children)</span>
                    </Dropdown.Item>
                    <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("_debug_HighlightConnectedElements_parents")}>
                      <span className="me-5">Highlight connected elements (parents)</span>
                    </Dropdown.Item>
                    <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("_debug_HighlightDisconnectedElements")}>
                      <span className="me-5">Highlight disconnected elements</span>
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("_debug_ValidateBlueprint")}>
                      <span className="me-5">Trigger blueprint validation</span>
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("_debug_ExposeSelection")}>
                      <span className="me-5">Expose selected nodes as window.$1/$1v, $2/$2v...</span>
                    </Dropdown.Item>
                    <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => { window.dql = new DiagramQL(); }}>
                      <span className="me-5">Expose DQL as "window.dql"</span>
                    </Dropdown.Item>
                    <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => { window.runtime = runtime; }}>
                      <span className="me-5">Expose Runtime as "window.runtime"</span>
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    {
                      /*
                      <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("_test_CreateLayout")}>
                        <span className="me-5">Layout - Create Layout</span>
                      </Dropdown.Item>

                      <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("_test_Move10")}>
                        <span className="me-5">Layout - Move node to 1, 0</span>
                      </Dropdown.Item>

                      <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("_test_Move10Displacement")}>
                        <span className="me-5">Layout - Move selection to 1, 0 (test dispalcement)</span>
                      </Dropdown.Item>

                      <Dropdown.Divider />
                      */
                    }

                    <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("_debug_PrintSerializedBlueprint")}>
                      <span className="me-5">Print serialized blueprint</span>
                    </Dropdown.Item>
                    <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => eventBus.publish("_debug_PrintNodeData")}>
                      <span className="me-5">Print node data</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )
            }

            <Nav.Link as="div" className=" pointer" onClick={() => eventBus.publish("OpenAppSettings")}>
              <span>Settings</span>
            </Nav.Link>

            <Dropdown
              className=""
              onToggle={(visible) => handleMenuItemToggle(visible, "help")}
              onMouseEnter={() => handleMenuItemHover("help")}
              show={getMenuItemVisibility("help")}
            >
              <Dropdown.Toggle as="div" className="nav-link pointer">
                <div className="">Help</div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => window.open(`${process.env.CRASH_REPORT_URL}/`, "_blank")}>
                  <span className="me-5">Report a bug / issue</span>
                </Dropdown.Item>

                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => window.open(`${process.env.SUPPORT_URL}/`, "_blank")}>
                  <span className="me-5">Help / Support</span>
                </Dropdown.Item>

                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => window.open(`${process.env.DOCS_ENDPOINT}/`, "_blank")}>
                  <span className="me-5">Documentation</span>
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => {}}>
                  <span className="me-5">Release notes</span>
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item as="div" className="d-flex justify-content-between pointer" onClick={() => {}}>
                  <span className="me-5" onClick={() => eventBus.publish("OpenAbout")}>About Nebulant Builder</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>

          <Nav.Link as="div" className="me-1 pointer auth-status">
            {
              me ? (
                <span onClick={() => eventBus.publish("Logout")}>Logout</span>
              ) : (
                <span onClick={() => eventBus.publish("Login")}>Login</span>
              )
            }
          </Nav.Link>
        </Navbar>

      </div>
    </div>
  );
}
