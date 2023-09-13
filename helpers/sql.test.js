const { sqlForPartialUpdate, sqlFilter } = require("./sql");

const updateData = { ex1: "val1", example2: "val2" };
const jsData = { example2: "ex2" };
const expectedResult = { setCols: '"ex1"=$1, "ex2"=$2', values: ['val1', 'val2'] };

describe("sqlForPartialUpdate", function () {
    test("Valid Data Two Columns", function () {
        let result = sqlForPartialUpdate(updateData, jsData);
        expect(result.setCols).toEqual(expectedResult.setCols);
        expect(result.values).toEqual(expectedResult.values);
    });

    test("Valid Data One Column", function () {
        let result = sqlForPartialUpdate({example2: "val2" }, jsData);
        expect(result.setCols).toEqual('"ex2"=$1');
        expect(result.values).toEqual(['val2']);
    });

    test("Invalid Data", function () {
        expect(() => sqlForPartialUpdate({}, jsData)).toThrow("No data")
    });
});


describe("Companies: sqlFilter", function () {

    test("Valid all filter", function () {
        let filterData = { name: "in", minEmployees: "100", maxEmployees: "400" }
        let filterResult = { filterCols: '"name" ILIKE ($1) AND "num_employees" BETWEEN $2 AND $3', values: ['%in%', '100', '400'] }
        let result = sqlFilter(filterData);
        expect(result.filterCols).toEqual(filterResult.filterCols);
        expect(result.values).toEqual(filterResult.values);
    });

    test("Valid min filter", function () {
        let filterData = { minEmployees: "100" }
        let filterResult = { filterCols: '"num_employees">=$1', values: ['100'] }
        let result = sqlFilter(filterData);
        expect(result.filterCols).toEqual(filterResult.filterCols);
        expect(result.values).toEqual(filterResult.values);
    });

    test("Valid max filter", function () {
        let filterData = { maxEmployees: "100" }
        let filterResult = { filterCols: '"num_employees"<=$1', values: ['100'] }
        let result = sqlFilter(filterData);
        expect(result.filterCols).toEqual(filterResult.filterCols);
        expect(result.values).toEqual(filterResult.values);
    });

    test("Valid name filter", function () {
        let filterData = { name: "in" }
        let filterResult = { filterCols: '"name" ILIKE ($1)', values: ['%in%'] }
        let result = sqlFilter(filterData);
        expect(result.filterCols).toEqual(filterResult.filterCols);
        expect(result.values).toEqual(filterResult.values);
    });

    test("Valid name min filter", function () {
        let filterData = { name: "in", minEmployees: "400" }
        let filterResult = { filterCols: '"name" ILIKE ($1) AND "num_employees">=$2', values: ['%in%', '400'] }
        let result = sqlFilter(filterData);
        expect(result.filterCols).toEqual(filterResult.filterCols);
        expect(result.values).toEqual(filterResult.values);
    });

    test("Valid name max filter", function () {
        let filterData = { name: "in", maxEmployees: "400" }
        let filterResult = { filterCols: '"name" ILIKE ($1) AND "num_employees"<=$2', values: ['%in%', '400'] }
        let result = sqlFilter(filterData);
        expect(result.filterCols).toEqual(filterResult.filterCols);
        expect(result.values).toEqual(filterResult.values);
    });

    test("Valid min max filter", function () {
        let filterData = { minEmployees: "100", maxEmployees: "400" }
        let filterResult = { filterCols: '"num_employees" BETWEEN $1 AND $2', values: ['100', '400'] }
        let result = sqlFilter(filterData);
        expect(result.filterCols).toEqual(filterResult.filterCols);
        expect(result.values).toEqual(filterResult.values);
    });

    test("Min Exceeds Max", function () {
        let filterData = { name: "in", minEmployees: "400", maxEmployees: "300" }
        expect(() => sqlFilter(filterData)).toThrow("Min cannot be greater than Max")
    });

    test("No Filter", function () {
        expect(sqlFilter({})).toEqual({ filterCols: "No Filter", values:[] })
    });
});
describe("Jobs: sqlFilter", function () {

    test("Valid all filter with equity true", function () {
        let filterData = { title: "j", minSalary: "100", hasEquity: true }
        let filterResult = { filterCols: '"title" ILIKE ($1) AND "salary">=$2 AND "equity">$3', values: ['%j%', '100', '0'] }
        let result = sqlFilter(filterData);
        expect(result.filterCols).toEqual(filterResult.filterCols);
        expect(result.values).toEqual(filterResult.values);
    });

    test("Valid all filter with equity false", function () {
        let filterData = { title: "j", minSalary: "100", hasEquity: false }
        let filterResult = { filterCols: '"title" ILIKE ($1) AND "salary">=$2' , values: ['%j%', '100'] }
        let result = sqlFilter(filterData);
        expect(result.filterCols).toEqual(filterResult.filterCols);
        expect(result.values).toEqual(filterResult.values);
    });

    test("Valid min salary filter", function () {
        let filterData = { minSalary: "100" }
        let filterResult = { filterCols: '"salary">=$1', values: ['100'] }
        let result = sqlFilter(filterData);
        expect(result.filterCols).toEqual(filterResult.filterCols);
        expect(result.values).toEqual(filterResult.values);
    });

    test("Equity filter true", function () {
        let filterData = { hasEquity: true }
        let filterResult = { filterCols: '"equity">$1', values: ['0'] }
        let result = sqlFilter(filterData);
        expect(result.filterCols).toEqual(filterResult.filterCols);
        expect(result.values).toEqual(filterResult.values);
    });

    test("Equity filter false", function () {
        let filterData = { hasEquity: false }
        //let filterResult = { filterCols: '"equity">=$1', values: ['0'] }
        let filterResult = { filterCols: '', values: [] }
        let result = sqlFilter(filterData);
        console.log(result)
        expect(result.filterCols).toEqual(filterResult.filterCols);
        expect(result.values).toEqual(filterResult.values);
    });

    test("Valid title filter", function () {
        let filterData = { title: "in" }
        let filterResult = { filterCols: '"title" ILIKE ($1)', values: ['%in%'] }
        let result = sqlFilter(filterData);
        expect(result.filterCols).toEqual(filterResult.filterCols);
        expect(result.values).toEqual(filterResult.values);
    });

    test("Valid title min filter", function () {
        let filterData = { title: "in", minSalary: "400" }
        let filterResult = { filterCols: '"title" ILIKE ($1) AND "salary">=$2', values: ['%in%', '400'] }
        let result = sqlFilter(filterData);
        expect(result.filterCols).toEqual(filterResult.filterCols);
        expect(result.values).toEqual(filterResult.values);
    });

    test("Valid title equity filter", function () {
        let filterData = { title: "in", hasEquity: true }
        let filterResult = { filterCols: '"title" ILIKE ($1) AND "equity">$2', values: ['%in%', '0'] }
        let result = sqlFilter(filterData);
        expect(result.filterCols).toEqual(filterResult.filterCols);
        expect(result.values).toEqual(filterResult.values);
    });

    test("Valid min equity filter", function () {
        let filterData = { minSalary: "100", hasEquity: true }
        let filterResult = { filterCols: '"salary">=$1 AND "equity">$2', values: ['100', '0'] }
        let result = sqlFilter(filterData);
        expect(result.filterCols).toEqual(filterResult.filterCols);
        expect(result.values).toEqual(filterResult.values);
    });

    test("No Filter", function () {
        expect(sqlFilter({})).toEqual({ filterCols: "No Filter", values:[] })
    });
});
