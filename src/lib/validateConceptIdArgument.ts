/**
 * @hidden
 */
export function validateConceptIdArgument(concept_id) {
  if (concept_id.match(/^ /) || concept_id.match(/ $/)) {
    throw new Error(
      `The concept id ("${concept_id}") should not start or end with a space`
    );
  }
  if (!concept_id.match(/^([a-z0-9_]*)$/)) {
    throw new Error(
      `The concept id ("${concept_id}") may only contain alphanumeric characters (a-z, 0-9) and underscores`
    );
  }
}
