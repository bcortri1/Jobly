"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, sqlFilter } = require("../helpers/sql");


class Job {
    //title, salary, equity, company_handle

    static async create({ title, salary, equity, company_handle }) {

        const result = await db.query(
            `INSERT INTO jobs
           (title, salary, equity, company_handle )
           VALUES ($1, $2, $3, $4)
           RETURNING id, title, salary::INTEGER, equity::FLOAT, company_handle`,
            [title, salary, equity, company_handle],
        );
        const job = result.rows[0];

        return job;
    }

    /** Find all jobs.
     *
     * Returns [{ id, title, salary, equity, company_handle }, ...]
     * */

    static async findAll() {
        const jobsRes = await db.query(
            `SELECT id, 
            title,
            salary::INTEGER,
            equity::FLOAT,
            company_handle 
           FROM jobs
           ORDER BY title`);
        return jobsRes.rows;
    }


    /** Find all matching jobs.
     *
     * Returns [{ id, title, salary, equity, company_handle }, ...]
     * */

    static async filterAll(data) {
        const { filterCols, values } = sqlFilter(data)
        if ((filterCols === "No Filter") || (values.length === 0)) {
            // Will default to findAll
            return Job.findAll();
        }
        else {
            const jobsRes = await db.query(
                `SELECT id,
                title,
                salary::INTEGER,
                equity::FLOAT,
                company_handle 
             FROM jobs WHERE ${filterCols}
             ORDER BY title`, [...values]);
            return jobsRes.rows;
        }

    }



    /** Given a job id, return data about job.
     *
     * Returns { id, title, salary, equity, company_handle }
     *   where jobs is [{id, title, salary, equity, company_handle }, ...]
     *
     * Throws NotFoundError if not found.
     **/
    static async get(id) {
        try {
            const jobsRes = await db.query(
                `SELECT id,
                title,
                salary::INTEGER,
                equity::FLOAT,
                company_handle 
            FROM jobs 
            WHERE id = $1`,
                [id]);

            const job = jobsRes.rows[0];
            return job;
        }
        catch (err) {
            throw new NotFoundError(`No job: ${id}`);
        }
    }

    /** Update job data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain all the
     * fields; this only changes provided ones.
     *
     * Data can include: {title, salary, equity, company_handle}
     *
     * Returns {id, title, salary, equity, company_handle}
     *
     * Throws NotFoundError if not found.
     */

    static async update(id, data) {

        if (!data) {
            throw new BadRequestError(`No data`);
        }

        if (typeof id !== "number") {
            throw new BadRequestError(`id must be an integer`);
        }
        const { setCols, values } = sqlForPartialUpdate(data,{});

        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE jobs 
                          SET ${setCols} 
                          WHERE id = ${idVarIdx} 
                          RETURNING id,
                            title,
                            salary::INTEGER,
                            equity::FLOAT,
                            company_handle `;

        const result = await db.query(querySql, [...values, id]);
        const job = result.rows[0];

        if (!job) throw new NotFoundError(`No job: ${id}`);
        return job;

    }

    /** Delete given job from database; returns undefined.
     *
     * Throws NotFoundError if job not found.
     **/

    static async remove(id) {

        const result = await db.query(
            `DELETE
               FROM jobs
               WHERE id = $1
               RETURNING id`,
            [id]);
        const job = result.rows[0];



        if (!job) throw new NotFoundError(`No job: ${id}`);
    }

}

module.exports = Job;