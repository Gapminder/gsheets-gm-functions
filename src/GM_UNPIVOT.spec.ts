import test, { ExecutionContext, Macro } from "ava";
import { GM_UNPIVOT } from "./GM_UNPIVOT";

/**
 * @hidden
 */
const testGmUnpivot: Macro<any> = (
  t: ExecutionContext,
  {
    input_table_range_with_headers,
    time_label,
    value_label,
    page_size,
    page,
    expectedOutput
  }
) => {
  const output = GM_UNPIVOT(
    input_table_range_with_headers,
    time_label,
    value_label,
    page_size,
    page
  );
  // t.log({ output, expectedOutput });
  t.deepEqual(output, expectedOutput);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    input_table_range_with_headers: [
      ["geo", "name", "1800", "1801", "1802", "1803"],
      ["world", "World", "123", "456", "234", "345"],
      ["foo", "Foo", "456", "678", "567", "890"]
    ],
    time_label: "year",
    value_label: "Foo",
    expectedOutput: [
      ["geo", "name", "year", "Foo"],
      ["world", "World", "1800", "123"],
      ["world", "World", "1801", "456"],
      ["world", "World", "1802", "234"],
      ["world", "World", "1803", "345"],
      ["foo", "Foo", "1800", "456"],
      ["foo", "Foo", "1801", "678"],
      ["foo", "Foo", "1802", "567"],
      ["foo", "Foo", "1803", "890"]
    ]
  },
  {
    input_table_range_with_headers: [
      ["geo", "name", "1800", "1801", "1802", "1803"],
      ["world", "World", "123", "456", "234", "345"],
      ["foo", "Foo", "456", "678", "567", "890"]
    ],
    time_label: "year",
    value_label: "Foo",
    page_size: 3,
    page: 1,
    expectedOutput: [
      ["geo", "name", "year", "Foo"],
      ["world", "World", "1800", "123"],
      ["world", "World", "1801", "456"]
    ]
  },
  {
    input_table_range_with_headers: [
      ["geo", "name", "1800", "1801", "1802", "1803"],
      ["world", "World", "123", "456", "234", "345"],
      ["foo", "Foo", "456", "678", "567", "890"]
    ],
    time_label: "year",
    value_label: "Foo",
    page_size: 3,
    page: 2,
    expectedOutput: [
      ["world", "World", "1802", "234"],
      ["world", "World", "1803", "345"],
      ["foo", "Foo", "1800", "456"]
    ]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testGmUnpivot - " + index, testGmUnpivot, testData);
});
