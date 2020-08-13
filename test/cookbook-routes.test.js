const req = require("supertest");
const mysql = require("mysql");
const expect = require("chai").expect;
const app = require("../server");
const sinon = require("sinon");

describe("Lists All breakfast recipes", () => {
    it("lists all breakfast recipes", (done) => {
        req(app).get("/cookbook/Breakfast").auth("irina@irina.com", "123").expect(200).then((res) => {
            expect(res.body).to.be.a("object");
            console.log("response: ", res.body);
            done();
        });
    });
});

