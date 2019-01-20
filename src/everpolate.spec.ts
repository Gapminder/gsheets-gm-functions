import test, { ExecutionContext, Macro } from "ava";
import { linear, exponential, polynomial, step } from "everpolate";
import round from "lodash/round";

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
  },
  {
    pointsToEvaluate: [1993, 1994, 1995, 1996, 1997],
    functionValuesX: [1993, 1997],
    functionValuesY: [1000, 10000],
    expectedResults: [1000, 3250, 5500, 7750, 10000]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testLinearInterpolation - " + index, testLinearInterpolation, testData);
});

/**
 * @hidden
 */
const testExponentialInterpolation: Macro<any> = (
  t: ExecutionContext,
  { pointsToEvaluate, functionValuesX, functionValuesY, expectedResults }
) => {
  const results = exponential(
    pointsToEvaluate,
    functionValuesX,
    functionValuesY
  );
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
    expectedResults: [NaN, 0, -3]
  },
  {
    pointsToEvaluate: [1900, 1901, 1902, 1903, 1904, 1905],
    functionValuesX: [1900, 1905],
    functionValuesY: [0, 5],
    expectedResults: [0, NaN, NaN, NaN, NaN, NaN]
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
    expectedResults: [59.1, 59.1, 59.1, 58.84946899, 58.6, 58.1]
  },
  {
    pointsToEvaluate: [1993, 1994, 1995, 1996, 1997],
    functionValuesX: [1993, 1997],
    functionValuesY: [1000, 10000],
    expectedResults: [1000, 1778.27941004, 3162.27766017, 5623.4132519, 10000]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test(
    "testExponentialInterpolation - " + index,
    testExponentialInterpolation,
    testData
  );
});

/**
 * @hidden
 */
const testStepInterpolation: Macro<any> = (
  t: ExecutionContext,
  {
    pointsToEvaluate,
    functionValuesX,
    functionValuesY,
    useRightBorder,
    expectedResults
  }
) => {
  const results = step(
    pointsToEvaluate,
    functionValuesX,
    functionValuesY,
    useRightBorder
  );
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
    useRightBorder: false,
    expectedResults: [0, 0, 3]
  },
  {
    pointsToEvaluate: [1900, 1901, 1902, 1903, 1904, 1905, 1906],
    functionValuesX: [1900, 1905],
    functionValuesY: [0, 5],
    useRightBorder: false,
    expectedResults: [0, 0, 0, 0, 0, 0, 5]
  },
  {
    pointsToEvaluate: [1899, 1900, 1901, 1902, 1903, 1904, 1905, 1906],
    functionValuesX: [1900, 1905],
    functionValuesY: [0, 5],
    useRightBorder: true,
    expectedResults: [0, 5, 5, 5, 5, 5, 5, 5]
  },
  {
    pointsToEvaluate: [2006, 2008, 2010, 2011],
    functionValuesX: [2006, 2008, 2010, 2011],
    functionValuesY: [59.1, 59.1, 58.6, 58.1],
    useRightBorder: false,
    expectedResults: [59.1, 59.1, 58.6, 58.6]
  },
  {
    pointsToEvaluate: [2006, 2007, 2008, 2009, 2010, 2011],
    functionValuesX: [2006, 2008, 2010, 2011],
    functionValuesY: [59.1, 59.1, 58.6, 58.1],
    useRightBorder: false,
    expectedResults: [59.1, 59.1, 59.1, 59.1, 58.6, 58.6]
  },
  {
    pointsToEvaluate: [1993, 1994, 1995, 1996, 1997, 1998],
    functionValuesX: [1993, 1997],
    functionValuesY: [1000, 10000],
    useRightBorder: false,
    expectedResults: [1000, 1000, 1000, 1000, 1000, 10000]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testStepInterpolation - " + index, testStepInterpolation, testData);
});

/**
 * @hidden
 */
const testPolynomialInterpolation: Macro<any> = (
  t: ExecutionContext,
  { pointsToEvaluate, functionValuesX, functionValuesY, expectedResults }
) => {
  const results = polynomial(
    pointsToEvaluate,
    functionValuesX,
    functionValuesY
  );
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
    expectedResults: [0.9, 0, -3]
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
    expectedResults: [59.1, 59.15, 59.1, 58.925, 58.6, 58.1]
  },
  {
    pointsToEvaluate: [1993, 1994, 1995, 1996, 1997],
    functionValuesX: [1993, 1997],
    functionValuesY: [1000, 10000],
    expectedResults: [1000, 3250, 5500, 7750, 10000]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test(
    "testPolynomialInterpolation - " + index,
    testPolynomialInterpolation,
    testData
  );
});
