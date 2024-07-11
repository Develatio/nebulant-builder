export const link_connect = function(linkView) {
  const { model } = linkView;

  // The link has been fully created, so we can promote it.
  model.prop("_not_fully_created", false);

  // https://github.com/clientIO/joint/discussions/1758
  model.reparent();
}
