const req = require("supertest");
const app = require("../server");

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
        }).expect(302).expect("Location", /\//, done);
    });
});
