const req = require("supertest");
// const req_req = require("request");
const connection = require("../config/connection");
const expect = require("chai").expect;
const app = require("../server");
// const sinon = require("sinon");

// const mock = sinon.mock(require("mysql"));

describe("GET '/'", () => {
    it("loads homepage", (done) => {
        req(app).get("/").auth("irina@irina.com", 123).expect(302, done);
    })
});

describe("homepage", () => {
    it("redirects to login page", (done) => {
        req(app).get("/").expect(302).expect("Location", /\/login/, done);
    });
});

describe("post login", () => {
    it("accepts credentials & redirects to homepage", (done) => {
        req(app).post("/login").send({
            email: "irina@irina.com",
            password: 123
        }).expect(302).expect("Location", /\//, () => {
            req(app).get("/").expect(302, done);
        });
    });
});

describe("Lists All breakfast recipes", (done) => {
    it("lists all breakfast recipes", (done) => {
        req(app).get("/cookbook/Breakfast").auth("irina@irina.com", 123).expect(200).then((res) => {
            expect(res.body).to.be.a("object");
            console.log("response: ", res.body);
            done();
        });
    });
});

/*
describe("new recipe", () => {
    it("adds new recipe to DB", (done) => {
        req(app).post("/cookbook").field("name", "image").attach("Mocha Cake", "./test/fixtures/sandwich-small.jpg").expect("Location", /\/cookbook/, done);

    });
});
*/

