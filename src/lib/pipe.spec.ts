import test from "ava";
import groupBy from "lodash/fp/groupBy";
import mapValues from "lodash/fp/mapValues";
import sumBy from "lodash/fp/sumBy";
import tap from "lodash/fp/tap";
import { pipe } from "./pipe";

test("pipe behaves as expected", t => {
  const inputArray = [
    {
      color: "blue",
      weight: 10
    },
    {
      color: "blue",
      weight: 10
    },
    {
      color: "red",
      weight: 10
    }
  ];

  const groupByResult = pipe([groupBy("color")])(inputArray);

  t.deepEqual(groupByResult, {
    blue: [
      {
        color: "blue",
        weight: 10
      },
      {
        color: "blue",
        weight: 10
      }
    ],
    red: [
      {
        color: "red",
        weight: 10
      }
    ]
  });

  const groupByAndSumByResult = pipe([
    groupBy("color"),
    mapValues((groupedItems: any) => {
      return {
        weight: sumBy("weight")(groupedItems)
      };
    })
  ])(inputArray);

  // t.log("groupByAndSumByResult", groupByAndSumByResult);

  t.deepEqual(groupByAndSumByResult, {
    blue: {
      weight: 20
    },
    red: {
      weight: 10
    }
  });
});

test("pipe with sumBy behaves as it does when input data includes strings", t => {
  const inputArray = [
    {
      color: "blue",
      weight: 10
    },
    {
      color: "blue",
      weight: 10
    },
    {
      color: "red",
      weight: 10
    },
    {
      color: "red",
      weight: ""
    },
    {
      color: "red",
      weight: 15
    },
    {
      color: "violet",
      weight: ""
    }
  ];

  const groupByResult = pipe([groupBy("color")])(inputArray);

  t.deepEqual(groupByResult, {
    blue: [
      {
        color: "blue",
        weight: 10
      },
      {
        color: "blue",
        weight: 10
      }
    ],
    red: [
      {
        color: "red",
        weight: 10
      },
      {
        color: "red",
        weight: ""
      },
      {
        color: "red",
        weight: 15
      }
    ],
    violet: [
      {
        color: "violet",
        weight: ""
      }
    ]
  });

  const groupByAndSumByResult = pipe([
    groupBy("color"),
    mapValues((groupedItems: any) => {
      return {
        weight: sumBy("weight")(groupedItems)
      };
    })
  ])(inputArray);

  // t.log("groupByAndSumByResult", groupByAndSumByResult);

  t.deepEqual(groupByAndSumByResult, {
    blue: {
      weight: 20
    },
    red: {
      weight: "1015"
    },
    violet: {
      weight: ""
    }
  });
});
