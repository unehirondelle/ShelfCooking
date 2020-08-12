const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require("sinon-chai");
const {mockReq, mockRes} = require('sinon-express-mock');

chai.use(sinonChai);
const expect = chai.expect

const mySql = require("./mySql");
const eh = require("./eh");

describe('Route: /add-recipe', () => {
    it('should save new recipe details to the database', async () => {
        const request = {
            body: {
                name: "Mocha Cake",
                type: "Dessert"
            }
        }
        const req = mockReq(request)
        const res = mockRes()

        const dbResult = [{recipeId: "1"}]

        const spyInsertQuery = sinon.spy(insertRecipe)
        const spySelectQuery = sinon.spy(selectRecipeIdByName)
        const stubMySql = sinon.stub(mySql, "executeQuery").onSecondCall().returns(dbResult)

        await create(req, res)

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
                name: "Mocha Cake",
                type: "Dessert"
            }
        }

        const req = mockReq(request)
        const res = mockRes()

        sinon.stub(mySql, "executeQuery").throws(err)

        await create(req, res)

        expect(res.send).to.be.calledWithExactly({
            message: "You have entered a duplicate name!"
        })
        sinon.restore()
    })

    it('should display an error if a customer leaves the name value blank', async () => {
        const request = {
            body: {
                name: "",
                type: "Dessert"
            }
        }
        const req = mockReq(request)
        const res = mockRes()

        await create(req, res)

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
                name: "Mocha Cake",
                type: "Dessert"
            }
        }

        const req = mockReq(request)
        const res = mockRes()

        const spyErrorsHandler = sinon.spy(eh, "errorsHandler")
        sinon.stub(mySql, "executeQuery").throws(err)

        await create(req, res)

        sinon.assert.calledOnce(spyErrorsHandler)
        sinon.assert.calledWith(spyErrorsHandler, err)
        sinon.restore()
    })
})

async function create(req, res) {
    const {name, type} = req.body
    let message = ""

    try {
        if (name) {
            // insert the new recipe into the db
            let sqlQuery = insertRecipe(name, type)
            await mySql.executeQuery(sqlQuery)

            // get the 'recipe_id' for the newly create recipe
            sqlQuery = selectRecipeIdByName(name)
            const dbResult = await mySql.executeQuery(sqlQuery)
            const {recipeId} = dbResult[0]

            message = {message: "Success!! Your new recipe has been saved to the Database."}
        } else {
            message = {message: "The name value is blank. Please enter a unique name."}
        }

        res.send(message)
    } catch (error) {
        if (error.code == 'ER_DUP_ENTRY') {
            res.status(400).send({
                message: "You have entered a duplicate name!"
            })
        } else {
            const response = eh.errorsHandler(error)
            res.status(response.statusCode).send(response.body)
        }
    }
}


function selectNameAndRecipeId(params) {
    return `SELECT id, name 
            FROM recipes;`
}

function insertRecipe(name, type) {
    return `INSERT INTO recipes (name, type)
            VALUES('${name}','${type}');`
}

function selectRecipeIdByName(name) {
    return `SELECT id as recipeId
            FROM recipes
            WHERE name='${name}';`
}