const req = require("supertest");
const app = require("../server");

describe("unauthenticated attempt to get homepage", () => {
    it("redirects to login page", (done) => {
        req(app).get("/").expect("Location", /\/login/, done);
    });
});

describe("POST login", () => {
    it("accepts credentials & redirects to homepage", (done) => {
        req(app).post("/login").send("email=irina@irina.co&password=123").expect(302, done);
    });


    it("rejects wrong credentials & redirects to login", (done) => {
        req(app).post("/login").send("email=irina@irina.com&password=12345").expect(401, done);
    });
});

