import { remove as removeDiacritics } from "diacritics";

/**
 * By trimming the lookup keys, we allow slightly fuzzy matching, such as "Foo " == "foo" and "Fóo*" == "Foo"
 * @hidden
 */
export function keyNormalizerForSlightlyFuzzyLookups(
  lookupKey: string
): string {
  const trimmedLowerCasedWithoutDiacritics = removeDiacritics(
    lookupKey.trim().toLowerCase()
  );
  return trimmedLowerCasedWithoutDiacritics.replace(/[^a-z0-9 ()]/g, "");
}
