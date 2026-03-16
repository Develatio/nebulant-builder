export const Icon = ({ ref, className, children, ...extra }) => {
  return (
    <div
      ref={ref}
      className={`Icon ${className || ""}`}
      {...extra}
    >
      { children }
    </div>
  );
};
