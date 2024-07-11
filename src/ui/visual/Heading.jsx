export const Heading = (props = {}) => {
  const { variant } = props;

  return (
    <div className={`hr-container ${variant || ""}`}>
      <hr className="hr-text h5" data-content={props.children} />
    </div>
  );
}
