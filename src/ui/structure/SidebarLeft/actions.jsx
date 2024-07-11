import { get } from "lodash-es";
import { useDrag } from "react-dnd";
import { Popover } from "react-tiny-popover";
import { useEffect, useRef, useState } from "react";
import FormControl from "react-bootstrap/esm/FormControl";

import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";

import { icons } from "@src/components/ddWidgets";

import SearchIcon from "@src/assets/img/icons/control/search.svg?transform";
import CaretRight from "@src/assets/img/icons/control/caret-right.svg?transform";

const DDAction = ({ action, provider }) => {
  const [_, drag] = useDrag(() => ({
    type: "ddWidget",
    item: action,
  }));

  const Icon = get(icons, `${provider}.${action.icon}`);

  return (
    <div
      className={`action d-flex align-items-center ${provider}`}
      ref={drag}
    >
      {
        action.icon ? (
          <Icon className="image" />
        ) : ""
      }
      <span className="label">{ action.label }</span>
    </div>
  );
}

const DDGroup = ({ group, widgets }) => {
  const VISIBILITY = {
    HIDDEN: 0,
    HOVER: 1,
    CLICK: 2,
  }

  const runtime = new Runtime();
  const eventBus = new EventBus();

  const closerTimeout = useRef(null);
  const [visible, setVisibility] = useState(VISIBILITY.HIDDEN);

  const Icon = get(icons, `${group.provider}.${group.icon}`);

  useEffect(() => {
    const maybeClosePopover = () => {
      setVisibility(cur => cur !== VISIBILITY.CLICK ? VISIBILITY.HIDDEN : cur);
    }

    eventBus.subscribe("CanvasDrop", maybeClosePopover);

    return () => {
      eventBus.unsubscribe("CanvasDrop", maybeClosePopover);
    }
  }, []);

  return (
    <Popover
      isOpen={visible !== VISIBILITY.HIDDEN}
      positions={["right"]}
      align="center"
      padding={10}
      onClickOutside={() => {
        setVisibility(VISIBILITY.HIDDEN);
        runtime.set("state.stencil.actionGroupIsOpen", false);
      }}
      content={({ position, nudgedLeft, nudgedTop }) => (
        <div
          className="actionsGroupPopover"
          onMouseEnter={() => {
            if(closerTimeout.current) {
              clearTimeout(closerTimeout.current);
              closerTimeout.current = null;
            }
          }}
          onMouseLeave={() => {
            // hide only if we showed the popover because of a hover event
            if(visible == VISIBILITY.HOVER) {
              closerTimeout.current = setTimeout(() => {
                setVisibility(VISIBILITY.HIDDEN);
              }, 0);
            }
          }}
        >
          {
            widgets.map(widget => (
              <DDAction
                key={`${widget.provider}-${widget.ddWidget.label}`}
                action={widget.ddWidget}
                provider={widget.provider}
              />
            ))
          }
        </div>
      )}
    >
      <div
        className={`
          actionsGroup
          ${group.name}
          ${visible === VISIBILITY.HIDDEN ? "": "open"}
          d-flex align-items-center
          ${group.provider}
        `}
        onClick={() => {
          if(visible === VISIBILITY.CLICK) {
            setVisibility(VISIBILITY.HIDDEN);
            runtime.set("state.stencil.actionGroupIsOpen", false);
          } else {
            setVisibility(VISIBILITY.CLICK);
            // We need the setTimeout because we want to wait for any remaining
            // calls to "onClickOutside" of other actionGroups that might have
            // been open when the user clicked "this" actionGroup.
            setTimeout(() => {
              runtime.set("state.stencil.actionGroupIsOpen", true);
            });
          }
        }}
        onMouseEnter={() => {
          if(closerTimeout.current) {
            clearTimeout(closerTimeout.current);
            closerTimeout.current = null;
          }

          if(
            visible === VISIBILITY.HIDDEN &&
            !runtime.get("state.stencil.actionGroupIsOpen")
          ) {
            setVisibility(VISIBILITY.HOVER);
         }
        }}
        onMouseLeave={() => {
          if(visible == VISIBILITY.HOVER) {
            closerTimeout.current = setTimeout(() => {
              setVisibility(VISIBILITY.HIDDEN);
            }, 0);
          }
        }}
      >
        <Icon className="image" />
        <span className="label">{ group.label }</span>
        <CaretRight className="caret" />
        <div className="bridge"></div>
      </div>
    </Popover>
  )
}

export const Actions = () => {
  const searchRef = useRef(null);

  const runtime = new Runtime();
  const eventBus = new EventBus();

  const stencil = runtime.get("objects.stencil");

  const [
    filter,
    setFilter
  ] = useState(runtime.get("state.stencil.actionsFilter"));

  const [
    actions,
    setActions
  ] = useState(runtime.get("state.stencil.actions"));

  useEffect(() => {
    const focusSearch = () => {
      searchRef.focus();
      searchRef.select();
    }

    eventBus.subscribe("FocusSearch", focusSearch);
    runtime.notifyOnChanges("state.stencil.actions", setActions);
    runtime.notifyOnChanges("state.stencil.actionsFilter", setFilter);

    return () => {
      eventBus.unsubscribe("FocusSearch", focusSearch);
      runtime.stopNotifying("state.stencil.actions", setActions);
      runtime.stopNotifying("state.stencil.actionsFilter", setFilter);
    }
  }, []);

  return (
    <div className="nodes-container d-flex w-100">
      <div className="d-flex align-items-center border rounded search-wrapper">
        <SearchIcon className="search" />

        <FormControl
          className="border-0 p-0"
          ref={searchRef}
          placeholder="Search actions..."
          onChange={(e) => {
            stencil.setFilter(e.target.value);
          }}
          value={filter}
        />
      </div>

      <div className="h-100 actions w-100">
        {
          actions.map(action => {
            if(action.type == 'ddWidget') {
              return <DDAction
                key={`${action.provider}-${action.ddWidget.label}`}
                action={action.ddWidget}
                provider={action.provider}
              />
            } else {
              return <DDGroup
                key={`${action.provider}-${action.label}`}
                group={action}
                widgets={action.ddWidgets}
              />
            }
          })
        }
      </div>
    </div>
  );
}
