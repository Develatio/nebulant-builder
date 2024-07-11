import { forwardRef } from "react";

export const Icon = forwardRef((props, ref) => {
  const { className, ...extra } = props;

  return (
    <div
      ref={ref}
      className={`Icon ${className || ""}`}
      {...extra}
    >
      { props.children }
    </div>
  );
});
