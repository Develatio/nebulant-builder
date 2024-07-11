import { CONTENT_PATH } from "@src/utils/constants";

export const content_path_parser = (content_path) => {
  const match = content_path.match(CONTENT_PATH);

  if(!match) return {
    isValid: false,
  };

  const [
    _,
    organization_slug,
    collection_slug,
    blueprint_slug,
    version,
  ] = match;

  return {
    isValid: true,
    organization_slug,
    collection_slug,
    blueprint_slug,
    version,
  };
}
