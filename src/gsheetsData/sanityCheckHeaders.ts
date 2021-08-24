/**
 * @hidden
 */
export const sanityCheckHeaders = (
  headers,
  expectedHeaders,
  spreadsheetUserReference
) => {
  const initialHeaders = headers.slice(0, expectedHeaders.length);
  if (JSON.stringify(initialHeaders) !== JSON.stringify(expectedHeaders)) {
    throw new Error(
      `The first ${spreadsheetUserReference} column headers should be ${JSON.stringify(
        expectedHeaders
      )} but ${JSON.stringify(initialHeaders)} was found`
    );
  }
};
