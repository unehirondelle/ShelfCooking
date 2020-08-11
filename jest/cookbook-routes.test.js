const req = require("supertest");
const express = require("express");
const app = express();
const connection = require("../config/connection");

// const userRoutes = require("../routes/user-routes")(app);
// const cookbookRoutes = require("../routes/cookbook-routes")(app);

req(app).get("/").expect("Content-Type", /html/).expect(500).end((err, res) => {
    if (err) throw err;
});

describe("Get Home", () => {
    it("responds with 500", (done) => {
        req(app).get("/").set("Accept", "text/html").expect("Content-Type", /html/).expect(500, done);
    });
});

/*
describe("CookBook", () => {
it("should return status 200", async () => {
    const mock = jest.spyOn(cookbookRoutes, 'select distinct (type) from recipes;');
    const res = await req(cookbookRoutes).get('/cookbook');
    console.log(res.err);
    expect(cookbookRoutes).toBeCalled();
    expect(res.status).toBe(200);
})
})*/
