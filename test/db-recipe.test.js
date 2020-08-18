const chai = require('chai');
const sinon = require('sinon');

const auth = require("../helpers/checkAuthenticated");
const dbConnection = require("../config/connection");
const supertest = require("supertest");

const expect = chai.expect;

describe("mock DB connection", () => {
    it('returns fake content', function () {

        sinon.stub(auth, "checkAuthenticated")
            .callsFake(function (req, res, next) {
                return next();
            });
        const app = require("../server");
        sinon.stub(dbConnection, "queryExecutor").callsArgWith(2, undefined, [{type: 'oleole'}, {type: 'one more'}]);
        supertest(app).get("/cookbook")
            .expect(function (r) {
                console.log(r.text)
                chai.assert(r.text.includes('ole'), 'should contain ole');
            })
            .expect(200);

    });
});

// const chai = require('chai');
// const sinon = require('sinon');
const sinonChai = require("sinon-chai");

// const supertest = require("supertest");
chai.use(sinonChai);
// const expect = chai.expect;

const {mockReq, mockRes} = require('sinon-express-mock');
// const dbConnection = require("../config/connection");
const dbService = require("../config/db-service");
const mySql = require("../helpers/mysql/executeQuery");
const sql = require("../helpers/mysql/sqlQuery-cookbook");
const eh = require("../helpers/eh");

describe('Route: /add-recipe', () => {

    it('should save new recipe details to the database', async () => {
        const request = {
            body: {
                recipeName: "Mocha Cake",
                method: null,
                recipeTime: "3 h",
                portions: "12",
                recipeCategory: "Dessert",
                utensils: null,
                ingredient: null
            },
            files: {
                recipeImage: sinon.stub()
            }
        }

        const req = mockReq(request);
        const res = mockRes();

        const dbResult = [{recipeId: "1"}];

        const spyInsertQuery = sinon.spy(sql, "insertRecipe")
        const spySelectQuery = sinon.spy(sql, "selectRecipeIdByName")
        const stubMySql = sinon.stub(mySql, "executeQuery").onSecondCall().returns(dbResult)

        await dbService.createRecipe(req, res)

        expect(res.send).to.be.calledWithExactly({
            message: "Success!! Your new recipe has been saved to the Database."
        })

        sinon.assert.calledOnce(spyInsertQuery)
        sinon.assert.calledWith(spyInsertQuery, request.body.recipeName, request.body.method, request.body.recipeTime, request.body.portions, request.body.recipeCategory, request.body.utensils);
        sinon.assert.calledOnce(spySelectQuery)
        sinon.assert.calledWith(spySelectQuery, request.body.recipeName)
        sinon.assert.calledTwice(stubMySql)
        sinon.restore()
    });

    it('should display an error if a customer attempts to create a recipe with a duplicated name', async () => {
        const err = {
            code: "ER_DUP_ENTRY"
        }
        const request = {
            body: {
                recipeName: "Mocha Cake",
                method: null,
                recipeTime: "3 h",
                portions: "12",
                recipeCategory: "Dessert",
                utensils: null
            },
            files: {
                recipeImage: sinon.stub()
            }
        }

        const req = mockReq(request)
        const res = mockRes()

        sinon.stub(mySql, "executeQuery").throws(err)

        await dbService.createRecipe(req, res)

        expect(res.send).to.be.calledWithExactly({
            message: "You have entered a duplicate name!"
        })
        sinon.restore()
    });

    it('should display an error if a customer leaves the name value blank', async () => {
        const request = {
            body: {
                recipeName: "",
                method: null,
                recipeTime: "3 h",
                portions: "12",
                recipeCategory: "Dessert",
                utensils: null
            },
            files: {
                recipeImage: sinon.stub()
            }
        }

        const req = mockReq(request)
        const res = mockRes()

        await dbService.createRecipe(req, res)

        expect(res.send).to.be.calledWithExactly({
            message: "The name value is blank. Please enter a unique name."
        })
        sinon.restore()
    });

    it('should display an meaningful error when a downstream/underlying network request fails', async () => {
        const err = {
            response: {
                status: 504,
                config: {
                    url: 'https://fake.bank.domain/cds-au/v0/banking/products',
                    method: 'get',
                    headers: {Accept: 'application/json, text/plain, */*'}
                },
                data: {message: "I think something timed out!"}
            }
        }

        const request = {
            body: {
                recipeName: "Mocha Cake",
                method: null,
                recipeTime: "3 h",
                portions: "12",
                recipeCategory: "Dessert",
                utensils: null
            },
            files: {
                recipeImage: sinon.stub()
            }
        }

        const req = mockReq(request)
        const res = mockRes()

        const spyErrorsHandler = sinon.spy(eh, "errorsHandler")
        sinon.stub(mySql, "executeQuery").throws(err)

        await dbService.createRecipe(req, res)

        sinon.assert.calledOnce(spyErrorsHandler)
        sinon.assert.calledWith(spyErrorsHandler, err)
        sinon.restore()
    });

    it('should build the SQL request from given parameters', function (done) {
        this.timeout(500);
        setTimeout(done, 300);
        const request = {
            body: {
                recipeName: "New Cake",
                method: null,
                recipeTime: "3 h",
                portions: "12",
                recipeCategory: "Dessert",
                utensils: null,
                ingredient: null
            },
            files: {
                recipeImage: sinon.stub()
            }
        }

        const req = mockReq(request);
        const res = mockRes();

        const sqlRequest = `INSERT INTO recipes (name, method, time, person_num, type, image, utensils)
            VALUES("New Cake", "null", "3 h", "12", "Dessert", ?, "null");`;

        const spyInsertQuery = sinon.spy(sql, "insertRecipe");

        dbService.createRecipe(req, res);

        expect(sql.insertRecipe(request.body.recipeName, request.body.method, request.body.recipeTime, request.body.portions, request.body.recipeCategory, request.body.utensils)).to.equal(sqlRequest);

        sinon.assert.calledWith(spyInsertQuery, request.body.recipeName, request.body.method, request.body.recipeTime, request.body.portions, request.body.recipeCategory, request.body.utensils);
        sinon.restore();

    });

})