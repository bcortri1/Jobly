"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */
//id, title, salary, equity, company_handle

describe("create", function () {
    const newJob = {
        title: "New",
        salary: 50000,
        equity: 0,
        company_handle: "c1",
    };

    test("works", async function () {
        let job = await Job.create(newJob);
        expect(job.title).toEqual(newJob.title);
        expect(job.salary).toEqual(newJob.salary);
        expect(job.equity).toEqual(newJob.equity);
        expect(job.company_handle).toEqual(newJob.company_handle);

        const result = await db.query(
            `SELECT id, title, salary::INTEGER, equity::FLOAT, company_handle
            FROM jobs
            WHERE title = 'New'`);
        expect(result.rows[0].title).toEqual(newJob.title);
        expect(result.rows[0].salary).toEqual(newJob.salary);
        expect(result.rows[0].equity).toEqual(newJob.equity);
        expect(result.rows[0].company_handle).toEqual(newJob.company_handle);

    });
});

/************************************** findAll */

describe("findAll", function () {
    test("works: no filter", async function () {
        let jobs = await Job.findAll();
        expect(jobs[0].title).toEqual('j1');
        expect(jobs[0].salary).toEqual(100);
        expect(jobs[0].equity).toEqual(0.90);
        expect(jobs[0].company_handle).toEqual('c1');

        expect(jobs[1].title).toEqual('j2');
        expect(jobs[1].salary).toEqual(200);
        expect(jobs[1].equity).toEqual(0.80);
        expect(jobs[1].company_handle).toEqual('c2');

        expect(jobs[2].title).toEqual('j3');
        expect(jobs[2].salary).toEqual(300);
        expect(jobs[2].equity).toEqual(0.70);
        expect(jobs[2].company_handle).toEqual('c3');
    });
});


/************************************** filterAll */

describe("filterAll", function () {
    test("Valid all filter", async function () {
        let filterData = { title: "j", minSalary: 200, hasEquity: true }
        let jobs = await Job.filterAll(filterData);
        jobs.forEach((entry) => {
            delete entry.id
            return entry
        })
        expect(jobs).toEqual([
            {
                title: 'j2',
                salary: 200,
                equity: 0.8,
                company_handle: 'c2',
            },
            {
                title: 'j3',
                salary: 300,
                equity: 0.7,
                company_handle: 'c3',
            }
        ])
    });

    test("Valid min filter", async function () {
        let filterData = { minSalary: 1 }
        let jobs = await Job.filterAll(filterData);
        jobs.forEach((entry) => {
            delete entry.id
            return entry
        })
        expect(jobs).toEqual([
            {
                title: "j1",
                salary: 100,
                equity: 0.9,
                company_handle: 'c1',
            },
            {
                title: 'j2',
                salary: 200,
                equity: 0.8,
                company_handle: 'c2',
            },
            {
                title: 'j3',
                salary: 300,
                equity: 0.7,
                company_handle: 'c3',
            }
        ]);
    });


    test("Valid equity filter true", async function () {
        let filterData = { hasEquity: true }
        let jobs = await Job.filterAll(filterData);
        jobs.forEach((entry) => {
            delete entry.id
            return entry
        })
        expect(jobs).toEqual([
            {
                title: "j1",
                salary: 100,
                equity: 0.9,
                company_handle: 'c1',
            },
            {
                title: 'j2',
                salary: 200,
                equity: 0.8,
                company_handle: 'c2',
            },
            {
                title: 'j3',
                salary: 300,
                equity: 0.7,
                company_handle: 'c3',
            }
        ]);
    });

    test("Valid equity filter false", async function () {
        let filterData = { hasEquity: false }
        let jobs = await Job.filterAll(filterData);
        jobs.forEach((entry) => {
            delete entry.id
            return entry
        })
        expect(jobs).toEqual([
            {
                title: "j1",
                salary: 100,
                equity: 0.9,
                company_handle: 'c1',
            },
            {
                title: 'j2',
                salary: 200,
                equity: 0.8,
                company_handle: 'c2',
            },
            {
                title: 'j3',
                salary: 300,
                equity: 0.7,
                company_handle: 'c3',
            }
        ]);
    });

    test("Valid title filter", async function () {
        let filterData = { title: "j1" }
        let jobs = await Job.filterAll(filterData);
        jobs.forEach((entry) => {
            delete entry.id
            return entry
        })
        expect(jobs).toEqual([
            {
                title: "j1",
                salary: 100,
                equity: 0.9,
                company_handle: 'c1',
            },
        ]);
    });

    test("Valid title min filter", async function () {
        let filterData = { title: "j", minSalary: 300 }
        let jobs = await Job.filterAll(filterData);
        jobs.forEach((entry) => {
            delete entry.id
            return entry
        })
        expect(jobs).toEqual([
            {
                title: 'j3',
                salary: 300,
                equity: 0.7,
                company_handle: 'c3',
            }
        ]);
    });

    test("Valid title equity filter", async function () {
        let filterData = { title: "j", hasEquity: true }
        let jobs = await Job.filterAll(filterData);
        jobs.forEach((entry) => {
            delete entry.id
            return entry
        })
        expect(jobs).toEqual([
            {
                title: "j1",
                salary: 100,
                equity: 0.9,
                company_handle: 'c1',
            },
            {
                title: 'j2',
                salary: 200,
                equity: 0.8,
                company_handle: 'c2',
            },
            {
                title: 'j3',
                salary: 300,
                equity: 0.7,
                company_handle: 'c3',
            }
        ]);
    });

    test("Valid min equity filter", async function () {
        let filterData = { minSalary: 200, hasEquity: true }
        let jobs = await Job.filterAll(filterData);
        jobs.forEach((entry) => {
            delete entry.id
            return entry
        })
        expect(jobs).toEqual([
            {
                title: 'j2',
                salary: 200,
                equity: 0.8,
                company_handle: 'c2',
            },
            {
                title: 'j3',
                salary: 300,
                equity: 0.7,
                company_handle: 'c3',
            }
        ]);
    });

    test("No Filter", async function () {
        expect(await Job.filterAll({})).toEqual(await Job.findAll())
    });
});

