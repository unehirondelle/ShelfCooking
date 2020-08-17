const req = require("supertest");
const app = require("../server");


describe("GET /cookbook/breakfast", () => {
    it("lists all breakfast recipes", (done) => {
        req(app).get("/cookbook/breakfast").auth("irina@irina.com", "123").expect("Location", /\/cookbook\/breakfast/).expect(200, done);
    });
});

