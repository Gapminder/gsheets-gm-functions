import test, { ExecutionContext, Macro } from "ava";
import { linear } from "everpolate";
import { round } from "lodash";

/**
 * @hidden
 */
const testLinearInterpolation: Macro<any> = (
  t: ExecutionContext,
  { pointsToEvaluate, functionValuesX, functionValuesY, expectedResults }
) => {
  const results = linear(pointsToEvaluate, functionValuesX, functionValuesY);
  // Avoid floating point rounding errors such as 59.10000000000002
  const roundedResults = results.map(result => round(result, 8));
  t.deepEqual(roundedResults, expectedResults);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    pointsToEvaluate: [2, 0, 8],
    functionValuesX: [-2, 0, 6, 8],
    functionValuesY: [4, 0, 3, -3],
    expectedResults: [1, 0, -3]
  },
  {
    pointsToEvaluate: [1900, 1901, 1902, 1903, 1904, 1905],
    functionValuesX: [1900, 1905],
    functionValuesY: [0, 5],
    expectedResults: [0, 1, 2, 3, 4, 5]
  },
  {
    pointsToEvaluate: [2006, 2008, 2010, 2011],
    functionValuesX: [2006, 2008, 2010, 2011],
    functionValuesY: [59.1, 59.1, 58.6, 58.1],
    expectedResults: [59.1, 59.1, 58.6, 58.1]
  },
  {
    pointsToEvaluate: [2006, 2007, 2008, 2009, 2010, 2011],
    functionValuesX: [2006, 2008, 2010, 2011],
    functionValuesY: [59.1, 59.1, 58.6, 58.1],
    expectedResults: [59.1, 59.1, 59.1, 58.85, 58.6, 58.1]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testLinearInterpolation - " + index, testLinearInterpolation, testData);
});