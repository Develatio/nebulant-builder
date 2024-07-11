export const toDropdownValues = ({res}) => {
  let opts = res?.map((r, _j) => {
    return {
      rawValue: r.value,
      type: "DiagramQL",
      label: `{{ ${r.value} }}`,
      value: `{{${r.value}}}`,
    };
  }) || [];

  // Remove duplicates
  opts = [...new Map(opts.map(v => [v.value, v])).values()];

  return opts;
}
