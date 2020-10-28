import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";
import { largestRemainderRound } from "./lib/largestRemainderRound";

/**
 * Rounds floats/fractions in that ensures that the total remains a specific target.
 * Use for rounding percentages and ensuring that the total is always 100%.
 *
 * @param {A1:D} input_table_with_rows_of_floats_that_should_be_summed
 * @param {"100"} target_total_sum The target total sum
 * @param {"2"} decimals Number of decimals to round to
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_LARGEST_REMAINDER_ROUND(
  input_table_with_rows_of_floats_that_should_be_summed: string[][],
  target_total_sum: number,
  decimals: number
) {
  // Ensure expected input range contents
  const inputTable = preProcessInputRangeWithHeaders(
    input_table_with_rows_of_floats_that_should_be_summed
  );
  if (!target_total_sum) {
    target_total_sum = 1;
  }
  if (!decimals) {
    decimals = 2;
  }
  const outputTable: number[][] = inputTable.map(inputTableRows => {
    return largestRemainderRound(inputTableRows, target_total_sum, decimals);
  });
  return outputTable;
}
