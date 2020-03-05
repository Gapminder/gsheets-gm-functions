import test, { ExecutionContext, Macro } from "ava";
import { keyNormalizerForSlightlyFuzzyLookups } from "./keyNormalizerForSlightlyFuzzyLookups";

/**
 * @hidden
 */
const testkeyNormalizerForSlightlyFuzzyLookups: Macro<any> = (
  t: ExecutionContext,
  { lookupKey, expectedOutput }
) => {
  const output = keyNormalizerForSlightlyFuzzyLookups(lookupKey);
  // t.log({output, expectedOutput});
  t.deepEqual(output, expectedOutput);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    lookupKey: "foo",
    expectedOutput: "foo"
  },
  {
    lookupKey: "foo ",
    expectedOutput: "foo"
  },
  {
    lookupKey: "Foo",
    expectedOutput: "foo"
  },
  {
    lookupKey: "fóo",
    expectedOutput: "foo"
  },
  {
    lookupKey: "foo*",
    expectedOutput: "foo"
  },
  {
    lookupKey: "foo**",
    expectedOutput: "foo"
  },
  {
    lookupKey: "foo (bar)",
    expectedOutput: "foo (bar)"
  },
  {
    lookupKey: "foo",
    expectedOutput: "foo"
  },
  {
    lookupKey: "foo",
    expectedOutput: "foo"
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test(
    "testkeyNormalizerForSlightlyFuzzyLookups - " + index,
    testkeyNormalizerForSlightlyFuzzyLookups,
    testData
  );
});
