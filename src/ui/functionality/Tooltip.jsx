import { default as BaseTooltip } from "react-bootstrap/esm/Tooltip";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";

export const Tooltip = (props) => {
  const { label, children, placement, maxWidth } = props;

  if(label) {
    return (
      <OverlayTrigger
        placement={ placement || "bottom" }
        delay={{ show: 450 }}
        popperConfig={{
          modifiers: [{
            name: "offset",
            options: { offset: [0, 5] },
          }],
        }}
        overlay={
          <BaseTooltip>
            <div style={{maxWidth: maxWidth || "330px"}}>
              { label }
            </div>
          </BaseTooltip>
        }
      >
        {children}
      </OverlayTrigger>
    );
  } else {
    return (
      <>
        {children}
      </>
    );
  }
}
