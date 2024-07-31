import { useDrag } from "react-dnd";
import { useEffect, useState } from "react";
import FormControl from "react-bootstrap/esm/FormControl";

import { Runtime } from "@src/core/Runtime";

import SearchIcon from "@src/assets/img/icons/control/search.svg?transform";

const DDAction = ({ action }) => {
  const [_, drag] = useDrag(() => ({
    type: "ddMarketplaceWidget",
    item: action,
  }));

  return (
    <div
      className={`action d-flex align-items-center`}
      ref={drag}
    >
      <div className="image" style={{ backgroundImage: `url(${action.latest_stable_marketplace_icon || action.latest_marketplace_icon})` }}></div>

      <div className="info">
        <span className="label">{ action.name }</span>

        <span className="version">
          {
            action.latest_stable ? (
              `Latest stable: ${action.latest_stable}`
            ) : action.latest ? (
              `Latest version: ${action.latest}`
            ) : ""
          }
        </span>
      </div>
    </div>
  );
}

export const Marketplace = () => {
  const runtime = new Runtime();

  const stencil = runtime.get("objects.stencil");

  const [
    filter,
    setFilter
  ] = useState(runtime.get("state.stencil.marketplaceActionsFilter"));

  const [
    actions,
    setActions
  ] = useState(runtime.get("state.stencil.marketplaceActions"));

  useEffect(() => {
    runtime.notifyOnChanges("state.stencil.marketplaceActions", setActions);
    runtime.notifyOnChanges("state.stencil.marketplaceActionsFilter", setFilter);

    return () => {
      runtime.stopNotifying("state.stencil.marketplaceActions", setActions);
      runtime.stopNotifying("state.stencil.marketplaceActionsFilter", setFilter);
    }
  }, []);

  return (
    <div className="nodes-container d-flex w-100">
      <div className="d-flex align-items-center border rounded search-wrapper">
        <SearchIcon className="search" />

        <FormControl
          className="border-0 p-0"
          placeholder="Search marketplace..."
          onChange={(e) => {
            stencil.marketplaceSetFilter(e.target.value);
          }}
          value={filter}
        />
      </div>

      <div className="h-100 actions w-100">
        {
          actions.map(action => (
            <DDAction
              key={`${action.organization_slug}-${action.collection_slug}-${action.slug}`}
              action={action}
            />
          ))
        }
      </div>
    </div>
  );
}
