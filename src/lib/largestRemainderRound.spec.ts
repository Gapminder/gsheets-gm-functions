import test, { ExecutionContext, Macro } from "ava";
import { largestRemainderRound } from "./largestRemainderRound";

/**
 * @hidden
 */
const testLargestRemainderRound: Macro<any> = (
  t: ExecutionContext,
  { numArr, totalSeats, decimalNum, expected }
) => {
  const output = largestRemainderRound(numArr, totalSeats, decimalNum);
  // t.log({ output, expected });
  t.deepEqual(output, expected);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    numArr: [1000, 1000, 5000, 1000],
    totalSeats: undefined,
    decimalNum: undefined,
    expected: [13, 13, 62, 12]
  },
  {
    numArr: [1000, 1000, 5000, 1000],
    totalSeats: 50,
    decimalNum: undefined,
    expected: [7, 6, 31, 6]
  },
  {
    numArr: [1000, 1000, 5000, 1000],
    totalSeats: 1000,
    decimalNum: undefined,
    expected: [125, 125, 625, 125]
  },
  {
    numArr: [1000, 1000, 5000, 1000],
    totalSeats: 50,
    decimalNum: 2,
    expected: [6.25, 6.25, 31.25, 6.25]
  },
  {
    numArr: [1000, 1000, 5000, 1000],
    totalSeats: undefined,
    decimalNum: 1,
    expected: [12.5, 12.5, 62.5, 12.5]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test(
    "testLargestRemainderRound - " + index,
    testLargestRemainderRound,
    testData
  );
});
