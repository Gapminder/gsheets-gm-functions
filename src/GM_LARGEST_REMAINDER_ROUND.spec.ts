import test, { ExecutionContext, Macro } from "ava";
import { GM_LARGEST_REMAINDER_ROUND } from "./GM_LARGEST_REMAINDER_ROUND";

/**
 * @hidden
 */
const testLargestRemainderRound: Macro<any> = (
  t: ExecutionContext,
  {
    input_table_with_rows_of_floats_that_should_be_summed,
    target_total_sum,
    decimals,
    expectedOutput
  }
) => {
  const output = GM_LARGEST_REMAINDER_ROUND(
    input_table_with_rows_of_floats_that_should_be_summed,
    target_total_sum,
    decimals
  );
  // t.log({ output, expectedOutput, target_total_sum, decimals });
  t.deepEqual(output, expectedOutput);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    input_table_with_rows_of_floats_that_should_be_summed: [
      [0.332, 0.3445, 0.3235],
      [0.332, 0.3445, 0.3235],
      [0.3333, 0.3333, 0.3333],
      [0.338, 0.3455, 0.3165]
    ],
    target_total_sum: 1,
    decimals: 2,
    expectedOutput: [
      [0.33, 0.35, 0.32],
      [0.33, 0.35, 0.32],
      [0.34, 0.33, 0.33],
      [0.34, 0.34, 0.32]
    ]
  },
  {
    input_table_with_rows_of_floats_that_should_be_summed: [
      [0.332, 0.121, 0.3445, 0.2025],
      [0.338, 0.121, 0.3455, 0.1955],
      [0.332, 0.121, 0.3445, 0.2025]
    ],
    target_total_sum: 1,
    decimals: 2,
    expectedOutput: [
      [0.33, 0.12, 0.35, 0.2],
      [0.34, 0.12, 0.35, 0.19],
      [0.33, 0.12, 0.35, 0.2]
    ]
  },
  {
    input_table_with_rows_of_floats_that_should_be_summed: [
      [0.332, 0.121, 0.3445, 0.2025],
      [-1],
      [0.332, 0.121, 0.3445, 0.2025]
    ],
    target_total_sum: 1,
    decimals: 2,
    expectedOutput: [
      [0.33, 0.12, 0.35, 0.2],
      ["This is not an array of only positive numbers"],
      [0.33, 0.12, 0.35, 0.2]
    ]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test(
    "testLargestRemainderRound - " + index,
    testLargestRemainderRound,
    testData
  );
});
