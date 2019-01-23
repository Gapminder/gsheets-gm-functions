import test from "ava";
import { preProcessInputRangeWithHeaders } from "./cleanInputRange";

test("preProcessInputRangeWithHeaders with a table with an empty trailing row", t => {
  const inputRangeWithHeaders = [["geo", "name"], ["foo", "Foo"], ["", ""]];
  const result = preProcessInputRangeWithHeaders(inputRangeWithHeaders);
  t.deepEqual(result, [["geo", "name"], ["foo", "Foo"]]);
});

test("preProcessInputRangeWithHeaders with a table with empty trailing rows", t => {
  const inputRangeWithHeaders = [
    ["geo", "name"],
    ["foo", "Foo"],
    ["", ""],
    ["", ""]
  ];
  const result = preProcessInputRangeWithHeaders(inputRangeWithHeaders);
  t.deepEqual(result, [["geo", "name"], ["foo", "Foo"]]);
});

test("preProcessInputRangeWithHeaders with a table without empty trailing rows", t => {
  const inputRangeWithHeaders = [["geo", "name"], ["foo", "Foo"]];
  const result = preProcessInputRangeWithHeaders(inputRangeWithHeaders);
  t.deepEqual(result, [["geo", "name"], ["foo", "Foo"]]);
});

test("preProcessInputRangeWithHeaders with a column with an empty trailing rows", t => {
  const inputRangeWithHeaders = [["geo"], ["foo"], [""]];
  const result = preProcessInputRangeWithHeaders(inputRangeWithHeaders);
  t.deepEqual(result, [["geo"], ["foo"]]);
});

test("preProcessInputRangeWithHeaders with a column with empty trailing rows", t => {
  const inputRangeWithHeaders = [["geo"], ["foo"], [""], [""]];
  const result = preProcessInputRangeWithHeaders(inputRangeWithHeaders);
  t.deepEqual(result, [["geo"], ["foo"]]);
});

test("preProcessInputRangeWithHeaders with a column without empty trailing rows", t => {
  const inputRangeWithHeaders = [["geo"], ["foo"]];
  const result = preProcessInputRangeWithHeaders(inputRangeWithHeaders);
  t.deepEqual(result, [["geo"], ["foo"]]);
});
