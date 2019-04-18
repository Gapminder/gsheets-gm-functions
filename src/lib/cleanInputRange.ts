import findIndex from "lodash/fp/findIndex";
import { pipe } from "./pipe";

/**
 * Common pre-processing on input ranges across all gm functions to ensure
 * the expected function behavior.
 *
 * @param inputRangeWithHeaders
 * @hidden
 */
export function preProcessInputRangeWithHeaders(
  inputRangeWithHeaders: string[][]
): string[][] {
  // Verify that the input param is indeed an array
  if (!Array.isArray(inputRangeWithHeaders)) {
    throw Error(
      "The input range is invalid. Type: " + typeof inputRangeWithHeaders
    );
  }

  // Clone the input param to prevent side effects
  const inputColumnOrTableWithHeaders = inputRangeWithHeaders.slice();

  // Filter away completely empty rows at the end of the input range
  // (allows input range to be specified as complete columns without negative effects)
  const rowIsNotEmpty = (row: string[]) => {
    const amountOfCellsThatAreNotEmptyStrings = row.reduce(
      (count: number, cellValue: string) =>
        cellValue !== "" ? count + 1 : count,
      0
    );
    return amountOfCellsThatAreNotEmptyStrings > 0;
  };
  const firstNonEmptyRowReverseIndex = pipe([findIndex(rowIsNotEmpty)])(
    inputColumnOrTableWithHeaders.concat([]).reverse()
  );
  const inputColumnOrTableWithoutEmptyRowsAtTheEnd =
    firstNonEmptyRowReverseIndex > -1
      ? inputColumnOrTableWithHeaders.slice(
          0,
          inputColumnOrTableWithHeaders.length - firstNonEmptyRowReverseIndex
        )
      : inputColumnOrTableWithHeaders;

  // Throw error if input range is empty
  if (inputColumnOrTableWithoutEmptyRowsAtTheEnd.length === 0) {
    throw new Error("Input range is empty");
  }

  return inputColumnOrTableWithoutEmptyRowsAtTheEnd;
}
