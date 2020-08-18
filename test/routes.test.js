const decache = require("decache");
const req = require("supertest");
const agent = req.agent("http://localhost:3000");
const loginUser = require("./fixtures/testLoginUser");

const chai = require('chai');
const sinon = require('sinon');

const auth = require("../helpers/checkAuthenticated");

describe("Unauthenticated access to Homepage", () => {

    it("unauthenticated attempt redirects to login page", (done) => {

        // sinon.restore();
        sinon.stub(auth, "checkAuthenticated")
            .callsFake(function (req, res, next) {
                return req.isAuthenticated() === true;
            });
        const app = require("../server");
        req(app).get("/").expect(401, done);
    });

});


describe("Authenticated access to Homepage", () => {
    let app_home;

    it("authenticated attempt redirects to homepage", (done) => {

   /*     sinon.stub(auth, "checkAuthenticated")
            .callsFake(function (req, res, next) {
                return next();
            });
*/

        app_home = require("../server");
        req(app_home).get("/").expect(200, done);

    });

});


describe("signup with existing email", () => {

    it("sends 403 status code", (done) => {
        const app = require("../server");
        req(app).post("/signup").send("username=qwe&email=irina@irina.com&password=12345").expect(403, done);
    })

})

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

