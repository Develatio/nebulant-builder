export const content_path_builder = ({
  organization_slug,
  collection_slug,
  blueprint_slug,
  version,
}) => {
  return `${organization_slug}/${collection_slug}/${blueprint_slug}:${version}`;
}
