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

module.exports = {
    selectRecipeIdByName,
    selectRecipeIdByName,
    insertRecipe
}