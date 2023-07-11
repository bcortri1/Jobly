const { sqlForPartialUpdate } = require("./sql");

const updateData= { ex1: "val1", example2: "val2"};
const jsData= {example2: "ex2"};
const expectedResult= {setCols: '"ex1"=$1, "ex2"=$2', values: ['val1', 'val2'] };

describe("sqlForPartialUpdate", function () {
    test("Valid Data", function () {
        let result= sqlForPartialUpdate(updateData, jsData);
        expect(result.setCols).toEqual(expectedResult.setCols);
        expect(result.values).toEqual(expectedResult.values);
    });
  
    test("Invalid Data", function () {
        expect(() => sqlForPartialUpdate({}, jsData)).toThrow("No data")
    });
});