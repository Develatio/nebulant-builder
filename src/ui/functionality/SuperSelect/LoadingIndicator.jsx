export const LoadingIndicator = (props) => {
  const { loading } = props;

  if(!loading) return "";

  return (
    <div className="loadingIndicatorWrapper">
      <small className="text-muted user-select-none loading py-1 d-block">
        Loading more options
      </small>
    </div>
  );
}
