function selectNameAndRecipeId(params) {
    return `SELECT id, name 
            FROM recipes;`
}

function insertRecipe(recipeName, method, recipeTime, portions, recipeCategory, utensils) {
    return `INSERT INTO recipes (name, method, time, person_num, type, image, utensils)
            VALUES("${recipeName}", "${method}", "${recipeTime}", "${portions}", "${recipeCategory}", ?, "${utensils}");`
}

function insertIngredients(insertId) {
    return `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id) VALUES ("${insertId}", ?, ?, ?);`

}

function selectRecipeIdByName(recipeName) {
    return `SELECT id as recipeId
            FROM recipes
            WHERE name='${recipeName}';`
}

module.exports = {
    selectNameAndRecipeId,
    selectRecipeIdByName,
    insertRecipe,
    insertIngredients
}