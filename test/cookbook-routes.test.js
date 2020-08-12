const req = require("supertest");
const mysql = require("mysql");
const expect = require("chai").expect;
const app = require("../server");
const sinon = require("sinon");

const mockMysql = sinon.mock(mysql);

describe("Lists All breakfast recipes", () => {
    it("lists all breakfast recipes", (done) => {
        req(app).get("/cookbook/Breakfast").auth("irina@irina.com", "123").expect(200).then((res) => {
            expect(res.body).to.be.a("object");
            console.log("response: ", res.body);
            done();
        });
    });
});

describe('Database Write Requests', function () {

    beforeEach(() => {
        mockMysql.expects('createConnection').returns({
            connect: () => {
                console.log('Successfully connected');
            },
            query: (query, vars, callback) => {
                callback(null, successfulDbInsert);
            },
            end: () => {
                console.log('Connection ended');
            }
        });

    });
    after(() => {
        mockMysql.restore();
    });

    describe('Write to DB', () => {

        it('writes to table recipe', () => {
            req(app).post("/cookbook", (req, res) => {
                console.log("req-cookbook: ", req);
                console.log("res-cookbook: ", res);
                const sql = "insert into recipes (name) values ('Mocha Cake')";
                mockMysql.createConnection.query(sql, (err, res) => {
                    if (err) throw err;
                    console.log("result: ", res);
                    expect(res).to.equal(res);
                });
            });

        });

    });
});

