import test, { ExecutionContext, Macro } from "ava";
import { validateAndAliasTheGeoSetArgument } from "./validateAndAliasTheGeoSetArgument";

/**
 * @hidden
 */
const testValidateAndAliasTheGeoSetArgument: Macro<any> = (
  t: ExecutionContext,
  { geo_set, expected }
) => {
  const validatedGeoSetArgument = validateAndAliasTheGeoSetArgument(geo_set);
  // t.log({ validatedGeoSetArgument, expected });
  t.deepEqual(validatedGeoSetArgument, expected);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    geo_set: "4ilevels",
    expected: "4ilevels"
  },
  {
    geo_set: "countries_etc",
    expected: "countries_etc"
  },
  {
    geo_set: "world_4region",
    expected: "world_4region"
  },
  {
    geo_set: "world_6region",
    expected: "world_6region"
  },
  {
    geo_set: "global",
    expected: "global"
  },
  {
    geo_set: "income-levels",
    expected: "4ilevels"
  },
  {
    geo_set: "countries-etc",
    expected: "countries_etc"
  },
  {
    geo_set: "regions",
    expected: "world_4region"
  },
  {
    geo_set: "world",
    expected: "global"
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test(
    "testValidateAndAliasTheGeoSetArgument - " + index,
    testValidateAndAliasTheGeoSetArgument,
    testData
  );
});
