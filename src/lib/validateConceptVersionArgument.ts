/**
 * @hidden
 */
export const versionNumber = version => {
  return Number(String(version).replace(/^v/, ""));
};

/**
 * @hidden
 */
export function validateConceptVersionArgument(conceptVersion) {
  if (conceptVersion.match(/^ /) || conceptVersion.match(/ $/)) {
    throw new Error(
      `The concept version ("${conceptVersion}") should not start or end with a space`
    );
  }
  if (!conceptVersion.match(/^([a-z0-9]*)$/)) {
    throw new Error(
      `The concept version ("${conceptVersion}") may only contain alphanumeric characters (a-z, 0-9)`
    );
  }
  if (conceptVersion !== `v${versionNumber(conceptVersion)}`) {
    throw new Error(
      `The concept version ("${conceptVersion}") should start with a v, followed by an integer`
    );
  }
  /*
  if (!(versionNumber(conceptVersion) > 0)) {
    throw new Error(
      `The concept version ("${conceptVersion}") should be greater than 0`
    );
  }
  */
}
