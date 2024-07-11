import Pagination from 'react-bootstrap/esm/Pagination';

export const Paginator = (props) => {
  const { paginator, goFirstPage, goNextPage, goPrevPage, goLastPage, loading } = props;

  // When fullMode is set to "true", the paginator will render the total number
  // of elements, as well as the button that allows users to go to the last
  // page. There are some providers / APIs that won't give us an exact number of
  // results, which makes it impossible to go to the "last" page. We detect that
  // case by checking if the "total" field of any of the paging details is set
  // to "null".
  const fullMode = !paginator.pagingDetails.some(o => o.total === null);
  const total = paginator.pagingDetails.reduce((acc, o) => Math.max(o.total, acc), 0);
  const hasNext = paginator.pagingDetails.some(o => o.next);
  const hasPrev = paginator.pagingDetails.some(o => o.prev);

  if(
    loading || // If it's loading
    (fullMode && total <= 1) || // If we know how many elements there are and there is 1 page
    (!fullMode && (!hasPrev && !hasNext)) // If we don't know how many elements there are and there are neither previous not next pages
  ) return "";

  return (
    <Pagination size="sm" className="mb-0 me-1">
      <Pagination.First
        disabled={paginator.current === 1}
        onClick={goFirstPage}
      />

      <Pagination.Prev
        disabled={paginator.current === 1}
        onClick={goPrevPage} />

      {
        fullMode ? (
          <Pagination.Item>{ paginator.current } / { total }</Pagination.Item>
        ) : (
          <Pagination.Item>{ paginator.current }</Pagination.Item>
        )
      }

      <Pagination.Next
        disabled={!hasNext}
        onClick={goNextPage}
      />

      {
        fullMode ? (
          <Pagination.Last
            disabled={paginator.current === total}
            onClick={goLastPage}
          />
        ) : ""
      }
    </Pagination>
  );
}
