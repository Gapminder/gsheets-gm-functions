import test from "ava";
import { MinimalUtilities } from "./MinimalUtilities";
(global as any).Utilities = MinimalUtilities;

test("parseCsv as per https://csv.js.org/parse/api/", t => {
  const input = '"1","2","3","4"\n"a","b","c","d"';
  const output = Utilities.parseCsv(input);
  t.deepEqual(output, [["1", "2", "3", "4"], ["a", "b", "c", "d"]]);
});
