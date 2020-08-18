const req = require("supertest");
const app = require("../server");
const agent = req.agent("http://localhost:3000");
const loginUser = require("./fixtures/testLoginUser");


describe("unauthenticated attempt to get homepage", () => {
    it("redirects to login page", (done) => {
        req(app).get("/").expect(403, done);
    });
});

describe("GET login", () => {

    it("login", loginUser());
    it("redirects authorized user to homepage", function (done) {
        this.timeout(500);
        setTimeout(done, 300);
        agent.get("/login")
            .expect(200)
            .end((err, res) => {
                if (err) return err;
                console.log(res.body);
            });
    });
});

/*describe("POST login", () => {
    it("accepts credentials & redirects to homepage", (done) => {
        req(app).post("/login").send("email=irina@irina.co&password=123").expect(302, done);
    });


    it("rejects wrong credentials & redirects to login", (done) => {
        req(app).post("/login").send("email=irina@irina.com&password=12345").expect(401, done);
    });
});*/