/************************************** get */

describe("get", function () {

    test("works", async function () {
        const jobId = await db.query(`
        SELECT id
        FROM jobs
        WHERE title='j1'`);
        let job = await Job.get(jobId.rows[0].id);
        expect(job.title).toEqual('j1');
        expect(job.salary).toEqual(100);
        expect(job.equity).toEqual(0.90);
        expect(job.company_handle).toEqual('c1');
    });

    test("not found if no such job", async function () {
        try {
            await Job.get("nope");
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** update */

describe("update", function () {
    const updateData = {
        title: "j1",
        salary: 10,
        equity: 1,
        company_handle: "c1",
    };

    test("works", async function () {
        const jobId = await db.query(`
        SELECT id
        FROM jobs
        WHERE title='j1'`);
        let job = await Job.update(jobId.rows[0].id, updateData);
        expect(job).toEqual({
            id: jobId.rows[0].id,
            ...updateData,
        });

        const result = await db.query(
            `SELECT id, title, salary::INTEGER, equity::FLOAT, company_handle
           FROM jobs
           WHERE id = ${jobId.rows[0].id}`);
        expect(result.rows).toEqual([{
            id: jobId.rows[0].id,
            title: "j1",
            salary: 10,
            equity: 1.0,
            company_handle: "c1",
        }]);
    });

    test("works: null fields", async function () {
        const updateDataSetNulls = {
            title: "j1",
            salary: null,
            equity: null,
            company_handle: "c1",
        };

        const jobId = await db.query(`
        SELECT id
        FROM jobs
        WHERE title='j1'`);

        let job = await Job.update(jobId.rows[0].id, updateDataSetNulls);
        expect(job).toEqual({
            id: jobId.rows[0].id,
            ...updateDataSetNulls,
        });

        const result = await db.query(
            `SELECT id, title, salary::INTEGER, equity::FLOAT, company_handle
           FROM jobs
           WHERE id = ${jobId.rows[0].id}`);
        expect(result.rows).toEqual([{
            id: jobId.rows[0].id,
            title: "j1",
            salary: null,
            equity: null,
            company_handle: "c1",
        }]);
    });

    test("not found if no such job", async function () {
        try {
            await Job.update(-1, updateData);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    test("bad request with no data", async function () {
        const jobId = await db.query(`
        SELECT id
        FROM jobs
        WHERE title='j1'`);
        try {
            await Job.update(jobId.rows[0].id);
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** remove */

describe("remove", function () {
    test("works", async function () {
        const jobId = await db.query(`
        SELECT id
        FROM jobs
        WHERE title='j1'`);

        await Job.remove(jobId.rows[0].id);
        const res = await db.query(
            `SELECT id FROM jobs WHERE id=${jobId.rows[0].id}`);
        expect(res.rows.length).toEqual(0);
    });

    test("not found if no such job", async function () {
        try {
            await Job.remove(-1);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
