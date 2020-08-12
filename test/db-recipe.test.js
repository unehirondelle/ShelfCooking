const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require("sinon-chai");
const {mockReq, mockRes} = require('sinon-express-mock');

chai.use(sinonChai);
const expect = chai.expect

const createRecipe = require("../config/create");
const mySql = require("../config/executeQuery");
const sql = require("./sqlQuery-cookbook");
const eh = require("./eh");

describe('Route: /add-recipe', () => {
    it('should save new recipe details to the database', async () => {

        const request = {
            body: {
                recipeName: "Mocha Cake",
                recipeCategory: "Dessert"
            }
        }
        const req = mockReq(request)

        const res = mockRes()

        const dbResult = [{recipeId: "1"}]

        const spyInsertQuery = sinon.spy(sql, "insertRecipe")
        const spySelectQuery = sinon.spy(sql, "selectRecipeIdByName")
        const stubMySql = sinon.stub(mySql, "executeQuery").onSecondCall().returns(dbResult)

        await createRecipe(req, res)

        expect(res.send).to.be.calledWithExactly({
            message: "Success!! Your new recipe has been saved to the Database."
        })

        sinon.assert.calledOnce(spyInsertQuery)
        sinon.assert.calledWith(spyInsertQuery, request.body.name, request.body.type)
        sinon.assert.calledOnce(spySelectQuery)
        sinon.assert.calledWith(spySelectQuery, request.body.name)
        sinon.assert.calledTwice(stubMySql)
        sinon.restore()
    })

    it('should display an error if a customer attempts to create a recipe with a duplicated name', async () => {
        const err = {
            code: "ER_DUP_ENTRY"
        }
        const request = {
            body: {
                recipeName: "Mocha Cake",
                recipeCategory: "Dessert"
            }
        }

        const req = mockReq(request)
        const res = mockRes()

        sinon.stub(mySql, "executeQuery").throws(err)

        await createRecipe(req, res)

        expect(res.send).to.be.calledWithExactly({
            message: "You have entered a duplicate name!"
        })
        sinon.restore()
    })

    it('should display an error if a customer leaves the name value blank', async () => {
        const request = {
            body: {
                recipeName: "",
                recipeCategory: "Dessert"
            }
        }
        const req = mockReq(request)
        const res = mockRes()

        await createRecipe(req, res)

        expect(res.send).to.be.calledWithExactly({
            message: "The name value is blank. Please enter a unique name."
        })
        sinon.restore()
    })

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
                recipeCategory: "Dessert"
            }
        }

        const req = mockReq(request)
        const res = mockRes()

        const spyErrorsHandler = sinon.spy(eh, "errorsHandler")
        sinon.stub(mySql, "executeQuery").throws(err)

        await createRecipe(req, res)

        sinon.assert.calledOnce(spyErrorsHandler)
        sinon.assert.calledWith(spyErrorsHandler, err)
        sinon.restore()
    })
})