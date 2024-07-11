export const formatFilters = (Filters) => {
  return Filters?.reduce((acc, filter) => {
    switch (filter.name) {
      case "LabelSelector":
        acc[filter.name] = filter.value;
        break;

      default:
        acc[filter.name] = filter.value;
        break;
    }

    return acc;
  }, {});
}
